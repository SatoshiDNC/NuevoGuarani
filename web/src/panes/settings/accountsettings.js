var accounts = [];
function getCurrentAccount() { return accounts[accountsettings.accountlist.index]; }

//var curAcct = {};
accounts.current = getCurrentAccount;

function dateToID(d) {
	return 'A'
		+ d.getFullYear().toString().padStart(4,'0')
		+ (d.getMonth()+1).toString().padStart(2,'0')
		+ d.getDate().toString().padStart(2,'0')
		+ d.getHours().toString().padStart(2,'0')
		+ d.getMinutes().toString().padStart(2,'0')
		+ d.getSeconds().toString().padStart(2,'0')
		+ d.getMilliseconds().toString().padStart(3,'0')
		;
}

{
	const debuglog = false;
	dbNotifier = (event) => {
		if (debuglog) console.log("Database opened for account settings");
		var selectedAccount = '';
		function finishAccountInit() {
			var index = -1;
			for (var i=0; i<accounts.length; i++) {
				if (accounts[i].id == selectedAccount) {
					index = i;
					break;
				}
			}
			if (index < 0) index = 0;
			{ // For the GUI.
				accountsettings.accountlist.index = index;
				accountsettings.queueLayout();
			} { // For the app function.
				loadAccount();
			} { // For persistence.
			}
			if (debuglog) console.log("account ready", accountsettings.accountlist.index);
		}
		function accountInit2() {
			if (debuglog) console.log("requesting selectedAccount");
			var req = db.transaction(["settings"], "readonly")
				.objectStore("settings")
				.get("selectedAccount");
			req.onsuccess = (event) => {
				selectedAccount = event.target.result;
				if (debuglog) console.log("selectedAccount restored", selectedAccount);
				finishAccountInit();
			};
			req.onerror = (event) => {
				console.log("error getting selectedAccount", event);
				finishAccountInit();
			};
		}
		accounts.splice(0, accounts.length);
		const transaction = db.transaction(["accounts"], "readonly");
		const objectStore = transaction.objectStore("accounts");
		objectStore.openCursor().onsuccess = (event) => {
			const cursor = event.target.result;
			if (cursor) {
				accounts.push({
					id:			cursor.value.id,
					title:	cursor.value.title,
				});
				if (debuglog) console.log("restored account", cursor.value.id, cursor.value.title);
				cursor.continue();
			} else {
				if (accounts.length == 0) {
					if (debuglog) console.log("creating default account");
					accounts.push({
						id:			dateToID(new Date()),
						title:	'my business',
					});
					if (debuglog) console.log("saving default account");
					var tx = db.transaction(["accounts", "settings"], "readwrite");
					tx.objectStore("accounts").put(accounts[0], accounts[0].id);
					tx.objectStore("settings").put(accounts[0].id, 'selectedAccount');
					tx.oncomplete = (event) => {
						if (debuglog) console.log("default account saved");
						accountInit2();
					};
					tx.onerror = (event) => {
						console.log("error saving default account", event);
					};
				} else {
					if (debuglog) console.log("no more accounts");
					accountInit2();
				}
			}
		};
	};
}

let showConfigOnlyOnce = true;
function loadAccount() {
	const panes = [
		accountsettings,
		languagesettings,
		maincurrency,
		cashcurrency,
		currencysettings,
		walletsettings,
		nostrmarketstall,
		pricelistsettings,
		camerasettings,
		layoutsettings,
		colorsettings,
	];

	function cb() {
		let allComplete = true;
		let n = 0;
		for (const pane of panes) {
			if (pane.loadComplete) {
				n++;
			} else {
				allComplete = false;
				break;
			}
		}
		if (allComplete && showConfigOnlyOnce) {
			showConfigOnlyOnce = false;
			config.log();
			startpane2.invoice.clickFunc();
		} else {
//			console.log(n);
		}
	}

	for (const pane of panes) {
		pane.load(cb);
	//walletsettings.load(); // TODO
	//camerasettings.load(); // TODO
	}
//	buttonbar.popGad.enabled = true;
}

