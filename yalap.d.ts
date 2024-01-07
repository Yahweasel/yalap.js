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

declare let YALAP: YALAP.YALAPWrapper;
export = YALAP;

declare namespace YALAP {
    /**
     * The main wrapper of yalap.js, capable of creating low-level or high-level
     * access modules.
     */
    export interface YALAPWrapper {
        /**
         * Create a low-level yalap.js instance.
         * @param opts  Options.
         */
        YALAP(opts?: YALAPOpts): Promise<YALAP>;

        /**
         * Create a high-level/object-oriented yalap.js writer instance.
         * @param opts  Options.
         */
        YALAPW(opts?: YALAPWOpts): Promise<YALAPW>;

        /**
         * Create a high-level/object-oriented yalap.js reader instance.
         * @param opts  Options.
         */
        YALAPR(
            stream: ReadableStream<Uint8Array>, opts?: YALAPROpts
        ): Promise<YALAPR>;
    }

    /**
     * Options for the low-level yalap.js interface.
     */
    export interface YALAPOpts {
        /**
         * Do not create a web worker, even if supported.
         */
        noworker?: boolean;
    }

    /**
     * Options for the high-level yalap.js writer interface.
     */
    export interface YALAPWOpts extends YALAPOpts {
        /**
         * Format to write. Defaults to "zip".
         */
        format?: string;

        /**
         * Filter to use, or null for none. Defaults to none.
         */
        filter?: string | null;

        /**
         * Options passed to archive_write_set_options.
         */
        options?: string;

        /**
         * Number of bytes per block sent to the output stream. Set to 0 to not
         * buffer. Default set by libarchive.
         */
        bytesPerBlock?: number;

        /**
         * Alignment of bytes in the *last* block, i.e., to what multiple to pad
         * the last block. Defaults to 1, i.e., don't pad. Set to 0 to pad to
         * bytesPerBlock.
         */
        bytesInLastBlock?: number;
    }

    /**
     * Options for the high-level yalap.js reader interface.
     */
    export interface YALAPROpts extends YALAPOpts {
        /**
         * Formats to support. Defaults to all supported by the loaded library.
         */
        formats?: string[];

        /**
         * Filters to support. Defaults to all supported by the loaded library.
         */
        filters?: string[];

        /**
         * Options passed to archive_read_set_options.
         */
        options?: string;
    }

    /**
     * The high-level writer interface of yalap.js.
     */
    export interface YALAPW {
        /**
         * The stream being written.
         */
        readonly stream: ReadableStream<Uint8Array>

        /**
         * Begin the next file in this archive. Writes from this point until the
         * next addFile* will write to the described file. You're recommended to
         * use one of the other addFiles instead, which take both the properties
         * and the data at once.
         * @param pathname  Filename to write.
         * @param props  Any other metadata. If unspecified, all properties will
         *               be default. Each property here calls an `entry_set_*`
         *               function (or `entry_update_*_utf8` function), and every
         *               such function corresponds to a supported property.
         *               Provide times as floating-point seconds.
         */
        addFileHeader(
            pathname: string, props?: Record<string, any>
        ): Promise<void>;

        /**
         * Add this file, described by a stream.
         * @param pathname  Filename to write.
         * @param data  Data to write, as a ReadableStream.
         * @param props  Other metadata.
         */
        addFile(
            pathname: string, data: ReadableStream<Uint8Array>,
            props?: Record<string, any>
        ): Promise<void>;

        /**
         * Add this file, described by the entire content of the file in a
         * buffer.
         * @param pathname  Filename to write.
         * @param data  Data to write.
         * @param props  Other metadata.
         */
        addFileData(
            pathname: string, data: Uint8Array | ArrayBuffer | string,
            props?: Record<string, any>
        ): Promise<void>;

        /**
         * Write this data to the current file.
         * @param data  Data to write.
         */
        write(data: Uint8Array): Promise<void>;

        /**
         * Finish writing and terminate the module. This MUST be called when
         * finished to finalize the file.
         */
        free(): Promise<void>;
    }

    /**
     * The high-level reader interface of yalap.js.
     */
    export interface YALAPR {
        /**
         * Begin reading the next file in the archive. Returns null if no more
         * files remain.
         */
        nextFile(): Promise<YALAPReadableFile | null>;

        /**
         * Finish reading and terminate the module. This MUST be called when
         * finished to clean up.
         */
        free(): Promise<void>;
    }

    /**
     * A file being read from a YALAPR instance.
     */
    interface YALAPReadableFile {
        /**
         * The full pathname of this file.
         */
        pathname: string;

