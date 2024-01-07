`YALAP.YALAP` is an asynchronous factory function which creates yalap.js
instances. Instances expose the libarchive API directly, at a low level, but
without the `archive_` prefix. `YALAP.YALAP` takes an (optional) options object,
of the form:

```js
{
    noworker /* : boolean */
}
```

If `noworker` is set to `true`, yalap.js will load synchronously, and not use a
worker. This is most likely useful if you're already in a worker.

The following is the beginning of an example of using yalap.js:

```js
const la = await YALAP.YALAP({noworker: false} /* this is optional */);
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
    fileData[file].push(data);
};

await la.write_open_js(arc, "out.zip");
...
```

The buffer passed to `onWrite` is owned by you, i.e., it will not alias internal
memory.

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
Like with `onWrite`, the buffer is now owned by you, and will not alias
anything. Note that if `read_data_block` fails, the return will be a number (the
error code, as in the native interface), *not* this object.

Because `YALAP.YALAP()` may return an object backed by a worker thread, when you
are done with it, you must call `terminate`. `terminate` does nothing when not
backed by a worker thread, and terminates the worker thread when one is in use.

```js
la.terminate();
```
