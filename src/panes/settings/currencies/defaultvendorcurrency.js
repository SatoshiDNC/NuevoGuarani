const defaultvendorcurrency = v = new vp.View(null);
v.name = Object.keys({defaultvendorcurrency}).pop();
v.title = 'default vendor currency (title)';
v.minX = 0; v.maxX = 0;
v.minY = 0; v.maxY = 0;
v.gadgets.push(v.swipeGad = new vp.SwipeGadget(v));
v.swipeGad.actionFlags = vp.GAF_SWIPEABLE_UPDOWN | vp.GAF_SCROLLABLE_UPDOWN;
v.swipeGad.hide = true;
v.gadgets.push(v.list = g = new vp.Gadget(v));
	g.key = 'defaultVendorCurrency';
	Object.defineProperty(g, "list", {
		get : function () {
			if (config) return config.enabledCurrencies;
			else return supportedCurrencies;
		}
	});
  g.index = -1;
	Object.defineProperty(g, "value", {
		get : function () {
			if (this.index >= 0 && this.index < this.list.length)
				return this.list[this.index];
		}
	});
	g.listItemClick = function(index) {
		const g = this;
		{ // For the GUI.
			g.index = index; v.setRenderFlag(true);
		} { // For the app function.
		} { // For persistence.
			var req = db.transaction(["settings"], "readwrite");
			req.objectStore("settings")
				.put(g.value,
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
	const debuglog = false;
	const g = this.list;
	g.tempValue = g.defaultValue;
	function finishInit(v, g) {
		var index = -1;
		for (var i=0; i<g.list.length; i++) {
			if (g.list[i] == g.tempValue) {
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
		delete g.tempValue;
		if (debuglog) console.log(`${g.key} ready`, g.value);
	}
	if (debuglog) console.log("requesting", `${getCurrentAccount().id}-${g.key}`);
	var req = db.transaction(["settings"], "readonly")
		.objectStore("settings")
		.get(`${getCurrentAccount().id}-${g.key}`);
	req.onsuccess = (event) => {
		if (event.target.result !== undefined)
			g.tempValue = event.target.result;
		if (debuglog) console.log(`${g.key} restored`, g.tempValue);
		finishInit(this, g);
	};
	req.onerror = (event) => {
		console.log(`error getting ${g.key}`, event);
		finishInit(this, g);
	};
}
