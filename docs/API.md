# High-Level API

`YALAP` exposes two object-oriented APIs: one for writing archives, and one for
reading archives. Both use `ReadableStream`s extensively.


## Writing API

`YALAP.YALAPW` is an asynchronous factory function which creates yalap.js writer
objects, each of which corresponds to a single archive file. For example:

```js
const wr = await YALAP.YALAPW({format: "zip"});
```

`YALAPW` takes an optional options object, but you will almost certainly want to
provide this object to at least specify the format, as done above. You can also
specify `filter` to specify a filter (e.g., `"gzip"`). Several other options are
documented in the types file.

The data output by the writer object is available in a `ReadableStream` of
`Uint8Array`s, `wr.stream`:

```js
const bufs = [];
const rdr = wr.stream.getReader();
(async function() {
    while (true) {
        const rd = await rdr.read();
        if (rd.done)
            break;
        bufs.push(rd.value);
    }
})();
```

`YALAPW` objects expose several APIs for adding files, but this document will
only focus on one of them. See the types file for the rest.

To add files, use `addFile`. `addFile` takes the pathname to add, a
`ReadableStream` of `Uint8Array`s for the file data, and, optionally, other file
properties, which will all be defaulted otherwise:

```js
const myFileData = (await fetch("myfile")).body;
await wr.addFile("myfile", myFileData, {mtime: 12345} /* optional */);
```

When finished writing, use `free` to finalize and free all resources:

```js
await wr.free();
```


## Reading API

`YALAP.YALAPR` is an asynchronous factory function which creates yalap.js reader
objects, each of which corresponds to a single archive file. For example:

```js
const yrdr = await YALAP.YALAPR((await fetch("myfile.zip")).body);
```

`YALAPR` takes an optional options object, but you will almost certainly not
need it. If not provided, all archival formats supported by the loaded yalap.js
variant will be supported.

To read the next file from an archive, use `nextFile`. It (asynchronously)
returns either a `YALAPReadableFile`, which provides a streaming interface for
the file's data, or `null`, to indicate that there are no more files:

A `YALAPReadableFile` is essentially the reverse of the arguments to `YALAPW`'s
`addFile`: it has a `pathname` property, a `stream` property for the file's data
as a `ReadableStream` of `Uint8Array`s, and a `props` property for all other
file properties.

```js
while (true) {
    const file = await yrdr.nextFile();
    if (!file) break;
    console.log(`Extracting ${file.pathname}`);
    const rdr = file.stream.getReader();
    while (true) {
        const rd = await rdr.read();
        if (rd.done) break;
        // Do something with rd.value
    }
}
```

You need to be a bit careful with the `YALAPReadableFile`'s `stream`. If you
don't intend to use this file's data, then it's safe to ignore it entirely. But,
if you lock the stream (e.g., by getting its reader), you *must* either read the
stream to completion or unlock it before calling `nextFile` again (or `free`).

When finished reading, use `free` to free all resources:

```js
await yrdr.free();
```
