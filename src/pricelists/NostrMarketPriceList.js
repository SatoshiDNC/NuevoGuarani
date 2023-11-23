class NostrMarketPriceList extends PriceList {
  static list = []
  constructor() {
		super();
 	}

  static loadData(url, key, stall) {
    console.group(this.constructor.name+'(', url, key, stall, ')')
    console.log('searching for stall', key != '')
    const asyncLogic = async () => {
      console.log('getting stalls', url)
      const response = await fetch(url+'/stall?pending=false&api-key='+key, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      const json = await response.json()
      console.log(json)
      const stallId = ''
      json.map(e => { const { id, name } = e; if (name == stall) stallId = id })
      console.log(stallId)

      NostrMarketPriceList.list = [
        { name: 'Product XYZ', cur: '₲', amt: 12000, qty: 1, unit: 'ea' },
        { name: 'Product UVW', cur: '₲', amt: 22000, qty: 1000, unit: 'g' },
      ]
    }
    asyncLogic()
    console.groupEnd()
  }

	count() {
    return NostrMarketPriceList.list.length;
	}

}
