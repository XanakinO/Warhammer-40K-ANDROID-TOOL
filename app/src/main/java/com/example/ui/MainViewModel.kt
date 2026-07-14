package com.example.ui

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.api.Content
import com.example.api.GeminiClient
import com.example.api.Part
import com.example.domain.*
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import java.util.UUID
import kotlin.math.roundToInt
import kotlin.random.Random

enum class AppTab {
    ACADEMY, CODEX, BUILDER, COMPANION, SAGE
}

@Serializable
data class ChatMsg(
    val sender: String, // "user" or "sage"
    val text: String
)

data class DiceSimResult(
    val attacks: Int = 0,
    val hitRolls: List<Int> = emptyList(),
    val hitSuccesses: Int = 0,
    val woundRolls: List<Int> = emptyList(),
    val woundSuccesses: Int = 0,
    val saveRolls: List<Int> = emptyList(),
    val saveFailures: Int = 0,
    val fnpRolls: List<Int> = emptyList(),
    val finalDamage: Int = 0,
    val logs: List<String> = emptyList()
)

data class QuizState(
    val activeQuestionIndex: Int = 0,
    val answers: List<Int> = emptyList(), // Store playstyle answer indices
    val recommendedFactionId: String? = null
)

class MainViewModel : ViewModel() {

    // Onboarding
    private val _showOnboarding = MutableStateFlow(true)
    val showOnboarding: StateFlow<Boolean> = _showOnboarding.asStateFlow()

    fun dismissOnboarding() {
        _showOnboarding.value = false
    }

    // Navigation
    private val _activeTab = MutableStateFlow(AppTab.ACADEMY)
    val activeTab: StateFlow<AppTab> = _activeTab.asStateFlow()

    fun selectTab(tab: AppTab) {
        _activeTab.value = tab
    }

    // Rules Sage AI Chat
    private val _chatMessages = MutableStateFlow<List<ChatMsg>>(listOf(
        ChatMsg("sage", "Greetings, recruit! I am the Codex Rules Sage, powered by Gemini AI. I possess extensive knowledge of Warhammer 40,000 10th Edition core rules, factions, and tactics. Ask me anything—from phase details to rule disputes—and I will guide you!")
    ))
    val chatMessages: StateFlow<List<ChatMsg>> = _chatMessages.asStateFlow()

    private val _isSageLoading = MutableStateFlow(false)
    val isSageLoading: StateFlow<Boolean> = _isSageLoading.asStateFlow()

    fun sendSageMessage(text: String) {
        if (text.isBlank() || _isSageLoading.value) return
        
        val userMsg = ChatMsg("user", text)
        _chatMessages.value = _chatMessages.value + userMsg
        _isSageLoading.value = true

        viewModelScope.launch {
            try {
                // Map to API Content models
                val apiHistory = _chatMessages.value.dropLast(1).map {
                    Content(
                        parts = listOf(Part(text = it.text)),
                        role = if (it.sender == "user") "user" else "model"
                    )
                }
                val reply = GeminiClient.consultSage(apiHistory, text)
                _chatMessages.value = _chatMessages.value + ChatMsg("sage", reply)
            } catch (e: Exception) {
                _chatMessages.value = _chatMessages.value + ChatMsg("sage", "Error contacting the Warp. Please try again.")
            } finally {
                _isSageLoading.value = false
            }
        }
    }

    fun clearSageChat() {
        _chatMessages.value = listOf(
            ChatMsg("sage", "Warp link cleared. Ready for your next query, commander!")
        )
    }

    // Codex: Faction details
    private val _selectedFactionId = MutableStateFlow("space_marines")
    val selectedFactionId: StateFlow<String> = _selectedFactionId.asStateFlow()

    fun selectFaction(factionId: String) {
        _selectedFactionId.value = factionId
    }

    // Playstyle Quiz state
    private val _quizState = MutableStateFlow(QuizState())
    val quizState: StateFlow<QuizState> = _quizState.asStateFlow()

    val quizQuestions = listOf(
        "What is your preferred method of warfare?",
        "How do you feel about tactical flexibility vs specialization?",
        "What visual theme speaks to you the most?"
    )
    val quizOptions = listOf(
        listOf("Honorable, balanced front-line clash", "Swarming the board with waves of claws", "Ancient mechanical resurrection and heavy fire", "Super-fast, elite glass-cannon strikes"),
        listOf("Highly adaptable - ready for any target", "Absolute specialization - numbers and biological claws", "Extreme durability and marching forward", "Foresight, trickery, and speed-blitzing"),
        listOf("Stoic power-armored knights", "Chitinous bio-monsters", "Eerie glowing green mechanical terminators", "Graceful elven fighters with high-tech blades")
    )

