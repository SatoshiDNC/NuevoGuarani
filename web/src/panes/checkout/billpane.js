var billpane = v = new vp.View();
v.name = Object.keys({billpane}).pop();
v.items = [];
v.orderCurrency = config.mainCurrency;
v.conversions = {};

// Save the data pertaining to this sale.
v.saveData = function() {
  console.log('saveData()')
	var currentState = 'saved';
	const newItem = {
		store: getCurrentAccount().id,
		status: currentState,
		date: new Date(),
		"dataentry": {
			textbox: billpane.textbox.text,
			options: billpane.textbox.options,
		},
		currency: billpane.orderCurrency,
		items: billpane.items,
		subtotal: billpane.subtotal.calc(),
		//amountTendered: receivepayment.cash.text,
		//amountToReturn: returnchange.change.text,
	};
	if (JSON.stringify(billpane.conversions) != '{}') {
		newItem.conversions = billpane.conversions;
	}
	console.log('Saving', newItem);
  PlatformUtil.DatabaseAdd('sales', newItem, (event) => {
    console.log('DatabaseAdd success', event)
		delete billpane.lastLoadedKey
		delete billpane.lastLoadedTable
		delete billpane.locked
		billpane.clearData()
	})
}

// Load the data from a previous or saved sale.
v.loadData = function(table = 'sales') {
  console.log('loadData()')
	const tx = db.transaction([table], "readonly");
	const os = tx.objectStore(table);
  console.log(this.lastLoadedKey)
  console.log(this.lastLoadedTable)
  if (this.lastLoadedTable !== table) {
    delete this.lastLoadedKey
    delete this.lastLoadedTable
  }
	const range = this.lastLoadedKey? IDBKeyRange.upperBound(this.lastLoadedKey, true): undefined;
  console.log(range)
	const req = os.openCursor(range, 'prev');
	req.onsuccess = (event) => {
    console.log('cursor successfully opened')
		let cursor = event.target.result;
    //console.log('cursor', cursor)
    while (cursor && (range === undefined || cursor.key < this.lastLoadedKey)) {
      console.log('cursor contains subsequent data')
      console.log('cursor', Convert.JSONToString(cursor.value))
      //console.log(cursor.value.store)
      if (cursor.value.store == getCurrentAccount().id) {
        this.lastLoadedKey = cursor.key
        this.lastLoadedTable = table
//				setConversionRates();
        this.clearData();
        billpane.orderCurrency = cursor.value.currency;
        billpane.conversions = {};
        if (cursor.value.conversions) billpane.conversions = cursor.value.conversions;
        billpane.items = cursor.value.items;
        billpane.userY = 0;
        billpane.relayout();
        billpane.setRenderFlag(true);
        billpane.textbox.text = cursor.value.dataentry.textbox;
        billpane.textbox.options = cursor.value.dataentry.options;
        billpane.textbox.resetGads();
        billpane.textbox.setRenderFlag(true)
        billpane.subtotal.enableGads()
        billpane.subtotal.setRenderFlag(true)

        // Clear notification
        const notifCount1 = notificationState.filter(n => n.accountId == accounts.current().id).length
        notificationState = notificationState.filter(n => n.nostrMarketOrderId != cursor.value.nostrMarketOrderId)
        PlatformUtil.DatabasePut("state", notificationState, 'notifications')
        PlatformUtil.stopNotifying(Convert.StringToHashCode(accounts.current().id))
        return
      }
      try { cursor.continue() } catch (e) {
        console.log('catch continue error', Convert.JSONToString(e))
        cursor = null
      }
    }
    console.log('cursor contains no subsequent data')
    delete this.lastLoadedKey
    delete this.lastLoadedTable
    this.clearData()
    return
	};
	req.onerror = (event) => {
		console.log("Cursor error.");
	};
}

