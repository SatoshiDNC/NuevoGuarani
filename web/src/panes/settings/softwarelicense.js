const readfulllicensetext = v = new vp.View(null)
v.name = Object.keys({readfulllicensetext}).pop()
v.title = 'software license'
v.minX = 0; v.maxX = 0
v.minY = 0; v.maxY = 0
v.gadgets.push(v.swipeGad = new vp.SwipeGadget(v))
v.swipeGad.actionFlags = vp.GAF_SWIPEABLE_UPDOWN | vp.GAF_SCROLLABLE_UPDOWN
v.swipeGad.hide = true
v.gadgets.push(v.license = g = new vp.Gadget(v))
  g.description = 'lic:#'

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
  v.ask.hide = true
  v.amount.hide = true
  v.key.hide = true
  v.how.hide = true
  v.list.hide = true
  v.listnote.hide = true
  v.lnaddr.hide = true
  v.confirmamount.hide = true
  v.paynow.hide = true
  delete v.spinner.hide

  // query the license api to get the current parameters
  const asyncLogic = async () => {
    let json = '';
    console.log('checking the latest user count and funding');
    const response = await fetch(`https://${config.debugBuild?'dev-':''}ng.satoshidnc.com/api/v1/license?id=kdfjhgkgfhjkdjghkdjfgh`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        //'X-API-KEY': wallet.key,
      },
    });
    json = await response.json(); //extract JSON from the http response

    setTimeout(() => {
      console.log('json', Convert.JSONToString(json))
      console.log('timecalc', timecalc)

      PlatformUtil.DatabaseGet('state', 'totalWagesPaid', e => {
        const totalWagesPaid = e.target.result || 0
        console.log('totalWagesPaid', totalWagesPaid)

        // calculate amount due
        let totalCost = timecalc.reduce((acc, val) => {
          console.log("reducing", acc, val)
          return acc + val.pay_asked
        }, 0)
        console.log('totalCost', totalCost)
        let amountDue = (totalCost - json.paid) / Math.max(1, json.uniques) - totalWagesPaid
        console.log('amountDue', amountDue)

        v.amount.description = `x2>b>c>${billpane.formatMoney(amountDue, '₿')} \n c>satoshis`
        delete v.amount.hide
        v.key.description = tr(v.key.template + (timecalc.length==1?'1':'')).replace('@', timecalc.length).replace('@', json.uniques)
        delete v.key.hide
        delete v.how.hide

        // delete v.explain.hide
        delete v.list.hide
        delete v.listnote.hide
        v.spinner.hide = true
        v.list.appFunction()
        v.queueLayout()
      })
    },1000)
  }
  asyncLogic()

}
// v.gadgets.push(v.desc = g = new vp.Gadget(v))
//   g.description = 'desc:'+v.title
v.gadgets.push(g = new vp.Gadget(v))
	g.title = 'Satoshi Fairware License'
	g.subtitle = ['read the full license text']
	g.pane = readfulllicensetext
v.gadgets.push(v.ask = g = new vp.Gadget(v))
  g.description = 'desc:'+v.title+':ask'
v.gadgets.push(v.amount = g = new vp.Gadget(v))
  g.hide = true
  g.description = 'x2>b>c>123,456 \n c>satoshis'
v.gadgets.push(v.key = g = new vp.Gadget(v))
  g.hide = true
  g.template = 'desc:'+v.title+':key'
  g.description = 'desc:'+v.title+':key'
v.gadgets.push(v.how = g = new vp.Gadget(v))
  g.hide = true
  g.description = 'desc:'+v.title+':how'
