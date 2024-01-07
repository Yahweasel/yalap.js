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


## Variants

yalap.js is organized and distributed in “variants” with particular features.
The variants that come with yalap.js are designed for particular archive
formats:

 * `zip`, `unzip`, `arcex-zip` are capable of creating, extracting, and both for
   ZIP files, respectively.

 * `7zip`, `un7zip`, `arcex-7zip` are for 7-Zip.

 * `tar`, `untar`, `arcex-tar` are for tar/pax, with gzip, bzip2, xz, or no
   compression.

 * `archive`, `extract`, `all` are for creating, extracting, and both for *all*
   archival formats supported by libarchive (except probably xar, since that
   requires an additional library that is not built by yalap.js).

Note that there are some implications of specific formats beyond just the
format. In particular, 7-Zip will use a lot of memory, because it compresses to
a temporary file, and Emscripten's temporary files are in memory. I created this
library because I needed streamed ZIP files, so that's the most tested.

Each variant also has a `-p` subvariant (e.g., `zip-p`), which adds support for
more file properties. The normal variant (without `-p`) supports the most
“usual” properties: pathname, size, filetype, permissions, and mtime. The `-p`
variants are not built by default, and not included in normal distributions of
yalap.js.

### Which files do I need?

Each variant has three files: `yalap-<version>-<variant>.js`,
`yalap-<version>-<variant>.wasm`, and `yalap-<version>-<variant>.wasm.js`.
Generally speaking, you should distribute all three files for whichever variant
you need. The `.wasm.js` file is asm.js, for browser that don't support
WebAssembly, so is almost certainly optional nowadays, but it is harmless, as it
won't be downloaded if not used.


## Using yalap.js

Include `yalap-<version>-<variant>.js` as a script, an `import`, or a Node
`require`. It defines a global variable named `YALAP` (or, if imported, named
whatever you want; `YALAP` is the export).

See [API.md](docs/API.md) for the high-level API, or [LLAPI.md](docs/LLAPI.md)
for the low-level API.


## Building yalap.js

The main reason to build your own version of yalap.js is for archival formats
other than those for which yalap.js is natively built. Alternatively, you may
want to build one of the `-p` subvariants.

If you want to create your own variant configuration, see
[configs/README.md](configs/README.md).

To build a variant, make sure you have Emscripten installed and in your PATH,
and `make build-<variant>`, e.g., `make build-zip-p` to build the `zip-p`
variant. The compiled files are placed in the `dist/` directory.