// Query conversion rate.
v.beginConversionRateQuery = function(amt, from, to) {
	if (from == to) {
		billpane.conversionRate = 1;
		billpane.setRenderFlag(true);
		if (billpane.textbox.text == '' && billpane.textbox.currency == '₿' && to == '₿') {
			billpane.textbox.text = Math.round(amt).toString();
			billpane.textbox.resetGads();
			billpane.textbox.queueLayout();
		}
		delete billpane.conversionInProgress;
		return;
	}
	console.log("begin conversion query", amt, from, to);
	let key = new Date();
	billpane.conversionKey = key;
	billpane.conversionRate = 0;
	const convtype = from +'-'+ to;
	const completionLogic = (conversionRate) => {
		billpane.conversions[convtype] = conversionRate;
		if (billpane.conversionKey == key) {
			billpane.conversionRate = conversionRate;
			billpane.setRenderFlag(true);
			if (conversionRate > 0 && billpane.textbox.text == '' && billpane.textbox.currency == '₿') {
				billpane.textbox.text = Math.round(billpane.conversionRate * amt).toString();
				billpane.textbox.resetGads();
				billpane.textbox.queueLayout();
			}
			console.log("end conversion query", amt, from, to, billpane.conversionRate);
		} else {
			console.log("conversion ignored", amt, from, to);
		}
		delete billpane.conversionInProgress;
	};
	if (billpane.conversions[convtype]) {
		let amtConv = amt * billpane.conversions[convtype];
		completionLogic((amtConv * (config.hasCents(to)?100:1)) / (amt * (config.hasCents(from)?100:1)));
	} else {
		config.wallet.getConversionRate(amt, from, to, completionLogic);
	}
}
v.getConversionRate = function(amt, from, to, callback) {
	if (from == to) {
		callback(1);
		return;
	}
	const convtype = from +'-'+ to;
	const completionLogic = (conversionRate) => {
		billpane.conversions[convtype] = conversionRate;
		console.log("end conversion query", amt, from, to, conversionRate);
		callback(conversionRate);
	};
	if (billpane.conversions[convtype]) {
		let amtConv = amt * billpane.conversions[convtype];
		completionLogic((amtConv * (config.hasCents(to)?100:1)) / (amt * (config.hasCents(from)?100:1)));
	} else {
		console.log("begin conversion query", amt, from, to);
		config.wallet.getConversionRate(amt, from, to, completionLogic);
	}
}
v.getOptimalDigits = function(rate, amt) {
	const from = amt.toString();
	const to = Math.round((+from) * (+rate)).toString();
	const rateStr = rate.toString();
	let temp = rateStr;
	let lastGood, result;
	do {
		lastGood = temp;
		let rounded = rate.toFixed(Math.max(1,temp.length-temp.indexOf('.')-2)).toString();
		//console.log(temp, rounded, rounded.substr(0, temp.length-1));
		temp = rounded.substr(0, temp.length-1);
		result = Math.round((+from) * (+temp)).toString();
	} while (temp.length > temp.indexOf('.')+1 && result == to);
	if (!lastGood.includes('.')) {
		if (rateStr.includes('.')) {
			lastGood = lastGood+rateStr.substr(rateStr.indexOf('.'), 2);
		} else {
			lastGood = lastGood+'.0';
		}
	}
	return lastGood;
}

