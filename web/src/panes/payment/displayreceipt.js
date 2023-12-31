var pmtrcptbuttonbar = v = new vp.View(null);
v.name = Object.keys({pmtrcptbuttonbar}).pop();
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
console.log('home');
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

var pmtrcptmain = v = new vp.View(null);
v.name = Object.keys({pmtrcptmain}).pop();
v.designWidth = 460;
v.backgroundDisabled = false;
v.lastH = 0;
v.minX = 0; v.maxX = v.designWidth;
v.minY = 0; v.maxY = 1000;
v.gadgets.push(v.swipeGad = new vp.SwipeGadget(v));
v.swipeGad.actionFlags = vp.GAF_SWIPEABLE_UPDOWN | vp.GAF_SCROLLABLE_UPDOWN;
v.layoutFunc = function() {
	this.swipeGad.layout.call(this.swipeGad);
	if (this.sh != this.lastH) {
		this.lastH = this.sh;
		this.backgroundDisabled = false;
	}
};
v.renderFunc = function() {
	const th = config.themeColors, th2 = customerColors, v = this;
	if (this.backgroundDisabled) {
		gl.clearColor(...th.uiBackground);
		gl.clear(gl.COLOR_BUFFER_BIT);
	} else {
		drawThemeBackdrop(this, th);
	}

	const linespacing = 23;
	const charspacing = 10;
	const margintop = 4*linespacing;
	const marginbottom = 4*linespacing;
	const marginleft = 3*charspacing;
	const marginright = 3*charspacing;

	var widths = [];
	var nums = [];
	var sep = ' ';
	function isNumeric(s) {
		for (var c of s) if (!"0123456789.,%".includes(s[0])) return false;
		return true;
	}
	function getColumnAttribs(start) {
		widths = [];
		nums = [];
		for (var i=start; i<displayreceipt.data.length; i++) {
			var o = displayreceipt.data[i];
			var key = Object.keys(o)[0];
			var fieldcode = Math.floor(+key);
			if (i != start && fieldcode == Receipt.LIST_HEAD) break;
			var so = Object.values(o)[0];
			if (fieldcode == Receipt.LIST_HEAD) {
				for (var f=0; f<so.length; f++) {
					if (widths.length <= f) widths.push(0);
					widths[f] = Math.max(widths[f],
						dotMatrixFont.calcWidth(Object.values(so[f])[0][0]));
					widths[f] = Math.max(widths[f],
						charspacing * Object.values(so[f])[0][1]);
					if (nums.length <= f) nums.push(true);
				}
			} else if (fieldcode == Receipt.LIST_ITEM) {
				for (var f=0; f<so.length; f++) {
					widths[f] = Math.max(widths[f],
						dotMatrixFont.calcWidth(so[f]));
					nums[f] = !!(nums[f] &&
						isNumeric(so[f]));
				}
			}
		}
	}
	function getTabAttribs(start) {
		widths = [];
		nums = [];
		for (var i=start; i<displayreceipt.data.length; i++) {
			var o = displayreceipt.data[i];
			var key = Object.keys(o)[0];
			var fieldcode = Math.floor(+key);
			if (i != start && (
				fieldcode == Receipt.LIST_HEAD ||
				fieldcode == Receipt.TAB)) break;
			var so = Object.values(o)[0];
			if (fieldcode == Receipt.TAB) {
				for (var f=0; f<2; f++) {
					if (widths.length <= f) widths.push(0);
					if (nums.length <= f) nums.push(true);
				}
				if (so.length >= 3) {
					widths[0] = Math.max(widths[0],
						charspacing * so[0]);
					widths[1] = Math.max(widths[1],
						charspacing * so[2]);
					sep = so[1];
				} else {
					sep = ' ';
				}
			} else {
				widths[0] = Math.max(widths[0],
					dotMatrixFont.calcWidth(so[0]));
				widths[1] = Math.max(widths[1],
					dotMatrixFont.calcWidth(so[1]));
				nums[1] = !!(nums[1] &&
					isNumeric(so[1]));
			}
		}
	}

	var y = 0;

	// Start the receipt "paper" with the top and bottom margin sizes.
	mainShapes.useProg2();
	gl.uniformMatrix4fv(gl.getUniformLocation(prog2, 'uProjectionMatrix'), false, this.mat);
	gl.uniform4fv(gl.getUniformLocation(prog2, 'overallColor'),
		new Float32Array(th2.uiReceiptBg));
	const m = mat4.create();
	mat4.identity(m);
	mat4.translate(m,m,[0,y,0]);
	mat4.scale(m,m,[v.sw,margintop+marginbottom,1]);
	gl.uniformMatrix4fv(gl.getUniformLocation(prog2, 'uModelViewMatrix'), false, m);
	mainShapes.drawArrays2('rect');

	// Draw the serrated leading edge of the receipt.
	mainShapes.useProg2();
	gl.uniformMatrix4fv(gl.getUniformLocation(prog2, 'uProjectionMatrix'), false, this.mat);
	gl.uniform4fv(gl.getUniformLocation(prog2, 'overallColor'),
		new Float32Array([0,0,0,1]));
	mat4.identity(m);
	mat4.scale(m,m,[v.sw,v.sw,1]);
	gl.uniformMatrix4fv(gl.getUniformLocation(prog2, 'uModelViewMatrix'), false, m);
	mainShapes.drawArrays2('tear');

	y += margintop;
	var inlist = false;
	for (var i=0; i<displayreceipt.data.length; i++) {
		var o = displayreceipt.data[i];
		var key = Object.keys(o)[0];
		var so = Object.values(o)[0];
		var name = '', value = '';
		var fieldcode = Math.floor(+key);
		if (y - this.userY < -3 * linespacing) {
			if (fieldcode == Receipt.TAB) {
			} else if (fieldcode == Receipt.LIST_HEAD) {
				getColumnAttribs(i);
				var x = marginleft;
				for (var f=0; f<so.length; f++) {
					x += widths[f] + charspacing;
					if (x > this.designWidth
					|| (f+1 < widths.length && x + widths[f+1] > this.designWidth)) {
						x = marginleft;
						y += linespacing;
					}
				}
				y += linespacing;
			} else if (fieldcode == Receipt.LIST_ITEM) {
				var x = marginleft;
				for (var f=0; f<so.length; f++) {
					x += widths[f] + charspacing;
					if (x > this.designWidth
					|| (f+1 < widths.length && x + widths[f+1] > this.designWidth)) {
						x = marginleft;
						y += linespacing;
					}
				}
				y += linespacing;
			} else {
				y += linespacing;
			}
			continue;
		} else if (y - this.userY > this.sh) {
			break;
		}
		if (fieldcode == Receipt.TAB) {
			inlist = false;
			getTabAttribs(i);
		} else if (fieldcode == Receipt.LIST_HEAD) {
			inlist = true;
			getColumnAttribs(i);
			var x = marginleft;
			for (var f=0; f<so.length; f++) {
				value = Object.values(so[f])[0][0];
				mat4.identity(m);
				mat4.translate(m,m,[0,y,0]);
				var o = nums[f]?widths[f]-dotMatrixFont.calcWidth(value):0;
				dotMatrixFont.draw(o+x,14, value, th2.uiReceiptText, this.mat, m);
				x += widths[f] + charspacing;
				if (x > this.designWidth
				|| (f+1 < widths.length && x + widths[f+1] > this.designWidth)) {
					x = marginleft;
					y += linespacing;
				}
			}
			y += linespacing;
		} else if (fieldcode == Receipt.LIST_ITEM) {
			inlist = true;
			var x = marginleft;
			for (var f=0; f<so.length; f++) {
				value = so[f];
				mat4.identity(m);
				mat4.translate(m,m,[0,y,0]);
				var o = nums[f]?widths[f]-(value?dotMatrixFont.calcWidth(value):0):0;
				dotMatrixFont.draw(o+x,14,
					value, th2.uiReceiptText, this.mat, m);
				x += widths[f] + charspacing;
				if (x > this.designWidth
				|| (f+1 < widths.length && x + widths[f+1] > this.designWidth)) {
					x = marginleft;
					y += linespacing;
				}
			}
			y += linespacing;
		} else if (fieldcode == Receipt.SEP) {
			name = so[0];
			value = so[1];
			if ((name+value).length == 1) {
				value = (name+value).repeat(40);
				name = '';
			} else if (name != '') {
				value = name + sep + value;
				name = '';
			}
			mat4.identity(m);
			mat4.translate(m,m,[marginleft,y+14,0]);
			dotMatrixFont.draw(0,0, value, th2.uiReceiptText, this.mat, m);
			y += linespacing;
		} else if (fieldcode <= 42) {
			if (inlist) {
				inlist = false;
				widths = [];
				nums = [];
			}
			name = so[0];
			value = so[1];
			//var s = (name!=''?name+sep:'')+value;
			if (name != '') {
				mat4.identity(m);
				mat4.translate(m,m,[marginleft,y+14,0]);
				dotMatrixFont.draw(0,0, name, th2.uiReceiptText, this.mat, m);
				mat4.identity(m);
				mat4.translate(m,m,[marginleft,y+14,0]);
				var w = Math.max(dotMatrixFont.calcWidth(name), widths.length>0?widths[0]:0);
				dotMatrixFont.draw(w,0, sep, th2.uiReceiptText, this.mat, m);
			} else {
				mat4.identity(m);
				mat4.translate(m,m,[marginleft,y+14,0]);
			}
			var w = dotMatrixFont.calcWidth(value);
			var p = 0;
			if (nums[1]) p = Math.max(w, widths.length>1?widths[1]:0) - w;
			dotMatrixFont.draw(p,0, value, th2.uiReceiptText, this.mat, m);
			y += linespacing;
		} else {
			name = '';
			value = JSON.stringify(so);
			mat4.identity(m);
			mat4.translate(m,m,[marginleft,y,0]);
			var s = (name!=''?name+': ':'')+value;
			dotMatrixFont.draw(0,14, s, th2.uiReceiptText, this.mat, m);
			y += linespacing;
		}

		// Extend the receipt "paper" by the bottom margin size.
		mainShapes.useProg2();
		gl.uniformMatrix4fv(gl.getUniformLocation(prog2, 'uProjectionMatrix'), false, this.mat);
		gl.uniform4fv(gl.getUniformLocation(prog2, 'overallColor'),
			new Float32Array(th2.uiReceiptBg));
		mat4.identity(m);
		mat4.translate(m,m,[0,y,0]);
		mat4.scale(m,m,[v.sw,marginbottom,1]);
		gl.uniformMatrix4fv(gl.getUniformLocation(prog2, 'uModelViewMatrix'), false, m);
		mainShapes.drawArrays2('rect');
	}
	y += marginbottom;

	// Draw the serrated trailing edge of the receipt.
	mainShapes.useProg2();
	gl.uniformMatrix4fv(gl.getUniformLocation(prog2, 'uProjectionMatrix'), false, this.mat);
	gl.uniform4fv(gl.getUniformLocation(prog2, 'overallColor'),
		new Float32Array(th2.uiReceiptBg));
	mat4.identity(m);
	mat4.translate(m,m,[0,y,0]);
	mat4.scale(m,m,[v.sw,v.sw,1]);
	gl.uniformMatrix4fv(gl.getUniformLocation(prog2, 'uModelViewMatrix'), false, m);
	mainShapes.drawArrays2('tear');
	y += (v.sw/49)*Math.sqrt(3)/2;

/*
	mat4.identity(m);
	mat4.translate(m,m,[0,y,0]);
	mat4.scale(m,m,[v.sw,v.sh,1]);
	gl.uniformMatrix4fv(gl.getUniformLocation(prog2, 'uModelViewMatrix'), false, m);
	mainShapes.drawArrays2('rect');
*/
	if (y > v.sh) {
		this.backgroundDisabled = true;
	}

	this.maxY = y;
	this.swipeGad.layout.call(this.swipeGad);
}

var displayreceipt = v = new vp.SliceView(null, 'b', 0.125);
v.name = Object.keys({displayreceipt}).pop();
v.prop = true;
v.a = pmtrcptbuttonbar; pmtrcptbuttonbar.parent = v;
v.b = pmtrcptmain; pmtrcptmain.parent = v;
v.setData = function(data) {
	this.data = data;
	pmtrcptmain.backgroundDisabled = false;
}
v.switchedToFunc = function() {
}

