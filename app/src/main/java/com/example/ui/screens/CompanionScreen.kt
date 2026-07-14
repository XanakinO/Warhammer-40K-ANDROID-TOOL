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
import com.example.domain.FactionRepository
import com.example.ui.MainViewModel

@Composable
fun CompanionScreen(viewModel: MainViewModel) {
    var mode by remember { mutableStateOf("match") } // "match" | "probability"
    val matchState by viewModel.matchState.collectAsState()

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
                    text = "BATTLE COMPANION TERMINAL",
                    color = Color.White,
                    fontSize = 15.sp,
                    fontWeight = FontWeight.Bold,
                    fontFamily = FontFamily.Serif,
                    letterSpacing = 2.sp
                )
                Spacer(modifier = Modifier.height(2.dp))
                Text(
                    text = "LIVE BATTLE CHRONOLOGY AND STATISTICAL GAUGE",
                    color = AmberGold,
                    fontSize = 9.sp,
                    fontWeight = FontWeight.Bold,
                    letterSpacing = 1.sp
                )
            }
        }

        // Subtabs
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp, vertical = 12.dp)
                .background(GrimDarkCard, RoundedCornerShape(8.dp))
                .border(BorderStroke(1.dp, GrimDarkBorder), RoundedCornerShape(8.dp)),
            horizontalArrangement = Arrangement.SpaceEvenly
        ) {
            val subtabs = listOf(
                "match" to "Scoreboard Logs",
                "probability" to "Probability Gauge"
            )
            subtabs.forEach { (id, label) ->
                val active = mode == id
                TextButton(
                    onClick = { mode = id },
                    modifier = Modifier.weight(1f),
                    colors = ButtonDefaults.textButtonColors(
                        contentColor = if (active) AmberGold else SubtleGray
                    )
                ) {
                    Text(
                        text = label,
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        letterSpacing = 0.5.sp,
                        color = if (active) AmberGold else SubtleGray
                    )
                }
            }
        }

        Box(
            modifier = Modifier
                .weight(1f)
                .padding(horizontal = 16.dp)
        ) {
            when (mode) {
                "match" -> ScoreboardLogsView(viewModel, matchState)
                "probability" -> ProbabilityGaugeView(viewModel)
            }
        }
    }
}

