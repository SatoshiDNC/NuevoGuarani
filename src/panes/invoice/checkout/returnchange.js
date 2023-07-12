var returnchange = v = new vp.View(null);
v.name = Object.keys({returnchange}).pop();
//v.designFit = [240,80];
//v.designHeight = 80;
v.gadgets.push(v.change = g = new vp.Gadget(v));
	g.x = 5; g.y = 20; g.w = 230; g.h = 20;
	g.actionFlags = vp.GAF_TEXTINPUT | vp.GAF_GONEXT;
	g.text = ''; g.label = 'change due'; g.autoHull();
	g.renderFunc = function() {
		var g = this, v = g.viewport;
		var sel = vp.getInputGad() === g;
		const th = this.viewport === receivepayment? vendorColors : customerColors;
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
	g.textPrevFunc = function() {
//		vp.beginInput(this.viewport.method);
		checkoutpages.swipeGad.doSwipe(false);
	}
	g.textNextFunc = function() {
		checkoutpages.swipeGad.doSwipe(true);
	}
v.clearDataEntry = function() {
	this.change.text = '';
}
v.layoutFunc = function() {
	for (const g of this.gadgets) {
		if (g.layoutFunc) g.layoutFunc.call(g);
	}
}
v.renderFunc = function(flip = false) {
	// WARNING: This function is re-used by customertotal; "this" may vary!
	const th = this === receivepayment? vendorColors : customerColors;
	gl.clearColor(...th.uiBackground);
	gl.clear(gl.COLOR_BUFFER_BIT);

	if (flip) {
		this.rematrix();
		var s = this.getScale();
		mat4.translate(this.mat, this.mat, [this.sw/2, this.sh/2, 0]);
		mat4.rotate(this.mat, this.mat, Math.PI, [0,0,1]);
		mat4.translate(this.mat, this.mat, [-this.sw/2, -this.sh/2, 0]);
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
		defaultFont.draw(0,0, tr(g.label).toUpperCase(), th.uiTextLabel, this.mat, m);
	}

/*
	if (this === receivepayment) {
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
v.pageFocusFunc = function() {
	returnchange.change.text = (receivepayment.cash.text - invoicepane.getSubtotal()).toString();
	vp.beginInput(returnchange.change);
}
