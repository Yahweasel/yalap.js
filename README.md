# Yet Another LibArchive Port to JS

Really? Another? Why???

To be a bit mean about it, the libarchive ports I could find were all terrible
for what I needed libarchive for. Don't get me wrong, I'm not suggesting that
the people who made these ports did a bad job; they just had specific goals, and
made ports that worked for those specific goals, and those goals weren't my
goals.

The goals of yalap.js are:

 * Streaming-only API. Reading and writing are implemented by block-at-a-time
   callbacks.

 * Worker transparency, i.e., the API is the same whether you're using worker
   threads or not. This is achieved by having an asynchronous API, used in
   either case.

 * Small size. This is achieved through configurability. You can use
   `yalap-<version>-all.js` for the most complete set of features, at the cost
   of considerable heft, or you can use, e.g., `yalap-<version>-zip.js` if all
   you need to do is write ZIP files.

 * A ruthless commitment to correct licensing. All versions properly credit all
   authors and include all license text as required by said license text. The
   small amount of binding code in yalap.js itself is released under the
   so-called “0-clause BSD” license, and does not require attribution.


## Using yalap.js

If you'd like to build yalap.js by hand, make sure you have Emscripten installed
and in your PATH, and `make`. The compiled yalap.js variants are placed in the
`dist/` directory.

Provide `yalap-<version>-<variant>.js`, `yalap-<version>-<variant>.wasm`, and
`yalap-<version>-<variant>.wasm.js`. `<version>` is, of course, the current
version number; to decide what variant you need, you will need to consult the
next section of this README.

Include `yalap-<version>-<variant>.js` as a script, an `import`, or a Node
`require`. It defines a global variable named `YALAP` (or, if imported, named
whatever you want; `YALAP` is the export).

`YALAP.YALAP` is an asynchronous factory function which creates yalap.js
instances. Instances expose the libarchive API directly, at a low level, but
without the `archive_` prefix. For instance:

```js
const la = await YALAP.YALAP();
const arc = await la.write_new();
await la.write_set_format_zip(arc);
await la.write_set_bytes_in_last_block(arc, 1);
...
```

Writing and reading files is always streamed, and data is sent to callback
functions placed on the yalap.js instance. Open a stream using
`la.write_open_js` or `la.read_open_js`, which connect the archive instances to
these streams, with filenames provided by you. For instance, to continue the
above example:

```js
...
la.onWrite = (file /* : string */, data /* : Uint8Array */) => {
    fileData[file] = fileData[file] || [];
    fileData[file].push(data.slice(0));
};

await la.write_open_js(arc, "out.zip");
...
```

Note that the buffer passed to `onWrite` *may* alias the internal memory of
libarchive (indeed, it will if you're not using workers), so you should
duplicate it (with e.g. `.slice(0)`) if you intend to keep it past the `onWrite`
call itself. `onWrite` is not called asynchronously, so if it's implemented as
an async function, you will need to duplicate the buffer before awaiting
anything.

`onWriteOpen` and `onWriteClose` callbacks may also be provided, and take only
the filename argument.

Because you're unlikely to have “real” files to stat, a convenience function is
provided to default the entry's stats for normal files. Continuing the above
example:

```js
const ent = await la.entry_new();
await la.entry_default_stat(ent);
await la.entry_update_pathname_utf8(ent, "hello.txt");
await la.write_header(arc, ent);
...
```

The writing and reading functions in libarchive are designed to use internal
(`malloc`'d) memory. They may be called with pointers, but a frontend is also
provided for each that uses `Uint8Array`s (or any other ArrayBuffer view).

```js
await la.write_data(arc, (new TextEncoder()).encode("Hello, world!\r\n"));
await la.write_free(arc);
await la.entry_free(ent);
```

The callback for reading is `onRead`. `onRead` is passed the filename and
position for reading; in practice, libarchive is a streaming system, so the
position will always increment as expected. `onRead` should return
(asynchronously) either a `Uint8Array` (which strictly must be a `Uint8Array`,
not any other ArrayBuffer view), or `null` to indicate end of file. `onReadOpen`
and `onReadClose` are also available.

Like `write_data`, `read_data_block` may be called using pointers, or may be
used with ArrayBuffer views by calling it with only the `struct archive *`
argument, in which case it will return an object of the form
```js
{
    buf /* : Uint8Array */,
    offset /* : number */
}
```
Like with `onWrite`, the buffer may be aliased into libarchive memory, and so
should be duplicated if you need to keep it. Note that if `read_data_block`
fails, the return will be a number (the error code, as in the native interface),
*not* this object.
