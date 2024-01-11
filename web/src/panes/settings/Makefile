all: subdirs all.js # Textbook subdirectory recursion

FILES = \
	accountsettings.js \
	languagesettings.js \
	currencies/all.js \
	currencysettings.js \
	wallets/all.js \
	walletsettings.js \
	pricelistsettings.js \
	layoutsettings.js \
	colorsettings.js \
	camerasettings.js \
	softwarelicensesettings.js \
	dangerzone.js \
	mainsettings.js \
	settingspane.js \

all.js: $(FILES)
	cat $(FILES) > all.js

# Clean files from subdirs and this dir
.PHONY: clean
clean:
	@$(MAKE) -sC currencies clean # ADD DIRS AS NEEDED
	@$(MAKE) -sC wallets clean # ADD DIRS AS NEEDED
	@-rm -f all.js

# Textbook subdirectory recursion
SUBDIRS = $(wildcard */)
.PHONY: subdirs $(SUBDIRS)
subdirs: $(SUBDIRS)
$(SUBDIRS):
	@$(MAKE) -C $@

