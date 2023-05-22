var invoicepane;

	var startpane = v = new vp.View(null);
	v.name = Object.keys({startpane}).pop();
	v.designFit = [400,300];
	v.gadgets.push(v.hamburger = g = new vp.Gadget(v));
		g.w = 30; g.h = 30 * 0.618; g.actionFlags = vp.GAF_CLICKABLE;
		g.x = (50 - g.w)/2; g.y = (50 - g.h)/2;
		g.autoHull();
		g.renderFunc = function() {
			var g = this;
			const mat = mat4.create();
			mat4.identity(mat);
			mat4.translate(mat, mat, [g.x, g.y, 0]);
			mat4.scale(mat, mat, [g.w, g.h, 0]);
			useProg5();
			gl.uniformMatrix4fv(gl.getUniformLocation(prog5, 'uModelViewMatrix'), false, mat);
			gl.drawArrays(typ5.hamburger, beg5.hamburger, len5.hamburger);
		}
	v.gadgets.push(v.maximizer = g = new vp.Gadget(v));
		g.w = 30; g.h = 30; g.actionFlags = vp.GAF_CLICKABLE;
		g.x = (50 - g.w)/2; g.y = (50 - g.h)/2;
		g.autoHull();
		g.layoutFunc = function() {
			var g = this, v = g.viewport, s = v.getScale();
			g.x = v.w/s - g.w - (50 - g.w)/2;
		}
		g.renderFunc = function() {
			var g = this;
			const mat = mat4.create();
			mat4.identity(mat);
			mat4.translate(mat, mat, [g.x, g.y, 0]);
			mat4.scale(mat, mat, [g.w, g.h, 0]);
			useProg2();
			gl.uniformMatrix4fv(gl.getUniformLocation(prog2, 'uProjectionMatrix'), false, g.viewport.mat);
			gl.uniform4fv(gl.getUniformLocation(prog2, 'overallColor'),
				new Float32Array(vendorColors.uiForeground));
			gl.uniformMatrix4fv(gl.getUniformLocation(prog2, 'uModelViewMatrix'), false, mat);
			gl.drawArrays(typ2.maximizer, beg2.maximizer, len2.maximizer);
		}
		g.clickFunc = function() {
			fullscreen.toggle();
		}
	v.gadgets.push(v.invoice = g = new vp.Gadget(v));
		g.w = 250; g.h = 50; g.actionFlags = vp.GAF_CLICKABLE;
		g.text = tr('bill');
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
			centerText(8,7, 5*32-16,32-14, g.text, th.uiBackground, g.viewport.mat, mat);
		}
		g.clickFunc = function() {
			transitionTo(invoicepane, 'max');
		}
	v.gadgets.push(v.payment = g = new vp.Gadget(v));
		g.w = 250; g.h = 50; g.actionFlags = vp.GAF_CLICKABLE;
		g.text = tr('pay');
		g.layoutFunc = function() {
			var g = this, v = g.viewport, s = v.getScale();
			g.W = v.w/s; g.x = (g.W - g.w) / 2;
			g.H = v.h/s; g.y = (g.H - g.h) / 2 + 50;
			g.autoHull();
		}
		g.renderFunc = v.invoice.renderFunc;
		g.clickFunc = function() {
			transitionTo(invoicepane, 'max');
		}
	v.minX = 0; v.maxX = 100;
	v.minY = 0; v.maxY = 1000;
	v.layoutFunc = function() {
//		this.swipeGad.layout.call(this.swipeGad);
		for (const g of this.gadgets) {
			if (g.layoutFunc) g.layoutFunc.call(g);
		}
	}
//	var scrollbar;
	v.renderFunc = function() {
		var /*g = scrollbar.knobGad,*/ s = this.getScale();
//		g.shown = this.h/this.getScale();
//    g.total = this.maxY;
//    g.start = this.userY;
//		g.viewport.relayout();
		//g.viewport.setRenderFlag(true);
		const th = vendorColors;
		gl.clearColor(...th.uiBackground);
		gl.clear(gl.COLOR_BUFFER_BIT);
		useProg5();
		gl.enable(gl.BLEND);
		gl.uniform4fv(gl.getUniformLocation(prog5, 'overallColor'),
			new Float32Array(th.uiForeground));
		gl.uniformMatrix4fv(gl.getUniformLocation(prog5, 'uProjectionMatrix'), false, this.mat);
		for (const g of this.gadgets) {
			if (g.renderFunc) g.renderFunc.call(g);
		}
/*
		var tmpw;
    var m = mat4.create();

		bal = Math.round(Math.random() * (10 ** (Math.random() * 10)));
		balstr = lcode != 'en-US' || bal > 9999? bal.toLocaleString(lcode) : bal.toString();
		balw = defaultFont.calcWidth(balstr) + defaultFont.calcWidth(' sats')/2;
		tmpw = Math.max(128, balw + 10);

		mat4.identity(m);
		mat4.scale(m, m, [400/tmpw, 400/tmpw, 1]);
		mat4.translate(m, m, [(tmpw/400*this.w/s-balw)*0.51, (tmpw/400*this.h/s-20)*0.49, 0]);
		defaultFont.draw(0,0, balstr, vendorColors.uiPillOrange, this.mat, m);
		mat4.scale(m, m, [0.5, 0.5, 1]);
		defaultFont.draw(0,0, ' sats', vendorColors.uiPillOrange, this.mat, m);

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
		mat4.translate(m, m, [(tmpw/400*this.w/s-balw)*0.51, (tmpw/400*this.h/s-20)*0.49+10, 0]);
		mat4.scale(m, m, [0.5, 0.5, 1]);
		defaultFont.draw(0,0, balstr, vendorColors.uiFiatGreen, this.mat, m);
*/
	};
//	v.gadgets.push(v.swipeGad = new vp.SwipeGadget(v));
//	v.swipeGad.actionFlags = vp.GAF_SWIPEABLE_UPDOWN | vp.GAF_SCROLLABLE_UPDOWN;
