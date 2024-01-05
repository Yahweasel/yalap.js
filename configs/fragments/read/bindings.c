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

EM_JS(int, yalap_read_open_cb, (struct archive *ignore, void *name), {
    name = UTF8ToString(name);
    return Asyncify.handleAsync(function() {
        return Promise.all([]).then(function() {
            if (!Module.readers)
                Module.readers = {};
            var rdr = Module.readers[name] = {
                buf: 0, sz: 10240,
                bufs: [],
                pos: 0
            };
            rdr.buf = Module.malloc(rdr.sz);
            if (!rdr.buf)
                return -30;
            if (Module.onReadOpen)
                return Module.onReadOpen(name);
        });
    });
});

EM_JS(la_ssize_t, yalap_read_read_cb, (
    struct archive *ignore, void *name, const void **buffer
), {
    name = UTF8ToString(name);
    var rdr = Module.readers[name];
    return Asyncify.handleAsync(function() {
        return Promise.all([]).then(function() {
            if (!rdr.bufs.length) {
                // Get a new buffer
                return Module.onRead(name, rdr.pos);
            } else {
                return null;
            }

        }).then(function(buf) {
            if (buf) {
                rdr.bufs.push(buf);
                rdr.pos += buf.length;
            }
            if (!rdr.bufs.length) {
                // No more buffers
                return 0;
            }

            var ret = 0;
            var f = rdr.bufs[0];
            if (f.length > rdr.sz) {
                // Read part of the buffer
                Module.HEAPU8.set(f.subarray(0, rdr.sz), rdr.buf);
                rdr.bufs[0] = f.subarray(rdr.sz);
                ret = rdr.sz;
            } else {
                // Read the whole buffer
                Module.HEAPU8.set(f, rdr.buf);
                rdr.bufs.shift();
                ret = f.length;
            }

            buffer = new Uint32Array(Module.HEAPU8.buffer, buffer);
            buffer[0] = rdr.buf;
            return ret;
        });
    });
});

EM_JS(int, yalap_read_close_cb, (struct archive *ignore, void *name), {
    name = UTF8ToString(name);
    Module.free(Module.readers[name].buf);
    delete Module.readers[name];
    if (Module.onReadClose)
        Module.onReadClose(name);
    return 0;
});

int yalap_read_open_js(struct archive *arc, const char *name) {
    char *clientName = strdup(name);
    if (!clientName)
        return -errno;
    return archive_read_open(
        arc, (void *) clientName,
        yalap_read_open_cb, yalap_read_read_cb, yalap_read_close_cb
    );
}

double yalap_entry_size(struct archive_entry *ent) {
    return (double) archive_entry_size(ent);
}
