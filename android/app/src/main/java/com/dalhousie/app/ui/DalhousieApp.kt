package com.dalhousie.app.ui

import android.content.Intent
import android.net.Uri
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.AssistChip
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.FilterChip
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel
import com.dalhousie.app.ui.theme.DalNavy

private val bottomRoutes = listOf(AppRoute.Dashboard, AppRoute.Membership, AppRoute.Fellowship, AppRoute.Progress, AppRoute.Resources)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DalhousieApp(viewModel: DalhousieViewModel = viewModel(factory = DalhousieViewModelFactory())) {
    val uiState by viewModel.uiState.collectAsStateWithLifecycle()
    var currentRoute by rememberSaveable { mutableStateOf(AppRoute.Login.route) }
    LaunchedEffect(uiState.isSignedIn) { currentRoute = if (uiState.isSignedIn) AppRoute.Dashboard.route else AppRoute.Login.route }
    if (!uiState.isSignedIn) {
        LoginScreen(uiState.isAuthenticating, uiState.authError, viewModel::signIn, viewModel::createAccount)
        return
    }
    val navigate: (AppRoute) -> Unit = { currentRoute = it.route }
    Scaffold(
        containerColor = MaterialTheme.colorScheme.background,
        topBar = {
            TopAppBar(
                title = { Column { Text("Dalhousie Companion", fontWeight = FontWeight.SemiBold); Text("GCPS Joint Academic Programme", style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.onSurfaceVariant) } },
                actions = { TextButton(onClick = viewModel::signOut) { Text("Log out") } },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = MaterialTheme.colorScheme.surface)
            )
        },
        bottomBar = {
            NavigationBar(containerColor = MaterialTheme.colorScheme.surface) {
                bottomRoutes.forEach { destination ->
                    NavigationBarItem(selected = currentRoute == destination.route, onClick = { navigate(destination) }, label = { Text(routeLabel(destination), maxLines = 1, overflow = TextOverflow.Ellipsis) }, icon = { Text(routeMark(destination), fontWeight = FontWeight.Bold) })
                }
            }
        }
    ) { innerPadding ->
        when (currentRoute) {
            AppRoute.Dashboard.route -> DashboardScreen(Modifier.padding(innerPadding), uiState, navigate)
            AppRoute.Membership.route -> CurriculumScreen(Modifier.padding(innerPadding), "Membership curriculum", "Core knowledge, assessment and professional practice.", membershipGroups)
            AppRoute.Fellowship.route -> CurriculumScreen(Modifier.padding(innerPadding), "Fellowship curriculum", "Advanced clinical, research and leadership development.", fellowshipGroups)
            AppRoute.Progress.route -> ProgressScreen(Modifier.padding(innerPadding), uiState, navigate)
            AppRoute.Meetings.route -> MeetingsScreen(Modifier.padding(innerPadding), uiState)
            AppRoute.Faculty.route -> FacultyScreen(Modifier.padding(innerPadding), uiState)
            AppRoute.Resources.route -> ResourcesScreen(Modifier.padding(innerPadding), uiState, viewModel::uploadResource)
            AppRoute.Notifications.route -> NotificationsScreen(Modifier.padding(innerPadding), uiState)
            AppRoute.Admin.route -> AdminScreen(Modifier.padding(innerPadding), uiState, navigate)
            else -> DashboardScreen(Modifier.padding(innerPadding), uiState, navigate)
        }
    }
}

private fun routeLabel(route: AppRoute): String = when (route) {
    AppRoute.Dashboard -> "Home"
    AppRoute.Membership -> "Membership"
    AppRoute.Fellowship -> "Fellowship"
    AppRoute.Progress -> "Progress"
    AppRoute.Resources -> "Resources"
    else -> route.route.replaceFirstChar { it.uppercase() }
}

private fun routeMark(route: AppRoute): String = when (route) {
    AppRoute.Dashboard -> "H"
    AppRoute.Membership -> "M"
    AppRoute.Fellowship -> "F"
    AppRoute.Progress -> "%"
    AppRoute.Resources -> "R"
    else -> "•"
}