        /**
         * Any other metadata associated with this file. Includes unset
         * properties, in the form of an `x_is_set: falsey` property and the
         * unset property, so make sure to check for weirdness.
         */
        props: Record<string, any>;

        /**
         * The stream of extracted file data.
         */
        stream: ReadableStream<Uint8Array>;
    }

    /**
     * The low-level yalap.js interface. Documentaion is in libarchive. Not all
     * builds of yalap.js support all functions.
     */
    export interface YALAP {
        /**
         * Terminate this instance (use when you're finished with it, will close
         * the worker if used).
         */
        terminate(): void;

        /**
         * The mode that this YALAP instantiated in.
         */
        readonly mode: "direct" | "worker";

        /**
         * Callback used when a writer is opened.
         */
        onWriteOpen?: (name: string) => void;

        /**
         * Callback used when data is written.
         */
        onWrite?: (name: string, data: Uint8Array) => void;

        /**
         * Callback used when a writer is closed.
         */
        onWriteClose?: (name: string) => void;

        /**
         * Callback used when a reader is opened.
         */
        onReadOpen?: (name: string) => void;

        /**
         * Callback used when data is read from a reader.
         */
        onRead?: (name: string, pos: number) => void;

        /**
         * Callback used when a reader is closed.
         */
        onReadClose?: (name: string) => void;

        version_number(): Promise<number>;
        version_string(): Promise<string>;
        error_string(number): Promise<string>;
        entry_new(): Promise<number>;
        entry_clear(number): Promise<number>;
        entry_clone(number): Promise<number>;
        entry_free(number): Promise<void>;
        malloc(number): Promise<number>;
        free(number): Promise<null>;

        write_add_filter_by_name(arc: number, name: string): Promise<number>;
        write_add_filter_bzip2(arc: number): Promise<number>;
        write_add_filter_gzip(arc: number): Promise<number>;
        write_add_filter_xz(arc: number): Promise<number>;
        write_set_format_7zip(arc: number): Promise<number>;
        write_set_format_by_name(arc: number, name: string): Promise<number>;
        write_set_format_gnutar(arc: number): Promise<number>;
        write_set_format_ustar(arc: number): Promise<number>;
        write_set_format_v7tar(arc: number): Promise<number>;
        write_set_format_zip(arc: number): Promise<number>;

        write_new(): Promise<number>;
        write_get_bytes_per_block(arc: number): Promise<number>;
        write_set_bytes_per_block(arc: number, to: number): Promise<number>;
        write_get_bytes_in_last_block(arc: number): Promise<number>;
        write_set_bytes_in_last_block(arc: number, to: number): Promise<number>;
        write_set_filter_option(arc: number, module: string, option: string, value: string): Promise<number>;
        write_set_format_option(arc: number, module: string, option: string, value: string): Promise<number>;
        write_set_option(arc: number, module: string, option: string, value: string): Promise<number>;
        write_set_options(arc: number, options: string): Promise<number>;
        write_open_js(arc: number, name: string): Promise<number>;

        entry_update_pathname_utf8(ent: number, pathname: string): Promise<number>;
        entry_default_stat(ent: number): Promise<void>;
        entry_set_size64(ent: number, lo: number, hi: number): Promise<void>;
        entry_set_size(ent: number, size: number): Promise<void>;
        entry_unset_size(ent: number): Promise<void>;
        entry_set_filetype(ent: number, to: number): Promise<void>;
        entry_set_perm(ent: number, to: number): Promise<void>;
        entry_set_mode(ent: number, to: number): Promise<void>;
        entry_set_mtime(ent: number, sec: number, nsec: number): Promise<void>;
        entry_unset_mtime(ent: number): Promise<void>;

        write_header(arc: number, ent: number): Promise<number>;
        write_data(arc: number, data: number, size: number): Promise<number>;
        write_data(arc: number, data: Uint8Array): Promise<number>;
        write_close(arc: number): Promise<number>;
        write_free(arc: number): Promise<number>;

