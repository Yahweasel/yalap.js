LIBARCHIVE_VERSION=3.7.2

build/inst/lib/pkgconfig/libarchive.pc: \
	build/libarchive-$(LIBARCHIVE_VERSION)/wasm/config.h
	cd build/libarchive-$(LIBARCHIVE_VERSION)/wasm && $(MAKE) install

build/libarchive-$(LIBARCHIVE_VERSION)/wasm/config.h: \
	build/libarchive-$(LIBARCHIVE_VERSION)/configure \
	build/inst/lib/pkgconfig/zlib.pc \
	build/inst/lib/libbz2.a \
	build/inst/lib/pkgconfig/liblzma.pc
	mkdir -p build/libarchive-$(LIBARCHIVE_VERSION)/wasm
	cd build/libarchive-$(LIBARCHIVE_VERSION)/wasm && \
		emconfigure env \
		PKG_CONFIG_PATH="$(PWD)/build/inst/lib/pkgconfig" \
		../configure \
		--prefix="$(PWD)/build/inst" \
		--enable-static --disable-shared \
		LDFLAGS="-L$(PWD)/build/inst/lib" \
		CFLAGS="-Oz -I$(PWD)/build/inst/include"

build/libarchive-$(LIBARCHIVE_VERSION)/configure: \
	build/libarchive-$(LIBARCHIVE_VERSION).tar.xz
	cd build && tar Jxf libarchive-$(LIBARCHIVE_VERSION).tar.xz
	touch $@

build/libarchive-$(LIBARCHIVE_VERSION).tar.xz:
	mkdir -p build
	curl https://www.libarchive.org/downloads/libarchive-$(LIBARCHIVE_VERSION).tar.xz -L -o $@
