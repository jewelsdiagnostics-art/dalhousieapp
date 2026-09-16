package com.dalhousie.app.data

import com.google.firebase.Timestamp
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNull
import org.junit.Test
import java.util.Date

class FirestoreMappersTest {
    @Test
    fun `maps web resource field names and string revisions`() {
        val resource = mapDalResource(
            id = "handbook",
            data = mapOf(
                "name" to "Programme Handbook",
                "file" to "https://example.org/handbook.pdf",
                "revision" to "7"
            )
        )

        assertEquals("Programme Handbook", resource?.title)
        assertEquals("https://example.org/handbook.pdf", resource?.downloadUrl)
        assertEquals(7L, resource?.revision)
    }

    @Test
    fun `maps timestamps and legacy meeting titles`() {
        val date = Date(1_800_000_000_000L)
        val meeting = mapDalMeeting(
            id = "meeting-1",
            data = mapOf("Title" to "Faculty meeting", "scheduledAt" to Timestamp(date))
        )

        assertEquals("Faculty meeting", meeting?.title)
        assertEquals(date.time, meeting?.scheduledAt)
    }

    @Test
    fun `ignores soft deleted documents`() {
        assertNull(mapDalResource("deleted", mapOf("name" to "Old file", "deletedAt" to Date())))
        assertNull(mapDalMeeting("deleted", mapOf("Title" to "Old meeting", "deleted" to true)))
    }

    @Test
    fun `uses safe defaults for unexpected field types`() {
        val resource = mapDalResource(
            id = "mixed",
            data = mapOf("name" to listOf("unexpected"), "revision" to mapOf("value" to 3))
        )

        assertEquals("mixed", resource?.title)
        assertEquals(0L, resource?.revision)
    }
}
