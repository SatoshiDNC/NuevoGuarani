class PlatformUtil {
  constructor() {
    throw new Error()
  }
  static AudioClick() {
    if (typeof Android !== 'undefined') {
      Android.AudioClick()
    } else {
      vp.beep('click')
    }
  }
}
