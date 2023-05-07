all: subdirs package.min.js # Textbook subdirectory recursion

package.min.js: package.js
	java -jar ../../3rd-party/closure-compiler-v20230502.jar \
		--js package.js \
		--js_output_file package.min.js

FILES = \
	api-head.js \
	HitList.js \
	LayoutState.js \
	view/package.min.js \
	gadget/package.min.js \
	api.js \
	api-tail.js \

package.js: $(FILES)
	cat \
		$(FILES) \
		> package.js

.PHONY: clean
clean:
	@$(MAKE) -sC view clean
	-rm -f package.js package.min.js

# Textbook subdirectory recursion
SUBDIRS = view gadget
.PHONY: subdirs $(SUBDIRS)
subdirs: $(SUBDIRS)
$(SUBDIRS):
	@$(MAKE) -C $@