const accountsettings = v = new vp.View(null);
v.name = Object.keys({accountsettings}).pop();
v.title = 'account';
v.minX = 0; v.maxX = 0;
v.minY = 0; v.maxY = 0;
v.gadgets.push(v.swipeGad = new vp.SwipeGadget(v));
v.swipeGad.actionFlags = vp.GAF_SWIPEABLE_UPDOWN | vp.GAF_SCROLLABLE_UPDOWN;
v.swipeGad.hide = true;
v.gadgets.push(v.accountlist = g = new vp.Gadget(v));
	g.list = accounts;
	g.canAdd = true;
  g.index = -1;
	g.listAddClick = function() {
		console.log("adding new account");
		var a = {
			id:			dateToID(new Date()),
			title:	'new account',
		};
		accounts.push(a);
		accountsettings.queueLayout();
		console.log("saving new account");
		var tx = db.transaction(["accounts", "settings"], "readwrite");
		tx.objectStore("accounts").put(a, a.id);
		tx.objectStore("settings").put(a.id, 'selectedAccount');
		tx.objectStore("settings").put(
			languages[enabledLangs.indexOf(lcode)].title, a.id+'-mainLanguage');
		tx.objectStore("settings").put(
			themes[colorsettings.themelist.index].title, a.id+'-selectedTheme');
		tx.oncomplete = (event) => {
			console.log("new account saved");
			dbNotifier(event);
		};
		tx.onerror = (event) => {
			console.log("error saving new account", event);
		};
	}
	g.listItemClick = function(index) {
		const g = this;
		{ // For the GUI.
			accountsettings.accountlist.index = index;
			accountsettings.queueLayout();
		} { // For the app function.
			loadAccount();
		} { // For persistence.
			var req = db.transaction(["settings"], "readwrite");
			req.objectStore("settings")
				.put(accounts[index].id, 'selectedAccount');
			req.onsuccess = (event) => {
				console.log("successfully selected new account", event);
			};
			req.onerror = (event) => {
				console.log("error selecting new account", event);
			};
		}
	}
v.gadgets.push(v.deleteaccount = g = new vp.Gadget(v));
	g.listToOverlay = v.accountlist;
  g.icon = "\x03";
	g.clickFunc = function() {
    PlatformUtil.UserConfirm(tr(`delete '@'?`).replace('@',tr(getCurrentAccount().title)), bool => {
      if (bool) {
        console.log(`delete '${getCurrentAccount().title}'?`);
        var a = getCurrentAccount();
        var tx = db.transaction(["accounts"], "readwrite");
        tx.objectStore("accounts").delete(a.id);
        tx.oncomplete = (event) => {
          console.log("account deleted");
          dbNotifier(event);
        };
        tx.onerror = (event) => {
          console.log("error deleting account", event);
          dbNotifier(event);
        };
      }
    })
	}
v.gadgets.push(v.editaccount = g = new vp.Gadget(v));
	g.listToOverlay = v.accountlist;
  g.icon = "\x0C";
	g.clickFunc = function() {
		var a = accounts.current();
    PlatformUtil.UserPrompt(tr('Account name:'), tr(a.title), str => {
      if (str && str.trim() != a.title) {
        str = str.trim();
        console.log('edit account', str);
        a.title = str;
        var tx = db.transaction(["accounts"], "readwrite");
        tx.objectStore("accounts").put(a, a.id);
        tx.oncomplete = (event) => {
          console.log("account updated");
        };
        tx.onerror = (event) => {
          console.log("error updating account", event);
        };
        settingsbuttons2.setRenderFlag(true);
        accountsettings.setRenderFlag(true);
      }
    })
	}
