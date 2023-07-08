const enabledcurrencies = v = new vp.View(null);
v.name = Object.keys({enabledcurrencies}).pop();
v.title = 'enabled currencies';
v.gadgets.push(v.list = g = new vp.Gadget(v));
	g.key = 'enabledCurrencies';
	g.list = supportedCurrencies;
	g.selection = [];
	g.listItemClick = function(index) {
		const g = this;
		if (!g.selection.includes(g.list[index])) {
			g.selection.push(g.list[index]);
		} else if (g.selection.length > 1) {
			g.selection = g.selection.filter(x => x != g.list[index] );
		}
		{ // For the GUI.
		} { // For the app function.
			currencysettings.defaultvendorcurrency.hide = g.selection.length == 1;
			currencysettings.enabledpaymentmethods.hide = g.selection.length == 1;
			currencysettings.defaultvendorcurrency.enabled = !currencysettings.defaultvendorcurrency.hide;
			currencysettings.enabledpaymentmethods.enabled = !currencysettings.enabledpaymentmethods.hide;
			enabledPaymentMethods.splice(0, enabledPaymentMethods.length, ...g.selection);
			enabledpaymentmethods.load();
			mainsettings.queueLayout();
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
		if (Array.isArray(a)) {
			g.selection = a;
		}
		if (g.selection.length == 0) g.selection.push(g.list[0]);
		{ // For the GUI.
			v.setRenderFlag(true);
		} { // For the app function.
			currencysettings.defaultvendorcurrency.hide = g.selection.length == 1;
			currencysettings.enabledpaymentmethods.hide = g.selection.length == 1;
			enabledPaymentMethods.splice(0, enabledPaymentMethods.length, ...g.selection);
			enabledpaymentmethods.load();
			mainsettings.queueLayout();
			//defaultVendorCurrency = g.list[index];
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
