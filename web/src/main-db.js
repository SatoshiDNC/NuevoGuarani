var dbNotifier

/*
if (false) { // wipe database for testing purposes
	const req = indexedDB.deleteDatabase("DB")
	req.onsuccess = (e) => {
		console.log('Database deleted.')
	}
	req.onerror = (e) => {
		console.log('Error deleting database.')
	}
}
*/

function openDatabase() {
  //console.log("openDatabase()")
  if (navigator.storage && navigator.storage.persist) {
    navigator.storage.persist().then((persistent) => {
      if (persistent) {
        console.log("Note: Storage will not be cleared except by explicit user action");
      } else {
        console.log("Note: Storage may be cleared by the UA under storage pressure.");
      }
    })
  }
	const dbreq = indexedDB.open("DB", 2)
	dbreq.onerror = (event) => {
		console.error(`Error requesting database`)
		console.error(event)
	}
	dbreq.onsuccess = (event) => {
		//console.log("Database opened")
		db = event.target.result
		db.onerror = (event) => {
			console.error(`Database error: ${event.target.errorCode}`)
		}
    //db.transaction(["sales"], "readwrite").objectStore("sales").clear(); console.log('TESTING: cleared sales')
    db.transaction(["nostrmarket-orders"], "readwrite").objectStore("nostrmarket-orders").clear()
		dbNotifier(event)
	};
	dbreq.onupgradeneeded = (event) => {
		console.log(`Upgrading database`, event)
		const db = event.target.result
		var objectStore
		if (event.oldVersion < 1) {
			objectStore = db.createObjectStore("accounts")
			objectStore = db.createObjectStore("settings")
			objectStore = db.createObjectStore("sales", { autoIncrement: true })
			objectStore = db.createObjectStore("prices")
			objectStore = db.createObjectStore("inventory", { autoIncrement: true })
			objectStore = db.createObjectStore("barcodes")
		}
    if (event.oldVersion < 2) {
      objectStore = db.createObjectStore("nostrmarket-orders")
    }
	}
}

openDatabase()
