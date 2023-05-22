#all: subdirs all.js # Textbook subdirectory recursion

# Note: this Makefile differs from the others in that it builds the JavaScript
# files on the fly before packaging them.

LANGS	:= de-DE en-US es-PY gn-PY
JS	:= $(patsubst %,%.js,$(LANGS))
TXT	:= $(patsubst %,%.txt,$(LANGS))

all.js: $(JS)
	cat $(JS) > all.js

$(JS): %.js: %.txt
	echo "window['main']['$(patsubst %.txt,%,$<)'] = {" > $@
	cat $< \
		| sed 's/^\([^\t]*\)\t\([^\t]*\)\t.*$$/\1\t\2/' \
		| sed 's/"/\\"/' \
		| sed 's/^\([^\t]*\)\t\([^\t]*\)$$/"\1":\t"\2",/' \
		>> $@
	echo "}" >> $@

# Clean files from subdirs and this dir
.PHONY: clean
clean:
#	@$(MAKE) -sC tbd clean # ADD DIRS AS NEEDED
	@-rm -f all.js $(JS)

# Textbook subdirectory recursion
#SUBDIRS = tbd # ADD DIRS AS NEEDED
#.PHONY: subdirs $(SUBDIRS)
#subdirs: $(SUBDIRS)
#$(SUBDIRS):
#	@$(MAKE) -C $@

