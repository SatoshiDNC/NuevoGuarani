all: subdirs program-debug.html # Textbook subdirectory recursion
rel: subdirs program-release.html # to build the release version

program-release.html: \
	head.html \
	../3rd-party/gl-matrix.js \
	../3rd-party/qr-creator.min.js \
	../3rd-party/gl-dumbfont.min.js \
	all.min.js \
	tail.html \

	cat \
		head.html \
		../3rd-party/gl-matrix.js \
		../3rd-party/qr-creator.min.js \
		../3rd-party/gl-dumbfont.min.js \
		all.min.js \
		tail.html \
		> program-release.html

program-debug.html: \
	head.html \
	../3rd-party/gl-matrix.js \
	../3rd-party/qr-creator.min.js \
	../3rd-party/gl-dumbfont.min.js \
	all.js \
	tail.html \

	cat \
		head.html \
		../3rd-party/gl-matrix.js \
		../3rd-party/qr-creator.min.js \
		../3rd-party/gl-dumbfont.min.js \
		all.js \
		tail.html \
		> program-debug.html

all.min.js: all.js
	java -jar ../3rd-party/closure-compiler-v20230502.jar \
		--js all.js \
		--js_output_file all.min.js

all.js: \
	vp/all.js \
	barcode/all.js \
	main-head.js \
	main-db.js \
	ColorTheme.js \
	Configuration.js \
	themes/all.js \
	languages/all.js \
	main-translations.js \
	main-receiptfmt.js \
	main-config.js \
	main-gl.js \
	main-shapes.js \
	main-helpers.js \
	panes/all.js \
	main-tail.js \
	load-head.js \
	fonts/all.js \
	load-tail.js \

	cat \
		vp/all.js \
		barcode/all.js \
		> all.js
#	echo "import QrScanner from 'data:application/x-javascript;base64,`cat ../3rd-party/qr-scanner-batch.min.js | base64 | tr -d '\r\n'`';" \
#		>> all.js
	echo "import QrScanner from '../3rd-party/qr-scanner.min.js'" \
		>> all.js
	cat \
		main-head.js \
		main-db.js \
		ColorTheme.js \
		Configuration.js \
		themes/all.js \
		languages/all.js \
		main-translations.js \
		main-receiptfmt.js \
		main-config.js \
		main-shapes.js \
		main-gl.js \
		main-helpers.js \
		panes/all.js \
		main-tail.js \
		load-head.js \
		fonts/all.js \
		load-tail.js \
		>> all.js

# Clean files from subdirs and this dir
.PHONY: clean
clean:
	@$(MAKE) -sC vp clean # ADD DIRS AS NEEDED
	@$(MAKE) -sC fonts clean
	@$(MAKE) -sC languages clean
	@$(MAKE) -sC panes clean
	@$(MAKE) -sC themes clean
	@$(MAKE) -sC barcode clean
	@-rm -f \
		program-release.html \
		program-debug.html \
		all.js \
		all.min.js \

# Textbook subdirectory recursion
SUBDIRS = $(wildcard */)
.PHONY: subdirs $(SUBDIRS)
subdirs: $(SUBDIRS)
$(SUBDIRS):
	@$(MAKE) -C $@

