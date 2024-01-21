    // Gadget Flags
    const GF_RELX = 1; // left edge of gadget is relative to right edge of viewport
    const GF_RELY = 2; // top edge of gadget is relative to bottom edge of viewport
    const GF_RELW = 4; // width is relative to viewport width
    const GF_RELH = 8; // height is relative to viewport height

    // Gadget Action Flags
    var GAF_CLICKABLE = 1; // whether this gadget can be clicked or tapped
    var GAF_HOLDABLE = 2; // whether it can be held down (invalid with GAF_CONTEXT_MENU)
    var GAF_CONTEXTMENU = 4; // whether this gadget can show a context menu
    var GAF_STRETCHABLE = 8; // whether this gadget can be stretched
    var GAF_DRAGGABLE_UPDOWN = 16; // whether this gadget can be dragged up or down
    var GAF_DRAGGABLE_LEFTRIGHT = 32; // whether this gadget can be dragged left or right
    var GAF_SWIPEABLE_UPDOWN = 64;
    var GAF_SWIPEABLE_LEFTRIGHT = 128;
    var GAF_SCROLLABLE_UPDOWN = 256;
    var GAF_SCROLLABLE_LEFTRIGHT = 512;
    var GAF_SCALABLE = 1024;
    var GAF_ROTATABLE = 2048;
    var GAF_DRAGGABLE = GAF_DRAGGABLE_UPDOWN | GAF_DRAGGABLE_LEFTRIGHT;
    var GAF_SWIPEABLE = GAF_SWIPEABLE_UPDOWN | GAF_SWIPEABLE_LEFTRIGHT;
    var GAF_SCROLLABLE = GAF_SCROLLABLE_UPDOWN | GAF_SCROLLABLE_LEFTRIGHT;
    var GAF_PINCHABLE = GAF_SCALABLE | GAF_ROTATABLE;
    var GAF_ALL = GAF_CLICKABLE | GAF_CONTEXTMENU | GAF_STRETCHABLE | GAF_DRAGGABLE | GAF_SCROLLABLE | GAF_PINCHABLE;
    var GAF_NUMINPUT = 4096;
    var GAF_TEXTINPUT = 8192;
    var GAF_GONEXT = 16384;
    var GAF_BACKNAV = 32768; // if set, Android back-button navigation triggers this gadget
    class Gadget {
      constructor(viewport) {
        this.viewport = viewport;
        this.mat = mat4.create(); mat4.identity(this.mat);
        this.x = 0; this.y = 0; this.w = 0; this.h = 0; this.H = 0;
        this.convexHull = []; this.extendedHulls = {}; this.boundingBoxes = {};
        this.xo = 0; this.yo = 0;
        this.enabled = true;
        this.selected = false;
        this.actionFlags = 0;
      }
      getHits(hitList, radius) {
        if (!this.enabled || this.convexHull.length == 0) return;
        var v = this.viewport, matS = vec3.create(); mat4.getScaling(matS, v.userMat);
        var r = radius/v.getScale()/matS[0], key = ''+r;
        if (!(key in this.extendedHulls)) { this.computeExtendedHull(r); this.computeBoundingBox(r); }
        var h = this.extendedHulls[key], bb = this.boundingBoxes[key];

        // bounding box check
        var ss = 1/v.getScale();
        var rxy = vec3.create();
        rxy[0] = (hitList.x - v.x - this.x / ss);
        rxy[1] = (hitList.y - v.y - this.y / ss);
        var inv = mat4.create(); mat4.invert(inv, v.userMat);
        vec3.transformMat4(rxy, rxy, inv);
        //var rx = rxy[0] * ss, ry = rxy[1] * ss;
        var rx = (hitList.x - v.x - v.ox) * ss + v.userX - this.x - this.xo, ry = (hitList.y - v.y - v.oy) * ss + v.userY - this.y - this.yo;
        if (rx < bb.x1 || rx >= bb.x2 || ry < bb.y1 || ry >= bb.y2) return;

        // extended hull check
        function orient(ax,ay, bx,by, px,py) { return (bx-ax)*(py-ay) - (by-ay)*(px-ax); }
        var n = h.length;
        var flag = true;
        for (var i=0; i<n; i+=2) {
          var o = orient(h[i+0],h[i+1], h[(i+2)%n],h[(i+3)%n], rx,ry);
          if (o<0) flag = false;
        }
        if (!flag) return;

        // convex hull check
        var n = this.convexHull.length;
        var flag = true;
        for (var i=0; i<n; i+=2) {
          var o = orient(this.convexHull[i+0],this.convexHull[i+1], this.convexHull[(i+2)%n],this.convexHull[(i+3)%n], rx,ry);
          if (o<0) flag = false;
        }
        var d = 0; if (!flag) d = this.distToHull(rx, ry);
        hitList.hits.push({ gad: this, dist: d });
      }
			autoHull() {
				var g = this;
				g.convexHull = g.computeHull([0,0, g.w,0, g.w,g.h, 0,g.h]);
				g.extendedHulls = {}; g.boundingBoxes = {};
			}
      computeHull(points) {
        var S = [...points];
        var T = [];
        var a = 0, b = 0, ax = S[0], bx = S[0];
        for (var i = 0; i < ~~(S.length / 2); i++) {
          if (S[i*2] < ax) { ax = S[i*2]; a = i; }
          if (S[i*2] > bx) { bx = S[i*2]; b = i; }
        }
        T[T.length] = S[a*2+0]; T[T.length] = S[a*2+1];
        T[T.length] = S[b*2+0]; T[T.length] = S[b*2+1];
        S.splice(a*2, 2); if (b < a) S.splice(b*2, 2); else S.splice(b*2-2, 2);
        var S1 = [], S2 = [];
        function orient(ax,ay, bx,by, px,py) { return (bx-ax)*(py-ay) - (by-ay)*(px-ax); }
        for (var i = 0; i < ~~(S.length / 2); i++) {
          if (orient(points[a*2+0],points[a*2+1], points[b*2+0],points[b*2+1], S[i*2+0],S[i*2+1]) < 0) {
            S1[S1.length] = S[i*2+0]; S1[S1.length] = S[i*2+1]; } else { S2[S2.length] = S[i*2+0]; S2[S2.length] = S[i*2+1];
          }
        }
        function sqr(x) { return x * x }
        function dist2(vx,vy, wx,wy) { return sqr(vx - wx) + sqr(vy - wy) }
        function distToSegmentSquared(px,py, vx,vy, wx,wy) {
          var l2 = dist2(vx,vy, wx,wy);
          if (l2 == 0) return dist2(px,py, vx,vy);
          var t = ((px - vx) * (wx - vx) + (py - vy) * (wy - vy)) / l2;
          t = Math.max(0, Math.min(1, t));
          return dist2(px,py, vx + t * (wx - vx), vy + t * (wy - vy));
        }
        function distToSegment(px,py, vx,vy, wx,wy, ddd) { return Math.sqrt(distToSegmentSquared(px,py, vx,vy, wx,wy)); }
        function recurse(T, Sk, Px,Py, Qx,Qy) {
          if (Sk.length < 2) return;
          var p = 0, pd = 0;
          for (var i = 0; i < ~~(Sk.length/2); i++) {
            var d = distToSegment(Sk[i*2+0],Sk[i*2+1], Px,Py, Qx,Qy);
            if (d > pd) { pd = d; p = i; }
          }
          var Cx = Sk[p*2+0], Cy = Sk[p*2+1];
          Sk.splice(p*2, 2);
          for (i = 0; i < ~~(T.length/2); i++) {
            if ((T[i*2+0] == Px && T[i*2+1] == Py && T[(i*2+2)%T.length] == Qx && T[(i*2+3)%T.length] == Qy)
            ||  (T[i*2+0] == Qx && T[i*2+1] == Qy && T[(i*2+2)%T.length] == Px && T[(i*2+3)%T.length] == Py)) {
              T.splice(i*2+2, 0, Cx,Cy); break;
            }
          }
          var S1 = [], S2 = [];
          for (var i = 0; i < ~~(Sk.length / 2); i++) {
            if (orient(Px,Py, Cx,Cy, Sk[i*2+0],Sk[i*2+1]) < 0) {
              S1[S1.length] = Sk[i*2+0]; S1[S1.length] = Sk[i*2+1];
            } // else { S2[S2.length] = Sk[i*2+0]; S2[S2.length] = Sk[i*2+1]; }
            if (orient(Cx,Cy, Qx,Qy, Sk[i*2+0],Sk[i*2+1]) < 0) {
              S2[S2.length] = Sk[i*2+0]; S2[S2.length] = Sk[i*2+1];
            } // else { S2[S2.length] = Sk[i*2+0]; S2[S2.length] = Sk[i*2+1]; }
          }
          recurse(T, S1, Px,Py, Cx,Cy);
          recurse(T, S2, Cx,Cy, Qx,Qy);
        }
        recurse(T, S1, points[a*2+0],points[a*2+1], points[b*2+0],points[b*2+1]);
        recurse(T, S2, points[b*2+0],points[b*2+1], points[a*2+0],points[a*2+1]);
        var flag = 1;
        while(flag) {
          flag = 0;
          for (var i = 0; i < ~~(T.length/2); i++) {
            if (distToSegment(T[(i*2+2)%T.length],T[(i*2+3)%T.length], T[i*2+0],T[i*2+1], T[(i*2+4)%T.length],T[(i*2+5)%T.length]) < 0.01) {
              T.splice(i*2+2, 2); flag = 1; break;
            }
          }
        }
        var newPoints = this.sortHull(T);
        return newPoints;
      }
      sortHull(points) {
        var r = [];
        var cx = 0,cy = 0, l = points.length; for (var i = 0; i < l; i+=2) { cx += points[i+0]; cy += points[i+1]; } cx /= l/2; cy /= l/2;
        var ax = cx+102, ay = cy + 1;
        function angle(i) {
          var bx = points[i+0], by = points[i+1];
          var a = Math.atan2(by - cy, bx - cx) - Math.atan2(ay - cy, ax - cx);
          while (a >  Math.PI) a -= 2*Math.PI;
          while (a < -Math.PI) a += 2*Math.PI;
          return a;
        }
        while (points.length > 0) {
          var best = 0, a = angle(0);
          for (var i = 0; i < points.length; i+=2) {
            if (angle(i) < a) { best = i; a = angle(i); }
          }
          r.push(points[best+0]); r.push(points[best+1]); points.splice(best, 2);
        }
        return r;
      }
      computeExtendedHull(radius) {
        var hull = [];
        var j=0, n=this.convexHull.length;
        for (var i=0; i<n; i+=2) {
          var ex = (this.convexHull[(i+3)%n]-this.convexHull[i+1]); // perpendicular extension vector
          var ey =-(this.convexHull[(i+2)%n]-this.convexHull[i+0]);
          var s = radius / Math.sqrt(ex*ex + ey*ey); // amount of side extension
          hull[j+0] = this.convexHull[i+0] + ex*s;
          hull[j+1] = this.convexHull[i+1] + ey*s;
          j+=2;
          hull[j+0] = this.convexHull[(i+2)%n] + ex*s;
          hull[j+1] = this.convexHull[(i+3)%n] + ey*s;
          j+=2;
        }
        for (var i=0; i<n; i+=2) {
          var v1x = this.convexHull[(i+2)%n] - this.convexHull[i+0], v1y = this.convexHull[(i+3)%n] - this.convexHull[i+1]; // corner edge vectors
          var v2x = this.convexHull[(i-2+n)%n] - this.convexHull[i+0], v2y = this.convexHull[(i-1+n)%n] - this.convexHull[i+1];
          var d = v1x * v2x + v1y * v2y;
          var m1 = Math.sqrt(v1x*v1x + v1y*v1y);
          var m2 = Math.sqrt(v2x*v2x + v2y*v2y);
          var a = Math.acos(d / (m1 * m2)); // corner angle
          var b = (Math.PI - a) / 4;
          var o = Math.tan(b) * radius // amount of corner extension

          j = i*2;
          v1x = hull[j+0] - hull[j+2];
          v1y = hull[j+1] - hull[j+3];
          m1 = Math.sqrt(v1x*v1x + v1y*v1y);
          v1x = v1x * (m1 + o) / m1;
          v1y = v1y * (m1 + o) / m1;
          hull[j+0] = v1x + hull[j+2];
          hull[j+1] = v1y + hull[j+3];

          j = ((i-2+n)%n)*2;
          v1x = hull[j+2] - hull[j+0];
          v1y = hull[j+3] - hull[j+1];
          m1 = Math.sqrt(v1x*v1x + v1y*v1y);
          v1x = v1x * (m1 + o) / m1;
          v1y = v1y * (m1 + o) / m1;
          hull[j+2] = v1x + hull[j+0];
          hull[j+3] = v1y + hull[j+1];
        }
        this.extendedHulls[''+radius] = hull;
      }
      computeBoundingBox(radius) {
        this.boundingBoxes[''+radius] = { };
        var h = this.extendedHulls[''+radius], bb = this.boundingBoxes[''+radius];
        if (h.length < 2) return;
        bb.x1 = h[0]; bb.x2 = h[0];
        bb.y1 = h[1]; bb.y2 = h[1];
        for (var i=2; i<h.length; i+=2) {
          if (h[i+0] < bb.x1) bb.x1 = h[i+0];
          if (h[i+0] > bb.x2) bb.x2 = h[i+0];
          if (h[i+1] < bb.y1) bb.y1 = h[i+1];
          if (h[i+1] > bb.y2) bb.y2 = h[i+1];
        }
      }
      distToHull(x,y) {
        function sqr(x) { return x * x }
        function dist2(vx,vy, wx,wy) { return sqr(vx - wx) + sqr(vy - wy) }
        function distToSegmentSquared(px,py, vx,vy, wx,wy) {
          var l2 = dist2(vx,vy, wx,wy);
          if (l2 == 0) return dist2(px,py, vx,vy);
          var t = ((px - vx) * (wx - vx) + (py - vy) * (wy - vy)) / l2;
          t = Math.max(0, Math.min(1, t));
          return dist2(px,py, vx + t * (wx - vx), vy + t * (wy - vy));
        }
        function distToSegment(px,py, vx,vy, wx,wy) { return Math.sqrt(distToSegmentSquared(px,py, vx,vy, wx,wy)); }
        var h = this.convexHull;
        var d = distToSegment(x,y, h[0],h[1], h[2],h[3]);
        for (var i=2; i<h.length; i+=2) {
          var t = distToSegment(x,y, h[i+0],h[i+1], h[(i+2)%h.length],h[(i+3)%h.length]);
          if (t<d) d=t;
        }
        return d;
      }
    }
