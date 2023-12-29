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

  static UserPrompt(prompt, def, callback) {
    if (typeof Android !== 'undefined') {
      var handler = {result: function (input){
        console.log(input)
      }};
      var callback = new Packages.com.satoshidnc.nuevoguarani.CallFunction.PromptCallback(handler);
      Android.openPrompt(prompt, def, callback);
    } else {
      let res = prompt(prompt, def)
      callback(res)
    }
  }
}
