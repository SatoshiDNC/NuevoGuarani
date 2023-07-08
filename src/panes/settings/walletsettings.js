var wallettypes = ['external', 'strike compatible', 'coinos compatible'];

const walletsettings = v = new vp.View(null);
v.name = Object.keys({walletsettings}).pop();
v.title = 'wallet';
v.gadgets.push(v.typelist = g = new vp.Gadget(v));
	g.key = 'walletType';
	g.list = wallettypes;
  g.index = -1;
	g.listItemClick = function(index) {
		const g = this, v = g.viewport;

		{ // For the GUI.
			v.typelist.index = index;
			v.setRenderFlag(true);
		} { // For the app function.

			if (wallettypes[index] == 'strike compatible') {
				delete v.strikeurl.hide;
				delete v.strikekey.hide;
			} else {
				v.strikeurl.hide = true;
				v.strikekey.hide = true;
			}

			if (wallettypes[index] == 'coinos compatible') {
				delete v.coinosurl.hide;
				delete v.coinoskey.hide;
			} else {
				v.coinosurl.hide = true;
				v.coinoskey.hide = true;
			}

			v.queueLayout();
		} { // For persistence.
			var req = db.transaction(["settings"], "readwrite");
			req.objectStore("settings")
				.put(g.list[index],
					`${getCurrentAccount().id}-${g.key}`);
			req.onsuccess = (event) => {
				console.log(`successfully selected ${g.key}`, event);
			};
			req.onerror = (event) => {
				console.log(`error selecting ${g.key}`, event);
			};
		}
	}
