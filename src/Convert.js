class Convert {
  constructor() {
    if (Convert._instance) return Convert._instance
    Convert._instance = this

    this.currencies = [
      { app: '₿', LNbits: 'BTC' },
      { app: '₲', LNbits: 'PYG' },
      { app: '$', LNbits: 'USD' },
      { app: '€', LNbits: 'EUR' },
    ]
  }
  static LNbitsCurrencyToAppCurrency(input) {
    for (const c of Convert._instance.currencies) {
      if (c.LNbits == input) return c.app
    }
  }
  static AppCurrencyToLNbitsCurrency(input) {
    for (const c of Convert._instance.currencies) {
      if (c.app == input) return c.LNbits
    }
  }
}
