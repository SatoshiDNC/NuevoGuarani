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
		//mat4.translate(mat,mat, [g.x,g.y-10+Math.floor((50-16*1.5)/2),0]);
		mat4.translate(mat,mat, [10,Math.floor((50-16*1.5)/2),0]);
		if (settingspages.index == 0) {
			mat4.scale(mat,mat, [1.5,1.5,1]);
			iconFont.draw(0,15,"\x0A",th.uiText, g.viewport.mat, mat);
		} else {
			mat4.scale(mat,mat, [1.5,1.5,1]);
			iconFont.draw(0,15,"\x07",th.uiText, g.viewport.mat, mat);
		}
/*
		const g = this, th = vendorColors;
		const mat = mat4.create();
		mat4.identity(mat);
		if (settingspages.index == 0) {
			mat4.translate(mat, mat, [g.x, g.y, 0]);
			mat4.scale(mat, mat, [g.w, g.h, 0]);
			useProg5();
			gl.uniformMatrix4fv(gl.getUniformLocation(prog5, 'uModelViewMatrix'), false, mat);
			gl.drawArrays(typ5.hamburger, beg5.hamburger, len5.hamburger);
		} else {
			mat4.translate(mat,mat, [10,Math.floor((50-16*1.5)/2),0]);
			mat4.scale(mat,mat, [1.5,1.5,1]);
			iconFont.draw(0,15,"\x07",th.uiText, g.viewport.mat, mat);
		}
*/
	}
	g.clickFunc = function() {
		if (settingspages.index > 0) {
			settingspages.toPage(settingspages.index-1);
		} else {
			settingsbuttons.subOptionClickFunc(mainsettings);
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
	const y = (p.y - v.y) / v.getScale();
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
	useProg5();
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
		str = tr(str);
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

const settingspane = v = new vp.SliceView(null, 't', 50);
v.name = Object.keys({settingspane}).pop();
v.designWidth = 400;
//v.b = camerasettings; camerasettings.parent = v;
v.a = settingsbuttons; settingsbuttons.parent = v;
v.b = settingspages; settingspages.parent = v;
v.layoutFunc = function() {
	settingspages.designScale = this.viewScale;
}
