// This depends on salesincome.js as the master template.

const exchangeoutflowwalletsettings = v = new vp.View(null);
v.name = Object.keys({exchangeoutflowwalletsettings}).pop();
v.title = '(Ex)change outflow';
v.wallettypes = ['manual', 'LNbits LNURLw compatible']
v.minX = 0; v.maxX = 0;
v.minY = 0; v.maxY = 0;
v.gadgets.push(v.swipeGad = new vp.SwipeGadget(v));
v.swipeGad.actionFlags = vp.GAF_SWIPEABLE_UPDOWN | vp.GAF_SCROLLABLE_UPDOWN;
v.swipeGad.hide = true;
Object.defineProperty(v, "wallet", {
	get : function () {
    const v = exchangeoutflowwalletsettings
		const i = v.typelist.index
		if (i >= 0 && i < v.wallettypes.length) switch (v.wallettypes[i]) {
		case 'LNbits LNURLw compatible': return new LNbitsWallet(v); break
		}
		return new BaseWallet(v)
	}
})
v.gadgets.push(v.desc = g = new vp.Gadget(v))
  g.description = 'desc:'+v.title
v.gadgets.push(v.typelist = g = new vp.Gadget(v));
  g.name = 'typelist'
  g.key = '@-walletTypeForExchangeOutflow';
	g.list = v.wallettypes;
  g.index = -1;
  g.appFunction = salesincomewalletsettings.typelist.appFunction
	g.listItemClick = salesincomewalletsettings.typelist.listItemClick
v.gadgets.push(v.lnbitsurl = g = new vp.Gadget(v))
  g.name = 'lnbitsurl'
  g.type = 'button'
	g.key = '@-LNbitsURLForExchangeOutflow'
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
	g.key = '@-lnbitsKeyForExchangeOutflow'
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
v.gadgets.push(v.lnbitsnote = g = new vp.Gadget(v))
  g.name = 'lnbitsnote'
  Object.defineProperty(g, 'description', { get : function () {
    const v = this.viewport
    return 'desc:'+v.title+':'+v.wallettypes[v.typelist.index]
  }})
v.load = salesincomewalletsettings.load
