class NostrMarketPriceList extends PriceList {
	constructor() {
		super();
    this.list = [
      { name: 'Product XYZ', cur: '₲', amt: 12000, qty: 1, unit: 'ea' },
      { name: 'Product UVW', cur: '₲', amt: 22000, qty: 1000, unit: 'g' },
    ]
	}

	count() {
    return this.list.length;
	}

}