v.gadgets.push(v.strikeurl = g = new vp.Gadget(v));
	g.type = 'button';
	g.key = 'strikeURL';
	g.title = 'base URL';
	g.subtitle = '';
	g.value = '';
	g.defaultValue = 'https://api.strike.me/v1';
	g.hide = true;
	g.daisychain = true;
	g.clickFunc = function() {
		const g = this;
		var val = prompt(tr('base URL')+':');
		if (!val) return;
		{ // For the GUI.
			g.subtitle = val.substr(0,50)+'...';
			g.viewport.queueLayout();
		} { // For the app function.
			g.value = val;
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
v.gadgets.push(v.strikekey = g = new vp.Gadget(v));
	g.type = 'button';
	g.key = 'strikeKey';
	g.title = 'API bearer token';
	g.subtitle = '';
	g.value = '';
	g.hide = true;
	g.clickFunc = function() {
		const g = this;
		var val = prompt(tr('API bearer token')+':');
		if (!val) return;
		{ // For the GUI.
			g.subtitle = val.substr(0,50)+'...';
			g.viewport.queueLayout();
		} { // For the app function.
			g.value = val;
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
v.gadgets.push(v.coinosurl = g = new vp.Gadget(v));
	g.type = 'button';
	g.key = 'coinosURL';
	g.title = 'base URL';
	g.subtitle = '';
	g.value = '';
	g.defaultValue = 'https://coinos.io/api';
	g.hide = true;
	g.daisychain = true;
	g.clickFunc = function() {
		const g = this;
		var val = prompt(tr('base URL')+':');
		if (!val) return;
		{ // For the GUI.
			g.subtitle = val.substr(0,50)+'...';
			g.viewport.queueLayout();
		} { // For the app function.
			g.value = val;
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
v.gadgets.push(v.coinoskey = g = new vp.Gadget(v));
	g.type = 'button';
	g.key = 'coinosKey';
	g.title = 'API auth token';
	g.subtitle = '';
	g.value = '';
	g.hide = true;
	g.clickFunc = function() {
		const g = this;
		var val = prompt(tr('API auth token')+':');
		if (!val) return;
		{ // For the GUI.
			g.subtitle = val.substr(0,50)+'...';
			g.viewport.queueLayout();
		} { // For the app function.
			g.value = val;
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
	{
		const g = this.typelist, v = this;
		g.tempValue = '';
		function finishInit(v) {
			const g = v.typelist;
			var index = -1;
			for (var i=0; i<wallettypes.length; i++) {
				if (wallettypes[i] == g.tempValue) {
					index = i;
					break;
				}
			}
			if (index < 0) index = 0;
			{ // For the GUI.
				walletsettings.typelist.index = index;
				walletsettings.setRenderFlag(true);
			} { // For the app function.

				if (wallettypes[index] == 'strike compatible') {
					delete v.strikeurl.hide;
					delete v.strikekey.hide;
				} else {
					v.strikeurl.hide = true;
					v.strikekey.hide = true;
				}

				if (wallettypes[index] == 'coinos compatible') {
					delete v.coinosurl.hide;
					delete v.coinoskey.hide;
				} else {
					v.coinosurl.hide = true;
					v.coinoskey.hide = true;
				}

				v.queueLayout();
			} { // For persistence.
			}
			if (debuglog) console.log(`${g.key} ready`, g.tempValue);
		}
		if (debuglog) console.log("requesting", `${getCurrentAccount().id}-${g.key}`);
		var req = db.transaction(["settings"], "readonly")
			.objectStore("settings")
			.get(`${getCurrentAccount().id}-${g.key}`);
		req.onsuccess = (event) => {
			g.tempValue = event.target.result
			if (debuglog) console.log(`${g.key} restored`, g.tempValue);
			finishInit(this);
		};
		req.onerror = (event) => {
			console.log(`error getting ${g.key}`, event);
			finishInit(this);
		};
	}
	{
		const g = this.strikeurl;
		g.tempValue = g.defaultValue;
		function finishInit(v) {
			const g = v.strikeurl;
			{ // For the GUI.
				g.subtitle = g.tempValue.substr(0,50);
				g.viewport.queueLayout();
			} { // For the app function.
				g.value = g.tempValue;
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
			finishInit(this);
		};
		req.onerror = (event) => {
			console.log(`error getting ${g.key}`, event);
			finishInit(this);
		};
	}
	{
		const g = this.strikekey;
		g.tempValue = '';
		function finishInit(v) {
			const g = v.strikekey;
			{ // For the GUI.
				g.subtitle = g.tempValue? g.tempValue.substr(0,50)+'...': 'not set';
				g.viewport.queueLayout();
			} { // For the app function.
				g.value = g.tempValue;
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
			finishInit(this);
		};
		req.onerror = (event) => {
			console.log(`error getting ${g.key}`, event);
			finishInit(this);
		};
	}
	{
		const g = this.coinosurl;
		g.tempValue = g.defaultValue;
		function finishInit(v) {
			const g = v.coinosurl;
			{ // For the GUI.
				g.subtitle = g.tempValue.substr(0,50);
				g.viewport.queueLayout();
			} { // For the app function.
				g.value = g.tempValue;
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
			finishInit(this);
		};
		req.onerror = (event) => {
			console.log(`error getting ${g.key}`, event);
			finishInit(this);
		};
	}
	{
		const g = this.coinoskey;
		g.tempValue = '';
		function finishInit(v) {
			const g = v.coinoskey;
			{ // For the GUI.
				g.subtitle = g.tempValue? g.tempValue.substr(0,50)+'...': 'not set';
				g.viewport.queueLayout();
			} { // For the app function.
				g.value = g.tempValue;
			} { // For persistence.
			}
			if (debuglog) console.log(`${g.key} ready`, g.tempValue);
		}
		if (debuglog) console.log("requesting", `${getCurrentAccount().id}-${g.key}`);
		var req = db.transaction(["settings"], "readonly")
			.objectStore("settings")
			.get(`${getCurrentAccount().id}-${g.key}`);
		req.onsuccess = (event) => {
			if (event.target.result !== undefined)
				g.tempValue = event.target.result;
			if (debuglog) console.log(`${g.key} restored`, g.tempValue);
			finishInit(this);
		};
		req.onerror = (event) => {
			console.log(`error getting ${g.key}`, event);
			finishInit(this);
		};
	}
}

function getWalletType() { return wallettypes[walletsettings.typelist.index]; }
function getStrikeURL() { return walletsettings.strikeurl.value; }
function getStrikeKey() { return walletsettings.strikekey.value; }
function getCoinosURL() { return walletsettings.coinosurl.value; }
function getCoinosKey() { return walletsettings.coinoskey.value; }

