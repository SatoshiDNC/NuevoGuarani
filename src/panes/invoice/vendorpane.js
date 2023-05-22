
var buttonbar = v = new vp.View(null);
v.name = Object.keys({buttonbar}).pop();
v.designFit = [400,50];
v.gadgets.push(v.homeGad = g = new vp.Gadget(v));
	g.w = 30; g.h = 30; g.actionFlags = vp.GAF_CLICKABLE;
	g.x = (50 - g.w)/2; g.y = (50 - g.h)/2;
	g.autoHull();
	g.icon = "\x00";
	g.renderFunc = function() {
		var g = this;
		var sel = clickTapActive.includes(g.gestureState);
		const mat = mat4.create();
		mat4.identity(mat);
		mat4.translate(mat, mat, [g.x, g.y, 0]);
		mat4.scale(mat, mat, [g.w/18, g.h/18, 0]);
		mat4.translate(mat, mat, [-1, 16, 0]);
		iconFont.draw(0,0, g.icon,
			g.enabled?(sel?vendorColors.uiButtonSel:vendorColors.uiButton):vendorColors.uiButtonGhost,
			g.viewport.mat, mat);
	}
	g.clickFunc = function() {
		transitionTo(startpane, 'min');
	}
v.gadgets.push(v.pushGad = g = new vp.Gadget(v));
	g.w = 30; g.h = 30; g.actionFlags = vp.GAF_CLICKABLE;
	g.x = 50 + (50 - g.w)/2; g.y = (50 - g.h)/2;
	g.autoHull();
	g.icon = "\x01";
	g.renderFunc = v.homeGad.renderFunc;
	g.clickFunc = function() {
		console.log('pushGad');
	}
v.gadgets.push(v.popGad = g = new vp.Gadget(v));
	g.w = 30; g.h = 30; g.actionFlags = vp.GAF_CLICKABLE;
	g.x = 100 + (50 - g.w)/2; g.y = (50 - g.h)/2;
	g.autoHull();
	g.icon = "\x02";
	g.enabled = false;
	g.renderFunc = v.homeGad.renderFunc;
	g.clickFunc = function() {
		console.log('popGad');
	}
v.gadgets.push(v.trashGad = g = new vp.Gadget(v));
	g.w = 30; g.h = 30; g.actionFlags = vp.GAF_CLICKABLE;
	g.x = 150 + (50 - g.w)/2; g.y = (50 - g.h)/2;
	g.autoHull();
	g.icon = "\x03";
	g.renderFunc = v.homeGad.renderFunc;
	g.clickFunc = function() {
		if (window.confirm(tr("Discard this invoice?"))) {
			dataentry.clearDataEntry();
			invoicepane.invoiceitems = [];
			invoicepane.setRenderFlag(true);
		}
	}
v.layoutFunc = function() {
	var totalW = 0; for (const g of this.gadgets) totalW += g.w;
	var space = (this.w / this.getScale() - totalW) / (this.gadgets.length * 2);
	var x = 0;
	for (const g of this.gadgets) {
		g.x = x + space;
		x += space + g.w + space;
	}
};
v.renderFunc = function() {
	const th = vendorColors;
	gl.clearColor(...th.uiBackground);
	gl.clear(gl.COLOR_BUFFER_BIT);
	for (const g of this.gadgets) {
		if (g.renderFunc) g.renderFunc.call(g);
	}
};

