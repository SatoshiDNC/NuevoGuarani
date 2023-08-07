all: subdirs all.js # Textbook subdirectory recursion

FILES = \
	startpane.js \
	checkout/all.js \
	payment/all.js \
	settings/all.js \
	misc.js \
	allblack.js \
	menudiv.js \

all.js: $(FILES)
	cat $(FILES) > all.js

# Clean files from subdirs and this dir
.PHONY: clean
clean:
	@$(MAKE) -sC checkout clean # ADD DIRS AS NEEDED
	@$(MAKE) -sC payment clean # ADD DIRS AS NEEDED
	@$(MAKE) -sC settings clean # ADD DIRS AS NEEDED
	@-rm -f all.js

# Textbook subdirectory recursion
SUBDIRS = $(wildcard */)
.PHONY: subdirs $(SUBDIRS)
subdirs: $(SUBDIRS)
$(SUBDIRS):
	@$(MAKE) -C $@

