billpane.textbox = v = new vp.View();
v.name = Object.keys({'billpane_textbox':0}).pop();
v.height = 50/32 * (16 + 8+8 + 4 + 2);
v.cursorState = true;
v.beam = true;
v.text = '';
v.lastUserText = '';
v.state = 'start';
v.options = {};
v.maxLen = 15;
Object.defineProperty(v, "currency", {
	get : function () {
		if (this.options.lightning) return '₿';
		if (this.options.cash) return config.cashCurrency;
		try { return config.mainCurrency; } catch (e) {}
	}
});
v.gadgets.push(v.contextGad = g = new vp.Gadget(v));
	g.actionFlags = vp.GAF_CONTEXTMENU; g.z = -1;
	g.contextMenuFunc = function() {
		const v = billpane.textbox;
		if (v.text != '' || JSON.stringify(v.options) != '{}' || !config.lightningScanningEnabled) return;
		if (navigator.clipboard.readText) navigator.clipboard.readText().then((clipText) => {
			if (clipText.toLowerCase().startsWith('lnbc')) {
				v.pasteInvoice(clipText);
			}
		});
	}
v.gadgets.push(v.itemGad = g = new vp.Gadget(v));
	g.actionFlags = vp.GAF_CLICKABLE;
	g.x = 8+10; g.y = 4+10; g.enabledY = g.y;
	g.w = 30; g.h = 30;
	g.autoHull();
	g.clickFunc = function() {
		emojipane.callback = function(label, command) {
      if (label) {
        billpane.textbox.options.emoji = label;
        delete billpane.textbox.options.barcode;
        billpane.textbox.queryPrice(label);
        billpane.textbox.resetGads();
        billpane.changed = true;
        billpane.subtotal.enableGads();
      }
      if (command == 'clear') {
        delete billpane.textbox.options.emoji;
        delete billpane.textbox.options.barcode;
        //billpane.textbox.queryPrice(label);
        billpane.textbox.resetGads();
        billpane.changed = true;
        billpane.subtotal.enableGads();
      }
		}
		vp.pushRoot(emojipane);
	}
v.gadgets.push(v.scanGad = g = new vp.Gadget(v));
	g.actionFlags = vp.GAF_CLICKABLE;
	g.x = 8+10+50; g.normalX = g.x; g.y = -1000;
	g.w = 30; g.h = 30;
	g.autoHull();
	g.clickFunc = function() {
		const g = this, v = g.viewport;
		if (v.scanMode) {
			g.stopScanner();
		} else {
			g.startScanner();
		}
		v.resetGads();
		v.queueLayout();
	}
	g.scanFunc = function(barcode) {
		const g = billpane.textbox.scanGad, v = billpane.textbox;
		if (v.scanMode) {
			g.stopScanner();
			vp.beep('qr-part');
			console.log(JSON.stringify(barcode));

      if (barcode.format == 'ean_13') {
				let price = Convert.EAN13ToPrice(barcode.rawValue)
        if (price !== undefined) {
          billpane.textbox.splicePrice({ unitprice: price, fractionalQty: false, negate: false })
          billpane.textbox.resetGads()
          billpane.changed = true
          billpane.subtotal.enableGads()
          v.lastUserText = billpane.textbox.text
        }
      } else if (barcode.rawValue.toLowerCase().startsWith('lnbc') && config.lightningScanningEnabled) {
				billpane.textbox.pasteInvoice(barcode.rawValue);
			} else {
				let number = barcode.rawValue;
				billpane.textbox.options.emoji = 'barcode';
				billpane.textbox.options.barcode = number;
				billpane.textbox.queryPrice('barcode-'+number);
				billpane.textbox.resetGads();
				billpane.changed = true;
				billpane.subtotal.enableGads();
			}
		}
	}
	g.startScanner = function(clear = true) {
		var g = this
		const session = BarcodeScanner.beginSession(g.scanFunc)
    if (session !== 0) {
      g.scanSession = session
  		//if (clear) { g.linkedBarcode = '' }
			g.viewport.scanMode = true
    }
	}
	g.stopScanner = function() {
		var g = this
		BarcodeScanner.endSession(g.scanSession)
		delete g.scanSession
    delete g.viewport.scanMode
	}
