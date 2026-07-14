/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { FACTIONS } from "../data/factions";
import { Faction, Datacard } from "../types";
import { 
  Shield, Bug, Skull, Sparkles, Flame, Sword, Crown, 
  ChevronRight, Swords, Award, Layers, Target, Info, Search,
  HelpCircle, BookOpen, RefreshCw, Book, Plus, Trash2, Check, Brush,
  Dices, Zap, ChevronDown, ChevronUp, TrendingUp, Volume2
} from "lucide-react";

// Helper to get Lucide icon from string name
const getFactionIcon = (iconName: string) => {
  switch (iconName) {
    case "Shield": return <Shield className="w-5 h-5 text-sky-400" id="icon-shield" />;
    case "Bug": return <Bug className="w-5 h-5 text-green-400" id="icon-bug" />;
    case "Skull": return <Skull className="w-5 h-5 text-emerald-400" id="icon-skull" />;
    case "Sparkles": return <Sparkles className="w-5 h-5 text-indigo-400" id="icon-sparkles" />;
    case "Flame": return <Flame className="w-5 h-5 text-orange-400" id="icon-flame" />;
    case "Sword": return <Sword className="w-5 h-5 text-red-400" id="icon-sword" />;
    case "Crown": return <Crown className="w-5 h-5 text-amber-400" id="icon-crown" />;
    default: return <Sword className="w-5 h-5 text-gray-400" id="icon-default" />;
  }
};

const UNIVERSAL_CORE_STRATAGEMS = [
  {
    name: "Command Re-roll",
    cost: 1,
    phase: "Any Phase",
    trigger: "Just after making a Hit roll, Wound roll, Damage roll, Saving throw, Advance roll, Charge roll, Battle-shock test, or Leadership test.",
    effect: "You re-roll that dice roll."
  },
  {
    name: "Fire Overwatch",
    cost: 1,
    phase: "Opponent's Movement or Charge Phase",
    trigger: "Just after an enemy unit starts or ends a Normal Move, Advance, Fall Back, or Charge move.",
    effect: "Your unit shoots at that enemy unit as if it were your Shooting phase. Hits are only scored on unmodified Hit rolls of 6, regardless of BS or modifiers."
  },
  {
    name: "Go To Ground",
    cost: 1,
    phase: "Opponent's Shooting Phase",
    trigger: "Just after an enemy unit declares its ranged attacks against an Infantry unit in your army.",
    effect: "Until the end of the phase, models in your unit have a 6+ invulnerable save and benefit from Benefit of Cover (adds 1 to saving throws against ranged attacks)."
  },
  {
    name: "Counter-Offensive",
    cost: 2,
    phase: "Fight Phase",
    trigger: "Just after an enemy unit has fought.",
    effect: "Select one of your eligible units that is in engagement range and has not fought yet; that unit fights next."
  },
  {
    name: "Heroic Intervention",
    cost: 2,
    phase: "Opponent's Charge Phase",
    trigger: "Just after an enemy unit finishes a Charge move within 6\" of one of your units.",
    effect: "Select one eligible unit from your army within 6\". That unit declares a charge against that enemy unit; if successful, it moves into engagement range. Note: Your unit does not get a Charge bonus (+1 attack or Fights First) this turn."
  },
  {
    name: "Insane Bravery",
    cost: 1,
    phase: "Battle-shock Phase",
    trigger: "Just after failing a Battle-shock test, before applying the effects of being Battle-shocked.",
    effect: "That unit is treated as having passed the Battle-shock test instead of failing it. You can only use this Stratagem once per battle."
  },
  {
    name: "Tank Shock",
    cost: 1,
    phase: "Your Charge Phase",
    trigger: "Just after a Vehicle unit from your army finishes a Charge move.",
    effect: "Select one enemy unit within engagement range. Choose one of your vehicle's melee weapons and roll a number of D6 equal to its Strength characteristic (add +2 if Strength is greater than enemy's Toughness). For each 5+, the enemy suffers 1 Mortal Wound (max 6)."
  },
  {
    name: "Grenade",
    cost: 1,
    phase: "Your Shooting Phase",
    trigger: "During your Shooting phase, before any units have shot.",
    effect: "Select one enemy unit within 8\" that is in line of sight. Roll 6 D6. For each 4+, that enemy unit suffers 1 Mortal Wound."
  },
  {
    name: "Rapid Ingress",
    cost: 1,
    phase: "Opponent's Movement Phase",
    trigger: "At the end of your opponent's Movement phase.",
    effect: "Select one unit in your Reserves/Deep Strike. That unit can set up on the battlefield now, as if it were your Movement phase."
  },
  {
    name: "Smokescreen",
    cost: 1,
    phase: "Opponent's Shooting Phase",
    trigger: "Just after an enemy unit declares its ranged attacks against a Smokescreen unit from your army.",
    effect: "Until the end of the phase, attacks against your unit have -1 to Hit, and your unit benefits from Benefit of Cover."
  }
];

const DETACHMENT_ENHANCEMENTS: Record<string, { name: string; cost: number; desc: string; synergy: string }[]> = {
  space_marines: [
    { name: "Fire Discipline", cost: 25, desc: "While leading a unit, ranged weapons gain [Sustained Hits 1]. While in Tactical Doctrine, critical hits are scored on a 5+.", synergy: "Synergizes perfectly with Hellblaster Squad to trigger massive plasma blast chains!" },
    { name: "The Honour Vehement", cost: 15, desc: "Add +1 to Strength and Attacks of the bearer's melee weapons. If in Assault Doctrine, add +2 instead.", synergy: "Equip on your Captain in Terminator Armour to shred heavy tanks in melee." },
    { name: "Artisan Artificer", cost: 15, desc: "Bearer has a Save characteristic of 2+ and gains a 5+ Feel No Pain save.", synergy: "Provides extreme tankiness to a vulnerable warlord sitting on midfield objectives." }
  ],
  tyranids: [
    { name: "Adaptive Biology", cost: 25, desc: "Bearer gains 5+ Feel No Pain save. If bearer has lost any wounds, they gain a 4+ Feel No Pain instead.", synergy: "Practically doubles the durability of Hive Tyrants or large Bio-monsters." },
    { name: "Alien Cunning", cost: 30, desc: "At the start of the battle, redeploy up to three Tyranids units, or place them in Strategic Reserves.", synergy: "Ideal for baiting your opponent's deployment, then sliding your heavy hitters to the opposite flank." },
    { name: "Synaptic Linchpin", cost: 10, desc: "The bearer's Synapse range is increased from 6\" to 9\".", synergy: "Helps keep speedy vanguard organisms inside Synapse range for Battle-shock immunities." }
  ],
  necrons: [
    { name: "Veil of Darkness", cost: 20, desc: "Once per battle, remove the bearer's unit and redeploy them anywhere on the battlefield via Deep Strike.", synergy: "Gives slow metal legions like Necron Warriors instant board-wide teleportation threat." },
    { name: "Sempiternal Weave", cost: 10, desc: "The bearer gains a 4+ Feel No Pain save.", synergy: "Cheap, reliable protection to keep your crucial Command Nobles alive." },
    { name: "Phonal Subjugator", cost: 20, desc: "While leading a unit, models in that unit gain +1 Objective Control (OC) characteristic.", synergy: "Ensures your central bodyguard squads can out-contest enemy infantry on key markers." }
  ],
  aeldari: [
    { name: "Fate's Messenger", cost: 15, desc: "Once per turn, you can change one hit roll, wound roll, or save roll for the bearer's unit to a 6.", synergy: "Enables guaranteed high-damage Fate substitutions or vital saving throws." },
    { name: "The Weeping Stones", cost: 15, desc: "Each time the bearer's unit destroys an enemy unit, gain 1 Fate Die and add it to your Fate pool.", synergy: "Snowballs your Strands of Fate pool, ensuring you have a steady supply of top-tier rolls." },
    { name: "Reader of the Runes", cost: 20, desc: "In your Command phase, you can select one Fate Die from your pool, re-roll it, and replace the old value.", synergy: "Filter out low-value (1s and 2s) Fate Dice and fish for high-impact 6s." }
  ],
  orks: [
    { name: "Headwoppa's Killchoppa", cost: 20, desc: "Bearer's melee weapons gain [Devastating Wounds] on Critical Wounds (sixes to wound skip saves).", synergy: "Turns a Warboss into a mortal-wound powerhouse that ignores heavy terminator armor." },
    { name: "Kunnin' but Brutal", cost: 15, desc: "The bearer's unit can Fall Back and still declare a Shoot or Charge action in the same turn.", synergy: "Enables deadly charge cycles, resetting charging bonuses and hitting again." },
    { name: "Follow Me Ladz", cost: 25, desc: "Add +2\" to the Movement characteristic of models in the bearer's unit.", synergy: "Crucial for speeding up slow Ork infantry into immediate charge range." }
  ],
  chaos_space_marines: [
    { name: "Mark of Chaos Undivided", cost: 15, desc: "You can re-roll Wound rolls of 1 for attacks made by models in the bearer's unit.", synergy: "Provides incredibly consistent wound output on both ranged and melee battle groups." },
    { name: "Liber Hereticus", cost: 20, desc: "The bearer's unit's weapons gain both [Sustained Hits 1] and [Lethal Hits] when making Dark Pacts.", synergy: "Double-dipping weapon keywords creates overwhelming fire volume that automatically wounds." },
    { name: "Eye of Tzeentch", cost: 20, desc: "Each time you make a Dark Pact with the bearer's unit and pass the Leadership test, gain 1 CP on a 4+.", synergy: "Generates Command Points constantly during a battle, funding more expensive stratagems." }
  ],
  astra_militarum: [
    { name: "Grand Strategist", cost: 15, desc: "The officer can issue one additional Officer Order in your Command phase.", synergy: "Double your tactical orders, buffing multiple squads from a single commander." },
    { name: "Drill Commander", cost: 20, desc: "While the bearer's unit is stationary, ranged weapons gain [Lethal Hits] on a 5+ instead of 6.", synergy: "Fires devastating volley fire that penetrates thickest armor without wounding checks." },
    { name: "Kurov's Aquila", cost: 40, desc: "Once per battle, increase the CP cost of one opponent's stratagem by 1 CP for the rest of the battle.", synergy: "Incredibly disruptive; forces your opponent to pay double for vital defensive/offensive stratagems." }
  ],
  adeptus_custodes: [
    { name: "Veiled Blade", cost: 25, desc: "Add +2 to the Attacks characteristic of the bearer's melee weapons.", synergy: "Allows your supreme Blade Champion to slice through entire squads of enemy heavy armor." },
    { name: "Inspirational Exemplar", cost: 10, desc: "Friendly units within 12\" can re-roll failed Battle-shock tests.", synergy: "Keeps your highly expensive elite squads solid and scoring on objective points." },
    { name: "Unstoppable Destroyer", cost: 15, desc: "Bearer can pile in an extra 3\" and ignores models or terrain when moving.", synergy: "Enables surgical positioning, striking directly at hidden squad leader characters." }
  ]
};

interface BeginnerGuide {
  difficulty: "Easy" | "Medium" | "Hard";
  starterProduct: string;
  signatureUnits: { name: string; desc: string; id?: string }[];
  goldenRules: string[];
  phaseTriggers: {
    phase: string;
    trigger: string;
    action: string;
  }[];
}

