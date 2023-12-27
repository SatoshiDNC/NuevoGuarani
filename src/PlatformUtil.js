class PlatformUtil {
  constructor() {
    throw new Error()
  }
  static AudioClick() {
    if (Android !== undefined) {
      Android.AudioClick()
    } else {
      vp.beep('click')
    }
  }
}
