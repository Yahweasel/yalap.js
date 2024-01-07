CC=emcc
CFLAGS=-Oz
MINIFY=./node_modules/.bin/uglifyjs -m --comments '/^!/'
EFLAGS=\
	--memory-init-file 0 \
	-s WASM=2 \
	-s "EXPORT_NAME='YALAP'" \
	-s "EXPORTED_RUNTIME_METHODS=['cwrap']" \
	-s MODULARIZE=1 \
	-s ALLOW_MEMORY_GROWTH=1


YALAP_VERSION=1.0.0

YALAPO_SOURCES=oo/yalapo.js oo/yalapw.js oo/yalapr.js

all: \
	build-zip build-unzip build-arcex-zip \
	build-7zip build-un7zip build-arcex-7zip \
	build-tar build-untar build-arcex-tar \
	build-archive build-extract build-all

include mk/*.mk


build-%: dist/yalap-$(YALAP_VERSION)-%.js
	true

dist/yalap-$(YALAP_VERSION)-%.js: build/extern-post-%.js \
	configs/%/exports.txt \
	node_modules/.bin/uglifyjs \
	build/inst/lib/pkgconfig/libarchive.pc
	mkdir -p dist
	$(CC) $(CFLAGS) $(EFLAGS) \
		-Ibuild/inst/include \
		--extern-pre-js configs/$*/license.js \
		--post-js configs/$*/post.js \
		--extern-post-js build/extern-post-$*.js \
		-s "EXPORTED_FUNCTIONS=@configs/$*/exports.txt" \
		`cat configs/$*/eflags.txt` \
		configs/$*/bindings.c \
		build/inst/lib/libarchive.a \
		`cat configs/$*/libs.txt` -o $@
	$(MINIFY) < $@ > $@.tmp
	mv $@.tmp $@
	chmod a-x dist/yalap-$(YALAP_VERSION)-$*.wasm

build/extern-post-%.js: configs/%/extern-post.js $(YALAPO_SOURCES)
	mkdir -p build
	cat $< `cat configs/$*/oo.txt` > $@

oo/%.js: oo/%.ts node_modules/.bin/uglifyjs
	./node_modules/.bin/tsc --target es5 --lib es2015,dom $<

oo/yalapo.js: oo/yalapw.js oo/yalapr.js
	cat oo/yalapw.js oo/yalapr.js > $@

node_modules/.bin/uglifyjs:
	npm install

clean:
	rm -rf dist build/inst
	rm -rf build/zlib-$(ZLIB_VERSION)
	rm -rf build/bzip2-$(BZIP2_VERSION)
	rm -rf build/xz-$(LZMA_VERSION)
	rm -rf build/libarchive-$(LIBARCHIVE_VERSION)
	rm -f oo/yalapo.js oo/yalapw.js oo/yalapr.js

distclean: clean
	rm -rf build
	rm -rf node_modules package-lock.json

.PRECIOUS: \
	dist/yalap-$(YALAP_VERSION)-%.js \
	dist/yalapw-$(YALAP_VERSION)-%.js \
	dist/yalapr-$(YALAP_VERSION)-%.js \
	dist/yalapo-$(YALAP_VERSION)-%.js \
	$(YALAPO_SOURCES)