v.gadgets.push(v.locaddress = g = new vp.Gadget(v));
	g.type = 'button';
	g.key = 'locAddress';
	g.title = 'business address';
	Object.defineProperty(g, "subtitle", {
		get : function () {
			if (this.value != '') {
				if (this.value.length < 50) return this.value;
				else return this.value.substr(0,50)+'...';
			}	else return icap(tr('not set'));
		}
	});
	g.value = '';
	g.defaultValue = '';
	g.daisychain = true;
	g.clickFunc = function() {
		const g = this;
    PlatformUtil.UserPrompt(icap(tr(g.title))+':', '', val => {
      if (!val) return;
      { // For the GUI.
        g.viewport.queueLayout();
      } { // For the app function.
        g.value = val.trim();
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
    })
	}
v.gadgets.push(v.loccity = g = new vp.Gadget(v));
	g.type = 'button';
	g.key = 'locCity';
	g.title = 'city';
	Object.defineProperty(g, "subtitle", {
		get : function () {
			if (this.value != '') {
				if (this.value.length < 50) return this.value;
				else return this.value.substr(0,50)+'...';
			}	else return icap(tr('not set'));
		}
	});
	g.value = '';
	g.defaultValue = '';
	g.daisychain = true;
	g.clickFunc = v.locaddress.clickFunc;
v.gadgets.push(v.locstate = g = new vp.Gadget(v));
	g.type = 'button';
	g.key = 'locState';
	g.title = 'state';
	Object.defineProperty(g, "subtitle", {
		get : function () {
			if (this.value != '') {
				if (this.value.length < 50) return this.value;
				else return this.value.substr(0,50)+'...';
			}	else return icap(tr('not set'));
		}
	});
	g.value = '';
	g.defaultValue = '';
	g.daisychain = true;
	g.clickFunc = v.locaddress.clickFunc;
v.gadgets.push(v.locpostalcode = g = new vp.Gadget(v));
	g.type = 'button';
	g.key = 'locPostalCode';
	g.title = 'postal code';
	Object.defineProperty(g, "subtitle", {
		get : function () {
			if (this.value != '') {
				if (this.value.length < 50) return this.value;
				else return this.value.substr(0,50)+'...';
			}	else return icap(tr('not set'));
		}
	});
	g.value = '';
	g.defaultValue = '';
	g.daisychain = true;
	g.clickFunc = v.locaddress.clickFunc;
v.gadgets.push(v.telephone = g = new vp.Gadget(v));
	g.type = 'button';
	g.key = 'busTel';
	g.title = 'business telephone';
	Object.defineProperty(g, "subtitle", {
		get : function () {
			if (this.value != '') {
				if (this.value.length < 50) return this.value;
				else return this.value.substr(0,50)+'...';
			}	else return icap(tr('not set'));
		}
	});
	g.value = '';
	g.defaultValue = '';
	g.daisychain = false;
	g.clickFunc = v.locaddress.clickFunc;
v.gadgets.push(v.taxid = g = new vp.Gadget(v));
	g.type = 'button';
	g.key = 'businessTaxId';
	g.title = 'tax id';
	Object.defineProperty(g, "subtitle", {
		get : function () {
			if (this.value != '') {
				if (this.value.length < 50) return this.value;
				else return this.value.substr(0,50)+'...';
			}	else return icap(tr('not set'));
		}
	});
	g.value = '';
	g.defaultValue = '';
	g.daisychain = true;
	g.clickFunc = v.locaddress.clickFunc;
v.gadgets.push(v.license = g = new vp.Gadget(v));
	g.type = 'button';
	g.key = 'businessLicenseNumber';
	g.title = 'license number';
	Object.defineProperty(g, "subtitle", {
		get : function () {
			if (this.value != '') {
				if (this.value.length < 50) return this.value;
				else return this.value.substr(0,50)+'...';
			}	else return icap(tr('not set'));
		}
	});
	g.value = '';
	g.defaultValue = '';
	g.daisychain = true;
	g.clickFunc = v.locaddress.clickFunc;
v.gadgets.push(v.licensevalidfrom = g = new vp.Gadget(v));
	g.type = 'button';
	g.key = 'businessLicenseValidFrom';
	g.title = 'valid from';
	Object.defineProperty(g, "subtitle", {
		get : function () {
			if (this.value != '') {
				if (this.value.length < 50) return this.value;
				else return this.value.substr(0,50)+'...';
			}	else return icap(tr('not set'));
		}
	});
	g.value = '';
	g.defaultValue = '';
	g.daisychain = true;
	g.clickFunc = v.locaddress.clickFunc;
v.gadgets.push(v.licensevalidtill = g = new vp.Gadget(v));
	g.type = 'button';
	g.key = 'businessLicenseValidTill';
	g.title = 'valid till';
	Object.defineProperty(g, "subtitle", {
		get : function () {
			if (this.value != '') {
				if (this.value.length < 50) return this.value;
				else return this.value.substr(0,50)+'...';
			}	else return icap(tr('not set'));
		}
	});
	g.value = '';
	g.defaultValue = '';
	g.daisychain = false;
	g.clickFunc = v.locaddress.clickFunc;
v.gadgets.push(v.cashreg = g = new vp.Gadget(v));
	g.type = 'button';
	g.key = 'cashReg';
	g.title = 'cash register number';
	Object.defineProperty(g, "subtitle", {
		get : function () {
			if (this.value != '') {
				if (this.value.length < 50) return this.value;
				else return this.value.substr(0,50)+'...';
			}	else return icap(tr('not set'));
		}
	});
	g.value = '';
	g.defaultValue = '';
	g.daisychain = true;
	g.clickFunc = v.locaddress.clickFunc;
v.gadgets.push(v.cashier = g = new vp.Gadget(v));
	g.type = 'button';
	g.key = 'cashier';
	g.title = 'cashier';
	Object.defineProperty(g, "subtitle", {
		get : function () {
			if (this.value != '') {
				if (this.value.length < 50) return this.value;
				else return this.value.substr(0,50)+'...';
			}	else return icap(tr('not set'));
		}
	});
	g.value = '';
	g.defaultValue = '';
	g.daisychain = false;
	g.clickFunc = v.locaddress.clickFunc;
v.load = function(cb) {
	const debuglog = false;
	const gads = [
		'locaddress', 'loccity', 'locstate', 'locpostalcode', 'telephone',
		'taxid', 'license', 'licensevalidfrom', 'licensevalidtill',
		'cashreg', 'cashier',
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
				g.value = g.tempValue;
			} { // For persistence.
			}
			delete g.tempValue;
			if (debuglog) console.log(`${g.key} ready`, g.value);
			g.loadComplete = true; icb(cb, v);
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
}

