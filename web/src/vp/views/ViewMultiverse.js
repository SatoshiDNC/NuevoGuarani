    class ViewMultiverse extends View {
      constructor(parent) {
        super(parent);
/*
        var g = this.gadgets = new Gadget(this);
        g.w = 10; g.h = 1000; //g.f = GF_RELH;
       // g.convexHull = g.computeHull([0,0, 0,1000, 10,1000, 10,0]);
        g.click = function() {
//console.log('click', this);
        }
        this.layoutFunc = function() {
          g.convexHull = g.computeHull([0,0, 0,this.h, 0,this.h, 0,0]);
        }
*/
        var g; this.gadgets.push(g = new Gadget(this));
        g.w = 10; g.h = 1000; //g.f = GF_RELH;
        g.convexHull = g.computeHull([50,50, 100,200, 200,200, 200,100]);
        g.click = function() {
//console.log('click', this);
        }

      }
     // layoutFunc() {
     // }
    }
