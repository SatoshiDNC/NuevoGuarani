var compareData;
var df = (function() {

  var gl = undefined; function glSet(context) { gl = context; }
  var prog = undefined; function getProg() { return prog; }

function loadShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function initShaderProgram(gl, vs, fs) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vs);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fs);
  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);
  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
    return null;
  }
  return shaderProgram;
}

  var ff = (function() {
    const CHUNK_EOF = 0;
    const CHUNK_GLYPHSET = 1;
    const CHUNK_GLYPHATTR = 2;
    const CHUNK_COLORGLYPHSET = 3;
    const CHUNK_COLORGLYPHATTR = 4;

    // attributes for CHUNK_GLYPHATTR chunks
    const ATTR_GLYPH_WIDTH = 0;
    const ATTR_GLYPH_HEIGHT = 1;
    const ATTR_GLYPH_X1 = 2;
    const ATTR_GLYPH_Y1 = 3;
    const ATTR_GLYPH_X2 = 4;
    const ATTR_GLYPH_Y2 = 5;
    const ATTR_GLYPH_IMGX = 6;
    const ATTR_GLYPH_IMGY = 7;
    const ATTR_GLYPH_IMGZD = 8;

    // attributes for CHUNK_COLORGLYPHATTR chunks
    const ATTR_COLORGLYPH_COLORS = 0;

    // z/depth values
    const ZD_ENCODE = [];
    ZD_ENCODE[0] = []; ZD_ENCODE[0][1] = 0;
    ZD_ENCODE[1] = []; ZD_ENCODE[1][1] = 1;
    ZD_ENCODE[2] = []; ZD_ENCODE[2][1] = 2;
    ZD_ENCODE[3] = []; ZD_ENCODE[3][1] = 3;
    ZD_ENCODE[4] = []; ZD_ENCODE[4][1] = 4;
    ZD_ENCODE[5] = []; ZD_ENCODE[5][1] = 5;
    ZD_ENCODE[0][2] = 6;
    ZD_ENCODE[1][2] = 7;
    ZD_ENCODE[2][2] = 8;
    ZD_ENCODE[3][2] = 9;
    ZD_ENCODE[0][3] = 10;
    ZD_ENCODE[1][3] = 11;

    const ZD_DECODE = [];
    ZD_DECODE[0] = [0, 1];
    ZD_DECODE[1] = [1, 1];
    ZD_DECODE[2] = [2, 1];
    ZD_DECODE[3] = [3, 1];
    ZD_DECODE[4] = [4, 1];
    ZD_DECODE[5] = [5, 1];
    ZD_DECODE[6] = [0, 2];
    ZD_DECODE[7] = [1, 2];
    ZD_DECODE[8] = [2, 2];
    ZD_DECODE[9] = [3, 2];
    ZD_DECODE[10] = [0, 3];
    ZD_DECODE[11] = [1, 3];

    class Packer {
      makeInt(n, length) { if(n<0) n=2**(length*4)+n; return ((new Array(length+1).join('0')) + n.toString(16)).substr(-length); }
      makeAttr(type, attr, size, value) { return (type).toString(16) + this.makeInt(1+1+size, 2) + this.makeInt(attr, 1) + this.makeInt(size, 1) + this.makeInt(value, size); }
      makeAttrs(type, attr, size, values) {
        var m=~~(253/size), n=values.length, i=0, buf='';
        while (n > 0) {
          var l = n>m? m : n; n-=l;
          buf += (type).toString(16) + this.makeInt(1+1+size*l, 2) + this.makeInt(attr, 1) + this.makeInt(size, 1);
          for (var j=0; j<l; j++) { buf += this.makeInt(values[i], size); i++; }
        }
        return buf;
      }
      makeColorAttrs(values) { // each value in the array of values is itself an array of 32-bit integer color values
        function from32(c) { return [((c/0x01000000)&0xFF)/255, ((c/0x00010000)&0xFF)/255, ((c/0x00000100)&0xFF)/255, ((c/0x00000001)&0xFF)/255]; }
        var m=254, n=0, i=0, buf='', tmp='';
        while (i < values.length) {
          var k = Math.min(Math.max(0, values[i].length), 15);
          if (n + 1+3*k > m) {
            buf += (CHUNK_COLORGLYPHATTR).toString(16) + this.makeInt(1+tmp.length, 2) + this.makeInt(ATTR_COLORGLYPH_COLORS, 1) + tmp;
            tmp=''; n=0;
          }
          n+=1+3*k; tmp+=(k).toString(16);
          for (var j=0; j<k; j++) {
            var c = from32(values[i][j]);
            tmp += Math.min(Math.max(0, ~~(c[0]*15)), 15).toString(16) + Math.min(Math.max(0, ~~(c[1]*15)), 15).toString(16) + Math.min(Math.max(0, ~~(c[2]*15)), 15).toString(16);
          }
          i++;
        }
        if (tmp.length > 0) {
          buf += (CHUNK_COLORGLYPHATTR).toString(16) + this.makeInt(1+tmp.length, 2) + this.makeInt(ATTR_COLORGLYPH_COLORS, 1) + tmp;
        }
        return buf;
      }
      //assembleAttrs(type, attr, size, values) {
      //  var m=~~(253/size), n=values.length, i=0, buf='';
      //  while (n > 0) {
      //    var l = n>m? m : n; n-=l;
      //    buf += (type).toString(16) + this.makeInt(1+1+size*l, 2) + this.makeInt(attr, 1) + this.makeInt(size, 1);
      //    for (var j=0; j<l; j++) { buf += (values[i] + (new Array(size+1).join('0'))).substr(0, size); i++; }
      //  }
      //  return buf;
      //}
      makeGlyphSet(first, last, colorMode) { return (colorMode?df.ff.CHUNK_COLORGLYPHSET:df.ff.CHUNK_GLYPHSET).toString(16) + '0c' + this.makeInt(first, 6) + this.makeInt(last, 6); }
      makeGlyphAttr(attr, size, value) { return this.makeAttr(df.ff.CHUNK_GLYPHATTR, attr, size, value); }
      makeGlyphAttrs(attr, size, values) { return this.makeAttrs(df.ff.CHUNK_GLYPHATTR, attr, size, values); }
      //makeGlyphPtr(x,y,z) { return ZD_ENCODE[z][1].toString(16) + this.makeInt(x, 4) + this.makeInt(y, 4); }
      //makeGlyphPtrs(values) { return this.assembleAttrs(df.ff.CHUNK_GLYPHATTR, df.ff.ATTR_GLYPH_IMG, 9, values); }
      //makeColorAttr(attr, size, value) { return this.makeAttr(df.ff.CHUNK_COLORATTR, attr, size, value); }
      //makeColorAttrs(attr, size, values) { return this.makeAttrs(df.ff.CHUNK_COLORATTR, attr, size, values); }
      //makeSolidAttr(attr, size, value) { return this.makeAttr(df.ff.CHUNK_SOLIDATTR, attr, size, value); }
      //makeSolidAttrs(attr, size, values) { return this.makeAttrs(df.ff.CHUNK_SOLIDATTR, attr, size, values); }
      makeEOF() { return (df.ff.CHUNK_EOF).toString(16) + '00'; }
    }

    class Parser {
      constructor(data) { this.reset(data); }
      reset(data) {
        this.data = data;
        this.i = 0;
      }
      skip(length) { this.i += length; }
      getInt(length) {
        var v;
        if (length + this.i <= this.data.length) v = parseInt(this.data.substr(this.i, length), 16);
        else v = parseInt((this.data + (new Array(this.i + length+1).join('0'))).substr(this.i, length), 16);
        this.i += length; return v;
      }
      getChunkHeader() {
        var type = this.getInt(1), length = this.getInt(2);
        return { type:type, length:length, };
      }
      getGlyphSet() {
        var first = this.getInt(6), last = this.getInt(6);
        return { first:first, last:last, };
      }
      getAttrs(length) {
        var attr = this.getInt(1), size = this.getInt(1), values = [];
        for (var i=0; i<(length-1-1)/size; i++) { values[values.length] = this.getInt(size); }
        return { attr:attr, size:size, values:values, };
      }
      getColorAttrs(length) {
        function to32(c) { return (~~(c[0]*255))*0x01000000 + (~~(c[1]*255))*0x00010000 + (~~(c[2]*255))*0x00000100 + (~~(c[3]*255))*0x00000001; }
        var attr = this.getInt(1), values = [];
        var l = length-1;
        while (l > 0) {
          var n = this.getInt(1); l-=1;
          var r,g,b, v = [];
          for (var i=0; i<n; i++) {
            if (l > 0) r = this.getInt(1); l-=1;
            if (l > 0) g = this.getInt(1); l-=1;
            if (l > 0) b = this.getInt(1); l-=1;
            v[v.length] = to32([r/15,g/15,b/15,1]);
          }
          values[values.length] = v;
        }
        return { attr:attr, values:values, };
      }
      applySign(v, length) {
        for (var i=0; i<v.length; i++) { if (v[i] >= 2**(length*4-1)) v[i] -= 2**(length*4); }
      }
    }

    return {
      CHUNK_EOF: CHUNK_EOF,
      CHUNK_GLYPHSET: CHUNK_GLYPHSET,
      CHUNK_GLYPHATTR: CHUNK_GLYPHATTR,
      CHUNK_COLORGLYPHSET: CHUNK_COLORGLYPHSET,
      CHUNK_COLORGLYPHATTR: CHUNK_COLORGLYPHATTR,
      ZD_ENCODE: ZD_ENCODE,
      ZD_DECODE: ZD_DECODE,
      ATTR_GLYPH_WIDTH: ATTR_GLYPH_WIDTH,
      ATTR_GLYPH_HEIGHT: ATTR_GLYPH_HEIGHT,
      ATTR_GLYPH_X1: ATTR_GLYPH_X1,
      ATTR_GLYPH_Y1: ATTR_GLYPH_Y1,
      ATTR_GLYPH_X2: ATTR_GLYPH_X2,
      ATTR_GLYPH_Y2: ATTR_GLYPH_Y2,
      ATTR_GLYPH_IMGX: ATTR_GLYPH_IMGX,
      ATTR_GLYPH_IMGY: ATTR_GLYPH_IMGY,
      ATTR_GLYPH_IMGZD: ATTR_GLYPH_IMGZD,
      ATTR_COLORGLYPH_COLORS: ATTR_COLORGLYPH_COLORS,
      Packer: Packer,
      Parser: Parser,
    };

  })();

  const vertexShaderSource = `
    attribute vec2 aVertex;
    attribute vec2 aUV;
    varying vec2 vTex;
    uniform vec2 pos;
    uniform mat4 uProjectionMatrix;
    uniform mat4 uModelViewMatrix;
    void main(void) {
      gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertex + pos, 0.0, 1.0);
      vTex = aUV;
    }
    `;
  const fragmentShaderSource = `
    precision highp float;
    varying vec2 vTex;
    uniform sampler2D sampler0;
    uniform lowp vec4 color1;
    uniform lowp vec4 color2;
    uniform lowp vec4 color3;
    uniform int layer;
    uniform int depth;
    uniform float scaleFactor;
    uniform int sampleBase;
    void main(void){
      float v1=0.0, v2=0.0, v3=0.0;
      int ss = sampleBase;
      float tx =1.0/64.0;
      float ty =1.0/128.0;
      float o = float(ss-1)/2.0;
      int i=0, j=0;
      for(int i=0; i<4; i++) {
				if (i>=ss) break;
        for(int j=0; j<4; j++) {
					if (j>=ss) break;
          vec4 c = texture2D(sampler0, vTex+vec2((float(i)-o)/float(ss)*tx/scaleFactor,(float(j)-o)/float(ss)*ty/scaleFactor));//texture(tex, texCoordOut+vec2((i-o)/float(ss)*tx/scaleFactor,(j-o)/float(ss)*ty/scaleFactor));
          if (layer == 0) {
            v1 += c.r>=.5 ? 1.0 : 0.0;
            if (depth >= 2) v2 += c.g>=.5 ? 1.0 : 0.0;
            if (depth >= 3) v3 += c.b>=.5 ? 1.0 : 0.0;
          } else if (layer == 1) {
            v1 += c.g>=.5 ? 1.0 : 0.0;
            if (depth >= 2) v2 += c.b>=.5 ? 1.0 : 0.0;
          } else if (layer == 2) {
            v1 += c.b>=.5 ? 1.0 : 0.0;
          }
        }
      }
      //vec4 o1 = vec4(color1.rgb * (v1/float(ss*ss)), v1/float(ss*ss));
      //vec4 o2 = vec4(color2.rgb * (v2/float(ss*ss)), v2/float(ss*ss));
      //vec4 o3 = vec4(color3.rgb * (v3/float(ss*ss)), v3/float(ss*ss));
      vec4 o1 = vec4(color1.rgb, v1/float(ss*ss)*color1.a);
      vec4 o2 = vec4(color2.rgb, v2/float(ss*ss)*color2.a);
      vec4 o3 = vec4(color3.rgb, v3/float(ss*ss)*color3.a);
      o1.rgb += o2.rgb * (1.0 - o1.a); o1.a += o2.a * (1.0 - o1.a);
      o1.rgb += o3.rgb * (1.0 - o1.a); o1.a += o3.a * (1.0 - o1.a);
      gl_FragColor = o1;
    }
    `;

  class GlyphSet {
    constructor() {
			this.nextId = 1;
			this.fidelity = 4;
		}
    loadFromURL(name, callback, src) {
      var img = new Image();
      img.associatedGlyphSet = this;
      img.associatedCallback = callback;
      img.associatedName = name;
      img.onload = this.imgCallback;
      img.src = src;
    }
    loadFromImage(name, callback, imageElement) {
      this.loadFromObject(name, callback, imageElement);
    }
    loadFromCanvas(name, callback, canvasElement) {
      this.loadFromObject(name, callback, canvasElement);
    }
    initGlyphs() { // new
      this.glyphCodes = [];
      this.glyphWidths = []; this.glyphHeights = [];
      this.glyphX1 = []; this.glyphY1 = [];
      this.glyphX2 = []; this.glyphY2 = [];
      this.glyphSourceX = [], this.glyphSourceY = [], this.glyphSourceZD = [];
      this.glyphHasColors = [];
      this.glyphColors = [];
    }
    //initColors() { // new
    //  this.glyphColorIndices = [];
    //  this.colorType = [];
    //  this.solidRGB = [];
    //  this.solidMode = [];
    //}
    isReady() { return (this.ready) ? true : false; }
    imgCallback(event) {
      var img = event.target;
      var obj = img.associatedGlyphSet;
      obj.loadFromObject.call(obj, img.associatedName, img.associatedCallback, img);
    }
    loadFromObject(name, callback, element) {
      this.ready = false;
      this.finalCallback = callback;
      this.name = name;

//      this.tLine = 0; this.mLine = 0; this.bLine = 0; this.xSize = 0; this.ySize = 0;
//      this.lo = 0; this.hi = 0;
//      this.proportional = 0; this.colorLayers = 0;

      this.initGlyphs();
      //this.initColors();

      // per glyph
//      this.spaceBefore = [], this.spaceAfter = [], this.width = [], this.planes = [], this.planeIndex = [];

      // per plane
//      this.sourceX = [], this.sourceY = [], this.layer = [], this.color = [];
      this.pixCoords = [], this.texCoords = [];

      this.init2(element);
//console.log('Loaded '+ this.glyphCodes.length +' glyphs in new format.');
      if (this.glyphCodes.length == 0) {
				this.init1(element);
console.log('Loaded '+ this.glyphCodes.length +' glyphs in old format.');
			}
    }
    init1(image) {
      var img = image;
      var tempCanvas = document.createElement('canvas');
      tempCanvas.width = img.width;
      tempCanvas.height = img.height * 2;
      var c = tempCanvas.getContext('2d');
      c.drawImage(img, 0, 0);
      c.drawImage(img, 0, img.height);

      var imageData = c.getImageData(0, 0, img.width, img.height);
      var d = imageData.data;
      for (var i=0; i<d.length; i+=4) {
        d[i+0] = (d[i+0]&240) + ~~((d[i+0]&240)/16);
        d[i+1] = (d[i+1]&240) + ~~((d[i+1]&240)/16);
        d[i+2] = (d[i+2]&240) + ~~((d[i+2]&240)/16);
      }
      c.putImageData(imageData, 0, 0);
      var imageData = c.getImageData(0, img.height, img.width, img.height);
      var d = imageData.data;
      for (var i=0; i<d.length; i+=4) {
        d[i+0] = (d[i+0]&15) + (d[i+0]&15)*16;
        d[i+1] = (d[i+1]&15) + (d[i+1]&15)*16;
        d[i+2] = (d[i+2]&15) + (d[i+2]&15)*16;
      }
      c.putImageData(imageData, 0, img.height);

      function getDataBlock(r) {
        var p = 0, z = r.zd<=5? r.zd : r.zd<=9? r.zd-6 : r.zd-10, depth = r.zd<=5? 1 : r.zd<=9? 2 : 3, zz = ~~(z/2);
        var imageData = c.getImageData(r.x, r.y+((z%2)==1?img.height:0), r.w, r.h);
        var d = imageData.data;
        function getNyb() {
          while (p<d.length && (((p%4) == 0 && (zz>0)) || ((p%4) == 1 && (zz>1||depth+zz<2)) || ((p%4) == 2 && (depth+zz<3)) || (p%4) == 3)) { p+=1; }
          var n = d[p]&15; p+=1;
          while (p<d.length && (((p%4) == 0 && (zz>0)) || ((p%4) == 1 && (zz>1||depth+zz<2)) || ((p%4) == 2 && (depth+zz<3)) || (p%4) == 3)) { p+=1; }
          return n;
        }
        var blockType = getNyb();
        var zd = getNyb();
        var nw = (getNyb())*16 + (getNyb()); if (nw==0) nw=256;
        var nh = (getNyb())*16 + (getNyb()); if (nh==0) nh=256;
        var nx = (getNyb())*4096 + (getNyb())*256 + (getNyb())*16 + (getNyb());
        var ny = (getNyb())*4096 + (getNyb())*256 + (getNyb())*16 + (getNyb());
        var data = '';
        while (p<d.length) {
          data = data + (getNyb()).toString(16);
        }
        r.x = nx;
        r.y = ny;
        r.w = nw;
        r.h = nh;
        r.zd = zd;
        return data;
      }

      var r=[]; r["x"]=img.width-2; r["y"]=1; r["w"]=1; r["h"]=5; r["zd"]=10;
      var hexData = getDataBlock(r, true);
      do {
        hexData = hexData + getDataBlock(r);
      } while (r.x);

      var p = new ff.Parser(hexData);
      var chunk = p.getChunkHeader();
      var iw=0,ih=0, ix0=0,iy0=0, ix1=0,iy1=0, isx=0,isy=0,isz=0;
      var ici=0, ict=0, isrgb=0, ism=0;
      var igc=0;
      while (chunk.type != ff.CHUNK_EOF) {
        //if (chunk.type == ff.CHUNK_GLYPHCOLORATTR && this.glyphColorIndices.length == 0) {
        //  for (var i=0; i<this.glyphCodes.length; i++) for (var j=0; j<this.glyphColors[i]; j++) { this.glyphColorIndices[this.glyphColorIndices.length] = 0; }
        //}
        if (chunk.type == ff.CHUNK_COLORATTR && this.colorType.length == 0) {
          for (var i=0; i<this.glyphColorIndices.length; i++) { while (this.glyphColorIndices[i] >= this.colorType.length) this.colorType[this.colorType.length] = 0; }
        }
        if (chunk.type == ff.CHUNK_SOLIDATTR && this.solidRGB.length == 0) {
          for (var i=0; i<this.colorType.length; i++) { if (this.colorType[i]==0) { this.solidRGB[this.solidRGB.length] = 0; this.solidMode[this.solidMode.length] = 0; } }
        }
        switch(chunk.type) {
        case ff.CHUNK_GLYPHSET:
        case ff.CHUNK_COLORGLYPHSET:
          if(chunk.length==12) {
            var gs = p.getGlyphSet();
            for (i=gs.first; i<=gs.last; i++) {
              var l = this.glyphCodes.length;
              this.glyphCodes[l] = i;
              this.glyphWidths[l] = 8; this.glyphHeights[l] = 8;
              this.glyphX1[l] = 0; this.glyphY1[l] = 0;
              this.glyphX2[l] = 8; this.glyphY2[l] = 0;
              this.glyphHasColors[l] = (chunk.type==ff.CHUNK_COLORGLYPHSET)?1:0;
              this.glyphColors[l] = [];
            }
          } else {
            console.log('chuck length: ', chunk.length);
            console.log('error: bad data 1:', p.data.substr(p.i, 10));
            p.skip(chunk.length);
          }
          break;
        case ff.CHUNK_GLYPHATTR:
          var start = p.i;
          var ga = p.getAttrs(chunk.length);
          if (ga.values.length == 1) {
            switch((chunk.type<<16) + ga.attr) {
            case (ff.CHUNK_GLYPHATTR<<16) + ff.ATTR_GLYPH_WIDTH: for (i=0; i<this.glyphCodes.length; i++) { this.glyphWidths[i] = ga.values[0]; } break;
            case (ff.CHUNK_GLYPHATTR<<16) + ff.ATTR_GLYPH_HEIGHT: for (i=0; i<this.glyphCodes.length; i++) { this.glyphHeights[i] = ga.values[0]; } break;
            case (ff.CHUNK_GLYPHATTR<<16) + ff.ATTR_GLYPH_X1: p.applySign(ga.values, ga.size); for (i=0; i<this.glyphCodes.length; i++) { this.glyphX1[i] = ga.values[0]; } break;
            case (ff.CHUNK_GLYPHATTR<<16) + ff.ATTR_GLYPH_Y1: p.applySign(ga.values, ga.size); for (i=0; i<this.glyphCodes.length; i++) { this.glyphY1[i] = ga.values[0]; } break;
            case (ff.CHUNK_GLYPHATTR<<16) + ff.ATTR_GLYPH_X2: p.applySign(ga.values, ga.size); for (i=0; i<this.glyphCodes.length; i++) { this.glyphX2[i] = ga.values[0]; } break;
            case (ff.CHUNK_GLYPHATTR<<16) + ff.ATTR_GLYPH_Y2: p.applySign(ga.values, ga.size); for (i=0; i<this.glyphCodes.length; i++) { this.glyphY2[i] = ga.values[0]; } break;
            case (ff.CHUNK_GLYPHATTR<<16) + ff.ATTR_GLYPH_IMGX: for (i=0; i<this.glyphCodes.length; i++) { this.glyphSourceX[i] = ga.values[0]; } break;
            case (ff.CHUNK_GLYPHATTR<<16) + ff.ATTR_GLYPH_IMGY: for (i=0; i<this.glyphCodes.length; i++) { this.glyphSourceY[i] = ga.values[0]; } break;
            case (ff.CHUNK_GLYPHATTR<<16) + ff.ATTR_GLYPH_IMGZD:for (i=0; i<this.glyphCodes.length; i++) { this.glyphSourceZD[i]= ga.values[0]; } break;
            //case (ff.CHUNK_GLYPHATTR<<16) + ff.ATTR_GLYPH_COLORS: for (i=0; i<this.glyphCodes.length; i++) { this.glyphColors[i] = ga.values[0]; } break;
            //case (ff.CHUNK_GLYPHCOLORATTR<<16) + ff.ATTR_GLYPHCOLOR_INDEX: for (i=0; i<this.glyphColorIndices.length; i++) { this.glyphColorIndices[i] = ga.values[0]; } break;
            //case (ff.CHUNK_COLORATTR<<16) + ff.ATTR_COLOR_TYPE: for (i=0; i<this.colorType.length; i++) { this.colorType[i] = ga.values[0]; } break;
            //case (ff.CHUNK_SOLIDATTR<<16) + ff.ATTR_SOLID_RGB: for (i=0; i<this.solidRGB.length; i++) { this.solidRGB[i] = ga.values[0]; } break;
            //case (ff.CHUNK_SOLIDATTR<<16) + ff.ATTR_SOLID_MODE: for (i=0; i<this.solidMode.length; i++) { this.solidMode[i] = ga.values[0]; } break;
            default:
              console.log('chuck length: ', chunk.length);
              console.log('ignoring unknown attribute: ', chunk.type, ga.attr);
              p.skip(chunk.length);
            }
          } else {
            switch((chunk.type<<16) + ga.attr) {
            case (ff.CHUNK_GLYPHATTR<<16) + ff.ATTR_GLYPH_WIDTH: for (i=0; i<ga.values.length; i++) { this.glyphWidths[iw++] = ga.values[i]; } break;
            case (ff.CHUNK_GLYPHATTR<<16) + ff.ATTR_GLYPH_HEIGHT: for (i=0; i<ga.values.length; i++) { this.glyphHeights[ih++] = ga.values[i]; } break;
            case (ff.CHUNK_GLYPHATTR<<16) + ff.ATTR_GLYPH_X1: p.applySign(ga.values, ga.size); for (i=0; i<ga.values.length; i++) { this.glyphX1[ix0++] = ga.values[i]; } break;
            case (ff.CHUNK_GLYPHATTR<<16) + ff.ATTR_GLYPH_Y1: p.applySign(ga.values, ga.size); for (i=0; i<ga.values.length; i++) { this.glyphY1[iy0++] = ga.values[i]; } break;
            case (ff.CHUNK_GLYPHATTR<<16) + ff.ATTR_GLYPH_X2: p.applySign(ga.values, ga.size); for (i=0; i<ga.values.length; i++) { this.glyphX2[ix1++] = ga.values[i]; } break;
            case (ff.CHUNK_GLYPHATTR<<16) + ff.ATTR_GLYPH_Y2: p.applySign(ga.values, ga.size); for (i=0; i<ga.values.length; i++) { this.glyphY2[iy1++] = ga.values[i]; } break;
            case (ff.CHUNK_GLYPHATTR<<16) + ff.ATTR_GLYPH_IMGX: for (i=0; i<ga.values.length; i++) { this.glyphSourceX[isx++] = ga.values[i]; } break;
            case (ff.CHUNK_GLYPHATTR<<16) + ff.ATTR_GLYPH_IMGY: for (i=0; i<ga.values.length; i++) { this.glyphSourceY[isy++] = ga.values[i]; } break;
            case (ff.CHUNK_GLYPHATTR<<16) + ff.ATTR_GLYPH_IMGZD:for (i=0; i<ga.values.length; i++) { this.glyphSourceZD[isz++]= ga.values[i]; } break;
            //case (ff.CHUNK_GLYPHATTR<<16) + ff.ATTR_GLYPH_COLORS: for (i=0; i<ga.values.length; i++) { this.glyphColors[iy1++] = ga.values[i]; } break;
            //case (ff.CHUNK_GLYPHCOLORATTR<<16) + ff.ATTR_GLYPHCOLOR_INDEX: for (i=0; i<ga.values.length; i++) { this.glyphColorIndices[ici++] = ga.values[i]; } break;
            //case (ff.CHUNK_COLORATTR<<16) + ff.ATTR_COLOR_TYPE: for (i=0; i<ga.values.length; i++) { this.colorType[ict++] = ga.values[i]; } break;
            //case (ff.CHUNK_SOLIDATTR<<16) + ff.ATTR_SOLID_RGB: for (i=0; i<ga.values.length; i++) { this.solidRGB[isrgb++] = ga.values[i]; } break;
            //case (ff.CHUNK_SOLIDATTR<<16) + ff.ATTR_SOLID_MODE: for (i=0; i<ga.values.length; i++) { this.solidMode[ism++] = ga.values[i]; } break;
            default:
              console.log('ignoring unknown attribute: ', chunk.type, ga.attr);
              p.skip(chunk.length);
            }
          }
          if (p.i-start!=chunk.length) {
            console.log('error: bad data 2');
          }
          break;
        case ff.CHUNK_COLORGLYPHATTR:
          var ga = p.getColorAttrs(chunk.length);
          switch(ga.attr) {
          case ff.ATTR_COLORGLYPH_COLORS:
            for (i=0; i<ga.values.length; i++) { while (!this.glyphHasColors[igc] && igc < this.glyphCodes.length) igc++; if (igc < this.glyphCodes.length) this.glyphColors[igc++] = ga.values[i]; }
            break;
          default:
            console.log('ignoring unknown color attribute: ', chunk.type, attr);
            p.skip(chunk.length-1);
          }
          break;
        default:
          console.log('ignoring unknown chunk type: ', chunk);
          p.skip(chunk.length);
        }
        chunk = p.getChunkHeader();
      }

      for (var i=0; i<this.glyphCodes.length; i++) {
        if ((this.glyphSourceZD[i] % 2)==1) this.glyphSourceY[i] += img.height;
      }

      var bmWidth = img.width;
      var bmHeight = img.height;

      for (var g = 0; g < this.glyphCodes.length; g++) { var b = g;
        this.pixCoords[b*8 + 0] = 0; this.pixCoords[b*8 + 1] = this.glyphHeights[g];
        this.pixCoords[b*8 + 2] = 0; this.pixCoords[b*8 + 3] = 0;
        this.pixCoords[b*8 + 4] = this.glyphWidths[g]; this.pixCoords[b*8 + 5] = 0;
        this.pixCoords[b*8 + 6] = this.glyphWidths[g]; this.pixCoords[b*8 + 7] = this.glyphHeights[g];
        this.texCoords[b*8 + 0] = this.glyphSourceX[b] / bmWidth; this.texCoords[b*8 + 1] = (this.glyphSourceY[b] + this.glyphHeights[g]) / (bmHeight*2);
        this.texCoords[b*8 + 2] = this.glyphSourceX[b] / bmWidth; this.texCoords[b*8 + 3] = this.glyphSourceY[b] / (bmHeight*2);
        this.texCoords[b*8 + 4] = (this.glyphSourceX[b] + this.glyphWidths[g]) / bmWidth; this.texCoords[b*8 + 5] = this.glyphSourceY[b] / (bmHeight*2);
        this.texCoords[b*8 + 6] = (this.glyphSourceX[b] + this.glyphWidths[g]) / bmWidth; this.texCoords[b*8 + 7] = (this.glyphSourceY[b] + this.glyphHeights[g]) / (bmHeight*2);
      }

      var imageData = c.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
      var d = imageData.data;
      for (var i = 0; i < ~~(d.length / 2); i += 4) {
        d[i + 0] = (d[i + 0] & 15) * 16; // red
        d[i + 1] = (d[i + 1] & 15) * 16; // green
        d[i + 2] = (d[i + 2] & 15) * 16; // blue
        d[i + 0] = d[i + 0] | ~~(d[i + 0] / 16); // red
        d[i + 1] = d[i + 1] | ~~(d[i + 1] / 16); // green
        d[i + 2] = d[i + 2] | ~~(d[i + 2] / 16); // blue
      }
      for (var i = ~~(d.length / 2); i < d.length; i += 4) {
        d[i + 0] = (~~(d[i + 0] / 16)) * 16; // red
        d[i + 1] = (~~(d[i + 1] / 16)) * 16; // green
        d[i + 2] = (~~(d[i + 2] / 16)) * 16; // blue
        d[i + 0] = d[i + 0] | ~~(d[i + 0] / 16); // red
        d[i + 1] = d[i + 1] | ~~(d[i + 1] / 16); // green
        d[i + 2] = d[i + 2] | ~~(d[i + 2] / 16); // blue
      }
      c.putImageData(imageData, 0, 0);
      this.data = tempCanvas;

      d = null; imageData = null;
      c = null; tempCanvas = null;

      this.ready = true;
      if (this.finalCallback) this.finalCallback.call(null);
    }
    init2(image) {
      var img = image;
      var tempCanvas = document.createElement('canvas');
      tempCanvas.width = img.width;
      tempCanvas.height = img.height * 2;
      var c = tempCanvas.getContext('2d', { willReadFrequently: true });
      c.drawImage(img, 0, 0);
      c.drawImage(img, 0, img.height);

      var imageData = c.getImageData(0, img.height, img.width, img.height);
      var d = imageData.data;
      for (var i=0; i<d.length; i+=4) {
        d[i+0] = (d[i+0]&240) + ~~((d[i+0]&240)/16);
        d[i+1] = (d[i+1]&240) + ~~((d[i+1]&240)/16);
        d[i+2] = (d[i+2]&240) + ~~((d[i+2]&240)/16);
      }
      c.putImageData(imageData, 0, img.height);
      var imageData = c.getImageData(0, 0, img.width, img.height);
      var d = imageData.data;
      for (var i=0; i<d.length; i+=4) {
        d[i+0] = (d[i+0]&15) + (d[i+0]&15)*16;
        d[i+1] = (d[i+1]&15) + (d[i+1]&15)*16;
        d[i+2] = (d[i+2]&15) + (d[i+2]&15)*16;
      }
      c.putImageData(imageData, 0, 0);

      function getDataBlock(r, init=false) {
        var p = 0, z = r.zd<=5? r.zd : r.zd<=9? r.zd-6 : r.zd-10, depth = r.zd<=5? 1 : r.zd<=9? 2 : 3, zz = ~~(z/2);
        var imageData = c.getImageData(r.x, r.y+((z%2)==1?img.height:0), r.w, r.h);
        var d = imageData.data;
        function getNyb() {
          while (p<d.length && (((p%4) == 0 && (zz>0)) || ((p%4) == 1 && (zz>1||depth+zz<2)) || ((p%4) == 2 && (depth+zz<3)) || (p%4) == 3)) { p+=1; }
          var n = d[p]&15; p+=1;
          while (p<d.length && (((p%4) == 0 && (zz>0)) || ((p%4) == 1 && (zz>1||depth+zz<2)) || ((p%4) == 2 && (depth+zz<3)) || (p%4) == 3)) { p+=1; }
          return n;
        }
        if (init) {
          var ff = '';
          ff += getNyb().toString(16);
          ff += getNyb().toString(16);
          ff += getNyb().toString(16);
          ff += getNyb().toString(16);
          r.ver = ff;
        }
        var blockType = getNyb();
        var zd = getNyb();
        var nw = (getNyb())*16 + (getNyb()); if (nw==0) nw=256;
        var nh = (getNyb())*16 + (getNyb()); if (nh==0) nh=256;
        var nx = (getNyb())*4096 + (getNyb())*256 + (getNyb())*16 + (getNyb());
        var ny = (getNyb())*4096 + (getNyb())*256 + (getNyb())*16 + (getNyb());
        var data = '';
        while (p<d.length) {
          data = data + (getNyb()).toString(16);
        }
        r.x = nx;
        r.y = ny;
        r.w = nw;
        r.h = nh;
        r.zd = zd;
        return data;
      }

      var r=[]; r["x"]=img.width-2; r["y"]=1; r["w"]=1; r["h"]=6; r["zd"]=10;
      var hexData = getDataBlock(r, true);
//console.log('File format: '+r.ver);
      if (r.ver != 'fed1') { console.log('Unrecognized file format.'); return; }
      do {
        hexData = hexData + getDataBlock(r);
      } while (r.x);

      var p = new ff.Parser(hexData);
      var chunk = p.getChunkHeader();
      var iw=0,ih=0, ix0=0,iy0=0, ix1=0,iy1=0, isx=0,isy=0,isz=0;
      var ici=0, ict=0, isrgb=0, ism=0;
      var igc=0;
      while (chunk.type != ff.CHUNK_EOF) {
        //if (chunk.type == ff.CHUNK_GLYPHCOLORATTR && this.glyphColorIndices.length == 0) {
        //  for (var i=0; i<this.glyphCodes.length; i++) for (var j=0; j<this.glyphColors[i]; j++) { this.glyphColorIndices[this.glyphColorIndices.length] = 0; }
        //}
        if (chunk.type == ff.CHUNK_COLORATTR && this.colorType.length == 0) {
          for (var i=0; i<this.glyphColorIndices.length; i++) { while (this.glyphColorIndices[i] >= this.colorType.length) this.colorType[this.colorType.length] = 0; }
        }
        if (chunk.type == ff.CHUNK_SOLIDATTR && this.solidRGB.length == 0) {
          for (var i=0; i<this.colorType.length; i++) { if (this.colorType[i]==0) { this.solidRGB[this.solidRGB.length] = 0; this.solidMode[this.solidMode.length] = 0; } }
        }
        switch(chunk.type) {
        case ff.CHUNK_GLYPHSET:
        case ff.CHUNK_COLORGLYPHSET:
          if(chunk.length==12) {
            var gs = p.getGlyphSet();
            for (i=gs.first; i<=gs.last; i++) {
              var l = this.glyphCodes.length;
              this.glyphCodes[l] = i;
              this.glyphWidths[l] = 8; this.glyphHeights[l] = 8;
              this.glyphX1[l] = 0; this.glyphY1[l] = 0;
              this.glyphX2[l] = 8; this.glyphY2[l] = 0;
              this.glyphHasColors[l] = (chunk.type==ff.CHUNK_COLORGLYPHSET)?1:0;
              this.glyphColors[l] = [];
            }
          } else {
            console.log('chuck length: ', chunk.length);
            console.log('error: bad data 1:', p.data.substr(p.i, 10));
            return;
          }
          break;
        case ff.CHUNK_GLYPHATTR:
          var start = p.i;
          var ga = p.getAttrs(chunk.length);
          if (ga.values.length == 1) {
            switch((chunk.type<<16) + ga.attr) {
            case (ff.CHUNK_GLYPHATTR<<16) + ff.ATTR_GLYPH_WIDTH: for (i=0; i<this.glyphCodes.length; i++) { this.glyphWidths[iw++] = ga.values[0]; if(iw>=this.glyphCodes.length)break; } break;
            case (ff.CHUNK_GLYPHATTR<<16) + ff.ATTR_GLYPH_HEIGHT: for (i=0; i<this.glyphCodes.length; i++) { this.glyphHeights[ih++] = ga.values[0]; if(ih>=this.glyphCodes.length)break; } break;
            case (ff.CHUNK_GLYPHATTR<<16) + ff.ATTR_GLYPH_X1: p.applySign(ga.values, ga.size); for (i=0; i<this.glyphCodes.length; i++) { this.glyphX1[ix0++] = ga.values[0]; if(ix0>=this.glyphCodes.length)break;} break;
            case (ff.CHUNK_GLYPHATTR<<16) + ff.ATTR_GLYPH_Y1: p.applySign(ga.values, ga.size); for (i=0; i<this.glyphCodes.length; i++) { this.glyphY1[iy0++] = ga.values[0]; if(iy0>=this.glyphCodes.length)break;} break;
            case (ff.CHUNK_GLYPHATTR<<16) + ff.ATTR_GLYPH_X2: p.applySign(ga.values, ga.size); for (i=0; i<this.glyphCodes.length; i++) { this.glyphX2[ix1++] = ga.values[0]; if(ix1>=this.glyphCodes.length)break;} break;
            case (ff.CHUNK_GLYPHATTR<<16) + ff.ATTR_GLYPH_Y2: p.applySign(ga.values, ga.size); for (i=0; i<this.glyphCodes.length; i++) { this.glyphY2[iy1++] = ga.values[0]; if(iy1>=this.glyphCodes.length)break;} break;
            case (ff.CHUNK_GLYPHATTR<<16) + ff.ATTR_GLYPH_IMGX: for (i=0; i<this.glyphCodes.length; i++) { this.glyphSourceX[isx++] = ga.values[0]; if(isx>=this.glyphCodes.length)break; } break;
            case (ff.CHUNK_GLYPHATTR<<16) + ff.ATTR_GLYPH_IMGY: for (i=0; i<this.glyphCodes.length; i++) { this.glyphSourceY[isy++] = ga.values[0]; if(isy>=this.glyphCodes.length)break; } break;
            case (ff.CHUNK_GLYPHATTR<<16) + ff.ATTR_GLYPH_IMGZD:for (i=0; i<this.glyphCodes.length; i++) { this.glyphSourceZD[isz++]= ga.values[0]; if(isz>=this.glyphCodes.length)break; } break;
            //case (ff.CHUNK_GLYPHATTR<<16) + ff.ATTR_GLYPH_COLORS: for (i=0; i<this.glyphCodes.length; i++) { this.glyphColors[i] = ga.values[0]; } break;
            //case (ff.CHUNK_GLYPHCOLORATTR<<16) + ff.ATTR_GLYPHCOLOR_INDEX: for (i=0; i<this.glyphColorIndices.length; i++) { this.glyphColorIndices[i] = ga.values[0]; } break;
            //case (ff.CHUNK_COLORATTR<<16) + ff.ATTR_COLOR_TYPE: for (i=0; i<this.colorType.length; i++) { this.colorType[i] = ga.values[0]; } break;
            //case (ff.CHUNK_SOLIDATTR<<16) + ff.ATTR_SOLID_RGB: for (i=0; i<this.solidRGB.length; i++) { this.solidRGB[i] = ga.values[0]; } break;
            //case (ff.CHUNK_SOLIDATTR<<16) + ff.ATTR_SOLID_MODE: for (i=0; i<this.solidMode.length; i++) { this.solidMode[i] = ga.values[0]; } break;
            default:
              console.log('ignoring unknown attribute: ', chunk.type, ga.attr);
              p.skip(chunk.length);
            }
          } else {
            switch((chunk.type<<16) + ga.attr) {
            case (ff.CHUNK_GLYPHATTR<<16) + ff.ATTR_GLYPH_WIDTH: for (i=0; i<ga.values.length; i++) { this.glyphWidths[iw++] = ga.values[i]; } break;
            case (ff.CHUNK_GLYPHATTR<<16) + ff.ATTR_GLYPH_HEIGHT: for (i=0; i<ga.values.length; i++) { this.glyphHeights[ih++] = ga.values[i]; } break;
            case (ff.CHUNK_GLYPHATTR<<16) + ff.ATTR_GLYPH_X1: p.applySign(ga.values, ga.size); for (i=0; i<ga.values.length; i++) { this.glyphX1[ix0++] = ga.values[i]; } break;
            case (ff.CHUNK_GLYPHATTR<<16) + ff.ATTR_GLYPH_Y1: p.applySign(ga.values, ga.size); for (i=0; i<ga.values.length; i++) { this.glyphY1[iy0++] = ga.values[i]; } break;
            case (ff.CHUNK_GLYPHATTR<<16) + ff.ATTR_GLYPH_X2: p.applySign(ga.values, ga.size); for (i=0; i<ga.values.length; i++) { this.glyphX2[ix1++] = ga.values[i]; } break;
            case (ff.CHUNK_GLYPHATTR<<16) + ff.ATTR_GLYPH_Y2: p.applySign(ga.values, ga.size); for (i=0; i<ga.values.length; i++) { this.glyphY2[iy1++] = ga.values[i]; } break;
            case (ff.CHUNK_GLYPHATTR<<16) + ff.ATTR_GLYPH_IMGX: for (i=0; i<ga.values.length; i++) { this.glyphSourceX[isx++] = ga.values[i]; } break;
            case (ff.CHUNK_GLYPHATTR<<16) + ff.ATTR_GLYPH_IMGY: for (i=0; i<ga.values.length; i++) { this.glyphSourceY[isy++] = ga.values[i]; } break;
            case (ff.CHUNK_GLYPHATTR<<16) + ff.ATTR_GLYPH_IMGZD:for (i=0; i<ga.values.length; i++) { this.glyphSourceZD[isz++]= ga.values[i]; } break;
            //case (ff.CHUNK_GLYPHATTR<<16) + ff.ATTR_GLYPH_COLORS: for (i=0; i<ga.values.length; i++) { this.glyphColors[iy1++] = ga.values[i]; } break;
            //case (ff.CHUNK_GLYPHCOLORATTR<<16) + ff.ATTR_GLYPHCOLOR_INDEX: for (i=0; i<ga.values.length; i++) { this.glyphColorIndices[ici++] = ga.values[i]; } break;
            //case (ff.CHUNK_COLORATTR<<16) + ff.ATTR_COLOR_TYPE: for (i=0; i<ga.values.length; i++) { this.colorType[ict++] = ga.values[i]; } break;
            //case (ff.CHUNK_SOLIDATTR<<16) + ff.ATTR_SOLID_RGB: for (i=0; i<ga.values.length; i++) { this.solidRGB[isrgb++] = ga.values[i]; } break;
            //case (ff.CHUNK_SOLIDATTR<<16) + ff.ATTR_SOLID_MODE: for (i=0; i<ga.values.length; i++) { this.solidMode[ism++] = ga.values[i]; } break;
            default:
              console.log('ignoring unknown attribute: ', chunk.type, ga.attr);
              p.skip(chunk.length);
            }
          }
          if (p.i-start!=chunk.length) {
            console.log('error: bad data 2');
          }
          break;
        case ff.CHUNK_COLORGLYPHATTR:
          var ga = p.getColorAttrs(chunk.length);
          switch(ga.attr) {
          case ff.ATTR_COLORGLYPH_COLORS:
            for (i=0; i<ga.values.length; i++) {
              while (!this.glyphHasColors[igc] && igc < this.glyphCodes.length) this.glyphColors[igc++] = null;
              if (igc < this.glyphCodes.length) this.glyphColors[igc++] = ga.values[i];
            }
            while (!this.glyphHasColors[igc] && igc < this.glyphCodes.length) this.glyphColors[igc++] = null; 
            break;
          default:
            console.log('ignoring unknown color attribute: ', chunk.type, attr);
            p.skip(chunk.length-1);
          }
          break;
        default:
          console.log('ignoring unknown chunk type: ', chunk);
          p.skip(chunk.length);
        }
        chunk = p.getChunkHeader();
      }

      for (var i=0; i<this.glyphCodes.length; i++) {
        if ((this.glyphSourceZD[i] % 2)==1) this.glyphSourceY[i] += img.height;
      }

      var bmWidth = img.width;
      var bmHeight = img.height;
			this.texWidth = img.width;
			this.texHeight = img.height;

      for (var g = 0; g < this.glyphCodes.length; g++) { var b = g;
        this.pixCoords[b*8 + 0] = 0; this.pixCoords[b*8 + 1] = this.glyphHeights[g];
        this.pixCoords[b*8 + 2] = 0; this.pixCoords[b*8 + 3] = 0;
        this.pixCoords[b*8 + 4] = this.glyphWidths[g]; this.pixCoords[b*8 + 5] = 0;
        this.pixCoords[b*8 + 6] = this.glyphWidths[g]; this.pixCoords[b*8 + 7] = this.glyphHeights[g];
        this.texCoords[b*8 + 0] = this.glyphSourceX[b] / bmWidth; this.texCoords[b*8 + 1] = (this.glyphSourceY[b] + this.glyphHeights[g]) / (bmHeight*2);
        this.texCoords[b*8 + 2] = this.glyphSourceX[b] / bmWidth; this.texCoords[b*8 + 3] = this.glyphSourceY[b] / (bmHeight*2);
        this.texCoords[b*8 + 4] = (this.glyphSourceX[b] + this.glyphWidths[g]) / bmWidth; this.texCoords[b*8 + 5] = this.glyphSourceY[b] / (bmHeight*2);
        this.texCoords[b*8 + 6] = (this.glyphSourceX[b] + this.glyphWidths[g]) / bmWidth; this.texCoords[b*8 + 7] = (this.glyphSourceY[b] + this.glyphHeights[g]) / (bmHeight*2);
      }

      var imageData = c.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
      var d = imageData.data;
      for (var i = 0; i < ~~(d.length / 2); i += 4) {
        d[i + 0] = (d[i + 0] & 15) * 16; // red
        d[i + 1] = (d[i + 1] & 15) * 16; // green
        d[i + 2] = (d[i + 2] & 15) * 16; // blue
        d[i + 0] = d[i + 0] | ~~(d[i + 0] / 16); // red
        d[i + 1] = d[i + 1] | ~~(d[i + 1] / 16); // green
        d[i + 2] = d[i + 2] | ~~(d[i + 2] / 16); // blue
      }
      for (var i = ~~(d.length / 2); i < d.length; i += 4) {
        d[i + 0] = (~~(d[i + 0] / 16)) * 16; // red
        d[i + 1] = (~~(d[i + 1] / 16)) * 16; // green
        d[i + 2] = (~~(d[i + 2] / 16)) * 16; // blue
        d[i + 0] = d[i + 0] | ~~(d[i + 0] / 16); // red
        d[i + 1] = d[i + 1] | ~~(d[i + 1] / 16); // green
        d[i + 2] = d[i + 2] | ~~(d[i + 2] / 16); // blue
      }
      c.putImageData(imageData, 0, 0);
      this.data = tempCanvas;

      d = null; imageData = null;
      c = null; tempCanvas = null;

      this.ready = true;
      if (this.finalCallback) this.finalCallback.call(null);
    }
    init() {
      if (!prog) prog = initShaderProgram(gl, vertexShaderSource, fragmentShaderSource);
      gl.useProgram(prog);
      this.tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, this.tex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.data);

      this.vertexBuff = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuff);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.pixCoords), gl.STATIC_DRAW);

      this.texBuff = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, this.texBuff);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.texCoords), gl.STATIC_DRAW);

      this.vloc = gl.getAttribLocation(prog, "aVertex");
      this.tloc = gl.getAttribLocation(prog, "aUV");
      this.scaleFactorLoc = gl.getUniformLocation(prog, 'scaleFactor');
      this.sampleBaseLoc = gl.getUniformLocation(prog, 'sampleBase');
      this.layerLoc = gl.getUniformLocation(prog, 'layer');
      this.depthLoc = gl.getUniformLocation(prog, 'depth');
      this.projMatLoc = gl.getUniformLocation(prog, 'uProjectionMatrix');
      this.viewMatLoc = gl.getUniformLocation(prog, 'uModelViewMatrix');
      this.color1Loc = gl.getUniformLocation(prog, 'color1');
      this.color2Loc = gl.getUniformLocation(prog, 'color2');
      this.color3Loc = gl.getUniformLocation(prog, 'color3');
    }
    update() {
      gl.useProgram(prog);
      gl.bindTexture(gl.TEXTURE_2D, this.tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.data);
    }
    calcWidth(str) {
      var w = 0;
      for (let codePoint of str) {
        var cc = codePoint.codePointAt(0);
        var g; for (g=0; g<this.glyphCodes.length; g++) { if (this.glyphCodes[g]==cc) break; }
        w += this.glyphX2[g] - this.glyphX1[g];
      }
      return w;
    }
    findGlyph(val) {
      var n = -1;
      if (typeof val === 'number') n = val;
      if (typeof val === 'string') n = val.codePointAt(0);
      var g; for (g=0; g<this.glyphCodes.length; g++) { if (this.glyphCodes[g]==n) break; }
      if (g < this.glyphCodes.length) return g;
      return -1;
    }
		beginObj() {
			this.objData = [];
			this.objX = 0;
			this.objY = 0;
			var id = this.nextId;
			this.nextId = this.nextId + 1;
			return id;
		}
		textObj(x,y, str, color) {
			function isIterable(input) { if (input === null || input === undefined) { return false } return typeof input[Symbol.iterator] === 'function' }
			this.objX += x;
			this.objY += y;
			if (isIterable(str)) for (let codePoint of str) {
				var cc = codePoint.codePointAt(0);
				var g = this.findGlyph(cc); if (g == -1) { console.log('Missing glyph: decimal',cc); continue; }
				this.objX += -this.glyphX1[g];
				this.objY += -this.glyphHeights[g]+this.glyphY1[g];
				if (g < this.glyphCodes.length && (this.glyphWidths[g] > 1 || this.glyphHeights[g] > 1)) {
					var x0 = this.objX + 0, y0 = this.objY + this.glyphHeights[g];
					var x1 = this.objX + this.glyphWidths[g], y1 = this.objY + 0;
					var u0 = this.glyphSourceX[g] / this.texWidth, v0 = (this.glyphSourceY[g] + this.glyphHeights[g]) / (this.texHeight*2);
					var u1 = (this.glyphSourceX[g] + this.glyphWidths[g]) / this.texWidth, v1 = this.glyphSourceY[g] / (this.texHeight*2);
					this.objData.splice(this.objData.length, 0, x0,y0);
					this.objData.splice(this.objData.length, 0, u0,v0);
					this.objData.splice(this.objData.length, 0, x0,y1);
					this.objData.splice(this.objData.length, 0, u0,v1);
					this.objData.splice(this.objData.length, 0, x1,y1);
					this.objData.splice(this.objData.length, 0, u1,v1);
					this.objData.splice(this.objData.length, 0, x1,y1);
					this.objData.splice(this.objData.length, 0, u1,v1);
					this.objData.splice(this.objData.length, 0, x1,y0);
					this.objData.splice(this.objData.length, 0, u1,v0);
					this.objData.splice(this.objData.length, 0, x0,y0);
					this.objData.splice(this.objData.length, 0, u0,v0);
					//this.objData.splice(this.objData.length, 0, color[0],color[1],color[2]); // color
				}
				this.objX += this.glyphX2[g];
				this.objY += this.glyphHeights[g]-this.glyphY2[g];
			}
		}
		endObj() {
			var data = this.objData;
			delete this.objData;
			delete this.objX;
			delete this.objY;
			return data;
		}
    draw(x,y, str, color, mat0, mat1, fidelity = 0) {
			if (fidelity == 0) fidelity = this.fidelity;
      function from32(c) { return [((c/0x01000000)&0xFF)/255, ((c/0x00010000)&0xFF)/255, ((c/0x00000100)&0xFF)/255, ((c/0x00000001)&0xFF)/255]; }
      gl.useProgram(prog);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      gl.enable(gl.BLEND);
      gl.bindTexture(gl.TEXTURE_2D, this.tex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

      gl.enableVertexAttribArray(this.vloc);
      gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuff);
      gl.vertexAttribPointer(this.vloc, 2, gl.FLOAT, false, 0, 0);

      gl.enableVertexAttribArray(this.tloc);
      gl.bindBuffer(gl.ARRAY_BUFFER, this.texBuff);
      gl.vertexAttribPointer(this.tloc, 2, gl.FLOAT, false, 0, 0);

      gl.uniformMatrix4fv(this.projMatLoc, false, mat0);
      mat4.translate(mat1, mat1, [x, y, 0]);
      var sv0; sv0 = vec3.create(); mat4.getScaling(sv0, mat0);
      var sv1; sv1 = vec3.create(); mat4.getScaling(sv1, mat1);
      gl.uniform1f(this.scaleFactorLoc, sv1[0]*sv0[0]*gl.drawingBufferWidth);
      gl.uniform1i(this.sampleBaseLoc, fidelity);
      //var scaleVec; scaleVec = vec3.create(); mat4.getScaling(scaleVec, mat1); gl.uniform1f(this.scaleFactorLoc, scaleVec[0]*2);
			function isIterable(input) { if (input === null || input === undefined) { return false } return typeof input[Symbol.iterator] === 'function' }
if (!isIterable(str)) console.log('Draw warning: string is', str);
//console.log(this.name, str.length, str.length==1?str.charCodeAt(0):'', x,y);
//console.log(this.name,'drawing',str.length,'glyphs');
      if (isIterable(str)) for (let codePoint of str) {
        var cc = codePoint.codePointAt(0);
        {//if (cc >= this.lo && cc <= this.hi) {
					//var g; for (g=0; g<this.glyphCodes.length; g++) { if (this.glyphCodes[g]==cc) break; }
          var g = this.findGlyph(cc); if (g == -1) { console.log('Missing glyph: decimal',cc); continue; }
          mat4.translate(mat1, mat1, [-this.glyphX1[g], -this.glyphHeights[g]+this.glyphY1[g], 0]);
          if (g >= this.glyphCodes.length || (this.glyphWidths[g]==1 && this.glyphHeights[g]==1)) {
            /* console.log('Glyph '+cc+' not found in font "'+this.name+'"'); */
          } else { var plane = 0; //for (var plane = 0; plane < this.planes[g]; plane++) {
            var p = g; //this.planeIndex[g]+plane;
            //var rr = ((this.color[p]/0x01000000)&0xFF), gg = ((this.color[p]/0x00010000)&0xFF), bb = ((this.color[p]/0x00000100)&0xFF), aa = ((this.color[p]/0x00000001)&0xFF);
            var c = color;
            //if (aa == 0xFF) c = [rr/255,gg/255,bb/255,1];

            //if (plane > 0) mat4.translate(mat1, mat1, [.1, .1, 0]);
            gl.uniformMatrix4fv(this.viewMatLoc, false, mat1);
            gl.uniform1i(this.layerLoc, ~~(ff.ZD_DECODE[~~this.glyphSourceZD[g]][0]/2));
            gl.uniform1i(this.depthLoc, ~~(ff.ZD_DECODE[~~this.glyphSourceZD[g]][1]));
            //if (~~(ff.ZD_DECODE[~~this.glyphSourceZD[g]][1]) == 1) {
            //  gl.uniform4fv(this.color1Loc, c);
            //} else {
              var nc = this.glyphHasColors[g] && this.glyphColors[g]? this.glyphColors[g].length : 0;
              if (nc ==0) gl.uniform4fv(this.color1Loc, color);
              if (nc > 0) gl.uniform4fv(this.color1Loc, from32(this.glyphColors[g][0]));
              if (nc > 1) gl.uniform4fv(this.color2Loc, from32(this.glyphColors[g][1]));
              if (nc > 2) gl.uniform4fv(this.color3Loc, from32(this.glyphColors[g][2]));
            //}
            gl.drawArrays(gl.TRIANGLE_FAN, p*4, 4);
          }
          mat4.translate(mat1, mat1, [this.glyphX2[g], this.glyphHeights[g]-this.glyphY2[g], 0]);
        }
      }
    }
    drawBuf(buf, beg, len, color, mat0, mat1, fidelity = 0) {
			if (fidelity == 0) fidelity = this.fidelity;
      gl.useProgram(prog);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      gl.enable(gl.BLEND);
      gl.bindTexture(gl.TEXTURE_2D, this.tex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.enableVertexAttribArray(this.vloc);
      gl.vertexAttribPointer(this.vloc, 2, gl.FLOAT, false, 4 * 4, 4 * 0);
      gl.enableVertexAttribArray(this.tloc);
      gl.vertexAttribPointer(this.tloc, 2, gl.FLOAT, false, 4 * 4, 4 * 2);

      gl.uniformMatrix4fv(this.viewMatLoc, false, mat1);
      gl.uniform1i(this.layerLoc, 0);
      gl.uniform1i(this.depthLoc, 0);
      gl.uniform4fv(this.color1Loc, color);
      gl.uniformMatrix4fv(this.projMatLoc, false, mat0);
      var sv0; sv0 = vec3.create(); mat4.getScaling(sv0, mat0);
      var sv1; sv1 = vec3.create(); mat4.getScaling(sv1, mat1);
      gl.uniform1f(this.scaleFactorLoc, sv1[0]*sv0[0]*gl.drawingBufferWidth);
      gl.uniform1i(this.sampleBaseLoc, fidelity);
      gl.drawArrays(gl.TRIANGLES, beg, len);
    }
  }

  return {
    glSet: glSet,
    getProg: getProg,
    GlyphSet: GlyphSet,
    ff: ff,
  };

})();

