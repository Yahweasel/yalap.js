const YALAP = require("../dist/yalapo-0.0.1-all.js");

async function main() {
    const la = await YALAP.YALAP();
    const ent = await la.entry_new();
    let arcData;

    {
        const wr = await YALAP.YALAPW({format: "zip"});
        await wr.addFile("hello.txt");
        await wr.write((new TextEncoder()).encode("Hello, world!\r\n"));
        await wr.free();

        const rdr = wr.stream.getReader();
        while (true) {
            const v = await rdr.read();
            if (v.done)
                break;
            arcData = v.value;
        }
    }

    {
        const stream = new ReadableStream({
            pull(controller) {
                if (arcData) {
                    controller.enqueue(arcData);
                    arcData = null;
                } else {
                    controller.close();
                }
            }
        });
        const rd = await YALAP.YALAPR(stream);
        let file;
        while (file = await rd.nextFile()) {
            console.log(file);
            const rdr = file.stream.getReader();
            while (true) {
                const r = await rdr.read();
                if (r.done)
                    break;
                console.log(r.value);
            }
        }
        await rd.free();
    }

    await la.entry_free(ent);
}
main();
