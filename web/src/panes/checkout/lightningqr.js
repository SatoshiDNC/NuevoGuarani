var lightningqr = v = new vp.View(null);
v.name = Object.keys({lightningqr}).pop();
v.scaleFactor = 1;
v.busySignal = false;
v.errorSignal = false;
v.walletSignal = false;
v.copiedSignal = false;
v.busyCounter = 0;
v.gadgets.push(v.copyGad = g = new vp.Gadget(v));
	g.x = 0; g.y = 0; g.w = 1; g.h = 1;
	g.actionFlags = vp.GAF_CLICKABLE;
	g.clickFunc = function() {
    const g = this
    if (g.auxFunc) {
      console.log('calling aux func')
      g.auxFunc()
    } else {
      console.log('qr-click', lightningqr.qr)
      if (lightningqr.qr.length == 0) {
      }
      if (lightningqr.qr.length == 1) {
        navigator.clipboard.writeText(lightningqr.qr[0]).then(
          () => {
            lightningqr.copiedSignal = true
            lightningqr.setRenderFlag(true)
            setTimeout(() => {
              lightningqr.copiedSignal = false
              lightningqr.setRenderFlag(true)
            }, 2000);
            console.log('/* clipboard successfully set */')
          },
          () => {
            console.log('/* clipboard write failed */')
          },
        );
      }
    }
	}
