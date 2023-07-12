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

function tryParseJSONObject(jsonString) {
                        try {
                                var o = JSON.parse(jsonString);
                                if (o && typeof o === "object") {
                                        return o;
                                }
                        }
                        catch (e) { }
                        return false;
                }

// Scales color value to range delimited by b and c.
// Returns a new color that is to b and c what the input color is to black and white.
// All parameters are color vectors.
// The order of b and c generally does not matter.
function colorize(color,b,c) {
	var d = b, e = c; if (b[0]>c[0] && b[1]>c[1] && b[2]>c[2]) { d = c; e = b; }
	function f(a,b,c) { return a*(c-b)+b; }
	return [f(color[0],d[0],e[0]), f(color[1],d[1],e[1]), f(color[2],d[2],e[2]), color[3]];
}

var isNumber = function isNumber(value) 
{
   return typeof value === 'number' && isFinite(value);
}

function cconv(a, f, t) {
	return Math.ceil(a * cconv.prototype.conv[f][t] );
}
function setConversionRates() {
	cconv.prototype.conv = JSON.parse(JSON.stringify(conversionRates));
}
