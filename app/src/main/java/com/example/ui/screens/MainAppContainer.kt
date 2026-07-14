package com.example.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.ui.AppTab
import com.example.ui.MainViewModel

@Composable
fun MainAppContainer(viewModel: MainViewModel) {
    val activeTab by viewModel.activeTab.collectAsState()
    val showOnboarding by viewModel.showOnboarding.collectAsState()

    Scaffold(
        modifier = Modifier
            .fillMaxSize()
            .background(GrimDarkBg),
        bottomBar = {
            NavigationBar(
                containerColor = GrimDarkCard,
                tonalElevation = 8.dp,
                modifier = Modifier.navigationBarsPadding() // Safely respect Android navigation bar
            ) {
                val tabs = listOf(
                    AppTab.ACADEMY to "Academy" to Icons.Default.School,
                    AppTab.CODEX to "Codex" to Icons.Default.MenuBook,
                    AppTab.BUILDER to "Builder" to Icons.Default.Construction,
                    AppTab.COMPANION to "Companion" to Icons.Default.Casino,
                    AppTab.SAGE to "Rules Sage" to Icons.Default.AutoAwesome
                )

                tabs.forEach { (tabData, icon) ->
                    val (tab, label) = tabData
                    val isSelected = activeTab == tab
                    NavigationBarItem(
                        selected = isSelected,
                        onClick = { viewModel.selectTab(tab) },
                        label = {
                            Text(
                                text = label,
                                fontSize = 9.sp,
                                color = if (isSelected) AmberGold else SubtleGray
                            )
                        },
                        icon = {
                            Icon(
                                imageVector = icon,
                                contentDescription = label,
                                tint = if (isSelected) AmberGold else SubtleGray
                            )
                        },
                        colors = NavigationBarItemDefaults.colors(
                            indicatorColor = Color(0xFF451A03)
                        )
                    )
                }
            }
        },
        contentWindowInsets = WindowInsets.safeDrawing // Prevent camera notch clipping
    ) { innerPadding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(GrimDarkBg)
                .padding(innerPadding)
        ) {
            when (activeTab) {
                AppTab.ACADEMY -> AcademyScreen(viewModel)
                AppTab.CODEX -> CodexScreen(viewModel)
                AppTab.BUILDER -> BuilderScreen(viewModel)
                AppTab.COMPANION -> CompanionScreen(viewModel)
                AppTab.SAGE -> SageScreen(viewModel)
            }

            // Onboarding Overlay
            if (showOnboarding) {
                OnboardingView(onDismiss = { viewModel.dismissOnboarding() })
            }
        }
    }
}
