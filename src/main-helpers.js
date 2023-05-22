// Helpers
function centerText(x,y,w,h,s,c,m0,m1) {
	var tw = defaultFont.calcWidth(s);
	defaultFont.draw(x+(w-tw)/2,y+14+(h-16)/2,s,c,m0,m1);
}
var fullscreen = (function() {
	var element = document.body;
	element.requestFullscreen =
		element.requestFullscreen ||
		element.requestFullScreen ||
		element.webkitRequestFullScreen ||
		element.mozRequestFullScreen ||
		function() { return false; };
	document.cancelFullScreen =
		document.cancelFullScreen ||
		document.webkitCancelFullScreen ||
		document.mozCancelFullScreen ||
		function() { return false; };
	function active() {
		return document.webkitIsFullScreen || document.mozFullScreen || false;
	}
	function toggle() {
		if (active()) document.cancelFullScreen(); else element.requestFullscreen();
	}
	function enter() {
		if (!active()) element.requestFullscreen();
	}
	function exit() {
		if (active()) document.cancelFullScreen();
	}
	return {
		active: active,
		toggle: toggle,
		enter: enter,
		exit: exit,
	};
})();

