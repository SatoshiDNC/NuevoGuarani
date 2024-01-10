// This depends on salesincome.js as the master template.

const exchangeoutflowwalletsettings = v = new vp.View(null);
v.name = Object.keys({exchangeoutflowwalletsettings}).pop();
v.title = '(Ex)change outflow';
v.minX = 0; v.maxX = 0;
v.minY = 0; v.maxY = 0;
v.gadgets.push(v.swipeGad = new vp.SwipeGadget(v));
v.swipeGad.actionFlags = vp.GAF_SWIPEABLE_UPDOWN | vp.GAF_SCROLLABLE_UPDOWN;
v.swipeGad.hide = true;
Object.defineProperty(v, "wallet", {
	get : function () {
		const i = exchangeoutflowwalletsettings.typelist.index;
		if (i >= 0 && i < wallettypes.length) switch (wallettypes[i]) {
		case 'LNbits compatible': return new LNbitsWallet(exchangeoutflowwalletsettings); break;
		}
		return new BaseWallet(exchangeoutflowwalletsettings);
	}
});
v.gadgets.push(v.typelist = g = new vp.Gadget(v));
  g.name = 'typelist'
  g.key = 'walletTypeForExchangeOutflow';
	g.list = wallettypes;
  g.index = -1;
	g.listItemClick = salesincomewalletsettings.typelist.listItemClick
v.gadgets.push(v.lnbitsurl = g = new vp.Gadget(v))
  g.name = 'lnbitsurl'
  g.type = 'button'
	g.key = 'LNbitsURLForExchangeOutflow'
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
	g.defaultValue = 'https://lnbits.satoshidnc.com/withdraw/api/v1'
	g.hide = true
  g.enabled = !g.hide
	g.daisychain = true
	g.clickFunc = salesincomewalletsettings.lnbitsurl.clickFunc
v.gadgets.push(v.lnbitskey = g = new vp.Gadget(v));
  g.name = 'lnbitskey'
  g.type = 'button'
	g.key = 'lnbitsKeyForExchangeOutflow'
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
	g.clickFunc = salesincomewalletsettings.lnbitskey.clickFunc
v.gadgets.push(v.strikeurl = g = new vp.Gadget(v))
  g.name = 'strikeurl'
  g.type = 'button'
	g.key = 'strikeURLForExchangeOutflow'
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
	g.clickFunc = salesincomewalletsettings.lnbitsurl.clickFunc
v.gadgets.push(v.strikekey = g = new vp.Gadget(v));
  g.name = 'strikekey'
  g.type = 'button'
	g.key = 'strikeKeyForExchangeOutflow'
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
	g.clickFunc = salesincomewalletsettings.lnbitskey.clickFunc
v.gadgets.push(v.coinosurl = g = new vp.Gadget(v));
  g.name = 'coinosurl'
  g.type = 'button'
	g.key = 'coinosURLForExchangeOutflow'
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
	g.clickFunc = salesincomewalletsettings.lnbitsurl.clickFunc
v.gadgets.push(v.coinoskey = g = new vp.Gadget(v))
  g.name = 'coinoskey'
  g.type = 'button'
	g.key = 'coinosKeyForExchangeOutflow'
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
	g.clickFunc = salesincomewalletsettings.lnbitskey.clickFunc
v.load = salesincomewalletsettings.load
