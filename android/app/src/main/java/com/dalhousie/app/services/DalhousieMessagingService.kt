package com.dalhousie.app.services

import android.util.Log
import com.google.firebase.messaging.FirebaseMessagingService
import com.google.firebase.messaging.RemoteMessage

class DalhousieMessagingService : FirebaseMessagingService() {
    override fun onMessageReceived(message: RemoteMessage) {
        Log.d("DalhousieFCM", "Message received: ${message.messageId}")
    }

    override fun onNewToken(token: String) {
        Log.d("DalhousieFCM", "New token: $token")
        // TODO: send token to backend or Firestore profile doc if you want targeted push notifications.
    }
}
