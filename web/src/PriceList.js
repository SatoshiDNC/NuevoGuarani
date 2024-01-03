class PriceList {
	constructor() {
    if (PriceList.instance) return PriceList.instance

    this.texture = initTexture(gl)
    this.clear()
    PriceList.instance = this
  }

  get length() { return 0 }
  get thumbnails() { return this.texture }
  get thumbnailData() { return this.emojiData }
  get thumbnailsPerRow() { return this.cols }
  get thumbnailsPerColumn() { return this.rows }

  clear() {
    this.priceData = []
    this.emojiData = []
    this.rows = 0
    this.cols = 0
  }

  setPriceData(uid, name, currency, price, size, unit) {
    this.priceData = this.priceData.filter(item => item.uid !== uid)
    this.priceData.push({ uid, name, currency, price, size, unit })
  }

  getPriceData(text) {
    for (const item of this.priceData) {
      if (item.uid == text) return item
    }
    for (const item of this.priceData) {
      if (item.name == text) return item
    }
  }

  setEmojiDefault() {
    const loadKey = new Date()
    this._loadKey = loadKey
    this.clear()

    // configure the PriceList object
    console.log('loading default emoji texture')
    this.rows = 57
    this.cols = 57
    // const emojiEl = document.createElement('img')
    // const ref = this
    // emojiEl.addEventListener('load', function() {
    //   console.log('updating PriceList texture', ref.texture)
    //   updateTexture(gl, ref.texture, emojiEl)
    //   gl.generateMipmap(gl.TEXTURE_2D)
    //   // emojiReady = true
    //   // loadCheck()
    //   console.log('loaded PriceList texture')
    // })
    // emojiEl.src = emojiFile
    this.priceData = []
    this.emojiData = []
    const defaultEmojis = [
      { x:  6, y: 29, category: 'food', label: 'tomato', },
      { x: 55, y: 49, category: 'food', label: 'green bell pepper', },
      { x: 55, y: 50, category: 'food', label: 'yellow bell pepper', },
      { x: 55, y: 51, category: 'food', label: 'orange bell pepper', },
      { x: 55, y: 52, category: 'food', label: 'red bell pepper', },
      { x: 44, y: 13, category: 'food', label: 'onion', },
      { x: 44, y: 12, category: 'food', label: 'garlic', },
      { x: 55, y: 54, category: 'food', label: 'potato', },
      { x:  6, y: 56, category: 'food', label: 'sweet potato', },
      { x:  6, y: 14, category: 'food', label: 'chilipepper', },
      { x:  6, y: 30, category: 'food', label: 'eggplant', },
      { x: 42, y:  2, category: 'food', label: 'greens', },

      { x:  7, y: 21, category: 'food', label: 'milk', },
      { x: 44, y:  8, category: 'food', label: 'cheese', },
      { x: 44, y: 16, category: 'food', label: 'butter', },
  //	{ x:  7, y: 18, category: 'food', label: 'fried egg', },
      { x: 55, y: 53, category: 'food', label: 'eggs', },

      { x:  6, y: 54, category: 'food', label: 'bread', },
      { x:  6, y: 22, category: 'food', label: 'wheat', },
      { x:  6, y: 21, category: 'food', label: 'corn', },
  //	{ x:  7, y: 30, category: 'food', label: 'popcorn', },

      { x: 42, y:  3, category: 'food', label: 'mango', },
      { x:  6, y: 33, category: 'food', label: 'watermelon', },
      { x:  6, y: 37, category: 'food', label: 'pineapple', },
      { x:  6, y: 36, category: 'food', label: 'banana', },
      { x:  6, y: 34, category: 'food', label: 'orange', },
      { x:  6, y: 35, category: 'food', label: 'lemon', },
      { x:  6, y: 38, category: 'food', label: 'red apple', },
      { x:  6, y: 39, category: 'food', label: 'green apple', },
      { x:  6, y: 40, category: 'food', label: 'pear', },
      { x:  6, y: 31, category: 'food', label: 'grapes', },
      { x:  6, y: 32, category: 'food', label: 'cantaloupe', },
      { x:  6, y: 41, category: 'food', label: 'peach', },
      { x:  6, y: 42, category: 'food', label: 'cherries', },
      { x:  6, y: 43, category: 'food', label: 'strawberry', },

      { x:  6, y: 46, category: 'food', label: 'meat', },
      { x:  6, y: 47, category: 'food', label: 'chicken leg', },
      { x:  7, y:  3, category: 'food', label: 'shrimp', },

      { x:  7, y: 15, category: 'food', label: 'cake', },
      { x:  7, y: 33, category: 'food', label: 'birthday cake', },
      { x:  7, y:  5, category: 'food', label: 'ice cream', },
      { x:  7, y: 10, category: 'food', label: 'chocolate bar', },
      { x:  7, y: 11, category: 'food', label: 'candy', },
      { x:  7, y: 12, category: 'food', label: 'lollipop', },
      { x:  7, y:  9, category: 'food', label: 'cookie', },
      { x:  7, y: 14, category: 'food', label: 'honey', },

      { x: 44, y: 18, category: 'food', label: 'ice', },
      { x: 44, y: 17, category: 'food', label: 'terere', },
      { x:  7, y: 20, category: 'food', label: 'tea', },
      { x: 53, y:  0, category: 'food', label: 'coffee', },
      { x:  7, y: 25, category: 'food', label: 'beer', },
      { x:  7, y: 22, category: 'food', label: 'wine', },
      { x:  7, y: 29, category: 'food', label: 'champaigne', },
      { x: 44, y: 11, category: 'food', label: 'juice carton', },
      { x:  7, y: 27, category: 'food', label: 'baby formula', },

      { x: 44, y: 10, category: 'food', label: 'salt', },
      { x: 42, y:  1, category: 'food', label: 'can', },
      { x: 51, y: 39, category: 'food', label: 'bottle', },

      { x:  7, y: 17, category: 'food', label: 'soup', },
      { x:  6, y: 45, category: 'food', label: 'pizza', },
      { x: 42, y:  0, category: 'food', label: 'sandwich', },
      { x:  6, y: 44, category: 'food', label: 'hamburger', },
      { x:  6, y:  5, category: 'food', label: 'hotdog', },
      { x:  6, y:  6, category: 'food', label: 'taco', },
      { x:  6, y:  7, category: 'food', label: 'burrito', },

      { x:  5, y: 21, category: 'household', label: 'umbrella', },
      { x: 52, y: 51, category: 'household', label: 'umbrella', },
      { x:  7, y: 19, category: 'household', label: 'silverware', },
      { x:  7, y: 28, category: 'household', label: 'tableware', },
      { x:  7, y: 32, category: 'household', label: 'giftbox', },
      { x:  7, y: 44, category: 'household', label: 'balloon', },
      { x:  7, y: 54, category: 'household', label: 'backpack', },
      { x: 51, y: 43, category: 'household', label: 'teddy', },
      { x: 51, y: 44, category: 'household', label: 'broom', },
      { x: 51, y: 46, category: 'household', label: 'toilet paper', },
      { x: 51, y: 47, category: 'household', label: 'bar soap', },
      { x: 51, y: 48, category: 'household', label: 'sponge', },
      { x: 52, y:  5, category: 'household', label: 'chair', },
      { x:  6, y:  9, category: 'plant', label: 'seedling', },
      { x:  6, y: 10, category: 'plant', label: 'pinetree', },
      { x:  6, y: 11, category: 'plant', label: 'shadetree', },
      { x:  6, y: 12, category: 'plant', label: 'palmtree', },
      { x:  6, y: 13, category: 'plant', label: 'cactus', },
      { x:  6, y: 15, category: 'plant', label: 'tulip', },
      { x:  6, y: 16, category: 'plant', label: 'gardenia', },
      { x:  6, y: 17, category: 'plant', label: 'rose', },
      { x:  6, y: 18, category: 'plant', label: 'daffodil', },
      { x:  6, y: 19, category: 'plant', label: 'sunflower', },
      { x:  6, y: 20, category: 'plant', label: 'panzie', },
      { x:  6, y: 23, category: 'plant', label: 'leaves', },
      { x:  8, y:  1, category: 'tech', label: 'microphone', },
      { x:  8, y: 10, category: 'tech', label: 'microphone', },
      { x:  8, y: 13, category: 'tech', label: 'headphones', },
      { x:  8, y: 38, category: 'sports', label: 'basketball', },
      { x: 10, y: 35, category: 'sports', label: 'volleyball', },
      { x: 53, y: 56, category: 'sports', label: 'soccer ball', },
      { x: 54, y:  0, category: 'sports', label: 'baseball', },
      { x: 14, y:  6, category: 'clothing', label: 'hat', },
      { x: 14, y:  7, category: 'clothing', label: 'glasses', },
      { x: 14, y:  8, category: 'clothing', label: 'dress shirt', },
      { x: 14, y:  9, category: 'clothing', label: 'casual shirt', },
      { x: 14, y: 10, category: 'clothing', label: 'casual pants', },
      { x: 14, y: 11, category: 'clothing', label: 'sleeveless dress', },
      { x: 14, y: 14, category: 'clothing', label: 'blouse', },
      { x: 14, y: 18, category: 'clothing', label: 'casual shoe', },
      { x: 14, y: 19, category: 'clothing', label: 'sport shoe', },
      { x: 14, y: 20, category: 'clothing', label: 'high heel shoe', },
      { x: 14, y: 21, category: 'clothing', label: 'high heel sandal', },
      { x: 14, y: 22, category: 'clothing', label: 'high heel sandal', },
      { x: 14, y: 23, category: 'clothing', label: 'high heel boot', },
      { x: 51, y: 21, category: 'clothing', label: 'ball cap', },
      { x: 51, y: 22, category: 'clothing', label: 'scarf', },
      { x: 51, y: 23, category: 'clothing', label: 'gloves', },
      { x: 51, y: 24, category: 'clothing', label: 'coat', },
      { x: 51, y: 25, category: 'clothing', label: 'socks', },
      { x: 25, y: 18, category: 'category', label: 'barber', },
      { x: 25, y: 19, category: 'medical', label: 'syringe', },
      { x: 25, y: 20, category: 'medical', label: 'pill', },
      { x: 26, y:  6, category: 'financial', label: 'money bag', },
      { x: 26, y:  7, category: 'financial', label: 'currency exchange', },
      { x: 26, y:  9, category: 'financial', label: 'credit card', },
      { x: 55, y: 55, category: 'financial', label: 'lightning invoice', },
      { x: 54, y:  5, category: 'tools', label: 'pick', },
      { x: 55, y: 48, category: 'tools', label: 'barcode', },
    ];
    const imageUrls = []
    this._emojiBase = 57
    let xIter = 0, yIter = 0
    const ref = this
    defaultEmojis.map(({ category, label }) => {
      console.log(category, label)
      imageUrls.push(`https://${config.debugBuild?'dev-':''}ng.satoshidnc.com/emoji/96/${e.label.replaceAll(' ','_')}.png`)
      ref.emojiData.push({ x: xIter, y: yIter, category, label, })
      xIter += 1
      if (xIter >= this._emojiBase) {
        xIter = 0
        yIter += 1
      }
    })
    this.loadFinisher(imageUrls, loadKey)
  }

  loadNostrMarketData(url, key, stallId) {
    const loadKey = new Date()
    this._loadKey = loadKey
    this.clear()
    
    if (!url || !key || !stallId) return
    const asyncLogic = async () => {

      // fetch stall details
      let stall, stallCurrency
      {
        console.log('searching for stall', key != '', stallId)
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
          if (id == stallId) {
            stall = name
            stallCurrency = currency
          }
        })
      }
      if (this._loadKey != loadKey) return // abort if overcome by events

      // fetch product image URLs
      const imageUrls = []
      if (stall && stallCurrency) {
        console.log('getting products for', stall, '(', stallId, ')')
        const response = await fetch(url+'/stall/product/'+stallId+'?pending=false&api-key='+key, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });
        const json = await response.json()
        const tempList = []
        if (this._loadKey != loadKey) return // abort if overcome by events

        // configure the PriceList object
        this._emojiBase = Math.ceil(Math.sqrt(json.length))
        this.rows = this._emojiBase
        this.cols = this._emojiBase
        let xIter = 0, yIter = 0
        json.map(e => {
          const { id, name, price } = e
          const cur = Convert.LNbitsCurrencyToAppCurrency(stallCurrency)
          const amt = price
          tempList.push({ id, name, cur, amt, size: 1, unit: 'ea' })
          imageUrls.push(e.images[0])
          this.emojiData.push({ x: xIter, y: yIter, category: 'product', label: name, })
          xIter += 1
          if (xIter >= this._emojiBase) {
            xIter = 0
            yIter += 1
          }
        })
        for (const item of tempList) {
          this.setPriceData(item.id, item.name, item.cur, item.amt, item.size, item.unit)
        }
      }
      this.loadFinisher(imageUrls, loadKey)
    }
    asyncLogic()
  }

  loadFinisher(imageUrls, loadKey) {
    const asyncLogic = async () => {

      delete emojipane.lastBuilt
      delete emojipane.emojiPoints
      emojiShapes.build(this.emojiData, this._emojiBase, this._emojiBase, emojipane.emojiPoints)
      emojipane.queueLayout()

      // initialize the texture with something generic until icons load
      const iconWidth = 96
      const emojiEl = document.createElement('canvas')
      const textureContext = emojiEl.getContext("2d")
      {
        console.log('initializing texture')
        const textureWidth = this._emojiBase * iconWidth
        console.log('texture side', textureWidth)
        emojiEl.width = emojiEl.height = textureWidth
        const textureImage = textureContext.createImageData(textureWidth, textureWidth);
        for (let i = 0; i < textureWidth; i += 1) {
          for (let j = 0; j < textureWidth; j += 1) {
            let index = (j * textureWidth + i) * 4
            textureImage.data[index + 0] = i/textureWidth*127+64
            textureImage.data[index + 1] = Math.floor(((i % iconWidth) + (j % iconWidth)) / 2)/iconWidth*127+64
            textureImage.data[index + 2] = j/textureWidth*127+64
            const r = Math.sqrt(((i % iconWidth) - iconWidth/2)**2 + ((j % iconWidth) - iconWidth/2)**2)
            const o = r - (iconWidth/2 - 2)
            textureImage.data[index + 3] = (0 < 0) ? 255 : (o > 1) ? 0 : 255 - (o * 255)
          }
        }
        textureContext.putImageData(textureImage, 0, 0)
        updateTexture(gl, this.texture, emojiEl)
        gl.generateMipmap(gl.TEXTURE_2D)
      }

      // in this block, we're going to update the texture above, emoji by emoji, by getting
      // each emoji from the database cache and/or (re)creating it from the image URL.
      {
        textureContext.imageSmoothingQuality = 'high'
        let pending = imageUrls.length
        const ref = this
        imageUrls.map((url, index) => {
          const key = this.emojiData[index].label
          console.log(`loading emoji '${key}'`)

          // function to draw a single emoji into the texture image
          const updateSlot = (img, w, h) => {
            let targetWidth = w, targetHeight = h
            let i = index % ref._emojiBase, j = Math.floor(index / ref._emojiBase)
            textureContext.clearRect(i * iconWidth, j * iconWidth, iconWidth, iconWidth)
            textureContext.drawImage(img,
              i * iconWidth + Math.trunc((iconWidth-targetWidth)/2),
              j * iconWidth + Math.trunc((iconWidth-targetHeight)/2), targetWidth, targetHeight)
            i += 1
            if (i >= ref._emojiBase) {
              i = 0
              j += 1
            }
            updateTexture(gl, ref.texture, emojiEl)
            gl.generateMipmap(gl.TEXTURE_2D)
            emojipane.setRenderFlag(true)
            pending -= 1
            if (pending == 0) {
              console.log('done loading', imageUrls.length, 'emojis')
            }
          }

          // get existing database entry for this emoji
          PlatformUtil.DatabaseGet('emoji', key, (successEvent) => {

            // if there's an existing entry, use it
            const emojiRec = successEvent.target.result
            if (emojiRec !== undefined) {
              console.log('using cached emoji', successEvent)
              const blobURL = URL.createObjectURL(emojiRec.blob)
              const img = document.createElement('img')
              img.addEventListener('load', function() {
                if (ref._loadKey != loadKey) return // abort if overcome by events
                console.log(`updating icon '${emojiRec.key}' from local storage`)
                updateSlot(img, img.width, img.height)
              });
              img.src = blobURL
            }

            // reload from URL if it makes sense
            if (emojiRec === undefined) {
              const img = document.createElement('img')
              img.crossOrigin ='anonymous'
              img.onerror = () => {
                if (ref._loadKey != loadKey) return // abort if overcome by events
                console.log('error loading image', img.src)
              }
              img.addEventListener('load', function() {
                console.log('updating icon from', img.src)
                let targetWidth = iconWidth - 2, targetHeight = iconWidth - 2
                if (img.width > img.height) {
                  targetHeight = targetWidth * img.height / img.width
                } else {
                  targetWidth = targetHeight * img.width / img.height
                }

                // cache a scaled-down copy in our local emoji table
                const oc = document.createElement('canvas')
                const octx = oc.getContext('2d')
                oc.width = targetWidth
                oc.height = targetHeight
                octx.drawImage(img, 0, 0, oc.width, oc.height)
                console.log('converting to blob')
                oc.toBlob(blob => {
                  console.log('blob: ', blob)
                  if (!blob) console.log('blob creation failed')
                  const newRec = { key, blob }
                  PlatformUtil.DatabasePut('emoji', newRec, newRec.key, successEvent => {
                    console.log('emoji stored:', JSON.stringify(newRec))
                  })
                })

                // update the texture with a scaled-down copy of the image
                if (ref._loadKey != loadKey) return // abort if overcome by events
                updateSlot(img, targetWidth, targetHeight)
              });
              img.src = url
            }
          })
        })
      }
    }
    asyncLogic()
  }
}