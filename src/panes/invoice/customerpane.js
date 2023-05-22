var invoicepane, customerpane, customertotal;

var customertitlebar = v = new vp.View(null);
v.name = Object.keys({customertitlebar}).pop();
v.label = tr('Customer Bill')+' '; // Space ensures init.
v.gadgets.push(v.language = g = new vp.Gadget(v));
	g.actionFlags = vp.GAF_CLICKABLE;
	g.lang = defaultCustomerLang;
	g.clickFunc = function() {
		var g = this;
		var i = enabledCustomerLangs.indexOf(g.lang);
		i += 1;
		if (i >= enabledCustomerLangs.length) i = 0;
		g.lang = enabledCustomerLangs[i];
		g.viewport.label += ' ';
		customertitlebar.requeueLayout();
		customerpane.setRenderFlag(true);
	}
v.skipUpdate = false;
v.layoutFunc = function() {
	var v = this;
	var label = tr('Customer Bill', customertitlebar.language.lang);
	if (label != v.label && customertotal) {
		v.label = label;
		v.neededWidth = defaultFont.calcWidth(v.label)+8;
		v.designWidth = v.neededWidth;
		customerpane.sizeH = customerpane.sizeV = 18/v.neededWidth;
		customerpane.requeueLayout();
		v.skipUpdate = true;
	}
	var g = v.language;
	g.w = v.sw; g.h = v.sh;
	g.autoHull();
}
v.renderFunc = function() {
	const th = customerColors;
	var v = this;
	gl.clearColor(...th.uiBackground);
	gl.clear(gl.COLOR_BUFFER_BIT);
	if (!v.skipUpdate) {
		var m = mat4.create(); mat4.identity(m);
		mat4.translate(m, m, [v.sw/2, v.sh/2, 0]);
		mat4.rotate(m, m, Math.PI, [0,0,1]);
		mat4.translate(m, m, [-v.sw/2, -v.sh/2, 0]);
		defaultFont.draw(4,16, v.label, th.uiText, v.mat, m);
	}
	if (v.skipUpdate) {
		v.skipUpdate = false;
		v.setRenderFlag(true);
	}
};

var customerinvoice = v = new vp.View(null);
v.name = Object.keys({customerinvoice}).pop();
v.designWidth = 400;
v.minX = 0; v.maxX = 400;
v.minY = 0; v.maxY = 32;
v.gadgets.push(v.swipeGad = new vp.SwipeGadget(v));
v.swipeGad.actionFlags = vp.GAF_SWIPEABLE_UPDOWN | vp.GAF_SCROLLABLE_UPDOWN;
v.layoutFunc = function() {
	this.swipeGad.layout.call(this.swipeGad);
};
v.renderFunc = function() {
	vendorinvoice.renderFunc.call(customerinvoice, true);
};

var customertotal = v = new vp.View(null);
v.name = Object.keys({customertotal}).pop();
v.designFit = [240,32];
v.gadgets.push(v.currency = g = new vp.Gadget(v));
	g.w = 42; g.h = 21; g.actionFlags = vp.GAF_CLICKABLE;
	g.x = 4; g.y = 19;
	g.autoHull();
	g.label = tr('currency');
	g.icon = defaultCustomerCurrency;
	g.renderFunc = function() {
		var g = this, th = customerColors;
		g.label = tr('currency', customertitlebar.language.lang);
		var sel = clickTapActive.includes(g.gestureState);
		const mat = mat4.create();
		mat4.identity(mat);
		mat4.translate(mat, mat, [g.x, g.y, 0]);
		mat4.scale(mat, mat, [g.w/36, g.h/18, 0]);
		mat4.translate(mat, mat, [-1, 16, 0]);
		c = (g.icon == '₿') ? th.uiPillOrange : th.uiFiatGreen;
		iconFont.draw(0,0, g.icon, sel?th.uiButtonSel:c, g.viewport.mat, mat);
		if (g.icon == '₿') {
			iconFont.draw(0,0, '🗲',
				sel?th.uiButtonSel:th.uiLightningPurple, g.viewport.mat, mat);
		}
	}
	g.clickFunc = function() {
		var g = this;
		var i = enabledCustomerCurrencies.indexOf(g.icon);
		i += 1;
		if (i >= enabledCustomerCurrencies.length) i = 0;
		g.icon = enabledCustomerCurrencies[i];
		invoicepane.setRenderFlag(true);
	}
	g.getHitsF = g.getHits;
	g.getHits = function(hitList, radius) {
		var g = this, v = g.viewport;
		var hl = new vp.HitList(v.w - hitList.x, v.h - hitList.y);
		this.viewport.currency.getHitsF.call(this, hl, radius);
		while (hl.hits.length) hitList.hits.push(hl.hits.pop());
	}
v.gadgets.push(v.subtotal = g = new vp.Gadget(v));
	g.x = 53; g.y = 19; g.w = 240 - g.x - 5; g.h = 20;
	g.text = '0'; g.label = tr('subtotal');
	g.align = 'r';
	g.autoHull();
	g.renderFunc = function() {
		var g = this, v = g.viewport;
		g.label = tr('subtotal', customertitlebar.language.lang);
		var subtotal = 0;
		var lang = customertitlebar.language.lang;
		var s = customertotal.currency.icon;
		var d = s; if (d == '₿') d = '🗲';
		var c = (s == '₿')? customerColors.uiLightningYellow : customerColors.uiFiatGreen;
		for (const li of invoicepane.invoiceitems) {
			//	'⃀' temporary approximately equal sign
			subtotal += dataentry.cconv(li.qty * li.unitprice, li.currency, s);
		}

		var t = subtotal, w, m = mat4.create();
		if (['$', '€'].includes(s)) {
			t = (t/100).toLocaleString(lang, {minimumFractionDigits:2, maximumFractionDigits:2});
		} else {
			t = (+t).toLocaleString(lang, {maximumFractionDigits:0});
		}
		g.text = '';
		dataentry.item.renderFunc.call(g);

		w = defaultFont.calcWidth(t);
		mat4.identity(m); mat4.translate(m, m, [g.x + g.w - 2, g.y + 16, 0]);
		defaultFont.draw(-w,0, t, customerColors.uiText, v.mat, m);
		mat4.identity(m); mat4.translate(m, m, [g.x + g.w - 2, g.y + 16, 0]);
		defaultFont.draw(-w-3-defaultFont.calcWidth(d),0, d, c, v.mat, m);
	}
v.layoutFunc = function() {
}
v.renderFunc = v.renderFunc = function() {
	dataentry.renderFunc.call(this, true);
}

var customermain = v = new vp.SliceView(null, 't', 49/240);
v.name = Object.keys({customermain}).pop();
v.prop = true;
v.a = customertotal; customertotal.parent = v;
v.b = customerinvoice; customerinvoice.parent = v;

var customerpane = v = new vp.SliceView(null, 'b', 0.125);
v.name = Object.keys({customerpane}).pop();
v.prop = true;
v.a = customertitlebar; customertitlebar.parent = v;
v.b = customermain; customermain.parent = v;
