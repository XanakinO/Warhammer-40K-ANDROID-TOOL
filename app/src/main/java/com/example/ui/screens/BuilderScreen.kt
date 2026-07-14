package com.example.ui.screens

import androidx.compose.animation.*
import androidx.compose.foundation.*
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.domain.Enhancement
import com.example.domain.FactionRepository
import com.example.ui.MainViewModel

@Composable
fun BuilderScreen(viewModel: MainViewModel) {
    val roster by viewModel.currentRoster.collectAsState()
    val faction = FactionRepository.getFactionById(roster.factionId) ?: FactionRepository.FACTIONS.first()
    val totalPoints = viewModel.getRosterTotalPoints()
    val isOverLimit = totalPoints > roster.pointsLimit
    val hasWarlord = roster.items.any { it.isWarlord }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(GrimDarkBg)
    ) {
        // Header
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .border(BorderStroke(1.dp, Brush.horizontalGradient(listOf(Color(0xFF451A03), AmberGold, Color(0xFF451A03)))))
                .background(GrimDarkCard)
                .padding(vertical = 12.dp, horizontal = 16.dp),
            contentAlignment = Alignment.Center
        ) {
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Text(
                    text = "STRIKE FORCE ARMY BUILDER",
                    color = Color.White,
                    fontSize = 15.sp,
                    fontWeight = FontWeight.Bold,
                    fontFamily = FontFamily.Serif,
                    letterSpacing = 2.sp
                )
                Spacer(modifier = Modifier.height(2.dp))
                Text(
                    text = "COMPLIANT ROSTER MANAGEMENT PROTOCOL",
                    color = AmberGold,
                    fontSize = 9.sp,
                    fontWeight = FontWeight.Bold,
                    letterSpacing = 1.sp
                )
            }
        }

        LazyColumn(
            modifier = Modifier
                .weight(1f)
                .padding(horizontal = 16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            // Configuration Block
            item {
                Card(
                    colors = CardDefaults.cardColors(containerColor = GrimDarkCard),
                    border = BorderStroke(1.dp, GrimDarkBorder),
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(top = 12.dp)
                ) {
                    Column(modifier = Modifier.padding(14.dp)) {
                        Text("ROSTER PROTOCOLS", color = AmberGold, fontSize = 9.sp, fontWeight = FontWeight.Bold)
                        Spacer(modifier = Modifier.height(6.dp))
                        
                        // Points limit toggle
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.spacedBy(10.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text("Limit:", color = LightParchment, fontSize = 11.sp)
                            listOf(1000, 2000).forEach { limit ->
                                val active = roster.pointsLimit == limit
                                FilterChip(
                                    selected = active,
                                    onClick = { viewModel.updateRosterPointsLimit(limit) },
                                    label = { Text("$limit pts", fontSize = 11.sp) },
                                    colors = FilterChipDefaults.filterChipColors(
                                        selectedContainerColor = Color(0xFF451A03),
                                        selectedLabelColor = Color.White,
                                        labelColor = SubtleGray
                                    ),
                                    border = FilterChipDefaults.filterChipBorder(
                                        enabled = true,
                                        selected = active,
                                        borderColor = GrimDarkBorder,
                                        selectedBorderColor = AmberGold
                                    )
                                )
                            }

                            Spacer(modifier = Modifier.weight(1f))

                            // Warlord check badge
                            Box(
                                modifier = Modifier
                                    .background(
                                        if (hasWarlord) Color.Green.copy(alpha = 0.1f) else Color.Red.copy(alpha = 0.1f),
                                        RoundedCornerShape(4.dp)
                                    )
                                    .border(
                                        BorderStroke(1.dp, if (hasWarlord) Color.Green.copy(alpha = 0.4f) else Color.Red.copy(alpha = 0.4f)),
                                        RoundedCornerShape(4.dp)
                                    )
                                    .padding(horizontal = 6.dp, vertical = 2.dp)
                            ) {
                                Text(
                                    text = if (hasWarlord) "WARLORD DESIGNATED" else "NO WARLORD",
                                    color = if (hasWarlord) Color.Green else Color.Red,
                                    fontSize = 8.sp,
                                    fontWeight = FontWeight.Bold
                                )
                            }
                        }

                        Spacer(modifier = Modifier.height(10.dp))

                        // Current Faction Select
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text("Active Faction: ", color = LightParchment, fontSize = 11.sp)
                            Spacer(modifier = Modifier.width(6.dp))
                            
                            var fDropdownExpanded by remember { mutableStateOf(false) }
                            Box {
                                Text(
                                    text = faction.name.substringBefore(" ("),
                                    color = AmberGold,
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.Bold,
                                    modifier = Modifier
                                        .clickable { fDropdownExpanded = true }
                                        .background(GrimDarkBg, RoundedCornerShape(4.dp))
                                        .border(BorderStroke(1.dp, GrimDarkBorder), RoundedCornerShape(4.dp))
                                        .padding(horizontal = 8.dp, vertical = 4.dp)
                                )
                                DropdownMenu(
                                    expanded = fDropdownExpanded,
                                    onDismissRequest = { fDropdownExpanded = false },
                                    modifier = Modifier.background(GrimDarkCard)
                                ) {
                                    FactionRepository.FACTIONS.forEach { f ->
                                        DropdownMenuItem(
                                            text = { Text(f.name, color = Color.White, fontSize = 11.sp) },
                                            onClick = {
                                                viewModel.updateRosterFaction(f.id)
                                                fDropdownExpanded = false
                                            }
                                        )
                                    }
                                }
                            }
                        }
                    }
                }
            }

            // Points cost overview panel
            item {
                Card(
                    colors = CardDefaults.cardColors(containerColor = GrimDarkCard),
                    border = BorderStroke(1.dp, if (isOverLimit) Color.Red else AmberGold.copy(alpha = 0.5f)),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(
                        modifier = Modifier.padding(14.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Text("CALCULATED STRENGTH", color = SubtleGray, fontSize = 9.sp)
                        Row(verticalAlignment = Alignment.Bottom) {
                            Text(
                                text = "$totalPoints",
                                color = if (isOverLimit) Color.Red else AmberGold,
                                fontSize = 28.sp,
                                fontWeight = FontWeight.Bold,
                                fontFamily = FontFamily.Monospace
                            )
                            Text(
                                text = " / ${roster.pointsLimit} PTS",
                                color = SubtleGray,
                                fontSize = 14.sp,
                                fontWeight = FontWeight.Bold,
                                modifier = Modifier.padding(bottom = 4.dp)
                            )
                        }

                        if (isOverLimit) {
                            Spacer(modifier = Modifier.height(4.dp))
                            Text(
                                text = "⚠️ PROTOCOL WARNING: POINTS BUDGET EXCEEDED!",
                                color = Color.Red,
                                fontSize = 9.sp,
                                fontWeight = FontWeight.Bold,
                                letterSpacing = 0.5.sp
                            )
                        }
                    }
                }
            }

            // Designated squad selection header
            item {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "ROSTER COMPOSITION",
                        color = AmberGold,
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        fontFamily = FontFamily.Serif
                    )
                    Text(
                        text = "Tap units below to configure Warlords/Enhancements",
                        color = SubtleGray,
                        fontSize = 8.sp
                    )
                }
            }

            // Roster Items Added (CRUD)
            if (roster.items.isEmpty()) {
                item {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .background(GrimDarkCard, RoundedCornerShape(8.dp))
                            .border(BorderStroke(1.dp, GrimDarkBorder), RoundedCornerShape(8.dp))
                            .padding(24.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Icon(Icons.Default.HourglassEmpty, contentDescription = "Empty", tint = SubtleGray, modifier = Modifier.size(32.dp))
                            Spacer(modifier = Modifier.height(8.dp))
                            Text(
                                text = "ROSTER IS VACANT",
                                color = LightParchment,
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold
                            )
                            Text(
                                text = "Add squads from the barracks list below.",
                                color = SubtleGray,
                                fontSize = 10.sp,
                                textAlign = TextAlign.Center
                            )
                        }
                    }
                }
            } else {
                items(roster.items) { item ->
                    val datacard = faction.units.find { it.id == item.datacardId }
                    var configExpanded by remember { mutableStateOf(false) }

                    Card(
                        colors = CardDefaults.cardColors(containerColor = GrimDarkCard),
                        border = BorderStroke(1.dp, if (item.isWarlord) AmberGold else GrimDarkBorder),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Column(modifier = Modifier.padding(12.dp)) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Column(modifier = Modifier.weight(1f)) {
                                    Row(verticalAlignment = Alignment.CenterVertically) {
                                        Text(
                                            text = item.name,
                                            color = Color.White,
                                            fontSize = 12.sp,
                                            fontWeight = FontWeight.Bold
                                        )
                                        if (item.isWarlord) {
                                            Spacer(modifier = Modifier.width(6.dp))
                                            Box(
                                                modifier = Modifier
                                                    .background(AmberGold.copy(alpha = 0.2f), RoundedCornerShape(2.dp))
                                                    .border(BorderStroke(0.5.dp, AmberGold), RoundedCornerShape(2.dp))
                                                    .padding(horizontal = 4.dp, vertical = 1.dp)
                                            ) {
                                                Text("WARLORD", color = AmberGold, fontSize = 7.sp, fontWeight = FontWeight.Bold)
                                            }
                                        }
                                    }
                                    
                                    val countText = if (item.count > 1) "${item.count}x squads" else "1 squad"
                                    val enhText = if (item.enhancementName != null) " + ${item.enhancementName} (+${item.enhancementPoints} pts)" else ""
                                    Text(
                                        text = "$countText • ${item.points + (item.enhancementPoints ?: 0)} pts$enhText",
                                        color = SubtleGray,
                                        fontSize = 10.sp
                                    )
                                }

                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    // Expand config button
                                    IconButton(onClick = { configExpanded = !configExpanded }) {
                                        Icon(
                                            imageVector = if (configExpanded) Icons.Default.SettingsApplications else Icons.Default.Settings,
                                            contentDescription = "Configure",
                                            tint = if (item.isWarlord || item.enhancementName != null) AmberGold else SubtleGray,
                                            modifier = Modifier.size(20.dp)
                                        )
                                    }
                                    
                                    // Plus / Minus actions
                                    IconButton(
                                        onClick = { if (datacard != null) viewModel.removeUnitFromRoster(item.datacardId) },
                                        modifier = Modifier.size(28.dp)
                                    ) {
                                        Icon(Icons.Default.Remove, contentDescription = "Remove", tint = Color.Red, modifier = Modifier.size(16.dp))
                                    }
                                    Text(
                                        "${item.count}",
                                        color = Color.White,
                                        fontSize = 11.sp,
                                        modifier = Modifier.padding(horizontal = 6.dp),
                                        fontFamily = FontFamily.Monospace
                                    )
                                    IconButton(
                                        onClick = { if (datacard != null) viewModel.addUnitToRoster(datacard) },
                                        modifier = Modifier.size(28.dp)
                                    ) {
                                        Icon(Icons.Default.Add, contentDescription = "Add", tint = Color.Green, modifier = Modifier.size(16.dp))
                                    }
                                }
                            }

                            // Dynamic Configuration Area for Warlord / Enhancements
                            AnimatedVisibility(visible = configExpanded) {
                                Column(
                                    modifier = Modifier
                                        .padding(top = 10.dp)
                                        .fillMaxWidth()
                                        .background(GrimDarkBg)
                                        .border(BorderStroke(1.dp, GrimDarkBorder))
                                        .padding(10.dp)
                                ) {
                                    Text("SQUAD SPECIAL RULES CONFIGURATION", color = AmberGold, fontSize = 8.sp, fontWeight = FontWeight.Bold)
                                    
                                    Spacer(modifier = Modifier.height(6.dp))

                                    // Warlord toggle
                                    Row(
                                        modifier = Modifier.fillMaxWidth(),
                                        verticalAlignment = Alignment.CenterVertically
                                    ) {
                                        Checkbox(
                                            checked = item.isWarlord,
                                            onCheckedChange = { viewModel.toggleWarlord(item.datacardId) },
                                            colors = CheckboxDefaults.colors(checkedColor = AmberGold, uncheckedColor = SubtleGray)
                                        )
                                        Text("Designate as Army Warlord", color = LightParchment, fontSize = 11.sp)
                                    }

                                    Spacer(modifier = Modifier.height(4.dp))

                                    // Attachment of Enhancements
                                    Row(
                                        modifier = Modifier.fillMaxWidth(),
                                        verticalAlignment = Alignment.CenterVertically
                                    ) {
                                        Text("Attach Detachment Enhancement:", color = SubtleGray, fontSize = 10.sp)
                                        Spacer(modifier = Modifier.width(6.dp))
                                        
                                        var enhDropdownExpanded by remember { mutableStateOf(false) }
                                        Box {
                                            Text(
                                                text = item.enhancementName ?: "None (Select)",
                                                color = if (item.enhancementName != null) AmberGold else SubtleGray,
                                                fontSize = 10.sp,
                                                fontWeight = FontWeight.Bold,
                                                modifier = Modifier
                                                    .clickable { enhDropdownExpanded = true }
                                                    .background(GrimDarkCard, RoundedCornerShape(4.dp))
                                                    .border(BorderStroke(1.dp, GrimDarkBorder), RoundedCornerShape(4.dp))
                                                    .padding(horizontal = 6.dp, vertical = 3.dp)
                                            )
                                            DropdownMenu(
                                                expanded = enhDropdownExpanded,
                                                onDismissRequest = { enhDropdownExpanded = false },
                                                modifier = Modifier.background(GrimDarkCard)
                                            ) {
                                                DropdownMenuItem(
                                                    text = { Text("None (Detach)", color = Color.White, fontSize = 10.sp) },
                                                    onClick = {
                                                        viewModel.attachEnhancement(item.datacardId, null)
                                                        enhDropdownExpanded = false
                                                    }
                                                )
                                                faction.detachment.enhancements.forEach { enh ->
                                                    DropdownMenuItem(
                                                        text = { Text("${enh.name} (+${enh.points} pts)", color = Color.White, fontSize = 10.sp) },
                                                        onClick = {
                                                            viewModel.attachEnhancement(item.datacardId, enh)
                                                            enhDropdownExpanded = false
                                                        }
                                                    )
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }

            // Barracks selector
            item {
                Spacer(modifier = Modifier.height(10.dp))
                Text(
                    text = "FACTION SQUAD BARRACKS (Billeting List)",
                    color = AmberGold,
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Bold,
                    fontFamily = FontFamily.Serif
                )
            }

            items(faction.units) { unit ->
                Card(
                    colors = CardDefaults.cardColors(containerColor = GrimDarkCard),
                    border = BorderStroke(1.dp, GrimDarkBorder),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Row(
                        modifier = Modifier.padding(12.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column(modifier = Modifier.weight(1f)) {
                            Text(unit.name, color = Color.White, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                            Text("${unit.type} • ${unit.points} pts", color = SubtleGray, fontSize = 10.sp)
                        }
                        Button(
                            onClick = { viewModel.addUnitToRoster(unit) },
                            colors = ButtonDefaults.buttonColors(containerColor = AmberGold),
                            contentPadding = PaddingValues(horizontal = 14.dp, vertical = 4.dp),
                            shape = RoundedCornerShape(6.dp)
                        ) {
                            Text("Billet Unit", color = Color.Black, fontSize = 10.sp, fontWeight = FontWeight.Bold)
                        }
                    }
                }
            }
        }
    }
}