v.gadgets.push(v.cashGad = g = new vp.Gadget(v));
	g.actionFlags = vp.GAF_CLICKABLE;
	g.x = 8+10+50+50; g.normalX = g.x; g.y = -1000;
	g.w = 30; g.h = 30;
	g.autoHull();
	g.clickFunc = function() {
		const v = this.viewport;
		if (!v.options.cash) {
			billpane.changed = true;
			billpane.subtotal.enableGads();
			delete billpane.textbox.options.negate;
			billpane.textbox.options.cash = true;
//			billpane.beginConversionRateQuery(billpane.subtotal.calc(true), billpane.orderCurrency, billpane.textbox.currency);
			billpane.textbox.resetGads();
			billpane.textbox.queueLayout();
			billpane.setRenderFlag(true);
		} else if (!billpane.subtotal.includesCash()) {
			billpane.changed = true;
			billpane.subtotal.enableGads();
			delete billpane.textbox.options.negate;
			delete billpane.textbox.options.cash;
			billpane.textbox.resetGads();
			billpane.textbox.queueLayout();
			billpane.setRenderFlag(true);
		} else if (!v.options.change) {
			v.finishCash();
		}
	}
v.pasteInvoice = function(invoice) {
	billpane.textbox.options.emoji = 'lightning invoice';
	billpane.textbox.options.barcode = invoice;
	config.wallet.readInvoice(invoice, (sats, desc) => {
		billpane.textbox.options.desc = desc;
		if (billpane.textbox.text == '' && isNumber(sats)) {
			billpane.textbox.text = sats.toString()+'×';
			billpane.textbox.setRenderFlag(true);
		}
		billpane.getConversionRate(sats, '₿', billpane.orderCurrency, (rate) => {
			if (billpane.textbox.text.endsWith('×')) {
				billpane.textbox.text = billpane.textbox.text.substr(0,billpane.textbox.text.length-1) +'×'+ billpane.getOptimalDigits(rate, sats);
				billpane.textbox.setRenderFlag(true);
			}
		});
		vp.beep('qr-part');
	});
	billpane.textbox.resetGads();
	billpane.changed = true;
	billpane.subtotal.enableGads();
}
v.payInvoices = function(cb) {
	for (const item of billpane.items) if (item.options.emoji == 'lightning invoice' /*&& item.options.barcode != ''*/ && item.options.success === undefined) {
		if (config.debugBuild) {
			setTimeout(() => {
				item.options.success = (Math.random() > 0.5)? true: false;
				cb(true);
			}, 1000);
		} else {
			config.wallet.payInvoice(item.options.barcode, (success) => {
				item.options.success = (success? true: false);
				cb(true);
			});
		}
		return;
	}
	cb(false);
}
v.finishCash = function() {
	const v = this;
	if (billpane.subtotal.calc() > config.getLeeway(v.currency)) {
		vp.beep('bad');
	} else {
		const payloop = (todo) => {
			billpane.setRenderFlag(true);
			billpane.subtotal.setRenderFlag(true);
			if (todo) billpane.textbox.payInvoices(payloop);
			else {
				vp.beep('qr-part');
			}
		};
		billpane.textbox.payInvoices(payloop);
		billpane.changed = true;
		billpane.subtotal.enableGads();
		delete billpane.textbox.options.negate;
		billpane.textbox.options.change = true;
		billpane.textbox.resetGads();
		billpane.textbox.queueLayout();
		billpane.setRenderFlag(true);
	}
}
v.gadgets.push(v.lnGad = g = new vp.Gadget(v));
	g.actionFlags = vp.GAF_CLICKABLE;
	g.x = 8+10+50; g.normalX = g.x; g.y = -1000;
	g.w = 30; g.h = 30;
	g.autoHull();
	g.clickFunc = function() {
		const v = this.viewport;
		//if (v.options.cash || billpane.subtotal.includesCash()) return; // sanity check
		if (!v.options.lightning) {
			billpane.changed = true;
			billpane.subtotal.enableGads();
			billpane.textbox.options.lightning = true;
			if (billpane.textbox.text === '' && billpane.textbox.currency === billpane.orderCurrency) {
				billpane.textbox.text = billpane.subtotal.calc().toString();
			}
			billpane.textbox.resetGads();
			billpane.textbox.queueLayout();
			checkoutpane.relayout();
			checkoutpane.setRenderFlag(true);
			billpane.setRenderFlag(true);
		} else if (!billpane.textbox.options.lightningpaid) {
			billpane.changed = true;
			billpane.subtotal.enableGads();
			delete billpane.textbox.options.lightning;
			billpane.textbox.resetGads();
			billpane.textbox.queueLayout();
			checkoutpane.relayout();
			checkoutpane.setRenderFlag(true);
			billpane.setRenderFlag(true);
		} else {
		}
	}
v.gadgets.push(v.gearGad = g = new vp.Gadget(v));
	g.actionFlags = vp.GAF_CLICKABLE;
	g.x = 8+10+50; g.normalX = g.x; g.y = -1000;
	g.w = 30; g.h = 30;
	g.autoHull();
	g.clickFunc = function() {
		const v = this.viewport;
		if (!v.options.lightning) return // sanity check
    delete billpane.conversions[billpane.orderCurrency + '-' + billpane.textbox.currency]
    billpane.conversionInProgress = false
    billpane.textbox.text = ''
    billpane.setRenderFlag(true)
	}
