    class SwipeGadget extends Gadget {
      constructor(viewport) {
        super(viewport);
        this.actionFlags = vp.GAF_SWIPEABLE_UPDOWN | vp.GAF_SCROLLABLE_UPDOWN;
        this.swipeBeginFunc = function(p) {
          var v = this.viewport, s = v.getScale();
          this.tempX = (p.ox - v.x - v.ox)/s + v.userX;
          this.tempY = (p.oy - v.y - v.oy)/s + v.userY;
        }
        this.swipeMoveFunc = function(p) {
          var v = this.viewport, s = v.getScale(), dx=0, dy=0, k=1, m=1;
          var minX = Math.max(v.minX + v.w/s, v.maxX) - v.w/s, maxX = Math.min(v.maxX - v.w/s, v.minX);
          var minY = Math.max(v.minY + v.h/s, v.maxY) - v.h/s, maxY = Math.min(v.maxY - v.h/s, v.minY);
          if (maxX < minX) { var t=minX; minX=maxX; maxX=t; }
          if (maxY < minY) { var t=minY; minY=maxY; maxY=t; }
          switch (this.actionFlags & vp.GAF_SWIPEABLE) {
          case vp.GAF_SWIPEABLE_UPDOWN:
            dy = (p.y - v.y - v.oy)/s + v.userY - this.tempY;
            v.userY = Math.min(maxY, Math.max(minY, v.userY - dy - v.oy/s)) + v.oy/s;
            v.rematrix(); this.layout();
            v.tempVX = 0; v.tempVY = p.dy;
            break;
          case vp.GAF_SWIPEABLE_LEFTRIGHT:
            dx = (p.x - v.x - v.ox)/s + v.userX - this.tempX;
            v.userX = Math.min(maxX, Math.max(minX, v.userX - dx - v.ox/s)) + v.ox/s;
            v.rematrix(); this.layout();
            v.tempVX = p.dx; v.tempVY = 0;
            break;
          case vp.GAF_SWIPEABLE_UPDOWN | vp.GAF_SWIPEABLE_LEFTRIGHT:
            dx = (p.x - v.x - v.ox)/s + v.userX - this.tempX;
            dy = (p.y - v.y - v.oy)/s + v.userY - this.tempY;
            v.userX = Math.min(maxX, Math.max(minX, v.userX - dx - v.ox/s)) + v.ox/s;
            v.userY = Math.min(maxY, Math.max(minY, v.userY - dy - v.oy/s)) + v.oy/s;
            v.rematrix(); this.layout();
            v.tempVX = p.dx; v.tempVY = p.dy;
            break;
          }
        }
        this.swipeEndFunc = function(p) {
          var v = this.viewport;
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
            var minX = Math.max(a.minX + a.w/s, a.maxX) - a.w/s, maxX = Math.min(a.maxX - a.w/s, a.minX);
            var minY = Math.max(a.minY + a.h/s, a.maxY) - a.h/s, maxY = Math.min(a.maxY - a.h/s, a.minY);
            if (maxX < minX) { var t=minX; minX=maxX; maxX=t; }
            if (maxY < minY) { var t=minY; minY=maxY; maxY=t; }
            return p[0] - a.ox/s < minX || p[0] - a.ox/s > maxX || p[1] - a.oy/s < minY || p[1] - a.oy/s > maxY;
          }
          delete this.tempX; delete this.tempY;
          v.tempDX = 0; v.tempDY = 0;
          if (v.snaps && v.snaps.length > 0) {
            var xy = calcRestingPoint([v.userX, v.userY], [v.tempVX, v.tempVY]);
            var nxy = findNearest(xy, v.snaps);
            if (!outOfBounds(xy, v)) {
              v.tempDX = nxy[0] - xy[0];
              v.tempDY = nxy[1] - xy[1];
          } }
          if (!animViews.includes(v)) animViews.push(v);
          v.setRenderFlag(true);
        }
      }
      layout() {
        var g = this, v=this.viewport, s=v.getScale();
        g.convexHull = g.computeHull([v.userX-v.ox/s,v.userY-v.oy/s, v.userX-v.ox/s,v.h/s+v.userY-v.oy/s, v.w/s+v.userX-v.ox/s,v.h/s+v.userY-v.oy/s, v.w/s+v.userX-v.ox/s,v.userY-v.oy/s]); g.extendedHulls = {}; g.boundingBoxes = {};
      }
    }
