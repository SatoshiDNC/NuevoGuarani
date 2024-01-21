v = importaccountsettings
v.name = Object.keys({importaccountsettings}).pop()
v.title = 'import account'
v.minX = 0; v.maxX = 0
v.minY = 0; v.maxY = 0
v.gadgets.push(v.swipeGad = new vp.SwipeGadget(v))
v.swipeGad.actionFlags = vp.GAF_SWIPEABLE_UPDOWN | vp.GAF_SCROLLABLE_UPDOWN
v.swipeGad.hide = true
v.gadgets.push(v.qrscanner = g = new vp.Gadget(v))
  g.busyCounter = 0
  g.clear = function() {
    this.busySignal = false
    this.errorSignal = false
    this.walletSignal = false
    this.copiedSignal = false
    this.triggerPad = true
  }
  g.clear()
  g.layoutFunc = function () {
    const g = this, v = g.viewport
    g.h = g.w
    g.autoHull()
    v.layoutFuncAux()
  }
  g.renderFunc = function () {
    const g = this, v = g.viewport
    v.renderFuncAux()
  }
v.pageFocusFunc = function() {
  const v = this
  v.switchedToFunc()
}
v.pageBlurFunc = function() {
  const v = this
  if (v.scanner) {
    v.scanner.stop()
    v.scanner.destroy()
  }
  v.scanner = undefined
  v.playing = false
  v.timeupdate = false
  v.updateFlag = false
  delete v.videoDims
}

v.updateFlag = false
v.checkReady = function() {
  const v = this
	if (v.playing && v.timeupdate) {
		v.setRenderFlag(true)
		v.updateFlag = true
	}
}
v.switchedToFunc = function() {
  const v = this
	if (!v.videoEl) {
		v.videoEl = document.getElementById('scan1')
		v.videoEl.addEventListener("loadedmetadata", function (e) {
			v.videoDims = [v.videoWidth, v.videoHeight]
			v.queueLayout()
		}, false)
		v.videoEl.addEventListener("playing", () => {
			v.playing = true
			v.checkReady()
		}, true)
		v.videoEl.addEventListener("timeupdate", () => {
			v.timeupdate = true
			v.checkReady()
		}, true)
	}
	var s = this.videoEl.videoWidth; if (s>this.videoEl.videoHeight) s = this.videoEl.videoHeight
	var vidEl = this.videoEl
	var cam
	if (camerasettings.cameralist.index >= 0)
		cam = cameras[camerasettings.cameralist.index].deviceId
	if (!cam) cam = 'environment'
	this.scanner = new QrScanner(
		this.videoEl,
		function(result) {
			this.intensity = 0.5
			var repeat = (result.data == this.lastresult.data)
			this.lastresult = result
			if (repeat) return

			var beeptype = 'click', ob = false
			if (result.data.toLowerCase().startsWith('lnbc')
			||  result.data.toLowerCase().startsWith('lnurl')) {
				this.results = []
				vp.beep('qr-scan')
				this.scanner.stop()
				this.scanner.destroy()
				this.scanner = undefined
				this.playing = false
				this.timeupdate = false
				this.updateFlag = false
				delete this.videoDims
				payinvconf.data = result.data.toLowerCase()
				var root = menudiv, v = payinvconf
				root.b = v; v.parent = root
				root.relayout()
			} else if ((ob = tryParseJSONObject(result.data)) !== false
			&& typeof(ob) == 'object'
			&& typeof(ob[0]) == 'number' && ob[0] > 0
			&& typeof(ob[1]) == 'number' && ob[0] <= ob[1]) {
				if (this.results.length == 0) {
					this.results = Array(ob[1]).join(".").split(".")
				}
				if (this.results[ob[0]-1] != result.data) {
					this.results[ob[0]-1] = result.data
					beeptype = 'qr-scan'
					for (var i=0; i<ob[1]; i++) if (this.results[i] == '') {
						beeptype = 'qr-part'
						break
					}
					if (beeptype == 'qr-scan' && ob[1] == this.results.length) {
						var receipt = new Receipt()
						var data = receipt.fromParts(this.results)
						if (data) {
							this.scanner.stop()
							this.scanner.destroy()
							this.scanner = undefined
							this.playing = false
							this.timeupdate = false
							this.updateFlag = false
							delete this.videoDims
							displayreceipt.setData(data)
							pmtrcptmain.userY = 0
							var root = menudiv, v = displayreceipt
							root.b = v; v.parent = root
							root.relayout()
						} else {
							beeptype = 'error'
						}
					}
				}
				vp.beep(beeptype)
			} else {
				console.log('Unrecognized QR code:', result)
			}
		},
		{
			preferredCamera: cam,
			calculateScanRegion: function(video) {
        const smallestDimension = Math.min(video.videoWidth, video.videoHeight)
        const scanRegionSize = smallestDimension
        return {
            x: Math.round((video.videoWidth - scanRegionSize) / 2),
            y: Math.round((video.videoHeight - scanRegionSize) / 2),
            width: scanRegionSize,
            height: scanRegionSize,
        }
    	}, returnDetailedScanResult: true
		},
//calculateScanRegion: {x:0, y:0, width:100, height:100, downScaledWidth:400, downScaledHeight:400}, 
	);
	this.scanner.results = []
	this.scanner.lastresult = {data: ''}
	this.scanner.start()
  this.qrscanner.busySignal = true
}

