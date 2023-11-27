class PriceList {
	constructor() { PriceList.init() }

  get length() { return 0 }
  get thumbnails() { return PriceList.texture }
  get thumbnailData() { return PriceList.emojiData }

  static init() {
    if (!PriceList.texture) {
      console.log('initializing PriceList texture')
      PriceList.texture = initTexture(gl)
      const emojiEl = document.createElement('img')
      emojiEl.addEventListener('load', function() {
        console.log('updating PriceList texture')
        updateTexture(gl, PriceList.texture, emojiEl)
        gl.generateMipmap(gl.TEXTURE_2D)
        // emojiReady = true
        // loadCheck()
        console.log('loaded PriceList texture')
      })
      console.log('loading PriceList texture')
      emojiEl.src = emojiFile
    }
    PriceList.emojiData = [
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
  }
}