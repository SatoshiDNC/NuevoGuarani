class NostrMarketPriceList extends PriceList {
  static list = []
  constructor() {
		super();
 	}

  static loadData(url, key, stall) {
    console.group(this.constructor.name+'loadData(...)')
    const asyncLogic = async () => {
      let stallId, stallCurrency
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
        json.map(e => {
          const { id, name, currency } = e
          if (name == stall) {
            stallId = id
            stallCurrency = currency
          }
        })
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
        const tempList = []
        json.map(e => {
          const { name, price } = e
          const cur = Convert.LNbitsCurrencyToAppCurrency(stallCurrency)
          const amt = price
          tempList.push({ name, cur, amt, qty: 1, unit: 'ea', imgUrl: e.images[0] })
          console.log(e)
        })
        NostrMarketPriceList.list = tempList
      }
      console.log(NostrMarketPriceList.list)
      {
        console.log('initializing texture')
        this.emojiTex = initTexture(gl);
        this.emojiEl = document.createElement('img');
        this.emojiEl.addEventListener('load', function() {
          updateTexture(gl, this.emojiTex, this.emojiEl);
          gl.generateMipmap(gl.TEXTURE_2D);
          // emojiReady = true;
          // loadCheck();
          emojiTex = this.emojiTex
        });
        emojiEl.src = NostrMarketPriceList.list[0].imgUrl
      }
    }
    asyncLogic()
    console.groupEnd()
  }

	count() {
    return NostrMarketPriceList.list.length;
	}

}
