var invoicepane;
function getDefaultsByBarcode(barcode, found, notfound) {
	if (barcode.rawValue.toLowerCase().startsWith('lnbc')) {
		return new LineItem(tr('lnbc item description'), '₿', 1000000, 1, 0);
	} else {
		for (const li of invoicepane.invoiceitems) {
			if (li.barcode == barcode.rawValue) {
				found(li);
			}
		}
	}
/*
	var req = db.transaction(["barcodes"])
	  .objectStore("barcodes")
		.get(barcode.rawValue);
	req.onsuccess = (event) => {
		console.log("success", event);
		var req = db.transaction(["items"])
			.objectStore("items")
			.get(event.target.result);
		req.onsuccess = (event) => {
			var li = new LineItem();
			li.item = event.target.result.desc;
			li.unitprice = event.target.result.unitprice;
			li.taxrate = event.target.result.taxrate;
			console.log("success", event);
			found(li);
		};
		req.onerror = (event) => {
			console.log("error", event);
			notfound();
		};
	};
	req.onerror = (event) => {
		console.log("error", event);
		notfound();
	};
*/
}

var dataentry = v = new vp.View(null);
v.name = Object.keys({dataentry}).pop();
//v.designFit = [240,80];
//v.designHeight = 80;
v.tryAddItem = function() {
		var g = dataentry.taxrate, v = g.viewport;
		if ((v.item.text.trim() != '' || v.unitprice.text.trim() != ''
		|| v.qty.text.trim() != '') && g.text.trim() == '') {
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
				v.item.text.trim(),
				v.unitprice.currency, value,
				v.qty.text.trim(),
				v.taxrate.text.trim());
			if (dataentry.item.linkedBarcode && dataentry.item.linkedBarcode != '')
				li.barcode = dataentry.item.linkedBarcode;
			if (!li.isEmpty()) {
				v.setConversionRates();
/*
				var req = db.transaction(["items"], "readwrite")
				  .objectStore("items")
					.add({
						desc: li.item,
						unitprice: li.unitprice,
						taxrate: li.taxrate
					});
				req.onsuccess = (event) => {
					console.log("success1", event);
					if (li.barcode) {
						console.log(event.target.result, li.barcode);
						var req = db.transaction(["barcodes"], "readwrite")
							.objectStore("barcodes")
							.add(event.target.result, li.barcode);
						req.onsuccess = (event) => {
							console.log("success2", event);
						};
					}
				};
*/
				invoicepane.invoiceitems.unshift(li);
				delete checkoutpages.swipeGad.maxX;
				invoicepane.setRenderFlag(true);
				vendorpane.setRenderFlag(true);
				v.clearDataEntry();
				dataentry.preCalculateQR();
				vp.beginInput(v.item);
			} else {
				vp.endInput();
				if (invoicepane.invoiceitems.length > 0)
					checkoutpages.swipeGad.doSwipe(true);
			}
		}
}
v.preCalculateQR = function() {
	lightningqr.qr = [];
/*
	lightningqr.qr.push(
'lnbc15u1p3xnhl2pp5jptserfk3zk4qy42tlucycrfwxhydvlemu9pqr93tuzlv9cc7g3sdqsvfhkcap3xyhx7un8cqzpgxqzjcsp5f8c52y2stc300gl6s4xswtjpc37hrnnr3c9wvtgjfuvqmpm35evq9qyyssqy4lgd8tj637qcjp05rdpxxykjenthxftej7a2zzmwrmrl70fyj9hvj0rewhzj7jfyuwkwcg9g2jpwtk3wkjtwnkdks84hsnu8xps5vsq4gj5hs'
	);
*/
	var r = new Receipt();
	r.sequenceNum = config.lastInvoiceNum + 1;
	//r.addVendorHeaders();

	r.append(Receipt.VENDOR, "", "**"+config.businessName+"**");
	if (config.businessAddress)
		r.append(Receipt.LOC_ADDRESS, "", config.businessAddress);
	if (config.businessCity)
		r.append(Receipt.LOC_CITY, "", config.businessCity);
	if (config.businessState)
		r.append(Receipt.LOC_STATE, "", config.businessState);
	if (config.businessPostalCode)
		r.append(Receipt.LOC_POSTAL_CODE, "", config.businessPostalCode);
	if (config.businessTelephone)
		r.append(Receipt.TELEPHONE, "", config.businessTelephone);

	if (config.businessTaxId) switch (style) {
		case PARAGUAY: r.append(Receipt.VEND_TAX_ID_PY_RUC, "", config.businessTaxId); break;
		default: r.append(Receipt.VEND_TAX_ID, "", config.businessTaxId);
	}
	if (config.businessLicense)
		r.append(Receipt.VEND_LIC_NUM, icap(tr("license number")), config.businessLicense);
	if (config.businessLicenseValidFrom) r.append(Receipt.VEND_LIC_VALID_FROM,
		icap(tr("valid from")), config.businessLicenseValidFrom);
	if (config.businessLicenseValidTill) r.append(Receipt.VEND_LIC_VALID_TILL,
		icap(tr("valid till")), config.businessLicenseValidTill);

	r.append(Receipt.TITLE_INVOICE_DETAILS, "", "**"+cap(tr("invoice details"))+"**");
	r.append(Receipt.INVOICE_NUM, icap(tr("invoice number")),
		r.sequenceNum.toString().padStart(10, '0'));

	if (style == PARAGUAY) {
		r.append(Receipt.TITLE_TERMS_OF_SALE, "", cap(tr("terms of sale")));
		r.append(Receipt.TAX_INCLUDED, "", tcase(tr("tax included")));
	}

	//r.appendTabFmt(Receipt.TAB+0.1, 7, ": ", 0);
	if (config.cashReg) r.append(Receipt.CASHREG_NUM,
		icap(tr("cash register number"))+':', config.cashReg);
	r.append(Receipt.DATE_AND_TIME, icap(tr("date"))+':',
		(new Date()).toLocaleDateString(lcode, {
			weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
			hour: 'numeric', minute: 'numeric', second: 'numeric',
		}));
	if (config.cashier)
		r.append(Receipt.CASHIER_NAME, icap(tr("cashier"))+':', config.cashier);
//	r.append(Receipt.CUST_NAME, "Cliente", "CLIENTE SIN NOMBRE");
//	r.append(Receipt.CUST_TAX_ID_PY_RUC, "R.U.C.", "00000000-0");
	r.append(Receipt.SEP+0.1, "", "-");

	r.appendListHead(Receipt.LIST_HEAD, [
//		[Receipt.ITEM_NUM,   "Articulo  ",   10],
		[Receipt.ITEM_DESC,  "Descripción", 0],
		[Receipt.ITEM_QTY,   "Cantidad",    0],
		[Receipt.ITEM_PRICE, "Precio",      9],
		[Receipt.ITEM_TOTAL, "Total",      17],
		[Receipt.ITEM_TAX_CATEGORY, " TI",  3],
	]);
	r.append(Receipt.SEP+0.2, "", "-");
	var subtot = 0;
	for (const li of invoicepane.invoiceitems) {
		r.appendListItem(Receipt.LIST_ITEM, [
			li.item, li.qty, li.unitprice, (li.unitprice * li.qty).toString(), li.taxrate]);
		subtot += dataentry.cconv(li.unitprice * li.qty, li.currency, config.defaultCurrency);
	}
	r.append(Receipt.SEP+0.3, "", "-");
	r.appendTabFmt(Receipt.TAB+0.2, 17, "---->", 17);
	r.append(Receipt.INV_SUBTOTAL, tcase(tr("invoice subtotal")), subtot);
	r.appendTabFmt(Receipt.TAB+0.3);
	r.append(Receipt.SEP+0.4, "", "-");
	r.append(Receipt.SEP+0.5, "", "");
/*

		this.appendTabFmt(Receipt.TAB+0.4, 0, "", 0);
		this.append(Receipt.PMT_DETAILS, "", "Detalle de Pagos:");
		this.append(Receipt.SEP+0.6, "", "-");
		this.appendTabFmt(Receipt.TAB+0.5, 14, "", 22);
		this.append(Receipt.PMT_CASH, "Efectivo:", "50.000");
		this.appendTabFmt(Receipt.TAB+0.6, 14, "---->", 17);
		this.append(Receipt.PMT_TOTAL, "Total Pagos", "50.000");
		this.append(Receipt.PMT_CHANGE_DUE, "Su Vuelto", "16.082");
		this.appendTabFmt(Receipt.TAB+0.7);
		this.append(Receipt.SEP+0.7, "", "");

		this.appendListHead(Receipt.TAX_HEAD, [
			[Receipt.TAX_CATEGORY,    "SUB TOTALES", 14],
			[Receipt.CAT_TAXABLE_AMT, "LIQUIDACION",  0],
			[Receipt.CAT_TAX_AMT,     "IVA",         13],
		]);
		this.append(Receipt.SEP+0.8, "", "-");
		this.appendListItem(Receipt.TAX_ITEM, [
			"Exento", "", ""]);
		this.appendListItem(Receipt.TAX_ITEM, [
			"Gravado 10%", "29.737", "2.703"]);
		this.appendListItem(Receipt.TAX_ITEM, [
			"Gravado  5%", "4.180", "199"]);
		this.appendListItem(Receipt.TAX_ITEM, [
			"Total:", "", "2.902"]);
		//this.append(Receipt.TAX_TOTAL, "Total", "2.902");
		this.append(Receipt.SEP+0.9, "", "");

		this.append(Receipt.NOTE+0.1, "", "******Original: Cliente******");
		this.append(Receipt.NOTE+0.2, "", "******Duplicado: Archivo Tributario******");
		this.append(Receipt.NOTE+0.3, "", "******Gracias Por su Preferencia******");
	}
*/
	receiptqr.qr = r.toParts();
}
v.gadgets.push(v.item = g = new vp.Gadget(v));
	g.x = 5; g.y = 20; g.w = 230; g.h = 20;
	g.actionFlags = vp.GAF_TEXTINPUT | vp.GAF_GONEXT;
	g.text = ''; g.label = 'item'; g.autoHull();
	g.specialCodes = ['F10'];
	g.renderFunc = function() {
		var g = this, v = g.viewport;
		var sel = vp.getInputGad() === g;
		const th = this.viewport === dataentry? vendorColors : customerColors;
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

		mat4.identity(mat);
		mat4.translate(mat, mat, [g.x + 2, g.y - 2, 0]);
		mat4.scale(mat, mat, [0.5, 0.5, 1]);
		defaultFont.draw(0,0, tr(g.label), th.uiTextLabel, v.mat, mat);
		
		if (sel) {
			useProg5();
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
		if (g === v.item) {
			if (g.linkedBarcode && g.linkedBarcode != '') {
				var w = defaultFont.calcWidth(g.linkedBarcode);
				if (!g.linkedBarcodeFound) {
					useProg5();
					mat4.identity(mat);
					mat4.translate(mat, mat, [g.x+g.w-w/2-3, g.y-10, 0]);
					mat4.scale(mat, mat, [w/2+2, 9, 1]);
					gl.uniformMatrix4fv(gl.getUniformLocation(prog5, 'uModelViewMatrix'), false, mat);
					gl.uniform4fv(gl.getUniformLocation(prog5, 'overallColor'),
						new Float32Array([1,0,0,1]));
					gl.drawArrays(typ5.rect, beg5.rect, len5.rect);
				}
				mat4.identity(mat);
				mat4.translate(mat, mat, [g.x + g.w - 2, g.y - 2, 0]);
				mat4.scale(mat, mat, [0.5, 0.5, 1]);
				mat4.translate(mat, mat, [-w, 0, 0]);
				defaultFont.draw(0,0, g.linkedBarcode, th.uiTextLabel, v.mat, mat);
			}
		} else if (g === v.unitprice) {
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
	g.specialFunc = function(e) {
		if (e.code == 'F10') {
			this.scanFunc({ rawValue: this.text });
		}
	}
	g.scanFunc = function(barcode) {
		var g = dataentry.item;
		if (vp.getInputGad() !== g) return;
		g.linkedBarcode = barcode.rawValue;
		g.viewport.setRenderFlag(true);
		getDefaultsByBarcode(barcode,
			li => {
				vp.beep('qr-scan');
				g.linkedBarcode = '';
				li.qty = "1";
				invoicepane.invoiceitems.unshift(li);
				invoicepane.setRenderFlag(true);
			},
			() => {
				vp.beep('bad');
			},
		);
	}
	g.startScanner = function(clear = true) {
		var g = this, v = g.viewport;
		g.scanSession = BarcodeScanner.beginSession(g.scanFunc);
		if (clear) { g.linkedBarcode = ''; }
	}
	g.stopScanner = function() {
		var g = this;
		BarcodeScanner.endSession(g.scanSession);
		delete g.scanSession;
	}
	g.textBeginFunc = function() {
		if (camerasettings.itemscan.state === true) {
			this.startScanner();
		}
		this.viewport.setRenderFlag(true);
	}
	g.textFunc = function() {
		if (camerasettings.itemscan.state === true) {
			if (this.text == '') {
				this.startScanner(false);
			} else {
				this.stopScanner();
			}
		}
		this.viewport.setRenderFlag(true);
	}
	g.textEndFunc = function() {
		if (camerasettings.itemscan.state === true) {
			this.stopScanner();
			if (this.text.trim() == '') this.linkedBarcode = '';
		}
		this.viewport.setRenderFlag(true);
	}
	g.textPrevFunc = function() { vp.beginInput(this.viewport.item); }
	g.textNextFunc = function() { vp.beginInput(this.viewport.unitprice); }
/*
v.gadgets.push(v.currency = g = new vp.Gadget(v));
	g.w = 42; g.h = 21; g.actionFlags = vp.GAF_CLICKABLE;
	g.x = 4; g.y = 55;
	g.autoHull();
	g.label = 'currency';
	g.icon = defaultVendorCurrency;
	g.renderFunc = function() {
		var g = this, th = g.parent === dataentry? vendorColors : customerColors;
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
*/
v.gadgets.push(v.unitprice = g = new vp.Gadget(v));
	g.x = 5; g.y = 55; g.w = 139; g.h = 20;
	g.actionFlags = vp.GAF_NUMINPUT | vp.GAF_GONEXT | vp.GAF_CONTEXTMENU;
	g.text = ''; g.label = 'price'; g.limitChars = '0123456789';
	g.limitLenFunc = function() { return this.text.replace('.','').length >= 11; }
	Object.defineProperty(g, "currency", {
		get : function () {
			if (this.icon) return this.icon;
			else return config.defaultCurrency;
		}
	});
	g.contextMenuFunc = function() {
		this.cycleCurrency();
	}
	g.cycleCurrency = function() {
		var g = this;
		var i = config.enabledCurrencies.indexOf(g.icon);
		i += 1;
		if (i >= config.enabledCurrencies.length) i = 0;
		g.icon = config.enabledCurrencies[i];
//	g.currency = config.enabledCurrencies[i];
		dataentry.setRenderFlag(true);
	}
	g.specialKeys = ['*', '$'];
	g.align = 'r';
	g.layoutFunc = function() {
		var g = this, v = g.viewport, s = v.getScale();
		g.W = v.w/s; //g.x = (g.W - g.w) / 2;
		g.H = v.h/s; //g.y = g.h + 5; //(g.H - g.h) / 2 + 50;
		g.autoHull();
	}
	g.renderFunc = v.item.renderFunc;
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
	g.textPrevFunc = function() { vp.beginInput(this.viewport.item); }
	g.textNextFunc = function() {
		var g = this, v = g.viewport;
		if ((v.item.text.trim() != '' || v.qty.text.trim() != ''
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
	g.text = ''; g.label = 'qty'; g.limitChars = '0123456789.';
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
		v.item.renderFunc.call(g);
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
		if ((v.item.text.trim() != '' || v.unitprice.text.trim() != ''
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
	g.text = ''; g.label = 'tax'; g.limitChars = '0123456789';
	g.limitLenFunc = function() { return this.text.length >= 2; }
	g.align = 'r'; g.margin = 12;
	g.autoHull();
	g.renderFunc = v.item.renderFunc;
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
	g.textNextFunc = function() { dataentry.tryAddItem(); }
v.setConversionRates = function() {
	this.conv = JSON.parse(JSON.stringify(conversionRates));
}
v.cconv = function(a, f, t) {
	return Math.ceil(a * this.conv[f][t]);
}
v.clearDataEntry = function() {
	this.item.text = '';
	this.unitprice.icon = config.defaultCurrency;
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
	const th = this === dataentry? vendorColors : customerColors;
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

	if (this === dataentry) {
		var e = (this.item.text != ''
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

