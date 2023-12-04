  setInterval(function() {
    console.log('beep')
    vp.beep()
  }, 60000)

  if (window.devicePixelRatio > 1) defaultFont.fidelity = Math.max(1, 4 - Math.floor(window.devicePixelRatio));

	vp.start(menudiv);
}
