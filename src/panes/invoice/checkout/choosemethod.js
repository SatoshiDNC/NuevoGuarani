var choosemethod = v = new vp.View(null);
v.name = Object.keys({choosemethod}).pop();
//v.designFit = [240,80];
v.designHeight = 80;
v.gadgets.push(v.method = g = new vp.Gadget(v));
	g.x = 250+5; g.y = 20; g.w = 230; g.h = 20;
	g.actionFlags = vp.GAF_TEXTINPUT | vp.GAF_GONEXT;
	g.text = ''; g.label = tr('subtotal'); g.autoHull();
	g.renderFunc = function() {
		var g = this, v = g.viewport;
		var sel = vp.getInputGad() === g;
		const th = this.viewport === choosemethod? vendorColors : customerColors;
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
	g.textPrevFunc = function() { vp.beginInput(this.viewport.method); }
	g.textNextFunc = function() { vp.beginInput(this.viewport.unitprice); }
v.methods = {};
v.methodRenderFunc = function() {
	var g = this, th = g.viewport === choosemethod? vendorColors : customerColors;
	var sel = clickTapActive.includes(g.gestureState);
	var c, t, w;
	const mat = mat4.create();
	mat4.identity(mat);
	mat4.translate(mat, mat, [g.x, g.y, 0]);
	mat4.scale(mat, mat, [g.w/38, g.h/18, 0]);
	mat4.translate(mat, mat, [-1, 16, 0]);
	c = (g.icon == '₿') ? th.uiPillOrange : th.uiFiatGreen;
	iconFont.draw(0,0, g.icon,
		sel?th.uiButtonSel:c,
		g.viewport.mat, mat);
	t = tr("cash");
	if (g.icon == '₿') {
			t = tr("instant");
			iconFont.draw(0,0, '🗲',
			sel?th.uiButtonSel:th.uiLightningPurple,
			g.viewport.mat, mat);
	}
	w = defaultFont.calcWidth(t);
	mat4.identity(mat);
	mat4.translate(mat, mat, [g.x, g.y, 0]);
	mat4.scale(mat, mat, [g.w/38/3, g.w/38/3, 1]);
	defaultFont.draw((112-w)/2,-2, t, th.uiText, g.viewport.mat, mat);
	t = tr(g.icon), w = defaultFont.calcWidth(t);
	mat4.identity(mat);
	mat4.translate(mat, mat, [g.x, g.y, 0]);
	mat4.scale(mat, mat, [g.w/38/3, g.w/38/3, 1]);
	defaultFont.draw((112-w)/2,16*4+6, t, th.uiText, g.viewport.mat, mat);
	if (g === g.viewport.selectedMethod) {
		useProg5();
		gl.uniform4fv(gl.getUniformLocation(prog5, 'overallColor'),
			new Float32Array(th.uiTextFocus));
		for (var i=0; i<4; i++) {
			mat4.identity(mat);
			switch (i) {
			case 0: mat4.translate(mat, mat, [g.x-3, g.y-9, 0]);
				mat4.scale(mat, mat, [2, g.h+16, 1]); break;
			case 1: mat4.translate(mat, mat, [g.x-3, g.y-9, 0]);
				mat4.scale(mat, mat, [g.w+6, 2, 1]); break;
			case 2: mat4.translate(mat, mat, [g.x-3, g.y+g.h+7, 0]);
				mat4.scale(mat, mat, [g.w+6, 2, 1]); break;
			case 3: mat4.translate(mat, mat, [g.x+g.w+1, g.y-9, 0]);
				mat4.scale(mat, mat, [2, g.h+16, 1]); break;
			}
			gl.uniformMatrix4fv(gl.getUniformLocation(prog5, 'uModelViewMatrix'), false, mat);
			gl.drawArrays(typ5.rect, beg5.rect, len5.rect);
		}
	}
}
v.methodClickFunc = function() {
	var g = this;
	g.viewport.selectedMethod = g;
	cashback.resetOptions();
	delete checkoutpages.swipeGad.maxX;
	//checkoutpages.swipeGad.doSwipe(true);
	if (cashback.enabledOptions().length > 0) {
		if (checkoutpages.getPageIndex(cashback) === -1)
			checkoutpages.pages.splice(checkoutpages.getPageIndex(choosemethod)+1,0,cashback);
		checkoutpages.toPage(checkoutpages.getPageIndex(cashback));
	} else {
		if (checkoutpages.getPageIndex(cashback) !== -1)
			checkoutpages.pages.splice(checkoutpages.getPageIndex(cashback),1);
		checkoutpages.toPage(checkoutpages.getPageIndex(receivepayment));
	}
}
for (const method of enabledPaymentMethods) {
	v.gadgets.push(v.methods[method] = g = new vp.Gadget(v));
		g.w = 44; g.h = 21; g.actionFlags = vp.GAF_CLICKABLE;
		g.y = 48;
		g.autoHull();
		g.label = tr('currency');
		g.icon = method;
		g.renderFunc = v.methodRenderFunc;
		g.clickFunc = v.methodClickFunc;
}
v.clearDataEntry = function() {
	this.method.text = '';
}
v.layoutFunc = function() {
	var totalW = 0; for (const g of Object.values(this.methods)) totalW += g.w;
	var space = (240 - totalW) / (Object.values(this.methods).length * 2);
	var x = 0;
	for (const g of Object.values(this.methods)) {
		g.x = x + space;
		x += space + g.w + space;
	}
	for (const g of this.gadgets) {
		if (g.layoutFunc) g.layoutFunc.call(g);
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
	const t = tr('How would you like to pay?');
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

	if (this === choosemethod) {
		var e = (this.method.text != ''
					|| this.unitprice.text != ''
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