const BEGINNER_FACTION_GUIDES: Record<string, BeginnerGuide> = {
  space_marines: {
    difficulty: "Easy",
    starterProduct: "Combat Patrol: Space Marines or Ultimate Starter Set",
    signatureUnits: [
      { name: "Intercessors", id: "sm_intercessors", desc: "Hold backfield objectives automatically even after they move away (Sticky Objectives)." },
      { name: "Terminators", id: "sm_terminators", desc: "Extremely tough elite warriors that can teleport directly into combat." },
      { name: "Redemptor Dreadnought", id: "sm_dreadnought", desc: "A walking tank that reduces incoming damage by 1, perfect for leading the charge." },
      { name: "Roboute Guilliman", id: "sm_guilliman", desc: "The Primarch! A legendary leader who can grant massive command benefits or revive once per game." },
      { name: "Hellblaster Squad", id: "sm_hellblasters", desc: "Heavy infantry carrying plasma incinerators that melt elite enemy troops, and can shoot one final time when they die." },
      { name: "Land Raider", id: "sm_land_raider", desc: "A massive, heavily armored transport that allows units to disembark and charge in the same turn (Assault Ramp)." },
      { name: "Infernus Squad", id: "sm_infernus", desc: "Armed with pyreblasters that auto-hit targets, making them incredible for holding chokepoints and firing Overwatch." },
      { name: "Eradicator Squad", id: "sm_eradicators", desc: "Close-range anti-tank specialists whose meltaguns can easily pierce the toughest enemy vehicles and monsters." },
      { name: "Infiltrator Squad", id: "sm_infiltrators", desc: "Infiltrate forward positions during deployment and block enemy reinforcements from teleporting within 12\" of them." },
      { name: "Aggressor Squad", id: "sm_aggressors", desc: "Bulky Gravis armored warriors that unleash a hail of bolter fire and power fist attacks up close." }
    ],
    goldenRules: [
      "Always put Oath of Moment on the toughest enemy target—don't waste it on weak units.",
      "Match your active Combat Doctrine (Devastator/Tactical/Assault) to your tactical needs for the turn."
    ],
    phaseTriggers: [
      { phase: "Command Phase", trigger: "Oath of Moment Selection", action: "Select one enemy unit. All your models re-roll hit rolls against it until your next turn." },
      { phase: "Movement Phase", trigger: "Combat Doctrines", action: "Check your active doctrine. Devastator allows Advance & Shoot; Tactical allows Fall Back & Shoot/Charge; Assault allows Advance & Charge." },
      { phase: "Shooting Phase", trigger: "Concentrated Firepower", action: "Direct your heaviest weapons at your designated Oath of Moment target first." },
      { phase: "Fight Phase", trigger: "Close Combat Counter-Attack", action: "Use Armor of Contempt (1 CP) to reduce enemy armor penetration on targeted units." }
    ]
  },
  tyranids: {
    difficulty: "Medium",
    starterProduct: "Combat Patrol: Tyranids or Starter Set",
    signatureUnits: [
      { name: "Termagants", id: "tyr_gants", desc: "Huge hordes of small creatures used to screen and occupy the board." },
      { name: "Hive Tyrant", id: "tyr_hive_tyrant", desc: "The swarm leader that lets you use strategic stratagems for 0 CP." },
      { name: "Zoanthropes", id: "tyr_zoanthropes", desc: "Floating psychic bugs that provide an invulnerable save shield to nearby allies and blast tanks." },
      { name: "The Swarmlord", id: "tyr_swarmlord", desc: "An ancient, highly-intelligent military leader that increases the Command Point cost of an enemy stratagem." },
      { name: "Screamer-Killer", id: "tyr_screamer_killer", desc: "A massive Carnifex variant that unleashes bio-plasmic screams that trigger Battle-shock on target units." },
      { name: "Deathleaper", id: "tyr_deathleaper", desc: "A terrifying assassin with the Lone Operative ability that sneaks into enemy territory and inflicts leadership penalties." },
      { name: "Tyrannofex", id: "tyr_tyrannofex", desc: "A towering, heavily-armored living artillery piece carrying a massive Rupture Cannon that can obliterate tanks." },
      { name: "Genestealers", id: "tyr_genestealers", desc: "Incredibly fast melee Vanguard predators that shred armor with claws and re-roll wounds when near objectives." },
      { name: "Psychophage", id: "tyr_psychophage", desc: "A biological harvester that consumes psychic energy and grants nearby friendly units a Feel No Pain save." },
      { name: "Gargoyles", id: "tyr_gargoyles", desc: "Winged beasts that can move, shoot, and then make a bonus move to fly back into safety." }
    ],
    goldenRules: [
      "Keep your fragile horde units within Synapse range (6\" of Synapse creatures) to prevent them from routing.",
      "Pop Shadow in the Warp when your opponent is holding multiple objectives with damaged units."
    ],
    phaseTriggers: [
      { phase: "Command Phase", trigger: "Synapse & Shadow check", action: "Count which units are within 6\" of a Synapse creature. Units in Synapse roll 3D6 for Battle-shock tests." },
      { phase: "Movement Phase", trigger: "Vanguard Screening", action: "Advance your small Gaunt swarms to screen your big monsters from incoming melee charges." },
      { phase: "Shooting Phase", trigger: "Hyper-Adaptations", action: "Apply your selected adaptation (e.g. Lethal Hits against tanks, Sustained Hits against infantry)." },
      { phase: "Fight Phase", trigger: "Monstrous Rampage", action: "Use your giant monsters (Screamer-Killer, Carnifex) to initiate charges and break key lines." }
    ]
  },
  necrons: {
    difficulty: "Easy",
    starterProduct: "Combat Patrol: Necrons",
    signatureUnits: [
      { name: "Necron Warriors", id: "nec_warriors", desc: "Relentless skeletal horde that reanimates fast, especially when led by a character." },
      { name: "Canoptek Wraiths", id: "nec_wraiths", desc: "Super-fast metallic beasts with 4+ invulnerable saves that can phase through terrain." },
      { name: "Canoptek Doomstalker", id: "nec_doomstalker", desc: "A towering walker that fires powerful anti-tank blasts and hits on a 3+ with Overwatch." },
      { name: "Overlord", id: "nec_overlord", desc: "The noble leader who lets attached squads reuse a stratagem for 0 CP each battle round." },
      { name: "Technomancer", id: "nec_technomancer", desc: "A cryptek scientist that grants a 5+ Feel No Pain save and repairs nearby machines." },
      { name: "Imotekh the Stormlord", id: "nec_imotekh", desc: "A legendary commander who generates additional CP and calls down green lightnings on foes." },
      { name: "Illuminor Szeras", id: "nec_szeras", desc: "A mechanical horror that boosts the Armor Penetration of nearby allies while weakening enemies." },
      { name: "Immortals", id: "nec_immortals", desc: "Highly disciplined elites firing heavy Tesla or Gauss carbines, re-rolling wound rolls of 1." },
      { name: "Monolith", id: "nec_monolith", desc: "A floating fortress that can teleport friendly squads across the battlefield directly to its position." },
      { name: "Skorpekh Destroyers", id: "nec_skorpekh_destroyers", desc: "Melee blender constructs that can activate hyperphase weapons to chop up enemy squads." }
    ],
    goldenRules: [
      "Always attach Leaders (Technomancer/Overlord) to your squads to activate crucial buffs and reanimation bonuses.",
      "Don't expose your characters—keep them embedded within bodyguard squads."
    ],
    phaseTriggers: [
      { phase: "Command Phase", trigger: "Reanimation Protocols", action: "Every unit activates Protocols. Roll D3 (or D6 for Warriors) and restore that many lost wounds/models." },
      { phase: "Movement Phase", trigger: "Slow and Relentless March", action: "Advance your slow infantry squads onto midfield objectives. Position Technomancers to heal nearby units." },
      { phase: "Shooting Phase", trigger: "Gauss and Tesla Fire", action: "Tesla weapons gain Sustained Hits; Gauss weapons auto-wound on hit rolls of 6. Match them to the right targets." },
      { phase: "Fight Phase", trigger: "Sustained Metal combat", action: "Use Lychguard or Skorpekh Destroyers to slice through enemy armor. Keep reanimation ready." }
    ]
  },
  aeldari: {
    difficulty: "Hard",
    starterProduct: "Combat Patrol: Aeldari",
    signatureUnits: [
      { name: "Guardian Defenders", id: "ael:guardians", desc: "Hold backline markers and generate additional Fate Dice for your pool." },
      { name: "Wraithguard", id: "ael_wraithguard", desc: "Incredibly tough ghostly constructs that can shoot back when targeted." },
      { name: "Farseer", id: "ael_farseer", desc: "A master psyker who can change any Fate Die roll to a 6 once per turn." },
      { name: "Avatar of Khaine", id: "ael_avatar_khaine", desc: "The fiery demigod of war that is nearly immune to ranged damage and cleaves tanks." },
      { name: "Autarch Wayleaper", id: "ael_autarch", desc: "A lone strategist that generates bonus Command Points and stays elusive behind enemy lines." },
      { name: "Fire Prism", id: "ael_fire_prism", desc: "A swift grav-tank equipped with a prism cannon that can link shots with other Fire Prisms." },
      { name: "Howling Banshees", id: "ael_howling_banshees", desc: "Acrobatic sword-masters who charge from cover, strike first, and prevent enemy Overwatch." },
      { name: "Wave Serpent", id: "ael_wave_serpent", desc: "The ultimate hover-skimmer transport protected by an energy shield that can be fired to shock enemies." },
      { name: "Rangers", id: "ael_rangers", desc: "Infiltrating snipers with camo-cloaks who target enemy characters and slow enemy charges." },
      { name: "Warp Spiders", id: "ael_warp_spiders", desc: "Highly mobile infantry that can teleport across the battlefield and unleash monofilament weapon sprays." }
    ],
    goldenRules: [
      "Avoid direct firefights—strike from behind cover and use Phantasm (1 CP) to escape danger.",
      "Save your 6s in the Fate Pool for critical anti-tank damage rolls or make-or-break saves."
    ],
    phaseTriggers: [
      { phase: "Command Phase", trigger: "Fate Pool Scrying", action: "Review your Strands of Fate pool. Plan which dice will be used for crucial hit, save, or damage rolls." },
      { phase: "Movement Phase", trigger: "Phantasm & Battle-Focus", action: "Position your fast skimmers and infantry. Keep them safe behind obscuring ruins." },
      { phase: "Shooting Phase", trigger: "Strands of Fate Substitution", action: "Substitute a Fate Die on a high-impact weapon (e.g., Bright Lance) to guarantee maximum damage." },
      { phase: "Fight Phase", trigger: "Surgical Melee Striking", action: "Charge with highly specialized elite combatants (Howling Banshees). Strike hard, and don't get trapped." }
    ]
  },
  orks: {
    difficulty: "Easy",
    starterProduct: "Combat Patrol: Orks",
    signatureUnits: [
      { name: "Ork Boyz", id: "ork_boyz", desc: "Massive green tides of angry infantry that hit harder in combat, especially during the Waaagh!" },
      { name: "Beast Snagga Boyz", id: "ork_beastsnagga_boyz", desc: "Tougher, anti-monster infantry equipped with beast-hunting harpoons." },
      { name: "Trukk", id: "ork_trukk", desc: "A cheap, fast, ramshackle vehicle to carry your Boyz safely into engagement range." },
      { name: "Ghazghkull Thraka", id: "ork_ghazghkull", desc: "The Prophet of the Waaagh! who acts as a lethal vanguard and makes nearby Orks hit even harder." },
      { name: "Gretchin", id: "ork_gretchin", desc: "Scurrying runts who generate additional Command Points while sitting on backfield objectives." },
      { name: "Nobz", id: "ork_nobz", desc: "Bully elites armed with heavy close combat weapons that hit with crushing force." },
      { name: "Squighog Boyz", id: "ork_squighog_boyz", desc: "Cavalry riding armored squigs that charge with beast-snagga spears and deal mortal wounds." },
      { name: "Weirdboy", id: "ork_weirdboy", desc: "A wild psyker who can teleport his entire attached squad anywhere on the board (Da Jump)." },
      { name: "Deff Dread", id: "ork_deff_dread", desc: "A terrifying walking scrap-heap armed with multiple klaws that slices through infantry." },
      { name: "Kommandos", id: "ork_kommandos", desc: "Infiltrating sneaky Boyz that deploy ahead, ignore cover, and distract the opponent's army." }
    ],
    goldenRules: [
      "Declare your Waaagh! at the perfect moment—usually round 2 or 3 when you are ready to charge multiple units.",
      "Ork shooting is terrible (hits on 5+), so don't build lists around standing still and firing."
    ],
    phaseTriggers: [
      { phase: "Command Phase", trigger: "The Waaagh! Declaration", action: "Choose whether to declare the Waaagh! active for the battle round. Grants +1 Strength, +1 Attack, and 5+ Invul save." },
      { phase: "Movement Phase", trigger: "’Ere We Go!", action: "Embark boyz in Trukks and speed them up the field. Advance and prepare to declare charges." },
      { phase: "Shooting Phase", trigger: "More Dakka!", action: "Fire all pistols and sluggas. Re-roll 1s if standing still with specialized units." },
      { phase: "Fight Phase", trigger: "Choppa Carnage", action: "Roll massive piles of dice in melee! Under Waaagh!, your strength and attack volume will crush almost any target." }
    ]
  },
  chaos_space_marines: {
    difficulty: "Medium",
    starterProduct: "Combat Patrol: Chaos Space Marines",
    signatureUnits: [
      { name: "Legionaries", id: "csm_legionaries", desc: "Heretic infantry that re-roll hit and wound rolls of 1 when fighting close to objectives." },
      { name: "Chosen", id: "csm_chosen", desc: "Slick, versatile elites that can shoot, advance, and charge in the same turn without penalty." },
      { name: "Forgefiend", id: "csm_forgefiend", desc: "A corrupted biomechanical monster that fires devastating ectoplasma cannons to force Battle-shock." },
      { name: "Abaddon the Despoiler", id: "csm_abaddon", desc: "The Warmaster! Grants nearby friendly squads access to multiple Marks of Chaos simultaneously." },
      { name: "Chaos Cultists", id: "csm_cultists", desc: "Cheap, expendable scouts who secure rear lines and screen your heavy armor." },
      { name: "Chaos Terminators", id: "csm_terminators", desc: "Heavy clad brutes armed with accursed weapons who can teleport straight into critical points." },
      { name: "Possessed", id: "csm_possessed", desc: "Daemoniacally mutated shock-infantry that sprint with fast movement and deal devastating wounds." },
      { name: "Obliterators", id: "csm_obliterators", desc: "Living warp-weapons that warp-strike and mutate their weapons to melt heavy infantry or tanks." },
      { name: "Warp Talons", id: "csm_warp_talons", desc: "Jetpack assassins that claw out of warpspace, slice up isolated squads, and escape immediately." },
      { name: "Venomcrawler", id: "csm_venomcrawler", desc: "A swift spider-construct that gains additional attacks with its soulflayer cannons as it kills enemies." }
    ],
    goldenRules: [
      "Choose your Dark Pact options carefully. Lethal Hits is better against high Toughness; Sustained Hits is better against crowds.",
      "Don't forget to take your Leadership tests at the end of the phase after using a Dark Pact."
    ],
    phaseTriggers: [
      { phase: "Command Phase", trigger: "Dark Offering", action: "Plan which Marks of Chaos and blessings will benefit your squads in the upcoming turns." },
      { phase: "Movement Phase", trigger: "Traitor Assault", action: "Move Chosen and Terminators into strike positions. Use transports like Rhinos to shelter troops." },
      { phase: "Shooting Phase", trigger: "Dark Pact (Shooting)", action: "Make a Dark Pact for Lethal Hits or Sustained Hits. Take a Leadership test afterward; fail means D3 wounds." },
      { phase: "Fight Phase", trigger: "Dark Pact (Melee)", action: "Make a Dark Pact in melee. Combined with Marks of Chaos, your units will shred enemy formations." }
    ]
  },
  astra_militarum: {
    difficulty: "Medium",
    starterProduct: "Combat Patrol: Astra Militarum",
    signatureUnits: [
      { name: "Cadian Shock Troops", id: "am_shock_troops", desc: "Standard disciplined grunts who capture and hold objectives dynamically (Sticky Objectives)." },
      { name: "Leman Russ Battle Tank", id: "am_leman_russ", desc: "Extremely tough, iconic main battle tank with highly versatile turret weapons." },
      { name: "Scout Sentinel", id: "am_scout_sentinel", desc: "A light walker that marks enemy targets, allowing artillery to ignore Indirect Fire penalties." },
      { name: "Lord Solar Leontus", id: "am_leontus", desc: "The supreme commander who generates extra Command Points and issues up to 3 orders to any unit." },
      { name: "Death Korps of Krieg", id: "am_krieg", desc: "Relentless troops who get stronger as they take casualties, and benefit from active medic support." },
      { name: "Bullgryns", id: "am_bullgryns", desc: "Abhuman shields equipped with heavy slabs that absorb high-impact enemy melee charges." },
      { name: "Basilisk", id: "am_basilisk", desc: "Incredible indirect-fire artillery that bombards and slows down enemy movement speeds." },
      { name: "Rogal Dorn Battle Tank", id: "am_rogal_dorn", desc: "A massive mid-weight fortress tank that reduces the damage of incoming heavy fire." },
      { name: "Kasrkin", id: "am_kasrkin", desc: "Elite special forces that can self-issue an extra command order at the start of the battle round." },
      { name: "Lord Castellan Creed", id: "am_creed", desc: "Issues up to two orders and lets you target nearby squads with tactical stratagems for 0 CP." }
    ],
    goldenRules: [
      "Use Scout Sentinels to mark targets for indirect artillery—this bypasses the hit penalty and increases accuracy.",
      "Ensure your Officers are always within 6\" of units to issue essential orders."
    ],
    phaseTriggers: [
      { phase: "Command Phase", trigger: "Voice of Command", action: "Officers issue Orders (e.g. Take Aim! for +1 Hit, Move! Move! Move! for +3\" movement)." },
      { phase: "Movement Phase", trigger: "Tactical Screening", action: "Position cheap infantry squads to form a physical wall, preventing enemies from reaching your heavy tanks." },
      { phase: "Shooting Phase", trigger: "Overwhelming Bombardment", action: "Unleash main battle cannons and indirect basilisks. Focus fire on marked targets." },
      { phase: "Fight Phase", trigger: "Hold the Line", action: "Melee is not your strength. Use Bullgryns to block chargers, and use fallback options when possible." }
    ]
  },
  adeptus_custodes: {
    difficulty: "Easy",
    starterProduct: "Combat Patrol: Adeptus Custodes",
    signatureUnits: [
      { name: "Custodian Guard", id: "cust_guard", desc: "Super-soldiers who can re-roll wound rolls and shoot twice once per game while holding objectives." },
      { name: "Allarus Custodians", id: "cust_allarus", desc: "Heavy terminator-armored warriors who can teleport out of combat and redeploy elsewhere." },
      { name: "Blade Champion", id: "cust_blade_champion", desc: "A combat specialist who allows his unit to re-roll charge rolls and strike first." },
      { name: "Trajann Valoris", id: "cust_trajann", desc: "The Captain-General! Ignores any stat-modifying rules from enemies and fights with legendary skill." },
      { name: "Custodian Wardens", id: "cust_wardens", desc: "Defensive bodyguards who can activate a 4+ Feel No Pain save once per game." },
      { name: "Prosecutors", id: "cust_prosecutors", desc: "Sisters of Silence squads that hunt down and shut down enemy psychic squads." },
      { name: "Vertus Praetors", id: "cust_vertus_praetors", desc: "Elite warriors on jetbikes who fly over the battlefield and launch rapid-fire rocket salvos." },
      { name: "Caladius Grav-Tank", id: "cust_caladius", desc: "A heavy anti-tank hover vehicle that can shred heavy enemy monsters and tanks from afar." },
      { name: "Telemon Dreadnought", id: "cust_telemon", desc: "An ancient colossal walker that wields massive heavy weapons and absorbs high-impact damage." },
      { name: "Witchseekers", id: "cust_witchseekers", desc: "Sisters of Silence armed with flamers that set psychic foes ablaze and scout ahead during deployment." }
    ],
    goldenRules: [
      "Every Custodian is precious—keep them in cover and utilize defensive stratagems to prevent casualties.",
      "Focus on scoring objectives; your individual models have high Objective Control (OC 3)."
    ],
    phaseTriggers: [
      { phase: "Command Phase", trigger: "Stance Coordination", action: "Plan your strategy. Prepare defensive stances to survive incoming firepower." },
      { phase: "Movement Phase", trigger: "Defensive March", action: "Move into central objectives. Focus on cover and position yourself for short, guaranteed charges." },
      { phase: "Shooting Phase", trigger: "Auramite Fire", action: "Custodes hit on 2+. Use guardian spears to thin out screening infantry before charging." },
      { phase: "Fight Phase", trigger: "Martial Ka’tah Activation", action: "Activate Martial Ka'tah: select Sustained Hits 1 (Dacatarai) or Lethal Hits (Kaelor) for maximum damage." }
    ]
  }
};

const FACTION_CHECKLIST_REMINDERS: Record<string, { cmd: string; mov: string; sho: string; fgt: string }> = {
  space_marines: {
    cmd: "Oath of Moment: Select one enemy unit to re-roll hits against.",
    mov: "Doctrines check: Choose active doctrine (Devastator, Tactical, or Assault).",
    sho: "Focus fire: Target the designated Oath of Moment unit.",
    fgt: "Defensive: Prepare Armor of Contempt (1 CP) to ignore enemy AP."
  },
  tyranids: {
    cmd: "Synapse Check: Units within 6\" roll 3D6 for Battle-shock tests. Shadow in the Warp ready?",
    mov: "Swarms: Advance cheap Gaunts to screen monstrous bio-beasts.",
    sho: "Adaptation: Apply selected Hyper-Adaptations.",
    fgt: "Melee: Charge with Screamer-Killers or Carnifexes for impact buffs."
  },
  necrons: {
    cmd: "Reanimation Protocols: Active protocols to restore lost wounds/models (D3 or D6).",
    mov: "Relentless march: Guard Nobles and sit slow models on mid-field markers.",
    sho: "Command Buff: Ensure squads led by characters get their +1 to hit.",
    fgt: "Resilience: Keep Chronomancers close to trigger post-shooting movements."
  },
  aeldari: {
    cmd: "Fate Dice: Inspect current pool and plan substitution rolls.",
    mov: "Slippery: Position fast hover skimmers; ready Phantasm (1 CP) if threatened.",
    sho: "Strands of Fate: Substitute a high-impact Fate die for guaranteed hits or damage.",
    fgt: "Aspect strike: Charge with specialized elite melee units, then retreat."
  },
  orks: {
    cmd: "The Waaagh!: Decide if you will declare the Waaagh! round (Grants +1 Str/Atk, 5+ Invul).",
    mov: "Trukks: Disembark Boyz and prepare for close-range charges.",
    sho: "Dakka: Fire weapons but focus entirely on reaching engagement range.",
    fgt: "Greenskin tide: Roll huge dice pools in melee under Waaagh! strength."
  },
  chaos_space_marines: {
    cmd: "Dark Blessings: Assess Mark alignments (Tzeentch, Nurgle, Khorne, etc.).",
    mov: "Corridor check: Position Chosen or Terminators for fast charges.",
    sho: "Dark Pact: Trigger Pact for Lethal or Sustained Hits; prepare end-of-phase Ld test.",
    fgt: "Slay: Roll melee attacks under Dark Pact influence; test Ld to avoid mortal wounds."
  },
  astra_militarum: {
    cmd: "Voice of Command: Issue Orders to Regiment/Squadron units within 6\".",
    mov: "Screening: Guard heavy Leman Russ or Basilisk formations with physical infantry blocks.",
    sho: "Daring Recon: Use Scout Sentinels to mark targets to ignore indirect-fire penalties.",
    fgt: "Hold the line: Position tough Bullgryns to tank enemy close combat hits."
  },
  adeptus_custodes: {
    cmd: "Ka'tah choice: Select active stance (Dacatarai, Kaelor, or Rendax).",
    mov: "Auramite shield: Walk elite models strictly through obscuring terrain/cover.",
    sho: "Spear fire: Fire high-precision 2+ shots to chip screens.",
    fgt: "Demigods: Strike first or trigger Martial Ka'tah modifiers to shred heavy targets."
  }
};

