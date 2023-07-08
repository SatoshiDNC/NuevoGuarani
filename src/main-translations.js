const trs = {};
const supportedLangs = ['de-DE', 'en-US', 'es-PY', 'gn-PY'];
function tr(s, l = lcode) {
	const enableWarnings = false;
	if (!(s in trs)) {
		trs[s] = {'source': s};
		for (var supLang of supportedLangs) {
			if (typeof lang_db[supLang] === 'object'
			&& typeof lang_db[supLang][s] === 'string') {
				trs[s][supLang] = lang_db[supLang][s];
			}
		}
		var missing = '';
		for (var supLang of supportedLangs) {
			if (!(supLang in trs[s])) missing += ', ' + supLang;
		}
		if(missing != '') {
			missing = missing.substring(2);
			if (enableWarnings) console.log("WARNING: Translation(s) "+missing+" missing for", trs[s]);
		}
	}
	if (l in trs[s]) {
		return trs[s][l];
	} else {
		for(var v in trs[s]) {
			if(!trs[s].hasOwnProperty(v) || v == 'source') continue;
			if (enableWarnings) console.log("WARNING: Using '"+v+"' instead of '"+l+"' for", trs[s]);
			return trs[s][v];
		}
		if (enableWarnings) console.log("WARNING: No translations found for", trs[s]);
		return trs[s]['source'];
	}
}

function icap(str) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}
function cap(str) {
	return str.toUpperCase();
}
function tcase(str) {
	return str.split(' ').map(function(word) {
		return word.replace(word[0], word[0].toUpperCase());
	}).join(' ');
}
