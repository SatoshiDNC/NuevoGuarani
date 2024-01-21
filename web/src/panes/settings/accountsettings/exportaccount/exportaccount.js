v = exportaccountsettings
v.name = Object.keys({exportaccountsettings}).pop()
v.title = 'export account'
v.minX = 0; v.maxX = 0
v.minY = 0; v.maxY = 0
v.gadgets.push(v.swipeGad = new vp.SwipeGadget(v))
v.swipeGad.actionFlags = vp.GAF_SWIPEABLE_UPDOWN | vp.GAF_SCROLLABLE_UPDOWN
v.swipeGad.hide = true
v.pageFocusFunc = function() {
  const v = this
  v.result.hide = true
  v.qrcode.hide = true
  v.qrcode.clear()
  v.queueLayout()
}
v.gadgets.push(v.spendingkeys = g = new vp.Gadget(v))
	g.description = 'Spending keys will never be exported. You must enter them again when importing.'
v.gadgets.push(v.invoicingkeys = g = new vp.Gadget(v))
	g.key = 'exportInvoicingKeys'
	g.type = 'enable'
	g.title = 'export invoicing keys'
	g.subtitle = 'invoicing keys are sensitive data'
  g.state = false
  g.nonpersistent = true
  g.daisychain = true
	Object.defineProperty(g, "icon", {
		get : function () { return this.state? "\x0E":"\x0D" }
	})
	g.appFunction = function() {
		const g = this
	}
	g.clickFunc = function(index) {
		const g = this
		{ // For the GUI.
			g.state = !g.state; v.setRenderFlag(true)
		} { // For the app function.
			if (g.appFunction) g.appFunction()
		} { // For persistence.
      PlatformUtil.DatabasePut('settings', g.state, `${getCurrentAccount().id}-${g.key}`, (event) => {
				console.log(`successfully selected ${g.key}`, event)
			}, (event) => {
				console.log(`error selecting ${g.key}`, event)
			})
		}
	}
v.gadgets.push(v.export = g = new vp.Gadget(v))
  g.color = config.themeColors.uiSettingSelect
  g.nonpersistent = true
	Object.defineProperty(g, "title", {
		get : function () { return icap(tr('export @').replace('@', '“'+icap(tr(config.accountName))+'”')) }
	});
  g.center = true
	g.button = true
	g.clickFunc = function() {
		const g = this, v = g.viewport
    const id = getCurrentAccount().id
    const prefix = id + '-'
    //console.log('export', id)
    const data = {}
    let started = 0
    let finished = 0

    const objectStores = ['accounts', 'settings', 'sales', 'prices', 'inventory', 'barcodes', 'nostrmarket-orders', 'emoji', 'state', 'orders']
    const tr = db.transaction(objectStores, "readonly")

    const finish = () => {
      //const filename = 'account-export.ng'
      //PlatformUtil.DownloadURI(Convert.StringToDataURL(JSON.stringify(data), 'text/json'), filename)
      //v.result.description = `Saved to Downloads as '${filename}'.`
      let payload = JSON.stringify(data)
      v.qrcode.busySignal = true
      v.qrcode.hide = false
      v.qrcode.qr = ['testsdfgsdfgsdgfsfdgsdfgsdfgsdfgsgfsdfgsdfgsdfgsfdgsfdgsfdgsdfgsgsdfgsfgsgsdfgsdfgsfdgsfgsfg','this']
      v.queueLayout()
    }

    data.timestamp = new Date().getTime()
    data.type = 'export'
    data.version = db.version
    for (const objectStore of objectStores) {
      started++
      data[objectStore] = []
      const os = tr.objectStore(objectStore)
      os.openCursor().onsuccess = (event) => {
        const cursor = event.target.result
        if (cursor) {
          if (os.autoIncrement) {
            if (cursor.value.account == id)
            data[objectStore].push({ data: cursor.value })
          } else {
            if (cursor.key == id || cursor.key.startsWith(prefix)) {
              if (cursor.key.indexOf('-secret-') == -1) {
                if (cursor.key.indexOf('-sensitive-') == -1 || exportaccountsettings.invoicingkeys.state) {
                  data[objectStore].push({ key: cursor.key, data: cursor.value })
                }
              }
            }
          }
          cursor.continue()
        } else {
          finished++
          if (finished == started) finish()
        }
      }
    }


  }
