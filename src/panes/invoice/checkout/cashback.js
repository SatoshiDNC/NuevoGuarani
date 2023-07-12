var cashback = v = new vp.View(null);
v.name = Object.keys({cashback}).pop();
//v.designFit = [240,80];
v.designHeight = 80;
v.mode = 'select option';
v.gadgets.push(v.option = g = new vp.Gadget(v));
	g.x = 250+5; g.y = 20; g.w = 230; g.h = 20;
	g.actionFlags = vp.GAF_TEXTINPUT | vp.GAF_GONEXT;
	g.text = ''; g.label = tr('subtotal'); g.autoHull();
	g.renderFunc = function() {
		var g = this, v = g.viewport;
		var sel = vp.getInputGad() === g;
		const th = this.viewport === cashback? vendorColors : customerColors;
		const mat = mat4.create();
		useProg5();
		mat4.identity(mat);
		mat4.translate(mat, mat, [g.x-1, g.y-11, 0]);
		mat4.scale(mat, mat, [g.w+2, g.h+12, 1]);
		gl.uniformMatrix4fv(gl.getUniformLocation(prog5, 'uModelViewMatrix'), false, mat);
		gl.uniform4fv(gl.getUniformLocation(prog5, 'overallColor'),
			new Float32Array(th.uiTextLabelArea));
		gl.drawArrays(typ5.rect, beg5.rect, len5.rect);
		mat4.identity(mat);
		mat4.translate(mat, mat, [g.x, g.y, 0]);
		mat4.scale(mat, mat, [g.w, g.h, 1]);
		gl.uniformMatrix4fv(gl.getUniformLocation(prog5, 'uModelViewMatrix'), false, mat);
		gl.uniform4fv(gl.getUniformLocation(prog5, 'overallColor'),
			new Float32Array(th.uiTextField));
		gl.drawArrays(typ5.rect, beg5.rect, len5.rect);

		mat4.identity(mat);
		mat4.translate(mat, mat, [g.x + 2, g.y - 2, 0]);
		mat4.scale(mat, mat, [0.5, 0.5, 1]);
		defaultFont.draw(0,0, g.label, th.uiTextLabel, v.mat, mat);

		if (sel) {
			useProg5();
			mat4.identity(mat);
			mat4.translate(mat, mat, [g.x, g.y, 0]);
			mat4.scale(mat, mat, [g.w, g.h, 1]);
			gl.uniformMatrix4fv(gl.getUniformLocation(prog5, 'uModelViewMatrix'), false, mat);
			gl.uniform4fv(gl.getUniformLocation(prog5, 'overallColor'),
				new Float32Array(th.uiTextFocus));
			for (var i=0; i<4; i++) {
				mat4.identity(mat);
				switch (i) {
				case 0: mat4.translate(mat, mat, [g.x-1, g.y-1, 0]);
					mat4.scale(mat, mat, [2, g.h+2, 1]); break;
				case 1: mat4.translate(mat, mat, [g.x-1, g.y-1, 0]);
					mat4.scale(mat, mat, [g.w+2, 2, 1]); break;
				case 2: mat4.translate(mat, mat, [g.x-1, g.y+g.h-1, 0]);
					mat4.scale(mat, mat, [g.w+2, 2, 1]); break;
				case 3: mat4.translate(mat, mat, [g.x+g.w-1, g.y-1, 0]);
					mat4.scale(mat, mat, [2, g.h+2, 1]); break;
				}
				gl.uniformMatrix4fv(gl.getUniformLocation(prog5, 'uModelViewMatrix'), false, mat);
				gl.drawArrays(typ5.rect, beg5.rect, len5.rect);
			}
		}
		var str = g.text.toUpperCase();
		if (g === v.qty && v.qty.text.trim() != '') {
			str = (+g.text).toLocaleString(lcode, {});
		}
		mat4.identity(mat);
		var tw = defaultFont.calcWidth(str);
		if (g.align && g.align == 'r') {
			mat4.translate(mat, mat, [g.x+g.w-2-tw-(g.margin?g.margin:0), g.y+16, 0]);
		} else {
			mat4.translate(mat, mat, [g.x+2, g.y+16, 0]);
		}
		defaultFont.draw(0,0, str, th.uiText, v.mat, mat);

		// Add decorations.
		if (g === v.amount) {
			var s = v.amount.currency;
			var c = (s == '₿')? th.uiLightningYellow : th.uiFiatGreen;
			if (s == '₿') s = '🗲';
			mat4.identity(mat);
			mat4.translate(mat, mat, [g.x+2, g.y+16, 0]);
			defaultFont.draw(0,0, s, c, v.mat, mat);
//		} else if (g == v.qty && v.qty.text.startsWith('.')) {
//			mat4.identity(mat);
//			mat4.translate(mat, mat, [g.x+g.w-2-tw-(g.margin?g.margin:0), g.y+16, 0]);
//			defaultFont.draw(-defaultFont.calcWidth('0'),0, '0', th.uiGhostText, v.mat, mat);
		} else if (g === v.taxrate && g.text != '') {
			defaultFont.draw(0,0, '%', th.uiGhostText, v.mat, mat);
		}
	}
	g.textBeginFunc = function() {
		var g = this;
		g.viewport.setRenderFlag(true);
	}
	g.textFunc = function() {
		this.viewport.setRenderFlag(true);
	}
	g.textEndFunc = function() {
		this.viewport.setRenderFlag(true);
	}
	g.textPrevFunc = function() { vp.beginInput(this.viewport.option); }
	g.textNextFunc = function() { vp.beginInput(this.viewport.amount); }
