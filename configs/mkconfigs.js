#!/usr/bin/env node
/*
 * Copyright (C) 2021-2024 Yahweasel and contributors
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

const cproc = require("child_process");
const fs = require("fs");

let formats = [
    {
        include: true,
        arc: ["zip", ["zip", "zlib"]],
        ext: ["unzip", ["unzip", "zlib", "libbz2", "liblzma"]]
    },

    {
        include: true,
        arc: ["7zip", ["7zip", "zlib", "libbz2", "liblzma"]],
        ext: ["un7zip", ["un7zip", "zlib", "libbz2", "liblzma"]]
    },

    {
        include: true,
        arc: ["tar", [
            "tar", "gzip", "bzip2", "xz", "zlib", "libbz2", "liblzma"
        ]],
        ext: ["untar", [
            "untar", "gunzip", "bunzip2", "unxz", "zlib", "libbz2", "liblzma"
        ]]
    },

    {
        arc: ["archive", ["arc-all", "comp-all"]],
        ext: ["extract", ["ext-all", "dec-all"]]
    }
];

function add(cur, curMap, toAdd) {
    for (const fragment of toAdd) {
        if (!curMap[fragment]) {
            cur.push(fragment);
            curMap[fragment] = true;
        }
    }
}

async function mkconfig(name, config) {
    const p = cproc.spawn("./mkconfig.js", [name, JSON.stringify(config)], {
        stdio: "inherit"
    });
    await new Promise(res => p.on("close", res));
}

async function main() {
    // Single-format configs
    for (const format of formats) {
        if (!format.include)
            continue;
        let cur = [];
        let curMap = {};
        add(cur, curMap, ["write"]);
        add(cur, curMap, format.arc[1]);
        await mkconfig(format.arc[0], cur);
        await mkconfig(format.arc[0] + "-p", cur.concat(["write-more"]));
        add(cur, curMap, ["read"]);
        add(cur, curMap, format.ext[1]);
        await mkconfig("arcex-" + format.arc[0], cur);
        await mkconfig(
            "arcex-" + format.arc[0] + "-p",
            cur.concat(["write-more", "read-more"])
        );
        cur = [];
        curMap = {};
        add(cur, curMap, ["read"]);
        add(cur, curMap, format.ext[1]);
        await mkconfig(format.ext[0], cur);
        await mkconfig(format.ext[0] + "-p", cur.concat(["read-more"]));
    }

    // All-format configs
    {
        let cur = [];
        let curMap = {};
        add(cur, curMap, ["write"]);
        for (const format of formats)
            add(cur, curMap, format.arc[1]);
        await mkconfig("archive", cur);
        await mkconfig("archive-p", cur.concat(["write-more"]));
        add(cur, curMap, ["read"]);
        for (const format of formats)
            add(cur, curMap, format.ext[1]);
        await mkconfig("all", cur);
        await mkconfig("all-p", cur.concat(["write-more", "read-more"]));
        cur = [];
        curMap = {};
        add(cur, curMap, ["read"]);
        for (const format of formats)
            add(cur, curMap, format.ext[1]);
        await mkconfig("extract", cur);
        await mkconfig("extract-p", cur.concat(["read-more"]));
    }
}
main();
