var invoicepane;

var accounts;
var startpane2 = v = new vp.View(null);
v.name = Object.keys({startpane2}).pop();
v.designFit = [400,300];
v.gadgets.push(v.invoice = g = new vp.Gadget(v));
	g.w = 250; g.h = 50; g.actionFlags = vp.GAF_CLICKABLE;
	g.text = 'orders';
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
/*
		mat4.identity(mat);
		mat4.translate(mat, mat, [g.x, g.y, 0]);
		mat4.scale(mat, mat, [g.w, g.h, 1]);
		useProg5();
		gl.uniformMatrix4fv(gl.getUniformLocation(prog5, 'uModelViewMatrix'), false, mat);
		gl.uniform4fv(gl.getUniformLocation(prog5, 'overallColor'),
			new Float32Array(sel?vendorColors.uiForeground:vendorColors.uiPillOrange));
		gl.drawArrays(typ5.rect, beg5.rect, len5.rect);
*/
		useProg2();
		gl.uniformMatrix4fv(gl.getUniformLocation(prog2, 'uProjectionMatrix'), false, g.viewport.mat);
		mat4.identity(mat);
		mat4.translate(mat, mat, [g.x, g.y, 0]);
		mat4.scale(mat,mat, [g.h, g.h, 1]);
		gl.uniformMatrix4fv(gl.getUniformLocation(prog2, 'uModelViewMatrix'), false, mat);
		gl.uniform4fv(gl.getUniformLocation(prog2, 'overallColor'),
			new Float32Array(config.themeColors.uiDataEntryText));
		gl.drawArrays(typ2.circle, beg2.circle, len2.circle);
		mat4.identity(mat);
		mat4.translate(mat, mat, [g.x+g.w, g.y, 0]);
		mat4.scale(mat,mat, [-g.h, g.h, 1]);
		gl.uniformMatrix4fv(gl.getUniformLocation(prog2, 'uModelViewMatrix'), false, mat);
		gl.drawArrays(typ2.circle, beg2.circle, len2.circle);
		mat4.identity(mat);
		mat4.translate(mat, mat, [g.x+g.h/2, g.y, 0]);
		mat4.scale(mat,mat, [g.w-g.h, g.h, 1]);
		gl.uniformMatrix4fv(gl.getUniformLocation(prog2, 'uModelViewMatrix'), false, mat);
		gl.drawArrays(typ2.rect, beg2.rect, len2.rect);

		mat4.identity(mat);
		mat4.translate(mat, mat, [g.x, g.y, 0]);
		mat4.scale(mat, mat, [50/32, 50/32, 1]);
		centerText(8,7, 5*32-16,32-14, icap(tr(g.text)), th.uiDataEntryArea, g.viewport.mat, mat);
	}
	g.clickFunc = function() {
		//const pane = layoutsettings.countermode.state? invoicepane: vendorpane;
		billpane.clearData(); // To ensure any new defaults are applied.
		transitionTo(checkoutpane);
	}
/*
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
*/
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

	settingsbuttons.backbutton.endTime = performance.now();
	if (this.timerId) clearTimeout(this.timerId);
	this.timerId = setTimeout(()=>{
//		console.log('stopwatch:',settingsbuttons.backbutton.endTime - settingsbuttons.backbutton.startTime);
	}, 500 );
}

const bottommargin = v = new vp.View(null);
v.name = Object.keys({bottommargin}).pop();
v.renderFunc = function() {
	const th = vendorColors;
	drawThemeBackdrop(this, th);
}

const startpane = v = new vp.SliceView(null, 'b', 50);
v.name = Object.keys({startpane}).pop();
Object.defineProperty(v, "title", {
  get : function () { return config.businessName; }
});
v.a = bottommargin; bottommargin.parent = v;
v.b = startpane2; startpane2.parent = v;
