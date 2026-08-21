package com.dalhousie.app.services

import android.util.Log
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.FieldValue
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.messaging.FirebaseMessagingService
import com.google.firebase.messaging.RemoteMessage

class DalhousieMessagingService : FirebaseMessagingService() {
    override fun onMessageReceived(message: RemoteMessage) {
        Log.d("DalhousieFCM", "Message received: ${message.messageId}")
    }

    override fun onNewToken(token: String) {
        Log.d("DalhousieFCM", "New token: $token")
        val userId = FirebaseAuth.getInstance().currentUser?.uid ?: return
        FirebaseFirestore.getInstance()
            .collection("users")
            .document(userId)
            .collection("deviceTokens")
            .document(token)
            .set(
                mapOf(
                    "token" to token,
                    "platform" to "android",
                    "updatedAt" to FieldValue.serverTimestamp()
                )
            )
            .addOnFailureListener { error ->
                Log.w("DalhousieFCM", "Could not save notification token", error)
            }
    }
}
