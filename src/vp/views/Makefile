#all: subdirs all.js # Textbook subdirectory recursion

FILES = \
	View.js \
	DividerView.js \
	SliceView.js \
	PagesView.js \
	PopupView.js \
	ViewOverlay.js \
	ViewMultiverse.js \
	ViewPicker.js \

all.js: $(FILES)
	cat $(FILES) > all.js

# Clean files from subdirs and this dir
.PHONY: clean
clean:
#	@$(MAKE) -sC tbd clean # ADD DIRS AS NEEDED
	@-rm -f all.js

# Textbook subdirectory recursion
#SUBDIRS = $(wildcard */)
#.PHONY: subdirs $(SUBDIRS)
#subdirs: $(SUBDIRS)
#$(SUBDIRS):
#	@$(MAKE) -C $@

