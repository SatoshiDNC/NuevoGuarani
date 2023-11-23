class Convert {
	constructor() {}
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
}