@Composable
private fun LoginScreen(isSigningIn: Boolean, errorMessage: String?, onSignIn: (String, String) -> Unit, onCreateAccount: (String, String, String) -> Unit) {
    var createMode by rememberSaveable { mutableStateOf(false) }
    var displayName by rememberSaveable { mutableStateOf("") }
    var email by rememberSaveable { mutableStateOf("") }
    var password by rememberSaveable { mutableStateOf("") }
    Box(Modifier.fillMaxSize().background(DalNavy), contentAlignment = Alignment.Center) {
        Card(Modifier.fillMaxWidth().padding(20.dp), shape = RoundedCornerShape(28.dp), colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)) {
            Column(Modifier.padding(26.dp), verticalArrangement = Arrangement.spacedBy(14.dp)) {
                Text("DALHOUSIE / GCPS", style = MaterialTheme.typography.labelLarge, color = MaterialTheme.colorScheme.primary, fontWeight = FontWeight.Bold)
                Text(if (createMode) "Create your teaching profile" else "Welcome back", style = MaterialTheme.typography.headlineMedium, fontWeight = FontWeight.Bold)
                Text(if (createMode) "Join the secure academic programme workspace." else "Sign in to meetings, curriculum, resources and progress.", color = MaterialTheme.colorScheme.onSurfaceVariant)
                HorizontalDivider()
                if (createMode) OutlinedTextField(displayName, { displayName = it }, Modifier.fillMaxWidth(), label = { Text("Full name") }, singleLine = true)
                OutlinedTextField(email, { email = it }, Modifier.fillMaxWidth(), label = { Text("Email address") }, singleLine = true)
                OutlinedTextField(password, { password = it }, Modifier.fillMaxWidth(), label = { Text("Password") }, visualTransformation = PasswordVisualTransformation(), singleLine = true)
                Button(onClick = { if (createMode) onCreateAccount(displayName, email, password) else onSignIn(email, password) }, enabled = !isSigningIn, modifier = Modifier.fillMaxWidth().height(52.dp), shape = RoundedCornerShape(14.dp), colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.primary)) {
                    if (isSigningIn) CircularProgressIndicator(Modifier.size(20.dp), strokeWidth = 2.dp) else Text(if (createMode) "Create account" else "Continue", fontWeight = FontWeight.SemiBold)
                }
                TextButton(onClick = { createMode = !createMode }, modifier = Modifier.fillMaxWidth()) { Text(if (createMode) "Already have an account? Sign in" else "Create a new faculty account") }
                if (!errorMessage.isNullOrBlank()) Text(errorMessage, color = MaterialTheme.colorScheme.error, style = MaterialTheme.typography.bodySmall)
            }
        }
    }
}

@Composable
private fun DashboardScreen(modifier: Modifier, uiState: DalhousieUiState, navigate: (AppRoute) -> Unit) {
    LazyColumn(modifier.fillMaxSize(), contentPadding = PaddingValues(20.dp), verticalArrangement = Arrangement.spacedBy(16.dp)) {
        item { Text("Good to see you", style = MaterialTheme.typography.labelLarge, color = MaterialTheme.colorScheme.primary); Text(uiState.profile?.displayName?.ifBlank { "Academic colleague" } ?: "Academic colleague", style = MaterialTheme.typography.headlineMedium, fontWeight = FontWeight.Bold); Text("Your programme workspace at a glance.", color = MaterialTheme.colorScheme.onSurfaceVariant) }
        item { Row(horizontalArrangement = Arrangement.spacedBy(10.dp), modifier = Modifier.fillMaxWidth()) { StatCard("Meetings", uiState.meetings.size.toString(), "shared records", Modifier.weight(1f)); StatCard("Resources", uiState.resources.size.toString(), "available files", Modifier.weight(1f)) } }
        item { Card(colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.primaryContainer), shape = RoundedCornerShape(20.dp)) { Column(Modifier.padding(18.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) { Text("Academic focus", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold); Text("Continue building your curriculum and keep your programme activity in one place.", color = MaterialTheme.colorScheme.onPrimaryContainer); Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) { AssistChip(onClick = { navigate(AppRoute.Membership) }, label = { Text("Membership") }); AssistChip(onClick = { navigate(AppRoute.Fellowship) }, label = { Text("Fellowship") }) } } } }
        item { SectionTitle("Quick actions") }
        item { Row(horizontalArrangement = Arrangement.spacedBy(10.dp), modifier = Modifier.fillMaxWidth()) { ActionCard("Progress", "Track learning", { navigate(AppRoute.Progress) }, Modifier.weight(1f)); ActionCard("Meetings", "View minutes", { navigate(AppRoute.Meetings) }, Modifier.weight(1f)) } }
        item { Row(horizontalArrangement = Arrangement.spacedBy(10.dp), modifier = Modifier.fillMaxWidth()) { ActionCard("Directory", "Find faculty", { navigate(AppRoute.Faculty) }, Modifier.weight(1f)); ActionCard("Updates", "Notifications", { navigate(AppRoute.Notifications) }, Modifier.weight(1f)) } }
        if (uiState.profile?.role == "admin") item { OutlinedButton(onClick = { navigate(AppRoute.Admin) }, modifier = Modifier.fillMaxWidth()) { Text("Open administrator workspace") } }
    }
}