    fun answerQuizQuestion(optionIndex: Int) {
        val current = _quizState.value
        val nextAnswers = current.answers + optionIndex
        val nextIndex = current.activeQuestionIndex + 1

        if (nextIndex >= quizQuestions.size) {
            // Compute recommendation based on majority vote or simple matching
            // 0 -> Space Marines, 1 -> Tyranids, 2 -> Necrons, 3 -> Aeldari
            val counts = IntArray(4)
            for (ans in nextAnswers) {
                if (ans in 0..3) counts[ans]++
            }
            var maxIndex = 0
            for (i in 1..3) {
                if (counts[i] > counts[maxIndex]) {
                    maxIndex = i
                }
            }
            val recommendedId = when (maxIndex) {
                0 -> "space_marines"
                1 -> "tyranids"
                2 -> "necrons"
                else -> "aeldari"
            }
            _quizState.value = QuizState(
                activeQuestionIndex = nextIndex,
                answers = nextAnswers,
                recommendedFactionId = recommendedId
            )
        } else {
            _quizState.value = QuizState(
                activeQuestionIndex = nextIndex,
                answers = nextAnswers,
                recommendedFactionId = null
            )
        }
    }

    fun resetQuiz() {
        _quizState.value = QuizState()
    }

    // Army Builder State
    private val _currentRoster = MutableStateFlow(ArmyRoster(
        id = UUID.randomUUID().toString(),
        name = "My Initial Strike Force",
        factionId = "space_marines",
        pointsLimit = 1000,
        createdAt = "Just now"
    ))
    val currentRoster: StateFlow<ArmyRoster> = _currentRoster.asStateFlow()

    fun updateRosterFaction(factionId: String) {
        _currentRoster.value = _currentRoster.value.copy(
            factionId = factionId,
            items = emptyList() // clear items as they belong to old faction
        )
    }

    fun updateRosterPointsLimit(limit: Int) {
        _currentRoster.value = _currentRoster.value.copy(pointsLimit = limit)
    }

    fun updateRosterName(name: String) {
        _currentRoster.value = _currentRoster.value.copy(name = name)
    }

    fun addUnitToRoster(datacard: Datacard) {
        val roster = _currentRoster.value
        val existing = roster.items.find { it.datacardId == datacard.id }
        
        val newItems = if (existing != null) {
            roster.items.map {
                if (it.datacardId == datacard.id) {
                    it.copy(count = it.count + 1, points = (it.count + 1) * datacard.points)
                } else it
            }
        } else {
            roster.items + RosterItem(
                id = UUID.randomUUID().toString(),
                datacardId = datacard.id,
                name = datacard.name,
                points = datacard.points,
                count = 1
            )
        }
        _currentRoster.value = roster.copy(items = newItems)
    }

    fun removeUnitFromRoster(datacardId: String) {
        val roster = _currentRoster.value
        val existing = roster.items.find { it.datacardId == datacardId } ?: return
        
        val newItems = if (existing.count > 1) {
            roster.items.map {
                if (it.datacardId == datacardId) {
                    val unitPoints = it.points / it.count
                    it.copy(count = it.count - 1, points = (it.count - 1) * unitPoints)
                } else it
            }
        } else {
            roster.items.filter { it.datacardId != datacardId }
        }
        _currentRoster.value = roster.copy(items = newItems)
    }

    fun toggleWarlord(datacardId: String) {
        val roster = _currentRoster.value
        val newItems = roster.items.map {
            if (it.datacardId == datacardId) {
                it.copy(isWarlord = !it.isWarlord)
            } else {
                it.copy(isWarlord = false) // strictly only one Warlord allowed
            }
        }
        _currentRoster.value = roster.copy(items = newItems)
    }

    fun attachEnhancement(datacardId: String, enhancement: Enhancement?) {
        val roster = _currentRoster.value
        val newItems = roster.items.map {
            if (it.datacardId == datacardId) {
                it.copy(
                    enhancementName = enhancement?.name,
                    enhancementPoints = enhancement?.points
                )
            } else it
        }
        _currentRoster.value = roster.copy(items = newItems)
    }

    // Get current total points
    fun getRosterTotalPoints(): Int {
        val roster = _currentRoster.value
        var total = 0
        for (item in roster.items) {
            total += item.points
            total += (item.enhancementPoints ?: 0)
        }
        return total
    }

    // Battle Companion Scoring State
    private val _matchState = MutableStateFlow(MatchState())
    val matchState: StateFlow<MatchState> = _matchState.asStateFlow()

