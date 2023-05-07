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
