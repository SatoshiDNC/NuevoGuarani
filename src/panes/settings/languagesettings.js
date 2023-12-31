const languages = [];
{
	for (var lang of enabledLangs) {
		languages.push({ title: tr(lang,lang) });
	}
}

const languagesettings = v = new vp.View(null);
v.name = Object.keys({languagesettings}).pop();
v.title = 'language';
v.minX = 0; v.maxX = 0;
v.minY = 0; v.maxY = 0;
v.gadgets.push(v.swipeGad = new vp.SwipeGadget(v));
v.swipeGad.actionFlags = vp.GAF_SWIPEABLE_UPDOWN | vp.GAF_SCROLLABLE_UPDOWN;
v.swipeGad.hide = true;
v.gadgets.push(v.langlist = g = new vp.Gadget(v));
	g.list = languages;
  g.index = -1;
	g.listItemClick = function(index) {
		const g = this;
		{ // For the GUI.
			g.index = index; v.setRenderFlag(true);
		} { // For the app function.
			lcode = enabledLangs[index];
			settingspane.setRenderFlag(true);
		} { // For persistence.
			var req = db.transaction(["settings"], "readwrite");
			req.objectStore("settings")
				.put(languages[languagesettings.langlist.index].title,
					`${getCurrentAccount().id}-mainLanguage`);
			req.onsuccess = (event) => {
				console.log("successfully selected language", event);
			};
			req.onerror = (event) => {
				console.log("error selecting language", event);
			};
		}
	}
v.load = function(cb) {
	const debuglog = false;
	var selectedValue = '';
	function finishInit(cb, v) {
		let index = -1;
		for (let i=0; i<languages.length; i++) {
			if (languages[i].title == selectedValue) {
				index = i;
				break;
			}
		}
		if (index < 0) {
			let urlParams = new URLSearchParams(window.location.search);
			let lang = urlParams.get('lang');
			if (!lang) lang = 'es-PY';
			for (let i=0; i<languages.length; i++) {
				if (languages[i].title == tr(lang,lang)) {
					index = i;
					break;
				}
				for (let l of enabledLangs) {
					if (l.startsWith(lang) && languages[i].title == tr(l,l)) {
						index = i;
						break;
					}
				}
			}
		}
		if (index < 0) index = 0;
		{ // For the GUI.
			languagesettings.langlist.index = index;
			settingspane.setRenderFlag(true);
		} { // For the app function.
			lcode = enabledLangs[index];
			settingspane.setRenderFlag(true);
		} { // For persistence.
		}
		if (debuglog) console.log("lang ready", languagesettings.langlist.index);
		v.loadComplete = true; cb();
	}
	if (debuglog) console.log("requesting", `${getCurrentAccount().id}-mainLanguage`);
	var req = db.transaction(["settings"], "readonly")
		.objectStore("settings")
		.get(`${getCurrentAccount().id}-mainLanguage`);
	req.onsuccess = (event) => {
		selectedValue = event.target.result
		if (debuglog) console.log("mainLanguage restored", selectedValue);
		finishInit(cb, this);
	};
	req.onerror = (event) => {
		console.log("error getting mainLanguage", event);
		finishInit(cb, this);
	};
}
