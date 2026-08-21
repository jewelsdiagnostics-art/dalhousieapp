package com.dalhousie.app.ui

import android.net.Uri
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.TextField
import androidx.compose.material3.TopAppBar
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DalhousieApp(
    viewModel: DalhousieViewModel = viewModel(factory = DalhousieViewModelFactory())
) {
    val uiState by viewModel.uiState.collectAsStateWithLifecycle()
    var currentRoute by rememberSaveable { mutableStateOf(AppRoute.Login.route) }

    LaunchedEffect(uiState.isSignedIn) {
        currentRoute = if (uiState.isSignedIn) AppRoute.Home.route else AppRoute.Login.route
    }

    val showChrome = uiState.isSignedIn

    Scaffold(
        topBar = {
            if (showChrome) {
                TopAppBar(
                    title = { Text("Dalhousie Companion") },
                    actions = {
                        TextButton(onClick = viewModel::signOut) {
                            Text("Sign out")
                        }
                    }
                )
            }
        },
        bottomBar = {
            if (showChrome) {
                NavigationBar {
                    listOf(AppRoute.Home, AppRoute.Dashboard, AppRoute.Resources, AppRoute.Notifications).forEach { destination ->
                        NavigationBarItem(
                            selected = currentRoute == destination.route,
                            onClick = { currentRoute = destination.route },
                            label = { Text(destination.route.replaceFirstChar { it.uppercase() }) },
                            icon = {}
                        )
                    }
                }
            }
        }
    ) { innerPadding ->
        when (currentRoute) {
            AppRoute.Login.route -> LoginScreen(
                modifier = Modifier.padding(innerPadding),
                isSigningIn = uiState.isAuthenticating,
                errorMessage = uiState.authError,
                onSignIn = viewModel::signIn,
                onCreateAccount = viewModel::createAccount
            )

            AppRoute.Home.route -> HomeScreen(
                modifier = Modifier.padding(innerPadding),
                uiState = uiState
            )

            AppRoute.Dashboard.route -> DashboardScreen(
                modifier = Modifier.padding(innerPadding),
                uiState = uiState
            )

            AppRoute.Resources.route -> ResourcesScreen(
                modifier = Modifier.padding(innerPadding),
                uiState = uiState,
                onUpload = viewModel::uploadResource
            )

            AppRoute.Notifications.route -> NotificationsScreen(
                modifier = Modifier.padding(innerPadding),
                uiState = uiState
            )

            else -> HomeScreen(modifier = Modifier.padding(innerPadding), uiState = uiState)
        }
    }
}

