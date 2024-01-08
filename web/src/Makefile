all: subdirs program-debug.html # Textbook subdirectory recursion
rel: subdirs program-release.html # to build the release version

CLOSURE = java -jar ../3rd-party/closure-compiler-v20230802.jar --language_in UNSTABLE

program-release.html: \
	head.html \
	head-release.js \
	../3rd-party/gl-matrix.js \
	../3rd-party/qr-creator.min.js \
	../3rd-party/gl-dumbfont.min.js \
	all.min.js \
	tail.html \

	cat \
		head.html \
		head-release.js \
		../3rd-party/gl-matrix.js \
		../3rd-party/qr-creator.min.js \
		../3rd-party/gl-dumbfont.min.js \
		all.min.js \
		tail.html \
		> program-release.html

program-debug.html: \
	head.html \
	head-debug.js \
	../3rd-party/gl-matrix.js \
	../3rd-party/qr-creator.min.js \
	../3rd-party/gl-dumbfont.js \
	all.js \
	tail.html \

	cat \
		head.html \
		head-debug.js \
		../3rd-party/gl-matrix.js \
		../3rd-party/qr-creator.min.js \
		../3rd-party/gl-dumbfont.js \
		all.js \
		tail.html \
		> program-debug.html

all.min.js: all.js
	$(CLOSURE) \
		--js all.js \
		--js_output_file all.min.js

all.js: \
  PlatformUtil.js \
	vp/all.js \
	barcode/all.js \
	main-head.js \
	emoji.js \
	main-db.js \
	Convert.js \
	ColorTheme.js \
	Configuration.js \
	Wallet.js \
	PriceList.js \
	themes/all.js \
	languages/all.js \
	main-translations.js \
	main-receiptfmt.js \
	main-config.js \
	main-gl.js \
	ShapeBuffer.js \
	main-shapes.js \
	main-helpers.js \
	wallets/all.js \
	panes/all.js \
	main-orders.js \
	main-tail.js \
	load-head.js \
	fonts/all.js \
	load-tail.js \

	cat \
	  PlatformUtil.js \
		vp/all.js \
		barcode/all.js \
		> all.js
#	echo "import QrScanner from 'data:application/x-javascript;base64,`cat ../3rd-party/qr-scanner-batch.min.js | base64 | tr -d '\r\n'`';" \
#		>> all.js
#	echo "import QrScanner from '../3rd-party/qr-scanner.min.js'" \
#		>> all.js
	cat \
		main-head.js \
		emoji.js \
		main-db.js \
		Convert.js \
		ColorTheme.js \
		Configuration.js \
		Wallet.js \
		PriceList.js \
		themes/all.js \
		languages/all.js \
		main-translations.js \
		main-receiptfmt.js \
		main-config.js \
		ShapeBuffer.js \
		main-shapes.js \
		main-gl.js \
		main-helpers.js \
		wallets/all.js \
		panes/all.js \
		main-orders.js \
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
	@$(MAKE) -sC wallets clean
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

