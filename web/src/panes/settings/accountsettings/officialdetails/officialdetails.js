v = officialdetails
v.name = Object.keys({officialdetails}).pop();
v.title = 'details';
v.minX = 0; v.maxX = 0;
v.minY = 0; v.maxY = 0;
v.gadgets.push(v.swipeGad = new vp.SwipeGadget(v));
v.swipeGad.actionFlags = vp.GAF_SWIPEABLE_UPDOWN | vp.GAF_SCROLLABLE_UPDOWN;
v.swipeGad.hide = true;
v.gadgets.push(v.busname = g = new vp.Gadget(v));
	g.type = 'button';
	g.key = 'busName';
	g.title = 'business name';
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
		const g = this
    PlatformUtil.UserPrompt(icap(tr(g.title))+':', '', val => {
      if (!val) return
      { // For the GUI.
        g.viewport.queueLayout()
      } { // For the app function.
        g.value = val.trim()
      } { // For persistence.
        PlatformUtil.DatabasePut('settings', g.value, `${getCurrentAccount().id}-${g.key}`, (event) => {
          console.log(`successfully selected ${g.key}`, event)
        }, (event) => {
          console.log(`error selecting ${g.key}`, event)
        })
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
	g.clickFunc = v.busname.clickFunc;
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
	g.clickFunc = v.busname.clickFunc;
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
	g.clickFunc = v.busname.clickFunc;
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
	g.clickFunc = v.busname.clickFunc;
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
	g.clickFunc = v.busname.clickFunc;
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
	g.clickFunc = v.busname.clickFunc;
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
	g.clickFunc = v.busname.clickFunc;
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
	g.clickFunc = v.busname.clickFunc;
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
	g.clickFunc = v.busname.clickFunc;
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
	g.clickFunc = v.busname.clickFunc;
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
	g.clickFunc = v.busname.clickFunc;
v.load = function(cb) {
	const debuglog = true
	const gads = [
		'busname', 'locaddress', 'loccity', 'locstate', 'locpostalcode', 'telephone',
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
		}
    if (allComplete) {
      v.loadComplete = true; cb();
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
}

