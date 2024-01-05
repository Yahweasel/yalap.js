const YALAP = require("../dist/yalap-0.0.1-all.js");

async function main() {
    const la = await YALAP.YALAP();
    const ent = await la.entry_new();
    let arcData;

    {
        const arc = await la.write_new();
        await la.write_set_format_zip(arc);
        await la.write_set_bytes_in_last_block(arc, 2);

        la.onWrite = function(file, data) {
            arcData = data.slice(0);
        };

        await la.write_open_js(arc, "out");
        await la.entry_default_stat(ent);
        await la.entry_update_pathname_utf8(ent, "hello.txt");
        await la.write_header(arc, ent);
        let data = (new TextEncoder()).encode("Hello, world!");
        await la.write_data(arc, data);
        await la.write_free(arc);
    }

    {
        const arc = await la.read_new();
        await la.read_support_format_zip(arc);

        la.onRead = function(file, pos) {
            let ret = arcData;
            arcData = null;
            return ret;
        };

        await la.read_open_js(arc, "in");
        await la.read_next_header2(arc, ent);
        await la.entry_pathname(ent);
        console.log(await la.read_data_block(arc));
        await la.read_free(arc);
    }

    await la.entry_free(ent);
}
main();
