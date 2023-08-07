class Wallet {
	constructor() {}

	getConversionRate(amt, from, to, callback) {
		console.groupCollapsed(this.constructor.name+'.getConversionRate(',amt,from,to,'...)');

		if (from == to) { callback(1); return; }

		const asyncLogic = async () => {
			let myJson = '';
			let amt_ = amt/(config.hasCents(from)?100:1);
			let from_ = from;
			let to_ = to;

			myJson = {};
			myJson[from_] = amt;
			myJson[to_] = amt * (Math.random()*1.5 + 0.5); // TODO configure what value to put here

			let convRate = 0;
			if (myJson && myJson[from_] && myJson[to_]) {
				convRate = (myJson[to_] * (config.hasCents(to)?100:1)) / (myJson[from_] * (config.hasCents(from)?100:1));
			}
			callback(convRate);
		}
		asyncLogic();

		console.groupEnd();
	}

	generateInvoice(sats, invoiceCallback) {
		console.groupCollapsed(this.constructor.name+'.generateInvoice(',sats,'...)');

		total_sat = sats;
		if (total_sat <= 0 || total_sat != (+total_sat).toString()) {
			console.error('Amount sanity check failed:', total_sat);
			vp.beep('bad');
			return;
		}

		console.log('wallet not configured to generate invoice');
		invoiceCallback();

		console.groupEnd();
	}

	checkInvoice(checkingId, callback) {
		console.groupCollapsed(this.constructor.name+'.checkInvoice(',checkingId,'...)');

		console.log('wallet not configured to generate invoice');
		let json = '';

		json = { detail: "Payment does not exist." };

		json = { paid: false, preimage: "0000000000000000000000000000000000000000000000000000000000000000", details: { bolt11: "lnbc110n1pjv99kzsp57pjaz7d4pcyq44mqu39tk47jxw78fz3dp0dfefer76v5na3jnj8qpp5xxvattfa4dtgqdzea35lc8cf82qlgdnx8ps0txvs5wx5s20mhppsdqjd4ujqcn4wd5kuetnwvxqzjccqpjrzjq027t9tsc6jn5ve2k6gnn689unn8h239juuf9s3ce09aty6ed73t5z7nqsqqsygqqyqqqqqqqqqqztqq9q9qxpqysgqq58tj820ddffdc4fk82flnl3gj9sjhdt5gd57lgsl0kc40nqe4an50lq9w6p9ly5pmz0n69d9a40qdsmlae8f4scz2lg79zwrq867tspdd8rjz", checking_id: "3199d5ad3dab56803459ec69fc1f093a81f436663860f59990a38d4829fbb843", expiry: 1690474778, extra: {}, fee: 0, memo: "my business", payment_hash: "3199d5ad3dab56803459ec69fc1f093a81f436663860f59990a38d4829fbb843", pending: true, preimage: "0000000000000000000000000000000000000000000000000000000000000000", time: 1690474178, wallet_id: "0c2a142d0edf428e8a7d3379613fc424", webhook: null, webhook_status: null, } };

		json = { paid: (Math.random()>0.5)?true:false, preimage: "0000000000000000000000000000000000000000000000000000000000000000", details: { bolt11: "lnbc110n1pjv99kzsp57pjaz7d4pcyq44mqu39tk47jxw78fz3dp0dfefer76v5na3jnj8qpp5xxvattfa4dtgqdzea35lc8cf82qlgdnx8ps0txvs5wx5s20mhppsdqjd4ujqcn4wd5kuetnwvxqzjccqpjrzjq027t9tsc6jn5ve2k6gnn689unn8h239juuf9s3ce09aty6ed73t5z7nqsqqsygqqyqqqqqqqqqqztqq9q9qxpqysgqq58tj820ddffdc4fk82flnl3gj9sjhdt5gd57lgsl0kc40nqe4an50lq9w6p9ly5pmz0n69d9a40qdsmlae8f4scz2lg79zwrq867tspdd8rjz", checking_id: "3199d5ad3dab56803459ec69fc1f093a81f436663860f59990a38d4829fbb843", expiry: 1690474778, extra: {}, fee: 0, memo: "my business", payment_hash: "3199d5ad3dab56803459ec69fc1f093a81f436663860f59990a38d4829fbb843", pending: true, preimage: "0000000000000000000000000000000000000000000000000000000000000000", time: 1690474178, wallet_id: "0c2a142d0edf428e8a7d3379613fc424", webhook: null, webhook_status: null, } };

		console.log('faked json', json);
		callback(json);

		console.groupEnd();
	}

	readInvoice(invoice, callback) {
		console.groupCollapsed(this.constructor.name+'.readInvoice(',invoice.substr(0,20),'..., ...)');
		const asyncLogic = async () => {
			const desc = 'lightning invoice';
			var msats = 'some';
			var temp = invoice.substr(4,20);
			var digs = '';
			while (temp != '' && "0123456789".includes(temp.substr(0,1))) {
				digs = digs + temp.substr(0,1);
				temp = temp.substr(1);
			}
			if (digs != '' && temp != '') {
				var n = +digs;
				switch (temp.substr(0,1).toLowerCase()) {
				case 'm': msats = Math.round(n*(0.001*100000000*1000)); break;
				case 'u': msats = Math.round(n*(0.000001*100000000*1000)); break;
				case 'n': msats = Math.round(n*(0.000000001*100000000*1000)); break;
				case 'p': msats = Math.round(n*(0.000000000001*100000000*1000)); break;
				default:
				}
			}
			const sats = Math.round(msats/1000);

			var temp = tr('pay {AMNT} sats for {DESC}');
			temp = temp.replace('{AMNT}', isNumber(msats)? Math.round(msats/1000).toString(): tr(msats) );
			temp = temp.replace('{DESC}', tr(desc));
			temp = icap(temp);

			if (isNumber(msats)) {
				callback(sats, temp);
			} else {
				callback(msats, temp);
			}
		}
		asyncLogic();
		console.groupEnd();
	}

	payInvoice(invoice, callback) {
		console.groupCollapsed(this.constructor.name+'.payInvoice(',invoice.substr(0,20),'..., ...)');
		console.log('wallet not configured to pay invoice');
		callback(false);
		console.groupEnd();
	}

}