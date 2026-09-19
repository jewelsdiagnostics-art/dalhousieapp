package com.dalhousie.app.ui

data class DashboardCard(
    val title: String,
    val value: String,
    val helperText: String
)

sealed class AppRoute(val route: String) {
    data object Login : AppRoute("login")
    data object Dashboard : AppRoute("dashboard")
    data object Membership : AppRoute("membership")
    data object Fellowship : AppRoute("fellowship")
    data object Progress : AppRoute("progress")
    data object Meetings : AppRoute("meetings")
    data object Faculty : AppRoute("faculty")
    data object Resources : AppRoute("resources")
    data object Notifications : AppRoute("notifications")
    data object Admin : AppRoute("admin")
}
