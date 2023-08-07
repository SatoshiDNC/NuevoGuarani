var inputSelected;

function endInput() {
	inputSelected = false;
	if (!inputGad) return;
	var g = inputGad, el;
	if (g.actionFlags & vp.GAF_NUMINPUT) el = kbnum;
	if (g.actionFlags & vp.GAF_TEXTINPUT) el = kbalpha;
	if (el) {
		el.blur();
		el.style.display = 'none';
	}
	inputGad = undefined;
}

function beginInput(g) {
	endInput();
	inputGad = g;
	if (g.textBeginFunc) g.textBeginFunc.call(g);
	if (g.actionFlags & vp.GAF_GONEXT) {
		kbnext.style.display = 'inline';
		kbprev.style.display = 'inline';
	}
	let el;
	if (g.actionFlags & vp.GAF_NUMINPUT) el = kbnum;
	if (g.actionFlags & vp.GAF_TEXTINPUT) el = kbalpha;
	if (el) {
		el.value = g.text;
		el.style.display = 'inline';
		el.focus();
		el.select();
		inputSelected = true;
	}
}

  function useProg() {
    gl.useProgram(plainProgram);
    gl.bindBuffer(gl.ARRAY_BUFFER, buf2);
    var a = gl.getAttribLocation(plainProgram, 'aVertexPosition')
    gl.vertexAttribPointer(
	a,
	2, // numComponents
	gl.FLOAT, // type
	false, // normalize
	0, // stride
	0); // offset
    gl.enableVertexAttribArray(a);
  }

let vpStack = [];
function pushRoot(viewport) {
	vpStack.push(rootViewport);
	rootViewport = viewport;
	rootViewport.queueLayout();
console.log('pushRoot');
	resizeCanvas();
}
function popRoot() {
	rootViewport = vpStack.pop();
	rootViewport.queueLayout();
console.log('popRoot');
	resizeCanvas();
}

