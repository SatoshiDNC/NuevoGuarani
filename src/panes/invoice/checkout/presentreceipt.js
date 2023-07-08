var presentreceipt = v = new vp.View(null);
v.name = Object.keys({presentreceipt}).pop();
//v.designFit = [240,80];
//v.designHeight = 80;
v.gadgets.push(v.method = g = new vp.Gadget(v));
	g.x = 5; g.y = 20; g.w = 230; g.h = 20;
	g.actionFlags = vp.GAF_TEXTINPUT | vp.GAF_GONEXT;
	g.text = ''; g.label = tr('payment method'); g.autoHull();
	g.renderFunc = function() {
		var g = this, v = g.viewport;
		var sel = vp.getInputGad() === g;
		const th = this.viewport === presentreceipt? vendorColors : customerColors;
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
/*
v.gadgets.push(v.currency = g = new vp.Gadget(v));
	g.w = 42; g.h = 21; g.actionFlags = vp.GAF_CLICKABLE;
	g.x = 4; g.y = 55;
	g.autoHull();
	g.label = tr('currency');
	g.icon = defaultVendorCurrency;
	g.renderFunc = function() {
		var g = this, th = g.parent === presentreceipt? vendorColors : customerColors;
		var sel = clickTapActive.includes(g.gestureState);
		const mat = mat4.create();
		mat4.identity(mat);
		mat4.translate(mat, mat, [g.x, g.y, 0]);
		mat4.scale(mat, mat, [g.w/36, g.h/18, 0]);
		mat4.translate(mat, mat, [-1, 16, 0]);
		c = (g.icon == '₿') ? th.uiPillOrange : th.uiFiatGreen;
		iconFont.draw(0,0, g.icon,
			sel?th.uiButtonSel:c,
			g.viewport.mat, mat);
		if (g.icon == '₿') {
			iconFont.draw(0,0, '🗲',
				sel?th.uiButtonSel:th.uiLightningPurple,
				g.viewport.mat, mat);
		}
	}
	g.clickFunc = function() {
		this.viewport.unitprice.cycleCurrency();
	}
v.gadgets.push(v.unitprice = g = new vp.Gadget(v));
	g.x = 5; g.y = 55; g.w = 139; g.h = 20;
	g.actionFlags = vp.GAF_NUMINPUT | vp.GAF_GONEXT | vp.GAF_CONTEXTMENU;
	g.text = ''; g.label = tr('price'); g.limitChars = '0123456789';
	g.limitLenFunc = function() { return this.text.replace('.','').length >= 11; }
	g.currency = defaultVendorCurrency;
	g.contextMenuFunc = function() {
		this.cycleCurrency();
	}
	g.cycleCurrency = function() {
		var g = this;
		var i = enabledVendorCurrencies.indexOf(g.icon);
		i += 1;
		if (i >= enabledVendorCurrencies.length) i = 0;
		g.icon = enabledVendorCurrencies[i];
		g.viewport.unitprice.currency = enabledVendorCurrencies[i];
		presentreceipt.setRenderFlag(true);
	}
	g.specialKeys = ['*', '$'];
	g.align = 'r';
	g.layoutFunc = function() {
		var g = this, v = g.viewport, s = v.getScale();
		g.W = v.w/s; //g.x = (g.W - g.w) / 2;
		g.H = v.h/s; //g.y = g.h + 5; //(g.H - g.h) / 2 + 50;
		g.autoHull();
	}
	g.renderFunc = v.method.renderFunc;
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
	g.textNextFunc = function() {
		var g = this, v = g.viewport;
		if ((v.method.text.trim() != '' || v.qty.text.trim() != ''
		|| v.taxrate.text.trim() != '') && this.text.trim() == '') {
			vp.beep();
			vp.beginInput(v.unitprice);
		} else {
			vp.beginInput(v.qty);
		}
	}
	g.specialFunc = function(e) {
		switch (e.key) {
		case '*': this.textNextFunc(); break;
		case '$':	this.cycleCurrency(); break;
		}
	}
v.gadgets.push(v.qty = g = new vp.Gadget(v));
	g.x = 149; g.y = 55; g.w = 46; g.h = 20;
	g.actionFlags = vp.GAF_NUMINPUT | vp.GAF_GONEXT;
	g.text = ''; g.label = tr('qty'); g.limitChars = '0123456789.';
	g.limitLenFunc = function() {
		return this.text.replace('.','').length >= (this.text.startsWith('.')?3:4);
	}
	g.align = 'r';
	g.layoutFunc = function() {
		var g = this, v = g.viewport, s = v.getScale();
		g.W = v.w/s; //g.x = (g.W - g.w) / 2;
		g.H = v.h/s; //g.y = g.h + 5; //(g.H - g.h) / 2 + 50;
		g.autoHull();
	}
	g.renderFunc = function() {
		var g = this, v = g.viewport;
		v.method.renderFunc.call(g);
	}
	g.textBeginFunc = function() {
		var g = this, v = g.viewport;
		if (g.text == '' && v.unitprice.text != '') {
			g.text = '1';
		}
		g.viewport.setRenderFlag(true);
	}
	g.textFunc = function() {
		this.viewport.setRenderFlag(true);
	}
	g.textEndFunc = function() {
		this.viewport.setRenderFlag(true);
	}
	g.textPrevFunc = function() { vp.beginInput(this.viewport.unitprice); }
	g.textNextFunc = function() {
		var g = this, v = g.viewport;
		if ((v.method.text.trim() != '' || v.unitprice.text.trim() != ''
		|| v.taxrate.text.trim() != '') && (+this.text) == 0) {
			vp.beep();
			vp.beginInput(v.qty);
		} else {
			vp.beginInput(v.taxrate);
		}
	}
v.gadgets.push(v.taxrate = g = new vp.Gadget(v));
	g.x = 200; g.y = 55; g.w = 35; g.h = 20;
	g.actionFlags = vp.GAF_NUMINPUT | vp.GAF_GONEXT;
	g.text = ''; g.label = tr('tax'); g.limitChars = '0123456789';
	g.limitLenFunc = function() { return this.text.length >= 2; }
	g.align = 'r'; g.margin = 12;
	g.autoHull();
	g.renderFunc = v.method.renderFunc;
	g.textBeginFunc = function() {
		var g = this, v = g.viewport;
		if (g.text == '' && v.unitprice.text != '') {
			g.text = '10';
		}
		g.viewport.setRenderFlag(true);
	}
	g.textFunc = function() {
		this.viewport.setRenderFlag(true);
	}
	g.textEndFunc = function() {
		this.viewport.setRenderFlag(true);
	}
	g.textPrevFunc = function() { vp.beginInput(this.viewport.qty); }
	g.textNextFunc = function() {
		var g = this, v = g.viewport;
		if ((v.method.text.trim() != '' || v.unitprice.text.trim() != ''
		|| v.qty.text.trim() != '') && this.text.trim() == '') {
			vp.beep();
			vp.beginInput(v.taxrate);
		} else if ((v.qty.text.trim() != '' || v.taxrate.text.trim() != '')
		&& v.unitprice.text.trim() == '') {
			vp.beep();
			vp.beginInput(v.unitprice);
		} else {
			var value = v.unitprice.text.trim();
			if (value != '' && ['$', '€'].includes(v.unitprice.currency)) {
				value = (v.unitprice.text * 100).toString();
			}
			var li = new LineItem(
				v.method.text.trim(),
				v.unitprice.currency, value,
				v.qty.text.trim(),
				v.taxrate.text.trim());
			if (!li.isEmpty()) {
				v.setConversionRates();
//for (i=0; i<30; i++) {
				invoicepane.invoiceitems.unshift(li);
//}
				invoicepane.setRenderFlag(true);
				v.clearDataEntry();
				vp.beginInput(v.method);
			} else {
				vp.endInput();
				if (invoicepane.invoiceitems.length > 0)
					checkoutpages.swipeGad.doSwipe(true);
			}
		}
	}
*/
v.setConversionRates = function() {
	this.conv = JSON.parse(JSON.stringify(conversionRates));
}
v.cconv = function(a, f, t) {
	return Math.ceil(a /* * this.conv[f][t] */);
}
v.clearDataEntry = function() {
	this.method.text = '';
	this.unitprice.currency = defaultVendorCurrency;
	this.unitprice.text = '';
	this.qty.text = '';
	this.taxrate.text = '';
}
v.layoutFunc = function() {
	for (const g of this.gadgets) {
		if (g.layoutFunc) g.layoutFunc.call(g);
	}
}
v.renderFunc = function(flip = false) {
	// WARNING: This function is re-used by customertotal; "this" may vary!
	const th = this === presentreceipt? vendorColors : customerColors;
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
		defaultFont.draw(0,0, g.label, th.uiTextLabel, this.mat, m);
	}

	if (this === presentreceipt) {
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
}
v.xpageFocusFunc = function() {
console.log(this.name, 'pageFocus');
	var receipt = new Receipt();
	receipt.addVendorHeaders();
	qrcodepane.qr = receipt.toParts();
//	var m,n=10;
//	for (m=1; m<=n; m++)
//	qrcodepane.qr.push(
//'['+m+','+n+',"c15u1p3xnhl2pp5jptserfk3zk4qy42tlucycrfwxhydvlemu9pqr93tuzlv9cc7g3sdqsvfhkcap3xyhx7un8cqzpgxqzjcsp5f8c52y2stc300gl6s4xswtjpc37hrnnr3c9wvtgjfuvqmpm35evq9qyyssqy4lgd8tj637qcjp05rdpxxykjenthxftej7a2zzmwrmrl70fyj9hvj0rewhzj7jfyuwkwcg9g2jpwtk3wkjtwnkdks84hsnu8xps5vsq4g"]'
//	);

/*
	qrcodepane.qr.push(
`{
	"m":1, "n":1,
	"ln":"ln10234lksjdfghdfgk......dklgfhjdgfklhd",
	"1":{"Vendor":"BIO-GRANJA EL DORADO E.I.R.L."},
	"2":{"":"M. Auxiliadora 9002"},
	"3":{"":"+595 986 124 208"},
	"4":{"R.U.C.":"80064237-6"},
	"5":{"Timbrado Na":"15856902"},
	"6":{"Valido Desde":"1/09/2022"},
	"7":{"Valido Hasta":"30/09/2023"},
	"8":{"Factura Na":"001-003-0022282"},
	"9":{"I.V.A. Incluido":"true"},
	"10":{"Caja Na":1},
	"11":{"Fecha":"19/05/2023 11:36:11"},
	"12":{"Cajero":"Caja Perla"},
	"13":{"Cliente":"CLIENTE SIN NOMBRE"},
	"14":{"R.U.C.":"00000000-0"},
	"22":{
		"23":"Articulo",
		"24":"Descripcion",
		"25":"Cantidad",
		"26":"Precio",
		"27":"Total",
		"28":"TI",
	},
	"15":[
		["8,914","ALCAPARRAS G&G 90GR","1,000","16.200","16.200","10%"],
		["8,465","PURE DE TOMATE LA HUERTA, 210G","1,000","4.000","4.000","10%"],
		["8,465","PURE DE TOMATE LA HUERTA, 210G","1,000","4.000","4.000","10%"],
		["5,520","BICARBONATO DE SODIO X KG","0,190","22.000","4.180","5%"],
		["5,355","COCO RELLADO COPALSA, X KG","0,130","44.300","5.538","10%"],
		["8,914","ALCAPARRAS G&G 90GR","1,000","16.200",
	],
}`);
*/
	invoicepane.a = qrcodepane; qrcodepane.parent = invoicepane;
	invoicepane.queueLayout();
//	qrcodepane.setRenderFlag(true);
}
