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

function drawThemeBackdrop(v, th) {
	gl.clearColor(...th.uiBackground);
	gl.clear(gl.COLOR_BUFFER_BIT);
	const mat = mat4.create();
	const gr = config.themeGraphics;
	const pixelPM = v.getRawMatrix();
	if (gr && gr.font) {
		const m = mat4.create();
//		mat4.copy(m, v.mat);
//		mat4.translate(m, m, [0, v.userY, 0]);
//		mat4.scale(m, m, [v.sw/gr.width/2, v.sw/gr.width/2, 1]);

//		mat4.copy(m, pixelPM);
//    mat4.scale(m, m, [canvas.width/240, canvas.width/240, 1]);
//    mat4.scale(m, m, [1/gr.width, 1/gr.width, 1]);

		mat4.identity(m);
    mat4.translate(m, m, [-1, 1, 1]);
    mat4.scale(m, m, [2/v.w, -2/v.h, 1]);
    mat4.translate(m, m, [-v.x, -v.y, 0]);
    mat4.scale(m, m, [canvas.width/240, canvas.width/240, 1]);

		for (var i=0; i<3; i++) for (var j=0; j<5; j++) {
			mat4.identity(mat);
			gr.font.draw(i*gr.width-gr.width/2, j*gr.height-gr.height/2,
				gr.pattern, th.uiSettingsBubble, m, mat);
		}
	}
}
