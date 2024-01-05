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

Module.write_new = Module.cwrap("archive_write_new", "number", []);
Module.write_get_bytes_per_block = Module.cwrap("archive_write_get_bytes_per_block", "number", ["number"]);
Module.write_set_bytes_per_block = Module.cwrap("archive_write_set_bytes_per_block", "number", ["number", "number"]);
Module.write_get_bytes_in_last_block = Module.cwrap("archive_write_get_bytes_in_last_block", "number", ["number"]);
Module.write_set_bytes_in_last_block = Module.cwrap("archive_write_set_bytes_in_last_block", "number", ["number", "number"]);
Module.write_set_filter_option = Module.cwrap("archive_write_set_filter_option", "number", ["number", "string", "string", "string"]);
Module.write_set_format_option = Module.cwrap("archive_write_set_format_option", "number", ["number", "string", "string", "string"]);
Module.write_set_option = Module.cwrap("archive_write_set_option", "number", ["number", "string", "string", "string"]);
Module.write_open_js = Module.cwrap("yalap_write_open_js", "number", ["number", "string"]);
Module.entry_update_pathname_utf8 = Module.cwrap("archive_entry_update_pathname_utf8", "number", ["number", "string"]);
Module.entry_set_size64 = Module.cwrap("yalap_entry_set_size64", null, ["number", "number", "number"]);
Module.entry_set_size = function(arc, size) { Module.entry_set_size64(arc, ~~size, Math.floor(size / 0x100000000)); };
Module.entry_unset_size = Module.cwrap("archive_entry_unset_size", null, ["number"]);
Module.entry_set_filetype = Module.cwrap("archive_entry_set_filetype", null, ["number", "number"]);
Module.entry_set_mode = Module.cwrap("archive_entry_set_mode", null, ["number", "number"]);
Module.write_header = Module.cwrap("archive_write_header", "number", ["number", "number"]);
Module.write_data_int = Module.cwrap("archive_write_data", "number", ["number", "number", "number"]);

Module.write_data = function(arc, data, size) {
    if (typeof data === "number" &&
        typeof size === "number") {
        return Module.write_data_int(arc, data, size);

    } else if (data.buffer || data instanceof ArrayBuffer) {
        if (data.buffer)
            data = data.buffer;
        data = new Uint8Array(data);
        var ptr = Module.malloc(data.length);
        if (!ptr)
            return -1;
        Module.HEAPU8.set(data, ptr);
        var ret = Module.write_data_int(arc, ptr, data.length);
        Module.free(ptr);

    } else {
        throw new TypeError("Invalid write_data call");

    }
};

Module.write_close = Module.cwrap("archive_write_close", "number", ["number"]);
Module.write_free = Module.cwrap("archive_write_free", "number", ["number"]);
