const cashcurrency = v = new vp.View(null);
v.name = Object.keys({cashcurrency}).pop();
v.title = 'cash currency';
v.minX = 0; v.maxX = 0;
v.minY = 0; v.maxY = 0;
v.gadgets.push(v.swipeGad = new vp.SwipeGadget(v));
v.swipeGad.actionFlags = vp.GAF_SWIPEABLE_UPDOWN | vp.GAF_SCROLLABLE_UPDOWN;
v.swipeGad.hide = true;
v.gadgets.push(v.list = g = new vp.Gadget(v));
	g.key = 'cashCurrency';
	Object.defineProperty(g, "list", {
		get : function () {
			var a = supportedCurrencies.filter(e => e !== '₿');
			a.splice(0,0, 'none');
			return a;
		}
	});
  g.index = -1;
	Object.defineProperty(g, "value", {
		get : function () {
			if (maincurrency.list.value != '₿') {
				if (currencysettings.enablelightning.state && currencysettings.disablecash.state) {
					return 'none';
				} else {
					return maincurrency.list.value;
				}
			}
			if (this.index >= 0 && this.index < this.list.length)
				return this.list[this.index];
			return this.list[0];
		}
	});
	g.appFunction = function() {
		currencysettings.showchange.hide = (this.value == 'none')
		currencysettings.showchange.enabled = !currencysettings.showchange.hide
		currencysettings.queueLayout()
	}
	g.listItemClick = function(index) {
		const g = this;
		{ // For the GUI.
			g.index = index; v.setRenderFlag(true);
		} { // For the app function.
			g.appFunction();
		} { // For persistence.
      PlatformUtil.DatabasePut('settings', g.value, `${getCurrentAccount().id}-${g.key}`, (event) => {
				console.log(`successfully selected ${g.key}`, event)
			}, (event) => {
				console.log(`error selecting ${g.key}`, event)
			})
		}
	}
v.load = function(cb) {
	const debuglog = true
	const g = this.list;
	g.tempValue = g.defaultValue;
	function finishInit(cb, v, g) {
		var index = -1;
		for (var i=0; i<g.list.length; i++) {
			if (g.list[i] == g.tempValue) {
				index = i;
				break;
			}
		}
		if (index < 0) index = 0;
		{ // For the GUI.
			cashcurrency.list.index = index;
			cashcurrency.setRenderFlag(true);
		} { // For the app function.
			g.appFunction();
		} { // For persistence.
		}
		delete g.tempValue;
		if (debuglog) console.log(`${g.key} ready`, g.value);
		v.loadComplete = true; cb();
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
