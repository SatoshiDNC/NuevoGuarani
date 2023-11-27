const settingsbuttons = v = new vp.View(null);
v.name = Object.keys({settingsbuttons}).pop();
v.gadgets.push(v.maximizer = g = new vp.Gadget(v));
	g.w = 30; g.h = 30; g.actionFlags = vp.GAF_CLICKABLE;
	g.x = (50 - g.w)/2; g.y = (50 - g.h)/2;
	g.autoHull();
	g.layoutFunc = function() {
		var g = this, v = g.viewport, s = v.getScale();
		g.x = v.w/s - g.w - (50 - g.w)/2;
	}
	g.renderFunc = function() {
		const g = this, th = vendorColors;
		const mat = mat4.create();
		mat4.identity(mat);
		mat4.translate(mat,mat, [g.x,g.y-10+Math.floor((50-16*1.5)/2),0]);
		mat4.scale(mat,mat, [1.5,1.5,1]);
		iconFont.draw(0,15,"\x09",th.uiText, g.viewport.mat, mat);
	}
	g.clickFunc = function() {
		fullscreen.toggle();
	}
v.gadgets.push(v.backbutton = g = new vp.Gadget(v));
	g.w = 30; g.h = 30; g.actionFlags = vp.GAF_CLICKABLE;
	g.x = (50 - g.w)/2; g.y = (50 - g.h)/2; g.z = 1;
	g.autoHull();
	g.renderFunc = function() {
		const g = this, th = vendorColors;
		const mat = mat4.create();
		mat4.identity(mat);
		mat4.translate(mat,mat, [10,Math.floor((50-16*1.5)/2),0]);
		mat4.scale(mat,mat, [1.5,1.5,1]);
		if (settingspages.index == 0) {
			if (layoutIsVertical())
				iconFont.draw(0,15,"\x0A",th.uiText, g.viewport.mat, mat);
			else
				iconFont.draw(0,15,"\x08",th.uiText, g.viewport.mat, mat);
		} else {
			iconFont.draw(0,15,"\x07",th.uiText, g.viewport.mat, mat);
		}
	}
	g.clickFunc = function() {
		this.startTime = performance.now();
		if (settingspages.index > 0) {
			if (settingspages.tempVX) {
				if (this.clickedIndex > 0) {
					this.clickedIndex -= 1;
					settingspages.toPage(this.clickedIndex);
				}
			} else {
				this.clickedIndex = settingspages.index-1;
				settingspages.toPage(this.clickedIndex);
			}
		} else {
			if (layoutIsVertical()) {
				settingsbuttons.subOptionClickFunc(mainsettings);
			} else {
				hsettingspane.ratio = 1;
				hsettingspane.queueLayout();
			}
		}
	}
v.subOptionClickFunc = function(pane) {
	//console.log('suboption', pane.name);
	while (settingspages.pages.length > settingspages.index+1)
		settingspages.pages.pop();
	pane.userY = 0;
	settingspages.pages.push(pane);
	settingspages.toPage(settingspages.pages.length-1);
}
v.listClickFunc = function(p) {
	const g = this, v = g.viewport;
	const y = (p.y - v.y) / v.getScale() + v.userY;
	const index = Math.min(Math.max(Math.floor((y - g.y) / 50), 0),
		g.list.length-(g.canAdd?0:1));
	if (g.canAdd && index == g.list.length)
		g.listAddClick.call(g);
	else
		g.listItemClick.call(g, index);
}
v.layoutFunc = function() {
	for (const g of this.gadgets) {
		if (g.layoutFunc) g.layoutFunc.call(g);
	}
}
v.renderFunc = function() {
	const th = vendorColors;
	gl.clearColor(...th.uiBackground);
	gl.clear(gl.COLOR_BUFFER_BIT);
	mainShapes.useProg5();
	gl.enable(gl.BLEND);
	gl.uniform4fv(gl.getUniformLocation(prog5, 'overallColor'),
		new Float32Array(th.uiForeground));
	gl.uniformMatrix4fv(gl.getUniformLocation(prog5, 'uProjectionMatrix'), false, this.mat);
	for (const g of this.gadgets) {
		if (g.renderFunc) g.renderFunc.call(g);
	}
	const mat = mat4.create();
	mat4.identity(mat);
	mat4.translate(mat,mat, [50,Math.floor((50-16*1.5)/2),0]);
	mat4.scale(mat,mat, [1.5,1.5,1]);
	var str = settingspages.pages[settingspages.index].title;
	if (str) {
		str = icap(tr(str));
		defaultFont.draw(0,14,str,th.uiText, this.mat, mat);
	}
}

const settingsbuttons2 = v = new vp.View(null);
v.name = Object.keys({settingsbuttons2}).pop();
v.gadgets.push(v.maximizer = g = new vp.Gadget(v));
	g.w = 30; g.h = 30; g.actionFlags = vp.GAF_CLICKABLE;
	g.x = (50 - g.w)/2; g.y = (50 - g.h)/2;
	g.autoHull();
	g.layoutFunc = function() {
		var g = this, v = g.viewport, s = v.getScale();
		g.x = v.w/s - g.w - (50 - g.w)/2;
	}
	g.renderFunc = function() {
		if (hsettingspane.ratio != 1) return;
		const g = this, th = vendorColors;
		const mat = mat4.create();
		mat4.identity(mat);
		mat4.translate(mat,mat, [g.x,g.y-10+Math.floor((50-16*1.5)/2),0]);
		mat4.scale(mat,mat, [1.5,1.5,1]);
		iconFont.draw(0,15,"\x09",th.uiText, g.viewport.mat, mat);
	}
	g.clickFunc = function() {
		if (hsettingspane.ratio != 1) return;
		fullscreen.toggle();
	}
