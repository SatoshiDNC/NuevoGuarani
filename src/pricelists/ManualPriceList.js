class ManualPriceList extends PriceList {
	constructor() {
		super();
    this.list = [{ name: 'Product XYZ', cur: '₲', amt: 12000, qty: 1, unit: 'ea' }]
	}

  get length() { return this.list.length }
  get thumbnails() { return PriceList.texture }

}
