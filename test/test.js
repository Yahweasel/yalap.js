const YALAP = require("../dist/yalap-0.0.1-tar.js");

async function main() {
    const la = await YALAP.YALAP();
    const arc = await la.write_new();
    await la.write_set_format_gnutar(arc);
    await la.write_add_filter_xz(arc);
    await la.write_set_bytes_in_last_block(arc, 1);

    la.module.onWrite = function(file, data) {
        console.log(file, data);
    };

    await la.write_open_js(arc, "out");
    const ent = await la.entry_new();
    await la.entry_update_pathname_utf8(ent, "hello.txt");
    await la.entry_set_filetype(ent, YALAP.AE_IFREG);
    await la.write_header(arc, ent);
    await la.write_data(arc, (new TextEncoder()).encode("Hello, world!"));
    await la.write_free(arc);
    await la.entry_free(ent);
}
main();