v.minX = 0; v.minY = 0;
v.maxX = v.sw; v.maxY = v.sh;
v.gadgets.push(v.swipeGad = new vp.SwipeGadget(v));
v.swipeGad.actionFlags = vp.GAF_SWIPEABLE_UPDOWN | vp.GAF_SCROLLABLE_UPDOWN; v.swipeGad.z = -2;
v.layoutFunc = function() {
	const v = this;
	v.maxX = Math.max(v.sw, v.maxX);
	v.maxY = Math.max(v.sh, v.maxY);
	v.swipeGad.layout.call(v.swipeGad);
}
v.clearData = function() {
	billpane.orderCurrency = config.mainCurrency;
	billpane.conversions = {};
	billpane.items = [];
	billpane.setRenderFlag(true);
	billpane.textbox.text = '';
	billpane.textbox.lastUserText = '';
	billpane.textbox.options = {};
	billpane.textbox.resetGads();
	billpane.textbox.setRenderFlag(true)
	billpane.subtotal.enableGads();
	billpane.subtotal.setRenderFlag(true)
	billpane.changed = false;
}
v.toSuper = function(str) {
	let i = str.length;
	let t = '';
	while (i--) {
		switch(str[i]) {
		case '0': t = "\u2070" + t; break;
		case '1': t = "\xB9" + t; break;
		case '2': t = "\xB2" + t; break;
		case '3': t = "\xB3" + t; break;
		case '4': t = "\u2074" + t; break;
		case '5': t = "\u2075" + t; break;
		case '6': t = "\u2076" + t; break;
		case '7': t = "\u2077" + t; break;
		case '8': t = "\u2078" + t; break;
		case '9': t = "\u2079" + t; break;
		default: t = str[i] + t;
		}
	}
	return t;
}
v.formatMoney = function(s, currency = billpane.orderCurrency) {
	let negate = false; if (s.startsWith('-')) { negate = true; s = s.substr(1); }
	const c = tr(',');
	let t = '';

	// If this currency has cents, set it aside.
	let currencyHasCents = config.hasCents(currency);
	let cents = '00';
	if (currencyHasCents) {
		while (s.length < 3) s = '0'+s;
		cents = s.substr(s.length-2, s.length);
		s = s.substr(0, s.length-2);
	}

	// Add thousands separator.
	for (let i=0; i<s.length; i++) {
		t = s.substring(s.length-1-i,s.length-i) + t;
		if ((i+1)%3==0) t = c + t;
	}
	if (t.startsWith(c)) t = t.substr(1);

	// If this currency has cents, put it back.
	if (currencyHasCents) {
		t = t+this.toSuper(cents);
	}

	return (negate? '-': '') + t;
}
v.formatQty = function(s) {
	return s.replace('.', tr('.'));
}
v.formatConvRate = function(s) {
	return s.replace('.', tr('.'));
}
v.renderFunc = function() {
	drawThemeBackdrop(this, config.themeColors);
	const v = this;
	const m = mat4.create();

	const sideMargin = 8;
	const bubbleRadius = 16, bubbleSize = bubbleRadius * 2;
	const emojiWidth = 18;
	const emojiSpace = 12;
	const coziness = 4;
	const halfPad = 2;
	const textSize = 14; // instead of bubbleSize when there is no bubble background

	let y = v.sh - 8;

  function outputSubtotal(desc, value) {
		y -= halfPad + textSize;
		let str2 = icap(tr(desc)+': ');
		let str = v.formatMoney(''+value);
		let w = defaultFont.calcWidth(str) + defaultFont.calcWidth(str2);
		mat4.identity(m);
		mat4.translate(m,m, [v.sw-sideMargin-bubbleRadius+coziness-w, y+14, 0]);
		if (str2) {
			defaultFont.draw(0,0, str2, config.themeColors.uiBillChargeTextLight, v.mat, m);
		}
		defaultFont.draw(0,0, str, value < 0? colorize(config.themeColors.uiBillCredit, config.themeColors.uiBackground, config.themeColors.uiBillChargeText): config.themeColors.uiBillChargeText, v.mat, m);
		y -= halfPad;
	}

	// function outputConversionRate(label, rate, amount) {
	// 	y -= halfPad + bubbleSize;
	// 	let str2 = icap(tr(label))+': ';
	// 	let str = v.getOptimalDigits(rate, amount);//effectiverate.toFixed(Math.max(0, precision - Math.round(effectiverate).toString().length));
	// 	let w = defaultFont.calcWidth(str) + defaultFont.calcWidth(str2);
	// 	mat4.identity(m);
	// 	mat4.translate(m,m, [v.sw-sideMargin-bubbleRadius+coziness-w, y+8+14, 0]);
	// 	if (str2) {
	// 		defaultFont.draw(0,0, str2, config.themeColors.uiBillChargeTextLight, v.mat, m);
	// 	}
	// 	defaultFont.draw(0,0, str, config.themeColors.uiBillChargeText, v.mat, m);
	// 	y -= halfPad;
	// }

	function outputConversion(desc, value, convTo, fixedTarget) {
		y -= halfPad + textSize;
		const convtype = billpane.orderCurrency +'-'+ convTo;
		const a = (new Date()).getMilliseconds()/500*Math.PI/12;
		let temp, w, gear;
		let original_times = v.formatMoney(''+value) + ' × ';
		let conv = '', equals = ' = ', result = '';
		if (fixedTarget) {
			conv = v.formatConvRate(v.getOptimalDigits(fixedTarget / value, value));
			result = v.formatMoney(''+fixedTarget);
			w = defaultFont.calcWidth(original_times) + defaultFont.calcWidth(conv) + defaultFont.calcWidth(equals) + defaultFont.calcWidth(result);
		} else {
			// Kick off the conversion rate calculation if needed.
			if (!Object.keys(billpane.conversions).includes(convtype)) {
				if (!billpane.conversionInProgress) {
					billpane.conversionInProgress = true;
					billpane.beginConversionRateQuery(billpane.subtotal.calc('limitToBill'), billpane.orderCurrency, convTo);
				}
			}

			if (Object.keys(billpane.conversions).includes(convtype)) {
				const convrate = billpane.conversions[convtype];
				const convtot = Math.round(value * convrate);
				const precision = Math.max(value.toString().length, convtot.toString().length);
				//conv = v.formatConvRate(convrate.toFixed(Math.max(0, precision - Math.round(convrate).toString().length)));
				conv = v.formatConvRate(v.getOptimalDigits(convrate, value));
				result = v.formatMoney(''+convtot, convTo);
				if (convrate < 0) { conv = '____'; result = '____'; }
				w = defaultFont.calcWidth(original_times) + defaultFont.calcWidth(conv) + defaultFont.calcWidth(equals) + defaultFont.calcWidth(result);
			} else {
				gear = "\x1D";
				w = defaultFont.calcWidth(original_times) + iconFont.calcWidth(gear) + defaultFont.calcWidth(equals) + iconFont.calcWidth(gear);
				temp = mat4.create();
			}
		}
		mat4.identity(m);
		mat4.translate(m,m, [v.sw-sideMargin-bubbleRadius+coziness-w, y+14, 0]);
		defaultFont.draw(0,0, original_times, config.themeColors.uiBillChargeTextLight, v.mat, m);
		if (gear) {
			mat4.copy(temp, m);
			mat4.translate(m,m, [10, -7, 0]);
			mat4.rotate(m,m, a, [0,0,1]);
			iconFont.draw(-10,7, gear, config.themeColors.uiBillChargeTextLight, v.mat, m);
			mat4.copy(m, temp);
			mat4.translate(m,m, [20,0,0]);
		} else {
			defaultFont.draw(0,0, conv, config.themeColors.uiBillChargeTextLight, v.mat, m);
		}
		defaultFont.draw(0,0, equals, config.themeColors.uiBillChargeTextLight, v.mat, m);
		if (gear) {
			mat4.translate(m,m, [10, -7, 0]);
			mat4.rotate(m,m, a, [0,0,1]);
			iconFont.draw(-10,7, gear, config.themeColors.uiBillChargeText, v.mat, m);
			if (!billpane.timerId) billpane.timerId = setTimeout(() => { delete billpane.timerId; billpane.setRenderFlag(true); }, 100);
		} else {
			defaultFont.draw(0,0, result, config.themeColors.uiBillChargeText, v.mat, m);
		}
		y -= halfPad;

		y -= halfPad + textSize;
    let str = icap(tr(desc))+":"
    w = defaultFont.calcWidth(str);
		mat4.identity(m);
		mat4.translate(m,m, [v.sw-sideMargin-bubbleRadius+coziness-w, y+14, 0]);
		defaultFont.draw(0,0, str, config.themeColors.uiBillChargeTextLight, v.mat, m);
		y -= halfPad;
	}

	let subtotalTrigger = false;
	let convTo = billpane.orderCurrency;

	if (billpane.textbox.options.cash || billpane.textbox.options.lightning) {
		subtotalTrigger = true;
		convTo = billpane.textbox.currency;
	}
	for (let index = v.items.length-1; index >= 0; index--) {
		const item = v.items[index];
		if ((item.options.cash || item.options.lightning) && item.currency) {
			subtotalTrigger = true;
			convTo = item.currency;
			break;
		}
	}

	if (billpane.textbox.options.change) {

		let todo = 0;
		let failed_subtotal = 0;
		for (const item of billpane.items) if (item.options.emoji == 'lightning invoice') {
			if (item.options.success === undefined) todo++;
			if (item.options.success === false) failed_subtotal += Math.round(item.qty * item.unitprice);
		}
		if (todo > 0) {

			y -= halfPad + bubbleSize;
			let str2 = icap(tr(todo == 1?'paying # invoice...':'paying # invoices...'));
			str2 = str2.replace('#', todo.toString());
			let str = ''
			let w = defaultFont.calcWidth(str) + defaultFont.calcWidth(str2);
			mat4.identity(m);
			mat4.translate(m,m, [v.sw-sideMargin-bubbleRadius+coziness-w, y+8+14, 0]);
			if (str2) {
				defaultFont.draw(0,0, str2, config.themeColors.uiBillChargeTextLight, v.mat, m);
			}
			//defaultFont.draw(0,0, str, config.themeColors.uiBillChargeText, v.mat, m);
			y -= halfPad;

		} else {

			const due = -(billpane.subtotal.calc() - failed_subtotal);
			const breakdown = [];
			const denoms = config.getDenoms(billpane.orderCurrency);
			if (config.showChangeBreakdown && denoms.length > 0) {
				const lastdenom = denoms[denoms.length-1];
				const leeway = lastdenom.value / 2;
				let amt = due;
				if (amt > 0) {
					let index = 0;
					for (let denom of denoms) {
						let n = 0;
						while (amt > denom.value - leeway) {
							n++;
							amt -= denom.value;
						}
						if (n > 0) breakdown.splice(0,0, index + ':'+ n +' × '+ v.formatMoney(''+denom.value));
						index++;
					}
		//			if (amt >= leeway) {
		//				amt -= lastdenom.value;
		//				breakdown.splice(0,0, 1 +' × '+ v.formatMoney(''+lastdenom.value));
		//			}
				}
			}
			for (let str of breakdown) {
				y -= halfPad + 22;
				let t = str.substr(0, str.indexOf('×')-1);
				let i = +t.substr(0, t.indexOf(':'));
				let n = +t.substr(t.indexOf(':')+1);
				//let icons = ('\x16'+denoms[i].icon).repeat(n);
				if (denoms[i].label) str = denoms[i].label;
				else str = str.substr(str.indexOf('×')+1).trim().replace('.','').replace(',','');
				let w = iconFont.calcWidth('\x16'+denoms[i].icon);
				while (n > 0) {
					mat4.identity(m);
					mat4.translate(m,m, [v.sw-sideMargin-bubbleRadius+coziness-w*n, y+8+14, 0]);
					iconFont.draw(0,0, '\x16'+denoms[i].icon, denoms[i].color, v.mat, m);
					let mw = iconFont.calcWidth(denoms[i].icon);
					mat4.translate(m,m, [-mw, 0, 0]);
					mat4.scale(m,m, [0.5, 0.5, 1]);
					defaultFont.draw((mw*2-defaultFont.calcWidth(str))/2,-7, str, config.themeColors.uiBackground, v.mat, m);
					n--;
				}
				y -= halfPad;
			}

			const lntot = billpane.subtotal.calc('lightningPaid');
			const cashtot = billpane.subtotal.calc('cashTendered');
			if (lntot > 0) {
				if (billpane.orderCurrency != '₿') {
					outputConversion('actual conversion', billpane.subtotal.calc('limitToBill') - failed_subtotal, convTo, lntot);
				}
			} else if (cashtot) {
				if (billpane.orderCurrency == '₿') {
					outputConversion('actual conversion', billpane.subtotal.calc('limitToBill') - failed_subtotal, convTo, cashtot);
				} else {
					outputSubtotal('change due', due);
					outputSubtotal('cash tendered', billpane.subtotal.calc('cashTendered'));
				}
			}

			if (failed_subtotal > 0) {
				if (billpane.textbox.options.lightning && billpane.orderCurrency != '₿'
				||  billpane.textbox.options.cash && billpane.orderCurrency == '₿') {
					outputConversion('conversion', billpane.subtotal.calc('limitToBill') - failed_subtotal, convTo);
				}
				outputSubtotal('revised subtotal', billpane.subtotal.calc('limitToBill') - failed_subtotal);
				outputSubtotal('unpaid invoice subtotal', failed_subtotal);
			}

		}
	}

	for (let index = v.items.length-1; index >= 0; index--) {
		const item = v.items[index];
		const left = item.options.cash || item.options.lightning? true: false;
		const icon = item.options.emoji || item.options.cash || item.options.lightning;

		let desc = '';
		if (item.options.emoji) desc = icap((desc+' '+tr(item.options.emoji)).trim());
		if ((item.options.cash || item.options.lightning) && item.currency) desc = icap(tr(item.currency));
		if (item.options.desc) desc = icap(item.options.desc.trim());

		if (item.options.cash || item.options.lightning) {
			subtotalTrigger = true;
			if (item.currency) convTo = item.currency;
		} else if (subtotalTrigger) {
			subtotalTrigger = false;

			if (convTo != billpane.orderCurrency) {
				outputConversion('suggested conversion', billpane.subtotal.calc('limitToBill'), convTo);
			}

			outputSubtotal('subtotal', billpane.subtotal.calc('limitToBill'));
		}

		y -= halfPad + bubbleSize;

		let str = v.formatMoney(Math.round(item.unitprice * item.qty).toString(), item.currency);
		let str2 = item.qty == 1? '': v.formatQty(item.qty.toString()) + ' × ' + v.formatMoney(item.unitprice.toString(), item.currency) + ' = ';
		if (item.options.negate) {
			str = '-' + str;
			if (str2) str2 = '-' + str2;
		}
		let nmw = defaultFont.calcWidth(str) + defaultFont.calcWidth(str2);
		let emw = nmw; if (icon) emw += emojiWidth + emojiSpace;

		const descscale = 0.5;
		let exh = desc? 4+descscale*16: 0;
		let exw = defaultFont.calcWidth(desc) * descscale;

		let w = (exw > emw)? exw: emw;

		mainShapes.useProg2();
		gl.uniformMatrix4fv(gl.getUniformLocation(prog2, 'uProjectionMatrix'), false, v.mat);
		gl.uniform4fv(gl.getUniformLocation(prog2, 'overallColor'),
			new Float32Array((item.options.negate && !item.options.cash)? config.themeColors.uiBillCredit: config.themeColors.uiBillCharge));
		mat4.identity(m);
		mat4.translate(m,m, [Math.max(sideMargin, left?0:v.sw-sideMargin-w-bubbleRadius*2+coziness*2), y, 0]);
		mat4.scale(m,m, [bubbleRadius*2, bubbleRadius*2, 1]);
		gl.uniformMatrix4fv(gl.getUniformLocation(prog2, 'uModelViewMatrix'), false, m);
		mainShapes.drawArrays2('circle');
		mat4.identity(m);
		mat4.translate(m,m, [Math.max(sideMargin, left?0:v.sw-sideMargin-w-bubbleRadius*2+coziness*2), y-exh, 0]);
		mat4.scale(m,m, [bubbleRadius*2, bubbleRadius*2, 1]);
		gl.uniformMatrix4fv(gl.getUniformLocation(prog2, 'uModelViewMatrix'), false, m);
		mainShapes.drawArrays2('circle');
		mat4.identity(m);
		mat4.translate(m,m, [Math.min(v.sw-sideMargin, left?sideMargin+w+bubbleRadius*2-coziness*2:v.sw), y, 0]);
		mat4.scale(m,m, [-bubbleRadius*2, bubbleRadius*2, 1]);
		gl.uniformMatrix4fv(gl.getUniformLocation(prog2, 'uModelViewMatrix'), false, m);
		mainShapes.drawArrays2('circle');
		mat4.identity(m);
		mat4.translate(m,m, [Math.min(v.sw-sideMargin, left?sideMargin+w+bubbleRadius*2-coziness*2:v.sw), y-exh, 0]);
		mat4.scale(m,m, [-bubbleRadius*2, bubbleRadius*2, 1]);
		gl.uniformMatrix4fv(gl.getUniformLocation(prog2, 'uModelViewMatrix'), false, m);
		mainShapes.drawArrays2('circle');
		mat4.identity(m);
		mat4.translate(m,m, [Math.max(sideMargin+bubbleRadius, left?0:v.sw-sideMargin-bubbleRadius+coziness*2-w) * 1, y-exh, 0]);
		mat4.scale(m,m, [v.sw-sideMargin-bubbleRadius-Math.max(sideMargin+bubbleRadius, v.sw-sideMargin-bubbleRadius+coziness*2-w) * 1, 32 * 1 + exh, 1]);
		gl.uniformMatrix4fv(gl.getUniformLocation(prog2, 'uModelViewMatrix'), false, m);
		mainShapes.drawArrays2('rect');
		mat4.identity(m);
		mat4.translate(m,m, [Math.max(sideMargin, left?0:v.sw-sideMargin-w-bubbleRadius*2+coziness*2) * 1, y-exh+bubbleRadius, 0]);
		mat4.scale(m,m, [v.sw-sideMargin-Math.max(sideMargin, v.sw-sideMargin-w-bubbleRadius*2+coziness*2) * 1, 32 * 1 + exh - bubbleRadius*2, 1]);
		gl.uniformMatrix4fv(gl.getUniformLocation(prog2, 'uModelViewMatrix'), false, m);
		mainShapes.drawArrays2('rect');

		if (icon) {
			let emoji = item.options.emoji;
			mat4.identity(m);
			mat4.translate(m,m, [v.sw-sideMargin-bubbleRadius+coziness-w, y+8-4, 0]);
			mat4.scale(m,m, [24, 24, 1]);
			if (emoji) {
				emojiShapes.useProg4();
				gl.uniformMatrix4fv(gl.getUniformLocation(prog4, 'uProjectionMatrix'), false, v.mat);
				gl.uniformMatrix4fv(gl.getUniformLocation(prog4, 'uModelViewMatrix'), false, m);
				gl.bindTexture(gl.TEXTURE_2D, config.priceList.thumbnails);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
				emojiShapes.drawArrays4(emoji);
				if (emoji == 'lightning invoice' && item.options.success === true) {
					mat4.identity(m);
					mat4.translate(m,m, [v.sw-sideMargin-bubbleRadius+coziness-w, y+8-4, 0]);
					mat4.scale(m,m, [24/18, 24/18, 1]);
					iconFont.draw(-20,16, "\x10", config.themeColors.uiSuccessGreen, v.mat, m);
				}
				if (emoji == 'lightning invoice' && item.options.success === false) {
					mat4.identity(m);
					mat4.translate(m,m, [v.sw-sideMargin-bubbleRadius+coziness-w, y+8-4, 0]);
					mat4.scale(m,m, [24/18, 24/18, 1]);
					iconFont.draw(-20,16, "\x1C", config.themeColors.uiErrorRed, v.mat, m);
				}
			}
			if (item.options.cash) {
				mat4.identity(m);
				mat4.translate(m,m, [sideMargin+bubbleRadius-coziness, y+8-4, 0]);
				mat4.scale(m,m, [24/40, 24/40, 1]);
				iconFont.draw(-1,30, "\x1E", config.themeColors.uiFiatGreen, v.mat, m);
			}
			if (item.options.lightning) {
				mat4.identity(m);
				mat4.translate(m,m, [sideMargin+bubbleRadius-coziness, y+8-4, 0]);
				mat4.scale(m,m, [24/12, 24/12, 1]);
				iconFont.draw(-18/3/2, 16-18/3/2, "\x14", config.themeColors.uiLightningPurple, v.mat, m);
				iconFont.draw(-20,0, "\x13", config.themeColors.uiLightningYellow, v.mat, m);
			}
			w -= emojiWidth+emojiSpace;
		}

		w = nmw;

		mat4.identity(m);
		mat4.translate(m,m, [left?sideMargin+bubbleRadius-coziness+emojiWidth+emojiSpace:v.sw-sideMargin-bubbleRadius+coziness-w, y+8+14, 0]);
		if (str2) {
			defaultFont.draw(0,0, str2, (item.options.negate && !item.options.cash)? config.themeColors.uiBillCreditTextLight: config.themeColors.uiBillChargeTextLight, v.mat, m);
		}
		defaultFont.draw(0,0, str, (item.options.negate && !item.options.cash)? config.themeColors.uiBillCreditText: config.themeColors.uiBillChargeText, v.mat, m);

		y -= exh;
		w = (exw > emw)? exw: emw;

		mat4.identity(m);
		mat4.translate(m,m, [left?sideMargin+bubbleRadius-coziness:v.sw-sideMargin-bubbleRadius+coziness-w, y+8+14*descscale, 0]);
		mat4.scale(m,m, [descscale,descscale, 1]);
		defaultFont.draw(0,0, desc, (item.options.negate && !item.options.cash)? config.themeColors.uiBillCreditText: config.themeColors.uiBillChargeText, v.mat, m);

		y -= halfPad;
	}

	v.minY = Math.min(0, y);
	v.maxY = v.sh;
};

