
var vendorcustomerdiv = v = new vp.View();
v.name = Object.keys({vendorcustomerdiv}).pop();
v.designScale = 1;
v.gadgets.push(g = v.middleDividerGad = new vp.MiddleDividerGadget(v)); g.z = 1;
v.layoutFunc = function() { this.middleDividerGad.layout(); }
v.renderFunc = function() {
	const th = vendorColors;
	gl.clearColor(...th.uiBackground);
	gl.clear(gl.COLOR_BUFFER_BIT);
	useProg5();
	gl.enable(gl.BLEND);
	const mat = mat4.create();
	mat4.identity(mat);
	gl.uniformMatrix4fv(gl.getUniformLocation(prog5, 'uProjectionMatrix'), false, this.mat);
	mat4.scale(mat, mat, [this.w, this.h, 0]);
	gl.uniformMatrix4fv(gl.getUniformLocation(prog5, 'uModelViewMatrix'), false, mat);
	//gl.drawArrays(typ5.divLine, beg5.divLine, len5.divLine);
	if (this.parent.state == 'v') {
		gl.drawArrays(typ5.divLineV, beg5.divLineV, len5.divLineV);
	} else {
		gl.drawArrays(typ5.divLineH, beg5.divLineH, len5.divLineH);
	}
};

var invoicepane = v = new vp.DividerView(null, 'a', 0.4, 1);
v.name = Object.keys({invoicepane}).pop();
v.invoiceitems = [];
v.a = customerpane; customerpane.parent = v;
v.b = vendorpane; vendorpane.parent = v;
v.c = vendorcustomerdiv; vendorcustomerdiv.parent = v;
v.ratioMin['v'] = 0.25;
v.ratioMax['v'] = 0.75;
v.layoutFunc = function() {
	const v = this, h = v.h/v.getScale();
	if (v.a === customerpane || v.a === customermain) {
		const inflection1 = (v.w/240*49 + v.w/customertitlebar.neededWidth*20) / v.h;
		if (v.state == 'h' && v.ratio < inflection1) {
			v.a = customermain; customermain.parent = v;
			customerpane.parent = undefined;
		} else {
			v.a = customerpane; customerpane.parent = v;
			customermain.parent = customerpane;
		}
	}
}
v.layoutEndFunc = function() {
	var v = this;
	v.ratioMin['h'] = (v.w/240*49) / v.h;
	v.ratioMax['h'] = (v.h - v.w/400*50 - v.w/240*90) / v.h;
}
v.countInvoicesToPay = function() {
	var n = 0;
	for (const li of this.invoiceitems) {
		if (li.invoicetopay) n++;
	}
	return n;
}
v.getSubtotal = function() {
	var subtot = 0;
	for (const li of this.invoiceitems) {
		subtot += cconv(li.unitprice * li.qty, li.currency, config.defaultCurrency);
	}
	return subtot;
}
