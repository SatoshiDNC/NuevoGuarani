package com.satoshidnc.airchat;

import android.content.Context;
import android.media.AudioManager;
import android.webkit.JavascriptInterface;

public class WebUtils {
    Context context;
    AudioManager audio;

    WebUtils(Context c) {
        context = c;
        audio = (AudioManager) c.getApplicationContext().getSystemService(Context.AUDIO_SERVICE);
    }

    @JavascriptInterface
    public void audioClick() {
        audio.playSoundEffect(AudioManager.FX_KEY_CLICK);
    }
}
