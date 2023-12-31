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
        callback(result)
      }
      Android.userPrompt(promptText, defaultValue, 'Android.UserPromptCallback');
    } else {
      let result = prompt(promptText, defaultValue)
      callback(result)
    }
  }

  static UserConfirm(promptText, callback) {
    if (typeof Android !== 'undefined') {
      Android.UserConfirmCallback = function(result) {
        delete Android.UserConfirmCallback
        callback(result)
      }
      Android.userConfirm(promptText, 'Android.UserConfirmCallback');
    } else {
      let result = confirm(promptText)
      callback(result)
    }
  }
}
