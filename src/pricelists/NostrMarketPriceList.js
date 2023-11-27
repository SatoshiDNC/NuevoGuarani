class NostrMarketPriceList extends PriceList {
  static list = []
  constructor() {
		super();
 	}

  get length() { return NostrMarketPriceList.list.length }
  get thumbnails() { return NostrMarketPriceList.texture }

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
      const imageUrls = []
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
          tempList.push({ name, cur, amt, qty: 1, unit: 'ea' })
          imageUrls.push(e.images[0])
          console.log(e)
        })
        NostrMarketPriceList.list = tempList
      }
      console.log(NostrMarketPriceList.list)
      console.log(imageUrls)
      {
        console.log('initializing texture')
        NostrMarketPriceList.texture = initTexture(gl)
        const emojiEl = document.createElement('canvas')
        const textureWidth = 128
        emojiEl.width = emojiEl.height = textureWidth
        const textureContext = emojiEl.getContext("2d")
        const textureImage = textureContext.createImageData(textureWidth, textureWidth);
        for (var i = 0; i < textureWidth; i += 1) {
          for (var j = 0; j < textureWidth; j += 1) {
            var index = (j * textureWidth + i) * 4;
            textureImage.data[index + 0] = i;
            textureImage.data[index + 1] = Math.floor((i + j) / 2);
            textureImage.data[index + 2] = j;
            textureImage.data[index + 3] = 255;
          }
        }
        textureContext.putImageData(textureImage, 0, 0);
        updateTexture(gl, NostrMarketPriceList.texture, emojiEl);
        gl.generateMipmap(gl.TEXTURE_2D);

        // this.emojiEl.addEventListener('load', function() {
        //   updateTexture(gl, this.emojiTex, this.emojiEl);
        //   gl.generateMipmap(gl.TEXTURE_2D);
        //   // emojiReady = true;
        //   // loadCheck();
        //   emojiTex = this.emojiTex
        // });
        // emojiEl.src = NostrMarketPriceList.list[0].imgUrl
      }
    }
    asyncLogic()
    console.groupEnd()
  }

}