@Composable
private fun StatCard(title: String, value: String, helper: String, modifier: Modifier) { Card(modifier, shape = RoundedCornerShape(18.dp), colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)) { Column(Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(4.dp)) { Text(title, style = MaterialTheme.typography.labelLarge, color = MaterialTheme.colorScheme.onSurfaceVariant); Text(value, style = MaterialTheme.typography.headlineMedium, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.primary); Text(helper, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant) } } }

@Composable
private fun ActionCard(title: String, subtitle: String, onClick: () -> Unit, modifier: Modifier) { Card(onClick = onClick, modifier = modifier, shape = RoundedCornerShape(16.dp)) { Column(Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(5.dp)) { Text(title, fontWeight = FontWeight.SemiBold); Text(subtitle, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant) } } }

@Composable private fun SectionTitle(text: String) { Text(text, style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold) }

private data class CurriculumGroup(val title: String, val description: String, val topics: List<String>)
private val membershipGroups = listOf(
    CurriculumGroup("Foundations & orientation", "Core concepts and clinical reasoning.", listOf("Psychiatry as a Holistic Discipline", "Diagnostic Manuals & Classification", "Ethical & Legal Considerations")),
    CurriculumGroup("Basic sciences", "The foundation for specialist psychiatry.", listOf("Introduction to Psychiatry", "Basic Psychology", "Social Psychology", "Basic Neurosciences")),
    CurriculumGroup("Assessment & diagnostic skills", "Scales, testing and case formulation.", listOf("Psychiatric Rating Scales & Instruments", "Psychological Testing", "Epidemiology", "Biostatistics")),
    CurriculumGroup("Professional practice", "Teaching, supervision and communication.", listOf("Teaching Methods & Instruction", "Monitoring, Supervision & Mentorship", "Skills and Competencies"))
)
private val fellowshipGroups = listOf(
    CurriculumGroup("Clinical psychiatry core", "General adult psychiatry and daily clinical care.", listOf("Clinical Topics", "Psychopharmacology & Medication Management", "Psychiatric Emergencies in Medical Settings")),
    CurriculumGroup("Specialty rotations", "Advanced specialty and liaison care.", listOf("Child & Adolescent Psychiatry", "Addiction Psychiatry", "Geriatric Psychiatry", "Forensic Psychiatry", "Neuropsychiatry")),
    CurriculumGroup("Research & leadership", "Research methods, policy and advocacy.", listOf("Psychiatric Genetics & Epigenetics", "Brain Imaging Techniques", "Global Mental Health Challenges", "Advocacy & Policy Development")),
    CurriculumGroup("Community and rehabilitation", "Recovery, outreach and service development.", listOf("Community & Rehabilitation Psychiatry", "Mental Health & Disability", "Palliative Care & Psychological Support"))
)

@Composable
private fun CurriculumScreen(modifier: Modifier, title: String, subtitle: String, groups: List<CurriculumGroup>) {
    var query by rememberSaveable { mutableStateOf("") }
    val filtered = groups.map { group -> group.copy(topics = group.topics.filter { it.contains(query, ignoreCase = true) }) }.filter { it.topics.isNotEmpty() || query.isBlank() }
    LazyColumn(modifier.fillMaxSize(), contentPadding = PaddingValues(20.dp), verticalArrangement = Arrangement.spacedBy(14.dp)) {
        item { Text(title, style = MaterialTheme.typography.headlineMedium, fontWeight = FontWeight.Bold); Text(subtitle, color = MaterialTheme.colorScheme.onSurfaceVariant) }
        item { OutlinedTextField(query, { query = it }, Modifier.fillMaxWidth(), label = { Text("Search tutorials") }, singleLine = true) }
        items(filtered) { group -> Card(shape = RoundedCornerShape(18.dp)) { Column(Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) { Text(group.title, style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold); Text(group.description, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant); group.topics.forEach { topic -> FilterChip(selected = false, onClick = { }, label = { Text(topic, maxLines = 2, overflow = TextOverflow.Ellipsis) }) } } } }
    }
}

