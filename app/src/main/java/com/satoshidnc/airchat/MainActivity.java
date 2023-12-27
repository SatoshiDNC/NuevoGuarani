package com.satoshidnc.airchat;

import android.annotation.SuppressLint;
import android.content.Context;
import android.os.Build;
import android.os.Bundle;

import com.google.android.material.snackbar.Snackbar;

import androidx.appcompat.app.AppCompatActivity;

import android.util.Log;
import android.view.LayoutInflater;
import android.view.SoundEffectConstants;
import android.view.View;

import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.core.view.WindowInsetsControllerCompat;
import androidx.navigation.NavController;
import androidx.navigation.Navigation;
import androidx.navigation.ui.AppBarConfiguration;
import androidx.navigation.ui.NavigationUI;
import androidx.work.OneTimeWorkRequest;
import androidx.work.PeriodicWorkRequest;
import androidx.work.WorkManager;

import com.satoshidnc.airchat.databinding.ActivityMainBinding;

import android.view.Menu;
import android.view.MenuItem;
import android.view.WindowInsets;
import android.webkit.WebChromeClient;
import android.webkit.WebView;
import android.widget.LinearLayout;
import android.widget.TextView;

import java.io.IOException;
import java.io.InputStream;
import java.time.Duration;

import org.apache.commons.io.IOUtils;

public class MainActivity extends AppCompatActivity {

    private AppBarConfiguration appBarConfiguration;
    private ActivityMainBinding binding;

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

        // This work only for android 4.4+
        if(currentApiVersion >= Build.VERSION_CODES.KITKAT)
        {

            getWindow().getDecorView().setSystemUiVisibility(flags);

            // Code below is to handle presses of Volume up or Volume down.
            // Without this, after pressing volume buttons, the navigation bar will
            // show up and won't hide
            final View decorView = getWindow().getDecorView();
            decorView.setOnSystemUiVisibilityChangeListener(new View.OnSystemUiVisibilityChangeListener() {
                @Override
                public void onSystemUiVisibilityChange(int visibility)
                {
                    if((visibility & View.SYSTEM_UI_FLAG_FULLSCREEN) == 0)
                    {
                        decorView.setSystemUiVisibility(flags);
                    }
                }
            });
        }

//        WebChromeClient webChromeClient = new WebChromeClient() {
//            @Override
//            public void onShowCustomView(View view, CustomViewCallback callback) {
//                Log.w("WARN", "SHOW NOT IMPLEMENTED");
//            }
//            @Override
//            public void onHideCustomView() {
//                Log.w("WARN", "HIDE NOT IMPLEMENTED");
//            }
//        };

        WebView root = new WebView(this);
        setContentView(root);
        root.getSettings().setJavaScriptEnabled(true);
        //root.setWebChromeClient(webChromeClient);

        root.addJavascriptInterface(new WebUtils(this), "Android");

        //root.loadUrl("https://ng.satoshidnc.com");
        InputStream is = getResources().openRawResource(R.raw.index);
        String s;
        try {
            s = IOUtils.toString(is);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        IOUtils.closeQuietly(is);
        //root.setSoundEffectsEnabled(true);
        //root.playSoundEffect(SoundEffectConstants.CLICK);
        Log.i("Info", "len: " + s.length());
        root.loadDataWithBaseURL("https://ng.satoshidnc.com", s, "text/html", null,null);
        //root.loadUrl("https://dev-ng.satoshidnc.com");


//        binding = ActivityMainBinding.inflate(getLayoutInflater());
//        setContentView(binding.getRoot());
//
//        setSupportActionBar(binding.toolbar);
//
//        NavController navController = Navigation.findNavController(this, R.id.nav_host_fragment_content_main);
//        appBarConfiguration = new AppBarConfiguration.Builder(navController.getGraph()).build();
//        NavigationUI.setupActionBarWithNavController(this, navController, appBarConfiguration);
//
//        binding.fab.setOnClickListener(new View.OnClickListener() {
//            @Override
//            public void onClick(View view) {
//                LinearLayout options_layout = (LinearLayout) findViewById(R.id.options_list);
//                LayoutInflater inflater = (LayoutInflater) MainActivity.this.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
//                View to_add = inflater.inflate(R.layout.own_message,
//                        options_layout,false);
//
//                TextView text = (TextView) to_add.findViewById(R.id.textView);
//                text.setText("xyz");
//                options_layout.addView(to_add);
//
////                Snackbar.make(view, "Added", Snackbar.LENGTH_LONG)
////                        .setAnchorView(R.id.fab)
////                        .setAction("Action", null).show();
//            }
//        });

        WorkManager.getInstance(this).cancelAllWork();
        PeriodicWorkRequest workRequest = new PeriodicWorkRequest.Builder(AirChatWorker.class, Duration.ofMinutes(15)).build();
        WorkManager.getInstance(this).enqueue(workRequest);
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.menu_main, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();

        //noinspection SimplifiableIfStatement
        if (id == R.id.action_settings) {
            return true;
        }

        return super.onOptionsItemSelected(item);
    }

    @Override
    public boolean onSupportNavigateUp() {
        NavController navController = Navigation.findNavController(this, R.id.nav_host_fragment_content_main);
        return NavigationUI.navigateUp(navController, appBarConfiguration)
                || super.onSupportNavigateUp();
    }
}