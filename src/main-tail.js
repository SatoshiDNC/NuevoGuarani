
  function checkOnlineOrders() {
    const asyncLogic = async () => {
      let stall, stallCurrency
      {
        console.log('checking for orders')
        const response = await fetch(config.stallKeys.url+'/stall/order/'+config.stallKeys.stall.id+'?api-key='+config.stallKeys.key, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });
        const json = await response.json()
        console.log(json)
        json.map(o => {
          const { id } = o
          var req = db.transaction(["nostrmarket-orders"], "readonly")
            .objectStore("nostrmarket-orders")
            .get(`${getCurrentAccount().id}-${id}`)
          req.onsuccess = (event) => {
            if (event.target.result === undefined) {
              console.log('new order:', o)

              {
                var currentState = 'saved'
                let subtotal = 0
                o.items.map(item => {
                  const unitprice = o.extra.products.filter(p => p.id === item.product_id)[0].price
                  const qty = item.quantity
                  subtotal += unitprice * qty
                })
                console.log(subtotal)
                const newOrder = {
                  nostrmarketId: id,
                  store: getCurrentAccount().id,
                  status: currentState,
                  date: new Date(),
                  "dataentry": {
                    textbox: '',
                    options: {},
                  },
                  currency: Convert.LNbitsCurrencyToAppCurrency(o.extra.currency),
                  items: o.items.map(item => {
                    return {
                      qty: +item.quantity,
                      unitprice: +o.extra.products.filter(p => p.id === item.product_id)[0].price,
                      currency: o.extra.currency,
                      options: { emoji: o.extra.products.filter(p => p.id === item.product_id)[0].name },
                    }
                  }),
                  subtotal: subtotal,
                  //amountTendered: receivepayment.cash.text,
                  //amountToReturn: returnchange.change.text,
                };
                // if (JSON.stringify(billpane.conversions) != '{}') {
                //   newItem.conversions = billpane.conversions
                // }
                // console.log('Saving', newOrder)
                const tx = db.transaction(["sales"], "readwrite")
                tx.onerror = (event) => { console.log("Save transaction failed.") }
                tx.oncomplete = (event) => { }
                const req = tx.objectStore("sales").add(newOrder)
                req.onerror = (event) => { console.log("Save request failed.") }
                req.onsuccess = (event) => { }
              }

              {
                var req = db.transaction(["nostrmarket-orders"], "readwrite")
                  .objectStore("nostrmarket-orders")
                  .add({ id }, `${getCurrentAccount().id}-${id}`)
                req.onerror = (event) => { console.log("DB write error.") }
                req.onsuccess = (event) => { }
              }
            }
          }
      
        })
      }
    }
    asyncLogic()
    setTimeout(checkOnlineOrders, 60000)
  }
  setTimeout(checkOnlineOrders, 6000)

  if (window.devicePixelRatio > 1) defaultFont.fidelity = Math.max(1, 4 - Math.floor(window.devicePixelRatio));

	vp.start(menudiv);
}
