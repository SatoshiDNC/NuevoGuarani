/*
 * This base class is the "source of truth" for the app's internal wallet interface.
 * Various wallet APIs are supported under derived classes.
 */
class BaseWallet {
	constructor(settings) {
    this.settings = settings
  }

  get type() {
    return wallettypes[this.settings.typelist.index]
  }

  /* query for current exchange rate */
	getConversionRate(amt, from, to, callback) {
    console.log(`WARNING: '${this.constructor.name}' of type '${this.type}' does not support getConversionRate(${amt}, ${from}, ${to}, ...)`)
    setTimeout(() => callback(0), 500)
	}

  /* bolt11 invoice generation */
	generateInvoice(sats, invoiceCallback) {
    console.log(`WARNING: '${this.constructor.name}' of type '${this.type}' does not support generateInvoice(${sats}, ...)`)
    setTimeout(() => invoiceCallback(), 500)
	}

  /* bolt11 invoice follow-up */
	checkInvoice(checkingId, callback) {
    console.log(`WARNING: '${this.constructor.name}' of type '${this.type}' does not support checkInvoice(${checkingId}, ...)`)
    setTimeout(() => callback({ detail: "Wallet not configured correctly." }), 500)
	}

  /* decoding of a bolt11 invoice */
	readInvoice(invoice, callback) {
    console.log(`WARNING: '${this.constructor.name}' of type '${this.type}' does not fully support readInvoice(${invoice}, ...)`)
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
				setTimeout(() => callback(sats, temp), 500)
			} else {
				setTimeout(() => callback(msats, temp), 500)
			}
		}
		asyncLogic();
		console.groupEnd();
	}

  /* payment of a bolt11 invoice */
	payInvoice(invoice, callback) {
    console.log(`WARNING: '${this.constructor.name}' of type '${this.type}' does not support payInvoice(${invoice}, ...)`)
		setTimeout(() => callback(false), 500)
	}

  /* LNURLw generation for one-time withdrawal of a defined amount */
  generateWithdrawalLink(sats, comment, withdrawalLinkCallback) {
    console.log(`WARNING: '${this.constructor.name}' of type '${this.type}' does not support generateWithdrawalLink(${sats}, ${comment}, ...)`)
		setTimeout(() => withdrawalLinkCallback(), 500)
  }

  /* LNURLw follow-up */
  checkWithdrawalLink(linkId, withdrawalLinkCallback) {
    console.log(`WARNING: '${this.constructor.name}' of type '${this.type}' does not support checkWithdrawalLink(${linkId}, ...)`)
    setTimeout(() => withdrawalLinkCallback({ detail: "Wallet not configured correctly." }), 500)
  }

}