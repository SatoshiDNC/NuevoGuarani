class PlatformUtil {
  constructor() {
    throw new Error()
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
      Android.UserPromptCallback = function(result) {
        delete Android.UserPromptCallback
        console.log("result: " + result)
        callback(result)
      }
      Android.openPrompt(promptText, defaultValue, 'Android.UserPromptCallback');
    } else {
      let result = prompt(promptText, defaultValue)
      callback(result)
    }
  }
}