v.options = {};
v.optionRenderFunc = function() {
	var g = this, th = g.viewport === cashback? vendorColors : customerColors;
	var sel = clickTapActive.includes(g.gestureState);
	var c, t, w;
	const mat = mat4.create();
	mat4.identity(mat);
	mat4.translate(mat, mat, [g.x, g.y, 0]);
	mat4.scale(mat, mat, [g.w/38, g.h/18, 0]);
	mat4.translate(mat, mat, [-1, 16, 0]);
	c = (g.icon == '₿') ? th.uiPillOrange : th.uiFiatGreen;
	c = sel?th.uiButtonSel:c;
  if (g.alpha) c = alpha(c, g.alpha);
	iconFont.draw(0,0, g.icon, c, g.viewport.mat, mat);
	t = tr("cash");
	if (g.icon == '₿') {
		t = tr("instant");
		c = sel?th.uiButtonSel:th.uiLightningPurple;
	  if (g.alpha) c = alpha(c, g.alpha);
		iconFont.draw(0,0, '🗲', c, g.viewport.mat, mat);
	}
	w = defaultFont.calcWidth(t);
	mat4.identity(mat);
	mat4.translate(mat, mat, [g.x, g.y, 0]);
	mat4.scale(mat, mat, [g.w/38/3, g.h/18/3, 1]);
	var a = g.alpha?g.alpha:1;
	defaultFont.draw((112-w)/2,-2, t, alpha(th.uiText, a), g.viewport.mat, mat);
	t = tr(g.icon), w = defaultFont.calcWidth(t);
	mat4.identity(mat);
	mat4.translate(mat, mat, [g.x, g.y, 0]);
	mat4.scale(mat, mat, [g.w/38/3, g.h/18/3, 1]);
	defaultFont.draw((112-w)/2,16*4+6, t, alpha(th.uiText, a), g.viewport.mat, mat);
}
v.optionClickFunc = function() {
	var g = this, v = g.viewport;
	if (g.icon == '') {
//		transitionTo(qrcodepane, 'max');
		checkoutpages.swipeGad.doSwipe(true);
	} else {
		v.selectedOption = g;
		v.lerpFactor = 0;
		v.anim = true;
		v.queueLayout();
	}
}
v.resetOptions = function() {
	var v = this;
	v.mode = 'select option';
	v.selectedOption = undefined;
	delete cashback.bubbleText;
	v.lerpFactor = 0;
	v.anim = false;
	v.amount.x = -1000;
	v.amount.text = '';
	for (const g of Object.values(v.options)) { g.w = 44; delete g.alpha; }
	v.enableOptions();
	v.queueLayout();
}
for (const option of supportedCurrencies) {
	v.gadgets.push(v.options[option] = g = new vp.Gadget(v));
		g.w = 44; g.h = 21; g.actionFlags = vp.GAF_CLICKABLE;
		g.y = 48;
		g.autoHull();
		g.label = tr('currency');
		g.icon = option;
		g.renderFunc = v.optionRenderFunc;
		g.clickFunc = v.optionClickFunc;
}
v.gadgets.push(v.options['skip'] = g = new vp.Gadget(v));
	g.w = 44; g.h = 21; g.actionFlags = vp.GAF_CLICKABLE;
	g.y = 48;
	g.autoHull();
	g.label = '';
	g.icon = '';
	g.renderFunc = function() {
		var g = this, th = g.viewport === cashback? vendorColors : customerColors;
		var sel = clickTapActive.includes(g.gestureState);
		var t, w;
		const mat = mat4.create();
		t = tr('no'), w = defaultFont.calcWidth(t);
		mat4.identity(mat);
		mat4.translate(mat, mat, [g.x, g.y, 0]);
		mat4.scale(mat, mat, [g.w/38, g.w/38, 1]);
		defaultFont.draw((38-w)/2,14+2, t, sel?th.uiButtonSel:th.uiText, g.viewport.mat, mat);
	}
	g.clickFunc = v.optionClickFunc;
