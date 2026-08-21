package com.dalhousie.app.ui.theme

import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.runtime.Composable
import androidx.compose.foundation.isSystemInDarkTheme

private val LightColors = lightColorScheme(
    primary = DalPrimary,
    secondary = DalAccent,
    background = DalBackground,
    surface = DalSurface,
    onPrimary = androidx.compose.ui.graphics.Color.White,
    onSecondary = androidx.compose.ui.graphics.Color.White,
    onBackground = DalText,
    onSurface = DalText
)

private val DarkColors = darkColorScheme(
    primary = androidx.compose.ui.graphics.Color(0xFF60A5FA),
    secondary = androidx.compose.ui.graphics.Color(0xFF34D399),
    background = androidx.compose.ui.graphics.Color(0xFF0B1220),
    surface = androidx.compose.ui.graphics.Color(0xFF111B2E),
    onPrimary = androidx.compose.ui.graphics.Color(0xFF0B1220),
    onSecondary = androidx.compose.ui.graphics.Color(0xFF0B1220),
    onBackground = androidx.compose.ui.graphics.Color(0xFFF8FBFF),
    onSurface = androidx.compose.ui.graphics.Color(0xFFF8FBFF)
)

@Composable
fun DalhousieTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = if (isSystemInDarkTheme()) DarkColors else LightColors,
        typography = DalTypography,
        content = content
    )
}
