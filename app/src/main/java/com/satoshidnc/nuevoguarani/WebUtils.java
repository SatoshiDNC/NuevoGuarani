package com.satoshidnc.nuevoguarani;

import android.content.Context;
import android.content.DialogInterface;
import android.media.AudioManager;
import android.os.Looper;
import android.text.InputType;
import android.util.Log;
import android.view.Gravity;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.view.inputmethod.InputMethodManager;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;
import android.widget.EditText;
import android.os.Handler;

import androidx.appcompat.app.AlertDialog;

public class WebUtils {
    private Context context;
    private WebView view;
    private AudioManager audio;

    WebUtils(Context c, WebView v) {
        context = c;
        view = v;
        audio = (AudioManager) c.getApplicationContext().getSystemService(Context.AUDIO_SERVICE);
    }

    @JavascriptInterface
    public void audioClick() {
        audio.playSoundEffect(AudioManager.FX_KEY_CLICK);
    }

    static interface PromptCallback {
        public void result(String input);
    }

    @JavascriptInterface
    public void openPrompt(String prompt, String defaultValue, String callback) {
        Log.d("DEBUG", "openPrompt() called");

        Handler handler = new Handler(Looper.getMainLooper());

        handler.post(new Runnable() {
            @Override
            public void run() {

                AlertDialog.Builder builder = new AlertDialog.Builder(context);
                builder.setTitle(prompt);

                // Set up the input
                final EditText input = new EditText(context);
                // Specify the type of input expected; this, for example, sets the input as a password, and will mask the text
                input.setInputType(InputType.TYPE_CLASS_TEXT | InputType.TYPE_TEXT_VARIATION_FILTER);
                builder.setView(input);

                input.setOnFocusChangeListener(new View.OnFocusChangeListener() {
                    @Override
                    public void onFocusChange(View v, boolean hasFocus) {
                        input.postDelayed(new Runnable() {
                            @Override
                            public void run() {
                                InputMethodManager inputMethodManager = (InputMethodManager) context.getSystemService(Context.INPUT_METHOD_SERVICE);
                                inputMethodManager.showSoftInput(input, InputMethodManager.SHOW_IMPLICIT);
                            }
                        }, 100);
                    }
                });
                input.requestFocus();

                // Set up the buttons
                builder.setPositiveButton("OK", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        Log.d("Debug", input.getText().toString());

                        String cb = callback + "('" + input.getText().toString().replace("\"", "\\\"") + "')";
                        Log.d("DEBUG", "callback: " + cb);
                        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.KITKAT) {
                            view.evaluateJavascript(cb, null);
                        } else {
                            view.loadUrl("javascript:" + cb);
                        }
                    }
                });
                builder.setNegativeButton("Cancel", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        dialog.cancel();
                    }
                });

                AlertDialog dlg = builder.create();
                dlg = builder.show();
                Window window = dlg.getWindow();
                window.setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_STATE_ALWAYS_VISIBLE);

                WindowManager.LayoutParams wlp = window.getAttributes();
                wlp.gravity = Gravity.BOTTOM;
                wlp.flags &= ~WindowManager.LayoutParams.FLAG_DIM_BEHIND;
                window.setAttributes(wlp);
            }
        });
    }
}
