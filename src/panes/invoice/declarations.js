var invoicepane, dataentry;

class LineItem {
	constructor(item, currency, unitprice, qty, taxrate) {
		this.item = item;
		this.currency = currency;
		this.unitprice = unitprice;
		this.qty = qty;
		this.taxrate = taxrate;
	}
	isEmpty() {
		if (this.item == ''
		&&	this.unitprice == ''
		&&	this.qty == ''
		&&	this.taxrate == '')
			return true;
		else
			return false;
	}
}

