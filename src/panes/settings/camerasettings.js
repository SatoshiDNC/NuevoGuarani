const cameras = [];
var camerasLoaded = false;
var cameraSettingTrigger = false;
if (!navigator.mediaDevices?.enumerateDevices) {
  console.log("enumerateDevices() not supported.");
} else {
  navigator.mediaDevices
    .enumerateDevices()
    .then((devices) => {
			var x = 0;
      for (var i=0; i<devices.length; i++) {
				var device = devices[i];
				if (device.kind == 'videoinput') {
					x += 1;
					cameras.push({
						title: device.label? device.label: `camera ${x}`,
						label: device.label,
						deviceId: device.deviceId
					});
				}
      }
			camerasLoaded = true;
			loadCameraSettingGuarded();
    })
    .catch((err) => {
      console.error(`${err.name}: ${err.message}`);
    });
}

function loadCameraSettingGuarded() {
	if (!cameraSettingTrigger || !camerasLoaded) return;
	const debuglog = false;
	var selectedCameraId = '';
	function finishCameraInit() {
		var index = -1;
		for (var i=0; i<cameras.length; i++) {
			if (cameras[i].deviceId == selectedCameraId) {
				index = i;
				break;
			}
		}
		{ // For the GUI.
			camerasettings.cameralist.index = index;
			camerasettings.setRenderFlag(true);
		} { // For the app function.
			BarcodeScanner.cameraId = (index >= 0)? cameras[index].deviceId: '';
		} { // For persistence.
		}
		if (debuglog) console.log("camera setting ready", camerasettings.cameralist.index);
	}
	if (debuglog) console.log("requesting", `${getCurrentAccount().id}-selectedCameraId`);
	var req = db.transaction(["settings"], "readonly")
		.objectStore("settings")
		.get(`${getCurrentAccount().id}-selectedCameraId`);
	req.onsuccess = (event) => {
		selectedCameraId = event.target.result
		if (debuglog) console.log("selectedCameraId restored", selectedCameraId);
		finishCameraInit();
	};
	req.onerror = (event) => {
		console.log("error getting selectedCameraId", event);
		finishCameraInit();
	};
}

const camerasettings = v = new vp.View(null);
v.name = Object.keys({camerasettings}).pop();
v.title = 'camera selection';
v.minX = 0; v.maxX = 0;
v.minY = 0; v.maxY = 0;
v.gadgets.push(v.swipeGad = new vp.SwipeGadget(v));
v.swipeGad.actionFlags = vp.GAF_SWIPEABLE_UPDOWN | vp.GAF_SCROLLABLE_UPDOWN;
v.swipeGad.hide = true;
v.gadgets.push(v.cameralist = g = new vp.Gadget(v));
	g.list = cameras;
  g.index = -1;
	g.listItemClick = function(index) {
		const g = this;
		{ // For the GUI.
			g.index = index; v.setRenderFlag(true);
		} { // For the app function.
			BarcodeScanner.cameraId = cameras[index].deviceId;
		} { // For persistence.
			var req = db.transaction(["settings"], "readwrite");
			req.objectStore("settings")
				.put(cameras[index].deviceId,
					`${getCurrentAccount().id}-selectedCameraId`);
			req.onsuccess = (event) => {
				console.log("successfully selected camera", event);
			};
			req.onerror = (event) => {
				console.log("error selecting camera", event);
			};
		}
	}
/*
	g.actionFlags = vp.GAF_CLICKABLE;
	g.w = 400; g.h = 50 * cameras.length;
	g.x = 0; g.y = 50;
	g.autoHull();
	g.layoutFunc = function() {
		const g = this;
		g.h = 50 * cameras.length;
		g.autoHull();
	}
	g.renderFunc = function() {
	}
	g.clickFunc = function(p) {
		const g = this, v = g.viewport;
		const y = p.y / v.getScale();
		const index = Math.min(Math.max(Math.floor((y - g.y) / 50), 0), cameras.length-1);

		cameraIndex = index; v.setRenderFlag(true); // For the GUI.
		BarcodeScanner.cameraId = cameras[index].deviceId; // For the app function.
		localStorage.setItem("cameraChoice", cameras[index].deviceId); // For persistence.
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
	var y = 0;
	//mat4.identity(mat);
	//defaultFont.draw(50,y + (50-16)/2+14,tr('Camera Selection'),th.uiText, this.mat, mat);
	//y += 50;

	for (var i=0; i<cameras.length; i++) {
		mat4.identity(mat);
		var color = th.uiText; if (i == cameraIndex) color = th.uiLightningYellow;
		var s = cameras[i].label;
		if (s == '') s = 'Camera ' + (i + 1);
		defaultFont.draw(50,y + (50-16)/2+14,s,color, this.mat, mat);
		y += 50;
	}

	mat4.identity(mat);
	defaultFont.draw(10,y+(50-16)/2+14,tr('The camera you choose will be requested for'),th.uiText, this.mat, mat);
	mat4.identity(mat);
	defaultFont.draw(10,y+(50-16)/2+14+16,tr('scanning QR codes.'),th.uiText, this.mat, mat);
}
*/
v.gadgets.push(v.itemscan = g = new vp.Gadget(v));
	g.key = 'enableItemScan';
	g.type = 'enable';
	g.title = 'barcode scanning';
	g.subtitle = 'scan product barcodes into description field';
  g.state = false;
	Object.defineProperty(g, "icon", {
		get : function () { return this.state? "\x0E":"\x0D"; }
	});
	g.clickFunc = function(index) {
		const g = this;
		{ // For the GUI.
			g.state = !g.state; v.setRenderFlag(true);
		} { // For the app function.
		} { // For persistence.
			var req = db.transaction(["settings"], "readwrite");
			req.objectStore("settings")
				.put(g.state,
					`${getCurrentAccount().id}-${g.key}`);
			req.onsuccess = (event) => {
				console.log(`successfully selected ${g.key}`, event);
			};
			req.onerror = (event) => {
				console.log(`error selecting ${g.key}`, event);
			};
		}
	}
v.load = function() {
	cameraSettingTrigger = true;
	loadCameraSettingGuarded();

	const debuglog = false, g = this.itemscan;
	var selectedValue = false;
	function finishInit(v) {
		const g = v.itemscan;
		g.state = selectedValue? true: false;
		{ // For the GUI.
			v.setRenderFlag(true);
		} { // For the app function.
			//defaultVendorCurrency = g.list[index];
		} { // For persistence.
		}
		if (debuglog) console.log(`${g.key} ready`, g.state);
	}
	if (debuglog) console.log("requesting", `${getCurrentAccount().id}-${g.key}`);
	var req = db.transaction(["settings"], "readonly")
		.objectStore("settings")
		.get(`${getCurrentAccount().id}-${g.key}`);
	req.onsuccess = (event) => {
		selectedValue = event.target.result
		if (debuglog) console.log(`${g.key} restored`, selectedValue);
		finishInit(this);
	};
	req.onerror = (event) => {
		console.log(`error getting ${g.key}`, event);
		finishInit(this);
	};
}
