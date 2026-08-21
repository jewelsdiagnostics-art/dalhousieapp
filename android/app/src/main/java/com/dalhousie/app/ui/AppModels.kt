package com.dalhousie.app.ui

data class DashboardCard(
    val title: String,
    val value: String,
    val helperText: String
)

sealed class AppRoute(val route: String) {
    data object Login : AppRoute("login")
    data object Home : AppRoute("home")
    data object Dashboard : AppRoute("dashboard")
    data object Resources : AppRoute("resources")
    data object Notifications : AppRoute("notifications")
}
