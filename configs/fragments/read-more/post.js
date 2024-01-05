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
