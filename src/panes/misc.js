  var menupane = v = new vp.View(null);
	v.name = Object.keys({menupane}).pop();
  v.gadgets.push(g = new vp.MatrixGadget(v));
  //g.w = 10; g.h = 1000; //g.f = GF_RELH;
	g.y = 100;
  g.convexHull = g.computeHull([50,50, 100,200, 200,200, 200,100]);
  g.actionFlags = vp.GAF_CLICKABLE;// | vp.GAF_DRAGGABLE | vp.GAF_PINCHABLE;
  g.clickFunc = function() {
    var g = this; g.f = !(g.f); vp.setDebugFlags(g.f, g.f);
    var v = g.viewport; while (v.parent) v = v.parent; v.setRenderFlag(true);
  }
  var quadrant4;
  v.gadgets.push(g = new vp.MatrixGadget(v));
  //g.w = 10; g.h = 1000; //g.f = GF_RELH;
  g.convexHull = g.computeHull([50,50, 100,200, 200,200, 200,100]);
  g.actionFlags = vp.GAF_CLICKABLE | vp.GAF_DRAGGABLE | vp.GAF_PINCHABLE;
  var mg1, mg2;
  g.clickFunc = function() {
    mat4.identity(mg1.targetView.userMat);
    mat4.identity(mg2.targetGad.mat);
    quadrant4.rematrix();
    quadrant4.setRenderFlag(true);
    quadrant4.renderAll();
    //console.log('click', this);
  }
  v.renderFunc = function() {
    gl.clearColor(0.380, 0.588, 0.259, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    useProg2();
    gl.enable(gl.BLEND);
    gl.uniform4fv(gl.getUniformLocation(prog2, 'overallColor'), new Float32Array([0,0,0, 1]));
    gl.uniformMatrix4fv(gl.getUniformLocation(prog2, 'uProjectionMatrix'), false, this.mat);
    const mat = mat4.create();
    for (const g of this.gadgets) {
      var h = g.convexHull;
      for (var p = 0; p < h.length; p += 2) {
      mat4.identity(mat);
      mat4.translate(mat, mat, [h[p+0]+g.x, h[p+1]+g.y, 0]);
      mat4.scale(mat, mat, [h[(p+2)%h.length]-h[p+0], h[(p+3)%h.length]-h[p+1], 0]);
      gl.uniformMatrix4fv(
        gl.getUniformLocation(prog2, 'uModelViewMatrix'),
        false, mat);
      mainShapes.drawArrays2('unitLine');
      }
    }
  };

  //v.gadgets.push(v.swipeGad = new vp.SwipeGadget(v));
  //v.swipeGad.actionFlags = vp.GAF_SWIPEABLE_UPDOWN | vp.GAF_SWIPEABLE_LEFTRIGHT;
  //v.layoutFunc = function() { this.swipeGad.layout(); }

  var quadrant3 = v = new vp.View(null);
	v.name = Object.keys({quadrant3}).pop();
  v.gadgets.push(g = new vp.MatrixGadget(v));
  //g.w = 10; g.h = 1000; //g.f = GF_RELH;
  g.convexHull = g.computeHull([50,50, 100,200, 200,200, 200,100]);
  g.actionFlags = vp.GAF_CLICKABLE | vp.GAF_CONTEXTMENU | vp.GAF_DRAGGABLE | vp.GAF_PINCHABLE;
  g.clickFunc = function() {
    //console.log('click', this);
  }
  v.renderFunc = function() {
    gl.clearColor(0.882, 0.647, 0.353, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    useProg2();
    gl.uniform4fv(gl.getUniformLocation(prog2, 'overallColor'), new Float32Array([0,0,0, 1]));
    gl.uniformMatrix4fv(gl.getUniformLocation(prog2, 'uProjectionMatrix'), false, this.mat);
    const mat = mat4.create();
    for (const g of this.gadgets) {
      var h = g.convexHull;
      for (p = 0; p < h.length; p += 2) {
      mat4.identity(mat);
      mat4.translate(mat, mat, [h[p+0], h[p+1], 0]);
      mat4.scale(mat, mat, [h[(p+2)%h.length]-h[p+0], h[(p+3)%h.length]-h[p+1], 0]);
      gl.uniformMatrix4fv(
        gl.getUniformLocation(prog2, 'uModelViewMatrix'),
        false, mat);
      mainShapes.drawArrays2('unitLine');
      }
    }
  };

  quadrant4 = v = new vp.View(null);
	v.name = Object.keys({quadrant4}).pop();
  v.gadgets.push(mg1 = g = new vp.MatrixGadget(v));
  g.convexHull = g.computeHull([50,50, 100,200, 200,200, 200,100]);
  g.actionFlags = vp.GAF_CLICKABLE | vp.GAF_DRAGGABLE | vp.GAF_PINCHABLE;
  g.clickFunc = function() {
    //console.log('click', this);
  }
  v.gadgets.push(mg2 = g = new vp.MatrixGadget(v));
  g.convexHull = g.computeHull([150,50, 200,200, 300,200, 300,100]);
  g.actionFlags = vp.GAF_CLICKABLE | vp.GAF_DRAGGABLE | vp.GAF_PINCHABLE;
  g.targetGad = g;
  g.clickFunc = function() {
    //console.log('click', this);
  }
  v.renderFunc = function() {
    gl.clearColor(0.416, 0.533, 0.573, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    useProg2();
    gl.enable(gl.BLEND);
    gl.uniform4fv(gl.getUniformLocation(prog2, 'overallColor'), new Float32Array([0,0,0, 1]));
    gl.uniformMatrix4fv(gl.getUniformLocation(prog2, 'uProjectionMatrix'), false, this.mat);
    const mat = mat4.create();
    for (const g of this.gadgets) {
      var h = g.convexHull;
      for (p = 0; p < h.length; p += 2) {
        mat4.identity(mat);
        mat4.multiply(mat, mat, g.mat);
        mat4.translate(mat, mat, [h[p+0], h[p+1], 0]);
        mat4.scale(mat, mat, [h[(p+2)%h.length]-h[p+0], h[(p+3)%h.length]-h[p+1], 0]);
        gl.uniformMatrix4fv(
          gl.getUniformLocation(prog2, 'uModelViewMatrix'),
          false, mat);
        mainShapes.drawArrays2('unitLine');
      }
    }
  };

function scrollUpDn(g, amt) {
	var wi2px = window.visualViewport.scale * window.devicePixelRatio;
	var px2wi = 1/wi2px;
	p = { gestureState: '', touching: false, px: 0, py: 0 }; p.e = {};
	p.x = 0 * wi2px; p.ox = p.x; p.px = p.x;
	p.y = 0 * wi2px; p.oy = p.y; p.py = p.y;
	if (g.swipeBeginFunc) g.swipeBeginFunc.call(g, p);
	p.dx = 0; p.x = p.x;
	p.dy = amt /* * window.devicePixelRatio*/; p.y = p.y + p.dy;
	if (g.swipeMoveFunc) g.swipeMoveFunc.call(g, p);
	if (g.swipeEndFunc) g.swipeEndFunc.call(g, p);
}
/*
	var scrollbar = v = new vp.View();
	v.name = Object.keys({scrollbar}).pop();
	v.gadgets.push(g = v.upGad = new vp.Gadget(v)); g.z = 2;
  g.clickFunc = function() { scrollUpDn(startpane.swipeGad, 0.885); }
  //g.holdBeginFunc = function () { console.log('hold-begin'); }
  //g.holdEndFunc = function () { console.log('hold-end'); }
	v.gadgets.push(g = v.dnGad = new vp.Gadget(v)); g.z = 2;
  g.clickFunc = function() { scrollUpDn(startpane.swipeGad, -0.885); }
  //g.holdBeginFunc = function () { console.log('hold-begin'); }
  //g.holdEndFunc = function () { console.log('hold-end'); }
	v.gadgets.push(g = v.knobGad = new vp.Gadget(v)); g.z = -1;
  g.shown = 40; g.total = 100; g.start = 10;
	v.gadgets.push(g = v.pupGad = new vp.Gadget(v)); g.z = -2;
  g.clickFunc = function() { scrollUpDn(startpane.swipeGad, 1.7); }
	v.gadgets.push(g = v.pdnGad = new vp.Gadget(v)); g.z = -2;
  g.clickFunc = function() { scrollUpDn(startpane.swipeGad, -1.7); }
	v.layoutFunc = function() {
		const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
		var g, v = this, s = v.getScale();
		g = v.upGad; g.actionFlags = (vp.GAF_CLICKABLE | vp.GAF_HOLDABLE);
		g.convexHull = g.computeHull([0,10, 5,0, 10,10]);
		g.extendedHulls = {}; g.boundingBoxes = {};

		g = v.dnGad; g.actionFlags = (vp.GAF_CLICKABLE | vp.GAF_HOLDABLE);
		g.convexHull = g.computeHull([0,0, 5,10, 10,0]); g.y = v.h/s - 10;
		g.extendedHulls = {}; g.boundingBoxes = {};

		g = v.knobGad; g.actionFlags = vp.GAF_DRAGGABLE_UPDOWN;
    var h = (v.h/s-20  )*clamp(g.shown/g.total, 0,1);
		var y = (v.h/s-20-h)*clamp(g.start/(g.total-g.shown), 0,1);
		g.convexHull = g.computeHull([0,y, 10,y, 10,y+h, 0,y+h]); g.y = 10;
		g.extendedHulls = {}; g.boundingBoxes = {};

		g = v.pupGad; g.actionFlags = vp.GAF_CLICKABLE;
		g.convexHull = g.computeHull([0,0, 10,0, 10,y, 0,y]); g.y = 10;
		g.extendedHulls = {}; g.boundingBoxes = {};

		g = v.pdnGad; g.actionFlags = vp.GAF_CLICKABLE;
		g.convexHull = g.computeHull([0,y+h, 10,y+h, 10,v.h/s-20, 0,v.h/s-20]); g.y = 10;
		g.extendedHulls = {}; g.boundingBoxes = {};
	}
	v.renderFunc = function() {
		var s = this.getScale();
		var sel;
		gl.clearColor(th.uiBackground[0],th.uiBackground[1],th.uiBackground[2], 1);
		gl.clear(gl.COLOR_BUFFER_BIT);
		useProg5();
		gl.enable(gl.BLEND);
		gl.uniformMatrix4fv(gl.getUniformLocation(prog5, 'uProjectionMatrix'), false, this.mat);
		const mat = mat4.create();
    var selColor = [1,0.1,0.1, 1];
		var white = [1,1,1, 1]

		// Up button.
		if (this.upGad.gestureState && this.upGad.gestureState == 'hold')
			scrollUpDn(startpane.swipeGad, 0.5);
		sel = this.upGad.gestureState
			&& ['begin-click','recover-click','hold'].includes(this.upGad.gestureState);
		gl.uniform4fv(gl.getUniformLocation(prog5, 'overallColor'),
			new Float32Array(sel?selColor:white));
		mat4.identity(mat);
		mat4.scale(mat, mat, [10, 10, 0]);
		gl.uniformMatrix4fv(gl.getUniformLocation(prog5, 'uModelViewMatrix'), false, mat);
		gl.drawArrays(typ5.scrollUp, beg5.scrollUp, len5.scrollUp);

		// Down button.
		if (this.dnGad.gestureState && this.dnGad.gestureState == 'hold')
			scrollUpDn(startpane.swipeGad, -0.5);
		sel = this.dnGad.gestureState
			&& ['begin-click','recover-click','hold'].includes(this.dnGad.gestureState);
		gl.uniform4fv(gl.getUniformLocation(prog5, 'overallColor'),
			new Float32Array(sel?selColor:white));
		mat4.identity(mat);
		mat4.translate(mat, mat, [0, this.h/s, 0]);
		mat4.scale(mat, mat, [10, -10, 0]);
		gl.uniformMatrix4fv(gl.getUniformLocation(prog5, 'uModelViewMatrix'), false, mat);
		gl.drawArrays(typ5.scrollDn, beg5.scrollDn, len5.scrollDn);

		// Scroll bar knob.
		gl.uniform4fv(gl.getUniformLocation(prog5, 'overallColor'),
			new Float32Array([.1,.1,.1,1]));
		mat4.identity(mat);
		mat4.translate(mat, mat, [4, 10, 0]);
		mat4.scale(mat, mat, [2, this.h/s-20, 0]);
		gl.uniformMatrix4fv(gl.getUniformLocation(prog5, 'uModelViewMatrix'), false, mat);
		gl.drawArrays(typ5.rect, beg5.rect, len5.rect);
		sel = this.knobGad.gestureState
			&& (this.knobGad.gestureState=='drag'
				||this.knobGad.gestureState=='drag');
		gl.uniform4fv(gl.getUniformLocation(prog5, 'overallColor'),
			new Float32Array(sel?selColor:white));
		mat4.identity(mat);
		mat4.translate(mat, mat, [3, 10+this.knobGad.convexHull[1], 0]);
		mat4.scale(mat, mat, [4, this.knobGad.convexHull[5]-this.knobGad.convexHull[1], 0]);
		gl.uniformMatrix4fv(gl.getUniformLocation(prog5, 'uModelViewMatrix'), false, mat);
		gl.drawArrays(typ5.divLineH, beg5.divLineH, len5.divLineH);
	};

  var walletpane = v = new vp.SliceView(null, 'r', 10);
	v.name = Object.keys({walletpane}).pop();
	v.designFit = [400,400];
  v.a = scrollbar; scrollbar.parent = v;
  v.b = startpane; startpane.parent = v;
*/
  var div3and4 = v = new vp.View();
	v.name = Object.keys({div3and4}).pop();
  v.gadgets.push(g = v.middleDividerGad = new vp.MiddleDividerGadget(v)); g.z = 1;
  v.layoutFunc = function() { this.middleDividerGad.layout(); }

  var quadrants3and4 = v = new vp.DividerView(null, 'a', 0.5, 0);
	v.name = Object.keys({quadrants3and4}).pop();
  v.a = quadrant3; quadrant3.parent = v;
  v.b = quadrant4; quadrant4.parent = v;
  v.c = div3and4; div3and4.parent = v;

	var maindivider = v = new vp.View();
	v.name = Object.keys({maindivider}).pop();
	v.designScale = 1;
	v.gadgets.push(g = v.middleDividerGad = new vp.MiddleDividerGadget(v)); g.z = 1;
	v.layoutFunc = function() { this.middleDividerGad.layout(); }
	v.renderFunc = function() {
		const th = vendorColors;
		gl.clearColor(th.uiBackground[0],th.uiBackground[1],th.uiBackground[2], 1);
		gl.clear(gl.COLOR_BUFFER_BIT);
		useProg5();
		gl.enable(gl.BLEND);
		const mat = mat4.create();
		mat4.identity(mat);
		gl.uniformMatrix4fv(gl.getUniformLocation(prog5, 'uProjectionMatrix'), false, this.mat);
		mat4.scale(mat, mat, [this.w, this.h, 0]);
		gl.uniformMatrix4fv(gl.getUniformLocation(prog5, 'uModelViewMatrix'), false, mat);
		//gl.drawArrays(typ5.divLine, beg5.divLine, len5.divLine);
		if (this.parent.state == 'v') {
			gl.drawArrays(typ5.divLineV, beg5.divLineV, len5.divLineV);
		} else {
			gl.drawArrays(typ5.divLineH, beg5.divLineH, len5.divLineH);
		}
	};

	var menudivider = v = new vp.View();
	v.name = Object.keys({menudivider}).pop();
	v.designScale = 1;
	v.gadgets.push(g = v.middleDividerGad = new vp.MiddleDividerGadget(v)); g.z = 1;
	v.layoutFunc = function() { this.middleDividerGad.layout(); }

  var div = v = new vp.DividerView(null, 'a', 0.5, 1);
	v.name = Object.keys({div}).pop();
  div.designSize = 640*400;
  v.a = startpane; startpane.parent = v;
  v.b = quadrants3and4; quadrants3and4.parent = v;
  v.c = maindivider; maindivider.parent = v;
