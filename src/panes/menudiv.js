var allblack;

const splash = v = new vp.View(null);
v.name = Object.keys({splash}).pop();

//const home = settingspane;
const menudiv = v = new vp.DividerView(null, 'h', 0, 0);
v.name = Object.keys({menudiv}).pop();
div.designSize = 640*400;
v.b = splash; splash.parent = v;
//v.a = startpane; startpane.parent = v;
v.c = menudivider; menudivider.parent = v;
v.resizeFunc = function() {
	allblack.resized = true;
}
//verticalLayout();
v.layoutFunc = function() {
	if (menudiv.b == hsettingspane || menudiv.b == vsettingspane) {
		if (canvas.width > canvas.height) {
			if (layoutIsVertical()) horizontalLayout();
		} else {
			if (!layoutIsVertical()) verticalLayout();
		}
	}
}
