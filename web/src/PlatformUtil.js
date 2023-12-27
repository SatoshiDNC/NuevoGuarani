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
}
