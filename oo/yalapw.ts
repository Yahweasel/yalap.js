/*
 * Copyright (C) 2024 Yahweasel
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY
 * SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION
 * OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN
 * CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 */

declare let YALAP: any;

(function() {
    class YALAPW {
        constructor(module: any, arc: number, ent: number) {
            this._module = module;
            this._arc = arc;
            this._ent = ent;

            // Set up a readable stream for the data
            var bufs: (Uint8Array | null)[] = [];
            var streamRes: (val:unknown)=>unknown | null = null;
            this.stream = new ReadableStream({
                async pull(controller) {
                    if (!bufs.length) {
                        // Wait for a buffer
                        await new Promise(res => streamRes = res);
                    }

                    const buf = bufs.shift();
                    if (buf)
                        controller.enqueue(buf);
                    else
                        controller.close();
                }
            });

            module.onWrite = (ign: any, data: Uint8Array | null) => {
                bufs.push(data);
                let res = streamRes;
                if (res) {
                    streamRes = null;
                    res(null);
                }
            };
        }

        async addFileHeader(
            pathname: string, props?: Record<string, any>
        ): Promise<void> {
            const module = this._module, arc = this._arc, ent = this._ent;
            props = props || Object.create(null);

            // Start with the defaults
            await module.entry_clear(ent);
            await module.entry_default_stat(ent);

            // Set each property
            await module.entry_update_pathname_utf8(ent, pathname);
            for (let key in props) {
                let setter: any, val = props[key];
                if (/time$/.test(key)) {
                    await module["entry_set_" + key](
                        ent, Math.floor(val), Math.floor((val%1) * 1000000000)
                    );
                } else {
                    setter = module["entry_set_" + key];
                    if (!setter)
                        setter = module["entry_update_" + key + "_utf8"];
                    await setter.call(module, ent, val);
                }
            }

            // Now start the actual file write
            if (await module.write_header(arc, ent) < 0)
                await YALAP._error(module, arc);
        }

        async addFile(
            pathname: string, data: ReadableStream<Uint8Array>,
            props?: Record<string, any>
        ) {
            await this.addFileHeader(pathname, props);
            const rdr = data.getReader();
            while (true) {
                const rd = await rdr.read();
                if (rd.done)
                    break;
                await this.write(rd.value);
            }
        }

        async addFileData(
            pathname: string, data: Uint8Array | ArrayBuffer | string,
            props?: Record<string, any>
        ) {
            await this.addFileHeader(pathname, props);
            if ((<any> data).buffer) {
                const d = <Uint8Array> data;
                await this.write(new Uint8Array(
                    d.buffer, d.byteOffset, d.byteLength
                ));
            } else if (data instanceof ArrayBuffer) {
                await this.write(new Uint8Array(data));
            } else {
                await this.write((new TextEncoder()).encode("" + data));
            }
        }

        async write(data: Uint8Array): Promise<void> {
            const module = this._module, arc = this._arc;
            if (await module.write_data(arc, data) < 0)
                await YALAP._error(module, arc);
        }

        async free(): Promise<void> {
            const module = this._module, arc = this._arc, ent = this._ent;
            if (await module.write_free(arc) < 0)
                return YALAP._error(module, arc);
            module.onWrite("w", null);
            await module.entry_free(ent);
            module.terminate();
        }

        stream: ReadableStream<Uint8Array>;

        private _module: any;
        private _arc: number;
        private _ent: number;
    }

    YALAP.YALAPW = async function(opts: any) {
        let format: string = (opts && opts.format) ? opts.format : "zip";
        let filter: string | null = (opts && opts.filter) ? opts.filter : null;

        // Create the module
        const module = await YALAP.YALAP(opts);

        // Create the archiver
        const arc: number = await module.write_new();

        // Set its format
        {
            const setter = "write_set_format_" + format;
            let sret: number;
            if (module[setter])
                sret = await module[setter](arc);
            else
                sret = await module.write_set_format_by_name(arc, format);
            if (sret < 0)
                await YALAP._error(module, arc);
        }

        // And filter, if applicable
        if (filter) {
            const setter = "write_set_filter_" + format;
            let sret: number;
            if (module[setter])
                sret = await module[setter](arc);
            else
                sret = await module.write_set_filter_by_name(arc, filter);
            if (sret < 0)
                await YALAP._error(module, arc);
        }

        // Defaults
        if (typeof opts.bytesPerBlock === "number")
            await module.write_set_bytes_per_block(arc, opts.bytesPerBlock);

        let bilb = 1;
        if (typeof opts.bytesInLastBlock === "number")
            bilb = opts.bytesInLastBlock;
        await module.write_set_bytes_in_last_block(arc, bilb);

        // Open it
        await module.write_open_js(arc, "w");

        // Create an entry
        const ent: number = await module.entry_new();

        // Create the actual class
        return new YALAPW(module, arc, ent);
    };
})();
