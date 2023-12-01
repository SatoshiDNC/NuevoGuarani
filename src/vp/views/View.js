class View {
  constructor(parent) {
		this.name = "unnamed";
    this.parent = parent;
    this.designFit = undefined; this.designSize = 0; this.designScale = 0; this.designWidth = 0; this.designHeight = 0;
    this.x = 0; this.y = 0; this.w = 0; this.h = 0; this.W = 0; this.H = 0;
		this.sw = 0; this.sh = 0;
    this.userMat = mat4.create(); mat4.identity(this.userMat);
    this.ox = 0; this.oy = 0; // origin
    this.userX = 0; this.userY = 0;
    this.gadgets = [];
    this.mat = mat4.create();
    this.needsRender = true; this.childRender = true;
  }
	queueLayout() {
		if (layoutViews.indexOf(this) === -1) layoutViews.push(this);
	}
  insideFit(w,h) { this.viewScale = (this.w/w < this.h/h)? this.w/w: this.h/h; }
  layoutAll(s) {
		if (debug1 && !continuous) console.log(this.name+'::'+this.layoutAll.name);
    this.x = s.remainingX; this.y = s.remainingY;
    this.w = s.remainingWidth; this.h = s.remainingHeight;
    this.W = s.totalWidth; this.H = s.totalHeight;
    this.viewScale =
      this.designFit?
				(this.h==0?1:this.designFit[0]/this.designFit[1]>this.w/this.h?
				 this.w==0?1:this.w/this.designFit[0]:this.h==0?1:this.h/this.designFit[1]):
      this.designSize? this.w!=0&&this.h!=0?Math.sqrt(this.w*this.h/this.designSize):1:
      this.designScale? this.designScale:// * window.devicePixelRatio:
      this.designWidth? this.w==0?1:this.w/this.designWidth:
      this.designHeight? this.h==0?1:this.h/this.designHeight:
      this.parent? this.parent.viewScale: 1;
if (this.viewScale == 0) {
console.log('ZERO SCALE', this.name);
this.viewScale = 1;
}
		this.sw = this.w/this.viewScale;
		this.sh = this.h/this.viewScale;
    this.rematrix();
    if (this.layoutFunc) { this.layoutFunc.call(this); this.rematrix(); }
    this.setRenderFlag(true);
  }
  rematrix() {
		mat4.copy(this.mat, pixelPM);
    mat4.scale(this.mat, pixelPM, [canvas.width/this.w, canvas.height/this.h, 1]);
    mat4.multiply(this.mat, this.mat, this.userMat);
    mat4.translate(this.mat, this.mat, [this.ox, this.oy, 0]);
    mat4.scale(this.mat, this.mat, [this.viewScale, this.viewScale, 1]);
    mat4.translate(this.mat, this.mat, [-this.userX, -this.userY, 0]);
  }
  getRawMatrix() {
		return pixelPM;
  }
  relayout() {
    if (!this.w && !this.h) return
    var s = new LayoutState();
    s.totalWidth = this.W; s.totalHeight = this.H;
    s.remainingX = this.x; s.remainingY = this.y;
		s.remainingWidth = this.w; s.remainingHeight = this.h;
    this.layoutAll(s);
  }
  getScale() { return this.viewScale; }
  setRenderFlag(value, skipOptimization) {
    if (this.needsRender && !skipOptimization) return;
    this.needsRender = this.needsender || value;
    this.childRender = true;
    if (this.parent) this.parent.setRenderFlag(false);
    if (value && this.a) this.a.setRenderFlag(true);
    if (value && this.b) this.b.setRenderFlag(true);
    if (value && this.c) this.c.setRenderFlag(true);
  }
  renderAll(clearBackground = true) {
    this.childRender = false;
    if (this.needsRender) {
      this.needsRender = false;
			if (this.w > 0 && this.h > 0) {
				if (debug1 && !continuous)
					console.log(this.name+'::'+this.renderAll.name, this.w, this.h);
				this.clip();
		    if (clearBackground) { gl.clearColor(0,0,0,1); gl.clear(gl.COLOR_BUFFER_BIT); }
		    if (this.renderFunc) { this.renderFunc.call(this); }
			}
    }
  }
  clip() {
    gl.viewport(this.x, this.H-this.y-this.h, this.w, this.h);
    gl.scissor(this.x, this.H-this.y-this.h, this.w, this.h);
    gl.enable(gl.SCISSOR_TEST);
  }
  prepMatrix() {
    if (vp.projMat && vp.viewMat) {
      mat4.identity(vp.projMat);
      mat4.translate(vp.projMat, vp.projMat, [-1, 1, 0]);
      mat4.scale(vp.projMat, vp.projMat, [2/this.w, -2/this.h, 1]);
      mat4.identity(vp.viewMat);
      mat4.scale(vp.viewMat, vp.viewMat, [this.getScale(), this.getScale(), 1]);
      mat4.translate(vp.viewMat, vp.viewMat, [-this.panX, -this.panY, 0]);
    }
  }
  getHits(hitList, radius) {
		if (this.w <= 0 || this.h <= 0) return;
    if (hitList.x < this.x-radius || hitList.y < this.y-radius || hitList.x >= this.x+this.w+radius || hitList.y >= this.y+this.h+radius) return;
    for (const g of this.gadgets) if (g) g.getHits(hitList, radius); else console.log("Bad gadget", this);
  }
}
