const dangerzone = v = new vp.View(null);
v.name = Object.keys({dangerzone}).pop();
v.title = 'danger zone';
v.gadgets.push(v.deleteall = g = new vp.Gadget(v));
	g.icon = "\x03";
	g.color = [1,0,0,1];
	g.title = 'delete all data';
	g.button = true;
	g.clickFunc = function() {
		const g = this;
		if (confirm(tr('are you sure?'))) {
			//console.log('delete all');
			db.close();
			const req = indexedDB.deleteDatabase("DB");
			req.onsuccess = (e) => {
				//console.log('Database deleted.');
				openDatabase();
				alert(tr('all data has been deleted and/or reset to installation defaults'));
				settingspages.toPage(0);
			};
			req.onerror = (e) => {
				//console.log('Error deleting database.');
				openDatabase();
				alert(tr('an error occurred'));
				settingspages.toPage(0);
			};
		}
/*
		{ // For the GUI.
			accountsettings.accountlist.index = index;
			accountsettings.setRenderFlag(true);
		} { // For the app function.
			loadAccount();
		} { // For persistence.
			var req = db.transaction(["settings"], "readwrite");
			req.objectStore("settings")
				.put(accounts[index].id, 'selectedAccount');
			req.onsuccess = (event) => {
				console.log("successfully selected new account", event);
			};
			req.onerror = (event) => {
				console.log("error selecting new account", event);
			};
		}
*/
	}
