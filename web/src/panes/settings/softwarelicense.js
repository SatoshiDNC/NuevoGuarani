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
  g.static = true

const softwarelicensesettings = v = new vp.View(null)
v.name = Object.keys({softwarelicensesettings}).pop()
v.title = 'software license'
v.minX = 0; v.maxX = 0
v.minY = 0; v.maxY = 0
v.gadgets.push(v.swipeGad = new vp.SwipeGadget(v))
v.swipeGad.actionFlags = vp.GAF_SWIPEABLE_UPDOWN | vp.GAF_SCROLLABLE_UPDOWN
v.swipeGad.hide = true
v.busyQueryingFAD = false
v.pageFocusFunc = function() {
  const v = this

  if (v.amount.hide && !v.busyQueryingFAD) {
    v.setBusy()
  } else {
    if (!v.busySignal) {
      v.errorSignal = false
      v.clearBusy()
    }
  }

  // query the license api to get the current parameters
  const asyncLogic = async () => {
    let json = ''
    console.log('checking the latest user count and funding')
    try {
      const response = await fetch(`https://${config.debugBuild?'dev-':''}ng.satoshidnc.com/api/v1/license?id=kdfjhgkgfhjkdjghkdjfgh`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          //'X-API-KEY': wallet.key,
        },
      });
      json = await response.json()
    } catch {
    }

    setTimeout(() => {
      console.log('json', Convert.JSONToString(json))
      console.log('timecalc', timecalc)

      if (!json) {
        v.errorSignal = true
        v.busyQueryingFAD = false
        return
      }

      PlatformUtil.DatabaseGet('state', 'totalWagesPaid', e => {
        const totalWagesPaid = e.target.result || 0
        console.log('totalWagesPaid', totalWagesPaid)

        // calculate amount due
        let totalCost = timecalc.data.reduce((acc, val) => {
          console.log("reducing", acc, val)
          return acc + val.pay_asked
        }, 0)
        console.log('totalCost', totalCost)
        let amountDue = (totalCost - json.paid) / Math.max(1, json.uniques) - totalWagesPaid
        console.log('amountDue', amountDue)

        // update GUI
        v.busyQueryingFAD = false
        v.amount.value = +amountDue
        v.amount.description = `x2>b>c>${billpane.formatMoney(amountDue, '₿')} \n c>satoshis`
        v.confirmamount.value = ''+amountDue
        v.key.description = tr(v.key.template + (timecalc.data.length==1?'1':'')).replace('@', timecalc.data.length).replace('@', json.uniques)
        if (v.amount.hide) {
          delete v.amount.hide
          delete v.key.hide
          delete v.how.hide
          delete v.list.hide; v.list.enabled = !v.list.hide
          delete v.listnote.hide
          v.busySignal = false
        }
        v.list.appFunction()
        v.queueLayout()
      })
    },1000)
  }
  if (!v.busyQueryingFAD) {
    asyncLogic()
    v.busyQueryingFAD = true
  }
}
v.setBusy = function() {
  const v = this
  console.log('spinner', v.spinner.y, '+', v.spinner.h, '-', v.userY, '<=', v.sh)
  if (v.spinner.y + v.spinner.h - v.userY <= v.sh) v.locktobottom = true
  console.log(v.locktobottom)
  v.busySignal = true
  v.list.enabled = false
  v.lnaddr.enabled = false
  v.confirmamount.enabled = false
  v.paynow.enabled = false
  v.queueLayout()
}
v.clearBusy = function() {
  const v = this
  v.busySignal = false
  v.list.enabled = !v.list.hide
  v.lnaddr.enabled = !v.lnaddr.hide
  v.confirmamount.enabled = !v.confirmamount.hide
  v.paynow.enabled = !v.paynow.hide
  v.queueLayout()
}
v.clearStatus = function() {
  const v = this
  v.busySignal = false
  v.errorSignal = false
  v.successSignal = false
  v.payresult.hide = true
  v.payresult.description = ''
  v.queueLayout()
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
  g.enabled = !g.hide
  g.key = 'howToPayTheDevelopers'
  g.state = 0
  g.list = ['invest', 'grant', 'donate']
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
    if (v.busyQueryingFAD) return
    if (!v.amount.value) return
    if (v.list.list[v.list.index] == 'invest') {
      delete v.lnaddr.hide
      v.confirmamount.value = Math.max(+v.confirmamount.value, +v.amount.value)
    } else {
      v.lnaddr.hide = true
    }
    v.lnaddr.enabled = !v.lnaddr.hide
    delete v.confirmamount.hide; v.confirmamount.enabled = !v.confirmamount.hide
    delete v.paynow.hide; v.paynow.enabled = !v.paynow.hide
    delete v.appdevelopment.hide; v.appdevelopment.enabled = !v.appdevelopment.hide
    v.queueLayout()
	}
	g.listItemClick = function(index) {
		const g = this, v = g.viewport
		{ // For the GUI.
			g.index = index; v.queueLayout()
      v.clearStatus()
      } { // For the app function.
			g.appFunction()
		} { // For persistence.
      PlatformUtil.DatabasePut('settings', g.value, `${g.key}`, (event) => {
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
v.gadgets.push(v.appdevelopment = g = new vp.Gadget(v))
	g.title = 'wallet for funding developers'
	Object.defineProperty(g, "subtitle", {
		get : function () { try { const l = appdevelopmentwalletsettings.typelist; return l.list[l.index] } catch (e) {} }
	})
  g.hide = true
  g.enabled = !g.hide
	g.pane = appdevelopmentwalletsettings
v.gadgets.push(v.lnaddr = g = new vp.Gadget(v));
  g.name = 'lnaddr'
  g.type = 'button'
	g.key = 'lnAddrForFairShareRebates'
	g.title = 'Lightning address for rebates'
  g.nonpersistent = true // actually it is persistent, but we want the style
  g.daisychain = true
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
		const g = this, v = g.viewport
    v.clearStatus()
		PlatformUtil.UserPrompt(tr(g.title)+':', g.value, val => {
      if (!val) return
      { // For the GUI.
        g.viewport.queueLayout()
      } { // For the app function.
        g.value = val
      } { // For persistence.
        PlatformUtil.DatabasePut('settings', g.value, `${g.key}`, (event) => {
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
	g.title = 'amount to pay'
  g.daisychain = true
  g.nonpersistent = true
	Object.defineProperty(g, "subtitle", {
		get : function () {
      let temp = this.value
      if (!temp || temp == '' || +temp <= 0) return 'not set'
      else return ''+temp
		}
	})
	g.value = ''
	g.hide = true
  g.enabled = !g.hide
	g.clickFunc = function() {
		const g = this, v = g.viewport
    v.clearStatus()
		PlatformUtil.UserPrompt(tr(g.title)+':', g.value, val => {
      if (!val) return
//      if (v.list.list[v.list.index] == 'invest' && +val < +v.amount.value) {
//        PlatformUtil.UserAck(tr('For investment, you must pay at least your fair share.'), () => {})
//      } else {
        g.value = val
        g.viewport.queueLayout()
//      }
    })
	}
v.gadgets.push(v.paynow = g = new vp.Gadget(v));
  g.hide = true
  g.enabled = !g.hide
  g.color = config.themeColors.uiSettingSelect
  g.nonpersistent = true
	g.title = 'pay now'
  g.center = true
	g.button = true
	g.clickFunc = function() {
		const g = this, v = g.viewport
    v.clearStatus()
    let err
    if (v.list.list[v.list.index] == 'invest' && !v.lnaddr.value) {
      err = 'Please enter your Lightning address for rebates'
    } else if (v.list.list[v.list.index] == 'invest' && !v.lnaddr.value.match(/[a-zA-Z][a-zA-Z0-9]*@[a-zA-Z][a-zA-Z0-9]*([.][a-zA-Z][a-zA-Z0-9]*)+/)) {
      err = 'Invalid Lightning address'
//    } else if (v.list.list[v.list.index] == 'invest' && +v.confirmamount.value < +v.amount.value) {
//        PlatformUtil.UserAck(tr('For investment, you must pay at least your fair share.'), () => {})
    }
    if (err) {
      PlatformUtil.UserAck(err, () => {})
      return
    }

    const completionlogic = () => {
      console.log('completionlogic()')
      // Paid remaining amount via Lightning.
      const wallet = config.appDevPayments
      switch (wallet.type) {
      case 'manual':
        v.errorSignal = true
        vp.beep('bad')
        v.clearBusy()
        break
      case 'LNbits compatible':
        let flag = false
        for (const topay of v.paylist) {
          if (!topay.successSignal && !topay.errorSignal) {
            if (topay.hashes) {
              wallet.checkInvoice(topay.hashes[topay.hashes.length-1], (result) => {
                //console.log(Convert.JSONToString(result))
                if (result && result.paid) {
                  v.payresult.description += ` \n Sent sats to ${topay.lightning_address}.`
                  v.queueLayout()
                  topay.successSignal = true
                } else if (result && result.detail) {
                  v.payresult.description += ` \n Couldn't send to ${topay.lightning_address}.`
                  v.queueLayout()
                  topay.errorSignal = true
                } else {
                  flag = true
                }
              })
            } else {
              flag = true
            }
          }
        }
        console.log(flag, v.paylist)
        if (flag) {
          setTimeout(completionlogic, 2000)
        } else {
          v.successSignal = true
          v.clearBusy()
        }
        break
      default:
        v.errorSignal = true
        vp.beep('bad')
        v.clearBusy()
        break
      }
    }

    const amountToPay = +v.confirmamount.value
    const gifttype = v.list.value
    const targetAddr = 'limpingstamp86@walletofsatoshi.com' //`${gifttype}@${config.debugBuild?'dev-':''}ng.satoshidnc.com`
    let commentData = `{"action":"${gifttype}"${gifttype=='invest'?`,"rebates":"${v.lnaddr.value}"`:''},"commit":"${timecalc.commit}"}`
    if (!v.busySignal) {
      // Pay remaining amount via Lightning.
      delete v.errorSignal
      const wallet = config.appDevPayments
      switch (wallet.type) {
      case 'manual':
        v.payresult.hide = false
        v.payresult.description = `Manual wallet instructions: \n Send ${amountToPay} satoshis to ${targetAddr} with the following comment: \n ${commentData}`
        v.queueLayout()
        v.clearBusy()
        // PlatformUtil.UserConfirm(`Manual wallet instructions:\n\nSend ${amountToPay} satoshis to ${targetAddr} with the following comment:\n\n${commentData}`, (result) => {
        //   if (result) {
        //     console.log('confirmed')
        //     setTimeout(completionlogic, 2000)
        //   } else {
        //     console.log('canceled')
        //   }
        // })
        break
      case 'LNbits compatible':
        v.payresult.hide = false
        v.payresult.description = 'Please wait:'
        v.successSignal = false
        v.errorSignal = false
        v.setBusy()
    
        v.paylist = [{ time_secs: 0, pay_asked: amountToPay, dev_nym: '', lightning_address: targetAddr }]
        if (gifttype == 'donate') {
          v.paylist = JSON.parse(JSON.stringify(timecalc.data)) // make a copy
          commentData = `donation toward ${config.appNameVersion} (commit ${timecalc.commit})`
        }
        console.log(v.paylist)
        const total = v.paylist.reduce((acc, cur) => acc + cur.pay_asked, 0)
        console.log('total', total)
        for (const topay of v.paylist) {
          wallet.payLightningAddress(topay.lightning_address, amountToPay * topay.pay_asked / total, Convert.EscapeJSON(commentData), (checkingId, errorDetail) => {
            if (checkingId) {
              if (!topay.hashes) topay.hashes = []
              topay.hashes.push(checkingId)
            } else {
              v.payresult.description += ` \n Couldn't send to ${topay.lightning_address}.`
              topay.errorSignal = true
              // v.clearBusy()
              // if (errorDetail) {
              //   console.error(errorDetail)
              //   //PlatformUtil.UserAck(errorDetail, () => {})
              //   //v.queueLayout()
              // } else {
              //   console.error('Wallet did not generate a recognized invoice type.')
              // }
            }
          })
        }
        setTimeout(completionlogic, 2000)
        break
      default:
        v.successSignal = false
        v.errorSignal = true
        v.clearBusy()
        console.error(`Unexpected wallet type: '${wallet.type}'.`)
        break
      }
    }

	}
v.gadgets.push(v.payresult = g = new vp.Gadget(v))
  g.name = 'payresult'
  g.hide = true
  g.description = ''
v.gadgets.push(v.spinner = g = new vp.Gadget(v))
  g.description = 'spinner'
  g.busyCounter = 0
  g.layoutFunc = function() {
    // console.log('apinner layout')
    const g = this, v = g.viewport
    g.h = 25
    g.autoHull()
    // console.log('locktobottom', v.locktobottom)
    // if (v.locktobottom && v.spinner.y + v.spinner.h - v.sh > v.userY) {
    //   v.userY = Math.max(0, v.spinner.y + v.spinner.h - v.sh)
    //   v.queueLayout()
    // }  
  }
  g.renderFunc = function() {
    const g = this, v = g.viewport
    const gear = "\x1D"
    const warning = "\x0F"
    const checkmark = "\x10"
		this.busyCounter += 0.01; if (this.busyCounter > Math.PI/2) this.busyCounter -= Math.PI/2
    const m = mat4.create();
		mat4.identity(m)
		mat4.translate(m,m,[g.x+g.w/2,g.y+g.h/2,0])
		mat4.scale(m,m,[g.h/25,g.h/25,1]);
    if (v.errorSignal) {
      iconFont.draw(-10,7,warning,config.themeColors.uiLightningYellow,v.mat, m)    
    } else if (v.successSignal) {
      iconFont.draw(-10,7,checkmark,config.themeColors.uiSuccessGreen,v.mat, m)    
    } else if (v.busySignal) {
      mat4.rotate(m,m, this.busyCounter, [0,0,1])
      iconFont.draw(-10,7,gear,config.themeColors.uiText,v.mat, m)    
      v.setRenderFlag(true)
    }
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
		if (debuglog) console.log("requesting", `${g.key}`)
    PlatformUtil.DatabaseGet('settings', `${g.key}`, (event) => {
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
		if (debuglog) console.log("requesting", `${g.key}`);
    PlatformUtil.DatabaseGet('settings', `${g.key}`, (event) => {
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