v.clear = function() {
	this.busySignal = false;
	this.errorSignal = false;
	this.walletSignal = false;
	this.copiedSignal = false;
	this.qr = [];
	this.qrtex = [];
	this.triggerPad = true;
}
v.layoutFunc = function() {
	const v = this, g = v.copyGad;
	g.w = v.sw; g.h = v.sh;
	g.autoHull();
}
v.renderFunc = function() {
	drawThemeBackdrop(this, config.themeColors);
//	gl.clearColor(...config.themeColors.uiBackground);
//	gl.clear(gl.COLOR_BUFFER_BIT);
//	var pageindex = checkoutpages.index;
	let earlyreturn = 0;
//	if (pageindex < 0 || Math.abs(checkoutpages.getPageOffset(pageindex)) > 0.01 || checkoutpages.idealSize != vendormain.sizeH) {
	if (this.triggerPad || this.qr.length == 0) {
		delete this.triggerPad;
		this.pad = 10;
		this.setRenderFlag(true);
		earlyreturn = 1;
	}
	if (!earlyreturn && this.pad > 0) {
		this.pad -= 1;
		this.setRenderFlag(true);
		earlyreturn = 1;
	}
	if (!earlyreturn && this.pad == 0) {
		this.pad = -1;
		this.qrindex = -1;
		this.reftime = Date.now();
	}
	if (this.qr.length == 0 || this.copiedSignal) {
		earlyreturn = 1;
	}

	// Transitional gray placeholder or white background.
	var w = Math.min(this.sw, this.sh) * (earlyreturn?0.9:1);
	var x = (this.sw - w) / 2;
	var y = (this.sh - w) / 2;
	mainShapes.useProg2();
	const m = mat4.create();
	mat4.identity(m);
	mat4.translate(m,m,[x,y,0]);
	mat4.scale(m,m,[w,w,1]);
	gl.uniformMatrix4fv(gl.getUniformLocation(prog2, 'uProjectionMatrix'), false, this.mat);
	gl.uniform4fv(gl.getUniformLocation(prog2, 'overallColor'),
		new Float32Array(earlyreturn?[0.7,0.7,0.7,1]:[1,1,1,1]));
	gl.uniformMatrix4fv(gl.getUniformLocation(prog2, 'uModelViewMatrix'), false, m);
	mainShapes.drawArrays2('rect');
//console.log(this.busySignal, this.busyCounter);
	if (this.busySignal) {
		this.busyCounter += 0.01; if (this.busyCounter > Math.PI/2) this.busyCounter -= Math.PI/2;

		mat4.identity(m);
		mat4.translate(m,m,[x+w/2,y+w/2,0]);
		//mat4.scale(m,m,[w,w,1]);
		mat4.rotate(m,m, this.busyCounter, [0,0,1]);
		iconFont.draw(-10,7,"\x0A",config.themeColors.uiText,this.mat, m);

	} else if (this.walletSignal) {
		mat4.identity(m);
		mat4.translate(m,m,[x+w/2,y+w/2,0]);
		financeGraphicsFont.draw(-8.5,8.5,"\x08",config.themeColors.uiText,this.mat, m);
	} else if (this.errorSignal) {
		mat4.identity(m);
		mat4.translate(m,m,[x+w/2,y+w/2,0]);
		//mat4.scale(m,m,[w,w,1]);
		//mat4.rotate(m,m, this.busyCounter, [0,0,1]);
		iconFont.draw(-10,7,"\x0F",config.themeColors.uiLightningYellow,this.mat, m);
	} else if (this.copiedSignal) {
		let str = icap(tr("copied"));
		let tw = defaultFont.calcWidth(str);
		mat4.identity(m);
		mat4.translate(m,m,[x+w/2,y+w/2,0]);
		mat4.translate(m,m,[-tw/2,7,0]);
		defaultFont.draw(0,0,str,config.themeColors.uiText,this.mat, m);
	}
	if (this.busySignal) setTimeout(this.timeoutFunc, 100);
	if (earlyreturn) {
		return;
	}
//	if (this.qr.length == 1 && (
//			this.qr[0].startsWith('lnbc')
//	||  this.qr[0].startsWith('lnurl'))) {
//		this.queryStatus = true;
//	}

	var img = document.querySelector('#buf1');
	const rgbToHex = (r, g, b) => {
		return "#"+((1<<24)+(~~(r*255)<<16)+(~~(g*255)<<8)+~~(b*255)).toString(16).slice(1);
	}

	var i = this.qrindex + 1;
	if (i < this.qr.length && this.qrtex.length <= i) {
//console.log('render', this.qr[i].substring(0,10));
		var qrd = this.qr[i];
		if (qrd == qrd.toLowerCase()) qrd = qrd.toUpperCase();
		QrCreator.render({
			text: qrd, // Sadly, this library doesn't optimize uppercase-only codes.
			radius: 0.0, // 0.0 to 0.5
			ecLevel: 'H', // L, M, Q, H
			fill: rgbToHex(0,0,0,1), // foreground color
			background: rgbToHex(1,1,1,1), // color or null for transparent
			size: 1280 // in pixels
		}, img);
		this.qrtex.push(vp.setImage(img));
	}
	if (this.qrindex < 0) this.qrindex = 0;

	w = Math.min(this.sw, this.sh) * 0.9;
	x = (this.sw - w) / 2;
	y = (this.sh - w) / 2;
	mat4.identity(m);
	mat4.translate(m,m,[x,y,0]);
	mat4.scale(m,m,[w,w,1]);
	vp.drawImage(this.qrtex[this.qrindex], this.mat, m);

	var curtime = Date.now();
	var t = curtime - this.reftime;
	const r = 500;
	if (t >= r) {
		t = 0;
		this.reftime = curtime;
		this.qrindex += 1;
		if (this.qrindex >= this.qr.length) this.qrindex = 0;
	}

	const mat = mat4.create();
	if (this.qr[this.qrindex].toLowerCase().startsWith('lnbc')
	||  this.qr[this.qrindex].toLowerCase().startsWith('lnurl')) {
		const m = mat4.create();
		mat4.identity(mat);
		mat4.translate(mat,mat,[this.sw/2,this.sh/2,0]);
		mat4.scale(mat,mat,[w/160,w/160,1]);
		w = Math.min(this.sw, this.sh);
		for (var i=-1; i<=1; i++) for (var j=-1; j<=1; j++) if (i!=0||j!=0) {
			mat4.copy(m, mat);
			defaultFont.draw(-5+i/2,7+j/2, '🗲', [0,0,0,1], this.mat, m);
		}
		mat4.copy(m, mat);
		defaultFont.draw(-5,7, '🗲', customerColors.uiLightningYellow, this.mat, m);
	}

	if (this.qr.length > 1) {
		mainShapes.useProg2();
		gl.uniformMatrix4fv(gl.getUniformLocation(prog2, 'uProjectionMatrix'), false, this.mat);
		gl.uniform4fv(gl.getUniformLocation(prog2, 'overallColor'),
			new Float32Array([0,0,0,1]));
		mat4.copy(mat, m);
		mat4.translate(mat,mat,[0.425,0.425,0]);
		mat4.scale(mat,mat,[0.15,0.15,1]);
		gl.uniformMatrix4fv(gl.getUniformLocation(prog2, 'uModelViewMatrix'), false, mat);
		mainShapes.drawArrays2('circle');
		gl.uniform4fv(gl.getUniformLocation(prog2, 'overallColor'),
			new Float32Array([1,1,1,1]));
		mat4.copy(mat, m);
		mat4.translate(mat,mat,[0.43,0.43,0]);
		mat4.scale(mat,mat,[0.14,0.14,1]);
		gl.uniformMatrix4fv(gl.getUniformLocation(prog2, 'uModelViewMatrix'), false, mat);
		mainShapes.drawArrays2('circle');
		gl.uniform4fv(gl.getUniformLocation(prog2, 'overallColor'),
			new Float32Array([0,0,0,1]));
		mat4.copy(mat, m);
		mat4.translate(mat,mat,[0.5,0.5,0]);
		mat4.rotate(mat,mat,(t/r+this.qrindex)/this.qr.length*2*Math.PI,[0,0,1]);
		mat4.translate(mat,mat,[-0.003,0,0]);
		mat4.scale(mat,mat,[0.006,-0.06,1]);
		gl.uniformMatrix4fv(gl.getUniformLocation(prog2, 'uModelViewMatrix'), false, mat);
		mainShapes.drawArrays2('rect');

		//setTimeout(this.timeoutFunc, 1000);
		this.setRenderFlag(true);
	}
};
v.timeoutFunc = function() {
	lightningqr.setRenderFlag(true);
}

