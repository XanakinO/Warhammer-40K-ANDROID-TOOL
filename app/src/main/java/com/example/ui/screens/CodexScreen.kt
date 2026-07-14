package com.example.ui.screens

import androidx.compose.animation.*
import androidx.compose.foundation.*
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
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
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.domain.Datacard
import com.example.domain.Faction
import com.example.domain.FactionRepository
import com.example.ui.MainViewModel

@Composable
fun CodexScreen(viewModel: MainViewModel) {
    var codexMode by remember { mutableStateOf("browser") } // "browser" | "quiz" | "hobbyist"
    val selectedFactionId by viewModel.selectedFactionId.collectAsState()
    val faction = FactionRepository.getFactionById(selectedFactionId) ?: FactionRepository.FACTIONS.first()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(GrimDarkBg)
    ) {
        // Headers
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
                    text = "CODEX DEPOSITARY VAULT",
                    color = Color.White,
                    fontSize = 15.sp,
                    fontWeight = FontWeight.Bold,
                    fontFamily = FontFamily.Serif,
                    letterSpacing = 2.sp
                )
                Spacer(modifier = Modifier.height(2.dp))
                Text(
                    text = "10TH EDITION COMPENDIUM OF WAR",
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
                "browser" to "Factions",
                "quiz" to "Tactical Quiz",
                "hobbyist" to "Paints Corner"
            )
            subtabs.forEach { (id, label) ->
                val active = codexMode == id
                TextButton(
                    onClick = { codexMode = id },
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
            when (codexMode) {
                "browser" -> FactionBrowserView(viewModel, faction)
                "quiz" -> PlaystyleQuizView(viewModel)
                "hobbyist" -> HobbyistPaintsView(faction)
            }
        }
    }
}

