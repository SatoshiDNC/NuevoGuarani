class PagesView extends View {
	constructor(parent, type) {
		super(parent);
		this.type = type; this.index = 0; this.indexNew = 0; this.indexProg = 0;
		this.a = undefined; this.b = undefined;
		this.pages = [];
		this.snaps = [];
		this.prevTime = 0;

		this.gadgets.push(this.swipeGad = new vp.SwipeGadget(this));
		switch (this.type) {
		case 'h': this.swipeGad.actionFlags = vp.GAF_SWIPEABLE_LEFTRIGHT | vp.GAF_SCROLLABLE_LEFTRIGHT; break;
		case 'v': this.swipeGad.actionFlags = vp.GAF_SWIPEABLE_UPDOWN | vp.GAF_SCROLLABLE_UPDOWN; break;
		default: this.swipeGad.actionFlags = 0;
		}
		this.layoutFunc = function() {
			var v = this;
			v.minX = 0; v.maxX = v.sw * v.pages.length;
			v.minY = 0; v.maxY = v.sh * v.pages.length;
			v.swipeGad.layout.call(v.swipeGad);
		}
	}
	layoutAll(s) {
		super.layoutAll(s);
		var s1 = new LayoutState(s.totalWidth, s.totalHeight);
		var s2 = new LayoutState(s.totalWidth, s.totalHeight);
		if (s.hasArea()) {

			var delta = 0, thisTime = Date.now();
			if (this.prevTime != 0) delta = thisTime - this.prevTime;
			this.prevTime = thisTime;
			if (delta > 17) delta = 17;

			var h = (this.type == 'h');
			var v = (this.type == 'v');

			this.snaps = [];
			for (var i = 0; i < this.pages.length; i++) {
				this.snaps.push([
					this.sw * i * (h?1:0),
					this.sh * i * (v?1:0)]);
			}

			// Get the index of the page that should be mostly visible.
			var oldIndex = this.index;
			if (h) this.index = clamp(Math.round(this.userX / this.sw), 0, this.pages.length-1);
			if (v) this.index = clamp(Math.round(this.userY / this.sh), 0, this.pages.length-1);
			if (this.index != oldIndex && this.pageChangeFunc) this.pageChangeFunc.call(this);

			// Determine which pages are visible and what their offsets are.
			var curPage = this.pages[this.index];
			var curX = this.userX + (h?-this.index*this.sw:0);
			var curY = this.userY + (v?-this.index*this.sh:0);
			var otherPage = undefined, otherX, otherY;
			if (h && this.index * this.sw > this.userX
			||  v && this.index * this.sh > this.userY) {
				curPage.userX = 0;
				curPage.userY = 0;
				var otherI = this.index - 1;
				if (otherI >= 0 && otherI < this.pages.length) {
					otherPage = this.pages[otherI];
					otherX = this.userX + (h?-this.index*this.sw+this.sw:0);
					otherY = this.userY + (v?-this.index*this.sh+this.sh:0);
					otherPage.userX = h?otherX*this.viewScale/otherPage.viewScale:0;
					otherPage.userY = v?otherY*this.viewScale/otherPage.viewScale:0;
				}
			} else if (h && this.index * this.sw < this.userX
							|| v && this.index * this.sh < this.userY) {
				curPage.userX = h?curX*this.viewScale/curPage.viewScale:0;
				curPage.userY = v?curY*this.viewScale/curPage.viewScale:0;
				var otherI = this.index + 1;
				if (otherI >= 0 && otherI < this.pages.length) {
					otherPage = this.pages[otherI];
					otherX = this.userX + (h?-this.index*this.sw-this.sw:0);
					otherY = this.userY + (v?-this.index*this.sh-this.sh:0);
					otherPage.userX = 0;
					otherPage.userY = 0;
				}
			} else {
				curPage.userX = 0;
				curPage.userY = 0;
			}
			this.a = curPage; curPage.parent = this;
			this.b = otherPage; if (otherPage) otherPage.parent = this;

			// View calculations
			curX *= this.viewScale;
			curY *= this.viewScale;
			s1.remainingWidth = clamp(s.remainingWidth - Math.abs(curX),
				0, s.remainingWidth);
			s1.remainingHeight = clamp(s.remainingHeight - Math.abs(curY),
				0, s.remainingHeight);
			s1.remainingX = clamp(s.remainingX - (curX < 0 ? curX : 0),
				s.remainingX, s.remainingX + s.remainingWidth);
			s1.remainingY = clamp(s.remainingY - (curY < 0 ? curY : 0),
				s.remainingY, s.remainingY + s.remainingHeight);
			if (otherPage) {
				otherX *= this.viewScale;
				otherY *= this.viewScale;
				s2.remainingWidth = clamp(s.remainingWidth - Math.abs(otherX),
					0, s.remainingWidth);
				s2.remainingHeight = clamp(s.remainingHeight - Math.abs(otherY),
					0, s.remainingHeight);
				s2.remainingX = clamp(s.remainingX - (otherX < 0 ? otherX : 0),
					s.remainingX, s.remainingX + s.remainingWidth);
				s2.remainingY = clamp(s.remainingY - (otherY < 0 ? otherY : 0),
					s.remainingY, s.remainingY + s.remainingHeight);
			} else {
				s2.clear();
			}
		} else {
			s1.clear();
			s2.clear();
		}
		if (this.a) { this.a.layoutAll(s1); }
		if (this.b) { this.b.layoutAll(s2); }
	}
	renderAll() {
		super.renderAll();
		if (this.a && (this.a.needsRender || this.a.childRender)) { this.a.renderAll(); }
		if (this.b && (this.b.needsRender || this.b.childRender)) { this.b.renderAll(); }
	}
	getHits(hitList, radius) {
		super.getHits(hitList, radius);
		if (this.a) { this.a.getHits(hitList, radius); }
		if (this.b) { this.b.getHits(hitList, radius); }
  }
}
