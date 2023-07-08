const defaultvendorcurrency = v = new vp.View(null);
v.name = Object.keys({defaultvendorcurrency}).pop();
v.title = 'default vendor currency';
v.gadgets.push(v.list = g = new vp.Gadget(v));
	Object.defineProperty(g, "list", {
		get : function () {
			if (config) return config.enabledCurrencies;
			else return supportedCurrencies;
		}
	});
  g.index = -1;
	g.listItemClick = function(index) {
		const g = this;
		{ // For the GUI.
			g.index = index; v.setRenderFlag(true);
		} { // For the app function.
		} { // For persistence.
			var req = db.transaction(["settings"], "readwrite");
			req.objectStore("settings")
				.put(languages[defaultvendorcurrency.list.index],
					`${getCurrentAccount().id}-defaultVendorCurrency`);
			req.onsuccess = (event) => {
				console.log("successfully selected defaultVendorCurrency", event);
			};
			req.onerror = (event) => {
				console.log("error selecting defaultVendorCurrency", event);
			};
		}
	}
v.load = function() {
	const debuglog = false;
	var selectedValue = '';
	function finishInit() {
		var index = -1;
		for (var i=0; i<config.enabledCurrencies.length; i++) {
			if (config.enabledCurrencies[i] == selectedValue) {
				index = i;
				break;
			}
		}
		if (index < 0) index = 0;
		{ // For the GUI.
			defaultvendorcurrency.list.index = index;
			defaultvendorcurrency.setRenderFlag(true);
		} { // For the app function.
		} { // For persistence.
		}
		if (debuglog) console.log("lang ready", defaultvendorcurrency.list.index);
	}
	if (debuglog) console.log("requesting", `${getCurrentAccount().id}-mainLanguage`);
	var req = db.transaction(["settings"], "readonly")
		.objectStore("settings")
		.get(`${getCurrentAccount().id}-defaultVendorCurrency`);
	req.onsuccess = (event) => {
		selectedValue = event.target.result
		if (debuglog) console.log("defaultVendorCurrency restored", selectedValue);
		finishInit();
	};
	req.onerror = (event) => {
		console.log("error getting defaultVendorCurrency", event);
		finishInit();
	};
}
