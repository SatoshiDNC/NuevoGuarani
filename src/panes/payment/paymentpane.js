var pmtbuttonbar = v = new vp.View(null);
v.name = Object.keys({pmtbuttonbar}).pop();
v.designFit = [400,50];
/*
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
			g.enabled?(sel?vendorColors.uiButtonSel:vendorColors.uiButton):vendorColors.uiButtonGhost,
			g.viewport.mat, mat);
	}
	g.clickFunc = function() {
		if (paymentpane.scanner) {
			paymentpane.scanner.destroy();
			paymentpane.scanner = undefined;
		}
		paymentpane.playing = false;
		paymentpane.timeupdate = false;
		paymentpane.updateFlag = false;
		delete paymentmain.designFit;
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
		if (window.confirm(tr("Discard this invoice?"))) {
			dataentry.clearDataEntry();
			invoicepane.invoiceitems = [];
			invoicepane.setRenderFlag(true);
			checkoutpages.toPage(0);
		}
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
	const th = vendorColors;
	gl.clearColor(...th.uiBackground);
	gl.clear(gl.COLOR_BUFFER_BIT);
	for (const g of this.gadgets) {
		if (g.renderFunc) g.renderFunc.call(g);
	}
}
*/

var paymentmain = v = new vp.View(null);
v.name = Object.keys({paymentmain}).pop();
v.gadgets.push(v.homeGad = g = new vp.Gadget(v));
	g.refw = 30; g.refh = 30; g.actionFlags = vp.GAF_CLICKABLE;
	g.w = g.refw; g.h = g.refh; g.x = (50 - g.w)/2; g.y = (50 - g.h)/2;
	g.autoHull();
	g.icon = "\x00";
	g.renderFunc = function() {
		const th = vendorColors, g = this;
		var sel = clickTapActive.includes(g.gestureState);
		var color = g.enabled? th.uiButton: th.uiButtonGhost;
		if (g.viewport.overlaymode)
			color = g.enabled? th.uiVideoOverlayButton: th.uiVideoOverlayButtonGhost;
		if (sel) color = th.uiButtonSel;
		const mat = mat4.create();
		mat4.identity(mat);
		mat4.translate(mat, mat, [g.x, g.y, 0]);
		mat4.scale(mat, mat, [g.w/18, g.h/18, 0]);
		mat4.translate(mat, mat, [-1, 16, 0]);
		iconFont.draw(0,0, g.icon, color, g.viewport.mat, mat);
	}
	g.clickFunc = function() {
		if (paymentpane.scanner) {
			paymentpane.scanner.destroy();
			paymentpane.scanner = undefined;
		}
		paymentpane.playing = false;
		paymentpane.timeupdate = false;
		paymentpane.updateFlag = false;
		delete paymentmain.designFit;
		transitionTo(home, 'min');
	}
v.gadgets.push(v.pushGad = g = new vp.Gadget(v));
	g.refw = 30; g.refh = 30; g.actionFlags = vp.GAF_CLICKABLE;
	g.w = g.refw; g.h = g.refh; g.x = 50 + (50 - g.w)/2; g.y = (50 - g.h)/2;
	g.autoHull();
	g.icon = "\x01";
	g.enabled = false;
	g.renderFunc = v.homeGad.renderFunc;
	g.clickFunc = function() {
		console.log('pushGad');
	}
v.gadgets.push(v.popGad = g = new vp.Gadget(v));
	g.refw = 30; g.refh = 30; g.actionFlags = vp.GAF_CLICKABLE;
	g.w = g.refw; g.h = g.refh; g.x = 100 + (50 - g.w)/2; g.y = (50 - g.h)/2;
	g.autoHull();
	g.icon = "\x02";
	g.enabled = false;
	g.renderFunc = v.homeGad.renderFunc;
	g.clickFunc = function() {
		console.log('popGad');
	}
v.gadgets.push(v.trashGad = g = new vp.Gadget(v));
	g.refw = 30; g.refh = 30; g.actionFlags = vp.GAF_CLICKABLE;
	g.w = g.refw; g.h = g.refh; g.x = 150 + (50 - g.w)/2; g.y = (50 - g.h)/2;
	g.autoHull();
	g.icon = "\x03";
	g.enabled = false;
	g.renderFunc = v.homeGad.renderFunc;
	g.clickFunc = function() {
		if (window.confirm(tr("Discard this invoice?"))) {
			dataentry.clearDataEntry();
			invoicepane.invoiceitems = [];
			invoicepane.setRenderFlag(true);
			checkoutpages.toPage(0);
		}
	}
