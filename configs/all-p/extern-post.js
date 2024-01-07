/****************
 * THIS FILE IS AUTOMATICALLY GENERATED
 * DO NOT MODIFY THIS FILE BY HAND
 ***************/
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

YALAP._funcs = [
    "version_number",
    "version_string",
    "error_string",
    "entry_new",
    "entry_clear",
    "entry_clone",
    "entry_free",
    "malloc",
    "free"
];
YALAP._callbacks = [];
YALAP._funcs.push("write_new", "write_get_bytes_per_block", "write_set_bytes_per_block", "write_get_bytes_in_last_block", "write_set_bytes_in_last_block", "write_set_filter_option", "write_set_format_option", "write_set_option", "write_set_options", "write_open_js", "entry_update_pathname_utf8", "entry_default_stat", "entry_set_size64", "entry_set_size", "entry_unset_size", "entry_set_filetype", "entry_set_perm", "entry_set_mode", "write_header", "write_data", "write_close", "write_free", "entry_set_mtime", "entry_unset_mtime");
YALAP._callbacks.push("onWriteOpen", "onWrite", "onWriteClose");
YALAP._funcs.push("write_set_format_zip");
YALAP._funcs.push("write_set_format_7zip");
YALAP._funcs.push("write_set_format_gnutar", "write_set_format_pax", "write_set_format_pax_restricted", "write_set_format_ustar", "write_set_format_v7tar");
YALAP._funcs.push("write_add_filter_gzip");
YALAP._funcs.push("write_add_filter_bzip2");
YALAP._funcs.push("write_add_filter_xz");
YALAP._funcs.push("write_set_format_by_name");
YALAP._funcs.push("write_add_filter_by_name");
YALAP._funcs.push("read_new", "read_set_filter_option", "read_set_format_option", "read_set_option", "read_set_options", "read_open_js", "entry_pathname", "entry_size", "entry_size_is_set", "entry_filetype", "entry_perm", "entry_mode", "read_next_header2", "read_data_block", "read_close", "read_free", "entry_mtime", "entry_mtime_nsec", "entry_mtime_is_set");
YALAP._callbacks.push("onReadOpen", "onRead", "onReadClose");
YALAP._funcs.push("read_support_format_zip");
YALAP._funcs.push("read_support_format_zip_streamable");
YALAP._funcs.push("read_support_format_7zip");
YALAP._funcs.push("read_support_format_tar");
YALAP._funcs.push("read_support_filter_gzip");
YALAP._funcs.push("read_support_filter_bzip2");
YALAP._funcs.push("read_support_filter_xz");
YALAP._funcs.push("read_support_format_all");
YALAP._funcs.push("read_support_filter_all");
YALAP._funcs.push("entry_update_hardlink_utf8", "entry_update_link_utf8", "entry_update_symlink_utf8", "entry_set_gid", "entry_set_uid", "entry_update_gname_utf8", "entry_update_uname_utf8", "entry_set_dev", "entry_set_devmajor", "entry_set_devminor", "entry_set_ino", "entry_set_ino64", "entry_set_nlink", "entry_set_rdev", "entry_set_rdevmajor", "entry_set_rdevminor", "entry_set_atime", "entry_unset_atime", "entry_set_birthtime", "entry_unset_birthtime", "entry_set_ctime", "entry_unset_ctime");
YALAP._funcs.push("entry_hardlink", "entry_sourcepath", "entry_symlink", "entry_gid", "entry_uid", "entry_strmode", "entry_gname", "entry_uname", "entry_dev", "entry_devmajor", "entry_devminor", "entry_ino", "entry_ino_is_set", "entry_ino64", "entry_nlink", "entry_rdev", "entry_rdevmajor", "entry_rdevminor", "entry_atime", "entry_atime_nsec", "entry_atime_is_set", "entry_birthtime", "entry_birthtime_nsec", "entry_birthtime_is_set", "entry_ctime", "entry_ctime_nsec", "entry_ctime_is_set");
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