v.gadgets.push(v.amount = g = new vp.Gadget(v));
	g.x = 500+5; g.y = 55; g.w = 139; g.h = 20;
	g.actionFlags = vp.GAF_NUMINPUT | vp.GAF_GONEXT | vp.GAF_CONTEXTMENU;
	g.text = ''; g.label = tr('cash back amount'); g.limitChars = '0123456789';
	g.limitLenFunc = function() { return this.text.replace('.','').length >= 11; }
	Object.defineProperty(g, "currency", {
		get : function () {
			if (this.icon) return this.icon;
			else return config.defaultCurrency;
		}
	});
	g.contextMenuFunc = function() {
		this.cycleCurrency();
	}
	g.cycleCurrency = function() {
		var g = this;
		var i = config.enabledCurrencies.indexOf(g.icon);
		i += 1;
		if (i >= config.enabledCurrencies.length) i = 0;
		g.icon = config.enabledCurrencies[i];
		g.currency = config.enabledCurrencies[i];
		cashback.setRenderFlag(true);
	}
	g.specialKeys = ['*', '$'];
	g.align = 'r';
	g.layoutFunc = function() {
		var g = this, v = g.viewport, s = v.getScale();
		g.W = v.w/s; //g.x = (g.W - g.w) / 2;
		g.H = v.h/s; //g.y = g.h + 5; //(g.H - g.h) / 2 + 50;
		g.autoHull();
	}
	g.renderFunc = v.option.renderFunc;
	g.textBeginFunc = function() {
		var g = this;
		g.viewport.setRenderFlag(true);
	}
	g.textFunc = function() {
		this.viewport.setRenderFlag(true);
	}
	g.textEndFunc = function() {
		this.viewport.setRenderFlag(true);
	}
	g.textPrevFunc = function() { vp.beginInput(this.viewport.option); }
	g.textNextFunc = function() {
		var g = this, v = g.viewport;
		if (this.text.trim() == '') {
			vp.beep();
			vp.beginInput(v.amount);
		} else {
			v.resetOptions();
			v.queueLayout();
		}
	}
	g.specialFunc = function(e) {
		switch (e.key) {
		case '*': this.textNextFunc(); break;
		case '$':	this.cycleCurrency(); break;
		}
	}
v.gadgets.push(v.qty = g = new vp.Gadget(v));
	g.x = 500+149; g.y = 55; g.w = 46; g.h = 20;
	g.actionFlags = vp.GAF_NUMINPUT | vp.GAF_GONEXT;
	g.text = ''; g.label = tr('qty'); g.limitChars = '0123456789.';
	g.limitLenFunc = function() {
		return this.text.replace('.','').length >= (this.text.startsWith('.')?3:4);
	}
	g.align = 'r';
	g.layoutFunc = function() {
		var g = this, v = g.viewport, s = v.getScale();
		g.W = v.w/s; //g.x = (g.W - g.w) / 2;
		g.H = v.h/s; //g.y = g.h + 5; //(g.H - g.h) / 2 + 50;
		g.autoHull();
	}
	g.renderFunc = function() {
		var g = this, v = g.viewport;
		v.option.renderFunc.call(g);
	}
	g.textBeginFunc = function() {
		var g = this, v = g.viewport;
		if (g.text == '' && v.amount.text != '') {
			g.text = '1';
		}
		g.viewport.setRenderFlag(true);
	}
	g.textFunc = function() {
		this.viewport.setRenderFlag(true);
	}
	g.textEndFunc = function() {
		this.viewport.setRenderFlag(true);
	}
	g.textPrevFunc = function() { vp.beginInput(this.viewport.amount); }
	g.textNextFunc = function() {
		var g = this, v = g.viewport;
		if ((v.option.text.trim() != '' || v.amount.text.trim() != ''
		|| v.taxrate.text.trim() != '') && (+this.text) == 0) {
			vp.beep();
			vp.beginInput(v.qty);
		} else {
			vp.beginInput(v.taxrate);
		}
	}
