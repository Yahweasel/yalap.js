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

const configs = [
    ["zip", ["write", "zip", "zlib"]],
    ["unzip", ["read", "unzip", "zlib", "libbz2", "liblzma"]],
    ["arcex-zip", [
        "write", "read", "zip", "unzip", "zlib", "libbz2", "liblzma"
    ]],

    ["7zip", ["write", "7zip", "zlib", "libbz2", "liblzma"]],
    ["un7zip", ["read", "un7zip", "zlib", "libbz2", "liblzma"]],
    ["arcex-7zip", [
        "write", "read", "7zip", "un7zip", "zlib", "libbz2", "liblzma"
    ]],

    ["tar", [
        "write", "tar", "gzip", "zlib", "bzip2", "libbz2", "xz", "liblzma"
    ]],
    ["untar", [
        "read", "untar", "gunzip", "zlib", "bunzip2", "libbz2", "unxz",
        "liblzma"
    ]],
    ["arcex-tar", [
        "write", "read", "tar", "untar", "gzip", "gunzip", "zlib", "bzip2",
        "bunzip2", "libbz2", "xz", "unxz", "liblzma"
    ]],

    ["archive", [
        "write", "arc-all", "comp-all",
        "zip", "7zip", "tar",
        "gzip", "bzip2", "xz",
        "zlib", "libbz2", "liblzma"
    ]],
    ["extract", [
        "read", "ext-all", "dec-all",
        "unzip", "un7zip", "untar",
        "gunzip", "bunzip2", "unxz",
        "zlib", "libbz2", "liblzma"
    ]],
    ["all", [
        "write", "arc-all", "comp-all",
        "read", "ext-all", "dec-all",
        "zip", "7zip", "tar",
        "unzip", "un7zip", "untar",
        "gzip", "bzip2", "xz",
        "gunzip", "bunzip2", "unxz",
        "zlib", "libbz2", "liblzma"
    ]]
];

async function main() {
    for (let [name, config] of configs) {
        const p = cproc.spawn("./mkconfig.js", [name, JSON.stringify(config)], {
            stdio: "inherit"
        });
        await new Promise(res => p.on("close", res));
    }
}
main();