/*
function initTexture(gl) {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Because video has to be download over the internet
  // they might take a moment until it's ready so
  // put a single pixel in the texture so we can
  // use it immediately.
  const level = 0;
  const internalFormat = gl.RGBA;
  const width = 1;
  const height = 1;
  const border = 0;
  const srcFormat = gl.RGBA;
  const srcType = gl.UNSIGNED_BYTE;
  const pixel = new Uint8Array([0, 0, 255, 255]); // opaque blue
  gl.texImage2D(
    gl.TEXTURE_2D,
    level,
    internalFormat,
    width,
    height,
    border,
    srcFormat,
    srcType,
    pixel
  );

  // Turn off mips and set wrapping to clamp to edge so it
  // will work regardless of the dimensions of the video.
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

  return texture;
}
function updateTexture(gl, texture, video) {
  const level = 0;
  const internalFormat = gl.RGBA;
  const srcFormat = gl.RGBA;
  const srcType = gl.UNSIGNED_BYTE;
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(
    gl.TEXTURE_2D,
    level,
    internalFormat,
    srcFormat,
    srcType,
    video,
  );
}
*/
v.layoutFunc = function() {
	const v = this;
	if (!paymentpane.videoEl) return;
	if (!v.designFit) return;
	if (paymentpane.videoEl.videoWidth  != v.designFit[0]
	||  paymentpane.videoEl.videoHeight != v.designFit[1]) {
		paymentmain.designFit =
			[paymentpane.videoEl.videoWidth, paymentpane.videoEl.videoHeight];
		paymentmain.queueLayout();
		if (paymentpane.scanner) {
			paymentpane.scanner.stop();
			paymentpane.scanner.start();
		}
	}

	// Strategy: since the video might not be proportioned to fill the entire viewport,
  // adapt the layout for each scenario, placing the button bar in the position that
  // results in the most pleasing aesthetic.

	v.vidPos = [(v.sw-v.designFit[0])/2, (v.sh-v.designFit[1])/2];
	const view_aspect = v.w/v.h;
	const vid_aspect = v.designFit[0]/v.designFit[1];
	const s = v.w > v.h? v.h / 400 : v.w / 400; /* button scale determined by view size */
	var decidedlayout = '';
	v.overlaymode = false;
	var sidemax = v.sh, bottommax = v.sw;
	if (view_aspect > vid_aspect) { // wee have blank spaces on left and right
		const amt = v.w - v.h * vid_aspect;
		if (Math.ceil(amt/s) >= 50) { // it's enough empty space for the buttons, so use it
			decidedlayout = 'sidebar';
			// if necessary, shift video slightly to ensure enough space for the buttons
			if (Math.floor(amt/s) < 100) {
				v.vidPos[0] = Math.ceil(50*s/v.getScale());
			}
		} else { // it's not enough space, so overlay and decide what looks best
			v.overlaymode = true;
			if (view_aspect < 1) { // portrait, overlay the buttons within video frame
				decidedlayout = 'bottombar';
				bottommax = v.designFit[0];
			} else { // overlay, but also shift the video fully under, not to cross the edge
				decidedlayout = 'sidebar';
				v.vidPos[0] = 0;
			}
		}
	} else { // we have blank spaces on top and bottom
		const amt = v.h - v.w / vid_aspect;
		if (Math.ceil(amt/s) >= 50) { // it's enough empty space for the buttons, so use it
			decidedlayout = 'bottombar';
			// if necessary, shift video slightly to ensure enough space for the buttons
			if (Math.floor(amt/s) < 100) {
				v.vidPos[1] = v.sh - v.designFit[1] - Math.ceil(50*s/v.getScale());
			}
		} else { // it's not enough space, so overlay and decide what looks best
			v.overlaymode = true;
			if (view_aspect > 1) { // landscape, overlay the buttons within video frame
				decidedlayout = 'sidebar';
				sidemax = v.designFit[1];
			} else { // overlay, but also shift the video fully under, not to cross the edge
				decidedlayout = 'bottombar';
				v.vidPos[1] = v.sh - v.designFit[1];
			}
		}
	}
	for (const g of v.gadgets) if (g.refw && g.refh) {
		g.w = g.refw / v.getScale() * s;
		g.h = g.refh / v.getScale() * s;
	}
	const bw = 50 / v.getScale() * s;
	switch (decidedlayout) {
	case 'sidebar':
		var gadtotal = 0; for (const g of v.gadgets) if (g.refw && g.refh) gadtotal += g.h;
		var space = (sidemax - gadtotal) / (v.gadgets.length * 2);
		var y = (v.sh - sidemax)/2;
		for (const g of v.gadgets) {
			g.x = (bw - g.w)/2;
			g.y = y + space;
			y += space + g.h + space;
		}
		break;
	case 'bottombar':
		var gadtotal = 0; for (const g of v.gadgets) if (g.refw && g.refh) gadtotal += g.w;
		var space = (bottommax - gadtotal) / (v.gadgets.length * 2);
		var x = (v.sw - bottommax)/2;
		for (const g of v.gadgets) {
			g.y = v.sh - bw + (bw - g.h)/2;
			g.x = x + space;
			x += space + g.w + space;
		}
		break;
	}
	for (const g of v.gadgets) if (g.refw && g.refh) {
		g.autoHull();
	}
}
v.renderFunc = function() {

function adj(m) { // Compute the adjugate of m
  return [
    m[4]*m[8]-m[5]*m[7], m[2]*m[7]-m[1]*m[8], m[1]*m[5]-m[2]*m[4],
    m[5]*m[6]-m[3]*m[8], m[0]*m[8]-m[2]*m[6], m[2]*m[3]-m[0]*m[5],
    m[3]*m[7]-m[4]*m[6], m[1]*m[6]-m[0]*m[7], m[0]*m[4]-m[1]*m[3]
  ];
}
function multmm(a, b) { // multiply two matrices
  var c = Array(9);
  for (var i = 0; i != 3; ++i) {
    for (var j = 0; j != 3; ++j) {
      var cij = 0;
      for (var k = 0; k != 3; ++k) {
        cij += a[3*i + k]*b[3*k + j];
      }
      c[3*i + j] = cij;
    }
  }
  return c;
}
function multmv(m, v) { // multiply matrix and vector
  return [
    m[0]*v[0] + m[1]*v[1] + m[2]*v[2],
    m[3]*v[0] + m[4]*v[1] + m[5]*v[2],
    m[6]*v[0] + m[7]*v[1] + m[8]*v[2]
  ];
}
function pdbg(m, v) {
  var r = multmv(m, v);
  return r + " (" + r[0]/r[2] + ", " + r[1]/r[2] + ")";
}
function basisToPoints(x1, y1, x2, y2, x3, y3, x4, y4) {
  var m = [
    x1, x2, x3,
    y1, y2, y3,
     1,  1,  1
  ];
  var v = multmv(adj(m), [x4, y4, 1]);
  return multmm(m, [
    v[0], 0, 0,
    0, v[1], 0,
    0, 0, v[2]
  ]);
}
function general2DProjection(
  x1s, y1s, x1d, y1d,
  x2s, y2s, x2d, y2d,
  x3s, y3s, x3d, y3d,
  x4s, y4s, x4d, y4d
) {
  var s = basisToPoints(x1s, y1s, x2s, y2s, x3s, y3s, x4s, y4s);
  var d = basisToPoints(x1d, y1d, x2d, y2d, x3d, y3d, x4d, y4d);
  return multmm(d, adj(s));
}
function project(m, x, y) {
  var v = multmv(m, [x, y, 1]);
  return [v[0]/v[2], v[1]/v[2]];
}
function transform2d(elt, x1, y1, x2, y2, x3, y3, x4, y4) {
  //var w = elt.offsetWidth, h = elt.offsetHeight;
  var w = 1, h = 1;
  var t = general2DProjection
    (0, 0, x1, y1, w, 0, x2, y2, 0, h, x3, y3, w, h, x4, y4);
  for(i = 0; i != 9; ++i) t[i] = t[i]/t[8];
  t = [t[0], t[3], 0, t[6],
       t[1], t[4], 0, t[7],
       0   , 0   , 1, 0   ,
       t[2], t[5], 0, t[8]];
	return t;
/*
  t = "matrix3d(" + t.join(", ") + ")";
  elt.style["-webkit-transform"] = t;
  elt.style["-moz-transform"] = t;
  elt.style["-o-transform"] = t;
  elt.style.transform = t;
*/
}

	const th = vendorColors, v = this;
	gl.clearColor(...th.uiBackground);
	gl.clear(gl.COLOR_BUFFER_BIT);
	this.setRenderFlag(true);
	if (!v.designFit || !v.vidPos) return;
	if (!paymentpane.updateFlag) return;
//	paymentpane.updateFlag = false;
//	console.log('renderFunc');
	if (!this.texture) this.texture = initTexture(gl);
  updateTexture(gl, this.texture, this.videoEl);
	const mat = mat4.create();
	var w = v.designFit[0], h = v.designFit[1];
	var x = v.vidPos[0], y = v.vidPos[1];
	mat4.identity(mat);
	mat4.translate(mat, mat, [x, y, 0]);
	mat4.scale(mat, mat, [w, h, 1]);
	mainShapes.useProg4();
	gl.uniformMatrix4fv(gl.getUniformLocation(prog4, 'uProjectionMatrix'), false, this.mat);
	gl.uniformMatrix4fv(gl.getUniformLocation(prog4, 'uModelViewMatrix'), false, mat);
	gl.uniform4fv(gl.getUniformLocation(prog4, 'overallColor'), new Float32Array([1,1,1,1]));
	mainShapes.drawArrays4('rect');

	if (paymentpane.scanner
	&& paymentpane.scanner.lastresult.data != ''
	&& paymentpane.scanner.results.length > 1) {
	  mainShapes.useProg2();
		var p = paymentpane.scanner.lastresult.cornerPoints;
		var t = transform2d(undefined,
			p[0].x+x, p[0].y+y, p[1].x+x, p[1].y+y, p[3].x+x, p[3].y+y, p[2].x+x, p[2].y+y);
		var m = mat4.fromValues(
			t[ 0],t[ 1],t[ 2],t[ 3],
			t[ 4],t[ 5],t[ 6],t[ 7],
			t[ 8],t[ 9],t[10],t[11],
			t[12],t[13],t[14],t[15],
		);
		gl.disable(gl.DEPTH_TEST);
		gl.uniformMatrix4fv(gl.getUniformLocation(prog2, 'uProjectionMatrix'), false, this.mat);
		gl.uniform4fv(gl.getUniformLocation(prog2, 'overallColor'),
			new Float32Array([0,1,0,paymentpane.scanner.intensity]));
		mat4.translate(m, m, [0.43, 0.43 + 0.14, 0]);
		mat4.scale(m, m, [0.14, -0.14, 1]);
		gl.uniformMatrix4fv(gl.getUniformLocation(prog2, 'uModelViewMatrix'), false, m);
		var tris = len2.pies/3;
		var parts = paymentpane.scanner.results.length;
		for (var i=0; i<parts; i++) if (paymentpane.scanner.results[i] != '') {
			var beg = Math.round(tris * i / parts);
			var end = Math.round(tris * (i + 1) / parts);
			gl.drawArrays(mainShapes.typ2.pies,
				mainShapes.beg2.pies + beg * 3,
				(end - beg) * 3);
		}
		paymentpane.scanner.intensity *= 0.95;
	}

  mainShapes.useProg2();
	var s = v.designFit[0] < v.designFit[1]? v.designFit[0]: v.designFit[1];
	w = s * 0.9; h = s * 0.9;
	gl.uniformMatrix4fv(gl.getUniformLocation(prog2, 'uProjectionMatrix'), false, this.mat);
/*
	gl.uniform4fv(gl.getUniformLocation(prog2, 'overallColor'),
		new Float32Array([0,0,0,0.5]));
	for (var i=0; i<4; i++) {
		mat4.identity(mat);
		switch(i) {
		case 0:	mat4.translate(mat, mat, [0, 0, 0]);
						mat4.scale(mat, mat, [v.sw, (v.sh-h)/2, 1]); break;
		case 1:	mat4.translate(mat, mat, [0, (v.sh-h)/2, 0]);
						mat4.scale(mat, mat, [(v.sw-w)/2, h, 1]); break;
		case 2:	mat4.translate(mat, mat, [v.sw - (v.sw-w)/2, (v.sh-h)/2, 0]);
						mat4.scale(mat, mat, [(v.sw-w)/2, h, 1]); break;
		case 3:	mat4.translate(mat, mat, [0, v.sh - (v.sh-h)/2, 0]);
						mat4.scale(mat, mat, [v.sw, (v.sh-h)/2, 1]); break;
		}
		gl.uniformMatrix4fv(gl.getUniformLocation(prog2, 'uModelViewMatrix'), false, mat);
		mainShapes.drawArrays2('rect');
	}
*/
	gl.uniform4fv(gl.getUniformLocation(prog2, 'overallColor'), new Float32Array([1,1,1,1]));
	mat4.identity(mat);
	mat4.translate(mat, mat, [x + (v.designFit[0] - w)/2, y + (v.designFit[1] - h)/2, 0]);
	mat4.scale(mat, mat, [w, h, 1]);
	gl.uniformMatrix4fv(gl.getUniformLocation(prog2, 'uModelViewMatrix'), false, mat);
	mainShapes.drawArrays2('scanbox');

	for (const g of this.gadgets) {
		if (g.renderFunc) g.renderFunc.call(g);
	}
}

