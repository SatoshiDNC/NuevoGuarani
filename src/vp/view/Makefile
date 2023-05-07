package.min.js: package.js
	java -jar ../../../3rd-party/closure-compiler-v20230502.jar \
		--js package.js \
		--js_output_file package.min.js

FILES = \
	View.js \
	ViewDivider.js \
	ViewSlice.js \
	ViewOverlay.js \
	ViewMultiverse.js \
	ViewPicker.js \

package.js: $(FILES)
	cat \
		$(FILES) \
		> package.js

.PHONY: clean
clean:
	-rm -f package.js package.min.js
