package com.example

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.viewModels
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import com.example.ui.MainViewModel
import com.example.ui.screens.MainAppContainer

// Defining the Custom GrimDark Gothic color scheme for Material 3
private val GrimDarkColorScheme = darkColorScheme(
    primary = Color(0xFFF59E0B),      // Amber Gold
    onPrimary = Color(0xFF050607),    // Obsidian dark
    secondary = Color(0xFF451A03),    // Crimson Rust
    onSecondary = Color(0xFFE2E8F0),  // Light Parchment
    background = Color(0xFF050607),   // Obsidian dark
    onBackground = Color(0xFFE2E8F0), // Light Parchment
    surface = Color(0xFF0C0E10),      // Deep Charcoal Card
    onSurface = Color(0xFFE2E8F0),    // Light Parchment
    error = Color(0xFFEF4444),
    onError = Color(0xFFFFFFFF)
)

@Composable
fun GrimDarkTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = GrimDarkColorScheme,
        content = content
    )
}

class MainActivity : ComponentActivity() {
    private val viewModel: MainViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        // Enable Edge-to-Edge full immersion mode
        enableEdgeToEdge()
        
        setContent {
            GrimDarkTheme {
                MainAppContainer(viewModel = viewModel)
            }
        }
    }
}
