var wallettypes = ['manual', 'LNbits compatible']; //, 'strike compatible', 'coinos compatible'];

const salesincomewalletsettings = v = new vp.View(null);
v.name = Object.keys({salesincomewalletsettings}).pop();
v.title = 'sales income';
v.minX = 0; v.maxX = 0;
v.minY = 0; v.maxY = 0;
v.gadgets.push(v.swipeGad = new vp.SwipeGadget(v));
v.swipeGad.actionFlags = vp.GAF_SWIPEABLE_UPDOWN | vp.GAF_SCROLLABLE_UPDOWN;
v.swipeGad.hide = true;
Object.defineProperty(v, "wallet", {
	get : function () {
		const i = salesincomewalletsettings.typelist.index;
		if (i >= 0 && i < wallettypes.length) switch (wallettypes[i]) {
		case 'LNbits compatible': return new LNbitsWallet(salesincomewalletsettings); break;
		}
		return new BaseWallet(salesincomewalletsettings);
	}
});
v.gadgets.push(v.desc = g = new vp.Gadget(v))
  g.description = 'desc:'+v.title
v.gadgets.push(v.typelist = g = new vp.Gadget(v))
  g.name = 'typelist'
	g.key = 'walletTypeForSalesIncome'
	g.list = wallettypes
  g.index = -1
  g.appFunction = function() {
    const g = this, v = g.viewport

    if (wallettypes[g.index] == 'LNbits compatible') {
      delete v.lnbitsurl.hide
      delete v.lnbitskey.hide
      delete v.lnbitsnote.hide
    } else {
      v.lnbitsurl.hide = true
      v.lnbitskey.hide = true
      v.lnbitsnote.hide = true
}
    v.lnbitsurl.enabled = !v.lnbitsurl.hide
    v.lnbitskey.enabled = !v.lnbitskey.hide

    if (wallettypes[g.index] == 'strike compatible') {
      delete v.strikeurl.hide
      delete v.strikekey.hide
    } else {
      v.strikeurl.hide = true
      v.strikekey.hide = true
    }
    v.strikeurl.enabled = !v.strikeurl.hide
    v.strikekey.enabled = !v.strikekey.hide

    if (wallettypes[g.index] == 'coinos compatible') {
      delete v.coinosurl.hide
      delete v.coinoskey.hide
    } else {
      v.coinosurl.hide = true
      v.coinoskey.hide = true
    }
    v.coinosurl.enabled = !v.coinosurl.hide
    v.coinoskey.enabled = !v.coinoskey.hide

    v.queueLayout()
}
	g.listItemClick = function(index) {
		const g = this, v = g.viewport;
		{ // For the GUI.
			v.typelist.index = index;
			v.setRenderFlag(true);
		} { // For the app function.
      v.typelist.appFunction()
		} { // For persistence.
      PlatformUtil.DatabasePut('settings', g.list[index], `${getCurrentAccount().id}-${g.key}`, (event) => {
				console.log(`successfully selected ${g.key}`, event)
			}, (event) => {
				console.log(`error selecting ${g.key}`, event)
			})
		}
	}
v.gadgets.push(v.lnbitsurl = g = new vp.Gadget(v))
  g.name = 'lnbitsurl'
	g.type = 'button'
	g.key = 'LNbitsURLForSalesIncome'
	g.title = 'base URL'
	Object.defineProperty(g, "subtitle", {
		get : function () {
			if (this.value) {
				if (this.value.length < 50) return ' '+this.value
				else return ' '+this.value.substr(0,50)+'...'
			}	else return 'not set'
		}
	})
	g.value = ''
	g.defaultValue = 'https://lnbits.satoshidnc.com/api/v1'
	g.hide = true
  g.enabled = !g.hide
	g.daisychain = true
	g.clickFunc = function() {
		const g = this
    PlatformUtil.UserPrompt(tr(g.title)+':', g.defaultValue, val => {
      if (!val) return
      { // For the GUI.
        g.viewport.queueLayout()
      } { // For the app function.
        g.value = val
      } { // For persistence.
        PlatformUtil.DatabasePut('settings', g.value, `${getCurrentAccount().id}-${g.key}`, (event) => {
          console.log(`successfully selected ${g.key}`, event)
        }, (event) => {
          console.log(`error selecting ${g.key}`, event)
        })
      }
    })
	}
v.gadgets.push(v.lnbitskey = g = new vp.Gadget(v));
  g.name = 'lnbitskey'
  g.type = 'button'
	g.key = 'lnbitsKeyForSalesIncome'
	g.title = 'API admin or invoice/read key'
	Object.defineProperty(g, "subtitle", {
		get : function () {
			if (this.value) {
				var temp;
				if (this.value.length > 4) temp = this.value.substr(0,4)+'*'.repeat(this.value.length-4); else temp = this.value
				if (temp.length < 50) return ' '+temp
				else return ' '+temp.substr(0,50)+'...'
			}	else return 'not set'
		}
	});
	g.value = ''
	g.hide = true
  g.enabled = !g.hide
	g.clickFunc = function() {
		const g = this
		PlatformUtil.UserPrompt(tr(g.title)+':', '', val => {
      if (!val) return
      { // For the GUI.
        g.viewport.queueLayout()
      } { // For the app function.
        g.value = val
      } { // For persistence.
        PlatformUtil.DatabasePut('settings', g.value, `${getCurrentAccount().id}-${g.key}`, (event) => {
          console.log(`successfully selected ${g.key}`, event)
        }, (event) => {
          console.log(`error selecting ${g.key}`, event)
        })
      }
    })
	}