v.gadgets.push(v.taxrate = g = new vp.Gadget(v));
	g.x = 500+200; g.y = 55; g.w = 35; g.h = 20;
	g.actionFlags = vp.GAF_NUMINPUT | vp.GAF_GONEXT;
	g.text = ''; g.label = tr('tax'); g.limitChars = '0123456789';
	g.limitLenFunc = function() { return this.text.length >= 2; }
	g.align = 'r'; g.margin = 12;
	g.autoHull();
	g.renderFunc = v.option.renderFunc;
	g.textBeginFunc = function() {
		var g = this, v = g.viewport;
		if (g.text == '' && v.amount.text != '') {
			g.text = '10';
		}
		g.viewport.setRenderFlag(true);
	}
	g.textFunc = function() {
		this.viewport.setRenderFlag(true);
	}
	g.textEndFunc = function() {
		this.viewport.setRenderFlag(true);
	}
	g.textPrevFunc = function() { vp.beginInput(this.viewport.qty); }
	g.textNextFunc = function() {
		var g = this, v = g.viewport;
		if ((v.option.text.trim() != '' || v.amount.text.trim() != ''
		|| v.qty.text.trim() != '') && this.text.trim() == '') {
			vp.beep();
			vp.beginInput(v.taxrate);
		} else if ((v.qty.text.trim() != '' || v.taxrate.text.trim() != '')
		&& v.amount.text.trim() == '') {
			vp.beep();
			vp.beginInput(v.amount);
		} else {
			var value = v.amount.text.trim();
			if (value != '' && ['$', '€'].includes(v.amount.currency)) {
				value = (v.amount.text * 100).toString();
			}
			var li = new LineItem(
				v.option.text.trim(),
				v.amount.currency, value,
				v.qty.text.trim(),
				v.taxrate.text.trim());
			if (!li.isEmpty()) {
//for (i=0; i<30; i++) {
				invoicepane.invoiceitems.unshift(li);
//}
				invoicepane.setRenderFlag(true);
				v.clearDataEntry();
				vp.beginInput(v.option);
			} else {
				vp.endInput();
				if (invoicepane.invoiceitems.length > 0)
					checkoutpages.swipeGad.doSwipe(true);
			}
		}
	}