@Composable
fun FactionBrowserView(viewModel: MainViewModel, faction: Faction) {
    Column(modifier = Modifier.fillMaxSize()) {
        // Horizontal scroll list of factions
        LazyRow(
            modifier = Modifier
                .fillMaxWidth()
                .padding(bottom = 12.dp),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            items(FactionRepository.FACTIONS) { f ->
                val isSelected = f.id == faction.id
                Card(
                    colors = CardDefaults.cardColors(
                        containerColor = if (isSelected) Color(0xFF451A03) else GrimDarkCard
                    ),
                    border = BorderStroke(1.dp, if (isSelected) AmberGold else GrimDarkBorder),
                    modifier = Modifier
                        .width(135.dp)
                        .clickable { viewModel.selectFaction(f.id) }
                ) {
                    Row(
                        modifier = Modifier.padding(10.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        val icon = when (f.iconName) {
                            "Shield" -> Icons.Default.Shield
                            "Bug" -> Icons.Default.BugReport
                            "Skull" -> Icons.Default.Skull
                            "Sparkles" -> Icons.Default.AutoAwesome
                            "Sword" -> Icons.Default.SportsMma
                            else -> Icons.Default.Shield
                        }
                        Icon(
                            imageVector = icon,
                            contentDescription = f.name,
                            tint = if (isSelected) AmberGold else SubtleGray,
                            modifier = Modifier.size(16.dp)
                        )
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(
                            text = f.name.substringBefore(" ("),
                            color = if (isSelected) Color.White else LightParchment,
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Bold,
                            maxLines = 1
                        )
                    }
                }
            }
        }

        // Faction Datasheet Details View
        LazyColumn(
            modifier = Modifier.fillMaxSize(),
            verticalArrangement = Arrangement.spacedBy(14.dp)
        ) {
            // Summary Card
            item {
                Card(
                    colors = CardDefaults.cardColors(containerColor = GrimDarkCard),
                    border = BorderStroke(1.dp, GrimDarkBorder),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(modifier = Modifier.padding(14.dp)) {
                        Text(
                            text = faction.name,
                            color = AmberGold,
                            fontSize = 16.sp,
                            fontWeight = FontWeight.Bold,
                            fontFamily = FontFamily.Serif
                        )
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = faction.description,
                            color = LightParchment,
                            fontSize = 11.sp,
                            lineHeight = 15.sp
                        )

                        Spacer(modifier = Modifier.height(10.dp))
                        HorizontalDivider(color = GrimDarkBorder)
                        Spacer(modifier = Modifier.height(8.dp))

                        // Playstyle Blocks
                        Text("PLAYSTYLE PROFILE", color = AmberGold, fontSize = 9.sp, fontWeight = FontWeight.Bold)
                        Text(faction.overview.playstyle, color = LightParchment, fontSize = 10.sp)
                        
                        Spacer(modifier = Modifier.height(8.dp))
                        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                            Column(modifier = Modifier.weight(1f)) {
                                Text("STRENGTHS:", color = Color.Green, fontSize = 9.sp, fontWeight = FontWeight.Bold)
                                faction.overview.strengths.forEach {
                                    Text("• $it", color = SubtleGray, fontSize = 10.sp)
                                }
                            }
                            Column(modifier = Modifier.weight(1f)) {
                                Text("WEAKNESSES:", color = Color.Red, fontSize = 9.sp, fontWeight = FontWeight.Bold)
                                faction.overview.weaknesses.forEach {
                                    Text("• $it", color = SubtleGray, fontSize = 10.sp)
                                }
                            }
                        }
                    }
                }
            }

            // Faction Rule Card
            item {
                Card(
                    colors = CardDefaults.cardColors(containerColor = GrimDarkCard),
                    border = BorderStroke(1.dp, AmberGold.copy(alpha = 0.2f)),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(modifier = Modifier.padding(14.dp)) {
                        Text(
                            text = "FACTION RULE: ${faction.factionRule.name}",
                            color = AmberGold,
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold,
                            fontFamily = FontFamily.Serif
                        )
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = faction.factionRule.description,
                            color = LightParchment,
                            fontSize = 11.sp,
                            lineHeight = 15.sp
                        )
                    }
                }
            }

            // Detachment Rule Card
            item {
                Card(
                    colors = CardDefaults.cardColors(containerColor = GrimDarkCard),
                    border = BorderStroke(1.dp, GrimDarkBorder),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(modifier = Modifier.padding(14.dp)) {
                        Text(
                            text = "DETACHMENT: ${faction.detachment.name}",
                            color = AmberGold,
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold,
                            fontFamily = FontFamily.Serif
                        )
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = faction.detachment.description,
                            color = SubtleGray,
                            fontSize = 10.sp
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            text = faction.detachment.benefit,
                            color = LightParchment,
                            fontSize = 11.sp,
                            lineHeight = 15.sp
                        )
                    }
                }
            }

            // Datasheets List
            item {
                Text(
                    text = "UNIT DATASHEETS (${faction.units.size})",
                    color = AmberGold,
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Bold,
                    fontFamily = FontFamily.Serif,
                    modifier = Modifier.padding(top = 8.dp, bottom = 4.dp)
                )
            }

            items(faction.units) { unit ->
                var unitExpanded by remember { mutableStateOf(false) }

                Card(
                    colors = CardDefaults.cardColors(containerColor = GrimDarkCard),
                    border = BorderStroke(1.dp, if (unitExpanded) AmberGold else GrimDarkBorder),
                    modifier = Modifier
                        .fillMaxWidth()
                        .clickable { unitExpanded = !unitExpanded }
                ) {
                    Column(modifier = Modifier.padding(14.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column {
                                Text(
                                    text = unit.name,
                                    color = if (unitExpanded) AmberGold else Color.White,
                                    fontSize = 13.sp,
                                    fontWeight = FontWeight.Bold
                                )
                                Text(
                                    text = "${unit.type} • ${unit.squadSize}",
                                    color = SubtleGray,
                                    fontSize = 10.sp
                                )
                            }
                            Text(
                                text = "${unit.points} PTS",
                                color = AmberGold,
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Bold,
                                fontFamily = FontFamily.Monospace
                            )
                        }

                        AnimatedVisibility(visible = unitExpanded) {
                            Column(modifier = Modifier.padding(top = 12.dp)) {
                                // Unit Stats Grid Table
                                UnitStatsGrid(unit)

                                Spacer(modifier = Modifier.height(12.dp))

                                // Abilities list
                                Text("ABILITIES:", color = AmberGold, fontSize = 9.sp, fontWeight = FontWeight.Bold)
                                if (unit.abilities.core.isNotEmpty()) {
                                    Text("Core: ${unit.abilities.core.joinToString(", ")}", color = LightParchment, fontSize = 10.sp)
                                }
                                if (unit.abilities.faction.isNotEmpty()) {
                                    Text("Faction: ${unit.abilities.faction.joinToString(", ")}", color = LightParchment, fontSize = 10.sp)
                                }
                                unit.abilities.datasheet.forEach { ability ->
                                    Text(
                                        text = "${ability.name}: ${ability.description}",
                                        color = LightParchment,
                                        fontSize = 10.sp,
                                        modifier = Modifier.padding(vertical = 2.dp)
                                    )
                                }

                                Spacer(modifier = Modifier.height(10.dp))

                                // Weapons profiles
                                if (unit.weapons.ranged.isNotEmpty()) {
                                    Text("RANGED WEAPONS:", color = AmberGold, fontSize = 9.sp, fontWeight = FontWeight.Bold)
                                    unit.weapons.ranged.forEach { weapon ->
                                        WeaponProfileItem(weapon)
                                    }
                                    Spacer(modifier = Modifier.height(8.dp))
                                }

                                if (unit.weapons.melee.isNotEmpty()) {
                                    Text("MELEE WEAPONS:", color = AmberGold, fontSize = 9.sp, fontWeight = FontWeight.Bold)
                                    unit.weapons.melee.forEach { weapon ->
                                        WeaponProfileItem(weapon)
                                    }
                                }

                                Spacer(modifier = Modifier.height(8.dp))
                                Text("KEYWORDS: ${unit.keywords.joinToString(", ")}", color = SubtleGray, fontSize = 8.sp)
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun UnitStatsGrid(unit: Datacard) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .background(GrimDarkBg)
            .border(BorderStroke(1.dp, GrimDarkBorder))
            .padding(8.dp),
        horizontalArrangement = Arrangement.SpaceAround
    ) {
        val stats = listOf(
            Triple("M", unit.stats.m, "Movement"),
            Triple("T", "${unit.stats.t}", "Toughness"),
            Triple("SV", unit.stats.sv, "Armor Save"),
            Triple("W", "${unit.stats.w}", "Wounds"),
            Triple("LD", unit.stats.ld, "Leadership"),
            Triple("OC", "${unit.stats.oc}", "Objective Control"),
            Triple("INVUL", unit.stats.invul ?: "-", "Invulnerable Save")
        )
        stats.forEach { (label, value, desc) ->
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Text(label, color = AmberGold, fontSize = 9.sp, fontWeight = FontWeight.Bold)
                Text(value, color = Color.White, fontSize = 12.sp, fontWeight = FontWeight.Bold)
            }
        }
    }
}

@Composable
fun WeaponProfileItem(weapon: com.example.domain.Weapon) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 4.dp)
            .background(GrimDarkBg)
            .padding(6.dp)
    ) {
        Text(weapon.name, color = LightParchment, fontSize = 10.sp, fontWeight = FontWeight.Bold)
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Text("Rng: ${weapon.range}", color = SubtleGray, fontSize = 8.sp)
            Text("A: ${weapon.attacks}", color = SubtleGray, fontSize = 8.sp)
            Text("Skill: ${weapon.skill}", color = SubtleGray, fontSize = 8.sp)
            Text("S: ${weapon.strength}", color = SubtleGray, fontSize = 8.sp)
            Text("AP: ${weapon.ap}", color = SubtleGray, fontSize = 8.sp)
            Text("D: ${weapon.damage}", color = SubtleGray, fontSize = 8.sp)
        }
        if (weapon.abilities.isNotEmpty()) {
            Text("Abilities: ${weapon.abilities.joinToString(", ")}", color = AmberGold, fontSize = 8.sp)
        }
    }
}

