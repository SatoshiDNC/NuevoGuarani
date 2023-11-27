class PriceList {
	constructor() {
    if (!PriceList.texture) {
      console.log('initializing PriceList texture')
      PriceList.texture = initTexture(gl)
      const emojiEl = document.createElement('img')
      emojiEl.addEventListener('load', function() {
        console.log('updating PriceList texture')
        updateTexture(gl, emojiTex, emojiEl)
        gl.generateMipmap(gl.TEXTURE_2D)
        // emojiReady = true
        // loadCheck()
        console.log('loaded PriceList texture')
      })
      console.log('loading PriceList texture')
      emojiEl.src = emojiFile
    }
  }

  get length() { return 0 }
  get thumbnails() { return PriceList.texture }

}