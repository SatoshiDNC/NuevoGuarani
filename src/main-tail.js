  setInterval(function() {
    vp.beep()
  }, 60)

  if (window.devicePixelRatio > 1) defaultFont.fidelity = Math.max(1, 4 - Math.floor(window.devicePixelRatio));

	vp.start(menudiv);
}
