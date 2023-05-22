	var allblack;
  var menudiv = v = new vp.DividerView(null, 'h', 0, 0);
	v.name = Object.keys({menudiv}).pop();
  div.designSize = 640*400;
  v.a = menupane; menupane.parent = v;
  v.b = startpane; startpane.parent = v;
  v.c = menudivider; menudivider.parent = v;
	v.resizeFunc = function() {
		allblack.resized = true;
	}
