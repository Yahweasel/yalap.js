# Configuration

yalap.js uses a system of “configuration fragments” which direct configuration,
making sure that only the requested parts are included in any build.

`configs/mkconfigs.js` makes all the built-in configurations, and
`configs/mkconfig.js` makes a single configuration.

The existing variants (configurations) support three common archival formats:
zip, 7zip, and (compressed) tar. Each is split into three configurations: one
for writing only, one for reading only, and one for both.

Specifically, the variants are:

 * zip, unzip, arcex-zip for writing, reading, or writing and reading ZIP
   files.

 * 7zip, un7zip, arcex-7zip for writing, reading, or writing and reading 7zip
   files.

 * tar, untar, arcex-tar for writing, reading, or writing and reading tar files,
   compressed optionally with xz, bzip2, or gzip.

 * archive, extract, all for writing, reading, or writing and reading all
   formats supported by libarchive (not just the above three!)

Each of these variants also has a `-p` sub-variant (e.g., `zip-p`), which adds
extra entry properties (in particular, the Unix-y ones) at a modest cost to
build size. The `-p` versions are not built by default and not included in
distributions; if you need these extra properties, you'll have to build it
yourself.

(NOTE: “arcex” means archiver-extractor, by the same convention as “modem” or
“codec”)


## Making a custom variant

If all you want is to make a configuration that fits your needs, in the `config`
directory, run a command like `./mkconfig.js plain-tar '["write", "read", "tar",
"untar"]'`. The first argument is the name of the variant you're creating, and
the second argument is a JSON array with the configuration fragments to include.
The order of the fragments in the array is essentially irrelevant (it will
affect the order that things are built in, and the order that some code appears
in the generated JavaScript files, but nothing else).

Most configuration fragments have yalap.js-specific names. They're organized
like so:

 * To include writing or reading functionality, you must include `"write"` or
   `"read"` respectively. These link in functions such as `archive_write_open2`.

 * Each format has a fragment named, e.g., `zip` for archiving (writing) that
   format, and named, e.g., `unzip` for extracting (reading) that format.

 * Each filter has a fragment named, e.g., `gzip` for write-time filtering, and
   named, e.g., `gunzip` for read-time filtering. Typically these names come
   from the equivalent standard program names.

 * Each library has a fragment with the library's name. These are `zlib`,
   `libbz2`, and `liblzma`. Note that formats and filters may depend on
   libraries, but you must list the library explicitly; there is no dependency
   system in `mkconfig.js`. So, for instance, `zip` requires `zlib`, so to
   support the `zip` fragment, you must also include the `zlib` fragment.


## Implementation details and adding your own fragments

Each configuration has the following files:

 * `bindings.c`: C bindings that are needed, typically because of semantic
   mismatches between JavaScript and C.

 * `eflags.txt`: Emscripten (emcc) flags. Only used for reading to support
   asyncify.

 * `exports.txt`: List of exported functions.

 * `extern-post.js`: Passed to emcc's `--extern-post-js`.

 * `libs.txt`: List of libraries to link against.

 * `license.js`: License text applying to this configuration.

 * `post.js`: Passed to emcc's `--post-js`.

Configuration fragments contain the same files, and they are concatenated
together to create the configurations. The build uses these files, and expects
to find them in `config/<variant>` when you run `make build-<variant>`.

Configuration fragments are in `config/fragments`. Generally speaking, to create
a new fragment, you will need `exports.txt` to list the functions needed,
`extern-post.js` to add them to the `YALAP` object, and `post.js` to bind them
with Emscripten's `cwrap`. Look at existing fragments to see how this is done.

You can find which fragments are used for all the standard configurations in the
header of `configs/mkconfigs.js`.
