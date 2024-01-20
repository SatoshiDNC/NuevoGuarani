all: subdirs all.js # Textbook subdirectory recursion

FILES = \
	accountsettings/all.js \
	languagesettings.js \
	currencysettings/all.js \
	walletsettings/all.js \
	pricelistsettings.js \
	layoutsettings.js \
	colorsettings.js \
	camerasettings.js \
	softwarelicense.js \
	dangerzone.js \
	mainsettings.js \
	settingspane.js \

all.js: $(FILES)
	cat $(FILES) > all.js

# Clean files from subdirs and this dir
.PHONY: clean
clean:
	@$(MAKE) -sC accountsettings clean # ADD DIRS AS NEEDED
	@$(MAKE) -sC currencysettings clean # ADD DIRS AS NEEDED
	@$(MAKE) -sC walletsettings clean # ADD DIRS AS NEEDED
	@-rm -f all.js

# Textbook subdirectory recursion
SUBDIRS = $(wildcard */)
.PHONY: subdirs $(SUBDIRS)
subdirs: $(SUBDIRS)
$(SUBDIRS):
	@$(MAKE) -C $@