export default function FactionBrowser() {
  const [selectedFactionId, setSelectedFactionId] = useState<string>(FACTIONS[0].id);
  const [selectedTab, setSelectedTab] = useState<"rules" | "stratagems" | "cards" | "glossary" | "hobby" | "coreRules">("rules");
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [glossarySearch, setGlossarySearch] = useState<string>("");
  const [activeGlossaryTerm, setActiveGlossaryTerm] = useState<{ keyword: string; explanation: string; type: string } | null>(null);

  // Stratagems tab specific state
  const [stratSearchQuery, setStratSearchQuery] = useState<string>("");
  const [stratTypeFilter, setStratTypeFilter] = useState<"all" | "faction" | "core">("all");
  const [stratPhaseFilter, setStratPhaseFilter] = useState<string>("all");
  const [stratCpFilter, setStratCpFilter] = useState<string>("all");
  const [sandboxCp, setSandboxCp] = useState<number>(3);
  const [sandboxLog, setSandboxLog] = useState<string[]>([
    "System active: ready for tactical simulation. Command Points set to 3."
  ]);

  // Detachment Simulator state
  const [selectedDoctrine, setSelectedDoctrine] = useState<string>("devastator");
  const [selectedAdaptation, setSelectedAdaptation] = useState<string>("swarming");
  const [necronBodyguard, setNecronBodyguard] = useState<string>("warriors");
  const [necronReanimRoll, setNecronReanimRoll] = useState<number | null>(null);
  const [fateDicePool, setFateDicePool] = useState<number[]>([6, 5, 4, 3, 2, 1]);
  const [orkWaaaghActive, setOrkWaaaghActive] = useState<boolean>(false);
  const [csmPact, setCsmPact] = useState<string>("devastating");
  const [csmTestResult, setCsmTestResult] = useState<{ roll: number; passed: boolean; wounds?: number } | null>(null);
  const [guardOrder, setGuardOrder] = useState<string>("aim");
  const [custodesStance, setCustodesStance] = useState<string>("dacatarai");
  const [detachmentLogs, setDetachmentLogs] = useState<string[]>([]);

  // Painting Tracker State (Feature 2)
  const [paintingSquads, setPaintingSquads] = useState<{ id: string; name: string; factionId: string; status: "Grey" | "Primed" | "BattleReady" | "ParadeReady" }[]>(() => {
    try {
      const saved = localStorage.getItem("recruits_painting_squads");
      return saved ? JSON.parse(saved) : [
        { id: "1", name: "Intercessor Bodyguards", factionId: "space_marines", status: "Primed" },
        { id: "2", name: "Termagant Brood", factionId: "tyranids", status: "Grey" },
        { id: "3", name: "Necron Royal Guards", factionId: "necrons", status: "BattleReady" }
      ];
    } catch {
      return [];
    }
  });
  const [newSquadName, setNewSquadName] = useState<string>("");

  const saveSquads = (squads: typeof paintingSquads) => {
    setPaintingSquads(squads);
    localStorage.setItem("recruits_painting_squads", JSON.stringify(squads));
  };

  // Quiz State
  const [quizActive, setQuizActive] = useState<boolean>(false);
  const [quizStep, setQuizStep] = useState<number>(0);
  const [quizAnswers, setQuizAnswers] = useState<string[]>([]);
  const [expandedCodexUnitIds, setExpandedCodexUnitIds] = useState<string[]>([]);

  // MathHammer State variables
  const [mhAttacks, setMhAttacks] = useState<number>(10);
  const [mhBs, setMhBs] = useState<number>(3); // default 3+
  const [mhWound, setMhWound] = useState<number>(4); // default 4+
  const [mhRerollHit, setMhRerollHit] = useState<"none" | "ones" | "all">("none");
  const [mhRerollWound, setMhRerollWound] = useState<"none" | "ones" | "all">("none");
  const [mhSustained, setMhSustained] = useState<boolean>(false);
  const [mhLethal, setMhLethal] = useState<boolean>(false);
  const [mhResults, setMhResults] = useState<{
    hitRolls: number[];
    woundRolls: number[];
    hits: number;
    wounds: number;
    autoWounds: number;
    sustainedHits: number;
    expectedHits: number;
    expectedWounds: number;
  } | null>(null);

  // Turn Checklist State (keyed by faction ID)
  const [checklist, setChecklist] = useState<Record<string, { cmd: boolean; mov: boolean; sho: boolean; fgt: boolean }>>({
    space_marines: { cmd: false, mov: false, sho: false, fgt: false },
    tyranids: { cmd: false, mov: false, sho: false, fgt: false },
    necrons: { cmd: false, mov: false, sho: false, fgt: false },
    aeldari: { cmd: false, mov: false, sho: false, fgt: false },
    orks: { cmd: false, mov: false, sho: false, fgt: false },
    chaos_space_marines: { cmd: false, mov: false, sho: false, fgt: false },
    astra_militarum: { cmd: false, mov: false, sho: false, fgt: false },
    adeptus_custodes: { cmd: false, mov: false, sho: false, fgt: false },
  });

  const toggleChecklistItem = (factionId: string, phase: "cmd" | "mov" | "sho" | "fgt") => {
    setChecklist(prev => ({
      ...prev,
      [factionId]: {
        ...prev[factionId],
        [phase]: !prev[factionId]?.[phase]
      }
    }));
  };

  const resetChecklist = (factionId: string) => {
    setChecklist(prev => ({
      ...prev,
      [factionId]: { cmd: false, mov: false, sho: false, fgt: false }
    }));
  };

  const runMathHammer = () => {
    const hitRolls: number[] = [];
    const woundRolls: number[] = [];
    let hits = 0;
    let autoWounds = 0;
    let sustainedHits = 0;

    // Simulate Hits
    for (let i = 0; i < mhAttacks; i++) {
      let roll = Math.floor(Math.random() * 6) + 1;
      let finalRoll = roll;

      // Handle hit re-rolls
      if (
        (mhRerollHit === "ones" && roll === 1) ||
        (mhRerollHit === "all" && roll < mhBs)
      ) {
        roll = Math.floor(Math.random() * 6) + 1;
        finalRoll = roll;
      }

      hitRolls.push(finalRoll);

      if (finalRoll >= mhBs || (mhLethal && finalRoll === 6)) {
        if (mhLethal && finalRoll === 6) {
          autoWounds++;
          hits++; // Counted as hit
        } else if (finalRoll >= mhBs) {
          hits++;
        }

        if (mhSustained && finalRoll === 6) {
          sustainedHits++;
        }
      }
    }

    // Add sustained hits to hit count
    const totalHitsForWound = hits + sustainedHits - autoWounds;

    // Simulate Wounds
    for (let i = 0; i < totalHitsForWound; i++) {
      let roll = Math.floor(Math.random() * 6) + 1;
      let finalRoll = roll;

      // Handle wound re-rolls
      if (
        (mhRerollWound === "ones" && roll === 1) ||
        (mhRerollWound === "all" && roll < mhWound)
      ) {
        roll = Math.floor(Math.random() * 6) + 1;
        finalRoll = roll;
      }

      woundRolls.push(finalRoll);
    }

    const manualWounds = woundRolls.filter(r => r >= mhWound).length;
    const totalWounds = manualWounds + autoWounds;

    // Expected Values calculation
    let hitProb = (7 - mhBs) / 6;
    if (mhRerollHit === "ones") {
      hitProb = hitProb + (1/6) * hitProb;
    } else if (mhRerollHit === "all") {
      hitProb = hitProb + (1 - hitProb) * hitProb;
    }

    let expHits = mhAttacks * hitProb;
    let expSustained = 0;
    if (mhSustained) {
      let critProb = 1/6;
      if (mhRerollHit === "ones") {
        critProb = critProb + (1/6) * (1/6);
      } else if (mhRerollHit === "all") {
        critProb = critProb + (1 - hitProb) * (1/6);
      }
      expSustained = mhAttacks * critProb;
    }

    let expAutoWound = 0;
    if (mhLethal) {
      let critProb = 1/6;
      if (mhRerollHit === "ones") {
        critProb = critProb + (1/6) * (1/6);
      } else if (mhRerollHit === "all") {
        critProb = critProb + (1 - hitProb) * (1/6);
      }
      expAutoWound = mhAttacks * critProb;
    }

    let woundProb = (7 - mhWound) / 6;
    if (mhRerollWound === "ones") {
      woundProb = woundProb + (1/6) * woundProb;
    } else if (mhRerollWound === "all") {
      woundProb = woundProb + (1 - woundProb) * woundProb;
    }

    const expTotalHits = expHits + expSustained;
    const expManualHits = expTotalHits - expAutoWound;
    const expWounds = (expManualHits * woundProb) + expAutoWound;

    setMhResults({
      hitRolls,
      woundRolls,
      hits: hits + sustainedHits,
      wounds: totalWounds,
      autoWounds,
      sustainedHits,
      expectedHits: Math.round(expTotalHits * 100) / 100,
      expectedWounds: Math.round(expWounds * 100) / 100
    });
  };

  const activeFaction = FACTIONS.find(f => f.id === selectedFactionId) || FACTIONS[0];

  const filteredCards = activeFaction.units.filter(unit => 
    unit.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    unit.keywords.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Quiz Questions Data
  const quizQuestions = [
    {
      title: "What style of warfare do you prefer on the table?",
      options: [
        { text: "Tactical Adaptability: Elite heavy armor, versatile weapons, solid stats for all situations", faction: "space_marines" },
        { text: "Aggressive Biological Rush: Overwhelming enemy lines with massive beasts and swarms", faction: "tyranids" },
        { text: "Resilient Undead Phalanx: Slow, unyielding metal armies that relentlessly rise from the grave", faction: "necrons" },
        { text: "Lightning Speed & Finesse: Fragile psychic space-elves striking from shadows with elite skills", faction: "aeldari" }
      ]
    },
    {
      title: "What is your main hobby & painting priority?",
      options: [
        { text: "Elite Strike Team: Fewer models to build and paint, very beginner-friendly", faction: "space_marines" },
        { text: "Organic Alien Threat: Fun organic skins, sharp claws, teeth, and glowing venom glands", faction: "tyranids" },
        { text: "Metallic Ancient Legions: Extremely easy to paint quickly with metallic paints and washes", faction: "necrons" },
        { text: "Intricate Elegant Crafts: Beautiful, high-detail specialized miniatures with elegant energy weapons", faction: "aeldari" }
      ]
    },
    {
      title: "Which core tactical mechanism excites you the most?",
      options: [
        { text: "Dynamic Combat Doctrines: Deciding each turn when to Advance and Shoot, Fall Back, or Charge", faction: "space_marines" },
        { text: "Synapse Command Network: Striking terror into enemies and controlling giant bio-weapons", faction: "tyranids" },
        { text: "Reanimation Engines: Watching dead skeletons reconstruct themselves back onto active objective markers", faction: "necrons" },
        { text: "Fate Manipulation: Pre-rolling your dice pools and substituting critical values at perfect moments", faction: "aeldari" }
      ]
    }
  ];

  const handleQuizAnswer = (faction: string) => {
    const nextAnswers = [...quizAnswers, faction];
    setQuizAnswers(nextAnswers);
    if (quizStep < quizQuestions.length - 1) {
      setQuizStep(quizStep + 1);
    } else {
      // Calculate recommended faction
      const counts: Record<string, number> = {};
      let recommended = "space_marines";
      let maxCount = 0;
      nextAnswers.forEach(f => {
        counts[f] = (counts[f] || 0) + 1;
        if (counts[f] > maxCount) {
          maxCount = counts[f];
          recommended = f;
        }
      });
      setSelectedFactionId(recommended);
      setQuizStep(quizStep + 1); // Go to results step
    }
  };

  const resetQuiz = () => {
    setQuizStep(0);
    setQuizAnswers([]);
    setQuizActive(false);
  };

  const glossaryItems = [
    {
      keyword: "Warlord",
      type: "Core Command Rule",
      explanation: "Designating exactly one of your Characters as your supreme Warlord is MANDATORY! It represents your army's general on the field. While losing your Warlord doesn't incur instant penalties, keeping them alive protects your strategy and prevents enemy secondary objectives from scoring bonus VP for assassinating them."
    },
    {
      keyword: "Assault",
      type: "Weapon Keyword",
      explanation: "Can be shot even if this unit has Advanced in this turn. Normally, units that Advance cannot shoot at all!"
    },
    {
      keyword: "Heavy",
      type: "Weapon Keyword",
      explanation: "Add +1 to the Hit Roll if this unit remained stationary (did not move in any way) during the preceding Movement phase."
    },
    {
      keyword: "Rapid Fire [X]",
      type: "Weapon Keyword",
      explanation: "If the target is within half of this weapon's maximum range, the weapon scores [X] additional attacks (e.g., Bolt Rifle Rapid Fire 1 gets 1 extra shot)."
    },
    {
      keyword: "Blast",
      type: "Weapon Keyword",
      explanation: "Designed to shatter large hordes. For every 5 models in the target unit, add +1 attack to this weapon. Cannot be shot in close engagement melee combat."
    },
    {
      keyword: "Lethal Hits",
      type: "Weapon Keyword",
      explanation: "A natural Hit Roll of a '6' automatically succeeds in wounding the target. You skip rolling the 'To Wound' dice entirely for that attack!"
    },
    {
      keyword: "Sustained Hits [X]",
      type: "Weapon Keyword",
      explanation: "A natural Hit Roll of a '6' scores [X] additional hits. You still need to make separate 'To Wound' rolls for each of these bonus hits."
    },
    {
      keyword: "Devastating Wounds",
      type: "Weapon Keyword",
      explanation: "A natural Wound Roll of a '6' inflicts damage directly without allowing any armor or invulnerable saves. The target must take Feel No Pain saves if they have them, otherwise they take the damage straight away."
    },
    {
      keyword: "Anti-[X] [Y]+",
      type: "Weapon Keyword",
      explanation: "Each time an attack is made targeting a unit with the [X] keyword, an unmodified Wound Roll of [Y]+ is always a Critical Wound (automatically wounds) regardless of Toughness."
    },
    {
      keyword: "Torrent",
      type: "Weapon Keyword",
      explanation: "These weapons (like flamethrowers) automatically hit. Skip the 'To Hit' roll completely! Start straight at the 'To Wound' sequence."
    },
    {
      keyword: "Pistol",
      type: "Weapon Keyword",
      explanation: "Can be fired even if this unit is locked in close combat engagement range with an enemy unit. Must target that enemy unit."
    },
    {
      keyword: "Hazardous",
      type: "Weapon Keyword",
      explanation: "Powerful but unstable. After shooting, roll a D6 for each hazardous weapon used. On a 1, a model in the unit suffers 3 mortal wounds (or is destroyed if they have 3 or fewer wounds)!"
    },
    {
      keyword: "Deep Strike",
      type: "Ability Keyword",
      explanation: "This unit can be kept in reserve instead of setting up on the table. At the end of any of your Movement phases, set them up anywhere on the battlefield that is more than 9\" away from all enemy models."
    },
    {
      keyword: "Infiltrators",
      type: "Ability Keyword",
      explanation: "During deployment, this unit can be set up anywhere on the board that is more than 9\" away from the opponent's deployment zone and any enemy models."
    },
    {
      keyword: "Feel No Pain [X]+",
      type: "Ability Keyword",
      explanation: "A special shrug-off roll. Each time this model loses a wound, roll a D6. On an unmodified [X]+, that wound is not lost. This is taken AFTER failed armor or invulnerable saves."
    },
    {
      keyword: "Lone Operative",
      type: "Ability Keyword",
      explanation: "This model cannot be targeted by ranged attacks unless the attacking model is within 12\". Perfect for squishy support characters!"
    },
    {
      keyword: "Stealth",
      type: "Ability Keyword",
      explanation: "Hard to hit. Each time a ranged attack is made targeting this unit, subtract 1 from the enemy's Hit Roll."
    }
  ];

  const unitRoles = [
    { name: "Character", icon: "★", desc: "A powerful leader or champion. Can be designated as your Warlord and can 'attach' to other squads to grant them massive buffs and abilities." },
    { name: "Battleline", icon: "🛡️", desc: "The core troops of your army. They have higher Objective Control (OC) stats, and you can take up to 6 squads in your army roster instead of the standard limit of 3 copies." },
    { name: "Infantry", icon: "👣", desc: "Foot soldiers who can easily scale ruins, pass through walls of ruins, and gain Cover easily behind barricades and windows." },
    { name: "Vehicle & Monster", icon: "⚙️", desc: "Huge tanks or massive beasts. They have incredible stats but cannot move through ruin walls. They can shoot even while locked in close combat using 'Big Guns Never Tire'." }
  ];

  const filteredGlossary = glossaryItems.filter(item => 
    item.keyword.toLowerCase().includes(glossarySearch.toLowerCase()) ||
    item.explanation.toLowerCase().includes(glossarySearch.toLowerCase()) ||
    item.type.toLowerCase().includes(glossarySearch.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6" id="faction-browser">
      {/* 2-MIN QUICK RECRUITMENT QUIZ TRIGGER BANNER */}
      {!quizActive ? (
        <div className="bg-gradient-to-r from-amber-600/25 to-slate-900 border border-amber-500/30 rounded-2xl p-4.5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500 text-slate-950 rounded-xl animate-pulse">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-100">Not sure which faction is right for you?</h4>
              <p className="text-xs text-gray-400 mt-0.5">Take our interactive 2-minute playstyle recruiter quiz!</p>
            </div>
          </div>
          <button
            onClick={() => {
              setQuizActive(true);
              setQuizStep(0);
              setQuizAnswers([]);
            }}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer active:scale-95 transition shrink-0"
          >
            Start Recruitment Quiz
          </button>
        </div>
      ) : (
        <div className="bg-slate-900 border border-amber-500/50 rounded-2xl p-6 shadow-xl flex flex-col gap-4 animate-fade-in" id="quiz-block">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <span className="text-xs font-bold text-amber-400 font-mono tracking-wider flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-amber-500" />
              <span>RECRUITMENT MATCHER QUIZ</span>
            </span>
            <button
              onClick={resetQuiz}
              className="text-[10px] bg-slate-950 hover:bg-slate-850 text-gray-400 px-2 py-1 rounded border border-slate-800 transition"
            >
              Exit Quiz
            </button>
          </div>

          {quizStep < quizQuestions.length ? (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold bg-amber-500/10 border border-amber-500/30 text-amber-400 px-2 py-0.5 rounded-full">
                  Step {quizStep + 1} of {quizQuestions.length}
                </span>
                <div className="flex-1 bg-slate-950 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full transition-all duration-300" style={{ width: `${((quizStep) / quizQuestions.length) * 100}%` }} />
                </div>
              </div>

              <h3 className="text-sm font-bold text-slate-100">{quizQuestions[quizStep].title}</h3>

              <div className="grid grid-cols-1 gap-2.5 mt-1">
                {quizQuestions[quizStep].options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleQuizAnswer(opt.faction)}
                    className="w-full bg-slate-950 hover:bg-slate-850 border border-slate-850 hover:border-amber-500/40 text-left p-4.5 rounded-xl transition text-xs text-gray-300 flex items-center justify-between group active:scale-98"
                  >
                    <span>{opt.text}</span>
                    <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-amber-400 transition" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-4 flex flex-col gap-4">
              <div className="w-12 h-12 bg-amber-500/10 text-amber-400 rounded-full flex items-center justify-center mx-auto border border-amber-500/30 text-xl font-bold">
                ✓
              </div>
              <div>
                <h3 className="text-md font-bold text-slate-100">Recruitment Match Complete!</h3>
                <p className="text-xs text-gray-400 mt-1">
                  Based on your tactical preferences, we highly recommend initiating your war campaign with:
                </p>
                <div className="text-lg font-black text-amber-400 font-mono mt-3 uppercase tracking-wider bg-slate-950/60 py-3.5 border border-slate-800 rounded-xl max-w-md mx-auto">
                  {FACTIONS.find(f => f.id === selectedFactionId)?.name}
                </div>
              </div>

              <div className="flex gap-2 justify-center mt-3">
                <button
                  onClick={resetQuiz}
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold px-5 py-2.5 rounded-xl cursor-pointer transition active:scale-95"
                >
                  Explore This Faction
                </button>
                <button
                  onClick={() => {
                    setQuizStep(0);
                    setQuizAnswers([]);
                  }}
                  className="bg-slate-950 hover:bg-slate-850 border border-slate-800 text-gray-300 text-xs font-bold px-5 py-2.5 rounded-xl cursor-pointer transition active:scale-95"
                >
                  Retake Quiz
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Faction Selection List - Horizontal scroll on mobile */}
      <div className="flex flex-col gap-2">
        <label className="text-[10px] font-bold text-stone-500 tracking-widest uppercase font-mono">SELECT ARMY DETACHMENT</label>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none snap-x" id="faction-list">
          {FACTIONS.map(faction => (
            <button
              key={faction.id}
              id={`faction-btn-${faction.id}`}
              onClick={() => {
                setSelectedFactionId(faction.id);
                setSelectedCardId(null);
                setSearchQuery("");
                if (quizActive) setQuizActive(false); // Close quiz when selecting manually
              }}
              className={`flex items-center gap-2.5 px-4.5 py-3 rounded-lg border text-xs font-bold uppercase font-display tracking-widest transition-all duration-200 shrink-0 snap-start active:scale-95 cursor-pointer ${
                selectedFactionId === faction.id && !quizActive
                  ? "bg-amber-500/10 border-amber-500 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.1)]"
                  : "bg-grim-card border-grim-border text-stone-400 hover:text-stone-200 hover:border-stone-800"
              }`}
            >
              {getFactionIcon(faction.iconName)}
              <span>{faction.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Faction Header & Lore */}
      <div className="bg-grim-card border border-grim-border rounded-xl p-5 shadow-xl flex flex-col gap-3" id="faction-header">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-grim-dark border border-grim-border rounded-lg shadow-inner">
            {getFactionIcon(activeFaction.iconName)}
          </div>
          <div>
            <h2 className="text-base font-bold text-stone-100 font-display uppercase tracking-widest leading-none">{activeFaction.name}</h2>
            <span className="text-[9px] text-amber-500 font-mono tracking-widest uppercase block mt-1">IMPERIAL DATABANK FILE</span>
          </div>
        </div>
        <p className="text-xs text-stone-400 leading-relaxed font-sans">{activeFaction.description}</p>
      </div>

      {/* Local Navigation Tabs */}
      <div className="flex border-b border-grim-border overflow-x-auto scrollbar-none" id="faction-tabs">
        <button
          id="tab-rules"
          onClick={() => setSelectedTab("rules")}
          className={`flex-1 py-3 text-center text-xs font-bold font-display uppercase tracking-wider border-b-2 transition-all duration-200 shrink-0 min-w-[125px] cursor-pointer ${
            selectedTab === "rules"
              ? "border-amber-500 text-amber-400 bg-amber-500/5"
              : "border-transparent text-stone-500 hover:text-stone-300"
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <Layers className="w-3.5 h-3.5" />
            <span>Army Rules</span>
          </div>
        </button>
        <button
          id="tab-stratagems"
          onClick={() => setSelectedTab("stratagems")}
          className={`flex-1 py-3 text-center text-xs font-bold font-display uppercase tracking-wider border-b-2 transition-all duration-200 shrink-0 min-w-[125px] cursor-pointer ${
            selectedTab === "stratagems"
              ? "border-amber-500 text-amber-400 bg-amber-500/5"
              : "border-transparent text-stone-500 hover:text-stone-300"
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <Target className="w-3.5 h-3.5" />
            <span>Stratagems</span>
          </div>
        </button>
        <button
          id="tab-cards"
          onClick={() => setSelectedTab("cards")}
          className={`flex-1 py-3 text-center text-xs font-bold font-display uppercase tracking-wider border-b-2 transition-all duration-200 shrink-0 min-w-[125px] cursor-pointer ${
            selectedTab === "cards"
              ? "border-amber-500 text-amber-400 bg-amber-500/5"
              : "border-transparent text-stone-500 hover:text-stone-300"
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <Swords className="w-3.5 h-3.5" />
            <span>Datacards ({activeFaction.units.length})</span>
          </div>
        </button>
        <button
          id="tab-glossary"
          onClick={() => setSelectedTab("glossary")}
          className={`flex-1 py-3 text-center text-xs font-bold font-display uppercase tracking-wider border-b-2 transition-all duration-200 shrink-0 min-w-[125px] cursor-pointer ${
            selectedTab === "glossary"
              ? "border-amber-500 text-amber-400 bg-amber-500/5"
              : "border-transparent text-stone-500 hover:text-stone-300"
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Core Glossary</span>
          </div>
        </button>
        <button
          id="tab-core-rules"
          onClick={() => setSelectedTab("coreRules")}
          className={`flex-1 py-3 text-center text-xs font-bold font-display uppercase tracking-wider border-b-2 transition-all duration-200 shrink-0 min-w-[125px] cursor-pointer ${
            selectedTab === "coreRules"
              ? "border-amber-500 text-amber-400 bg-amber-500/5"
              : "border-transparent text-stone-500 hover:text-stone-300"
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <Book className="w-3.5 h-3.5" />
            <span>Core Rules</span>
          </div>
        </button>
        <button
          id="tab-hobby"
          onClick={() => setSelectedTab("hobby")}
          className={`flex-1 py-3 text-center text-xs font-bold font-display uppercase tracking-wider border-b-2 transition-all duration-200 shrink-0 min-w-[125px] cursor-pointer ${
            selectedTab === "hobby"
              ? "border-amber-500 text-amber-400 bg-amber-500/5"
              : "border-transparent text-stone-500 hover:text-stone-300"
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-500/80" />
            <span>Hobby Corner</span>
          </div>
        </button>
      </div>

      {/* TAB CONTENT: RULES & STRATAGEMS */}
      {selectedTab === "coreRules" && (() => {
        const guide = BEGINNER_FACTION_GUIDES[activeFaction.id] || BEGINNER_FACTION_GUIDES.space_marines;
        const diffColors = {
          Easy: "bg-emerald-950 text-emerald-400 border-emerald-800",
          Medium: "bg-amber-950 text-amber-400 border-amber-800",
          Hard: "bg-red-950 text-red-400 border-red-800"
        }[guide.difficulty];

        return (
          <div className="flex flex-col gap-6 animate-fade-in" id="core-rules-content">
            {/* 1. Faction Primer / Header */}
            <div className="bg-grim-card border border-grim-border rounded-xl p-5 shadow-xl flex flex-col gap-4">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-grim-border/50 pb-3 gap-3">
                <div className="flex items-center gap-2.5">
                  <Book className="w-5 h-5 text-amber-500" />
                  <h3 className="text-md font-bold text-stone-100 font-display uppercase tracking-wider">
                    {activeFaction.name} - Recruit Codex Guide
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-stone-400 uppercase tracking-widest font-mono">Difficulty:</span>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded border font-mono ${diffColors}`}>
                    {guide.difficulty}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Playstyle card */}
                <div className="lg:col-span-2 bg-slate-950/60 border border-slate-900/80 rounded-xl p-4 flex flex-col gap-2">
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest font-mono flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-amber-500/80" />
                    Strategic Playstyle
                  </span>
                  <p className="text-xs text-stone-300 leading-relaxed font-sans">
                    {activeFaction.overview?.playstyle || "Versatile and adaptable gameplay suited for any tactical skirmish."}
                  </p>
                  <div className="mt-3 pt-3 border-t border-slate-900/60 text-[11px] text-stone-400">
                    <span className="font-bold text-stone-200">Recommended Starter Set: </span>
                    <span className="text-amber-500/90 font-mono">{guide.starterProduct}</span>
                  </div>
                </div>

                {/* Pros and Cons */}
                <div className="bg-slate-950/60 border border-slate-900/80 rounded-xl p-4 flex flex-col gap-3">
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest font-mono">
                    Army Pros & Cons
                  </span>
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-wider font-mono">Core Strengths:</span>
                      <ul className="space-y-1">
                        {(activeFaction.overview?.strengths || ["Durable models", "High mobility"]).map((str, index) => (
                          <li key={index} className="text-[11px] text-stone-300 flex items-start gap-1.5">
                            <span className="text-emerald-500 font-mono text-xs select-none">✓</span>
                            <span>{str}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex flex-col gap-1 pt-1.5 border-t border-slate-900/60">
                      <span className="text-[9px] font-bold text-red-400 uppercase tracking-wider font-mono">Core Weaknesses:</span>
                      <ul className="space-y-1">
                        {(activeFaction.overview?.weaknesses || ["Expensive points characteristic", "Fragile core"]).map((weak, index) => (
                          <li key={index} className="text-[11px] text-stone-300 flex items-start gap-1.5">
                            <span className="text-red-500 font-mono text-xs select-none">✗</span>
                            <span>{weak}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Phase-by-Phase Interactive Guide */}
            <div className="bg-grim-card border border-grim-border rounded-xl p-5 shadow-xl flex flex-col gap-4">
              <div className="border-b border-grim-border/50 pb-2">
                <h4 className="text-xs font-bold text-stone-100 uppercase tracking-widest font-display">
                  Phase-by-Phase Battle Synergy Guide
                </h4>
                <p className="text-[11px] text-stone-500 font-mono mt-0.5">
                  Follow this flow during your games to apply optimal tactical rules for your army.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { 
                    phase: "Command Phase", 
                    core: "Gain 1 Command Point (CP), perform Battle-shock tests for any friendly units below Half-Strength, and resolve start-of-turn abilities.",
                    iconName: "Award",
                    accent: "text-amber-400"
                  },
                  { 
                    phase: "Movement Phase", 
                    core: "Move your units normal distances, or choose to Advance (+1D6\" but cannot shoot/charge) or Fall Back out of close combat engagements.",
                    iconName: "Layers",
                    accent: "text-sky-400"
                  },
                  { 
                    phase: "Shooting Phase", 
                    core: "Select units to fire ranged weapons at visible enemy targets. Check range, roll to hit, roll to wound, and opponent makes armor saves.",
                    iconName: "Target",
                    accent: "text-orange-400"
                  },
                  { 
                    phase: "Charge & Fight Phase", 
                    core: "Declare charges within 12\" (requires 2D6 roll), then engage in melee. Alternating activation: units that charged strike first.",
                    iconName: "Swords",
                    accent: "text-red-400"
                  }
                ].map((ph, idx) => {
                  const matchingTrigger = guide.phaseTriggers.find(t => t.phase.includes(ph.phase.split(" ")[0]));
                  return (
                    <div key={idx} className="bg-slate-950/80 border border-slate-900 rounded-xl p-4 flex flex-col gap-3 justify-between">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2">
                          {ph.phase === "Command Phase" && <Award className="w-4 h-4 text-amber-500" />}
                          {ph.phase === "Movement Phase" && <Layers className="w-4 h-4 text-sky-400" />}
                          {ph.phase === "Shooting Phase" && <Target className="w-4 h-4 text-orange-400" />}
                          {ph.phase === "Charge & Fight Phase" && <Swords className="w-4 h-4 text-red-400" />}
                          <h5 className={`text-xs font-black uppercase font-display tracking-wider ${ph.accent}`}>{ph.phase}</h5>
                        </div>
                        <p className="text-[11px] text-stone-400 leading-relaxed bg-black/30 p-2 border border-slate-900 rounded font-sans">
                          <span className="font-bold text-stone-300">Core Rule: </span>{ph.core}
                        </p>
                      </div>

                      {matchingTrigger && (
                        <div className="bg-amber-500/5 border border-amber-500/10 rounded-lg p-2.5 flex flex-col gap-1">
                          <div className="flex items-center gap-1.5">
                            <Zap className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider font-mono">
                              {matchingTrigger.trigger}
                            </span>
                          </div>
                          <p className="text-xs text-stone-200 font-sans leading-relaxed">
                            {matchingTrigger.action}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 4. Turn Checklist and MathHammer Dice Simulator */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {/* Turn Checklist Card */}
              <div className="bg-grim-card border border-grim-border rounded-xl p-5 shadow-xl flex flex-col justify-between gap-4">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between border-b border-grim-border/50 pb-2">
                    <div className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-emerald-400" />
                      <h4 className="text-xs font-bold text-stone-100 uppercase tracking-widest font-display">
                        Active Combat Round Checklist
                      </h4>
                    </div>
                    <button
                      onClick={() => resetChecklist(activeFaction.id)}
                      className="flex items-center gap-1.5 text-[10px] text-stone-400 hover:text-amber-400 font-mono uppercase bg-slate-950 border border-slate-900 rounded px-2.5 py-1 transition-all duration-150 cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Reset Round</span>
                    </button>
                  </div>
                  <p className="text-[11px] text-stone-500 font-mono">
                    Track your phases in real time during battles to never miss crucial {activeFaction.name} strategies.
                  </p>

                  <div className="flex flex-col gap-2.5 mt-2">
                    {[
                      {
                        key: "cmd",
                        title: "Command Phase",
                        core: "Score primary & secondary, gain 1 CP, roll Battle-shock.",
                        color: "border-amber-500/20 hover:border-amber-500/40"
                      },
                      {
                        key: "mov",
                        title: "Movement Phase",
                        core: "Move models normal distance, Advance (+1D6\"), or Fall Back.",
                        color: "border-sky-500/20 hover:border-sky-500/40"
                      },
                      {
                        key: "sho",
                        title: "Shooting Phase",
                        core: "Select units, declare targets, fire ranged weapons.",
                        color: "border-orange-500/20 hover:border-orange-500/40"
                      },
                      {
                        key: "fgt",
                        title: "Charge & Fight Phase",
                        core: "Declare charges (2D6), pile in, strike with melee weapons.",
                        color: "border-red-500/20 hover:border-red-500/40"
                      }
                    ].map((phaseItem) => {
                      const isChecked = !!checklist[activeFaction.id]?.[phaseItem.key as "cmd" | "mov" | "sho" | "fgt"];
                      const reminder = FACTION_CHECKLIST_REMINDERS[activeFaction.id]?.[phaseItem.key as "cmd" | "mov" | "sho" | "fgt"] || "";

                      return (
                        <div
                          key={phaseItem.key}
                          onClick={() => toggleChecklistItem(activeFaction.id, phaseItem.key as "cmd" | "mov" | "sho" | "fgt")}
                          className={`border rounded-lg p-3 flex items-start gap-3 transition-all duration-200 cursor-pointer select-none bg-slate-950/40 ${phaseItem.color} ${
                            isChecked ? "opacity-50 border-emerald-500/30 bg-emerald-950/5" : ""
                          }`}
                        >
                          <div className={`w-4.5 h-4.5 rounded border flex items-center justify-center shrink-0 mt-0.5 transition-all duration-150 ${
                            isChecked ? "bg-emerald-500 border-emerald-500 text-stone-950" : "border-stone-700 bg-transparent"
                          }`}>
                            {isChecked && <Check className="w-3.5 h-3.5 stroke-[3px]" />}
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className={`text-xs font-bold font-display ${isChecked ? "text-emerald-400 line-through" : "text-stone-200"}`}>
                              {phaseItem.title}
                            </span>
                            <p className="text-[10px] text-stone-500 leading-normal">
                              {phaseItem.core}
                            </p>
                            {reminder && (
                              <div className="mt-1.5 bg-slate-950/80 border border-slate-900 rounded px-2 py-1 flex items-start gap-1">
                                <Zap className="w-3 h-3 text-amber-400 shrink-0 mt-0.5" />
                                <span className="text-[10px] text-amber-300/90 font-mono leading-normal">
                                  <span className="font-bold text-stone-400 uppercase mr-1">Faction Reminder:</span>
                                  {reminder}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-slate-950 border border-slate-900/80 rounded-lg p-3 mt-2 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></div>
                  <span className="text-[9px] font-mono text-stone-400 uppercase tracking-widest">
                    Commander checklist keeps your battle order flawless.
                  </span>
                </div>
              </div>

              {/* MathHammer Dice Simulator */}
              <div className="bg-grim-card border border-grim-border rounded-xl p-5 shadow-xl flex flex-col gap-4">
                <div className="border-b border-grim-border/50 pb-2">
                  <div className="flex items-center gap-2">
                    <Dices className="w-5 h-5 text-amber-500" />
                    <h4 className="text-xs font-bold text-stone-100 uppercase tracking-widest font-display">
                      MathHammer Combat Simulator
                    </h4>
                  </div>
                  <p className="text-[11px] text-stone-500 font-mono mt-0.5">
                    Model and simulate your attack profiles under standard Warhammer rules.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Left panel: Controls */}
                  <div className="flex flex-col gap-3.5 bg-slate-950/60 border border-slate-900 rounded-xl p-3.5">
                    {/* Attack Count Slider */}
                    <div className="flex flex-col gap-1.5">
                      <div className="flex justify-between items-center text-[10px] uppercase font-mono tracking-wider">
                        <span className="text-stone-400">Attacks (Dice Count)</span>
                        <span className="text-amber-500 font-bold">{mhAttacks} D6</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setMhAttacks(prev => Math.max(1, prev - 5))}
                          className="px-2 py-1 bg-slate-900 border border-slate-800 rounded text-stone-300 hover:text-amber-400 hover:border-amber-500/50 text-xs font-mono font-bold transition-all cursor-pointer"
                        >
                          -5
                        </button>
                        <input
                          type="range"
                          min="1"
                          max="50"
                          value={mhAttacks}
                          onChange={(e) => setMhAttacks(parseInt(e.target.value))}
                          className="flex-1 accent-amber-500 h-1 bg-slate-800 rounded-lg cursor-pointer"
                        />
                        <button
                          onClick={() => setMhAttacks(prev => Math.min(50, prev + 5))}
                          className="px-2 py-1 bg-slate-900 border border-slate-800 rounded text-stone-300 hover:text-amber-400 hover:border-amber-500/50 text-xs font-mono font-bold transition-all cursor-pointer"
                        >
                          +5
                        </button>
                      </div>
                    </div>

                    {/* BS / WS Selector */}
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[10px] uppercase font-mono tracking-wider text-stone-400">To Hit (BS/WS Skill)</span>
                      <div className="grid grid-cols-5 gap-1">
                        {[2, 3, 4, 5, 6].map((val) => (
                          <button
                            key={val}
                            onClick={() => setMhBs(val)}
                            className={`py-1.5 text-xs font-mono font-bold rounded border transition-all duration-150 cursor-pointer ${
                              mhBs === val
                                ? "bg-amber-500 text-stone-950 border-amber-500"
                                : "bg-slate-900 text-stone-400 border-slate-800 hover:border-slate-700 hover:text-stone-200"
                            }`}
                          >
                            {val}+
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* To Wound Selector */}
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[10px] uppercase font-mono tracking-wider text-stone-400">To Wound (vs Toughness)</span>
                      <div className="grid grid-cols-5 gap-1">
                        {[2, 3, 4, 5, 6].map((val) => (
                          <button
                            key={val}
                            onClick={() => setMhWound(val)}
                            className={`py-1.5 text-xs font-mono font-bold rounded border transition-all duration-150 cursor-pointer ${
                              mhWound === val
                                ? "bg-amber-500 text-stone-950 border-amber-500"
                                : "bg-slate-900 text-stone-400 border-slate-800 hover:border-slate-700 hover:text-stone-200"
                            }`}
                          >
                            {val}+
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Re-rolls and Modifiers */}
                    <div className="grid grid-cols-2 gap-2 text-[10px] font-mono uppercase">
                      <div className="flex flex-col gap-1">
                        <span className="text-stone-500">Hit Re-rolls</span>
                        <select
                          value={mhRerollHit}
                          onChange={(e) => setMhRerollHit(e.target.value as any)}
                          className="bg-slate-900 border border-slate-800 text-stone-300 rounded p-1 text-[11px] outline-none hover:border-amber-500/50 transition-all cursor-pointer"
                        >
                          <option value="none">None</option>
                          <option value="ones">Re-roll 1s</option>
                          <option value="all">Re-roll All</option>
                        </select>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-stone-500">Wound Re-rolls</span>
                        <select
                          value={mhRerollWound}
                          onChange={(e) => setMhRerollWound(e.target.value as any)}
                          className="bg-slate-900 border border-slate-800 text-stone-300 rounded p-1 text-[11px] outline-none hover:border-amber-500/50 transition-all cursor-pointer"
                        >
                          <option value="none">None</option>
                          <option value="ones">Re-roll 1s</option>
                          <option value="all">Re-roll All</option>
                        </select>
                      </div>
                    </div>

                    {/* Special Rules */}
                    <div className="flex flex-col gap-2 pt-1 border-t border-slate-900">
                      <span className="text-[9px] uppercase font-mono tracking-wider text-stone-500">Weapon Abilities</span>
                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 cursor-pointer text-[10px] font-mono text-stone-300 hover:text-stone-100">
                          <input
                            type="checkbox"
                            checked={mhSustained}
                            onChange={(e) => setMhSustained(e.target.checked)}
                            className="rounded bg-slate-900 border-slate-800 text-amber-500 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                          />
                          <span>Sustained Hits 1</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer text-[10px] font-mono text-stone-300 hover:text-stone-100">
                          <input
                            type="checkbox"
                            checked={mhLethal}
                            onChange={(e) => setMhLethal(e.target.checked)}
                            className="rounded bg-slate-900 border-slate-800 text-amber-500 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                          />
                          <span>Lethal Hits</span>
                        </label>
                      </div>
                    </div>

                    {/* Simulation Button */}
                    <button
                      onClick={runMathHammer}
                      className="w-full mt-1.5 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs font-display uppercase tracking-wider rounded-lg shadow-lg flex items-center justify-center gap-2 transition-all duration-150 transform hover:-translate-y-0.5 cursor-pointer active:translate-y-0"
                    >
                      <Dices className="w-4 h-4" />
                      <span>Simulate Firefight</span>
                    </button>
                  </div>

                  {/* Right panel: Results */}
                  <div className="flex flex-col bg-slate-950/60 border border-slate-900 rounded-xl p-3.5 justify-between">
                    {!mhResults ? (
                      <div className="flex flex-col items-center justify-center text-center h-full py-8 gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800/80 flex items-center justify-center text-stone-600">
                          <Dices className="w-5 h-5 animate-pulse" />
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[11px] font-bold text-stone-400 font-display uppercase tracking-wider">No Simulation Active</span>
                          <p className="text-[10px] text-stone-600 font-sans max-w-[180px]">
                            Configure your weapon profiles and roll simulated battle dice.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3 h-full justify-between">
                        <div className="flex flex-col gap-2.5">
                          {/* Main numbers banner */}
                          <div className="grid grid-cols-2 gap-2">
                            <div className="bg-slate-900/80 border border-slate-800 p-2.5 rounded-lg flex flex-col items-center text-center">
                              <span className="text-[8px] font-mono text-stone-500 uppercase tracking-widest">Total Hits</span>
                              <span className="text-xl font-black text-emerald-400 font-display mt-0.5">{mhResults.hits}</span>
                              <span className="text-[8px] font-mono text-stone-600 mt-0.5">Expected: {mhResults.expectedHits}</span>
                            </div>
                            <div className="bg-slate-900/80 border border-slate-800 p-2.5 rounded-lg flex flex-col items-center text-center">
                              <span className="text-[8px] font-mono text-stone-500 uppercase tracking-widest">Total Wounds</span>
                              <span className="text-xl font-black text-amber-400 font-display mt-0.5">{mhResults.wounds}</span>
                              <span className="text-[8px] font-mono text-stone-600 mt-0.5">Expected: {mhResults.expectedWounds}</span>
                            </div>
                          </div>

                          {/* Specifics pills */}
                          <div className="flex flex-wrap gap-1.5 justify-center">
                            {mhResults.autoWounds > 0 && (
                              <span className="text-[8px] font-mono bg-purple-950/60 text-purple-400 border border-purple-800/50 px-2 py-0.5 rounded uppercase tracking-wider">
                                ⚔ {mhResults.autoWounds} Auto-Wounds (Lethal)
                              </span>
                            )}
                            {mhResults.sustainedHits > 0 && (
                              <span className="text-[8px] font-mono bg-sky-950/60 text-sky-400 border border-sky-800/50 px-2 py-0.5 rounded uppercase tracking-wider">
                                ⚡ +{mhResults.sustainedHits} Sustained Hits
                              </span>
                            )}
                            <span className="text-[8px] font-mono bg-emerald-950/40 text-emerald-400/80 border border-emerald-900/30 px-2 py-0.5 rounded uppercase tracking-wider">
                              Accuracy: {Math.round((mhResults.hits / mhAttacks) * 100)}%
                            </span>
                          </div>

                          {/* Virtual Dice Tray */}
                          <div className="flex flex-col gap-1 mt-1">
                            <div className="flex justify-between items-center text-[8px] font-mono text-stone-500 uppercase tracking-widest">
                              <span>Virtual Dice Tray (Hits)</span>
                              <span>{mhResults.hitRolls.length} dice rolled</span>
                            </div>
                            <div className="bg-black/40 border border-slate-900/80 rounded-lg p-2 max-h-[85px] overflow-y-auto flex flex-wrap gap-1 items-start justify-start custom-scrollbar">
                              {mhResults.hitRolls.map((val, idx) => {
                                const isSix = val === 6;
                                const isSuccess = val >= mhBs;
                                let bgClass = "bg-slate-900 text-stone-500 border-slate-800";
                                let ruleLabel = "";

                                if (isSix && (mhLethal || mhSustained)) {
                                  bgClass = "bg-amber-950 text-amber-400 border-amber-600 font-black shadow-inner shadow-amber-500/10";
                                  ruleLabel = mhLethal && mhSustained ? "⚡⚔" : mhLethal ? "⚔" : "⚡";
                                } else if (isSuccess) {
                                  bgClass = "bg-emerald-950/80 text-emerald-400 border-emerald-800";
                                }

                                return (
                                  <div
                                    key={idx}
                                    className={`w-6 h-6 rounded flex flex-col items-center justify-center text-xs border font-mono font-bold shrink-0 relative ${bgClass}`}
                                    title={`Dice ${idx + 1}: ${val}${ruleLabel ? ` (${ruleLabel === "⚔" ? "Lethal Wounding" : "Sustained Exploding"})` : ""}`}
                                  >
                                    <span>{val}</span>
                                    {ruleLabel && (
                                      <span className="absolute -top-1 -right-1 text-[7px] text-amber-300 font-bold leading-none bg-stone-950 px-0.5 rounded border border-amber-600/50">
                                        {ruleLabel}
                                      </span>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>

                        <p className="text-[8px] text-stone-500 font-mono text-center leading-normal mt-1 border-t border-slate-900 pt-1.5">
                          🎲 Real-time physics-grade pseudo-randomized simulation.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Starter Units Guide & Warlord Golden Rules */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Starter Units Guide */}
              <div className="bg-grim-card border border-grim-border rounded-xl p-5 shadow-xl flex flex-col gap-3">
                <div className="flex items-center gap-2 border-b border-grim-border/50 pb-2">
                  <BookOpen className="w-4 h-4 text-sky-400" />
                  <h4 className="text-xs font-bold text-stone-100 uppercase tracking-widest font-display">
                    Beginner-Friendly Unit Guides
                  </h4>
                </div>
                <div className="flex flex-col gap-3">
                  {guide.signatureUnits.map((u, i) => (
                    <div key={i} className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex flex-col justify-between gap-2">
                      <div>
                        <span className="text-xs font-bold text-amber-400">{u.name}</span>
                        <p className="text-[11px] text-stone-300 leading-relaxed font-sans mt-1">{u.desc}</p>
                      </div>
                      {u.id && (
                        <button
                          onClick={() => {
                            setSelectedTab("cards");
                            setSelectedCardId(u.id!);
                            if (!expandedCodexUnitIds.includes(u.id!)) {
                              setExpandedCodexUnitIds([...expandedCodexUnitIds, u.id!]);
                            }
                          }}
                          className="text-[10px] text-amber-400 hover:text-amber-300 font-mono uppercase bg-slate-900 border border-slate-800 hover:border-amber-500/30 rounded px-2 py-1 transition-all cursor-pointer flex items-center gap-1.5 self-start"
                        >
                          <Swords className="w-3 h-3" />
                          <span>Inspect Datacard</span>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Warlord Golden Rules */}
              <div className="bg-grim-card border border-grim-border rounded-xl p-5 shadow-xl flex flex-col gap-3">
                <div className="flex items-center gap-2 border-b border-grim-border/50 pb-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <h4 className="text-xs font-bold text-stone-100 uppercase tracking-widest font-display">
                    Tactical Commander Golden Rules
                  </h4>
                </div>
                <div className="flex flex-col gap-3 justify-center h-full">
                  {guide.goldenRules.map((rule, i) => (
                    <div key={i} className="flex items-start gap-2.5 bg-black/40 border border-slate-900 rounded-lg p-3">
                      <span className="text-xs font-mono font-black text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded shrink-0">
                        0{i + 1}
                      </span>
                      <p className="text-xs text-stone-300 leading-relaxed font-sans">{rule}</p>
                    </div>
                  ))}
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/80 text-center text-[10px] text-stone-500 font-mono uppercase tracking-widest mt-auto">
                    ♟ STUDY YOUR DATA-CARDS // MASTER THE WARP
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
      {selectedTab === "rules" && (
        <div className="flex flex-col gap-6" id="rules-tab-content">
          {/* Faction Rule Card */}
          <div className="bg-grim-card border border-grim-border rounded-xl p-5 shadow-xl flex flex-col gap-3" id="faction-rule-card">
            <div className="flex items-center gap-2 border-b border-grim-border pb-2">
              <Award className="w-4 h-4 text-amber-500" />
              <h3 className="font-bold text-stone-200 font-display uppercase tracking-wider text-xs">Faction Rule: {activeFaction.factionRule.name}</h3>
            </div>
            <p className="text-xs text-stone-300 leading-relaxed whitespace-pre-line font-sans">
              {activeFaction.factionRule.description}
            </p>
          </div>

          {/* Detachment Rule Card */}
          <div className="bg-grim-card border border-grim-border rounded-xl p-5 shadow-xl flex flex-col gap-3" id="detachment-rule-card">
            <div className="flex items-center justify-between border-b border-grim-border pb-2">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-sky-400" />
                <h3 className="font-bold text-slate-200">Detachment: {activeFaction.detachment.name}</h3>
              </div>
              <span className="text-xs bg-sky-950 text-sky-300 border border-sky-800/50 px-2 py-0.5 rounded font-mono">
                10th Edition Detachment Rule
              </span>
            </div>
            <p className="text-sm text-gray-400 italic mb-1">{activeFaction.detachment.description}</p>
            <div className="bg-slate-950/50 border border-slate-800/80 rounded-xl p-4 flex flex-col gap-2">
              <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">Detachment Rule Benefit</span>
              <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">
                {activeFaction.detachment.benefit}
              </p>
            </div>

            {/* Enhancements */}
            {activeFaction.detachment.enhancements && (
              <div className="bg-slate-950/50 border border-slate-800/80 rounded-xl p-4 flex flex-col gap-2">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Enhancements</span>
                <div className="space-y-2">
                  {activeFaction.detachment.enhancements.map((enh, i) => (
                    <div key={i} className="text-xs text-gray-300">
                      <span className="font-bold text-stone-200">{enh.name}</span> - <span className="text-gray-500">{enh.points} pts</span>
                      <p className="text-gray-400 mt-0.5">{enh.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Detachment Tactical Simulator (Interactive!) */}
            <div className="border-t border-grim-border/50 pt-4 mt-2 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <Dices className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-bold text-stone-200 uppercase tracking-wider font-display">Detachment Battle Simulator</span>
              </div>
              
              {activeFaction.id === "space_marines" && (
                <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-bold text-amber-400 font-mono uppercase tracking-widest">Gladius Doctrine Panel</span>
                    <span className="text-[10px] bg-sky-900/20 text-sky-400 px-2 py-0.5 rounded font-mono border border-sky-500/10">Combat Doctrines</span>
                  </div>
                  <p className="text-xs text-stone-400">Select an active Combat Doctrine to calculate which units/stratagems unlock elite bonuses:</p>
                  
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "devastator", label: "Devastator 🚀", desc: "Advance & Shoot" },
                      { id: "tactical", label: "Tactical 🎯", desc: "Fall Back, Shoot/Charge" },
                      { id: "assault", label: "Assault ⚔️", desc: "Advance & Charge" }
                    ].map(doc => (
                      <button
                        key={doc.id}
                        onClick={() => {
                          setSelectedDoctrine(doc.id);
                          setDetachmentLogs(prev => [`[Space Marines] Declared ${doc.label.toUpperCase()} active for the battle round!`, ...prev.slice(0, 4)]);
                        }}
                        className={`flex flex-col items-center justify-center p-2 rounded-lg border text-center transition cursor-pointer active:scale-95 ${
                          selectedDoctrine === doc.id
                            ? "bg-slate-900 border-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.2)] text-amber-400 font-bold"
                            : "bg-black/30 border-slate-800 text-stone-500 hover:text-stone-300"
                        }`}
                      >
                        <span className="text-[10px] uppercase font-mono">{doc.label}</span>
                        <span className="text-[8px] text-stone-500 mt-0.5">{doc.desc}</span>
                      </button>
                    ))}
                  </div>

                  <div className="bg-black/40 border border-slate-900 p-3 rounded-lg flex flex-col gap-1.5 text-[11px] font-sans">
                    <span className="text-[9px] font-mono text-amber-500 uppercase tracking-wider">Tactical Synergy & Recommendations</span>
                    {selectedDoctrine === "devastator" && (
                      <p className="text-stone-300">
                        🚀 Active: <span className="font-bold text-sky-400">Devastator Doctrine</span>. Ideal for early battle rounds! Moves heavy firepower squads (e.g., <span className="text-white">Hellblaster Squad</span>, <span className="text-white">Redemptor Dreadnought</span>) up the field rapidly without losing shooting efficiency.
                      </p>
                    )}
                    {selectedDoctrine === "tactical" && (
                      <p className="text-stone-300">
                        🎯 Active: <span className="font-bold text-amber-400">Tactical Doctrine</span>. Flexible mid-game control! Allows battleline squads (e.g., <span className="text-white">Intercessor Squad</span>) to escape bad engagements, secure nearby objectives, and still lay down fire.
                      </p>
                    )}
                    {selectedDoctrine === "assault" && (
                      <p className="text-stone-300">
                        ⚔️ Active: <span className="font-bold text-emerald-400">Assault Doctrine</span>. Melee breakthrough! Enables slow combat powerhouses (e.g., <span className="text-white">Captain in Terminator Armour</span>, <span className="text-white">Terminator Squad</span>) to cover massive ground and launch devastating charges. Adds 1 bonus Attack to <span className="text-amber-300 font-mono">Honor the Chapter</span> stratagem.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {activeFaction.id === "tyranids" && (
                <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-bold text-amber-400 font-mono uppercase tracking-widest">Adaptation Spawning Tank</span>
                    <span className="text-[10px] bg-green-900/20 text-green-400 px-2 py-0.5 rounded font-mono border border-green-500/10">Hyper-Adaptation</span>
                  </div>
                  <p className="text-xs text-stone-400">Mutate your entire swarm to gain specialized offensive traits targeting specific enemy builds:</p>
                  
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "swarming", label: "Swarming Instincts 👥", desc: "Sustained vs Infantry" },
                      { id: "hyper", label: "Hyper-Aggression 🚜", desc: "Lethal vs Vehicles" },
                      { id: "predators", label: "Hive Predators 👑", desc: "Precision vs Characters" }
                    ].map(adapt => (
                      <button
                        key={adapt.id}
                        onClick={() => {
                          setSelectedAdaptation(adapt.id);
                          setDetachmentLogs(prev => [`[Tyranids] Hive Mind spawns ${adapt.label.toUpperCase()} across the fleet!`, ...prev.slice(0, 4)]);
                        }}
                        className={`flex flex-col items-center justify-center p-2 rounded-lg border text-center transition cursor-pointer active:scale-95 ${
                          selectedAdaptation === adapt.id
                            ? "bg-slate-900 border-green-500 shadow-[0_0_8px_rgba(34,197,94,0.2)] text-green-400 font-bold"
                            : "bg-black/30 border-slate-800 text-stone-500 hover:text-stone-300"
                        }`}
                      >
                        <span className="text-[10px] uppercase font-mono">{adapt.label}</span>
                        <span className="text-[8px] text-stone-500 mt-0.5">{adapt.desc}</span>
                      </button>
                    ))}
                  </div>

                  <div className="bg-black/40 border border-slate-900 p-3 rounded-lg flex flex-col gap-1.5 text-[11px] font-sans">
                    <span className="text-[9px] font-mono text-green-400 uppercase tracking-wider">Swarm Adaptation Analysis</span>
                    {selectedAdaptation === "swarming" && (
                      <p className="text-stone-300">
                        👥 Active: <span className="font-bold text-green-400">Swarming Instincts</span>. Attacks gain [Sustained Hits 1] against Infantry and Swarms. Extremely lethal when using high-volume ranged bio-weapons like <span className="text-white">Termagant Squads</span> led by a <span className="text-white">Winged Tyranid Prime</span>.
                      </p>
                    )}
                    {selectedAdaptation === "hyper" && (
                      <p className="text-stone-300">
                        🚜 Active: <span className="font-bold text-green-400">Hyper-Aggression</span>. Monster/Vehicle Killer! Attacks gain [Lethal Hits] (6s to hit automatically wound). Highly critical for letting small organisms wound giant armor, and makes the claws of <span className="text-white">Screamer-Killer</span> and <span className="text-white">Psychophage</span> slice through tanks.
                      </p>
                    )}
                    {selectedAdaptation === "predators" && (
                      <p className="text-stone-300">
                        👑 Active: <span className="font-bold text-green-400">Hive Predators</span>. Critical Wound rolls of 6 in melee gain [Precision], allocating damage directly to embedded Enemy Leaders. Absolute nightmare for enemy Captains or squad buffs!
                      </p>
                    )}
                  </div>
                </div>
              )}

              {activeFaction.id === "necrons" && (
                <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 flex flex-col gap-3.5">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-bold text-amber-400 font-mono uppercase tracking-widest">Reanimation Protocol Chamber</span>
                    <span className="text-[10px] bg-emerald-900/20 text-emerald-400 px-2 py-0.5 rounded font-mono border border-emerald-500/10">Reanimate Warriors</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-2 bg-black/40 border border-slate-900 p-3 rounded-lg">
                      <span className="text-[9px] font-mono text-stone-500 uppercase">1. Protocol Configuration</span>
                      <div className="flex flex-col gap-1 text-[11px]">
                        <label className="text-stone-400">Select Guard Squad:</label>
                        <select 
                          value={necronBodyguard}
                          onChange={(e) => setNecronBodyguard(e.target.value)}
                          className="bg-grim-dark border border-grim-border text-stone-300 px-2 py-1 rounded text-xs focus:border-amber-500 outline-none"
                        >
                          <option value="warriors">Necron Warriors (D6 Reanim)</option>
                          <option value="immortals">Immortals (D3 Reanim)</option>
                          <option value="lychguard">Lychguard (D3 Reanim)</option>
                        </select>
                      </div>
                      <div className="text-[10px] text-stone-400 leading-relaxed mt-1">
                        ✨ Awakened Dynasty bonus: Having a Character attached grants <span className="text-emerald-400 font-mono">+1 to Hit rolls</span> for all attacks!
                      </div>
                    </div>

                    <div className="flex flex-col items-center justify-center gap-1.5 bg-black/40 border border-slate-900 p-3 rounded-lg text-center">
                      <span className="text-[9px] font-mono text-stone-500 uppercase">2. Execute Protocols</span>
                      <button
                        onClick={() => {
                          const diceCount = necronBodyguard === "warriors" ? 6 : 3;
                          const roll = Math.floor(Math.random() * diceCount) + 1;
                          setNecronReanimRoll(roll);
                          setDetachmentLogs(prev => [`[Necrons] Reanimation Protocols activated! returned ${roll} slain metal warriors to the squad.`, ...prev.slice(0, 4)]);
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold font-mono text-[10px] uppercase rounded-lg active:scale-95 transition cursor-pointer shadow-md shadow-emerald-500/10"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Reanimate</span>
                      </button>
                      
                      {necronReanimRoll !== null && (
                        <div className="text-[11px] mt-1 font-mono">
                          Returned: <span className="font-bold text-emerald-400">+{necronReanimRoll}</span> models!
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeFaction.id === "aeldari" && (
                <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-bold text-amber-400 font-mono uppercase tracking-widest">Strands of Fate Divining Altar</span>
                    <span className="text-[10px] bg-indigo-900/20 text-indigo-400 px-2 py-0.5 rounded font-mono border border-indigo-500/10">Fate Substitution</span>
                  </div>
                  <p className="text-xs text-stone-400">Roll your 6 Strands of Fate Dice at start-of-battle. Spend them to override critical random dice:</p>

                  <div className="flex items-center justify-between gap-3">
                    <div className="flex gap-1.5">
                      {fateDicePool.map((val, idx) => (
                        <div 
                          key={idx}
                          onClick={() => {
                            const newPool = [...fateDicePool];
                            newPool[idx] = Math.floor(Math.random() * 6) + 1;
                            setFateDicePool(newPool);
                            setDetachmentLogs(prev => [`[Aeldari] Substituted dice slot #${idx+1} to destiny value ${newPool[idx]}!`, ...prev.slice(0, 4)]);
                          }}
                          className="w-8 h-8 rounded-lg bg-indigo-950/50 border border-indigo-500/40 text-indigo-300 flex items-center justify-center font-bold text-sm hover:border-indigo-400 hover:text-white transition cursor-pointer select-none font-mono"
                          title="Click to manipulate / substitute this individual Fate Die"
                        >
                          {val}
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => {
                        const newPool = Array.from({ length: 6 }, () => Math.floor(Math.random() * 6) + 1);
                        setFateDicePool(newPool);
                        setDetachmentLogs(prev => ["[Aeldari] Rolled new Strands of Fate pool!", ...prev.slice(0, 4)]);
                      }}
                      className="flex items-center gap-1.5 px-3 py-2 bg-indigo-500 hover:bg-indigo-400 text-slate-950 font-bold font-mono text-[9px] uppercase rounded-lg active:scale-95 transition cursor-pointer"
                    >
                      <Dices className="w-3.5 h-3.5" />
                      <span>Re-roll Pool</span>
                    </button>
                  </div>

                  <p className="text-[10px] text-stone-500 font-sans italic">✨ Battle Host rule: Allows you to re-roll 1 Hit roll AND 1 Wound roll every single time a unit shoots or fights!</p>
                </div>
              )}

              {activeFaction.id === "orks" && (
                <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 flex flex-col gap-3 text-center">
                  <div className="flex justify-between items-center text-left">
                    <span className="text-[11px] font-bold text-amber-400 font-mono uppercase tracking-widest">Gork & Mork's War Horn</span>
                    <span className="text-[10px] bg-red-900/20 text-red-400 px-2 py-0.5 rounded font-mono border border-red-500/10">Waaagh! State</span>
                  </div>

                  <div className="flex flex-col gap-2 items-center py-2">
                    <button
                      onClick={() => {
                        const nextState = !orkWaaaghActive;
                        setOrkWaaaghActive(nextState);
                        setDetachmentLogs(prev => [
                          nextState 
                            ? "[Orks] WAAAAAAAGH!!! Every Ork on the field gets massive strength and armor boosts!"
                            : "[Orks] Waaagh! subsided. Boyz are cooling down.",
                          ...prev.slice(0, 4)
                        ]);
                      }}
                      className={`px-5 py-3 font-black font-display text-xs uppercase rounded-xl tracking-widest active:scale-95 transition cursor-pointer shadow-lg ${
                        orkWaaaghActive
                          ? "bg-red-600 hover:bg-red-500 text-white shadow-red-500/20 animate-pulse border-2 border-amber-400"
                          : "bg-green-600 hover:bg-green-500 text-slate-950 shadow-green-500/15"
                      }`}
                    >
                      {orkWaaaghActive ? "📣 WAAAGH! IS ACTIVE!" : "📣 CALL THE WAAAGH!"}
                    </button>
                    
                    {orkWaaaghActive ? (
                      <div className="bg-red-950/40 border border-red-800 rounded-lg p-2.5 max-w-sm text-left flex flex-col gap-1 text-[10px] font-sans text-stone-300 leading-normal">
                        <span className="font-bold text-red-400 font-mono uppercase tracking-wider">ACTIVE COMBAT BOOSTS:</span>
                        <div>✊ <span className="font-bold text-white">+1 Melee Attack</span> for all models in your army.</div>
                        <div>💪 <span className="font-bold text-white">+1 Strength</span> characteristic of melee weapons on charge moves.</div>
                        <div>🛡️ <span className="font-bold text-white">5+ Invulnerable Save</span> granted to every model to absorb incoming heavy fire.</div>
                        <div>🏃 <span className="font-bold text-white">Charge after Advancing</span> is fully allowed!</div>
                      </div>
                    ) : (
                      <p className="text-[11px] text-stone-400 max-w-md italic font-sans">
                        Once per game, trigger the Waaagh! during your command phase to gain overwhelming combat buffs and unstoppable charges!
                      </p>
                    )}
                  </div>
                </div>
              )}

              {activeFaction.id === "chaos_space_marines" && (
                <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-bold text-amber-400 font-mono uppercase tracking-widest">Dark Pact Sacrifice Altar</span>
                    <span className="text-[10px] bg-purple-900/20 text-purple-400 px-2 py-0.5 rounded font-mono border border-purple-500/10">Dark Pact</span>
                  </div>
                  <p className="text-xs text-stone-400">Before shooting or fighting, draft a Dark Pact to gain lethal weapon traits at the risk of physical self-harm:</p>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-2 bg-black/40 border border-slate-900 p-3 rounded-lg text-left">
                      <span className="text-[9px] font-mono text-stone-500 uppercase">1. Draft Dark Pact</span>
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => setCsmPact("devastating")}
                          className={`flex-1 py-1 text-[9px] font-bold rounded font-mono cursor-pointer transition ${
                            csmPact === "devastating" 
                              ? "bg-purple-950/30 border border-purple-500 text-purple-300"
                              : "bg-grim-dark border border-grim-border text-stone-500"
                          }`}
                        >
                          Sustained Hits
                        </button>
                        <button
                          onClick={() => setCsmPact("lethal")}
                          className={`flex-1 py-1 text-[9px] font-bold rounded font-mono cursor-pointer transition ${
                            csmPact === "lethal" 
                              ? "bg-purple-950/30 border border-purple-500 text-purple-300"
                              : "bg-grim-dark border border-grim-border text-stone-500"
                          }`}
                        >
                          Lethal Hits
                        </button>
                      </div>
                      <p className="text-[10px] text-stone-400 leading-normal mt-1">
                        {csmPact === "devastating" 
                          ? "Sustained Hits 1: Roll of a 6 to hit scores 1 extra bonus hit!"
                          : "Lethal Hits: Roll of a 6 to hit automatically wounds target!"
                        }
                      </p>
                    </div>

                    <div className="flex flex-col items-center justify-center gap-1.5 bg-black/40 border border-slate-900 p-3 rounded-lg text-center">
                      <span className="text-[9px] font-mono text-stone-500 uppercase">2. Roll Leadership (LD 6+)</span>
                      <button
                        onClick={() => {
                          const r1 = Math.floor(Math.random() * 6) + 1;
                          const r2 = Math.floor(Math.random() * 6) + 1;
                          const sum = r1 + r2;
                          const passed = sum >= 6;
                          let wounds = 0;
                          if (!passed) {
                            wounds = Math.floor(Math.random() * 3) + 1;
                          }
                          setCsmTestResult({ roll: sum, passed, wounds });
                          setDetachmentLogs(prev => [
                            passed 
                              ? `[Chaos] Pact accepted safely! Rolled ${sum} (Passed LD 6+).` 
                              : `[Chaos] Pact backfired! Rolled ${sum} (Failed LD 6+). Unit suffered ${wounds} Mortal Wounds!`,
                            ...prev.slice(0, 4)
                          ]);
                        }}
                        className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-slate-950 font-bold font-mono text-[10px] uppercase rounded-lg active:scale-95 transition cursor-pointer"
                      >
                        Roll 2D6
                      </button>

                      {csmTestResult && (
                        <div className="text-[11px] font-mono leading-tight mt-1">
                          Roll: <span className="font-bold text-white">{csmTestResult.roll}</span>
                          <div className={csmTestResult.passed ? "text-green-400 font-bold" : "text-red-400 font-bold"}>
                            {csmTestResult.passed ? "Pact Approved!" : `Failed! -${csmTestResult.wounds} MW`}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeFaction.id === "astra_militarum" && (
                <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-bold text-amber-400 font-mono uppercase tracking-widest">Regimental Vox-Cast Command Deck</span>
                    <span className="text-[10px] bg-amber-900/20 text-amber-400 px-2 py-0.5 rounded font-mono border border-amber-500/10">Officer Orders</span>
                  </div>
                  <p className="text-xs text-stone-400">Transmit official officer instructions to change your squad characteristics instantly:</p>

                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "aim", label: "Take Aim! 🎯", desc: "+1 Ballistic Skill" },
                      { id: "fire", label: "First Rank Fire! 🔫", desc: "+1 Ranged Attack" },
                      { id: "move", label: "Move! Move! Move! 🏃", desc: "+3\" Movement characteristic" }
                    ].map(order => (
                      <button
                        key={order.id}
                        onClick={() => {
                          setGuardOrder(order.id);
                          setDetachmentLogs(prev => [`[Guard] Transmitted order ${order.label.toUpperCase()} over secure radio.`, ...prev.slice(0, 4)]);
                        }}
                        className={`flex flex-col items-center justify-center p-2 rounded-lg border text-center transition cursor-pointer active:scale-95 ${
                          guardOrder === order.id
                            ? "bg-slate-900 border-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.2)] text-amber-400 font-bold"
                            : "bg-black/30 border-slate-800 text-stone-500 hover:text-stone-300"
                        }`}
                      >
                        <span className="text-[10px] uppercase font-mono">{order.label}</span>
                        <span className="text-[8px] text-stone-500 mt-0.5">{order.desc}</span>
                      </button>
                    ))}
                  </div>

                  <div className="bg-black/40 border border-slate-900 p-3 rounded-lg flex flex-col gap-1 text-[11px] font-sans">
                    <span className="text-[9px] font-mono text-amber-500 uppercase tracking-wider">Simulated Stat Modification</span>
                    {guardOrder === "aim" && (
                      <p className="text-stone-300">
                        🎯 Cadian Shock Troops will now hit on <span className="text-white font-bold">3+</span> instead of 4+ with their Bolt Rifles and Lasguns! (Order: Take Aim!)
                      </p>
                    )}
                    {guardOrder === "fire" && (
                      <p className="text-stone-300">
                        🔫 Cadian Shock Troops fire <span className="text-white font-bold">3 shots per model</span> instead of 2 with standard Lasguns! (Order: First Rank, Fire! Second Rank, Fire!)
                      </p>
                    )}
                    {guardOrder === "move" && (
                      <p className="text-stone-300">
                        🏃 Your entire Cadian Infantry squad moves at a swift speed of <span className="text-white font-bold">9 inches</span> instead of 6 inches! (Order: Move! Move! Move!)
                      </p>
                    )}
                  </div>
                </div>
              )}

              {activeFaction.id === "adeptus_custodes" && (
                <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-bold text-amber-400 font-mono uppercase tracking-widest">Martial Ka'tah Posture Deck</span>
                    <span className="text-[10px] bg-yellow-900/20 text-yellow-400 px-2 py-0.5 rounded font-mono border border-yellow-500/10">Shield Host Stances</span>
                  </div>
                  <p className="text-xs text-stone-400">Select which physical fighting stance your Custodians take for this battle round:</p>

                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "dacatarai", label: "Dacatarai 🗡️", desc: "Sustained vs Hordes" },
                      { id: "kaptaris", label: "Kaptaris 🛡️", desc: "-1 to be Hit in Melee" },
                      { id: "rendax", label: "Rendax 💥", desc: "Lethal vs Vehicles" }
                    ].map(stance => (
                      <button
                        key={stance.id}
                        onClick={() => {
                          setCustodesStance(stance.id);
                          setDetachmentLogs(prev => [`[Custodes] Shield Host shifts into ${stance.label.toUpperCase()} fighting posture.`, ...prev.slice(0, 4)]);
                        }}
                        className={`flex flex-col items-center justify-center p-2 rounded-lg border text-center transition cursor-pointer active:scale-95 ${
                          custodesStance === stance.id
                            ? "bg-slate-900 border-amber-500 shadow-[0_0_8px_rgba(234,179,8,0.2)] text-amber-400 font-bold"
                            : "bg-black/30 border-slate-800 text-stone-500 hover:text-stone-300"
                        }`}
                      >
                        <span className="text-[10px] uppercase font-mono">{stance.label}</span>
                        <span className="text-[8px] text-stone-500 mt-0.5">{stance.desc}</span>
                      </button>
                    ))}
                  </div>

                  <div className="bg-black/40 border border-slate-900 p-3 rounded-lg flex flex-col gap-1 text-[11px] font-sans">
                    <span className="text-[9px] font-mono text-amber-500 uppercase tracking-wider">Ka'tah Combat Assessment</span>
                    {custodesStance === "dacatarai" && (
                      <p className="text-stone-300">
                        🗡️ Active: <span className="font-bold text-amber-300">Dacatarai</span>. Excellent for clearing swarms. Attacks with guardian spears gain [Sustained Hits 1] (every 6 to hit scores 1 bonus hit). Perfect vs Tyranid Swarms or Orks!
                      </p>
                    )}
                    {custodesStance === "kaptaris" && (
                      <p className="text-stone-300">
                        🛡️ Active: <span className="font-bold text-amber-300">Kaptaris</span>. Defensive posture. Enemy units attacking your Custodians in melee combat suffer a <span className="text-white font-bold">-1 modifier to Hit rolls</span>. Extremely critical when taking a charge!
                      </p>
                    )}
                    {custodesStance === "rendax" && (
                      <p className="text-stone-300">
                        💥 Active: <span className="font-bold text-amber-300">Rendax</span>. Giant slayer stance. Melee weapons gain [Lethal Hits] against Monsters and Vehicles. Crucial for hacking through heavy tanks or gargantuan bio-beasts!
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Detachment Live Log Feed */}
              {detachmentLogs.length > 0 && (
                <div className="bg-black/50 border border-slate-900 rounded-lg p-2.5 flex flex-col gap-1">
                  <span className="text-[8px] font-mono text-stone-500 uppercase tracking-wider">Simulator Command Logs</span>
                  <div className="flex flex-col gap-1 max-h-[80px] overflow-y-auto">
                    {detachmentLogs.map((logStr, lIdx) => (
                      <div key={lIdx} className="text-[9px] font-mono text-stone-400 border-l border-amber-500/30 pl-1.5 py-0.5 leading-snug">
                        ⚡ {logStr}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Section B: Detachment Enhancements (New!) */}
            {DETACHMENT_ENHANCEMENTS[activeFaction.id] && (
              <div className="border-t border-grim-border/50 pt-4 mt-2 flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span className="text-xs font-bold text-stone-200 uppercase tracking-wider font-display">Detachment Character Enhancements</span>
                </div>
                <p className="text-xs text-stone-400">These unique relics can be bought using points to upgrade any Character unit in your Strike Force roster:</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {DETACHMENT_ENHANCEMENTS[activeFaction.id].map((en, idx) => (
                    <div key={idx} className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 flex flex-col gap-2 relative overflow-hidden group hover:border-amber-500/40 transition duration-200">
                      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-amber-500/5 to-transparent rounded-bl-full pointer-events-none" />
                      
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-xs text-amber-400 font-sans leading-tight pr-4">{en.name}</span>
                        <span className="text-[9px] font-mono font-bold bg-amber-500/10 border border-amber-500/30 text-amber-400 px-1.5 py-0.5 rounded shrink-0">
                          +{en.cost} PTS
                        </span>
                      </div>
                      
                      <p className="text-[11px] text-stone-300 leading-relaxed font-sans">{en.desc}</p>
                      
                      <div className="border-t border-slate-900/80 pt-2 mt-1">
                        <span className="text-[8px] font-mono text-stone-500 uppercase tracking-wider block">Wargaming Synergy</span>
                        <p className="text-[10px] text-gray-400 leading-snug italic mt-0.5">{en.synergy}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Stratagems List */}
            <div className="flex flex-col gap-3 mt-2" id="stratagem-list-container">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Detachment Stratagems</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {activeFaction.detachment.stratagems.map((strat, i) => (
                  <div key={i} className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-amber-300">{strat.name}</span>
                      <span className="text-xs font-mono font-bold bg-amber-500/10 border border-amber-500/30 text-amber-400 px-2 py-0.5 rounded-md">
                        {strat.cost} CP
                      </span>
                    </div>
                    <div className="flex flex-col gap-1 text-xs">
                      <span className="text-gray-500 uppercase tracking-wider">Phase: {strat.phase}</span>
                      <p className="text-gray-300 mt-1 leading-relaxed">{strat.effect}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: STRATAGEMS DETAILED VIEW */}
      {selectedTab === "stratagems" && (() => {
        // Combine faction-specific and universal stratagems
        const factionStrats = activeFaction.detachment.stratagems.map(s => ({
          ...s,
          type: "faction" as const,
          factionName: activeFaction.name,
          trigger: s.effect.startsWith("Target:") ? s.effect.split("Effect:")[0].replace("Target:", "Target:").trim() : "When activated as described in the rules."
        }));

        const coreStrats = UNIVERSAL_CORE_STRATAGEMS.map(s => ({
          ...s,
          type: "core" as const,
          factionName: "Universal Core"
        }));

        const allStratagems = [...factionStrats, ...coreStrats];

        const filteredStratagems = allStratagems.filter(strat => {
          // 1. Search Query
          const query = stratSearchQuery.toLowerCase();
          const matchesSearch = 
            strat.name.toLowerCase().includes(query) ||
            strat.phase.toLowerCase().includes(query) ||
            strat.effect.toLowerCase().includes(query) ||
            (strat.trigger && strat.trigger.toLowerCase().includes(query));

          // 2. Type Filter
          const matchesType = 
            stratTypeFilter === "all" ||
            strat.type === stratTypeFilter;

          // 3. Phase Filter
          let matchesPhase = true;
          if (stratPhaseFilter !== "all") {
            const phaseLower = strat.phase.toLowerCase();
            if (stratPhaseFilter === "any") {
              matchesPhase = phaseLower.includes("any");
            } else {
              matchesPhase = phaseLower.includes(stratPhaseFilter.toLowerCase());
            }
          }

          // 4. CP Filter
          const matchesCp = 
            stratCpFilter === "all" ||
            strat.cost.toString() === stratCpFilter;

          return matchesSearch && matchesType && matchesPhase && matchesCp;
        });

        // Helper to get Phase styling
        const getPhaseStyles = (phaseStr: string) => {
          const lower = phaseStr.toLowerCase();
          if (lower.includes("fight")) {
            return "text-red-400 bg-red-950/40 border border-red-900/30";
          }
          if (lower.includes("shoot")) {
            return "text-sky-400 bg-sky-950/40 border border-sky-900/30";
          }
          if (lower.includes("charge")) {
            return "text-orange-400 bg-orange-950/40 border border-orange-900/30";
          }
          if (lower.includes("move")) {
            return "text-emerald-400 bg-emerald-950/40 border border-emerald-900/30";
          }
          if (lower.includes("command") || lower.includes("shock")) {
            return "text-purple-400 bg-purple-950/40 border border-purple-900/30";
          }
          return "text-amber-400 bg-amber-950/40 border border-amber-900/30";
        };

        const handleSimulateStratagem = (stratName: string, cpCost: number) => {
          if (sandboxCp < cpCost) {
            setSandboxLog(prev => [
              ...prev,
              `[WARNING] Cannot deploy "${stratName}". Requires ${cpCost} CP, but you only have ${sandboxCp} CP!`
            ]);
            return;
          }

          const nextCp = sandboxCp - cpCost;
          setSandboxCp(nextCp);
          
          let simulatedResult = "";
          if (stratName === "Command Re-roll") {
            const diceBefore = Math.floor(Math.random() * 6) + 1;
            const diceAfter = Math.floor(Math.random() * 6) + 1;
            simulatedResult = `(Rolled: ${diceBefore} 🎲 -> Re-rolled: ${diceAfter} 🎲!)`;
          } else if (stratName === "Grenade") {
            const rolls = Array.from({ length: 6 }, () => Math.floor(Math.random() * 6) + 1);
            const mw = rolls.filter(r => r >= 4).length;
            simulatedResult = `(Grenade thrown! Rolls: [${rolls.join(", ")}]. ${mw} Mortal Wounds! 💥)`;
          } else if (stratName === "Tank Shock") {
            const rolls = Array.from({ length: 10 }, () => Math.floor(Math.random() * 6) + 1);
            const mw = Math.min(6, rolls.filter(r => r >= 5).length);
            simulatedResult = `(Tank Shock! 10 dice: [${rolls.join(", ")}]. ${mw} Mortal Wounds! 🚜💨)`;
          } else {
            simulatedResult = `(Tactical effect applied to unit.)`;
          }

          setSandboxLog(prev => [
            ...prev,
            `[SUCCESS] Activated "${stratName}" (${cpCost} CP). Remaining: ${nextCp} CP. ${simulatedResult}`
          ]);
        };

        return (
          <div className="flex flex-col gap-5 animate-fade-in" id="stratagems-tab-content">
            
            {/* Command Point Sandbox Control Panel */}
            <div className="bg-grim-card border border-grim-border/80 rounded-xl p-5 shadow-xl flex flex-col gap-4">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-xl shrink-0">
                    <div className="text-center w-14">
                      <span className="block text-[8px] text-amber-500 uppercase font-mono tracking-widest font-bold">RECRUIT CP</span>
                      <span className="text-2xl font-black text-amber-400 font-mono leading-none">{sandboxCp}</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-stone-100 uppercase tracking-wide flex items-center gap-1.5 font-display">
                      <Target className="w-4 h-4 text-amber-500 animate-pulse" />
                      <span>Tactical Stratagem Simulator</span>
                    </h4>
                    <p className="text-xs text-stone-400 mt-1 leading-relaxed font-sans">
                      Command Points (CP) are spent to execute elite military maneuvers. Tap "Simulate Activation" on any card below to test trigger conditions, roll tactical dice, and track CP changes.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 w-full md:w-auto justify-end shrink-0">
                  <button
                    onClick={() => setSandboxCp(prev => Math.max(0, prev - 1))}
                    className="bg-slate-900 hover:bg-slate-850 border border-slate-800 text-stone-300 font-mono text-xs px-3 py-2 rounded-lg font-bold transition active:scale-95 cursor-pointer select-none"
                    title="Deduct 1 CP"
                  >
                    -1 CP
                  </button>
                  <button
                    onClick={() => setSandboxCp(prev => Math.min(6, prev + 1))}
                    className="bg-slate-900 hover:bg-slate-850 border border-slate-800 text-stone-300 font-mono text-xs px-3 py-2 rounded-lg font-bold transition active:scale-95 cursor-pointer select-none"
                    title="Add 1 CP"
                  >
                    +1 CP
                  </button>
                  <button
                    onClick={() => {
                      setSandboxCp(3);
                      setSandboxLog(["System active: Command Points reset to 3. Choose a maneuver."]);
                    }}
                    className="bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-400 text-xs px-3.5 py-2 rounded-lg font-bold transition active:scale-95 cursor-pointer"
                  >
                    Reset Pool
                  </button>
                </div>
              </div>

              {/* Simulated Console Screen */}
              <div className="bg-slate-950 border border-slate-900/80 rounded-lg p-3 font-mono text-[10px] leading-relaxed text-emerald-400 shadow-inner h-24 overflow-y-auto flex flex-col gap-1">
                {sandboxLog.slice().reverse().map((log, idx) => {
                  const isWarning = log.startsWith("[WARNING]");
                  const isSuccess = log.startsWith("[SUCCESS]");
                  return (
                    <div key={idx} className="flex gap-1.5 items-start">
                      <span className="text-emerald-700 shrink-0 select-none">$&gt;</span>
                      <span className={isWarning ? "text-rose-400 font-bold" : isSuccess ? "text-emerald-300 font-bold" : "text-stone-400"}>
                        {log}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Filter and Search Controls Bar */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-grim-card border border-grim-border/50 rounded-xl p-4 shadow-md">
              {/* Search Field */}
              <div className="relative md:col-span-1">
                <Search className="absolute left-3 top-3 w-3.5 h-3.5 text-stone-500" />
                <input
                  type="text"
                  placeholder="Search name, effect..."
                  value={stratSearchQuery}
                  onChange={(e) => setStratSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 rounded-lg pl-8.5 pr-3 py-2.5 text-xs text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-500/50 transition-colors"
                />
              </div>

              {/* Source/Type Dropdown */}
              <div className="md:col-span-1">
                <select
                  value={stratTypeFilter}
                  onChange={(e) => setStratTypeFilter(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-850 text-stone-300 text-xs rounded-lg p-2.5 focus:outline-none focus:border-amber-500/50"
                >
                  <option value="all">All Stratagems</option>
                  <option value="faction">{activeFaction.name} Specific</option>
                  <option value="core">Universal Core Only</option>
                </select>
              </div>

              {/* Phase Dropdown */}
              <div className="md:col-span-1">
                <select
                  value={stratPhaseFilter}
                  onChange={(e) => setStratPhaseFilter(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 text-stone-300 text-xs rounded-lg p-2.5 focus:outline-none focus:border-amber-500/50"
                >
                  <option value="all">All Trigger Phases</option>
                  <option value="any">Any Phase</option>
                  <option value="Command">Command / Battle-shock</option>
                  <option value="Movement">Movement Phase</option>
                  <option value="Shooting">Shooting Phase</option>
                  <option value="Charge">Charge Phase</option>
                  <option value="Fight">Fight Phase</option>
                </select>
              </div>

              {/* CP Cost Dropdown */}
              <div className="md:col-span-1">
                <select
                  value={stratCpFilter}
                  onChange={(e) => setStratCpFilter(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 text-stone-300 text-xs rounded-lg p-2.5 focus:outline-none focus:border-amber-500/50"
                >
                  <option value="all">All CP Costs</option>
                  <option value="1">1 CP Only</option>
                  <option value="2">2 CP Only</option>
                </select>
              </div>
            </div>

            {/* List Grid of Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredStratagems.length > 0 ? (
                filteredStratagems.map((strat, idx) => {
                  const isFaction = strat.type === "faction";
                  
                  // Get faction specific border accents to give an elite look
                  let accentClass = "border-slate-800 bg-slate-950/60";
                  if (isFaction) {
                    if (activeFaction.id === "space_marines") accentClass = "border-sky-600/30 bg-sky-950/10";
                    else if (activeFaction.id === "tyranids") accentClass = "border-purple-600/30 bg-purple-950/10";
                    else if (activeFaction.id === "necrons") accentClass = "border-emerald-600/30 bg-emerald-950/10";
                    else if (activeFaction.id === "aeldari") accentClass = "border-amber-600/30 bg-amber-950/10";
                    else if (activeFaction.id === "orks") accentClass = "border-green-600/30 bg-green-950/10";
                    else if (activeFaction.id === "chaos_space_marines") accentClass = "border-red-600/30 bg-red-950/10";
                    else if (activeFaction.id === "astra_militarum") accentClass = "border-yellow-600/30 bg-yellow-950/10";
                    else if (activeFaction.id === "adeptus_custodes") accentClass = "border-orange-600/30 bg-orange-950/10";
                  }

                  return (
                    <div 
                      key={idx} 
                      className={`border rounded-xl p-4.5 flex flex-col justify-between gap-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${accentClass}`}
                    >
                      <div className="flex flex-col gap-2.5">
                        {/* Header: Name, CP Cost and Source tag */}
                        <div className="flex items-start justify-between gap-2 border-b border-grim-border/40 pb-2">
                          <div className="flex flex-col gap-0.5">
                            <span className="font-bold text-sm text-stone-100 font-display tracking-wider">{strat.name}</span>
                            <span className={`text-[9px] font-mono font-bold tracking-widest uppercase ${isFaction ? "text-amber-500" : "text-stone-500"}`}>
                              {strat.factionName}
                            </span>
                          </div>
                          <span className="text-xs font-mono font-black bg-amber-500/10 border border-amber-500/30 text-amber-400 px-2 py-0.5 rounded-md shrink-0">
                            {strat.cost} CP
                          </span>
                        </div>

                        {/* Phase Trigger Tag */}
                        <div className="flex flex-wrap gap-1.5 items-center">
                          <span className={`text-[9px] uppercase font-mono tracking-widest font-extrabold px-2 py-0.5 rounded ${getPhaseStyles(strat.phase)}`}>
                            {strat.phase}
                          </span>
                        </div>

                        {/* Details content */}
                        <div className="flex flex-col gap-2 text-xs">
                          {strat.trigger && (
                            <div className="bg-slate-950/40 rounded p-2 border border-slate-900">
                              <span className="text-[10px] font-mono text-stone-500 uppercase tracking-wider block">Trigger Phase / Action:</span>
                              <p className="text-stone-300 italic font-medium mt-0.5 leading-relaxed font-sans">{strat.trigger}</p>
                            </div>
                          )}
                          <div className="leading-relaxed">
                            <span className="text-[10px] font-mono text-stone-500 uppercase tracking-wider block">Strategic Effect:</span>
                            <p className="text-stone-300 mt-1 whitespace-pre-line font-sans">{strat.effect}</p>
                          </div>
                        </div>
                      </div>

                      {/* Interactive sandbox invocation button */}
                      <button
                        onClick={() => handleSimulateStratagem(strat.name, strat.cost)}
                        className={`w-full py-2 rounded-lg font-mono text-xs font-bold transition duration-200 cursor-pointer active:scale-98 ${
                          sandboxCp >= strat.cost 
                            ? "bg-amber-500 hover:bg-amber-400 text-slate-950" 
                            : "bg-slate-900/60 border border-slate-800 text-stone-500 hover:bg-slate-900"
                        }`}
                      >
                        Simulate Activation {sandboxCp >= strat.cost ? "✓" : "(Low CP)"}
                      </button>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-full text-center py-10 text-stone-500 text-xs border border-dashed border-slate-800 rounded-xl bg-slate-950/20 font-sans">
                  No stratagems match your search filters. Try clearing the filters or modifying your query.
                </div>
              )}
            </div>

          </div>
        );
      })()}

      {/* TAB CONTENT: DATACARDS & POINTS */}
      {selectedTab === "cards" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="cards-tab-content">
          {/* Left / Top Side: Cards search & selection */}
          <div className="lg:col-span-1 flex flex-col gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-3.5 w-4 h-4 text-gray-500" />
              <input
                id="card-search-input"
                type="text"
                placeholder="Search units or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-3 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>

            {/* List of Unit Datacards */}
            <div className="flex flex-col gap-2 max-h-[500px] lg:max-h-[700px] overflow-y-auto pr-1" id="datacard-buttons-list">
              {filteredCards.length > 0 ? (
                filteredCards.map(unit => (
                  <div key={unit.id} className="flex flex-col gap-1">
                    <button
                      id={`unit-card-btn-${unit.id}`}
                      onClick={() => {
                        if (expandedCodexUnitIds.includes(unit.id)) {
                           setExpandedCodexUnitIds(expandedCodexUnitIds.filter(id => id !== unit.id));
                        } else {
                           setExpandedCodexUnitIds([...expandedCodexUnitIds, unit.id]);
                        }
                        setSelectedCardId(unit.id);
                      }}
                      className={`flex items-center justify-between p-4 rounded-xl border text-left transition-all duration-200 active:scale-[0.98] ${
                        selectedCardId === unit.id
                          ? "bg-amber-500/10 border-amber-500 text-amber-300"
                          : "bg-slate-900 border-slate-800 text-gray-300 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex flex-col gap-1 min-w-0">
                        <span className="font-bold text-sm truncate">{unit.name}</span>
                        <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                          <span className="text-[10px] uppercase font-mono tracking-wider text-sky-400 bg-sky-950 px-1.5 py-0.5 rounded border border-sky-900/30">
                            {unit.type}
                          </span>
                          {["intercessors", "termagants", "warriors", "guardians"].includes(unit.id) && (
                            <span className="text-[9px] uppercase font-mono font-bold tracking-wider text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-800/40" title="Great starting unit with simple, straightforward mechanics!">
                              ★ Recruit Pick
                            </span>
                          )}
                          <span className="text-[10px] text-gray-500 truncate font-mono">
                            {unit.squadSize}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 shrink-0 font-mono font-bold text-amber-400 text-sm bg-slate-950 px-2 py-1 rounded border border-slate-800">
                          <span>{unit.points}</span>
                          <span className="text-[10px] text-gray-500">pts</span>
                        </div>
                        {expandedCodexUnitIds.includes(unit.id) ? <ChevronUp className="w-4 h-4 text-amber-400"/> : <ChevronDown className="w-4 h-4 text-gray-500"/>}
                      </div>
                    </button>
                    {expandedCodexUnitIds.includes(unit.id) && (
                      <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl mt-1">
                        <SelectedCardDetail 
                          unit={unit} 
                          onKeywordClick={(term) => {
                            const cleaned = term.replace(/[\[\]0-9+]/g, "").trim().toLowerCase();
                            
                            // Check custom stat glossary definitions
                            const statGlossary: Record<string, { keyword: string; type: string; explanation: string }> = {
                              m: {
                                keyword: "M - Movement Characteristic",
                                type: "Unit Profile Statistic",
                                explanation: "Movement (measured in inches) determines how far this unit can move during the Movement Phase. Perfect for positioning, charging, or claiming key objectives!"
                              },
                              t: {
                                keyword: "T - Toughness Characteristic",
                                type: "Unit Profile Statistic",
                                explanation: "Toughness represents how resilient a model is. When an enemy attacks, they compare their weapon Strength against this Toughness to see what dice roll is needed to wound you."
                              },
                              sv: {
                                keyword: "SV - Save Characteristic",
                                type: "Unit Profile Statistic",
                                explanation: "Save determines the armor check you roll when taking a hit. If you roll equal to or higher than this value (modified by weapon AP), you completely block the damage!"
                              },
                              w: {
                                keyword: "W - Wounds Characteristic",
                                type: "Unit Profile Statistic",
                                explanation: "Wounds represent the total health pool of each model in this unit. If a model takes damage equal to its W characteristic, it is removed as a casualty."
                              },
                              ld: {
                                keyword: "LD - Leadership Characteristic",
                                type: "Unit Profile Statistic",
                                explanation: "Leadership is rolled using two 6-sided dice for Battle-shock checks. To pass, you must roll equal to or higher than this value. Failing weakens your objective control and stratagem usage."
                              },
                              oc: {
                                keyword: "OC - Objective Control Characteristic",
                                type: "Unit Profile Statistic",
                                explanation: "Objective Control represents this model's ability to hold territory. The player with the highest total OC score near an objective marker claims it for victory points!"
                              },
                              points: {
                                keyword: "Points",
                                type: "Army List Statistic",
                                explanation: "Points represent the 'cost' of including this unit in your army. You have a total points limit for your army list, so choose wisely!"
                              }
                            };
                            
                            if (statGlossary[cleaned]) {
                              setActiveGlossaryTerm(statGlossary[cleaned]);
                            } else {
                              const match = glossaryItems.find(i => i.keyword.toLowerCase().includes(cleaned));
                              if (match) setActiveGlossaryTerm(match);
                            }
                          }} 
                        />
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500 text-sm border border-slate-800 rounded-xl bg-slate-900/50">
                  No datacards found matching query.
                </div>
              )}
            </div>
          </div>

          {/* Right / Bottom Side: Detailed Datacard View */}
          <div className="lg:col-span-2">
            {selectedCardId ? (
              <SelectedCardDetail 
                unit={activeFaction.units.find(u => u.id === selectedCardId)!} 
                onKeywordClick={(term) => {
                  const cleaned = term.replace(/[\[\]0-9+]/g, "").trim().toLowerCase();
                  
                  // Check custom stat glossary definitions
                  const statGlossary: Record<string, { keyword: string; type: string; explanation: string }> = {
                    m: {
                      keyword: "M - Movement Characteristic",
                      type: "Unit Profile Statistic",
                      explanation: "Movement (measured in inches) determines how far this unit can move during the Movement Phase. Perfect for positioning, charging, or claiming key objectives!"
                    },
                    t: {
                      keyword: "T - Toughness Characteristic",
                      type: "Unit Profile Statistic",
                      explanation: "Toughness represents how resilient a model is. When an enemy attacks, they compare their weapon Strength against this Toughness to see what dice roll is needed to wound you."
                    },
                    sv: {
                      keyword: "SV - Save Characteristic",
                      type: "Unit Profile Statistic",
                      explanation: "Save determines the armor check you roll when taking a hit. If you roll equal to or higher than this value (modified by weapon AP), you completely block the damage!"
                    },
                    w: {
                      keyword: "W - Wounds Characteristic",
                      type: "Unit Profile Statistic",
                      explanation: "Wounds represent the total health pool of each model in this unit. If a model takes damage equal to its W characteristic, it is removed as a casualty."
                    },
                    ld: {
                      keyword: "LD - Leadership Characteristic",
                      type: "Unit Profile Statistic",
                      explanation: "Leadership is rolled using two 6-sided dice for Battle-shock checks. To pass, you must roll equal to or higher than this value. Failing weakens your objective control and stratagem usage."
                    },
                    oc: {
                      keyword: "OC - Objective Control Characteristic",
                      type: "Unit Profile Statistic",
                      explanation: "Objective Control represents this model's ability to hold territory. The player with the highest total OC score near an objective marker claims it for victory points!"
                    },
                    points: {
                      keyword: "Points Cost & Army Limits",
                      type: "Core List Building Rule",
                      explanation: "Every model and squad has a points value reflecting its battle prowess. When playing, you agree with your opponent on a limit (typically 1,000 or 2,000 points) and build your roster to fit exactly within that limit. Points balance the game so both armies have equal fighting power!"
                    },
                    pts: {
                      keyword: "Points Cost & Army Limits",
                      type: "Core List Building Rule",
                      explanation: "Every model and squad has a points value reflecting its battle prowess. When playing, you agree with your opponent on a limit (typically 1,000 or 2,000 points) and build your roster to fit exactly within that limit. Points balance the game so both armies have equal fighting power!"
                    },
                    character: {
                      keyword: "Character Role",
                      type: "Battlefield Archetype",
                      explanation: "Characters are the heroic leaders or supreme commanders of your army. They cannot be targeted by normal ranged attacks while attached to a bodyguard squad (due to the Leader rule). Your army MUST designate exactly one of your Characters as the supreme Warlord!"
                    },
                    battleline: {
                      keyword: "Battleline Role",
                      type: "Battlefield Archetype",
                      explanation: "Battleline units form the backbone of your army. They are reliable, relatively low-cost, and standard matching play rules allow you to take up to 6 copies of these units (instead of the usual limit of 3 copies) to capture objectives."
                    },
                    infantry: {
                      keyword: "Infantry Role",
                      type: "Battlefield Archetype",
                      explanation: "Infantry represents foot soldiers. They can breach and move freely through Ruin walls, climb upper floors of structures, and are eligible to be targeted by infantry-only stratagems like 'Go To Ground'."
                    },
                    vehicle: {
                      keyword: "Vehicle Role",
                      type: "Battlefield Archetype",
                      explanation: "Vehicles represent heavy tanks, combat walkers, or troop transports. They have high Toughness and Wounds, can fire inside engagement range (Big Guns Never Tire rule), but cannot move through solid ruin walls and suffer from reduced climbing agility."
                    },
                    mounted: {
                      keyword: "Mounted Role",
                      type: "Battlefield Archetype",
                      explanation: "Mounted units represent cavalry, bikers, or jetbike riders. They are extremely fast, possess high movement stats for flanking, but count as larger models that cannot breach or phase through solid ruin walls."
                    },
                    monster: {
                      keyword: "Monster Role",
                      type: "Battlefield Archetype",
                      explanation: "Monsters are towering beasts or gargantuan alien creatures. They possess extreme offensive capabilities in melee and range, can fire inside engagement range (Big Guns Never Tire), but have massive bases making movement through tight terrain spaces challenging."
                    }
                  };

                  if (statGlossary[cleaned]) {
                    setActiveGlossaryTerm(statGlossary[cleaned]);
                    return;
                  }

                  const found = glossaryItems.find(item => 
                    item.keyword.toLowerCase().includes(cleaned) || 
                    cleaned.includes(item.keyword.replace(/[\[\]0-9+]/g, "").trim().toLowerCase())
                  );
                  if (found) {
                    setActiveGlossaryTerm(found);
                  } else {
                    setActiveGlossaryTerm({
                      keyword: term,
                      type: "Glossary / Keyword Rule",
                      explanation: `This is a specific key name (${term}) associated with this unit or weapon. Refer to the character's Special Rules & Abilities panel or consult the Rule Sage for its direct mechanical application.`
                    });
                  }
                }}
              />
            ) : (
              <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center p-6 bg-slate-900/30 border border-dashed border-slate-800 rounded-2xl gap-2 text-gray-500">
                <Info className="w-8 h-8 text-slate-700" />
                <p className="text-sm">Select a datacard on the left to inspect its full Codex profile, including stats, weapons, rules, and keywords.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT: RULES GLOSSARY & UNIT ROLES */}
      {selectedTab === "glossary" && (
        <div className="flex flex-col gap-6 animate-fade-in" id="glossary-tab-content">
          
          {/* Section 1: Unit Roles Explainer */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col gap-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
              <Book className="w-5 h-5 text-amber-500" />
              <h3 className="font-bold text-slate-200">Unit Types & Roles Cheat Sheet</h3>
            </div>
            <p className="text-xs text-gray-400">Warhammer 40k models are classified by their unit profile types. Knowing these roles is key to scoring objectives and list building:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-1">
              {unitRoles.map((role, idx) => (
                <div key={idx} className="bg-slate-950 border border-slate-850 p-4 rounded-xl flex gap-3">
                  <div className="w-10 h-10 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center text-lg text-amber-400 shrink-0 font-bold">
                    {role.icon}
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold text-slate-200 font-mono uppercase tracking-wider">{role.name}</span>
                    <p className="text-xs text-gray-400 leading-relaxed">{role.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Core Keywords Glossary */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-sky-400" />
                <h3 className="font-bold text-slate-200">Core Rules & Weapon Keywords Glossary</h3>
              </div>
              <div className="relative w-full sm:w-64 shrink-0">
                <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search keywords (e.g. Assault)..."
                  value={glossarySearch}
                  onChange={(e) => setGlossarySearch(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 rounded-lg pl-8 pr-3 py-1.5 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-amber-500/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3" id="glossary-grid">
              {filteredGlossary.length > 0 ? (
                filteredGlossary.map((item, idx) => (
                  <div key={idx} className="bg-slate-950 border border-slate-850 p-4 rounded-xl flex flex-col gap-2 hover:border-slate-800 transition">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-black text-xs text-amber-400 uppercase tracking-widest bg-amber-500/5 px-2 py-1 rounded border border-amber-500/10">
                        {item.keyword}
                      </span>
                      <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-gray-500">
                        {item.type}
                      </span>
                    </div>
                    <p className="text-xs text-gray-300 leading-relaxed mt-1">{item.explanation}</p>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-6 text-gray-500 text-xs italic">
                  No keywords found matching "{glossarySearch}".
                </div>
              )}
            </div>
          </div>

        </div>
      )}

      {selectedTab === "hobby" && (
        <div className="flex flex-col gap-6 animate-fade-in" id="hobby-tab-content">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col gap-4">
            <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <div>
                <h3 className="font-bold text-slate-100">Hobbyist Painting Guide: {activeFaction.name}</h3>
                <p className="text-xs text-gray-400 mt-0.5">Step-by-step novice-friendly advice to get your miniatures tabletop ready!</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Paint Palette Card */}
              <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl flex flex-col gap-3 md:col-span-1">
                <span className="text-xs font-bold text-amber-400 font-mono tracking-wider uppercase border-b border-slate-900 pb-1.5">Recommended Paints</span>
                {activeFaction.id === "space_marines" && (
                  <div className="flex flex-col gap-2.5 text-xs">
                    <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-[#1b3a6e] border border-slate-755" /> <span>Base: Macragge Blue</span></div>
                    <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-[#9e7a2e] border border-slate-755" /> <span>Trim: Retributor Armour</span></div>
                    <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-[#2a2a2a] border border-slate-755" /> <span>Joints: Abaddon Black</span></div>
                    <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-[#101010] border border-slate-755" /> <span>Wash: Nuln Oil (All-over)</span></div>
                    <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-[#4073c4] border border-slate-755" /> <span>Highlight: Calgar Blue</span></div>
                  </div>
                )}
                {activeFaction.id === "tyranids" && (
                  <div className="flex flex-col gap-2.5 text-xs">
                    <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-[#dfd7c2] border border-slate-755" /> <span>Skin: Wraithbone (Base)</span></div>
                    <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-[#3d1844] border border-slate-755" /> <span>Carapace: Naggaroth Night</span></div>
                    <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-[#a31a48] border border-slate-755" /> <span>Vents: Screamer Pink</span></div>
                    <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-[#49161a] border border-slate-755" /> <span>Wash: Carroburg Crimson</span></div>
                    <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-[#c9527f] border border-slate-755" /> <span>Highlight: Kakophoni Purple</span></div>
                  </div>
                )}
                {activeFaction.id === "necrons" && (
                  <div className="flex flex-col gap-2.5 text-xs">
                    <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-[#5d6063] border border-slate-755" /> <span>Metal: Leadbelcher (Base)</span></div>
                    <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-[#00ff40] shadow-[0_0_8px_rgba(0,255,64,0.4)] border border-slate-755" /> <span>Glow: Tesseract Glow</span></div>
                    <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-[#312519] border border-slate-755" /> <span>Bronze: Runelord Brass</span></div>
                    <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-[#3e421a] border border-slate-755" /> <span>Wash: Reikland Fleshshade</span></div>
                    <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-[#b0b3b5] border border-slate-755" /> <span>Highlight: Runefang Steel</span></div>
                  </div>
                )}
                {activeFaction.id === "aeldari" && (
                  <div className="flex flex-col gap-2.5 text-xs">
                    <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-[#a81616] border border-slate-755" /> <span>Armor: Mephiston Red</span></div>
                    <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-[#f2edd2] border border-slate-755" /> <span>Helmet: Ushabti Bone</span></div>
                    <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-[#18536b] border border-slate-755" /> <span>Weapons: Stegadon Scale Green</span></div>
                    <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-[#0e3012] border border-slate-755" /> <span>Wash: Biel-Tan Green (Shade)</span></div>
                    <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-[#e84141] border border-slate-755" /> <span>Highlight: Evil Sunz Scarlet</span></div>
                  </div>
                )}
              </div>

              {/* Painting Steps */}
              <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl flex flex-col gap-3 md:col-span-2 text-xs">
                <span className="text-xs font-bold text-sky-400 font-mono tracking-wider uppercase border-b border-slate-900 pb-1.5">3-Step Tabletop Method</span>
                
                <div className="flex flex-col gap-3">
                  <div className="flex gap-3">
                    <div className="w-6 h-6 bg-amber-500 text-slate-950 font-black font-mono flex items-center justify-center rounded-full shrink-0">1</div>
                    <div className="flex flex-col gap-0.5">
                      <span className="font-bold text-slate-200">Basecoat / Block-in:</span>
                      <p className="text-gray-400">Apply 2 thin layers of your basecoat paint. Don't worry if it looks patchy in one layer; two thin coats give a completely flat, professional finish.</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-6 h-6 bg-amber-500 text-slate-950 font-black font-mono flex items-center justify-center rounded-full shrink-0">2</div>
                    <div className="flex flex-col gap-0.5">
                      <span className="font-bold text-slate-200">Wash / Shade:</span>
                      <p className="text-gray-400">Slather a thin layer of shade (like Nuln Oil) over the miniature. It will automatically run into deep recess creases, giving instant shadow depth and separating mechanical panels.</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-6 h-6 bg-amber-500 text-slate-950 font-black font-mono flex items-center justify-center rounded-full shrink-0">3</div>
                    <div className="flex flex-col gap-0.5">
                      <span className="font-bold text-slate-200">Highlight / Drybrush:</span>
                      <p className="text-gray-400">Use a lighter shade. For Necrons, lightly drybrush silver over metallic parts. For Space Marines, trace the raised edges of shoulder pads to make the power armor pop!</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Hobby Rules 101 Card */}
            <div className="bg-slate-950/60 border border-slate-850 p-4.5 rounded-xl flex flex-col gap-2.5 mt-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono">The 3 Golden Hobbyist Commandments</span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs mt-1">
                <div className="bg-slate-900/40 p-3 rounded-lg border border-slate-800">
                  <strong className="text-slate-200 font-mono">I. Always Thin Your Paints</strong>
                  <p className="text-gray-400 mt-1">Take a bit of paint from your pot, put it on a palette, and mix a tiny drop of water. This prevents clogging the miniature's elegant facial details.</p>
                </div>
                <div className="bg-slate-900/40 p-3 rounded-lg border border-slate-800">
                  <strong className="text-slate-200 font-mono">II. Prime Before You Paint</strong>
                  <p className="text-gray-400 mt-1">Always spray or paint a matte primer coat (Black, Grey, or White) first. Paint will peel right off bare plastic miniatures if not primed!</p>
                </div>
                <div className="bg-slate-900/40 p-3 rounded-lg border border-slate-800">
                  <strong className="text-slate-200 font-mono">III. Mold Line Cleanup Matters</strong>
                  <p className="text-gray-400 mt-1">Before gluing, use the back of a hobby knife blade to scrape off the thin plastic ridges where the sprues were joined. It makes a huge difference!</p>
                </div>
              </div>
            </div>

            {/* MY PAINTING PROGRESS TRACKER (Feature 2) */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col gap-4 mt-2">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Brush className="w-5 h-5 text-amber-400" />
                  <div>
                    <h4 className="font-bold text-slate-200">Interactive Painting Progress Tracker</h4>
                    <span className="text-[10px] text-gray-500 font-mono uppercase tracking-wider">Get +10 Victory Points for Fully Painted Armies!</span>
                  </div>
                </div>
                {/* Score badge */}
                <div className="text-right">
                  <span className="text-[10px] font-mono text-gray-500 uppercase">Army Paint Status</span>
                  <div className="text-xs font-mono font-bold text-emerald-400">
                    {paintingSquads.filter(s => s.factionId === activeFaction.id && (s.status === "BattleReady" || s.status === "ParadeReady")).length} / {paintingSquads.filter(s => s.factionId === activeFaction.id).length || 1} Battle Ready
                  </div>
                </div>
              </div>

              <p className="text-xs text-gray-400">Beat grey-plastic anxiety! List the squads you are assembling, track their completion levels, and click their status buttons to cycle progress.</p>

              {/* Progress Bar */}
              {paintingSquads.filter(s => s.factionId === activeFaction.id).length > 0 && (
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 flex flex-col gap-1.5 text-xs">
                  <div className="flex justify-between text-gray-500 font-mono text-[10px]">
                    <span>BATTLE-READY COMPLETION</span>
                    <strong className="text-amber-400 font-black">
                      {Math.round((paintingSquads.filter(s => s.factionId === activeFaction.id && (s.status === "BattleReady" || s.status === "ParadeReady")).length / (paintingSquads.filter(s => s.factionId === activeFaction.id).length || 1)) * 100)}%
                    </strong>
                  </div>
                  <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-850">
                    <div 
                      className="bg-emerald-500 h-full transition-all duration-300 shadow-[0_0_8px_rgba(16,185,129,0.3)]" 
                      style={{ 
                        width: `${(paintingSquads.filter(s => s.factionId === activeFaction.id && (s.status === "BattleReady" || s.status === "ParadeReady")).length / (paintingSquads.filter(s => s.factionId === activeFaction.id).length || 1)) * 100}%` 
                      }} 
                    />
                  </div>
                  <span className="text-[10px] text-gray-500 italic">
                    {paintingSquads.filter(s => s.factionId === activeFaction.id && (s.status === "BattleReady" || s.status === "ParadeReady")).length === paintingSquads.filter(s => s.factionId === activeFaction.id).length 
                      ? "🌟 Fantastic! Your army is completely Battle Ready! You qualify for the full +10 VP bonus in matched games!" 
                      : "💡 Keep painting! Under Warhammer 10th edition rules, having your entire army 'Battle Ready' (3+ colors and basic textured bases) instantly awards you 10 Victory Points in matches!"}
                  </span>
                </div>
              )}

              {/* Add New Squad Form */}
              <div className="flex gap-2">
                <input 
                  type="text"
                  placeholder="Enter squad name (e.g. Infernus Squad)..."
                  value={newSquadName}
                  onChange={(e) => setNewSquadName(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-amber-500"
                />
                <button
                  onClick={() => {
                    if (!newSquadName.trim()) return;
                    const newSquad = {
                      id: Date.now().toString(),
                      name: newSquadName.trim(),
                      factionId: activeFaction.id,
                      status: "Grey" as const
                    };
                    saveSquads([...paintingSquads, newSquad]);
                    setNewSquadName("");
                  }}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black p-2 rounded-xl text-xs flex items-center gap-1 cursor-pointer active:scale-95 transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>Log Squad</span>
                </button>
              </div>

              {/* Squads List */}
              <div className="flex flex-col gap-2">
                {paintingSquads.filter(s => s.factionId === activeFaction.id).length > 0 ? (
                  paintingSquads.filter(s => s.factionId === activeFaction.id).map(squad => {
                    const statusConfig = {
                      Grey: { label: "Grey Plastic 🔘", styles: "bg-slate-950 border-slate-800 text-gray-400" },
                      Primed: { label: "Primed ◼️", styles: "bg-blue-950/20 border-blue-900/50 text-blue-400" },
                      BattleReady: { label: "Battle Ready 🎨", styles: "bg-emerald-950/30 border-emerald-900/50 text-emerald-400 font-bold" },
                      ParadeReady: { label: "Parade Ready ✨", styles: "bg-amber-500/10 border-amber-500/30 text-amber-400 font-black" }
                    };

                    const cycleStatus = () => {
                      const stages: ("Grey" | "Primed" | "BattleReady" | "ParadeReady")[] = ["Grey", "Primed", "BattleReady", "ParadeReady"];
                      const currentIdx = stages.indexOf(squad.status);
                      const nextIdx = (currentIdx + 1) % stages.length;
                      
                      const updated = paintingSquads.map(s => 
                        s.id === squad.id ? { ...s, status: stages[nextIdx] } : s
                      );
                      saveSquads(updated);
                    };

                    const deleteSquad = () => {
                      saveSquads(paintingSquads.filter(s => s.id !== squad.id));
                    };

                    const current = statusConfig[squad.status];

                    return (
                      <div key={squad.id} className="bg-slate-950 border border-slate-850 px-4 py-3 rounded-xl flex items-center justify-between gap-3 hover:border-slate-800 transition">
                        <div className="flex flex-col gap-0.5 min-w-0">
                          <span className="text-xs font-bold text-slate-200 truncate">{squad.name}</span>
                          <span className="text-[10px] text-gray-500 uppercase font-mono tracking-wider">{activeFaction.name}</span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={cycleStatus}
                            className={`text-[10px] font-mono px-3 py-1.5 rounded-lg border transition active:scale-95 cursor-pointer ${current.styles}`}
                            title="Click to cycle painting status"
                          >
                            {current.label}
                          </button>
                          <button
                            onClick={deleteSquad}
                            className="p-1.5 bg-slate-900 hover:bg-red-500/10 border border-slate-800 hover:border-red-500/30 rounded-lg text-gray-500 hover:text-red-400 transition cursor-pointer active:scale-95"
                            title="Delete squad log"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-6 border border-dashed border-slate-800 rounded-xl text-gray-500 text-xs italic">
                    No squads logged for {activeFaction.name}. Enter a squad above to start tracking!
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Interactive Rules Keyword Tooltip / Overlay */}
      {activeGlossaryTerm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 animate-fade-in" onClick={() => setActiveGlossaryTerm(null)}>
          <div className="bg-slate-900 border border-amber-500/60 rounded-2xl max-w-md w-full p-6 shadow-2xl relative flex flex-col gap-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-mono font-bold bg-amber-500/10 border border-amber-500/20 text-amber-400 px-2.5 py-1 rounded">
                {activeGlossaryTerm.type}
              </span>
              <button 
                className="text-xs text-gray-500 hover:text-gray-300 font-mono cursor-pointer transition"
                onClick={() => setActiveGlossaryTerm(null)}
              >
                [Dismiss]
              </button>
            </div>
            <div className="flex flex-col gap-1.5">
              <h4 className="text-lg font-black tracking-tight text-amber-400 uppercase font-mono">{activeGlossaryTerm.keyword}</h4>
              <p className="text-sm text-slate-200 leading-relaxed font-sans">{activeGlossaryTerm.explanation}</p>
            </div>
            <div className="mt-2 text-[10px] text-gray-500 font-mono bg-slate-950/50 p-2.5 border border-slate-850 rounded-lg">
              <strong className="text-amber-500 font-black">Recruit Wisdom:</strong> This is a key 10th Edition tabletop rule. Keep it handy during your Command, Movement, and Combat Phases.
            </div>
            <button
              onClick={() => setActiveGlossaryTerm(null)}
              className="mt-2 w-full bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black font-mono py-2.5 rounded-xl cursor-pointer transition active:scale-95 shadow-md"
            >
              GOT IT, COMMENCING BATTLE
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Sub-Component for detailed card inspection
function SelectedCardDetail({ unit, onKeywordClick }: { unit: Datacard; onKeywordClick: (term: string) => void }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col gap-5 animate-fade-in" id="datacard-detail">
      {/* Name and Type header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-100">{unit.name}</h3>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <button 
              onClick={() => onKeywordClick(unit.type)}
              className="text-xs font-mono font-bold bg-sky-950 hover:bg-sky-900 text-sky-300 border border-sky-800 hover:border-sky-400 px-2.5 py-0.5 rounded-full transition cursor-pointer active:scale-95"
              title={`Click to learn about the ${unit.type} battlefield archetype`}
            >
              🛡️ {unit.type} Role
            </button>
            <span className="text-xs text-gray-400 font-mono">{unit.squadSize}</span>
          </div>
        </div>
        <button 
          onClick={() => onKeywordClick("points")}
          className="flex items-center gap-1.5 font-mono font-black text-amber-400 text-lg bg-slate-950 hover:bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 hover:border-amber-500/40 transition cursor-pointer active:scale-95 self-start sm:self-center"
          title="Click to understand points limits"
        >
          <span>{unit.points}</span>
          <span className="text-xs text-gray-500 font-bold">PTS</span>
        </button>
      </div>

      {/* Warhammer Profile Stats Grid */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest font-mono">Unit Profile Stats</span>
          <span className="text-[9px] text-amber-500/85 font-mono tracking-wider animate-pulse flex items-center gap-1">
            <span>ℹ</span>
            <span>Tap stats for explanations</span>
          </span>
        </div>
        <div className="grid grid-cols-6 gap-2 bg-slate-950 border border-slate-800 p-2 rounded-xl text-center font-mono" id="stats-grid">
          <button 
            onClick={() => onKeywordClick("M")}
            className="flex flex-col bg-slate-900/40 hover:bg-slate-900 p-2 rounded-lg border border-slate-800/30 hover:border-slate-700 active:scale-95 cursor-pointer transition"
            title="Click to learn about Movement (M)"
          >
            <span className="text-xs text-gray-500 font-bold">M</span>
            <span className="text-sm font-bold text-slate-200 mt-1">{unit.stats.m}</span>
          </button>
          <button 
            onClick={() => onKeywordClick("T")}
            className="flex flex-col bg-slate-900/40 hover:bg-slate-900 p-2 rounded-lg border border-slate-800/30 hover:border-slate-700 active:scale-95 cursor-pointer transition"
            title="Click to learn about Toughness (T)"
          >
            <span className="text-xs text-gray-500 font-bold">T</span>
            <span className="text-sm font-bold text-slate-200 mt-1">{unit.stats.t}</span>
          </button>
          <button 
            onClick={() => onKeywordClick("SV")}
            className="flex flex-col bg-slate-900/40 hover:bg-slate-900 p-2 rounded-lg border border-slate-800/30 hover:border-slate-700 active:scale-95 cursor-pointer transition"
            title="Click to learn about Save (SV)"
          >
            <span className="text-xs text-gray-500 font-bold">SV</span>
            <span className="text-sm font-bold text-slate-200 mt-1">{unit.stats.sv}</span>
          </button>
          <button 
            onClick={() => onKeywordClick("W")}
            className="flex flex-col bg-slate-900/40 hover:bg-slate-900 p-2 rounded-lg border border-slate-800/30 hover:border-slate-700 active:scale-95 cursor-pointer transition"
            title="Click to learn about Wounds (W)"
          >
            <span className="text-xs text-gray-500 font-bold">W</span>
            <span className="text-sm font-bold text-slate-200 mt-1">{unit.stats.w}</span>
          </button>
          <button 
            onClick={() => onKeywordClick("LD")}
            className="flex flex-col bg-slate-900/40 hover:bg-slate-900 p-2 rounded-lg border border-slate-800/30 hover:border-slate-700 active:scale-95 cursor-pointer transition"
            title="Click to learn about Leadership (LD)"
          >
            <span className="text-xs text-gray-500 font-bold">LD</span>
            <span className="text-sm font-bold text-slate-200 mt-1">{unit.stats.ld}</span>
          </button>
          <button 
            onClick={() => onKeywordClick("OC")}
            className="flex flex-col bg-slate-900/40 hover:bg-slate-900 p-2 rounded-lg border border-slate-800/30 hover:border-slate-700 active:scale-95 cursor-pointer transition"
            title="Click to learn about Objective Control (OC)"
          >
            <span className="text-xs text-gray-500 font-bold">OC</span>
            <span className="text-sm font-bold text-slate-200 mt-1">{unit.stats.oc}</span>
          </button>
        </div>
        {unit.stats.invul && (
          <div className="flex items-center gap-2 mt-1 text-xs text-amber-400 bg-amber-500/5 border border-amber-500/20 px-3 py-1.5 rounded-lg font-mono">
            <span className="font-black bg-amber-500 text-slate-950 px-1.5 py-0.5 rounded text-[10px]">INVUL</span>
            <span>This unit possesses a <strong>{unit.stats.invul} Invulnerable Save</strong>.</span>
          </div>
        )}
      </div>

      {/* Ranged Weapons Section */}
      {unit.weapons.ranged.length > 0 && (
        <div className="flex flex-col gap-2">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest font-mono">Ranged Weapons</span>
          <div className="flex flex-col gap-2 overflow-x-auto" id="ranged-weapons-list">
            <table className="w-full text-left border-collapse text-xs bg-slate-950 border border-slate-800 rounded-xl overflow-hidden min-w-[500px]">
              <thead>
                <tr className="bg-slate-900 border-b border-slate-800 text-gray-400 uppercase font-mono text-[10px]">
                  <th className="p-3 font-semibold">Weapon Name</th>
                  <th className="p-3 font-semibold">Range</th>
                  <th className="p-3 font-semibold">Attacks</th>
                  <th className="p-3 font-semibold">BS</th>
                  <th className="p-3 font-semibold">S</th>
                  <th className="p-3 font-semibold">AP</th>
                  <th className="p-3 font-semibold">D</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-gray-300 font-mono">
                {unit.weapons.ranged.map((w, i) => (
                  <tr key={i} className="hover:bg-slate-900/40">
                    <td className="p-3 font-sans font-bold text-slate-200">
                      <div>
                        <div>{w.name}</div>
                        {w.abilities && w.abilities.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {w.abilities.map((ab, j) => (
                              <button 
                                key={j} 
                                onClick={() => onKeywordClick(ab)}
                                className="text-[9px] bg-slate-850 hover:bg-slate-800 active:scale-95 cursor-pointer text-amber-400 px-1.5 py-0.5 rounded border border-slate-800/85 transition font-mono font-medium"
                                title="Click to view rule definition"
                              >
                                {ab}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-3">{w.range}</td>
                    <td className="p-3">{w.attacks}</td>
                    <td className="p-3 text-sky-400 font-bold">{w.skill}</td>
                    <td className="p-3">{w.strength}</td>
                    <td className="p-3">{w.ap === 0 ? "0" : w.ap}</td>
                    <td className="p-3 font-bold text-slate-100">{w.damage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Melee Weapons Section */}
      {unit.weapons.melee.length > 0 && (
        <div className="flex flex-col gap-2">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest font-mono">Melee Weapons</span>
          <div className="flex flex-col gap-2 overflow-x-auto" id="melee-weapons-list">
            <table className="w-full text-left border-collapse text-xs bg-slate-950 border border-slate-800 rounded-xl overflow-hidden min-w-[500px]">
              <thead>
                <tr className="bg-slate-900 border-b border-slate-800 text-gray-400 uppercase font-mono text-[10px]">
                  <th className="p-3 font-semibold">Weapon Name</th>
                  <th className="p-3 font-semibold">Range</th>
                  <th className="p-3 font-semibold">Attacks</th>
                  <th className="p-3 font-semibold">WS</th>
                  <th className="p-3 font-semibold">S</th>
                  <th className="p-3 font-semibold">AP</th>
                  <th className="p-3 font-semibold">D</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-gray-300 font-mono">
                {unit.weapons.melee.map((w, i) => (
                  <tr key={i} className="hover:bg-slate-900/40">
                    <td className="p-3 font-sans font-bold text-slate-200">
                      <div>
                        <div>{w.name}</div>
                        {w.abilities && w.abilities.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {w.abilities.map((ab, j) => (
                              <button 
                                key={j} 
                                onClick={() => onKeywordClick(ab)}
                                className="text-[9px] bg-slate-850 hover:bg-slate-800 active:scale-95 cursor-pointer text-amber-400 px-1.5 py-0.5 rounded border border-slate-800/85 transition font-mono font-medium"
                                title="Click to view rule definition"
                              >
                                {ab}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-3">{w.range}</td>
                    <td className="p-3">{w.attacks}</td>
                    <td className="p-3 text-sky-400 font-bold">{w.skill}</td>
                    <td className="p-3">{w.strength}</td>
                    <td className="p-3">{w.ap === 0 ? "0" : w.ap}</td>
                    <td className="p-3 font-bold text-slate-100">{w.damage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Datasheet Abilities Section */}
      <div className="flex flex-col gap-3">
        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest font-mono">Special Rules & Abilities</span>
        
        {/* Core and Faction Abilities listed simply */}
        {(unit.abilities.core || unit.abilities.faction) && (
          <div className="flex flex-wrap gap-2 mb-1">
            {unit.abilities.core?.map((core, i) => (
              <button 
                key={i} 
                onClick={() => onKeywordClick(core)}
                className="text-xs bg-slate-950 hover:bg-slate-900 border border-slate-800 text-gray-300 hover:text-amber-300 px-2.5 py-1 rounded-lg active:scale-95 transition cursor-pointer font-mono"
                title="Click to view rule definition"
              >
                <strong className="text-gray-500 mr-1">Core:</strong> {core}
              </button>
            ))}
            {unit.abilities.faction?.map((fac, i) => (
              <button 
                key={i} 
                onClick={() => onKeywordClick(fac)}
                className="text-xs bg-slate-950 hover:bg-slate-900 border border-slate-800 text-amber-400 hover:text-amber-300 px-2.5 py-1 rounded-lg active:scale-95 transition cursor-pointer font-mono"
                title="Click to view rule definition"
              >
                <strong className="text-amber-600/85 mr-1">Faction:</strong> {fac}
              </button>
            ))}
          </div>
        )}

        {/* Custom Datasheet Rules details */}
        <div className="flex flex-col gap-2">
          {unit.abilities.datasheet.map((ability, i) => (
            <div key={i} className="bg-slate-950 border border-slate-800 p-3 rounded-xl flex flex-col gap-1">
              <span className="text-xs font-bold text-amber-400 font-mono uppercase tracking-wider">{ability.name}</span>
              <p className="text-xs text-gray-300 leading-relaxed whitespace-pre-line">{ability.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Keywords Badge list */}
      <div className="flex flex-col gap-2 border-t border-slate-800 pt-3">
        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest font-mono">Keywords</span>
        <div className="flex flex-wrap gap-1.5" id="keywords-list">
          {unit.keywords.map((kw, i) => (
            <button 
              key={i} 
              onClick={() => onKeywordClick(kw)}
              className="text-[10px] font-bold bg-slate-950 hover:bg-slate-900 active:scale-95 cursor-pointer text-gray-400 hover:text-amber-300 border border-slate-800 hover:border-slate-700 px-2.5 py-1 rounded-md uppercase font-mono tracking-wider transition"
              title="Click to view rule definition"
            >
              {kw}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