@Composable
fun ScoreboardLogsView(viewModel: MainViewModel, state: com.example.domain.MatchState) {
    var p1NameInput by remember { mutableStateOf(state.p1Name) }
    var p2NameInput by remember { mutableStateOf(state.p2Name) }
    var setupFinished by remember { mutableStateOf(false) }

    if (!setupFinished && state.p1Faction.isEmpty()) {
        // Setup Players Dialog
        Column(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(rememberScrollState()),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(
                "INITIALIZE BATTLE LOGS",
                color = Color.White,
                fontSize = 12.sp,
                fontWeight = FontWeight.Bold,
                fontFamily = FontFamily.Serif,
                modifier = Modifier.padding(bottom = 12.dp)
            )

            Card(
                colors = CardDefaults.cardColors(containerColor = GrimDarkCard),
                border = BorderStroke(1.dp, GrimDarkBorder),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(14.dp)) {
                    // Player 1 Form
                    Text("PLAYER 1 (ATTACKER)", color = AmberGold, fontSize = 9.sp, fontWeight = FontWeight.Bold)
                    Spacer(modifier = Modifier.height(4.dp))
                    OutlinedTextField(
                        value = p1NameInput,
                        onValueChange = { p1NameInput = it },
                        singleLine = true,
                        placeholder = { Text("Name", fontSize = 11.sp, color = SubtleGray) },
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedTextColor = Color.White,
                            unfocusedTextColor = LightParchment,
                            focusedBorderColor = AmberGold,
                            unfocusedBorderColor = GrimDarkBorder,
                            focusedContainerColor = GrimDarkBg,
                            unfocusedContainerColor = GrimDarkBg
                        ),
                        textStyle = androidx.compose.ui.text.TextStyle(fontSize = 11.sp),
                        modifier = Modifier.fillMaxWidth()
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    var p1Faction by remember { mutableStateOf("space_marines") }
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text("Faction: ", color = SubtleGray, fontSize = 10.sp)
                        var expandP1 by remember { mutableStateOf(false) }
                        Box {
                            Text(
                                text = FactionRepository.getFactionById(p1Faction)?.name?.substringBefore(" (") ?: "Select",
                                color = AmberGold,
                                fontSize = 11.sp,
                                modifier = Modifier
                                    .clickable { expandP1 = true }
                                    .background(GrimDarkBg, RoundedCornerShape(4.dp))
                                    .border(BorderStroke(1.dp, GrimDarkBorder), RoundedCornerShape(4.dp))
                                    .padding(horizontal = 8.dp, vertical = 4.dp)
                            )
                            DropdownMenu(expanded = expandP1, onDismissRequest = { expandP1 = false }, modifier = Modifier.background(GrimDarkCard)) {
                                FactionRepository.FACTIONS.forEach { f ->
                                    DropdownMenuItem(
                                        text = { Text(f.name, color = Color.White, fontSize = 11.sp) },
                                        onClick = { p1Faction = f.id; expandP1 = false }
                                    )
                                }
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(16.dp))
                    HorizontalDivider(color = GrimDarkBorder)
                    Spacer(modifier = Modifier.height(12.dp))

                    // Player 2 Form
                    Text("PLAYER 2 (DEFENDER)", color = AmberGold, fontSize = 9.sp, fontWeight = FontWeight.Bold)
                    Spacer(modifier = Modifier.height(4.dp))
                    OutlinedTextField(
                        value = p2NameInput,
                        onValueChange = { p2NameInput = it },
                        singleLine = true,
                        placeholder = { Text("Name", fontSize = 11.sp, color = SubtleGray) },
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedTextColor = Color.White,
                            unfocusedTextColor = LightParchment,
                            focusedBorderColor = AmberGold,
                            unfocusedBorderColor = GrimDarkBorder,
                            focusedContainerColor = GrimDarkBg,
                            unfocusedContainerColor = GrimDarkBg
                        ),
                        textStyle = androidx.compose.ui.text.TextStyle(fontSize = 11.sp),
                        modifier = Modifier.fillMaxWidth()
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    var p2Faction by remember { mutableStateOf("tyranids") }
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text("Faction: ", color = SubtleGray, fontSize = 10.sp)
                        var expandP2 by remember { mutableStateOf(false) }
                        Box {
                            Text(
                                text = FactionRepository.getFactionById(p2Faction)?.name?.substringBefore(" (") ?: "Select",
                                color = AmberGold,
                                fontSize = 11.sp,
                                modifier = Modifier
                                    .clickable { expandP2 = true }
                                    .background(GrimDarkBg, RoundedCornerShape(4.dp))
                                    .border(BorderStroke(1.dp, GrimDarkBorder), RoundedCornerShape(4.dp))
                                    .padding(horizontal = 8.dp, vertical = 4.dp)
                            )
                            DropdownMenu(expanded = expandP2, onDismissRequest = { expandP2 = false }, modifier = Modifier.background(GrimDarkCard)) {
                                FactionRepository.FACTIONS.forEach { f ->
                                    DropdownMenuItem(
                                        text = { Text(f.name, color = Color.White, fontSize = 11.sp) },
                                        onClick = { p2Faction = f.id; expandP2 = false }
                                    )
                                }
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(20.dp))

                    Button(
                        onClick = {
                            viewModel.updateMatchPlayers(p1NameInput, p1Faction, p2NameInput, p2Faction)
                            setupFinished = true
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = AmberGold),
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(8.dp)
                    ) {
                        Text("BEGIN THE CHRONICLE", color = Color.Black, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                    }
                }
            }
        }
    } else {
        // Active Match Dashboard
        LazyColumn(
            modifier = Modifier.fillMaxSize(),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            // Scoring boards
            item {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    // Player 1 Card
                    Card(
                        colors = CardDefaults.cardColors(containerColor = GrimDarkCard),
                        border = BorderStroke(1.dp, GrimDarkBorder),
                        modifier = Modifier.weight(1f)
                    ) {
                        Column(
                            modifier = Modifier.padding(12.dp),
                            horizontalAlignment = Alignment.CenterHorizontally
                        ) {
                            Text(state.p1Name.uppercase(), color = Color.White, fontSize = 11.sp, fontWeight = FontWeight.Bold, maxLines = 1)
                            Text(FactionRepository.getFactionById(state.p1Faction)?.name?.substringBefore(" (") ?: "", color = SubtleGray, fontSize = 8.sp, maxLines = 1)
                            
                            Spacer(modifier = Modifier.height(8.dp))
                            
                            Text("VP: ${state.p1Vp}", color = AmberGold, fontSize = 20.sp, fontWeight = FontWeight.Bold)
                            Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                                Button(
                                    onClick = { viewModel.addVp(1, -5) },
                                    colors = ButtonDefaults.buttonColors(containerColor = GrimDarkBg),
                                    modifier = Modifier.height(26.dp).weight(1f),
                                    contentPadding = PaddingValues(0.dp)
                                ) {
                                    Text("-5", fontSize = 9.sp, color = Color.Red)
                                }
                                Button(
                                    onClick = { viewModel.addVp(1, 5) },
                                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF451A03)),
                                    modifier = Modifier.height(26.dp).weight(1f),
                                    contentPadding = PaddingValues(0.dp)
                                ) {
                                    Text("+5", fontSize = 9.sp, color = AmberGold)
                                }
                            }

                            Spacer(modifier = Modifier.height(8.dp))
                            
                            Text("CP: ${state.p1Cp}", color = Color.White, fontSize = 13.sp, fontWeight = FontWeight.Bold)
                            Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                                Button(
                                    onClick = { viewModel.addCp(1, -1) },
                                    colors = ButtonDefaults.buttonColors(containerColor = GrimDarkBg),
                                    modifier = Modifier.height(22.dp).weight(1f),
                                    contentPadding = PaddingValues(0.dp)
                                ) {
                                    Text("-1 CP", fontSize = 8.sp, color = SubtleGray)
                                }
                                Button(
                                    onClick = { viewModel.addCp(1, 1) },
                                    colors = ButtonDefaults.buttonColors(containerColor = GrimDarkBg),
                                    modifier = Modifier.height(22.dp).weight(1f),
                                    contentPadding = PaddingValues(0.dp)
                                ) {
                                    Text("+1 CP", fontSize = 8.sp, color = Color.White)
                                }
                            }
                        }
                    }

                    // Player 2 Card
                    Card(
                        colors = CardDefaults.cardColors(containerColor = GrimDarkCard),
                        border = BorderStroke(1.dp, GrimDarkBorder),
                        modifier = Modifier.weight(1f)
                    ) {
                        Column(
                            modifier = Modifier.padding(12.dp),
                            horizontalAlignment = Alignment.CenterHorizontally
                        ) {
                            Text(state.p2Name.uppercase(), color = Color.White, fontSize = 11.sp, fontWeight = FontWeight.Bold, maxLines = 1)
                            Text(FactionRepository.getFactionById(state.p2Faction)?.name?.substringBefore(" (") ?: "", color = SubtleGray, fontSize = 8.sp, maxLines = 1)
                            
                            Spacer(modifier = Modifier.height(8.dp))
                            
                            Text("VP: ${state.p2Vp}", color = AmberGold, fontSize = 20.sp, fontWeight = FontWeight.Bold)
                            Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                                Button(
                                    onClick = { viewModel.addVp(2, -5) },
                                    colors = ButtonDefaults.buttonColors(containerColor = GrimDarkBg),
                                    modifier = Modifier.height(26.dp).weight(1f),
                                    contentPadding = PaddingValues(0.dp)
                                ) {
                                    Text("-5", fontSize = 9.sp, color = Color.Red)
                                }
                                Button(
                                    onClick = { viewModel.addVp(2, 5) },
                                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF451A03)),
                                    modifier = Modifier.height(26.dp).weight(1f),
                                    contentPadding = PaddingValues(0.dp)
                                ) {
                                    Text("+5", fontSize = 9.sp, color = AmberGold)
                                }
                            }

                            Spacer(modifier = Modifier.height(8.dp))
                            
                            Text("CP: ${state.p2Cp}", color = Color.White, fontSize = 13.sp, fontWeight = FontWeight.Bold)
                            Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                                Button(
                                    onClick = { viewModel.addCp(2, -1) },
                                    colors = ButtonDefaults.buttonColors(containerColor = GrimDarkBg),
                                    modifier = Modifier.height(22.dp).weight(1f),
                                    contentPadding = PaddingValues(0.dp)
                                ) {
                                    Text("-1 CP", fontSize = 8.sp, color = SubtleGray)
                                }
                                Button(
                                    onClick = { viewModel.addCp(2, 1) },
                                    colors = ButtonDefaults.buttonColors(containerColor = GrimDarkBg),
                                    modifier = Modifier.height(22.dp).weight(1f),
                                    contentPadding = PaddingValues(0.dp)
                                ) {
                                    Text("+1 CP", fontSize = 8.sp, color = Color.White)
                                }
                            }
                        }
                    }
                }
            }

            // Timeline status indicators
            item {
                Card(
                    colors = CardDefaults.cardColors(containerColor = GrimDarkCard),
                    border = BorderStroke(1.dp, GrimDarkBorder),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(modifier = Modifier.padding(14.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column {
                                Text("ROUND ${state.currentRound} OF 5", color = AmberGold, fontSize = 10.sp, fontWeight = FontWeight.Bold)
                                Text("PHASE: ${state.phase}", color = Color.White, fontSize = 14.sp, fontWeight = FontWeight.Bold, fontFamily = FontFamily.Serif)
                            }
                            Button(
                                onClick = { viewModel.nextMatchRound() },
                                colors = ButtonDefaults.buttonColors(containerColor = AmberGold)
                            ) {
                                Text("Next Round", color = Color.Black, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                            }
                        }

                        Spacer(modifier = Modifier.height(10.dp))
                        
                        // Phases scrolling bar shortcut
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .horizontalScroll(rememberScrollState()),
                            horizontalArrangement = Arrangement.spacedBy(6.dp)
                        ) {
                            listOf("COMMAND", "MOVEMENT", "SHOOTING", "CHARGE", "FIGHT", "CLEANUP").forEach { ph ->
                                val isActive = state.phase == ph
                                Box(
                                    modifier = Modifier
                                        .clickable { viewModel.advanceMatchPhase(ph) }
                                        .background(if (isActive) Color(0xFF451A03) else GrimDarkBg, RoundedCornerShape(4.dp))
                                        .border(BorderStroke(1.dp, if (isActive) AmberGold else GrimDarkBorder), RoundedCornerShape(4.dp))
                                        .padding(horizontal = 8.dp, vertical = 4.dp)
                                ) {
                                    Text(ph, color = if (isActive) AmberGold else SubtleGray, fontSize = 8.sp, fontWeight = FontWeight.Bold)
                                }
                            }
                        }
                    }
                }
            }

            // Log Console
            item {
                Text(
                    text = "BATTLE CHRONICLE FEED LOGS",
                    color = AmberGold,
                    fontSize = 10.sp,
                    fontWeight = FontWeight.Bold,
                    fontFamily = FontFamily.Serif,
                    modifier = Modifier.padding(top = 4.dp)
                )
            }

            if (state.log.isEmpty()) {
                item {
                    Text("Chronicle feeds will populate as battle actions commence.", color = SubtleGray, fontSize = 10.sp)
                }
            } else {
                items(state.log.reversed()) { entry ->
                    Card(
                        colors = CardDefaults.cardColors(containerColor = GrimDarkCard),
                        border = BorderStroke(0.5.dp, GrimDarkBorder),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Row(modifier = Modifier.padding(10.dp), verticalAlignment = Alignment.Top) {
                            Text(
                                text = "[${entry.timestamp}]",
                                color = AmberGold,
                                fontSize = 9.sp,
                                fontFamily = FontFamily.Monospace,
                                modifier = Modifier.width(65.dp)
                            )
                            Spacer(modifier = Modifier.width(4.dp))
                            Text(
                                text = entry.message,
                                color = LightParchment,
                                fontSize = 10.sp,
                                lineHeight = 13.sp,
                                modifier = Modifier.weight(1f)
                            )
                        }
                    }
                }
            }

            // Reset matches logs
            item {
                Spacer(modifier = Modifier.height(8.dp))
                Button(
                    onClick = {
                        setupFinished = false
                        viewModel.resetMatch()
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = GrimDarkBg),
                    border = BorderStroke(1.dp, Color.Red.copy(alpha = 0.5f)),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text("FORFEIT / RESET BATTLE PROTOCOLS", color = Color.Red, fontSize = 10.sp, fontWeight = FontWeight.Bold)
                }
            }
        }
    }
}

