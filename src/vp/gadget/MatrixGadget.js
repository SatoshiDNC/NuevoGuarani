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
