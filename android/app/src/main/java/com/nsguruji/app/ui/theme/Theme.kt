package com.nsguruji.app.ui.theme

import android.app.Activity
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.SideEffect
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.platform.LocalView
import androidx.core.view.WindowCompat

private val LightColorScheme = lightColorScheme(
    primary = BrandPrimaryBlue,
    onPrimary = SurfaceLight,
    primaryContainer = BrandLightBlue.copy(alpha = 0.12f),
    onPrimaryContainer = BrandDarkBlue,
    secondary = BrandPrimaryRed,
    onSecondary = SurfaceLight,
    secondaryContainer = BrandPrimaryRed.copy(alpha = 0.1f),
    onSecondaryContainer = BrandPrimaryRed,
    tertiary = BrandAccentRed,
    background = BackgroundLight,
    onBackground = TextPrimaryLight,
    surface = SurfaceLight,
    onSurface = TextPrimaryLight,
    surfaceVariant = SurfaceVariantLight,
    onSurfaceVariant = TextSecondaryLight,
    outline = BorderLight
)

private val DarkColorScheme = darkColorScheme(
    primary = BrandLightBlue,
    onPrimary = BackgroundDark,
    primaryContainer = BrandPrimaryBlue.copy(alpha = 0.3f),
    onPrimaryContainer = SurfaceLight,
    secondary = BrandAccentRed,
    onSecondary = SurfaceLight,
    secondaryContainer = BrandPrimaryRed.copy(alpha = 0.2f),
    onSecondaryContainer = BrandAccentRed,
    tertiary = BrandGold,
    background = BackgroundDark,
    onBackground = TextPrimaryDark,
    surface = SurfaceDark,
    onSurface = TextPrimaryDark,
    surfaceVariant = SurfaceVariantDark,
    onSurfaceVariant = TextSecondaryDark,
    outline = BorderDark
)

@Composable
fun NSGurujiTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    val colorScheme = if (darkTheme) DarkColorScheme else LightColorScheme

    val view = LocalView.current
    if (!view.isInEditMode) {
        SideEffect {
            val window = (view.context as? Activity)?.window ?: return@SideEffect
            window.statusBarColor = if (darkTheme) BackgroundDark.toArgb() else BrandPrimaryBlue.toArgb()
            val insetsController = WindowCompat.getInsetsController(window, view)
            insetsController.isAppearanceLightStatusBars = false
            insetsController.isAppearanceLightNavigationBars = !darkTheme
        }
    }

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content
    )
}
