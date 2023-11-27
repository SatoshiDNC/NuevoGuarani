class NostrMarketPriceList extends PriceList {
  static list = []
  constructor() {
		super();
 	}

  get length() { return NostrMarketPriceList.list.length }
  get thumbnails() { return NostrMarketPriceList.texture }
  get thumbnailData() { return NostrMarketPriceList.emojiData }
  get thumbnailsPerRow() { return NostrMarketPriceList.emojiBase }
  get thumbnailsPerColumn() { return NostrMarketPriceList.emojiBase }

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
      NostrMarketPriceList.emojiData = []
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
        NostrMarketPriceList.emojiBase = Math.ceil(Math.sqrt(json.length))
        let xIter = 0, yIter = 0
        json.map(e => {
          const { name, price } = e
          const cur = Convert.LNbitsCurrencyToAppCurrency(stallCurrency)
          const amt = price
          tempList.push({ name, cur, amt, qty: 1, unit: 'ea' })
          imageUrls.push(e.images[0])
          NostrMarketPriceList.emojiData.push({ x: xIter, y: yIter, category: 'product', label: name, })
          xIter += 1
          if (xIter >= NostrMarketPriceList.emojiBase) {
            xIter = 0
            yIter += 1
          }
          console.log(e)
        })
        NostrMarketPriceList.list = tempList
      }
      console.log(NostrMarketPriceList.list)
      console.log(NostrMarketPriceList.emojiData)
      console.log(imageUrls)
      {
        console.log('initializing texture')
        NostrMarketPriceList.texture = initTexture(gl)
        const emojiEl = document.createElement('canvas')
        const iconWidth = 66
        const textureWidth = NostrMarketPriceList.emojiBase * iconWidth
        console.log('textureWidth', textureWidth)
        emojiEl.width = emojiEl.height = textureWidth
        const textureContext = emojiEl.getContext("2d")
        const textureImage = textureContext.createImageData(textureWidth, textureWidth);
        for (var i = 0; i < textureWidth; i += 1) {
          for (var j = 0; j < textureWidth; j += 1) {
            var index = (j * textureWidth + i) * 4;
            textureImage.data[index + 0] = i/textureWidth*127+64;
            textureImage.data[index + 1] = Math.floor(((i % iconWidth) + (j % iconWidth)) / 2)/iconWidth*127+64;
            textureImage.data[index + 2] = j/textureWidth*127+64;
            textureImage.data[index + 3] = (((i % iconWidth) - iconWidth/2)**2 + ((j % iconWidth) - iconWidth/2)**2 < (iconWidth/2)**2) ? 255 : 0;
          }
        }
        console.log(textureImage.data)
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
