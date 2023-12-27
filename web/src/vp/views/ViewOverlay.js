class ViewOverlay extends View {
  constructor(parent) {
    super(parent);
    this.a = undefined; this.b = undefined;
  }
  layoutAll(s) {
    super.layoutAll(s);
    if (this.layoutFunc) this.layoutFunc.call(this);
    var s1 = new LayoutState(s.totalWidth, s.totalHeight);
    var s2 = new LayoutState(s.totalWidth, s.totalHeight);
    s1.remainingX = s.remainingX; s1.remainingY = s.remainingY;
    s1.remainingWidth = s.remainingWidth; s1.remainingHeight = s.remainingHeight;
    s2.remainingX = s.remainingX; s2.remainingY = s.remainingY;
    s2.remainingWidth = s.remainingWidth; s2.remainingHeight = s.remainingHeight;
    if (this.a) { this.a.layoutAll(s1); }
    if (this.b) { this.b.layoutAll(s2); }
  }
  setRenderFlag(value) {
    super.setRenderFlag(true);
  }
  renderAll() {
    super.renderAll();
    if ((this.a && (this.a.needsRender || this.a.childRender)) || (this.b && (this.b.needsRender || this.b.childRender))) {
      this.b.renderAll(); this.a.renderAll(false);
    }
  }
  getHits(hitList, radius) {
    if (this.a) { this.a.getHits(hitList, radius); }
    if (this.b) { this.b.getHits(hitList, radius); }
  }
}