@Composable
private fun ProgressScreen(modifier: Modifier, uiState: DalhousieUiState, navigate: (AppRoute) -> Unit) {
    LazyColumn(modifier.fillMaxSize(), contentPadding = PaddingValues(20.dp), verticalArrangement = Arrangement.spacedBy(16.dp)) {
        item { Text("Progress tracker", style = MaterialTheme.typography.headlineMedium, fontWeight = FontWeight.Bold); Text("Keep your learning activity visible and current.", color = MaterialTheme.colorScheme.onSurfaceVariant) }
        item { Card(shape = RoundedCornerShape(20.dp)) { Column(Modifier.padding(18.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) { Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) { Text("Programme completion", fontWeight = FontWeight.SemiBold); Text("0%", color = MaterialTheme.colorScheme.primary, fontWeight = FontWeight.Bold) }; LinearProgressIndicator(progress = { 0f }, modifier = Modifier.fillMaxWidth()); Text("Select tutorials and record activity from the web workspace to keep both platforms synchronized.", style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant) } } }
        item { ActionCard("Browse membership", "Choose core topics", { navigate(AppRoute.Membership) }, Modifier.fillMaxWidth()) }
        item { ActionCard("Browse fellowship", "Choose advanced topics", { navigate(AppRoute.Fellowship) }, Modifier.fillMaxWidth()) }
        item { SectionTitle("Live activity") }
        item { Text("${uiState.meetings.size} meetings and ${uiState.resources.size} resources are currently synchronized from Firebase.", color = MaterialTheme.colorScheme.onSurfaceVariant) }
    }
}

@Composable
private fun MeetingsScreen(modifier: Modifier, uiState: DalhousieUiState) { LazyColumn(modifier.fillMaxSize(), contentPadding = PaddingValues(20.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) { item { Text("Meetings & minutes", style = MaterialTheme.typography.headlineMedium, fontWeight = FontWeight.Bold); Text("Shared programme records from Firestore.", color = MaterialTheme.colorScheme.onSurfaceVariant) }; if (uiState.meetings.isEmpty()) item { EmptyState("No meetings yet", "Meeting records will appear here when the administrator publishes them.") }; items(uiState.meetings) { meeting -> Card(shape = RoundedCornerShape(16.dp)) { Column(Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(5.dp)) { Text(meeting.title.ifBlank { "Untitled meeting" }, fontWeight = FontWeight.SemiBold); Text("Revision ${meeting.revision}", style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant) } } } } }

@Composable
private fun FacultyScreen(modifier: Modifier, uiState: DalhousieUiState) { LazyColumn(modifier.fillMaxSize(), contentPadding = PaddingValues(20.dp), verticalArrangement = Arrangement.spacedBy(14.dp)) { item { Text("Faculty directory", style = MaterialTheme.typography.headlineMedium, fontWeight = FontWeight.Bold); Text("Programme colleagues and teaching contacts.", color = MaterialTheme.colorScheme.onSurfaceVariant) }; item { Card(shape = RoundedCornerShape(18.dp), colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.primaryContainer)) { Column(Modifier.padding(18.dp), verticalArrangement = Arrangement.spacedBy(5.dp)) { Text("Your profile", fontWeight = FontWeight.Bold); Text(uiState.profile?.displayName?.ifBlank { uiState.profile.email } ?: "Profile loading"); Text(uiState.profile?.role?.replaceFirstChar { it.uppercase() } ?: "Faculty", style = MaterialTheme.typography.bodySmall) } } }; item { EmptyState("Directory synchronization", "The complete faculty directory is managed centrally in Firebase and will appear here as directory access is enabled for this release.") } } }