v.gadgets.push(v.result = g = new vp.Gadget(v))
	g.description = 'Account exported.'
  g.hide = true
v.gadgets.push(v.qrcode = g = new vp.Gadget(v))
  g.hide = true
  g.busyCounter = 0
  g.layoutFunc = function () {
    const g = this
    g.h = g.w
    g.autoHull()
  }
  g.clear = function() {
    this.busySignal = false
    this.errorSignal = false
    this.walletSignal = false
    this.copiedSignal = false
    this.qr = []
    this.qrtex = []
    this.triggerPad = true
  }
  g.clear()
  g.renderFunc = function () {
    const g = this, v = g.viewport
    let earlyreturn = 0
    if (this.triggerPad || this.qr.length == 0) {
      delete this.triggerPad
      this.pad = 10
      v.setRenderFlag(true)
      earlyreturn = 1
    }
    if (!earlyreturn && this.pad > 0) {
      this.pad -= 1
      v.setRenderFlag(true)
      earlyreturn = 1
    }
    if (!earlyreturn && this.pad == 0) {
      this.pad = -1
      this.qrindex = -1
      this.reftime = Date.now()
    }
    if (this.qr.length == 0 || this.copiedSignal) {
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
  //console.log(this.busySignal, this.busyCounter)
    if (this.busySignal) {
      this.busyCounter += 0.01; if (this.busyCounter > Math.PI/2) this.busyCounter -= Math.PI/2
  
      mat4.identity(m)
      mat4.translate(m,m,[x+w/2,y+w/2,0])
      //mat4.scale(m,m,[w,w,1])
      mat4.rotate(m,m, this.busyCounter, [0,0,1])
      iconFont.draw(-10,7,"\x0A",config.themeColors.uiText,v.mat, m)
  
    } else if (this.walletSignal) {
      mat4.identity(m)
      mat4.translate(m,m,[x+w/2,y+w/2,0])
      financeGraphicsFont.draw(-8.5,8.5,"\x08",config.themeColors.uiText,v.mat, m)
    } else if (this.errorSignal) {
      mat4.identity(m)
      mat4.translate(m,m,[x+w/2,y+w/2,0])
      //mat4.scale(m,m,[w,w,1])
      //mat4.rotate(m,m, this.busyCounter, [0,0,1])
      iconFont.draw(-10,7,"\x0F",config.themeColors.uiLightningYellow,v.mat, m)
    } else if (this.copiedSignal) {
      let str = icap(tr("copied"))
      let tw = defaultFont.calcWidth(str)
      mat4.identity(m)
      mat4.translate(m,m,[x+w/2,y+w/2,0])
      mat4.translate(m,m,[-tw/2,7,0])
      defaultFont.draw(0,0,str,config.themeColors.uiText,v.mat, m)
    }
    if (this.busySignal) setTimeout(this.timeoutFunc, 100)
    if (earlyreturn) {
      return
    }
    console.log('e')
  //	if (this.qr.length == 1 && (
  //			this.qr[0].startsWith('lnbc')
  //	||  this.qr[0].startsWith('lnurl'))) {
  //		this.queryStatus = true;
  //	}
  
    var img = document.querySelector('#buf1')
    const rgbToHex = (r, g, b) => {
      return "#"+((1<<24)+(~~(r*255)<<16)+(~~(g*255)<<8)+~~(b*255)).toString(16).slice(1)
    }
  
    var i = this.qrindex + 1
    if (i < this.qr.length && this.qrtex.length <= i) {
  //console.log('render', this.qr[i].substring(0,10));
      var qrd = this.qr[i]
      if (qrd == qrd.toLowerCase()) qrd = qrd.toUpperCase()
      QrCreator.render({
        text: qrd, // Sadly, this library doesn't optimize uppercase-only codes.
        radius: 0.0, // 0.0 to 0.5
        ecLevel: 'H', // L, M, Q, H
        fill: rgbToHex(0,0,0,1), // foreground color
        background: rgbToHex(1,1,1,1), // color or null for transparent
        size: 1280 // in pixels
      }, img)
      this.qrtex.push(vp.setImage(img))
    }
    if (this.qrindex < 0) this.qrindex = 0
  
    w = Math.min(v.sw, v.sh) * 0.9
    x = (v.sw - w) / 2
    y = (v.sh - w) / 2
    mat4.identity(m)
    mat4.translate(m,m,[x,y,0])
    mat4.scale(m,m,[w,w,1])
    vp.drawImage(this.qrtex[this.qrindex], v.mat, m)
  
    var curtime = Date.now()
    var t = curtime - this.reftime
    const r = 500
    if (t >= r) {
      t = 0;
      this.reftime = curtime
      this.qrindex += 1
      if (this.qrindex >= this.qr.length) this.qrindex = 0
    }
  
    const mat = mat4.create()
    if (this.qr[this.qrindex].toLowerCase().startsWith('lnbc')
    ||  this.qr[this.qrindex].toLowerCase().startsWith('lnurl')) {
      const m = mat4.create()
      mat4.identity(mat)
      mat4.translate(mat,mat,[v.sw/2,v.sh/2,0])
      mat4.scale(mat,mat,[w/160,w/160,1])
      w = Math.min(v.sw, v.sh)
      for (var i=-1; i<=1; i++) for (var j=-1; j<=1; j++) if (i!=0||j!=0) {
        mat4.copy(m, mat)
        defaultFont.draw(-5+i/2,7+j/2, '🗲', [0,0,0,1], v.mat, m)
      }
      mat4.copy(m, mat)
      defaultFont.draw(-5,7, '🗲', customerColors.uiLightningYellow, v.mat, m)
    }
  
    if (this.qr.length > 1) {
      mainShapes.useProg2()
      gl.uniformMatrix4fv(gl.getUniformLocation(prog2, 'uProjectionMatrix'), false, v.mat)
      gl.uniform4fv(gl.getUniformLocation(prog2, 'overallColor'),
        new Float32Array([0,0,0,1]))
      mat4.copy(mat, m)
      mat4.translate(mat,mat,[0.425,0.425,0])
      mat4.scale(mat,mat,[0.15,0.15,1])
      gl.uniformMatrix4fv(gl.getUniformLocation(prog2, 'uModelViewMatrix'), false, mat)
      mainShapes.drawArrays2('circle')
      gl.uniform4fv(gl.getUniformLocation(prog2, 'overallColor'),
        new Float32Array([1,1,1,1]))
      mat4.copy(mat, m)
      mat4.translate(mat,mat,[0.43,0.43,0])
      mat4.scale(mat,mat,[0.14,0.14,1])
      gl.uniformMatrix4fv(gl.getUniformLocation(prog2, 'uModelViewMatrix'), false, mat)
      mainShapes.drawArrays2('circle')
      gl.uniform4fv(gl.getUniformLocation(prog2, 'overallColor'),
        new Float32Array([0,0,0,1]))
      mat4.copy(mat, m)
      mat4.translate(mat,mat,[0.5,0.5,0])
      mat4.rotate(mat,mat,(t/r+this.qrindex)/this.qr.length*2*Math.PI,[0,0,1])
      mat4.translate(mat,mat,[-0.003,0,0])
      mat4.scale(mat,mat,[0.006,-0.06,1])
      gl.uniformMatrix4fv(gl.getUniformLocation(prog2, 'uModelViewMatrix'), false, mat)
      mainShapes.drawArrays2('rect')
  
      //setTimeout(this.timeoutFunc, 1000)
      v.setRenderFlag(true)
    }
    
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

