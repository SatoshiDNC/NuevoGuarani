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
          console.log('Camera option:', JSON.stringify(device))
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
	var selectedCameraId = { index: -1, data: {} };
	function finishCameraInit() {
		var index = -1;
    if (selectedCameraId.index !== -1) {
      for (var i=0; i<cameras.length; i++) {
        if (cameras[i].deviceId == selectedCameraId.data.deviceId) {
          index = i;
          break;
        }
      }
    }
    if (index == -1) {
      for (var i=0; i<cameras.length; i++) {
        if (i == selectedCameraId.index) {
          index = i;
          break;
        }
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
	if (debuglog) console.log("requesting", `${getCurrentAccount().id}-selectedCameraId`)
  PlatformUtil.DatabaseGet('settings', `${getCurrentAccount().id}-selectedCameraId`, (event) => {
		selectedCameraId = event.target.result
		if (debuglog) console.log("selectedCameraId restored", selectedCameraId)
		finishCameraInit()
	}, (event) => {
		console.log("error getting selectedCameraId", event)
		finishCameraInit()
	})
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
      PlatformUtil.DatabasePut('settings', { index, data: cameras[index] }, `${getCurrentAccount().id}-selectedCameraId`, (event) => {
				console.log("successfully selected camera", event)
			}, (event) => {
				console.log("error selecting camera", event)
			})
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
	const th = config.themeColors;
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
	g.subtitle = 'enable barcode scanning function';
  g.state = false;
	Object.defineProperty(g, "icon", {
		get : function () { return this.state? "\x0E":"\x0D"; }
	});
	g.appFunction = function() {
		const g = this;
		camerasettings.lnscan.hide = !g.state;
		camerasettings.lnscan.enabled = !camerasettings.lnscan.hide;
    g.viewport.queueLayout()
	}
	g.clickFunc = function(index) {
		const g = this;
		{ // For the GUI.
			g.state = !g.state; v.setRenderFlag(true);
		} { // For the app function.
			if (g.appFunction) g.appFunction();
		} { // For persistence.
      PlatformUtil.DatabasePut('settings', g.state, `${getCurrentAccount().id}-${g.key}`, (event) => {
				console.log(`successfully selected ${g.key}`, event)
			}, (event) => {
				console.log(`error selecting ${g.key}`, event)
			})
		}
	}
v.gadgets.push(v.lnscan = g = new vp.Gadget(v));
	g.key = 'enableLightningScan';
	g.type = 'enable';
	g.title = 'lightning invoice scanning';
	g.subtitle = 'to pay lightning invoices on behalf of customer';
  g.state = false;
	Object.defineProperty(g, "icon", {
		get : function () { return this.state? "\x0E":"\x0D"; }
	});
	g.clickFunc = v.itemscan.clickFunc;

v.load = function(cb) {
	cameraSettingTrigger = true;
	loadCameraSettingGuarded();

	const debuglog = false;
	const gads = [
		'itemscan', 'lnscan',
	];
	function icb(cb, v) {
		let allComplete = true;
		for (let gad of gads) {
			if (v[gad].loadComplete) {
			} else {
				allComplete = false;
				break;
			}
			if (allComplete) {
				v.loadComplete = true; cb();
			}
		}
	}
	for (const gad of gads) {
		const g = this[gad];
		g.tempValue = g.defaultValue;
		function finishInit(cb, v, g) {
			g.state = g.tempValue? true: false;
			{ // For the GUI.
				v.setRenderFlag(true);
			} { // For the app function.
				if (g.appFunction) g.appFunction();
			} { // For persistence.
			}
			if (debuglog) console.log(`${g.key} ready`, g.state);
			v.loadComplete = true; icb(cb, v);
		}
		if (debuglog) console.log("requesting", `${getCurrentAccount().id}-${g.key}`)
    PlatformUtil.DatabaseGet('settings', `${getCurrentAccount().id}-${g.key}`, (event) => {
			g.tempValue = event.target.result
			if (debuglog) console.log(`${g.key} restored`, g.tempValue)
			finishInit(cb, this, g)
		}, (event) => {
			console.log(`error getting ${g.key}`, event)
			finishInit(cb, this, g)
		})
	}
}
