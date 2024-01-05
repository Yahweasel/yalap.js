/****************
 * THIS FILE IS AUTOMATICALLY GENERATED
 * DO NOT MODIFY THIS FILE BY HAND
 ***************/
Module.version_number = Module.cwrap("archive_version_number", "number", []);
Module.version_string = Module.cwrap("archive_version_string", "string", []);
Module.error_string = Module.cwrap("archive_error_string", "string", ["number"]);
Module.entry_new = Module.cwrap("archive_entry_new", "number", []);
Module.entry_clear = Module.cwrap("archive_entry_clear", "number", ["number"]);
Module.entry_clone = Module.cwrap("archive_entry_clone", "number", ["number"]);
Module.entry_free = Module.cwrap("archive_entry_free", null, ["number"]);
Module.malloc = Module.cwrap("malloc", "number", ["number"]);
Module.free = Module.cwrap("free", null, ["number"]);
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
Module.entry_default_stat = Module.cwrap("yalap_entry_default_stat", null, ["number"]);
Module.entry_set_size64 = Module.cwrap("yalap_entry_set_size64", null, ["number", "number", "number"]);
Module.entry_set_size = function(arc, size) { Module.entry_set_size64(arc, ~~size, Math.floor(size / 0x100000000)); };
Module.entry_unset_size = Module.cwrap("archive_entry_unset_size", null, ["number"]);
Module.entry_set_filetype = Module.cwrap("archive_entry_set_filetype", null, ["number", "number"]);
Module.entry_set_perm = Module.cwrap("archive_entry_set_perm", null, ["number", "number"]);
Module.entry_set_mode = Module.cwrap("archive_entry_set_mode", null, ["number", "number"]);
Module.write_header = Module.cwrap("archive_write_header", "number", ["number", "number"]);
Module.write_data_int = Module.cwrap("archive_write_data", "number", ["number", "number", "number"]);

Module.write_data = function(arc, data, size) {
    if (typeof data === "number" &&
        typeof size === "number") {
        return Module.write_data_int(arc, data, size);

    } else if (data && (data.buffer || data instanceof ArrayBuffer)) {
        if (data.buffer)
            data = new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
        else
            data = new Uint8Array(data);
        var ptr = Module.malloc(data.length);
        if (!ptr)
            return -30;
        Module.HEAPU8.set(data, ptr);
        var ret = Module.write_data_int(arc, ptr, data.length);
        Module.free(ptr);
        return ret;

    } else {
        throw new TypeError("Invalid write_data call");

    }
};

Module.write_close = Module.cwrap("archive_write_close", "number", ["number"]);
Module.write_free = Module.cwrap("archive_write_free", "number", ["number"]);
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

Module.read_new = Module.cwrap("archive_read_new", "number", []);
Module.read_set_filter_option = Module.cwrap("archive_read_set_filter_option", "number", ["number", "string", "string", "string"]);
Module.read_set_format_option = Module.cwrap("archive_read_set_format_option", "number", ["number", "string", "string", "string"]);
Module.read_set_option = Module.cwrap("archive_read_set_option", "number", ["number", "string", "string", "string"]);
Module.read_open_js = Module.cwrap("yalap_read_open_js", "number", ["number", "string"], {async: true});
Module.entry_pathname = Module.cwrap("archive_entry_pathname", "string", ["number"]);
Module.entry_size = Module.cwrap("yalap_entry_size", "number", ["number"]);
Module.entry_size_is_set = Module.cwrap("archive_entry_size_is_set", "boolean", ["number"]);
Module.entry_filetype = Module.cwrap("archive_entry_filetype", "number", ["number"]);
Module.entry_perm = Module.cwrap("archive_entry_perm", "number", ["number"]);
Module.entry_mode = Module.cwrap("archive_entry_mode", "number", ["number"]);
Module.read_next_header2 = Module.cwrap("archive_read_next_header2", "number", ["number", "number"], {async: true});
Module.read_data_block_int = Module.cwrap("archive_read_data_block", "number", ["number", "number", "number", "number"], {async: true});

Module.read_data_block = function(arc, buff, len, offset) {
    if (typeof buff === "number" &&
        typeof len === "number" &&
        typeof offset === "number") {
        return Module.read_data_block_int(arc, buff, len, offset);

    } else if (typeof buff === "undefined") {
        var tmp = Module.malloc(16);
        if (!tmp)
            return -30;
        return Module.read_data_block_int(arc, tmp, tmp + 4, tmp + 8).then(function(ret) {
            if (ret !== 0) {
                Module.free(tmp);
                return ret;
            }
            var tmpb = new Uint32Array(Module.HEAPU8.buffer, tmp);
            buff = tmpb[0];
            len = tmpb[1];
            ret = {
                buf: Module.HEAPU8.slice(buff, buff + len),
                offset: tmpb[2] + tmpb[3] * 0x100000000
            };
            Module.free(tmp);
            return ret;
        });

    } else {
        throw new TypeError("Invalid read_data call");

    }
};

Module.read_close = Module.cwrap("archive_read_close", "number", ["number"], {async: true});
Module.read_free = Module.cwrap("archive_read_free", "number", ["number"], {async: true});
Module.write_set_format_7zip = Module.cwrap("archive_write_set_format_7zip", "number", ["number"]);
Module.read_support_format_7zip = Module.cwrap("archive_read_support_format_7zip", "number", ["number"]);
