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
}
