/****************
 * THIS FILE IS AUTOMATICALLY GENERATED
 * DO NOT MODIFY THIS FILE BY HAND
 ***************/
#include <emscripten.h>
#include <errno.h>
#include <fcntl.h>
#include <stdlib.h>
#include <string.h>
#include <sys/stat.h>

#include <archive.h>
#include <archive_entry.h>
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

EM_JS(int, yalap_write_open_cb, (struct archive *ignore, void *name), {
    name = UTF8ToString(name);
    if (Module.onWriteOpen)
        Module.onWriteOpen(name);
    return 0;
});

EM_JS(la_ssize_t, yalap_write_write_cb, (
    struct archive *ignore, void *name, const void *buffer, size_t length
), {
    name = UTF8ToString(name);
    if (Module.onWrite)
        Module.onWrite(name, Module.HEAPU8.slice(buffer, buffer + length));
    return length;
});

EM_JS(int, yalap_write_close_cb, (struct archive *ignore, void *name), {
    name = UTF8ToString(name);
    if (Module.onWriteClose)
        Module.onWriteClose(name);
    return 0;
});

int yalap_write_free_cb(struct archive *ignore, void *name) {
    free(name);
    return 0;
}

int yalap_write_open_js(struct archive *arc, const char *name) {
    char *clientName = strdup(name);
    if (!clientName)
        return -30;
    return archive_write_open2(
        arc, (void *) clientName,
        yalap_write_open_cb, yalap_write_write_cb, yalap_write_close_cb,
        yalap_write_free_cb
    );
}

void yalap_entry_default_stat(struct archive_entry *ent) {
    struct stat sbuf;
    creat("default", 0644);
    stat("default", &sbuf);
    archive_entry_copy_stat(ent, &sbuf);
    archive_entry_unset_size(ent);
}

void yalap_entry_set_size64(
    struct archive_entry *ent, unsigned int lo, unsigned int hi
) {
    archive_entry_set_size(ent,
        (((int64_t) hi) << 32) | ((int64_t) lo));
}

void yalap_entry_set_mtime(
    struct archive_entry *ent, double sec, long nanosec
) {
    archive_entry_set_mtime(ent, (time_t) sec, nanosec);
}
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
