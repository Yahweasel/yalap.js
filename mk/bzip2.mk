BZIP2_VERSION=1.0.8

build/inst/lib/libbz2.a: build/bzip2-$(BZIP2_VERSION)/libbz2.a \
	build/inst/include/bzlib.h
	mkdir -p build/inst/lib
	cp $< $@

build/inst/include/bzlib.h: build/bzip2-$(BZIP2_VERSION)/Makefile
	mkdir -p build/inst/include
	cp build/bzip2-$(BZIP2_VERSION)/bzlib.h $@

build/bzip2-$(BZIP2_VERSION)/libbz2.a: build/bzip2-$(BZIP2_VERSION)/Makefile
	cd build/bzip2-$(BZIP2_VERSION) && \
		$(MAKE) CC=emcc AR=emar RANLIB=emranlib CFLAGS="$(CFLAGS)" libbz2.a

build/bzip2-$(BZIP2_VERSION)/Makefile: build/bzip2-$(BZIP2_VERSION).tar.gz
	cd build && tar zxf bzip2-$(BZIP2_VERSION).tar.gz
	touch $@

build/bzip2-$(BZIP2_VERSION).tar.gz:
	mkdir -p build
	curl http://sourceware.org/pub/bzip2/bzip2-$(BZIP2_VERSION).tar.gz -L -o $@
