

var checkoutpane = v = new vp.DividerView(null, 'a', 0.5, 0);
v.name = Object.keys({checkoutpane}).pop();
v.designSize = 640*400;
{
	let v = checkoutpane.textboxshim = new vp.SliceView(null, 'b', billpane.textbox.height);
	v.name = Object.keys({'checkoutpane_textboxshim':0}).pop();
	{
		let v = checkoutpane.subtotalshim = new vp.SliceView(null, 't', billpane.subtotal.height);
		v.name = Object.keys({'checkoutpane_subtotalshim':0}).pop();
		v.a = billpane.subtotal; billpane.subtotal.parent = v;
		v.b = billpane; billpane.parent = v;
	}
	v.a = billpane.textbox; billpane.textbox.parent = v;
	v.b = checkoutpane.subtotalshim; checkoutpane.subtotalshim.parent = v;
}
v.a = v.textboxshim; v.textboxshim.parent = v;
v.b = keypadpane; keypadpane.parent = v;
v.layoutBeginFunc = function() {
	const v = this;
	function setRatio(v,r) { // doesn't help
		if (r != v.ratio) {
			v.ratio = r;
			v.queueLayout();
		}
	}
	if (v.state != 'v' && v.sh > 2 * v.sw) {
		setRatio(v, 1 - v.sw/v.sh);
	} else {
		setRatio(v, 0.5);
	}
}
