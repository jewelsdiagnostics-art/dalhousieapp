package com.dalhousie.app.data

import com.google.firebase.Timestamp
import java.util.Date

internal fun mapDalUser(id: String, data: Map<String, Any?>?): DalUser? {
    if (data == null || data.isSoftDeleted()) return null
    return DalUser(
        uid = data.text("uid").ifBlank { id },
        displayName = data.text("name", "fullName", "displayName", "username", "email"),
        email = data.text("email"),
        role = data.text("role").ifBlank { "faculty" }
    )
}

internal fun mapDalMeeting(id: String, data: Map<String, Any?>?): DalMeeting? {
    if (data == null || data.isSoftDeleted()) return null
    return DalMeeting(
        id = id,
        title = data.text("title", "Title").ifBlank { id },
        scheduledAt = data.epochMillis("scheduledAt", "date", "Date"),
        revision = data.number("revision", "_revision")
    )
}

internal fun mapDalResource(id: String, data: Map<String, Any?>?): DalResource? {
    if (data == null || data.isSoftDeleted()) return null
    return DalResource(
        id = id,
        title = data.text("title", "name").ifBlank { id },
        storagePath = data.text("storagePath"),
        downloadUrl = data.text("downloadUrl", "file"),
        revision = data.number("revision", "_revision")
    )
}

private fun Map<String, Any?>.text(vararg keys: String): String {
    return keys.firstNotNullOfOrNull { key ->
        when (val value = this[key]) {
            is String -> value.trim().takeIf(String::isNotEmpty)
            is Number, is Boolean -> value.toString()
            else -> null
        }
    }.orEmpty()
}

private fun Map<String, Any?>.number(vararg keys: String): Long {
    return keys.firstNotNullOfOrNull { key ->
        when (val value = this[key]) {
            is Number -> value.toLong()
            is String -> value.toLongOrNull()
            else -> null
        }
    } ?: 0L
}

private fun Map<String, Any?>.epochMillis(vararg keys: String): Long {
    return keys.firstNotNullOfOrNull { key ->
        when (val value = this[key]) {
            is Timestamp -> value.toDate().time
            is Date -> value.time
            is Number -> value.toLong()
            is String -> value.toLongOrNull()
            else -> null
        }
    } ?: 0L
}

private fun Map<String, Any?>.isSoftDeleted(): Boolean {
    return this["deleted"] == true || this["isDeleted"] == true || this["deletedAt"] != null
}
