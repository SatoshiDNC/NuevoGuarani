v = exportaccountsettings
v.name = Object.keys({exportaccountsettings}).pop()
v.title = 'export account settings'
v.minX = 0; v.maxX = 0
v.minY = 0; v.maxY = 0
v.gadgets.push(v.swipeGad = new vp.SwipeGadget(v))
v.swipeGad.actionFlags = vp.GAF_SWIPEABLE_UPDOWN | vp.GAF_SCROLLABLE_UPDOWN
v.swipeGad.hide = true
v.gadgets.push(v.itemscan = g = new vp.Gadget(v))
	g.key = 'exportInvoicingKeys'
	g.type = 'enable'
	g.title = 'export invoicing keys'
	g.subtitle = 'invoicing keys are sensitive data'
  g.state = false
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
		get : function () { return `export “${icap(tr(config.accountName))}”` }
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
      console.log(data)
    }

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
              data[objectStore].push({ key: cursor.key, data: cursor.value })
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

