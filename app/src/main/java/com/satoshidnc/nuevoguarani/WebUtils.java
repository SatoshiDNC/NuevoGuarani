package com.satoshidnc.nuevoguarani;

import android.app.NotificationChannel;
import android.app.NotificationChannelGroup;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.media.AudioManager;
import android.os.Build;
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
import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;
import androidx.core.content.ContextCompat;

import java.util.Arrays;
import java.util.List;
import java.util.function.Function;

public class WebUtils {
    private MainActivity context;
    private WebView view;
    private AudioManager audio;
    PendingIntent newOrderIntent;

    WebUtils(MainActivity c, WebView v) {
        context = c;
        view = v;
        audio = (AudioManager) c.getApplicationContext().getSystemService(Context.AUDIO_SERVICE);
        Intent intent = new Intent(context, MainActivity.class);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
        newOrderIntent = PendingIntent.getActivity(context, 0, intent, PendingIntent.FLAG_IMMUTABLE);
    }

    @JavascriptInterface
    public void audioClick() {
        audio.playSoundEffect(AudioManager.FX_KEY_CLICK);
    }

    @JavascriptInterface
    public void requestCamera() {
        Log.d("DEBUG", "requestCamera() called");
        context.checkCameraPermissions();
    }

    @JavascriptInterface
    public void userPrompt(String prompt, String defaultValue, int callback) {
        Log.d("DEBUG", "userPrompt() called");
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
                        String cb = "Android.Callback(" + callback + ",'" + input.getText().toString().replace("\"", "\\\"") + "')";
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

    @JavascriptInterface
    public void userConfirm(String prompt, int callback) {
        Log.d("DEBUG", "userConfirm() called");
        Handler handler = new Handler(Looper.getMainLooper());
        handler.post(new Runnable() {
            @Override
            public void run() {

                AlertDialog.Builder builder = new AlertDialog.Builder(context);
                builder.setTitle(prompt);

                builder.setPositiveButton("OK", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        Log.d("Debug", "User response: OK");
                        String cb = "Android.Callback(" + callback + "," + true + ")";
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
                        Log.d("Debug", "User response: Cancel");
                        dialog.cancel();
                        String cb = "Android.Callback(" + callback + "," + false + ")";
                        Log.d("DEBUG", "callback: " + cb);
                        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.KITKAT) {
                            view.evaluateJavascript(cb, null);
                        } else {
                            view.loadUrl("javascript:" + cb);
                        }
                    }
                });

                AlertDialog dlg = builder.create();
                dlg = builder.show();
                Window window = dlg.getWindow();
                window.setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_STATE_ALWAYS_VISIBLE);

                WindowManager.LayoutParams wlp = window.getAttributes();
                wlp.gravity = Gravity.TOP;
                wlp.flags &= ~WindowManager.LayoutParams.FLAG_DIM_BEHIND;
                window.setAttributes(wlp);
            }
        });
    }

//    @JavascriptInterface
//    public void getData(String table, String key, int successCallback, int failureCallback) {
//        Log.d("DEBUG", "getData() called");
//    }
//    @JavascriptInterface
//    public void addData(String table, String item, int successCallback, int failureCallback) {
//        Log.d("DEBUG", "addData() called");
//    }
//    public void addDataWithId(String table, String item, String key, int successCallback, int failureCallback) {
//        Log.d("DEBUG", "addDataWithId() called");
//    }
//    public void putData(String table, String item, String key, int successCallback, int failureCallback) {
//        Log.d("DEBUG", "putData() called");
//    }
//    @JavascriptInterface
//    public void delData(String table, String key, int successCallback, int failureCallback) {
//        Log.d("DEBUG", "delData() called");
//    }
    @JavascriptInterface
    public void deleteAllData(int successCallback, int failureCallback) {
        Log.d("DEBUG", "deleteAllData() called");
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationManager notificationManager = context.getSystemService(NotificationManager.class);
            List<NotificationChannel> list = notificationManager.getNotificationChannels();
            for (int i = 0; i < list.stream().count(); i++) {
                NotificationChannel c = list.get(i);
                notificationManager.deleteNotificationChannel(c.getId());
            }
        }
        String cb = "Android.Callback(" + successCallback + ")";
        Log.d("DEBUG", "callback: " + cb);
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.KITKAT) {
            view.evaluateJavascript(cb, null);
        } else {
            view.loadUrl("javascript:" + cb);
        }
    }

    @JavascriptInterface
    public void notify(String groupId, String groupName, String chanId, String chanName, String chanDesc, int id, String msgTitle, String msgText) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationManager notificationManager = context.getSystemService(NotificationManager.class);
            if (!groupId.equals("") && !groupName.equals("")) {
                notificationManager.createNotificationChannelGroup(new NotificationChannelGroup(groupId, groupName));
            }
            NotificationChannel channel = new NotificationChannel(chanId, chanName, NotificationManager.IMPORTANCE_DEFAULT);
            channel.setDescription(chanDesc);
            if (!groupId.equals("") && !groupName.equals("")) {
                channel.setGroup(groupId);
            }
            notificationManager.createNotificationChannel(channel);
        }
        String GROUP_KEY_NEW_ORDER = context.getPackageName()+".NEW_ORDER";
        NotificationCompat.Builder builder = new NotificationCompat.Builder(context, chanId)
            .setSmallIcon(R.drawable.ic_stat_name)
            .setGroup(GROUP_KEY_NEW_ORDER)
            .setContentTitle(msgTitle)
            .setContentText(msgText)
            .setPriority(NotificationCompat.PRIORITY_DEFAULT)
            .setContentIntent(newOrderIntent);
        if (id == 0) {
            builder.setGroupSummary(true);
        }
        if (msgText.contains("\n")) {
            NotificationCompat.InboxStyle inboxStyle = new NotificationCompat.InboxStyle();
            for (String s : msgText.split("\n")) {
                inboxStyle.addLine(s);
            }
            builder.setStyle(inboxStyle);
        }

        NotificationManagerCompat notMan = NotificationManagerCompat.from(context);
        int result = ContextCompat.checkSelfPermission(context, android.Manifest.permission.POST_NOTIFICATIONS);
        if (result != PackageManager.PERMISSION_GRANTED) {
            Log.i(Worker1.class.getSimpleName(),"Notification permission not enabled");
//            if (ActivityCompat.shouldShowRequestPermissionRationale((Activity) context, Manifest.permission.POST_NOTIFICATIONS)) {
//                Toast.makeText(context, "Please allow notifications", Toast.LENGTH_LONG).show();
//            } else {
//                ActivityCompat.requestPermissions((Activity) context, new String[]{Manifest.permission.POST_NOTIFICATIONS}, 2);
//            }
        } else {
        }

        // notificationId is a unique int for each notification that you must define.
        notMan.notify(id, builder.build());

    }
    @JavascriptInterface
    public void stopNotifying(int id) {
        NotificationManagerCompat notMan = NotificationManagerCompat.from(context);
        notMan.cancel(id);
    }
}
