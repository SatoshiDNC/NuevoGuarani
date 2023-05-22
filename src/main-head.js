function main() {
	const canvas = document.querySelector('#app1');
	vp.initialize(canvas,
		document.getElementById('kb'),
		document.getElementById('numpad'),
		document.getElementById('next'),
		document.getElementById('prev'),
	);
	const gl = vp.getContext();

	df.glSet(gl);
	defaultFont.init();
	iconFont.init();

  clickTapActive = ['begin-click','recover-click','begin-tap'];

	var v, g;
