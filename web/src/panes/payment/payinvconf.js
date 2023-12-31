var payinvconfbuttonbar = v = new vp.View(null);
v.name = Object.keys({payinvconfbuttonbar}).pop();
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
			g.enabled?(sel?config.themeColors.uiButtonSel:config.themeColors.uiButton):config.themeColors.uiButtonGhost,
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
	g.enabled = false;
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
	g.enabled = false;
	g.renderFunc = v.homeGad.renderFunc;
	g.clickFunc = function() {
    PlatformUtil.UserConfirm(tr("Discard this invoice?"), bool => {
      if (bool) {
        dataentry.clearDataEntry();
        invoicepane.invoiceitems = [];
        invoicepane.setRenderFlag(true);
        checkoutpages.toPage(0);
      }
    })
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
	const th = config.themeColors;
	gl.clearColor(...th.uiBackground);
	gl.clear(gl.COLOR_BUFFER_BIT);
	for (const g of this.gadgets) {
		if (g.renderFunc) g.renderFunc.call(g);
	}
}

var payinvconfmain = v = new vp.View(null);
v.name = Object.keys({payinvconfmain}).pop();
v.designFit = [400, 300];
v.gadgets.push(v.pay = g = new vp.Gadget(v));
	g.w = 250; g.h = 50; g.actionFlags = vp.GAF_CLICKABLE;
	g.text = tr('confirm');
	g.layoutFunc = function() {
		var g = this, v = g.viewport, s = v.getScale();
		g.W = v.w/s; g.x = (g.W - g.w) / 2;
		g.H = v.h/s; g.y = (g.H - g.h) / 2 + 50;
		g.autoHull();
	}
	g.renderFunc = function() {
		var g = this;
		var sel = clickTapActive.includes(g.gestureState);
		const th = config.themeColors;
		const mat = mat4.create();
		mat4.identity(mat);
		mat4.translate(mat, mat, [g.x, g.y, 0]);
		mat4.scale(mat, mat, [g.w, g.h, 1]);
		mainShapes.useProg5();
		gl.uniformMatrix4fv(gl.getUniformLocation(prog5, 'uModelViewMatrix'), false, mat);
		gl.uniform4fv(gl.getUniformLocation(prog5, 'overallColor'),
			new Float32Array(sel?th.uiForeground:th.uiPillOrange));
		mainShapes.drawArrays5('rect');
		mat4.identity(mat);
		mat4.translate(mat, mat, [g.x, g.y, 0]);
		mat4.scale(mat, mat, [50/32, 50/32, 1]);
		centerText(8,7, 5*32-16,32-14, g.text, th.uiBackground, g.viewport.mat, mat);
	}
	g.clickFunc = function() {
		//transitionTo(paymentpane, 'max');
		var root = menudiv, v = paymentpane;
		root.b = v; v.parent = root;
		root.relayout();
		paymentpane.switchedToFunc();
	}
v.layoutFunc = function() {
	for (const g of this.gadgets) {
		if (g.layoutFunc) g.layoutFunc.call(g);
	}
};
v.renderFunc = function() {
	const th = config.themeColors, th2 = customerColors, v = this;
	gl.clearColor(...th.uiBackground);
	gl.clear(gl.COLOR_BUFFER_BIT);
	mainShapes.useProg5();
	gl.uniformMatrix4fv(gl.getUniformLocation(prog5, 'uProjectionMatrix'), false, this.mat);
	for (const g of this.gadgets) {
		if (g.renderFunc) g.renderFunc.call(g);
	}

	var inv = payinvconf.data;

	const re = /^lnbc([0-9]+[munp]).*$/;
	var temp = re.exec(inv);
	if (temp) {
		var amt = temp[1].slice(0, -1);
		switch (temp[1].slice(-1)) {
		case 'm': amt *= 100000; break;
		case 'u': amt *= 100; break;
		case 'n': amt *= 0.1; break;
		case 'p': amt *= 0.0001; break;
		}

    const m = mat4.create();

		var bal = amt; //Math.round(Math.random() * (10 ** (Math.random() * 10)));
		var balstr = lcode != 'en-US' || bal > 9999? bal.toLocaleString(lcode) : bal.toString();
		var balw = defaultFont.calcWidth(balstr) + defaultFont.calcWidth(' sats')/2;
		var tmpw = Math.max(128, balw + 10);

		mat4.identity(m);
		mat4.scale(m, m, [400/tmpw, 400/tmpw, 1]);
		mat4.translate(m, m, [(tmpw/400*this.sw-balw)*0.51, (tmpw/400*this.sh-20)*0.49, 0]);
		defaultFont.draw(0,0, balstr, config.themeColors.uiPillOrange, this.mat, m);
		mat4.scale(m, m, [0.5, 0.5, 1]);
		defaultFont.draw(0,0, ' sats', config.themeColors.uiPillOrange, this.mat, m);

		bal = toFiat(bal);
		if (style == PARAGUAY) {
			balstr = bal.toLocaleString(lcode);
			balstr = tr('about @').replace('@', 'Gs ' + balstr);
		} else {
			if (bal > 9999)
				balstr = bal.toLocaleString(lcode, {
					minimumFractionDigits: 2,
					maximumFractionDigits: 2,
				});
			else
				balstr = bal.toFixed(2);
			balstr = tr('about @').replace('@', '$' + balstr);
		}
		balw = defaultFont.calcWidth(balstr)/2;
		tmpw = Math.max(128, balw + 10);

		mat4.identity(m);
		mat4.scale(m, m, [400/tmpw, 400/tmpw, 1]);
		mat4.translate(m, m, [(tmpw/400*this.sw-balw)*0.51, (tmpw/400*this.sh-20)*0.49+10, 0]);
		mat4.scale(m, m, [0.5, 0.5, 1]);
		defaultFont.draw(0,0, balstr, config.themeColors.uiFiatGreen, this.mat, m);
	}
}

var payinvconf = v = new vp.SliceView(null, 'b', 0.125);
v.name = Object.keys({payinvconf}).pop();
v.prop = true;
v.a = payinvconfbuttonbar; payinvconfbuttonbar.parent = v;
v.b = payinvconfmain; payinvconfmain.parent = v;
v.switchedToFunc = function() {
}

