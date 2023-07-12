var paypurchasedinvoices = v = new vp.View(null);
v.name = Object.keys({paypurchasedinvoices}).pop();
//v.designFit = [240,80];
//v.designHeight = 80;
v.gadgets.push(v.change = g = new vp.Gadget(v));
	g.x = 5; g.y = 20; g.w = 230; g.h = 20;
	g.actionFlags = vp.GAF_TEXTINPUT | vp.GAF_GONEXT;
	g.text = ''; g.label = 'pay purchased invoices'; g.autoHull();
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
		console.group('paying invoice(s)');

		// Count how many invoices were purchased.
		var n = 0;
		for (const li of invoicepane.invoiceitems) {
			if (li.invoicetopay) n++;
		}

		// If wallet type is manual, advise user on how to proceed.
		if (config.walletType == 'manual' && n > 0) {
			if (n == 1) {
				alert("You don't have a wallet linked, so the purchased lightning invoice has to be paid manually.");
			} else {
				alert("You don't have a wallet linked, so "+ n +" purchased lightning invoices have to be paid manually.");
			}
		}

		// Pay the purchased invoice(s), one by one.
		var m = 0;
		for (const li of invoicepane.invoiceitems) {
			if (li.invoicetopay) {
				m++;
	console.log(m, 'paying invoice:',li.invoicetopay);
				switch (config.walletType) {
				case 'manual':
	//				var result = confirm("Invoice "+ m +" of "+ n +" has been copied to the clipboard. If paid successfully, tap OK. If you cancel, a refund will be calculated.");
	//console.log('response',result);
					break;
				case 'LNbits compatible':
					payLNbitsInvoice(li.invoicetopay);
					delete li.invoicetopay;
					break;
				default: alert("Wallet configuration error");
				}
			}
		}

		console.groupEnd();
		//checkoutpages.swipeGad.doSwipe(true);
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

function payLNbitsInvoice(invoice) {
	console.group('payLNbitsInvoice()');
console.log(invoice);
	const getDetails = async () => {
/*
		const response = await fetch(config.walletLNbitsURL+'/payments/decode', {
			method: 'POST',
			headers: {
			  'Accept': 'application/json',
			  'Content-Type': 'application/json',
			  'X-API-KEY': config.walletLNbitsKey,
			},
			body: `{"data": "`+ invoice +`"}`,
		});
		const myJson = await response.json(); //extract JSON from the http response
*/
		const myJson = { payment_hash: "a37ea5ff05f41891262720e0567e9442f9463c6d12c59ded5cfca8a406c50522", amount_msat: 123000, description: "my business", description_hash: null, payee: "022bd0aa893db4ac890e457cca8c83f112518d6941bf9153dab4bf904620503a78", date: 1688946937, expiry: 600, secret: "11fa0043a6da2fc6873e28903a9e00e6e86a1f93cf432382f1c41249de5213f4", route_hints: [], min_final_cltv_expiry: 18 }; //	lnbc1230n1pj2kj8esp5z8aqqsaxmghudpe79zgr48squm5x58uneapj8qh3csfynhjjz06qpp55dl2tlc97svfzf38yrs9vl55gtu5v0rdztzemm2ulj52gpk9q53qdqjd4ujqcn4wd5kuetnwvxqzjccqpjrzjqgp7tvtwh6rmpz0j9cv82tcl0fn2r00h0pualrgun6xeztdlhxltgzm59cqq8zcqqyqqqqlgqqqqn3qqvs9qyysgqv0tg90xhcddfk2w2s9pd0c9jrm9znvxujn5w8kunlzcp74yfrqjpnkc9pfqzqjemsrmn4s2lupyfkmhwn3eu58lvl3vfckvyrugv77cqyutv6g
		// do something with myJson
		console.log('myJson', myJson);
		const desc = myJson.description;
		const date = myJson.date;
		const msats = myJson.amount_msat;
		if (!dataentry.readInvoiceCanceled) {
			{
				var temp = tr('pay {AMNT} sats for {DESC}');
				temp = temp.replace('{AMNT}', Math.round(msats/1000).toString() );
				temp = temp.replace('{DESC}', tr(desc));
				temp = icap(temp);
				dataentry.item.text = temp;
			}
			//dataentry.unitprice.icon = '₿';
			//dataentry.unitprice.text = Math.round(msats/1000).toString();
			dataentry.unitprice.text = Math.round(cconv(msats/1000, '₿', dataentry.unitprice.currency)).toString();
			dataentry.qty.text = "1";
			dataentry.taxrate.text = "0";
			vp.beep();
			dataentry.setRenderFlag(true);
		}
	}
	//lightningqr.busySignal = true;
	//getDetails();
	//genInv();
	console.groupEnd();
}
/*
function payInvoice(invoice) {
	dataentry.readInvoiceCanceled = false;
	dataentry.item.linkedInvoice = invoice;
	switch (config.walletType) {
	case 'manual': alert("You don't have a wallet linked, so lightning invoice details are unavailable."); readInvoiceBuiltIn(invoice); break;
	case 'LNbits compatible': readLNbitsInvoice(invoice); break;
	default: alert("Wallet configuration error");
	}
}
*/

v.pageFocusFunc = function() {
	vp.beginInput(paypurchasedinvoices.change);
}