rootViewport = new ViewPicker();
var refresherTimeStamp = -1, refresherFrame = 0;
var v=0, continuous=0, nframes=0, showdebug=0;
function refresher(timeStamp) {
	if (timeStamp != refresherTimeStamp) {
		var delta=0;
		if (refresherTimeStamp > 0) delta = timeStamp - refresherTimeStamp;
		refresherTimeStamp = timeStamp;

//if (delta < 10) console.log(delta);

		const todoViews = []; var lv;
		while (lv = layoutViews.pop()) todoViews.push(lv);
		if (layoutSignal) {
			layoutSignal = false;
			gl.viewport(0, 0, canvas.width, canvas.height);
			mat4.identity(pixelPM);
			mat4.translate(pixelPM, pixelPM, [-1, 1, 0]);
			mat4.scale(pixelPM, pixelPM, [2/canvas.width, -2/canvas.height, 1]);
			if (rootViewport) {
				var s = new vp.LayoutState(canvas.width, canvas.height);
				rootViewport.layoutAll(s);
			}
		} else while (lv = todoViews.pop()) lv.relayout();

      if (nframes) {
				nframes -= 1;
				if (!nframes) rootViewport.setRenderFlag(true);
			}
      if (continuous) rootViewport.setRenderFlag(true);
      if (rootViewport && (rootViewport.needsRender || rootViewport.childRender)) {
        //gl.viewport(0, 0, canvas.width, canvas.height);
        //gl.disable(gl.SCISSOR_TEST);
        //gl.clearColor(v,0,0,1); v+=delta*0.001; if(v>1) v=0;
        //gl.clear(gl.COLOR_BUFFER_BIT);


        var windspeed = 0;
        for (const [key, pointer] of Object.entries(pointers)) {
          pointer.dx = (pointer.x - pointer.px)/delta; pointer.px = pointer.x;
          pointer.dy = (pointer.y - pointer.py)/delta; pointer.py = pointer.y;
          windspeed += Math.sqrt(pointer.dx*pointer.dx + pointer.dy*pointer.dy)/diagonal;
        }
        if (windSound) windSound.setValueAtTime(windspeed, ac.currentTime);

				if (debug1 && !continuous) {
					if (nframes)
						console.log('rootViewport.renderAll()', nframes? 'n = '+nframes:'');
					else
						console.log('rootViewport.renderAll()');
				}
        rootViewport.renderAll();

if (showdebug) {
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.disable(gl.SCISSOR_TEST);
        useProg();
        gl.enable(gl.BLEND);

        gl.uniform4fv(gl.getUniformLocation(plainProgram, 'uVertexColor'), new Float32Array([1, 1, 1, 1]));
        gl.uniformMatrix4fv(gl.getUniformLocation(plainProgram, 'uProjectionMatrix'), false, pixelPM);

        const mat = mat4.create();

        if (continuous) {

        // Get a list of active gadgets.
        var gads = [];
        for (const [key, pointer] of Object.entries(pointers)) if (pointer.hitList) {
          var gs = pointer.hitList.getActionableGads(vp.GAF_ALL);
          for (const g of gs) {
            if (!gads.includes(g)) gads.push(g);
          }
        }

        // Show active gadgets.
        for (const g of gads) {
          /*
          mat4.identity(mat);
          mat4.translate(mat, mat, [g.x, g.y, 0]);
          mat4.scale(mat, mat, [g.w, g.h, 0]);
          gl.uniformMatrix4fv(
            gl.getUniformLocation(plainProgram, 'uModelViewMatrix'),
            false, mat);
          gl.drawArrays(gl.LINE_LOOP, beg2.unitSquare, len2.unitSquare);
          */
          if (g.ownedBy) switch (g.gestureState) {
          //case 'begin-tap':
          //case 'begin-click':
          //case 'recover-click':
          //case 'drag':
          default:
            var h = g.convexHull;
            for (p = 0; p < h.length; p += 2) {
              mat4.fromTranslation(mat, [g.viewport.x, g.viewport.y, 0]);
              mat4.mul(mat, mat, g.viewport.userMat);
             // mat4.translate(mat, mat, [g.viewport.x + g.viewport.ox, g.viewport.y + g.viewport.oy, 0]);
              mat4.scale(mat, mat, [g.viewport.getScale(), g.viewport.getScale(), 1]);
              mat4.translate(mat, mat, [g.x+h[p+0] - g.viewport.userX, g.y+h[p+1] - g.viewport.userY, 0]);
              mat4.scale(mat, mat, [h[(p+2)%h.length]-h[p+0], h[(p+3)%h.length]-h[p+1], 1]);
              gl.uniformMatrix4fv(
                gl.getUniformLocation(plainProgram, 'uModelViewMatrix'),
                false, mat);
              gl.drawArrays(gl.LINE_LOOP, beg2.unitLine, len2.unitLine);
            }
            var matS = vec3.create(); mat4.getScaling(matS, g.viewport.userMat);
/*
            for (const k in g.extendedHulls) if (k == ''+(getPointerRadius()/g.viewport.getScale()/matS[0])) {
              var h=g.extendedHulls[k];
              for (p = 0; p < h.length; p += 2) {
                mat4.fromTranslation(mat, [g.viewport.x, g.viewport.y, 0]);
                mat4.mul(mat, mat, g.viewport.userMat);
              //  mat4.translate(mat, mat, [g.viewport.x + g.viewport.ox, g.viewport.y + g.viewport.oy, 0]);
                mat4.scale(mat, mat, [g.viewport.getScale(), g.viewport.getScale(), 1]);
                mat4.translate(mat, mat, [g.x+h[p+0] - g.viewport.userX, g.y+h[p+1] - g.viewport.userY, 0]);
                mat4.scale(mat, mat, [h[(p+2)%h.length]-h[p+0], h[(p+3)%h.length]-h[p+1], 0]);
                gl.uniformMatrix4fv(
                  gl.getUniformLocation(plainProgram, 'uModelViewMatrix'),
                  false, mat);
                gl.drawArrays(gl.LINE_LOOP, beg2.unitLine, len2.unitLine);
              }
            }
*/
            break;
          }

        }

        for (const [key, pointer] of Object.entries(pointers)) {
          // pointer circle
          mat4.identity(mat);
          mat4.translate(mat, mat, [pointer.x, pointer.y, 0]);
          gl.uniformMatrix4fv(
            gl.getUniformLocation(plainProgram, 'uModelViewMatrix'),
            false, mat);
          if (pointer.e.pointerType == 'mouse') {
            gl.drawArrays(gl.LINE_LOOP, beg2.roundMouse, len2.roundMouse);
          } else {
            gl.drawArrays(gl.LINE_LOOP, beg2.roundTouch, len2.roundTouch);
          }
        }


        } // continuous

          refresherFrame = (refresherFrame + 1) % 16;
          mat4.identity(mat);
          mat4.translate(mat, mat, [160, 45, 0]);
          mat4.rotate(mat, mat, Math.PI/8 * refresherFrame, [0, 0, 1]);
          mat4.scale(mat, mat, [40, 10, 0]);
          gl.uniformMatrix4fv(
            gl.getUniformLocation(plainProgram, 'uModelViewMatrix'),
            false, mat);
          gl.drawArrays(gl.LINE_LOOP, beg2.unitSquare, len2.unitSquare);

          mat4.identity(mat);
          mat4.translate(mat, mat, [10, 10, 0]);
          mat4.scale(mat, mat, [50, 10, 0]);
          gl.uniformMatrix4fv(
            gl.getUniformLocation(plainProgram, 'uModelViewMatrix'),
            false, mat);
          gl.drawArrays(gl.LINE_LOOP, beg2.unitSquare, len2.unitSquare);

          mat4.identity(mat);
          mat4.translate(mat, mat, [10, 25, 0]);
          mat4.scale(mat, mat, [50 * window.visualViewport.scale, 10, 0]);
          gl.uniformMatrix4fv(
            gl.getUniformLocation(plainProgram, 'uModelViewMatrix'),
            false, mat);
          gl.drawArrays(gl.LINE_LOOP, beg2.unitSquare, len2.unitSquare);

          mat4.identity(mat);
          mat4.translate(mat, mat, [10, 40, 0]);
          mat4.scale(mat, mat, [50 * window.devicePixelRatio, 10, 0]);
          gl.uniformMatrix4fv(
            gl.getUniformLocation(plainProgram, 'uModelViewMatrix'),
            false, mat);
          gl.drawArrays(gl.LINE_LOOP, beg2.unitSquare, len2.unitSquare);

          mat4.identity(mat);
          mat4.translate(mat, mat, [10, 55, 0]);
          mat4.scale(mat, mat, [50 * window.innerWidth/1000, 10, 0]);
          gl.uniformMatrix4fv(
            gl.getUniformLocation(plainProgram, 'uModelViewMatrix'),
            false, mat);
          gl.drawArrays(gl.LINE_LOOP, beg2.unitSquare, len2.unitSquare);
        for (const [key, p] of Object.entries(pointers)) {
          mat4.identity(mat);
          mat4.translate(mat, mat, [12, 57, 0]);
          mat4.scale(mat, mat, [46 * p.x/wi2px/1000, 6, 0]);
          gl.uniformMatrix4fv(
            gl.getUniformLocation(plainProgram, 'uModelViewMatrix'),
            false, mat);
          gl.drawArrays(gl.LINE_LOOP, beg2.unitSquare, len2.unitSquare);
        }

          mat4.identity(mat);
          mat4.translate(mat, mat, [10, 70, 0]);
          mat4.scale(mat, mat, [50 * window.innerHeight/1000, 10, 0]);
          gl.uniformMatrix4fv(
            gl.getUniformLocation(plainProgram, 'uModelViewMatrix'),
            false, mat);
          gl.drawArrays(gl.LINE_LOOP, beg2.unitSquare, len2.unitSquare);
        for (const [key, p] of Object.entries(pointers)) {
          mat4.identity(mat);
          mat4.translate(mat, mat, [12, 72, 0]);
          mat4.scale(mat, mat, [46 * p.y/wi2px/1000, 6, 0]);
          gl.uniformMatrix4fv(
            gl.getUniformLocation(plainProgram, 'uModelViewMatrix'),
            false, mat);
          gl.drawArrays(gl.LINE_LOOP, beg2.unitSquare, len2.unitSquare);
        }

}



      }
	} // refresher time stamp changed
	window.requestAnimationFrame(refresher);
};

