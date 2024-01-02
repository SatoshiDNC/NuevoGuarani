const currencysettings = v = new vp.View(null);
v.name = Object.keys({currencysettings}).pop();
v.title = 'currencies';
v.minX = 0; v.maxX = 0;
v.minY = 0; v.maxY = 0;
v.gadgets.push(v.swipeGad = new vp.SwipeGadget(v));
v.swipeGad.actionFlags = vp.GAF_SWIPEABLE_UPDOWN | vp.GAF_SCROLLABLE_UPDOWN;
v.swipeGad.hide = true;
v.gadgets.push(v.maincurrency = g = new vp.Gadget(v));
	g.title = 'main currency';
	Object.defineProperty(g, "subtitle", {
		get : function () { try { return maincurrency.list.value; } catch (e) {} }
	});
	g.pane = maincurrency;
v.gadgets.push(v.cashcurrency = g = new vp.Gadget(v));
	g.title = 'cash currency';
	Object.defineProperty(g, "subtitle", {
		get : function () { try { return cashcurrency.list.value; } catch (e) {} }
	});
	g.pane = cashcurrency;
v.gadgets.push(v.enablelightning = g = new vp.Gadget(v));
	g.key = 'enableLightning';
	g.type = 'enable';
	g.title = 'lightning payments';
	g.subtitle = 'accept lightning as a payment method';
  g.state = false;
	g.defaultValue = false;
	Object.defineProperty(g, "icon", {
		get : function () { return this.state? "\x0E":"\x0D"; }
	});
	g.appFunction = function() {
		currencysettings.disablecash.hide = (maincurrency.list.value == '₿' || !currencysettings.enablelightning.state);
		currencysettings.disablecash.enabled = !currencysettings.disablecash.hide;
		cashcurrency.list.appFunction();
		currencysettings.queueLayout();
	}
	g.clickFunc = function(index) {
		const g = this;
		{ // For the GUI.
			g.state = !g.state; v.setRenderFlag(true);
		} { // For the app function.
			g.appFunction();
		} { // For persistence.
      PlatformUtil.DatabasePut('settings', g.state, `${getCurrentAccount().id}-${g.key}`, (event) => {
				console.log(`successfully selected ${g.key}`, event)
			}, (event) => {
				console.log(`error selecting ${g.key}`, event)
			})
		}
	}
v.gadgets.push(v.disablecash = g = new vp.Gadget(v));
	g.key = 'disableCash';
	g.type = 'enable';
	g.title = 'disable cash payments';
	g.subtitle = 'only allow lightning payments';
  g.state = false;
	g.defaultValue = false;
	Object.defineProperty(g, "icon", {
		get : function () { return this.state? "\x0E":"\x0D"; }
	});
	g.appFunction = function() {
		cashcurrency.list.appFunction();
	}
	g.clickFunc = function(index) {
		const g = this;
		{ // For the GUI.
			g.state = !g.state; v.setRenderFlag(true);
		} { // For the app function.
			g.appFunction();
		} { // For persistence.
      PlatformUtil.DatabasePut('settings', g.state, `${getCurrentAccount().id}-${g.key}`, (event) => {
				console.log(`successfully selected ${g.key}`, event)
			}, (event) => {
				console.log(`error selecting ${g.key}`, event)
			})
		}
	}
v.gadgets.push(v.showchange = g = new vp.Gadget(v));
	g.key = 'showChangeBreakdown';
	g.type = 'enable';
	g.title = 'enumerate change due';
	g.subtitle = 'shows how many of each denomination to return';
  g.state = false;
	g.defaultValue = false;
	Object.defineProperty(g, "icon", {
		get : function () { return this.state? "\x0E":"\x0D"; }
	});
	g.clickFunc = function(index) {
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
	const debuglog = false, g = this.showchange;
	const gads = [
		'enablelightning', 'disablecash', 'showchange',
	];
	function icb(cb, v) {
		let allComplete = true;
		for (let gad of gads) {
			if (v[gad].loadComplete) {
			} else {
				allComplete = false;
				break;
			}
			if (allComplete) {
				v.loadComplete = true; cb();
			}
		}
	}
	for (const gad of gads) {
		const g = this[gad];
		g.tempValue = g.defaultValue;
		function finishInit(cb, v, g) {
			{ // For the GUI.
				g.viewport.queueLayout();
			} { // For the app function.
				g.state = g.tempValue;
				if (g.appFunction) g.appFunction();
			} { // For persistence.
			}
			delete g.tempValue;
			if (debuglog) console.log(`${g.key} ready`, g.state);
			v.loadComplete = true; icb(cb, v);
		}
		if (debuglog) console.log("requesting", `${getCurrentAccount().id}-${g.key}`)
    PlatformUtil.DatabaseGet('settings', `${getCurrentAccount().id}-${g.key}`, (event) => {
			if (event.target.result !== undefined) {
				g.tempValue = event.target.result
				if (debuglog) console.log(`${g.key} restored`, g.tempValue)
			} else {
				if (debuglog) console.log(`${g.key} not used`, event.target.result)
			}
			finishInit(cb, this, g)
		}, (event) => {
			console.log(`error getting ${g.key}`, event)
			finishInit(cb, this, g)
		})
	}
}
