class PlatformUtil {
  constructor() {
    throw new Error()
  }
  static AudioClick() {
    if (Android) {
      Android.AudioClick()
    } else {
      vp.beep('click')
    }
  }
}
