#all: subdirs all.js # Textbook subdirectory recursion

SRC = $(filter-out all.js,$(wildcard *.js))
T = $(SRC:.js=.t)
all.js: $(T)
	cat $(T) > $@

%.t: %.js
	echo "$(W1)$^$(W2)" > $@
	cat $^ >> $@
	echo "$(W3)" >> $@

# Clean files from subdirs and this dir
.PHONY: clean
clean:
#	@$(MAKE) -sC tbd clean # ADD DIRS AS NEEDED
	@-rm -f all.js $(T)

# Textbook subdirectory recursion
#SUBDIRS = $(wildcard */)
#.PHONY: subdirs $(SUBDIRS)
#subdirs: $(SUBDIRS)
#$(SUBDIRS):
#	@$(MAKE) -C $@

