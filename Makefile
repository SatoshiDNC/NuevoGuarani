all: subdirs test.html # Textbook subdirectory recursion

test.html: src/program.html
	cp src/program.html test.html

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