        entry_update_hardlink_utf8(ent: number, to: string): Promise<number>;
        entry_update_link_utf8(ent: number, to: string): Promise<number>;
        entry_update_symlink_utf8(ent: number, to: string): Promise<number>;
        entry_set_gid(ent: number, to: number): Promise<void>;
        entry_set_uid(ent: number, to: number): Promise<void>;
        entry_update_gname_utf8(ent: number, to: string): Promise<number>;
        entry_update_uname_utf8(ent: number, to: string): Promise<number>;
        entry_set_dev(ent: number, to: number): Promise<void>;
        entry_set_devmajor(ent: number, to: number): Promise<void>;
        entry_set_devminor(ent: number, to: number): Promise<void>;
        entry_set_ino(ent: number, to: number): Promise<void>;
        entry_set_ino64(ent: number, to: number): Promise<void>;
        entry_set_nlink(ent: number, to: number): Promise<void>;
        entry_set_rdev(ent: number, to: number): Promise<void>;
        entry_set_rdevmajor(ent: number, to: number): Promise<void>;
        entry_set_rdevminor(ent: number, to: number): Promise<void>;
        entry_set_atime(ent: number, sec: number, nsec: number): Promise<void>;
        entry_unset_atime(number): Promise<void>;
        entry_set_birthtime(ent: number, sec: number, nsec: number): Promise<void>;
        entry_unset_birthtime(number): Promise<void>;
        entry_set_ctime(ent: number, sec: number, nsec: number): Promise<void>;
        entry_unset_ctime(ent: number): Promise<void>;

        read_support_filter_all(arc: number): Promise<number>;
        read_support_filter_bzip2(arc: number): Promise<number>;
        read_support_filter_gzip(arc: number): Promise<number>;
        read_support_filter_xz(arc: number): Promise<number>;
        read_support_format_7zip(arc: number): Promise<number>;
        read_support_format_all(arc: number): Promise<number>;
        read_support_format_tar(arc: number): Promise<number>;
        read_support_format_zip(arc: number): Promise<number>;
        read_support_format_zip_streamable(arc: number): Promise<number>;

        read_new(): Promise<number>;
        read_set_filter_option(arc: number, module: string, option: string, value: string): Promise<number>;
        read_set_format_option(arc: number, module: string, option: string, value: string): Promise<number>;
        read_set_option(arc: number, module: string, option: string, value: string): Promise<number>;
        read_set_options(arc: number, options: string): Promise<number>;
        read_open_js(arc: number, name: string): Promise<number>;

        entry_pathname(ent: number): Promise<string>;
        entry_size(ent: number): Promise<number>;
        entry_size_is_set(ent: number): Promise<boolean>;
        entry_filetype(ent: number): Promise<number>;
        entry_perm(ent: number): Promise<number>;
        entry_mode(ent: number): Promise<number>;
        entry_mtime(ent: number): Promise<number>;
        entry_mtime_nsec(ent: number): Promise<number>;
        entry_mtime_is_set(ent: number): Promise<boolean>;

        read_next_header2(arc: number, ent: number): Promise<number>;
        read_data_block(arc: number, buff: number, len: number, offset: number): Promise<number>;
        read_data_block(arc: number): Promise<YALAPBlock>;
        read_close(arc: number): Promise<number>;
        read_free(arc: number): Promise<number>;

        entry_hardlink(ent: number): Promise<string>;
        entry_sourcepath(ent: number): Promise<string>;
        entry_symlink(ent: number): Promise<string>;
        entry_gid(ent: number): Promise<number>;
        entry_uid(ent: number): Promise<number>;
        entry_strmode(ent: number): Promise<string>;
        entry_gname(ent: number): Promise<string>;
        entry_uname(ent: number): Promise<string>;
        entry_dev(ent: number): Promise<number>;
        entry_devmajor(ent: number): Promise<number>;
        entry_devminor(ent: number): Promise<number>;
        entry_ino(ent: number): Promise<number>;
        entry_ino_is_set(ent: number): Promise<boolean>;
        entry_ino64(ent: number): Promise<number>;
        entry_nlink(ent: number): Promise<number>;
        entry_rdev(ent: number): Promise<number>;
        entry_rdevmajor(ent: number): Promise<number>;
        entry_rdevminor(ent: number): Promise<number>;
        entry_atime(ent: number): Promise<number>;
        entry_atime_nsec(ent: number): Promise<number>;
        entry_atime_is_set(ent: number): Promise<boolean>;
        entry_birthtime(ent: number): Promise<number>;
        entry_birthtime_nsec(ent: number): Promise<number>;
        entry_birthtime_is_set(ent: number): Promise<boolean>;
        entry_ctime(ent: number): Promise<number>;
        entry_ctime_nsec(ent: number): Promise<number>;
        entry_ctime_is_set(ent: number): Promise<boolean>;
    }

    /**
     * The block information returned by read_data_block.
     */
    export interface YALAPBlock {
        /**
         * The buffer of data that was extracted.
         */
        buf: Uint8Array;

        /**
         * Its offset within the represented file.
         */
        offset: number;
    }
}
