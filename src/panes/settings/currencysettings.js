const currencysettings = v = new vp.View(null);
v.name = Object.keys({currencysettings}).pop();
v.title = 'currencies';
v.gadgets.push(g = new vp.Gadget(v));
	g.title = 'enabled currencies';
	g.subtitle = supportedCurrencies;
	g.pane = enabledcurrencies;
v.gadgets.push(v.enabledpaymentmethods = g = new vp.Gadget(v));
	g.title = 'enabled payment methods';
	g.subtitle = enabledPaymentMethods;
	g.pane = enabledpaymentmethods;
v.gadgets.push(v.defaultvendorcurrency = g = new vp.Gadget(v));
	g.title = 'default vendor currency';
	Object.defineProperty(g, "subtitle", {
		get : function () { try { return enabledcurrencies.list.selection; } catch (e) {} }
	});
	g.pane = defaultvendorcurrency;
