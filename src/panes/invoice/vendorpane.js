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
		transitionTo(home, 'min');
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
			vendorpane.setRenderFlag(true);
			buttonbar.setRenderFlag(true);
			checkoutpages.toPage(0);
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
}
v.renderFunc = function() {
	const th = vendorColors;
	gl.clearColor(...th.uiBackground);
	gl.clear(gl.COLOR_BUFFER_BIT);
	for (const g of this.gadgets) {
		if (g.renderFunc) g.renderFunc.call(g);
	}
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
v.swipeGad.swipeBeginFuncF = v.swipeGad.swipeBeginFunc;
v.swipeGad.swipeBeginFunc = function(p) {
	var g = this;
	delete this.maxX;
	if (checkoutpages.pages[checkoutpages.index] === dataentry) {
		if (invoicepane.invoiceitems.length == 0) {
			this.maxX = this.viewport.sw * (checkoutpages.index + 1);
		}
	} else if (checkoutpages.pages[checkoutpages.index] === choosemethod) {
		if (!Object.values(choosemethod.methods).includes(choosemethod.selectedMethod)) {
			this.maxX = this.viewport.sw * (checkoutpages.index + 1);
		}
	}
	vp.endInput();
	g.swipeBeginFuncF.call(g, p);
}

v.pages.push(dataentry);
v.pages.push(choosemethod);
/*
if (enabledPaymentMethods.length > 1) v.pages.push(choosemethod);
else {
	var g = choosemethod.methods[enabledPaymentMethods[0]];
	choosemethod.selectedMethod = g;
	delete checkoutpages.swipeGad.maxX;
	cashback.resetOptions();
}
*/
//v.pages.push(cashback);
//v.pages.push(receivepayment);
v.pages.push(lightningqr);
v.pages.push(receiptqr);
//v.pages.push(presentreceipt);
//v.pages.push(extra1);
//v.pages.push(extra2);

v.pageChangeFunc = function() {
	const v = this;
/*
	if (checkoutpages.index < checkoutpages.getPageIndex(receivepayment)
	&&  invoicepane.a != customerpane) {
		invoicepane.a = customerpane; customerpane.parent = invoicepane;
		invoicepane.queueLayout();
	}
*/
	v.idealSize = 90/240;
	if ([receiptqr, lightningqr].includes(checkoutpages.pages[checkoutpages.index])) {
		v.idealSize = 250/240;
	}
	if (v.idealSize != vendormain.sizeH) {
		vendormain.queueLayout();
	}

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

	var y = 16, h = 0, w, t, c, s, d, dir = 1;
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

	var cust = (this === customerinvoice);
	var lang = cust ? customertitlebar.language.lang : lcode;
	if (true) {
		if (cust) y += 16;
		mat4.identity(m); mat4.translate(m, m, [10, y - this.scrollY, 0]);
		defaultFont.draw(0,0, tr('subtotal')+':',
			alpha(th.uiText, 1 - Math.abs(this.scrollY) / 16), this.mat, m);

		mat4.identity(m); mat4.translate(m, m, [10, y - this.scrollY, 0]);
		var subtot = 0;
		s = cust? customertotal.currency.icon : config.defaultCurrency;
		var sk = skip;
		for (const li of invoicepane.invoiceitems) {
			if (skip > 0) { skip -= 1; continue; }
			subtot += dataentry.cconv(li.unitprice * li.qty, li.currency, s);
		}
		skip = sk;
		t = (+subtot).toString();
		if (['$', '€'].includes(s)) {
			t = (t/100).toLocaleString(lang, {minimumFractionDigits:2, maximumFractionDigits:2});
		} else {
			t = (+t).toLocaleString(lang, {maximumFractionDigits:0});
		}
		w = defaultFont.calcWidth(t);
		defaultFont.draw(340-w,0, t,
			alpha(th.uiText, 1 - Math.abs(this.scrollY) / 16), this.mat, m);
		if (currencies.length > 1) {
			d = s; if (d == '₿') d = '🗲';
			c = (s == '₿')? th.uiLightningYellow : th.uiFiatGreen;
			mat4.identity(m); mat4.translate(m, m, [10, y - this.scrollY, 0]);
			defaultFont.draw(340-w-3-defaultFont.calcWidth(d),0, d,
				alpha(c, 1 - Math.abs(this.scrollY) / 16), this.mat, m);
		}

		if (cust) y -= 16;
		//y -= 16;
		y += 32 * dir;
		h += 32;
	}
	for (const li of invoicepane.invoiceitems) {
		if (skip > 0) { skip -= 1; continue; }
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
v.layoutFunc = function() {
	if (checkoutpages.idealSize) {
		var delta = checkoutpages.idealSize - vendormain.sizeH;
		if (delta) {
			var amt = Math.abs(delta) * vendormain.sw;
			if (amt > 10) {
				vendormain.sizeH += delta/2;
				vendormain.sizeV += delta/2;
				vendormain.queueLayout();
			} else {
				vendormain.sizeH = checkoutpages.idealSize;
				vendormain.sizeV = checkoutpages.idealSize;
			}
		}
	}
}

var vendorpane = v = new vp.SliceView(null, 'b', 0.125);
v.name = Object.keys({vendorpane}).pop();
v.prop = true;
v.a = buttonbar; buttonbar.parent = v;
v.b = vendormain; vendormain.parent = v;