v.gadgets.push(v.signGad = g = new vp.Gadget(v));
	g.actionFlags = vp.GAF_CLICKABLE;
	g.x = -1000;
	g.y = 0;
	g.w = 0;
	g.h = 14;
	g.autoHull();
	g.clickFunc = function() {
		if (billpane.textbox.options.change) {
			//vp.beep('bad');
			return;
		}
		if (billpane.textbox.options.negate) delete billpane.textbox.options.negate;
		else billpane.textbox.options.negate = true;
		billpane.changed = true;
		billpane.subtotal.enableGads();
		billpane.textbox.resetGads();
		billpane.textbox.queueLayout();
	}
v.resetGads = function() {
	const v = this;
	if (v.options.change) {
		v.itemGad.y = -1000
		v.scanGad.y = -1000
		v.cashGad.y = -1000
		v.lnGad.y = -1000
    v.gearGad.y = -1000
	} else if (v.options.lightning) {
		v.itemGad.y = -1000
		v.scanGad.y = -1000
		v.cashGad.y = -1000
		v.lnGad.x = v.itemGad.x
		v.lnGad.y = v.itemGad.enabledY
    v.gearGad.y = v.disableConversionRefresh? -1000: v.itemGad.enabledY
	} else if (v.options.cash) {
		v.itemGad.y = -1000
		v.scanGad.y = -1000
		v.cashGad.x = v.itemGad.x
		v.cashGad.y = v.itemGad.enabledY
		if (config.lightningEnabled) {
			v.lnGad.x = v.cashGad.x + 50
			v.lnGad.y = v.itemGad.enabledY
		} else {
			v.lnGad.y = -1000
		}
    v.gearGad.y = -1000
	} else if (v.scanMode) {
		v.itemGad.y = -1000
		v.scanGad.x = v.itemGad.x
		v.scanGad.y = v.itemGad.enabledY
		v.cashGad.y = -1000
		v.lnGad.y = -1000
    v.gearGad.y = -1000
	} else if (billpane.items.length == 0 || v.options.emoji) {
		v.itemGad.y = v.itemGad.enabledY
		if (v.text != '' || JSON.stringify(v.options) != '{}' || !config.barcodeScanningEnabled) {
			v.scanGad.y = -1000
		} else {
			v.scanGad.x = v.scanGad.normalX
			v.scanGad.y = v.itemGad.enabledY
		}
		v.cashGad.y = -1000
		v.lnGad.y = -1000
    v.gearGad.y = -1000
	} else {
		v.itemGad.y = v.itemGad.enabledY
		if (v.text != '' || JSON.stringify(v.options) != '{}' || !config.barcodeScanningEnabled) {
			v.scanGad.y = -1000
			v.cashGad.x = v.scanGad.normalX
		} else {
			v.scanGad.x = v.scanGad.normalX
			v.scanGad.y = v.itemGad.enabledY
			v.cashGad.x = v.cashGad.normalX
		}
		if (config.cashCurrency != 'none') {
			v.cashGad.y = v.itemGad.enabledY
		} else {
			v.cashGad.x -= 50
			v.cashGad.y = -1000
		}
		if (config.lightningEnabled) {
			v.lnGad.x = v.cashGad.x + 50
			v.lnGad.y = v.itemGad.enabledY
		} else {
			v.lnGad.y = -1000
		}
    v.gearGad.y = -1000
	}
	v.itemGad.autoHull()
	v.scanGad.autoHull()
	v.cashGad.autoHull()
	v.lnGad.autoHull()
  v.gearGad.autoHull()
	v.queueLayout()
	if (!v.options.lightning && checkoutpane.subtotalshim.b != billpane) {
		v.resetBillPane()
	}
}
v.resetBillPane = function() {
  delete billpane.textbox.disableConversionRefresh
	checkoutpane.subtotalshim.b = billpane
	billpane.parent = checkoutpane.subtotalshim
	checkoutpane.relayout()
	checkoutpane.setRenderFlag(true)
}
v.updatePrice = function(item, unitprice, fractionalQty, negate) {
	const newItem = {
		'item': ''+item,
		'unitprice': ''+unitprice,
		'fractionalQty': ''+fractionalQty,
		'negate': ''+negate,
	};
	console.log('Saving', newItem);
  PlatformUtil.DatabasePut('prices', newItem, `${getCurrentAccount().id}-${newItem.item}`)
}
v.queryPrice = function(item) {
  PlatformUtil.DatabaseGet('prices', `${getCurrentAccount().id}-${item}`, (event) => {
		console.log(event.target.result);
    var data = config.priceList.getPriceData(item)
    if (data?.price && data?.currency === billpane.orderCurrency) {
      billpane.textbox.splicePrice({ unitprice: data.price, ...event.target.result })
      return
    }
		if (event.target.result)
			billpane.textbox.splicePrice(event.target.result)
  })
}
v.splicePrice = function(obj) {
	const v = this;
	if (obj.negate == "true") v.options.negate = true;
	else delete v.options.negate;
	const fractionalQty = obj.fractionalQty == "true";
	let str = v.lastUserText;
	if (str == '') {
		v.text = obj.unitprice + (fractionalQty?'×':'');
	} else if (str.endsWith('×')) {
		if (str.includes('.')) {
			if (fractionalQty) {
				v.text = str + obj.unitprice;
			} else {
				v.text = obj.unitprice +'×'+ str.substr(0,str.length-1);
				vp.beep('bad');
			}
		} else {
			if (fractionalQty) {
				v.text = (obj.unitprice +'×'+ ((+str.substr(0,str.length-1))/obj.unitprice)).substring(0, v.maxLen);
				vp.beep('bad');
			} else {
				v.text = str + obj.unitprice;
			}
		}
	} else if (str.endsWith('.') && !str.includes('×')) {
		if (+(str+'0') == 0) {
			v.text = obj.unitprice + (fractionalQty == "true"?'×':'');
		} else {
			if (fractionalQty) {
				v.text = obj.unitprice +'×'+ str;
			} else {
				v.text = obj.unitprice +'×'+ str.substr(0, str.length-1);
				vp.beep('bad');
			}
		}
	} else if (!str.includes('×')) {
		if (str.includes('.')) {
			if (fractionalQty) {
				v.text = str +'×'+ obj.unitprice;
			} else {
				v.text = obj.unitprice +'×'+ str;
				vp.beep('bad');
			}
		} else {
			if (fractionalQty) {
				v.text = (obj.unitprice +'×'+ ((+str)/obj.unitprice)).substring(0, v.maxLen);
				//vp.beep('bad');
			} else {
				v.text = str +'×'+ obj.unitprice;
			}
		}
	} else if (str.includes('×')) {
		let stack = str.substr(0, str.indexOf('×'));
		str = str.substr(str.indexOf('×')+1);
		if (+str == 0) {
			if (stack.includes('.')) {
				if (fractionalQty) {
					v.text = stack +'×'+ obj.unitprice;
				} else {
					v.text = obj.unitprice +'×'+ stack;
					vp.beep('bad');
				}
			} else {
				if (fractionalQty) {
					v.text = obj.unitprice +'×'+ stack+'.0';
					vp.beep('bad');
				} else {
					v.text = stack +'×'+ obj.unitprice;
				}
			}
		} else {
			if (fractionalQty) {
				if (stack.includes('.')) {
					v.text = stack +'×'+ obj.unitprice;
					vp.beep('bad');
				} else if (str.includes('.')) {
					v.text = str +'×'+ obj.unitprice;
					vp.beep('bad');
				} else if (+stack > +str) {
					v.text = obj.unitprice +'×'+ str+'.0';
					vp.beep('bad');
				} else {
					v.text = obj.unitprice +'×'+ stack+'.0';
					vp.beep('bad');
				}
			} else {
				if (stack.includes('.')) {
					v.text = obj.unitprice +'×'+ stack;
					vp.beep('bad');
				} else if (str.includes('.')) {
					v.text = obj.unitprice +'×'+ str;
					vp.beep('bad');
				} else if (+stack > +str) {
					v.text = str +'×'+ obj.unitprice;
					vp.beep('bad');
				} else {
					v.text = stack +'×'+ obj.unitprice;
					vp.beep('bad');
				}
			}
		}
	}
	billpane.changed = true;
	billpane.setRenderFlag(true);
	billpane.subtotal.setRenderFlag(true)
	v.setRenderFlag(true);
}
v.pasteFunc = function(e) {
	let clipText = e.clipboardData.getData('text/plain');
	if (clipText.toLowerCase().startsWith('lnbc') && config.lightningScanningEnabled) {
		billpane.textbox.pasteInvoice(clipText);
	}
}
v.keypadFunc = function(code, key) {
	const v = this
	const isNum = (code >= 0 && code <= 9)
	const maxLen = v.maxLen
	if ((v.options.change && code != keypadpane.keyBack) || v.options.lightningpaid) {
    if (code >= 0 || (code == -1 && key == '-')) vp.beep('bad');
    return;
  }
	if (checkoutpane.subtotalshim.b != billpane && code != keypadpane.keyBack && code != keypadpane.keyEnter) {
		if (code >= 0 || (code == -1 && key == '-')) vp.beep('bad');
		return;
	}
  switch (v.state) {
	case 'start':
		if (isNum) {
			let str = v.text + code.toString();
			let stack = '';
			if (str.includes('×')) {
				stack = str.substr(0, str.indexOf('×'));
				str = str.substr(str.indexOf('×')+1);
			}
			if (str.startsWith('0') && str.length > 1 && str.substr(1,1) != '.') str = str.substr(1);
			if (str.startsWith('00')) {
				vp.beep('bad');
			} else {
				if (stack) {
					str = stack + '×' + str;
				}
				if (str.length > maxLen) {
					vp.beep('bad');
				} else {
					v.text = str;
					billpane.changed = true;
				}
			}
		}
		if (code == keypadpane.keyPoint) {
			let str = v.text;
			if (str == '') str = '0';
			if (str.endsWith('×')) str += '0';
			if (str.includes('.') || str.length >= maxLen) {
				vp.beep('bad');
			} else {
				v.text = str + '.';
				billpane.changed = true;
			}
		}
		if (code == keypadpane.keyTimes) {
			let str = v.text;
			if (str == '' || str.includes('×') || str.endsWith('.') || (+str == 0) || str.length >= maxLen) {
				vp.beep('bad');
			} else {
				v.text = str + '×';
				billpane.changed = true;
			}
		}
		if (code == keypadpane.keyBack) {
      if (v.options.change) {
        delete v.options.change
				billpane.changed = true;
        billpane.setRenderFlag(true)
				v.resetGads();
				v.queueLayout();
      } else if (checkoutpane.subtotalshim.b != billpane) {
				v.resetBillPane();
			} else if (v.text != '') {
				v.text = v.text.substr(0, v.text.length-1);
				billpane.changed = true;
			} else if (v.options.negate) {
				delete v.options.negate;
				billpane.changed = true;
			} else if (v.options.emoji) {
				delete v.options.emoji;
				delete v.options.barcode;
				delete v.options.cash;
				delete v.options.lightning;
				delete v.options.desc;
				billpane.changed = true;
			} else if (v.options.cash && !billpane.subtotal.includesCash()) {
				v.cashGad.clickFunc();
			} else if (v.options.lightning && !billpane.textbox.options.lightningpaid) {
				v.lnGad.clickFunc();
			} else if (v.scanMode) {
				billpane.textbox.scanGad.stopScanner();
				v.resetGads();
				v.queueLayout();
			}
		}
		if (code == keypadpane.keyEnter) {
			let str = v.text;
			if (str == '' || str.endsWith('×') || str.endsWith('.') || (str.includes('.') && !str.includes('×'))) {
				if (str == '') {
					if (v.options.cash && !v.options.change)
						v.finishCash();
				} else vp.beep('bad');
			} else {
				let stack = '';
				if (str.includes('×')) {
					stack = str.substr(0, str.indexOf('×'));
					str = str.substr(str.indexOf('×')+1);
				} else {
					stack = '1';
				}
				if ((+str) * (+stack) == 0) {
					vp.beep('bad');
				} else {
					let money = '', qty = '';
					if (stack.includes('.')) {
						money = str;
						qty = stack;
					} else if (str.includes('.')) {
						money = stack;
						qty = str;
					} else if (+stack > +str) {
						money = stack;
						qty = str;
					} else {
						money = str;
						qty = stack;
					}
					if (v.options.emoji) {
						let item = v.options.emoji;
						if (v.options.barcode) item = item + '-' + v.options.barcode;
						if (qty.includes('.')) {
							v.updatePrice(item, +money, true, v.options.negate == true);
						} else {
							v.updatePrice(item, +money, false, v.options.negate == true);
						}
					}
					const cashphase = v.options.cash
					const lnphase = v.options.lightning
					const completionlogic = () => {
						if (v.currency != billpane.orderCurrency)
							billpane.items.push({qty:+qty, unitprice:+money, currency:v.currency, options:v.options})
						else
							billpane.items.push({qty:+qty, unitprice:+money, options:v.options})
						billpane.changed = true
						billpane.userY = 0
						//billpane.swipeGad.doSwipe(true)
						billpane.queueLayout()
						billpane.subtotal.setRenderFlag(true)
						v.text = ''
            let lightningpaid = v.options.lightningpaid
						v.options = {}
						if (cashphase) {
							v.options.cash = true
						}
						if (lnphase) {
							v.options.change = true
              if (lightningpaid) v.options.lightningpaid = true
						}
						v.resetGads()
						v.queueLayout()
						vp.beep('qr-scan')
					}

					if (v.options.lightning) {
            const inQuestion = billpane.subtotal.calc('cashTendered') - billpane.subtotal.calc('limitToBill')
            if (checkoutpane.subtotalshim.b == billpane && !lightningqr.netBusy) {
              v.disableConversionRefresh = true
              v.resetGads()
              if (inQuestion < 0) {
                // Pay remaining amount via Lightning.
                lightningqr.clear()
                checkoutpane.subtotalshim.b = lightningqr; lightningqr.parent = checkoutpane.subtotalshim
                checkoutpane.relayout()
                checkoutpane.setRenderFlag(true)
                switch (config.walletType) {
                case 'manual':
                  lightningqr.walletSignal = true;
                  billpane.textbox.options.hashes = [];
                  billpane.changed = true;
                  break;
                case 'LNbits compatible':
                  if (!lightningqr.netBusy) {
                    lightningqr.netBusy = true;
                    lightningqr.clear();
                    lightningqr.busySignal = true;
                    config.wallet.generateInvoice((+qty) * (+money), (invoice, id) => {
                      if (invoice && invoice.startsWith('lnbc') && id) {
                        lightningqr.qr = [invoice];
                        if (!billpane.textbox.options.hashes)
                          billpane.textbox.options.hashes = [];
                        billpane.textbox.options.hashes.push(id);
                        billpane.changed = true;
                      } else {
                        lightningqr.errorSignal = true;
                        console.error('Wallet did not generate a recognized invoice type.');
                      }
                      lightningqr.setRenderFlag(true);
                      lightningqr.busySignal = false;
                      lightningqr.netBusy = false;
                    });
                  }
                  break;
                default:
                }
              } else {
                // Return overpayment via Lightning.
                lightningqr.clear()
                checkoutpane.subtotalshim.b = lightningqr; lightningqr.parent = checkoutpane.subtotalshim
                checkoutpane.relayout()
                checkoutpane.setRenderFlag(true)
                switch (config.walletType) {
                case 'manual':
                  lightningqr.walletSignal = true
                  billpane.textbox.options.hashes = []
                  billpane.changed = true
                  break
                case 'LNbits compatible':
                  if (!lightningqr.netBusy) {
                    lightningqr.netBusy = true
                    lightningqr.clear()
                    lightningqr.busySignal = true
                    config.wallet.generateWithdrawalLink((+qty) * (+money), "Here's your change. Thank you for your purchase!", (withdrawalLink, id) => {
                      if (withdrawalLink && withdrawalLink.toLowerCase().startsWith('lnurl') && id) {
                        lightningqr.qr = [withdrawalLink]
                        if (!billpane.textbox.options.hashes)
                          billpane.textbox.options.hashes = []
                        billpane.textbox.options.hashes.push(id)
                        billpane.changed = true
                      } else {
                        lightningqr.errorSignal = true
                        console.error('Wallet did not generate a recognized withdrawal link type.')
                      }
                      lightningqr.setRenderFlag(true)
                      lightningqr.busySignal = false
                      lightningqr.netBusy = false
                    })
                  }
                  break
                default:
                }
              }
						} else if (billpane.textbox.options.hashes && !lightningqr.netBusy) {
              if (inQuestion < 0) {
                // Paid remaining amount via Lightning.
                switch (config.walletType) {
                case 'manual':
                  completionlogic()
                  break
                case 'LNbits compatible':
                  if (!lightningqr.netBusy) {
                    lightningqr.netBusy = true
                    config.wallet.checkInvoice(billpane.textbox.options.hashes[billpane.textbox.options.hashes.length-1], (result) => {
                      lightningqr.netBusy = false
                      if (result && result.paid) {
                        billpane.textbox.options.lightningpaid = true
                        completionlogic()
                      } else {
                        vp.beep('bad')
                      }
                    })
                  }
                  break
                default:
                }
              } else {
                // Returned overpayment via Lightning.
                switch (config.walletType) {
                case 'manual':
                  completionlogic()
                  break
                case 'LNbits compatible':
                  if (!lightningqr.netBusy) {
                    lightningqr.netBusy = true
                    config.wallet.checkWithdrawalLink(billpane.textbox.options.hashes[billpane.textbox.options.hashes.length-1], (result) => {
                      lightningqr.netBusy = false
                      if (result && result.used) {
                        billpane.textbox.options.lightningpaid = true
                        billpane.textbox.options.lightningwithdrawn = true
                        completionlogic()
                      } else {
                        vp.beep('bad')
                      }
                    })
                  }
                  break
                default:
                }  
              }
						} else {
							vp.beep('bad')
						}
					} else {
						completionlogic()
					}
				}
			}
		}
		if (code == -1 && key == '-') {
			billpane.textbox.signGad.clickFunc();
		}
		v.lastUserText = v.text;
		v.resetGads();
		v.queueLayout();
		v.setRenderFlag(true);
		billpane.subtotal.enableGads()
		break;
	}
}
{
	for (let g of keypadpane.keypad) {
		g.target = billpane.textbox;
	}
	keypadpane.target = billpane.textbox;
}
v.layoutFunc = function() {
	let g = billpane.textbox.contextGad;
	g.x = 4; g.y = 2;
	g.w = v.sw-8; g.h = 32;
	g.autoHull();
}
v.renderFunc = function() {
	drawThemeBackdrop(this, config.themeColors);
	const v = this;
	const m = mat4.create();

	vp.beginInput(keypadpane.inputGad); // TODO: This gets reset by clicks/taps. Need to fix.

	mainShapes.useProg2();
	gl.uniformMatrix4fv(gl.getUniformLocation(prog2, 'uProjectionMatrix'), false, v.mat);

	mat4.identity(m);
	mat4.scale(m,m, [50/32, 50/32, 1]);
	mat4.translate(m,m, [4, 2, 0]);
	mat4.scale(m,m, [32, 32, 1]);
	gl.uniformMatrix4fv(gl.getUniformLocation(prog2, 'uModelViewMatrix'), false, m);
	gl.uniform4fv(gl.getUniformLocation(prog2, 'overallColor'),
		new Float32Array(config.themeColors.uiDataEntryArea));
	mainShapes.drawArrays2('circle');
	mat4.identity(m);
	mat4.translate(m,m, [v.sw, 0, 0]);
	mat4.scale(m,m, [50/32, 50/32, 1]);
	mat4.translate(m,m, [-4, 2, 0]);
	mat4.scale(m,m, [-32, 32, 1]);
	gl.uniformMatrix4fv(gl.getUniformLocation(prog2, 'uModelViewMatrix'), false, m);
	mainShapes.drawArrays2('circle');
	mat4.identity(m);
	mat4.translate(m,m, [(4+16) * 50/32, 2 * 50/32, 0]);
	mat4.scale(m,m, [v.sw-(8+32) * 50/32, 32 * 50/32, 1]);
	gl.uniformMatrix4fv(gl.getUniformLocation(prog2, 'uModelViewMatrix'), false, m);
	mainShapes.drawArrays2('rect');

	if (!billpane.textbox.options.change) {
		if (v.cursorState) {
			mat4.identity(m);
			mat4.translate(m,m, [v.sw, 0, 0]);
			mat4.scale(m,m, [50/32, 50/32, 1]);
			mat4.translate(m,m, [-4-16-1, 2+8, 0]);
			mat4.scale(m,m, [2, 16, 1]);
			gl.uniformMatrix4fv(gl.getUniformLocation(prog2, 'uModelViewMatrix'), false, m);
			gl.uniform4fv(gl.getUniformLocation(prog2, 'overallColor'),
				new Float32Array(config.themeColors.uiDataEntryCursor));
			mainShapes.drawArrays2('rect');
		}
	}

	// item emoji gadget
	{
		let g = v.itemGad;

		if (!v.options.emoji) {
			mat4.identity(m);
			mat4.translate(m,m, [g.x, g.y, 0]);
			mat4.scale(m,m, [g.w/18, g.h/18, 1]);
			iconFont.draw(0,16, "\x15", config.themeColors.uiDataEntryGhostText, v.mat, m);
		} else {
			let emoji = billpane.textbox.options.emoji;
			mat4.identity(m);
			mat4.translate(m,m, [g.x, g.y, 0]);
			mat4.scale(m,m, [g.w, g.h, 1]);
			emojiShapes.useProg4();
			gl.uniformMatrix4fv(gl.getUniformLocation(prog4, 'uProjectionMatrix'), false, v.mat);
			gl.uniformMatrix4fv(gl.getUniformLocation(prog4, 'uModelViewMatrix'), false, m);
			gl.uniform4fv(gl.getUniformLocation(prog4, 'overallColor'),
				new Float32Array([1,1,1,1]));
			gl.bindTexture(gl.TEXTURE_2D, config.priceList.thumbnails);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
			emojiShapes.drawArrays4(emoji);
		}
	}

	// scan barcode gadget
	{
		let g = v.scanGad;

		mat4.identity(m);
		mat4.translate(m,m, [g.x, g.y+g.h/20*1, 0]);
		mat4.scale(m,m, [g.w/20, g.h/20, 1]);
		iconFont.draw(0,16, "\x04", v.scanMode? alpha(config.themeColors.uiDataEntryText, 0.5): config.themeColors.uiDataEntryGhostText, v.mat, m);
		if (v.scanMode) {
			if (v.beam) {
				mainShapes.useProg2();
				gl.uniformMatrix4fv(gl.getUniformLocation(prog2, 'uProjectionMatrix'), false, v.mat);
				gl.uniform4fv(gl.getUniformLocation(prog2, 'overallColor'),
					new Float32Array(config.themeColors.uiBarcodeScannerBeam));
				mat4.identity(m);
				mat4.translate(m,m, [g.x-4, g.y+g.h/2-0.5, 0]);
				mat4.scale(m,m, [g.w+8, 1, 1]);
				gl.uniformMatrix4fv(gl.getUniformLocation(prog2, 'uModelViewMatrix'), false, m);
				mainShapes.drawArrays2('rect');
			}
			if (v.beam != v.beamPrev) {
				v.beamPrev = v.beam;
				billpane.textbox.beamtimerId = setTimeout(() => { billpane.textbox.beam = !billpane.textbox.beam; billpane.textbox.setRenderFlag(true); }, 50);
			}
		}
	}

	// cash payment gadget
	{
		let g = v.cashGad;

		mat4.identity(m);
		mat4.translate(m,m, [g.x, g.y, 0]);
		mat4.scale(m,m, [g.w/38, g.w/38, 1]);
		iconFont.draw(-1,32, "\x1E", (v.options.cash && !v.options.change)? config.themeColors.uiFiatGreen: config.themeColors.uiDataEntryGhostText, v.mat, m);
	}

	// lightning payment gadget
	{
		let g = v.lnGad;

		mat4.identity(m);
		mat4.translate(m,m, [g.x, g.y, 0]);
		mat4.scale(m,m, [g.w/12, g.h/12, 1]);
		iconFont.draw(-18/3/2, 16-18/3/2, "\x14", billpane.textbox.options.lightning? config.themeColors.uiLightningPurple: config.themeColors.uiDataEntryGhostText, v.mat, m);
		iconFont.draw(-20,0, "\x13", billpane.textbox.options.lightning? config.themeColors.uiLightningYellow: config.themeColors.uiDataEntryGhostText, v.mat, m);
	}

	// conversion rate refresh gadget
	{
		let g = v.gearGad;

		mat4.identity(m);
		mat4.translate(m,m, [g.x, g.y, 0]);
		mat4.scale(m,m, [g.w/20, g.h/20, 1]);
		iconFont.draw(0, 16, "\x1D", config.themeColors.uiDataEntryGhostText, v.mat, m);
	}

	// change gadget
/*
	{
		let g = v.changeGad;

		mat4.identity(m);
		mat4.translate(m,m, [g.x, g.y, 0]);
		mat4.scale(m,m, [g.w/23, g.h/23, 1]);
		financeGraphicsFont.draw(0,24, "\x44", v.options.change? config.themeColors.uiFiatGreen: config.themeColors.uiDataEntryGhostText, v.mat, m);
	}
*/

	mat4.identity(m);
	mat4.translate(m,m, [v.sw, 0, 0]);
	mat4.scale(m,m, [50/32, 50/32, 1]);
	mat4.translate(m,m, [-4-16, 2+8+14, 0]);
	if (v.text) {
		let str = v.text, stack = '';
		if (str.includes('×')) {
			stack = str.substr(0, str.indexOf('×'));
			str = str.substr(str.indexOf('×')+1);
		}
//		if (stack && ((+stack < 10 * (+str) && +stack > 0) || (+str < 10 * (+stack) && +str > 0))) {
			if (stack) {
				if (stack.includes('.')) {
					str = billpane.formatMoney(str, v.currency);
					stack = billpane.formatQty(stack);
				} else if (str.includes('.')) {
					stack = billpane.formatMoney(stack, v.currency);
					str = billpane.formatQty(str);
				} else if (+stack > +str) {
					stack = billpane.formatMoney(stack, v.currency);
					str = billpane.formatQty(str);
				} else {
					str = billpane.formatMoney(str, v.currency);
					stack = billpane.formatQty(stack);
				}
			} else {
				if (str.includes('.')) {
					str = billpane.formatQty(str);
				} else {
					str = billpane.formatMoney(str, v.currency);
				}
			}
//		}
		if (stack) {
			str = stack + ' × ' + str;
		}
		let w = defaultFont.calcWidth(str);
		mat4.translate(m,m, [-w, 0, 0]);
		defaultFont.draw(0,0, str, config.themeColors.uiDataEntryText, v.mat, m);
		mat4.translate(m,m, [-w, 0, 0]);
	}
	if (true) { // show sign hint
		let str = v.options.negate? '- ': '+ ';
		let w = defaultFont.calcWidth(str);
		mat4.translate(m,m, [-w, 0, 0]);
		let pos0 = vec3.create(); mat4.getTranslation(pos0, m);
		defaultFont.draw(0,0, str, v.options.negate? config.themeColors.uiDataEntryText: config.themeColors.uiDataEntryGhostText, v.mat, m);
		let pos1 = vec3.create(); mat4.getTranslation(pos1, m);
		
		// Update sign gadget geometry in real time.
		let g = billpane.textbox.signGad;
		g.x = pos0[0];
		g.y = pos0[1] - 14;
		g.w = pos1[0] - pos0[0];
		g.h = 16;
		g.autoHull();
	}

	if (v.cursorState != v.cursorPrev) {
		v.cursorPrev = v.cursorState;
		billpane.textbox.timerId = setTimeout(() => { billpane.textbox.cursorState = !billpane.textbox.cursorState; billpane.textbox.setRenderFlag(true); }, 500);
	}
};