@Composable
fun ProbabilityGaugeView(viewModel: MainViewModel) {
    var attacksInput by remember { mutableStateOf("12") }
    var bsInput by remember { mutableStateOf("3") }
    var strengthInput by remember { mutableStateOf("4") }
    var toughnessInput by remember { mutableStateOf("4") }
    var saveInput by remember { mutableStateOf("3") }
    var useInvul by remember { mutableStateOf(false) }
    var invulInput by remember { mutableStateOf("4") }
    var useFnp by remember { mutableStateOf(false) }
    var fnpInput by remember { mutableStateOf("5") }
    var dmgInput by remember { mutableStateOf("1.0") }

    val attacks = attacksInput.toIntOrNull() ?: 12
    val bs = bsInput.toIntOrNull() ?: 3
    val strength = strengthInput.toIntOrNull() ?: 4
    val toughness = toughnessInput.toIntOrNull() ?: 4
    val save = saveInput.toIntOrNull() ?: 3
    val invul = if (useInvul) invulInput.toIntOrNull() else null
    val fnp = if (useFnp) fnpInput.toIntOrNull() else null
    val dmg = dmgInput.toFloatOrNull() ?: 1.0f

    val (hits, wounds, finalDmg) = viewModel.calculateProbability(
        attacks, bs, strength, toughness, save, invul, fnp, dmg
    )

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(bottom = 16.dp)
    ) {
        Text(
            text = "DICE PROBABILITY ENGINE GAUGE",
            color = Color.White,
            fontSize = 12.sp,
            fontWeight = FontWeight.Bold,
            fontFamily = FontFamily.Serif,
            modifier = Modifier.padding(bottom = 6.dp)
        )
        Text(
            text = "Calculates mathematically exact expected values based on 10th Ed statistics to evaluate tactics.",
            color = SubtleGray,
            fontSize = 10.sp,
            modifier = Modifier.padding(bottom = 12.dp)
        )

        Card(
            colors = CardDefaults.cardColors(containerColor = GrimDarkCard),
            border = BorderStroke(1.dp, GrimDarkBorder),
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(modifier = Modifier.padding(14.dp)) {
                // Inputs row 1
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                    Column(modifier = Modifier.weight(1f)) {
                        Text("Attacks count", color = SubtleGray, fontSize = 8.sp, fontWeight = FontWeight.Bold)
                        Spacer(modifier = Modifier.height(2.dp))
                        OutlinedTextField(
                            value = attacksInput,
                            onValueChange = { attacksInput = it },
                            singleLine = true,
                            colors = OutlinedTextFieldDefaults.colors(focusedTextColor = Color.White, unfocusedTextColor = LightParchment, focusedBorderColor = AmberGold, unfocusedBorderColor = GrimDarkBorder),
                            textStyle = androidx.compose.ui.text.TextStyle(fontSize = 11.sp)
                        )
                    }
                    Column(modifier = Modifier.weight(1f)) {
                        Text("Skill (e.g. 3)", color = SubtleGray, fontSize = 8.sp, fontWeight = FontWeight.Bold)
                        Spacer(modifier = Modifier.height(2.dp))
                        OutlinedTextField(
                            value = bsInput,
                            onValueChange = { bsInput = it },
                            singleLine = true,
                            colors = OutlinedTextFieldDefaults.colors(focusedTextColor = Color.White, unfocusedTextColor = LightParchment, focusedBorderColor = AmberGold, unfocusedBorderColor = GrimDarkBorder),
                            textStyle = androidx.compose.ui.text.TextStyle(fontSize = 11.sp)
                        )
                    }
                }

                Spacer(modifier = Modifier.height(10.dp))

                // Inputs row 2
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                    Column(modifier = Modifier.weight(1f)) {
                        Text("Strength", color = SubtleGray, fontSize = 8.sp, fontWeight = FontWeight.Bold)
                        Spacer(modifier = Modifier.height(2.dp))
                        OutlinedTextField(
                            value = strengthInput,
                            onValueChange = { strengthInput = it },
                            singleLine = true,
                            colors = OutlinedTextFieldDefaults.colors(focusedTextColor = Color.White, unfocusedTextColor = LightParchment, focusedBorderColor = AmberGold, unfocusedBorderColor = GrimDarkBorder),
                            textStyle = androidx.compose.ui.text.TextStyle(fontSize = 11.sp)
                        )
                    }
                    Column(modifier = Modifier.weight(1f)) {
                        Text("Target Toughness", color = SubtleGray, fontSize = 8.sp, fontWeight = FontWeight.Bold)
                        Spacer(modifier = Modifier.height(2.dp))
                        OutlinedTextField(
                            value = toughnessInput,
                            onValueChange = { toughnessInput = it },
                            singleLine = true,
                            colors = OutlinedTextFieldDefaults.colors(focusedTextColor = Color.White, unfocusedTextColor = LightParchment, focusedBorderColor = AmberGold, unfocusedBorderColor = GrimDarkBorder),
                            textStyle = androidx.compose.ui.text.TextStyle(fontSize = 11.sp)
                        )
                    }
                }

                Spacer(modifier = Modifier.height(10.dp))

                // Inputs row 3
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                    Column(modifier = Modifier.weight(1f)) {
                        Text("Target Armor Save", color = SubtleGray, fontSize = 8.sp, fontWeight = FontWeight.Bold)
                        Spacer(modifier = Modifier.height(2.dp))
                        OutlinedTextField(
                            value = saveInput,
                            onValueChange = { saveInput = it },
                            singleLine = true,
                            colors = OutlinedTextFieldDefaults.colors(focusedTextColor = Color.White, unfocusedTextColor = LightParchment, focusedBorderColor = AmberGold, unfocusedBorderColor = GrimDarkBorder),
                            textStyle = androidx.compose.ui.text.TextStyle(fontSize = 11.sp)
                        )
                    }
                    Column(modifier = Modifier.weight(1f)) {
                        Text("Damage character", color = SubtleGray, fontSize = 8.sp, fontWeight = FontWeight.Bold)
                        Spacer(modifier = Modifier.height(2.dp))
                        OutlinedTextField(
                            value = dmgInput,
                            onValueChange = { dmgInput = it },
                            singleLine = true,
                            colors = OutlinedTextFieldDefaults.colors(focusedTextColor = Color.White, unfocusedTextColor = LightParchment, focusedBorderColor = AmberGold, unfocusedBorderColor = GrimDarkBorder),
                            textStyle = androidx.compose.ui.text.TextStyle(fontSize = 11.sp)
                        )
                    }
                }

                Spacer(modifier = Modifier.height(12.dp))

                // Invul toggle
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Checkbox(checked = useInvul, onCheckedChange = { useInvul = it }, colors = CheckboxDefaults.colors(checkedColor = AmberGold))
                    Text("Enable Invul Save", color = LightParchment, fontSize = 11.sp)
                    Spacer(modifier = Modifier.width(10.dp))
                    if (useInvul) {
                        OutlinedTextField(value = invulInput, onValueChange = { invulInput = it }, modifier = Modifier.width(60.dp), textStyle = androidx.compose.ui.text.TextStyle(fontSize = 11.sp))
                    }
                }

                // Fnp toggle
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Checkbox(checked = useFnp, onCheckedChange = { useFnp = it }, colors = CheckboxDefaults.colors(checkedColor = AmberGold))
                    Text("Enable Feel No Pain Save", color = LightParchment, fontSize = 11.sp)
                    Spacer(modifier = Modifier.width(10.dp))
                    if (useFnp) {
                        OutlinedTextField(value = fnpInput, onValueChange = { fnpInput = it }, modifier = Modifier.width(60.dp), textStyle = androidx.compose.ui.text.TextStyle(fontSize = 11.sp))
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Probability Calculations Card
        Card(
            colors = CardDefaults.cardColors(containerColor = GrimDarkCard),
            border = BorderStroke(1.dp, AmberGold),
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Text("STATISTICAL RESULTS GAUGE", color = AmberGold, fontSize = 10.sp, fontWeight = FontWeight.Bold, letterSpacing = 1.sp)
                
                Spacer(modifier = Modifier.height(14.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceAround
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text("EXPECTED HITS", color = SubtleGray, fontSize = 9.sp)
                        Text(String.format("%.2f", hits), color = Color.White, fontSize = 18.sp, fontWeight = FontWeight.Bold)
                    }
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text("EXPECTED WOUNDS", color = SubtleGray, fontSize = 9.sp)
                        Text(String.format("%.2f", wounds), color = Color.White, fontSize = 18.sp, fontWeight = FontWeight.Bold)
                    }
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text("EXPECTED DAMAGE", color = AmberGold, fontSize = 9.sp)
                        Text(String.format("%.2f", finalDmg), color = AmberGold, fontSize = 18.sp, fontWeight = FontWeight.Bold)
                    }
                }

                Spacer(modifier = Modifier.height(14.dp))
                HorizontalDivider(color = GrimDarkBorder)
                Spacer(modifier = Modifier.height(10.dp))

                Text(
                    text = "Mathematical Analysis: Out of $attacks attacks hitting on $bs+ (BS), S$strength vs T$toughness wounds on ${if (strength >= toughness*2) "2+" else if (strength > toughness) "3+" else if (strength == toughness) "4+" else if (strength*2 <= toughness) "6+" else "5+"}. Opponent saves using a ${if (useInvul) "best armor/invul save of " + save.coerceAtMost(invulInput.toIntOrNull() ?: 4) + "+" else save.toString() + "+"} save.",
                    color = SubtleGray,
                    fontSize = 10.sp,
                    lineHeight = 14.sp
                )
            }
        }
    }
}
