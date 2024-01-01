class PlatformUtil {
  constructor() {
    throw new Error()
  }

  static init() {
    if (typeof Android.Callback === 'undefined') {
      Android._CallbackQueue = []
      Android.Callback = function(slot, result) {
        const cb = Android._CallbackQueue[slot]
        delete Android._CallbackQueue[slot]
        console.log("slot " + slot + "/" + Android._CallbackQueue.length + " deleted from callback queue")
        cb(result)
      }
    }
  }

  static InitCallback(callback) {
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
      Android.userPrompt(promptText, defaultValue, PlatformUtil.InitCallback(callback));
    } else {
      callback(prompt(promptText, defaultValue))
    }
  }

  static UserConfirm(promptText, callback) {
    if (typeof Android !== 'undefined') {
      Android.userConfirm(promptText, PlatformUtil.InitCallback(callback));
    } else {
      callback(confirm(promptText))
    }
  }

  static GetDataAsReadOnly(tableName, keyName, successCallback) {
    if (typeof Android !== 'undefined') {
      Android.getDataAsReadOnly(tableName, keyName, PlatformUtil.InitCallback(successCallback));
    } else {
      const req = db.transaction([tableName], "readonly").objectStore(tableName).get(keyName)
      req.onsuccess = successCallback
    }
  }

}
