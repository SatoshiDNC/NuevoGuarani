class PlatformUtil {
  constructor() {
    throw new Error()
  }

  static init() {
    if (typeof Android.Callback === 'undefined') {
      Android._CallbackQueue = []
      Android.Callback = function(slot, result) {
        if (slot < 0) return
        const cb = Android._CallbackQueue[slot]
        delete Android._CallbackQueue[slot]
        console.log("slot " + slot + "/" + Android._CallbackQueue.length + " deleted from callback queue")
        cb(result)
      }
    }
  }

  static InitCallback(callback) {
    if (callback === 'undefined') return -1
    PlatformUtil.init()
    let slot = 0
    for (let i = 0; i < Android._CallbackQueue.length; i++) {
      if (Android._CallbackQueue[i] === 'undefined') {
        slot = i
        break
      }
    }
    slot = Android._CallbackQueue.length
    Android._CallbackQueue[slot] = callback
    console.log("slot " + slot + "/" + Android._CallbackQueue.length + " added to callback queue")
    return slot
  }

  static AudioClick() {
    if (typeof Android !== 'undefined') {
      Android.audioClick()
    } else {
      vp.beep('click')
    }
  }

  static UserPrompt(promptText, defaultValue, callback) {
    if (typeof Android !== 'undefined') {
      Android.userPrompt(promptText, defaultValue, PlatformUtil.InitCallback(callback))
    } else {
      callback(prompt(promptText, defaultValue))
    }
  }

  static UserConfirm(promptText, callback) {
    if (typeof Android !== 'undefined') {
      Android.userConfirm(promptText, PlatformUtil.InitCallback(callback))
    } else {
      callback(confirm(promptText))
    }
  }

  static DatabaseGet(tableName, keyName, successCallback, failureCallback) {
    // console.log('DatabaseGet(', tableName, keyName, ')')
    // if (typeof Android !== 'undefined') {
    //   Android.getData(tableName, keyName, PlatformUtil.InitCallback(successCallback), PlatformUtil.InitCallback(failureCallback))
    // } else {
      const req = db.transaction([tableName], "readonly").objectStore(tableName).get(keyName)
      req.onsuccess = successCallback || ((event) => { console.debug('DatabaseGet request succeeded.') })
      req.onerror = failureCallback || ((event) => { console.debug('DatabaseGet request failed.') })
    // }
  }

  static DatabaseAdd(tableName, item, successCallback, failureCallback) {
    // console.log('DatabaseAdd(', tableName, item, ')')
    // if (typeof Android !== 'undefined') {
    //   Android.addData(tableName, JSON.stringify(item), PlatformUtil.InitCallback(successCallback), PlatformUtil.InitCallback(failureCallback))
    // } else {
      const req = db.transaction([tableName], "readwrite").objectStore(tableName).add(item)
      req.onsuccess = successCallback || ((event) => { console.debug('DatabaseAdd request succeeded.') })
      req.onerror = failureCallback || ((event) => { console.debug('DatabaseAdd request failed.') })
    // }
  }

  static DatabaseAddWithId(tableName, item, keyName, successCallback, failureCallback) {
    // console.log('DatabaseAddWithId(', tableName, item, keyName, ')')
    // if (typeof Android !== 'undefined') {
    //   Android.addData(tableName, JSON.stringify(item), keyName, PlatformUtil.InitCallback(successCallback), PlatformUtil.InitCallback(failureCallback))
    // } else {
      const req = db.transaction([tableName], "readwrite").objectStore(tableName).add(item, keyName)
      req.onsuccess = successCallback || ((event) => { console.debug('DatabaseAddWithId request succeeded.') })
      req.onerror = failureCallback || ((event) => { console.debug('DatabaseAddWithId request failed.') })
    // }
  }

  static DatabasePut(tableName, item, keyName, successCallback, failureCallback) {
    // console.log('DatabasePut(', tableName, item, keyName, ')')
    // if (typeof Android !== 'undefined') {
    //   Android.addData(tableName, JSON.stringify(item), keyName, PlatformUtil.InitCallback(successCallback), PlatformUtil.InitCallback(failureCallback))
    // } else {
      const req = db.transaction([tableName], "readwrite").objectStore(tableName).put(item, keyName)
      req.onsuccess = successCallback || ((event) => { console.debug('DatabasePut request succeeded.') })
      req.onerror = failureCallback || ((event) => { console.debug('DatabasePut request failed.') })
    // }
  }

  static DatabaseDelete(tableName, keyName, successCallback, failureCallback) {
    // console.log('DatabaseDelete(', tableName, keyName, ')')
    // if (typeof Android !== 'undefined') {
    //   Android.delData(tableName, keyName, PlatformUtil.InitCallback(successCallback), PlatformUtil.InitCallback(failureCallback))
    // } else {
      const req = db.transaction([tableName], "readwrite").objectStore(tableName).delete(keyName)
      req.onsuccess = successCallback || ((event) => { console.debug('DatabaseDelete request succeeded.') })
      req.onerror = failureCallback || ((event) => { console.debug('DatabaseDelete request failed.') })
    // }
  }

  static DatabaseDeleteAll(successCallback, failureCallback) {
    // console.log('DatabaseDeleteAll()')
    // if (typeof Android !== 'undefined') {
    //   Android.deleteAllData(PlatformUtil.InitCallback(successCallback), PlatformUtil.InitCallback(failureCallback))
    // } else {
      db.close()
      const req = indexedDB.deleteDatabase("DB")
      req.onsuccess = successCallback || ((event) => { console.debug('DatabaseDeleteAll request succeeded.') })
      req.onerror = failureCallback || ((event) => { console.debug('DatabaseDeleteAll request failed.') })
    // }
  }

}

var db
