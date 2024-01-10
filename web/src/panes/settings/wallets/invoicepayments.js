// This depends on salesincome.js as the master template.

const invoicepaymentswalletsettings = v = new vp.View(null);
v.name = Object.keys({invoicepaymentswalletsettings}).pop();
v.title = 'wallets';
v.minX = 0; v.maxX = 0;
v.minY = 0; v.maxY = 0;
v.gadgets.push(v.swipeGad = new vp.SwipeGadget(v));
v.swipeGad.actionFlags = vp.GAF_SWIPEABLE_UPDOWN | vp.GAF_SCROLLABLE_UPDOWN;
v.swipeGad.hide = true;
Object.defineProperty(v, "wallet", {
	get : function () {
		const i = invoicepaymentswalletsettings.typelist.index;
		if (i >= 0 && i < wallettypes.length) switch (wallettypes[i]) {
		case 'LNbits compatible': return new LNbitsWallet(); break;
		}
		return new Wallet();
	}
});
v.gadgets.push(v.typelist = g = new vp.Gadget(v));
	g.key = 'walletTypeForInvoicePayments';
	g.list = wallettypes;
  g.index = -1;
	g.listItemClick = salesincomewalletsettings.typelist.listItemClick
v.gadgets.push(v.lnbitsurl = g = new vp.Gadget(v))
	g.type = 'button'
	g.key = 'LNbitsURLForInvoicePayments'
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
	g.clickFunc = salesincomewalletsettings.lnbitsurl.clickFunc
v.gadgets.push(v.lnbitskey = g = new vp.Gadget(v));
	g.type = 'button'
	g.key = 'lnbitsKeyForInvoicePayments'
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
	g.type = 'button'
	g.key = 'strikeURLForInvoicePayments'
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
	g.type = 'button'
	g.key = 'strikeKeyForInvoicePayments'
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
	g.type = 'button'
	g.key = 'coinosURLForInvoicePayments'
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
	g.type = 'button'
	g.key = 'coinosKeyForInvoicePayments'
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
