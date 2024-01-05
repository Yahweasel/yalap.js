CC=emcc
CFLAGS=-Oz
EFLAGS=\
	--memory-init-file 0 \
	-s WASM=2 \
	-s "EXPORT_NAME='YALAP'" \
	-s "EXPORTED_RUNTIME_METHODS=['cwrap']" \
	-s MODULARIZE=1 \
	-s ALLOW_MEMORY_GROWTH=1


YALAP_VERSION=0.0.1

all: \
	build-zip build-unzip build-arcex-zip \
	build-7zip build-un7zip build-arcex-7zip \
	build-tar build-untar build-arcex-tar \
	build-archive build-extract build-all

include mk/*.mk


build-%: dist/yalap-$(YALAP_VERSION)-%.js
	true

dist/yalap-$(YALAP_VERSION)-%.js: configs/%/exports.txt \
	node_modules/.bin/uglifyjs \
	build/inst/lib/pkgconfig/libarchive.pc
	mkdir -p dist
	$(CC) $(CFLAGS) $(EFLAGS) \
		-Ibuild/inst/include \
		--extern-pre-js configs/$*/license.js \
		--post-js configs/$*/post.js \
		--extern-post-js configs/$*/extern-post.js \
		-s "EXPORTED_FUNCTIONS=@configs/$*/exports.txt" \
		`cat configs/$*/eflags.txt` \
		configs/$*/bindings.c \
		build/inst/lib/libarchive.a \
		`cat configs/$*/libs.txt` -o $@
	./node_modules/.bin/uglifyjs -m --comments '/^!/' < $@ > $@.tmp
	mv $@.tmp $@
	chmod a-x dist/yalap-$(YALAP_VERSION)-$*.wasm

node_modules/.bin/uglifyjs:
	npm install

clean:
	rm -rf dist build/inst
	rm -rf build/zlib-$(ZLIB_VERSION)
	rm -rf build/bzip2-$(BZIP2_VERSION)
	rm -rf build/xz-$(LZMA_VERSION)
	rm -rf build/libarchive-$(LIBARCHIVE_VERSION)

distclean: clean
	rm -rf build
	rm -rf node_modules package-lock.json

.PRECIOUS: dist/yalap-$(YALAP_VERSION)-%.js
