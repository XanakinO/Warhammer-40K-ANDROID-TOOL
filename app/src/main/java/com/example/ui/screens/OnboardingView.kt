package com.example.ui.screens

import androidx.compose.foundation.*
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AutoAwesome
import androidx.compose.material.icons.filled.Shield
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@Composable
fun OnboardingView(onDismiss: () -> Unit) {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.Black.copy(alpha = 0.95f))
            .padding(24.dp),
        contentAlignment = Alignment.Center
    ) {
        Card(
            colors = CardDefaults.cardColors(containerColor = GrimDarkCard),
            border = BorderStroke(2.dp, Brush.verticalGradient(listOf(AmberGold, Color(0xFF451A03)))),
            shape = RoundedCornerShape(16.dp),
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(
                modifier = Modifier
                    .padding(24.dp)
                    .verticalScroll(rememberScrollState()),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                // Crest Icon
                Icon(
                    imageVector = Icons.Default.Shield,
                    contentDescription = "Crest",
                    tint = AmberGold,
                    modifier = Modifier.size(64.dp)
                )

                Spacer(modifier = Modifier.height(14.dp))

                Text(
                    text = "WARHAMMER 40,000",
                    color = Color.White,
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold,
                    fontFamily = FontFamily.Serif,
                    letterSpacing = 2.sp
                )
                Text(
                    text = "RECRUIT STRATEGIUM GUIDE",
                    color = AmberGold,
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Bold,
                    letterSpacing = 1.sp
                )

                Spacer(modifier = Modifier.height(16.dp))
                HorizontalDivider(color = GrimDarkBorder)
                Spacer(modifier = Modifier.height(16.dp))

                Text(
                    text = "The ultimate digital stratagem for learning 10th Edition rules, cataloging datasheets, formulating rosters, and tracking live matches.",
                    color = LightParchment,
                    fontSize = 12.sp,
                    textAlign = TextAlign.Center,
                    lineHeight = 17.sp
                )

                Spacer(modifier = Modifier.height(18.dp))

                // Core modules summary
                Column(
                    modifier = Modifier.fillMaxWidth(),
                    verticalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    OnboardingItem("Recruit Academy", "Interactive phase-by-phase battle guide and rules glossary.", Icons.Default.Shield)
                    OnboardingItem("Codex Vault", "Datasheets, paint formulations, and a playstyle evaluation quiz.", Icons.Default.Shield)
                    OnboardingItem("Strike Force Builder", "Enforce 1000/2000 points limits, assign Warlords, and attach enhancements.", Icons.Default.Shield)
                    OnboardingItem("Battle Companion", "Keep live scores, track round phases, and access the probability gauge.", Icons.Default.Shield)
                    OnboardingItem("Rules Sage AI", "A highly advanced referee powered by Gemini AI to resolve game disputes.", Icons.Default.AutoAwesome)
                }

                Spacer(modifier = Modifier.height(24.dp))

                Button(
                    onClick = onDismiss,
                    colors = ButtonDefaults.buttonColors(containerColor = AmberGold),
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(8.dp)
                ) {
                    Text(
                        text = "ACCEPT THE SACRED OATH (ENTER)",
                        color = Color.Black,
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        letterSpacing = 1.sp
                    )
                }
            }
        }
    }
}

@Composable
fun OnboardingItem(title: String, desc: String, icon: androidx.compose.ui.graphics.vector.ImageVector) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .background(GrimDarkBg, RoundedCornerShape(6.dp))
            .border(BorderStroke(1.dp, GrimDarkBorder), RoundedCornerShape(6.dp))
            .padding(10.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Icon(
            imageVector = icon,
            contentDescription = null,
            tint = AmberGold,
            modifier = Modifier.size(16.dp)
        )
        Spacer(modifier = Modifier.width(10.dp))
        Column {
            Text(title, color = Color.White, fontSize = 11.sp, fontWeight = FontWeight.Bold)
            Text(desc, color = SubtleGray, fontSize = 9.sp, lineHeight = 12.sp)
        }
    }
}
