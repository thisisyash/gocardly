package com.brandorigin.businessapp;

import android.app.Service;
import android.content.Intent;
import android.os.IBinder;
import android.util.Log;

import com.google.firebase.messaging.RemoteMessage;

public class FirebaseMessagingService extends com.google.firebase.messaging.FirebaseMessagingService {
    private static final String TAG = "FirebaseMessagingServic";
    @Override
    public void
    onMessageReceived(RemoteMessage remoteMessage) {
        Log.d(TAG, "From: ======================== " + remoteMessage.getFrom());

    }
}