    fun updateMatchPlayers(p1Name: String, p1Faction: String, p2Name: String, p2Faction: String) {
        _matchState.value = _matchState.value.copy(
            p1Name = p1Name,
            p1Faction = p1Faction,
            p2Name = p2Name,
            p2Faction = p2Faction,
            log = listOf(MatchLogEntry(UUID.randomUUID().toString(), "05:49", "Battle initialized! $p1Name ($p1Faction) vs $p2Name ($p2Faction)", "system"))
        )
    }

    fun addVp(player: Int, amount: Int) {
        val state = _matchState.value
        val newLog = MatchLogEntry(
            UUID.randomUUID().toString(),
            "Rnd ${state.currentRound}",
            "Player $player (${if (player == 1) state.p1Name else state.p2Name}) scored +$amount VP",
            "score"
        )
        if (player == 1) {
            _matchState.value = state.copy(p1Vp = (state.p1Vp + amount).coerceAtLeast(0), log = state.log + newLog)
        } else {
            _matchState.value = state.copy(p2Vp = (state.p2Vp + amount).coerceAtLeast(0), log = state.log + newLog)
        }
    }

    fun addCp(player: Int, amount: Int) {
        val state = _matchState.value
        val newLog = MatchLogEntry(
            UUID.randomUUID().toString(),
            "Rnd ${state.currentRound}",
            "Player $player (${if (player == 1) state.p1Name else state.p2Name}) changed CP by $amount",
            "system"
        )
        if (player == 1) {
            _matchState.value = state.copy(p1Cp = (state.p1Cp + amount).coerceAtLeast(0), log = state.log + newLog)
        } else {
            _matchState.value = state.copy(p2Cp = (state.p2Cp + amount).coerceAtLeast(0), log = state.log + newLog)
        }
    }

    fun advanceMatchPhase(nextPhase: String) {
        val state = _matchState.value
        val newLog = MatchLogEntry(
            UUID.randomUUID().toString(),
            "Rnd ${state.currentRound}",
            "Transitioned to $nextPhase phase",
            "phase"
        )
        _matchState.value = state.copy(phase = nextPhase, log = state.log + newLog)
    }

    fun nextMatchRound() {
        val state = _matchState.value
        val nextRound = state.currentRound + 1
        if (nextRound > 5) {
            val endLog = MatchLogEntry(UUID.randomUUID().toString(), "End", "The battle has concluded!", "system")
            _matchState.value = state.copy(log = state.log + endLog)
            return
        }
        val newLog = MatchLogEntry(
            UUID.randomUUID().toString(),
            "Rnd $nextRound",
            "Battle round $nextRound initiated! Both players gained 1 CP automatically.",
            "phase"
        )
        _matchState.value = state.copy(
            currentRound = nextRound,
            phase = "COMMAND",
            p1Cp = state.p1Cp + 1,
            p2Cp = state.p2Cp + 1,
            log = state.log + newLog
        )
    }

    fun resetMatch() {
        _matchState.value = MatchState()
    }

    // Combat Math Probability Gauge Simulator
    fun calculateProbability(
        attacks: Int,
        bs: Int, // e.g., 3 for 3+
        strength: Int,
        toughness: Int,
        save: Int, // e.g., 3 for 3+
        invul: Int?, // e.g., 4 for 4+
        fnp: Int?, // e.g., 5 for 5+
        damagePerWound: Float // e.g., 2.0
    ): Triple<Float, Float, Float> {
        if (attacks <= 0) return Triple(0f, 0f, 0f)

        // Hit probability: (7 - BS) / 6
        val hitProb = ((7 - bs).coerceIn(1, 6)) / 6f
        val expectedHits = attacks * hitProb

        // Wound probability based on S vs T
        val woundThreshold = when {
            strength >= toughness * 2 -> 2
            strength > toughness -> 3
            strength == toughness -> 4
            strength * 2 <= toughness -> 6
            else -> 5
        }
        val woundProb = ((7 - woundThreshold).coerceIn(1, 6)) / 6f
        val expectedWounds = expectedHits * woundProb

        // Save probability (invul vs normal save)
        val bestSave = if (invul != null) {
            save.coerceAtMost(invul)
        } else {
            save
        }
        val saveProb = ((7 - bestSave).coerceIn(1, 6)) / 6f
        val expectedFailedSaves = expectedWounds * (1f - saveProb)

        // FNP ignore probability
        val fnpProb = if (fnp != null) {
            ((7 - fnp).coerceIn(1, 6)) / 6f
        } else {
            0f
        }
        val expectedDamageAfterFnp = expectedFailedSaves * damagePerWound * (1f - fnpProb)

        return Triple(expectedHits, expectedWounds, expectedDamageAfterFnp)
    }