var paymentpane = v = new vp.SliceView(null, 'b', 0);
v.name = Object.keys({paymentpane}).pop();
v.prop = true;
//v.a = pmtbuttonbar; pmtbuttonbar.parent = v;
v.b = paymentmain; paymentmain.parent = v;
v.updateFlag = false;
v.checkReady = function() {
	if (this.playing && this.timeupdate) {
		this.setRenderFlag(true);
		this.updateFlag = true;
	}
}
v.switchedToFunc = function() {
	if (!this.videoEl) {
		this.videoEl = document.getElementById('scan1');
		this.videoEl.addEventListener("loadedmetadata", function (e) {
			paymentmain.designFit = [this.videoWidth, this.videoHeight];
			paymentmain.queueLayout();
		}, false);
		this.videoEl.addEventListener("playing", () => {
			paymentpane.playing = true;
			paymentpane.checkReady();
		}, true);
		this.videoEl.addEventListener("timeupdate", () => {
			paymentpane.timeupdate = true;
			paymentpane.checkReady();
		}, true);
	}
	var s = this.videoEl.videoWidth; if (s>this.videoEl.videoHeight) s = this.videoEl.videoHeight;
	var vidEl = this.videoEl;
	var cam;
	if (camerasettings.cameralist.index >= 0)
		cam = cameras[camerasettings.cameralist.index].deviceId;
	if (!cam) cam = 'environment';
	this.scanner = new QrScanner(
		this.videoEl,
		function(result) {
			this.intensity = 0.5;
			var repeat = (result.data == this.lastresult.data);
			this.lastresult = result;
			if (repeat) return;

			var beeptype = 'click', ob = false;
			if (result.data.toLowerCase().startsWith('lnbc')
			||  result.data.toLowerCase().startsWith('lnurl')) {
				this.results = [];
				vp.beep('qr-scan');
				paymentpane.scanner.stop();
				paymentpane.scanner.destroy();
				paymentpane.scanner = undefined;
				paymentpane.playing = false;
				paymentpane.timeupdate = false;
				paymentpane.updateFlag = false;
				delete paymentmain.designFit;
				payinvconf.data = result.data.toLowerCase();
				var root = menudiv, v = payinvconf;
				root.b = v; v.parent = root;
				root.relayout();
			} else if ((ob = tryParseJSONObject(result.data)) !== false
			&& typeof(ob) == 'object'
			&& typeof(ob[0]) == 'number' && ob[0] > 0
			&& typeof(ob[1]) == 'number' && ob[0] <= ob[1]) {
				if (this.results.length == 0) {
					this.results = Array(ob[1]).join(".").split(".");
				}
				if (this.results[ob[0]-1] != result.data) {
					this.results[ob[0]-1] = result.data;
					beeptype = 'qr-scan';
					for (var i=0; i<ob[1]; i++) if (this.results[i] == '') {
						beeptype = 'qr-part';
						break;
					}
					if (beeptype == 'qr-scan' && ob[1] == this.results.length) {
						var receipt = new Receipt();
						var data = receipt.fromParts(this.results);
						if (data) {
							paymentpane.scanner.stop();
							paymentpane.scanner.destroy();
							paymentpane.scanner = undefined;
							paymentpane.playing = false;
							paymentpane.timeupdate = false;
							paymentpane.updateFlag = false;
							delete paymentmain.designFit;
							displayreceipt.setData(data);
							pmtrcptmain.userY = 0;
							var root = menudiv, v = displayreceipt;
							root.b = v; v.parent = root;
							root.relayout();
						} else {
							beeptype = 'error';
						}
					}
				}
				vp.beep(beeptype);
			} else {
				console.log('Unrecognized QR code:', result);
			}
		},
		{
			preferredCamera: cam,
			calculateScanRegion: function(video) {
        const smallestDimension = Math.min(video.videoWidth, video.videoHeight);
        const scanRegionSize = smallestDimension;
        return {
            x: Math.round((video.videoWidth - scanRegionSize) / 2),
            y: Math.round((video.videoHeight - scanRegionSize) / 2),
            width: scanRegionSize,
            height: scanRegionSize,
        };
    	}, returnDetailedScanResult: true
		},
//calculateScanRegion: {x:0, y:0, width:100, height:100, downScaledWidth:400, downScaledHeight:400}, 
	);
	this.scanner.results = [];
	this.scanner.lastresult = {data: ''};
	this.scanner.start();
}

