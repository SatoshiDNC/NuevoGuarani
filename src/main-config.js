	const GENERIC = 0;
	const PARAGUAY = 1;
	var style = PARAGUAY;

	const enabledLangs = ['en-US', 'es-PY', 'de-DE'];
	var lcode;
	const supportedCurrencies = ['₿','₲','$','€'];
	{
		let urlParams = new URLSearchParams(window.location.search);
		let lang = urlParams.get('lang');
//		if (!lang) lang = 'en-US';
		if (!lang) lang = '';
		if (enabledLangs.includes(lang)) lcode = lang;
		//if (lang == 'es-PY') supportedCurrencies.splice(0,4,'₲'/*,'₿'*//*,'$','€'*/);
		//if (lang.startsWith('de')) supportedCurrencies.splice(0,4,'€'/*,'₿'*//*,'₲','$'*/);
		//if (lang == 'en-US') supportedCurrencies.splice(0,4,'$'/*,'₿'*//*,'₲','€'*/);
	}

	const enabledCustomerLangs = ['gn-PY', 'es-PY', 'en-US', 'de-DE'];
	var defaultCustomerLang = 'es-PY';

//	const enabledVendorCurrencies = ['₿','₲','$','€'];
//	var defaultVendorCurrency = '₲';

	const enabledCustomerCurrencies = ['₿','₲','$','€'];
	var defaultCustomerCurrency = '₲';

	const enabledPaymentMethods = ['₿','₲','$','€'];

	const enabledCashbackOptions = {
		'₿': ['₲','$','€'],
		'₲': ['₿','$','€'],
		'$': ['₿','₲','€'],
		'€': ['₿','₲','$'],
	};

	// var vendorColors = new DefaultDarkTheme();
	var customerColors = new DefaultLightTheme();

	// Randomly produce a random configuration for testing.
	if (!releasebuild && Math.random() > 0.5) {

		style = Math.round(Math.random() * 1);

		lcode = Math.random() > 0.5?
			(Math.random() > 0.5?'gn-PY':'es-PY'):
			(Math.random() > 0.5?'en-US':'de-DE');

		for (var i=enabledCustomerLangs.length-1; i>=0; i--)
			if (Math.random() > 0.5) enabledCustomerLangs.splice(i,1);
		if (enabledCustomerLangs.length == 0) enabledCustomerLangs.push('es-PY');
		defaultCustomerLang = enabledCustomerLangs[
			Math.floor(enabledCustomerLangs.length * Math.random())];

/*
		for (var i=enabledVendorCurrencies.length-1; i>=0; i--)
			if (Math.random() > 0.5) enabledVendorCurrencies.splice(i,1);
		if (enabledVendorCurrencies.length == 0) enabledVendorCurrencies.push('₲');
		defaultVendorCurrency = enabledVendorCurrencies[
			Math.floor(enabledVendorCurrencies.length * Math.random())];
*/

		for (var i=enabledPaymentMethods.length-1; i>=0; i--)
			if (Math.random() > 0.5) enabledPaymentMethods.splice(i,1);
		if (enabledPaymentMethods.length == 0) enabledPaymentMethods.push('₲');

		for (var i=enabledCustomerCurrencies.length-1; i>=0; i--)
			if (Math.random() > 0.5) enabledCustomerCurrencies.splice(i,1);
		if (enabledCustomerCurrencies.length == 0) enabledCustomerCurrencies.push('₲');
		defaultCustomerCurrency = enabledCustomerCurrencies[
			Math.floor(enabledCustomerCurrencies.length * Math.random())];

		// vendorColors = Math.random() > 0.5? new DefaultLightTheme() : new DefaultDarkTheme();
		customerColors = Math.random() > 0.5? new DefaultLightTheme() : new DefaultDarkTheme();
	}

	// DEMO MODES
/*
	if (0) { // English demo for Paraguay usage.
		style = PARAGUAY; lcode = 'en-US';
		enabledCustomerLangs.splice(0,4,'en-US','es-PY');
		defaultCustomerLang = 'en-US';
//		enabledVendorCurrencies.splice(0,4,'₿','₲');
		enabledCustomerCurrencies.splice(0,4,'₿','₲');
		enabledPaymentMethods.splice(0,4,'₲','₿');
		enabledCashbackOptions['₲'].splice(0,4);
		enabledCashbackOptions['₿'].splice(0,4,'₲');
//		defaultVendorCurrency = '₲';
		defaultCustomerCurrency = '₲';
		// vendorColors = new DefaultDarkTheme();
		customerColors = new DefaultLightTheme();
	}
	if (0) { // Spanish demo for Paraguay usage.
		style = PARAGUAY; lcode = 'es-PY';
		enabledCustomerLangs.splice(0,4,'en-US','es-PY');
		defaultCustomerLang = 'es-PY';
//		enabledVendorCurrencies.splice(0,4,'₿','₲');
		enabledCustomerCurrencies.splice(0,4,'₿','₲');
		enabledPaymentMethods.splice(0,4,'₲','₿');
		enabledCashbackOptions['₲'].splice(0,4);
		enabledCashbackOptions['₿'].splice(0,4,'₲');
//		defaultVendorCurrency = '₲';
		defaultCustomerCurrency = '₲';
		// vendorColors = new DefaultDarkTheme();
		customerColors = new DefaultLightTheme();
	}
	if (0) { // EUR
		style = GENERIC; lcode = 'en-US';
//		enabledVendorCurrencies.splice(0,4,'₿','€');
		enabledCustomerCurrencies.splice(0,4,'₿','€');
//		defaultVendorCurrency = '€';
		defaultCustomerCurrency = '€';
	}
	if (0) { // USD
		style = GENERIC; lcode = 'en-US';
//		enabledVendorCurrencies.splice(0,4,'$');
		enabledCustomerCurrencies.splice(0,4,'$');
//		defaultVendorCurrency = '$';
		defaultCustomerCurrency = '$';
	}
*/
	const conversionRates = {};
	conversionRates['₿'] = {
		'₿': 1.0, // calculated in sats
		'₲': 2.0, // 1.5 + Math.random(),
		'$': 1/(40 + 10 * Math.random()), // calculated in cents
		'€': 1/(45 + 10 * Math.random()), // calculated in cents
	};
	for (var i=1; i<Object.keys(conversionRates['₿']).length; i++) {
		var cur = Object.keys(conversionRates['₿'])[i];
		conversionRates[cur] = {
			'₿': 1/conversionRates['₿'][cur],
			'₲': 1/conversionRates['₿'][cur] * conversionRates['₿']['₲'],
			'$': 1/conversionRates['₿'][cur] * conversionRates['₿']['$'],
			'€': 1/conversionRates['₿'][cur] * conversionRates['₿']['€'],
		};
	}

	function toFiat(s) {
		return style == PARAGUAY? s * 2: s / 3600;
	}

	const config = new Configuration();
