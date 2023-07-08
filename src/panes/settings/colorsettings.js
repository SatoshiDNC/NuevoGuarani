const themes = [
	{ title: 'dark mode', subtitle: 'default', theme: new DefaultDarkTheme() },
	{ title: 'light mode', subtitle: 'default', theme: new DefaultLightTheme() },
];

const textures = [
	{ title: 'plain', font: undefined, pattern: "" },
	{ title: 'financial', font: financeGraphicsFont, width: 120, height: 120, pattern:
		"\x00\x01\x02\x03\x04\x05\x06\x07\x08\x09\x0A\x0B\x0C\x0D\x0E\x0F" +
		"\x10\x11\x12\x13\x14\x15\x16\x17\x18" +
		""
	},
];

const colorsettings = v = new vp.View(null);
v.name = Object.keys({colorsettings}).pop();
v.title = 'themes';
v.gadgets.push(v.themelist = g = new vp.Gadget(v));
	g.key = 'themeColors';
	g.list = themes;
  g.index = -1;
	g.listItemClick = function(index) {
		const g = this, v = g.viewport;
		{ // For the GUI.
			g.index = index; v.setRenderFlag(true);
		} { // For the app function.
			vendorColors = themes[index].theme;
			customerColors = themes[index].theme;
			buildShapes();
			settingsbuttons.setRenderFlag(true);
		} { // For persistence.
			var req = db.transaction(["settings"], "readwrite");
			req.objectStore("settings")
				.put(g.list[index].title, `${getCurrentAccount().id}-${g.key}`);
			req.onsuccess = (event) => {
				console.log(`successfully selected ${g.key}`, event);
			};
			req.onerror = (event) => {
				console.log(`error selecting ${g.key}`, event);
			};
		}
	}
v.gadgets.push(v.texturelist = g = new vp.Gadget(v));
	g.key = 'themeTexture';
	g.list = textures;
  g.index = -1;
	g.listItemClick = function(index) {
		const g = this, v = g.viewport;
		{ // For the GUI.
			g.index = index; v.setRenderFlag(true);
		} { // For the app function.
			if (textures[index].font) textures[index].font.init();
		} { // For persistence.
			var req = db.transaction(["settings"], "readwrite");
			req.objectStore("settings")
				.put(g.list[index].title, `${getCurrentAccount().id}-${g.key}`);
			req.onsuccess = (event) => {
				console.log(`successfully selected ${g.key}`, event);
			};
			req.onerror = (event) => {
				console.log(`error selecting ${g.key}`, event);
			};
		}
	}
v.load = function() {
	const debuglog = true;
	for (const gad of [
		'themelist', 'texturelist',
	]) {
		const g = this[gad];
		g.tempValue = '';
		function finishInit(v, g) {
			var index = -1;
			for (var i=0; i<g.list.length; i++) {
				if (g.list[i].title == g.tempValue) {
					index = i;
					break;
				}
			}
			if (index < 0) index = 0;
			g.index = index;
			settingspane.setRenderFlag(true);
			if (g === v.themelist) {
				vendorColors = themes[(index >= 0)? index: 0].theme;
				customerColors = themes[(index >= 0)? index: 1].theme;
				buildShapes();
			}
			if (g === v.texturelist) {
				if (textures[index].font) textures[index].font.init();
			}
			delete g.tempValue;
			if (debuglog) console.log(`${g.key} ready`, g.index);
		}
		if (debuglog) console.log("requesting", `${getCurrentAccount().id}-${g.key}`);
		var req = db.transaction(["settings"], "readonly")
			.objectStore("settings")
			.get(`${getCurrentAccount().id}-${g.key}`);
		req.onsuccess = (event) => {
			if (event.target.result !== undefined)
				g.tempValue = event.target.result;
			if (debuglog) console.log(`${g.key} restored`, g.tempValue);
			finishInit(this, g);
		};
		req.onerror = (event) => {
			console.log(`error getting ${g.key}`, event);
			finishInit(this, g);
		};
	}
}
