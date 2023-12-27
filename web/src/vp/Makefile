all: subdirs all.js # Textbook subdirectory recursion

FILES = \
	api-head.js \
	HitList.js \
	LayoutState.js \
	views/all.js \
	gadgets/all.js \
	api.js \
	api-tail.js \

all.js: $(FILES)
	cat $(FILES) > all.js

# Clean files from subdirs and this dir
.PHONY: clean
clean:
	@$(MAKE) -sC views clean # ADD DIRS AS NEEDED
	@$(MAKE) -sC gadgets clean
	-rm -f all.js

# Textbook subdirectory recursion
SUBDIRS = $(wildcard */)
.PHONY: subdirs $(SUBDIRS)
subdirs: $(SUBDIRS)
$(SUBDIRS):
	@$(MAKE) -C $@
