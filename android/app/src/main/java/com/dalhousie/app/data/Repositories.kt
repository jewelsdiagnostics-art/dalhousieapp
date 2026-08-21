package com.dalhousie.app.data

import android.net.Uri
import com.google.firebase.auth.FirebaseUser
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.firestore.DocumentSnapshot
import com.google.firebase.firestore.FieldValue
import com.google.firebase.storage.FirebaseStorage
import kotlinx.coroutines.tasks.await
import kotlinx.coroutines.channels.awaitClose
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.callbackFlow
import kotlinx.coroutines.flow.map

interface AuthRepository {
    fun authState(): Flow<FirebaseUser?>
    fun currentUser(): FirebaseUser?
    suspend fun signIn(email: String, password: String)
    suspend fun createAccount(email: String, password: String): FirebaseUser
    suspend fun signOut()
}

class FirebaseAuthRepository(
    private val auth: FirebaseAuth = FirebaseAuth.getInstance()
) : AuthRepository {
    override fun authState(): Flow<FirebaseUser?> = callbackFlow {
        val listener = FirebaseAuth.AuthStateListener { firebaseAuth ->
            trySend(firebaseAuth.currentUser)
        }
        auth.addAuthStateListener(listener)
        trySend(auth.currentUser)
        awaitClose { auth.removeAuthStateListener(listener) }
    }

    override fun currentUser(): FirebaseUser? = auth.currentUser

    override suspend fun signIn(email: String, password: String) {
        auth.signInWithEmailAndPassword(email, password).await()
    }

    override suspend fun createAccount(email: String, password: String): FirebaseUser {
        return auth.createUserWithEmailAndPassword(email, password).await().user
            ?: error("Firebase did not return the new account")
    }

    override suspend fun signOut() {
        auth.signOut()
    }
}

interface FirestoreRepository {
    fun observeUser(uid: String): Flow<DalUser?>
    fun observeMeetings(): Flow<List<DalMeeting>>
    fun observeResources(): Flow<List<DalResource>>
    suspend fun createFacultyProfile(user: FirebaseUser, displayName: String)
    suspend fun saveMeeting(meeting: DalMeeting)
    suspend fun saveResource(resource: DalResource)
}

class FirebaseFirestoreRepository(
    private val firestore: FirebaseFirestore = FirebaseFirestore.getInstance()
) : FirestoreRepository {
    override fun observeUser(uid: String): Flow<DalUser?> = callbackFlow {
        val listener = firestore.collection("users").document(uid).addSnapshotListener { snapshot, error ->
            if (error != null) {
                close(error)
                return@addSnapshotListener
            }
            val user = snapshot?.toDalUser(uid)
            trySend(user)
        }
        awaitClose { listener.remove() }
    }

    override fun observeMeetings(): Flow<List<DalMeeting>> = callbackFlow {
        val listener = firestore.collection("meetings").addSnapshotListener { snapshot, error ->
            if (error != null) {
                close(error)
                return@addSnapshotListener
            }
            val meetings = snapshot
                ?.documents
                ?.mapNotNull { doc -> doc.toDalMeeting() }
                ?.sortedByDescending { it.revision }
                .orEmpty()
            trySend(meetings)
        }
        awaitClose { listener.remove() }
    }

    override fun observeResources(): Flow<List<DalResource>> = callbackFlow {
        val listener = firestore.collection("resources").addSnapshotListener { snapshot, error ->
            if (error != null) {
                close(error)
                return@addSnapshotListener
            }
            val resources = snapshot
                ?.documents
                ?.mapNotNull { doc -> doc.toDalResource() }
                ?.sortedByDescending { it.revision }
                .orEmpty()
            trySend(resources)
        }
        awaitClose { listener.remove() }
    }

    override suspend fun createFacultyProfile(user: FirebaseUser, displayName: String) {
        val name = displayName.trim().ifBlank { user.email.orEmpty() }
        val username = name.lowercase().replace(Regex("[^a-z0-9]+"), "-").trim('-')
            .ifBlank { "faculty-${user.uid.take(8)}" }
        firestore.collection("users").document(user.uid).set(
            mapOf(
                "uid" to user.uid,
                "username" to username,
                "usernameLower" to username.lowercase(),
                "email" to user.email.orEmpty(),
                "name" to name,
                "fullName" to name,
                "role" to "faculty",
                "user_status" to "ACTIVE",
                "institution" to "Dalhousie Ghana College of Psychiatrists",
                "contactNumber" to "",
                "mainTopics" to emptyList<String>(),
                "tutorials" to emptyList<String>(),
                "revision" to 1L,
                "createdAt" to FieldValue.serverTimestamp(),
                "updatedAt" to FieldValue.serverTimestamp()
            )
        ).await()
    }

    override suspend fun saveMeeting(meeting: DalMeeting) {
        val ref = firestore.collection("meetings").document(meeting.id.ifEmpty { firestore.collection("meetings").document().id })
        firestore.runTransaction { transaction ->
            val current = transaction.get(ref)
            val revision = (current.getLong("revision") ?: 0L) + 1L
            val actorId = FirebaseAuth.getInstance().currentUser?.uid.orEmpty()
            transaction.set(ref, mapOf(
                "id" to ref.id,
                "title" to meeting.title,
                "scheduledAt" to meeting.scheduledAt,
                "revision" to revision,
                "createdBy" to (current.getString("createdBy") ?: actorId),
                "updatedBy" to actorId,
                "createdAt" to (current.get("createdAt") ?: FieldValue.serverTimestamp()),
                "updatedAt" to FieldValue.serverTimestamp()
            ))
        }.await()
    }

    override suspend fun saveResource(resource: DalResource) {
        val ref = firestore.collection("resources").document(resource.id.ifEmpty { firestore.collection("resources").document().id })
        firestore.runTransaction { transaction ->
            val current = transaction.get(ref)
            val revision = (current.getLong("revision") ?: 0L) + 1L
            val actorId = FirebaseAuth.getInstance().currentUser?.uid.orEmpty()
            transaction.set(ref, mapOf(
                "id" to ref.id,
                "title" to resource.title,
                "storagePath" to resource.storagePath,
                "downloadUrl" to resource.downloadUrl,
                "revision" to revision,
                "createdBy" to (current.getString("createdBy") ?: actorId),
                "updatedBy" to actorId,
                "createdAt" to (current.get("createdAt") ?: FieldValue.serverTimestamp()),
                "updatedAt" to FieldValue.serverTimestamp()
            ))
        }.await()
    }

    private fun DocumentSnapshot.toDalUser(uid: String): DalUser? {
        if (!exists()) return null
        return DalUser(
            uid = getString("uid") ?: uid,
            displayName = getString("name")
                ?: getString("fullName")
                ?: getString("username")
                ?: getString("email").orEmpty(),
            email = getString("email").orEmpty(),
            role = getString("role") ?: "faculty"
        )
    }

    private fun DocumentSnapshot.toDalMeeting(): DalMeeting? = toObject(DalMeeting::class.java)?.copy(id = id)
    private fun DocumentSnapshot.toDalResource(): DalResource? = toObject(DalResource::class.java)?.copy(id = id)
}

interface StorageRepository {
    suspend fun uploadResource(localUri: Uri, remotePath: String): String
}

class FirebaseStorageRepository(
    private val storage: FirebaseStorage = FirebaseStorage.getInstance()
) : StorageRepository {
    override suspend fun uploadResource(localUri: Uri, remotePath: String): String {
        val ref = storage.reference.child(remotePath)
        ref.putFile(localUri).await()
        return ref.downloadUrl.await().toString()
    }
}
