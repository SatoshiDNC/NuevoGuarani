const enabledcurrencies = v = new vp.View(null);
v.name = Object.keys({enabledcurrencies}).pop();
v.title = 'enabled currencies';
v.minX = 0; v.maxX = 0;
v.minY = 0; v.maxY = 0;
v.gadgets.push(v.swipeGad = new vp.SwipeGadget(v));
v.swipeGad.actionFlags = vp.GAF_SWIPEABLE_UPDOWN | vp.GAF_SCROLLABLE_UPDOWN;
v.swipeGad.hide = true;
v.gadgets.push(v.list = g = new vp.Gadget(v));
	g.key = 'enabledCurrencies';
	g.list = supportedCurrencies;
	g.selection = [];
	g.appFunction = function() {
		const g = this;
		currencysettings.defaultvendorcurrency.hide = g.selection.length == 1;
		currencysettings.enabledpaymentmethods.hide = g.selection.length == 1;
		currencysettings.defaultvendorcurrency.enabled = !currencysettings.defaultvendorcurrency.hide;
		currencysettings.enabledpaymentmethods.enabled = !currencysettings.enabledpaymentmethods.hide;
		enabledPaymentMethods.splice(0, enabledPaymentMethods.length, ...g.selection);
		enabledpaymentmethods.load();

		mainsettings.walletsettings.hide = !g.selection.includes('₿');
		mainsettings.walletsettings.enabled = !mainsettings.walletsettings.hide;
		mainsettings.currencysettings.daisychain =
			!mainsettings.walletsettings.hide;

		mainsettings.queueLayout();
	}
	g.listItemClick = function(index) {
		const g = this;
		if (!g.selection.includes(g.list[index])) {
			g.selection.push(g.list[index]);
		} else if (g.selection.length > 1) {
			g.selection = g.selection.filter(x => x != g.list[index] );
		}
		{ // For the GUI.
		} { // For the app function.
			g.appFunction();
		} { // For persistence.
			var req = db.transaction(["settings"], "readwrite");
			req.objectStore("settings")
				.put(JSON.stringify(g.selection),
					`${getCurrentAccount().id}-${g.key}`);
			req.onsuccess = (event) => {
				console.log(`successfully selected ${g.key}`, event);
			};
			req.onerror = (event) => {
				console.log(`error selecting ${g.key}`, event);
			};
		}
	}
v.load = function() {
	const debuglog = false, g = this.list;
	var selectedValue = '';
	function finishInit(v) {
		const g = v.list;
		var a = tryParseJSONObject(selectedValue);
		if (!Array.isArray(a)) a = [];
		if (a.length == 0) a.push(g.list[0]);
		g.selection = a;
		{ // For the GUI.
			v.setRenderFlag(true);
		} { // For the app function.
			g.appFunction();
		} { // For persistence.
		}
		if (debuglog) console.log(`${g.key} ready`, g.selection);
	}
	if (debuglog) console.log("requesting", `${getCurrentAccount().id}-${g.key}`);
	var req = db.transaction(["settings"], "readonly")
		.objectStore("settings")
		.get(`${getCurrentAccount().id}-${g.key}`);
	req.onsuccess = (event) => {
		selectedValue = event.target.result
		if (debuglog) console.log(`${g.key} restored`, selectedValue);
		finishInit(this);
	};
	req.onerror = (event) => {
		console.log(`error getting ${g.key}`, event);
		finishInit(this);
	};
}