    // Interactive Dice Simulator Roller State
    private val _diceSimResult = MutableStateFlow(DiceSimResult())
    val diceSimResult: StateFlow<DiceSimResult> = _diceSimResult.asStateFlow()

    fun runDiceSimulation(
        attacks: Int,
        bs: Int,
        strength: Int,
        toughness: Int,
        save: Int,
        invul: Int?,
        fnp: Int?,
        damageStr: String // e.g. "2" or "D3" or "D6"
    ) {
        val logs = mutableListOf<String>()
        logs.add("Rolling $attacks attacks...")

        // 1. Roll Hits
        val hitRolls = List(attacks) { Random.nextInt(1, 7) }
        val hitSuccesses = hitRolls.count { it >= bs }
        logs.add("Hit Rolls: $hitRolls (BS $bs+). Successes: $hitSuccesses")

        if (hitSuccesses == 0) {
            _diceSimResult.value = DiceSimResult(
                attacks = attacks,
                hitRolls = hitRolls,
                hitSuccesses = 0,
                logs = logs
            )
            return
        }

        // 2. Roll Wounds
        val woundThreshold = when {
            strength >= toughness * 2 -> 2
            strength > toughness -> 3
            strength == toughness -> 4
            strength * 2 <= toughness -> 6
            else -> 5
        }
        val woundRolls = List(hitSuccesses) { Random.nextInt(1, 7) }
        val woundSuccesses = woundRolls.count { it >= woundThreshold }
        logs.add("Wound Rolls: $woundRolls (Threshold $woundThreshold+). Successes: $woundSuccesses")

        if (woundSuccesses == 0) {
            _diceSimResult.value = DiceSimResult(
                attacks = attacks,
                hitRolls = hitRolls,
                hitSuccesses = hitSuccesses,
                woundRolls = woundRolls,
                woundSuccesses = 0,
                logs = logs
            )
            return
        }

        // 3. Roll Saves
        val bestSave = if (invul != null) save.coerceAtMost(invul) else save
        val saveRolls = List(woundSuccesses) { Random.nextInt(1, 7) }
        val saveFailures = saveRolls.count { it < bestSave }
        logs.add("Save Rolls: $saveRolls (Best Save $bestSave+). Failed Saves: $saveFailures")

        if (saveFailures == 0) {
            _diceSimResult.value = DiceSimResult(
                attacks = attacks,
                hitRolls = hitRolls,
                hitSuccesses = hitSuccesses,
                woundRolls = woundRolls,
                woundSuccesses = woundSuccesses,
                saveRolls = saveRolls,
                saveFailures = 0,
                logs = logs
            )
            return
        }

        // 4. Roll FNP / Calculate Damage
        var totalDamageInflicted = 0
        val fnpRolls = mutableListOf<Int>()
        
        for (i in 0 until saveFailures) {
            // Calculate damage for this failure
            val baseDmg = when (damageStr.uppercase()) {
                "D3" -> Random.nextInt(1, 4)
                "D6" -> Random.nextInt(1, 7)
                else -> {
                    damageStr.toIntOrNull() ?: 1
                }
            }
            logs.add("Attack $i inflicted $baseDmg damage.")
            
            if (fnp != null) {
                val fnpRollsForThis = List(baseDmg) { Random.nextInt(1, 7) }
                fnpRolls.addAll(fnpRollsForThis)
                val ignored = fnpRollsForThis.count { it >= fnp }
                val suffered = (baseDmg - ignored).coerceAtLeast(0)
                logs.add("  FNP Rolls: $fnpRollsForThis (Ignore 5+). Ignored $ignored, Suffered $suffered")
                totalDamageInflicted += suffered
            } else {
                totalDamageInflicted += baseDmg
            }
        }

        logs.add("Total damage allocated to target: $totalDamageInflicted wounds!")

        _diceSimResult.value = DiceSimResult(
            attacks = attacks,
            hitRolls = hitRolls,
            hitSuccesses = hitSuccesses,
            woundRolls = woundRolls,
            woundSuccesses = woundSuccesses,
            saveRolls = saveRolls,
            saveFailures = saveFailures,
            fnpRolls = fnpRolls,
            finalDamage = totalDamageInflicted,
            logs = logs
        )
    }

    fun clearDiceResult() {
        _diceSimResult.value = DiceSimResult()
    }
}
