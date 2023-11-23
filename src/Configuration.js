class Configuration {
	constructor() {}
	log() {
		function listGetters (instance) {
			return Object.entries(
				Object.getOwnPropertyDescriptors(
				  Reflect.getPrototypeOf(instance)
				)
			)
			.filter(e => typeof e[1].get === 'function' && e[0] !== '__proto__')
			.map(e => e[0]);
		}
		let getters = listGetters(this);
		console.groupCollapsed('Configuration');
		for (let getter in getters) {
			var str = getters[getter];
			if (str == 'themeColors') console.log(str, colorsettings.themelist.list[colorsettings.themelist.index].title);
			else if (str == 'themeGraphics') console.log(str, this.themeGraphics.title);
			else if (str.startsWith('themeGraphics')) {}
			else if (str.startsWith('wallet')) {}
			else if (this[str] === '') {}
			else console.log(str, this[str]);
		}
		console.groupEnd();
	}
	hasCents(c) {
		return ['$', '€'].includes(c);
	}
	getDenoms(c) {
		switch (c) {
		case '$': return [
			{icon: "\x18", color: config.themeColors.uiFiatGreen , value: 10000, label: "100"},
			{icon: "\x18", color: config.themeColors.uiFiatGreen , value:  5000, label:  "50"},
			{icon: "\x18", color: config.themeColors.uiFiatGreen , value:  2000, label:  "20"},
			{icon: "\x18", color: config.themeColors.uiFiatGreen , value:  1000, label:  "10"},
			{icon: "\x18", color: config.themeColors.uiFiatGreen , value:   500, label:   "5"},
			{icon: "\x18", color: config.themeColors.uiFiatGreen , value:   100, label:   "1"},
			{icon: "\x1B", color: config.themeColors.uiCoinSilver, value:    25, label:  "25"},
			{icon: "\x19", color: config.themeColors.uiCoinSilver, value:    10, label:  "10"},
			{icon: "\x1A", color: config.themeColors.uiCoinSilver, value:     5, label:   "5"},
			{icon: "\x19", color: config.themeColors.uiCoinCopper, value:     1, label:   "1"},
			];
		case '₲': return [
			{icon: "\x18", color: config.themeColors.uiFiatGreen , value: 100000},
			{icon: "\x18", color: config.themeColors.uiFiatGreen , value:  50000},
			{icon: "\x18", color: config.themeColors.uiFiatGreen , value:  20000},
			{icon: "\x18", color: [200/255,  90/255, 80/255, 1]  , value:  10000},
			{icon: "\x18", color: [200/255,  60/255, 60/255, 1]  , value:   5000},
			{icon: "\x18", color: [120/255, 112/255, 112/255, 1] , value:   2000},
			{icon: "\x1B", color: config.themeColors.uiCoinSilver, value:   1000},
			{icon: "\x1A", color: config.themeColors.uiCoinSilver, value:    500},
			{icon: "\x19", color: config.themeColors.uiCoinSilver, value:    100},
			];
		}
		return [];
	}
	getLeeway(c) {
		const ds = this.getDenoms(c);
		const d = ds[ds.length-1];
		return d.value/2;
	}
	get debugBuild() { return releasebuild != true; }
	get showChangeBreakdown() { try { return currencysettings.showchange.state && this.cashCurrency != 'none'; } catch (e) {} }
	get mainCurrency() { try { return maincurrency.list.value; } catch (e) {} }
	get cashCurrency() { try { return cashcurrency.list.value; } catch (e) {} }
	get lightningEnabled() { try { return maincurrency.list.value == '₿' || currencysettings.enablelightning.state; } catch (e) {} }
	get businessName() { try { return accounts.current().title; } catch (e) {} }
	get businessAddress() { try { return accountsettings.locaddress.value; } catch (e) {} }
	get businessCity() { try { return accountsettings.loccity.value; } catch (e) {} }
	get businessState() { try { return accountsettings.locstate.value; } catch (e) {} }
	get businessPostalCode() { try { return accountsettings.locpostalcode.value; } catch (e) {} }
	get businessTelephone() { try { return accountsettings.telephone.value; } catch (e) {} }
	get businessTaxId() { try { return accountsettings.taxid.value; } catch (e) {} }
	get businessLicenseNumber() { try { return accountsettings.license.value; } catch (e) {} }
	get businessLicenseValidFrom() {
		try { return accountsettings.licensevalidfrom.value; } catch (e) {}
	}
	get businessLicenseValidTill() {
		try { return accountsettings.licensevalidtill.value; } catch (e) {}
	}
	get lastInvoiceNum() { return 0; }
	get cashReg() { try { return accountsettings.cashreg.value; } catch (e) {} }
	get cashier() { try { return accountsettings.cashier.value; } catch (e) {} }
	get barcodeScanningEnabled() { try { return camerasettings.itemscan.state; } catch (e) {} }
	get lightningScanningEnabled() { try { return camerasettings.lnscan.state; } catch (e) {} }
	get themeColors() {
		var g = colorsettings.themelist;
		try { return g.list[g.index].theme; } catch (e) {}
	}
	get themeGraphics() {
		var g = colorsettings.texturelist;
		try { return g.list[g.index]; } catch (e) {}
	}
	get themeGraphicsFont() {
		var g = colorsettings.texturelist;
		try { return g.list[g.index].font; } catch (e) {}
	}
	get themeGraphicsPattern() {
		var g = colorsettings.texturelist;
		try { return g.list[g.index].pattern; } catch (e) {}
	}
	get themeGraphicsScale() {
		var g = colorsettings.texturelist;
		try { return g.list[g.index].scale; } catch (e) {}
	}
/*
	get wallet() { try {
		switch (wallettypes[walletsettings.typelist.index]) {
		case 'LNbits compatible': return new LNbitsWallet(); break;
		default: return new Wallet();
		}
	} catch (e) {console.error(e)} }
*/
	get wallet() { try { return walletsettings.wallet; } catch (e) {console.error(e)} }
	get walletType() { try { return wallettypes[walletsettings.typelist.index]; } catch (e) {} }
	get walletLNbitsURL() { try { return walletsettings.lnbitsurl.value; } catch (e) {} }
	get walletLNbitsKey() { try { return walletsettings.lnbitskey.value; } catch (e) {} }
	get walletStrikeURL() { try { return walletsettings.strikeurl.value; } catch (e) {} }
	get walletStrikeKey() { try { return walletsettings.strikekey.value; } catch (e) {} }
	get walletCoinosURL() { try { return walletsettings.coinosurl.value; } catch (e) {} }
	get walletCoinosKey() { try { return walletsettings.coinoskey.value; } catch (e) {} }
  
  get priceList() { try { return pricelistsettings.pricelist; } catch {} }
}
