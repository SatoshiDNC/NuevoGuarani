/* Convenience API to wrap the browser-internal barcode scanner function.
 *
 * Description:
 *
 *   This encapsulation handles creation of the barcode scanner object and the video
 *   element and all of the necessary wiring, so that all the user has to do is
 *   supply the barcode handler and say when to begin/end scanning.
 *
 * Usage:
 *
 *   s = BarcodeScanner.beginSession( barcode => console.log(barcode.rawValue) );
 *
 *   BarcodeScanner.endSession(s);
 *
 * Optional:
 *
 *   if (BarcodeScanner.present) ... // checks browser support
 *
 *   if (BarcodeScanner.active) ... // checks for active session(s)
 *
 */

var BarcodeScanner = (function() {

	var mBarcodeDetector = undefined;
	var mVideo = undefined;
	var mCameraId = '';

	const sessions = []; var sessionCounter = 0;

	function present() { return !!("BarcodeDetector" in window); }
	function videoElement() { return mVideo; }

	var init = false;
	var scanning = false;
	var detectorReady = false;
	var streamReady = false;
	function checkReadiness() {
		if (detectorReady && streamReady) {
			scanning = true;
			setTimeout(barcodeScannerFunc, 100);
		}
	}

	function barcodeScannerFunc() {
		mBarcodeDetector
			.detect(mVideo)
			.then((barcodes) => {
				barcodes.forEach((barcode) => {
					for (const s of sessions) {
						if (barcode.rawValue == s.lastScan && Date.now() - s.lastScanTime < 2000)
							continue;
						s.lastScan = barcode.rawValue;
						s.lastScanTime = Date.now();
						s.callback(barcode);
					}
				});
			})
			.catch(e => console.log(e));
		if (sessions.length > 0)
			setTimeout(barcodeScannerFunc, 100);
		else
			scanning = false;
	}

	function beginSession(callback) {
		if (!present()) return 0;
    PlatformUtil.RequestCamera();
		if (sessions.length == 0) {
			if (!init) {
				init = true;
				BarcodeDetector.getSupportedFormats().then(f => {
					mBarcodeDetector = new BarcodeDetector({
						formats: ['upc_a', 'qr_code', 'ean_13'],
					});
					detectorReady = true;
					checkReadiness();
				});
				mVideo = document.createElement('video');
				mVideo.style.display = 'none';
				document.body.appendChild(mVideo);
				mVideo.addEventListener("loadedmetadata", () => {
					mVideo.play();
					streamReady = true;
					checkReadiness();
				});
			}
			let mediaDevices = navigator.mediaDevices;
			var constraints;
			if (mCameraId != '') constraints = {
				video: { deviceId: { exact: mCameraId } },
				audio: false,
			}; else constraints = {
				video: { facingMode: 'environment' },
				audio: false,
			};
			mediaDevices.getUserMedia(constraints)
			.then((stream) => {
				mVideo.srcObject = stream;
			})
			.catch(e => console.log(e));
		}
		sessionCounter += 1;
		var s = {
			id: sessionCounter,
			callback: callback,
			lastScan: '', lastScanTime: 0,
		};
		sessions.push(s);
		return s.id;
	}

	function endSession(id) {
		if (!present()) return;
		for (var i=0; i<sessions.length; i++) {
			if (sessions[i].id == id) {
				sessions.splice(i, 1);
				break;
			}
		}
		if (sessions.length == 0) {
			if (mVideo.srcObject) {
				mVideo.srcObject.getTracks().forEach(function(track) {
					track.stop();
				});
			}
			streamReady = false;
		}
	}

	return {
		get present() { return present(); },
		get active() { return sessions.length > 0; },
		set cameraId(id) { mCameraId = id; },
		beginSession: beginSession,
		endSession: endSession,
	};
})();