@Composable
fun PlaystyleQuizView(viewModel: MainViewModel) {
    val quizState by viewModel.quizState.collectAsState()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState()),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(
            text = "2-MINUTE TACTICAL PLAYSTYLE QUIZ",
            color = Color.White,
            fontSize = 12.sp,
            fontWeight = FontWeight.Bold,
            fontFamily = FontFamily.Serif,
            modifier = Modifier.padding(bottom = 12.dp)
        )

        if (quizState.recommendedFactionId == null) {
            val qIdx = quizState.activeQuestionIndex
            val question = viewModel.quizQuestions[qIdx]
            val options = viewModel.quizOptions[qIdx]

            Card(
                colors = CardDefaults.cardColors(containerColor = GrimDarkCard),
                border = BorderStroke(1.dp, GrimDarkBorder),
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(bottom = 16.dp)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text(
                        text = "QUESTION ${qIdx + 1} OF ${viewModel.quizQuestions.size}",
                        color = AmberGold,
                        fontSize = 9.sp,
                        fontWeight = FontWeight.Bold,
                        letterSpacing = 1.sp
                    )
                    Spacer(modifier = Modifier.height(6.dp))
                    Text(
                        text = question,
                        color = Color.White,
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Bold,
                        lineHeight = 18.sp
                    )
                    
                    Spacer(modifier = Modifier.height(16.dp))

                    options.forEachIndexed { optIdx, option ->
                        Button(
                            onClick = { viewModel.answerQuizQuestion(optIdx) },
                            colors = ButtonDefaults.buttonColors(containerColor = GrimDarkBg),
                            border = BorderStroke(1.dp, GrimDarkBorder),
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(vertical = 6.dp),
                            shape = RoundedCornerShape(8.dp)
                        ) {
                            Text(
                                text = option,
                                color = LightParchment,
                                fontSize = 11.sp,
                                textAlign = TextAlign.Center
                            )
                        }
                    }
                }
            }
        } else {
            // Recommendation result
            val recFaction = FactionRepository.getFactionById(quizState.recommendedFactionId!!)!!
            Card(
                colors = CardDefaults.cardColors(containerColor = GrimDarkCard),
                border = BorderStroke(1.dp, AmberGold),
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(bottom = 16.dp),
                shape = RoundedCornerShape(12.dp)
            ) {
                Column(
                    modifier = Modifier.padding(18.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Icon(
                        imageVector = Icons.Default.Award,
                        contentDescription = "Success",
                        tint = AmberGold,
                        modifier = Modifier.size(48.dp)
                    )
                    Spacer(modifier = Modifier.height(10.dp))
                    Text(
                        text = "QUIZ RESOLVED!",
                        color = AmberGold,
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        letterSpacing = 1.5.sp
                    )
                    Spacer(modifier = Modifier.height(6.dp))
                    Text(
                        text = "Your Tactical Destiny points to:",
                        color = LightParchment,
                        fontSize = 11.sp
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        text = recFaction.name,
                        color = Color.White,
                        fontSize = 16.sp,
                        fontWeight = FontWeight.Bold,
                        fontFamily = FontFamily.Serif
                    )
                    Spacer(modifier = Modifier.height(10.dp))
                    Text(
                        text = recFaction.overview.playstyle,
                        color = SubtleGray,
                        fontSize = 11.sp,
                        textAlign = TextAlign.Center,
                        lineHeight = 15.sp
                    )
                    
                    Spacer(modifier = Modifier.height(18.dp))

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        Button(
                            onClick = { viewModel.resetQuiz() },
                            colors = ButtonDefaults.buttonColors(containerColor = GrimDarkBg),
                            border = BorderStroke(1.dp, GrimDarkBorder),
                            modifier = Modifier.weight(1f)
                        ) {
                            Text("Restart Quiz", color = SubtleGray, fontSize = 11.sp)
                        }

                        Button(
                            onClick = {
                                viewModel.selectFaction(recFaction.id)
                                codexMode = "browser"
                            },
                            colors = ButtonDefaults.buttonColors(containerColor = AmberGold),
                            modifier = Modifier.weight(1.2f)
                        ) {
                            Text("Vault Datasheets", color = Color.Black, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun HobbyistPaintsView(faction: Faction) {
    val schemes = mapOf(
        "space_marines" to Pair("Ceramite Adeptus Blue", listOf(
            PaintScheme("Base Armor", "Macragge Blue", "#1B3B6F"),
            PaintScheme("Highlights", "Calgar Blue", "#4A90E2"),
            PaintScheme("Chest Eagle", "Retributor Armour", "#C5A059"),
            PaintScheme("Metal Parts", "Leadbelcher", "#7F8C8D")
        )),
        "tyranids" to Pair("Splinter Hive Leviathan", listOf(
            PaintScheme("Chitin/Skin", "Wraithbone", "#F5EFE6"),
            PaintScheme("Carapace Shell", "Naggaroth Night", "#3C1E5A"),
            PaintScheme("Claws/Details", "Khorne Red", "#8B0000"),
            PaintScheme("Bio-glowing spots", "Tesseract Glow", "#39FF14")
        )),
        "necrons" to Pair("Awakened Necron Brass", listOf(
            PaintScheme("Body Metal", "Leadbelcher", "#5D6D7E"),
            PaintScheme("Armor Panels", "Runelord Brass", "#A0522D"),
            PaintScheme("Energy Orbs", "Moot Green", "#00FF00"),
            PaintScheme("Shading Wash", "Nuln Oil", "#111111")
        )),
        "aeldari" to Pair("Saim-Hann Wild Red", listOf(
            PaintScheme("Armor Plates", "Mephiston Red", "#C21807"),
            PaintScheme("Helmets/Wings", "Wraithbone White", "#FAF9F6"),
            PaintScheme("Gemstones", "Soulstone Blue", "#007FFF"),
            PaintScheme("Weapons Trim", "Chaos Black", "#1E1E1E")
        )),
        "orks" to Pair("Savage Ork Green Horde", listOf(
            PaintScheme("Ork Hide Skin", "Orruk Flesh", "#3A5F0B"),
            PaintScheme("Metal Armor", "Leadbelcher", "#707B7C"),
            PaintScheme("Cloths/War paint", "Evil Sunz Scarlet", "#E74C3C"),
            PaintScheme("Teeth/Bones", "Ushabti Bone", "#EAE6DF")
        )),
        "chaos_space_marines" to Pair("Traitor Black Legion", listOf(
            PaintScheme("Power Armor", "Abaddon Black", "#111111"),
            PaintScheme("Trim Details", "Retributor Gold", "#D4AF37"),
            PaintScheme("Lenses/Eyes", "Khorne Red", "#B22222"),
            PaintScheme("Demonic Flesh", "Screamer Pink", "#9932CC")
        )),
        "astra_militarum" to Pair("Cadian Combined Khaki", listOf(
            PaintScheme("Flak Armor", "Castellan Green", "#2D4B32"),
            PaintScheme("Fatigues Guard", "Zandri Dust", "#D2B48C"),
            PaintScheme("Rifle/Pouches", "Dryad Bark", "#5C4033"),
            PaintScheme("Boots", "Abaddon Black", "#1C1C1C")
        )),
        "adeptus_custodes" to Pair("Shimmering Golden Auramite", listOf(
            PaintScheme("Full Auramite", "Retributor Armour", "#DAA520"),
            PaintScheme("Wash Shade", "Reikland Fleshshade", "#800000"),
            PaintScheme("Robes/Capes", "Khorne Red", "#8B0000"),
            PaintScheme("Lenses/Power", "Temple Guard Blue", "#00FFFF")
        ))
    )

    val currentScheme = schemes[faction.id] ?: Pair("Generic Army Paint", listOf(
        PaintScheme("Base Armor", "Mechanicus Standard Grey", "#7F8C8D"),
        PaintScheme("Metallic Parts", "Leadbelcher", "#696969"),
        PaintScheme("Wash Shade", "Nuln Oil", "#111111")
    ))

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
    ) {
        Text(
            text = "BEGINNER PAINT SCHEMES CORNER",
            color = Color.White,
            fontSize = 12.sp,
            fontWeight = FontWeight.Bold,
            fontFamily = FontFamily.Serif,
            modifier = Modifier.padding(bottom = 6.dp)
        )
        Text(
            text = "Beginner-friendly Citadel formulas to bring your models to the gaming table.",
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
                Text(
                    text = "${faction.name.substringBefore(" (").uppercase()} FORMULA:",
                    color = AmberGold,
                    fontSize = 10.sp,
                    fontWeight = FontWeight.Bold,
                    letterSpacing = 1.sp
                )
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = currentScheme.first,
                    color = Color.White,
                    fontSize = 13.sp,
                    fontWeight = FontWeight.Bold,
                    fontFamily = FontFamily.Serif
                )
                
                Spacer(modifier = Modifier.height(14.dp))

                currentScheme.second.forEach { paint ->
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(vertical = 6.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        // Color chip
                        Box(
                            modifier = Modifier
                                .size(28.dp)
                                .background(Color(android.graphics.Color.parseColor(paint.hex)), RoundedCornerShape(6.dp))
                                .border(BorderStroke(1.5.dp, Color.White.copy(alpha = 0.2f)), RoundedCornerShape(6.dp))
                        )
                        Spacer(modifier = Modifier.width(12.dp))
                        Column {
                            Text(
                                text = paint.layerName,
                                color = LightParchment,
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold
                            )
                            Text(
                                text = "Formula: ${paint.paintName} (${paint.hex.uppercase()})",
                                color = SubtleGray,
                                fontSize = 9.sp,
                                fontFamily = FontFamily.Monospace
                            )
                        }
                    }
                }
            }
        }
    }
}

data class PaintScheme(
    val layerName: String,
    val paintName: String,
    val hex: String
)
