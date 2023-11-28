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
    loadKey = new Date()
    NostrMarketPriceList.loadKey = loadKey
    if (!url || !key || !stall) return
    console.log(url, key, stall)
    const asyncLogic = async () => {
      let stallId, stallCurrency
      {
        console.log('searching for stall', key != '', stall)
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
      }
      if (NostrMarketPriceList.loadKey != loadKey) return
      const imageUrls = []
      NostrMarketPriceList.emojiData = []
      {
        console.log('getting products for', stall, '(', stallId, ')')
        const response = await fetch(url+'/stall/product/'+stallId+'?pending=false&api-key='+key, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });
        const json = await response.json()
        const tempList = []
        if (NostrMarketPriceList.loadKey != loadKey) return
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
        })
        NostrMarketPriceList.list = tempList
      }

      emojiShapes.build(pricelistsettings.pricelist.thumbnailData, pricelistsettings.pricelist.thumbnailsPerRow, pricelistsettings.pricelist.thumbnailsPerColumn, emojipane.emojiPoints)

      {
        console.log('initializing texture')
        NostrMarketPriceList.texture = initTexture(gl)
        const emojiEl = document.createElement('canvas')
        const iconWidth = 66
        const textureWidth = NostrMarketPriceList.emojiBase * iconWidth
        console.log('texture side', textureWidth)
        emojiEl.width = emojiEl.height = textureWidth
        const textureContext = emojiEl.getContext("2d")
        const textureImage = textureContext.createImageData(textureWidth, textureWidth);
        for (let i = 0; i < textureWidth; i += 1) {
          for (let j = 0; j < textureWidth; j += 1) {
            let index = (j * textureWidth + i) * 4
            textureImage.data[index + 0] = i/textureWidth*127+64
            textureImage.data[index + 1] = Math.floor(((i % iconWidth) + (j % iconWidth)) / 2)/iconWidth*127+64
            textureImage.data[index + 2] = j/textureWidth*127+64
            textureImage.data[index + 3] = (((i % iconWidth) - iconWidth/2)**2 + ((j % iconWidth) - iconWidth/2)**2 < (iconWidth/2 - 1)**2) ? 255 : 0
          }
        }
        textureContext.putImageData(textureImage, 0, 0)
        updateTexture(gl, NostrMarketPriceList.texture, emojiEl)
        gl.generateMipmap(gl.TEXTURE_2D)

        {
          textureContext.imageSmoothingQuality = 'high'
          let pending = imageUrls.length
          imageUrls.map((url, index) => {
            const img = document.createElement('img')
            img.crossOrigin ='anonymous'
            img.addEventListener('load', function() {
              if (NostrMarketPriceList.loadKey != loadKey) return
              let i = index % NostrMarketPriceList.emojiBase, j = Math.floor(index / NostrMarketPriceList.emojiBase)
              let targetWidth = iconWidth - 2, targetHeight = iconWidth - 2
              if (img.width > img.height) {
                targetHeight = targetWidth * img.height / img.width
              } else {
                targetWidth = targetHeight * img.width / img.height
              }
              textureContext.clearRect(i * iconWidth, j * iconWidth, iconWidth, iconWidth)
              textureContext.drawImage(img,
                i * iconWidth + Math.trunc((iconWidth-targetWidth)/2),
                j * iconWidth + Math.trunc((iconWidth-targetHeight)/2), targetWidth, targetHeight)
              i += 1
              if (i >= NostrMarketPriceList.emojiBase) {
                i = 0
                j += 1
              }
              updateTexture(gl, NostrMarketPriceList.texture, emojiEl)
              gl.generateMipmap(gl.TEXTURE_2D)
              pending -= 1
              if (pending == 0) {
                console.log('done loading', imageUrls.length, 'emojis')
              }
            });
            img.src = url
          })
        }
      }
    }
    asyncLogic()
  }

}