billpane.subtotal = v = new vp.View();
v.name = Object.keys({'billpane_subtotal':0}).pop();
v.height = 1 * (16 + 8+8 + 4 + 2 + 4);
v.gadgets.push(v.trashGad = g = new vp.Gadget(v));
	g.actionFlags = vp.GAF_CLICKABLE;
	g.todo = false;
	g.layoutFunc = function() {
		var g = this, v = g.viewport, s = v.getScale();
		g.w = v.sh*3/5; g.h = v.sh*3/5;
		g.x = (v.sh - g.w)/2; g.y = (v.sh - g.h)/2; g.z = 1;
		g.autoHull();
	}
	g.renderFunc = function() {
		const g = this;
		const mat = mat4.create();
		mat4.identity(mat);
		mat4.translate(mat,mat, [g.x,g.y,0]);
		mat4.scale(mat,mat, [g.h/18,g.h/18,1]);
		iconFont.draw(0,16, g.todo? "\x03": "\x07", config.themeColors.uiBillSubtotalLabel, g.viewport.mat, mat);
	}
	g.clickFunc = function() {
		const g = this;
		if (g.todo) {
			billpane.clearData()
			delete billpane.lastLoadedKey
			delete billpane.lastLoadedTable
		} else {
			transitionTo(home, 'min');
		}
	}
