const dangerzone = v = new vp.View(null);
v.name = Object.keys({dangerzone}).pop();
v.title = 'danger zone';
v.minX = 0; v.maxX = 0;
v.minY = 0; v.maxY = 0;
v.gadgets.push(v.swipeGad = new vp.SwipeGadget(v));
v.swipeGad.actionFlags = vp.GAF_SWIPEABLE_UPDOWN | vp.GAF_SCROLLABLE_UPDOWN;
v.swipeGad.hide = true;
v.gadgets.push(v.deleteall = g = new vp.Gadget(v));
	g.icon = "\x03";
	g.color = [1,0,0,1];
	g.title = 'delete all data';
	g.button = true;
	g.clickFunc = function() {
		const g = this;
		if (confirm(tr('are you sure?'))) {
			console.log('Deleting database...');
			db.close();
			const req = indexedDB.deleteDatabase("DB");
			req.onsuccess = (e) => {
				console.log('Database deleted.');
				openDatabase();
				alert(tr('all data has been deleted and/or reset to installation defaults'));
				settingspages.toPage(0);
			};
			req.onerror = (e) => {
				console.log('Error deleting database.');
				openDatabase();
				alert(tr('an error occurred'));
				settingspages.toPage(0);
			};
		}
	}
