package com.satoshidnc.nuevoguarani;

import android.annotation.SuppressLint;
import android.os.Build;
import android.os.Bundle;

import com.google.android.material.snackbar.Snackbar;

import androidx.appcompat.app.AppCompatActivity;

import android.view.View;

import androidx.navigation.ui.AppBarConfiguration;
import androidx.work.PeriodicWorkRequest;
import androidx.work.WorkManager;

import android.webkit.WebView;

import java.io.IOException;
import java.io.InputStream;
import java.time.Duration;

import org.apache.commons.io.IOUtils;

public class MainActivity extends AppCompatActivity {

    private AppBarConfiguration appBarConfiguration;

    @Override @SuppressLint("SetJavaScriptEnabled")
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        int currentApiVersion = android.os.Build.VERSION.SDK_INT;
        final int flags = View.SYSTEM_UI_FLAG_LAYOUT_STABLE
            | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
            | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
            | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
            | View.SYSTEM_UI_FLAG_FULLSCREEN
            | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY;
        if(currentApiVersion >= Build.VERSION_CODES.KITKAT) {
            getWindow().getDecorView().setSystemUiVisibility(flags);
            final View decorView = getWindow().getDecorView();
        }

        WebView view = new WebView(this);
        setContentView(view);
        view.getSettings().setJavaScriptEnabled(true);
        view.addJavascriptInterface(new WebUtils(this), "Android");
        String s = loadResource(R.raw.index);
        view.loadDataWithBaseURL("https://ng.satoshidnc.com", s, "text/html", null,null);

//                Snackbar.make(view, "Snackbar", Snackbar.LENGTH_LONG)
//                        .setAction("Action", null).show();

        WorkManager.getInstance(this).cancelAllWork();
        PeriodicWorkRequest workRequest = new PeriodicWorkRequest.Builder(Worker1.class, Duration.ofMinutes(15)).build();
        WorkManager.getInstance(this).enqueue(workRequest);
    }

    String loadResource(int r) {
        InputStream is = getResources().openRawResource(r);
        String s;
        try {
            s = IOUtils.toString(is);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        IOUtils.closeQuietly(is);
        return s;
    }
}