class LayoutState {
  constructor(width, height) {
    this.totalWidth = width; this.totalHeight = height;
    this.remainingX = 0; this.remainingY = 0;
    this.remainingWidth = width; this.remainingHeight = height;
  }
	hasArea() {
		return this.remainingWidth > 0 && this.remainingHeight > 0;
	}
	clear() {
    this.remainingX = 0; this.remainingY = 0;
    this.remainingWidth = 0; this.remainingHeight = 0;
	}
}