v.clearDataEntry = function() {
	this.option.text = '';
	this.amount.currency = config.defaultCurrency;
	this.amount.text = '';
	this.qty.text = '';
	this.taxrate.text = '';
}
v.enabledOptions = function () {
	const o = [], v = this;
	for (const g of Object.values(v.options)) {
		if (g.enabled && g.icon) {
			o.push(g.icon);
		}
	}
	return o;
}
v.enableOptions = function() {
	const v = this;
	for (const g of Object.values(v.options)) {
		if (!(v.mode == 'enter amount')
		&& (!choosemethod.selectedMethod || !(g.icon == choosemethod.selectedMethod.icon))
		&&  !(g.icon == '₿')) {
			g.enabled = true;
		} else {
			g.enabled = false;
		}
	}
}
v.layoutFunc = function() {
	var v = this;
	v.enableOptions();

	// Calculate layout parameters.
	var totalW = 0, totalN = 0;
	for (const g of Object.values(v.options)) if (g.enabled) {
		totalW += g.w;
		totalN += 1;
	}
	var space = totalN > 0? (240 - totalW) / (totalN * 2) : 0;
	var x = 0, f = 0; if (v.lerpFactor) f = v.lerpFactor;
	var right = false, rightShift = 0, leftShift = 0;
	var amount_x = (240 - v.amount.w)/2;

	// Calculate amount to shift left.
	for (const g of Object.values(v.options)) if (g.enabled) {
		if (g === v.selectedOption) { leftShift = x + space; break; }
		x += space + g.w + space;
	}

	// Position the gadgets.
	x = 0;
	for (const g of Object.values(v.options)) if (g.enabled) {
		if (right && rightShift == 0) { rightShift = 240 - (x + space) + space; }
		g.x = x + space + f * (right? rightShift : 5 - leftShift);
		if (g === v.selectedOption) {
			g.x = (x + space) * (1-f) + f * amount_x;
			g.w = 44 * (1-f) + f * v.amount.w;
			g.alpha = (1-f);
		}
		x += space + g.w + space;
		if (g === v.selectedOption) right = true;
	} else {
		g.x = -1000;
	}
	for (const g of v.gadgets) {
		if (g.layoutFunc) g.layoutFunc.call(g);
	}

	// Animate.
	if (v.anim) {
		v.lerpFactor += 0.1;
		if (v.lerpFactor >= 1) {
			v.lerpFactor = 1;
			v.anim = false;
			v.amount.x = amount_x;
			v.mode = 'enter amount';
			vp.beginInput(v.amount);
		}
		v.queueLayout();
	}
}
v.renderFunc = function() {
	const th = vendorColors;
	gl.clearColor(...th.uiBackground);
	gl.clear(gl.COLOR_BUFFER_BIT);

	useProg5();
	gl.enable(gl.BLEND);
	gl.uniform4fv(gl.getUniformLocation(prog5, 'overallColor'),
		new Float32Array([1,1,1,1]));
	gl.uniformMatrix4fv(gl.getUniformLocation(prog5, 'uProjectionMatrix'), false, this.mat);

	const m = mat4.create();
	mat4.identity(m);
	mat4.translate(m, m, [5, 5, 0]);
	mat4.scale(m, m, [10, 10, 1]);
	gl.uniformMatrix4fv(gl.getUniformLocation(prog5, 'uModelViewMatrix'), false, m);
	gl.uniform4fv(gl.getUniformLocation(prog5, 'overallColor'),
		new Float32Array([1,1,1,1]));
	gl.drawArrays(typ5.speech1i, beg5.speech1i, len5.speech1i);
	gl.drawArrays(typ5.speech1o, beg5.speech1o, len5.speech1o);
	gl.drawArrays(typ5.speech1j, beg5.speech1j, len5.speech1j);
	if (!cashback.bubbleText) {
		if (cashback.enabledOptions().includes('₿')) {
			cashback.bubbleText = tr('Would you like money back?');
		} else {
			cashback.bubbleText = tr('Would you like cash back?');
		}
	}
	const t = cashback.bubbleText;
	var w = defaultFont.calcWidth(t);
	mat4.identity(m);
	mat4.translate(m, m, [12.5, 5 + 15, 0]);
	mat4.scale(m, m, [210/w, 210/w, 1]);
	defaultFont.draw(0,7, t, th.uiText, this.mat, m);

	for (const g of this.gadgets) {
		if (g.renderFunc) g.renderFunc.call(g);
	}

/*
	var m = mat4.create();
	var scale = [0.5, 0.5, 1];
	for (const g of this.gadgets) {
		mat4.identity(m);
		mat4.translate(m, m, [g.x + 2, g.y - 2, 0]);
		mat4.scale(m, m, scale);
		defaultFont.draw(0,0, g.label, th.uiTextLabel, this.mat, m);
	}

	if (this === cashback) {
		var e = (this.option.text != ''
					|| this.amount.text != ''
					|| this.qty.text != ''
					|| this.taxrate.text != ''
					|| invoicepane.invoiceitems.length > 0);
		if (e != buttonbar.trashGad.enabled) {
			buttonbar.trashGad.enabled = e;
			buttonbar.setRenderFlag(true);
		}
	}
*/
}
//v.pageFocusFunc = function() {
//console.log(this.name, 'pageFocus');
//	invoicepane.a = customerpane; customerpane.parent = invoicepane;
//	invoicepane.queueLayout();
////	customerpane.setRenderFlag(true);
//}
