v = importaccountsettings
v.name = Object.keys({importaccountsettings}).pop()
v.title = 'import account'
v.minX = 0; v.maxX = 0
v.minY = 0; v.maxY = 0
v.gadgets.push(v.swipeGad = new vp.SwipeGadget(v))
v.swipeGad.actionFlags = vp.GAF_SWIPEABLE_UPDOWN | vp.GAF_SCROLLABLE_UPDOWN
v.swipeGad.hide = true
v.gadgets.push(v.qrscanner = g = new vp.Gadget(v))
  g.busySignal = true
  g.busyCounter = 0
  g.clear = function() {
    this.busySignal = true
    this.errorSignal = false
    this.walletSignal = false
    this.copiedSignal = false
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
  v.qrscanner.hide = false
  v.switchedToFunc()
}
v.pageBlurFunc = function() {
  const v = this
  v.stopScanning()
}
v.stopScanning = function() {
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
		v.updateFlag = true
    v.setRenderFlag(true)
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
	var cam
	if (camerasettings.cameralist.index >= 0)
		cam = cameras[camerasettings.cameralist.index].deviceId
	if (!cam) cam = 'environment'
	this.scanner = new QrScanner(
		this.videoEl,
		function(result) {
      function doImport(o) {
        console.log('importing from', Convert.JSONToString(o))
        PlatformUtil.DatabasePut('accounts', o.accounts[0].data, o.accounts[0].key, () => {
          PlatformUtil.DatabasePut('settings', o.accounts[0].data.id, 'selectedAccount')
          o.settings.map(v => PlatformUtil.DatabasePut('settings', v.data, v.key))
          openDatabase()
        })
      }
			this.intensity = 0.5
			var repeat = (result.data == this.lastresult.data)
			this.lastresult = result
			if (repeat) return

			var beeptype = 'click', ob = false
      if (result.data.match(/[0-9]+\/[0-9]+:/)) {
        const slashPos = result.data.indexOf('/')
        const colonPos = result.data.indexOf(':')
        const payload = result.data.substring(colonPos+1)
        const m = +result.data.substring(0,slashPos)
        const n = +result.data.substring(slashPos+1,colonPos)
				if (this.results.length == 0) {
          this.results = Array(n).join(".").split(".")
				}
        this.currentSlot = m-1
				if (n == this.results.length && this.results[m-1] != result.data.substring(colonPos+1)) {
					this.results[m-1] = payload
					beeptype = 'qr-scan'
					for (var i=0; i<n; i++) if (this.results[i] == '') {
						beeptype = 'click' // 'qr-part' gets annoying
						break
					}
					if (beeptype == 'qr-scan') {
						var data = this.results.join('').trim()
            if ((ob = tryParseJSONObject(data)) !== false) {
              if (ob.accounts.length == 1) {
                const a = ob.accounts[0]
                if (accounts.reduce((i,v) => i || v.key == a.id, false)) {
                  PlatformUtil.UserConfirm("This account exists. Overwrite?", (y) => {
                    if (y) {
                      doImport(ob)
                    }
                    settingsbuttons.backbutton.clickFunc()
                  })
                } else {
                  doImport(ob)
                  settingsbuttons.backbutton.clickFunc()
                }
              } else {
                beeptype = 'error'
                console.log('Data did not contain exactly one account')
              }
						} else {
							beeptype = 'error'
              console.log('Could not decode joined data')
						}
            v.stopScanning()
            v.qrscanner.hide = true
            v.queueLayout()
          }
				}
				vp.beep(beeptype)
			} else {
				console.log('Invalid QR code format')
        if (this.results.length == 0) {
          vp.beep('error')
          v.stopScanning()
          v.qrscanner.hide = true
          v.queueLayout()
        }
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
    var w = 1, h = 1
    var t = general2DProjection
      (0, 0, x1, y1, w, 0, x2, y2, 0, h, x3, y3, w, h, x4, y4)
    for(i = 0; i != 9; ++i) t[i] = t[i]/t[8]
    t = [t[0], t[3], 0, t[6],
        t[1], t[4], 0, t[7],
        0   , 0   , 1, 0   ,
        t[2], t[5], 0, t[8]]
    return t
  }

	const th = config.themeColors, v = this, g = v.qrscanner

  const m = mat4.create()
  const crosshairColor = [1,1,1,1]

	if (!v.videoDims || !v.updateFlag) {

    // draw transitional gray placeholder
    var w = Math.min(g.w, g.h)
    var x = g.x + (g.w - w) / 2
    var y = g.y + (g.h - w) / 2
    mainShapes.useProg2()
    mat4.identity(m)
    mat4.translate(m,m,[x,y,0])
    mat4.scale(m,m,[w,w,1])
    gl.uniformMatrix4fv(gl.getUniformLocation(prog2, 'uProjectionMatrix'), false, v.mat)
    gl.uniform4fv(gl.getUniformLocation(prog2, 'overallColor'),
      new Float32Array([0.7,0.7,0.7,1]))
    gl.uniformMatrix4fv(gl.getUniformLocation(prog2, 'uModelViewMatrix'), false, m)
    mainShapes.drawArrays2('rect')

    // draw icon (if applicable)
    const iconSize = [2,2,1]
    if (g.busySignal) {
	    v.setRenderFlag(true)
      g.busyCounter += 0.01; if (g.busyCounter > Math.PI/2) g.busyCounter -= Math.PI/2
      mat4.identity(m)
      mat4.translate(m,m,[x+w/2,y+w/2,0])
      mat4.scale(m,m,iconSize)
      mat4.rotate(m,m, g.busyCounter, [0,0,1])
      iconFont.draw(-10,7,"\x0A",crosshairColor,v.mat, m)
    } else if (g.walletSignal) {
      mat4.identity(m)
      mat4.translate(m,m,[x+w/2,y+w/2,0])
      mat4.scale(m,m,iconSize)
      financeGraphicsFont.draw(-8.5,8.5,"\x08",crosshairColor,v.mat, m)
    } else if (g.errorSignal) {
      mat4.identity(m)
      mat4.translate(m,m,[x+w/2,y+w/2,0])
      mat4.scale(m,m,iconSize)
      iconFont.draw(-10,7,"\x0F",config.themeColors.uiLightningYellow,v.mat, m)
    } else if (g.copiedSignal) {
      let str = icap(tr("copied"))
      let tw = defaultFont.calcWidth(str)
      mat4.identity(m)
      mat4.translate(m,m,[x+w/2,y+w/2,0])
      mat4.scale(m,m,iconSize)
      mat4.translate(m,m,[-tw/2,7,0])
      defaultFont.draw(0,0,str,crosshairColor,v.mat, m)
    }
    if (g.busySignal) setTimeout(g.timeoutFunc, 100)
  } else {

    // render the video feed
    g.busySignal = false
    v.setRenderFlag(true)
    if (!this.texture) this.texture = initTexture(gl)
    updateTexture(gl, this.texture, this.videoEl)
    var w = g.w, h = g.h
    var x = g.x, y = g.y
    if (v.videoDims[0] > v.videoDims[1]) {
      w = g.h / v.videoDims[1] * v.videoDims[0]
      x = g.x - (g.h / v.videoDims[1] * v.videoDims[0] - g.w) / 2
    } else {
      h = g.w / v.videoDims[0] * v.videoDims[1]
      y = g.y - (g.w / v.videoDims[0] * v.videoDims[1] - g.h) / 2
    }
    mat4.identity(m)
    mat4.translate(m, m, [x, y, 0])
    mat4.scale(m, m, [w, h, 1])
    mainShapes.useProg4()
    gl.uniformMatrix4fv(gl.getUniformLocation(prog4, 'uProjectionMatrix'), false, v.mat)
    gl.uniformMatrix4fv(gl.getUniformLocation(prog4, 'uModelViewMatrix'), false, m)
    gl.uniform4fv(gl.getUniformLocation(prog4, 'overallColor'), new Float32Array([1,1,1,1]))
    const vs = v.viewScale
    gl.scissor(v.x + v.userX*v.viewScale + Math.ceil(g.x * vs), v.H - v.y + v.userY*v.viewScale - Math.ceil((g.y + g.h) * vs), Math.floor(g.w * vs), Math.floor(g.h * vs))
    gl.enable(gl.SCISSOR_TEST)
    mainShapes.drawArrays4('rect')
    gl.disable(gl.SCISSOR_TEST)
  }

  // draw the progress clock
	if (this.scanner
	&& this.scanner.lastresult.data != ''
	&& this.scanner.results.length > 1) {
	  mainShapes.useProg2()
		var p = this.scanner.lastresult.cornerPoints
    if (v.videoDims[0] > v.videoDims[1]) {
      h = g.h
      w = h / v.videoDims[1] * v.videoDims[0]
      x = g.x - (w-h)/2
      y = g.y
    } else {
      w = g.w
      h = w / v.videoDims[0] * v.videoDims[1]
      x = g.x
      y = g.y - (h-w)/2
    }
    const vs = g.w / Math.min(v.videoDims[0], v.videoDims[1])
		var t = transform2d(undefined,
			p[0].x*vs+x, p[0].y*vs+y, p[1].x*vs+x, p[1].y*vs+y, p[3].x*vs+x, p[3].y*vs+y, p[2].x*vs+x, p[2].y*vs+y)
		let m = mat4.fromValues(
			t[ 0],t[ 1],t[ 2],t[ 3],
			t[ 4],t[ 5],t[ 6],t[ 7],
			t[ 8],t[ 9],t[10],t[11],
			t[12],t[13],t[14],t[15],
		)
    gl.disable(gl.DEPTH_TEST)
		gl.uniformMatrix4fv(gl.getUniformLocation(prog2, 'uProjectionMatrix'), false, v.mat)
		gl.uniform4fv(gl.getUniformLocation(prog2, 'overallColor'),
			new Float32Array([0,1,0,this.scanner.intensity]))
    mat4.translate(m, m, [0, 1, 0])
		mat4.scale(m, m, [1, -1, 1])
		gl.uniformMatrix4fv(gl.getUniformLocation(prog2, 'uModelViewMatrix'), false, m)
		const quads = (mainShapes.len2.qrprogress-2)/2
		const parts = this.scanner.results.length
    let beg = 0
    let end = 0
    let scanned = false
    let prevScanned = false
    let total = 0
    const offset = 0.25
		for (let i=0; i<=parts; i++) {
      prevScanned = scanned
      scanned = i<parts? this.scanner.results[i] != '': false
      if (scanned) total++
      if (scanned && !prevScanned) {
        beg = Math.floor((i / parts + offset) * quads) % quads
      } else if (!scanned && prevScanned) {
        end = Math.floor((i / parts + offset) * quads) % quads
        if (end < beg) {
          gl.drawArrays(mainShapes.typ2.qrprogress,
            mainShapes.beg2.qrprogress + beg * 2,
            (quads - beg) * 2 + 2)
          gl.drawArrays(mainShapes.typ2.qrprogress,
            mainShapes.beg2.qrprogress + 0 * 2,
            end * 2 + 2)
        } else if (end > beg) {
          gl.drawArrays(mainShapes.typ2.qrprogress,
            mainShapes.beg2.qrprogress + beg * 2,
            (end - beg) * 2 + 2)
        } else if (total == parts) {
          gl.drawArrays(mainShapes.typ2.qrprogress,
            mainShapes.beg2.qrprogress, mainShapes.len2.qrprogress)
        }
      }
		}
		gl.uniform4fv(gl.getUniformLocation(prog2, 'overallColor'),
			new Float32Array([0,0.5,1,Math.sqrt(this.scanner.intensity)]))
    end = Math.floor(((this.scanner.currentSlot+1) / parts + offset) * quads) % quads
    beg = end - 1
    if (beg < 0) beg = quads - 1
    if (end < beg) {
      gl.drawArrays(mainShapes.typ2.qrprogress,
        mainShapes.beg2.qrprogress + beg * 2,
        (quads - beg) * 2 + 2)
      gl.drawArrays(mainShapes.typ2.qrprogress,
        mainShapes.beg2.qrprogress + 0 * 2,
        end * 2 + 2)
    } else if (end > beg) {
      gl.drawArrays(mainShapes.typ2.qrprogress,
        mainShapes.beg2.qrprogress + beg * 2,
        (end - beg) * 2 + 2)
    }
		this.scanner.intensity *= 0.95
	}

  // draw the scan box
  mainShapes.useProg2()
	gl.uniformMatrix4fv(gl.getUniformLocation(prog2, 'uProjectionMatrix'), false, this.mat)
	gl.uniform4fv(gl.getUniformLocation(prog2, 'overallColor'), new Float32Array(crosshairColor))
	mat4.identity(m)
	mat4.translate(m, m, [g.x + (g.w - g.w * 0.9)/2, g.y + (g.h - g.h * 0.9)/2, 0])
	mat4.scale(m, m, [g.w * 0.9, g.h * 0.9, 1])
	gl.uniformMatrix4fv(gl.getUniformLocation(prog2, 'uModelViewMatrix'), false, m)
	mainShapes.drawArrays2('scanbox')
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

