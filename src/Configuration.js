class Configuration {
	constructor() {}
	get enabledCurrencies() { return enabledcurrencies.list.selection; }
	get defaultCurrency() { return this.enabledCurrencies[defaultvendorcurrency.list.index]; }
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
	get walletType() { try { return wallettypes[walletsettings.typelist.index]; } catch (e) {} }
	get walletLNbitsURL() { try { return walletsettings.lnbitsurl.value; } catch (e) {} }
	get walletLNbitsKey() { try { return walletsettings.lnbitskey.value; } catch (e) {} }
	get walletStrikeURL() { try { return walletsettings.strikeurl.value; } catch (e) {} }
	get walletStrikeKey() { try { return walletsettings.strikekey.value; } catch (e) {} }
	get walletCoinosURL() { try { return walletsettings.coinosurl.value; } catch (e) {} }
	get walletCoinosKey() { try { return walletsettings.coinoskey.value; } catch (e) {} }
}
