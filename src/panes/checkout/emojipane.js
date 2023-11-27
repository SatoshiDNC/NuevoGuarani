const emojipane = v = new vp.View();
v.name = Object.keys({emojipane}).pop();
v.designSize = 640*400;
v.minX = 0; v.maxX = 0;
v.minY = 0; v.maxY = 0;
v.gadgets.push(v.swipeGad = new vp.SwipeGadget(v));
v.swipeGad.actionFlags = vp.GAF_SWIPEABLE_UPDOWN | vp.GAF_SCROLLABLE_UPDOWN;
v.controlOffset = 2; // number of control icons
v.gadgets.push(v.gridGad = g = new vp.Gadget(v));
	g.actionFlags = vp.GAF_CLICKABLE;
	g.x = 0; g.y = 0;
	g.clickFunc = function(e) {
		const g = this, v = g.viewport
		const i = Math.floor((e.x+v.userX*v.viewScale)/v.w*v.gridX)
		const j = Math.floor((e.y+v.userY*v.viewScale)/v.w*v.gridX)
    const index = i+j*v.gridX - v.controlOffset
    if (index == -2) { // cancel
			vp.popRoot()
			if (this.viewport.callback) this.viewport.callback.call(undefined, undefined, 'cancel')
    } else if (index == -1) { // clear
      vp.popRoot()
      if (this.viewport.callback) this.viewport.callback.call(undefined, undefined, 'clear')
    } else if (index < this.viewport.length) {
			vp.popRoot()
			if (this.viewport.callback) this.viewport.callback.call(undefined, config.priceList.thumbnailData[index].label)
		}
	}
v.layoutFunc = function() {
	const v = this;

	let w = Math.round(Math.sqrt(100 * v.sw / v.sh));
	if (w != v.lastBuilt) {
		v.lastBuilt = w;
		let i=v.controlOffset, j=0, x=w, y=0;
		let data = [];
		const nx = config.priceList.thumbnailsPerRow, ny = config.priceList.thumbnailsPerColumn;
		let category = '';
    const priceList = config.priceList
    const maxLength = priceList.length || config.priceList.thumbnailData.length
    let n = 0
		for (let e of config.priceList.thumbnailData) {
      n++; if (n > maxLength) break;
			let u = e.x+1, v = e.y+1;
			data.splice(data.length,0, i,j+1,e.x/nx,v/ny, i,j,e.x/nx,e.y/ny, );
			data.splice(data.length,0, i+1,j+1,u/nx,v/ny, i+1,j,u/nx,e.y/ny, );
			y = j+1;
			i++; if (i>=w) {
				i=0; j++;
				data.splice(data.length,0, data[data.length-4],data[data.length-3],data[data.length-2],data[data.length-1], i,j+1,e.x/nx,(e.y+1)/ny, );
			}
			category = e.category;
		}
		this.gridX = x;
		this.gridY = y;
    this.length = priceList.length || config.priceList.thumbnailData.length;
    v.emojiPoints = data
    emojiShapes.build(config.priceList.thumbnailData, config.priceList.thumbnailsPerRow, config.priceList.thumbnailsPerColumn, emojipane.emojiPoints)
	}
	v.maxX = v.sw;
	v.maxY = this.gridY * v.sw/v.gridX;
	if (v.swipeGad) v.swipeGad.layout.call(v.swipeGad);

	let g = v.gridGad;
	g.w = v.sw; g.h = v.maxY;
	g.autoHull();
}
v.renderFunc = function() {
  console.log('render emojipane')
	drawThemeBackdrop(this, config.themeColors);
	const v = this;
	const m = mat4.create();

	mat4.identity(m);
  mat4.translate(m,m, [0, 0, 0]);
  mat4.scale(m,m, [v.sw/v.gridX/24, v.sw/v.gridX/24, 1]);
  iconFont.draw(2,16+4, "\x07", config.themeColors.uiText, v.mat, m);

	mat4.identity(m);
  mat4.translate(m,m, [0, 0, 0]);
  mat4.scale(m,m, [v.sw/v.gridX/24, v.sw/v.gridX/24, 1]);
  iconFont.draw(2+24-2,16+4, "\x03", config.themeColors.uiText, v.mat, m);

  mat4.identity(m);
  mat4.translate(m,m, [0, 0, 0]);
  mat4.scale(m,m, [v.sw/v.gridX, v.sw/v.gridX, 1]);
  emojiShapes.useProg4();
  gl.uniformMatrix4fv(gl.getUniformLocation(prog4, 'uProjectionMatrix'), false, v.mat);
  gl.uniformMatrix4fv(gl.getUniformLocation(prog4, 'uModelViewMatrix'), false, m);
  gl.uniform4fv(gl.getUniformLocation(prog4, 'overallColor'), new Float32Array([1,1,1,1]));
  gl.bindTexture(gl.TEXTURE_2D, config.priceList.thumbnails);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
  emojiShapes.drawArrays4('emojis');
};
