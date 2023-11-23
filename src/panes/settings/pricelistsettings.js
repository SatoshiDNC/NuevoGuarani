var pricelisttypes = ['none', 'manual', 'NostrMarket compatible'];


const nostrmarketstall = v = new vp.View(null);
v.name = Object.keys({nostrmarketstall}).pop();
v.title = 'NostrMarket stall';
v.minX = 0; v.maxX = 0;
v.minY = 0; v.maxY = 0;
v.gadgets.push(v.swipeGad = new vp.SwipeGadget(v));
v.swipeGad.actionFlags = vp.GAF_SWIPEABLE_UPDOWN | vp.GAF_SCROLLABLE_UPDOWN;
v.swipeGad.hide = true;
v.gadgets.push(v.list = g = new vp.Gadget(v));
  g.key = 'nostrMarketStall';
  g.state = 0;
  Object.defineProperty(g, "list", {
    get : function () {
      if (this.state == 2) return this.stallList
      if (this.state == 1) return ['tbd']
      const url = pricelistsettings.nostrmarketurl.value
      const key = pricelistsettings.nostrmarketwalletkey.value
      if (!url || !key) return ['tbd']
      this.state = 1
      console.groupCollapsed(this.constructor.name+'.get()');
      console.log('initializing', key != '')
      const asyncLogic = async () => {
        console.log('getting stalls', url)
        try {
          const response = await fetch(url+'/stall?pending=false&api-key='+key, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
            },
          });
          const json = await response.json()
          console.log(json)
          const tempList = []
          json.map(e => { const { id, name } = e; tempList.push(name) })
          this.stallList = tempList
          this.state = 2
          this.viewport.setRenderFlag(true)
          pricelistsettings.setRenderFlag(true)
        } catch {
          this.state = 0
        }
      }
      asyncLogic()
      console.groupEnd()
      return ['tbd']
    }
  });
  g.index = -1;
	Object.defineProperty(g, "value", {
		get : function () {
			if (this.index >= 0 && this.index < this.list.length)
				return this.list[this.index];
			return '';
		}
	});
	g.appFunction = function() {
		pricelistsettings.queueLayout();
	}
	g.listItemClick = function(index) {
		const g = this;
		{ // For the GUI.
			g.index = index; v.setRenderFlag(true);
		} { // For the app function.
			g.appFunction();
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
v.load = function(cb) {
	const debuglog = false;
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
			nostrmarketstall.list.index = index;
			nostrmarketstall.setRenderFlag(true);
		} { // For the app function.
			g.appFunction();
		} { // For persistence.
		}
		delete g.tempValue;
		if (debuglog) console.log(`${g.key} ready`, g.value);
		v.loadComplete = true; cb();
	}
	if (debuglog) console.log("requesting", `${getCurrentAccount().id}-${g.key}`);
	var req = db.transaction(["settings"], "readonly")
		.objectStore("settings")
		.get(`${getCurrentAccount().id}-${g.key}`);
	req.onsuccess = (event) => {
		if (event.target.result !== undefined)
			g.tempValue = event.target.result;
		if (debuglog) console.log(`${g.key} restored`, g.tempValue);
		finishInit(cb, this, g);
	};
	req.onerror = (event) => {
		console.log(`error getting ${g.key}`, event);
		finishInit(cb, this, g);
	};
}