function resizeCanvas() {
	if (debug1) console.log('resizeCanvas()');
	nframes = 10;
	var w = window.innerWidth, h = window.innerHeight;
//console.log(w, h, 'window.inner');
	if (1) {
		canvas.width = w * window.visualViewport.scale * window.devicePixelRatio;
		canvas.height = h * window.visualViewport.scale * window.devicePixelRatio;
		canvas.style.width = w * window.visualViewport.scale;
		canvas.style.height = h * window.visualViewport.scale;
	}
	diagonal = Math.sqrt(canvas.width*canvas.width + canvas.height*canvas.height);
	wi2px = window.visualViewport.scale * window.devicePixelRatio;
	px2wi = 1/wi2px;
	layoutSignal = true;
	if (rootViewport.resizeFunc) rootViewport.resizeFunc.call(rootViewport);
}

  var pointers = {};
  const TAP_WINDOW = 250; // ms
  const TAP_WIGGLE = 15 * window.devicePixelRatio;
  function eventHandler(e, action) {

    var index;

		// Helper: On commitment to drag, disown ambiguously selected click gadgets.
		function DisownAllOtherGads(p, g) {
			for (const o of p.hitList.hits) if (o.gad !== g) {
				if (o.gad.ownedBy == index) {
					o.gad.gestureState = o.gad.gestureState + '-disowned';
					o.gad.viewport.setRenderFlag(true);
					delete o.gad.ownedBy;
				}
			}
		}

    if (action == 'touches' && e.touches && e.touches.length == 0) {
   //   window.speechSynthesis.speak(new SpeechSynthesisUtterance(' '+e.touches.length));
      var toDel = [];
      for (const [key, p] of Object.entries(pointers)) p.tempIsActive = !!(p.e.pointerType == 'mouse');
   //   for (var i = 0; i < e.touches.length; i++) if (pointers['p-'+e.touches[i].identifier]) pointers['p-'+e.touches[i].identifier].tempIsActive = 1;
      for (const [key, p] of Object.entries(pointers)) if (!p.tempIsActive) toDel.push(key);
      while (toDel.length) delete pointers[toDel.pop()];
      for (const [key, p] of Object.entries(pointers)) delete p.tempIsActive;
      return;
    }
    if (wi2px != window.visualViewport.scale * window.devicePixelRatio) resizeCanvas();
var speak = 0;
    index = 'p-'+e.pointerId;
/*
    var numTouches;
    var touches = [];
    function recalc() {
      var n = 0, t = [];
      for (const [key, pointer] of Object.entries(pointers)) {
        if (pointer.touching && pointer.e.pointerType!='mouse') { t[n] = pointer; n += 1; }
      }
      numTouches = n;
      touches = t;
    }
*/
    var dir;
    function calcSwipeDir(p) {
      const xdiff = p.x - p.ox;
      const ydiff = p.y - p.oy;
      if (xdiff*xdiff > ydiff*ydiff) {
        if (xdiff > 0) return 'right'; else return 'left';
      } else {
        if (ydiff > 0) return 'down'; else return 'up';
      }
    }
    var p, hl;
    switch (action) {
    case 'down':
			endInput();
      if (!pointers.hasOwnProperty(index)) pointers[index] = { gestureState: '', touching: false, px: e.layerX * wi2px, py: e.layerY * wi2px };
      p = pointers[index]; p.e = e; p.touching = true;
      p.x = e.layerX * wi2px;
      p.y = e.layerY * wi2px;
      p.ox = p.x;
      p.oy = p.y;
    //  recalc();
      p.hitList = new vp.HitList(p.x, p.y);
      rootViewport.getHits(p.hitList, getPointerRadius());
      p.hitList.sortHits();
      if (e.pointerType=='mouse') {
        if (e.button == 0) {
          for (const h of p.hitList.hits) {
            const g = h.gad;
            if (!g.ownedBy && !!(g.actionFlags & vp.GAF_CLICKABLE)) {
              g.gestureState = 'begin-click'; g.ownedBy = index;
              g.viewport.setRenderFlag(true);
            }
            if (!g.ownedBy && !!(g.actionFlags & vp.GAF_DRAGGABLE)) {
              g.gestureState = 'begin-drag'; g.ownedBy = index;
              g.viewport.setRenderFlag(true);
            }
            if (!g.ownedBy && !!(g.actionFlags & (vp.GAF_NUMINPUT | vp.GAF_TEXTINPUT))) {
              g.gestureState = 'begin-input'; g.ownedBy = index;
              g.viewport.setRenderFlag(true);
            }
            g.gestureTimerId = setTimeout(eventHandler, TAP_WINDOW, e, 'drag time reached');
          }
        }
        if (e.button == 2) {
          for (const h of p.hitList.hits) {
            const g = h.gad;
            if (!g.ownedBy && !!(g.actionFlags & vp.GAF_CONTEXTMENU)) {
              g.gestureState = 'begin-menu'; g.ownedBy = index;
              g.viewport.setRenderFlag(true);
              if (clickSound) clickSound.setValueAtTime(0.1, ac.currentTime);
              if (clickSound) clickSound.setValueAtTime(0, ac.currentTime+0.001);
            }
          }
        }
      } else { // not mouse (down)
        var clickableAlreadyFound = false;
        for (const h of p.hitList.hits) {
          const g = h.gad;
          if (!g.ownedBy) {
            if (!!(g.actionFlags & vp.GAF_CLICKABLE) && !clickableAlreadyFound) {
              g.gestureState = 'begin-tap'; g.ownedBy = index; clickableAlreadyFound = true;
              g.viewport.setRenderFlag(true);
              g.gestureBeginTime = e.timeStamp;
              if (!!(g.actionFlags & (
              vp.GAF_CONTEXTMENU | vp.GAF_HOLDABLE | vp.GAF_DRAGGABLE))) {
                g.gestureTimerId = setTimeout(eventHandler, TAP_WINDOW, e, 'tap-and-hold time reached');
     if(speak) window.speechSynthesis.speak(new SpeechSynthesisUtterance('begin tap hold'));
              } else
if(speak) window.speechSynthesis.speak(new SpeechSynthesisUtterance('begin tap '+g.actionFlags));
            } else if (!!(g.actionFlags & (vp.GAF_NUMINPUT | vp.GAF_TEXTINPUT))) {
              g.gestureState = 'begin-input'; g.ownedBy = index;
              g.viewport.setRenderFlag(true);
              g.gestureBeginTime = e.timeStamp;
              if (!!(g.actionFlags & vp.GAF_CONTEXTMENU)) {
                g.gestureTimerId = setTimeout(eventHandler, TAP_WINDOW, e,
									'tap-and-hold time reached');
              }
            } else if (!!(g.actionFlags & vp.GAF_CONTEXTMENU)) {
              g.gestureState = 'begin-menu'; g.ownedBy = index;
              g.viewport.setRenderFlag(true);
              g.gestureTimerId = setTimeout(eventHandler, TAP_WINDOW, e, 'tap-and-hold time reached');
            } else if (!!(g.actionFlags & vp.GAF_HOLDABLE)) {
              g.gestureState = 'begin-hold'; g.ownedBy = index;
              g.viewport.setRenderFlag(true);
              g.gestureTimerId = setTimeout(eventHandler, TAP_WINDOW, e, 'tap-and-hold time reached');
            } else if (!!(g.actionFlags & vp.GAF_DRAGGABLE)) {
              g.gestureState = 'begin-drag'; g.ownedBy = index;
              g.viewport.setRenderFlag(true);
              g.gestureTimerId = setTimeout(eventHandler, TAP_WINDOW, e, 'drag time reached');
            } else if (!!(g.actionFlags & vp.GAF_SWIPEABLE)) {
              g.gestureState = 'begin-swipe'; g.ownedBy = index;
              g.viewport.setRenderFlag(true);
 // if(speak) window.speechSynthesis.speak(new SpeechSynthesisUtterance('begin swipe'));
            } else if (!!(g.actionFlags & vp.GAF_PINCHABLE)) {
              g.gestureState = 'await-pinch'; g.ownedBy = index;
              g.viewport.setRenderFlag(true);
            }
          } else if (g.ownedBy != index) {
            if (g.gestureState == 'await-pinch' || (!!(g.actionFlags & vp.GAF_PINCHABLE) && (g.gestureState == 'begin-drag' || g.gestureState == 'begin-tap'))) {
              g.gestureState = 'pinch'; g.secondTouch = index;
              g.viewport.setRenderFlag(true);
              if (g.pinchBeginFunc) g.pinchBeginFunc.call(g, pointers[g.ownedBy], pointers[g.secondTouch]);
            } else if (g.gestureState == 'drag' && !!(g.actionFlags & vp.GAF_PINCHABLE)) {
              g.gestureState = 'pinch'; g.secondTouch = index;
              g.viewport.setRenderFlag(true);
              if (g.dragEndFunc) g.dragEndFunc.call(g, pointers[g.ownedBy]);
              if (g.pinchBeginFunc) g.pinchBeginFunc.call(g, pointers[g.ownedBy], pointers[g.secondTouch]);
            }
          }
        }
      }
      break;
    case 'move':
      if (!mouseEnabled && e.pointerType=='mouse') { mouseEnabled = 1; if (rootViewport.enableMouse) rootViewport.enableMouse.call(rootViewport); }
      if (!pointers.hasOwnProperty(index)) pointers[index] = { gestureState: e.pointerType=='mouse'?'hover':'', touching: e.pointerType=='mouse'?false:true };
      p = pointers[index]; p.e = e;
      p.px = p.x; p.x = e.layerX * wi2px;
      p.py = p.y; p.y = e.layerY * wi2px;
      if (e.pointerType=='mouse') {
        if (p.hitList) for (const h of p.hitList.hits) {
          const g = h.gad;
          if (g.ownedBy == index) {
            switch (g.gestureState) {
            case 'begin-click':
            case 'recover-click':
              var tempHit = new vp.HitList(p.x, p.y);
              g.getHits(tempHit, getPointerRadius());
              if (tempHit.hits.length == 0) {
                g.gestureState = 'abandon-click';
                g.viewport.setRenderFlag(true);
              }
              break;
            case 'begin-input':
              var tempHit = new vp.HitList(p.x, p.y);
              g.getHits(tempHit, getPointerRadius());
              if (tempHit.hits.length == 0) {
                g.gestureState = 'abandon-input';
                g.viewport.setRenderFlag(true);
              }
              break;
            case 'hold':
              var tempHit = new vp.HitList(p.x, p.y);
              g.getHits(tempHit, getPointerRadius());
              if (tempHit.hits.length == 0) {
                g.gestureState = 'abandon-hold';
                g.viewport.setRenderFlag(true);
								if (g.holdEndFunc) g.holdEndFunc.call(g, p);
              }
              break;
            case 'abandon-click':
              var tempHit = new vp.HitList(p.x, p.y);
              g.getHits(tempHit, getPointerRadius());
              if (tempHit.hits.length != 0) {
                g.gestureState = 'recover-click';
                g.viewport.setRenderFlag(true);
              }
              break;
            case 'abandon-hold':
              var tempHit = new vp.HitList(p.x, p.y);
              g.getHits(tempHit, getPointerRadius());
              if (tempHit.hits.length != 0) {
                g.gestureState = 'hold';
                g.viewport.setRenderFlag(true);
								if (g.holdBeginFunc) g.holdBeginFunc.call(g, p);
              }
              break;
            case 'begin-drag':
              dir = calcSwipeDir(p);
              if (Math.sqrt((p.ox - p.x)**2 + (p.oy - p.y)**2) > TAP_WIGGLE) {
                if (g.hasOwnProperty('gestureTimerId')) { clearTimeout(g.gestureTimerId); delete g.gestureTimerId; }
                if ( ((dir == 'up' || dir == 'down') && !!(g.actionFlags & vp.GAF_DRAGGABLE_UPDOWN))
                  || ((dir == 'left' || dir == 'right') && !!(g.actionFlags & vp.GAF_DRAGGABLE_LEFTRIGHT)) ) {
                  g.gestureState = 'drag';
                  g.viewport.setRenderFlag(true);
									DisownAllOtherGads(p, g);
                  if (g.dragBeginFunc) g.dragBeginFunc.call(g, p);
                  if (g.dragMoveFunc) g.dragMoveFunc.call(g, p);
                }
              }
              break;
            case 'drag':
              if (g.dragMoveFunc) g.dragMoveFunc.call(g, p);
              break;
            }
          }
        }
      } else { // not mouse (move)
        for (const h of p.hitList.hits) {
          const g = h.gad;
          if (g.ownedBy == index) {
            switch (g.gestureState) {
            case 'begin-tap':
              if (Math.sqrt((p.ox - p.x)**2 + (p.oy - p.y)**2) > TAP_WIGGLE) {
                g.gestureState = 'invalid-tap';
                g.viewport.setRenderFlag(true);
     if(speak) window.speechSynthesis.speak(new SpeechSynthesisUtterance('invalid'));
                if (!p.swiping) {
                  dir = calcSwipeDir(p);
                  if ( ((dir == 'up' || dir == 'down') && !!(g.actionFlags & vp.GAF_SWIPEABLE_UPDOWN))
                    || ((dir == 'left' || dir == 'right') && !!(g.actionFlags & vp.GAF_SWIPEABLE_LEFTRIGHT)) ) {
                    g.gestureState = 'swipe'; p.swiping = true;
                    g.viewport.setRenderFlag(true);
                    for (const o of p.hitList.hits) if (o.gad !== g && o.gad.ownedBy == index) delete o.gad.ownedBy;
										delete p.cancel;
                    if (g.swipeBeginFunc) g.swipeBeginFunc.call(g, p);
										if (p.cancel) {
											g.gestureState = 'prog-cancel-swipe';
										} else {
	                    if (g.swipeMoveFunc) g.swipeMoveFunc.call(g, p);
  console.log('swipe '+dir);
  if(speak) window.speechSynthesis.speak(new SpeechSynthesisUtterance('swipe '+dir));
										}
                  } else
                  if ( ((dir == 'up' || dir == 'down') && !!(g.actionFlags & vp.GAF_DRAGGABLE_UPDOWN))
                    || ((dir == 'left' || dir == 'right') && !!(g.actionFlags & vp.GAF_DRAGGABLE_LEFTRIGHT)) ) {
                    g.gestureState = 'drag'; p.swiping = true;
                    g.viewport.setRenderFlag(true);
										DisownAllOtherGags(p, g);
										delete p.cancel;
                    if (g.dragBeginFunc) g.dragBeginFunc.call(g, p);
										if (p.cancel) {
											g.gestureState = 'prog-cancel-drag';
										} else {
	                    if (g.dragMoveFunc) g.dragMoveFunc.call(g, p);
  console.log('drag '+dir);
  if(speak) window.speechSynthesis.speak(new SpeechSynthesisUtterance('drag '+dir));
										}
                  }
                }
              }
              break;
            case 'begin-input':
              if (Math.sqrt((p.ox - p.x)**2 + (p.oy - p.y)**2) > TAP_WIGGLE) {
                if (g.hasOwnProperty('gestureTimerId')) { clearTimeout(g.gestureTimerId); delete g.gestureTimerId; }
                g.gestureState = 'invalid-input';
                g.viewport.setRenderFlag(true);
              }
              break;
            case 'begin-menu':
              if (Math.sqrt((p.ox - p.x)**2 + (p.oy - p.y)**2) > TAP_WIGGLE) {
                if (g.hasOwnProperty('gestureTimerId')) { clearTimeout(g.gestureTimerId); delete g.gestureTimerId; }
                g.gestureState = 'invalid-menu';
                g.viewport.setRenderFlag(true);
              }
              break;
            case 'begin-hold':
              if (Math.sqrt((p.ox - p.x)**2 + (p.oy - p.y)**2) > TAP_WIGGLE) {
                if (g.hasOwnProperty('gestureTimerId')) { clearTimeout(g.gestureTimerId); delete g.gestureTimerId; }
                g.gestureState = 'invalid-hold';
                g.viewport.setRenderFlag(true);
              }
              break;
            case 'begin-swipe':
              dir = calcSwipeDir(p);
              if (Math.sqrt((p.ox - p.x)**2 + (p.oy - p.y)**2) > TAP_WIGGLE) {
                if (g.hasOwnProperty('gestureTimerId')) { clearTimeout(g.gestureTimerId); delete g.gestureTimerId; }
                if (!p.swiping) {
                  if ( ((dir == 'up' || dir == 'down') && !!(g.actionFlags & vp.GAF_SWIPEABLE_UPDOWN))
                    || ((dir == 'left' || dir == 'right') && !!(g.actionFlags & vp.GAF_SWIPEABLE_LEFTRIGHT)) ) {
                    g.gestureState = 'swipe'; p.swiping = true;
                    g.viewport.setRenderFlag(true);
										DisownAllOtherGads(p, g);
										delete p.cancel;
                    if (g.swipeBeginFunc) g.swipeBeginFunc.call(g, p);
										if (p.cancel) {
											g.gestureState = 'prog-cancel-swipe';
										} else {
	                    if (g.swipeMoveFunc) g.swipeMoveFunc.call(g, p);
     if(speak) window.speechSynthesis.speak(new SpeechSynthesisUtterance('swipe '+dir));
										}
                  }
                }
              }
              break;
            case 'hold':
              var tempHit = new vp.HitList(p.x, p.y);
              g.getHits(tempHit, getPointerRadius());
              if (tempHit.hits.length == 0) {
                g.gestureState = 'abandon-hold';
                g.viewport.setRenderFlag(true);
								if (g.holdEndFunc) g.holdEndFunc.call(g, p);
              }
              break;
            case 'swipe':
              if (g.swipeMoveFunc) g.swipeMoveFunc.call(g, p);
              break;
            case 'begin-drag':
              dir = calcSwipeDir(p);
              if (Math.sqrt((p.ox - p.x)**2 + (p.oy - p.y)**2) > TAP_WIGGLE) {
                if (g.hasOwnProperty('gestureTimerId')) { clearTimeout(g.gestureTimerId); delete g.gestureTimerId; }
                if (!p.swiping) {
                  if ( ((dir == 'up' || dir == 'down') && !!(g.actionFlags & vp.GAF_DRAGGABLE_UPDOWN))
                    || ((dir == 'left' || dir == 'right') && !!(g.actionFlags & vp.GAF_DRAGGABLE_LEFTRIGHT)) ) {
                    g.gestureState = 'drag'; p.swiping = true;
                    g.viewport.setRenderFlag(true);
										DisownAllOtherGads(p, g);
                    for (const o of p.hitList.hits) if (o.gad !== g) {
                      if (o.gad.secondTouch == index) {
                        switch (o.gad.gestureState) {
                        case 'pinch':
                          o.gad.gestureState = 'drag'; delete o.gad.secondTouch;
                          o.gad.viewport.setRenderFlag(true);
                          if (o.gad.pinchEndFunc) o.gad.pinchEndFunc.call(o.gad);
                          if (o.gad.dragBeginFunc) o.gad.dragBeginFunc.call(o.gad, pointers[o.gad.ownedBy]);
                          break;
                        }
                      }
                    }
                    if (g.dragBeginFunc) g.dragBeginFunc.call(g, p);
                    if (g.dragMoveFunc) g.dragMoveFunc.call(g, p);
                  }
                }
              }
              break;
            case 'drag':
              if (g.dragMoveFunc) g.dragMoveFunc.call(g, p);
              break;
            case 'pinch':
              if (g.pinchMoveFunc) g.pinchMoveFunc.call(g, pointers[g.ownedBy], pointers[g.secondTouch]);
              break; 
            }
          } else if (g.secondTouch == index) {
            switch (g.gestureState) {
            case 'pinch':
              if (g.pinchMoveFunc) g.pinchMoveFunc.call(g, pointers[g.ownedBy], pointers[g.secondTouch]);
              break;
            } 
          }
        }
      }
      break;
    case 'up':
      if (!pointers.hasOwnProperty(index)) pointers[index] = { gestureState: '', touching: false, x: 0, y: 0, px: 0, py: 0 };
      p = pointers[index]; p.e = e; p.touching = false;
     // recalc();
      if (e.pointerType=='mouse') {
        if (e.button == 0) {
          var skipflag = 0;
          if (p.hitList) for (const h of p.hitList.hits) {
            const g = h.gad;
            if (g.ownedBy == index) {
              if (!skipflag) switch (g.gestureState) {
              case 'begin-click':
              case 'recover-click':
                if (clickSound) clickSound.setValueAtTime(0.1, ac.currentTime);
                if (clickSound) clickSound.setValueAtTime(0, ac.currentTime+0.001);
                if (g.clickFunc) g.clickFunc.call(g, p);
                skipflag=1;
                break;
              case 'begin-input':
                if (clickSound) clickSound.setValueAtTime(0.1, ac.currentTime);
                if (clickSound) clickSound.setValueAtTime(0, ac.currentTime+0.001);
								beginInput(g);
                skipflag=1;
                break;
							case 'hold':
                if (g.holdEndFunc) g.holdEndFunc.call(g, p);
								break;
              case 'abandon-click':
                break;
              case 'begin-drag':
                if (g.hasOwnProperty('gestureTimerId')) { clearTimeout(g.gestureTimerId); delete g.gestureTimerId; }
                break;
              case 'drag':
                if (g.dragMoveFunc) g.dragMoveFunc.call(g, p);
                if (g.dragEndFunc) g.dragEndFunc.call(g, p);
                break;
              }
              delete g.gestureState; delete g.ownedBy;
              g.viewport.setRenderFlag(true);
            }
          }
        }
        if (e.button == 2) {
          for (const h of p.hitList.hits) {
            const g = h.gad;
            if (g.ownedBy == index) {
              switch (g.gestureState) {
              case 'begin-menu':
                if (g.contextMenuFunc) g.contextMenuFunc.call(g, p);
                break;
              }
              delete g.gestureState; delete g.ownedBy;
              g.viewport.setRenderFlag(true);
            }
          }
        }
        delete p.hitList;
      } else { // not mouse (up)
        var skipflag = 0;
        for (const h of p.hitList.hits) {
          const g = h.gad;
          var skipDel = 0;
          if (g.ownedBy == index) {
            if (g.hasOwnProperty('gestureTimerId')) { clearTimeout(g.gestureTimerId); delete g.gestureTimerId; }
            if (!skipflag) switch (g.gestureState) {
            case 'begin-tap':
              if (clickSound) clickSound.setValueAtTime(0.1, ac.currentTime);
              if (clickSound) clickSound.setValueAtTime(0, ac.currentTime+0.001);
              if (g.clickFunc) g.clickFunc.call(g, p);
              skipflag=1;
              break;
            case 'begin-input':
              if (clickSound) clickSound.setValueAtTime(0.1, ac.currentTime);
              if (clickSound) clickSound.setValueAtTime(0, ac.currentTime+0.001);
							beginInput(g);
              skipflag=1;
              break;
						case 'hold':
     if(speak) window.speechSynthesis.speak(new SpeechSynthesisUtterance('end hold'));
              if (g.holdEndFunc) g.holdEndFunc.call(g, p);
							break;
            case 'tap-and-hold':
console.log('tap-and-hold release');
if(speak) window.speechSynthesis.speak(new SpeechSynthesisUtterance('release'));
              break;
            case 'swipe':
              if (g.swipeMoveFunc) g.swipeMoveFunc.call(g, p);
              if (g.swipeEndFunc) g.swipeEndFunc.call(g, p);
              break;
            case 'drag':
              if (g.dragMoveFunc) g.dragMoveFunc.call(g, p);
              if (g.dragEndFunc) g.dragEndFunc.call(g, p);
              break;
            case 'pinch':
if(speak) window.speechSynthesis.speak(new SpeechSynthesisUtterance('releasing'));
              g.gestureState = 'drag'; g.ownedBy = g.secondTouch; delete g.secondTouch;
              g.viewport.setRenderFlag(true);
              if (g.pinchEndFunc) g.pinchEndFunc.call(g);
              if (g.dragBeginFunc) g.dragBeginFunc.call(g, pointers[g.ownedBy]);
              skipDel = 1;
              break;
            }
            if (!skipDel) {
              delete g.gestureState; delete g.ownedBy;
              g.viewport.setRenderFlag(true);
            }
          } else if (g.secondTouch == index) {
            switch (g.gestureState) {
            case 'pinch':
if(speak) window.speechSynthesis.speak(new SpeechSynthesisUtterance('releasing'));
              g.gestureState = 'drag'; delete g.secondTouch;
              g.viewport.setRenderFlag(true);
              if (g.pinchEndFunc) g.pinchEndFunc.call(g);
              if (g.dragBeginFunc) g.dragBeginFunc.call(g, pointers[g.ownedBy]);
              break;
            } 
          }
        }
      }
      if (e.pointerType == 'touch') delete pointers[index];
      delete p.swiping;
      break;
    case 'wheel':
      if (!pointers.hasOwnProperty(index)) pointers[index] = { gestureState: '', touching: false, px: e.layerX * wi2px, py: e.layerY * wi2px };
      p = pointers[index]; p.e = e; p.touching = true;
      p.x = e.layerX * wi2px;
      p.y = e.layerY * wi2px;
      //p.ox = p.x;
      //p.oy = p.y;
     // recalc();
      p.hitList = new vp.HitList(p.x, p.y);
      rootViewport.getHits(p.hitList, getPointerRadius());
      p.hitList.sortHits();
      if (e.type=='wheel') {
        var skipflag = 0;
        for (const h of p.hitList.hits) {
          const g = h.gad;
          if (!skipflag && !g.ownedBy) {
            if (!!(g.actionFlags & vp.GAF_SCROLLABLE_UPDOWN)) {
              p = pointers[index]; p.e = e;
              p.x = e.layerX * wi2px; p.ox = p.x; p.px = p.x;
              p.y = e.layerY * wi2px; p.oy = p.y; p.py = p.y;
							delete p.cancel;
              if (g.swipeBeginFunc) g.swipeBeginFunc.call(g, p);
							if (!p.cancel) {
		            p.dx = 0; p.x = p.x;
		            p.dy = Math.sign(e.wheelDelta) * 0.8 * window.devicePixelRatio; p.y = p.y + p.dy;
		            if (g.swipeMoveFunc) g.swipeMoveFunc.call(g, p);
		            if (g.swipeEndFunc) g.swipeEndFunc.call(g, p);
							}
              skipflag=1;
            } else if (!!(g.actionFlags & vp.GAF_SCROLLABLE_LEFTRIGHT)) {
              p = pointers[index]; p.e = e;
              p.x = e.layerX * wi2px; p.ox = p.x; p.px = p.x;
              p.y = e.layerY * wi2px; p.oy = p.y; p.py = p.y;
							delete p.cancel;
              if (g.swipeBeginFunc) g.swipeBeginFunc.call(g, p);
							if (!p.cancel) {
		            p.dx = Math.sign(e.wheelDelta) * 0.8 * window.devicePixelRatio; p.x = p.x + p.dx;
		            p.dy = 0; p.y = p.y;
		            if (g.swipeMoveFunc) g.swipeMoveFunc.call(g, p);
		            if (g.swipeEndFunc) g.swipeEndFunc.call(g, p);
							}
              skipflag=1;
            } else if (!!(g.actionFlags & vp.GAF_PINCHABLE)) {
              p = pointers[index]; p.e = e;
              p.x = e.layerX * wi2px; p.ox = p.x; p.px = p.x;
              p.y = e.layerY * wi2px; p.oy = p.y; p.py = p.y;
              if (!!(g.actionFlags & vp.GAF_ROTATABLE) && e.altKey && g.rotateFunc)
                g.rotateFunc.call(g, p, Math.sign(e.wheelDelta));
              else if (!!(g.actionFlags & vp.GAF_SCALABLE) && g.zoomFunc)
                g.zoomFunc.call(g, p, Math.sign(e.wheelDelta));
              skipflag=1;
            }
          }
	       }
      }
      break;
    case 'drag time reached':
      if (!pointers.hasOwnProperty(index)) pointers[index] = { gestureState: '', touching: true };
      p = pointers[index]; p.e = e;
      if (p.hitList) for (const h of p.hitList.hits) {
        const g = h.gad;
        if (g.ownedBy == index) {
          if (g.gestureState == 'begin-click' && (g.actionFlags & vp.GAF_HOLDABLE)) {
            g.gestureState = 'hold';
            g.viewport.setRenderFlag(true);
						DisownAllOtherGads(p, g);
            if (g.holdBeginFunc) g.holdBeginFunc.call(g, p);
					}
          if (g.gestureState == 'begin-drag' && !p.swiping) {
            g.gestureState = 'drag'; p.swiping = true;
            g.viewport.setRenderFlag(true);
						DisownAllOtherGads(p, g);
            if (g.dragBeginFunc) g.dragBeginFunc.call(g, p);
          }
          if (g.hasOwnProperty('gestureTimerId')) { delete g.gestureTimerId; }
        }
      }
      break;
    case 'tap-and-hold time reached':
console.log('tap-and-hold time reached');
      if (!pointers.hasOwnProperty(index)) pointers[index] = { gestureState: '', touching: true };
      p = pointers[index]; p.e = e;
      for (const h of p.hitList.hits) {
        const g = h.gad;
        if (g.ownedBy == index) {
          if (Math.sqrt((p.ox - p.x)**2 + (p.oy - p.y)**2) <= TAP_WIGGLE)
          switch (g.gestureState) {
          case 'begin-tap':
          case 'begin-menu':
          case 'begin-input':
          case 'begin-swipe':
          case 'begin-drag':
          case 'begin-hold':
            if (!!(g.actionFlags & vp.GAF_CONTEXTMENU) && !p.swiping) {
              g.gestureState = 'menu-hold';
              g.viewport.setRenderFlag(true);
              DisownAllOtherGads(p, g);
              if (g.contextMenuFunc) g.contextMenuFunc.call(g, p);
            } else if (!!(g.actionFlags & vp.GAF_HOLDABLE) && !p.swiping) {
              g.gestureState = 'hold';
console.log('hold');
              g.viewport.setRenderFlag(true);
							DisownAllOtherGads(p, g);
		          if (g.holdBeginFunc) g.holdBeginFunc.call(g, p);
if(speak) window.speechSynthesis.speak(new SpeechSynthesisUtterance('hold'));
            } else if (!!(g.actionFlags & vp.GAF_DRAGGABLE) && !p.swiping) {
              g.gestureState = 'drag'; p.swiping = true;
              g.viewport.setRenderFlag(true);
							DisownAllOtherGads(p, g);
              if (g.dragBeginFunc) g.dragBeginFunc.call(g, p);
            } else if (!!(g.actionFlags & vp.GAF_SWIPEABLE) && !p.swiping) {
              g.gestureState = 'swipe'; p.swiping = true;
              g.viewport.setRenderFlag(true);
              for (const o of p.hitList.hits) if (o.gad !== g && o.gad.ownedBy == index) delete o.gad.ownedBy;
							delete p.cancel;
              if (g.swipeBeginFunc) g.swipeBeginFunc.call(g, p);
							if (p.cancel) {
								g.gestureState = 'prog-cancel-swipe';
							}
            } else {
              g.gestureState = 'invalid-tap-and-hold';
              g.viewport.setRenderFlag(true);
            }
            break;
          }
          if (g.hasOwnProperty('gestureTimerId')) { delete g.gestureTimerId; }
        }
      }
      break;
    }
  }