var dataentry = v = new vp.View(null);
v.name = Object.keys({dataentry}).pop();
//v.designFit = [240,80];
v.designHeight = 80;
v.gadgets.push(v.item = g = new vp.Gadget(v));
	g.x = 5; g.y = 20; g.w = 230; g.h = 20;
	g.actionFlags = vp.GAF_TEXTINPUT | vp.GAF_GONEXT;
	g.text = ''; g.label = tr('item'); g.autoHull();
	g.renderFunc = function() {
		var g = this, v = g.viewport;
		var sel = vp.getInputGad() === g;
		const th = this.viewport === dataentry? vendorColors : customerColors;
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
		if (sel) {
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
		if (g === v.unitprice) {
			var s = v.unitprice.currency;
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
	g.textPrevFunc = function() { vp.beginInput(this.viewport.item); }
	g.textNextFunc = function() { vp.beginInput(this.viewport.unitprice); }
/*
v.gadgets.push(v.currency = g = new vp.Gadget(v));
	g.w = 42; g.h = 21; g.actionFlags = vp.GAF_CLICKABLE;
	g.x = 4; g.y = 55;
	g.autoHull();
	g.label = tr('currency');
	g.icon = defaultVendorCurrency;
	g.renderFunc = function() {
		var g = this, th = g.parent === dataentry? vendorColors : customerColors;
		var sel = clickTapActive.includes(g.gestureState);
		const mat = mat4.create();
		mat4.identity(mat);
		mat4.translate(mat, mat, [g.x, g.y, 0]);
		mat4.scale(mat, mat, [g.w/36, g.h/18, 0]);
		mat4.translate(mat, mat, [-1, 16, 0]);
		c = (g.icon == '₿') ? th.uiPillOrange : th.uiFiatGreen;
		iconFont.draw(0,0, g.icon,
			sel?th.uiButtonSel:c,
			g.viewport.mat, mat);
		if (g.icon == '₿') {
			iconFont.draw(0,0, '🗲',
				sel?th.uiButtonSel:th.uiLightningPurple,
				g.viewport.mat, mat);
		}
	}
	g.clickFunc = function() {
		this.viewport.unitprice.cycleCurrency();
	}
*/
v.gadgets.push(v.unitprice = g = new vp.Gadget(v));
	g.x = 5; g.y = 55; g.w = 139; g.h = 20;
	g.actionFlags = vp.GAF_NUMINPUT | vp.GAF_GONEXT | vp.GAF_CONTEXTMENU;
	g.text = ''; g.label = tr('price'); g.limitChars = '0123456789';
	g.limitLenFunc = function() { return this.text.replace('.','').length >= 11; }
	g.currency = defaultVendorCurrency;
	g.contextMenuFunc = function() {
		this.cycleCurrency();
	}
	g.cycleCurrency = function() {
		var g = this;
		var i = enabledVendorCurrencies.indexOf(g.icon);
		i += 1;
		if (i >= enabledVendorCurrencies.length) i = 0;
		g.icon = enabledVendorCurrencies[i];
		g.viewport.unitprice.currency = enabledVendorCurrencies[i];
		dataentry.setRenderFlag(true);
	}
	g.specialKeys = ['*', '$'];
	g.align = 'r';
	g.layoutFunc = function() {
		var g = this, v = g.viewport, s = v.getScale();
		g.W = v.w/s; //g.x = (g.W - g.w) / 2;
		g.H = v.h/s; //g.y = g.h + 5; //(g.H - g.h) / 2 + 50;
		g.autoHull();
	}
	g.renderFunc = v.item.renderFunc;
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
	g.textPrevFunc = function() { vp.beginInput(this.viewport.item); }
	g.textNextFunc = function() {
		var g = this, v = g.viewport;
		if ((v.item.text.trim() != '' || v.qty.text.trim() != ''
		|| v.taxrate.text.trim() != '') && this.text.trim() == '') {
			vp.beep();
			vp.beginInput(v.unitprice);
		} else {
			vp.beginInput(v.qty);
		}
	}
	g.specialFunc = function(e) {
		switch (e.key) {
		case '*': this.textNextFunc(); break;
		case '$':	this.cycleCurrency(); break;
		}
	}
v.gadgets.push(v.qty = g = new vp.Gadget(v));
	g.x = 149; g.y = 55; g.w = 46; g.h = 20;
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
		v.item.renderFunc.call(g);
	}
	g.textBeginFunc = function() {
		var g = this, v = g.viewport;
		if (g.text == '' && v.unitprice.text != '') {
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
	g.textPrevFunc = function() { vp.beginInput(this.viewport.unitprice); }
	g.textNextFunc = function() {
		var g = this, v = g.viewport;
		if ((v.item.text.trim() != '' || v.unitprice.text.trim() != ''
		|| v.taxrate.text.trim() != '') && (+this.text) == 0) {
			vp.beep();
			vp.beginInput(v.qty);
		} else {
			vp.beginInput(v.taxrate);
		}
	}
v.gadgets.push(v.taxrate = g = new vp.Gadget(v));
	g.x = 200; g.y = 55; g.w = 35; g.h = 20;
	g.actionFlags = vp.GAF_NUMINPUT | vp.GAF_GONEXT;
	g.text = ''; g.label = tr('tax'); g.limitChars = '0123456789';
	g.limitLenFunc = function() { return this.text.length >= 2; }
	g.align = 'r'; g.margin = 12;
	g.autoHull();
	g.renderFunc = v.item.renderFunc;
	g.textBeginFunc = function() {
		var g = this, v = g.viewport;
		if (g.text == '' && v.unitprice.text != '') {
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
		if ((v.item.text.trim() != '' || v.unitprice.text.trim() != ''
		|| v.qty.text.trim() != '') && this.text.trim() == '') {
			vp.beep();
			vp.beginInput(v.taxrate);
		} else if ((v.qty.text.trim() != '' || v.taxrate.text.trim() != '')
		&& v.unitprice.text.trim() == '') {
			vp.beep();
			vp.beginInput(v.unitprice);
		} else {
			var value = v.unitprice.text.trim();
			if (value != '' && ['$', '€'].includes(v.unitprice.currency)) {
				value = (v.unitprice.text * 100).toString();
			}
			var li = new LineItem(
				v.item.text.trim(),
				v.unitprice.currency, value,
				v.qty.text.trim(),
				v.taxrate.text.trim());
			if (!li.isEmpty()) {
				v.setConversionRates();
//for (i=0; i<30; i++) {
				invoicepane.invoiceitems.unshift(li);
//}
				invoicepane.setRenderFlag(true);
				v.clearDataEntry();
				vp.beginInput(v.item);
			} else {
				vp.endInput();
				if (invoicepane.invoiceitems.length > 0)
					checkoutpages.swipeGad.doSwipe(true);
			}
		}
	}
v.setConversionRates = function() {
	this.conv = JSON.parse(JSON.stringify(conversionRates));
}
v.cconv = function(a, f, t) {
	return Math.ceil(a * this.conv[f][t]);
}
v.clearDataEntry = function() {
	this.item.text = '';
	this.unitprice.currency = defaultVendorCurrency;
	this.unitprice.text = '';
	this.qty.text = '';
	this.taxrate.text = '';
}
v.layoutFunc = function() {
	for (const g of this.gadgets) {
		if (g.layoutFunc) g.layoutFunc.call(g);
	}
}
v.renderFunc = function(flip = false) {
	// WARNING: This function is re-used by customertotal; "this" may vary!
	const th = this === dataentry? vendorColors : customerColors;
	gl.clearColor(...th.uiBackground);
	gl.clear(gl.COLOR_BUFFER_BIT);

	if (flip) {
		this.rematrix();
		var s = this.getScale();
		mat4.translate(this.mat, this.mat, [this.sw/2, this.sh/2, 0]);
		mat4.rotate(this.mat, this.mat, Math.PI, [0,0,1]);
		mat4.translate(this.mat, this.mat, [-this.sw/2, -this.sh/2, 0]);
		y = this.sh - 18; dir = -1;
	}

	useProg5();
	gl.enable(gl.BLEND);
	gl.uniform4fv(gl.getUniformLocation(prog5, 'overallColor'),
		new Float32Array(th.uiTextLabel));
	gl.uniformMatrix4fv(gl.getUniformLocation(prog5, 'uProjectionMatrix'), false, this.mat);

	for (const g of this.gadgets) {
		if (g.renderFunc) g.renderFunc.call(g);
	}

  var m = mat4.create();
	var scale = [0.5, 0.5, 1];
	for (const g of this.gadgets) {
		mat4.identity(m);
		mat4.translate(m, m, [g.x + 2, g.y - 2, 0]);
		mat4.scale(m, m, scale);
		defaultFont.draw(0,0, g.label, th.uiTextLabel, this.mat, m);
	}

	if (this === dataentry) {
		var e = (this.item.text != ''
					|| this.unitprice.text != ''
					|| this.qty.text != ''
					|| this.taxrate.text != ''
					|| invoicepane.invoiceitems.length > 0);
		if (e != buttonbar.trashGad.enabled) {
			buttonbar.trashGad.enabled = e;
			buttonbar.setRenderFlag(true);
		}
	}
}

var receivepayment = v = new vp.View(null);
v.name = Object.keys({receivepayment}).pop();
v.renderFunc = function() {
	gl.clearColor(1,0,0, 1);
	gl.clear(gl.COLOR_BUFFER_BIT);
}

var extra1 = v = new vp.View(null);
v.name = Object.keys({extra1}).pop();
v.renderFunc = function() {
	gl.clearColor(0,1,0, 1);
	gl.clear(gl.COLOR_BUFFER_BIT);
}

var extra2 = v = new vp.View(null);
v.name = Object.keys({extra2}).pop();
v.renderFunc = function() {
	gl.clearColor(0,0,1, 1);
	gl.clear(gl.COLOR_BUFFER_BIT);
}

var checkoutpages = v = new vp.PagesView(null, 'h');
v.name = Object.keys({checkoutpages}).pop();
v.swipeGad.z = -1;
v.pages.push(dataentry);
v.pages.push(receivepayment);
v.pages.push(extra1);
v.pages.push(extra2);
v.pageChangeFunc = function() {
	checkoutprogress.setRenderFlag(true);
}

var checkoutprogress = v = new vp.View(null);
v.name = Object.keys({checkoutprogress}).pop();
v.renderFunc = function() {
	const th = vendorColors;
	gl.clearColor(...th.uiBackground);
	gl.clear(gl.COLOR_BUFFER_BIT);
	var m = mat4.create(), icon = '.', sp = 5;
	mat4.identity(m); mat4.translate(m, m, [(this.w/this.getScale() - sp - (defaultFont.calcWidth(icon) + sp) * checkoutpages.pages.length)/2, 4, 0]);

	for (i=0; i<checkoutpages.pages.length; i++) {
	  defaultFont.draw(sp,0, icon, i==checkoutpages.index?th.uiText:th.uiButtonGhost, this.mat, m);
	}
}

var checkoutsteps = v = new vp.SliceView(null, 'b', 10);
v.name = Object.keys({checkoutsteps}).pop();
v.designWidth = 240;
v.a = checkoutprogress; checkoutprogress.parent = v;
v.b = checkoutpages; checkoutpages.parent = v;

var vendorinvoice = v = new vp.View(null);
v.name = Object.keys({vendorinvoice}).pop();
v.designWidth = 400;
v.minX = 0; v.maxX = 400;
v.minY = 0; v.maxY = 32;
v.gadgets.push(v.swipeGad = new vp.SwipeGadget(v));
v.swipeGad.actionFlags = vp.GAF_SWIPEABLE_UPDOWN | vp.GAF_SCROLLABLE_UPDOWN;
v.layoutFunc = function() {
	this.swipeGad.layout.call(this.swipeGad);
};
//var scrollbar;
v.renderFunc = function(flip = false) {
	// WARNING: This is called by customerinvoice also, so "this" may be either!
	const th = this === vendorinvoice? vendorColors : customerColors;
	var /*g = scrollbar.knobGad,*/ s = this.getScale();
//	g.shown = this.h/this.getScale();
//  g.total = this.maxY;
//  g.start = this.userY;
//	g.viewport.relayout();
	//g.viewport.setRenderFlag(true);

	gl.clearColor(...th.uiBackground);
	gl.clear(gl.COLOR_BUFFER_BIT);
	if (flip && !customerpane.parent) return;

	var y = 16, h = 0, w, t, c, s, dir = 1;
	if (flip) {
		y = this.h/s - 18; dir = -1;
	}

	var skip = 0;
	if (this.scrollY == undefined) this.scrollY = 0;
	if (this.countN == undefined) this.countN = 0;
	if (this.countN < invoicepane.invoiceitems.length) {
		this.scrollY += dir * 2;
		if (Math.abs(this.scrollY) >= 32) {
			this.scrollY = 0;
			this.countN += 1;
		}
		y += this.scrollY;
		skip = invoicepane.invoiceitems.length - this.countN;
		this.setRenderFlag(true);
	}

	useProg5();
	this.rematrix();
  var m = mat4.create();
	gl.uniformMatrix4fv(gl.getUniformLocation(prog5, 'uProjectionMatrix'), false, this.mat);
	gl.uniform4fv(gl.getUniformLocation(prog5, 'overallColor'), new Float32Array([1,1,1,1]));
	mat4.identity(m);
	if (flip) {
		mat4.translate(m, m, [0, 1 - this.scrollY, 0]);
		mat4.scale(m, m, [this.sw, 32, 1]);
		mat4.translate(m, m, [0, Math.floor(this.userY / 32), 0]);
	} else {
		mat4.translate(m, m, [0, 1 + this.scrollY, 0]);
		mat4.scale(m, m, [this.sw, -32, 1]);
		mat4.translate(m, m, [0, -1 - Math.floor(this.sh / 32) - Math.floor(this.userY / 32), 0]);
	}
	var typ5o, beg5o, len5o;
	if (this === vendorinvoice) {
		typ5o = typ5.vendorLedger; beg5o = beg5.vendorLedger; len5o = len5.vendorLedger;
	} else {
		typ5o = typ5.customerLedger, beg5o = beg5.customerLedger, len5o = len5.customerLedger;
	}
	for (var i=0; i<=this.sh/32; i++) {
		gl.uniformMatrix4fv(gl.getUniformLocation(prog5, 'uModelViewMatrix'), false, m);
		gl.drawArrays(typ5o, beg5o, len5o);
		mat4.translate(m, m, [0, 1, 0]);
	}

	if (flip) {
		this.rematrix();
		var s = this.getScale();
		mat4.translate(this.mat, this.mat, [this.w/2/s, this.h/2/s, 0]);
		mat4.rotate(this.mat, this.mat, Math.PI, [0,0,1]);
		mat4.translate(this.mat, this.mat, [-this.w/2/s, -this.h/2/s, 0]);
	}

	var currencies = [];
	for (const li of invoicepane.invoiceitems) {
		if (!currencies.includes(li.currency)) currencies.push(li.currency);
	}
	if (!currencies.includes(customertotal.currency.icon))
		currencies.push(customertotal.currency.icon);
	for (const li of invoicepane.invoiceitems) {
		if (skip > 0) { skip -= 1; continue; }
		var cust = (this === customerinvoice);
		lang = cust ? customertitlebar.language.lang : lcode;
		s = cust? customertotal.currency.icon : li.currency;
		d = s; if (d == '₿') d = '🗲';
		c = (s == '₿')? th.uiLightningYellow : th.uiFiatGreen;
		//	'⃀' temporary approximately equal sign
		mat4.identity(m); mat4.translate(m, m, [10, y, 0]);
		defaultFont.draw(0,0, li.item.toUpperCase(), th.uiText, this.mat, m);
		y += 16;
		mat4.identity(m); mat4.translate(m, m, [10, y, 0]);
		if (li.qty.includes('.')) {
			t = (+li.qty).toLocaleString(lang,
				{minimumFractionDigits:3, maximumFractionDigits:3}); w = defaultFont.calcWidth(t);
		} else {
			t = parseInt(li.qty).toString(); w = defaultFont.calcWidth(t);
		}
		defaultFont.draw(36-w,0, t + ' ×', th.uiText, this.mat, m);
		mat4.identity(m); mat4.translate(m, m, [10, y, 0]);
		t = (+dataentry.cconv(li.unitprice, li.currency, s)).toString();
		if (['$', '€'].includes(s)) {
			t = (t/100).toLocaleString(lang, {minimumFractionDigits:2, maximumFractionDigits:2});
		} else {
			t = (+t).toLocaleString(lang, {maximumFractionDigits:0});
		}
		w = defaultFont.calcWidth(t);
		defaultFont.draw(180-w,0, t, th.uiText, this.mat, m);
		if (currencies.length > 1) {
			mat4.identity(m); mat4.translate(m, m, [10, y, 0]);
			defaultFont.draw(180-w-3-defaultFont.calcWidth(d),0, d, c, this.mat, m);
		}
		mat4.identity(m); mat4.translate(m, m, [10, y, 0]);
		t = (dataentry.cconv(li.unitprice * li.qty, li.currency, s).toString());
		if (['$', '€'].includes(s)) {
			t = (t/100).toLocaleString(lang, {minimumFractionDigits:2, maximumFractionDigits:2});
		} else {
			t = (+t).toLocaleString(lang, {maximumFractionDigits:0});
		}
		w = defaultFont.calcWidth(t);
		defaultFont.draw(340-w,0, t, th.uiText, this.mat, m);
		if (currencies.length > 1) {
			mat4.identity(m); mat4.translate(m, m, [10, y, 0]);
			defaultFont.draw(340-w-3-defaultFont.calcWidth(d),0, d, c, this.mat, m);
		}
		mat4.identity(m); mat4.translate(m, m, [10, y, 0]);
		t = +li.taxrate + '%'; w = defaultFont.calcWidth(t);
		defaultFont.draw(380-w,0, t, th.uiText, this.mat, m);
		y -= 16;
		y += 32 * dir;
		h += 32;
	}
	this.maxY = h + Math.abs(this.scrollY);
	this.swipeGad.layout.call(this.swipeGad);
};

var vendormain = v = new vp.SliceView(null, 't', 90/240);
v.name = Object.keys({vendormain}).pop();
v.prop = true;
v.a = checkoutsteps; checkoutsteps.parent = v;
v.b = vendorinvoice; vendorinvoice.parent = v;

var vendorpane = v = new vp.SliceView(null, 'b', 0.125);
v.name = Object.keys({vendorpane}).pop();
v.prop = true;
v.a = buttonbar; buttonbar.parent = v;
v.b = vendormain; vendormain.parent = v;