v.gadgets.push(v.lnbitsnote = g = new vp.Gadget(v))
  g.name = 'lnbitsnote'
  Object.defineProperty(g, 'description', {
		get : function () { return 'desc:'+v.title+':'+wallettypes[salesincomewalletsettings.typelist.index] }
	});
v.gadgets.push(v.strikeurl = g = new vp.Gadget(v))
  g.name = 'strikeurl'
  g.type = 'button'
	g.key = 'strikeURLForSalesIncome'
	g.title = 'base URL'
	Object.defineProperty(g, "subtitle", {
		get : function () {
			if (this.value) {
				if (this.value.length < 50) return ' '+this.value
				else return ' '+this.value.substr(0,50)+'...'
			}	else return 'not set'
		}
	});
	g.value = ''
	g.defaultValue = 'https://api.strike.me/v1'
	g.hide = true
  g.enabled = !g.hide
	g.daisychain = true
	g.clickFunc = v.lnbitsurl.clickFunc
v.gadgets.push(v.strikekey = g = new vp.Gadget(v));
  g.name = 'strikekey'
  g.type = 'button'
	g.key = 'strikeKeyForSalesIncome'
	g.title = 'API bearer token'
	Object.defineProperty(g, "subtitle", {
		get : function () {
			if (this.value) {
				var temp
				if (this.value.length > 4) temp = this.value.substr(0,4)+'*'.repeat(this.value.length-4); else temp = this.value
				if (temp.length < 50) return ' '+temp
				else return ' '+temp.substr(0,50)+'...'
			}	else return 'not set'
		}
	});
	g.value = ''
	g.hide = true
  g.enabled = !g.hide
	g.clickFunc = v.lnbitskey.clickFunc
v.gadgets.push(v.coinosurl = g = new vp.Gadget(v));
  g.name = 'coinosurl'
	g.type = 'button'
	g.key = 'coinosURLForSalesIncome'
	g.title = 'base URL'
	Object.defineProperty(g, "subtitle", {
		get : function () {
			if (this.value) {
				if (this.value.length < 50) return ' '+this.value
				else return ' '+this.value.substr(0,50)+'...'
			}	else return 'not set'
		}
	});
	g.value = ''
	g.defaultValue = 'https://coinos.io/api'
	g.hide = true
  g.enabled = !g.hide
	g.daisychain = true
	g.clickFunc = v.lnbitsurl.clickFunc
v.gadgets.push(v.coinoskey = g = new vp.Gadget(v))
  g.name = 'coinoskey'
  g.type = 'button'
	g.key = 'coinosKeyForSalesIncome'
	g.title = 'API auth token'
	Object.defineProperty(g, "subtitle", {
		get : function () {
			if (this.value) {
				var temp
				if (this.value.length > 4) temp = this.value.substr(0,4)+'*'.repeat(this.value.length-4); else temp = this.value
				if (temp.length < 50) return ' '+temp
				else return ' '+temp.substr(0,50)+'...'
			}	else return 'not set'
		}
	})
	g.value = ''
	g.hide = true
  g.enabled = !g.hide
	g.clickFunc = v.lnbitskey.clickFunc
v.load = function(cb) {
	const debuglog = true
	const gads = [
		'typelist',
		'lnbitsurl', 'lnbitskey',
		'strikeurl', 'strikekey',
		'coinosurl', 'coinoskey',
	]
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
	for (const gad of this.gadgets) {
    if (!['typelist'].includes(gad.name)) continue
		const g = gad, v = this;
		g.tempValue = '';
		function finishInit(cb, v) {
			const g = v.typelist;
			var index = -1;
			for (var i=0; i<wallettypes.length; i++) {
				if (wallettypes[i] == g.tempValue) {
					index = i;
					break;
				}
			}
			if (index < 0) index = 0
			{ // For the GUI.
				v.typelist.index = index
				v.setRenderFlag(true)
			} { // For the app function.
        v.typelist.appFunction()
			} { // For persistence.
			}
			if (debuglog) console.log(`${g.key} ready`, g.tempValue)
			g.loadComplete = true; icb(cb, v);
		}
		if (debuglog) console.log("requesting", `${getCurrentAccount().id}-${g.key}`)
    PlatformUtil.DatabaseGet('settings', `${getCurrentAccount().id}-${g.key}`, (event) => {
			g.tempValue = event.target.result
			if (debuglog) console.log(`${g.key} restored`, g.tempValue)
			finishInit(cb, this)
		}, (event) => {
			console.log(`error getting ${g.key}`, event)
			finishInit(cb, this)
		})
	}
	for (const gad of this.gadgets) {
    if (![
      'lnbitsurl', 'lnbitskey',
      'strikeurl', 'strikekey',
      'coinosurl', 'coinoskey',
    ].includes(gad.name)) continue
		const g = gad
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

