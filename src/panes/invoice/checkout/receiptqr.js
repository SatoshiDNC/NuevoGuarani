	var receiptqr = v = new vp.View(null);
	v.name = Object.keys({receiptqr}).pop();
	v.scaleFactor = 1;
	v.renderFunc = function() {
		gl.clearColor(...vendorColors.uiBackground);
		gl.clear(gl.COLOR_BUFFER_BIT);
		var pageindex = checkoutpages.index;
		var earlyreturn = 0;
		if (pageindex < 0 || Math.abs(checkoutpages.getPageOffset(pageindex)) > 0.01) {
			this.pad = 1;
			this.setRenderFlag(true);
			earlyreturn = 1;
			//return;
		}
		if (!earlyreturn && this.pad > 0) {
			this.pad -= 1;
			this.setRenderFlag(true);
			earlyreturn = 1;
			//return;
		}
		if (!earlyreturn && this.pad == 0) {
			this.pad = -1;
			this.qrindex = -1;
			this.reftime = Date.now();
			this.qrtex = [];
		}
		if (this.qr.length == 0) {
			earlyreturn = 1;
		}

		var w = Math.min(this.sw, this.sh) * (earlyreturn?0.9:1);
		var x = (this.sw - w) / 2;
		var y = (this.sh - w) / 2;
		useProg2();
		const m = mat4.create();
		mat4.identity(m);
		mat4.translate(m,m,[x,y,0]);
		mat4.scale(m,m,[w,w,1]);
		gl.uniformMatrix4fv(gl.getUniformLocation(prog2, 'uProjectionMatrix'), false, this.mat);
		gl.uniform4fv(gl.getUniformLocation(prog2, 'overallColor'),
			new Float32Array(earlyreturn?[0.7,0.7,0.7,0.7]:[1,1,1,1]));
		gl.uniformMatrix4fv(gl.getUniformLocation(prog2, 'uModelViewMatrix'), false, m);
		gl.drawArrays(typ2.rect, beg2.rect, len2.rect);
		if (earlyreturn) {
			return;
		}

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
		if (this.qr[this.qrindex].startsWith('lnbc')
		||  this.qr[this.qrindex].startsWith('lnurl')) {
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
			useProg2();
			gl.uniformMatrix4fv(gl.getUniformLocation(prog2, 'uProjectionMatrix'), false, this.mat);
			gl.uniform4fv(gl.getUniformLocation(prog2, 'overallColor'),
				new Float32Array([0,0,0,1]));
			mat4.copy(mat, m);
			mat4.translate(mat,mat,[0.425,0.425,0]);
			mat4.scale(mat,mat,[0.15,0.15,1]);
			gl.uniformMatrix4fv(gl.getUniformLocation(prog2, 'uModelViewMatrix'), false, mat);
			gl.drawArrays(typ2.circle, beg2.circle, len2.circle);

			{
				const t = icap(tr('receipt')), tw = defaultFont.calcWidth(t);

				gl.uniform4fv(gl.getUniformLocation(prog2, 'overallColor'),
					new Float32Array([0,0,0,1]));
				mat4.identity(mat);
				mat4.translate(mat,mat,[this.sw/2,this.sh/2,0]);
				mat4.scale(mat,mat,[w/360,w/360,1]);
				mat4.translate(mat,mat,[-tw/2-4,39-14-2,0]);
				mat4.scale(mat,mat,[tw+8,16+4,1]);
				gl.uniformMatrix4fv(gl.getUniformLocation(prog2, 'uModelViewMatrix'), false, mat);
				gl.drawArrays(typ2.rect, beg2.rect, len2.rect);

				const m1 = mat4.create();
				mat4.identity(mat);
				mat4.translate(mat,mat,[this.sw/2,this.sh/2,0]);
				mat4.scale(mat,mat,[w/360,w/360,1]);
				mat4.copy(m1, mat);
				defaultFont.draw(-tw/2,39, t,
					new DefaultLightTheme().uiLightningYellow, this.mat, m1);
			}

			useProg2();
			gl.uniformMatrix4fv(gl.getUniformLocation(prog2, 'uProjectionMatrix'), false, this.mat);
			gl.uniform4fv(gl.getUniformLocation(prog2, 'overallColor'),
				new Float32Array([1,1,1,1]));
			mat4.copy(mat, m);
			mat4.translate(mat,mat,[0.43,0.43,0]);
			mat4.scale(mat,mat,[0.14,0.14,1]);
			gl.uniformMatrix4fv(gl.getUniformLocation(prog2, 'uModelViewMatrix'), false, mat);
			gl.drawArrays(typ2.circle, beg2.circle, len2.circle);
			gl.uniform4fv(gl.getUniformLocation(prog2, 'overallColor'),
				new Float32Array([0,0,0,1]));
			mat4.copy(mat, m);
			mat4.translate(mat,mat,[0.5,0.5,0]);
			mat4.rotate(mat,mat,(t/r+this.qrindex)/this.qr.length*2*Math.PI,[0,0,1]);
			mat4.translate(mat,mat,[-0.003,0,0]);
			mat4.scale(mat,mat,[0.006,-0.06,1]);
			gl.uniformMatrix4fv(gl.getUniformLocation(prog2, 'uModelViewMatrix'), false, mat);
			gl.drawArrays(typ2.rect, beg2.rect, len2.rect);

			setTimeout(this.timeoutFunc, 100);
//			this.setRenderFlag(true);
		}
	};
	v.timeoutFunc = function() {
		receiptqr.setRenderFlag(true);
	}
