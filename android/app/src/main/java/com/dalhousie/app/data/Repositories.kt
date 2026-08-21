package com.dalhousie.app.data

import android.net.Uri
import com.google.firebase.auth.FirebaseUser
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.firestore.QueryDocumentSnapshot
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

    override suspend fun signOut() {
        auth.signOut()
    }
}

interface FirestoreRepository {
    fun observeUser(uid: String): Flow<DalUser?>
    fun observeMeetings(): Flow<List<DalMeeting>>
    fun observeResources(): Flow<List<DalResource>>
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
            val user = snapshot?.toObject(DalUser::class.java)
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

    override suspend fun saveMeeting(meeting: DalMeeting) {
        val ref = firestore.collection("meetings").document(meeting.id.ifEmpty { firestore.collection("meetings").document().id })
        ref.set(meeting.copy(id = ref.id, revision = meeting.revision + 1)).await()
    }

    override suspend fun saveResource(resource: DalResource) {
        val ref = firestore.collection("resources").document(resource.id.ifEmpty { firestore.collection("resources").document().id })
        ref.set(resource.copy(id = ref.id, revision = resource.revision + 1)).await()
    }

    private fun QueryDocumentSnapshot.toDalMeeting(): DalMeeting? = toObject(DalMeeting::class.java)?.copy(id = id)
    private fun QueryDocumentSnapshot.toDalResource(): DalResource? = toObject(DalResource::class.java)?.copy(id = id)
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