v.gadgets.push(v.receiveGad = g = new vp.Gadget(v));
	g.actionFlags = vp.GAF_CLICKABLE;
	g.enabled = true;
	g.layoutFunc = function() {
		var g = this, v = g.viewport, s = v.getScale();
		g.w = v.sh*3/5; g.h = v.sh*3/5;
		g.x = v.sw - 2 * v.sh + (v.sh - g.w)/2; g.y = (v.sh - g.h)/2; g.z = 1;
		g.autoHull();
    billpane.subtotal.enableGads()
	}
	g.renderFunc = function() {
		const g = this;
    if (!g.enabled) return
		const mat = mat4.create()
		mat4.identity(mat)
		mat4.translate(mat,mat, [g.x,g.y,0])
		mat4.scale(mat,mat, [g.h/18,g.h/18,1])
		iconFont.draw(0,16, "\x01", config.themeColors.uiBillSubtotalLabel, g.viewport.mat, mat)
    const notifs = notificationState.filter(n => n.accountId == accounts.current().id).length
    if (notifs > 0) {
      mat4.identity(mat)
      mat4.translate(mat,mat, [g.x,g.y,0])
      mat4.scale(mat,mat, [g.h/36,g.h/36,1])
      defaultFont.draw(-defaultFont.calcWidth(''+notifs)/2,12, ''+notifs, config.themeColors.uiErrorRed, g.viewport.mat, mat)
    }
	}
	g.clickFunc = function() {
    console.log('clickFunc()')
		const g = this;
    billpane.loadData('orders')
	}
