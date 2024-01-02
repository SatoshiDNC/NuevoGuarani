const themes = [
	{ title: 'light mode', subtitle: 'default', theme: new DefaultLightTheme() },
	{ title: 'dark mode', subtitle: 'default', theme: new DefaultDarkTheme() },
];

const textures = [
	{ title: 'tradfi', font: financeGraphicsFont, width: 120, height: 120, pattern:
		"\x00\x01\x02\x03\x04\x05\x06\x07\x08\x09\x0A\x0B\x0C\x0D\x0E\x0F" +
		"\x10\x11\x12\x13\x14\x15\x16\x17\x18\x19\x1A\x1B\x1C\x1D\x1E\x1F" +
		"\x20\x21\x22\x23\x24\x25\x26\x27\x28\x29\x2A\x2B\x2C\x2D\x2E\x2F" +
		"\x30\x31\x32\x33\x34\x35\x36\x37\x38\x39\x3A\x3B\x3C\x3D\x3E\x3F" +
		"\x40\x41\x42\x43\x44\x45\x46\x47\x48\x49\x4A\x4B\x4C\x4D\x4E\x4F" +
		"\x50\x51\x52\x53\x54\x55\x56\x57\x58\x59\x5A\x5B\x5C\x5D\x5E\x5F" +
		"\x60\x61\x62\x63\x64\x65\x66\x67\x68\x69\x6A\x6B\x6C\x6D\x6E\x6F" +
		"\x70" +
		""
	},
	{ title: 'plain', font: undefined, pattern: "" },
];

const colorsettings = v = new vp.View(null);
v.name = Object.keys({colorsettings}).pop();
v.title = 'themes';
v.minX = 0; v.maxX = 0;
v.minY = 0; v.maxY = 0;
v.gadgets.push(v.swipeGad = new vp.SwipeGadget(v));
v.swipeGad.actionFlags = vp.GAF_SWIPEABLE_UPDOWN | vp.GAF_SCROLLABLE_UPDOWN;
v.swipeGad.hide = true;
v.gadgets.push(v.themelist = g = new vp.Gadget(v));
	g.key = 'themeColors';
	g.list = themes;
  g.index = -1;
	g.listItemClick = function(index) {
		const g = this, v = g.viewport;
		{ // For the GUI.
			g.index = index;
			home.setRenderFlag(true);
		} { // For the app function.
			customerColors = themes[index].theme;
      mainShapes.build()
      emojiShapes.build(config.priceList.thumbnailData, config.priceList.thumbnailsPerRow, config.priceList.thumbnailsPerColumn, emojipane.emojiPoints)
		} { // For persistence.
      PlatformUtil.DatabasePut('settings', g.list[index].title, `${getCurrentAccount().id}-${g.key}`, (event) => {
				console.log(`successfully selected ${g.key}`, event)
			}, (event) => {
				console.log(`error selecting ${g.key}`, event)
			})
		}
	}
v.gadgets.push(v.texturelist = g = new vp.Gadget(v));
	g.key = 'themeTexture';
	g.list = textures;
  g.index = -1;
	g.listItemClick = function(index) {
		const g = this, v = g.viewport;
		{ // For the GUI.
			g.index = index;
			home.setRenderFlag(true);
		} { // For the app function.
			if (textures[index].font) textures[index].font.init();
		} { // For persistence.
      PlatformUtil.DatabasePut('settings', g.list[index].title, `${getCurrentAccount().id}-${g.key}`, (event) => {
				console.log(`successfully selected ${g.key}`, event)
			}, (event) => {
				console.log(`error selecting ${g.key}`, event)
			})
		}
	}
v.load = function(cb) {
	const debuglog = false;
	const gads = [
		'themelist', 'texturelist',
	];
	function icb(cb, v) {
		if (v.themelist.loadComplete && v.texturelist.loadComplete) {
			v.loadComplete = true; cb();
		}
	}
	for (const gad of gads) {
		const g = this[gad];
		g.tempValue = '';
		function finishInit(cb, v, g) {
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
				customerColors = themes[(index >= 0)? index: 1].theme;
        mainShapes.build()
        emojiShapes.build(config.priceList.thumbnailData, config.priceList.thumbnailsPerRow, config.priceList.thumbnailsPerColumn, emojipane.emojiPoints)
			}
			if (g === v.texturelist) {
				if (textures[index].font) textures[index].font.init();
			}
			delete g.tempValue;
			if (debuglog) console.log(`${g.key} ready`, g.index);
			g.loadComplete = true; icb(cb, v);
		}
		if (debuglog) console.log("requesting", `${getCurrentAccount().id}-${g.key}`)
    PlatformUtil.DatabaseGet('settings', `${getCurrentAccount().id}-${g.key}`, (event) => {
			if (event.target.result !== undefined)
				g.tempValue = event.target.result
			if (debuglog) console.log(`${g.key} restored`, g.tempValue)
			finishInit(cb, this, g)
		}, (event) => {
			console.log(`error getting ${g.key}`, event)
			finishInit(cb, this, g)
		})
	}
}
