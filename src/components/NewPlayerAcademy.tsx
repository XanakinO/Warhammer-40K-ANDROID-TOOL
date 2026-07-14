/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import {
  BookOpen,
  Dices,
  Shield,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Zap,
  TrendingUp,
  Skull,
  Search,
  Plus,
  Minus,
  Check,
  RefreshCw,
  Award,
  ChevronRight,
  ChevronLeft,
  Swords
} from "lucide-react";

// Types
interface GlossaryItem {
  term: string;
  definition: string;
  example: string;
  category: "Weapons" | "Movement" | "Saves" | "Abilities";
}

const GLOSSARY_ITEMS: GlossaryItem[] = [
  {
    term: "Feel No Pain (FNP)",
    definition: "An extra defensive roll made after a saving throw fails. For each point of damage inflicted, roll a D6. On a specified roll (e.g., 5+), that damage point is ignored.",
    example: "A Space Marine with FNP 5+ takes a 3-damage attack. He rolls 3 dice: 5, 2, 6. He ignores 2 damage and only suffers 1.",
    category: "Saves"
  },
  {
    term: "Deep Strike",
    definition: "Allows a unit to start in Reserves and deploy anywhere on the battlefield during the Reinforcements step of your Movement Phase, as long as it is more than 9 inches away from enemy models.",
    example: "Terminators teleporting into the enemy backline to capture an objective or secure a flank.",
    category: "Movement"
  },
  {
    term: "Devastating Wounds",
    definition: "A critical wound roll (typically a unmodified 6) ignores all saving throws of any kind, including Armor and Invulnerable saves, inflicting damage directly.",
    example: "A weapon with Devastating Wounds rolls a 6 to wound. The target cannot roll any armor or invulnerable save; they must allocate the damage immediately.",
    category: "Weapons"
  },
  {
    term: "Sustained Hits",
    definition: "A critical hit roll (usually an unmodified 6) scores additional hits. Sustained Hits 1 scores 1 extra hit, Sustained Hits 2 scores 2 extra, etc.",
    example: "Rolling 5 shots, rolling a '6' with Sustained Hits 1 counts as 2 hits instead of just 1.",
    category: "Weapons"
  },
  {
    term: "Lethal Hits",
    definition: "A critical hit roll (usually an unmodified 6) automatically wounds the target. You skip the wound roll entirely and go straight to the opponent's saving throws.",
    example: "Shooting a high-toughness Tank with bolters. A critical hit automatically wounds, bypassing the need to roll a 6 to wound.",
    category: "Weapons"
  },
  {
    term: "Lone Operative",
    definition: "A model that cannot be targeted by ranged attacks from more than 12 inches away, protecting key characters or scouts in the open field.",
    example: "An assassin or sniper standing on top of a tower cannot be shot by enemy tanks across the board.",
    category: "Abilities"
  },
  {
    term: "Rapid Ingress",
    definition: "A strategic stratagem (costing 1 CP) that allows you to set up a unit from Strategic Reserves or Deep Strike during your opponent's Movement Phase instead of your own.",
    example: "Bringing in melee squads right after your opponent finishes moving, allowing you to charge them on your next turn.",
    category: "Movement"
  },
  {
    term: "Infiltrators",
    definition: "Allows a unit to deploy anywhere on the board before the first turn begins, as long as they are more than 9 inches away from the enemy's deployment zone and enemy models.",
    example: "Deploying Scout squads on mid-board objectives before any turn starts to claim early victory points.",
    category: "Movement"
  },
  {
    term: "Stealth",
    definition: "Subtract 1 from all hit rolls made against this unit by ranged attacks, representing cover, camouflage, or light-bending fields.",
    example: "Enemy shooting at your stealthy rangers hits on a 4+ instead of their standard 3+.",
    category: "Abilities"
  },
  {
    term: "Hazardous",
    definition: "Weapons representing unstable plasma or overcharged warp energy. After a unit shoots/fights with Hazardous weapons, you roll a D6 for each weapon used. On a 1, a model suffers 3 mortal wounds or is destroyed.",
    example: "Overcharging plasma guns for extra strength. Rolling a '1' on the hazardous check causes a model in the squad to perish.",
    category: "Weapons"
  }
];

const PHASE_GUIDES = [
  {
    name: "Command Phase",
    intent: "Gather Command Points (CP) and verify your army's battlefield morale.",
    checklist: [
      "Both players gain 1 CP automatically at the start of the Command Phase.",
      "Score Primary Mission Victory Points (VP) if applicable (starting from Battle Round 2).",
      "Perform Battle-shock tests for any of your units that are Below Half-Strength (less than 50% models remaining, or less than 50% wounds remaining for single models).",
      "Resolve any command-phase abilities (e.g., Space Marine Oath of Moment selection)."
    ],
    tip: "Don't forget Battle-shock! Being Battle-shocked sets a unit's Objective Control (OC) to 0 and blocks them from receiving Stratagems, meaning they cannot capture objectives."
  },
  {
    name: "Movement Phase",
    intent: "Reposition your forces to claim objectives, gain cover, or prepare charges.",
    checklist: [
      "Move units using Normal Move, Advance (adds D6 inches), or Fall Back (escaping melee).",
      "Check Unit Coherency: Models must stay within 2 inches horizontally and 5 inches vertically of another model in their unit.",
      "Bring in Reinforcements / Deep Strike units during the Reinforcements step at the end of the phase.",
      "Ensure no normal or advanced move takes you within 1 inch of enemy models (Engagement Range)."
    ],
    tip: "Advancing prevents a unit from shooting or charging later in the turn, unless they have special rules like 'Assault' weapons or 'Fleet of Foot' charges."
  },
  {
    name: "Shooting Phase",
    intent: "Unleash ranged weapons to thin enemy ranks from a safe distance.",
    checklist: [
      "Select an eligible unit to shoot. To shoot, a unit must have ranged weapons and cannot have Advanced or Fallen Back (unless special rules apply).",
      "Declare ALL targets for ALL weapons in the unit BEFORE rolling any dice.",
      "Verify Line of Sight and weapon Range to each targeted enemy unit.",
      "Resolve attacks: Roll to Hit (WS/BS), Roll to Wound (S vs T), Allocate Wounds, roll Saves, apply Damage."
    ],
    tip: "Always declare all your weapon targets at once. If you split a squad's fire, you must specify which guns shoot where before seeing the outcome of the first rolls!"
  },
  {
    name: "Charge Phase",
    intent: "Launch units into brutal close-combat engagement.",
    checklist: [
      "Select an eligible unit within 12 inches of an enemy unit. Units that Advanced, Fallen Back, or are already in engagement range are ineligible.",
      "Roll 2D6 for the Charge Distance.",
      "Verify if the roll is sufficient: To succeed, the charge move must end with the charging unit within Engagement Range (1 inch) of all targeted enemy units.",
      "Move charging models. The first model moved must end in base-to-base contact if possible."
    ],
    tip: "If a charge roll fails by even 1 inch, no models move at all! It is a 'failed charge' and the unit remains in place."
  },
  {
    name: "Fight Phase",
    intent: "Resolve close-quarters melee combat between engaged units.",
    checklist: [
      "Determine Fight Order: 1. Units with 'Fights First' (including charging units), alternating starting with the defender. 2. Remaining units, alternating starting with the defender.",
      "For each unit, Pile In up to 3 inches to maximize base contact.",
      "Resolve Melee Attacks using weapon profiles (Hit, Wound, Save, Damage).",
      "Consolidate up to 3 inches to get closer to the nearest enemy unit or objective."
    ],
    tip: "Charging gives your units 'Fights First' for that turn, meaning they will strike before regular defender units get to swing, unless the defender also has a 'Fights First' rule!"
  }
];

