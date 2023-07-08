const enabledpaymentmethods = v = new vp.View(null);
v.name = Object.keys({enabledpaymentmethods}).pop();
v.title = 'payment methods';
v.gadgets.push(v.list = g = new vp.Gadget(v));
	g.key = 'enabledPaymentMethods';
	g.list = enabledPaymentMethods;
	g.selection = [];
	g.appFunction = function() {
		const g = this;
		mainsettings.walletsettings.hide = !g.selection.includes('₿');
		mainsettings.walletsettings.enabled = !mainsettings.walletsettings.hide;
		mainsettings.currencysettings.daisychain =
			!mainsettings.walletsettings.hide;

		checkoutpages.index = 0;

		var i = checkoutpages.getPageIndex(choosemethod);
		if (g.selection.length > 1) {
			if (i < 0) { checkoutpages.pages.splice(1, 0, choosemethod); }
			choosemethod.selectedMethod = undefined;
		} else {
			if (i >= 0) { checkoutpages.pages.splice(i, 1); }
			var gad = choosemethod.methods[enabledPaymentMethods[0]];
			choosemethod.selectedMethod = gad;
			delete checkoutpages.swipeGad.maxX;
			cashback.resetOptions();
		}

		var p = checkoutpages.getPageIndex(choosemethod); if (p < 0) p = 0;
		var i = checkoutpages.getPageIndex(lightningqr);
		if (g.selection.includes('₿')) {
			if (i < 0) { checkoutpages.pages.splice(p+1, 0, lightningqr); }
		} else {
			if (i >= 0) { checkoutpages.pages.splice(i, 1); }
		}
/*
		var i = checkoutpages.getPageIndex(receivepayment);
		if (g.selection.includes('₲')
		||  g.selection.includes('$')
		||  g.selection.includes('€')) {
			if (i < 0) { checkoutpages.pages.splice(p+1, 0, receivepayment); }
		} else {
			if (i >= 0) { checkoutpages.pages.splice(i, 1); }
		}
*/
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
		g.selection = [];
		if (Array.isArray(a)) {
			for (const o of a) if (g.list.includes(o)) g.selection.push(o);
		}
		if (g.selection.length == 0) g.selection.push(g.list[0]);
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