@Composable
private fun ResourcesScreen(modifier: Modifier, uiState: DalhousieUiState, onUpload: (String, String, Uri) -> Unit) {
    val context = LocalContext.current
    var title by rememberSaveable { mutableStateOf("") }
    var remotePath by rememberSaveable { mutableStateOf("") }
    var pickedUri by remember { mutableStateOf<Uri?>(null) }
    var localName by rememberSaveable { mutableStateOf("No file selected") }
    val picker = rememberLauncherForActivityResult(ActivityResultContracts.GetContent()) { uri -> pickedUri = uri; localName = uri?.lastPathSegment ?: "No file selected" }
    LazyColumn(modifier.fillMaxSize(), contentPadding = PaddingValues(20.dp), verticalArrangement = Arrangement.spacedBy(14.dp)) {
        item { Text("Resources", style = MaterialTheme.typography.headlineMedium, fontWeight = FontWeight.Bold); Text("Download programme materials and share documents securely.", color = MaterialTheme.colorScheme.onSurfaceVariant) }
        if (uiState.profile?.role == "admin") item { Card(shape = RoundedCornerShape(18.dp), colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.secondaryContainer)) { Column(Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) { Text("Administrator upload", fontWeight = FontWeight.Bold); OutlinedTextField(title, { title = it }, Modifier.fillMaxWidth(), label = { Text("Resource title") }, singleLine = true); OutlinedTextField(remotePath, { remotePath = it }, Modifier.fillMaxWidth(), label = { Text("Storage path (optional)") }, singleLine = true); Text(localName, style = MaterialTheme.typography.bodySmall); Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) { OutlinedButton(onClick = { picker.launch("*/*") }) { Text("Choose file") }; Button(onClick = { pickedUri?.let { onUpload(title, remotePath, it) } }, enabled = pickedUri != null) { Text("Upload") } }; uiState.uploadStatus?.let { Text(it, style = MaterialTheme.typography.bodySmall) } } } }
        item { SectionTitle("Available resources") }
        if (uiState.resources.isEmpty()) item { EmptyState("No resources published", "Files uploaded by the programme administrator will appear here.") }
        items(uiState.resources) { resource -> Card(shape = RoundedCornerShape(16.dp)) { Row(Modifier.fillMaxWidth().padding(16.dp), verticalAlignment = Alignment.CenterVertically) { Column(Modifier.weight(1f)) { Text(resource.title.ifBlank { "Untitled resource" }, fontWeight = FontWeight.SemiBold); Text("Revision ${resource.revision}", style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant) }; if (resource.downloadUrl.isNotBlank()) TextButton(onClick = { runCatching { context.startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(resource.downloadUrl))) } }) { Text("Download") } } } }
    }
}

@Composable
private fun NotificationsScreen(modifier: Modifier, uiState: DalhousieUiState) { Column(modifier.fillMaxSize().padding(20.dp), verticalArrangement = Arrangement.spacedBy(14.dp)) { Text("Notifications", style = MaterialTheme.typography.headlineMedium, fontWeight = FontWeight.Bold); Text("Programme updates and reminders will appear here.", color = MaterialTheme.colorScheme.onSurfaceVariant); EmptyState("You are up to date", "Signed in as ${uiState.profile?.email ?: "your account"}.") } }

@Composable
private fun AdminScreen(modifier: Modifier, uiState: DalhousieUiState, navigate: (AppRoute) -> Unit) { Column(modifier.fillMaxSize().padding(20.dp), verticalArrangement = Arrangement.spacedBy(14.dp)) { Text("Administrator workspace", style = MaterialTheme.typography.headlineMedium, fontWeight = FontWeight.Bold); Text("Manage shared records with revision-safe Firebase synchronization.", color = MaterialTheme.colorScheme.onSurfaceVariant); ActionCard("Resources", "Upload and publish files", { navigate(AppRoute.Resources) }, Modifier.fillMaxWidth()); ActionCard("Audit and restore", "Review protected changes", { }, Modifier.fillMaxWidth()); ActionCard("User management", "Manage access centrally", { }, Modifier.fillMaxWidth()); Text("Signed in as ${uiState.profile?.email ?: "administrator"}", style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant) } }

@Composable
private fun EmptyState(title: String, body: String) { Surface(shape = RoundedCornerShape(18.dp), color = MaterialTheme.colorScheme.surfaceVariant) { Column(Modifier.fillMaxWidth().padding(18.dp), verticalArrangement = Arrangement.spacedBy(5.dp)) { Text(title, fontWeight = FontWeight.SemiBold); Text(body, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant) } } }