const CORE_STRATAGEMS = [
  {
    name: "Command Re-roll",
    cost: "1 CP",
    phase: "Any Phase",
    effect: "Re-roll a Hit roll, Wound roll, Damage roll, Saving throw, Advance roll, Charge roll, Battle-shock test, or Command Check.",
    tip: "Save your CP for crucial saves on expensive centerpiece models, or that one game-winning charge roll!"
  },
  {
    name: "Fire Overwatch",
    cost: "1 CP",
    phase: "Opponent's Move/Charge",
    effect: "Shoot with an eligible unit as if it were your shooting phase. Hits are ONLY scored on unmodified 6s, unless using weapons with Torrent (automatic hits).",
    tip: "Fires Overwatch is devastating when used with Torrent (flamer) weapons because they ignore the penalty and hit automatically!"
  },
  {
    name: "Go to Ground",
    cost: "1 CP",
    phase: "Opponent's Shooting",
    effect: "Gives an Infantry unit a 6+ Invulnerable Save and the Benefit of Cover (+1 to normal save rolls) for the rest of the phase.",
    tip: "Use this to protect light scouts or fragile Battleline squads caught out in the open."
  },
  {
    name: "Counter-Offensive",
    cost: "2 CP",
    phase: "Fight Phase",
    effect: "Interrupt the regular fight sequence. Right after an opponent's unit finishes fighting, select one of your eligible units to fight next.",
    tip: "Expensive but vital if your opponent charged you with multiple heavy units and you want to strike back before they wipe you out."
  },
  {
    name: "Insane Bravery",
    cost: "1 CP",
    phase: "Command Phase (Battle-shock step)",
    effect: "Use immediately before rolling a Battle-shock test for a unit. That unit automatically passes without rolling. (Note: Can only be used once per battle).",
    tip: "Use this on a crucial unit holding a game-winning objective to guarantee they do not lose OC."
  },
  {
    name: "Smokescreen",
    cost: "1 CP",
    phase: "Opponent's Shooting",
    effect: "Select one of your units with the SMOKE keyword. That unit gains Stealth (-1 to be hit) and Benefit of Cover (+1 to save) for the rest of the phase.",
    tip: "Perfect for protecting transports or tanks from heavy anti-armor fire."
  }
];

const PITFALLS = [
  {
    title: "Measuring From Hulls vs Bases",
    problem: "Measuring distance from weapon barrels or tank treads instead of bases.",
    solution: "Always measure distance from base-to-base. For vehicles without bases, measure from the closest part of the vehicle hull instead."
  },
  {
    title: "Splitting Fire Target Pitfall",
    problem: "Rolling dice for one weapon, seeing if the target dies, then deciding where to shoot other weapons in the same unit.",
    solution: "You must declare all targets for all models in a unit before rolling any dice. If the first weapon kills the target, any remaining weapons declared against that target are wasted!"
  },
  {
    title: "Engagement Range Blockades",
    problem: "Attempting to move through or past enemy units within 1 inch.",
    solution: "You cannot move within 1 inch of an enemy model during a Normal or Advanced move. To get past them, you must either charge them, destroy them, or Fall Back."
  },
  {
    title: "Invulnerable Saves vs AP",
    problem: "Applying Armor Penetration (AP) to an Invulnerable Save.",
    solution: "AP never reduces an Invulnerable Save (written as e.g., 4++). Always compare your modified normal Save (Save + AP + Cover) against your Invulnerable Save, and roll the better one."
  },
  {
    title: "Mortal Wounds 'Carry Over'",
    problem: "Thinking a 3-damage Mortal Wound attack only kills a 1-wound model and waste the rest.",
    solution: "Unlike normal wounds, Mortal Wounds carry over between models in a squad. If a unit suffers 3 Mortal Wounds, you must apply them one-by-one, potentially destroying three 1-wound models!"
  }
];

