var invoicepane;

var accounts;
var startpane = v = new vp.View(null);
v.name = Object.keys({startpane}).pop();
v.designFit = [400,300];
Object.defineProperty(v, "title", {
  get : function () { return config.businessName; }
});
v.gadgets.push(v.invoice = g = new vp.Gadget(v));
	g.w = 250; g.h = 50; g.actionFlags = vp.GAF_CLICKABLE;
	g.text = 'bill';
	g.layoutFunc = function() {
		var g = this, v = g.viewport, s = v.getScale();
		g.W = v.w/s; g.x = (g.W - g.w) / 2;
		g.H = v.h/s; g.y = (g.H - g.h) / 2 - 50;
		g.autoHull();
	}
	g.renderFunc = function() {
		var g = this;
		var sel = clickTapActive.includes(g.gestureState);
		const th = vendorColors;
		const mat = mat4.create();
		mat4.identity(mat);
		mat4.translate(mat, mat, [g.x, g.y, 0]);
		mat4.scale(mat, mat, [g.w, g.h, 1]);
		useProg5();
		gl.uniformMatrix4fv(gl.getUniformLocation(prog5, 'uModelViewMatrix'), false, mat);
		gl.uniform4fv(gl.getUniformLocation(prog5, 'overallColor'),
			new Float32Array(sel?vendorColors.uiForeground:vendorColors.uiPillOrange));
		gl.drawArrays(typ5.rect, beg5.rect, len5.rect);
		mat4.identity(mat);
		mat4.translate(mat, mat, [g.x, g.y, 0]);
		mat4.scale(mat, mat, [50/32, 50/32, 1]);
		centerText(8,7, 5*32-16,32-14, tr(g.text), th.uiBackground, g.viewport.mat, mat);
	}
	g.clickFunc = function() {
		const pane = layoutsettings.countermode.state? invoicepane: vendorpane;
		transitionTo(pane, 'max');
	}
v.gadgets.push(v.payment = g = new vp.Gadget(v));
	g.w = 250; g.h = 50; g.actionFlags = vp.GAF_CLICKABLE;
	g.text = 'payment';
	g.layoutFunc = function() {
		var g = this, v = g.viewport, s = v.getScale();
		g.W = v.w/s; g.x = (g.W - g.w) / 2;
		g.H = v.h/s; g.y = (g.H - g.h) / 2 + 50;
		g.autoHull();
	}
	g.renderFunc = v.invoice.renderFunc;
	g.clickFunc = function() {
		transitionTo(paymentpane, 'max');
	}
v.minX = 0; v.maxX = 100;
v.minY = 0; v.maxY = 1000;
v.layoutFunc = function() {
	for (const g of this.gadgets) {
		if (g.layoutFunc) g.layoutFunc.call(g);
	}
}
v.renderFunc = function() {
	const th = vendorColors;
	drawThemeBackdrop(this, th);
	useProg5();
	gl.enable(gl.BLEND);
	gl.uniform4fv(gl.getUniformLocation(prog5, 'overallColor'),
		new Float32Array(th.uiForeground));
	gl.uniformMatrix4fv(gl.getUniformLocation(prog5, 'uProjectionMatrix'), false, this.mat);
	for (const g of this.gadgets) {
		if (g.renderFunc) g.renderFunc.call(g);
	}
}
