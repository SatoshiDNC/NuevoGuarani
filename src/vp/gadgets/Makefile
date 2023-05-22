#all: subdirs all.js # Textbook subdirectory recursion

FILES = \
	Gadget.js \
	MiddleDividerGadget.js \
	MatrixGadget.js \
	SwipeGadget.js \

all.js: $(FILES)
	cat $(FILES) > all.js

# Clean files from subdirs and this dir
.PHONY: clean
clean:
#	@$(MAKE) -sC tbd clean # ADD DIRS AS NEEDED
	@-rm -f all.js

# Textbook subdirectory recursion
#SUBDIRS = tbd # ADD DIRS AS NEEDED
#.PHONY: subdirs $(SUBDIRS)
#subdirs: $(SUBDIRS)
#$(SUBDIRS):
#	@$(MAKE) -C $@

