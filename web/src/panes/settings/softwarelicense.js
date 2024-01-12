const softwarelicensesettings = v = new vp.View(null)
v.name = Object.keys({softwarelicensesettings}).pop()
v.title = 'software license'
v.minX = 0; v.maxX = 0
v.minY = 0; v.maxY = 0
v.gadgets.push(v.swipeGad = new vp.SwipeGadget(v))
v.swipeGad.actionFlags = vp.GAF_SWIPEABLE_UPDOWN | vp.GAF_SCROLLABLE_UPDOWN
v.swipeGad.hide = true
v.pageFocusFunc = function() {
  const v = this
  v.amount.hide = true
  v.explain.hide = true
  v.donate.hide = true
  delete v.spinner.hide

  // query the license api to get the current parameters
  const asyncLogic = async () => {
    let json = '';
    console.log('checking the latest user count and funding');
    const response = await fetch('https://dev-ng.satoshidnc.com/api/v1/license?id=kdfjhgkgfhjkdjghkdjfgh', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        //'X-API-KEY': wallet.key,
      },
    });
    json = await response.json(); //extract JSON from the http response

    setTimeout(() => {
      console.log('json', Convert.JSONToString(json))
      v.spinner.hide = true
      v.queueLayout()
  
    },1000)
  }
  asyncLogic()

}
v.gadgets.push(v.desc = g = new vp.Gadget(v))
  g.description = 'desc:'+v.title
v.gadgets.push(v.ask = g = new vp.Gadget(v))
  g.description = 'desc:'+v.title+':ask'
v.gadgets.push(v.amount = g = new vp.Gadget(v))
  g.hide = true
  g.description = 'x2>b>c>123,456 \n c>satoshis'
v.gadgets.push(v.explain = g = new vp.Gadget(v))
  g.hide = true
  g.description = 'desc:'+v.title+':explain'
v.gadgets.push(v.donate = g = new vp.Gadget(v))
  g.hide = true
  //g.icon = "\x03"
	g.color = [1,0.8,0.8,1]
	g.title = 'make a one-time payment'
	g.button = true
	g.clickFunc = function() {
		const g = this
	}
v.gadgets.push(v.spinner = g = new vp.Gadget(v))
  g.description = 'spinner'
  g.renderFunc = function() {
    const g = this, v = g.viewport
    console.log('render', this.busyCounter)

		this.busyCounter += 0.01; if (this.busyCounter > Math.PI/2) this.busyCounter -= Math.PI/2
    const m = mat4.create();
		mat4.identity(m)
		mat4.translate(m,m,[g.x+g.w/2,-g.y+g.h/2,0])
		//mat4.scale(m,m,[w,w,1]);
		mat4.rotate(m,m, this.busyCounter, [0,0,1])
		iconFont.draw(-10,7,"\x0A",config.themeColors.uiText,v.mat, m)
    
    v.setRenderFlag(true)
  }
v.gadgets.push(v.license = g = new vp.Gadget(v))
  g.description = 'lic:#'
v.load = function(cb) {
	const debuglog = true
	const gads = [
		// 'typelist',
		// 'lnbitsurl', 'lnbitskey',
		// 'strikeurl', 'strikekey',
		// 'coinosurl', 'coinoskey',
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
  icb(cb, this)
  return
	for (const gad of this.gadgets) {
    if (!['typelist'].includes(gad.name)) continue
		const g = gad, v = this;
		g.tempValue = '';
		function finishInit(cb, v) {
			const g = v.typelist;
			var index = -1;
			for (var i=0; i<v.wallettypes.length; i++) {
				if (v.wallettypes[i] == g.tempValue) {
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
      // 'lnbitsurl', 'lnbitskey',
      // 'strikeurl', 'strikekey',
      // 'coinosurl', 'coinoskey',
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