function initialize(c, inputalpha, inputnum, inputnext, inputprev) {
	canvas = c;
	kbalpha = inputalpha;
	kbnum = inputnum;
	kbnext = inputnext;
	kbprev = inputprev;
	gl = canvas.getContext('webgl2', {
		antialias: true,
		alpha: false,
		desynchronized: true,
		preserveDrawingBuffer: true,
	});
	var viewportOrigFunc = gl.viewport.bind(gl), curDims;
	gl.viewport = function(x,y,w,h) {
		curDims = [x,y,w,h];
		viewportOrigFunc(x,y,w,h);
	}
	var getParameterOrigFunc = gl.getParameter.bind(gl);
	gl.getParameter = function(pname) {
		return (pname == gl.VIEWPORT && !!curDims)?
			curDims:
			getParameterOrigFunc(pname);
	}
}

function start(root) {

	// WEBGL INITIALIZATION

	if (!gl) return;

	const plainVertexShader = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(plainVertexShader, `
        attribute vec4 aVertexPosition;
        uniform vec4 uVertexColor;
        uniform mat4 uModelViewMatrix;
        uniform mat4 uProjectionMatrix;
        varying vec4 v_Color;
        void main() {
          gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
          v_Color = uVertexColor;
        }
	`);
	gl.compileShader(plainVertexShader);
	if (!gl.getShaderParameter(plainVertexShader, gl.COMPILE_STATUS)) return;

	const plainFragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(plainFragmentShader, `
        varying lowp vec4 v_Color;
        void main() {
          gl_FragColor = v_Color;
        }
	`);
	gl.compileShader(plainFragmentShader);
	if (!gl.getShaderParameter(plainFragmentShader, gl.COMPILE_STATUS)) return;

	plainProgram = gl.createProgram();
	gl.attachShader(plainProgram, plainVertexShader);
	gl.attachShader(plainProgram, plainFragmentShader);
	gl.linkProgram(plainProgram);
	if (!gl.getProgramParameter(plainProgram, gl.LINK_STATUS)) return;

	buf2 = gl.createBuffer(); // buffer for 2-value vertices
	gl.bindBuffer(gl.ARRAY_BUFFER, buf2);
	gl.vertexAttribPointer(
		gl.getAttribLocation(plainProgram, 'aVertexPosition'),
		2, // numComponents
		gl.FLOAT, // type
		false, // normalize
		0, // stride
		0); // offset
	gl.enableVertexAttribArray(
		gl.getAttribLocation(plainProgram, 'aVertexPosition'));

	const cum2 = []; // accumulator to build data for buffer

	beg2.unitLine = cum2.length/2; cum2.splice(cum2.length, 0,
		0,0, 1,1,
	); len2.unitLine = cum2.length/2 - beg2.unitLine;

	beg2.unitSquare = cum2.length/2; cum2.splice(cum2.length, 0,
		1,1, 0,1, 0,0, 1,0,
	); len2.unitSquare = cum2.length/2 - beg2.unitSquare;

	beg2.roundTouch = cum2.length/2;
	for (var i = 0; i < 36; i++) {
		cum2.splice(cum2.length, 0,
			touchRadius*Math.sin(i/18*Math.PI),
			touchRadius*Math.cos(i/18*Math.PI));
	}
	len2.roundTouch = cum2.length/2 - beg2.roundTouch;

	beg2.squareTouch = cum2.length/2; cum2.splice(cum2.length, 0,
		 touchRadius-.5,  touchRadius-.5,
		-touchRadius+.5,  touchRadius-.5,
		-touchRadius+.5, -touchRadius+.5,
		 touchRadius-.5, -touchRadius+.5,
	); len2.squareTouch = cum2.length/2 - beg2.squareTouch;

	beg2.roundMouse = cum2.length/2;
	for (var i = 0; i < 36; i++) {
		cum2.splice(cum2.length, 0,
			clickRadius*Math.sin(i/18*Math.PI),
			clickRadius*Math.cos(i/18*Math.PI));
	}
	len2.roundMouse = cum2.length/2 - beg2.roundMouse;

	beg2.squareMouse = cum2.length/2; cum2.splice(cum2.length, 0,
		 clickRadius-.5,  clickRadius-.5,
		-clickRadius+.5,  clickRadius-.5,
		-clickRadius+.5, -clickRadius+.5,
		 clickRadius-.5, -clickRadius+.5,
	); len2.squareMouse = cum2.length/2 - beg2.squareMouse;

	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cum2), gl.STATIC_DRAW);


	// AUDIO INITIALIZATION

	var audioInit = false;
	var initState = 0;
	async function initAudio() {
		if (initState == 0) {
			ac = new AudioContext();
			initState = 1;
		} else if (initState == 1) {
			await ac.audioWorklet.addModule(
				"data:application/javascript;base64," +
				btoa(`
            class AudioProcessor extends AudioWorkletProcessor {
              constructor() {
                super();
                this.lastClick = 0;
                this.wave = 0;
                this.fx = 0;
              }
              process (inputs, outputs, parameters) {
                const output = outputs[0];
                output.forEach(channel => {
                  for (var i = 0; i < channel.length; i++) {
                    var sfx = 0;
                    if (parameters['beep'][0] != this.fx) {
                      this.fx = parameters['beep'][0];
                      this.wave = 0;
                    }
                    switch (this.fx) {
                      case 1:
                        if (this.wave >= 200) this.wave = 0;
                        sfx = this.wave >= 100? -0.1 : 0.1;
                        break;
                      case 2:
                        if (this.wave >= 100) this.wave = 0;
                        sfx = this.wave >= 50? -0.1 : 0.1;
                        break;
                      case 3:
                        if (this.wave >= 50) this.wave = 0;
                        sfx = this.wave >= 25? -0.1 : 0.1;
                        break;
                    }
                    this.wave += 1;
                    var wind = (Math.random() * 2 - 1)
                      * (0.000 + (parameters['windspeed'][0]));
                    channel[i] =
                      wind +
                      0.5 * (parameters['click'].length > 1 ? parameters['click'][i] : parameters['click'][0]) + sfx;
                  }
                });
                return true;
              }
              static get parameterDescriptors() {
                return [
                  {
                    name: "windspeed",
                    automationRate: "a-rate",
                    defaultValue: 0,
                    minValue: 0,
                    maxValue: 1,
                  },
                  {
                    name: "click",
                    automationRate: "a-rate",
                    defaultValue: 0,
                    minValue: 0,
                    maxValue: 1,
                  },
                  {
                    name: "beep",
                    automationRate: "k-rate",
                    defaultValue: 0,
                    minValue: 0,
                    maxValue: 1,
                  },
                ];
              }
            }
            registerProcessor('audio-processor', AudioProcessor);
				`));

			var source = ac.createBufferSource();
			var processor = ac.createScriptProcessor(2048);
			source.start();
			initState = 2;
		} else if (initState == 2) {
			const audioNode = new AudioWorkletNode(ac, 'audio-processor');
			audioNode.connect(ac.destination);
			clickSound = audioNode.parameters.get('click');
			beepSound = audioNode.parameters.get('beep');
			windSound = audioNode.parameters.get('windspeed');
			initState = 3;
			audioInit = true;
		}
	}

	// START PROCESSING EVENTS
	if (root) rootViewport = root;

