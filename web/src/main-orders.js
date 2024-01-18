let notificationState = []

const updateNotifications = () => {

  // Update the per-account notifications
  let grandSummary = []
  const totalNew = notificationState.length
  let aKey
  for (const a of accounts) {
    let uncountedOrders = 0
    let uncountedTotal = 0
    let uncountedCurrencies = []
    let summaries = notificationState.filter(n => n.accountId == a.id)
    const numNew = summaries.length
    if (summaries.length > 7) {
      while (summaries.length > 6) {
        let x = summaries.shift()
        console.log("iter", uncountedTotal, x.summaryAmount, Convert.JSONToString(x))
        uncountedTotal += x.summaryAmount
        const c = x.summaryCurrency
        if (!uncountedCurrencies.includes(c)) {
          uncountedCurrencies.push(c)
        }
        uncountedOrders++
      }
    }
    summaries.reverse()
    if (uncountedOrders > 0) {
      if (uncountedCurrencies.length == 1) {
        summaries.push({ summary: tr('...and @ more orders totaling @').replace('@', uncountedOrders).replace('@', Convert.MoneySymbolAndNumberForDisplay(+uncountedTotal, Convert.LNbitsCurrencyToAppCurrency(uncountedCurrencies[0]))) })
      } else {
        summaries.push({ summary: tr('...and @ more orders'.replace('@', uncountedOrders)) })
      }
    }
  
    aKey = ''+Convert.StringToHashCode(a.id + "_NEW_ORDERS")
    grandSummary.push((numNew == 1? icap(tr("new order")): icap(tr('@ new orders').replace('@', numNew))) + " · " + a.title)

    console.log('notify', numNew)
    PlatformUtil.notify(
      ''+Convert.StringToHashCode(a.id), a.title,
      ''+Convert.StringToHashCode(a.id + "_NEW_ORDERS"), icap(tr(NEW_ORDERS_CHANNEL_NAME)), icap(tr(NEW_ORDERS_CHANNEL_DESC)),
      Convert.StringToHashCode(a.id), (numNew == 1? icap(tr("new order")): icap(tr('@ new orders').replace('@', numNew))) + " · " + a.title, summaries.map(o => o.summary).join("\n"))
    PlatformUtil.DatabasePut("state", notificationState, 'notifications')
  }

  // Update the summary notification
  const uniqueNotifs = []
  for (let n of notificationState) {
    if (!uniqueNotifs.includes(n.notificationId)) {
      uniqueNotifs.push(n.notificationId)
    }
  }
  if (uniqueNotifs.length > 1) {
    PlatformUtil.notify(
      '', '',
      aKey, icap(tr(NEW_ORDERS_CHANNEL_NAME)), icap(tr(NEW_ORDERS_CHANNEL_DESC)),
      0, grandSummary.length <= 1? (totalNew == 1? icap(tr("new order")): icap(tr('@ new orders').replace('@', totalNew))):
      (icap(tr('@ new orders from @ stores').replace('@', totalNew).replace('@', grandSummary.length))), grandSummary.join("\n"))
  }
}

