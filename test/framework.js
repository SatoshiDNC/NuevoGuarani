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
