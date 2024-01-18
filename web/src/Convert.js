class Convert {
  constructor() {
    throw new Error()
  }
  static currencies = [
    { app: '₿', LNbits: 'BTC' },
    { app: '₲', LNbits: 'PYG' },
    { app: '$', LNbits: 'USD' },
    { app: '€', LNbits: 'EUR' },
  ]
  static LNbitsCurrencyToAppCurrency(input) {
    for (const c of Convert.currencies) {
      if (c.LNbits == input) return c.app
    }
  }
  static AppCurrencyToLNbitsCurrency(input) {
    for (const c of Convert.currencies) {
      if (c.app == input) return c.LNbits
    }
  }

  static MoneyNumberForDisplay(number, currency) {
    let s = ''+number
    let negate = false; if (s.startsWith('-')) { negate = true; s = s.substr(1); }
    const c = tr(',');
    let t = '';
  
    // If this currency has cents, set it aside.
    let currencyHasCents = config.hasCents(currency);
    let cents = '00';
    if (currencyHasCents) {
      while (s.length < 3) s = '0'+s;
      cents = s.substr(s.length-2, s.length);
      s = s.substr(0, s.length-2);
    }
  
    // Add thousands separator.
    for (let i=0; i<s.length; i++) {
      t = s.substring(s.length-1-i,s.length-i) + t;
      if ((i+1)%3==0) t = c + t;
    }
    if (t.startsWith(c)) t = t.substr(1);
  
    // If this currency has cents, put it back.
    if (currencyHasCents) {
      t = t+this.toSuper(cents);
    }
  
    return (negate? '-': '') + t;
  }
  static MoneySymbolAndNumberForDisplay(number, currency) {
    return currency + ' ' + Convert.MoneyNumberForDisplay(number, currency)
  }

  static EAN13ToPrice(input) {
    // verify length
    if (input.length !== 13) return
    // verify format is in-house price
    if (!input.startsWith('2')) return
    // verify checksum
    var a = 0;
    for (var i = 1; i < 13; i++) {
      a += (+input.substring(i - 1, i)) * (((i % 2) == 1)? 1 : 3)
    }
    if ((+input.substring(12, 13)) !== (10 - (a % 10))) return
    // extract in-house price
    return (+input.substring(7, 12))
  }

  static JSONToString(obj) {
    var cache = []
    return JSON.stringify(obj, (key, value) => {
      if (typeof value === 'object' && value !== null) {
        if (cache.includes(value)) return
        cache.push(value)
      }
      return value
    }, '· ')
  }

  static EscapeJSON(string) {
    return string.replace(/[\n"\&\r\t\b\f]/g, '\\$&')
  }

  static StringToHashCode(str) {
    let hash = 0;
    for (let i = 0, len = str.length; i < len; i++) {
        let chr = str.charCodeAt(i);
        hash = (hash << 5) - hash + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
  }

  static ArrayBufferToHex(buffer) {
    return [...new Uint8Array(buffer)]
      .map(x => x.toString(16).padStart(2, '0'))
      .join('')
  }

  static MaskIfGadgetIsSensistive(g, value) {
    return ['-sensitive-', '-secret-'].reduce((acc, val) => acc || g.key.includes(val), false)? '********': value
  }
}