YALAP._scriptName = (typeof document !== "undefined" && document.currentScript)
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
        typeof YALAP._scriptName !== "undefined" &&
        (!opts || !opts.noworker);

    if (useWorker) {
        var ret = {mode: "worker", _idx: 0, _rets: {}};
        var worker = ret.worker = new Worker(YALAP._scriptName);
        var workerRes, workerRej;
        var workerP = new Promise(function(res, rej) {
            workerRes = res;
            workerRej = rej;
        });
        ret.terminate = worker.terminate.bind(worker);

        worker.onmessage = function(ev) {
            var msg = ev.data;
            if (!msg || !msg.c)
                return;
            switch (msg.c) {
                case "yalapReady":
                    if (msg.x)
                        workerRej(msg.x);
                    else
                        workerRes();
                    break;

                case "ret":
                case "retx":
                {
                    var handler = ret._rets[msg.i];
                    delete ret._rets[msg.i];
                    if (handler) {
                        if (msg.c === "ret")
                            handler.res(msg.v);
                        else
                            handler.rej(msg.v);
                    }
                    break;
                }

                case "cb":
                {
                    var cb = ret[msg.f];
                    var cbr = void 0;
                    if (cb)
                        cbr = cb.apply(ret, msg.a);
                    Promise.all([]).then(function() {
                        return cbr;
                    }).then(function(cbr) {
                        worker.postMessage({
                            c: "cbr",
                            i: msg.i,
                            v: cbr
                        });
                    }).catch(function(cbr) {
                        worker.postMessage({
                            c: "cbrx",
                            i: msg.i,
                            v: cbr
                        });
                    });
                    break;
                }
            }
        };

        return Promise.all([]).then(function() {
            var funcs = YALAP._funcs;

            for (var fi = 0; fi < funcs.length; fi++) (function(func) {
                ret[func] = function() {
                    var i = ret._idx++;
                    var p = new Promise(function(res, rej) {
                        ret._rets[i] = {res: res, rej: rej};
                    });
                    worker.postMessage({
                        c: "call",
                        i: i,
                        f: func,
                        a: Array.from(arguments)
                    });
                    return p;
                };
            })(funcs[fi]);

            // Start the actual yalap.js worker
            worker.postMessage({
                c: "yalap"
            });

            return workerP;

        }).then(function() {
            return ret;

        });

    } else {
        var ret = {mode: "direct", terminate: function() {}};
        return Promise.all([]).then(function() {
            return YALAP();
        }).then(function(module) {
            ret.module = module;

            var funcs = YALAP._funcs;
            for (var fi = 0; fi < funcs.length; fi++) (function(func) {
                ret[func] = function() {
                    var args = arguments;
                    return Promise.all([]).then(function() {
                        return module[func].apply(module, args);
                    });
                };
            })(funcs[fi]);

            funcs = YALAP._callbacks;
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

if (typeof importScripts !== "undefined") (function() {
    // We're a worker. Prepare for the possibility of starting a module
    Promise.all([]).then(function() {
        var pres, prej;
        var p = new Promise(function(res, rej) {
            pres = res;
            prej = rej;
        });

        function onmessage(ev) {
            var msg = ev.data;
            if (msg && msg.c === "yalap") {
                removeEventListener("message", onmessage);
                YALAP().then(pres).catch(prej);
            }
        }
        addEventListener("message", onmessage);

        return p;

    }).then(function(module) {
        // Module loaded, prepare for commands
        var idx = 0;
        var rets = {};

        // Prepare our callbacks
        var funcs = YALAP._callbacks;
        for (var fi = 0; fi < funcs.length; fi++) (function(func) {
            module[func] = function() {
                var i = idx++;
                var p = new Promise(function(res, rej) {
                    rets[i] = {res: res, rej: rej};
                });
                postMessage({
                    c: "cb",
                    i: i,
                    f: func,
                    a: Array.from(arguments)
                });
                return p;
            };
        })(funcs[fi]);

        // And prepare for messages
        function onmessage(ev) {
            var msg = ev.data;
            if (!msg || !msg.c) return;
            switch (msg.c) {
                case "call":
                Promise.all([]).then(function() {
                    // Call the requested function
                    return module[msg.f].apply(module, msg.a);
                }).then(function(ret) {
                    postMessage({
                        c: "ret",
                        i: msg.i,
                        v: ret
                    });
                }).catch(function(ex) {
                    postMessage({
                        c: "retx",
                        i: msg.i,
                        v: ex
                    });
                });
                break;

                case "cbr":
                case "cbrx":
                {
                    var handler = rets[msg.i];
                    delete rets[msg.i];
                    if (handler) {
                        if (msg.c === "cbr")
                            handler.res(msg.v);
                        else
                            handler.rej(msg.v);
                    }
                    break;
                }
            }
        }
        addEventListener("message", onmessage);

        // Tell the host we're ready
        postMessage({
            c: "yalapReady"
        });

    }).catch(function(ex) {
        postMessage({
            c: "yalapReady",
            x: ex
        });

    });;
})();
