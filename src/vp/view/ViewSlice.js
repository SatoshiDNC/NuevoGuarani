/*
    class ViewSlice extends View {
      constructor(parent, type, size) {
        super(parent, 0);
        this.type = type;
        this.size = size;
        this.a = undefined; this.b = undefined;
      }
      layoutAll(s) {
        super.layoutAll(s);
        var s1 = new vp.LayoutState(s.totalWidth, s.totalHeight, s.idealWidth, s.idealHeight);
        var s2 = new vp.LayoutState(s.totalWidth, s.totalHeight, s.idealWidth, s.idealHeight);
        var size = ~~(this.size * this.getScale());
        if (this.type == 't') {
          s1.remainingX = s.remainingX; s1.remainingY = s.remainingY;
          s1.remainingWidth = s.remainingWidth; s1.remainingHeight = size;
          s2.remainingX = s.remainingX; s2.remainingY = s.remainingY + size;
          s2.remainingWidth = s.remainingWidth; s2.remainingHeight = s.remainingHeight - size;
        } else if (this.type == 'b') {
          s1.remainingX = s.remainingX; s1.remainingY = s.remainingY + s.remainingHeight - size;
          s1.remainingWidth = s.remainingWidth; s1.remainingHeight = size;
          s2.remainingX = s.remainingX; s2.remainingY = s.remainingY;
          s2.remainingWidth = s.remainingWidth; s2.remainingHeight = s.remainingHeight - size;
        } else if (this.type == 'l') {
          s1.remainingX = s.remainingX; s1.remainingY = s.remainingY;
          s1.remainingWidth = size; s1.remainingHeight = s.remainingHeight;
          s2.remainingX = s.remainingX + size; s2.remainingY = s.remainingY;
          s2.remainingWidth = s.remainingWidth - size; s2.remainingHeight = s.remainingHeight;
        } else if (this.type == 'r') {
          s1.remainingX = s.remainingX + s.remainingWidth - size; s1.remainingY = s.remainingY;
          s1.remainingWidth = size; s1.remainingHeight = s.remainingHeight;
          s2.remainingX = s.remainingX; s2.remainingY = s.remainingY;
          s2.remainingWidth = s.remainingWidth - size; s2.remainingHeight = s.remainingHeight;
        }
        if (this.a) { this.a.layoutAll(s1); }
        if (this.b) { this.b.layoutAll(s2); }
      }
      renderAll() {
        if (this.a) { this.a.renderAll(); }
        if (this.b) { this.b.renderAll(); }
      }
      findGad(s, r) {
        if (this.a) this.a.findGad(s, r);
        if (this.b) this.b.findGad(s, r);
      }
      findViewport(p) {
        return (this.a && this.a.findViewport(p)) || (this.b && this.b.findViewport(p));
      }
    }
*/
