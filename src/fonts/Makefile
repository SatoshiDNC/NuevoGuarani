#all: subdirs all.js # Textbook subdirectory recursion

# NOTE: This makefile differs slightly from the others in that it creates the
# individual .js files on the fly before packaging them.

AUTOGEN_FILES = \
	defaultFont.js \
	iconFont.js \

all.js: $(AUTOGEN_FILES)
	cat $(AUTOGEN_FILES) > all.js

DEFAULTFONT_OUTFILE = defaultFont.js
defaultFont.js: guarani.font.png
	echo "  defaultFont = new df.GlyphSet();" > $(DEFAULTFONT_OUTFILE)
	echo "  defaultFont.loadFromURL(" >> $(DEFAULTFONT_OUTFILE)
	echo "    \"defaultFont\"," >> $(DEFAULTFONT_OUTFILE)
	echo "    loadCheck," >> $(DEFAULTFONT_OUTFILE)
	echo "    \"data:application/octet-stream;base64,`cat guarani.font.png | base64 | tr -d '\r\n'`\"," \
		>> $(DEFAULTFONT_OUTFILE)
	echo "  );" >> $(DEFAULTFONT_OUTFILE)

ICONFONT_OUTFILE = iconFont.js
iconFont.js: icon.font.png
	echo "  iconFont = new df.GlyphSet();" > $(ICONFONT_OUTFILE)
	echo "  iconFont.loadFromURL(" >> $(ICONFONT_OUTFILE)
	echo "    \"iconFont\"," >> $(ICONFONT_OUTFILE)
	echo "    loadCheck," >> $(ICONFONT_OUTFILE)
	echo "    \"data:application/octet-stream;base64,`cat icon.font.png | base64 | tr -d '\r\n'`\"," \
		>> $(ICONFONT_OUTFILE)
	echo "  );" >> $(ICONFONT_OUTFILE)

# Clean files from subdirs and this dir
.PHONY: clean
clean:
#	@$(MAKE) -sC tbd clean # ADD DIRS AS NEEDED
	@-rm -f all.js $(AUTOGEN_FILES)

# Textbook subdirectory recursion
#SUBDIRS = tbd # ADD DIRS AS NEEDED
#.PHONY: subdirs $(SUBDIRS)
#subdirs: $(SUBDIRS)
#$(SUBDIRS):
#	@$(MAKE) -C $@

