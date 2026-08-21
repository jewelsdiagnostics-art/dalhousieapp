package com.dalhousie.app.data

data class DalUser(
    val uid: String = "",
    val displayName: String = "",
    val email: String = "",
    val role: String = "faculty"
)

data class DalResource(
    val id: String = "",
    val title: String = "",
    val storagePath: String = "",
    val downloadUrl: String = "",
    val revision: Long = 0
)

data class DalMeeting(
    val id: String = "",
    val title: String = "",
    val scheduledAt: Long = 0,
    val revision: Long = 0
)
