all: subdirs program-debug.html # Textbook subdirectory recursion
rel: subdirs program-release.html # to build the release version

program-release.html: \
	head.html \
	../3rd-party/gl-matrix.js \
	../3rd-party/qr-scanner.umd.min.js \
	../3rd-party/gl-dumbfont.min.js \
	all.min.js \
	tail.html \

	cat \
		head.html \
		../3rd-party/gl-matrix.js \
		../3rd-party/qr-scanner.umd.min.js \
		../3rd-party/gl-dumbfont.min.js \
		all.min.js \
		tail.html \
		> program-release.html

program-debug.html: \
	head.html \
	../3rd-party/gl-matrix.js \
	../3rd-party/qr-scanner.umd.min.js \
	../3rd-party/gl-dumbfont.min.js \
	all.js \
	tail.html \

	cat \
		head.html \
		../3rd-party/gl-matrix.js \
		../3rd-party/qr-scanner.umd.min.js \
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
	main-head.js \
	ColorTheme.js \
	themes/all.js \
	languages/all.js \
	main-translations.js \
	main-config.js \
	main-shapes.js \
	main-gl.js \
	main-helpers.js \
	panes/all.js \
	main-tail.js \
	load-head.js \
	fonts/all.js \
	load-tail.js \

	cat \
		vp/all.js \
		main-head.js \
		ColorTheme.js \
		themes/all.js \
		languages/all.js \
		main-translations.js \
		main-config.js \
		main-shapes.js \
		main-gl.js \
		main-helpers.js \
		panes/all.js \
		main-tail.js \
		load-head.js \
		fonts/all.js \
		load-tail.js \
		> all.js

# Clean files from subdirs and this dir
.PHONY: clean
clean:
	@$(MAKE) -sC vp clean # ADD DIRS AS NEEDED
	@$(MAKE) -sC fonts clean
	@$(MAKE) -sC languages clean
	@$(MAKE) -sC panes clean
	@$(MAKE) -sC themes clean
	@-rm -f \
		program-release.html \
		program-debug.html \
		all.js \
		all.min.js \

# Textbook subdirectory recursion
SUBDIRS = vp fonts languages panes themes # ADD DIRS AS NEEDED
.PHONY: subdirs $(SUBDIRS)
subdirs: $(SUBDIRS)
$(SUBDIRS):
	@$(MAKE) -C $@

