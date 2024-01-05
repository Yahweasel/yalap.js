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

YALAP.scriptName = (typeof document !== "undefined" && document.currentScript)
    ? document.currentScript.src
    : (typeof __filename !== "undefined")
    ? __filename
    : void 0;

Object.assign(YALAP, {
    ARCHIVE_EOF: 1,
    ARCHIVE_OK: 0,
    ARCHIVE_RETRY: -10,
    ARCHIVE_WARN: -20,
    ARCHIVE_FAILED: -25,
    ARCHIVE_FATAL: -30,
    AE_IFREG: 0x8000,
    AE_IFLNK: 0xA000,
    AE_IFSOCK: 0xC000,
    AE_IFCHR: 0x2000,
    AE_IFBLK: 0x6000,
    AE_IFDIR: 0x4000,
    AE_IFIFO: 0x1000
});

YALAP.YALAP = function(opts) {
    var useWorker =
        typeof Worker !== "undefined" &&
        typeof YALAP.scriptName !== "undefined" &&
        (!opts || !opts.noworker);

    if (useWorker && false) {
        // ...

    } else {
        var ret = {mode: "direct"};
        return Promise.all([]).then(function() {
            return YALAP();
        }).then(function(module) {
            ret.module = module;

            var funcs = YALAP.funcs;
            for (var fi = 0; fi < funcs.length; fi++) (function(func) {
                ret[func] = function() {
                    var args = arguments;
                    return Promise.all([]).then(function() {
                        return module[func].apply(module, args);
                    });
                };
            })(funcs[fi]);

            funcs = YALAP.callbacks;
            for (var fi = 0; fi < funcs.length; fi++) (function(func) {
                module[func] = function() {
                    if (ret[func])
                        return ret[func].apply(ret, arguments);
                };
            })(funcs[fi]);

            return ret;
        });

    }
};