function checkOnlineOrders() {
  const asyncLogic = async () => {
    PlatformUtil.DatabaseGet("state", 'notifications', async (event) => {
      notificationState = event.target.result || []
      for (const a of accounts) {
        PlatformUtil.DatabaseGet('settings', `${a.id}-priceListType`, (event) => {
          const priceListType = event.target.result
          if (priceListType === 'NostrMarket compatible') {
            let url, stallKey, stallName
            let needs = 3
            let ready = async () => {
              needs -= 1
              if (needs === 0) {
                let stallId
                const response = await fetch(url+'/stall?pending=false&api-key='+stallKey, {
                  method: 'GET',
                  headers: {
                    'Accept': 'application/json',
                  },
                });
                const json = await response.json()
                for (const e of json) {
                  const { id, name } = e
                  if (name == stallName || stallName === undefined) {
                    stallId = id
                    if (url && stallId && stallKey) {
                      console.log('checking for orders', url, stallId, stallKey)
                      //const response = await fetch(url+'/stall/order/'+stallId+'?paid=true&shipped=false&api-key='+stallKey, {
                      const response = await fetch(url+'/stall/order/'+stallId+'?api-key='+stallKey, {
                          method: 'GET',
                        headers: {
                          'Accept': 'application/json',
                        },
                      });
                      const json = await response.json()
                      //console.log(Convert.JSONToString(json))
                      json.sort((a, b) => a.event_created_at - b.event_created_at)
                      let notifyTimer
                      for (const o of json) {
                      //json.map(o => {
                        const { id } = o
                        PlatformUtil.DatabaseGet("nostrmarket-orders", `${a.id}-${id}`, (event) => {
                
                          if (event.target.result === undefined) {
                            //console.log('nostrmarket-orders record:', Convert.JSONToString(event.target.result))
                            //console.log('new order:', Convert.JSONToString(o))
                
                            let subtotal
                            let itemCount
                            {
                              // Pre-computations
                              var currentState = 'saved'
                              subtotal = 0
                              itemCount = 0
                              const options = {}
                              o.items.map(item => {
                                const unitprice = o.extra.products.filter(p => p.id === item.product_id)[0].price
                                const qty = item.quantity
                                subtotal += unitprice * qty
                                itemCount += qty
                              })
                              let itemList = o.items.map(item => {
                                return {
                                  qty: +item.quantity,
                                  unitprice: +o.extra.products.filter(p => p.id === item.product_id)[0].price,
                                  options: { emoji: o.extra.products.filter(p => p.id === item.product_id)[0].name },
                                }
                              })
                              let conversions = {}
                              if (o.paid === true) {
                                itemList.push({ qty: 1, unitprice: +o.total, currency: '₿', options: { lightning: true }})
                                options['change'] = true
                                options['lightningpaid'] = true
                                const conversionKey = Convert.LNbitsCurrencyToAppCurrency(o.extra.currency)+'-₿'
                                conversions[conversionKey] = (+o.total)/(+subtotal)
                              }

                              // Construct the sale record (in the format of regular sales)
                              const newOrder = {
                                //notificationId: Convert.StringToHashCode(a.id), // exception to rule above; this member is not present for regular sales
                                nostrMarketOrderId: id, // exception to rule above: this member is not present for regular sales
                                account: a.id,
                                status: currentState,
                                date: new Date(),
                                "dataentry": {
                                  textbox: '',
                                  options,
                                },
                                currency: Convert.LNbitsCurrencyToAppCurrency(o.extra.currency),
                                items: itemList,
                                subtotal: subtotal,
                                conversions
                                //amountTendered: receivepayment.cash.text,
                                //amountToReturn: returnchange.change.text,
                              };
                              //console.log('Saving', Convert.JSONToString(newOrder))
                              PlatformUtil.DatabaseAdd('orders', newOrder)
                            }
                
                            {
                              PlatformUtil.DatabaseAddWithId('nostrmarket-orders', { id }, `${a.id}-${id}`)
                            }

                            if (!notificationState.find(n => n.nostrMarketOrderId === id)) {
                              notificationState.push({
                                notificationId: Convert.StringToHashCode(a.id),
                                accountId: a.id,
                                nostrMarketOrderId: id,
                                summary: Convert.MoneySymbolAndNumberForDisplay(+subtotal, Convert.LNbitsCurrencyToAppCurrency(o.extra.currency)) + ' (' + (itemCount == 1? icap(tr('1 item')): icap(tr('@ items').replace('@', itemCount))) + ')',
                                summaryAmount: subtotal,
                                summaryCurrency: o.extra.currency,
                              })
                              billpane.subtotal.setRenderFlag(true)
                            }

                            if (notifyTimer) clearTimeout(notifyTimer)
                            notifyTimer = setTimeout(updateNotifications, 1000)
                          }
                        })
                        //break
                      }
                    }
                    break
                  }
                }
              }
            }
            PlatformUtil.DatabaseGet('settings', `${a.id}-NostrMarketURL`, (event) => {
              url = event.target.result || pricelistsettings.nostrmarketurl.defaultValue
              ready()
            })
            PlatformUtil.DatabaseGet('settings', `${a.id}-NostrMarketStall`, (event) => {
              stallName = event.target.result
              ready()
            })
            PlatformUtil.DatabaseGet('settings', `${a.id}-secret-nostrMarketWalletKey`, (event) => {
              stallKey = event.target.result
              ready()
            })
          }
        })
      }
    })
  }
  asyncLogic()
  setTimeout(checkOnlineOrders, 60000)
}
setTimeout(checkOnlineOrders, 6000)