export default function NewPlayerAcademy() {
  // Navigation internal state
  const [activeSubTab, setActiveSubTab] = useState<"basics" | "math" | "quiz">("basics");

  // 1. Playstyle Quiz State
  const [quizStep, setQuizStep] = useState<number>(-1); // -1 = start screen
  const [quizAnswers, setQuizAnswers] = useState<string[]>([]);
  const [quizResult, setQuizResult] = useState<string | null>(null);

  // 2. Strength vs Toughness Matrix State
  const [matrixS, setMatrixS] = useState<number>(4);
  const [matrixT, setMatrixT] = useState<number>(4);

  // 3. Battle-shock simulator state
  const [bsLd, setBsLd] = useState<number>(7);
  const [bsRoll, setBsRoll] = useState<{ d1: number; d2: number; total: number } | null>(null);
  const [bsStatus, setBsStatus] = useState<"idle" | "success" | "fail">("idle");
  const [isRollingBS, setIsRollingBS] = useState<boolean>(false);

  // 4. AP Save State
  const [saveSv, setSaveSv] = useState<number>(3);
  const [saveAP, setSaveAP] = useState<number>(-1);
  const [saveCover, setSaveCover] = useState<boolean>(false);
  const [saveInv, setSaveInv] = useState<boolean>(false);
  const [saveInvVal, setSaveInvVal] = useState<number>(4);

  // 5. Turn timeline phase state
  const [selectedPhase, setSelectedPhase] = useState<number>(0);
  const [phaseChecklist, setPhaseChecklist] = useState<{ [key: string]: boolean }>({});

  // 6. Glossary State
  const [glossarySearch, setGlossarySearch] = useState<string>("");
  const [selectedGlossaryCategory, setSelectedGlossaryCategory] = useState<string>("All");

  // 7. Interactive Dice Probability Calculator State
  const [calcAttacks, setCalcAttacks] = useState<number>(10);
  const [calcBS, setCalcBS] = useState<number>(3);
  const [calcS, setCalcS] = useState<number>(4);
  const [calcT, setCalcT] = useState<number>(4);
  const [calcAP, setCalcAP] = useState<number>(-1);
  const [calcSv, setCalcSv] = useState<number>(3);
  const [calcInv, setCalcInv] = useState<number>(7); // 7 means "None"

  // 8. Onscreen Rookie Guides setting (local state simulating global HUD toggle)
  const [hudActive, setHudActive] = useState<boolean>(() => {
    return localStorage.getItem("rookie_hud_enabled") === "true";
  });

  const toggleHud = () => {
    const newState = !hudActive;
    setHudActive(newState);
    localStorage.setItem("rookie_hud_enabled", String(newState));
    // Trigger global event for components to listen
    window.dispatchEvent(new Event("rookie_hud_changed"));
  };

  // Combat Sequence click-through state
  const [combatStep, setCombatStep] = useState<number>(0);
  const combatSteps = [
    {
      title: "1. Select Eligible Unit",
      description: "Pick a squad that hasn't shot yet. It cannot have Advanced or Fallen Back unless it has special rules."
    },
    {
      title: "2. Choose Targets",
      description: "Declare which enemy units each weapon in your squad will fire at. They must be in Range and within Line of Sight."
    },
    {
      title: "3. Choose Weapon Profile",
      description: "If a weapon has multiple firing profiles (like overcharging plasma), choose which profile you are using before rolling."
    },
    {
      title: "4. Roll To Hit",
      description: "Roll 1D6 for each attack. Compare to your Ballistic Skill (ranged) or Weapon Skill (melee). Hits equal to or higher than the skill succeed. A 1 always fails; a 6 always hits."
    },
    {
      title: "5. Roll To Wound",
      description: "Compare your weapon Strength (S) to the target's Toughness (T) on the wound matrix to find the required roll. Roll 1D6 for each hit."
    },
    {
      title: "6. Allocate Wound",
      description: "The defender decides which model in their targeted unit takes the hit. Wounds must go to already-damaged models first."
    },
    {
      title: "7. Saving Throw",
      description: "The defender rolls 1D6. AP subtracts from their Armor Save. Benefits of cover add +1 to their roll. If they have an Invulnerable Save, they can use it instead to ignore AP."
    },
    {
      title: "8. Inflict Damage",
      description: "Each failed save inflicts the weapon's Damage value. If the target has 'Feel No Pain', roll to ignore individual damage points. Destroyed models are removed!"
    }
  ];

  // Quiz Questions array
  const quizQuestions = [
    {
      text: "What is your preferred method of warfare?",
      options: [
        { label: "Hold the line and unleash heavy firepower", code: "shoot" },
        { label: "Charge headfirst into glorious hand-to-hand combat", code: "melee" },
        { label: "Strike swiftly and disappear back into the shadows", code: "tactical" },
        { label: "Overwhelm the board with a tide of endless bodies", code: "swarm" }
      ]
    },
    {
      text: "Which aesthetic appeals to you the most?",
      options: [
        { label: "Stoic, armored galactic defenders", code: "marines" },
        { label: "Ancient, self-repairing cybernetic metal legions", code: "necrons" },
        { label: "A hive-mind of voracious, bio-engineered predators", code: "tyranids" },
        { label: "Elegant, high-tech space elves with fate-manipulating abilities", code: "aeldari" }
      ]
    },
    {
      text: "How do you want your units to react to taking heavy damage?",
      options: [
        { label: "Fight harder and shrug it off with pure discipline", code: "marines" },
        { label: "Literally stand back up and regenerate lost combatants", code: "necrons" },
        { label: "Sacrifice small beasts to protect the giant monsters", code: "tyranids" },
        { label: "Use predictive foresight to avoid getting hit in the first place", code: "aeldari" }
      ]
    },
    {
      text: "What style of army management sounds most fun?",
      options: [
        { label: "An adaptable toolkit with a solution for every threat", code: "marines" },
        { label: "Slow, unstoppable, crushing marches of firepower", code: "necrons" },
        { label: "Controlling the board with massive swarms and terrifying beasts", code: "tyranids" },
        { label: "Fast glass-cannons that roll special 'Fate' dice to secure key results", code: "aeldari" }
      ]
    }
  ];

  const handleQuizAnswer = (code: string) => {
    const updated = [...quizAnswers, code];
    setQuizAnswers(updated);
    
    if (updated.length < quizQuestions.length) {
      setQuizStep(quizStep + 1);
    } else {
      // Calculate outcome
      const counts: { [key: string]: number } = { marines: 0, necrons: 0, tyranids: 0, aeldari: 0 };
      updated.forEach(ans => {
        if (ans === "shoot" || ans === "necrons") counts.necrons += 1.5;
        if (ans === "melee" || ans === "marines") counts.marines += 1.5;
        if (ans === "tactical" || ans === "aeldari") counts.aeldari += 1.5;
        if (ans === "swarm" || ans === "tyranids") counts.tyranids += 1.5;
      });

      let winner = "marines";
      let maxScore = 0;
      Object.keys(counts).forEach(key => {
        if (counts[key] > maxScore) {
          maxScore = counts[key];
          winner = key;
        }
      });

      setQuizResult(winner);
      setQuizStep(quizQuestions.length);
    }
  };

  const restartQuiz = () => {
    setQuizStep(-1);
    setQuizAnswers([]);
    setQuizResult(null);
  };

  // Helper calculation for Wound roll required
  const getWoundRoll = (s: number, t: number): { roll: number; desc: string } => {
    if (s >= t * 2) return { roll: 2, desc: "Strength is double or more Toughness" };
    if (s > t) return { roll: 3, desc: "Strength is greater than Toughness" };
    if (s === t) return { roll: 4, desc: "Strength is equal to Toughness" };
    if (s <= t / 2) return { roll: 6, desc: "Strength is half or less Toughness" };
    return { roll: 5, desc: "Strength is less than Toughness" };
  };

  // Roll Battle-shock Test
  const rollBattleShock = () => {
    if (isRollingBS) return;
    setIsRollingBS(true);
    setBsRoll(null);
    setBsStatus("idle");

    setTimeout(() => {
      const d1 = Math.floor(Math.random() * 6) + 1;
      const d2 = Math.floor(Math.random() * 6) + 1;
      const total = d1 + d2;
      setBsRoll({ d1, d2, total });
      setBsStatus(total >= bsLd ? "success" : "fail");
      setIsRollingBS(false);
    }, 600);
  };

  // Final Save calculation after AP and cover
  const getModifiedSave = (): { finalRoll: number; isInvUsed: boolean } => {
    let rawSave = saveSv;
    let modifier = saveAP; // e.g., -1
    
    // Cover adds +1 to the save (which is equivalent to subtracting 1 from the armor roll, 
    // or reducing AP by 1. For example, AP-1 in cover behaves like AP-0).
    // In 40k, a cover bonus cannot improve a 3+ save against an AP-0 attack.
    if (saveCover) {
      if (!(rawSave === 3 && modifier === 0) && !(rawSave === 2 && modifier === 0)) {
        modifier += 1;
      }
    }

    const modifiedSave = Math.min(6, Math.max(2, rawSave - modifier));
    
    if (saveInv && saveInvVal < modifiedSave) {
      return { finalRoll: saveInvVal, isInvUsed: true };
    }
    
    return { finalRoll: modifiedSave, isInvUsed: false };
  };

  // Probability Calculator Mathematics
  const getProbabilityMath = () => {
    const bsProbability = (7 - calcBS) / 6;
    const hits = calcAttacks * bsProbability;
    
    let woundChance = 0.5;
    if (calcS >= calcT * 2) woundChance = 5/6;
    else if (calcS > calcT) woundChance = 4/6;
    else if (calcS === calcT) woundChance = 3/6;
    else if (calcS <= calcT / 2) woundChance = 1/6;
    else woundChance = 2/6;

    const wounds = hits * woundChance;

    let modifiedSave = calcSv - calcAP; // e.g., 3 - (-2) = 5
    if (calcInv !== 7 && calcInv < modifiedSave) {
      modifiedSave = calcInv;
    }
    modifiedSave = Math.max(2, Math.min(7, modifiedSave));

    const saveSuccessChance = modifiedSave >= 7 ? 0 : (7 - modifiedSave) / 6;
    const failedSaves = wounds * (1 - saveSuccessChance);

    return {
      hits: hits.toFixed(2),
      wounds: wounds.toFixed(2),
      failedSaves: failedSaves.toFixed(2),
      percentHits: (bsProbability * 100).toFixed(0),
      percentWounds: (woundChance * 100).toFixed(0),
      percentSaves: (saveSuccessChance * 100).toFixed(0),
      saveNeeded: modifiedSave >= 7 ? "No Save Allowed" : `${modifiedSave}+`
    };
  };

  const probResults = getProbabilityMath();

  const filteredGlossary = GLOSSARY_ITEMS.filter(item => {
    const matchesSearch = item.term.toLowerCase().includes(glossarySearch.toLowerCase()) || 
                          item.definition.toLowerCase().includes(glossarySearch.toLowerCase());
    const matchesCat = selectedGlossaryCategory === "All" || item.category === selectedGlossaryCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="new-player-academy-root">
      
      {/* 10. The Global Rookie HUD Setting Box */}
      <div className="lg:col-span-12 bg-grim-card border border-amber-600/30 p-4 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl" id="academy-hud-panel">
        <div className="flex items-start gap-3">
          <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-lg shrink-0">
            <Zap className="w-5 h-5 text-amber-500 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-stone-100 uppercase tracking-widest font-display">Rookie Strategist HUD Protocol</h3>
            <p className="text-xs text-stone-400 mt-0.5">Toggle live guidance tooltips and helpful notifications across the army builder and battle rounds screens.</p>
          </div>
        </div>
        <button
          id="rookie-hud-toggle"
          onClick={toggleHud}
          className={`px-5 py-2.5 rounded-lg text-xs font-black tracking-widest uppercase transition-all duration-300 flex items-center gap-2 cursor-pointer ${
            hudActive 
              ? "bg-amber-500 text-slate-950 border border-amber-400 shadow-md shadow-amber-500/15 font-bold" 
              : "bg-grim-dark border border-grim-border text-stone-400 hover:text-stone-200"
          }`}
        >
          {hudActive ? <Check className="w-4 h-4 text-slate-950" /> : <div className="w-4 h-4 rounded-full border border-stone-500" />}
          <span>{hudActive ? "HUD GUIDES: ENABLED" : "HUD GUIDES: DISABLED"}</span>
        </button>
      </div>

      {/* Main Left Column: Navigation Tabs & Selected Tool */}
      <div className="lg:col-span-8 flex flex-col gap-6" id="academy-main-content">
        
        {/* Sub-tabs Selection */}
        <div className="flex bg-grim-card border border-grim-border p-1 rounded-xl" id="academy-subtabs">
          <button
            id="subtab-basics"
            onClick={() => setActiveSubTab("basics")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition font-display tracking-wider ${
              activeSubTab === "basics"
                ? "bg-amber-500/15 border border-amber-500/20 text-amber-400"
                : "text-stone-400 hover:text-stone-200"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Tactical Core Guides</span>
          </button>
          
          <button
            id="subtab-math"
            onClick={() => setActiveSubTab("math")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition font-display tracking-wider ${
              activeSubTab === "math"
                ? "bg-amber-500/15 border border-amber-500/20 text-amber-400"
                : "text-stone-400 hover:text-stone-200"
            }`}
          >
            <Dices className="w-3.5 h-3.5" />
            <span>Combat Simulators</span>
          </button>

          <button
            id="subtab-quiz"
            onClick={() => setActiveSubTab("quiz")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition font-display tracking-wider ${
              activeSubTab === "quiz"
                ? "bg-amber-500/15 border border-amber-500/20 text-amber-400"
                : "text-stone-400 hover:text-stone-200"
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Playstyle Finder</span>
          </button>
        </div>

        {/* 1. Tactical Core Guides Section */}
        {activeSubTab === "basics" && (
          <div className="flex flex-col gap-6" id="academy-basics-view">
            
            {/* 3. Turn Phase Progression Guide */}
            <div className="bg-grim-card border border-grim-border rounded-xl shadow-xl p-5" id="phase-progression-guide">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-amber-500" />
                <h3 className="text-sm font-bold uppercase tracking-widest text-stone-100 font-display">The 5 Battle Round Phases</h3>
              </div>
              
              {/* Phase Navigation Bubbles */}
              <div className="flex flex-wrap gap-1.5 bg-black/30 p-1 rounded-xl mb-4" id="phase-timeline-nav">
                {PHASE_GUIDES.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedPhase(idx)}
                    className={`flex-1 min-w-[90px] text-[10px] font-mono tracking-wider uppercase py-2 px-1.5 rounded-lg transition text-center cursor-pointer ${
                      selectedPhase === idx
                        ? "bg-amber-500 text-slate-950 font-bold"
                        : "text-stone-400 hover:text-stone-200 hover:bg-white/5"
                    }`}
                  >
                    {idx + 1}. {p.name.split(" ")[0]}
                  </button>
                ))}
              </div>

              {/* Selected Phase Info Box */}
              <div className="bg-grim-dark border border-grim-border rounded-xl p-4.5 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-amber-400 font-display">
                    Phase {selectedPhase + 1}: {PHASE_GUIDES[selectedPhase].name}
                  </h4>
                  <span className="text-[9px] font-mono text-stone-500 uppercase tracking-widest">Active Checklist Enclosed</span>
                </div>
                <p className="text-xs text-stone-300 font-sans italic">
                  "{PHASE_GUIDES[selectedPhase].intent}"
                </p>

                {/* Sub-Checklist */}
                <div className="flex flex-col gap-2 mt-2 bg-black/20 p-3 rounded-lg border border-grim-border">
                  <span className="text-[8px] font-bold text-stone-500 uppercase tracking-widest font-mono">Tactical Objectives / Action Order:</span>
                  {PHASE_GUIDES[selectedPhase].checklist.map((item, idx) => {
                    const checkKey = `phase-${selectedPhase}-check-${idx}`;
                    const isChecked = !!phaseChecklist[checkKey];
                    return (
                      <div 
                        key={idx} 
                        onClick={() => setPhaseChecklist(prev => ({ ...prev, [checkKey]: !isChecked }))}
                        className="flex items-start gap-2.5 p-2 rounded hover:bg-white/5 cursor-pointer transition"
                      >
                        <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 mt-0.5 transition ${
                          isChecked ? "bg-amber-500 border-amber-400 text-slate-950" : "border-stone-600"
                        }`}>
                          {isChecked && <Check className="w-3 h-3" />}
                        </div>
                        <span className={`text-[11px] leading-normal font-sans ${isChecked ? "text-stone-500 line-through" : "text-stone-300"}`}>
                          {item}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Tactical Tip Box */}
                <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-3 text-xs text-stone-300">
                  <span className="text-amber-500 font-bold font-mono tracking-wider uppercase block text-[9px] mb-1">PRO-COMMANDER REMINDER:</span>
                  <p className="leading-relaxed text-stone-400 text-[11px]">{PHASE_GUIDES[selectedPhase].tip}</p>
                </div>
              </div>
            </div>

            {/* 4. Interactive Combat Sequence Flowchart */}
            <div className="bg-grim-card border border-grim-border rounded-xl shadow-xl p-5" id="combat-sequence-guide">
              <div className="flex items-center gap-2 mb-4">
                <Swords className="w-5 h-5 text-amber-500" />
                <h3 className="text-sm font-bold uppercase tracking-widest text-stone-100 font-display">Ranged Attack Sequence Walkthrough</h3>
              </div>
              
              <div className="bg-grim-dark border border-grim-border rounded-xl p-4.5 flex flex-col gap-4">
                {/* Horizontal Progress dots */}
                <div className="flex items-center justify-between gap-1 overflow-x-auto py-1 scrollbar-none">
                  {combatSteps.map((_, idx) => (
                    <React.Fragment key={idx}>
                      <button
                        onClick={() => setCombatStep(idx)}
                        className={`w-7 h-7 rounded-full flex items-center justify-center font-mono text-[10px] shrink-0 font-bold transition-all duration-300 ${
                          combatStep === idx 
                            ? "bg-amber-500 text-slate-950 scale-110 shadow-lg shadow-amber-500/20" 
                            : combatStep > idx 
                            ? "bg-amber-500/20 border border-amber-500/40 text-amber-400" 
                            : "bg-black/40 border border-stone-800 text-stone-500"
                        }`}
                      >
                        {idx + 1}
                      </button>
                      {idx < combatSteps.length - 1 && (
                        <div className={`h-[1px] min-w-[15px] flex-1 ${
                          combatStep > idx ? "bg-amber-500/30" : "bg-stone-800"
                        }`} />
                      )}
                    </React.Fragment>
                  ))}
                </div>

                {/* Step content */}
                <div className="bg-black/30 p-4 rounded-xl border border-grim-border/50 flex flex-col gap-2 min-h-[110px] justify-center">
                  <h4 className="text-xs font-bold text-amber-400 uppercase tracking-widest font-mono">
                    {combatSteps[combatStep].title}
                  </h4>
                  <p className="text-xs text-stone-300 leading-relaxed font-sans">
                    {combatSteps[combatStep].description}
                  </p>
                </div>

                {/* Back and Next controls */}
                <div className="flex justify-between items-center">
                  <button
                    disabled={combatStep === 0}
                    onClick={() => setCombatStep(prev => prev - 1)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-grim-border text-stone-400 hover:text-stone-200 text-[10px] font-mono uppercase tracking-wider disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>Previous</span>
                  </button>
                  <span className="text-[9px] font-mono text-stone-600">Step {combatStep + 1} of {combatSteps.length}</span>
                  <button
                    disabled={combatStep === combatSteps.length - 1}
                    onClick={() => setCombatStep(prev => prev + 1)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-[10px] font-black font-mono uppercase tracking-wider disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <span>Next step</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* 3. Common Core Stratagem Handbook */}
            <div className="bg-grim-card border border-grim-border rounded-xl shadow-xl p-5" id="core-stratagems-handbook">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-5 h-5 text-amber-500" />
                <h3 className="text-sm font-bold uppercase tracking-widest text-stone-100 font-display">Tactical Core Stratagem Registry</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {CORE_STRATAGEMS.map((s, idx) => (
                  <div key={idx} className="bg-grim-dark border border-grim-border rounded-xl p-4 flex flex-col gap-2.5 relative overflow-hidden group hover:border-amber-500/30 transition">
                    <div className="absolute top-0 right-0 bg-stone-900 border-l border-b border-grim-border text-[9px] font-mono px-2 py-0.5 rounded-bl text-amber-400 font-bold uppercase tracking-widest">
                      {s.cost}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-stone-200 group-hover:text-amber-400 transition font-display uppercase tracking-wider">{s.name}</h4>
                      <span className="text-[9px] text-stone-500 font-mono uppercase tracking-widest mt-0.5 block">{s.phase}</span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-stone-400 font-sans">{s.effect}</p>
                    <div className="mt-1 border-t border-grim-border/50 pt-2 text-[10px] text-stone-500 font-sans italic">
                      <strong className="text-amber-500/80 font-mono not-italic uppercase tracking-widest text-[9px] mr-1 block">ROOKIE TIP:</strong>
                      {s.tip}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* 2. Combat Simulators Section */}
        {activeSubTab === "math" && (
          <div className="flex flex-col gap-6" id="academy-math-view">
            
            {/* 7. Interactive Dice Probability Calculator */}
            <div className="bg-grim-card border border-grim-border rounded-xl shadow-xl p-5" id="dice-probability-calculator">
              <div className="flex items-center gap-2 mb-4">
                <Dices className="w-5 h-5 text-amber-500" />
                <h3 className="text-sm font-bold uppercase tracking-widest text-stone-100 font-display">Interactive Hit/Wound Probability Simulator</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                {/* Inputs Left Column */}
                <div className="md:col-span-5 flex flex-col gap-4 bg-black/20 p-4 rounded-xl border border-grim-border">
                  <span className="text-[9px] font-bold text-stone-500 uppercase tracking-widest font-mono">Attack Parameters</span>
                  
                  {/* Number of Attacks */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-mono uppercase text-stone-400 tracking-wider">Total Attacks</label>
                      <span className="text-xs font-bold font-mono text-amber-400">{calcAttacks}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setCalcAttacks(Math.max(1, calcAttacks - 5))} className="p-1.5 bg-grim-dark border border-grim-border rounded hover:border-amber-500/30 transition text-stone-400"><Minus className="w-3.5 h-3.5" /></button>
                      <input type="range" min="1" max="40" value={calcAttacks} onChange={(e) => setCalcAttacks(Number(e.target.value))} className="flex-1 accent-amber-500 bg-stone-900" />
                      <button onClick={() => setCalcAttacks(Math.min(100, calcAttacks + 5))} className="p-1.5 bg-grim-dark border border-grim-border rounded hover:border-amber-500/30 transition text-stone-400"><Plus className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>

                  {/* WS / BS Skill */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-mono uppercase text-stone-400 tracking-wider">Skill (BS / WS)</label>
                      <span className="text-xs font-bold font-mono text-amber-400">{calcBS}+</span>
                    </div>
                    <div className="flex gap-1.5" id="calc-bs-selectors">
                      {[2, 3, 4, 5, 6].map(val => (
                        <button
                          key={val}
                          onClick={() => setCalcBS(val)}
                          className={`flex-1 py-1 text-center font-mono text-xs rounded border transition ${
                            calcBS === val 
                              ? "bg-amber-500 border-amber-400 text-slate-950 font-bold" 
                              : "bg-grim-dark border-grim-border text-stone-400 hover:text-stone-200"
                          }`}
                        >
                          {val}+
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Weapon Strength vs Toughness */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-mono uppercase text-stone-400 tracking-wider">Weapon Strength (S)</label>
                      <div className="flex items-center justify-between bg-grim-dark border border-grim-border rounded p-1.5">
                        <button onClick={() => setCalcS(Math.max(1, calcS - 1))} className="text-stone-500 hover:text-stone-200"><Minus className="w-3 h-3" /></button>
                        <span className="text-xs font-mono font-bold text-amber-400">{calcS}</span>
                        <button onClick={() => setCalcS(Math.min(16, calcS + 1))} className="text-stone-500 hover:text-stone-200"><Plus className="w-3 h-3" /></button>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-mono uppercase text-stone-400 tracking-wider">Target Toughness (T)</label>
                      <div className="flex items-center justify-between bg-grim-dark border border-grim-border rounded p-1.5">
                        <button onClick={() => setCalcT(Math.max(1, calcT - 1))} className="text-stone-500 hover:text-stone-200"><Minus className="w-3 h-3" /></button>
                        <span className="text-xs font-mono font-bold text-amber-400">{calcT}</span>
                        <button onClick={() => setCalcT(Math.min(16, calcT + 1))} className="text-stone-500 hover:text-stone-200"><Plus className="w-3 h-3" /></button>
                      </div>
                    </div>
                  </div>

                  {/* AP modifier */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono uppercase text-stone-400 tracking-wider">Armor Penetration (AP)</label>
                    <div className="flex gap-1">
                      {[0, -1, -2, -3, -4].map(val => (
                        <button
                          key={val}
                          onClick={() => setCalcAP(val)}
                          className={`flex-1 py-1 text-center font-mono text-xs rounded border transition ${
                            calcAP === val 
                              ? "bg-amber-500 border-amber-400 text-slate-950 font-bold" 
                              : "bg-grim-dark border-grim-border text-stone-400 hover:text-stone-200"
                          }`}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Defender Saves */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-mono uppercase text-stone-400 tracking-wider">Armor Save</label>
                      <select 
                        value={calcSv} 
                        onChange={(e) => setCalcSv(Number(e.target.value))}
                        className="bg-grim-dark border border-grim-border rounded text-stone-200 font-mono text-xs p-1.5 focus:outline-none"
                      >
                        {[2, 3, 4, 5, 6].map(v => (
                          <option key={v} value={v}>{v}+</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-mono uppercase text-stone-400 tracking-wider">Invul Save</label>
                      <select 
                        value={calcInv} 
                        onChange={(e) => setCalcInv(Number(e.target.value))}
                        className="bg-grim-dark border border-grim-border rounded text-stone-200 font-mono text-xs p-1.5 focus:outline-none"
                      >
                        <option value={7}>None</option>
                        {[3, 4, 5, 6].map(v => (
                          <option key={v} value={v}>{v}++</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Outputs Right Column */}
                <div className="md:col-span-7 flex flex-col justify-between gap-5 bg-grim-dark border border-grim-border rounded-xl p-5">
                  <div className="flex flex-col gap-4">
                    <span className="text-[9px] font-bold text-amber-400 uppercase tracking-widest font-mono">Statistical Prognosis (Combat Math)</span>
                    
                    {/* Visual gauges/bar graphs */}
                    <div className="flex flex-col gap-3.5">
                      {/* Hits Gauge */}
                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between items-center font-mono text-[11px]">
                          <span className="text-stone-400 uppercase">1. EXPECTED HITS</span>
                          <span className="text-amber-400 font-bold">{probResults.hits} <span className="text-[9px] text-stone-500 font-normal">({probResults.percentHits}% success)</span></span>
                        </div>
                        <div className="w-full h-2 bg-stone-900 rounded overflow-hidden">
                          <div className="h-full bg-amber-500/80 rounded" style={{ width: `${probResults.percentHits}%` }} />
                        </div>
                      </div>

                      {/* Wounds Gauge */}
                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between items-center font-mono text-[11px]">
                          <span className="text-stone-400 uppercase">2. EXPECTED WOUNDS</span>
                          <span className="text-amber-400 font-bold">{probResults.wounds} <span className="text-[9px] text-stone-500 font-normal">({probResults.percentWounds}% S vs T)</span></span>
                        </div>
                        <div className="w-full h-2 bg-stone-900 rounded overflow-hidden">
                          <div className="h-full bg-amber-600/80 rounded" style={{ width: `${probResults.percentWounds}%` }} />
                        </div>
                      </div>

                      {/* Saves Gauge */}
                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between items-center font-mono text-[11px]">
                          <span className="text-stone-400 uppercase">3. DEFENDER SAVE NEEDED</span>
                          <span className="text-amber-400 font-bold">{probResults.saveNeeded} <span className="text-[9px] text-stone-500 font-normal">({probResults.percentSaves}% save chance)</span></span>
                        </div>
                        <div className="w-full h-2 bg-stone-900 rounded overflow-hidden">
                          <div className="h-full bg-stone-700 rounded" style={{ width: `${probResults.percentSaves}%` }} />
                        </div>
                      </div>

                      {/* Final Unsaves (Damage opportunities) */}
                      <div className="flex flex-col gap-1 bg-black/30 p-3 rounded-lg border border-grim-border">
                        <div className="flex justify-between items-center font-mono text-xs">
                          <span className="text-stone-300 font-bold uppercase">4. EXPECTED UNSAVED DAMAGE</span>
                          <span className="text-red-400 font-bold text-sm">{probResults.failedSaves}</span>
                        </div>
                        <p className="text-[10px] text-stone-500 font-sans mt-1 leading-relaxed">
                          Applying {calcAttacks} attacks with Strength {calcS} against Toughness {calcT} yields an average of <span className="text-amber-400">{probResults.failedSaves}</span> failed saves (wounds inflicted) after armor mitigation.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Informational Box explaining the math */}
                  <div className="bg-amber-500/5 border border-amber-500/10 rounded-lg p-3 text-[10px] leading-relaxed text-stone-400 font-mono">
                    <span className="text-amber-500 font-bold uppercase block text-[8px] mb-1">THE MATH BEHIND THE METERS:</span>
                    Hit Chance: BS 3+ means 4 out of 6 faces succeed (66.7%). <br />
                    Wound Grid: Strength {calcS} equal to Toughness {calcT} wounds on 4+ (50%). <br />
                    Save Rule: Armor save modified by AP ({calcAP}) determines final target survive roll.
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Strength vs Toughness Wound Matrix Helper */}
            <div className="bg-grim-card border border-grim-border rounded-xl shadow-xl p-5" id="strength-vs-toughness-grid">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-amber-500" />
                <h3 className="text-sm font-bold uppercase tracking-widest text-stone-100 font-display">Interactive Wound Matrix (S vs T)</h3>
              </div>

              <div className="bg-grim-dark border border-grim-border rounded-xl p-4.5 flex flex-col gap-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* S weapon */}
                  <div className="bg-black/20 p-4 rounded-xl border border-grim-border/50 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-stone-300 uppercase font-mono">Weapon Strength (S)</span>
                      <span className="text-2xl font-black text-amber-500 font-mono">{matrixS}</span>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setMatrixS(Math.max(1, matrixS - 1))} 
                        className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-grim-dark border border-grim-border rounded-lg hover:border-amber-500/30 text-stone-400 hover:text-stone-200 transition font-mono active:scale-95 cursor-pointer"
                      >
                        <Minus className="w-3 h-3 shrink-0" />
                        <span>1</span>
                      </button>
                      <button 
                        onClick={() => setMatrixS(4)} 
                        className="flex items-center justify-center gap-1.5 py-1.5 px-3 bg-grim-dark border border-grim-border rounded-lg text-stone-500 hover:text-stone-300 transition text-[10px] font-mono active:scale-95 cursor-pointer"
                      >
                        <RefreshCw className="w-3 h-3 shrink-0" />
                        <span>Default (4)</span>
                      </button>
                      <button 
                        onClick={() => setMatrixS(Math.min(16, matrixS + 1))} 
                        className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-grim-dark border border-grim-border rounded-lg hover:border-amber-500/30 text-stone-400 hover:text-stone-200 transition font-mono active:scale-95 cursor-pointer"
                      >
                        <Plus className="w-3 h-3 shrink-0" />
                        <span>1</span>
                      </button>
                    </div>
                    <p className="text-[10px] text-stone-500 font-sans italic">Heavy weapons usually have high Strength (e.g. Lascannons are S12), small arms have lower (e.g. Lasguns are S3).</p>
                  </div>

                  {/* T target */}
                  <div className="bg-black/20 p-4 rounded-xl border border-grim-border/50 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-stone-300 uppercase font-mono">Target Toughness (T)</span>
                      <span className="text-2xl font-black text-amber-500 font-mono">{matrixT}</span>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setMatrixT(Math.max(1, matrixT - 1))} 
                        className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-grim-dark border border-grim-border rounded-lg hover:border-amber-500/30 text-stone-400 hover:text-stone-200 transition font-mono active:scale-95 cursor-pointer"
                      >
                        <Minus className="w-3 h-3 shrink-0" />
                        <span>1</span>
                      </button>
                      <button 
                        onClick={() => setMatrixT(4)} 
                        className="flex items-center justify-center gap-1.5 py-1.5 px-3 bg-grim-dark border border-grim-border rounded-lg text-stone-500 hover:text-stone-300 transition text-[10px] font-mono active:scale-95 cursor-pointer"
                      >
                        <RefreshCw className="w-3 h-3 shrink-0" />
                        <span>Default (4)</span>
                      </button>
                      <button 
                        onClick={() => setMatrixT(Math.min(16, matrixT + 1))} 
                        className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-grim-dark border border-grim-border rounded-lg hover:border-amber-500/30 text-stone-400 hover:text-stone-200 transition font-mono active:scale-95 cursor-pointer"
                      >
                        <Plus className="w-3 h-3 shrink-0" />
                        <span>1</span>
                      </button>
                    </div>
                    <p className="text-[10px] text-stone-500 font-sans italic">Vehicles & Monsters have high Toughness (T10-T12+), while infantry has lower (T3-T4).</p>
                  </div>
                </div>

                {/* Wound matrix results screen */}
                {(() => {
                  const result = getWoundRoll(matrixS, matrixT);
                  return (
                    <div className="bg-gradient-to-r from-amber-500/5 to-amber-500/10 border border-amber-500/20 rounded-xl p-5 flex flex-col md:flex-row items-center gap-5">
                      <div className="w-16 h-16 rounded-xl bg-amber-500 flex flex-col items-center justify-center border border-amber-400/30 shadow-lg shrink-0">
                        <span className="text-3xl font-black text-slate-950 font-mono leading-none">{result.roll}+</span>
                        <span className="text-[8px] text-slate-950 font-bold font-mono tracking-widest mt-1 uppercase">to wound</span>
                      </div>
                      <div className="flex-1 flex flex-col gap-1.5">
                        <h4 className="text-xs font-bold text-stone-200 uppercase tracking-widest font-mono">Wounding Requirement Rule:</h4>
                        <p className="text-xs text-stone-400 font-sans">{result.desc}. You must roll a D6 and score a <span className="text-amber-400 font-bold">{result.roll} or higher</span> to successfully wound this target.</p>
                        <div className="flex gap-1.5 mt-1">
                          {[1, 2, 3, 4, 5, 6].map(die => (
                            <div 
                              key={die} 
                              className={`w-7 h-7 rounded border font-mono text-[11px] flex items-center justify-center transition-all ${
                                die >= result.roll 
                                  ? "bg-amber-500 border-amber-400 text-slate-950 font-bold scale-105 shadow-md shadow-amber-500/10" 
                                  : "bg-black/40 border-stone-800 text-stone-600"
                              }`}
                            >
                              {die}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* 6. Armor Penetration (AP) vs Saves Visualizer */}
            <div className="bg-grim-card border border-grim-border rounded-xl shadow-xl p-5" id="ap-vs-saves-visualizer">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-amber-500" />
                <h3 className="text-sm font-bold uppercase tracking-widest text-stone-100 font-display">AP (Armor Penetration) & saves interaction</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                <div className="md:col-span-6 flex flex-col gap-4 bg-black/20 p-4 rounded-xl border border-grim-border">
                  <span className="text-[9px] font-bold text-stone-500 uppercase tracking-widest font-mono">Parameters Setup</span>

                  {/* Standard Armor Save */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono uppercase text-stone-400 tracking-wider">Base Armor Save (Sv)</label>
                    <div className="flex gap-1">
                      {[2, 3, 4, 5, 6].map(val => (
                        <button
                          key={val}
                          onClick={() => setSaveSv(val)}
                          className={`flex-1 py-1 text-center font-mono text-xs rounded border transition ${
                            saveSv === val 
                              ? "bg-amber-500 border-amber-400 text-slate-950 font-bold" 
                              : "bg-grim-dark border-grim-border text-stone-400 hover:text-stone-200"
                          }`}
                        >
                          {val}+
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* AP value */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono uppercase text-stone-400 tracking-wider">Weapon AP value</label>
                    <div className="flex gap-1">
                      {[0, -1, -2, -3, -4].map(val => (
                        <button
                          key={val}
                          onClick={() => setSaveAP(val)}
                          className={`flex-1 py-1 text-center font-mono text-xs rounded border transition ${
                            saveAP === val 
                              ? "bg-amber-500 border-amber-400 text-slate-950 font-bold" 
                              : "bg-grim-dark border-grim-border text-stone-400 hover:text-stone-200"
                          }`}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Cover and Invul Checkboxes */}
                  <div className="flex flex-col gap-2.5 bg-black/40 p-3 rounded-lg border border-grim-border/50">
                    <label className="flex items-center gap-2 text-[10px] font-mono uppercase text-stone-400 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={saveCover} 
                        onChange={(e) => setSaveCover(e.target.checked)} 
                        className="rounded border-stone-800 text-amber-500 focus:ring-0 focus:ring-offset-0 bg-stone-900" 
                      />
                      <span>Defender in Cover (+1 to normal save)</span>
                    </label>

                    <label className="flex items-center gap-2 text-[10px] font-mono uppercase text-stone-400 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={saveInv} 
                        onChange={(e) => setSaveInv(e.target.checked)} 
                        className="rounded border-stone-800 text-amber-500 focus:ring-0 focus:ring-offset-0 bg-stone-900" 
                      />
                      <span>Defender Has Invulnerable Save</span>
                    </label>

                    {saveInv && (
                      <div className="flex gap-1 pl-6">
                        {[3, 4, 5, 6].map(val => (
                          <button
                            key={val}
                            onClick={() => setSaveInvVal(val)}
                            className={`flex-1 py-0.5 text-center font-mono text-[10px] rounded border transition ${
                              saveInvVal === val 
                                ? "bg-amber-500 border-amber-400 text-slate-950 font-bold" 
                                : "bg-grim-dark border-grim-border text-stone-400 hover:text-stone-200"
                            }`}
                          >
                            {val}++
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Final calculation right column */}
                <div className="md:col-span-6 bg-grim-dark border border-grim-border rounded-xl p-5 flex flex-col justify-between">
                  {(() => {
                    const result = getModifiedSave();
                    return (
                      <div className="flex flex-col gap-4">
                        <span className="text-[9px] font-bold text-amber-400 uppercase tracking-widest font-mono">Final Deflecting Roll Required</span>
                        
                        <div className="flex items-center gap-4.5 bg-black/30 p-4 rounded-xl border border-grim-border/50">
                          <div className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center border font-bold shrink-0 ${
                            result.isInvUsed 
                              ? "bg-amber-600 border-amber-400 text-slate-950 shadow-lg shadow-amber-600/10" 
                              : "bg-grim-dark border-grim-border text-stone-200"
                          }`}>
                            <span className="text-2xl font-black font-mono leading-none">{result.finalRoll}+</span>
                            <span className="text-[8px] font-mono mt-0.5">{result.isInvUsed ? "Invul" : "Armor"}</span>
                          </div>
                          <div>
                            <h4 className="text-[11px] font-bold text-stone-200 uppercase tracking-wider font-mono">
                              {result.isInvUsed ? "INVULNERABLE SAVE ENGAGED!" : "ARMOR SAVE RESOLVED"}
                            </h4>
                            <p className="text-[10px] text-stone-400 font-sans leading-normal mt-1">
                              {result.isInvUsed 
                                ? `The base armor save (${saveSv}+) was modified by AP (${saveAP}) to ${Math.min(7, saveSv - saveAP)}+, but your unit used its ${saveInvVal}++ Invulnerable Save instead to ignore the weapon's AP.` 
                                : `The base armor save (${saveSv}+) was modified by AP (${saveAP})${saveCover ? " and cover (+1)" : ""}, resulting in a final save of ${result.finalRoll}+.`}
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-1 justify-center py-2 border-t border-grim-border/40">
                          {[1, 2, 3, 4, 5, 6].map(die => (
                            <div 
                              key={die} 
                              className={`w-7 h-7 rounded border font-mono text-[11px] flex items-center justify-center transition ${
                                die >= result.finalRoll 
                                  ? "bg-emerald-500/20 border-emerald-400 text-emerald-400 font-bold" 
                                  : "bg-red-500/10 border-red-900/60 text-red-700 font-normal line-through"
                              }`}
                            >
                              {die}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })()}

                  <div className="bg-amber-500/5 border border-amber-500/10 rounded-lg p-2.5 text-[10px] leading-relaxed text-stone-400 font-mono mt-4">
                    <span className="text-amber-500 font-bold uppercase block text-[8px] mb-1">DEFENDER TACTICAL MEMO:</span>
                    AP rolls modify the D6 save result. AP-2 turns a 3+ save into a 5+ save. Cover offers +1 to your save, helping offset high AP!
                  </div>
                </div>
              </div>
            </div>

            {/* 5. Interactive Battle-shock & Morale Simulator */}
            <div className="bg-grim-card border border-grim-border rounded-xl shadow-xl p-5" id="battleshock-morale-simulator">
              <div className="flex items-center gap-2 mb-4">
                <Skull className="w-5 h-5 text-amber-500" />
                <h3 className="text-sm font-bold uppercase tracking-widest text-stone-100 font-display">Interactive Battle-shock simulator</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                {/* Simulator Inputs */}
                <div className="md:col-span-5 flex flex-col gap-4 bg-black/20 p-4 rounded-xl border border-grim-border">
                  <span className="text-[9px] font-bold text-stone-500 uppercase tracking-widest font-mono">Morale Parameters</span>
                  
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-mono uppercase text-stone-400 tracking-wider">Unit Leadership (Ld)</label>
                      <span className="text-xs font-bold font-mono text-amber-400">{bsLd}+</span>
                    </div>
                    <div className="flex gap-1.5" id="bs-ld-selectors">
                      {[5, 6, 7, 8, 9].map(val => (
                        <button
                          key={val}
                          onClick={() => setBsLd(val)}
                          className={`flex-1 py-1 text-center font-mono text-xs rounded border transition ${
                            bsLd === val 
                              ? "bg-amber-500 border-amber-400 text-slate-950 font-bold" 
                              : "bg-grim-dark border-grim-border text-stone-400 hover:text-stone-200"
                          }`}
                        >
                          {val}+
                        </button>
                      ))}
                    </div>
                    <p className="text-[9px] text-stone-500 font-sans italic mt-1">Lower Leadership is better (Space Marines are Ld 6+, while Gretchin are Ld 8+ or 9+).</p>
                  </div>

                  <button
                    id="bs-roll-btn"
                    onClick={rollBattleShock}
                    disabled={isRollingBS}
                    className="w-full bg-amber-500 hover:bg-amber-400 disabled:bg-stone-800 text-slate-950 disabled:text-stone-600 font-bold py-2.5 rounded-xl transition flex items-center justify-center gap-2 uppercase tracking-wider text-xs font-mono cursor-pointer shadow-lg shadow-amber-500/15"
                  >
                    <RefreshCw className={`w-4 h-4 ${isRollingBS ? "animate-spin text-slate-950" : ""}`} />
                    <span>{isRollingBS ? "Shaking the Bones..." : "Roll 2D6 Morale Test"}</span>
                  </button>
                </div>

                {/* Simulator Outcomes */}
                <div className="md:col-span-7 bg-grim-dark border border-grim-border rounded-xl p-5 flex flex-col justify-between min-h-[180px]">
                  {bsRoll ? (
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-bold text-stone-500 uppercase tracking-widest font-mono">Morale Output</span>
                        <span className={`text-[9px] font-black uppercase font-mono tracking-widest border px-2 py-0.5 rounded ${
                          bsStatus === "success" 
                            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 animate-pulse" 
                            : "bg-red-500/10 border-red-500/20 text-red-500 animate-pulse"
                        }`}>
                          {bsStatus === "success" ? "PASS: COMPOSURE MAINTAINED" : "FAIL: BATTLE-SHOCKED!"}
                        </span>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex gap-2 shrink-0">
                          <div className="w-10 h-10 rounded-lg bg-stone-900 border border-grim-border flex items-center justify-center font-mono text-xl text-amber-400 font-bold">
                            {bsRoll.d1}
                          </div>
                          <div className="w-10 h-10 rounded-lg bg-stone-900 border border-grim-border flex items-center justify-center font-mono text-xl text-amber-400 font-bold">
                            {bsRoll.d2}
                          </div>
                        </div>
                        <div className="font-mono">
                          <div className="text-xs text-stone-400">TOTAL DICE SUM:</div>
                          <div className="text-xl font-bold text-stone-100">{bsRoll.total} <span className="text-xs text-stone-500 font-normal">vs Leader {bsLd}+</span></div>
                        </div>
                      </div>

                      {bsStatus === "success" ? (
                        <p className="text-xs text-stone-400 font-sans leading-relaxed">
                          Success! Your units hold their defensive line. The 2D6 roll of <span className="text-emerald-400 font-bold">{bsRoll.total}</span> meets or exceeds the required Leadership of <span className="text-stone-300 font-bold">{bsLd}+</span>.
                        </p>
                      ) : (
                        <div className="flex flex-col gap-2">
                          <p className="text-xs text-stone-400 font-sans leading-relaxed">
                            Failure! Your unit breaks in terror. The 2D6 roll of <span className="text-red-400 font-bold">{bsRoll.total}</span> failed to reach the required Leadership of <span className="text-stone-300 font-bold">{bsLd}+</span>.
                          </p>
                          <div className="bg-red-500/5 border border-red-500/10 p-2.5 rounded text-[10px] text-red-300 font-mono">
                            ⚠️ PENALTIES: Objective Control (OC) sets to 0. Cannot be targeted by Stratagems. Must roll Desperate Escape tests to Fall Back!
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center py-6 text-stone-600 gap-2">
                      <Dices className="w-8 h-8 text-stone-800" />
                      <span className="text-[10px] font-mono uppercase tracking-widest">Morale Core Engine Standby</span>
                    </div>
                  )}

                  <div className="bg-amber-500/5 border border-amber-500/10 rounded-lg p-3 text-[10px] leading-relaxed text-stone-400 font-mono">
                    <span className="text-amber-500 font-bold uppercase block text-[8px] mb-1">CRITICAL Morale rule reminder:</span>
                    Battle-shock tests are rolled in your Command Phase for any unit that is below half-strength. The penalties last until the start of your next Command Phase!
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* 3. Playstyle Finder Section */}
        {activeSubTab === "quiz" && (
          <div className="bg-grim-card border border-grim-border rounded-xl shadow-xl p-5" id="playstyle-quiz-container">
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-5 h-5 text-amber-500" />
              <h3 className="text-sm font-bold uppercase tracking-widest text-stone-100 font-display">Recruit playstyle faction finder quiz</h3>
            </div>

            <div className="bg-grim-dark border border-grim-border rounded-xl p-5" id="quiz-wrapper">
              {quizStep === -1 ? (
                <div className="flex flex-col items-center text-center py-8 gap-5" id="quiz-start-screen">
                  <div className="p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-full">
                    <BookOpen className="w-8 h-8 text-amber-500 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-stone-100 uppercase tracking-widest font-display">Find Your Warhammer Faction!</h4>
                    <p className="text-xs text-stone-400 max-w-md mx-auto mt-2 leading-relaxed">
                      With dozens of forces across the stars, choosing your first army can be daunting. Take this 2-minute playstyle questionnaire to match with your ideal battlefield doctrine.
                    </p>
                  </div>
                  <button
                    onClick={() => setQuizStep(0)}
                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-2.5 rounded-xl transition uppercase tracking-widest font-mono text-xs cursor-pointer shadow-lg shadow-amber-500/10"
                  >
                    Initiate playstyle analysis
                  </button>
                </div>
              ) : quizStep < quizQuestions.length ? (
                <div className="flex flex-col gap-5" id="quiz-question-screen">
                  {/* Progress bar */}
                  <div className="flex gap-1.5">
                    {quizQuestions.map((_, i) => (
                      <div 
                        key={i} 
                        className={`h-1.5 flex-1 rounded transition-all ${
                          i === quizStep ? "bg-amber-500" : i < quizStep ? "bg-amber-500/40" : "bg-stone-800"
                        }`}
                      />
                    ))}
                  </div>

                  <div>
                    <span className="text-[9px] font-mono text-stone-500 uppercase tracking-widest">Question {quizStep + 1} of {quizQuestions.length}</span>
                    <h4 className="text-sm font-bold text-stone-200 mt-1 font-sans">{quizQuestions[quizStep].text}</h4>
                  </div>

                  <div className="flex flex-col gap-2.5" id="quiz-options">
                    {quizQuestions[quizStep].options.map((opt, oIdx) => (
                      <button
                        key={oIdx}
                        onClick={() => handleQuizAnswer(opt.code)}
                        className="w-full text-left bg-grim-dark border border-grim-border hover:border-amber-500/40 hover:bg-amber-500/5 px-4 py-3 rounded-xl text-xs text-stone-300 hover:text-stone-100 transition active:scale-98 cursor-pointer"
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center text-center py-6 gap-5" id="quiz-result-screen">
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                    <CheckCircle2 className="w-8 h-8 text-emerald-400 animate-bounce" />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <span className="text-[9px] font-mono text-amber-500 uppercase tracking-widest">TACTICAL ALIGNMENT FOUND:</span>
                    {quizResult === "marines" && (
                      <div className="flex flex-col gap-2">
                        <h4 className="text-xl font-black text-amber-400 font-display uppercase tracking-widest">Adeptus Astartes (Space Marines)</h4>
                        <p className="text-xs text-stone-400 max-w-md mx-auto leading-relaxed">
                          You value tactical adaptability, stoic defense, and genetic power. Space Marines are elite, durable, and highly forgiving to mistakes, making them the ultimate starter army!
                        </p>
                        <div className="bg-amber-500/5 border border-amber-500/10 p-3 rounded-lg text-[11px] text-stone-400 text-left mt-2 font-mono">
                          💪 KEY STRENGTHS: Excellent saves, Oath of Moment allows full hit re-rolls, powerful characters.
                        </div>
                      </div>
                    )}
                    {quizResult === "necrons" && (
                      <div className="flex flex-col gap-2">
                        <h4 className="text-xl font-black text-amber-400 font-display uppercase tracking-widest">Necron Legions</h4>
                        <p className="text-xs text-stone-400 max-w-md mx-auto leading-relaxed">
                          You favor ancient cybernetic metal legions that refuse to perish. Necrons rise back from the dead each turn and deploy hyper-accurate gauss firing lines.
                        </p>
                        <div className="bg-amber-500/5 border border-amber-500/10 p-3 rounded-lg text-[11px] text-stone-400 text-left mt-2 font-mono">
                          🦾 KEY STRENGTHS: Reanimation Protocols stand units back up, high toughness, incredible armor pen weapons.
                        </div>
                      </div>
                    )}
                    {quizResult === "tyranids" && (
                      <div className="flex flex-col gap-2">
                        <h4 className="text-xl font-black text-amber-400 font-display uppercase tracking-widest">The Hive Mind (Tyranids)</h4>
                        <p className="text-xs text-stone-400 max-w-md mx-auto leading-relaxed">
                          You command a swarm of voracious, bio-engineered alien predators. Control the entire battlefield with massive tides of gaunts backed up by terrifying bio-monsters.
                        </p>
                        <div className="bg-amber-500/5 border border-amber-500/10 p-3 rounded-lg text-[11px] text-stone-400 text-left mt-2 font-mono">
                          🧬 KEY STRENGTHS: Shadow in the Warp disrupts opponent morale, massive model count, high board-control mobility.
                        </div>
                      </div>
                    )}
                    {quizResult === "aeldari" && (
                      <div className="flex flex-col gap-2">
                        <h4 className="text-xl font-black text-amber-400 font-display uppercase tracking-widest">Aeldari Host (Space Elves)</h4>
                        <p className="text-xs text-stone-400 max-w-md mx-auto leading-relaxed">
                          You operate with elegant foresight, supreme high-tech weaponry, and unparalleled maneuverability. High-risk, glass-cannon masters of fate.
                        </p>
                        <div className="bg-amber-500/5 border border-amber-500/10 p-3 rounded-lg text-[11px] text-stone-400 text-left mt-2 font-mono">
                          ✨ KEY STRENGTHS: Strands of Fate dice pre-determines key rolls, unmatched speed, devastating hit-and-run capabilities.
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3 mt-1.5">
                    <button
                      onClick={restartQuiz}
                      className="flex items-center gap-2 bg-grim-dark border border-grim-border text-stone-300 hover:text-stone-100 hover:border-stone-700 font-bold px-4.5 py-3 rounded-xl text-xs font-mono uppercase tracking-wider cursor-pointer active:scale-95 transition"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-stone-400" />
                      <span>Retry Questionnaire</span>
                    </button>
                    <button
                      onClick={() => restartQuiz()}
                      className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-3 rounded-xl text-xs font-mono uppercase tracking-wider cursor-pointer shadow-lg shadow-amber-500/10 active:scale-95 transition"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-slate-950" />
                      <span>Browse This Faction!</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

      </div>

      {/* Right Column: Searchable Glossary & Tactical Pitfalls */}
      <div className="lg:col-span-4 flex flex-col gap-6" id="academy-sidebar">
        
        {/* 1. Searchable Glossary panel */}
        <div className="bg-grim-card border border-grim-border rounded-xl shadow-xl p-5" id="academy-glossary-panel">
          <div className="flex items-center gap-2 mb-3.5">
            <BookOpen className="w-5 h-5 text-amber-500" />
            <h3 className="text-sm font-bold uppercase tracking-widest text-stone-100 font-display">Sacred Rule Glossary</h3>
          </div>

          <div className="flex flex-col gap-3">
            {/* Search inputs */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-stone-600" />
              <input
                id="glossary-search-input"
                type="text"
                placeholder="Search keywords (e.g. FNP)..."
                value={glossarySearch}
                onChange={(e) => setGlossarySearch(e.target.value)}
                className="w-full bg-grim-dark border border-grim-border rounded-lg pl-9 pr-3 py-2 text-xs text-stone-200 placeholder-stone-650 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/10 transition"
              />
            </div>

            {/* Category selection */}
            <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none" id="glossary-category-scroll">
              {["All", "Weapons", "Movement", "Saves", "Abilities"].map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedGlossaryCategory(cat)}
                  className={`text-[9px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-md transition shrink-0 ${
                    selectedGlossaryCategory === cat 
                      ? "bg-amber-500 text-slate-950 font-bold" 
                      : "bg-black/30 text-stone-400 hover:text-stone-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* List results */}
            <div className="flex flex-col gap-3 max-h-[360px] overflow-y-auto pr-1" id="glossary-list-results">
              {filteredGlossary.length > 0 ? (
                filteredGlossary.map((item, idx) => (
                  <div key={idx} className="bg-grim-dark border border-grim-border rounded-lg p-3 flex flex-col gap-1.5 hover:border-amber-500/20 transition">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-stone-200 font-display uppercase tracking-wider">{item.term}</span>
                      <span className="text-[8px] font-mono uppercase tracking-widest text-amber-500 bg-amber-500/5 border border-amber-500/25 px-1.5 py-0.2 rounded">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-400 leading-relaxed font-sans">{item.definition}</p>
                    <div className="bg-black/30 p-2 rounded text-[10px] text-stone-500 font-sans italic border-l border-amber-500/30">
                      <strong className="text-amber-500/80 font-mono not-italic uppercase tracking-widest text-[8px] mr-1 block">EXAMPLE ON THE TABLE:</strong>
                      {item.example}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-stone-600 text-[10px] font-mono uppercase tracking-widest">No matching tactical terms found</div>
              )}
            </div>
          </div>
        </div>

        {/* 9. Top 10 Pitfalls & Tactical Rules of Thumb */}
        <div className="bg-grim-card border border-grim-border rounded-xl shadow-xl p-5" id="pitfalls-panel">
          <div className="flex items-center gap-2 mb-3.5">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <h3 className="text-sm font-bold uppercase tracking-widest text-stone-100 font-display">Recruit Rookie Pitfalls</h3>
          </div>

          <div className="flex flex-col gap-3.5" id="pitfalls-scroll">
            {PITFALLS.map((p, idx) => (
              <div key={idx} className="bg-grim-dark border border-grim-border rounded-lg p-3.5 flex flex-col gap-2">
                <div className="flex items-start gap-2">
                  <span className="bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[9px] font-mono font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-stone-200 uppercase tracking-wider font-display">{p.title}</h4>
                    <p className="text-[10px] text-red-400 font-mono mt-0.5 font-bold uppercase">❌ THE MISTAKE: {p.problem}</p>
                  </div>
                </div>
                <div className="bg-black/30 p-2.5 rounded border border-emerald-500/10 text-[10px] text-emerald-400 font-sans leading-normal">
                  <span className="font-mono font-bold uppercase tracking-wider text-[8px] mr-1 text-emerald-400 block mb-1">✔️ THE CORRECT RULE:</span>
                  {p.solution}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
