class DividerView extends View {
	constructor(parent, type, ratio, dividerSize) {
		super(parent);
		this.type = type; this.state = ''; this.stateNew = ''; this.stateProg = 0;
		this.size = dividerSize;
		this.ratio = ratio; this.threshold = 1/1;
		this.ratioMin = {h: 0, v: 0}; this.ratioMax = {h: 1, v: 1};
		this.a = undefined; this.b = undefined; this.c = undefined;
		this.prevTime = 0;
	}
	layoutAll(s) {
		super.layoutAll(s);
		var s1 = new LayoutState(s.totalWidth, s.totalHeight);
		var s2 = new LayoutState(s.totalWidth, s.totalHeight);
		var s3 = new LayoutState(s.totalWidth, s.totalHeight);
		if (s.hasArea()) {
			if (this.layoutBeginFunc) this.layoutBeginFunc.call(this);
			var size = ~~(this.size * this.getScale());

			// Horizontal/vertical state init/transitions
			var oldState = this.stateNew;
			if (this.stateNew == '') {
				var wide = (s.remainingWidth / this.threshold > s.remainingHeight)
					? true : false;
				if (this.type == 'a') {
					this.stateNew = wide ? 'v' : 'h';
				} else {
					this.stateNew = this.type;
				}
				this.state = this.stateNew;
			}
			var targetratio = this.ratio;
			if (this.type == 'a') {

				var delta = 0, thisTime = Date.now();
				if (this.prevTime != 0) delta = thisTime - this.prevTime;
				this.prevTime = thisTime;
				if (delta > 17) delta = 17;

				if (s.remainingWidth / this.threshold > s.remainingHeight + 2)
					this.stateNew = 'v';
				if (s.remainingWidth / this.threshold < s.remainingHeight + 2)
					this.stateNew = 'h';
				if (this.stateNew != this.state || this.stateProg > 0) {
					if (this.stateNew != this.state) {
						this.stateProg += 0.008 * delta;
						if (this.stateProg >= 1) {
							this.stateProg = 1;
							this.state = this.stateNew;
							if (this.setPoint && this.stateNew in this.setPoint)
								this.ratio = this.setPoint[this.stateNew];
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
				var stateOther = this.state == 'v'? 'h':'v';
				if (this.setPoint && stateOther in this.setPoint)
					targetratio = this.setPoint[stateOther];
			}

			// View calculations
			if (this.layoutFunc && this.state != oldState) this.layoutFunc.call(this);
			var ratio = clamp(this.ratio, this.ratioMin[this.state], this.ratioMax[this.state]);
			if (ratio != this.ratio) {
				this.ratio = ratio;
				if (layoutViews.indexOf(this) === -1) layoutViews.push(this);
			}
			var f1 = 1 - this.stateProg * (1 - targetratio);
			var f2 = 1 - this.stateProg * (0 + targetratio);
			if (this.state == 'v') {
				var size1 = ~~((s.remainingWidth - size) * this.ratio);
				s1.remainingWidth = size1;
				 s1.remainingHeight = ~~(s.remainingHeight * f1);
					s1.remainingX = s.remainingX; s1.remainingY = s.remainingY;
				s2.remainingWidth = s.remainingWidth - size - size1;
				 s2.remainingHeight = ~~(s.remainingHeight * f2);
					s2.remainingX = s.remainingX + size1 + size;
					 s2.remainingY = s.remainingY + s.remainingHeight - s2.remainingHeight;
				s3.remainingX = s.remainingX + size1; s3.remainingY = s.remainingY;
				 s3.remainingWidth = size; s3.remainingHeight = s.remainingHeight;
			} else if (this.state == 'h') {
				var size1 = ~~((s.remainingHeight - size) * this.ratio);
				s1.remainingWidth = ~~(s.remainingWidth * f1);
				 s1.remainingHeight = size1;
					s1.remainingX = s.remainingX; s1.remainingY = s.remainingY;
				s2.remainingWidth = ~~(s.remainingWidth * f2);
				 s2.remainingHeight = s.remainingHeight - size - size1;
					s2.remainingX = s.remainingX + s.remainingWidth - s2.remainingWidth;
					 s2.remainingY = s.remainingY + size1 + size;
				s3.remainingX = s.remainingX; s3.remainingY = s.remainingY + size1;
				 s3.remainingWidth = s.remainingWidth; s3.remainingHeight = size;
			}
		} else {
			s1.clear();
			s2.clear();
			s3.clear();
		}
		if (this.a) { this.a.layoutAll(s1); }
		if (this.b) { this.b.layoutAll(s2); }
		if (this.c) { this.c.layoutAll(s3); }
		if (this.layoutEndFunc) this.layoutEndFunc.call(this);
		var ratio = clamp(this.ratio, this.ratioMin[this.state], this.ratioMax[this.state]);
		if (ratio != this.ratio) {
			this.ratio = ratio;
			if (layoutViews.indexOf(this) === -1) layoutViews.push(this);
		}
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
