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
import com.example.ui.MainViewModel

// Custom colors for Grimdark theme
val GrimDarkBg = Color(0xFF050607)
val GrimDarkCard = Color(0xFF0C0E10)
val GrimDarkBorder = Color(0xFF181C1F)
val AmberGold = Color(0xFFF59E0B)
val LightParchment = Color(0xFFE2E8F0)
val SubtleGray = Color(0xFF94A3B8)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AcademyScreen(viewModel: MainViewModel) {
    var selectedTab by remember { mutableStateOf("phases") } // "phases" | "glossary" | "simulator"

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(GrimDarkBg)
    ) {
        // Academy Header
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
                    text = "RECRUIT STRATEGIUM ACADEMY",
                    color = Color.White,
                    fontSize = 15.sp,
                    fontWeight = FontWeight.Bold,
                    fontFamily = FontFamily.Serif,
                    letterSpacing = 2.sp
                )
                Spacer(modifier = Modifier.height(2.dp))
                Text(
                    text = "10TH EDITION COMBAT INITIATION AND SIMULATION",
                    color = AmberGold,
                    fontSize = 9.sp,
                    fontWeight = FontWeight.Bold,
                    letterSpacing = 1.sp
                )
            }
        }

        // Subtabs selector
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp, vertical = 12.dp)
                .background(GrimDarkCard, RoundedCornerShape(8.dp))
                .border(BorderStroke(1.dp, GrimDarkBorder), RoundedCornerShape(8.dp)),
            horizontalArrangement = Arrangement.SpaceEvenly
        ) {
            val subtabs = listOf(
                "phases" to "Battle Phases",
                "glossary" to "Glossary Vault",
                "simulator" to "Combat Sim"
            )
            subtabs.forEach { (id, label) ->
                val active = selectedTab == id
                TextButton(
                    onClick = { selectedTab = id },
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

        // Content
        Box(
            modifier = Modifier
                .fill some / weight(1f) // Wait, guideline warning: No "some" typos
                .weight(1f)
                .padding(horizontal = 16.dp)
        ) {
            when (selectedTab) {
                "phases" -> BattlePhasesView()
                "glossary" -> GlossaryVaultView()
                "simulator" -> CombatSimView(viewModel)
            }
        }
    }
}

@Composable
fun BattlePhasesView() {
    val phases = listOf(
        PhaseData(
            "1. Command Phase",
            "Gather Command Points (CP) and verify your army's battlefield morale.",
            listOf(
                "Gain 1 Command Point (CP) automatically at the start of your turn.",
                "Score Primary Mission Victory Points (VP) if applicable (starting Round 2).",
                "Perform Battle-shock tests for any units under half-strength (roll 2D6, must meet/beat Leadership).",
                "Resolve command phase abilities (e.g., Space Marine Oath of Moment selection)."
            ),
            "Don't forget Battle-shock! Being battle-shocked sets a unit's Objective Control (OC) to 0 and blocks them from receiving Stratagems, making it impossible to capture contested objectives."
        ),
        PhaseData(
            "2. Movement Phase",
            "Reposition your forces to claim objectives, gain cover, or prepare charges.",
            listOf(
                "Move squads using Normal Move, Advance (adds D6\" of distance), or Fall Back (escapes melee).",
                "Verify Unit Coherency: models must stay within 2 inches of another model in their unit.",
                "Reinforcements step: Set up arriving Reserves/Deep Strike squads more than 9\" from enemy units.",
                "Ensure no normal or advanced move takes models within 1\" of any enemy models."
            ),
            "Advancing prevents a unit from shooting or charging later in the turn, unless weapons have the 'Assault' keyword."
        ),
        PhaseData(
            "3. Shooting Phase",
            "Unleash ranged weapons to thin enemy ranks from a safe distance.",
            listOf(
                "Select eligible unit to shoot (units that did not Advance or Fall Back).",
                "Declare ALL targets for ALL weapons in the shooting unit BEFORE rolling any dice.",
                "Verify Line of Sight and weapon Range to each targeted enemy unit.",
                "Resolve attacks: Roll to Hit (BS), Roll to Wound (S vs T), Allocate Wounds, roll Saves, apply Damage."
            ),
            "Always declare all weapon targets at once. If you split a squad's fire, you must specify which gun shoots where before rolling any dice!"
        ),
        PhaseData(
            "4. Charge Phase",
            "Launch units into brutal close-combat engagement.",
            listOf(
                "Select eligible unit within 12 inches of an enemy. (Advanced, Fallen Back, or already in engagement range are ineligible).",
                "Roll 2D6 for the Charge Distance.",
                "Verify success: The charge succeeds only if the distance allows moving to within 1\" (Engagement Range) of all targeted enemy units.",
                "Move charging models. The first model must base-to-base if possible."
            ),
            "If a charge roll fails by even 1 inch, no models move at all! The charge fails and the unit remains stationary."
        ),
        PhaseData(
            "5. Fight Phase",
            "Resolve close-quarters melee combat between engaged units.",
            listOf(
                "Fight Order: 1. Units with 'Fights First' (including charging units), starting with the defender. 2. Remaining units alternating starting with defender.",
                "For each unit, Pile In up to 3 inches to maximize base contact.",
                "Resolve melee attacks using WS, Strength vs Toughness, opponent Saves, and allocate damage.",
                "Consolidate up to 3 inches towards the nearest enemy unit or objective."
            ),
            "Melee weapons do not have ranges. Any model in base-to-base contact, or within 1/2 inch of a model in base-to-base contact, can strike."
        )
    )

    var expandedPhaseIdx by remember { mutableStateOf(0) }

    LazyColumn(
        modifier = Modifier.fillMaxSize(),
        verticalArrangement = Arrangement.spacedBy(10.dp)
    ) {
        items(phases.size) { idx ->
            val phase = phases[idx]
            val isExpanded = expandedPhaseIdx == idx
            
            Card(
                colors = CardDefaults.cardColors(containerColor = GrimDarkCard),
                border = BorderStroke(1.dp, if (isExpanded) AmberGold else GrimDarkBorder),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(
                    modifier = Modifier
                        .clickable { expandedPhaseIdx = if (isExpanded) -1 else idx }
                        .padding(14.dp)
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = phase.title,
                            color = if (isExpanded) AmberGold else Color.White,
                            fontSize = 13.sp,
                            fontWeight = FontWeight.Bold,
                            fontFamily = FontFamily.Serif
                        )
                        Icon(
                            imageVector = if (isExpanded) Icons.Default.KeyboardArrowUp else Icons.Default.KeyboardArrowDown,
                            contentDescription = "Expand",
                            tint = if (isExpanded) AmberGold else SubtleGray
                        )
                    }
                    
                    AnimatedVisibility(
                        visible = isExpanded,
                        enter = fadeIn() + expandVertically(),
                        exit = fadeOut() + shrinkVertically()
                    ) {
                        Column(modifier = Modifier.padding(top = 10.dp)) {
                            Text(
                                text = phase.intent,
                                color = SubtleGray,
                                fontSize = 11.sp,
                                modifier = Modifier.padding(bottom = 8.dp)
                            )
                            
                            HorizontalDivider(color = GrimDarkBorder, modifier = Modifier.padding(vertical = 6.dp))
                            
                            Text(
                                text = "PHASE PROTOCOL CHECKLIST:",
                                color = AmberGold,
                                fontSize = 9.sp,
                                fontWeight = FontWeight.Bold,
                                modifier = Modifier.padding(bottom = 6.dp)
                            )
                            
                            phase.checklist.forEach { step ->
                                Row(
                                    modifier = Modifier.padding(vertical = 4.dp),
                                    verticalAlignment = Alignment.Top
                                ) {
                                    Icon(
                                        imageVector = Icons.Default.CheckCircle,
                                        contentDescription = "Step",
                                        tint = AmberGold.copy(alpha = 0.6f),
                                        modifier = Modifier
                                            .size(14.dp)
                                            .padding(top = 2.dp)
                                    )
                                    Spacer(modifier = Modifier.width(8.dp))
                                    Text(
                                        text = step,
                                        color = LightParchment,
                                        fontSize = 11.sp
                                    )
                                }
                            }
                            
                            Box(
                                modifier = Modifier
                                    .padding(top = 12.dp)
                                    .fillMaxWidth()
                                    .background(Color(0xFF451A03).copy(alpha = 0.3f), RoundedCornerShape(4.dp))
                                    .border(BorderStroke(1.dp, Color(0xFF78350F)), RoundedCornerShape(4.dp))
                                    .padding(8.dp)
                            ) {
                                Row(verticalAlignment = Alignment.Top) {
                                    Icon(
                                        imageVector = Icons.Default.Info,
                                        contentDescription = "Tactical Tip",
                                        tint = AmberGold,
                                        modifier = Modifier.size(14.dp).padding(top = 1.dp)
                                    )
                                    Spacer(modifier = Modifier.width(6.dp))
                                    Text(
                                        text = phase.tip,
                                        color = AmberGold,
                                        fontSize = 10.sp,
                                        lineHeight = 13.sp
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

data class PhaseData(
    val title: String,
    val intent: String,
    val checklist: List<String>,
    val tip: String
)

@Composable
fun GlossaryVaultView() {
    val glossary = listOf(
        GlossaryData("Feel No Pain (FNP)", "Saves", "An extra defensive roll made after a saving throw fails. Roll a D6 for each point of damage. On a specified roll (e.g., 5+), that damage point is ignored.", "A unit with FNP 5+ takes a 3-damage attack. It rolls 3 dice: 5, 2, 6. It ignores 2 damage and suffers only 1."),
        GlossaryData("Deep Strike", "Movement", "Allows a unit to start in Reserves and deploy anywhere on the board during the Reinforcements step of your Movement phase, as long as it is more than 9 inches away from enemy models.", "Terminators teleporting into the enemy backline to surprise-charge an objective."),
        GlossaryData("Devastating Wounds", "Weapons", "A critical wound roll (typically an unmodified 6) ignores all saving throws of any kind, including Armor and Invulnerable saves, inflicting damage directly.", "A heavy weapon rolls a '6' to wound. The target gets no armor or invul save; they must allocate the damage directly."),
        GlossaryData("Sustained Hits", "Weapons", "A critical hit roll (usually an unmodified 6) scores additional hits. Sustained Hits 1 scores 1 extra hit; Sustained Hits 2 scores 2 extra, etc.", "Rolling 5 shots: rolling a '6' with Sustained Hits 1 counts as 2 hits instead of just 1."),
        GlossaryData("Lethal Hits", "Weapons", "A critical hit roll (usually an unmodified 6) automatically wounds the target, bypassing the wound roll entirely and proceeding directly to saving throws.", "Shooting a high-toughness tank with bolt guns. A hit roll of '6' automatically wounds, skipping the S vs T wound check."),
        GlossaryData("Lone Operative", "Abilities", "A model that cannot be targeted by ranged attacks from more than 12 inches away, protecting key characters in the open field.", "A sniper standing on a tower cannot be targeted by enemy tanks across the battlefield."),
        GlossaryData("Stealth", "Abilities", "Subtract 1 from all hit rolls made against this unit by ranged attacks.", "Enemy shooting at your stealthy rangers hits on a 4+ instead of their standard 3+.")
    )

    var searchQuery by remember { mutableStateOf("") }
    val filteredGlossary = glossary.filter {
        it.term.contains(searchQuery, ignoreCase = true) || it.desc.contains(searchQuery, ignoreCase = true)
    }

    Column(modifier = Modifier.fillMaxSize()) {
        // Search bar
        OutlinedTextField(
            value = searchQuery,
            onValueChange = { searchQuery = it },
            placeholder = { Text("Search glossary terms...", color = SubtleGray, fontSize = 12.sp) },
            singleLine = true,
            modifier = Modifier
                .fillMaxWidth()
                .padding(bottom = 12.dp),
            colors = OutlinedTextFieldDefaults.colors(
                focusedTextColor = Color.White,
                unfocusedTextColor = LightParchment,
                focusedBorderColor = AmberGold,
                unfocusedBorderColor = GrimDarkBorder,
                focusedContainerColor = GrimDarkCard,
                unfocusedContainerColor = GrimDarkCard
            ),
            trailingIcon = { Icon(Icons.Default.Search, contentDescription = "Search", tint = AmberGold) }
        )

        LazyColumn(
            modifier = Modifier.fillMaxSize(),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            items(filteredGlossary) { item ->
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
                            Text(
                                text = item.term,
                                color = AmberGold,
                                fontSize = 13.sp,
                                fontWeight = FontWeight.Bold,
                                fontFamily = FontFamily.Serif
                            )
                            Box(
                                modifier = Modifier
                                    .background(AmberGold.copy(alpha = 0.1f), RoundedCornerShape(4.dp))
                                    .border(BorderStroke(1.dp, AmberGold.copy(alpha = 0.3f)), RoundedCornerShape(4.dp))
                                    .padding(horizontal = 6.dp, vertical = 2.dp)
                            ) {
                                Text(
                                    text = item.category.uppercase(),
                                    color = AmberGold,
                                    fontSize = 8.sp,
                                    fontWeight = FontWeight.Bold
                                )
                            }
                        }
                        
                        Spacer(modifier = Modifier.height(6.dp))
                        
                        Text(
                            text = item.desc,
                            color = LightParchment,
                            fontSize = 11.sp,
                            lineHeight = 15.sp
                        )
                        
                        Spacer(modifier = Modifier.height(8.dp))
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .background(GrimDarkBg)
                                .border(BorderStroke(1.dp, GrimDarkBorder))
                                .padding(8.dp)
                        ) {
                            Text(
                                text = "EXAMPLE: ${item.example}",
                                color = SubtleGray,
                                fontSize = 9.sp,
                                fontFamily = FontFamily.Monospace,
                                lineHeight = 12.sp
                            )
                        }
                    }
                }
            }
        }
    }
}

data class GlossaryData(
    val term: String,
    val category: String,
    val desc: String,
    val example: String
)

@Composable
fun CombatSimView(viewModel: MainViewModel) {
    val simResult by viewModel.diceSimResult.collectAsState()

    var attacks by remember { mutableStateOf("5") }
    var bs by remember { mutableStateOf("3") }
    var strength by remember { mutableStateOf("4") }
    var toughness by remember { mutableStateOf("4") }
    var save by remember { mutableStateOf("3") }
    
    var useInvul by remember { mutableStateOf(false) }
    var invul by remember { mutableStateOf("4") }
    
    var useFnp by remember { mutableStateOf(false) }
    var fnp by remember { mutableStateOf("5") }
    
    var damageStr by remember { mutableStateOf("2") }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(bottom = 16.dp)
    ) {
        Text(
            text = "TACTICAL MELEE & SHOOTING ROLLER",
            color = Color.White,
            fontSize = 12.sp,
            fontWeight = FontWeight.Bold,
            fontFamily = FontFamily.Serif,
            modifier = Modifier.padding(bottom = 12.dp)
        )

        // Grid-based entry panel
        Card(
            colors = CardDefaults.cardColors(containerColor = GrimDarkCard),
            border = BorderStroke(1.dp, GrimDarkBorder),
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(modifier = Modifier.padding(14.dp)) {
                // Attacks & Skill
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                    Column(modifier = Modifier.weight(1f)) {
                        Text("Attacks (e.g. 5)", color = SubtleGray, fontSize = 9.sp, fontWeight = FontWeight.Bold)
                        Spacer(modifier = Modifier.height(4.dp))
                        OutlinedTextField(
                            value = attacks,
                            onValueChange = { attacks = it },
                            singleLine = true,
                            colors = OutlinedTextFieldDefaults.colors(
                                focusedTextColor = Color.White,
                                unfocusedTextColor = LightParchment,
                                focusedBorderColor = AmberGold,
                                unfocusedBorderColor = GrimDarkBorder,
                                focusedContainerColor = GrimDarkBg,
                                unfocusedContainerColor = GrimDarkBg
                            ),
                            textStyle = TextStyle(fontSize = 12.sp)
                        )
                    }
                    Column(modifier = Modifier.weight(1f)) {
                        Text("Skill BS/WS (e.g. 3+)", color = SubtleGray, fontSize = 9.sp, fontWeight = FontWeight.Bold)
                        Spacer(modifier = Modifier.height(4.dp))
                        OutlinedTextField(
                            value = bs,
                            onValueChange = { bs = it },
                            singleLine = true,
                            colors = OutlinedTextFieldDefaults.colors(
                                focusedTextColor = Color.White,
                                unfocusedTextColor = LightParchment,
                                focusedBorderColor = AmberGold,
                                unfocusedBorderColor = GrimDarkBorder,
                                focusedContainerColor = GrimDarkBg,
                                unfocusedContainerColor = GrimDarkBg
                            ),
                            textStyle = TextStyle(fontSize = 12.sp)
                        )
                    }
                }

                Spacer(modifier = Modifier.height(10.dp))

                // Strength & Toughness
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                    Column(modifier = Modifier.weight(1f)) {
                        Text("Weapon Strength", color = SubtleGray, fontSize = 9.sp, fontWeight = FontWeight.Bold)
                        Spacer(modifier = Modifier.height(4.dp))
                        OutlinedTextField(
                            value = strength,
                            onValueChange = { strength = it },
                            singleLine = true,
                            colors = OutlinedTextFieldDefaults.colors(
                                focusedTextColor = Color.White,
                                unfocusedTextColor = LightParchment,
                                focusedBorderColor = AmberGold,
                                unfocusedBorderColor = GrimDarkBorder,
                                focusedContainerColor = GrimDarkBg,
                                unfocusedContainerColor = GrimDarkBg
                            ),
                            textStyle = TextStyle(fontSize = 12.sp)
                        )
                    }
                    Column(modifier = Modifier.weight(1f)) {
                        Text("Target Toughness", color = SubtleGray, fontSize = 9.sp, fontWeight = FontWeight.Bold)
                        Spacer(modifier = Modifier.height(4.dp))
                        OutlinedTextField(
                            value = toughness,
                            onValueChange = { toughness = it },
                            singleLine = true,
                            colors = OutlinedTextFieldDefaults.colors(
                                focusedTextColor = Color.White,
                                unfocusedTextColor = LightParchment,
                                focusedBorderColor = AmberGold,
                                unfocusedBorderColor = GrimDarkBorder,
                                focusedContainerColor = GrimDarkBg,
                                unfocusedContainerColor = GrimDarkBg
                            ),
                            textStyle = TextStyle(fontSize = 12.sp)
                        )
                    }
                }

                Spacer(modifier = Modifier.height(10.dp))

                // Armor Save & Damage
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                    Column(modifier = Modifier.weight(1f)) {
                        Text("Target Armor Save", color = SubtleGray, fontSize = 9.sp, fontWeight = FontWeight.Bold)
                        Spacer(modifier = Modifier.height(4.dp))
                        OutlinedTextField(
                            value = save,
                            onValueChange = { save = it },
                            singleLine = true,
                            colors = OutlinedTextFieldDefaults.colors(
                                focusedTextColor = Color.White,
                                unfocusedTextColor = LightParchment,
                                focusedBorderColor = AmberGold,
                                unfocusedBorderColor = GrimDarkBorder,
                                focusedContainerColor = GrimDarkBg,
                                unfocusedContainerColor = GrimDarkBg
                            ),
                            textStyle = TextStyle(fontSize = 12.sp)
                        )
                    }
                    Column(modifier = Modifier.weight(1f)) {
                        Text("Damage (e.g. 2, D3, D6)", color = SubtleGray, fontSize = 9.sp, fontWeight = FontWeight.Bold)
                        Spacer(modifier = Modifier.height(4.dp))
                        OutlinedTextField(
                            value = damageStr,
                            onValueChange = { damageStr = it },
                            singleLine = true,
                            colors = OutlinedTextFieldDefaults.colors(
                                focusedTextColor = Color.White,
                                unfocusedTextColor = LightParchment,
                                focusedBorderColor = AmberGold,
                                unfocusedBorderColor = GrimDarkBorder,
                                focusedContainerColor = GrimDarkBg,
                                unfocusedContainerColor = GrimDarkBg
                            ),
                            textStyle = TextStyle(fontSize = 12.sp)
                        )
                    }
                }

                Spacer(modifier = Modifier.height(12.dp))

                // Invul Checkbox & Field
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Checkbox(
                        checked = useInvul,
                        onCheckedChange = { useInvul = it },
                        colors = CheckboxDefaults.colors(checkedColor = AmberGold, uncheckedColor = SubtleGray)
                    )
                    Text("Enable Target Invulnerable Save", color = LightParchment, fontSize = 11.sp)
                    Spacer(modifier = Modifier.weight(1f))
                    if (useInvul) {
                        OutlinedTextField(
                            value = invul,
                            onValueChange = { invul = it },
                            singleLine = true,
                            modifier = Modifier.width(60.dp),
                            colors = OutlinedTextFieldDefaults.colors(
                                focusedTextColor = Color.White,
                                unfocusedTextColor = LightParchment,
                                focusedBorderColor = AmberGold,
                                unfocusedBorderColor = GrimDarkBorder,
                                focusedContainerColor = GrimDarkBg,
                                unfocusedContainerColor = GrimDarkBg
                            ),
                            textStyle = TextStyle(fontSize = 11.sp)
                        )
                    }
                }

                // FNP Checkbox & Field
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Checkbox(
                        checked = useFnp,
                        onCheckedChange = { useFnp = it },
                        colors = CheckboxDefaults.colors(checkedColor = AmberGold, uncheckedColor = SubtleGray)
                    )
                    Text("Enable Feel No Pain (FNP) Save", color = LightParchment, fontSize = 11.sp)
                    Spacer(modifier = Modifier.weight(1f))
                    if (useFnp) {
                        OutlinedTextField(
                            value = fnp,
                            onValueChange = { fnp = it },
                            singleLine = true,
                            modifier = Modifier.width(60.dp),
                            colors = OutlinedTextFieldDefaults.colors(
                                focusedTextColor = Color.White,
                                unfocusedTextColor = LightParchment,
                                focusedBorderColor = AmberGold,
                                unfocusedBorderColor = GrimDarkBorder,
                                focusedContainerColor = GrimDarkBg,
                                unfocusedContainerColor = GrimDarkBg
                            ),
                            textStyle = TextStyle(fontSize = 11.sp)
                        )
                    }
                }

                Spacer(modifier = Modifier.height(14.dp))

                // Action buttons
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                    Button(
                        onClick = { viewModel.clearDiceResult() },
                        colors = ButtonDefaults.buttonColors(containerColor = GrimDarkBg),
                        border = BorderStroke(1.dp, GrimDarkBorder),
                        modifier = Modifier.weight(1f)
                    ) {
                        Text("Reset", color = SubtleGray, fontSize = 11.sp)
                    }

                    Button(
                        onClick = {
                            viewModel.runDiceSimulation(
                                attacks = attacks.toIntOrNull() ?: 5,
                                bs = bs.replace("+", "").toIntOrNull() ?: 3,
                                strength = strength.toIntOrNull() ?: 4,
                                toughness = toughness.toIntOrNull() ?: 4,
                                save = save.replace("+", "").toIntOrNull() ?: 3,
                                invul = if (useInvul) invul.replace("+", "").toIntOrNull() else null,
                                fnp = if (useFnp) fnp.replace("+", "").toIntOrNull() else null,
                                damageStr = damageStr
                            )
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = AmberGold),
                        modifier = Modifier.weight(1f.5f)
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(Icons.Default.Casino, contentDescription = "Roll", tint = Color.Black, modifier = Modifier.size(14.dp))
                            Spacer(modifier = Modifier.width(6.dp))
                            Text("Roll Combat Dice", color = Color.Black, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                        }
                    }
                }
            }
        }

        // Output section
        if (simResult.logs.isNotEmpty()) {
            Spacer(modifier = Modifier.height(16.dp))
            Text(
                text = "SACRED COGITATOR LOGS:",
                color = AmberGold,
                fontSize = 10.sp,
                fontWeight = FontWeight.Bold,
                letterSpacing = 1.sp,
                modifier = Modifier.padding(bottom = 6.dp)
            )

            // Result indicators
            Card(
                colors = CardDefaults.cardColors(containerColor = GrimDarkCard),
                border = BorderStroke(1.dp, AmberGold.copy(alpha = 0.4f)),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(14.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceAround
                    ) {
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Text("HITS", color = SubtleGray, fontSize = 9.sp)
                            Text("${simResult.hitSuccesses}/${simResult.attacks}", color = Color.White, fontSize = 16.sp, fontWeight = FontWeight.Bold)
                        }
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Text("WOUNDS", color = SubtleGray, fontSize = 9.sp)
                            Text("${simResult.woundSuccesses}", color = Color.White, fontSize = 16.sp, fontWeight = FontWeight.Bold)
                        }
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Text("ALLOCATED", color = AmberGold, fontSize = 9.sp)
                            Text("${simResult.finalDamage}", color = AmberGold, fontSize = 16.sp, fontWeight = FontWeight.Bold)
                        }
                    }

                    HorizontalDivider(color = GrimDarkBorder, modifier = Modifier.padding(vertical = 12.dp))

                    simResult.logs.forEach { log ->
                        Text(
                            text = "> $log",
                            color = if (log.contains("Total damage")) AmberGold else LightParchment,
                            fontSize = 10.sp,
                            fontFamily = FontFamily.Monospace,
                            modifier = Modifier.padding(vertical = 2.dp)
                        )
                    }
                }
            }
        }
    }
}