v.gadgets.push(v.backbutton = g = new vp.Gadget(v));
	g.w = 30; g.h = 30; g.actionFlags = vp.GAF_CLICKABLE;
	g.x = (50 - g.w)/2; g.y = (50 - g.h)/2; g.z = 1;
	g.autoHull();
	g.renderFunc = function() {
		const g = this, th = vendorColors;
		const mat = mat4.create();
		mat4.identity(mat);
		mat4.translate(mat,mat, [10,Math.floor((50-16*1.5)/2),0]);
		mat4.scale(mat,mat, [1.5,1.5,1]);
		iconFont.draw(0,15,"\x0A",th.uiText, g.viewport.mat, mat);
	}
	g.clickFunc = function() {
		if (hsettingspane.ratio < 1) {
			hsettingspane.ratio = 1;
			hsettingspane.queueLayout();
		} else {
			hsettingspane.ratio = 1 - (400 / hsettingspane.sw);
			hsettingspane.queueLayout();
		}
	}
v.layoutFunc = function() {
	for (const g of this.gadgets) {
		if (g.layoutFunc) g.layoutFunc.call(g);
	}
}
v.renderFunc = function() {
	const th = vendorColors;
	gl.clearColor(...th.uiBackground);
	gl.clear(gl.COLOR_BUFFER_BIT);
	mainShapes.useProg5();
	gl.enable(gl.BLEND);
	gl.uniform4fv(gl.getUniformLocation(prog5, 'overallColor'),
		new Float32Array(th.uiForeground));
	gl.uniformMatrix4fv(gl.getUniformLocation(prog5, 'uProjectionMatrix'), false, this.mat);
	for (const g of this.gadgets) {
		if (g.renderFunc) g.renderFunc.call(g);
	}
	const mat = mat4.create();
	mat4.identity(mat);
	mat4.translate(mat,mat, [50,Math.floor((50-16*1.5)/2),0]);
	mat4.scale(mat,mat, [1.5,1.5,1]);
	var str = startpane.title;
	if (str) {
		str = icap(tr(str));
		defaultFont.draw(0,14,str,th.uiText, this.mat, mat);
	}
}

const settingspages = v = new vp.PagesView(null, 'h');
v.name = Object.keys({settingspages}).pop();
v.swipeGad.z = -1;
v.pages.push(startpane);
v.pageChangeFunc = function() {
	//console.log('settings pagechange', this.pages[this.index].title);
	settingsbuttons.setRenderFlag(true);
}

const vsettingspane = v = new vp.SliceView(null, 't', 50);
v.name = Object.keys({vsettingspane}).pop();
v.designFit = [400, 400];
v.a = settingsbuttons; settingsbuttons.parent = v;
v.b = settingspages; settingspages.parent = v;
v.layoutFunc = function() {
	settingspages.designScale = this.viewScale;
}

const hhomepane = v = new vp.SliceView(null, 't', 50);
v.name = Object.keys({hhomepane}).pop();
//v.b = camerasettings; camerasettings.parent = v;
v.a = settingsbuttons2; settingsbuttons2.parent = v;
//v.b = startpane; startpane.parent = v;

const hsettingspane = v = new vp.DividerView(null, 'v', 0.5, 0);
v.name = Object.keys({vsettingspane}).pop();
v.designFit = [400, 400];
//v.b = camerasettings; camerasettings.parent = v;
v.a = hhomepane; hhomepane.parent = v;
//v.b = vsettingspane; vsettingspane.parent = v;
v.layoutFunc = function() {
	if (hsettingspane.ratio != 1) {
		hsettingspane.ratio = 1 - (400 / hsettingspane.sw);
		hsettingspane.b = vsettingspane; vsettingspane.parent = hsettingspane;
	}
}


var settingspane = vsettingspane;
var home = settingspane;

function verticalLayout() {
	home = settingspane = vsettingspane;
	if (!(settingspages.pages.length > 0 && settingspages.pages[0] === startpane)) { settingspages.pages.splice(0,0,startpane); settingspages.index += 1; }
	if (hsettingspane.ratio == 1) settingspages.index = 0;
	settingspages.keepPage();
	hsettingspane.b = undefined;
	menudiv.b = home; home.parent = menudiv;
	menudiv.queueLayout();
}
function horizontalLayout() {
	home = settingspane = hsettingspane;
	if (settingspages.pages.length > 0 && settingspages.pages[0] === startpane) { settingspages.pages.splice(0,1); settingspages.index -= 1; }
	if (settingspages.pages.length == 0) settingspages.pages.splice(0,0,mainsettings);
	if (settingspages.index < 0) {
		settingspages.index = 0;
		hsettingspane.ratio = 1;
	} else {
		//hsettingspane.b = vsettingspane; vsettingspane.parent = hsettingspane;
		hsettingspane.ratio = 0.5;
	}
	startpane.userX = 0;
	settingspages.keepPage();
	hhomepane.b = startpane; startpane.parent = hhomepane;
	menudiv.b = home; home.parent = menudiv;
	menudiv.queueLayout();
}
function layoutIsVertical() { return home === vsettingspane; }

