all: subdirs all.js # Textbook subdirectory recursion
SUBDIRS = $(wildcard */)

W1=tfw_passfail = test(tfw_depth+1,tfw_show,'
W2=',function(tfw_depth,tfw_show) { var tfw_pass=0, tfw_fail=0, tfw_passfail;
W4=if (tfw_pass + tfw_fail > 0) return {pass:tfw_pass, fail:tfw_fail}; });
W3=$(W4) tfw_pass += tfw_passfail.pass; tfw_fail += tfw_passfail.fail;

#W1=test(tfw_depth+1,tfw_show,'
#W2=',function(tfw_depth,tfw_show) {
#W4=});
#W3=$(W4)

SRC = $(addsuffix all.js,$(SUBDIRS))
T = $(SRC:/all.js=.t)
all.js: $(T) framework.js
	cat framework.js > $@
	echo "console.log();" >> $@
	echo "test(0,1,'all tests$(W2)" >> $@
	cat $(T) >> $@
	echo "$(W4)" >> $@
	echo "console.log();" >> $@

%.t: subdirs
	echo "$(W1)$(@:.t=)$(W2)" > $@
	cat $(@:.t=/all.js) >> $@
	echo "$(W3)" >> $@

# Clean files from subdirs and this dir
.PHONY: clean
clean:
	@$(MAKE) -sC barcode clean # ADD DIRS AS NEEDED
	@$(MAKE) -sC other clean # ADD DIRS AS NEEDED
	@-rm -f all.js $(T)

# Textbook subdirectory recursion
.PHONY: subdirs $(SUBDIRS)
subdirs: $(SUBDIRS)
$(SUBDIRS):
	@$(MAKE) \
		W1="$(W1)" \
		W2="$(W2)" \
		W3="$(W3)" \
		-C $@ \
