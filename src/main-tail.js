
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
          // if (id == stallId) {
          //   stall = name
          //   stallCurrency = currency
          // }
          var req = db.transaction(["nostrmarket-orders"], "readwrite")
            .objectStore("nostrmarket-orders")
            .get(`${getCurrentAccount().id}-${id}`)
          req.onsuccess = (event) => {
            console.log('present', event.target.result)
          }
          req.onerror = (event) => {
            console.log('missing', id)
          }
      
        })
      }
    }
    asyncLogic()
    setTimeout(checkOnlineOrders, 60000)
  }
  setTimeout(checkOnlineOrders, 60000)

  if (window.devicePixelRatio > 1) defaultFont.fidelity = Math.max(1, 4 - Math.floor(window.devicePixelRatio));

	vp.start(menudiv);
}
