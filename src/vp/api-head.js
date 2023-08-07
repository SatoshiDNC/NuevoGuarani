var vp = (function() {

  // set by initialize()
  var canvas, kbalpha, kbnum, kbnext, kbprev, gl;

  // set by start()
  const beg2 = {}, len2 = {};
  var ac, clickSound, beepSound, windSound;
  var buf2;

  // set by canvasResize()
  var diagonal, wi2px, px2wi;
  var layoutSignal; // recalculate all layouts on next frame
  const layoutViews = []; // specific views to recalculate next frame

  var rootViewport, animViews = [];
  const pixelPM = mat4.create();
  var mouseEnabled = 0;

  // for debug purposes
  var plainProgram;
	var debug1 = false; // layout and rendering console messages

  const touchRadius = 85, clickRadius = 5;
  function getPointerRadius() { return (navigator.maxTouchPoints>0 ? touchRadius : clickRadius); }
  function isMouseEnabled() { return mouseEnabled; }
  function getContext() { return gl; }
	const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

	var inputGad, inputGadPrev; function getInputGad() { return inputGad; }

	var progObj;
	var img, tex, vloc, tloc, vertexBuff, texBuff;
	var uLoc;
	function setImage(img) {
		if (!progObj) {
			// create shaders
			var vertexShaderSrc = 
			"attribute vec2 aVertex;" +
			"attribute vec2 aUV;" + 
			"varying vec2 vTex;" +
      "uniform mat4 pm;" +
      "uniform mat4 mm;" +
			"uniform vec2 pos;" +
			"void main(void) {" +
			"  gl_Position = pm * mm * vec4(aVertex + pos, 0.0, 1.0);" +
			"  vTex = aUV;" +
			"}";

			var fragmentShaderSrc =
			"precision highp float;" +
			"varying vec2 vTex;" +
			"uniform sampler2D sampler0;" +
			"void main(void){" +
			"  gl_FragColor = texture2D(sampler0, vTex);"+
			"}";

			var vertShaderObj = gl.createShader(gl.VERTEX_SHADER);
			var fragShaderObj = gl.createShader(gl.FRAGMENT_SHADER);
			gl.shaderSource(vertShaderObj, vertexShaderSrc);
			gl.shaderSource(fragShaderObj, fragmentShaderSrc);
			gl.compileShader(vertShaderObj);
			gl.compileShader(fragShaderObj);

			progObj = gl.createProgram();
			gl.attachShader(progObj, vertShaderObj);
			gl.attachShader(progObj, fragShaderObj);

			gl.linkProgram(progObj);

			gl.useProgram(progObj);

			vertexBuff = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuff);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, 0, 1, 1, 1, 1, 0]), gl.STATIC_DRAW);

			texBuff = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, texBuff);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 1, 0, 0, 1, 0, 1, 1]), gl.STATIC_DRAW);

			vloc = gl.getAttribLocation(progObj, "aVertex"); 
			tloc = gl.getAttribLocation(progObj, "aUV");
			uLoc = gl.getUniformLocation(progObj, "pos");
		}

		tex = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, tex);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.texImage2D(gl.TEXTURE_2D, 0,  gl.RGBA,  gl.RGBA, gl.UNSIGNED_BYTE, img);
		return tex;
	}
	function drawImage(tex, pm, mm) {

//console.log('drawing image');
		gl.useProgram(progObj);

		gl.enableVertexAttribArray(vloc);
		gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuff);
		gl.vertexAttribPointer(vloc, 2, gl.FLOAT, false, 0, 0);

		gl.enableVertexAttribArray(tloc);
		gl.bindBuffer(gl.ARRAY_BUFFER, texBuff);
		gl.bindTexture(gl.TEXTURE_2D, tex);
		gl.vertexAttribPointer(tloc, 2, gl.FLOAT, false, 0, 0);

		gl.uniformMatrix4fv(gl.getUniformLocation(progObj, 'pm'), false, pm);
		gl.uniformMatrix4fv(gl.getUniformLocation(progObj, 'mm'), false, mm);

		gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
	}