const pricelistsettings = v = new vp.View(null);
v.name = Object.keys({pricelistsettings}).pop();
v.title = 'price list';
v.minX = 0; v.maxX = 0;
v.minY = 0; v.maxY = 0;
v.gadgets.push(v.swipeGad = new vp.SwipeGadget(v));
v.swipeGad.actionFlags = vp.GAF_SWIPEABLE_UPDOWN | vp.GAF_SCROLLABLE_UPDOWN;
v.swipeGad.hide = true;
Object.defineProperty(v, "pricelist", {
	get : function () {
		const i = pricelistsettings.typelist.index;
		if (i >= 0 && i < pricelisttypes.length) switch (pricelisttypes[i]) {
      case 'manual': return new ManualPriceList(); break;
      case 'NostrMarket compatible': return new NostrMarketPriceList(); break;
		}
		return new PriceList();
	}
});
v.gadgets.push(v.typelist = g = new vp.Gadget(v));
	g.key = 'priceListType';
	g.list = pricelisttypes;
	g.index = -1;
	g.listItemClick = function(index) {
		const g = this, v = g.viewport;

		{ // For the GUI.
			v.typelist.index = index;
			v.setRenderFlag(true);
		} { // For the app function.

			if (pricelisttypes[index] == 'NostrMarket compatible') {
				delete v.nostrmarketurl.hide;
				delete v.nostrmarketwalletkey.hide;
				delete v.nostrmarketstall.hide;
			} else {
				v.nostrmarketurl.hide = true;
				v.nostrmarketwalletkey.hide = true;
				v.nostrmarketstall.hide = true;
			}

/*
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
*/

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
v.gadgets.push(v.nostrmarketurl = g = new vp.Gadget(v));
	g.type = 'button';
	g.key = 'NostrMarketURL';
	g.title = 'base URL';
	Object.defineProperty(g, "subtitle", {
		get : function () {
			if (this.value) {
				if (this.value.length < 50) return ' '+this.value;
				else return ' '+this.value.substr(0,50)+'...';
			}	else return 'not set';
		}
	});
	g.value = '';
	g.defaultValue = 'https://lnbits.satoshidnc.com/nostrmarket/api/v1';
	g.hide = true;
	g.daisychain = true;
	g.clickFunc = function() {
		const g = this;
		var val = prompt(tr('base URL')+':', g.defaultValue);
		if (!val) return;
		{ // For the GUI.
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
v.gadgets.push(v.nostrmarketwalletkey = g = new vp.Gadget(v));
	g.type = 'button';
	g.key = 'nostrMarketWalletKey';
	g.title = 'key';
	Object.defineProperty(g, "subtitle", {
		get : function () {
			if (this.value) {
				var temp;
				if (this.value.length > 4) temp = this.value.substr(0,4)+'*'.repeat(this.value.length-4); else temp = this.value;
				if (temp.length < 50) return ' '+temp;
				else return ' '+temp.substr(0,50)+'...';
			}	else return 'not set';
		}
	});
	g.value = '';
	g.hide = true;
  g.daisychain = true;
	g.clickFunc = function() {
		const g = this;
		var val = prompt(tr('API admin or invoice/read key')+':');
		if (!val) return;
		{ // For the GUI.
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
  v.gadgets.push(v.nostrmarketstall = g = new vp.Gadget(v));
	g.title = 'stall';
	Object.defineProperty(g, "subtitle", {
		get : function () { try { return nostrmarketstall.list.value; } catch (e) {} }
	});
	g.pane = nostrmarketstall;
/*
v.gadgets.push(v.strikeurl = g = new vp.Gadget(v));
	g.type = 'button';
	g.key = 'strikeURL';
	g.title = 'base URL';
	Object.defineProperty(g, "subtitle", {
		get : function () {
			if (this.value) {
				if (this.value.length < 50) return ' '+this.value;
				else return ' '+this.value.substr(0,50)+'...';
			}	else return 'not set';
		}
	});
	g.value = '';
	g.defaultValue = 'https://api.strike.me/v1';
	g.hide = true;
	g.daisychain = true;
	g.clickFunc = function() {
		const g = this;
		var val = prompt(tr('base URL')+':', g.defaultValue);
		if (!val) return;
		{ // For the GUI.
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
	Object.defineProperty(g, "subtitle", {
		get : function () {
			if (this.value) {
				var temp;
				if (this.value.length > 4) temp = this.value.substr(0,4)+'*'.repeat(this.value.length-4); else temp = this.value;
				if (temp.length < 50) return ' '+temp;
				else return ' '+temp.substr(0,50)+'...';
			}	else return 'not set';
		}
	});
	g.value = '';
	g.hide = true;
	g.clickFunc = function() {
		const g = this;
		var val = prompt(tr('API bearer token')+':');
		if (!val) return;
		{ // For the GUI.
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
	Object.defineProperty(g, "subtitle", {
		get : function () {
			if (this.value) {
				if (this.value.length < 50) return ' '+this.value;
				else return ' '+this.value.substr(0,50)+'...';
			}	else return 'not set';
		}
	});
	g.value = '';
	g.defaultValue = 'https://coinos.io/api';
	g.hide = true;
	g.daisychain = true;
	g.clickFunc = function() {
		const g = this;
		var val = prompt(tr('base URL')+':', g.defaultValue);
		if (!val) return;
		{ // For the GUI.
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
	Object.defineProperty(g, "subtitle", {
		get : function () {
			if (this.value) {
				var temp;
				if (this.value.length > 4) temp = this.value.substr(0,4)+'*'.repeat(this.value.length-4); else temp = this.value;
				if (temp.length < 50) return ' '+temp;
				else return ' '+temp.substr(0,50)+'...';
			}	else return 'not set';
		}
	});
	g.value = '';
	g.hide = true;
	g.clickFunc = function() {
		const g = this;
		var val = prompt(tr('API auth token')+':');
		if (!val) return;
		{ // For the GUI.
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
*/
v.gadgets.push(v.manageprices = g = new vp.Gadget(v));
	g.type = 'button';
	g.key = 'managePrices';
	g.title = 'manage price list';
	Object.defineProperty(g, "subtitle", {
		get : function () {
			return String(this?.viewport?.pricelist?.count()) + ' items';
		}
	});
	g.value = '';
	g.defaultValue = '';
	g.clickFunc = function() {
		const g = this;
		var val = prompt(tr('base URL')+':', g.defaultValue);
		if (!val) return;
		{ // For the GUI.
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
v.load = function(cb) {
	const debuglog = false;
	{
		const g = this.typelist, v = this;
		g.tempValue = '';
		function finishInit(cb, v) {
			const g = v.typelist;
			var index = -1;
			for (var i=0; i<pricelisttypes.length; i++) {
				if (pricelisttypes[i] == g.tempValue) {
					index = i;
					break;
				}
			}
			if (index < 0) index = 0;
			{ // For the GUI.
				pricelistsettings.typelist.index = index;
				pricelistsettings.setRenderFlag(true);
			} { // For the app function.

				if (pricelisttypes[index] == 'NostrMarket compatible') {
					delete v.nostrmarketurl.hide;
					delete v.nostrmarketwalletkey.hide;
				} else {
					v.nostrmarketurl.hide = true;
					v.nostrmarketwalletkey.hide = true;
				}

/*
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
*/

				v.queueLayout();
			} { // For persistence.
			}
			if (debuglog) console.log(`${g.key} ready`, g.tempValue);
			v.loadComplete = true; cb();
		}
		if (debuglog) console.log("requesting", `${getCurrentAccount().id}-${g.key}`);
		var req = db.transaction(["settings"], "readonly")
			.objectStore("settings")
			.get(`${getCurrentAccount().id}-${g.key}`);
		req.onsuccess = (event) => {
			g.tempValue = event.target.result
			if (debuglog) console.log(`${g.key} restored`, g.tempValue);
			finishInit(cb, this);
		};
		req.onerror = (event) => {
			console.log(`error getting ${g.key}`, event);
			finishInit(cb, this);
		};
	}
	for (const gad of [
		'nostrmarketurl', 'nostrmarketwalletkey',
//		'strikeurl', 'strikekey',
//		'coinosurl', 'coinoskey',
	]) {
		const g = this[gad];
		g.tempValue = g.defaultValue;
		function finishInit(v, g) {
			{ // For the GUI.
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
			finishInit(this, g);
      if (['nostrmarketurl', 'nostrmarketwalletkey'].includes(gad)) {
        nostrmarketstall.load(() => {})
      }
		};
		req.onerror = (event) => {
			console.log(`error getting ${g.key}`, event);
			finishInit(this, g);
		};
	}
}
