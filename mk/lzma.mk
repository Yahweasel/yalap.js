LZMA_VERSION=5.4.5

build/inst/lib/pkgconfig/liblzma.pc: build/xz-$(LZMA_VERSION)/build/config.h
	cd build/xz-$(LZMA_VERSION)/build && \
		$(MAKE) install

build/xz-$(LZMA_VERSION)/build/config.h: build/xz-$(LZMA_VERSION)/configure
	mkdir -p build/xz-$(LZMA_VERSION)/build
	cd build/xz-$(LZMA_VERSION)/build && \
		emconfigure ../configure \
			--prefix="$(PWD)/build/inst" \
			--enable-static --disable-shared \
			--enable-threads=no --enable-small \
			--disable-xz --disable-xzdec --disable-lzmadec \
			--disable-lzmainfo \
			CFLAGS="$(CFLAGS)"
	touch $@

build/xz-$(LZMA_VERSION)/configure: build/xz-$(LZMA_VERSION).tar.xz
	cd build && tar Jxf xz-$(LZMA_VERSION).tar.xz
	touch $@

build/xz-$(LZMA_VERSION).tar.xz:
	mkdir -p build
	curl https://tukaani.org/xz/xz-$(LZMA_VERSION).tar.xz -L -o $@