v.layoutFuncAux = function() {
	const v = this
	if (!this.videoEl) return
	if (!v.videoDims) return
	if (this.videoEl.videoWidth  != v.videoDims[0]
	||  this.videoEl.videoHeight != v.videoDims[1]) {
		this.videoDims = [this.videoEl.videoWidth, this.videoEl.videoHeight]
		this.queueLayout()
		if (this.scanner) {
			this.scanner.stop()
			this.scanner.start()
		}
	}

  v.vidPos = [0,0]

	// // Strategy: since the video might not be proportioned to fill the entire viewport,
  // // adapt the layout for each scenario, placing the button bar in the position that
  // // results in the most pleasing aesthetic.

	// v.vidPos = [(v.sw-v.designFit[0])/2, (v.sh-v.designFit[1])/2]
	// const view_aspect = v.w/v.h
	// const vid_aspect = v.designFit[0]/v.designFit[1]
	// const s = v.w > v.h? v.h / 400 : v.w / 400 /* button scale determined by view size */
	// var decidedlayout = ''
	// v.overlaymode = false
	// var sidemax = v.sh, bottommax = v.sw
	// if (view_aspect > vid_aspect) { // wee have blank spaces on left and right
	// 	const amt = v.w - v.h * vid_aspect
	// 	if (Math.ceil(amt/s) >= 50) { // it's enough empty space for the buttons, so use it
	// 		decidedlayout = 'sidebar'
	// 		// if necessary, shift video slightly to ensure enough space for the buttons
	// 		if (Math.floor(amt/s) < 100) {
	// 			v.vidPos[0] = Math.ceil(50*s/v.getScale())
	// 		}
	// 	} else { // it's not enough space, so overlay and decide what looks best
	// 		v.overlaymode = true
	// 		if (view_aspect < 1) { // portrait, overlay the buttons within video frame
	// 			decidedlayout = 'bottombar'
	// 			bottommax = v.designFit[0]
	// 		} else { // overlay, but also shift the video fully under, not to cross the edge
	// 			decidedlayout = 'sidebar'
	// 			v.vidPos[0] = 0
	// 		}
	// 	}
	// } else { // we have blank spaces on top and bottom
	// 	const amt = v.h - v.w / vid_aspect
	// 	if (Math.ceil(amt/s) >= 50) { // it's enough empty space for the buttons, so use it
	// 		decidedlayout = 'bottombar'
	// 		// if necessary, shift video slightly to ensure enough space for the buttons
	// 		if (Math.floor(amt/s) < 100) {
	// 			v.vidPos[1] = v.sh - v.designFit[1] - Math.ceil(50*s/v.getScale())
	// 		}
	// 	} else { // it's not enough space, so overlay and decide what looks best
	// 		v.overlaymode = true
	// 		if (view_aspect > 1) { // landscape, overlay the buttons within video frame
	// 			decidedlayout = 'sidebar'
	// 			sidemax = v.designFit[1]
	// 		} else { // overlay, but also shift the video fully under, not to cross the edge
	// 			decidedlayout = 'bottombar'
	// 			v.vidPos[1] = v.sh - v.designFit[1]
	// 		}
	// 	}
	// }
	// for (const g of v.gadgets) if (g.refw && g.refh) {
	// 	g.w = g.refw / v.getScale() * s
	// 	g.h = g.refh / v.getScale() * s
	// }
	// const bw = 50 / v.getScale() * s
	// switch (decidedlayout) {
	// case 'sidebar':
	// 	var gadtotal = 0; for (const g of v.gadgets) if (g.refw && g.refh) gadtotal += g.h
	// 	var space = (sidemax - gadtotal) / (v.gadgets.length * 2)
	// 	var y = (v.sh - sidemax)/2
	// 	for (const g of v.gadgets) {
	// 		g.x = (bw - g.w)/2
	// 		g.y = y + space
	// 		y += space + g.h + space
	// 	}
	// 	break
	// case 'bottombar':
	// 	var gadtotal = 0; for (const g of v.gadgets) if (g.refw && g.refh) gadtotal += g.w
	// 	var space = (bottommax - gadtotal) / (v.gadgets.length * 2)
	// 	var x = (v.sw - bottommax)/2
	// 	for (const g of v.gadgets) {
	// 		g.y = v.sh - bw + (bw - g.h)/2
	// 		g.x = x + space
	// 		x += space + g.w + space
	// 	}
	// 	break
	// }
	// for (const g of v.gadgets) if (g.refw && g.refh) {
	// 	g.autoHull()
	// }
}
v.renderFuncAux = function() {

  function adj(m) { // Compute the adjugate of m
    return [
      m[4]*m[8]-m[5]*m[7], m[2]*m[7]-m[1]*m[8], m[1]*m[5]-m[2]*m[4],
      m[5]*m[6]-m[3]*m[8], m[0]*m[8]-m[2]*m[6], m[2]*m[3]-m[0]*m[5],
      m[3]*m[7]-m[4]*m[6], m[1]*m[6]-m[0]*m[7], m[0]*m[4]-m[1]*m[3]
    ]
  }
  function multmm(a, b) { // multiply two matrices
    var c = Array(9)
    for (var i = 0; i != 3; ++i) {
      for (var j = 0; j != 3; ++j) {
        var cij = 0
        for (var k = 0; k != 3; ++k) {
          cij += a[3*i + k]*b[3*k + j]
        }
        c[3*i + j] = cij
      }
    }
    return c
  }
  function multmv(m, v) { // multiply matrix and vector
    return [
      m[0]*v[0] + m[1]*v[1] + m[2]*v[2],
      m[3]*v[0] + m[4]*v[1] + m[5]*v[2],
      m[6]*v[0] + m[7]*v[1] + m[8]*v[2]
    ];
  }
  function pdbg(m, v) {
    var r = multmv(m, v)
    return r + " (" + r[0]/r[2] + ", " + r[1]/r[2] + ")"
  }
  function basisToPoints(x1, y1, x2, y2, x3, y3, x4, y4) {
    var m = [
      x1, x2, x3,
      y1, y2, y3,
      1,  1,  1
    ];
    var v = multmv(adj(m), [x4, y4, 1])
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
    var s = basisToPoints(x1s, y1s, x2s, y2s, x3s, y3s, x4s, y4s)
    var d = basisToPoints(x1d, y1d, x2d, y2d, x3d, y3d, x4d, y4d)
    return multmm(d, adj(s))
  }
  function project(m, x, y) {
    var v = multmv(m, [x, y, 1])
    return [v[0]/v[2], v[1]/v[2]]
  }
  function transform2d(elt, x1, y1, x2, y2, x3, y3, x4, y4) {
    //var w = elt.offsetWidth, h = elt.offsetHeight
    var w = 1, h = 1
    var t = general2DProjection
      (0, 0, x1, y1, w, 0, x2, y2, 0, h, x3, y3, w, h, x4, y4)
    for(i = 0; i != 9; ++i) t[i] = t[i]/t[8]
    t = [t[0], t[3], 0, t[6],
        t[1], t[4], 0, t[7],
        0   , 0   , 1, 0   ,
        t[2], t[5], 0, t[8]]
    return t
  /*
    t = "matrix3d(" + t.join(", ") + ")"
    elt.style["-webkit-transform"] = t
    elt.style["-moz-transform"] = t
    elt.style["-o-transform"] = t
    elt.style.transform = t
  */
  }

	const th = config.themeColors, v = this, g = v.qrscanner
	v.setRenderFlag(true)

  let earlyreturn = 0
  if (g.triggerPad || true) {
    delete g.triggerPad
    g.pad = 10
    earlyreturn = 1
  }
  if (!earlyreturn && g.pad > 0) {
    g.pad -= 1
    earlyreturn = 1
  }
  if (!earlyreturn && this.pad == 0) {
    g.pad = -1
    g.qrindex = -1
    g.reftime = Date.now()
  }
  if (true || g.copiedSignal) {
    earlyreturn = 1
  }

  // Transitional gray placeholder or white background.
  var w = Math.min(g.w, g.h) * (earlyreturn?0.9:1)
  var x = g.x + (g.w - w) / 2
  var y = g.y + (g.h - w) / 2
  mainShapes.useProg2()
  const m = mat4.create()
  mat4.identity(m)
  mat4.translate(m,m,[x,y,0])
  mat4.scale(m,m,[w,w,1])
  gl.uniformMatrix4fv(gl.getUniformLocation(prog2, 'uProjectionMatrix'), false, v.mat)
  gl.uniform4fv(gl.getUniformLocation(prog2, 'overallColor'),
    new Float32Array(earlyreturn?[0.7,0.7,0.7,1]:[1,1,1,1]))
  gl.uniformMatrix4fv(gl.getUniformLocation(prog2, 'uModelViewMatrix'), false, m)
  mainShapes.drawArrays2('rect')
//console.log(g.busySignal, g.busyCounter)
  if (g.busySignal) {
    g.busyCounter += 0.01; if (g.busyCounter > Math.PI/2) g.busyCounter -= Math.PI/2

    mat4.identity(m)
    mat4.translate(m,m,[x+w/2,y+w/2,0])
    //mat4.scale(m,m,[w,w,1])
    mat4.rotate(m,m, g.busyCounter, [0,0,1])
    iconFont.draw(-10,7,"\x0A",config.themeColors.uiText,v.mat, m)

  } else if (g.walletSignal) {
    mat4.identity(m)
    mat4.translate(m,m,[x+w/2,y+w/2,0])
    financeGraphicsFont.draw(-8.5,8.5,"\x08",config.themeColors.uiText,v.mat, m)
  } else if (g.errorSignal) {
    mat4.identity(m)
    mat4.translate(m,m,[x+w/2,y+w/2,0])
    //mat4.scale(m,m,[w,w,1])
    //mat4.rotate(m,m, g.busyCounter, [0,0,1])
    iconFont.draw(-10,7,"\x0F",config.themeColors.uiLightningYellow,v.mat, m)
  } else if (g.copiedSignal) {
    let str = icap(tr("copied"))
    let tw = defaultFont.calcWidth(str)
    mat4.identity(m)
    mat4.translate(m,m,[x+w/2,y+w/2,0])
    mat4.translate(m,m,[-tw/2,7,0])
    defaultFont.draw(0,0,str,config.themeColors.uiText,v.mat, m)
  }
  if (g.busySignal) setTimeout(g.timeoutFunc, 100)
  // if (earlyreturn) {
  //   return
  // }

	if (!v.videoDims || !v.vidPos) return
	if (!this.updateFlag) return
  g.busySignal = false
//	this.updateFlag = false
//	console.log('renderFunc')
	if (!this.texture) this.texture = initTexture(gl)
  updateTexture(gl, this.texture, this.videoEl)
	const mat = mat4.create()
	// var w = v.videoDims[0], h = v.videoDims[1]
	// var x = v.vidPos[0], y = v.vidPos[1]
	var w = g.w, h = g.h
	var x = g.x, y = g.y
  if (v.videoDims[0] > v.videoDims[1]) {
    w = g.h / v.videoDims[1] * v.videoDims[0]
    x = -(g.h / v.videoDims[1] * v.videoDims[0] - g.h) / 2
  } else {
    w = g.w / v.videoDims[0] * v.videoDims[1]
    y = -(g.w / v.videoDims[0] * v.videoDims[1] - g.w) / 2
  }
  console.log(x,y,w,h)
	mat4.identity(mat)
	mat4.translate(mat, mat, [x, y, 0])
	mat4.scale(mat, mat, [w, h, 1])
	mainShapes.useProg4()
	gl.uniformMatrix4fv(gl.getUniformLocation(prog4, 'uProjectionMatrix'), false, v.mat)
	gl.uniformMatrix4fv(gl.getUniformLocation(prog4, 'uModelViewMatrix'), false, mat)
	gl.uniform4fv(gl.getUniformLocation(prog4, 'overallColor'), new Float32Array([1,1,1,1]))
	mainShapes.drawArrays4('rect')

	if (this.scanner
	&& this.scanner.lastresult.data != ''
	&& this.scanner.results.length > 1) {
	  mainShapes.useProg2()
		var p = this.scanner.lastresult.cornerPoints
		var t = transform2d(undefined,
			p[0].x+x, p[0].y+y, p[1].x+x, p[1].y+y, p[3].x+x, p[3].y+y, p[2].x+x, p[2].y+y)
		let m = mat4.fromValues(
			t[ 0],t[ 1],t[ 2],t[ 3],
			t[ 4],t[ 5],t[ 6],t[ 7],
			t[ 8],t[ 9],t[10],t[11],
			t[12],t[13],t[14],t[15],
		)
		gl.disable(gl.DEPTH_TEST)
		gl.uniformMatrix4fv(gl.getUniformLocation(prog2, 'uProjectionMatrix'), false, this.mat)
		gl.uniform4fv(gl.getUniformLocation(prog2, 'overallColor'),
			new Float32Array([0,1,0,this.scanner.intensity]))
		mat4.translate(m, m, [0.43, 0.43 + 0.14, 0])
		mat4.scale(m, m, [0.14, -0.14, 1])
		gl.uniformMatrix4fv(gl.getUniformLocation(prog2, 'uModelViewMatrix'), false, m)
		var tris = len2.pies/3
		var parts = this.scanner.results.length
		for (var i=0; i<parts; i++) if (this.scanner.results[i] != '') {
			var beg = Math.round(tris * i / parts)
			var end = Math.round(tris * (i + 1) / parts)
			gl.drawArrays(mainShapes.typ2.pies,
				mainShapes.beg2.pies + beg * 3,
				(end - beg) * 3)
		}
		this.scanner.intensity *= 0.95
	}

  mainShapes.useProg2()
	var s = v.videoDims[0] < v.videoDims[1]? v.videoDims[0]: v.videoDims[1]
	w = s * 0.9; h = s * 0.9
	gl.uniformMatrix4fv(gl.getUniformLocation(prog2, 'uProjectionMatrix'), false, this.mat)
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
	gl.uniform4fv(gl.getUniformLocation(prog2, 'overallColor'), new Float32Array([1,1,1,1]))
	mat4.identity(mat)
	mat4.translate(mat, mat, [x + (v.videoDims[0] - w)/2, y + (v.videoDims[1] - h)/2, 0])
	mat4.scale(mat, mat, [w, h, 1])
	gl.uniformMatrix4fv(gl.getUniformLocation(prog2, 'uModelViewMatrix'), false, mat)
	mainShapes.drawArrays2('scanbox')

	// for (const g of this.gadgets) {
	// 	if (g.renderFunc) g.renderFunc.call(g)
	// }
}

