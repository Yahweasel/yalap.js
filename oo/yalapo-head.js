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

var YALAP;
if (typeof YALAP === "undefined") (function() {
    if (typeof module !== "undefined" && typeof require === "function") {
        module.exports = YALAP = require("./yalap-@VER-@VAR.js");
    } else {
        var src = (typeof document !== "undefined" && document.currentScript)
            ? document.currentScript.src
            : (typeof __filename !== "undefined")
            ? __filename : ".";
        if (src.indexOf("/") >= 0)
            src = src.replace(/\/[^\/]*/, "");
        else
            src = ".";
        if (typeof importScripts === "function")
            importScripts(src + "/yalap-@VER-@VAR.js");
        else if (typeof document !== "undefined")
            document.write("<script type='text/javascript' src='" + src + "/yalap-@VER-@VAR.js");
    }
})();
