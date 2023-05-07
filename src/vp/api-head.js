var vp = (function() {

  // set by initialize()
  var canvas, gl;

  // set by start()
  const beg2 = {}, len2 = {};
  var ac, clickSound, windSound;
  var buf2;

  var diagonal, wi2px, px2wi;
  var rootViewport, animViews = [];
  const pixelPM = mat4.create();
  var plainProgram;
  var mouseEnabled = 0;

  const touchRadius = 85, clickRadius = 5;
  function getPointerRadius() { return (navigator.maxTouchPoints>0 ? touchRadius : clickRadius); }
  function isMouseEnabled() { return mouseEnabled; }
  function getContext() { return gl; }

