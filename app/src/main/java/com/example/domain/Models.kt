package com.example.domain

import kotlinx.serialization.Serializable

@Serializable
data class Weapon(
    val name: String,
    val range: String, // e.g. "24\"" or "Melee"
    val attacks: String, // e.g. "4" or "D6"
    val skill: String, // e.g. "3+" or "4+"
    val strength: Int,
    val ap: Int, // e.g. 0, -1, -2
    val damage: String, // e.g. "1" or "2" or "D3"
    val abilities: List<String> = emptyList()
)

@Serializable
data class UnitStats(
    val m: String, // Movement, e.g. "6\""
    val t: Int, // Toughness
    val sv: String, // Save, e.g. "3+"
    val w: Int, // Wounds
    val ld: String, // Leadership, e.g. "6+"
    val oc: Int, // Objective Control
    val invul: String? = null // Optional Invulnerable Save, e.g. "4+"
)

@Serializable
data class DatasheetAbility(
    val name: String,
    val description: String
)

@Serializable
data class AbilitiesBlock(
    val core: List<String> = emptyList(),
    val faction: List<String> = emptyList(),
    val datasheet: List<DatasheetAbility> = emptyList()
)

@Serializable
data class WeaponsBlock(
    val ranged: List<Weapon> = emptyList(),
    val melee: List<Weapon> = emptyList()
)

@Serializable
data class Datacard(
    val id: String,
    val name: String,
    val type: String, // Character, Battleline, Infantry, Mounted, Vehicle, Monster, Swarm, Fortification
    val points: Int,
    val squadSize: String, // e.g., "5 models"
    val stats: UnitStats,
    val abilities: AbilitiesBlock,
    val weapons: WeaponsBlock,
    val keywords: List<String> = emptyList()
)

@Serializable
data class Stratagem(
    val name: String,
    val cost: Int,
    val phase: String,
    val effect: String
)

@Serializable
data class Enhancement(
    val name: String,
    val points: Int,
    val description: String
)

@Serializable
data class DetachmentRule(
    val name: String,
    val description: String,
    val benefit: String,
    val stratagems: List<Stratagem> = emptyList(),
    val enhancements: List<Enhancement> = emptyList()
)

@Serializable
data class FactionOverview(
    val playstyle: String,
    val strengths: List<String> = emptyList(),
    val weaknesses: List<String> = emptyList()
)

@Serializable
data class FactionRule(
    val name: String,
    val description: String
)

@Serializable
data class Faction(
    val id: String,
    val name: String,
    val iconName: String, // Shield, Sword, Skull, etc.
    val description: String,
    val overview: FactionOverview,
    val factionRule: FactionRule,
    val detachment: DetachmentRule,
    val units: List<Datacard> = emptyList()
)

@Serializable
data class RosterItem(
    val id: String, // Unique instance ID
    val datacardId: String, // Refers to Datacard ID
    val name: String,
    val points: Int,
    val count: Int, // Number of units of this squad size
    val isWarlord: Boolean = false,
    val enhancementName: String? = null,
    val enhancementPoints: Int? = null
)

@Serializable
data class ArmyRoster(
    val id: String,
    val name: String,
    val factionId: String,
    val pointsLimit: Int, // 500, 1000, 2000
    val items: List<RosterItem> = emptyList(),
    val createdAt: String,
    val detachmentName: String? = null,
    val selectedStratagemNames: List<String> = emptyList(),
    val selectedEnhancementNames: List<String> = emptyList()
)

@Serializable
data class MatchLogEntry(
    val id: String,
    val timestamp: String,
    val message: String,
    val type: String // system, score, phase, dice
)

@Serializable
data class MatchState(
    val currentRound: Int = 1, // 1 to 5
    val activePlayer: String = "Player 1", // "Player 1" or "Player 2"
    val phase: String = "SETUP", // GamePhase
    val p1Name: String = "Player 1",
    val p2Name: String = "Player 2",
    val p1Faction: String = "",
    val p2Faction: String = "",
    val p1Vp: Int = 0,
    val p2Vp: Int = 0,
    val p1Cp: Int = 4,
    val p2Cp: Int = 4,
    val log: List<MatchLogEntry> = emptyList()
)
