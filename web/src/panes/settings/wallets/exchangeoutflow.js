// This depends on salesincome.js as the master template.

const exchangeoutflowwalletsettings = v = new vp.View(null);
v.name = Object.keys({exchangeoutflowwalletsettings}).pop();
v.title = 'wallets';
v.minX = 0; v.maxX = 0;
v.minY = 0; v.maxY = 0;
v.gadgets.push(v.swipeGad = new vp.SwipeGadget(v));
v.swipeGad.actionFlags = vp.GAF_SWIPEABLE_UPDOWN | vp.GAF_SCROLLABLE_UPDOWN;
v.swipeGad.hide = true;
Object.defineProperty(v, "wallet", {
	get : function () {
		const i = exchangeoutflowwalletsettings.typelist.index;
		if (i >= 0 && i < wallettypes.length) switch (wallettypes[i]) {
		case 'LNbits compatible': return new LNbitsWallet(); break;
		}
		return new Wallet();
	}
});
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

			if (wallettypes[index] == 'LNbits compatible') {
				delete v.lnbitsurl.hide
				delete v.lnbitskey.hide
			} else {
				v.lnbitsurl.hide = true
				v.lnbitskey.hide = true
			}
      v.lnbitsurl.enabled = !v.lnbitsurl.hide
      v.lnbitskey.enabled = !v.lnbitskey.hide

			if (wallettypes[index] == 'strike compatible') {
				delete v.strikeurl.hide
				delete v.strikekey.hide
			} else {
				v.strikeurl.hide = true
				v.strikekey.hide = true
			}
      v.strikeurl.enabled = !v.strikeurl.hide
      v.strikekey.enabled = !v.strikekey.hide

			if (wallettypes[index] == 'coinos compatible') {
				delete v.coinosurl.hide
				delete v.coinoskey.hide
			} else {
				v.coinosurl.hide = true
				v.coinoskey.hide = true
			}
      v.coinosurl.enabled = !v.coinosurl.hide
      v.coinoskey.enabled = !v.coinoskey.hide

			v.queueLayout();
		} { // For persistence.
      PlatformUtil.DatabasePut('settings', g.list[index], `${getCurrentAccount().id}-${g.key}`, (event) => {
				console.log(`successfully selected ${g.key}`, event)
			}, (event) => {
				console.log(`error selecting ${g.key}`, event)
			})
		}
	}
v.gadgets.push(v.lnbitsurl = g = new vp.Gadget(v))
	g.type = 'button'
	g.key = 'LNbitsURL'
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
    PlatformUtil.UserPrompt(tr('base URL')+':', g.defaultValue, val => {
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
	g.type = 'button'
	g.key = 'lnbitsKey'
	g.title = 'key'
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
    PlatformUtil.UserPrompt(tr('API admin or invoice/read key')+':', '', val => {
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
v.gadgets.push(v.strikeurl = g = new vp.Gadget(v))
	g.type = 'button'
	g.key = 'strikeURL'
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
	g.clickFunc = function() {
		const g = this
    PlatformUtil.UserPrompt(tr('base URL')+':', g.defaultValue, val => {
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
v.gadgets.push(v.strikekey = g = new vp.Gadget(v));
	g.type = 'button'
	g.key = 'strikeKey'
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
	g.clickFunc = function() {
		const g = this
    PlatformUtil.UserPrompt(tr('API bearer token')+':', '', val => {
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
v.gadgets.push(v.coinosurl = g = new vp.Gadget(v));
	g.type = 'button'
	g.key = 'coinosURL'
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
	g.clickFunc = function() {
		const g = this
    PlatformUtil.UserPrompt(tr('base URL')+':', g.defaultValue, val => {
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
v.gadgets.push(v.coinoskey = g = new vp.Gadget(v))
	g.type = 'button'
	g.key = 'coinosKey'
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
	g.clickFunc = function() {
		const g = this
		PlatformUtil.UserPrompt(tr('API auth token')+':', '', val => {
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
v.load = function(cb) {
	const debuglog = true
	{
		const g = this.typelist, v = this;
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
				exchangeoutflowwalletsettings.typelist.index = index
				exchangeoutflowwalletsettings.setRenderFlag(true)
			} { // For the app function.

				if (wallettypes[index] == 'LNbits compatible') {
					delete v.lnbitsurl.hide
					delete v.lnbitskey.hide
				} else {
					v.lnbitsurl.hide = true
					v.lnbitskey.hide = true
				}
        v.lnbitsurl.enabled = !v.lnbitsurl.hide
        v.lnbitskey.enabled = !v.lnbitskey.hide

				if (wallettypes[index] == 'strike compatible') {
					delete v.strikeurl.hide
					delete v.strikekey.hide
				} else {
					v.strikeurl.hide = true
					v.strikekey.hide = true
				}
        v.strikeurl.enabled = !v.strikeurl.hide
        v.strikekey.enabled = !v.strikekey.hide

				if (wallettypes[index] == 'coinos compatible') {
					delete v.coinosurl.hide
					delete v.coinoskey.hide
				} else {
					v.coinosurl.hide = true
					v.coinoskey.hide = true
				}
        v.coinosurl.enabled = !v.coinosurl.hide
        v.coinoskey.enabled = !v.coinoskey.hide

				v.queueLayout()
			} { // For persistence.
			}
			if (debuglog) console.log(`${g.key} ready`, g.tempValue)
			v.loadComplete = true; cb()
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
	for (const gad of [
		'lnbitsurl', 'lnbitskey',
		'strikeurl', 'strikekey',
		'coinosurl', 'coinoskey',
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
    PlatformUtil.DatabaseGet('settings', `${getCurrentAccount().id}-${g.key}`, (event) => {
			if (event.target.result !== undefined)
				g.tempValue = event.target.result
			if (debuglog) console.log(`${g.key} restored`, g.tempValue)
			finishInit(this, g)
		}, (event) => {
			console.log(`error getting ${g.key}`, event)
			finishInit(this, g)
		})
	}
}
