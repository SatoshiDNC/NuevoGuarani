package com.satoshidnc.airchat;

import static androidx.core.content.ContextCompat.getSystemService;

import android.content.Context;
import android.media.AudioManager;
import android.media.Ringtone;
import android.media.RingtoneManager;
import android.net.Uri;
import android.util.Log;
import android.view.SoundEffectConstants;

import androidx.annotation.NonNull;
import androidx.work.Worker;
import androidx.work.WorkerParameters;

import com.neovisionaries.ws.client.*;

import java.io.IOException;

public class AirChatWorker extends Worker {
    public AirChatWorker(@NonNull Context context, @NonNull WorkerParameters workerParams) {
        super(context, workerParams);
    }

    @NonNull
    @Override
    public Result doWork() {
        Log.i(AirChatWorker.class.getSimpleName(),"doWork()");

        AudioManager audioManager = (AudioManager)this.getApplicationContext().getSystemService(Context.AUDIO_SERVICE);
        audioManager.playSoundEffect(AudioManager.FX_KEY_CLICK);
//        try {
//            Uri notification = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION);
//            Ringtone r = RingtoneManager.getRingtone(getApplicationContext(), notification);
//            r.play();
//        } catch (Exception e) {
//            e.printStackTrace();
//        }

        try {
            new WebSocketFactory()
                .createSocket("wss://relay.satoshidnc.com")
                .addListener(new WebSocketAdapter() {
                    @Override
                    public void onTextMessage(WebSocket ws, String message) {
                        // Received a response. Print the received message.
                        Log.i(AirChatWorker.class.getSimpleName(), message);

                        // Close the WebSocket connection.
                        ws.disconnect();
                    }
                })
                .connect()
                .sendText("Hello.");
        } catch (WebSocketException e) {
            Log.e(AirChatWorker.class.getSimpleName(), e.toString());
        } catch (IOException e) {
            Log.e(AirChatWorker.class.getSimpleName(), e.toString());
        }

        return Result.success();
    }
}
