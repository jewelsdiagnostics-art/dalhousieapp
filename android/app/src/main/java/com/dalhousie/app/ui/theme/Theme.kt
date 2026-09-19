package com.dalhousie.app.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.ui.graphics.Color

private val LightColors = lightColorScheme(
    primary = DalPrimary,
    primaryContainer = Color(0xFFDBEAFE),
    onPrimaryContainer = Color(0xFF123A5A),
    secondary = DalSky,
    secondaryContainer = Color(0xFFE0F2FE),
    onSecondaryContainer = Color(0xFF0C4A6E),
    tertiary = DalAccent,
    tertiaryContainer = Color(0xFFCCFBF1),
    onTertiaryContainer = Color(0xFF134E4A),
    background = DalBackground,
    surface = DalSurface,
    surfaceVariant = Color(0xFFF1F5F9),
    outline = DalBorder,
    onPrimary = androidx.compose.ui.graphics.Color.White,
    onSecondary = androidx.compose.ui.graphics.Color.White,
    onBackground = DalText,
    onSurface = DalText
)

private val DarkColors = darkColorScheme(
    primary = androidx.compose.ui.graphics.Color(0xFF93C5FD),
    primaryContainer = androidx.compose.ui.graphics.Color(0xFF1E3A5F),
    onPrimaryContainer = androidx.compose.ui.graphics.Color(0xFFDBEAFE),
    secondary = androidx.compose.ui.graphics.Color(0xFF7DD3FC),
    secondaryContainer = androidx.compose.ui.graphics.Color(0xFF123B58),
    onSecondaryContainer = androidx.compose.ui.graphics.Color(0xFFE0F2FE),
    tertiary = androidx.compose.ui.graphics.Color(0xFF6EE7B7),
    tertiaryContainer = androidx.compose.ui.graphics.Color(0xFF12352F),
    onTertiaryContainer = androidx.compose.ui.graphics.Color(0xFFCCFBF1),
    background = androidx.compose.ui.graphics.Color(0xFF0B1220),
    surface = androidx.compose.ui.graphics.Color(0xFF111B2E),
    surfaceVariant = androidx.compose.ui.graphics.Color(0xFF16243D),
    outline = androidx.compose.ui.graphics.Color(0xFF3A5072),
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
