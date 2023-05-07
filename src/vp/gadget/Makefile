package.min.js: package.js
	java -jar ../../../3rd-party/closure-compiler-v20230502.jar \
		--js package.js \
		--js_output_file package.min.js

FILES = \
	Gadget.js \
	MiddleDividerGadget.js \
	MatrixGadget.js \
	SwipeGadget.js \

package.js: $(FILES)
	cat \
		$(FILES) \
		> package.js

.PHONY: clean
clean:
	-rm -f package.js package.min.js
