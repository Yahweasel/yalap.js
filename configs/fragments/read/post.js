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
Module.entry_mtime = Module.cwrap("yalap_entry_mtime", "number", ["number"]);
Module.entry_mtime_nsec = Module.cwrap("archive_entry_mtime_nsec", "number", ["number"]);
Module.entry_mtime_is_set = Module.cwrap("archive_entry_mtime_is_set", "boolean", ["number"]);
