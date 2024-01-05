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
                buf: Module.HEAPU8.subarray(buff, buff + len),
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
Module.read_support_format_zip = Module.cwrap("archive_read_support_format_zip", "number", ["number"]);
Module.read_support_format_zip_streamable = Module.cwrap("archive_read_support_format_zip_streamable", "number", ["number"]);
Module.read_support_format_7zip = Module.cwrap("archive_read_support_format_7zip", "number", ["number"]);
Module.read_support_format_tar = Module.cwrap("archive_read_support_format_tar", "number", ["number"]);
Module.read_support_filter_gzip = Module.cwrap("archive_read_support_filter_gzip", "number", ["number"]);
Module.read_support_filter_bzip2 = Module.cwrap("archive_read_support_filter_bzip2", "number", ["number"]);
Module.read_support_filter_xz = Module.cwrap("archive_read_support_filter_xz", "number", ["number"]);
Module.read_support_format_all = Module.cwrap("archive_read_support_format_all", "number", ["number"]);
Module.read_support_filter_all = Module.cwrap("archive_read_support_filter_all", "number", ["number"]);
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

Module.entry_hardlink = Module.cwrap("archive_entry_hardlink", "string", ["number"]);
Module.entry_sourcepath = Module.cwrap("archive_entry_sourcepath", "string", ["number"]);
Module.entry_symlink = Module.cwrap("archive_entry_symlink", "string", ["number"]);
Module.entry_gid = Module.cwrap("archive_entry_gid", "number", ["number"]);
Module.entry_uid = Module.cwrap("archive_entry_uid", "number", ["number"]);
Module.entry_strmode = Module.cwrap("archive_entry_strmode", "string", ["number"]);
Module.entry_gname = Module.cwrap("archive_entry_gname", "string", ["number"]);
Module.entry_uname = Module.cwrap("archive_entry_uname", "string", ["number"]);
Module.entry_dev = Module.cwrap("archive_entry_dev", "number", ["number"]);
Module.entry_devmajor = Module.cwrap("archive_entry_devmajor", "number", ["number"]);
Module.entry_devminor = Module.cwrap("archive_entry_devminor", "number", ["number"]);
Module.entry_ino = Module.cwrap("archive_entry_ino", "number", ["number"]);
Module.entry_ino_is_set = Module.cwrap("archive_entry_ino_is_set", "boolean", ["number"]);
Module.entry_ino64 = Module.cwrap("yalap_entry_ino64", "number", ["number"]);
Module.entry_nlink = Module.cwrap("archive_entry_nlink", "number", ["number"]);
Module.entry_rdev = Module.cwrap("archive_entry_rdev", "number", ["number"]);
Module.entry_rdevmajor = Module.cwrap("archive_entry_rdevmajor", "number", ["number"]);
Module.entry_rdevminor = Module.cwrap("archive_entry_rdevminor", "number", ["number"]);
Module.entry_atime = Module.cwrap("yalap_entry_atime", "number", ["number"]);
Module.entry_atime_nsec = Module.cwrap("archive_entry_atime_nsec", "number", ["number"]);
Module.entry_atime_is_set = Module.cwrap("archive_entry_atime_is_set", "boolean", ["number"]);
Module.entry_birthtime = Module.cwrap("yalap_entry_birthtime", "number", ["number"]);
Module.entry_birthtime_nsec = Module.cwrap("archive_entry_birthtime_nsec", "number", ["number"]);
Module.entry_birthtime_is_set = Module.cwrap("archive_entry_birthtime_is_set", "boolean", ["number"]);
Module.entry_ctime = Module.cwrap("yalap_entry_ctime", "number", ["number"]);
Module.entry_ctime_nsec = Module.cwrap("archive_entry_ctime_nsec", "number", ["number"]);
Module.entry_ctime_is_set = Module.cwrap("archive_entry_ctime_is_set", "boolean", ["number"]);
