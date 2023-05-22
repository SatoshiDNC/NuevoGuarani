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
