class SliceView extends View {
	constructor(parent, type, size1, size2) {
		super(parent);
		this.type = type; this.state = ''; this.stateNew = ''; this.stateProg = 0;
		this.sizeH = size1; this.sizeV = size2 ? size2 : size1;
		this.prop = false;
		this.threshold = 0.5;
		this.a = undefined; this.b = undefined;
		this.prevTime = 0;
		this.wideState = ''; this.tallState = '';

		// Sanity checks.
		if (!['t','l','r','b','tl','tr','bl','br'].includes(this.type))
			console.error("Warning: Invalid 'type' for SliceView.");
	}
	layoutAll(s) {
		super.layoutAll(s);
		var s1 = new LayoutState(s.totalWidth, s.totalHeight);
		var s2 = new LayoutState(s.totalWidth, s.totalHeight);
		if (s.hasArea()) {
			var sizeH = ~~(this.sizeH * (this.prop? this.w : this.getScale()));
			var sizeV = ~~(this.sizeV * (this.prop? this.h : this.getScale()));

			// Horizontal/vertical state init/transitions
			var oldState = this.stateNew;
			if (this.stateNew == '') {
				var wide = (s.remainingWidth * this.threshold
									> s.remainingHeight * (1 - this.threshold))
					? true : false;
				if (this.type == 'tl') {
					this.wideState = 'l'; this.tallState = 't';
					this.stateNew = wide ? this.wideState : this.tallState;
				} else if (this.type == 'tr') {
					this.wideState = 'r'; this.tallState = 't';
					this.stateNew = wide ? this.wideState : this.tallState;
				} else if (this.type == 'bl') {
					this.wideState = 'l'; this.tallState = 'b';
					this.stateNew = wide ? this.wideState : this.tallState;
				} else if (this.type == 'br') {
					this.wideState = 'r'; this.tallState = 't';
					this.stateNew = wide ? this.wideState : this.tallState;
				} else {
					this.stateNew = this.type;
				}
				this.state = this.stateNew;
			}
			if (this.type.length > 1) {

				var delta = 0, thisTime = Date.now();
				if (this.prevTime != 0) delta = thisTime - this.prevTime;
				this.prevTime = thisTime;
				if (delta > 17) delta = 17;

				if (s.remainingWidth * this.threshold > s.remainingHeight * (1 - this.threshold) + 2)
					this.stateNew = this.wideState;
				if (s.remainingHeight * this.threshold > s.remainingWidth * (1 - this.threshold) + 2)
					this.stateNew = this.tallState;
				if (this.stateNew != this.state || this.stateProg > 0) {
					if (this.stateNew != this.state) {
						this.stateProg += 0.008 * delta;
						if (this.stateProg >= 1) {
							this.stateProg = 1;
							this.state = this.stateNew;
						}
						if (layoutViews.indexOf(this) === -1) layoutViews.push(this);
					} else {
						this.stateProg -= 0.008 * delta;
						if (this.stateProg < 0) this.stateProg = 0;
						if (this.stateProg > 0) {
							if (layoutViews.indexOf(this) === -1) layoutViews.push(this);
						}
					}
				}
			}

			// View calculations
			if (this.layoutFunc && this.state != oldState && this.w > 0 && this.h > 0)
				this.layoutFunc.call(this);
			var ratio = (this.state == 't' || this.state == 'b')
								? sizeV / s.remainingWidth
								: sizeH / s.remainingHeight;
			var f1 = 1 - this.stateProg * (1 - ratio);
			var f2 = 1 - this.stateProg * (0 + ratio);
			if (this.state == 'l') {
				s1.remainingWidth = sizeV;
				s1.remainingHeight = ~~(s.remainingHeight * f1);
				s1.remainingX = s.remainingX;
				s2.remainingWidth = s.remainingWidth - sizeV;
				s2.remainingHeight = ~~(s.remainingHeight * f2);
				s2.remainingX = s.remainingX + sizeV;
				if (this.tallState == 't') {
					s1.remainingY = s.remainingY;
					s2.remainingY = s.remainingY + s.remainingHeight - s2.remainingHeight;
				} else {
					s1.remainingY = s.remainingY + s.remainingHeight - s1.remainingHeight;
					s2.remainingY = s.remainingY;
				}
			} else if (this.state == 'r') {
				s1.remainingWidth = sizeV;
				s1.remainingHeight = ~~(s.remainingHeight * f1);
				s1.remainingX = s.remainingX + s.remainingWidth - sizeV;
				s2.remainingWidth = s.remainingWidth - sizeV;
				s2.remainingHeight = ~~(s.remainingHeight * f2);
				s2.remainingX = s.remainingX;
				if (this.tallState == 't') {
					s1.remainingY = s.remainingY;
					s2.remainingY = s.remainingY + s.remainingHeight - s2.remainingHeight;
				} else {
					s1.remainingY = s.remainingY + s.remainingHeight - s1.remainingHeight;
					s2.remainingY = s.remainingY;
				}
			} else if (this.state == 't') {
				s1.remainingWidth = ~~(s.remainingWidth * f1);
				s1.remainingHeight = sizeH;
				s1.remainingY = s.remainingY;
				s2.remainingWidth = ~~(s.remainingWidth * f2);
				s2.remainingHeight = s.remainingHeight - sizeH;
				s2.remainingY = s.remainingY + sizeH;
				if (this.wideState == 'l') {
					s1.remainingX = s.remainingX;
					s2.remainingX = s.remainingX + s.remainingWidth - s2.remainingWidth;
				} else {
					s1.remainingX = s.remainingX + s.remainingWidth - s1.remainingWidth;
					s2.remainingX = s.remainingX;
				}
			} else if (this.state == 'b') {
				s1.remainingWidth = ~~(s.remainingWidth * f1);
				s1.remainingHeight = sizeH;
				s1.remainingY = s.remainingY + s.remainingHeight - sizeH;
				s2.remainingWidth = ~~(s.remainingWidth * f2);
				s2.remainingHeight = s.remainingHeight - sizeH;
				s2.remainingY = s.remainingY;
				if (this.wideState == 'l') {
					s1.remainingX = s.remainingX;
					s2.remainingX = s.remainingX + s.remainingWidth - s2.remainingWidth;
				} else {
					s1.remainingX = s.remainingX + s.remainingWidth - s1.remainingWidth;
					s2.remainingX = s.remainingX;
				}
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
		if (this.a) { this.a.getHits(hitList, radius); }
		if (this.b) { this.b.getHits(hitList, radius); }
  }
/*
      findGad(s, r) {
        if (this.a) this.a.findGad(s, r);
        if (this.b) this.b.findGad(s, r);
      }
      findViewport(p) {
        return (this.a && this.a.findViewport(p)) || (this.b && this.b.findViewport(p));
      }
*/
}
