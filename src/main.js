window.onload = function () {
  const canvas = document.querySelector('#app1');
  vp.initialize(canvas);
  const gl = vp.getContext();


    var all2 = [];

    const unitLine2beg = all2.length/2; all2.splice(all2.length, 0,
      0, 0,
      1, 1,
    ); const unitLine2len = all2.length/2 - unitLine2beg;


    // WEBGL INITIALIZATION

    const plainVertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(plainVertexShader, `

      attribute vec4 aVertexPosition;
      attribute vec2 aTex;
      uniform vec4 uVertexColor;
      uniform mat4 uModelViewMatrix;
      uniform mat4 uProjectionMatrix;
      varying vec4 vColor;
      varying highp vec2 vTex;

      void main() {
        gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
        vColor = uVertexColor;
        vTex = aTex;
      }
    `);
    gl.compileShader(plainVertexShader);
    if (!gl.getShaderParameter(plainVertexShader, gl.COMPILE_STATUS)) return;

    const plainFragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(plainFragmentShader, `

      varying lowp vec4 vColor;
      uniform sampler2D sampler0;
      varying highp vec2 vTex;

      void main() {
        //gl_FragColor = texture2D(sampler0, vTex);
        gl_FragColor = vColor;
      }
    `);
    gl.compileShader(plainFragmentShader);
    if (!gl.getShaderParameter(plainFragmentShader, gl.COMPILE_STATUS)) return;

    const plainProgram = gl.createProgram();
    gl.attachShader(plainProgram, plainVertexShader);
    gl.attachShader(plainProgram, plainFragmentShader);
    gl.linkProgram(plainProgram);
    if (!gl.getProgramParameter(plainProgram, gl.LINK_STATUS)) return;




  var v, g;

  var quadrant1 = v = new vp.View(null);
  v.gadgets.push(g = new vp.MatrixGadget(v));
  //g.w = 10; g.h = 1000; //g.f = GF_RELH;
  g.convexHull = g.computeHull([50,50, 100,200, 200,200, 200,100]);
  g.actionFlags = vp.GAF_CLICKABLE | vp.GAF_DRAGGABLE | vp.GAF_PINCHABLE;
  g.clickFunc = function() {
    var g = this; g.f = !(g.f); vp.setDebugFlags(g.f, g.f);
    var v = g.viewport; while (v.parent) v = v.parent; v.setRenderFlag(true);
  }
  v.renderFunc = function() {
    gl.clearColor(0.612, 0.745, 0.345, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(plainProgram);
    gl.uniform4fv(gl.getUniformLocation(plainProgram, 'uVertexColor'), new Float32Array([0,0,0, 1]));
    gl.uniformMatrix4fv(gl.getUniformLocation(plainProgram, 'uProjectionMatrix'), false, this.mat);
    const mat = mat4.create();
    for (const g of this.gadgets) {
      var h = g.convexHull;
      for (p = 0; p < h.length; p += 2) {
      mat4.identity(mat);
      mat4.translate(mat, mat, [h[p+0], h[p+1], 0]);
      mat4.scale(mat, mat, [h[(p+2)%h.length]-h[p+0], h[(p+3)%h.length]-h[p+1], 0]);
      gl.uniformMatrix4fv(
        gl.getUniformLocation(plainProgram, 'uModelViewMatrix'),
        false, mat);
      gl.drawArrays(gl.LINE_LOOP, unitLine2beg, unitLine2len);
      }
    }
  };

  var quadrant2 = v = new vp.View(null);
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
    gl.useProgram(plainProgram);
    gl.enable(gl.BLEND);
    gl.uniform4fv(gl.getUniformLocation(plainProgram, 'uVertexColor'), new Float32Array([0,0,0, 1]));
    gl.uniformMatrix4fv(gl.getUniformLocation(plainProgram, 'uProjectionMatrix'), false, this.mat);
    const mat = mat4.create();
    for (const g of this.gadgets) {
      var h = g.convexHull;
      for (p = 0; p < h.length; p += 2) {
      mat4.identity(mat);
      mat4.translate(mat, mat, [h[p+0], h[p+1], 0]);
      mat4.scale(mat, mat, [h[(p+2)%h.length]-h[p+0], h[(p+3)%h.length]-h[p+1], 0]);
      gl.uniformMatrix4fv(
        gl.getUniformLocation(plainProgram, 'uModelViewMatrix'),
        false, mat);
      gl.drawArrays(gl.LINE_LOOP, unitLine2beg, unitLine2len);
      }
    }
  };

  //v.gadgets.push(v.swipeGad = new vp.SwipeGadget(v));
  //v.swipeGad.actionFlags = vp.GAF_SWIPEABLE_UPDOWN | vp.GAF_SWIPEABLE_LEFTRIGHT;
  //v.layoutFunc = function() { this.swipeGad.layout(); }

  var quadrant3 = v = new vp.View(null);
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
    gl.useProgram(plainProgram);
    gl.uniform4fv(gl.getUniformLocation(plainProgram, 'uVertexColor'), new Float32Array([0,0,0, 1]));
    gl.uniformMatrix4fv(gl.getUniformLocation(plainProgram, 'uProjectionMatrix'), false, this.mat);
    const mat = mat4.create();
    for (const g of this.gadgets) {
      var h = g.convexHull;
      for (p = 0; p < h.length; p += 2) {
      mat4.identity(mat);
      mat4.translate(mat, mat, [h[p+0], h[p+1], 0]);
      mat4.scale(mat, mat, [h[(p+2)%h.length]-h[p+0], h[(p+3)%h.length]-h[p+1], 0]);
      gl.uniformMatrix4fv(
        gl.getUniformLocation(plainProgram, 'uModelViewMatrix'),
        false, mat);
      gl.drawArrays(gl.LINE_LOOP, unitLine2beg, unitLine2len);
      }
    }
  };

  quadrant4 = v = new vp.View(null);
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
    gl.useProgram(plainProgram);
    gl.enable(gl.BLEND);
    gl.uniform4fv(gl.getUniformLocation(plainProgram, 'uVertexColor'), new Float32Array([0,0,0, 1]));
    gl.uniformMatrix4fv(gl.getUniformLocation(plainProgram, 'uProjectionMatrix'), false, this.mat);
    const mat = mat4.create();
    for (const g of this.gadgets) {
      var h = g.convexHull;
      for (p = 0; p < h.length; p += 2) {
        mat4.identity(mat);
        mat4.multiply(mat, mat, g.mat);
        mat4.translate(mat, mat, [h[p+0], h[p+1], 0]);
        mat4.scale(mat, mat, [h[(p+2)%h.length]-h[p+0], h[(p+3)%h.length]-h[p+1], 0]);
        gl.uniformMatrix4fv(
          gl.getUniformLocation(plainProgram, 'uModelViewMatrix'),
          false, mat);
        gl.drawArrays(gl.LINE_LOOP, unitLine2beg, unitLine2len);
      }
    }
  };

  var div1and2 = v = new vp.View();
  v.gadgets.push(g = v.middleDividerGad = new vp.MiddleDividerGadget(v)); g.z = 1;
  v.layoutFunc = function() { this.middleDividerGad.layout(); }

  var quadrants1and2 = v = new vp.ViewDivider(null, 'a', 0.5, 0);
  v.a = quadrant2; quadrant2.parent = v;
  v.b = quadrant1; quadrant1.parent = v;
  v.c = div1and2; div1and2.parent = v;

  var div3and4 = v = new vp.View();
  v.gadgets.push(g = v.middleDividerGad = new vp.MiddleDividerGadget(v)); g.z = 1;
  v.layoutFunc = function() { this.middleDividerGad.layout(); }

  var quadrants3and4 = v = new vp.ViewDivider(null, 'a', 0.5, 0);
  v.a = quadrant3; quadrant3.parent = v;
  v.b = quadrant4; quadrant4.parent = v;
  v.c = div3and4; div3and4.parent = v;

  var maindivider = v = new vp.View();
  v.gadgets.push(g = v.middleDividerGad = new vp.MiddleDividerGadget(v)); g.z = 1;
  v.layoutFunc = function() { this.middleDividerGad.layout(); }

  var div = v = new vp.ViewDivider(null, 'a', 0.5, 0);
  div.designSize = 640*400;
  v.a = quadrants1and2; quadrants1and2.parent = v;
  v.b = quadrants3and4; quadrants3and4.parent = v;
  v.c = maindivider; maindivider.parent = v;

  vp.start(div);
}
