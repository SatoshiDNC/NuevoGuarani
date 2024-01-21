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
        cb(slot, result)
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
    //console.log("slot " + slot + "/" + Android._CallbackQueue.length + " added to callback queue")
    return slot
  }
  static DeleteCallback(slot) {
    delete Android._CallbackQueue[slot]
    //console.log("slot " + slot + "/" + Android._CallbackQueue.length + " deleted from callback queue")
}

  static AudioClick() {
    if (typeof Android !== 'undefined') {
      Android.audioClick()
    } else {
      vp.beep('click')
    }
  }

  static RequestCamera() {
    if (typeof Android !== 'undefined') {
      Android.requestCamera()
    } else {
    }
  }

  static UserPrompt(promptText, defaultValue, okCallback, cancelCallback) {
    if (typeof Android !== 'undefined') {
      const okSlot = PlatformUtil.InitCallback(okCallback)
      Android.userPrompt(promptText, defaultValue, okSlot)
      PlatformUtil.DeleteCallback(okSlot)
    } else {
      const result = prompt(promptText, defaultValue)
      if (result !== null) okCallback(result)
      else if (cancelCallback) cancelCallback()
    }
  }

  static UserConfirm(promptText, callback) {
    if (typeof Android !== 'undefined') {
      const slot = PlatformUtil.InitCallback(callback)
      Android.userConfirm(promptText, slot)
      PlatformUtil.DeleteCallback(slot)
    } else {
      callback(confirm(promptText))
    }
  }

  static UserAck(promptText, callback) {
    if (typeof Android !== 'undefined') {
      const slot = PlatformUtil.InitCallback(callback)
      Android.userAck(promptText, slot)
      PlatformUtil.DeleteCallback(slot)
    } else {
      callback(alert(promptText))
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

    if (typeof Android !== 'undefined') {
      Android.deleteAllData(PlatformUtil.InitCallback((event) => { console.debug('Deletion request succeeded from Android side.') }), PlatformUtil.InitCallback((event) => { console.debug('Deletion request failed from Android side.') }))
    }

    db.close()
    const req = indexedDB.deleteDatabase("DB")
    req.onsuccess = successCallback || ((event) => { console.debug('DatabaseDeleteAll request succeeded.') })
    req.onerror = failureCallback || ((event) => { console.debug('DatabaseDeleteAll request failed.') })
  }

  static notify(groupIdStr, groupName, chanIdStr, chanName, chanDesc, intId, msgTitle, msgText) {
    if (typeof Android !== 'undefined') {
      Android.notify(groupIdStr, groupName, chanIdStr, chanName, chanDesc, intId, msgTitle, msgText)
    }
  }
  static stopNotifying(id) {
    if (typeof Android !== 'undefined') {
      Android.stopNotifying(id)
    }
  }

  static DownloadURI(uri, name) {
    if (typeof Android !== 'undefined') {

      // hacky port from Java
      function decodeDataURL(url) {
        if (!url.startsWith("data")) {
          console.log("Not a data url: " + url);
          return
        }
        const comma = url.indexOf(',');
        let beforeData = url.substring("data:".length, comma);
        const base64 = beforeData.endsWith(";base64");
        if (base64) {
          beforeData = beforeData.substring(0, beforeData.length - 7);
        }
        const mediaType = undefined // extractMediaType(beforeData);
        const charset = undefined // extractCharset(beforeData);
        let data = url.substring(comma + 1) // .getBytes(charset);
        if (base64) {
          data = atob(data) // Base64.decodeBase64(decodeUrl(data));
        }
        else {
          // data = URLCodec.decodeUrl(data);
        }
        return data
      }
      const content = decodeDataURL(uri)
      
      const successSlot = PlatformUtil.InitCallback((event) => { console.debug('Download request succeeded from Android side.') })
      const failureSlot = PlatformUtil.InitCallback((event) => { console.debug('Download request failed from Android side.') })
      Android.downloadURI(content, name, successSlot, failureSlot)
      PlatformUtil.DeleteCallback(successSlot)
      PlatformUtil.DeleteCallback(failureSlot)
    } else {
      const link = document.createElement("a")
      link.download = name
      link.href = uri
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  static backCallback
  static SetBackCallback(callback) {
    if (typeof Android !== 'undefined') {
      PlatformUtil.backCallback = PlatformUtil.InitCallback(callback)
      Android.setBackCallback(PlatformUtil.backCallback)
    }
  }

}

var db
