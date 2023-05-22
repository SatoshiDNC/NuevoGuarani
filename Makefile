# Theory of Operation
#
# * When no target is specified, recursively make all subdirectories.
# * When "clean" target is specified, recursively clean all subdirectories.
# * When "rel" target is specified, recursively make all subdirectories and
#   the release (compressed) version of the JavaScript in the src directory.
# * This makefile just copies the appropriate result from the src directory
#   to the final output filename test.html in this directory.
# * All subdirectory Makefiles should follow the same recursion pattern for
#   when no target is specified and for the "clean" target, and they should
#   combine their subtree into their own all.js file.

all: subdirs debug # Textbook subdirectory recursion

# "rel" target should build the release version in addition to everything else.
.PHONY: rel relbuild
rel: relbuild release
relbuild: subdirs
	@$(MAKE) -sC src rel

# Build the intended version.
.PHONY: debug release
debug: src/program-debug.html
	cp src/program-debug.html test.html
release: src/program-release.html
	cp src/program-release.html test.html

# Recursive cleanup.
.PHONY: clean
clean:
	@$(MAKE) -sC src clean
	@-rm -f test.html

# Textbook subdirectory recursion
SUBDIRS = src
.PHONY: subdirs $(SUBDIRS)
subdirs: $(SUBDIRS)
$(SUBDIRS):
	@$(MAKE) -C $@

