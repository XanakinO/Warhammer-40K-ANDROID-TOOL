/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  Play, CheckCircle, HelpCircle, Trophy, Swords, 
  Trash, ArrowRight, ArrowLeft, RotateCcw, ShieldAlert,
  ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Plus, Minus, HelpCircle as HelpIcon, Dices,
  Ruler, Map, ClipboardCheck, BookOpen
} from "lucide-react";
import { FACTIONS } from "../data/factions";
import { ArmyRoster, Datacard, MatchLogEntry } from "../types";
import DeploymentMap from "./DeploymentMap";

export default function GameCompanion() {
  const [activeStep, setActiveStep] = useState<"setup" | "battle" | "cleanup">("setup");
  const [selectedTerrainGuide, setSelectedTerrainGuide] = useState<"ruins" | "woods" | "craters" | "barricades">("ruins");
  
  // Scoring & Round State
  const [round, setRound] = useState<number>(1);
  const [activePlayer, setActivePlayer] = useState<"Player 1" | "Player 2">("Player 1");
  const [p1Name, setP1Name] = useState<string>("Player 1 (Defender)");
  const [p2Name, setP2Name] = useState<string>("Player 2 (Attacker)");
  const [p1Faction, setP1Faction] = useState<string>("Space Marines");
  const [p2Faction, setP2Faction] = useState<string>("Tyranids");
  const [selectedP1RosterId, setSelectedP1RosterId] = useState<string>("");
  const [selectedP2RosterId, setSelectedP2RosterId] = useState<string>("");
  const [savedRosters, setSavedRosters] = useState<ArmyRoster[]>([]);
  const [activeRosterTab, setActiveRosterTab] = useState<"p1" | "p2">("p1");
  const [expandedUnitId, setExpandedUnitId] = useState<string | null>(null);
  const [simulatorNotice, setSimulatorNotice] = useState<string>("");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("warhammer_40k_rosters");
      if (stored) {
        setSavedRosters(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Error reading rosters in GameCompanion", e);
    }
  }, [activeStep]);
  const [p1Vp, setP1Vp] = useState<number>(0);
  const [p2Vp, setP2Vp] = useState<number>(0);
  const [p1Cp, setP1Cp] = useState<number>(4);
  const [p2Cp, setP2Cp] = useState<number>(4);
  
  // Tactical & Score states
  const [activeAttackStep, setActiveAttackStep] = useState<number>(0);
  const [selectedBattleTab, setSelectedBattleTab] = useState<"manual" | "stratagems" | "rosters" | "log">("manual");
  const [showScorecard, setShowScorecard] = useState<boolean>(false);
  const [p1PrimaryScores, setP1PrimaryScores] = useState<number[]>([0, 0, 0, 0, 0]);
  const [p2PrimaryScores, setP2PrimaryScores] = useState<number[]>([0, 0, 0, 0, 0]);
  const [p1SecondaryScores, setP1SecondaryScores] = useState<number[]>([0, 0, 0, 0, 0]);
  const [p2SecondaryScores, setP2SecondaryScores] = useState<number[]>([0, 0, 0, 0, 0]);
  
  // In-Battle Phase
  const [battlePhase, setBattlePhase] = useState<"COMMAND" | "MOVEMENT" | "SHOOTING" | "CHARGE" | "FIGHT" | "BATTLESHOCK">("COMMAND");

  // Dice Roller State
  const [numDiceToRoll, setNumDiceToRoll] = useState<number>(10);
  const [rolledDice, setRolledDice] = useState<{ id: number; value: number; selected: boolean }[]>([]);
  const [successThreshold, setSuccessThreshold] = useState<number>(3); // e.g., 3+

  // Strength vs Toughness State
  const [weaponStrength, setWeaponStrength] = useState<number>(4);
  const [targetToughness, setTargetToughness] = useState<number>(4);

  // Attack simulator state
  const [simAttacks, setSimAttacks] = useState<number>(10);
  const [simSkill, setSimSkill] = useState<number>(3); // 3+
  const [simStrength, setSimStrength] = useState<number>(4);
  const [simAp, setSimAp] = useState<number>(1); // e.g. -1
  const [simToughness, setSimToughness] = useState<number>(4);
  const [simSave, setSimSave] = useState<number>(3); // 3+
  const [simInvul, setSimInvul] = useState<number>(5); // 5+
  const [simResult, setSimResult] = useState<{ hits: number; wounds: number; unsaved: number } | null>(null);

  // Table setup steps completion checklist
  const [setupChecklist, setSetupChecklist] = useState({
    tableClear: false,
    placeTerrain: false,
    selectMission: false,
    declareFormations: false,
    deployArmies: false,
    rollFirstTurn: false
  });

  // State variables for rookie interactive guides (Features 8, 9, 10)
  const [engagementDistance, setEngagementDistance] = useState<number>(1.2);
  const [hasBarricadeBetween, setHasBarricadeBetween] = useState<boolean>(false);
  const [battleshockLd, setBattleshockLd] = useState<number>(7);
  const [hasSynapseBonus, setHasSynapseBonus] = useState<boolean>(false);
  const [hasShadowInWarpPenalty, setHasShadowInWarpPenalty] = useState<boolean>(false);
  const [battleshockResult, setBattleshockResult] = useState<{ rolls: number[]; total: number; passed: boolean } | null>(null);
  const [expandedStratName, setExpandedStratName] = useState<string | null>(null);
  const [isRulesDrawerOpen, setIsRulesDrawerOpen] = useState(false);
  const [battleLog, setBattleLog] = useState<MatchLogEntry[]>([]);

  const addLogEntry = (message: string, type: "system" | "score" | "phase" | "dice" = "system") => {
    setBattleLog(prev => [...prev, {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toLocaleTimeString(),
      message,
      type
    }]);
  };

  useEffect(() => {
    addLogEntry(`Player 1 VP updated to ${p1Vp}`, "score");
  }, [p1Vp]);

  useEffect(() => {
    addLogEntry(`Player 2 VP updated to ${p2Vp}`, "score");
  }, [p2Vp]);

  // Match settings
  const [matchType, setMatchType] = useState<"Friendly" | "Competitive" | "Tournament">("Friendly");
  const [gameMode, setGameMode] = useState<"Combat Patrol" | "Incursion" | "Strike Force" | "Onslaught">("Strike Force");
  const [totalRounds, setTotalRounds] = useState<number>(5);

  // State variables for additional beginner features (Features 3, 7, 8, 9)
  const [reservesArrivalRound, setReservesArrivalRound] = useState<number>(2); // 1, 2, or 3
  const [selectedAuraRadius, setSelectedAuraRadius] = useState<number>(6); // 3, 6, 9
  const [measurementInches, setMeasurementInches] = useState<number>(12); // for converter
  const [preflightChecklist, setPreflightChecklist] = useState<{ [key: string]: boolean }>({
    warlord: false,
    leaderAttach: false,
    reservesDeclare: false,
    enhancements: false,
    objPlaced: false,
    refReady: false
  });

  // Roll dice action
  const rollDice = () => {
    const newRolls = Array.from({ length: numDiceToRoll }).map((_, idx) => ({
      id: Date.now() + idx + Math.random(),
      value: Math.floor(Math.random() * 6) + 1,
      selected: false
    }));
    setRolledDice(newRolls);
  };

  // Re-roll selected dice
  const reRollSelected = () => {
    const updated = rolledDice.map(die => {
      if (die.selected) {
        return {
          ...die,
          value: Math.floor(Math.random() * 6) + 1,
          selected: false
        };
      }
      return die;
    });
    setRolledDice(updated);
  };

  const getDatacardById = (factionId: string, datacardId: string): Datacard | undefined => {
    const faction = FACTIONS.find(f => f.id === factionId);
    return faction?.units.find(u => u.id === datacardId);
  };

  const triggerSimulatorNotice = (msg: string) => {
    setSimulatorNotice(msg);
    setTimeout(() => {
      setSimulatorNotice("");
    }, 4000);
  };

  // Select/Toggle die for custom re-rolls
  const toggleDieSelect = (id: number) => {
    setRolledDice(rolledDice.map(d => d.id === id ? { ...d, selected: !d.selected } : d));
  };

  // Select all rolling dice under success threshold (failed dice)
  const selectFailedDice = () => {
    setRolledDice(rolledDice.map(d => d.value < successThreshold ? { ...d, selected: true } : { ...d, selected: false }));
  };

  // To-Wound solver math
  const getToWoundThreshold = (s: number, t: number): string => {
    if (s >= t * 2) return "2+";
    if (s > t) return "3+";
    if (s === t) return "4+";
    if (s * 2 <= t) return "6+";
    if (s < t) return "5+";
    return "4+";
  };

  // Run a quick average-expected calculation for combat simulator
  const runCombatSimulation = () => {
    // 1. Hits
    const hitProb = (7 - simSkill) / 6;
    const expectedHits = simAttacks * hitProb;

    // 2. Wounds
    let woundProb = 0.5; // S === T
    if (simStrength >= simToughness * 2) woundProb = 5/6; // 2+
    else if (simStrength > simToughness) woundProb = 4/6; // 3+
    else if (simStrength * 2 <= simToughness) woundProb = 1/6; // 6+
    else if (simStrength < simToughness) woundProb = 2/6; // 5+

    const expectedWounds = expectedHits * woundProb;

    // 3. Saves
    // Armor penetrations improve save, so save is worsened:
    // AP of 1 (inputted as positive or negative, let's treat AP as penalty)
    const penalty = Math.abs(simAp);
    const finalArmorSave = Math.min(simSave + penalty, 7); // 7+ means no save possible
    
    // Check if invul save is better
    const bestSave = Math.min(finalArmorSave, simInvul);
    const failSaveProb = bestSave > 6 ? 1.0 : (bestSave - 1) / 6;

    const expectedUnsaved = expectedWounds * failSaveProb;

    setSimResult({
      hits: parseFloat(expectedHits.toFixed(2)),
      wounds: parseFloat(expectedWounds.toFixed(2)),
      unsaved: parseFloat(expectedUnsaved.toFixed(2))
    });
  };

  // Scorecard update helpers with synchronization
  const updateP1Scorecard = (roundIdx: number, type: "primary" | "secondary", val: number) => {
    if (type === "primary") {
      const copy = [...p1PrimaryScores];
      copy[roundIdx] = val;
      setP1PrimaryScores(copy);
      const newTotal = copy.reduce((a, b) => a + b, 0) + p1SecondaryScores.reduce((a, b) => a + b, 0);
      setP1Vp(newTotal);
    } else {
      const copy = [...p1SecondaryScores];
      copy[roundIdx] = val;
      setP1SecondaryScores(copy);
      const newTotal = p1PrimaryScores.reduce((a, b) => a + b, 0) + copy.reduce((a, b) => a + b, 0);
      setP1Vp(newTotal);
    }
  };

  const updateP2Scorecard = (roundIdx: number, type: "primary" | "secondary", val: number) => {
    if (type === "primary") {
      const copy = [...p2PrimaryScores];
      copy[roundIdx] = val;
      setP2PrimaryScores(copy);
      const newTotal = copy.reduce((a, b) => a + b, 0) + p2SecondaryScores.reduce((a, b) => a + b, 0);
      setP2Vp(newTotal);
    } else {
      const copy = [...p2SecondaryScores];
      copy[roundIdx] = val;
      setP2SecondaryScores(copy);
      const newTotal = p2PrimaryScores.reduce((a, b) => a + b, 0) + copy.reduce((a, b) => a + b, 0);
      setP2Vp(newTotal);
    }
  };

  const resetGameTracker = () => {
    if (window.confirm("Are you sure you want to reset all active game rounds, victory points, and command points?")) {
      setRound(1);
      setActivePlayer("Player 1");
      setP1Vp(0);
      setP2Vp(0);
      setP1Cp(4);
      setP2Cp(4);
      setBattlePhase("COMMAND");
      setRolledDice([]);
      setP1PrimaryScores([0, 0, 0, 0, 0]);
      setP2PrimaryScores([0, 0, 0, 0, 0]);
      setP1SecondaryScores([0, 0, 0, 0, 0]);
      setP2SecondaryScores([0, 0, 0, 0, 0]);
    }
  };

  return (
    <div className="flex flex-col gap-6" id="game-companion-root">
      
      {/* Top Navigation Steps indicator */}
      <div className="flex bg-slate-950/40 border border-slate-850 p-1.5 rounded-xl shadow-inner gap-1" id="companion-steps-nav">
        {[
          { id: "setup", label: "1. Table Setup", short: "Setup", icon: Play },
          { id: "battle", label: "2. Battle Guide", short: "Battle", icon: Swords },
          { id: "cleanup", label: "3. Match Cleanup", short: "Cleanup", icon: Trophy }
        ].map(step => {
          const isActive = activeStep === step.id;
          const Icon = step.icon;
          return (
            <button
              key={step.id}
              id={`companion-btn-${step.id}`}
              onClick={() => setActiveStep(step.id as any)}
              className={`flex-1 py-2 px-1 rounded-lg text-xs font-bold tracking-wide font-mono transition duration-150 flex items-center justify-center gap-2 active:scale-98 cursor-pointer border ${
                isActive
                  ? "bg-amber-500 border-amber-400 text-slate-950 shadow-md font-black"
                  : "bg-transparent border-transparent text-stone-400 hover:text-stone-200 hover:bg-slate-900/40"
              }`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">{step.label}</span>
              <span className="sm:hidden">{step.short}</span>
            </button>
          );
        })}
      </div>

      {/* STEP 1: PRE-GAME TABLE SETUP AND DEPLOYMENT */}
      {activeStep === "setup" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="setup-step-view">
          
          <div className="lg:col-span-12 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col gap-4">
            <h3 className="text-md font-bold text-slate-100 border-b border-slate-800 pb-2">Match Customization</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase">Match Type</label>
                <select value={matchType} onChange={(e) => setMatchType(e.target.value as any)} className="bg-slate-950 border border-slate-800 text-slate-200 rounded-lg p-2 text-sm">
                  <option>Friendly</option>
                  <option>Competitive</option>
                  <option>Tournament</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase">Game Mode</label>
                <select value={gameMode} onChange={(e) => setGameMode(e.target.value as any)} className="bg-slate-950 border border-slate-800 text-slate-200 rounded-lg p-2 text-sm">
                  <option>Combat Patrol</option>
                  <option>Incursion</option>
                  <option>Strike Force</option>
                  <option>Onslaught</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase">Total Rounds</label>
                <input type="number" value={totalRounds} onChange={(e) => setTotalRounds(Number(e.target.value))} className="bg-slate-950 border border-slate-800 text-slate-200 rounded-lg p-2 text-sm" min="1" max="10" />
              </div>
            </div>
          </div>

          {/* Setup Walkthrough Checklist (7 Cols) */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col gap-4">
            <h3 className="text-md font-bold text-slate-100 border-b border-slate-800 pb-2">
              Step-by-Step Table Setup
            </h3>
            <p className="text-xs text-gray-400">Welcome to the table, recruit! Go through these 6 foundational steps to prepare your battlefield for Warhammer 10th edition gameplay.</p>
            
            <div className="flex flex-col gap-3 mt-1" id="setup-checklist">
              {/* Step 1 */}
              <div className="flex gap-3 bg-slate-950 p-4 rounded-xl border border-slate-850">
                <input 
                  type="checkbox" 
                  checked={setupChecklist.tableClear}
                  onChange={() => setSetupChecklist({...setupChecklist, tableClear: !setupChecklist.tableClear})}
                  className="w-5 h-5 accent-amber-500 shrink-0 mt-0.5 cursor-pointer"
                  id="chk-table-clear"
                />
                <div className="flex flex-col gap-1 text-xs">
                  <span className="font-bold text-slate-200 uppercase tracking-wide font-mono text-[10px]">1. Clear Space & Size Table</span>
                  <p className="text-gray-400 leading-relaxed">Ensure a flat, clear surface. Agree on match size. Recommended table dimensions are: 
                    <br /><strong className="text-amber-400/90">500-1000 pts:</strong> 44" x 30" (Incursion/Combat Patrol)
                    <br /><strong className="text-amber-400/90">2000 pts:</strong> 60" x 44" (Standard Strike Force)
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-3 bg-slate-950 p-4 rounded-xl border border-slate-850">
                <input 
                  type="checkbox" 
                  checked={setupChecklist.placeTerrain}
                  onChange={() => setSetupChecklist({...setupChecklist, placeTerrain: !setupChecklist.placeTerrain})}
                  className="w-5 h-5 accent-amber-500 shrink-0 mt-0.5 cursor-pointer"
                  id="chk-place-terrain"
                />
                <div className="flex flex-col gap-1 text-xs">
                  <span className="font-bold text-slate-200 uppercase tracking-wide font-mono text-[10px]">2. Place Terrain & Objectives</span>
                  <p className="text-gray-400 leading-relaxed">Place terrain scenery pieces collaboratively (e.g. ruins, barricades, woods). Lay down exactly <strong className="text-amber-400/90">5 to 6 objective markers</strong> as described by your mission format. Place them 40mm wide circular tokens, and verify measuring guidelines (measure distance from center of objective).</p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-3 bg-slate-950 p-4 rounded-xl border border-slate-850">
                <input 
                  type="checkbox" 
                  checked={setupChecklist.selectMission}
                  onChange={() => setSetupChecklist({...setupChecklist, selectMission: !setupChecklist.selectMission})}
                  className="w-5 h-5 accent-amber-500 shrink-0 mt-0.5 cursor-pointer"
                  id="chk-select-mission"
                />
                <div className="flex flex-col gap-1 text-xs">
                  <span className="font-bold text-slate-200 uppercase tracking-wide font-mono text-[10px]">3. Select Mission Formats</span>
                  <p className="text-gray-400 leading-relaxed">Agree on primary mission parameters (e.g. Only War for recruits, or Leviathan cards). Read the primary scoring layout rules (explain when you score VP: usually in the Command phase starting in Turn 2).</p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex gap-3 bg-slate-950 p-4 rounded-xl border border-slate-850">
                <input 
                  type="checkbox" 
                  checked={setupChecklist.declareFormations}
                  onChange={() => setSetupChecklist({...setupChecklist, declareFormations: !setupChecklist.declareFormations})}
                  className="w-5 h-5 accent-amber-500 shrink-0 mt-0.5 cursor-pointer"
                  id="chk-declare-formations"
                />
                <div className="flex flex-col gap-1 text-xs">
                  <span className="font-bold text-slate-200 uppercase tracking-wide font-mono text-[10px]">4. Declare Battle Formations</span>
                  <p className="text-gray-400 leading-relaxed">Privately note: Which character leaders are joining which infantry bodyguard squads, and which units are placed in <strong className="text-amber-400/90">Strategic Reserves</strong> or deep strike teleport homers.</p>
                </div>
              </div>

              {/* Step 5 */}
              <div className="flex gap-3 bg-slate-950 p-4 rounded-xl border border-slate-850">
                <input 
                  type="checkbox" 
                  checked={setupChecklist.deployArmies}
                  onChange={() => setSetupChecklist({...setupChecklist, deployArmies: !setupChecklist.deployArmies})}
                  className="w-5 h-5 accent-amber-500 shrink-0 mt-0.5 cursor-pointer"
                  id="chk-deploy-armies"
                />
                <div className="flex flex-col gap-1 text-xs">
                  <span className="font-bold text-slate-200 uppercase tracking-wide font-mono text-[10px]">5. Deploy Armies</span>
                  <p className="text-gray-400 leading-relaxed">Take turns deploying units, starting with the defender placing one full unit inside their deployment boundary, followed by the attacker. Continue alternating until all models are deployed.</p>
                </div>
              </div>

              {/* Step 6 */}
              <div className="flex gap-3 bg-slate-950 p-4 rounded-xl border border-slate-850">
                <input 
                  type="checkbox" 
                  checked={setupChecklist.rollFirstTurn}
                  onChange={() => setSetupChecklist({...setupChecklist, rollFirstTurn: !setupChecklist.rollFirstTurn})}
                  className="w-5 h-5 accent-amber-500 shrink-0 mt-0.5 cursor-pointer"
                  id="chk-roll-first-turn"
                />
                <div className="flex flex-col gap-1 text-xs">
                  <span className="font-bold text-slate-200 uppercase tracking-wide font-mono text-[10px]">6. Roll-Off for First Turn</span>
                  <p className="text-gray-400 leading-relaxed">Both players roll a D6. High roll takes First Turn. (No tie-breakers, re-roll ties). Proceed to step 2: Battle Guide when finished!</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setActiveStep("battle")}
              className="mt-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-3.5 rounded-xl text-sm transition flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
            >
              <span>Proceed to Battle Guide</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Player Profile Setup (5 Cols) */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col gap-4">
            <h3 className="text-sm font-bold text-slate-100 border-b border-slate-800 pb-2 font-mono uppercase tracking-wider text-amber-400">
              Match Setup Profiles
            </h3>
            <p className="text-xs text-gray-400">Set the names and factions of both players below to customize the Round Tracker counters.</p>

            <div className="flex flex-col gap-4" id="match-profiles-inputs">
              {/* Player 1 */}
              <div className="bg-slate-950 border border-slate-850 rounded-xl p-4 flex flex-col gap-3">
                <span className="text-[10px] font-bold text-sky-400 uppercase tracking-widest font-mono">Player 1 (Defending)</span>
                
                {/* Roster Import Dropdown */}
                <div className="flex flex-col gap-1 border-b border-slate-900 pb-2.5">
                  <label className="text-[10px] text-amber-500 font-bold font-mono uppercase tracking-wide">Import Roster (Army Builder)</label>
                  <select 
                    value={selectedP1RosterId}
                    onChange={(e) => {
                      const rId = e.target.value;
                      setSelectedP1RosterId(rId);
                      if (rId) {
                        const roster = savedRosters.find(r => r.id === rId);
                        if (roster) {
                          setP1Name(roster.name);
                          const factionName = FACTIONS.find(f => f.id === roster.factionId)?.name || roster.factionId;
                          setP1Faction(factionName);
                        }
                      }
                    }}
                    className="bg-slate-900 border border-slate-800 text-xs rounded-lg px-2.5 py-2 text-stone-200 focus:outline-none focus:border-amber-500 font-mono"
                  >
                    <option value="">-- No Saved Roster selected --</option>
                    {savedRosters.map(r => {
                      const factionName = FACTIONS.find(f => f.id === r.factionId)?.name || r.factionId;
                      const pts = r.items.reduce((acc, item) => acc + (item.points * item.count) + (item.enhancementPoints || 0), 0);
                      return (
                        <option key={r.id} value={r.id}>
                          {r.name} ({factionName} - {pts}pts)
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-gray-500 font-bold">General Name</label>
                  <input 
                    type="text" 
                    value={p1Name} 
                    onChange={(e) => setP1Name(e.target.value)} 
                    className="bg-slate-900 border border-slate-800 text-xs rounded-lg px-2.5 py-2 text-gray-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-gray-500 font-bold">Army Faction</label>
                  <input 
                    type="text" 
                    value={p1Faction} 
                    onChange={(e) => setP1Faction(e.target.value)} 
                    className="bg-slate-900 border border-slate-800 text-xs rounded-lg px-2.5 py-2 text-gray-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Player 2 */}
              <div className="bg-slate-950 border border-slate-850 rounded-xl p-4 flex flex-col gap-3">
                <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest font-mono">Player 2 (Attacking)</span>
                
                {/* Roster Import Dropdown */}
                <div className="flex flex-col gap-1 border-b border-slate-900 pb-2.5">
                  <label className="text-[10px] text-amber-500 font-bold font-mono uppercase tracking-wide">Import Roster (Army Builder)</label>
                  <select 
                    value={selectedP2RosterId}
                    onChange={(e) => {
                      const rId = e.target.value;
                      setSelectedP2RosterId(rId);
                      if (rId) {
                        const roster = savedRosters.find(r => r.id === rId);
                        if (roster) {
                          setP2Name(roster.name);
                          const factionName = FACTIONS.find(f => f.id === roster.factionId)?.name || roster.factionId;
                          setP2Faction(factionName);
                        }
                      }
                    }}
                    className="bg-slate-900 border border-slate-800 text-xs rounded-lg px-2.5 py-2 text-stone-200 focus:outline-none focus:border-amber-500 font-mono"
                  >
                    <option value="">-- No Saved Roster selected --</option>
                    {savedRosters.map(r => {
                      const factionName = FACTIONS.find(f => f.id === r.factionId)?.name || r.factionId;
                      const pts = r.items.reduce((acc, item) => acc + (item.points * item.count) + (item.enhancementPoints || 0), 0);
                      return (
                        <option key={r.id} value={r.id}>
                          {r.name} ({factionName} - {pts}pts)
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-gray-500 font-bold">General Name</label>
                  <input 
                    type="text" 
                    value={p2Name} 
                    onChange={(e) => setP2Name(e.target.value)} 
                    className="bg-slate-900 border border-slate-800 text-xs rounded-lg px-2.5 py-2 text-gray-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-gray-500 font-bold">Army Faction</label>
                  <input 
                    type="text" 
                    value={p2Faction} 
                    onChange={(e) => setP2Faction(e.target.value)} 
                    className="bg-slate-900 border border-slate-800 text-xs rounded-lg px-2.5 py-2 text-gray-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Deployment Planner Map */}
          <div className="lg:col-span-12">
            <DeploymentMap
              p1Roster={savedRosters.find(r => r.id === selectedP1RosterId)}
              p2Roster={savedRosters.find(r => r.id === selectedP2RosterId)}
              p1Name={p1Name}
              p2Name={p2Name}
              p1Faction={p1Faction}
              p2Faction={p2Faction}
            />
          </div>

          {/* Section: Beginner Etiquette & Terrain Quick Guides */}
          <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-6 mt-2" id="setup-beginner-guides">
            
            {/* Etiquette Panel */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col gap-4">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                <CheckCircle className="w-5 h-5 text-amber-500" />
                <h4 className="font-bold text-slate-200">Fair Play & Battle Etiquette</h4>
              </div>
              <p className="text-xs text-gray-400">Warhammer 40,000 is a collaborative storytelling hobby. Review these 5 golden rules with your opponent to guarantee an enjoyable game:</p>
              
              <div className="flex flex-col gap-2.5">
                {[
                  { title: "Review Roster & Surprise Weapons", text: "Disclose your models, list, and unique tricks. No 'gotcha' play!" },
                  { title: "Agree on Terrain Ruins rules", text: "Clarify whether ruin ground levels block line-of-sight entirely." },
                  { title: "Roll Openly & Keep Cocked Dice", text: "Roll in the open tray. Agree to re-roll any die that lands tilted." },
                  { title: "Declare Intentions Explicitly", text: "Say 'I'm moving this model here to ensure I gain cover' as you move." },
                  { title: "Play to Learn and Enjoy", text: "Celebrate epic model moments on both sides, shake hands, and have fun!" }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-2.5 bg-slate-950 p-3 rounded-xl border border-slate-850">
                    <div className="w-4 h-4 rounded bg-amber-500/10 border border-amber-500/30 text-[9px] font-bold text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                      ✓
                    </div>
                    <div className="flex flex-col text-xs">
                      <span className="font-bold text-slate-200">{item.title}</span>
                      <p className="text-gray-400 mt-0.5 leading-relaxed">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Terrain Panel */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col gap-4">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                <HelpCircle className="w-5 h-5 text-sky-400" />
                <h4 className="font-bold text-slate-200">Interactive Terrain Rules Guide</h4>
              </div>
              <p className="text-xs text-gray-400">Terrain placement is vital to protecting your models. Click a terrain type to inspect its 10th edition tactical rules:</p>
              
              {/* Tabs */}
              <div className="flex gap-1 p-1 bg-slate-950 rounded-xl border border-slate-900 overflow-x-auto scrollbar-none" id="terrain-tabs">
                {[
                  { id: "ruins", label: "🏢 Ruins" },
                  { id: "woods", label: "🌲 Woods" },
                  { id: "craters", label: "🕳️ Craters" },
                  { id: "barricades", label: "🚧 Barricades" }
                ].map(t => {
                  const isActive = selectedTerrainGuide === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setSelectedTerrainGuide(t.id as any)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition duration-150 active:scale-98 shrink-0 cursor-pointer border ${
                        isActive
                          ? "bg-sky-500/10 border-sky-500/20 text-sky-300 shadow-sm"
                          : "bg-transparent border-transparent text-stone-500 hover:text-stone-300"
                      }`}
                    >
                      {t.label}
                    </button>
                  );
                })}
              </div>

              {/* Terrain Detail panel */}
              <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl flex-1 flex flex-col gap-3 min-h-[200px] justify-center">
                {selectedTerrainGuide === "ruins" && (
                  <div className="flex flex-col gap-2 text-xs">
                    <span className="font-bold text-sky-400 font-mono uppercase tracking-wider text-[10px]">🏢 Ruins (Most Common)</span>
                    <p className="text-gray-300 leading-relaxed">
                      Ruins represent shattered cityscapes, providing the ultimate tactical playground.
                    </p>
                    <ul className="list-disc pl-4 space-y-1.5 text-gray-400">
                      <li><strong className="text-slate-200">Benefit of Cover:</strong> Models wholly inside or shot through a ruin gain <strong className="text-sky-400">+1 to their Save roll</strong> against ranged attacks (unless save is 3+ and AP is 0).</li>
                      <li><strong className="text-slate-200">Visibility:</strong> Ground floors are typically treated as solid concrete blockading visual sights entirely, preventing unfair 'infinite sightlines' across tables.</li>
                      <li><strong className="text-slate-200">Movement:</strong> Infantry and Beasts can move freely through walls. Vehicles must go around them.</li>
                    </ul>
                  </div>
                )}
                {selectedTerrainGuide === "woods" && (
                  <div className="flex flex-col gap-2 text-xs">
                    <span className="font-bold text-sky-400 font-mono uppercase tracking-wider text-[10px]">🌲 Woods / Forests</span>
                    <p className="text-gray-300 leading-relaxed">
                      Dense clusters of ancient foliage that conceal passing army squads.
                    </p>
                    <ul className="list-disc pl-4 space-y-1.5 text-gray-400">
                      <li><strong className="text-slate-200">Concealment:</strong> Models within or behind the footprints of wood elements gain the <strong className="text-sky-400">Benefit of Cover</strong>.</li>
                      <li><strong className="text-slate-200">Heavy Footing:</strong> Moving and charging through woods is difficult. Subtract <strong className="text-red-400">2"</strong> from any charge rolls passing over woods.</li>
                    </ul>
                  </div>
                )}
                {selectedTerrainGuide === "craters" && (
                  <div className="flex flex-col gap-2 text-xs">
                    <span className="font-bold text-sky-400 font-mono uppercase tracking-wider text-[10px]">🕳️ Craters & Shell Holes</span>
                    <p className="text-gray-300 leading-relaxed">
                      Blast scars that provide fleeting cover for small skirmish groups.
                    </p>
                    <ul className="list-disc pl-4 space-y-1.5 text-gray-400">
                      <li><strong className="text-slate-200">Infantry Only:</strong> Only <strong className="text-amber-400">Infantry</strong> models gain the Benefit of Cover when wholly positioned inside a crater footprint.</li>
                      <li><strong className="text-slate-200">Unstable Ground:</strong> Crossing craters lowers charge speeds. Subtract <strong className="text-red-400">2"</strong> from charge rolls traversing crater barriers.</li>
                    </ul>
                  </div>
                )}
                {selectedTerrainGuide === "barricades" && (
                  <div className="flex flex-col gap-2 text-xs">
                    <span className="font-bold text-sky-400 font-mono uppercase tracking-wider text-[10px]">🚧 Barricades & Pipes</span>
                    <p className="text-gray-300 leading-relaxed">
                      Low concrete dividers, defense lines, or industrial piping.
                    </p>
                    <ul className="list-disc pl-4 space-y-1.5 text-gray-400">
                      <li><strong className="text-slate-200">Ranged Shielding:</strong> Infantry models within 1" of a barricade gain the Benefit of Cover if the attacker is shooting across it.</li>
                      <li><strong className="text-slate-200">Defensive Fighting:</strong> When charging a barricaded enemy, models within <strong className="text-amber-400">2"</strong> of the barricade can fight in melee instead of standard 1" engagement.</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* STEP 2: ACTIVE BATTLE GUIDE & SCORES */}
      {activeStep === "battle" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="battle-step-view">
          
          {/* Unified Battle Dashboard displaying both players' turn statuses side by side */}
          <div className="lg:col-span-12 flex flex-col gap-4" id="battle-dashboard-controls">
            {/* Active Turn Header banner / state clock */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Player 1 Console */}
              <div 
                onClick={() => setActivePlayer("Player 1")}
                className={`relative p-5 rounded-xl border transition-all duration-300 cursor-pointer flex flex-col gap-3 select-none ${
                  activePlayer === "Player 1"
                    ? "bg-sky-950/20 border-sky-500 shadow-[0_0_15px_rgba(14,165,233,0.15)]"
                    : "bg-slate-900/40 border-slate-850 opacity-60 hover:opacity-95 hover:border-slate-800"
                }`}
              >
                <div className="flex justify-between items-start gap-2">
                  <div className="flex flex-col gap-1 min-w-0">
                    <span className="text-xs font-bold text-sky-400 uppercase tracking-wider font-mono">PLAYER 1</span>
                    <span className="text-sm font-bold text-slate-100 truncate">{p1Name}</span>
                    <span className="text-[10px] text-gray-500 font-mono truncate">{p1Faction}</span>
                  </div>
                  <span className={`text-[10px] font-mono font-bold tracking-widest px-2.5 py-1 rounded border uppercase shrink-0 transition-all ${
                    activePlayer === "Player 1"
                      ? "bg-sky-500/10 border-sky-500 text-sky-400 animate-pulse"
                      : "bg-slate-950 border-slate-850 text-gray-500"
                  }`}>
                    {activePlayer === "Player 1" ? "⚡ ACTIVE TURN" : "⏳ WAITING"}
                  </span>
                </div>
                
                {/* VP / CP controls inside Card */}
                <div className="flex items-center gap-4 bg-slate-950/80 border border-slate-900/60 p-2 rounded-lg justify-around">
                  <div className="flex flex-col items-center">
                    <span className="text-[9px] text-gray-500 font-bold uppercase font-mono">Victory Points (VP)</span>
                    <div className="flex items-center gap-2 mt-1">
                      <button 
                        onClick={(e) => { e.stopPropagation(); setP1Vp(Math.max(0, p1Vp - 1)); }} 
                        className="w-6 h-6 rounded bg-slate-900 border border-slate-800 text-stone-400 hover:text-stone-100 hover:border-stone-600 flex items-center justify-center transition active:scale-90 cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-base font-black text-amber-400 w-8 text-center font-mono">{p1Vp}</span>
                      <button 
                        onClick={(e) => { e.stopPropagation(); setP1Vp(p1Vp + 1); }} 
                        className="w-6 h-6 rounded bg-slate-900 border border-slate-800 text-stone-400 hover:text-stone-100 hover:border-stone-600 flex items-center justify-center transition active:scale-90 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="border-l border-slate-900 h-8" />
                  
                  <div className="flex flex-col items-center">
                    <span className="text-[9px] text-gray-500 font-bold uppercase font-mono">Command Points (CP)</span>
                    <div className="flex items-center gap-2 mt-1">
                      <button 
                        onClick={(e) => { e.stopPropagation(); setP1Cp(Math.max(0, p1Cp - 1)); }} 
                        className="w-6 h-6 rounded bg-slate-900 border border-slate-800 text-stone-400 hover:text-stone-100 hover:border-stone-600 flex items-center justify-center transition active:scale-90 cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-base font-black text-sky-400 w-8 text-center font-mono">{p1Cp}</span>
                      <button 
                        onClick={(e) => { e.stopPropagation(); setP1Cp(p1Cp + 1); }} 
                        className="w-6 h-6 rounded bg-slate-900 border border-slate-800 text-stone-400 hover:text-stone-100 hover:border-stone-600 flex items-center justify-center transition active:scale-90 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Player 2 Console */}
              <div 
                onClick={() => setActivePlayer("Player 2")}
                className={`relative p-5 rounded-xl border transition-all duration-300 cursor-pointer flex flex-col gap-3 select-none ${
                  activePlayer === "Player 2"
                    ? "bg-red-950/20 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.15)]"
                    : "bg-slate-900/40 border-slate-850 opacity-60 hover:opacity-95 hover:border-slate-800"
                }`}
              >
                <div className="flex justify-between items-start gap-2">
                  <div className="flex flex-col gap-1 min-w-0">
                    <span className="text-xs font-bold text-red-400 uppercase tracking-wider font-mono">PLAYER 2</span>
                    <span className="text-sm font-bold text-slate-100 truncate">{p2Name}</span>
                    <span className="text-[10px] text-gray-500 font-mono truncate">{p2Faction}</span>
                  </div>
                  <span className={`text-[10px] font-mono font-bold tracking-widest px-2.5 py-1 rounded border uppercase shrink-0 transition-all ${
                    activePlayer === "Player 2"
                      ? "bg-red-500/10 border-red-500 text-red-400 animate-pulse"
                      : "bg-slate-950 border-slate-850 text-gray-500"
                  }`}>
                    {activePlayer === "Player 2" ? "⚡ ACTIVE TURN" : "⏳ WAITING"}
                  </span>
                </div>
                
                {/* VP / CP controls inside Card */}
                <div className="flex items-center gap-4 bg-slate-950/80 border border-slate-900/60 p-2 rounded-lg justify-around">
                  <div className="flex flex-col items-center">
                    <span className="text-[9px] text-gray-500 font-bold uppercase font-mono">Victory Points (VP)</span>
                    <div className="flex items-center gap-2 mt-1">
                      <button 
                        onClick={(e) => { e.stopPropagation(); setP2Vp(Math.max(0, p2Vp - 1)); }} 
                        className="w-6 h-6 rounded bg-slate-900 border border-slate-800 text-stone-400 hover:text-stone-100 hover:border-stone-600 flex items-center justify-center transition active:scale-90 cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-base font-black text-amber-400 w-8 text-center font-mono">{p2Vp}</span>
                      <button 
                        onClick={(e) => { e.stopPropagation(); setP2Vp(p2Vp + 1); }} 
                        className="w-6 h-6 rounded bg-slate-900 border border-slate-800 text-stone-400 hover:text-stone-100 hover:border-stone-600 flex items-center justify-center transition active:scale-90 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="border-l border-slate-900 h-8" />
                  
                  <div className="flex flex-col items-center">
                    <span className="text-[9px] text-gray-500 font-bold uppercase font-mono">Command Points (CP)</span>
                    <div className="flex items-center gap-2 mt-1">
                      <button 
                        onClick={(e) => { e.stopPropagation(); setP2Cp(Math.max(0, p2Cp - 1)); }} 
                        className="w-6 h-6 rounded bg-slate-900 border border-slate-800 text-stone-400 hover:text-stone-100 hover:border-stone-600 flex items-center justify-center transition active:scale-90 cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-base font-black text-sky-400 w-8 text-center font-mono">{p2Cp}</span>
                      <button 
                        onClick={(e) => { e.stopPropagation(); setP2Cp(p2Cp + 1); }} 
                        className="w-6 h-6 rounded bg-slate-900 border border-slate-800 text-stone-400 hover:text-stone-100 hover:border-stone-600 flex items-center justify-center transition active:scale-90 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Unified Match Controller Bar */}
            <div className="bg-slate-900/80 border border-slate-850 rounded-xl px-5 py-3.5 flex flex-wrap items-center justify-between gap-4 shadow-md font-mono">
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-stone-500 font-bold uppercase tracking-wider">BATTLE ROUND:</span>
                <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-850">
                  <button 
                    onClick={() => setRound(Math.max(1, round - 1))} 
                    className="p-1 text-gray-400 hover:text-white transition active:scale-90 cursor-pointer"
                    title="Previous Round"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-black text-slate-100 min-w-[50px] text-center font-mono">ROUND {round} / 5</span>
                  <button 
                    onClick={() => setRound(Math.min(5, round + 1))} 
                    className="p-1 text-gray-400 hover:text-white transition active:scale-90 cursor-pointer"
                    title="Next Round"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setShowScorecard(!showScorecard)}
                  className={`text-[10px] font-bold px-4 py-2.5 rounded-lg border transition flex items-center gap-2 active:scale-98 cursor-pointer ${
                    showScorecard 
                      ? "bg-amber-500 border-amber-400 text-slate-950 font-black shadow-md shadow-amber-500/10" 
                      : "bg-slate-950 border-slate-800 text-amber-400 hover:text-amber-300 hover:bg-slate-900"
                  }`}
                >
                  <Trophy className="w-3.5 h-3.5" />
                  <span>DETAILED SCORECARD</span>
                </button>

                <button 
                  onClick={resetGameTracker}
                  className="bg-slate-950 hover:bg-red-950/20 text-stone-500 hover:text-red-400 border border-slate-850 hover:border-red-900/50 px-3 py-2.5 rounded-lg transition active:scale-95 flex items-center gap-1.5 text-[10px] font-bold cursor-pointer"
                  title="Reset Match Score"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>RESET MATCH</span>
                </button>
              </div>
            </div>
          </div>

          {showScorecard && (
            <div className="lg:col-span-12 bg-slate-900 border border-amber-500/30 rounded-2xl p-5 shadow-xl flex flex-col gap-4 animate-fade-in" id="scorecard-block">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <span className="text-xs font-mono font-black text-amber-400 tracking-wider flex items-center gap-1.5">
                  <Trophy className="w-4 h-4 text-amber-500" />
                  <span>DETAILED BATTLE SCORECARD</span>
                </span>
                <button 
                  onClick={() => setShowScorecard(false)}
                  className="text-gray-500 hover:text-gray-300 text-xs font-mono cursor-pointer"
                >
                  [Hide]
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Player 1 (Defender) */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 flex flex-col gap-3">
                  <div className="flex items-center justify-between border-b border-slate-900 pb-1.5">
                    <span className="text-xs font-bold text-sky-400 truncate font-mono">{p1Name.split(" ")[0]}'s Score (P1)</span>
                    <span className="text-xs font-mono font-bold text-amber-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">{p1Vp} VP</span>
                  </div>

                  <div className="flex flex-col gap-2.5 text-xs">
                    {/* Rounds 1 to 5 */}
                    {[0, 1, 2, 3, 4].map(idx => (
                      <div key={idx} className="grid grid-cols-12 items-center gap-2 border-b border-slate-900 pb-2 last:border-b-0 last:pb-0">
                        <span className="col-span-3 font-mono text-[10px] text-gray-500 uppercase">Round {idx + 1}</span>
                        
                        {/* Primary */}
                        <div className="col-span-5 flex flex-col gap-1">
                          <label className="text-[8px] text-gray-600 font-bold uppercase tracking-wider">Primary VP</label>
                          <select
                            value={p1PrimaryScores[idx]}
                            disabled={idx === 0} /* Primary is not scored in Round 1 in matched play */
                            onChange={(e) => updateP1Scorecard(idx, "primary", parseInt(e.target.value) || 0)}
                            className="bg-slate-900 border border-slate-800 p-1 rounded font-mono text-[10px] text-gray-300 focus:outline-none w-full disabled:opacity-30 cursor-pointer"
                          >
                            <option value={0}>0 VP</option>
                            <option value={5}>5 VP (1 Obj)</option>
                            <option value={10}>10 VP (2 Objs)</option>
                            <option value={15}>15 VP (Max)</option>
                          </select>
                        </div>

                        {/* Secondary */}
                        <div className="col-span-4 flex flex-col gap-1">
                          <label className="text-[8px] text-gray-600 font-bold uppercase tracking-wider">Secondary VP</label>
                          <input
                            type="number"
                            min={0}
                            max={15}
                            value={p1SecondaryScores[idx]}
                            onChange={(e) => updateP1Scorecard(idx, "secondary", Math.min(15, parseInt(e.target.value) || 0))}
                            className="bg-slate-900 border border-slate-800 p-1 rounded font-mono text-[10px] text-gray-300 focus:outline-none w-full text-center"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Player 2 (Attacker) */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 flex flex-col gap-3">
                  <div className="flex items-center justify-between border-b border-slate-900 pb-1.5">
                    <span className="text-xs font-bold text-red-400 truncate font-mono">{p2Name.split(" ")[0]}'s Score (P2)</span>
                    <span className="text-xs font-mono font-bold text-amber-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">{p2Vp} VP</span>
                  </div>

                  <div className="flex flex-col gap-2.5 text-xs">
                    {/* Rounds 1 to 5 */}
                    {[0, 1, 2, 3, 4].map(idx => (
                      <div key={idx} className="grid grid-cols-12 items-center gap-2 border-b border-slate-900 pb-2 last:border-b-0 last:pb-0">
                        <span className="col-span-3 font-mono text-[10px] text-gray-500 uppercase">Round {idx + 1}</span>
                        
                        {/* Primary */}
                        <div className="col-span-5 flex flex-col gap-1">
                          <label className="text-[8px] text-gray-600 font-bold uppercase tracking-wider">Primary VP</label>
                          <select
                            value={p2PrimaryScores[idx]}
                            disabled={idx === 0} /* Primary not scored in Round 1 */
                            onChange={(e) => updateP2Scorecard(idx, "primary", parseInt(e.target.value) || 0)}
                            className="bg-slate-900 border border-slate-800 p-1 rounded font-mono text-[10px] text-gray-300 focus:outline-none w-full disabled:opacity-30 cursor-pointer"
                          >
                            <option value={0}>0 VP</option>
                            <option value={5}>5 VP (1 Obj)</option>
                            <option value={10}>10 VP (2 Objs)</option>
                            <option value={15}>15 VP (Max)</option>
                          </select>
                        </div>

                        {/* Secondary */}
                        <div className="col-span-4 flex flex-col gap-1">
                          <label className="text-[8px] text-gray-600 font-bold uppercase tracking-wider">Secondary VP</label>
                          <input
                            type="number"
                            min={0}
                            max={15}
                            value={p2SecondaryScores[idx]}
                            onChange={(e) => updateP2Scorecard(idx, "secondary", Math.min(15, parseInt(e.target.value) || 0))}
                            className="bg-slate-900 border border-slate-800 p-1 rounded font-mono text-[10px] text-gray-300 focus:outline-none w-full text-center"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
              <p className="text-[10px] text-gray-500 italic text-center font-mono">Note: Unchecking or updating fields dynamically increments victory points. Max matched play secondary points is 45 per game.</p>
            </div>
          )}

          {/* Active Phases Guide (6 Cols) */}
          <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col gap-4">
            
            {/* Tab Header Selector */}
            <div className="flex border-b border-slate-850 pb-2 justify-between items-center">
              <div className="flex gap-1.5 p-1 bg-slate-950/60 rounded-xl border border-slate-900">
                {[
                  { id: "manual", label: "Battle Manual" },
                  { id: "stratagems", label: "Core Stratagems" },
                  { id: "rosters", label: "Roster Datacards" },
                  { id: "log", label: "Battle Log" }
                ].map(tab => {
                  const isActive = selectedBattleTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setSelectedBattleTab(tab.id as any)}
                      className={`text-[10px] font-bold px-3 py-1.5 rounded-lg transition uppercase tracking-wider font-mono cursor-pointer border ${
                        isActive
                          ? "bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-sm"
                          : "text-stone-500 hover:text-stone-300 border-transparent"
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>
              <span className="text-[10px] bg-slate-950 text-stone-500 border border-slate-850 px-2.5 py-1 rounded-lg uppercase font-mono font-bold">
                Round {round}
              </span>
            </div>

            {selectedBattleTab === "manual" && (
              <div className="flex flex-col gap-4 animate-fade-in">
                {/* Persistent Phase Status Bar */}
                <div className="bg-slate-900 border border-slate-700 text-slate-200 px-4 py-2 rounded-lg text-[10px] font-bold font-mono uppercase tracking-widest flex items-center justify-between sticky top-0 z-10 gap-4">
                   <div className="flex gap-4">
                     <span>{matchType} • {gameMode}</span>
                     <span>|</span>
                     <span>Active Phase: <span className="text-amber-400 ml-2">{battlePhase}</span></span>
                   </div>
                </div>
                
                {/* Grid-based timeline tab selectors - listed cleanly without horizontal sliding */}
                <div className="grid grid-cols-3 sm:grid-cols-6 bg-slate-950/80 border border-slate-900 p-1.5 rounded-xl font-mono text-[9px] gap-1.5" id="battle-phases-tabs">
                  {["COMMAND", "MOVEMENT", "SHOOTING", "CHARGE", "FIGHT", "BATTLESHOCK"].map(ph => {
                    const isActive = battlePhase === ph;
                    const phaseRules: Record<string, string> = {
                      COMMAND: "Score primary objectives, issue orders, and manage Command Points.",
                      MOVEMENT: "Move units, declare Advance, or remain stationary for heavy weapons.",
                      SHOOTING: "Select targets, roll hits, wounds, and armor saves.",
                      CHARGE: "Move units into Engagement Range to prepare for combat.",
                      FIGHT: "Resolve melee attacks, fight sequences, and pile-in moves.",
                      BATTLESHOCK: "Check unit morale if below half-strength."
                    };
                    return (
                      <button
                        key={ph}
                        id={`phase-tab-${ph}`}
                        onClick={() => setBattlePhase(ph as any)}
                        className={`group relative px-1 py-2 rounded-lg font-bold transition-all duration-150 cursor-pointer flex items-center justify-center gap-1 border text-center ${
                          isActive
                            ? "bg-amber-500/15 border-amber-500/30 text-amber-300 shadow-sm"
                            : "bg-transparent border-transparent text-stone-500 hover:text-stone-300"
                        }`}
                      >
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-2 bg-slate-800 text-stone-200 text-[10px] rounded shadow-xl border border-slate-700 hidden group-hover:block z-50 w-40 pointer-events-none">
                          {phaseRules[ph]}
                        </div>
                        <span className={`w-1.5 h-1.5 rounded-full transition-colors ${
                          isActive ? "bg-amber-400 animate-pulse" : "bg-stone-700"
                        }`} />
                        <span>{ph}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Dynamic Phase Manual text */}
                <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl flex flex-col gap-3 min-h-[300px]" id="phase-manual-body">
                  {battlePhase === "COMMAND" && (
                    <div className="flex flex-col gap-3 text-xs text-gray-300">
                      <div className="flex items-center gap-2 border-b border-slate-800 pb-1.5">
                        <span className="text-amber-400 font-bold font-mono">THE COMMAND PHASE</span>
                      </div>
                      <ul className="list-disc pl-5 space-y-2.5 text-gray-400 leading-relaxed">
                        <li><strong className="text-slate-200">Gain CP:</strong> Both players gain <strong className="text-sky-400">1 Command Point</strong> automatically at the start of this phase.</li>
                        <li><strong className="text-slate-200">Score Primary VP:</strong> Active player measures and scores victory points for held Objective Markers, as described by their primary mission (usually starting in Round 2).</li>
                        <li><strong className="text-slate-200">Perform Battle-shock tests:</strong> Check every unit in your army that is below half-strength (i.e. more than half of its models have been destroyed, or for a single model, it has lost more than half its starting wounds). Roll 2D6. If the result is LESS than that unit's Leadership (Ld) stat, it fails!</li>
                        <li className="bg-red-500/5 border border-red-500/10 p-2 rounded text-[11px] text-red-400"><strong className="font-bold">FAILURE PENALTY:</strong> Battle-shocked units have their Objective Control (OC) stat reduced to 0, and they cannot be targeted by Stratagems.</li>
                      </ul>
                    </div>
                  )}

                  {battlePhase === "MOVEMENT" && (
                    <div className="flex flex-col gap-3 text-xs text-gray-300">
                      <div className="flex items-center gap-2 border-b border-slate-800 pb-1.5">
                        <span className="text-amber-400 font-bold font-mono">THE MOVEMENT PHASE</span>
                      </div>
                      <ul className="list-disc pl-5 space-y-2.5 text-gray-400 leading-relaxed">
                        <li><strong className="text-slate-200">Normal Move:</strong> Move models in a unit up to their Movement (<strong className="text-amber-400 font-mono">M</strong>) stat. Models cannot end a move within 1" of an enemy model (Engagement Range).</li>
                        <li><strong className="text-slate-200">Advance:</strong> Roll <strong className="text-amber-400 font-mono">1D6</strong>. Add that value to the unit's Movement stat for this turn. <em className="text-gray-500">Note: Advanced units cannot Shoot or Charge this turn unless they have specific rules (like Assault weapons).</em></li>
                        <li><strong className="text-slate-200">Fall Back:</strong> If in Engagement Range of an enemy unit, you can Fall Back. <em className="text-gray-500">Fallen back units cannot Shoot or Charge this turn.</em></li>
                        <li><strong className="text-slate-200">Reinforcements:</strong> At the end of the movement phase, any units in Strategic Reserves can be placed on the battlefield, complying with reserved setup guidelines (usually coming on board edges).</li>
                      </ul>
                    </div>
                  )}

                  {battlePhase === "SHOOTING" && (
                    <div className="flex flex-col gap-3 text-xs text-gray-300">
                      <div className="flex items-center gap-2 border-b border-slate-800 pb-1.5">
                        <span className="text-amber-400 font-bold font-mono">THE SHOOTING PHASE</span>
                      </div>
                      <p className="text-gray-400 font-bold font-mono text-[10px]">Select units to shoot. For each weapon in that unit, complete these 4 steps:</p>
                      <ol className="list-decimal pl-5 space-y-2 text-gray-400 leading-relaxed font-mono text-[11px]">
                        <li><strong className="text-slate-200 font-sans">Select Targets:</strong> Target must be within range of the weapon and in line of sight (not completely hidden behind solid walls).</li>
                        <li><strong className="text-slate-200 font-sans">Hit Roll:</strong> Roll a D6 for each Attack. Must score equal or higher than the Ballistic Skill (<strong className="text-sky-400 font-mono">BS</strong>). Unmodified 1s fail, 6s succeed.</li>
                        <li><strong className="text-slate-200 font-sans">Wound Roll:</strong> Compare Weapon Strength (<strong className="text-amber-400 font-mono">S</strong>) against Target Toughness (<strong className="text-amber-400 font-mono">T</strong>). Use our To-Wound Matrix tool on the right to see what score is needed.</li>
                        <li><strong className="text-slate-200 font-sans">Saves:</strong> The opponent rolls a D6 for each wound. Armor Save is worsened by the Weapon's AP penalty (e.g. Save is 3+, AP is -2, so save becomes 5+). If they fail, apply the weapon's Damage stat to their models.</li>
                      </ol>
                    </div>
                  )}

                  {battlePhase === "CHARGE" && (
                    <div className="flex flex-col gap-3 text-xs text-gray-300">
                      <div className="flex items-center gap-2 border-b border-slate-800 pb-1.5">
                        <span className="text-amber-400 font-bold font-mono">THE CHARGE PHASE</span>
                      </div>
                      <ul className="list-disc pl-5 space-y-2.5 text-gray-400 leading-relaxed">
                        <li><strong className="text-slate-200">Declare Charges:</strong> Choose one of your units within <strong className="text-amber-400 font-mono">12"</strong> of an enemy unit. Declared targets must be in line of sight.</li>
                        <li><strong className="text-slate-200">Charge Distance:</strong> Roll <strong className="text-amber-400 font-mono">2D6</strong>. This is your charge distance in inches.</li>
                        <li><strong className="text-slate-200">Successful Charge:</strong> To succeed, the rolled distance must be enough to move your models into Engagement Range (within 1") of all declared targets. If not, the charge fails and models do not move.</li>
                        <li><strong className="text-slate-200">Overwatch reminder:</strong> Opponents can spend 1 CP to perform a Fire Overwatch action on charging units, hitting on unmodified 6s in your turn.</li>
                      </ul>
                    </div>
                  )}

                  {battlePhase === "FIGHT" && (
                    <div className="flex flex-col gap-3 text-xs text-gray-300">
                      <div className="flex items-center gap-2 border-b border-slate-800 pb-1.5">
                        <span className="text-amber-400 font-bold font-mono">THE FIGHT PHASE</span>
                      </div>
                      <p className="text-gray-400">All units in Engagement Range take turns fighting. Execute in this priority order:</p>
                      <ol className="list-decimal pl-5 space-y-2 text-gray-400 leading-relaxed">
                        <li><strong className="text-slate-200">Fights First units:</strong> Units that Charged this turn, or possess specific Fights First abilities, make attacks first (defender chooses first if both have Fights First).</li>
                        <li><strong className="text-slate-200">Remaining units:</strong> Players alternate fighting with eligible units, starting with the non-active player.</li>
                        <li><strong className="text-slate-200">Melee steps:</strong> Pile-In up to 3", roll Hit rolls against Weapon Skill (<strong className="text-sky-400 font-mono">WS</strong>), roll Wound rolls, let opponent roll Armor/Invul saves, and finally Consolidate up to 3" closer to the nearest enemy.</li>
                      </ol>
                    </div>
                  )}

                  {battlePhase === "BATTLESHOCK" && (
                    <div className="flex flex-col gap-3 text-xs text-gray-300">
                      <div className="flex items-center gap-2 border-b border-slate-800 pb-1.5">
                        <span className="text-amber-400 font-bold font-mono">END OF TURN & BATTLE-SHOCK RULES</span>
                      </div>
                      <ul className="list-disc pl-5 space-y-2.5 text-gray-400 leading-relaxed">
                        <li>Ensure both players have moved, shot, and fought.</li>
                        <li>Log scores from active secondary objectives.</li>
                        <li>Clear transient effects or buffs that expire at "End of Turn".</li>
                        <li>Double check and resolve any Battle-shock tests forgotten during the active Command Phase.</li>
                        <li>Alternate active players and click the Arrow indicators to proceed to the next Battle Round!</li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {selectedBattleTab === "stratagems" && (
              <div className="flex flex-col gap-3 max-h-[480px] overflow-y-auto pr-1 animate-fade-in" id="core-stratagems-view">
                <p className="text-xs text-gray-400 italic mb-1">These are the universal Core Stratagems available to both players in any match. Tap any card to reveal tactical advice on when to use it!</p>
                {[
                  { 
                    name: "Command Re-roll", 
                    cost: "1 CP", 
                    phase: "Any Phase", 
                    effect: "You can re-roll one Hit roll, Wound roll, Save roll, Advance roll, Charge roll, or Battle-shock test.",
                    tip: "Only spend this if the re-roll can turn a critical combat outcome. The best targets are crucial multi-damage Armour Saves, or key Charge Rolls on objective markers. Don't waste it on low-impact hit rolls!" 
                  },
                  { 
                    name: "Fire Overwatch", 
                    cost: "1 CP", 
                    phase: "Enemy Move/Charge Phase", 
                    effect: "Target one of your units. That unit shoots at a moving/charging enemy as if it were your shooting phase. Hits only on unmodified 6s.",
                    tip: "Overwatch only scores hits on unmodified 6s. Therefore, this is incredibly powerful when used on units carrying Torrent weapons (like Flamers) because Torrent weapons automatically hit, bypassing the 6+ restriction entirely!" 
                  },
                  { 
                    name: "Counter-Offensive", 
                    cost: "2 CP", 
                    phase: "Fight Phase", 
                    effect: "Use right after an enemy unit has fought. Select one of your eligible units to fight next instead of alternating normally.",
                    tip: "Extremely useful when you have multiple units locked in Melee and your opponent is about to wipe out one of your key squads before they can swing. Strike first and disrupt their combat sequence!" 
                  },
                  { 
                    name: "Go To Ground", 
                    cost: "1 CP", 
                    phase: "Enemy Shooting Phase", 
                    effect: "Target one of your Infantry units. For the rest of the phase, that unit gains a 6+ Invulnerable Save and the Benefit of Cover.",
                    tip: "Perfect for fragile Battleline squads (like Intercessors) standing on objective markers. The added Benefit of Cover (+1 to save) and 6+ invul ensures they stay alive to score you VP." 
                  },
                  { 
                    name: "Smokescreen", 
                    cost: "1 CP", 
                    phase: "Enemy Shooting Phase", 
                    effect: "Target one of your Vehicle units with the Smoke keyword. The unit gains Benefit of Cover and Stealth (-1 to hit) until the end of the phase.",
                    tip: "If your heavy tank or transport gets caught in the open, smoke them! The combination of -1 to hit and +1 to your save dramatically cuts down incoming anti-armor damage." 
                  },
                  { 
                    name: "Insane Bravery", 
                    cost: "1 CP", 
                    phase: "Battle-shock Phase", 
                    effect: "Target one unit that just failed a Battle-shock test. That unit is treated as having passed the test automatically instead.",
                    tip: "Use this only when a crucial unit has failed Battle-shock on an objective you absolutely need to hold to score primary VP at the end of the round. Remember: you cannot use this if the unit is already shocked!" 
                  },
                  { 
                    name: "Rapid Ingress", 
                    cost: "1 CP", 
                    phase: "End of Enemy Movement", 
                    effect: "Set up one of your units from Strategic Reserves onto the battlefield as if it were your movement phase.",
                    tip: "Deploying models in your opponent's turn is a massive advantage. Place them behind a ruin safely out of sight, and they will be perfectly positioned to move and charge during your upcoming turn!" 
                  },
                  { 
                    name: "Heroic Intervention", 
                    cost: "2 CP", 
                    phase: "Enemy Charge Phase", 
                    effect: "Target one unit within 6\" of an enemy charging friendly. Your unit can declare a charge as if it were your turn.",
                    tip: "Use this to protect weak friendly squads by charging your heavy melee units into the enemy before they can engage your squishy objective holders. Turn their offensive charge into your counter-assault!" 
                  }
                ].filter(strat => {
                  if (strat.phase === "Any Phase") return true;
                  if (battlePhase === "COMMAND") return strat.phase.includes("Command") || strat.phase.includes("Any");
                  if (battlePhase === "MOVEMENT") return strat.phase.includes("Move") || strat.phase.includes("Movement");
                  if (battlePhase === "SHOOTING") return strat.phase.includes("Shooting");
                  if (battlePhase === "CHARGE") return strat.phase.includes("Charge");
                  if (battlePhase === "FIGHT") return strat.phase.includes("Fight") || strat.phase.includes("Combat");
                  if (battlePhase === "BATTLESHOCK") return strat.phase.includes("Battle-shock") || strat.phase.includes("Battleshock");
                  return true;
                }).map((strat, idx) => {
                  const isExpanded = expandedStratName === strat.name;
                  return (
                    <div 
                      key={idx} 
                      onClick={() => setExpandedStratName(isExpanded ? null : strat.name)}
                      className={`border p-4 rounded-xl flex flex-col gap-2 transition cursor-pointer select-none ${
                        isExpanded 
                          ? "bg-slate-900 border-amber-500/50" 
                          : "bg-slate-950 border-slate-850 hover:border-slate-800"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1.5 font-mono font-bold text-xs text-amber-300">
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-amber-500 shrink-0" /> : <ChevronDown className="w-3.5 h-3.5 text-gray-500 shrink-0" />}
                          <span>{strat.name}</span>
                        </div>
                        <span className="text-[10px] font-mono bg-sky-950 text-sky-400 border border-sky-900/50 px-2.5 py-0.5 rounded-md font-bold shrink-0">
                          {strat.cost}
                        </span>
                      </div>
                      <span className="text-[9px] uppercase font-mono tracking-wider text-gray-500">Phase: {strat.phase}</span>
                      <p className="text-xs text-gray-300 leading-relaxed mt-1">{strat.effect}</p>
                      
                      {isExpanded && (
                        <div className="mt-2.5 pt-2.5 border-t border-slate-800 bg-amber-500/5 p-3 rounded-lg border border-amber-500/15 text-[11px] leading-relaxed text-gray-400 animate-fade-in font-sans">
                          <strong className="text-amber-400 block mb-0.5 font-mono uppercase tracking-wider text-[10px]">Commander's Piloting Guide:</strong>
                          {strat.tip}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {selectedBattleTab === "rosters" && (
              <div className="flex flex-col gap-4 animate-fade-in" id="rosters-tab-content">
                {/* Active Player Roster Toggle */}
                <div className="flex gap-2 bg-slate-950 p-1 rounded-xl border border-slate-850">
                  <button
                    onClick={() => setActiveRosterTab("p1")}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold font-mono transition flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer ${
                      activeRosterTab === "p1"
                        ? "bg-sky-500/10 border border-sky-500/30 text-sky-400 font-bold"
                        : "text-gray-500 hover:text-gray-300"
                    }`}
                  >
                    <span>{p1Name.split(" ")[0]}'s Army</span>
                  </button>
                  <button
                    onClick={() => setActiveRosterTab("p2")}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold font-mono transition flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer ${
                      activeRosterTab === "p2"
                        ? "bg-red-500/10 border border-red-500/30 text-red-400 font-bold"
                        : "text-gray-500 hover:text-gray-300"
                    }`}
                  >
                    <span>{p2Name.split(" ")[0]}'s Army</span>
                  </button>
                </div>

                {/* Main list view */}
                <div className="flex flex-col gap-3 max-h-[480px] overflow-y-auto pr-1">
                  {(() => {
                    const activeRosterId = activeRosterTab === "p1" ? selectedP1RosterId : selectedP2RosterId;
                    
                    if (!activeRosterId) {
                      return (
                        <div className="bg-slate-950 border border-slate-850 p-6 rounded-xl text-center flex flex-col gap-3 justify-center items-center">
                          <ShieldAlert className="w-8 h-8 text-amber-500/80 animate-pulse" />
                          <div className="text-xs">
                            <span className="font-bold text-slate-300 block mb-1">No Saved Roster Selected</span>
                            <p className="text-gray-500 leading-relaxed max-w-xs mx-auto">
                              Go to <span className="text-amber-400 font-bold font-mono">1. Table Setup</span> and select a saved roster for this player from the dropdown. 
                            </p>
                          </div>
                        </div>
                      );
                    }

                    const roster = savedRosters.find(r => r.id === activeRosterId);
                    if (!roster) {
                      return (
                        <div className="bg-slate-950 border border-slate-850 p-6 rounded-xl text-center flex flex-col gap-3 justify-center items-center">
                          <ShieldAlert className="w-8 h-8 text-red-500/80" />
                          <span className="text-xs text-gray-400 font-bold">Roster list not found in storage.</span>
                        </div>
                      );
                    }

                    if (roster.items.length === 0) {
                      return (
                        <div className="bg-slate-950 border border-slate-850 p-6 rounded-xl text-center text-xs text-gray-500">
                          This roster contains no units.
                        </div>
                      );
                    }

                    const factionId = roster.factionId;

                    return (
                      <div className="flex flex-col gap-3">
                        <div className="flex justify-between items-center text-[10px] font-mono text-gray-500 uppercase px-1">
                          <span>{roster.name} ({roster.items.length} units)</span>
                          <span className="text-amber-400 font-bold">
                            Total: {roster.items.reduce((sum, item) => sum + (item.points * item.count) + (item.enhancementPoints || 0), 0)} pts
                          </span>
                        </div>

                        {/* Detachment & Enhancements Info */}
                        <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl text-xs flex flex-col gap-4">
                          {(() => {
                            const faction = FACTIONS.find(f => f.id === roster.factionId);
                            const detachment = faction?.detachment;
                            if (!detachment) return <div className="text-slate-500">No Detachment Data</div>;

                            return (
                              <>
                                <div className="flex flex-col gap-1">
                                  <span className="font-bold text-slate-100">Detachment: {detachment.name}</span>
                                  <p className="text-[10px] text-slate-400 italic">{detachment.description}</p>
                                </div>
                                
                                <div className="flex flex-col gap-1">
                                  <span className="font-bold text-slate-200">Selected Enhancements:</span>
                                  {roster.selectedEnhancementNames?.length ? (
                                    <ul className="list-disc list-inside text-[10px] text-slate-400 mt-1 space-y-1">
                                      {detachment.enhancements
                                        .filter(e => roster.selectedEnhancementNames!.includes(e.name))
                                        .map(e => (
                                          <li key={e.name}><span className="font-semibold text-slate-100">{e.name}</span> ({e.points} pts): {e.description}</li>
                                        ))}
                                    </ul>
                                  ) : <span className="text-[10px] text-slate-500">None</span>}
                                </div>

                                <div className="flex flex-col gap-1">
                                  <span className="font-bold text-slate-200">Selected Stratagems:</span>
                                  {roster.selectedStratagemNames?.length ? (
                                    <ul className="list-disc list-inside text-[10px] text-slate-400 mt-1 space-y-1">
                                      {detachment.stratagems
                                        .filter(s => roster.selectedStratagemNames!.includes(s.name))
                                        .map(s => (
                                          <li key={s.name}><span className="font-semibold text-slate-100">{s.name}</span> ({s.cost} CP, {s.phase}): {s.effect}</li>
                                        ))}
                                    </ul>
                                  ) : <span className="text-[10px] text-slate-500">None</span>}
                                </div>
                              </>
                            );
                          })()}
                        </div>

                        {roster.items.map((item) => {
                          const datacard = getDatacardById(factionId, item.datacardId);
                          const isExpanded = expandedUnitId === item.id;
                          
                          return (
                            <div 
                              key={item.id}
                              className={`border rounded-xl transition duration-150 ${
                                isExpanded 
                                  ? "bg-slate-950 border-amber-500/50 shadow-md" 
                                  : "bg-slate-950/40 border-slate-850 hover:border-slate-800"
                              }`}
                            >
                              {/* Header Card (Summary) */}
                              <div 
                                onClick={() => setExpandedUnitId(isExpanded ? null : item.id)}
                                className="p-3.5 flex justify-between items-center cursor-pointer select-none"
                              >
                                <div className="flex flex-col gap-1 min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-xs font-bold text-slate-200 truncate">{item.name}</span>
                                    {item.isWarlord && (
                                      <span className="text-[8px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 px-1.5 py-0.5 rounded">
                                        WARLORD
                                      </span>
                                    )}
                                    {datacard && (
                                      <span className="text-[8px] font-mono text-gray-500 bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded">
                                        {datacard.type}
                                      </span>
                                    )}
                                  </div>
                                  
                                  <div className="flex items-center gap-1 text-[10px] text-gray-500 font-mono">
                                    <span>Count: {item.count}x {datacard?.squadSize || "squad"}</span>
                                    {item.enhancementName && (
                                      <span className="text-sky-400 truncate">
                                        • +{item.enhancementName} ({item.enhancementPoints} pts)
                                      </span>
                                    )}
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                  <span className="text-xs font-bold text-amber-500 font-mono">
                                    {(item.points * item.count) + (item.enhancementPoints || 0)} pts
                                  </span>
                                  {isExpanded ? (
                                    <ChevronUp className="w-4 h-4 text-amber-500" />
                                  ) : (
                                    <ChevronDown className="w-4 h-4 text-gray-500" />
                                  )}
                                </div>
                              </div>

                              {/* Collapsible Full Datacard */}
                              {isExpanded && (
                                <div className="border-t border-slate-900 p-4 flex flex-col gap-4 animate-fade-in text-xs text-gray-300">
                                  {datacard ? (
                                    <>
                                      {/* Core Stats Sheet Grid */}
                                      <div className="grid grid-cols-7 border border-slate-850 rounded-lg overflow-hidden text-center bg-slate-900/40">
                                        {[
                                          { label: "M", val: datacard.stats.m, tip: "Movement" },
                                          { label: "T", val: datacard.stats.t, tip: "Toughness" },
                                          { label: "SV", val: datacard.stats.sv, tip: "Save" },
                                          { label: "W", val: datacard.stats.w, tip: "Wounds" },
                                          { label: "LD", val: datacard.stats.ld, tip: "Leadership" },
                                          { label: "OC", val: datacard.stats.oc, tip: "Objective Control" },
                                          { label: "INV", val: datacard.stats.invul || "-", tip: "Invulnerable Save" }
                                        ].map((st, sidx) => (
                                          <div key={st.label} className={`flex flex-col p-2 ${sidx < 6 ? "border-r border-slate-850" : ""}`}>
                                            <span className="text-[9px] text-gray-500 font-mono font-bold" title={st.tip}>{st.label}</span>
                                            <span className="text-sm font-black text-amber-400 font-mono mt-0.5">{st.val}</span>
                                          </div>
                                        ))}
                                      </div>

                                      {/* Ranged Weapons Section */}
                                      {datacard.weapons.ranged.length > 0 && (
                                        <div className="flex flex-col gap-2">
                                          <span className="text-[10px] font-bold text-sky-400 font-mono uppercase tracking-wider">Ranged Weapons</span>
                                          <div className="flex flex-col gap-2">
                                            {datacard.weapons.ranged.map((w, widx) => (
                                              <div key={widx} className="bg-slate-900/60 border border-slate-850 p-2.5 rounded-lg flex flex-col gap-2">
                                                <div className="flex justify-between items-center border-b border-slate-850/50 pb-1.5">
                                                  <span className="font-bold text-slate-200">{w.name}</span>
                                                  <button
                                                    onClick={() => {
                                                      // Populate Expected Damage Simulator
                                                      const atks = parseInt(w.attacks) || 4;
                                                      const skl = parseInt(w.skill.replace("+", "")) || 3;
                                                      const str = w.strength || 4;
                                                      const ap = Math.abs(w.ap) || 0;
                                                      const sv = parseInt(datacard.stats.sv.replace("+", "")) || 3;
                                                      const invul = datacard.stats.invul ? (parseInt(datacard.stats.invul.replace("+", "")) || 5) : 7;
                                                      
                                                      setSimAttacks(atks);
                                                      setSimSkill(skl);
                                                      setSimStrength(str);
                                                      setSimAp(ap);
                                                      setSimToughness(datacard.stats.t);
                                                      setSimSave(sv);
                                                      setSimInvul(invul);
                                                      
                                                      triggerSimulatorNotice(`Loaded ranged weapon "${w.name}" into Expected Damage Simulator!`);
                                                      
                                                      // Scroll combat simulator into view
                                                      const targetEl = document.getElementById("game-companion-root");
                                                      if (targetEl) {
                                                        targetEl.scrollIntoView({ behavior: "smooth" });
                                                      }
                                                    }}
                                                    className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold font-mono text-[9px] px-2.5 py-1 rounded flex items-center gap-1 transition active:scale-95 cursor-pointer"
                                                    title="Load this weapon into the Expected Damage Simulator"
                                                  >
                                                    <Swords className="w-3 h-3" />
                                                    <span>SEND TO SIMULATOR</span>
                                                  </button>
                                                </div>

                                                <div className="grid grid-cols-6 text-center text-[10px] font-mono text-gray-400">
                                                  <div className="flex flex-col">
                                                    <span className="text-[8px] text-gray-500">RANGE</span>
                                                    <span className="font-bold text-slate-300 mt-0.5">{w.range}</span>
                                                  </div>
                                                  <div className="flex flex-col">
                                                    <span className="text-[8px] text-gray-500">A</span>
                                                    <span className="font-bold text-slate-300 mt-0.5">{w.attacks}</span>
                                                  </div>
                                                  <div className="flex flex-col">
                                                    <span className="text-[8px] text-gray-500">BS</span>
                                                    <span className="font-bold text-sky-400 mt-0.5">{w.skill}</span>
                                                  </div>
                                                  <div className="flex flex-col">
                                                    <span className="text-[8px] text-gray-500">S</span>
                                                    <span className="font-bold text-slate-300 mt-0.5">{w.strength}</span>
                                                  </div>
                                                  <div className="flex flex-col">
                                                    <span className="text-[8px] text-gray-500">AP</span>
                                                    <span className="font-bold text-slate-300 mt-0.5">-{Math.abs(w.ap)}</span>
                                                  </div>
                                                  <div className="flex flex-col">
                                                    <span className="text-[8px] text-gray-500">D</span>
                                                    <span className="font-bold text-amber-400 mt-0.5">{w.damage}</span>
                                                  </div>
                                                </div>

                                                {w.abilities && w.abilities.length > 0 && (
                                                  <div className="text-[9px] font-mono text-amber-500/80 bg-amber-500/5 px-2 py-1 rounded border border-amber-500/10 mt-1">
                                                    <strong className="font-bold">Keywords:</strong> {w.abilities.join(", ")}
                                                  </div>
                                                )}
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      )}

                                      {/* Melee Weapons Section */}
                                      {datacard.weapons.melee.length > 0 && (
                                        <div className="flex flex-col gap-2">
                                          <span className="text-[10px] font-bold text-red-400 font-mono uppercase tracking-wider">Melee Weapons</span>
                                          <div className="flex flex-col gap-2">
                                            {datacard.weapons.melee.map((w, widx) => (
                                              <div key={widx} className="bg-slate-900/60 border border-slate-850 p-2.5 rounded-lg flex flex-col gap-2">
                                                <div className="flex justify-between items-center border-b border-slate-850/50 pb-1.5">
                                                  <span className="font-bold text-slate-200">{w.name}</span>
                                                  <button
                                                    onClick={() => {
                                                      // Populate Expected Damage Simulator
                                                      const atks = parseInt(w.attacks) || 4;
                                                      const skl = parseInt(w.skill.replace("+", "")) || 3;
                                                      const str = w.strength || 4;
                                                      const ap = Math.abs(w.ap) || 0;
                                                      const sv = parseInt(datacard.stats.sv.replace("+", "")) || 3;
                                                      const invul = datacard.stats.invul ? (parseInt(datacard.stats.invul.replace("+", "")) || 5) : 7;
                                                      
                                                      setSimAttacks(atks);
                                                      setSimSkill(skl);
                                                      setSimStrength(str);
                                                      setSimAp(ap);
                                                      setSimToughness(datacard.stats.t);
                                                      setSimSave(sv);
                                                      setSimInvul(invul);
                                                      
                                                      triggerSimulatorNotice(`Loaded melee weapon "${w.name}" into Expected Damage Simulator!`);
                                                      
                                                      // Scroll combat simulator into view
                                                      const targetEl = document.getElementById("game-companion-root");
                                                      if (targetEl) {
                                                        targetEl.scrollIntoView({ behavior: "smooth" });
                                                      }
                                                    }}
                                                    className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold font-mono text-[9px] px-2.5 py-1 rounded flex items-center gap-1 transition active:scale-95 cursor-pointer"
                                                    title="Load this weapon into the Expected Damage Simulator"
                                                  >
                                                    <Swords className="w-3 h-3" />
                                                    <span>SEND TO SIMULATOR</span>
                                                  </button>
                                                </div>

                                                <div className="grid grid-cols-6 text-center text-[10px] font-mono text-gray-400">
                                                  <div className="flex flex-col">
                                                    <span className="text-[8px] text-gray-500">RANGE</span>
                                                    <span className="font-bold text-slate-300 mt-0.5">Melee</span>
                                                  </div>
                                                  <div className="flex flex-col">
                                                    <span className="text-[8px] text-gray-500">A</span>
                                                    <span className="font-bold text-slate-300 mt-0.5">{w.attacks}</span>
                                                  </div>
                                                  <div className="flex flex-col">
                                                    <span className="text-[8px] text-gray-500">WS</span>
                                                    <span className="font-bold text-sky-400 mt-0.5">{w.skill}</span>
                                                  </div>
                                                  <div className="flex flex-col">
                                                    <span className="text-[8px] text-gray-500">S</span>
                                                    <span className="font-bold text-slate-300 mt-0.5">{w.strength}</span>
                                                  </div>
                                                  <div className="flex flex-col">
                                                    <span className="text-[8px] text-gray-500">AP</span>
                                                    <span className="font-bold text-slate-300 mt-0.5">-{Math.abs(w.ap)}</span>
                                                  </div>
                                                  <div className="flex flex-col">
                                                    <span className="text-[8px] text-gray-500">D</span>
                                                    <span className="font-bold text-amber-400 mt-0.5">{w.damage}</span>
                                                  </div>
                                                </div>

                                                {w.abilities && w.abilities.length > 0 && (
                                                  <div className="text-[9px] font-mono text-amber-500/80 bg-amber-500/5 px-2 py-1 rounded border border-amber-500/10 mt-1">
                                                    <strong className="font-bold">Keywords:</strong> {w.abilities.join(", ")}
                                                  </div>
                                                )}
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      )}

                                      {/* Datasheet Abilities Section */}
                                      {datacard.abilities.datasheet && datacard.abilities.datasheet.length > 0 && (
                                        <div className="flex flex-col gap-2">
                                          <span className="text-[10px] font-bold text-amber-500 font-mono uppercase tracking-wider">Abilities</span>
                                          <div className="flex flex-col gap-2 bg-slate-900/40 p-3 rounded-lg border border-slate-850">
                                            {datacard.abilities.datasheet.map((ab, abidx) => (
                                              <div key={abidx} className="flex flex-col gap-1 border-b border-slate-900 pb-2 last:border-b-0 last:pb-0 font-sans">
                                                <span className="font-bold text-slate-200 text-xs font-mono">{ab.name}</span>
                                                <p className="text-gray-400 leading-relaxed text-[11px]">{ab.description}</p>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      )}

                                      {/* Unit Keywords */}
                                      {datacard.keywords && datacard.keywords.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 border-t border-slate-900 pt-3">
                                          {datacard.keywords.map((kw, kwidx) => (
                                            <span 
                                              key={kwidx} 
                                              className="text-[9px] font-mono bg-slate-900 border border-slate-850 px-2 py-0.5 rounded text-gray-400"
                                            >
                                              {kw}
                                            </span>
                                          ))}
                                        </div>
                                      )}
                                    </>
                                  ) : (
                                    <span className="text-gray-500 text-xs">Failed to load detailed sheet stats.</span>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}
          </div>

          {/* COLUMN 3: Battle Tools (Dice Roller, Strength Matrix, Attack Simulator) (6 Cols) */}
          <div className="lg:col-span-6 flex flex-col gap-5">
            
            {/* Tool Accordions / Selector */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col gap-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2.5">
                <h3 className="text-sm font-bold text-slate-100 font-mono uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <Dices className="w-4 h-4 text-amber-500" />
                  <span>Warhammer Combat Tools</span>
                </h3>
                <span className="text-[9px] font-mono bg-amber-500/10 text-amber-300 border border-amber-500/25 px-2 py-0.5 rounded uppercase font-bold animate-pulse">
                  {battlePhase} PHASE ACTIVE
                </span>
              </div>

              {/* Sub-tool 1: Dice Roller (Always visible as it's the core gaming tool) */}
              <div className="bg-slate-950 border border-slate-850 rounded-xl p-4 flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-300 font-mono">1. Tactical Dice Roller</span>
                  <span className="text-[10px] text-gray-500 font-mono">Roll multiple D6</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex flex-col gap-1.5 flex-1">
                    <label className="text-[10px] text-gray-500 font-bold font-mono">Dice to Roll</label>
                    <input 
                      type="number" 
                      min={1} 
                      max={50} 
                      value={numDiceToRoll} 
                      onChange={(e) => setNumDiceToRoll(parseInt(e.target.value) || 1)}
                      className="bg-slate-900 border border-slate-800 rounded-lg text-xs p-2 text-center text-gray-200 focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5 flex-1">
                    <label className="text-[10px] text-gray-500 font-bold font-mono">Hit/Wound Target</label>
                    <select
                      value={successThreshold}
                      onChange={(e) => setSuccessThreshold(parseInt(e.target.value))}
                      className="bg-slate-900 border border-slate-800 rounded-lg text-xs p-2 text-center text-amber-400 focus:outline-none"
                    >
                      <option value={2}>2+ (Amazing)</option>
                      <option value={3}>3+ (Strong)</option>
                      <option value={4}>4+ (Average)</option>
                      <option value={5}>5+ (Difficult)</option>
                      <option value={6}>6+ (Extreme)</option>
                    </select>
                  </div>
                  <button
                    onClick={rollDice}
                    className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs h-10 px-4 rounded-lg self-end cursor-pointer active:scale-95 transition shrink-0"
                  >
                    ROLL DICE
                  </button>
                </div>

                {/* Real-time Math Helper */}
                <div className="bg-slate-900/60 border border-slate-800 p-2.5 rounded-lg flex flex-col gap-1.5 font-mono text-[10px] mt-1">
                  <div className="flex justify-between items-center text-[9px] text-gray-500 font-bold uppercase tracking-wider">
                    <span>Dice Probability Gauge</span>
                    <span className="text-amber-400 font-bold">Live Math Analysis</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-gray-400">
                    <div>
                      <span>Exp. Successes:</span>{" "}
                      <strong className="text-emerald-400">
                        {((numDiceToRoll * (7 - successThreshold)) / 6).toFixed(1)}
                      </strong>
                    </div>
                    <div>
                      <span>At least one:</span>{" "}
                      <strong className="text-sky-400">
                        {((1 - Math.pow((successThreshold - 1) / 6, numDiceToRoll)) * 100).toFixed(1)}%
                      </strong>
                    </div>
                  </div>

                  {/* Progress bar gauge */}
                  <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-800 mt-1">
                    <div 
                      className={`h-full transition-all duration-300 ${
                        (1 - Math.pow((successThreshold - 1) / 6, numDiceToRoll)) >= 0.90
                          ? "bg-emerald-500"
                          : (1 - Math.pow((successThreshold - 1) / 6, numDiceToRoll)) >= 0.70
                            ? "bg-teal-500"
                            : (1 - Math.pow((successThreshold - 1) / 6, numDiceToRoll)) >= 0.50
                              ? "bg-amber-500"
                              : "bg-red-500"
                      }`}
                      style={{ width: `${(1 - Math.pow((successThreshold - 1) / 6, numDiceToRoll)) * 100}%` }}
                    />
                  </div>

                  <div className="text-[9px] mt-0.5 text-center">
                    <span className="text-gray-500">Verdict:</span>{" "}
                    <span className={`font-black ${
                      (1 - Math.pow((successThreshold - 1) / 6, numDiceToRoll)) >= 0.90
                        ? "text-emerald-400"
                        : (1 - Math.pow((successThreshold - 1) / 6, numDiceToRoll)) >= 0.70
                          ? "text-teal-400"
                          : (1 - Math.pow((successThreshold - 1) / 6, numDiceToRoll)) >= 0.50
                            ? "text-amber-400"
                            : "text-red-400"
                    }`}>
                      {(1 - Math.pow((successThreshold - 1) / 6, numDiceToRoll)) >= 0.90
                        ? "🟢 HIGHLY RELIABLE"
                        : (1 - Math.pow((successThreshold - 1) / 6, numDiceToRoll)) >= 0.70
                          ? "🔵 LIKELY OUTCOME"
                          : (1 - Math.pow((successThreshold - 1) / 6, numDiceToRoll)) >= 0.50
                            ? "🟡 COIN FLIP / AVERAGE"
                            : "🔴 HIGH RISK GAMBLE"}
                    </span>
                  </div>
                </div>

                {/* Render Rolls */}
                {rolledDice.length > 0 && (
                  <div className="flex flex-col gap-2 border-t border-slate-900 pt-3">
                    <div className="flex justify-between items-center text-[10px] font-mono text-gray-500">
                      <span>Tap dice to mark for custom Re-Rolls</span>
                      <span className="text-amber-400">Successes (&gt;= {successThreshold}+): {rolledDice.filter(d => d.value >= successThreshold).length}</span>
                    </div>

                    <div className="flex flex-wrap gap-2 justify-center max-h-[140px] overflow-y-auto p-2 bg-slate-900/40 rounded-lg border border-slate-900">
                      {rolledDice.map(die => {
                        const isSuccess = die.value >= successThreshold;
                        return (
                          <div
                            key={die.id}
                            onClick={() => toggleDieSelect(die.id)}
                            className={`w-8 h-8 rounded-lg border flex items-center justify-center font-black text-sm cursor-pointer transition duration-150 active:scale-90 ${
                              die.selected
                                ? "bg-amber-500 border-amber-400 text-slate-950 ring-2 ring-amber-400 ring-offset-1 ring-offset-slate-950"
                                : isSuccess
                                  ? "bg-emerald-950/40 border-emerald-500 text-emerald-400"
                                  : "bg-red-950/20 border-red-900/50 text-red-400"
                            }`}
                          >
                            {die.value}
                          </div>
                        );
                      })}
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-1">
                      <button
                        onClick={selectFailedDice}
                        className="bg-slate-900 hover:bg-slate-850 text-gray-400 hover:text-gray-200 text-[10px] py-1.5 rounded-lg border border-slate-800 font-mono active:scale-95 transition cursor-pointer"
                      >
                        Select Failed
                      </button>
                      <button
                        onClick={reRollSelected}
                        disabled={!rolledDice.some(d => d.selected)}
                        className="bg-amber-500/10 hover:bg-amber-500/20 disabled:opacity-50 text-amber-400 disabled:text-gray-600 text-[10px] py-1.5 rounded-lg border border-amber-500/30 disabled:border-slate-800 font-mono active:scale-95 transition cursor-pointer font-bold"
                      >
                        Re-Roll Selected
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Dynamic Phase-Specific Tools display */}
              <div className="border-t border-slate-800/60 pt-4 flex flex-col gap-4">
                
                {/* 1. SHOOTING & FIGHT: To-Wound solver & expected damage */}
                {(battlePhase === "SHOOTING" || battlePhase === "FIGHT") && (
                  <div className="flex flex-col gap-4 animate-fade-in">
                    
                    {/* To-Wound Solver Matrix */}
                    <div className="bg-slate-950 border border-slate-850 rounded-xl p-4 flex flex-col gap-2.5">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-300 font-mono">2. To-Wound Matrix Calculator</span>
                        <span className="text-[10px] text-gray-500 font-mono">Strength vs Toughness</span>
                      </div>

                      <div className="grid grid-cols-3 gap-3 items-center">
                        <div className="flex flex-col gap-1">
                          <label className="text-[9px] text-gray-500 font-bold font-mono">Weapon S</label>
                          <input 
                            type="number" 
                            min={1} 
                            max={20} 
                            value={weaponStrength} 
                            onChange={(e) => setWeaponStrength(parseInt(e.target.value) || 1)}
                            className="bg-slate-900 border border-slate-800 rounded-lg text-xs p-2 text-center text-gray-200 focus:outline-none"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[9px] text-gray-500 font-bold font-mono">Target T</label>
                          <input 
                            type="number" 
                            min={1} 
                            max={20} 
                            value={targetToughness} 
                            onChange={(e) => setTargetToughness(parseInt(e.target.value) || 1)}
                            className="bg-slate-900 border border-slate-800 rounded-lg text-xs p-2 text-center text-gray-200 focus:outline-none"
                          />
                        </div>
                        <div className="bg-slate-900 border border-slate-850 rounded-lg p-2 flex flex-col text-center self-end">
                          <span className="text-[8px] text-gray-500 font-bold">Wound Roll Required</span>
                          <span className="text-sm font-black text-amber-400 font-mono">
                            {getToWoundThreshold(weaponStrength, targetToughness)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Combat Simulator / Expected Damage */}
                    <div className="bg-slate-950 border border-slate-850 rounded-xl p-4 flex flex-col gap-3">
                      <div className="flex justify-between items-center border-b border-slate-900 pb-1.5">
                        <span className="text-xs font-bold text-slate-300 font-mono">3. Expected Damage Simulator</span>
                        <span className="text-[10px] text-gray-500 font-mono">Full attack sequence math</span>
                      </div>

                      {simulatorNotice && (
                        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-2.5 rounded-lg text-[10px] font-mono font-bold animate-pulse text-center">
                          {simulatorNotice}
                        </div>
                      )}

                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 text-xs font-mono">
                        <div className="flex flex-col gap-1">
                          <span className="text-[8px] text-gray-500">Attacks</span>
                          <input type="number" min={1} value={simAttacks} onChange={(e) => setSimAttacks(parseInt(e.target.value) || 1)} className="bg-slate-900 border border-slate-800 p-1.5 text-center text-gray-300 rounded" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-[8px] text-gray-500">BS/WS (Hit)</span>
                          <input type="number" min={2} max={6} value={simSkill} onChange={(e) => setSimSkill(parseInt(e.target.value) || 3)} className="bg-slate-900 border border-slate-800 p-1.5 text-center text-sky-400 rounded" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-[8px] text-gray-500">Weapon S</span>
                          <input type="number" min={1} value={simStrength} onChange={(e) => setSimStrength(parseInt(e.target.value) || 4)} className="bg-slate-900 border border-slate-800 p-1.5 text-center text-gray-300 rounded" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-[8px] text-gray-500">Weapon AP</span>
                          <input type="number" min={0} value={simAp} onChange={(e) => setSimAp(parseInt(e.target.value) || 0)} className="bg-slate-900 border border-slate-800 p-1.5 text-center text-gray-300 rounded" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-[8px] text-gray-500">Target T</span>
                          <input type="number" min={1} value={simToughness} onChange={(e) => setSimToughness(parseInt(e.target.value) || 4)} className="bg-slate-900 border border-slate-800 p-1.5 text-center text-gray-300 rounded" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-[8px] text-gray-500">Target Save</span>
                          <input type="number" min={2} max={6} value={simSave} onChange={(e) => setSimSave(parseInt(e.target.value) || 3)} className="bg-slate-900 border border-slate-800 p-1.5 text-center text-gray-300 rounded" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-[8px] text-gray-500">Target Invul</span>
                          <input type="number" min={2} max={6} value={simInvul} onChange={(e) => setSimInvul(parseInt(e.target.value) || 7)} className="bg-slate-900 border border-slate-800 p-1.5 text-center text-amber-500 rounded" />
                        </div>
                        <button
                          onClick={runCombatSimulation}
                          className="bg-amber-500 text-slate-950 font-bold font-mono text-[9px] rounded h-8 mt-4 hover:bg-amber-600 transition cursor-pointer shrink-0 col-span-3 sm:col-span-1 active:scale-95"
                        >
                          CALCULATE
                        </button>
                      </div>

                      {simResult && (
                        <div className="mt-1 bg-slate-900 border border-slate-800 p-3 rounded-lg grid grid-cols-3 gap-2 text-center font-mono">
                          <div className="flex flex-col bg-slate-950 p-1.5 rounded">
                            <span className="text-[8px] text-gray-500 font-bold">Avg Hits</span>
                            <span className="text-sm font-black text-slate-200 mt-1">{simResult.hits}</span>
                          </div>
                          <div className="flex flex-col bg-slate-950 p-1.5 rounded">
                            <span className="text-[8px] text-gray-500 font-bold">Avg Wounds</span>
                            <span className="text-sm font-black text-slate-200 mt-1">{simResult.wounds}</span>
                          </div>
                          <div className="flex flex-col bg-slate-950/60 p-1.5 rounded border border-amber-500/20">
                            <span className="text-[8px] text-amber-500 font-bold">Avg Damage</span>
                            <span className="text-sm font-black text-amber-400 mt-1">{simResult.unsaved}</span>
                          </div>
                        </div>
                      )}

                      {/* Visual Attack Loop Flowchart */}
                      <div className="border-t border-slate-900 pt-3 flex flex-col gap-2.5">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold text-slate-300 font-mono">4. Visual Attack Loop</span>
                          <span className="text-[9px] text-gray-500 font-mono">Step-by-step sequencing</span>
                        </div>

                        <div className="flex justify-between items-center bg-slate-900/60 p-1 rounded-lg border border-slate-800">
                          {["HIT", "WOUND", "SAVE", "DAMAGE"].map((st, i) => (
                            <button
                              key={st}
                              onClick={() => setActiveAttackStep(i)}
                              className={`text-[9px] px-2.5 py-1 rounded font-mono font-bold transition flex-1 cursor-pointer ${
                                activeAttackStep === i
                                  ? "bg-amber-500 text-slate-950 shadow font-black"
                                  : "text-gray-500 hover:text-gray-300"
                              }`}
                            >
                              {i + 1}. {st}
                            </button>
                          ))}
                        </div>

                        <div className="bg-slate-900/30 border border-slate-850 p-3 rounded-lg flex flex-col gap-2 text-xs font-mono leading-relaxed text-gray-300">
                          {activeAttackStep === 0 && (
                            <div className="flex flex-col gap-1.5 animate-fade-in">
                              <span className="text-[10px] text-sky-400 font-bold uppercase tracking-wider">Step 1: The Hit Roll</span>
                              <p className="text-gray-400">
                                Roll 1 D6 per Attack ({simAttacks} total attacks). Successes are rolls that equal or exceed the model's BS/WS (<strong className="text-sky-400">{simSkill}+</strong>).
                              </p>
                              <div className="bg-slate-950 p-2 rounded border border-slate-900 text-[10px] text-center flex flex-col gap-1">
                                <span className="text-gray-500">D6 Roll needed to hit:</span>
                                <span className="text-sm font-black text-sky-400">&gt;= {simSkill}+</span>
                                <span className="text-[9px] text-gray-500">Unmodified rolls of 1 always fail, 6 always succeed.</span>
                              </div>
                            </div>
                          )}

                          {activeAttackStep === 1 && (
                            <div className="flex flex-col gap-1.5 animate-fade-in">
                              <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">Step 2: The Wound Roll</span>
                              <p className="text-gray-400">
                                For each successful hit, compare Weapon Strength (<strong className="text-amber-400">{simStrength}</strong>) against Target Toughness (<strong className="text-amber-400">{simToughness}</strong>).
                              </p>
                              <div className="bg-slate-950 p-2 rounded border border-slate-900 text-[10px] text-center flex flex-col gap-1">
                                <span className="text-gray-500">Comparison math:</span>
                                <span className="text-sm font-black text-amber-400">
                                  {simStrength > simToughness * 2
                                    ? "S is more than double T (Wound on 2+)"
                                    : simStrength > simToughness
                                      ? "S is greater than T (Wound on 3+)"
                                      : simStrength === simToughness
                                        ? "S equals T (Wound on 4+)"
                                        : simStrength * 2 <= simToughness
                                          ? "S is half or less than T (Wound on 6+)"
                                          : "S is less than T (Wound on 5+)"}
                                </span>
                                <span className="text-[9px] text-gray-500 font-mono">Target roll required: {getToWoundThreshold(simStrength, simToughness)}</span>
                              </div>
                            </div>
                          )}

                          {activeAttackStep === 2 && (
                            <div className="flex flex-col gap-1.5 animate-fade-in">
                              <span className="text-[10px] text-teal-400 font-bold uppercase tracking-wider">Step 3: The Saving Throw</span>
                              <p className="text-gray-400">
                                Opponent attempts to save their wounded models. Armor Save (<strong className="text-teal-400">{simSave}+</strong>) is worsened by Weapon AP (<strong className="text-red-400">-{simAp}</strong>).
                              </p>
                              <div className="bg-slate-950 p-2 rounded border border-slate-900 text-[10px] text-center flex flex-col gap-1.5">
                                <div className="flex justify-around text-[9px] text-gray-500">
                                  <span>Adjusted Armor: <strong className="text-teal-400">{Math.min(7, simSave + simAp)}+</strong></span>
                                  <span>Invulnerable Save: <strong className="text-amber-500">{simInvul <= 6 ? `${simInvul}+` : "None"}</strong></span>
                                </div>
                                <span className="text-xs font-black text-emerald-400">
                                  Best Save used: {Math.min(simSave + simAp, simInvul) > 6 ? "No Save Allowed!" : `${Math.min(simSave + simAp, simInvul)}+`}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. CHARGE & FIGHT: Engagement Range Rule Simulator */}
                {(battlePhase === "CHARGE" || battlePhase === "FIGHT") && (
                  <div className="bg-slate-950 border border-slate-850 rounded-xl p-4 flex flex-col gap-3 animate-fade-in">
                    <div className="flex justify-between items-center border-b border-slate-900 pb-1.5">
                      <span className="text-xs font-bold text-slate-300 font-mono">2. Engagement Range Rule Simulator</span>
                      <span className="text-[10px] text-amber-500 font-mono">Interactive Ruler</span>
                    </div>
                    
                    <p className="text-xs text-gray-400">Drag the slider to adjust the distance between attacking and defending models. See if they are in Engagement Range to fight in melee!</p>

                    <div className="flex flex-col gap-3 mt-1">
                      {/* Distance Slider */}
                      <div className="flex flex-col gap-1.5">
                        <div className="flex justify-between text-xs font-mono">
                          <span className="text-gray-500">Distance Between Bases:</span>
                          <strong className="text-amber-400">{engagementDistance.toFixed(1)}" Inches</strong>
                        </div>
                        <input 
                          type="range" 
                          min={0.1} 
                          max={4.0} 
                          step={0.1} 
                          value={engagementDistance} 
                          onChange={(e) => setEngagementDistance(parseFloat(e.target.value))}
                          className="w-full accent-amber-500 bg-slate-900 rounded-lg appearance-none h-1.5 cursor-pointer"
                        />
                      </div>

                      {/* Barricade Toggle */}
                      <div className="flex items-center justify-between bg-slate-900/40 p-2.5 rounded-lg border border-slate-900 text-xs">
                        <span className="text-gray-400">Is there a Wall/Barricade between models?</span>
                        <button
                          onClick={() => setHasBarricadeBetween(!hasBarricadeBetween)}
                          className={`text-[10px] font-mono font-bold px-3 py-1 rounded transition-colors ${
                            hasBarricadeBetween 
                              ? "bg-amber-500 text-slate-950 font-black" 
                              : "bg-slate-950 text-gray-400 border border-slate-800"
                          }`}
                        >
                          {hasBarricadeBetween ? "YES, BLOCKED" : "NO, OPEN FIELD"}
                        </button>
                      </div>

                      {/* Dynamic Base 2D Simulator diagram */}
                      <div className="bg-slate-900 border border-slate-850 h-28 rounded-xl relative flex items-center justify-between px-8 overflow-hidden">
                        {/* Background Grid */}
                        <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:14px_24px]" />
                        
                        {/* Model A (Attacking Space Marine) */}
                        <div className="relative z-10 flex flex-col items-center gap-1">
                          <div className="w-10 h-10 rounded-full bg-sky-950 border-2 border-sky-400 shadow-[0_0_12px_rgba(56,189,248,0.2)] flex items-center justify-center text-xs font-black text-sky-400">
                            A
                          </div>
                          <span className="text-[8px] font-mono text-gray-500 font-bold uppercase tracking-widest">Attacker</span>
                        </div>

                        {/* Dotted Connector line showing distance */}
                        <div className="flex-1 relative mx-2 h-1 flex items-center justify-center">
                          <div 
                            className={`absolute inset-x-0 h-0.5 border-t-2 border-dashed transition-colors ${
                              (engagementDistance <= 1.0) || (hasBarricadeBetween && engagementDistance <= 2.0)
                                ? "border-emerald-500" 
                                : "border-red-500/50"
                            }`} 
                          />
                          {hasBarricadeBetween && (
                            <div className="absolute w-2 h-8 bg-amber-600/80 border border-amber-500 rounded z-20" title="Barricade wall" />
                          )}
                          <span className={`absolute bg-slate-900 px-2 py-0.5 rounded-md border text-[9px] font-mono font-bold z-30 ${
                            (engagementDistance <= 1.0) || (hasBarricadeBetween && engagementDistance <= 2.0)
                              ? "text-emerald-400 border-emerald-500/30"
                              : "text-red-400 border-red-500/20"
                          }`}>
                            {engagementDistance.toFixed(1)}"
                          </span>
                        </div>

                        {/* Model B (Defending Tyranid) */}
                        <div className="relative z-10 flex flex-col items-center gap-1">
                          <div className="w-10 h-10 rounded-full bg-red-950 border-2 border-red-400 shadow-[0_0_12px_rgba(248,113,113,0.2)] flex items-center justify-center text-xs font-black text-red-400">
                            B
                          </div>
                          <span className="text-[8px] font-mono text-gray-500 font-bold uppercase tracking-widest">Defender</span>
                        </div>
                      </div>

                      {/* Rule Verdict Display */}
                      <div className={`p-3 rounded-xl border flex flex-col gap-1 ${
                        (engagementDistance <= 1.0) || (hasBarricadeBetween && engagementDistance <= 2.0)
                          ? "bg-green-500/5 border-green-500/20 text-green-400"
                          : "bg-red-500/5 border-red-500/20 text-red-400"
                      }`}>
                        <div className="flex items-center gap-1.5 text-xs font-bold font-mono">
                          <span>●</span>
                          <span>
                            {engagementDistance <= 1.0 
                              ? "🟢 IN ENGAGEMENT RANGE (STRICT 1\" RULE)"
                              : (hasBarricadeBetween && engagementDistance <= 2.0)
                                ? "🟢 IN ENGAGEMENT RANGE (BARRICADE 2\" RULE)"
                                : "🔴 OUT OF ENGAGEMENT RANGE"}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-400 leading-relaxed font-sans">
                          {engagementDistance <= 1.0 
                            ? "Models are within 1\" of each other. They are eligible to declare and execute Melee attacks in the Fight phase, and are blockaded from making ranged attacks or standard normal moves."
                            : (hasBarricadeBetween && engagementDistance <= 2.0)
                              ? "Normally, Engagement Range is 1\". However, because there is an intervening Barricade/Pipe between the units, the 10th Edition rules expand Engagement Range to 2\". They CAN fight each other!"
                              : "Models are too far apart to strike each other in melee. The attacking unit must declare a Charge in the Charge phase, and roll high enough on 2D6 to end their move within 1\"."}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. COMMAND & BATTLESHOCK: Battle-shock Test Simulator */}
                {(battlePhase === "COMMAND" || battlePhase === "BATTLESHOCK") && (
                  <div className="bg-slate-950 border border-slate-850 rounded-xl p-4 flex flex-col gap-3 animate-fade-in">
                    <div className="flex justify-between items-center border-b border-slate-900 pb-1.5">
                      <span className="text-xs font-bold text-slate-300 font-mono">2. Battle-shock Roll Simulator</span>
                      <span className="text-[10px] text-amber-500 font-mono">Composure Checker</span>
                    </div>
                    
                    <p className="text-xs text-gray-400">Rookie field practice! Check if a battered, half-strength squad maintains their battlefield posture by rolling a Battle-shock test.</p>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] text-gray-500 font-bold font-mono">Unit Leadership (Ld)</label>
                        <select
                          value={battleshockLd}
                          onChange={(e) => setBattleshockLd(parseInt(e.target.value))}
                          className="bg-slate-900 border border-slate-800 text-xs p-2 text-center text-amber-400 rounded-lg focus:outline-none focus:border-amber-500 cursor-pointer"
                        >
                          <option value={5}>5+ (Exceptional)</option>
                          <option value={6}>6+ (Standard character)</option>
                          <option value={7}>7+ (Average Infantry)</option>
                          <option value={8}>8+ (Low Discipline)</option>
                          <option value={9}>9+ (Terrible)</option>
                        </select>
                      </div>

                      <div className="flex flex-col gap-1.5 justify-end">
                        <button
                          onClick={() => {
                            const diceCount = hasSynapseBonus ? 3 : 2;
                            const rolls = Array.from({ length: diceCount }).map(() => Math.floor(Math.random() * 6) + 1);
                            let total = rolls.reduce((a, b) => a + b, 0);
                            if (hasShadowInWarpPenalty) {
                              total = Math.max(0, total - 1); // -1 penalty
                            }
                            const passed = total >= battleshockLd;
                            setBattleshockResult({ rolls, total, passed });
                          }}
                          className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold h-9 rounded-lg font-mono active:scale-95 transition cursor-pointer"
                        >
                          TEST COMPOSURE
                        </button>
                      </div>
                    </div>

                    {/* Modifiers checklist */}
                    <div className="flex flex-col gap-2 bg-slate-900/40 p-3 rounded-lg border border-slate-900 text-xs font-mono">
                      <span className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">Recruit Modifiers</span>
                      
                      <label className="flex items-center gap-2 cursor-pointer text-gray-300">
                        <input 
                          type="checkbox"
                          checked={hasSynapseBonus}
                          onChange={() => setHasSynapseBonus(!hasSynapseBonus)}
                          className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                        />
                        <span>Tyranid Synapse Within 6" (+1 Die / Roll 3D6)</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer text-gray-300">
                        <input 
                          type="checkbox"
                          checked={hasShadowInWarpPenalty}
                          onChange={() => setHasShadowInWarpPenalty(!hasShadowInWarpPenalty)}
                          className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                        />
                        <span>Shadow in the Warp Active (-1 Penalty to Roll)</span>
                      </label>
                    </div>

                    {/* Test Results Display */}
                    {battleshockResult && (
                      <div className={`p-4 rounded-xl border flex flex-col gap-2 font-mono animate-fade-in ${
                        battleshockResult.passed 
                          ? "bg-green-500/5 border-green-500/25 text-green-400"
                          : "bg-red-500/5 border-red-500/25 text-red-400"
                      }`}>
                        <div className="flex justify-between items-center border-b border-slate-900 pb-1.5">
                          <span className="text-xs font-bold uppercase">
                            {battleshockResult.passed ? "✅ TEST PASSED!" : "⚠️ TEST FAILED! BATTLE-SHOCKED"}
                          </span>
                          <span className="text-[10px] text-gray-500">Needed {battleshockLd}+</span>
                        </div>

                        <div className="flex items-center justify-between text-xs">
                          <div className="flex gap-2">
                            <span>Dice:</span>
                            <div className="flex gap-1.5">
                              {battleshockResult.rolls.map((r, i) => (
                                <span key={i} className="bg-slate-900 border border-slate-800 text-slate-200 px-2 py-0.5 rounded font-black text-[11px]">{r}</span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <span>Total Score:</span>{" "}
                            <strong className="text-sm font-black bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-slate-100">
                              {battleshockResult.total}
                            </strong>
                          </div>
                        </div>

                        <div className="text-[11px] text-gray-400 leading-relaxed font-sans border-t border-slate-900 pt-1.5 mt-0.5">
                          {battleshockResult.passed 
                            ? "Composure held! The squad maintains its tactical posture, maintains full Objective Control (OC), and can receive stratagem orders normally."
                            : "DISCIPLINE BROKEN! Until your next Command phase: This unit's Objective Control (OC) is reduced to 0, and it CANNOT be targeted by any Stratagems (even Command Re-roll!)."}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 4. MOVEMENT: Strategic Reserves Edge Guide */}
                {battlePhase === "MOVEMENT" && (
                  <div className="bg-slate-950 border border-slate-850 rounded-xl p-4 flex flex-col gap-3 animate-fade-in">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-300 font-mono">2. Strategic Reserves Edge Guide</span>
                      <span className="text-[10px] text-gray-500 font-mono">10th Ed Rule Simulator</span>
                    </div>

                    <p className="text-xs text-gray-400">Where can reinforcement models legally enter the battlefield? Select the current Battle Round to view legal entry edges.</p>

                    {/* Round Selector Buttons */}
                    <div className="flex gap-1 p-1 bg-slate-950 rounded-xl border border-slate-900">
                      {[1, 2, 3].map(rnd => {
                        const isActive = reservesArrivalRound === rnd;
                        return (
                          <button
                            key={rnd}
                            onClick={() => setReservesArrivalRound(rnd)}
                            className={`flex-1 text-[9px] font-mono font-bold py-1.5 rounded-lg transition active:scale-98 cursor-pointer border ${
                              isActive
                                ? "bg-amber-500/10 border-amber-500/20 text-amber-300 shadow-sm"
                                : "bg-transparent border-transparent text-stone-500 hover:text-stone-300"
                            }`}
                          >
                            Round {rnd === 3 ? "3+" : rnd}
                          </button>
                        );
                      })}
                    </div>

                    {/* Interactive 2D Battlefield Diagram */}
                    <div className="bg-slate-900 border border-slate-850 h-36 rounded-xl relative p-4 flex flex-col justify-between overflow-hidden">
                      {/* Grid Lines */}
                      <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:16px_16px]" />
                      
                      {/* TOP EDGE (Enemy Board Edge) */}
                      <div className={`text-center py-1 border rounded text-[9px] font-mono font-bold relative z-10 transition-colors duration-200 ${
                        reservesArrivalRound === 1
                          ? "bg-red-950/40 border-red-900/50 text-red-400"
                          : reservesArrivalRound === 2
                            ? "bg-red-950/40 border-red-900/50 text-red-400"
                            : "bg-emerald-950/40 border-emerald-500/50 text-emerald-400"
                      }`}>
                        ⚔️ ENEMY EDGE {reservesArrivalRound === 3 ? "(Legal entry! >9\" away from enemy & within 6\" of edge)" : "(Illegal entry!)"}
                      </div>

                      {/* LEFT & RIGHT EDGES */}
                      <div className="flex justify-between items-center w-full my-2">
                        {/* Left Edge */}
                        <div className={`py-3 px-1 border rounded text-[8px] font-mono font-bold writing-mode-vertical relative z-10 text-center transition-colors duration-200 ${
                          reservesArrivalRound === 1
                            ? "bg-red-950/40 border-red-900/50 text-red-400"
                            : "bg-emerald-950/40 border-emerald-500/50 text-emerald-400"
                        }`}>
                          ◀️ LEFT EDGE
                        </div>

                        {/* Central Battlefield Objective */}
                        <div className="flex flex-col items-center justify-center bg-slate-950/80 border border-slate-800 rounded-lg p-2 max-w-[130px] text-center z-10 font-mono text-[9px]">
                          <span className="text-gray-500 font-bold">NO-MAN'S LAND</span>
                          <span className="text-[8px] text-amber-500 mt-0.5">Keep models &gt;9" away from all enemy units!</span>
                        </div>

                        {/* Right Edge */}
                        <div className={`py-3 px-1 border rounded text-[8px] font-mono font-bold writing-mode-vertical relative z-10 text-center transition-colors duration-200 ${
                          reservesArrivalRound === 1
                            ? "bg-red-950/40 border-red-900/50 text-red-400"
                            : "bg-emerald-950/40 border-emerald-500/50 text-emerald-400"
                        }`}>
                          RIGHT EDGE ▶️
                        </div>
                      </div>

                      {/* BOTTOM EDGE (Own Board Edge) */}
                      <div className={`text-center py-1 border rounded text-[9px] font-mono font-bold relative z-10 transition-colors duration-200 ${
                        reservesArrivalRound === 1
                          ? "bg-red-950/40 border-red-900/50 text-red-400"
                          : "bg-emerald-950/40 border-emerald-500/50 text-emerald-400"
                      }`}>
                        🛡️ YOUR OWN DEPLOYMENT EDGE {reservesArrivalRound === 1 ? "(Illegal entry!)" : "(Legal entry! Always safe)"}
                      </div>
                    </div>

                    {/* Rule Explanation Callout */}
                    <div className="bg-slate-900/50 border border-slate-850 p-2.5 rounded-lg text-xs font-mono text-gray-400 flex flex-col gap-1">
                      <div className="text-[9px] text-amber-400 font-black uppercase">Edge Arrival Verdict:</div>
                      <span className="text-[11px] leading-relaxed">
                        {reservesArrivalRound === 1 && "❌ Round 1: No reserves can enter the table. They must remain in orbit/strategic holding."}
                        {reservesArrivalRound === 2 && "🟢 Round 2: Models can enter from YOUR edge, or any SIDE edge (Left or Right). They cannot arrive on the enemy's edge."}
                        {reservesArrivalRound === 3 && "🌟 Round 3+: Models can enter from ANY board edge, including the enemy's board edge! This allows you to flank behind enemy lines."}
                      </span>
                      <span className="text-[10px] text-gray-500 italic mt-0.5">Note: Models entering from reserves cannot move further or charge during this turn, unless they have specific rules (e.g. Rapid Ingress in opponent's turn).</span>
                    </div>
                  </div>
                )}

                {/* 5. COMMAND & MOVEMENT: Aura Range Bubble Visualizer */}
                {(battlePhase === "COMMAND" || battlePhase === "MOVEMENT") && (
                  <div className="bg-slate-950 border border-slate-850 rounded-xl p-4 flex flex-col gap-3 animate-fade-in">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-300 font-mono">3. Aura Range Indicator</span>
                      <span className="text-[10px] text-gray-500 font-mono">Bubble Distance Visualizer</span>
                    </div>

                    <p className="text-xs text-gray-400">Select an aura radius to see how the protective/lethal bubble spreads. Ensure you measure from the base's outer rim, not the center!</p>

                    {/* Aura selector buttons */}
                    <div className="flex gap-1 p-1 bg-slate-950 rounded-xl border border-slate-900">
                      {[3, 6, 9].map(rad => {
                        const isActive = selectedAuraRadius === rad;
                        return (
                          <button
                            key={rad}
                            onClick={() => setSelectedAuraRadius(rad)}
                            className={`flex-1 text-[9px] font-mono font-bold py-1.5 rounded-lg transition active:scale-98 cursor-pointer border ${
                              isActive
                                ? "bg-amber-500/10 border-amber-500/20 text-amber-300 shadow-sm"
                                : "bg-transparent border-transparent text-stone-500 hover:text-stone-300"
                            }`}
                          >
                            {rad}" Aura
                          </button>
                        );
                      })}
                    </div>

                    {/* SVG Visual Circle representing measuring from base */}
                    <div className="bg-slate-900 border border-slate-850 h-32 rounded-xl relative flex items-center justify-center overflow-hidden">
                      {/* Outer SVG Bubble */}
                      <svg className="w-full h-full absolute inset-0 z-10" viewBox="0 0 200 200">
                        <defs>
                          <radialGradient id="auraGlow" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.2" />
                            <stop offset="85%" stopColor="#f59e0b" stopOpacity="0.05" />
                            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                          </radialGradient>
                        </defs>

                        {/* Dynamic Aura range bubble */}
                        <circle 
                          cx="100" 
                          cy="100" 
                          r={selectedAuraRadius === 3 ? 35 : selectedAuraRadius === 6 ? 65 : 90} 
                          fill="url(#auraGlow)" 
                          stroke="#f59e0b" 
                          strokeWidth="1.5" 
                          strokeDasharray="4 3" 
                          className="transition-all duration-300"
                        />

                        {/* Centered Character Base */}
                        <circle cx="100" cy="100" r="16" fill="#1e293b" stroke="#38bdf8" strokeWidth="2.5" />
                        <text x="100" y="104" textAnchor="middle" fill="#38bdf8" fontSize="9" fontWeight="bold" fontFamily="monospace">CDR</text>

                        {/* Model B within range */}
                        <circle cx="135" cy="115" r="10" fill="#1e293b" stroke="#10b981" strokeWidth="2" />
                        <text x="135" y="118" textAnchor="middle" fill="#10b981" fontSize="7" fontWeight="bold" fontFamily="monospace">IN</text>

                        {/* Model C outside range */}
                        <circle cx="178" cy="65" r="10" fill="#1e293b" stroke="#ef4444" strokeWidth="2" />
                        <text x="178" y="68" textAnchor="middle" fill="#ef4444" fontSize="7" fontWeight="bold" fontFamily="monospace">OUT</text>

                        {/* Measuring Arrow */}
                        <line 
                          x1="116" 
                          y1="100" 
                          x2={selectedAuraRadius === 3 ? 135 : selectedAuraRadius === 6 ? 165 : 190} 
                          y2="100" 
                          stroke="#f59e0b" 
                          strokeWidth="1" 
                        />
                        <text 
                          x={selectedAuraRadius === 3 ? 125 : selectedAuraRadius === 6 ? 140 : 155} 
                          y="94" 
                          fill="#f59e0b" 
                          fontSize="8" 
                          fontWeight="bold" 
                          fontFamily="monospace"
                        >
                          {selectedAuraRadius}"
                        </text>
                      </svg>

                      {/* Text explanations overlaying left */}
                      <div className="absolute bottom-2 left-3 z-20 font-mono text-[9px] text-gray-500">
                        <div>🔘 Commander base (40mm)</div>
                        <div>🟢 Model IN: base intersects bubble</div>
                        <div className="text-amber-400">⚡ Measuring starts from base RIM!</div>
                      </div>
                    </div>

                    {/* Pro tip callout */}
                    <div className="bg-slate-900/50 p-2.5 rounded-lg text-xs text-gray-400 leading-relaxed border border-slate-850">
                      <strong className="text-amber-400 font-mono text-[10px] block uppercase">Aura Command Rule:</strong>
                      <span>A unit gains an Aura's benefits as long as at least <strong className="text-slate-200">one model</strong> in that unit is within the specified aura distance. Keep the squad leader in the bubble to protect the whole unit!</span>
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* PRE-FLIGHT CHECKLIST & MEASUREMENT CONVERTER (Features 3 & 9) */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col gap-4">
              <h3 className="text-sm font-bold text-slate-100 border-b border-slate-800 pb-2 font-mono uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <ClipboardCheck className="w-4 h-4 text-amber-500" />
                <span>Rookie Flight Controls</span>
              </h3>

              {/* Sub-tool 8: Pre-Flight Match Checklist */}
              <div className="bg-slate-950 border border-slate-850 rounded-xl p-4 flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-300 font-mono">8. First Game Quick-Ref Card</span>
                  <span className="text-[10px] text-gray-500 font-mono">Pre-Flight Checklist</span>
                </div>

                <p className="text-xs text-gray-400">Avoid forgetting vital setup tasks! Complete these six critical checkmarks before rolling for the first turn.</p>

                {/* Interactive checklist block */}
                <div className="flex flex-col gap-2">
                  {[
                    { id: "warlord", title: "Declare Warlord", desc: "Select one Character model as your supreme commander." },
                    { id: "leaderAttach", title: "Attach Leaders to Squads", desc: "Form bodyguard unions (e.g. Captain joins Intercessors)." },
                    { id: "reservesDeclare", title: "Declare Strategic Reserves", desc: "Note which units start off-table (Max 25% of army points)." },
                    { id: "enhancements", title: "Assign Enhancements", desc: "Record unique point upgrades given to non-Warlord Characters." },
                    { id: "objPlaced", title: "Verify Objective Marker Widths", desc: "Markers must be exactly 40mm wide (approx. 1.57 inches)." },
                    { id: "refReady", title: "Verify Rules Sage is Open", desc: "Keep our Rules Sage chat loaded for fast tactical queries." }
                  ].map(chk => {
                    const isChecked = preflightChecklist[chk.id];
                    const toggleCheck = () => {
                      setPreflightChecklist({
                        ...preflightChecklist,
                        [chk.id]: !isChecked
                      });
                    };

                    return (
                      <div 
                        key={chk.id}
                        onClick={toggleCheck}
                        className={`p-3 rounded-lg border transition duration-150 cursor-pointer flex gap-3 select-none ${
                          isChecked 
                            ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-300" 
                            : "bg-slate-900/60 border-slate-850 text-gray-400 hover:border-slate-800"
                        }`}
                      >
                        <input 
                          type="checkbox"
                          checked={isChecked}
                          readOnly
                          className="w-4 h-4 accent-emerald-500 shrink-0 self-start mt-0.5 pointer-events-none"
                        />
                        <div className="flex flex-col gap-0.5">
                          <strong className={`text-xs font-mono font-bold ${isChecked ? "text-emerald-400" : "text-slate-300"}`}>{chk.title}</strong>
                          <span className="text-[10px] text-gray-500 leading-relaxed">{chk.desc}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Sub-tool 9: Measurement Converter & Metric Assistant */}
              <div className="bg-slate-950 border border-slate-850 rounded-xl p-4 flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-300 font-mono">9. Metric Measurement Converter</span>
                  <span className="text-[10px] text-gray-500 font-mono">Inches to Centimeters (cm)</span>
                </div>

                <p className="text-xs text-gray-400">Warhammer rulebooks use Imperial Inches ("), but some country rulers use Metric Centimeters (cm). Convert here instantly!</p>

                <div className="flex items-center gap-3">
                  <div className="flex flex-col gap-1.5 flex-1 font-mono">
                    <label className="text-[9px] text-gray-500 font-bold uppercase">Inches (")</label>
                    <input 
                      type="number"
                      min={0.5}
                      max={72}
                      step={0.5}
                      value={measurementInches}
                      onChange={(e) => setMeasurementInches(parseFloat(e.target.value) || 1)}
                      className="bg-slate-900 border border-slate-800 rounded-lg text-xs p-2 text-center text-amber-400 focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5 flex-1 font-mono">
                    <label className="text-[9px] text-gray-500 font-bold uppercase">Metric (cm)</label>
                    <div className="bg-slate-900 border border-slate-850 rounded-lg text-xs p-2 text-center text-slate-200 font-black">
                      {(measurementInches * 2.54).toFixed(1)} cm
                    </div>
                  </div>
                </div>

                {/* Quick Convert Common Ruler guide */}
                <div className="grid grid-cols-3 gap-2 text-center font-mono text-[9px] text-gray-500 mt-1">
                  <div className="bg-slate-900 p-2 rounded border border-slate-850 flex flex-col gap-0.5">
                    <span className="text-slate-300 font-bold">1" Melee</span>
                    <span>2.5 cm</span>
                  </div>
                  <div className="bg-slate-900 p-2 rounded border border-slate-850 flex flex-col gap-0.5">
                    <span className="text-slate-300 font-bold">6" Move</span>
                    <span>15.2 cm</span>
                  </div>
                  <div className="bg-slate-900 p-2 rounded border border-slate-850 flex flex-col gap-0.5">
                    <span className="text-slate-300 font-bold">9" Reserves</span>
                    <span>22.8 cm</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* STEP 3: MATCH CLEANUP CHECKLIST */}
      {activeStep === "cleanup" && (
        <div className="max-w-3xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg flex flex-col gap-5 text-center" id="cleanup-step-view">
          <Trophy className="w-12 h-12 text-amber-400 mx-auto animate-bounce mt-2" />
          
          <div>
            <h2 className="text-xl font-bold text-slate-100">Battle Resolved! Match Cleanup Checklist</h2>
            <p className="text-xs text-gray-500 font-mono uppercase tracking-widest mt-1">THE SCARS OF WAR</p>
          </div>

          {/* Winner announcement */}
          <div className="bg-slate-950 border border-slate-850 rounded-xl p-5 flex flex-col gap-2 font-mono max-w-lg mx-auto w-full">
            <span className="text-xs text-gray-400 font-bold">Match Summary Result</span>
            <div className="text-lg font-black text-amber-400 mt-1">
              {p1Vp === p2Vp ? (
                <span>Tactical Stalemate! The match ended in a draw ({p1Vp} vs {p2Vp})</span>
              ) : p1Vp > p2Vp ? (
                <span>Victor: {p1Name.split(" ")[0]} ({p1Faction}) wins the field!</span>
              ) : (
                <span>Victor: {p2Name.split(" ")[0]} ({p2Faction}) wins the field!</span>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">Final Score: {p1Vp} VP to {p2Vp} VP</p>
          </div>

          <div className="text-left flex flex-col gap-3 max-w-lg mx-auto w-full mt-2" id="cleanup-checklist-container">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest font-mono border-b border-slate-800 pb-1">Table Clearance Tasks</span>
            
            <div className="flex gap-3 bg-slate-950 p-3 rounded-lg border border-slate-850 text-xs text-gray-400">
              <input type="checkbox" className="w-4 h-4 accent-amber-500 shrink-0 cursor-pointer" />
              <span><strong>Shake Hands:</strong> Thank your opponent for a great game of Warhammer 40k. Sportsmanship is key.</span>
            </div>

            <div className="flex gap-3 bg-slate-950 p-3 rounded-lg border border-slate-850 text-xs text-gray-400">
              <input type="checkbox" className="w-4 h-4 accent-amber-500 shrink-0 cursor-pointer" />
              <span><strong>Verify Miniatures Count:</strong> Count all models in your roster before putting them in transport bags. Plastic and resin pieces can blend into terrain!</span>
            </div>

            <div className="flex gap-3 bg-slate-950 p-3 rounded-lg border border-slate-850 text-xs text-gray-400">
              <input type="checkbox" className="w-4 h-4 accent-amber-500 shrink-0 cursor-pointer" />
              <span><strong>Package Fragile Models:</strong> Store delicate miniatures (e.g., characters with long spears, antennas, or heavy vehicles) securely in foam inserts or magnetized bins first.</span>
            </div>

            <div className="flex gap-3 bg-slate-950 p-3 rounded-lg border border-slate-850 text-xs text-gray-400">
              <input type="checkbox" className="w-4 h-4 accent-amber-500 shrink-0 cursor-pointer" />
              <span><strong>Gather Dice & Measures:</strong> Retrieve all rolling dice, tape measures, objective markers, and stratagem markers scatter across the gaming tables.</span>
            </div>

            <div className="flex gap-3 bg-slate-950 p-3 rounded-lg border border-slate-850 text-xs text-gray-400">
              <input type="checkbox" className="w-4 h-4 accent-amber-500 shrink-0 cursor-pointer" />
              <span><strong>Clear Scenery & Terrain:</strong> Pack away ruins, hills, and buildings in their corresponding gaming store/home containers. Clean up any loose cardboard or scraps.</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
