all: subdirs program.html # Textbook subdirectory recursion

program.html: head.html vp/package.min.js main.js tail.html
	cat \
		head.html \
		../3rd-party/gl-matrix.js \
		vp/package.min.js \
		main.js \
		tail.html \
		> program.html

.PHONY: clean
clean:
	@$(MAKE) -sC vp clean
	@-rm -f program.html

# Textbook subdirectory recursion
SUBDIRS = vp
.PHONY: subdirs $(SUBDIRS)
subdirs: $(SUBDIRS)
$(SUBDIRS):
	@$(MAKE) -C $@

