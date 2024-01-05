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

Module.entry_update_hardlink_utf8 = Module.cwrap("entry_update_hardlink_utf8", "number", ["number", "string"]);
Module.entry_update_link_utf8 = Module.cwrap("entry_update_link_utf8", "number", ["number", "string"]);
Module.entry_update_symlink_utf8 = Module.cwrap("entry_update_symlink_utf8", "number", ["number", "string"]);
Module.entry_set_gid = Module.cwrap("archive_entry_set_gid", null, ["number", "number"]);
Module.entry_set_uid = Module.cwrap("archive_entry_set_uid", null, ["number", "number"]);
Module.entry_update_gname_utf8 = Module.cwrap("archive_entry_update_gname_utf8", "number", ["number", "string"]);
Module.entry_update_uname_utf8 = Module.cwrap("archive_entry_update_uname_utf8", "number", ["number", "string"]);
Module.entry_set_dev = Module.cwrap("archive_entry_set_dev", null, ["number", "number"]);
Module.entry_set_devmajor = Module.cwrap("archive_entry_set_devmajor", null, ["number", "number"]);
Module.entry_set_devminor = Module.cwrap("archive_entry_set_devminor", null, ["number", "number"]);
Module.entry_set_ino = Module.cwrap("archive_entry_set_ino", null, ["number", "number"]);
Module.entry_set_ino64 = Module.cwrap("yalap_entry_set_ino64", null, ["number", "number"]);
Module.entry_set_nlink = Module.cwrap("archive_entry_set_nlink", null, ["number", "number"]);
Module.entry_set_rdev = Module.cwrap("archive_entry_set_rdev", null, ["number", "number"]);
Module.entry_set_rdevmajor = Module.cwrap("archive_entry_set_rdevmajor", null, ["number", "number"]);
Module.entry_set_rdevminor = Module.cwrap("archive_entry_set_rdevminor", null, ["number", "number"]);
Module.entry_set_atime = Module.cwrap("yalap_entry_set_atime", null, ["number", "number", "number"]);
Module.entry_unset_atime = Module.cwrap("archive_entry_unset_atime", null, ["number"]);
Module.entry_set_birthtime = Module.cwrap("yalap_entry_set_birthtime", null, ["number", "number", "number"]);
Module.entry_unset_birthtime = Module.cwrap("archive_entry_unset_birthtime", null, ["number"]);
Module.entry_set_ctime = Module.cwrap("yalap_entry_set_ctime", null, ["number", "number", "number"]);
Module.entry_unset_ctime = Module.cwrap("archive_entry_unset_ctime", null, ["number"]);
Module.entry_set_mtime = Module.cwrap("yalap_entry_set_mtime", null, ["number", "number", "number"]);
Module.entry_unset_mtime = Module.cwrap("archive_entry_unset_mtime", null, ["number"]);
