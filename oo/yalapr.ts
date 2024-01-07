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
    interface ReadableFile {
        pathname: string;
        props: Record<string, any>;
        stream: ReadableStream<Uint8Array>;
    }

    class YALAPR {
        constructor(module: any, arc: number, ent: number) {
            this.yalap = module;
            this.arc = arc;
            this.ent = ent;
        }

        async nextFile(): Promise<ReadableFile | null> {
            const module = this.yalap, arc = this.arc, ent = this.ent;

            await this._flush();

            // Read the next header
            const hret = await module.read_next_header2(arc, ent);
            if (hret < 0)
                await YALAP._error(module, arc);
            else if (hret > 0)
                return null;

            const file: ReadableFile = {
                pathname: "",
                props: Object.create(null),
                stream: <any> null
            };

            // Get all of the properties
            for (let key in module) {
                if (!/^entry_/.test(key) || /^entry_set_/.test(key) ||
                    /^entry_update_/.test(key) || /^entry_unset_/.test(key))
                    continue;
                if (key === "entry_new" || key === "entry_clear" ||
                    key === "entry_clone" || key === "entry_free" ||
                    key === "entry_default_stat")
                    continue;
                file.props[key.slice(6)] = await module[key](ent);
            }
            file.pathname = file.props.pathname;

            // Create a stream for the data
            let offset = 0;
            this._stream = file.stream = new ReadableStream({
                async pull(controller) {
                    const block = await module.read_data_block(arc);
                    if (typeof block === "number") {
                        controller.close();
                    } else {
                        if (block.offset !== offset) {
                            controller.enqueue(
                                new Uint8Array(block.offset - offset)
                            );
                            offset = block.offset;
                        }
                        controller.enqueue(block.buf);
                        offset += block.buf.length;
                    }
                }
            });

            return file;
        }

        async free(): Promise<void> {
            const module = this.yalap, arc = this.arc, ent = this.ent;
            await this._flush();
            if (await module.read_free(arc) < 0)
                await YALAP._error(module, arc);
            await module.entry_free(ent);
            module.terminate();
        }

        async _flush(): Promise<void> {
            if (this._stream && !this._stream.locked) {
                const rdr = this._stream.getReader();
                this._stream = null;
                while (!(await rdr.read()).done) {}
            }
        }

        yalap: any;
        arc: number;
        ent: number;
        private _stream: ReadableStream<Uint8Array> | null = null;
    }

    YALAP.YALAPR = async function(
        stream: ReadableStream<Uint8Array>, opts: any
    ) {
        let filters: string[] | null =
            (opts && opts.filters) ? opts.filters : null;
        let formats: string[] | null =
            (opts && opts.formats) ? opts.formats : null;

        // Create the module
        const module = await YALAP.YALAP(opts);

        // Set up the reader
        const rdr = stream.getReader();
        module.onRead = async () => {
            const ret = await rdr.read();
            if (ret.done)
                return null;
            else
                return ret.value;
        };

        // Create the extractor
        const arc: number = await module.read_new();

        // Maybe support all filters
        if (!filters) {
            if (module.read_support_filter_all) {
                filters = ["all"];
            } else {
                filters = [];
                for (const key in module) {
                    if (/^read_support_filter_/.test(key))
                        filters.push(key.slice(20));
                }
            }
        }

        // Support the filters
        for (const filter of filters)
            await module["read_support_filter_" + filter](arc);

        // Maybe support all formats
        if (!formats) {
            if (module.read_support_format_all) {
                formats = ["all"];
            } else {
                formats = [];
                for (const key in module) {
                    if (/^read_support_format_/.test(key))
                        formats.push(key.slice(20));
                }
            }
        }

        // Support the formats
        for (const format of formats)
            await module["read_support_format_" + format](arc);

        // Options
        if (opts && opts.options) {
            if (await module.read_set_options(arc, opts.options) < 0)
                await YALAP._error(module, arc);
        }

        // Attempt to open the file
        if (await module.read_open_js(arc, "r") < 0)
            await YALAP._error(module, arc);

        // Create an entry
        const ent = await module.entry_new();

        // Create the actual class
        return new YALAPR(module, arc, ent);
    }
})();
