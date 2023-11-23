class NostrMarketPriceList extends PriceList {
  static list = []
  constructor() {
		super();
 	}

  static loadData(url, key, stall) {
    console.log(url, key, stall)
    NostrMarketPriceList.list = [
      { name: 'Product XYZ', cur: '₲', amt: 12000, qty: 1, unit: 'ea' },
      { name: 'Product UVW', cur: '₲', amt: 22000, qty: 1000, unit: 'g' },
    ]
  }

	count() {
    return NostrMarketPriceList.list.length;
	}

}
