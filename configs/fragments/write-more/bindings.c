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

void yalap_entry_set_ino64(struct archive_entry *ent, double ino) {
    archive_entry_set_ino64(ent, (int64_t) ino);
}

void yalap_entry_set_atime(
    struct archive_entry *ent, double sec, long nanosec
) {
    archive_entry_set_atime(ent, (time_t) sec, nanosec);
}

void yalap_entry_set_birthtime(
    struct archive_entry *ent, double sec, long nanosec
) {
    archive_entry_set_birthtime(ent, (time_t) sec, nanosec);
}

void yalap_entry_set_ctime(
    struct archive_entry *ent, double sec, long nanosec
) {
    archive_entry_set_ctime(ent, (time_t) sec, nanosec);
}

void yalap_entry_set_mtime(
    struct archive_entry *ent, double sec, long nanosec
) {
    archive_entry_set_mtime(ent, (time_t) sec, nanosec);
}
