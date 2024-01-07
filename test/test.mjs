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

import * as fs from "fs/promises";

import YALAP from "../dist/yalap-0.0.1-all.js";

const w = await YALAP.YALAPW({format: "zip"});
(async function() {
    // Find all files
    const allFiles = [];
    async function addDir(dir) {
        for (let file of await fs.readdir(dir)) {
            file = `${dir}/${file}`;
            const sbuf = await fs.stat(file);
            if (sbuf.isDirectory())
                addDir(file);
            else if (sbuf.isFile())
                allFiles.push(file);
        }
    }
    await addDir(".");

    // Feed them into the writer
    for (const file of allFiles) {
        await w.addFile(file.slice(2));
        await w.write(await fs.readFile(file));
    }

    await w.free();
})();

const r = await YALAP.YALAPR(w.stream);
(async function() {
    let file;
    while (file = await r.nextFile()) {
        const bufs = [];
        const rdr = file.stream.getReader();
        while (true) {
            const rd = await rdr.read();
            if (rd.done)
                break;
            bufs.push(rd.value);
        }
        const uzbuf = Buffer.concat(bufs);
        const obuf = await fs.readFile(file.pathname);
        if (uzbuf.compare(obuf) !== 0)
            throw new Error("Uncompressed data not identical");
    }

    await r.free();
})();
