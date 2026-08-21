package com.dalhousie.app.ui

import android.net.Uri
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.dalhousie.app.data.AuthRepository
import com.dalhousie.app.data.DalMeeting
import com.dalhousie.app.data.DalResource
import com.dalhousie.app.data.DalUser
import com.dalhousie.app.data.FirebaseAuthRepository
import com.dalhousie.app.data.FirebaseFirestoreRepository
import com.dalhousie.app.data.FirebaseStorageRepository
import com.dalhousie.app.data.FirestoreRepository
import com.dalhousie.app.data.StorageRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.collectLatest
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

data class DalhousieUiState(
    val isAuthenticating: Boolean = false,
    val authError: String? = null,
    val profile: DalUser? = null,
    val meetings: List<DalMeeting> = emptyList(),
    val resources: List<DalResource> = emptyList(),
    val uploadStatus: String? = null
) {
    val isSignedIn: Boolean get() = profile != null
}

class DalhousieViewModel(
    private val authRepository: AuthRepository = FirebaseAuthRepository(),
    private val firestoreRepository: FirestoreRepository = FirebaseFirestoreRepository(),
    private val storageRepository: StorageRepository = FirebaseStorageRepository()
) : ViewModel() {

    private val _uiState = MutableStateFlow(DalhousieUiState())
    val uiState: StateFlow<DalhousieUiState> = _uiState.asStateFlow()

    init {
        observeAuth()
        observeCollections()
    }

    private fun observeAuth() {
        viewModelScope.launch {
            authRepository.authState().collectLatest { user ->
                if (user == null) {
                    _uiState.update {
                        it.copy(profile = null, isAuthenticating = false, authError = null)
                    }
                } else {
                    firestoreRepository.observeUser(user.uid).collectLatest { profile ->
                        _uiState.update {
                            it.copy(
                                profile = profile ?: DalUser(uid = user.uid, displayName = user.email.orEmpty(), email = user.email.orEmpty(), role = "faculty"),
                                isAuthenticating = false,
                                authError = null
                            )
                        }
                    }
                }
            }
        }
    }

    private fun observeCollections() {
        viewModelScope.launch {
            firestoreRepository.observeMeetings().collectLatest { meetings ->
                _uiState.update { it.copy(meetings = meetings) }
            }
        }
        viewModelScope.launch {
            firestoreRepository.observeResources().collectLatest { resources ->
                _uiState.update { it.copy(resources = resources) }
            }
        }
    }

    fun signIn(email: String, password: String) {
        viewModelScope.launch {
            _uiState.update { it.copy(isAuthenticating = true, authError = null) }
            runCatching {
                authRepository.signIn(email.trim(), password)
            }.onFailure { error ->
                _uiState.update {
                    it.copy(
                        isAuthenticating = false,
                        authError = error.message ?: "Sign in failed"
                    )
                }
            }
        }
    }

    fun createAccount(displayName: String, email: String, password: String) {
        viewModelScope.launch {
            _uiState.update { it.copy(isAuthenticating = true, authError = null) }
            runCatching {
                val user = authRepository.createAccount(email.trim(), password)
                firestoreRepository.createFacultyProfile(user, displayName)
            }.onFailure { error ->
                _uiState.update {
                    it.copy(
                        isAuthenticating = false,
                        authError = error.message ?: "Account creation failed"
                    )
                }
            }
        }
    }

    fun signOut() {
        viewModelScope.launch {
            authRepository.signOut()
            _uiState.update {
                DalhousieUiState(
                    meetings = it.meetings,
                    resources = it.resources
                )
            }
        }
    }

    fun uploadResource(title: String, remotePath: String, localUri: Uri) {
        viewModelScope.launch {
            if (_uiState.value.profile?.role != "admin") {
                _uiState.update { it.copy(uploadStatus = "Only administrators can upload resources.") }
                return@launch
            }
            _uiState.update { it.copy(uploadStatus = "Uploading...") }
            runCatching {
                val safePath = normalizeRemotePath(remotePath, title)
                val downloadUrl = storageRepository.uploadResource(localUri, safePath)
                firestoreRepository.saveResource(
                    DalResource(
                        title = title.ifBlank { "Untitled resource" },
                        storagePath = safePath,
                        downloadUrl = downloadUrl
                    )
                )
            }.onSuccess {
                _uiState.update { it.copy(uploadStatus = "Upload complete") }
            }.onFailure { error ->
                _uiState.update { it.copy(uploadStatus = error.message ?: "Upload failed") }
            }
        }
    }

    fun clearUploadStatus() {
        _uiState.update { it.copy(uploadStatus = null) }
    }

    private fun normalizeRemotePath(remotePath: String, title: String): String {
        val base = remotePath.ifBlank {
            val safeTitle = title.ifBlank { "upload" }
            "resources/$safeTitle-${System.currentTimeMillis()}"
        }
        return base
            .trim()
            .replace("\\", "/")
            .split("/")
            .joinToString("/") { segment ->
                segment.trim().lowercase().replace(Regex("[^a-z0-9._-]+"), "-")
            }
            .trim('/')
    }
}

class DalhousieViewModelFactory : ViewModelProvider.Factory {
    @Suppress("UNCHECKED_CAST")
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        if (modelClass.isAssignableFrom(DalhousieViewModel::class.java)) {
            return DalhousieViewModel() as T
        }
        throw IllegalArgumentException("Unknown ViewModel class: ${modelClass.name}")
    }
}
