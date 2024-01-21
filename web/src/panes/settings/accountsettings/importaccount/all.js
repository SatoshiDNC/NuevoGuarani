v = importaccountsettings
v.name = Object.keys({importaccountsettings}).pop()
v.title = 'import account'
v.minX = 0; v.maxX = 0
v.minY = 0; v.maxY = 0
v.gadgets.push(v.swipeGad = new vp.SwipeGadget(v))
v.swipeGad.actionFlags = vp.GAF_SWIPEABLE_UPDOWN | vp.GAF_SCROLLABLE_UPDOWN
v.swipeGad.hide = true
v.pageFocusFunc = function() {
  const v = this
}
v.pageBlurFunc = v.pageFocusFunc
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

