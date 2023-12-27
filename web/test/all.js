function test(depth,show,desc,fn) {
	var p=0, f=0;
	try {
		const r = fn(depth+1,0);
		if (typeof r === 'object') {
			p += r.pass;
			f += r.fail;
		} else p += 1;
	} catch (error) {
		f += 1;
	}
	if (show) {
		var t = '', s = '•';
		if (p>0 && f>0) { t = p+'/'+(p+f)+' ('+Math.round(100*p/(p+f))+'%) passed'; s = '⚠️'; }
		else if (p>0) { t = p+' passed'; s = '✓ '; }
		else if (f>0) { t = f+' failed'; s = '❌ '; }
		if (t != '') t = ': '+t+'';
		console.log(' '.repeat(depth)+s+' '+desc+t);
	}
	if (show && f > 0) {
		try {
			fn(depth+1,1);
		} catch (error) {
			if (show) {
//				if (typeof error === 'object' && error.stack !== 'undefined') {
//					const { stack, ...err } = error;
//					console.log(err);
//				} else {
					console.groupCollapsed(error.toString());
					console.log(error);
					console.groupEnd();
//				}
			}
		}
	}
	return {pass:p, fail:f};
}
console.log();
test(0,1,'all tests',function(tfw_depth,tfw_show) { var tfw_pass=0, tfw_fail=0, tfw_passfail;
tfw_passfail = test(tfw_depth+1,tfw_show,'other',function(tfw_depth,tfw_show) { var tfw_pass=0, tfw_fail=0, tfw_passfail;
tfw_passfail = test(tfw_depth+1,tfw_show,'BarcodeScannerTest.js',function(tfw_depth,tfw_show) { var tfw_pass=0, tfw_fail=0, tfw_passfail;
var example = 'hello';
unitjs.string(example);
unitjs.assert(typeof example !== 'string');

if (tfw_pass + tfw_fail > 0) return {pass:tfw_pass, fail:tfw_fail}; }); tfw_pass += tfw_passfail.pass; tfw_fail += tfw_passfail.fail;
if (tfw_pass + tfw_fail > 0) return {pass:tfw_pass, fail:tfw_fail}; }); tfw_pass += tfw_passfail.pass; tfw_fail += tfw_passfail.fail;
tfw_passfail = test(tfw_depth+1,tfw_show,'barcode',function(tfw_depth,tfw_show) { var tfw_pass=0, tfw_fail=0, tfw_passfail;
tfw_passfail = test(tfw_depth+1,tfw_show,'BarcodeScannerTest.js',function(tfw_depth,tfw_show) { var tfw_pass=0, tfw_fail=0, tfw_passfail;
var example = 'hello';
unitjs.function(BarcodeScanner);
unitjs.assert(typeof example === 'string');

if (tfw_pass + tfw_fail > 0) return {pass:tfw_pass, fail:tfw_fail}; }); tfw_pass += tfw_passfail.pass; tfw_fail += tfw_passfail.fail;
if (tfw_pass + tfw_fail > 0) return {pass:tfw_pass, fail:tfw_fail}; }); tfw_pass += tfw_passfail.pass; tfw_fail += tfw_passfail.fail;
if (tfw_pass + tfw_fail > 0) return {pass:tfw_pass, fail:tfw_fail}; });
console.log();
