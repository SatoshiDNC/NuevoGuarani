// Shape data storage
const beg2 = {}, len2 = {}, typ2 = {}; var all2 = [], buf2;
const beg5 = {}, len5 = {}, typ5 = {}; var all5 = [], buf5;

// Helper function
function rgb(rgba) { return [rgba[0], rgba[1], rgba[2]]; }

// Shape building functions
function addShape2(name, typ, ...points) {
	beg2[name] = all2.length/2; typ2[name] = typ;
	all2.splice (all2.length, 0, ...points);
	len2[name] = all2.length/2 - beg2[name];
}
function addShape5(name, typ, ...points) {
	beg5[name] = all5.length/5; typ5[name] = typ;
	all5.splice (all5.length, 0, ...points);
	len5[name] = all5.length/5 - beg5[name];
}

// Shape definitions
addShape2('unitLine', gl.LINE_LOOP, 0,0, 1,1, );
addShape5('unitLine', gl.LINE_LOOP, 0,0,1,1,0, 1,1,0,1,0, );
addShape5('divLine', gl.LINE_STRIP, 0,0,0,0,0, 0.4,0.4,1,1,1, 0.6,0.6,1,1,1, 1,1,0,0,0, );
addShape5('divLineV', gl.TRIANGLE_STRIP,
	1,0.0,...rgb(vendorColors.uiBackground), 0,0.0,...rgb(vendorColors.uiBackground),
	1,0.4,...rgb(vendorColors.uiForeground), 0,0.4,...rgb(vendorColors.uiForeground),
	1,0.6,...rgb(vendorColors.uiForeground), 0,0.6,...rgb(vendorColors.uiForeground),
	1,1.0,...rgb(vendorColors.uiBackground), 0,1.0,...rgb(vendorColors.uiBackground), );
addShape5('divLineH', gl.TRIANGLE_STRIP,
	0.0,1,...rgb(vendorColors.uiBackground), 0.0,0,...rgb(vendorColors.uiBackground),
	0.4,1,...rgb(vendorColors.uiForeground), 0.4,0,...rgb(vendorColors.uiForeground),
	0.6,1,...rgb(vendorColors.uiForeground), 0.6,0,...rgb(vendorColors.uiForeground),
	1.0,1,...rgb(vendorColors.uiBackground), 1.0,0,...rgb(vendorColors.uiBackground), );
addShape2('rect', gl.TRIANGLE_STRIP,
	0.0,1, 0.0,0, 1.0,1, 1.0,0, );
addShape5('rect', gl.TRIANGLE_STRIP,
	0.0,1,1,1,1, 0.0,0,1,1,1, 1.0,1,1,1,1, 1.0,0,1,1,1, );
addShape5('vendorLedger', gl.TRIANGLE_STRIP,
	0.0,1,...rgb(vendorColors.uiLedger1), 0.0,0,...rgb(vendorColors.uiLedger2),
	1.0,1,...rgb(vendorColors.uiLedger1), 1.0,0,...rgb(vendorColors.uiLedger2), );
addShape5('customerLedger', gl.TRIANGLE_STRIP,
	0.0,1,...rgb(customerColors.uiLedger1), 0.0,0,...rgb(customerColors.uiLedger2),
	1.0,1,...rgb(customerColors.uiLedger1), 1.0,0,...rgb(customerColors.uiLedger2), );
addShape5('scrollUp', gl.TRIANGLE_FAN,
	0.5,0,0.75,0.75,0.75,
	0.0,1,0.25,0.25,0.25,
	0.4,1,1,1,1, 0.6,1,1,1,1,
	1.0,1,0.25,0.25,0.25, );
addShape5('scrollDn', gl.TRIANGLE_FAN,
	0.5,0,0.75,0.75,0.75,
	0.0,1,0.25,0.25,0.25,
	0.4,1,1,1,1, 0.6,1,1,1,1,
	1.0,1,0.25,0.25,0.25, );
var r = 0.2, w = 0.8, b = 0.3;
if (style != PARAGUAY) { r = 1; w = 1; b = 1; }
addShape5('hamburger', gl.TRIANGLES,
	0,0.0,1,r,r, 1,0.0,1,r,r, 0,0.2,1,r,r, 0,0.2,1,r,r, 1,0.0,1,r,r, 1,0.2,1,r,r,
	0,0.4,w,w,w, 1,0.4,w,w,w, 0,0.6,w,w,w, 0,0.6,w,w,w, 1,0.4,w,w,w, 1,0.6,w,w,w,
	0,0.8,b,b,1, 1,0.8,b,b,1, 0,1.0,b,b,1, 0,1.0,b,b,1, 1,0.8,b,b,1, 1,1.0,b,b,1,
);
addShape2('maximizer', gl.TRIANGLES,
	0,1, 0,0.6, 0.4,1,
	1,0, 1,0.4, 0.6,0,
	1,0.1, 0.1,1, 0,0.9,
	0,0.9, 0.9,0, 1,0.1,
);