@Composable
private fun LoginScreen(
    modifier: Modifier = Modifier,
    isSigningIn: Boolean,
    errorMessage: String?,
    onSignIn: (String, String) -> Unit,
    onCreateAccount: (String, String, String) -> Unit
) {
    var createMode by rememberSaveable { mutableStateOf(false) }
    var displayName by rememberSaveable { mutableStateOf("") }
    var email by rememberSaveable { mutableStateOf("") }
    var password by rememberSaveable { mutableStateOf("") }

    Column(
        modifier = modifier.fillMaxSize().padding(24.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        Text(if (createMode) "Create faculty account" else "Sign in", style = MaterialTheme.typography.headlineMedium)
        Text(if (createMode) "Create an account for the Dalhousie companion app." else "Use the same Firebase account that also exists in the web portal.")

        if (createMode) {
            OutlinedTextField(
                value = displayName,
                onValueChange = { displayName = it },
                modifier = Modifier.fillMaxWidth(),
                label = { Text("Full name") },
                singleLine = true
            )
        }

        OutlinedTextField(
            value = email,
            onValueChange = { email = it },
            modifier = Modifier.fillMaxWidth(),
            label = { Text("Email") },
            singleLine = true
        )

        OutlinedTextField(
            value = password,
            onValueChange = { password = it },
            modifier = Modifier.fillMaxWidth(),
            label = { Text("Password") },
            singleLine = true
        )

        Button(
            onClick = {
                if (createMode) onCreateAccount(displayName, email, password)
                else onSignIn(email, password)
            },
            enabled = !isSigningIn && email.isNotBlank() && password.length >= 6 && (!createMode || displayName.isNotBlank())
        ) {
            if (isSigningIn) {
                CircularProgressIndicator(strokeWidth = 2.dp, modifier = Modifier.padding(end = 8.dp))
                Text("Signing in")
            } else {
                Text(if (createMode) "Create account" else "Continue")
            }
        }

        TextButton(onClick = { createMode = !createMode }) {
            Text(if (createMode) "Already have an account? Sign in" else "Create a new faculty account")
        }

        if (!errorMessage.isNullOrBlank()) {
            Text(errorMessage, color = MaterialTheme.colorScheme.error)
        }
    }
}

@Composable
private fun HomeScreen(
    modifier: Modifier = Modifier,
    uiState: DalhousieUiState
) {
    Column(
        modifier = modifier.fillMaxSize().padding(24.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        Text("Home", style = MaterialTheme.typography.headlineMedium)
        Text("Signed in as ${uiState.profile?.displayName ?: uiState.profile?.email ?: "User"}")
        Text("Role: ${uiState.profile?.role ?: "faculty"}")
        Text("This companion app can surface meetings, notices, and quick actions for faculty.")
    }
}

@Composable
private fun DashboardScreen(
    modifier: Modifier = Modifier,
    uiState: DalhousieUiState
) {
    LazyColumn(
        modifier = modifier.fillMaxSize().padding(24.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp),
        contentPadding = PaddingValues(bottom = 24.dp)
    ) {
        item {
            Text("Dashboard", style = MaterialTheme.typography.headlineMedium)
            Text("Live Firestore data appears here.")
        }
        item {
            Card(modifier = Modifier.fillMaxWidth()) {
                Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(4.dp)) {
                    Text("Profile", style = MaterialTheme.typography.titleMedium)
                    Text(uiState.profile?.displayName ?: uiState.profile?.email ?: "Not loaded yet")
                    Text("Role: ${uiState.profile?.role ?: "faculty"}")
                }
            }
        }
        item {
            Card(modifier = Modifier.fillMaxWidth()) {
                Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Text("Meetings", style = MaterialTheme.typography.titleMedium)
                    if (uiState.meetings.isEmpty()) {
                        Text("No meeting documents yet.")
                    } else {
                        uiState.meetings.take(5).forEach { meeting ->
                            Text("• ${meeting.title.ifBlank { meeting.id }}")
                        }
                    }
                }
            }
        }
        item {
            Card(modifier = Modifier.fillMaxWidth()) {
                Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Text("Resources", style = MaterialTheme.typography.titleMedium)
                    if (uiState.resources.isEmpty()) {
                        Text("No resources uploaded yet.")
                    } else {
                        uiState.resources.take(5).forEach { resource ->
                            Text("• ${resource.title.ifBlank { resource.id }}")
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun ResourcesScreen(
    modifier: Modifier = Modifier,
    uiState: DalhousieUiState,
    onUpload: (String, String, Uri) -> Unit
) {
    var title by rememberSaveable { mutableStateOf("") }
    var remotePath by rememberSaveable { mutableStateOf("") }
    var pickedUri by remember { mutableStateOf<Uri?>(null) }
    var localName by rememberSaveable { mutableStateOf("No file selected") }
    val picker = rememberLauncherForActivityResult(ActivityResultContracts.GetContent()) { uri ->
        pickedUri = uri
        localName = uri?.lastPathSegment ?: "No file selected"
    }

    Column(
        modifier = modifier.fillMaxSize().padding(24.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        Text("Resources", style = MaterialTheme.typography.headlineMedium)
        Text("Administrators can upload files to Firebase Storage and save metadata in Firestore.")

        OutlinedTextField(
            value = title,
            onValueChange = { title = it },
            modifier = Modifier.fillMaxWidth(),
            label = { Text("Resource title") }
        )

        OutlinedTextField(
            value = remotePath,
            onValueChange = { remotePath = it },
            modifier = Modifier.fillMaxWidth(),
            label = { Text("Storage path") }
        )

        Text("Selected file: $localName")

        Button(onClick = { picker.launch("*/*") }) {
            Text("Choose File")
        }

        Button(
            onClick = {
                val uri = pickedUri ?: return@Button
                onUpload(title, remotePath, uri)
            },
            enabled = pickedUri != null
        ) {
            Text("Upload to Firebase")
        }

        if (!uiState.uploadStatus.isNullOrBlank()) {
            Text(uiState.uploadStatus)
        }

        Card(modifier = Modifier.fillMaxWidth()) {
            Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                Text("Uploaded resources", style = MaterialTheme.typography.titleMedium)
                if (uiState.resources.isEmpty()) {
                    Text("No resources uploaded yet.")
                } else {
                    uiState.resources.forEach { resource ->
                        Text("• ${resource.title} -> ${resource.downloadUrl.ifBlank { resource.storagePath }}")
                    }
                }
            }
        }
    }
}

@Composable
private fun NotificationsScreen(
    modifier: Modifier = Modifier,
    uiState: DalhousieUiState
) {
    Column(
        modifier = modifier.fillMaxSize().padding(24.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        Text("Notifications", style = MaterialTheme.typography.headlineMedium)
        Text("Wire this screen to Firebase Cloud Messaging for reminders and alerts.")
        Text("Current user: ${uiState.profile?.email ?: "not signed in"}")
    }
}
