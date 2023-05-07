class ViewDivider extends View {
  constructor(parent, type, ratio, dividerSize) {
    super(parent);
    this.type = type; this.state = '';
    this.size = dividerSize;
    this.ratio = ratio;
    this.a = undefined; this.b = undefined; this.c = undefined;
  }
  layoutAll(s) {
    super.layoutAll(s);
    var s1 = new LayoutState(s.totalWidth, s.totalHeight);
    var s2 = new LayoutState(s.totalWidth, s.totalHeight);
    var s3 = new LayoutState(s.totalWidth, s.totalHeight);
    var size = ~~(this.size * this.getScale());
    var oldState = this.state;
    if (this.state == '') {
      if (s.remainingWidth > s.remainingHeight) this.state = 'v'; else this.state = 'h';
    }
    if (this.type == 'a') {
      if (s.remainingWidth > s.remainingHeight + 2) this.state = 'v';
      if (s.remainingHeight > s.remainingWidth + 2) this.state = 'h';
    } else {
      this.state = this.type;
    }
    if (this.layoutFunc && this.state != oldState) this.layoutFunc.call(this);
//if (this.state != oldState)
//console.log(this.state, s1,s2,s3);
    if (this.state == 'v') {
      var size1 = ~~((s.remainingWidth - size) * this.ratio);
      s1.remainingX = s.remainingX; s1.remainingY = s.remainingY;
      s1.remainingWidth = size1; s1.remainingHeight = s.remainingHeight;
      s2.remainingX = s.remainingX + size1 + size; s2.remainingY = s.remainingY;
      s2.remainingWidth = s.remainingWidth - size - size1; s2.remainingHeight = s.remainingHeight;
      s3.remainingX = s.remainingX + size1; s3.remainingY = s.remainingY;
      s3.remainingWidth = size; s3.remainingHeight = s.remainingHeight;
    } else if (this.state == 'h') {
      var size1 = ~~((s.remainingHeight - size) * this.ratio);
      s1.remainingX = s.remainingX; s1.remainingY = s.remainingY;
      s1.remainingWidth = s.remainingWidth; s1.remainingHeight = size1;
      s2.remainingX = s.remainingX; s2.remainingY = s.remainingY + size1 + size;
      s2.remainingWidth = s.remainingWidth; s2.remainingHeight = s.remainingHeight - size - size1;
      s3.remainingX = s.remainingX; s3.remainingY = s.remainingY + size1;
      s3.remainingWidth = s.remainingWidth; s3.remainingHeight = size;
    }
    if (this.a) { this.a.layoutAll(s1); }
    if (this.b) { this.b.layoutAll(s2); }
    if (this.c) { this.c.layoutAll(s3); }
  }
  renderAll() {
    super.renderAll();
    if (this.a && (this.a.needsRender || this.a.childRender)) { this.a.renderAll(); }
    if (this.b && (this.b.needsRender || this.b.childRender)) { this.b.renderAll(); }
    if (this.c && (this.c.needsRender || this.c.childRender)) { this.c.renderAll(); }
  }
  getHits(hitList, radius) {
    if (this.a) { this.a.getHits(hitList, radius); }
    if (this.b) { this.b.getHits(hitList, radius); }
    if (this.c) { this.c.getHits(hitList, radius); }
  }
}
