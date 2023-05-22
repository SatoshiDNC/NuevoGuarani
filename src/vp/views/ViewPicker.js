class ViewPicker extends View {
  constructor(parent) {
    super(parent);
    var g; this.gadgets.push(g = new Gadget(this));
    g.w = 1000; g.h = 1000;
    g.convexHull = g.computeHull([0,0, 0,1000, 1000,1000, 1000,0]);
    g.click = function() {
//console.log('click', this);
    }
  }
}
