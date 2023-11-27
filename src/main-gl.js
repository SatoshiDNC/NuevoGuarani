  // WEBGL INITIALIZATION

  const plainVertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(plainVertexShader, `
      attribute vec4 aVertexPosition;
      attribute vec2 aTex;
      uniform vec4 overallColor;
      uniform mat4 uModelViewMatrix;
      uniform mat4 uProjectionMatrix;
      varying vec4 vColor;
      varying highp vec2 vTex;

      void main() {
        gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
        vColor = overallColor;
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

  const texVertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(texVertexShader, `
      attribute vec4 aVertexPosition;
      attribute vec2 uv;
      uniform vec4 overallColor;
      uniform mat4 uModelViewMatrix;
      uniform mat4 uProjectionMatrix;
      varying vec4 vColor;
      varying highp vec2 vTex;

      void main() {
        gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
        vColor = overallColor;
        vTex = uv;
      }
  `);
  gl.compileShader(texVertexShader);
  if (!gl.getShaderParameter(texVertexShader, gl.COMPILE_STATUS)) return;

  const texFragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(texFragmentShader, `
      varying lowp vec4 vColor;
      uniform sampler2D sampler0;
      varying highp vec2 vTex;

      void main() {
        gl_FragColor = texture2D(sampler0, vTex);
        //gl_FragColor = vColor;
      }
  `);
  gl.compileShader(texFragmentShader);
  if (!gl.getShaderParameter(texFragmentShader, gl.COMPILE_STATUS)) return;

  const prog2 = gl.createProgram();
  gl.attachShader(prog2, plainVertexShader);
  gl.attachShader(prog2, plainFragmentShader);
  gl.linkProgram(prog2);
  if (!gl.getProgramParameter(prog2, gl.LINK_STATUS)) return;

  const prog4 = gl.createProgram();
  gl.attachShader(prog4, texVertexShader);
  gl.attachShader(prog4, texFragmentShader);
  gl.linkProgram(prog4);
  if (!gl.getProgramParameter(prog4, gl.LINK_STATUS)) return;

//  buf2 = gl.createBuffer(); // buffer for 2-value vertices
//  gl.bindBuffer(gl.ARRAY_BUFFER, buf2);
//  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(all2), gl.STATIC_DRAW);

//  buf4 = gl.createBuffer(); // buffer for 4-value vertices
//  gl.bindBuffer(gl.ARRAY_BUFFER, buf4);
//  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(all4), gl.STATIC_DRAW);

  const prog5VertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(prog5VertexShader, `
      attribute vec4 aVertexPosition;
      attribute vec4 vertexColor;
      attribute vec2 aTex;
      uniform vec4 overallColor;
      uniform mat4 uModelViewMatrix;
      uniform mat4 uProjectionMatrix;
      varying vec4 vColor;
      varying highp vec2 vTex;

      void main() {
        gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
        vColor = vertexColor * overallColor;
        vTex = aTex;
      }
  `);
  gl.compileShader(prog5VertexShader);
  if (!gl.getShaderParameter(prog5VertexShader, gl.COMPILE_STATUS)) return;

  const prog5FragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(prog5FragmentShader, `
      varying lowp vec4 vColor;
      uniform sampler2D sampler0;
      varying highp vec2 vTex;

      void main() {
        //gl_FragColor = texture2D(sampler0, vTex);
        gl_FragColor = vColor;
      }
  `);
  gl.compileShader(prog5FragmentShader);
  if (!gl.getShaderParameter(prog5FragmentShader, gl.COMPILE_STATUS)) return;

  const prog5 = gl.createProgram();
  gl.attachShader(prog5, prog5VertexShader);
  gl.attachShader(prog5, prog5FragmentShader);
  gl.linkProgram(prog5);
  if (!gl.getProgramParameter(prog5, gl.LINK_STATUS)) return;

  gl.useProgram(prog5);
//  buf5 = gl.createBuffer(); // buffer for 5-value vertices
//  gl.bindBuffer(gl.ARRAY_BUFFER, buf5);
//  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(all5), gl.STATIC_DRAW);

	function useProg2() {
		gl.useProgram(prog2);
		gl.bindBuffer(gl.ARRAY_BUFFER, buf2);
		//gl.disableVertexAttribArray(gl.getAttribLocation(prog5, 'aVertexPosition'));
		//gl.disableVertexAttribArray(gl.getAttribLocation(prog5, 'overallColor'));
		var a = gl.getAttribLocation(prog2, 'aVertexPosition')
		gl.vertexAttribPointer(
			a,
			2, // numComponents
			gl.FLOAT, // type
			false, // normalize
			0, // stride
			0); // offset
		gl.enableVertexAttribArray(a);
	}

	function useProg4() {
		gl.useProgram(prog4);
		gl.bindBuffer(gl.ARRAY_BUFFER, buf4);
		var a = gl.getAttribLocation(prog4, 'aVertexPosition')
		gl.vertexAttribPointer(
			a,
			2, // numComponents
			gl.FLOAT, // type
			false, // normalize
			4 * 4, // stride
			4 * 0); // offset
		gl.enableVertexAttribArray(a);
		a = gl.getAttribLocation(prog4, 'uv')
		gl.vertexAttribPointer(
			a,
			2, // numComponents
			gl.FLOAT, // type
			false, // normalize
			4 * 4, // stride
			4 * 2); // offset
		gl.enableVertexAttribArray(a);
	}

	function useProg5() {
		gl.useProgram(prog5);
		gl.uniform4fv(gl.getUniformLocation(prog5, 'overallColor'),
			new Float32Array([1,1,1, 1]));
		gl.bindBuffer(gl.ARRAY_BUFFER, buf5);
		//gl.disableVertexAttribArray(gl.getAttribLocation(prog2, 'aVertexPosition'));
		var a = gl.getAttribLocation(prog5, 'aVertexPosition')
		gl.vertexAttribPointer(
			a,
			2, // numComponents
			gl.FLOAT, // type
			false, // normalize
			4 * 5, // stride
			4 * 0); // offset
		gl.enableVertexAttribArray(a);
		a = gl.getAttribLocation(prog5, 'vertexColor')
		gl.vertexAttribPointer(
			a,
			3, // numComponents
			gl.FLOAT, // type
			false, // normalize
			4 * 5, // stride
			4 * 2); // offset
		gl.enableVertexAttribArray(a);
	}

function initTexture(gl) {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Because video has to be download over the internet
  // they might take a moment until it's ready so
  // put a single pixel in the texture so we can
  // use it immediately.
  const level = 0;
  const internalFormat = gl.RGBA;
  const width = 1;
  const height = 1;
  const border = 0;
  const srcFormat = gl.RGBA;
  const srcType = gl.UNSIGNED_BYTE;
  const pixel = new Uint8Array([0, 0, 255, 255]); // opaque blue
  gl.texImage2D(
    gl.TEXTURE_2D,
    level,
    internalFormat,
    width,
    height,
    border,
    srcFormat,
    srcType,
    pixel
  );

  // Turn off mips and set wrapping to clamp to edge so it
  // will work regardless of the dimensions of the video.
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

  return texture;
}
function updateTexture(gl, texture, el) {
  const level = 0;
  const internalFormat = gl.RGBA;
  const srcFormat = gl.RGBA;
  const srcType = gl.UNSIGNED_BYTE;
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(
    gl.TEXTURE_2D,
    level,
    internalFormat,
    srcFormat,
    srcType,
    el,
  );
}

// var emojiTex = initTexture(gl);
// const emojiEl = document.createElement('img');
// emojiEl.addEventListener('load', function() {
// 	updateTexture(gl, emojiTex, emojiEl);
// 	gl.generateMipmap(gl.TEXTURE_2D);
// 	emojiReady = true;
// 	loadCheck();
// });
// emojiEl.src = emojiFile;

function drawThemeBackdrop(v, th) {
//	var startTime = performance.now();
	function baseline(f,c) { return f.glyphHeights[c]-f.glyphY1[c]; }
	gl.clearColor(...th.uiBackground);
	gl.clear(gl.COLOR_BUFFER_BIT);
	const mat = mat4.create();
	const gr = config.themeGraphics;
	const pixelPM = v.getRawMatrix();
	if (gr && gr.font) {
		var repeatX, repeatY;
		if (canvas.height / gr.height > canvas.width / gr.width) {
			repeatX = 2;
			repeatY = Math.ceil(4/gr.height*gr.width);
		} else {
			repeatY = 2;
			repeatX = Math.ceil(4/gr.width*gr.height);
		}

		if (!drawThemeBackdrop.prototype.buf) {
			drawThemeBackdrop.prototype.buf = gl.createBuffer();
			gr.font.beginObj();
			gr.font.textObj(0, baseline(gr.font,gr.pattern.codePointAt(0)), gr.pattern, th.uiBackgroundPattern);
			const data = gr.font.endObj();

			drawThemeBackdrop.prototype.beg = {}; drawThemeBackdrop.prototype.len = {}; drawThemeBackdrop.prototype.typ = {}; drawThemeBackdrop.prototype.all = [];
			function addShape4(o, name, typ, ...points) {
				o.beg[name] = o.all.length/4; o.typ[name] = typ;
				o.all.splice (o.all.length, 0, ...points);
				o.len[name] = o.all.length/4 - o.beg[name];
			}
			addShape4(drawThemeBackdrop.prototype, 'bgThemeTex', gl.TRIANGLE_FAN, ...data );
			gl.bindBuffer(gl.ARRAY_BUFFER, drawThemeBackdrop.prototype.buf);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(drawThemeBackdrop.prototype.all), gl.STATIC_DRAW);
		}

		const m = mat4.create();
		mat4.identity(m);
    mat4.translate(m, m, [-1, 1, 1]);
    mat4.scale(m, m, [2/v.w, -2/v.h, 1]);
    mat4.translate(m, m, [-v.x, -v.y, 0]);
		const scaleX = 1.1*canvas.width/(gr.width*repeatX);
		const scaleY = 1.1*canvas.height/(gr.height*repeatY);
		const scaleF = scaleX>scaleY? scaleX: scaleY;
    mat4.scale(m, m, [scaleF, scaleF, 1]);
		for (var i=0; i<repeatX; i++) for (var j=0; j<repeatY; j++) {
			mat4.identity(mat);
//			gr.font.draw(i*gr.width-0.05*gr.width, j*gr.height+0.05*gr.height+baseline(gr.font,gr.pattern.codePointAt(0)),
//				gr.pattern, th.uiBackgroundPattern, m, mat);
			mat4.translate(mat, mat, [i*gr.width-0.05*gr.width, j*gr.height+0.05*gr.height, 0]);
			gr.font.drawBuf(drawThemeBackdrop.prototype.buf, drawThemeBackdrop.prototype.beg.bgThemeTex, drawThemeBackdrop.prototype.len.bgThemeTex, th.uiBackgroundPattern, m, mat, 1);
		}
	}
//	var stopTime = performance.now();
//	console.log("bg:",stopTime - startTime);
}
