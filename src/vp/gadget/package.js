    // Gadget Flags
    const GF_RELX = 1; // left edge of gadget is relative to right edge of viewport
    const GF_RELY = 2; // top edge of gadget is relative to bottom edge of viewport
    const GF_RELW = 4; // width is relative to viewport width
    const GF_RELH = 8; // height is relative to viewport height

    // Gadget Action Flags
    var GAF_CLICKABLE = 1; // whether this gadget can be clicked or tapped
    var GAF_CONTEXTMENU = 2; // whether this gadget can show a context menu
    var GAF_STRETCHABLE = 4; // whether this gadget can be stretched
    var GAF_DRAGGABLE_UPDOWN = 8; // whether this gadget can be dragged up or down
    var GAF_DRAGGABLE_LEFTRIGHT = 16; // whether this gadget can be dragged left or right
    var GAF_SWIPEABLE_UPDOWN = 32;
    var GAF_SWIPEABLE_LEFTRIGHT = 64;
    var GAF_SCROLLABLE_UPDOWN = 128;
    var GAF_SCROLLABLE_LEFTRIGHT = 256;
    var GAF_SCALABLE = 512;
    var GAF_ROTATABLE = 1024;
    var GAF_DRAGGABLE = GAF_DRAGGABLE_UPDOWN | GAF_DRAGGABLE_LEFTRIGHT;
    var GAF_SWIPEABLE = GAF_SWIPEABLE_UPDOWN | GAF_SWIPEABLE_LEFTRIGHT;
    var GAF_SCROLLABLE = GAF_SCROLLABLE_UPDOWN | GAF_SCROLLABLE_LEFTRIGHT;
    var GAF_PINCHABLE = GAF_SCALABLE | GAF_ROTATABLE;
    var GAF_ALL = GAF_CLICKABLE | GAF_CONTEXTMENU | GAF_STRETCHABLE | GAF_DRAGGABLE | GAF_SCROLLABLE | GAF_PINCHABLE;
    class Gadget {
      constructor(viewport) {
        this.viewport = viewport;
        this.mat = mat4.create(); mat4.identity(this.mat);
        this.x = 0; this.y = 0; this.w = 0; this.h = 0; this.hLimit = 0;
        this.convexHull = []; this.extendedHulls = {}; this.boundingBoxes = {};
        this.xo = 0; this.yo = 0;
        this.enabled = true;
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
        var rxy = vec3.create(); rxy[0] = (hitList.x - v.x); rxy[1] = (hitList.y - v.y);
        var inv = mat4.create(); mat4.invert(inv, v.userMat);
        vec3.transformMat4(rxy, rxy, inv);
        var rx = rxy[0] * ss, ry = rxy[1] * ss;
        //var rx = (hitList.x - v.x - v.ox) * ss + v.userX - this.x - this.xo, ry = (hitList.y - v.y - v.oy) * ss + v.userY - this.y - this.yo;
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
    class MiddleDividerGadget extends Gadget {
      constructor(viewport) {
        super(viewport);
        this.dragBeginFunc = function(p) { this.tempX = p.ox - this.viewport.x; this.tempY = p.oy - this.viewport.y; }
        this.dragMoveFunc = function(p) {
          var v = this.viewport.parent, h=(v.state == 'h');
          var a = h? p.y - this.tempY - v.a.y: p.x - this.tempX - v.a.x;
          var b = h? v.y + v.h - (p.y - this.tempY + this.viewport.h): v.x + v.w - (p.x - this.tempX + this.viewport.w);
          v.ratio = Math.max(0, Math.min(1, a/(a+b))); this.viewport.parent.relayout();
        }
        this.dragEndFunc = function(p) { delete this.tempX; delete this.tempY; }
      }
      layout() {
        var g = this, v=this.viewport, x,y, h=(v.parent.state == 'h'), s=v.getScale(), t=v.parent.size;
        x=h?v.w/s:t; y=h?t:v.h/s; g.actionFlags = h?vp.GAF_DRAGGABLE_UPDOWN:vp.GAF_DRAGGABLE_LEFTRIGHT;
        g.convexHull = g.computeHull([0,0, 0,y, x,y, x,0]); g.extendedHulls = {}; g.boundingBoxes = {};
      }
    }
    class MatrixGadget extends Gadget {
      getTargetMat() {
        return this.targetGad? this.targetGad.mat: this.targetView.userMat;
      }
      constructor(viewport) {
        super(viewport);
        this.targetView = viewport;
        this.targetGad = undefined;

        /** DRAG **/
        this.dragBeginFunc = function(p) {
          var g = this, v = g.targetView;
          g.grab1b = vec3.create(); g.grab1b[0] = p.x-v.x; g.grab1b[1] = p.y-v.y;
          g.viewMat = mat4.create(); mat4.copy(g.viewMat, v.userMat);
          g.grabMat = mat4.create(); mat4.copy(g.grabMat, g.getTargetMat());
          if (1) {
            const vi = mat4.create(); mat4.invert(vi, g.viewMat);
            vec3.transformMat4(g.grab1b, g.grab1b, vi);
          }
          if (this.targetGad) {
            const gi = mat4.create(); mat4.invert(gi, g.grabMat);
            vec3.transformMat4(g.grab1b, g.grab1b, gi);
          }
        }
        this.dragMoveFunc = function(p) {
          var g = this, v = g.targetView;
          var g1b = vec3.create(); g1b[0] = p.x-v.x; g1b[1] = p.y-v.y;
          if (1) {
            const vi = mat4.create(); mat4.invert(vi, g.viewMat);
            vec3.transformMat4(g1b, g1b, vi);
          }
          if (this.targetGad) {
            const gi = mat4.create(); mat4.invert(gi, g.grabMat);
            vec3.transformMat4(g1b, g1b, gi);
          }
          var delta = vec3.create(); vec3.subtract(delta, g1b, g.grab1b);
          if (this.targetGad) vec3.scale(delta, delta, 1/v.getScale());
          mat4.translate(g.getTargetMat(), g.grabMat, delta);
          v.rematrix(); v.setRenderFlag(true);
        }
        this.dragEndFunc = function(p) {
          var g = this, v = g.targetView;
          delete g.grab1b;
          delete g.viewMat; delete g.grabMat;
          v.setRenderFlag(true);
        }

        /** PINCH **/
        this.pinchBeginFunc = function(p1, p2) {
          var g = this, v = g.targetView;
          g.grab1 = vec3.create(); g.grab1[0] = p1.x-v.x; g.grab1[1] = p1.y-v.y;
          g.grab2 = vec3.create(); g.grab2[0] = p2.x-v.x; g.grab2[1] = p2.y-v.y;
          g.viewMat = mat4.create(); mat4.copy(g.viewMat, v.userMat);
          g.grabMat = mat4.create(); mat4.copy(g.grabMat, g.getTargetMat());
          //vec3.scale(g.grab1, g.grab1, 1/v.getScale());
          //vec3.scale(g.grab2, g.grab2, 1/v.getScale());
          g.grabC = vec3.create();
          g.grab1b = vec3.create(); vec3.copy(g.grab1b, g.grab1);
          g.grab2b = vec3.create(); vec3.copy(g.grab2b, g.grab2);
          g.grabCb = vec3.create();
          if (1) {
            const vi = mat4.create(); mat4.invert(vi, g.viewMat);
            vec3.transformMat4(g.grab1b, g.grab1b, vi);
            vec3.transformMat4(g.grab2b, g.grab2b, vi);
          }
          if (this.targetGad) {
            const gi = mat4.create(); mat4.copy(gi, g.grabMat); //mat4.invert(gi, g.grabMat);
            vec3.transformMat4(g.grab1b, g.grab1b, gi);
            vec3.transformMat4(g.grab2b, g.grab2b, gi);
          }
          for (var i=0; i<3; i++) { g.grabC[i] = (g.grab1[i] + g.grab2[i]) / 2; g.grabCb[i] = (g.grab1b[i] + g.grab2b[i]) / 2; }
          var x = g.grab2[0]-g.grab1[0], y = g.grab2[1]-g.grab1[1];
          g.grabA = Math.atan2(y, x);
          g.grabM = Math.sqrt(x*x + y*y);
        }
        this.pinchMoveFunc = function(p1, p2) {
          var g = this, v = g.targetView;
          var g1 = vec3.create(); g1[0] = p1.x-v.x; g1[1] = p1.y-v.y;
          var g2 = vec3.create(); g2[0] = p2.x-v.x; g2[1] = p2.y-v.y;
          //vec3.scale(g1, g1, 1/v.getScale());
          //vec3.scale(g2, g2, 1/v.getScale());
          var gC = vec3.create();
          var g1b = vec3.create(), g2b = vec3.create(), gCb = vec3.create();
          vec3.copy(g1b, g1); vec3.copy(g2b, g2);
          if (1) {
            const vi = mat4.create(); mat4.invert(vi, g.viewMat);
            vec3.transformMat4(g1b, g1b, vi);
            vec3.transformMat4(g2b, g2b, vi);
          }
          if (this.targetGad) {
            const gi = mat4.create(); mat4.copy(gi, g.grabMat); //mat4.invert(gi, g.grabMat);
            vec3.transformMat4(g1b, g1b, gi);
            vec3.transformMat4(g2b, g2b, gi);
          }
          for (var i=0; i<3; i++) { gC[i] = (g1[i] + g2[i]) / 2; gCb[i] = (g1b[i] + g2b[i]) / 2; }
          var x = g2[0]-g1[0], y = g2[1]-g1[1];
          var gA = Math.atan2(y, x);
          var gM = Math.sqrt(x*x + y*y);

          //const vi = mat4.create(); mat4.invert(vi, v.userMat);

          const m = mat4.create(); mat4.copy(m, g.grabMat);
          if (!this.targetGad) {
            if (g.actionFlags & vp.GAF_DRAGGABLE) mat4.translate(m, m, [gCb[0], gCb[1], 0]);
            else mat4.translate(m, m, [g.grabCb[0], g.grabCb[1], 0]);
            if (g.actionFlags & vp.GAF_SCALABLE) mat4.scale(m, m, [gM/g.grabM,gM/g.grabM,1]);
            if (g.actionFlags & vp.GAF_ROTATABLE) mat4.rotate(m, m, gA-g.grabA, [0,0,1]);
            mat4.translate(m, m, [-g.grabCb[0], -g.grabCb[1], 0]);
            v.rematrix(); v.setRenderFlag(true);
          } else {
            if (g.actionFlags & vp.GAF_DRAGGABLE) mat4.translate(m, m, [gCb[0]/v.getScale(), gCb[1]/v.getScale(), 0]);
            else mat4.translate(m, m, [g.grabCb[0]/v.getScale(), g.grabCb[1]/v.getScale(), 0]);
            if (g.actionFlags & vp.GAF_SCALABLE) mat4.scale(m, m, [gM/g.grabM,gM/g.grabM,1]);
            if (g.actionFlags & vp.GAF_ROTATABLE) mat4.rotate(m, m, gA-g.grabA, [0,0,1]);
            mat4.translate(m, m, [-g.grabCb[0]/v.getScale(), -g.grabCb[1]/v.getScale(), 0]);
            v.rematrix(); v.setRenderFlag(true);
          }
          mat4.copy(g.getTargetMat(), m);
        }
        this.pinchEndFunc = function(p1, p2) {
          var g = this, v = g.targetView;
          delete g.grab1; delete g.grab1b;
          delete g.grab2; delete g.grab2b;
          delete g.grabC; delete g.grabCb;
          delete g.grabA; delete g.grabM; delete g.grabMat;
        }
        this.zoomFunc = function(p, z) {
          const g = this, v = g.targetView, m = this.getTargetMat();
          const q = vec3.create(); if (!!(g.actionFlags & vp.GAF_DRAGGABLE)) { q[0] = p.x-v.x; q[1] = p.y-v.y; }
          else { mat4.getTranslation(q, m); }
          const ui = mat4.create(); mat4.invert(ui, m);
          vec3.transformMat4(q, q, ui);
          mat4.translate(m, m, [q[0], q[1], 0]);
          mat4.scale(m, m, [Math.exp(z/10), Math.exp(z/10), 1]);
          mat4.translate(m, m, [-q[0], -q[1], 0]);
          v.rematrix(); v.setRenderFlag(true);
        }
        this.rotateFunc = function(p, z) {
          const g = this, v = g.targetView, m = this.getTargetMat();
          const q = vec3.create(); if (!!(g.actionFlags & vp.GAF_DRAGGABLE)) { q[0] = p.x-v.x; q[1] = p.y-v.y; }
          else { mat4.getTranslation(q, m); }
          const ui = mat4.create(); mat4.invert(ui, m);
          vec3.transformMat4(q, q, ui);
          mat4.translate(m, m, [q[0], q[1], 0]);
          mat4.rotate(m, m, -Math.PI/18*z, [0, 0, 1]);
          mat4.translate(m, m, [-q[0], -q[1], 0]);
          v.rematrix(); v.setRenderFlag(true);
        }
      }
      getHits(hitList, radius) {
        if (!this.enabled) return;
        if (this.convexHull.length == 0)
          hitList.hits.push({ gad: this, dist: 0 });
        else super.getHits(hitList, radius);
      }
      layout() {
        var g = this; v = g.viewport;
        console.log('MatrixGadget::layout()');
      }
    }
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
