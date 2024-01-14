class LNbitsWallet extends BaseWallet {
	constructor(settings) {
		super(settings)
	}

  get url() {
    return this.settings.lnbitsurl.value
  }
  get key() {
    return this.settings.lnbitskey.value
  }

	getConversionRate(amt, from, to, callback) {
		console.groupCollapsed(this.constructor.name+'.getConversionRate(',amt,from,to,'...)');

		if (from == to) { callback(1); return; }

    const wallet = this
		const asyncLogic = async () => {
			let json = '';
			let amt_ = amt/(config.hasCents(from)?100:1);
			let from_ = Convert.AppCurrencyToLNbitsCurrency(from);
			let to_ = Convert.AppCurrencyToLNbitsCurrency(to);
			console.log('getting quote for',amt_,from_,'to',to_,'live =',!config.debugBuild);
			if (!config.debugBuild) {
				let body = `{
          "from_": "${from_}",
          "amount": ${amt_},
          "to": "${to_}"
        }`;
				console.log('request body', body);
				//const response = await fetch('https://lnbits.satoshibox.io/api/v1'+'/conversion', {
        const response = await fetch(wallet.url+'/conversion', {
          method: 'POST',
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json',
						'X-API-KEY': wallet.key,
					},
					body: body,
				});
				json = await response.json(); //extract JSON from the http response
			} else {
				console.log('debug build; picking random conversion rate');
				json = {};
				json[(from_=='sat')?'sats':from_] = amt;
				json[(to_=='sat')?'sats':to_] = amt * (Math.random()*1.5 + 0.5);
			}
			console.log(JSON.stringify(json));

			if (from_ == 'BTC') from_ = 'sats';
			if (to_ == 'BTC') to_ = 'sats';

			let convRate = 0;
			if (json && json[from_] && json[to_]) {
				convRate = (json[to_] * (config.hasCents(to)?100:1)) / (json[from_] * (config.hasCents(from)?100:1));
			}
			console.log('rate', convRate);
			callback(convRate);
		}
		asyncLogic();

		console.groupEnd();
	}

	generateInvoice(sats, invoiceCallback) {
		console.groupCollapsed(this.constructor.name+'.generateInvoice(',sats,'...)');

		var total_sat = sats;
		if (total_sat <= 0 || total_sat != (+total_sat).toString()) {
			console.error('Amount sanity check failed:', total_sat);
			vp.beep('bad');
			return;
		}

    const wallet = this
		const asyncLogic = async () => {
			let json = '';
			console.log('generating invoice for',total_sat,'sats','live =',!config.debugBuild);
			if (!config.debugBuild) {
				const response = await fetch(wallet.url+'/payments', {
					method: 'POST',
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json',
						'X-API-KEY': wallet.key,
					},
					body: `{
            "out": false,
            "amount": `+ total_sat +`,
            "memo": "`+ config.businessName +`",
            "unit": "sat"
          }`,
				});
				json = await response.json(); //extract JSON from the http response
			} else {
				console.log('debug build; generating fake');
				json = { payment_hash: "a37ea5ff05f41891262720e0567e9442f9463c6d12c59ded5cfca8a406c50522", payment_request: "lnbc1230n1pj2kj8esp5z8aqqsaxmghudpe79zgr48squm5x58uneapj8qh3csfynhjjz06qpp55dl2tlc97svfzf38yrs9vl55gtu5v0rdztzemm2ulj52gpk9q53qdqjd4ujqcn4wd5kuetnwvxqzjccqpjrzjqgp7tvtwh6rmpz0j9cv82tcl0fn2r00h0pualrgun6xeztdlhxltgzm59cqq8zcqqyqqqqlgqqqqn3qqvs9qyysgqv0tg90xhcddfk2w2s9pd0c9jrm9znvxujn5w8kunlzcp74yfrqjpnkc9pfqzqjemsrmn4s2lupyfkmhwn3eu58lvl3vfckvyrugv77cqyutv6g", checking_id: "a37ea5ff05f41891262720e0567e9442f9463c6d12c59ded5cfca8a406c50522", lnurl_response: null };
			}

			//console.log('json', json);
			const invoiceString = json["payment_request"];
			const checkingId = json["checking_id"];
			console.log('invoiceString', invoiceString);
			console.log('checkingId', checkingId);
			if (invoiceString && invoiceString.startsWith('lnbc') && checkingId) {
				invoiceCallback(invoiceString, checkingId);
			} else {
				invoiceCallback();
			}
		}
		asyncLogic();

		console.groupEnd();
	}

	checkInvoice(checkingId, callback) {
		console.groupCollapsed(this.constructor.name+'.checkInvoice(',checkingId,'...)');

    const wallet = this
		const asyncLogic = async () => {
			let json = '';
			if (!config.debugBuild) {
				const response = await fetch(wallet.url+'/payments/'+checkingId, {
					method: 'GET',
					headers: {
						'Accept': 'application/json',
						'X-API-KEY': wallet.key,
					},
				});
				json = await response.json();
			} else {
				console.log('debug build; faking response');
				json = { detail: "Payment does not exist." };
				json = { paid: false, preimage: "0000000000000000000000000000000000000000000000000000000000000000", details: { bolt11: "lnbc110n1pjv99kzsp57pjaz7d4pcyq44mqu39tk47jxw78fz3dp0dfefer76v5na3jnj8qpp5xxvattfa4dtgqdzea35lc8cf82qlgdnx8ps0txvs5wx5s20mhppsdqjd4ujqcn4wd5kuetnwvxqzjccqpjrzjq027t9tsc6jn5ve2k6gnn689unn8h239juuf9s3ce09aty6ed73t5z7nqsqqsygqqyqqqqqqqqqqztqq9q9qxpqysgqq58tj820ddffdc4fk82flnl3gj9sjhdt5gd57lgsl0kc40nqe4an50lq9w6p9ly5pmz0n69d9a40qdsmlae8f4scz2lg79zwrq867tspdd8rjz", checking_id: "3199d5ad3dab56803459ec69fc1f093a81f436663860f59990a38d4829fbb843", expiry: 1690474778, extra: {}, fee: 0, memo: "my business", payment_hash: "3199d5ad3dab56803459ec69fc1f093a81f436663860f59990a38d4829fbb843", pending: true, preimage: "0000000000000000000000000000000000000000000000000000000000000000", time: 1690474178, wallet_id: "0c2a142d0edf428e8a7d3379613fc424", webhook: null, webhook_status: null, } };
				json = { paid: (Math.random()>0.5)?true:false, preimage: "0000000000000000000000000000000000000000000000000000000000000000", details: { bolt11: "lnbc110n1pjv99kzsp57pjaz7d4pcyq44mqu39tk47jxw78fz3dp0dfefer76v5na3jnj8qpp5xxvattfa4dtgqdzea35lc8cf82qlgdnx8ps0txvs5wx5s20mhppsdqjd4ujqcn4wd5kuetnwvxqzjccqpjrzjq027t9tsc6jn5ve2k6gnn689unn8h239juuf9s3ce09aty6ed73t5z7nqsqqsygqqyqqqqqqqqqqztqq9q9qxpqysgqq58tj820ddffdc4fk82flnl3gj9sjhdt5gd57lgsl0kc40nqe4an50lq9w6p9ly5pmz0n69d9a40qdsmlae8f4scz2lg79zwrq867tspdd8rjz", checking_id: "3199d5ad3dab56803459ec69fc1f093a81f436663860f59990a38d4829fbb843", expiry: 1690474778, extra: {}, fee: 0, memo: "my business", payment_hash: "3199d5ad3dab56803459ec69fc1f093a81f436663860f59990a38d4829fbb843", pending: true, preimage: "0000000000000000000000000000000000000000000000000000000000000000", time: 1690474178, wallet_id: "0c2a142d0edf428e8a7d3379613fc424", webhook: null, webhook_status: null, } };
			}

			console.log('json', json);
			callback(json);
		}
		asyncLogic();

		console.groupEnd();
	}

	readInvoice(invoice, callback) {
		console.groupCollapsed(this.constructor.name+'.readInvoice(',invoice.substr(0,20),'..., ...)');
    const wallet = this
		const asyncLogic = async () => {
			let json;
			if (!config.debugBuild) {
				const response = await fetch(wallet.url+'/payments/decode', {
					method: 'POST',
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json',
						'X-API-KEY': wallet.key,
					},
					body: `{"data": "`+ invoice +`"}`,
				});
				json = await response.json(); //extract JSON from the http response
			} else {
				console.log('debug build; faking response');
				json = { description: "some description", date: "some date", amount_msat: 321000 };
			}

			console.log('json', json);
			const desc = json.description;
			const date = json.date;
			const msats = json.amount_msat;
			const sats = Math.round(msats/1000);

			var temp = tr('pay {AMNT} sats for {DESC}');
			temp = temp.replace('{AMNT}', isNumber(msats)? Math.round(msats/1000).toString(): tr(msats) );
			temp = temp.replace('{DESC}', tr(desc));
			temp = icap(temp);

			callback(sats, temp);
		}
		asyncLogic();
		console.groupEnd();
	}

	payInvoice(invoice, callback) {
		console.groupCollapsed(this.constructor.name+'.payInvoice(',invoice.substr(0,20),'..., ...)');

    const wallet = this
		const asyncLogic = async () => {
			let json = '';
			console.log('paying invoice','live =',!config.debugBuild);
			if (!config.debugBuild) {
				const response = await fetch(wallet.url+'/payments', {
					method: 'POST',
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json',
						'X-API-KEY': wallet.key,
					},
					body: `{
            "out": true,
            "bolt11": "${invoice}"
          }`,
				});
				json = await response.json(); //extract JSON from the http response
			} else {
				console.log('debug build; faking payment');
				json = {
          "detail": "Internal invoice already paid."
        };
				json = {
          "payment_hash": "b5985cf1c88bef61d4c8d3178beec7a388191a4c9c6175fe17569d6a9865c17a",
          "checking_id": "b5985cf1c88bef61d4c8d3178beec7a388191a4c9c6175fe17569d6a9865c17a"
        };
			}

			console.log('json', json);
			const paymentHash = json["payment_hash"];
			const checkingId = json["checking_id"];
			if (paymentHash && checkingId) {
				callback(true);
			} else {
				callback(false);
			}
		}
		asyncLogic();

		console.groupEnd();
	}

  payLightningAddress(lnAddr, sats, comment, payLightningAddressCallback) {
		console.groupCollapsed(this.constructor.name+'.payLightningAddress(', lnAddr, sats, comment, '...)');

		var total_sat = sats
		if (total_sat <= 0 || total_sat != (+total_sat).toString()) {
			console.error('Amount sanity check failed:', total_sat)
			vp.beep('bad')
			return
		}

    const wallet = this
    const addr = lnAddr.split('@')
		const asyncLogic = async () => {
			let json = '';
			console.log('retrieving metadata for',addr[0]+'@'+addr[1],'live =',!config.debugBuild);
			if (!config.debugBuild) {
        const url = `https://${addr[1]}/.well-known/lnurlp/${addr[0]}`
        console.log(url)
				const response = await fetch(url, {
					method: 'GET',
					headers: {
						'Accept': 'application/json',
						'X-API-KEY': wallet.key,
					},
				})
				json = await response.json(); //extract JSON from the http response
			} else {
				console.log('debug build; generating fake')
				json = {
          error: "z",
        }
			}

			console.log('json', Convert.JSONToString(json))
			// const withdrawalLinkString = json.lnurl
			// const linkId = json.id
			// console.log('withdrawalLinkString', withdrawalLinkString)
			// console.log('uniqueHash', linkId)
			// if (withdrawalLinkString && withdrawalLinkString.toLowerCase().startsWith('lnurl') && linkId) {
			// 	withdrawalLinkCallback(withdrawalLinkString, linkId)
			// } else {
				withdrawalLinkCallback()
			// }
		}
		asyncLogic();

		console.groupEnd();
	}

	generateWithdrawalLink(sats, comment, withdrawalLinkCallback) {
		console.groupCollapsed(this.constructor.name+'.generateWithdrawalLink(', sats, comment, '...)');

		var total_sat = sats;
		if (total_sat <= 0 || total_sat != (+total_sat).toString()) {
			console.error('Amount sanity check failed:', total_sat);
			vp.beep('bad');
			return;
		}

    const wallet = this
		const asyncLogic = async () => {
			let json = '';
			console.log('generating withdrawal link for',total_sat,'sats','live =',!config.debugBuild);
			if (!config.debugBuild) {
        console.log(wallet.url+'/links');
				const response = await fetch(wallet.url+'/links', {
					method: 'POST',
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json',
						'X-API-KEY': wallet.key,
					},
					body: `{
            "title": "${comment.replaceAll("\"", "\\\"")}",
            "min_withdrawable": ${total_sat},
            "max_withdrawable": ${total_sat},
            "uses": 1,
            "wait_time": 1,
            "is_unique": true,
            "webhook_url": "https://satoshidnc.com/webhook",
            "webhook_headers": "{}",
            "webhook_body": "{}",
            "custom_url": "https://satoshidnc.com/custom"
          }`,
				});
				json = await response.json(); //extract JSON from the http response
			} else {
				console.log('debug build; generating fake');
				json = {
          id: "3mzuR4",
          wallet: "6e40959bed4c4a6ca3fc063c113fa9d1",
          title: "Order#234324",
          min_withdrawable: 25,
          max_withdrawable: 25,
          uses: 1,
          wait_time: 1,
          is_unique: true,
          unique_hash: "6F3iYbesaRR4KubJ9FuGxr",
          k1: "kSgzcvmVcoBV9GNhnu44AZ",
          open_time: 1704828390,
          used: 0,
          usescsv: "0",
          number: 0,
          webhook_url: "https://satoshidnc.com",
          webhook_headers: {},
          webhook_body: {},
          custom_url: "https://satoshidnc.com",
          lnurl: "LNURL1DP68GURN8GHJ7MRWVF5HGUEWWDSHGMMNDP5KGMNR9E3K7MF0WA5HG6RYWFSHWTMPWP5J7A339AKXUATJDSHNV33ND9VKYETNV9F9YDZTW43Y5W2XW4RHSU30F46X6AMEGCMNJAR4D4HHZ6ZJVVURSMJ9XFESYNPS63"
        };
			}

			console.log('json', Convert.JSONToString(json))
			const withdrawalLinkString = json.lnurl
			const linkId = json.id
			console.log('withdrawalLinkString', withdrawalLinkString)
			console.log('uniqueHash', linkId)
			if (withdrawalLinkString && withdrawalLinkString.toLowerCase().startsWith('lnurl') && linkId) {
				withdrawalLinkCallback(withdrawalLinkString, linkId)
			} else {
				withdrawalLinkCallback()
			}
		}
		asyncLogic();

		console.groupEnd();
	}

	checkWithdrawalLink(linkId, withdrawalLinkCallback) {
		console.groupCollapsed(this.constructor.name+'.checkWithdrawalLink(', linkId, '...)');
    const wallet = this
		const asyncLogic = async () => {
			let json = '';
			console.log('checking withdrawal link',linkId,'live =',!config.debugBuild);
			if (!config.debugBuild) {
        console.log(wallet.url+'/links/'+linkId);
				const response = await fetch(wallet.url+'/links/'+linkId, {
					method: 'GET',
					headers: {
						'Accept': 'application/json',
						'X-API-KEY': wallet.key,
					},
				});
				json = await response.json(); //extract JSON from the http response
			} else {
				console.log('debug build; generating fake');
				json = {
          id: "3mzuR4",
          wallet: "6e40959bed4c4a6ca3fc063c113fa9d1",
          title: "Order#234324",
          min_withdrawable: 25,
          max_withdrawable: 25,
          uses: 1,
          wait_time: 1,
          is_unique: true,
          unique_hash: "6F3iYbesaRR4KubJ9FuGxr",
          k1: "kSgzcvmVcoBV9GNhnu44AZ",
          open_time: 1704828390,
          used: 0,
          usescsv: "0",
          number: 0,
          webhook_url: "https://satoshidnc.com",
          webhook_headers: {},
          webhook_body: {},
          custom_url: "https://satoshidnc.com",
          lnurl: "LNURL1DP68GURN8GHJ7MRWVF5HGUEWWDSHGMMNDP5KGMNR9E3K7MF0WA5HG6RYWFSHWTMPWP5J7A339AKXUATJDSHNV33ND9VKYETNV9F9YDZTW43Y5W2XW4RHSU30F46X6AMEGCMNJAR4D4HHZ6ZJVVURSMJ9XFESYNPS63"
        };
			}

			console.log('json', Convert.JSONToString(json))
      withdrawalLinkCallback(json)
		}
		asyncLogic();

		console.groupEnd();
	}

}
