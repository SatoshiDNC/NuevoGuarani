/*

The purpose of this class is to organize the construction and maintenance of
WebGL buffer data. At the lowest level, WebGL needs vertex, color, and texture
coordinates to be stored in buffers with a defined modulus and other
parameters. This class facilitates creation, update, and use of those buffers.

 */
class ShapeBuffer {
	constructor(builder) {
    this.builder = builder // function to build the shapes
    this.clear() // define and initialize code buffers
    this.buf2 = gl.createBuffer(); // graphics buffer for 2-value vertices
    this.buf4 = gl.createBuffer(); // graphics buffer for 4-value vertices
    this.buf5 = gl.createBuffer(); // graphics buffer for 5-value vertices
  }

  clear() {
    this.beg2 = {}; this.len2 = {}; this.typ2 = {}; this.all2 = [];
    this.beg4 = {}; this.len4 = {}; this.typ4 = {}; this.all4 = [];
    this.beg5 = {}; this.len5 = {}; this.typ5 = {}; this.all5 = [];
  }

  populateBuffers() {
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buf2);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.all2), gl.STATIC_DRAW);
  
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buf4);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.all4), gl.STATIC_DRAW);
  
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buf5);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.all5), gl.STATIC_DRAW);
  }

  build(...args) {
    console.group('ShapeBuffer.build(', args, ')')
    this.clear()
    this.builder.call(this, ...args)
    this.populateBuffers()
    console.groupEnd()
  }

  // shape-building functions
  addShape2(name, typ, ...points) {
    this.beg2[name] = this.all2.length/2; this.typ2[name] = typ;
    this.all2.splice (this.all2.length, 0, ...points);
    this.len2[name] = this.all2.length/2 - this.beg2[name];
  }
  addShape4(name, typ, ...points) {
    this.beg4[name] = this.all4.length/4; this.typ4[name] = typ;
    this.all4.splice (this.all4.length, 0, ...points);
    this.len4[name] = this.all4.length/4 - this.beg4[name];
  }
  addShape5(name, typ, ...points) {
    this.beg5[name] = this.all5.length/5; this.typ5[name] = typ;
    this.all5.splice (this.all5.length, 0, ...points);
    this.len5[name] = this.all5.length/5 - this.beg5[name];
  }

  // shape-drawing functions
  drawArrays2(name) { gl.drawArrays(this.typ2[name], this.beg2[name], this.len2[name]) }
  drawArrays4(name) { gl.drawArrays(this.typ4[name], this.beg4[name], this.len4[name]) }
  drawArrays5(name) { gl.drawArrays(this.typ5[name], this.beg5[name], this.len5[name]) }

  useProg2() {
		gl.useProgram(prog2);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.buf2);
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

	useProg4() {
		gl.useProgram(prog4);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.buf4);
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

	useProg5() {
		gl.useProgram(prog5);
		gl.uniform4fv(gl.getUniformLocation(prog5, 'overallColor'),
			new Float32Array([1,1,1, 1]));
		gl.bindBuffer(gl.ARRAY_BUFFER, this.buf5);
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

}