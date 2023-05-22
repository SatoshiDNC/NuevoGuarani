all: subdirs all.js # Textbook subdirectory recursion

FILES = \
	startpane.js \
	invoice/all.js \
	misc.js \
	allblack.js \
	menudiv.js \

all.js: $(FILES)
	cat $(FILES) > all.js

# Clean files from subdirs and this dir
.PHONY: clean
clean:
	@$(MAKE) -sC invoice clean # ADD DIRS AS NEEDED
	@-rm -f all.js

# Textbook subdirectory recursion
SUBDIRS = invoice # ADD DIRS AS NEEDED
.PHONY: subdirs $(SUBDIRS)
subdirs: $(SUBDIRS)
$(SUBDIRS):
	@$(MAKE) -C $@