v.gadgets.push(v.saveGad = g = new vp.Gadget(v));
	g.actionFlags = vp.GAF_CLICKABLE;
	g.changed = false;
	g.layoutFunc = function() {
		var g = this, v = g.viewport, s = v.getScale();
		g.w = v.sh*3/5; g.h = v.sh*3/5;
		g.x = v.sw - v.sh + (v.sh - g.w)/2; g.y = (v.sh - g.h)/2; g.z = 1;
		g.autoHull();
	}
	g.renderFunc = function() {
		const g = this;
		const mat = mat4.create();
		mat4.identity(mat);
		mat4.translate(mat,mat, [g.x,g.y,0]);
		mat4.scale(mat,mat, [g.h/18,g.h/18,1]);
		iconFont.draw(0,16, g.changed? "\x10": "\x11", config.themeColors.uiBillSubtotalLabel, g.viewport.mat, mat);
	}
	g.clickFunc = function() {
    console.log('clickFunc()')
		const g = this;
		if (g.changed) {
			billpane.saveData();
			billpane.locked = true;
		} else {
			billpane.loadData();
			billpane.locked = true;
		}
	}
v.calc = function(mode) {
	let subtotal = 0;
	switch (mode) {
	case 'cashTendered':
		for (const item of billpane.items) if (item.options.cash || item.options.lightning) {
			subtotal -= Math.round((item.options.negate? -1:1) * Math.round((item.options.cash? -1:1) * item.unitprice * item.qty));
		}
		break;
	case 'lightningPaid':
		for (const item of billpane.items) {
			if (item.options.lightning) subtotal += Math.round((item.options.negate? -1:1) * item.unitprice * item.qty);
		}
		break;
	case 'limitToBill':
		for (const item of billpane.items) {
			if (item.options.cash || item.options.lightning) break;
			subtotal += Math.round((item.options.negate? -1:1) * Math.round((item.options.cash? -1:1) * item.unitprice * item.qty));
		}
		break;
	default:
		for (const item of billpane.items) {
			if (mode == 'excludeFailed' && item.options.emoji == 'lightning invoice' && item.options.success === false) {} else {
				subtotal += Math.round((item.options.negate? -1:1) * Math.round((item.options.cash? -1:1) * item.unitprice * item.qty));
			}
			if (item.currency && item.currency != billpane.orderCurrency) subtotal = 0;
		}
	}
	return Math.round(subtotal);
}
v.includesCash = function() {
	for (const item of billpane.items) {
		if (item.options.cash) return true;
	}
	return false;
}
v.enableGads = function() {
	{
		if (billpane.items.length == 0 && billpane.textbox.text == '' && JSON.stringify(billpane.textbox.options) == '{}')
			billpane.changed = false;

		let enableState = billpane.changed;
		if (enableState !== billpane.subtotal.saveGad.changed) {
			billpane.subtotal.saveGad.changed = enableState;
			billpane.subtotal.setRenderFlag(true);
		}
  }

  {
    let enableState = !billpane.changed && config.stallKeys?.stall !== undefined
    if (enableState !== billpane.subtotal.receiveGad.enabled) {
      billpane.subtotal.receiveGad.enabled = enableState
			billpane.subtotal.setRenderFlag(true);
    }
	}

	{
		let enableState = billpane.items.length > 0 || billpane.textbox.text != '' || JSON.stringify(billpane.textbox.options) != '{}';
		if (enableState !== billpane.subtotal.trashGad.todo) {
			billpane.subtotal.trashGad.todo = enableState;
			billpane.subtotal.setRenderFlag(true);
		}
	}
}
v.layoutFunc = function() {
	for (const g of this.gadgets) {
		if (g.layoutFunc) g.layoutFunc.call(g);
	}
}
v.renderFunc = function() {
	//drawThemeBackdrop(this, config.themeColors);
	gl.clearColor(...config.themeColors.uiBillSubtotalArea);
	gl.clear(gl.COLOR_BUFFER_BIT);
	const v = this;
	const m = mat4.create();

	let subtotal = v.calc('excludeFailed');

	{
		let y = 4;

		let str = icap(subtotal < 0? tr('change due')+': ': v.includesCash()? tr('remaining: '): tr('subtotal: '));
		let str2 = billpane.formatMoney(Math.round(Math.sign(subtotal)*subtotal).toString());
		let w = defaultFont.calcWidth(str + str2);

		mainShapes.useProg2();
		gl.uniformMatrix4fv(gl.getUniformLocation(prog2, 'uProjectionMatrix'), false, v.mat);
		mat4.identity(m);
		//mat4.scale(m,m, [50/32, 50/32, 1]);
		mat4.translate(m,m, [(v.sw-w)/2 - 16, y, 0]);
		mat4.scale(m,m, [32, 32, 1]);
		gl.uniformMatrix4fv(gl.getUniformLocation(prog2, 'uModelViewMatrix'), false, m);
		gl.uniform4fv(gl.getUniformLocation(prog2, 'overallColor'),
			new Float32Array(subtotal < 0 && !v.includesCash()? config.themeColors.uiBillCredit: config.themeColors.uiBillCharge));
		mainShapes.drawArrays2('circle');
		mat4.identity(m);
		mat4.translate(m,m, [(v.sw+w)/2 - 16, y, 0]);
		//mat4.scale(m,m, [50/32, 50/32, 1]);
//		mat4.translate(m,m, [-8/2, y, 0]);
		mat4.scale(m,m, [32, 32, 1]);
		gl.uniformMatrix4fv(gl.getUniformLocation(prog2, 'uModelViewMatrix'), false, m);
		mainShapes.drawArrays2('circle');
		mat4.identity(m);
		mat4.translate(m,m, [(v.sw-w)/2, y, 0]);
		mat4.scale(m,m, [w * 1, 32 * 1, 1]);
		gl.uniformMatrix4fv(gl.getUniformLocation(prog2, 'uModelViewMatrix'), false, m);
		mainShapes.drawArrays2('rect');

		mat4.identity(m);
		//mat4.translate(m,m, [v.sw/2, y, 0]);
		//mat4.scale(m,m, [50/32, 50/32, 1]);
		mat4.translate(m,m, [(v.sw-w)/2, y + 8+14, 0]);
		defaultFont.draw(0,0, str, subtotal < 0 && !v.includesCash()? config.themeColors.uiBillCreditText: config.themeColors.uiBillSubtotalLabel, v.mat, m);
		defaultFont.draw(0,0, str2, subtotal < 0 && !v.includesCash()? config.themeColors.uiBillCreditText: config.themeColors.uiBillChargeText, v.mat, m);
	}

	mainShapes.useProg5();
	gl.enable(gl.BLEND);
	gl.uniform4fv(gl.getUniformLocation(prog5, 'overallColor'),
		new Float32Array([1,1,1,1]));
	gl.uniformMatrix4fv(gl.getUniformLocation(prog5, 'uProjectionMatrix'), false, this.mat);
	for (const g of this.gadgets) {
		if (g.renderFunc) g.renderFunc.call(g);
	}
};
