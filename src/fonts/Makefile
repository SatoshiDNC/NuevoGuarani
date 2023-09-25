#all: subdirs all.js # Textbook subdirectory recursion

# NOTE: This makefile differs slightly from the others in that it creates the
# individual .js files on the fly before packaging them.

AUTOGEN_FILES = \
	defaultFont.js \
	iconFont.js \
	dotMatrixFont.js \
	financeGraphicsFont.js \
	emojis.js \

all.js: $(AUTOGEN_FILES)
	cat $(AUTOGEN_FILES) > all.js

DEFAULTFONT_OUTFILE = defaultFont.js
defaultFont.js: guarani.font.png
	echo "  defaultFont = new df.GlyphSet();" > $(DEFAULTFONT_OUTFILE)
	echo "  defaultFont.loadFromURL(" >> $(DEFAULTFONT_OUTFILE)
	echo "    \"defaultFont\"," >> $(DEFAULTFONT_OUTFILE)
	echo "    loadCheck," >> $(DEFAULTFONT_OUTFILE)
#	echo "    \"src/fonts/guarani.font.png\"," >> $(DEFAULTFONT_OUTFILE)
	echo "    \"data:application/octet-stream;base64,`cat guarani.font.png | base64 | tr -d '\r\n'`\"," \
		>> $(DEFAULTFONT_OUTFILE)
	echo "  );" >> $(DEFAULTFONT_OUTFILE)

ICONFONT_OUTFILE = iconFont.js
iconFont.js: icon.font.png
	echo "  iconFont = new df.GlyphSet();" > $(ICONFONT_OUTFILE)
	echo "  iconFont.loadFromURL(" >> $(ICONFONT_OUTFILE)
	echo "    \"iconFont\"," >> $(ICONFONT_OUTFILE)
	echo "    loadCheck," >> $(ICONFONT_OUTFILE)
#	echo "    \"src/fonts/icon.font.png\"," >> $(ICONFONT_OUTFILE)
	echo "    \"data:application/octet-stream;base64,`cat icon.font.png | base64 | tr -d '\r\n'`\"," \
		>> $(ICONFONT_OUTFILE)
	echo "  );" >> $(ICONFONT_OUTFILE)

DOTMATRIXFONT_OUTFILE = dotMatrixFont.js
dotMatrixFont.js: dot-matrix.font.png
	echo "  dotMatrixFont = new df.GlyphSet();" > $(DOTMATRIXFONT_OUTFILE)
	echo "  dotMatrixFont.loadFromURL(" >> $(DOTMATRIXFONT_OUTFILE)
	echo "    \"dotMatrixFont\"," >> $(DOTMATRIXFONT_OUTFILE)
	echo "    loadCheck," >> $(DOTMATRIXFONT_OUTFILE)
#	echo "    \"src/fonts/dot-matrix.font.png\"," >> $(DOTMATRIXFONT_OUTFILE)
	echo "    \"data:application/octet-stream;base64,`cat dot-matrix.font.png | base64 | tr -d '\r\n'`\"," \
		>> $(DOTMATRIXFONT_OUTFILE)
	echo "  );" >> $(DOTMATRIXFONT_OUTFILE)

FINANCEGRAPHICS_OUTFILE = financeGraphicsFont.js
financeGraphicsFont.js: finance-theme.font.png
	echo "  financeGraphicsFont = new df.GlyphSet();" > $(FINANCEGRAPHICS_OUTFILE)
	echo "  financeGraphicsFont.loadFromURL(" >> $(FINANCEGRAPHICS_OUTFILE)
	echo "    \"financeGraphicsFont\"," >> $(FINANCEGRAPHICS_OUTFILE)
	echo "    loadCheck," >> $(FINANCEGRAPHICS_OUTFILE)
#	echo "    \"src/fonts/finance-theme.font.png\"," >> $(FINANCEGRAPHICS_OUTFILE)
	echo "    \"data:application/octet-stream;base64,`cat finance-theme.font.png | base64 | tr -d '\r\n'`\"," \
		>> $(FINANCEGRAPHICS_OUTFILE)
	echo "  );" >> $(FINANCEGRAPHICS_OUTFILE)

EMOJIS_OUTFILE = emojis.js
emojis.js: google-emoji-spritesheet.png
#	echo "emojiFile = \"data:application/octet-stream;base64,`cat google-emoji-spritesheet.png | base64 | tr -d '\r\n'`\";" \
#		>> $(EMOJIS_OUTFILE)
	echo "emojiFile = \"src/fonts/google-emoji-spritesheet.png\";" \
		>> $(EMOJIS_OUTFILE)

# Clean files from subdirs and this dir
.PHONY: clean
clean:
#	@$(MAKE) -sC tbd clean # ADD DIRS AS NEEDED
	@-rm -f all.js $(AUTOGEN_FILES)

# Textbook subdirectory recursion
#SUBDIRS = $(wildcard */)
#.PHONY: subdirs $(SUBDIRS)
#subdirs: $(SUBDIRS)
#$(SUBDIRS):
#	@$(MAKE) -C $@

