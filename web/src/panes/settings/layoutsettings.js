const layoutsettings = v = new vp.View(null);
v.name = Object.keys({layoutsettings}).pop();
v.title = 'layout';
v.minX = 0; v.maxX = 0;
v.minY = 0; v.maxY = 0;
v.gadgets.push(v.swipeGad = new vp.SwipeGadget(v));
v.swipeGad.actionFlags = vp.GAF_SWIPEABLE_UPDOWN | vp.GAF_SCROLLABLE_UPDOWN;
v.swipeGad.hide = true;
v.gadgets.push(v.countermode = g = new vp.Gadget(v));
	g.key = 'enableCustomerPane';
	g.type = 'enable';
	g.title = 'Customer-facing pane';
  g.state = false;
	Object.defineProperty(g, "icon", {
		get : function () { return this.state? "\x0E":"\x0D"; }
	});
	g.clickFunc = function(index) {
console.log('clck');
		const g = this;
		{ // For the GUI.
			g.state = !g.state; v.setRenderFlag(true);
		} { // For the app function.
		} { // For persistence.
      PlatformUtil.DatabasePut('settings', g.state, `${getCurrentAccount().id}-${g.key}`, (event) => {
				console.log(`successfully selected ${g.key}`, event)
			}, (event) => {
				console.log(`error selecting ${g.key}`, event)
			})
		}
	}
v.load = function(cb) {
	const debuglog = true, g = this.countermode;
	var selectedValue = false;
	function finishInit(cb, v) {
		const g = v.countermode;
		g.state = selectedValue? true: false;
		{ // For the GUI.
			v.setRenderFlag(true);
		} { // For the app function.
			//defaultVendorCurrency = g.list[index];
		} { // For persistence.
		}
		if (debuglog) console.log(`${g.key} ready`, g.state);
		v.loadComplete = true; cb();
	}
	if (debuglog) console.log("requesting", `${getCurrentAccount().id}-${g.key}`)
  PlatformUtil.DatabaseGet('settings', `${getCurrentAccount().id}-${g.key}`, (event) => {
		selectedValue = event.target.result
		if (debuglog) console.log(`${g.key} restored`, selectedValue)
		finishInit(cb, this)
	}, (event) => {
		console.log(`error getting ${g.key}`, event)
		finishInit(cb, this)
	})
}
