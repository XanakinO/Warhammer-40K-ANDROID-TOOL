import { Faction } from "../../types";

export const necrons: Faction = {
  id: "necrons",
  name: "Necrons",
  iconName: "Skull",
  description: "Ancient, soulless skeletal warriors made of living metal, awakening after millions of years of slumber to reclaim their lost empire.",
  overview: {
    playstyle: "Resilient and relentless, focusing on durability and sustained damage, with units that can reanimate after being destroyed.",
    strengths: ["Incredible durability", "Self-healing models", "Good objective control"],
    weaknesses: ["Slow movement", "Dependent on Leader models for full efficiency"]
  },
  factionRule: {
    name: "Reanimation Protocols",
    description: "At the start of your Command phase, each of your Necrons units activates its Reanimation Protocols and reanimates D3 wounds' worth of destroyed models (fully healing damaged models first, then returning destroyed models to the battlefield with their starting wounds remaining)."
  },
  detachment: {
    name: "Awakened Dynasty",
    description: "Under the direct command of their Royal Nobles, Necron cohorts perform with flawless, ancient military precision.",
    benefit: "Command Protocols: Each time a Necrons unit is led by a Leader model, add +1 to Hit rolls for attacks made by models in that unit.",
    stratagems: [
      {
        name: "Protocol of the Undying Legion",
        cost: 1,
        phase: "Any Phase",
        effect: "Target: One Necrons unit that just suffered casualties. Effect: This unit activates its Reanimation Protocols immediately, reanimating D3 models (or D3+1 models if led by a Leader)."
      },
      {
        name: "Protocol of the Hungry Void",
        cost: 1,
        phase: "Your Fight Phase",
        effect: "Target: One Necrons unit. Effect: Models in this unit gain +1 Strength in melee. If led by a Leader, also increase AP of melee weapons by 1."
      },
      {
        name: "Protocol of the Conquering Tyrant",
        cost: 1,
        phase: "Your Shooting Phase",
        effect: "Target: One Necrons unit in range of an enemy unit. Effect: Re-roll wound rolls of 1. If led by a Leader, re-roll all wound rolls instead."
      }
    ],
    enhancements: [
      { name: "Veil of Darkness", points: 20, description: "Once per battle, in your Movement phase, you can teleport the model and its unit anywhere more than 9\" from enemy units." },
      { name: "Sempiternal Weave", points: 15, description: "The model has a 4+ Feel No Pain." }
    ]
  },
  units: [
    {
      id: "nec_overlord",
      name: "Necron Overlord",
      type: "Character",
      points: 85,
      squadSize: "1 model",
      stats: { m: "5\"", t: 5, sv: "2+", w: 6, ld: "6+", oc: 1, invul: "4+" },
      abilities: {
        core: ["Leader"],
        faction: ["Reanimation Protocols"],
        datasheet: [
          { name: "My Will Be Done", description: "Once per battle round, one unit within 12\" can be targeted with a Stratagem for 0 CP, even if another unit has already been targeted with that stratagem." },
          { name: "Resurrection Orb", description: "At the end of your opponent's Command phase, the unit this model is leading activates its Reanimation Protocols, reanimating D3 wounds." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Tachyon Arrow", range: "72\"", attacks: "1", skill: "2+", strength: 16, ap: -5, damage: "D6+2", abilities: ["One Shot"] }
        ],
        melee: [
          { name: "Voidscythe", range: "Melee", attacks: "3", skill: "3+", strength: 12, ap: -3, damage: "3", abilities: ["Devastating Wounds"] },
          { name: "Overlord's Blade", range: "Melee", attacks: "4", skill: "2+", strength: 6, ap: -2, damage: "2" }
        ]
      },
      keywords: ["Infantry", "Character", "Noble", "Overlord"]
    },
    {
      id: "nec_warriors",
      name: "Necron Warriors",
      type: "Battleline",
      points: 100,
      squadSize: "10 models (Max 20 models for 200 pts)",
      stats: { m: "5\"", t: 4, sv: "4+", w: 1, ld: "7+", oc: 2 },
      abilities: {
        core: [],
        faction: ["Reanimation Protocols"],
        datasheet: [
          { name: "Their Number is Legion", description: "Each time this unit activates its Reanimation Protocols, you can re-roll the D3 roll. If this unit is on an objective you control, it reanimates D3+3 wounds instead of D3." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Gauss Flayer", range: "24\"", attacks: "1", skill: "4+", strength: 4, ap: 0, damage: "1", abilities: ["Lethal Hits"] },
          { name: "Gauss Reaper", range: "12\"", attacks: "2", skill: "4+", strength: 5, ap: -1, damage: "1", abilities: ["Lethal Hits"] }
        ],
        melee: [
          { name: "Close Combat Weapon", range: "Melee", attacks: "1", skill: "4+", strength: 4, ap: 0, damage: "1" }
        ]
      },
      keywords: ["Infantry", "Battleline", "Warriors"]
    },
    {
      id: "nec_doomstalker",
      name: "Canoptek Doomstalker",
      type: "Vehicle",
      points: 145,
      squadSize: "1 model",
      stats: { m: "7\"", t: 8, sv: "3+", w: 12, ld: "7+", oc: 3, invul: "4+" },
      abilities: {
        core: ["Deadly Demise D3"],
        faction: ["Reanimation Protocols"],
        datasheet: [
          { name: "Sentinel Construct", description: "Each time an enemy unit declares a charge targeting a friendly Canoptek unit within 6\", this model can fire Overwatch at that enemy for 0 CP." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Doomsday Blaster (Stationary)", range: "48\"", attacks: "D6+1", skill: "3+", strength: 14, ap: -3, damage: "3", abilities: ["Blast", "Heavy"] },
          { name: "Doomsday Blaster (Moving)", range: "48\"", attacks: "D6", skill: "4+", strength: 14, ap: -3, damage: "3", abilities: ["Blast"] }
        ],
        melee: [
          { name: "Doomstalker Limbs", range: "Melee", attacks: "3", skill: "4+", strength: 6, ap: 0, damage: "1" }
        ]
      },
      keywords: ["Vehicle", "Canoptek", "Doomstalker"]
    },
    {
      id: "nec_technomancer",
      name: "Technomancer",
      type: "Character",
      points: 85,
      squadSize: "1 model",
      stats: { m: "10\"", t: 4, sv: "4+", w: 4, ld: "7+", oc: 1, invul: "4+" },
      abilities: {
        core: ["Leader", "Fly"],
        faction: ["Reanimation Protocols"],
        datasheet: [
          { name: "Rites of Reanimation", description: "At the end of your Movement phase, select one friendly Necrons unit within 6\". That unit activates its Reanimation Protocols, and can reanimate D3 additional wounds." },
          { name: "Canoptek Cloak", description: "While leading a unit, models in that unit have a 5+ Feel No Pain." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Staff of Light", range: "18\"", attacks: "3", skill: "3+", strength: 5, ap: -1, damage: "1", abilities: ["Assault"] }
        ],
        melee: [
          { name: "Technomancer Staff", range: "Melee", attacks: "2", skill: "4+", strength: 4, ap: 0, damage: "1" }
        ]
      },
      keywords: ["Infantry", "Character", "Cryptek", "Fly", "Technomancer"]
    },
    {
      id: "nec_lychguard",
      name: "Lychguard",
      type: "Infantry",
      points: 170,
      squadSize: "5 models",
      stats: { m: "5\"", t: 5, sv: "2+", w: 2, ld: "6+", oc: 1 },
      abilities: {
        core: [],
        faction: ["Reanimation Protocols"],
        datasheet: [
          { name: "Dispersion Shields", description: "Models in this unit equipped with a Dispersion Shield have a 4+ Invulnerable Save." },
          { name: "Guardian Protectors", description: "While a Character is leading this unit, each time an attack targets this unit, subtract 1 from the Wound roll." }
        ]
      },
      weapons: {
        ranged: [],
        melee: [
          { name: "Warscythe", range: "Melee", attacks: "3", skill: "3+", strength: 8, ap: -3, damage: "2" },
          { name: "Hyperphase Sword", range: "Melee", attacks: "3", skill: "3+", strength: 6, ap: -2, damage: "1" }
        ]
      },
      keywords: ["Infantry", "Lychguard", "Squad"]
    },
    {
      id: "nec_chronomancer",
      name: "Chronomancer",
      type: "Character",
      points: 65,
      squadSize: "1 model",
      stats: { m: "5\"", t: 4, sv: "4+", w: 4, ld: "7+", oc: 1, invul: "4+" },
      abilities: {
        core: ["Leader"],
        faction: ["Reanimation Protocols"],
        datasheet: [
          { name: "Chronometron", description: "In your Shooting phase, after the unit this model is leading has shot, that unit can make a Normal move of up to 6\"." },
          { name: "Temporal Aegis", description: "While leading a unit, subtract 1 from Hit rolls for attacks made against that unit." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Aeonstave", range: "18\"", attacks: "3", skill: "3+", strength: 5, ap: -1, damage: "1", abilities: ["Blast"] }
        ],
        melee: [
          { name: "Chronomancer Staff", range: "Melee", attacks: "2", skill: "4+", strength: 4, ap: 0, damage: "1" }
        ]
      },
      keywords: ["Infantry", "Character", "Cryptek", "Chronomancer"]
    },
    {
      id: "nec_plasmancer",
      name: "Plasmancer",
      type: "Character",
      points: 65,
      squadSize: "1 model",
      stats: { m: "5\"", t: 4, sv: "4+", w: 4, ld: "7+", oc: 1, invul: "4+" },
      abilities: {
        core: ["Leader"],
        faction: ["Reanimation Protocols"],
        datasheet: [
          { name: "Harbinger of Destruction", description: "While leading a unit, ranged weapons equipped by models in that unit score Critical Hits on unmodified Hit rolls of 5+ (instead of 6+)." },
          { name: "Living Lightning", description: "At the start of the Fight phase, roll a D6 for each enemy unit within 6\" of this model. On a 4+, that enemy unit suffers D3 mortal wounds." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Plasmic Lance", range: "18\"", attacks: "3", skill: "3+", strength: 6, ap: -2, damage: "2" }
        ],
        melee: [
          { name: "Plasmancer Staff", range: "Melee", attacks: "2", skill: "4+", strength: 4, ap: 0, damage: "1" }
        ]
      },
      keywords: ["Infantry", "Character", "Cryptek", "Plasmancer"]
    },
    {
      id: "nec_royal_warden",
      name: "Royal Warden",
      type: "Character",
      points: 40,
      squadSize: "1 model",
      stats: { m: "5\"", t: 5, sv: "3+", w: 4, ld: "6+", oc: 1 },
      abilities: {
        core: ["Leader"],
        faction: ["Reanimation Protocols"],
        datasheet: [
          { name: "Relentless March", description: "While leading a unit, that unit can Fall Back and still Shoot or Charge in the same turn." },
          { name: "Adaptive Tactics", description: "Once per battle, in your Command phase, you can target the unit this model is leading with a Stratagem for 0 CP." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Relic Gauss Blaster", range: "24\"", attacks: "2", skill: "3+", strength: 5, ap: -1, damage: "2", abilities: ["Lethal Hits", "Rapid Fire 1"] }
        ],
        melee: [
          { name: "Close Combat Weapon", range: "Melee", attacks: "3", skill: "3+", strength: 4, ap: 0, damage: "1" }
        ]
      },
      keywords: ["Infantry", "Character", "Royal Warden"]
    },
    {
      id: "nec_imotekh",
      name: "Imotekh the Stormlord",
      type: "Character",
      points: 100,
      squadSize: "1 model",
      stats: { m: "5\"", t: 5, sv: "2+", w: 6, ld: "6+", oc: 1, invul: "4+" },
      abilities: {
        core: ["Leader"],
        faction: ["Reanimation Protocols"],
        datasheet: [
          { name: "Grand Strategist", description: "At the start of your Command phase, if this model is on the battlefield, you gain 1 Command Point." },
          { name: "Lord of the Storm", description: "Once per battle, in your Shooting phase, select one enemy unit within 12\". Roll a D6; on a 2-5, that unit suffers D3+1 mortal wounds. On a 6, it suffers 2D3 mortal wounds." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Gauntlet of Fire", range: "12\"", attacks: "D6", skill: "2+", strength: 5, ap: -1, damage: "1", abilities: ["Torrent", "Ignores Cover"] }
        ],
        melee: [
          { name: "Staff of the Destroyer", range: "Melee", attacks: "4", skill: "2+", strength: 6, ap: -2, damage: "2" }
        ]
      },
      keywords: ["Infantry", "Character", "Epic Hero", "Noble", "Overlord", "Imotekh"]
    },
    {
      id: "nec_szeras",
      name: "Illuminor Szeras",
      type: "Character",
      points: 175,
      squadSize: "1 model",
      stats: { m: "7\"", t: 8, sv: "2+", w: 9, ld: "6+", oc: 3, invul: "4+" },
      abilities: {
        core: ["Lone Operative"],
        faction: ["Reanimation Protocols"],
        datasheet: [
          { name: "Mechanical Augmentation Aura", description: "While a friendly Necrons Battleline unit is within 6\" of this model, improve the AP characteristic of that unit's ranged and melee weapons by 1. Also worsen the AP of incoming attacks targeting that unit by 1." },
          { name: "Sovereign of Science", description: "This model has the [Feel No Pain 4+] ability." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Eldritch Lance (Ranged)", range: "36\"", attacks: "3", skill: "3+", strength: 8, ap: -2, damage: "2" }
        ],
        melee: [
          { name: "Eldritch Lance (Melee)", range: "Melee", attacks: "4", skill: "3+", strength: 7, ap: -2, damage: "2" }
        ]
      },
      keywords: ["Monster", "Character", "Epic Hero", "Cryptek", "Illuminor Szeras"]
    },
    {
      id: "nec_immortals",
      name: "Immortals",
      type: "Battleline",
      points: 75,
      squadSize: "5 models (Max 10 models for 150 pts)",
      stats: { m: "5\"", t: 5, sv: "3+", w: 1, ld: "7+", oc: 2 },
      abilities: {
        core: [],
        faction: ["Reanimation Protocols"],
        datasheet: [
          { name: "Implacable Eradication", description: "Each time a model in this unit makes a ranged attack, you can re-roll a Wound roll of 1. If targeting an enemy unit within range of an objective marker, re-roll all Wound rolls instead." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Gauss Blaster", range: "24\"", attacks: "2", skill: "3+", strength: 5, ap: -1, damage: "1", abilities: ["Lethal Hits"] },
          { name: "Tesla Carbine", range: "18\"", attacks: "2", skill: "3+", strength: 5, ap: 0, damage: "1", abilities: ["Sustained Hits 2", "Assault"] }
        ],
        melee: [
          { name: "Close Combat Weapon", range: "Melee", attacks: "1", skill: "3+", strength: 4, ap: 0, damage: "1" }
        ]
      },
      keywords: ["Infantry", "Battleline", "Immortals"]
    },
    {
      id: "nec_deathmarks",
      name: "Deathmarks",
      type: "Infantry",
      points: 60,
      squadSize: "5 models",
      stats: { m: "5\"", t: 5, sv: "3+", w: 1, ld: "7+", oc: 1 },
      abilities: {
        core: ["Deep Strike"],
        faction: ["Reanimation Protocols"],
        datasheet: [
          { name: "Hyperspace Hunters", description: "Once per turn, in your opponent's Movement phase, when an enemy unit is set up on the battlefield within 18\" of this unit, this unit can shoot at that enemy unit as if it were your Shooting phase." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Synaptic Disintegrator", range: "36\"", attacks: "1", skill: "3+", strength: 5, ap: -2, damage: "2", abilities: ["Heavy", "Precision"] }
        ],
        melee: [
          { name: "Close Combat Weapon", range: "Melee", attacks: "1", skill: "3+", strength: 4, ap: 0, damage: "1" }
        ]
      },
      keywords: ["Infantry", "Deep Strike", "Deathmarks"]
    },
    {
      id: "nec_flayed_ones",
      name: "Flayed Ones",
      type: "Infantry",
      points: 60,
      squadSize: "5 models",
      stats: { m: "6\"", t: 4, sv: "4+", w: 1, ld: "8+", oc: 1 },
      abilities: {
        core: ["Infiltrators", "Stealth"],
        faction: ["Reanimation Protocols"],
        datasheet: [
          { name: "Flayer Claws", description: "Each time a model in this unit makes a melee attack, re-roll the Wound roll if the target unit has suffered casualties. If the target unit is Battle-shocked, this unit's attacks have the [Sustained Hits 1] ability." }
        ]
      },
      weapons: {
        ranged: [],
        melee: [
          { name: "Flayer Claws (Melee)", range: "Melee", attacks: "4", skill: "3+", strength: 4, ap: -1, damage: "1", abilities: ["Twin-Linked"] }
        ]
      },
      keywords: ["Infantry", "Infiltrators", "Flayed Ones"]
    },
    {
      id: "nec_cryptothralls",
      name: "Cryptothralls",
      type: "Infantry",
      points: 60,
      squadSize: "2 models",
      stats: { m: "5\"", t: 4, sv: "3+", w: 2, ld: "8+", oc: 0 },
      abilities: {
        core: [],
        faction: ["Reanimation Protocols"],
        datasheet: [
          { name: "Bound Protectors", description: "While this unit is attached to a friendly Cryptek's unit, models in this unit have the [Feel No Pain 4+] ability." },
          { name: "Systemic Safeguard", description: "When a model in this unit is destroyed, you can immediately activate the attached unit's Reanimation Protocols." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Scouring Eye", range: "12\"", attacks: "2", skill: "4+", strength: 4, ap: 0, damage: "1" }
        ],
        melee: [
          { name: "Striking Claws", range: "Melee", attacks: "3", skill: "4+", strength: 5, ap: -1, damage: "1" }
        ]
      },
      keywords: ["Infantry", "Cryptothralls"]
    },
    {
      id: "nec_scarabs",
      name: "Canoptek Scarab Swarms",
      type: "Swarm",
      points: 40,
      squadSize: "3 models (Max 6 models for 80 pts)",
      stats: { m: "9\"", t: 2, sv: "6+", w: 4, ld: "8+", oc: 0 },
      abilities: {
        core: [],
        faction: ["Reanimation Protocols"],
        datasheet: [
          { name: "Self-destruction", description: "In the Fight phase, you can select one model in this unit to explode. If you do, that model is destroyed and one enemy unit within 1\" suffers D3 mortal wounds." }
        ]
      },
      weapons: {
        ranged: [],
        melee: [
          { name: "Feeder Mandibles", range: "Melee", attacks: "4", skill: "4+", strength: 2, ap: 0, damage: "1", abilities: ["Lethal Hits"] }
        ]
      },
      keywords: ["Swarm", "Canoptek", "Scarabs"]
    },
    {
      id: "nec_wraiths",
      name: "Canoptek Wraiths",
      type: "Infantry",
      points: 110,
      squadSize: "3 models",
      stats: { m: "9\"", t: 6, sv: "3+", w: 4, ld: "7+", oc: 1, invul: "4+" },
      abilities: {
        core: ["Fly"],
        faction: ["Reanimation Protocols"],
        datasheet: [
          { name: "Wraith Form", description: "This unit can move over other models and terrain as if they were not there." },
          { name: "Vicious Claws", description: "This unit has the [Feel No Pain 4+] ability." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Particle Caster", range: "12\"", attacks: "3", skill: "4+", strength: 5, ap: 0, damage: "1", abilities: ["Devastating Wounds"] }
        ],
        melee: [
          { name: "Vicious Claws (Melee)", range: "Melee", attacks: "4", skill: "3+", strength: 6, ap: -1, damage: "2" }
        ]
      },
      keywords: ["Beast", "Canoptek", "Fly", "Wraiths"]
    },
    {
      id: "nec_reanimator",
      name: "Canoptek Reanimator",
      type: "Vehicle",
      points: 75,
      squadSize: "1 model",
      stats: { m: "7\"", t: 6, sv: "3+", w: 6, ld: "7+", oc: 2 },
      abilities: {
        core: ["Deadly Demise 1"],
        faction: ["Reanimation Protocols"],
        datasheet: [
          { name: "Nanoscarab Reanimation Beam", description: "While a friendly Necrons unit is within 12\" of this model, each time that unit activates its Reanimation Protocols, it reanimates an additional D3 wounds." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Atomiser Beam", range: "12\"", attacks: "2", skill: "4+", strength: 5, ap: -1, damage: "1" }
        ],
        melee: [
          { name: "Reanimator Limbs", range: "Melee", attacks: "3", skill: "5+", strength: 4, ap: 0, damage: "1" }
        ]
      },
      keywords: ["Vehicle", "Canoptek", "Reanimator"]
    },
    {
      id: "nec_heavy_destroyers",
      name: "Lokhust Heavy Destroyers",
      type: "Mounted",
      points: 50,
      squadSize: "1 model (Max 3 models for 150 pts)",
      stats: { m: "8\"", t: 6, sv: "3+", w: 4, ld: "7+", oc: 1 },
      abilities: {
        core: [],
        faction: ["Reanimation Protocols"],
        datasheet: [
          { name: "Optimised Destroyer Cult", description: "Each time a model in this unit makes a ranged attack targeting a Monster or Vehicle, re-roll a Wound roll of 1." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Gauss Destructor", range: "36\"", attacks: "1", skill: "3+", strength: 14, ap: -4, damage: "6", abilities: ["Lethal Hits"] },
          { name: "Enmitic Exterminator", range: "36\"", attacks: "12", skill: "3+", strength: 6, ap: -1, damage: "1", abilities: ["Sustained Hits 1"] }
        ],
        melee: [
          { name: "Close Combat Weapon", range: "Melee", attacks: "2", skill: "4+", strength: 4, ap: 0, damage: "1" }
        ]
      },
      keywords: ["Mounted", "Destroyer Cult", "Lokhust"]
    },
    {
      id: "nec_command_barge",
      name: "Catacomb Command Barge",
      type: "Vehicle",
      points: 130,
      squadSize: "1 model",
      stats: { m: "9\"", t: 8, sv: "2+", w: 9, ld: "6+", oc: 3, invul: "4+" },
      abilities: {
        core: ["Deadly Demise D3", "Fly"],
        faction: ["Reanimation Protocols"],
        datasheet: [
          { name: "Carrier Wave", description: "Officer models in this model can issue Orders or abilities up to 12\"." },
          { name: "Overlord's Aegis", description: "While friendly Necrons units are within 6\" of this model, add +1 to their Objective Control characteristic." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Tesla Cannon", range: "24\"", attacks: "4", skill: "3+", strength: 6, ap: 0, damage: "1", abilities: ["Sustained Hits 2"] }
        ],
        melee: [
          { name: "Staff of Light", range: "Melee", attacks: "4", skill: "3+", strength: 5, ap: -1, damage: "1" }
        ]
      },
      keywords: ["Vehicle", "Fly", "Character", "Noble", "Overlord", "Command Barge"]
    },
    {
      id: "nec_doomsday_ark",
      name: "Doomsday Ark",
      type: "Vehicle",
      points: 200,
      squadSize: "1 model",
      stats: { m: "9\"", t: 9, sv: "3+", w: 14, ld: "7+", oc: 3, invul: "4+" },
      abilities: {
        core: ["Deadly Demise D6", "Fly"],
        faction: ["Reanimation Protocols"],
        datasheet: [
          { name: "Quantum Shielding", description: "Each time an attack is allocated to this model, subtract 1 from the Wound roll." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Doomsday Cannon (Stationary)", range: "72\"", attacks: "D6+1", skill: "3+", strength: 15, ap: -4, damage: "4", abilities: ["Heavy", "Blast"] },
          { name: "Gauss Flayer Array", range: "24\"", attacks: "10", skill: "3+", strength: 4, ap: 0, damage: "1", abilities: ["Lethal Hits", "Rapid Fire 10"] }
        ],
        melee: [
          { name: "Armoured Hull", range: "Melee", attacks: "3", skill: "4+", strength: 6, ap: 0, damage: "1" }
        ]
      },
      keywords: ["Vehicle", "Fly", "Doomsday Ark"]
    },
    {
      id: "nec_monolith",
      name: "Monolith",
      type: "Vehicle",
      points: 350,
      squadSize: "1 model",
      stats: { m: "5\"", t: 14, sv: "2+", w: 20, ld: "6+", oc: 4, invul: "4+" },
      abilities: {
        core: ["Deadly Demise D6+3"],
        faction: ["Reanimation Protocols"],
        datasheet: [
          { name: "Eternity Gate", description: "Once per turn, you can set up a friendly Necrons unit from Strategic Reserves within 3\" of this model." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Particle Whip", range: "24\"", attacks: "D6+3", skill: "3+", strength: 12, ap: -3, damage: "3", abilities: ["Blast"] }
        ],
        melee: [
          { name: "Monolith Claws", range: "Melee", attacks: "6", skill: "4+", strength: 10, ap: -2, damage: "3" }
        ]
      },
      keywords: ["Vehicle", "Titanic", "Monolith"]
    },
    {
      id: "nec_skorpekh_destroyers",
      name: "Skorpekh Destroyers",
      type: "Infantry",
      points: 100,
      squadSize: "3 models",
      stats: { m: "8\"", t: 6, sv: "3+", w: 3, ld: "7+", oc: 1 },
      abilities: {
        core: [],
        faction: ["Reanimation Protocols"],
        datasheet: [
          { name: "Whirling Onslaught", description: "Each time this unit makes a melee attack, add +1 to the Hit roll. If the target unit has suffered casualties, add +1 to the Wound roll instead." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Plasmacyte Accelerator", range: "12\"", attacks: "1", skill: "3+", strength: 5, ap: 0, damage: "1" }
        ],
        melee: [
          { name: "Hyperphase Reap-blade", range: "Melee", attacks: "3", skill: "3+", strength: 7, ap: -2, damage: "2", abilities: ["Devastating Wounds"] }
        ]
      },
      keywords: ["Infantry", "Destroyer Cult", "Skorpekh Destroyers"]
    },
    {
      id: "nec_tomb_blades",
      name: "Tomb Blades",
      type: "Mounted",
      points: 75,
      squadSize: "3 models",
      stats: { m: "12\"", t: 5, sv: "3+", w: 2, ld: "7+", oc: 1 },
      abilities: {
        core: ["Fly"],
        faction: ["Reanimation Protocols"],
        datasheet: [
          { name: "High-speed Pursuit", description: "Each time this unit makes a ranged attack, you can re-roll a Hit roll of 1." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Twin Gauss Blaster", range: "24\"", attacks: "2", skill: "3+", strength: 5, ap: -1, damage: "1", abilities: ["Twin-Linked", "Lethal Hits"] }
        ],
        melee: [
          { name: "Close Combat Weapon", range: "Melee", attacks: "2", skill: "4+", strength: 4, ap: 0, damage: "1" }
        ]
      },
      keywords: ["Mounted", "Fly", "Tomb Blades"]
    },
    {
      id: "nec_triarch_stalker",
      name: "Triarch Stalker",
      type: "Vehicle",
      points: 125,
      squadSize: "1 model",
      stats: { m: "7\"", t: 9, sv: "3+", w: 10, ld: "6+", oc: 3, invul: "5+" },
      abilities: {
        core: ["Deadly Demise D3"],
        faction: ["Reanimation Protocols"],
        datasheet: [
          { name: "Targeting Relay", description: "Each time a model in this unit makes a ranged attack against an enemy unit, until the end of the phase, each time another friendly Necrons unit makes an attack against that enemy unit, add +1 to the Hit roll." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Twin Heavy Gauss Cannon", range: "36\"", attacks: "2", skill: "3+", strength: 12, ap: -3, damage: "D6+2", abilities: ["Twin-Linked"] }
        ],
        melee: [
          { name: "Stalker Limbs", range: "Melee", attacks: "3", skill: "4+", strength: 6, ap: 0, damage: "1" }
        ]
      },
      keywords: ["Vehicle", "Triarch Stalker"]
    },
    {
      id: "nec_canoptek_spyder",
      name: "Canoptek Spyder",
      type: "Vehicle",
      points: 75,
      squadSize: "1 model",
      stats: { m: "6\"", t: 6, sv: "3+", w: 6, ld: "7+", oc: 2 },
      abilities: {
        core: ["Deadly Demise 1"],
        faction: ["Reanimation Protocols"],
        datasheet: [
          { name: "Fabricator Claw Array", description: "At the end of your Movement phase, select one friendly Necrons Vehicle within 6\". That model regains up to D3 lost wounds." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Particle Beamer", range: "18\"", attacks: "6", skill: "3+", strength: 6, ap: 0, damage: "1" }
        ],
        melee: [
          { name: "Fabricator Claws", range: "Melee", attacks: "3", skill: "3+", strength: 5, ap: -1, damage: "1" }
        ]
      },
      keywords: ["Vehicle", "Canoptek", "Spyder"]
    },
    {
      id: "nec_destroyer_lord",
      name: "Skorpekh Destroyer Lord",
      type: "Character",
      points: 100,
      squadSize: "1 model",
      stats: { m: "8\"", t: 6, sv: "3+", w: 6, ld: "6+", oc: 1 },
      abilities: {
        core: ["Leader"],
        faction: ["Reanimation Protocols"],
        datasheet: [
          { name: "Destroyer's Might", description: "While leading a unit, melee attacks made by that unit have +1 to Wound rolls." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Particle Caster", range: "12\"", attacks: "1", skill: "3+", strength: 5, ap: 0, damage: "1" }
        ],
        melee: [
          { name: "Hyperphase Blade", range: "Melee", attacks: "4", skill: "2+", strength: 7, ap: -2, damage: "2" }
        ]
      },
      keywords: ["Infantry", "Character", "Destroyer Cult", "Skorpekh Lord"]
    },
    {
      id: "nec_plasmacyte",
      name: "Plasmacyte",
      type: "Infantry",
      points: 15,
      squadSize: "1 model",
      stats: { m: "6\"", t: 4, sv: "4+", w: 1, ld: "8+", oc: 0 },
      abilities: {
        core: [],
        faction: [],
        datasheet: [
          { name: "Infusion", description: "In your Command phase, you can select one friendly Skorpekh Destroyer unit within 3\" of this model. That unit gains [Lethal Hits] and [Sustained Hits 1] until the start of your next Command phase, but takes 1 mortal wound." }
        ]
      },
      weapons: {
        ranged: [],
        melee: [
          { name: "Plasmacyte Claws", range: "Melee", attacks: "1", skill: "4+", strength: 3, ap: 0, damage: "1" }
        ]
      },
      keywords: ["Infantry", "Canoptek", "Plasmacyte"]
    }
  ]
};