v.gadgets.push(v.list = g = new vp.Gadget(v))
  g.name = 'list'
  g.hide = true
  g.key = 'howToPayTheDevelopers'
  g.state = 0
  g.list = ['invest', 'make a grant', 'donate']
  g.index = -1;
	Object.defineProperty(g, "value", {
		get : function () {
			if (this.index >= 0 && this.index < this.list.length)
				return this.list[this.index]
			return ''
		}
	})
	g.appFunction = function() {
    const g = this, v = g.viewport
    if (v.list.list[v.list.index] == 'invest') {
      delete v.lnaddr.hide
    } else {
      v.lnaddr.hide = true
    }
    delete v.confirmamount.hide
    delete v.paynow.hide
    v.lnaddr.enabled = !v.lnaddr.hide
    v.confirmamount.enabled = !v.confirmamount.hide
    v.paynow.enabled = !v.paynow.hide
    v.queueLayout()
	}
	g.listItemClick = function(index) {
		const g = this
		{ // For the GUI.
			g.index = index; v.queueLayout()
		} { // For the app function.
			g.appFunction()
		} { // For persistence.
      PlatformUtil.DatabasePut('settings', g.value, `${getCurrentAccount().id}-${g.key}`, (event) => {
				console.log(`successfully selected ${g.key}`, event)
			}, (event) => {
				console.log(`error selecting ${g.key}`, event)
			})
		}
	}
v.gadgets.push(v.listnote = g = new vp.Gadget(v))
  g.name = 'listnote'
  g.hide = true
  Object.defineProperty(g, 'description', { get : function () {
    const g = this, v = g.viewport
    return 'desc:'+v.title+':'+v.list.list[v.list.index]+':#'
  }})
v.gadgets.push(v.lnaddr = g = new vp.Gadget(v));
  g.name = 'lnaddr'
  g.type = 'button'
	g.key = 'lnAddrForFairShareRebates'
	g.title = 'lightning address'
	Object.defineProperty(g, "subtitle", {
		get : function () {
			if (this.value) {
				var temp = this.value
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
		PlatformUtil.UserPrompt(tr(g.title)+':', g.value, val => {
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
v.gadgets.push(v.confirmamount = g = new vp.Gadget(v));
  g.name = 'confirmamount'
  g.type = 'button'
	g.title = 'amount'
	Object.defineProperty(g, "subtitle", {
		get : function () {
			if (this.value) {
				var temp = this.value
				if (temp == '') return 'not set'
				else return ''+temp
      }
		}
	})
	g.value = ''
	g.hide = true
  g.enabled = !g.hide
	g.clickFunc = function() {
		const g = this
		PlatformUtil.UserPrompt(tr(g.title)+':', g.value, val => {
      if (!val) return
      g.value = val
      g.viewport.queueLayout()
    })
	}
v.gadgets.push(v.paynow = g = new vp.Gadget(v));
  g.hide = true
  g.enabled = !g.hide
  g.color = [0,1,0,1]
	g.title = 'pay now'
	g.button = true
	g.clickFunc = function() {
		const g = this
	}
v.gadgets.push(v.spinner = g = new vp.Gadget(v))
  g.description = 'spinner'
  g.busyCounter = 0
  g.layoutFunc = function() {
    const g = this
    g.h = 25
    g.autoHull()
  }
  g.renderFunc = function() {
    const g = this, v = g.viewport
		this.busyCounter += 0.01; if (this.busyCounter > Math.PI/2) this.busyCounter -= Math.PI/2
    const m = mat4.create();
		mat4.identity(m)
		mat4.translate(m,m,[g.x+g.w/2,g.y+g.h/2,0])
		mat4.scale(m,m,[g.h/25,g.h/25,1]);
		mat4.rotate(m,m, this.busyCounter, [0,0,1])
		iconFont.draw(-10,7,"\x0A",config.themeColors.uiText,v.mat, m)    
    v.setRenderFlag(true)
  }
v.load = function(cb) {
	const debuglog = true
	const gads = [
		'list', 'lnaddr'
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
    if (!['list'].includes(gad.name)) continue
		const g = gad, v = this;
		g.tempValue = '';
		function finishInit(cb, v) {
			const g = v.list;
			var index = -1;
			for (var i=0; i<g.list.length; i++) {
				if (g.list[i] == g.tempValue) {
					index = i;
					break;
				}
			}
			if (index < 0) index = 0
			{ // For the GUI.
				v.list.index = index
				v.setRenderFlag(true)
			} { // For the app function.
        v.list.appFunction()
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
      'lnaddr',
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

