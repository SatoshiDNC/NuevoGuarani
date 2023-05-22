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

  const prog2 = gl.createProgram();
  gl.attachShader(prog2, plainVertexShader);
  gl.attachShader(prog2, plainFragmentShader);
  gl.linkProgram(prog2);
  if (!gl.getProgramParameter(prog2, gl.LINK_STATUS)) return;

  buf2 = gl.createBuffer(); // buffer for 2-value vertices
  gl.bindBuffer(gl.ARRAY_BUFFER, buf2);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(all2), gl.STATIC_DRAW);

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
  buf5 = gl.createBuffer(); // buffer for 5-value vertices
  gl.bindBuffer(gl.ARRAY_BUFFER, buf5);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(all5), gl.STATIC_DRAW);

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