function hideAllTextInputs() {
	kbalpha.style.display = 'none';
	kbnum.style.display = 'none';
	kbnext.style.display = 'none';
	kbprev.style.display = 'none';
}

	// Add event listeners.
	// NOTE: Some events are used to trigger audio initialization.
	window.addEventListener("resize",
		function(e) { resizeCanvas(); }, false); resizeCanvas();
	window.requestAnimationFrame(refresher);
/*
	kbalpha.addEventListener("keydown",
		function(e) {
			var g = inputGad;
			if (g && g.specialKeys && g.specialKeys.includes(e.key)) {
				e.preventDefault();
				if (g.specialFunc) g.specialFunc.call(g, e);
			} else if (g && g.specialCodes && g.specialCodes.includes(e.code)) {
				e.preventDefault();
				if (g.specialFunc) g.specialFunc.call(g, e);
			} else if (g && e.key.length == 1 && g.limitChars && !g.limitChars.includes(e.key)) {
				e.preventDefault();
				beep();
			} else if (!inputSelected && g && e.key.length == 1
			&& g.limitLenFunc && g.limitLenFunc()) {
				e.preventDefault();
				beep();
			}
		  inputSelected = false;
		}, false);
	kbalpha.addEventListener("input",
		function(e) {
//console.log('kbalpha.input');
			var g = inputGad;
			g.text = kbalpha.value;
			if (g.textFunc) g.textFunc.call(g);
		  inputSelected = false;
		}, false);
	kbalpha.addEventListener("blur",
		function(e) {
//console.log('kbalpha.blur');
			var g = inputGad;
			kbalpha.style.display = 'none';
			if (g && g.textEndFunc) g.textEndFunc.call(g);
			inputGadPrev = g;
			inputGad = undefined;
		  inputSelected = false;
		}, false);
	kbnum.addEventListener("keydown",
		function(e) {
			var g = inputGad;
			if (kbnum.value == '00') kbnum.value = '0';
			if (g && g.specialKeys && g.specialKeys.includes(e.key)) {
				e.preventDefault();
				if (g.specialFunc) g.specialFunc.call(g, e);
			} else if (g && g.specialCodes && g.specialCodes.includes(e.code)) {
				e.preventDefault();
				if (g.specialFunc) g.specialFunc.call(g, e);
			} else if (g && e.key.length == 1 && g.limitChars && !g.limitChars.includes(e.key)) {
				e.preventDefault();
				beep();
			} else if (!inputSelected && g && e.key.length == 1
			&& g.limitLenFunc && g.limitLenFunc()) {
				e.preventDefault();
				beep();
			}
		  inputSelected = false;
		}, false);
	kbnum.addEventListener("input",
		function(e) {
//console.log('kbnum.input', e);
			var g = inputGad;
			g.text = kbnum.value;
			if (g.textFunc) g.textFunc.call(g);
		  inputSelected = false;
		}, false);
	kbnum.addEventListener("blur",
		function(e) {
//console.log('kbnum.blur', inputGad, e);
			var g = inputGad;
			kbnum.style.display = 'none';
			if (g && g.textEndFunc) g.textEndFunc.call(g);
			inputGadPrev = g;
			inputGad = undefined;
		  inputSelected = false;
		}, false);
	kbnext.addEventListener("focus",
		function(e) {
//console.log('kbnext.focus');
			var g = inputGadPrev;
			hideAllTextInputs();
			inputGad = undefined;
			if (g && g.textNextFunc) g.textNextFunc.call(g);
		}, false);
	kbprev.addEventListener("focus",
		function(e) {
//console.log('kbprev.focus');
			var g = inputGadPrev;
			hideAllTextInputs();
			inputGad = undefined;
			if (g && g.textPrevFunc) g.textPrevFunc.call(g);
		}, false);
*/
	canvas.addEventListener("touchend",
		function(e) { eventHandler(e, 'touches'); }, false);
	canvas.addEventListener("pointerdown",
		function(e) {
			if (!audioInit) initAudio();
			e.preventDefault();
			eventHandler(e, 'down');
		}, false);
	canvas.addEventListener("pointermove",
		function(e) { e.preventDefault(); eventHandler(e, 'move'); }, false);
	canvas.addEventListener("pointerup",
		function(e) {
			if (!audioInit) initAudio();
			e.preventDefault();
			eventHandler(e, 'up');
		}, false);
	canvas.addEventListener("contextmenu",
		function(e) { e.preventDefault(); }, false);
	canvas.addEventListener("wheel",
		function(e) { e.preventDefault(); eventHandler(e, 'wheel'); }, false);
	document.addEventListener('paste', function(e) {
		var g = inputGad;
		if (g && g.pasteFunc) {
			g.pasteFunc.call(g, e);
		}
	});
	document.addEventListener('keydown', function(e) {
		var g = inputGad;
		if (g && g.keydownFunc) {
			g.keydownFunc.call(g, e);
		}
/*
		if (e.key == 'Enter' && g && g.textNextFunc) {
			e.preventDefault();
			g.textNextFunc.call(g);
		}
*/
	});
}

