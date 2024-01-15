#all: subdirs all.js # Textbook subdirectory recursion

# Note: this Makefile differs from the others in that it builds the JavaScript
# files on the fly before packaging them.

LANGS	:= de-DE en-US es-PY #gn-PY
JS	:= $(patsubst %,%.js,$(LANGS))
TXT	:= $(patsubst %,%.txt,$(LANGS))
TPP	:= $(patsubst %,%.pp,$(LANGS))
LIC	:= $(patsubst %,LICENSE-%.txt,$(LANGS))
LPP	:= $(patsubst %,LICENSE-%.pp,$(LANGS))

all.js: $(JS)
	cat $(JS) > all.js

$(JS): %.js: %.pp LICENSE-%.pp
	echo "lang_db['$(patsubst %.pp,%,$<)'] = {" > $@
	cat $^ >> $@
	echo "}" >> $@

$(TPP): %.pp: %.txt
	cat $< \
		| sed 's/^\([^\t]*\)\t\([^\t]*\)\t.*$$/\1\t\2/' \
		| sed 's/"/\\"/' \
		| sed 's/^\([^\t]*\)\t\([^\t]*\)$$/"\1":\t"\2",/' \
		> $@

$(LPP): LICENSE-%.pp: LICENSE-%.txt
	cat $< \
		| tr --delete '\r' \
		| awk 1 RS='\n\n' ORS='%--%' \
		| awk 1 ORS=' ' \
		| awk 1 RS='%--%' \
		| sed 's/^      [ ]*/c>/g' \
		| sed 's/   [ ]*/ /2g' \
		| sed '1s/   [ ]*/ \\\\n c>/' \
		| sed '$${/^[ ]*$$/d;}' \
		| awk '{ ORS=""; print "\"lic:";print NR;print "\": `";print $1;print "`,\n"; }' \
		> $@

$(LIC):
	cp ../../../$@ .

# Clean files from subdirs and this dir
.PHONY: clean
clean:
#	@$(MAKE) -sC tbd clean # ADD DIRS AS NEEDED
	@-rm -f all.js $(JS) $(TPP) $(LPP) $(LIC)

# Textbook subdirectory recursion
#SUBDIRS = $(wildcard */)
#.PHONY: subdirs $(SUBDIRS)
#subdirs: $(SUBDIRS)
#$(SUBDIRS):
#	@$(MAKE) -C $@

