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


YALAP_VERSION=0.0.1

YALAPW_SOURCES=oo/yalapo.js oo/yalapw.js
YALAPR_SOURCES=oo/yalapo.js oo/yalapr.js
YALAPO_SOURCES=oo/yalapo.js oo/yalapw.js oo/yalapr.js

all: \
	buildw-zip buildr-unzip build-arcex-zip \
	buildw-7zip buildr-un7zip build-arcex-7zip \
	buildw-tar buildr-untar build-arcex-tar \
	buildw-archive buildr-extract build-all

include mk/*.mk


build-%: buildr-% buildw-% dist/yalapo-$(YALAP_VERSION)-%.js
	true

buildw-%: dist/yalap-$(YALAP_VERSION)-%.js \
	dist/yalapw-$(YALAP_VERSION)-%.js
	true

buildr-%: dist/yalap-$(YALAP_VERSION)-%.js \
	dist/yalapr-$(YALAP_VERSION)-%.js
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
	$(MINIFY) < $@ > $@.tmp
	mv $@.tmp $@
	chmod a-x dist/yalap-$(YALAP_VERSION)-$*.wasm

dist/yalapw-$(YALAP_VERSION)-%.js: oo/yalapo-head.js $(YALAPW_SOURCES)
	mkdir -p dist
	sed 's/@VER/$(YALAP_VERSION)/g ; s/@VAR/$(*)/g' $< $(YALAPW_SOURCES) | $(MINIFY) > $@

dist/yalapw-$(YALAP_VERSION)-%.mjs: oo/yalapo-head.mjs $(YALAPW_SOURCES)
	mkdir -p dist
	sed 's/@VER/$(YALAP_VERSION)/g ; s/@VAR/$(*)/g' $< $(YALAPW_SOURCES) | $(MINIFY) > $@

dist/yalapr-$(YALAP_VERSION)-%.js: oo/yalapo-head.js $(YALAPR_SOURCES)
	mkdir -p dist
	sed 's/@VER/$(YALAP_VERSION)/g ; s/@VAR/$(*)/g' $< $(YALAPR_SOURCES) | $(MINIFY) > $@

dist/yalapr-$(YALAP_VERSION)-%.mjs: oo/yalapo-head.mjs $(YALAPR_SOURCES)
	mkdir -p dist
	sed 's/@VER/$(YALAP_VERSION)/g ; s/@VAR/$(*)/g' $< $(YALAPR_SOURCES) | $(MINIFY) > $@

dist/yalapo-$(YALAP_VERSION)-%.js: oo/yalapo-head.js $(YALAPO_SOURCES)
	mkdir -p dist
	sed 's/@VER/$(YALAP_VERSION)/g ; s/@VAR/$(*)/g' $< $(YALAPO_SOURCES) | $(MINIFY) > $@

dist/yalapo-$(YALAP_VERSION)-%.mjs: oo/yalapo-head.mjs $(YALAPO_SOURCES)
	mkdir -p dist
	sed 's/@VER/$(YALAP_VERSION)/g ; s/@VAR/$(*)/g' $< $(YALAPO_SOURCES) | $(MINIFY) > $@

oo/%.js: oo/%.ts node_modules/.bin/uglifyjs
	./node_modules/.bin/tsc --target es5 --lib es2015,dom $<

node_modules/.bin/uglifyjs:
	npm install

clean:
	rm -rf dist build/inst
	rm -rf build/zlib-$(ZLIB_VERSION)
	rm -rf build/bzip2-$(BZIP2_VERSION)
	rm -rf build/xz-$(LZMA_VERSION)
	rm -rf build/libarchive-$(LIBARCHIVE_VERSION)
	rm -f oo/yalapw.js oo/yalapr.js

distclean: clean
	rm -rf build
	rm -rf node_modules package-lock.json

.PRECIOUS: \
	dist/yalap-$(YALAP_VERSION)-%.js \
	dist/yalapw-$(YALAP_VERSION)-%.js \
	dist/yalapr-$(YALAP_VERSION)-%.js \
	dist/yalapo-$(YALAP_VERSION)-%.js
