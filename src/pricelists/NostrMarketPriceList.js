class NostrMarketPriceList extends PriceList {
  static list = []
  constructor() {
		super();
 	}

  static loadData(url, key, stall) {
    console.group(this.constructor.name+'loadData(...)')
    const asyncLogic = async () => {
      let stallId
      {
        console.log('searching for stall', key != '', stall)
        console.log('getting stalls', url)
        const response = await fetch(url+'/stall?pending=false&api-key='+key, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });
        const json = await response.json()
        console.log(json)
        json.map(e => { const { id, name } = e; if (name == stall) stallId = id })
        console.log(stallId)
      }

      {
        console.log('getting products', stallId)
        const response = await fetch(url+'/stall/product/'+stallId+'?pending=false&api-key='+key, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });
        const json = await response.json()
        console.log(json)
        json.map(e => {
          console.log(e)
        })
      }

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
