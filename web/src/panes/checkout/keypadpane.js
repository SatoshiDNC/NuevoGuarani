
var keypadpane = v = new vp.View();
v.name = Object.keys({keypadpane}).pop();
v.keypad = [];
v.keyPoint = 10
v.keyEnter = 11
v.keyTimes = 12
v.keyBack = 13
{
	for (var i=0; i<=13; i++) {
		v.gadgets.push(g = v.keypad[i] = new vp.Gadget(v));
			g.actionFlags = vp.GAF_CLICKABLE;
			g.label = i.toString();
			g.clicked = false;
			g.code = i;
			g.clickFunc = function() { this.clicked = true; if (this.target && this.target.keypadFunc) this.target.keypadFunc(this.code); }
	}
	v.gadgets.push(g = v.inputGad = new vp.Gadget(v));
		//g.actionFlags = vp.GAF_CLICKABLE;
		//g.label = i.toString();
		//g.clicked = false;
		//g.code = i;
		//g.clickFunc = function() { this.clicked = true; if (this.target && this.target.keypadFunc) this.target.keypadFunc(this.code); }
		g.pasteFunc = function(e) {
			let v = this.viewport;
			if (v.target && v.target.pasteFunc) v.target.pasteFunc(e);
		}
		g.keydownFunc = function(e) {
			function getGad(e) {
				const v = keypadpane;
				for (let i=0; i<=13; i++) {
					let g = v.keypad[i];
					if (g.code == e.key) return g;
					else switch(g.code) {
					case v.keyPoint: if (e.key == '.') return g; break;
					case v.keyEnter: if (e.key == 'Enter') return g; break;
					case v.keyTimes: if (e.key == '*') return g; break;
					case v.keyBack: if (e.key == 'Backspace') return g; break;
					}
				}
			}
			let g = getGad(e);
			if (g) {
				g.clickFunc();
				g.viewport.setRenderFlag(true);
			} else {
				let v = this.viewport;
				if (v.target && v.target.keypadFunc) v.target.keypadFunc(-1, e.key);
			}
		}
}
v.layoutFunc = function() {
	const v = this;
	const padx = 2*v.sw/100;
	const pady = 2*v.sh/100;
	var g;
	for (var i=0; i<3; i++) for (var j=0; j<3; j++) {
		g = v.keypad[i+j*3+1];
		g.x = padx +   i * (v.sw-padx)/4;
		g.y = pady +(2-j)* (v.sh-pady)/4;
		g.w = (v.sw-padx)/4 - padx;
		g.h = (v.sh-pady)/4 - pady;
		g.shape = 'keypad';
		g.autoHull();
	}
	g = v.keypad[0];
	g.x = padx + 0 * (v.sw-padx)/4;
	g.y = pady + 3 * (v.sh-pady)/4;
	g.w = 2*(v.sw-padx)/4 - padx;
	g.h =   (v.sh-pady)/4 - pady;
	g.shape = 'keypadwide';
	g.autoHull();
	g = v.keypad[v.keyPoint]; g.label = '.';
	g.x = padx + 2 * (v.sw-padx)/4;
	g.y = pady + 3 * (v.sh-pady)/4;
	g.w = (v.sw-padx)/4 - padx;
	g.h = (v.sh-pady)/4 - pady;
	g.shape = 'keypad';
	g.autoHull();
	g = v.keypad[v.keyEnter]; g.label = icap(tr('enter'));
	g.x = padx + 3 * (v.sw-padx)/4;
	g.y = pady + 2 * (v.sh-pady)/4;
	g.w =   (v.sw-padx)/4 - padx;
	g.h = 2*(v.sh-pady)/4 - pady;
	g.shape = 'keypadtall';
	g.autoHull();
	g = v.keypad[v.keyTimes]; g.label = '×';
	g.x = padx + 3 * (v.sw-padx)/4;
	g.y = pady + 1 * (v.sh-pady)/4;
	g.w = (v.sw-padx)/4 - padx;
	g.h = (v.sh-pady)/4 - pady;
	g.shape = 'keypad';
	g.autoHull();
	g = v.keypad[v.keyBack]; g.label = icap(tr('back'));
	g.x = padx + 3 * (v.sw-padx)/4;
	g.y = pady + 0 * (v.sh-pady)/4;
	g.w = (v.sw-padx)/4 - padx;
	g.h = (v.sh-pady)/4 - pady;
	g.shape = 'keypad';
	g.autoHull();
}
v.renderFunc = function() {
//	drawThemeBackdrop(this, config.themeColors);
	gl.clearColor(...config.themeColors.uiBackground);
	gl.clear(gl.COLOR_BUFFER_BIT);
	const v = this;
	mainShapes.useProg2();
	gl.uniformMatrix4fv(gl.getUniformLocation(prog2, 'uProjectionMatrix'), false, v.mat);
	const m = mat4.create();
	for (var g of v.keypad) {
		var sel = g.clicked || ['begin-tap','begin-click','recover-click'].includes(g.gestureState);
		mat4.identity(m);
		mat4.translate(m,m, [g.x, g.y, 0]);
		mat4.scale(m,m, [g.w, g.h, 1]);
		gl.uniformMatrix4fv(gl.getUniformLocation(prog2, 'uModelViewMatrix'), false, m);
		gl.uniform4fv(gl.getUniformLocation(prog2, 'overallColor'),
			new Float32Array(sel?config.themeColors.uiPillOrange:config.themeColors.uiSettingsBubble));
		mainShapes.drawArrays2(g.shape);
	}
	for (var g of v.keypad) {
		var sel = g.clicked || ['begin-tap','begin-click','recover-click'].includes(g.gestureState);
		mat4.identity(m);
		mat4.translate(m,m, [g.x, g.y, 0]);
		mat4.scale(m,m, [50/32, 50/32, 1]);
		mat4.translate(m,m, [8, 7+14, 0]);
		if (g.label.length > 1) mat4.scale(m,m, [0.5, 0.5, 1]);
		defaultFont.draw(0,0, tr(g.label), sel? config.themeColors.uiText: config.themeColors.uiButton, v.mat, m);
	}
	for (var g of v.keypad) {
		if (g.clicked) { g.clicked = false; v.setRenderFlag(true); }
	}
};
