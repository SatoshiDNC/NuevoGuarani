const walletsettings = v = new vp.View(null)
v.name = Object.keys({walletsettings}).pop()
v.title = 'wallets'
v.minX = 0; v.maxX = 0
v.minY = 0; v.maxY = 0
v.gadgets.push(v.swipeGad = new vp.SwipeGadget(v))
v.swipeGad.actionFlags = vp.GAF_SWIPEABLE_UPDOWN | vp.GAF_SCROLLABLE_UPDOWN
v.swipeGad.hide = true
v.gadgets.push(v.salesincome = g = new vp.Gadget(v))
	g.title = 'sales income'
	Object.defineProperty(g, "subtitle", {
		get : function () { try { return salesincomewalletsettings.list.value; } catch (e) {} }
	})
	g.pane = salesincomewalletsettings
v.gadgets.push(v.exchangeoutflow = g = new vp.Gadget(v))
	g.title = '(Ex)change outflow'
	Object.defineProperty(g, "subtitle", {
		get : function () { try { return exchangeoutflowwalletsettings.list.value; } catch (e) {} }
	})
	g.pane = exchangeoutflowwalletsettings
v.gadgets.push(v.invoicepayments = g = new vp.Gadget(v))
	g.title = 'invoice payments'
	Object.defineProperty(g, "subtitle", {
		get : function () { try { return invoicepaymentswalletsettings.list.value; } catch (e) {} }
	})
	g.pane = invoicepaymentswalletsettings
v.load = function(cb) {
  const v = this
  const debuglog = true
  const gads = []
  v.loadComplete = true; cb()
  return

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
        g.state = g.tempValue;
        if (g.appFunction) g.appFunction();
      } { // For persistence.
      }
      delete g.tempValue;
      if (debuglog) console.log(`${g.key} ready`, g.state);
      g.loadComplete = true; icb(cb, v);
    }
    if (debuglog) console.log("requesting", `${getCurrentAccount().id}-${g.key}`)
    PlatformUtil.DatabaseGet('settings', `${getCurrentAccount().id}-${g.key}`, (event) => {
      if (event.target.result !== undefined) {
        g.tempValue = event.target.result
        if (debuglog) console.log(`${g.key} restored`, g.tempValue)
      } else {
        if (debuglog) console.log(`${g.key} not used`, event.target.result)
      }
      finishInit(cb, this, g)
    }, (event) => {
      console.log(`error getting ${g.key}`, event)
      finishInit(cb, this, g)
    })
  }
}
  