function setInvoice(invoiceString) {
console.log('setInvoice');
	lightningqr.clear();
	if (invoiceString && invoiceString.startsWith('lnbc') && checkingId) {
		lightningqr.qr = [invoiceString];
	} else {
		lightningqr.errorSignal = true;
		console.error('Not a recognized invoice type.');
	}
	lightningqr.setRenderFlag(true);
	lightningqr.busySignal = false;
}


/*
function generateStrikeInvoice() {
	const getAcct = async () => {
		console.log('genInv()');
		const response = await fetch(config.walletStrikeURL+'/accounts/handle/rld1/profile', {
			method: 'GET',
			headers: {
			  'Accept': 'application/json',
			  'Authorization': 'Bearer '+config.walletStrikeKey,
			},
		});
		const myJson = await response.json(); //extract JSON from the http response
		// do something with myJson
		console.log('myJson', myJson);
	}
	const genInv = async () => {
		console.group('genInv()');
		const response = await fetch(config.walletStrikeURL+'/invoices', {
			method: 'POST',
			headers: {
			  'Accept': 'application/json',
			  'Content-Type': 'application/json',
			  'Authorization': 'Bearer '+config.walletStrikeKey,
			},
			body: `{
				"correlationId": "224bff37-021f-43e5-9b9c-390e3d834750",
				"description": "Invoice for order 123",
				"amount": {
					"currency": "BTC",
					"amount": "0.00001"
				},
			}`,
		});
		const myJson = await response.json(); //extract JSON from the http response
		// do something with myJson
		console.log('myJson', myJson);
		console.groupEnd();
	}
	getAcct();
	//genInv();
}
function generateCoinosInvoice() {
	const userAction = async () => {
		console.log('userAction');
		const response = await fetch(config.walletCoinosURL+'/invoice', {
			method: 'POST',
			body: {invoice:{amount:1000,type:'lightning'}},
			headers: {
			  'Content-Type': 'application/json',
			  'Authorization': 'Bearer '+config.walletCoinosKey,
			}
		});
		const myJson = await response.json(); //extract JSON from the http response
		// do something with myJson
		console.log('myJson', myJson);
	}
	userAction();
}
	v.pageFocusFunc = function() {
		console.log('focus');
		switch (config.walletType) {
		case 'manual': break;
		case 'LNbits compatible': generateLNbitsInvoice(); break;
		case 'strike compatible': generateStrikeInvoice(); break;
		case 'coinos compatible': generateCoinosInvoice(); break;
		default:
		}
	}
*/