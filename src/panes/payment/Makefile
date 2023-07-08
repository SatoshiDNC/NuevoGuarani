all: subdirs all.js # Textbook subdirectory recursion

FILES = \
	paymentpane.js \
	payinvconf.js \
	displayreceipt.js \

all.js: $(FILES)
	cat $(FILES) > all.js

# Clean files from subdirs and this dir
.PHONY: clean
clean:
#	@$(MAKE) -sC checkout clean # ADD DIRS AS NEEDED
	@-rm -f all.js

# Textbook subdirectory recursion
SUBDIRS = $(wildcard */)
.PHONY: subdirs $(SUBDIRS)
subdirs: $(SUBDIRS)
$(SUBDIRS):
	@$(MAKE) -C $@

