const trs = {};
const supportedLangs = ['de-DE', 'en-US', 'es-PY', 'gn-PY'];
function tr(s, l = lcode) {
	if (!(s in trs)) {
		trs[s] = {'source': s};
		for (var supLang of supportedLangs) {
			if (typeof window['main'][supLang] === 'object'
			&& typeof window['main'][supLang][s] === 'string') {
				trs[s][supLang] = window['main'][supLang][s];
			}
		}
/*
		switch(s) {
		case 'about @':
			trs[s]['en-US'] = 'about @';
//			trs[s]['es-PY'] = 'circa de @';
			trs[s]['gn-PY'] = '@ rupi';
			trs[s]['de-DE'] = 'etwa @';
			break;
		case 'bill':
			trs[s]['en-US'] = 'INVOICE';
//			trs[s]['es-PY'] = 'FACTURA';
//			trs[s]['gn-PY'] = 'ÑEMUMBYREHAI';
			trs[s]['de-DE'] = 'RECHNUNG';
			break;
		case 'pay':
			trs[s]['en-US'] = 'PAYMENT';
			trs[s]['es-PY'] = 'PAGO';
			trs[s]['gn-PY'] = "HEPYME'Ẽ";
			trs[s]['de-DE'] = 'ZAHLUNG';
			break;
		case 'item':
			trs[s]['en-US'] = 'ITEM';
			trs[s]['es-PY'] = 'ARTÍCULO';
			trs[s]['gn-PY'] = "MBA'E";
			trs[s]['de-DE'] = 'ARTIKEL';
			break;
		case 'tax':
			trs[s]['en-US'] = 'TAX';
			trs[s]['es-PY'] = 'IVA';
			trs[s]['gn-PY'] = 'IVA';
			trs[s]['de-DE'] = 'STEUER';
			break;
		case 'currency':
			trs[s]['en-US'] = 'CURRENCY';
			trs[s]['es-PY'] = 'MONEDA';
			trs[s]['gn-PY'] = 'VIRU';
			trs[s]['de-DE'] = 'WÄHRUNG';
			break;
		case 'price':
			trs[s]['en-US'] = 'PRICE';
			trs[s]['es-PY'] = 'PRECIO';
			trs[s]['gn-PY'] = 'HEPYKUE';
			trs[s]['de-DE'] = 'PREIS';
			break;
		case 'qty':
			trs[s]['en-US'] = 'QTY';
			trs[s]['es-PY'] = 'CANT.'; // CANTIDAD
			trs[s]['gn-PY'] = 'HETAKUE';
			trs[s]['de-DE'] = 'QUANT.'; // QUANTITÄT
			break;
		case 'subtotal':
			trs[s]['en-US'] = 'SUBTOTAL';
			trs[s]['es-PY'] = 'IMPORTE TOTAL';
			trs[s]['gn-PY'] = 'OPAITE';
			trs[s]['de-DE'] = 'ZWISCHENSUMME';
			break;
		case 'language':
			trs[s]['en-US'] = 'LANGUAGE';
			trs[s]['es-PY'] = 'IDIOMA';
			trs[s]['gn-PY'] = "ÑE'Ẽ";
			trs[s]['de-DE'] = 'SPRACHE';
			break;
		case 'en-US':
			trs[s]['en-US'] = 'ENGLISH';
			trs[s]['es-PY'] = 'INGLÉS';
			trs[s]['gn-PY'] = "INGLÉS";
			trs[s]['de-DE'] = 'ENGLISCH';
			break;
		case 'es-PY':
			trs[s]['en-US'] = 'SPANISH';
			trs[s]['es-PY'] = 'ESPAÑOL';
			trs[s]['gn-PY'] = "ESPAÑOL";
			trs[s]['de-DE'] = 'SPANISCH';
			break;
		case 'gn-PY':
			trs[s]['en-US'] = 'GUARANÍ';
			trs[s]['es-PY'] = 'GUARANÍ';
			trs[s]['gn-PY'] = "GUARANÍ";
			trs[s]['de-DE'] = 'GUARANÍ';
			break;
		case 'de-DE':
			trs[s]['en-US'] = 'GERMAN';
			trs[s]['es-PY'] = 'ALEMÁN';
			trs[s]['gn-PY'] = "ALEMÁN";
			trs[s]['de-DE'] = 'DEUTSCH';
			break;
		case 'Customer Bill':
			trs[s]['en-US'] = 'CUSTOMER BILL';
			trs[s]['es-PY'] = 'FACTURA CLIENTE';
			trs[s]['gn-PY'] = 'FACTURA CLIENTE';
			trs[s]['de-DE'] = 'KUNDENRECHNUNG';
			break;
		case 'Discard this invoice?':
			trs[s]['en-US'] = 'Discard this invoice?';
			trs[s]['es-PY'] = '¿Descartar esta factura?';
			trs[s]['gn-PY'] = '¿Emboyke ko factura?';
			trs[s]['de-DE'] = 'Diese Rechnung verwerfen?';
			break;
		}
*/
		var missing = '';
		for (var supLang of supportedLangs) {
			if (!(supLang in trs[s])) missing += ', ' + supLang;
		}
		if(missing != '') {
			missing = missing.substring(2);
			console.log("WARNING: Translation(s) "+missing+" missing for", trs[s]);
		}
	}
	if (l in trs[s]) {
		return trs[s][l];
	} else {
		for(var v in trs[s]) {
			if(!trs[s].hasOwnProperty(v) || v == 'source') continue;
			console.log("WARNING: Using '"+v+"' instead of '"+l+"' for", trs[s]);
			return trs[s][v];
		}
		console.log("WARNING: No translations found for", trs[s]);
		return trs[s]['source'];
	}
}