v.load = function(cb) {
	const debuglog = true
	const gads = []
	function icb(cb, v) {
		let allComplete = true
		for (let gad of gads) {
			if (v[gad].loadComplete) {
			} else {
				allComplete = false
				break
			}
		}
    if (allComplete) {
      v.loadComplete = true
      cb()
    }
  }
	for (const gad of gads) {
		const g = this[gad]
		g.tempValue = g.defaultValue
		function finishInit(cb, v, g) {
			{ // For the GUI.
				g.viewport.queueLayout()
			} { // For the app function.
				g.value = g.tempValue
			} { // For persistence.
			}
			delete g.tempValue
			if (debuglog) console.log(`${g.key} ready`, g.value)
			g.loadComplete = true
      icb(cb, v)
		}
		if (debuglog) console.log("requesting", `${getCurrentAccount().id}-${g.key}`)
    PlatformUtil.DatabaseGet('settings', `${getCurrentAccount().id}-${g.key}`, (event) => {
			if (event.target.result !== undefined)
				g.tempValue = event.target.result
			if (debuglog) console.log(`${g.key} restored`, g.tempValue)
			finishInit(cb, this, g)
		}, (event) => {
			console.log(`error getting ${g.key}`, event)
			finishInit(cb, this, g)
		})
	}
  if (gads.length == 0) {
    icb(cb, this)
  }
}

