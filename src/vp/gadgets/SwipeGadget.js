class SwipeGadget extends Gadget {
	constructor(viewport) {
		super(viewport);
		this.actionFlags = vp.GAF_SWIPEABLE_UPDOWN | vp.GAF_SCROLLABLE_UPDOWN;
		this.flingFar = false;
		this.followUp = false; this.animState = '';
		this.doSwipe = function(next) {
console.log('doSwipe()');
			var v = this.viewport;
			if (this.actionFlags & vp.GAF_SWIPEABLE_UPDOWN | vp.GAF_SCROLLABLE_UPDOWN) {
				v.tempVX = next? -0.001: 0.001;
				v.tempVY = 0;
				v.userX = v.userX - v.tempVX;
			} else {
				v.tempVX = 0;
				v.tempVY = next? -0.001: 0.001;
				v.userY = v.userY - v.tempVY;
			}
			this.followUp = false;
			v.relayout();
			v.setRenderFlag(true);
			this.swipeEndFunc();
		}
		this.swipeBeginFunc = function(p) {
			var v = this.viewport, s = v.getScale();
			this.tempX = (p.ox - v.x - v.ox)/s + v.userX;
			this.tempY = (p.oy - v.y - v.oy)/s + v.userY;
			this.followUp = false;
		}
		this.swipeMoveFunc = function(p) {
			const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
			var v = this.viewport, s = v.getScale(), dx=0, dy=0, k=1, m=1;
			var minX = v.minX, maxX = Math.max(v.maxX - v.sw, minX);
			var minY = v.minY, maxY = Math.max(v.maxY - v.sh, minY);
			switch (this.actionFlags & vp.GAF_SWIPEABLE) {
			case vp.GAF_SWIPEABLE_UPDOWN:
				dy = (p.y - v.y - v.oy)/s + v.userY - this.tempY;
				//v.userY = clamp(clamp(v.userY - dy - v.oy/s, minY, maxY) + v.oy/s, minY, maxY);
				v.userY = clamp(v.userY - dy, minY, maxY);
				v.rematrix(); this.layout();
				v.tempVX = 0; v.tempVY = p.dy;
				break;
			case vp.GAF_SWIPEABLE_LEFTRIGHT:
				dx = (p.x - v.x - v.ox)/s + v.userX - this.tempX;
				//v.userX = clamp(clamp(v.userX - dx - v.ox/s, minX, maxX) + v.ox/s, minX, maxX);
				v.userX = clamp(v.userX - dx, minX, maxX);
				v.rematrix(); this.layout();
				v.tempVX = p.dx; v.tempVY = 0;
				break;
			case vp.GAF_SWIPEABLE_UPDOWN | vp.GAF_SWIPEABLE_LEFTRIGHT:
				dx = (p.x - v.x - v.ox)/s + v.userX - this.tempX;
				dy = (p.y - v.y - v.oy)/s + v.userY - this.tempY;
				//v.userX = clamp(clamp(v.userX - dx - v.ox/s, minX, maxX) + v.ox/s, minX, maxX);
				//v.userY = clamp(clamp(v.userY - dy - v.oy/s, minY, maxY) + v.oy/s, minY, maxY);
				v.userX = clamp(v.userX - dx, minX, maxX);
				v.userY = clamp(v.userY - dy, minY, maxY);
				v.rematrix(); this.layout();
				v.tempVX = p.dx; v.tempVY = p.dy;
				break;
			}
			this.followUp = false;
			v.relayout();
			v.setRenderFlag(true);
		}
		this.swipeEndFunc = function(p) {
			var g = this, v = g.viewport;
			function calcRestingPoint(o, r) {
				var s = v.getScale(), x = o[0], y = o[1], dx = r[0], dy = r[1], m, n;
				m = Math.sqrt(dx*dx + dy*dy);
				n = Math.floor(m * 10);
				var rem = (m * 10 - n) / 10;
				var sum = (n+1)*n / 2;
				if (m > 0) {
					x -= dx / m * (sum/10 + rem*n) * 1000/30 / s;
					y -= dy / m * (sum/10 + rem*n) * 1000/30 / s;
				}
				return [x, y];
			}
			function calcNextPoint(o, r, snaps) {
				var a = vec2.fromValues(o[0], o[1]), b = vec2.fromValues(-r[0], -r[1]);
				vec2.normalize(b, b);
				var a1 = vec2.dot(a, b);
				var bestd = 'unset', best, snap;
				if (snaps) for (snap of snaps) {
					var c = vec2.fromValues(snap[0], snap[1])
					var c1 = vec2.dot(c, b);
					var d = c1 - a1;
					if (d >= 0 && (bestd == 'unset' || d < bestd)) { bestd = d; best = snap; }
				}
				if (bestd != 'unset') return best;
				if (snaps) for (snap of snaps) {
					var c = vec2.fromValues(snap[0], snap[1])
					var c1 = vec2.dot(c, b);
					var d = Math.abs(c1 - a1);
					if (bestd == 'unset' || (d < bestd)) { bestd = d; best = snap; }
				}
				return best;
			}
			function calcNeededVelocity(d) {
				var s = v.getScale(), x, y;
				var f = d[0]<0? 1: -1;
				x = (-0.5 + f * Math.sqrt(0.25 - f * 4*5*d[0] * s * 30/1000) / 2/5);
				y = 0;//(-0.5 + Math.sqrt(0.25 - 4*5*d[0] * s * 30/1000) / 2/5);
				return [x, y];
			}
			function findNearest(s, t) {
				var b = 'unset', best, snap;
				if (t) for (snap of t) {
					var d = Math.sqrt((s[0]-snap[0])**2 + (s[1]-snap[1])**2);
					if (b == 'unset' || d < b) { b = d; best = snap; }
				}
				return best;
			}
			function outOfBounds(p, a) {
				var s = a.getScale();
				//var minX = Math.max(a.minX + a.w/s, a.maxX) - a.w/s, maxX = Math.min(a.maxX - a.w/s, a.minX);
				//var minY = Math.max(a.minY + a.h/s, a.maxY) - a.h/s, maxY = Math.min(a.maxY - a.h/s, a.minY);
				var minX = a.minX;
				var minY = a.minY;
				var maxX = a.maxX;
				var maxY = a.maxY;
				//if (maxX < minX) { var t=minX; minX=maxX; maxX=t; }
				//if (maxY < minY) { var t=minY; minY=maxY; maxY=t; }
				return p[0] - a.ox/s < minX || p[0] - a.ox/s > maxX || p[1] - a.oy/s < minY || p[1] - a.oy/s > maxY;
			}

			// This avoids the edge case of a motionless release.
			if (Math.abs(v.tempVX) < 0.001 && (g.actionFlags & vp.GAF_SWIPEABLE_LEFTRIGHT))
				v.tempVX = 0.001;
			if (Math.abs(v.tempVY) < 0.001 && (g.actionFlags & vp.GAF_SWIPEABLE_UPDOWN))
				v.tempVY = 0.001;

			delete this.tempX; delete this.tempY;
			this.targetRest = undefined;
			this.inflect = false;
			this.animState = 'decel';
			if (v.snaps && v.snaps.length > 0) {
				var xy;
				if (g.flingFar)
					xy = calcRestingPoint([v.userX, v.userY], [v.tempVX, v.tempVY]);
				else
					xy = calcNextPoint([v.userX, v.userY], [v.tempVX, v.tempVY], v.snaps);
				var nxy = findNearest(xy, v.snaps);
				this.targetRest = nxy;
				//if (nxy[0] < v.userX) v.whenLessX = true; else v.whenLessX = false;
				//if (nxy[1] < v.userY) v.whenLessY = true; else v.whenLessY = false;
				if (nxy[0] < v.userX && v.tempVX > 0) this.animState = 'accel';
				if (nxy[0] > v.userX && v.tempVX < 0) this.animState = 'accel';
				if (nxy[1] < v.userY && v.tempVY > 0) this.animState = 'accel';
				if (nxy[1] > v.userY && v.tempVY < 0) this.animState = 'accel';
			}
			v.origVX = v.tempVX;
			v.origVY = v.tempVY;
			v.newX = v.userX;
			v.newY = v.userY;
      v.magOrig = Math.sqrt(v.tempVX * v.tempVX + v.tempVY * v.tempVY);
      v.magCur = v.magOrig;
			this.followUp = true;
			this.viewport.requeueLayout();
		}
		this.followUpFunc = function() {
			if (!this.followUp) return;
			var g = this, v = g.viewport;
			switch (g.animState) {
			case 'decel':
				if (g.coast(false)) g.animState = 'done';
				break;
			case 'accel':
				if (g.coast(true)) g.animState = 'done';
				break;
			default:
				g.followUp = false;
			}
			v.requeueLayout();
		}
		this.coast = function(accel) {
			var g = this, v = g.viewport;
			var a = v;
      var s = a.getScale();
			var minX = v.minX, maxX = Math.max(v.maxX - v.sw, minX);
			var minY = v.minY, maxY = Math.max(v.maxY - v.sh, minY);
      var newX = v.newX - (v.tempVX * 1000/30 / s /*- fx*/);
      var newY = v.newY - (v.tempVY * 1000/30 / s /*- fy*/);
			if (g.targetRest && (accel || g.inflect)) {
				if (Math.sign(newX - g.targetRest[0]) != Math.sign(v.newX - g.targetRest[0])
				||  Math.sign(newY - g.targetRest[1]) != Math.sign(v.newY - g.targetRest[1])) {
					delete v.newX; delete v.newY;
					delete v.tempVX; delete v.tempVY;
					delete v.origVX; delete v.origVY;
					delete v.magOrig; delete v.magCur;
					v.userX = g.targetRest[0];
					v.userY = g.targetRest[1];
					return true;
				}
			}
			v.newX = newX;
			v.newY = newY;
			v.userX = clamp(newX, minX, maxX);
			v.userY = clamp(newY, minY, maxY);
			var magCur = accel ? v.magCur + 0.1 : v.magCur - 0.1;
			if (g.animState == 'decel' && Math.sign(magCur) != Math.sign(v.magCur)) {
				if (g.targetRest) {
					g.inflect = true;
				} else {
					delete v.newX; delete v.newY;
					delete v.tempVX; delete v.tempVY;
					delete v.origVX; delete v.origVY;
					delete v.magOrig; delete v.magCur;
					return true;
				}
			}
			v.magCur = magCur;
      v.tempVX = v.origVX / v.magOrig * v.magCur;
      v.tempVY = v.origVY / v.magOrig * v.magCur;
			return false;
		}
	}
	layout() {
		var g=this, v=g.viewport;
		g.convexHull = g.computeHull([
			Math.min(v.minX, 0), Math.min(v.minY, 0),
			Math.min(v.minX, 0), Math.max(v.maxY, v.sh),
			Math.max(v.maxX, v.sw), Math.max(v.maxY, v.sh),
			Math.max(v.maxX, v.sw), Math.min(v.minY, 0)]);
		g.extendedHulls = {}; g.boundingBoxes = {};
		v.userX = clamp(v.userX, v.minX, Math.max(v.maxX - v.sw, v.minX));
		v.userY = clamp(v.userY, v.minY, Math.max(v.maxY - v.sh, v.minY));
		if (g.followUp && g.followUpFunc) g.followUpFunc.call(g);
	}
}
