import { Faction } from "../../types";

export const chaosSpaceMarines: Faction = {
  id: "chaos_space_marines",
  name: "Chaos Space Marines",
  iconName: "Flame",
  description: "Traitor super-soldiers mutated by the Dark Gods of Chaos, wielding warp-infused power to tear down the Imperium they once served.",
  overview: {
    playstyle: "Aggressive, versatile army that uses Dark Pacts to boost effectiveness at the cost of potential self-harm, supported by Daemonic assets.",
    strengths: ["Strong psychic/daemonic support", "Flexible marks of chaos", "High-quality infantry"],
    weaknesses: ["Potential self-inflicted wounds", "Expensive elite units"]
  },
  factionRule: {
    name: "Dark Pacts",
    description: "In your Shooting or Fight phase, when selecting a friendly Chaos Space Marines unit to attack, you can make a Dark Pact with the Gods. If you do, select one of the following abilities for the attacks:\n- Lethal Hits\n- Sustained Hits 1\nAt the end of the phase, that unit must take a Leadership test. If failed, it suffers D3 mortal wounds."
  },
  detachment: {
    name: "Slaves to Darkness",
    description: "Servants bound to the dark whims of Chaos, receiving profane blessings for sacrifices.",
    benefit: "Marks of Chaos: Each unit must be dedicated to Khorne, Nurgle, Tzeentch, Slaanesh, or Chaos Undivided. This Mark enhances the benefit of Dark Pacts, giving automatic triggers on 5+ instead of 6+ depending on the Mark and Pact selected.",
    stratagems: [
      {
        name: "Profane Zeal",
        cost: 1,
        phase: "Your Shooting or Fight Phase",
        effect: "Target: One Chaos Space Marines unit. Effect: You can re-roll Hit rolls and Wound rolls of 1. If Chaos Undivided, re-roll all Hit and Wound rolls instead."
      },
      {
        name: "Unnatural Swiftness",
        cost: 1,
        phase: "Your Movement Phase",
        effect: "Target: One Slaanesh unit. Effect: This unit can Advance or Fall Back and still declare a Charge this turn."
      },
      {
        name: "Warp-Born Resilience",
        cost: 1,
        phase: "Any Phase",
        effect: "Target: One Nurgle unit. Effect: If targeted by shooting, the firing unit can only hit on unmodified rolls of 4+."
      }
    ],
    enhancements: [
      { name: "Liber Hereticus", points: 25, description: "The model's unit can fight in the Fight phase as if it were the Shooting phase, with additional effects." },
      { name: "Eye of Tzeentch", points: 15, description: "Once per battle, you can change a dice result to a 6." }
    ]
  },
  units: [
    {
      id: "csm_lord",
      name: "Chaos Lord",
      type: "Character",
      points: 95,
      squadSize: "1 model",
      stats: { m: "6\"", t: 4, sv: "3+", w: 5, ld: "6+", oc: 1, invul: "4+" },
      abilities: {
        core: ["Leader"],
        faction: ["Dark Pacts"],
        datasheet: [
          { name: "Lord of Chaos", description: "Once per battle round, one unit within 12\" can be targeted with a Stratagem for 0 CP, even if another unit has already been targeted with that stratagem." },
          { name: "Demonic Might", description: "Each time this model makes a melee attack, re-roll Wound rolls of 1." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Plasma Pistol (Standard)", range: "12\"", attacks: "1", skill: "2+", strength: 7, ap: -2, damage: "1", abilities: ["Pistol"] },
          { name: "Plasma Pistol (Overcharge)", range: "12\"", attacks: "1", skill: "2+", strength: 8, ap: -3, damage: "2", abilities: ["Pistol", "Hazardous"] }
        ],
        melee: [
          { name: "Daemon Hammer", range: "Melee", attacks: "5", skill: "3+", strength: 10, ap: -2, damage: "3", abilities: ["Devastating Wounds"] },
          { name: "Accursed Weapon", range: "Melee", attacks: "6", skill: "2+", strength: 5, ap: -2, damage: "1" }
        ]
      },
      keywords: ["Infantry", "Character", "Chaos Lord"]
    },
    {
      id: "csm_legionaries",
      name: "Legionaries",
      type: "Battleline",
      points: 80,
      squadSize: "5 models (Max 10 models for 160 pts)",
      stats: { m: "6\"", t: 4, sv: "3+", w: 2, ld: "6+", oc: 2 },
      abilities: {
        core: [],
        faction: ["Dark Pacts"],
        datasheet: [
          { name: "Grim Resolve", description: "Each time a model in this unit makes a melee attack, re-roll the Wound roll of 1. If the target is within range of an objective you do not control, you can re-roll the entire Wound roll instead." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Boltgun", range: "24\"", attacks: "2", skill: "3+", strength: 4, ap: 0, damage: "1" },
          { name: "Heavy Bolter", range: "36\"", attacks: "3", skill: "3+", strength: 5, ap: -1, damage: "2", abilities: ["Heavy", "Sustained Hits 1"] }
        ],
        melee: [
          { name: "Astartes Chainsword", range: "Melee", attacks: "4", skill: "3+", strength: 4, ap: -1, damage: "1" },
          { name: "Close Combat Weapon", range: "Melee", attacks: "3", skill: "3+", strength: 4, ap: 0, damage: "1" }
        ]
      },
      keywords: ["Infantry", "Battleline", "Legionaries"]
    },
    {
      id: "csm_helbrute",
      name: "Helbrute",
      type: "Vehicle",
      points: 130,
      squadSize: "1 model",
      stats: { m: "6\"", t: 9, sv: "3+", w: 8, ld: "6+", oc: 3 },
      abilities: {
        core: ["Deadly Demise 1"],
        faction: ["Dark Pacts"],
        datasheet: [
          { name: "Infused with Warp Energy", description: "While a friendly unit within 6\" makes an attack, if a Dark Pact is active for that unit, it gains BOTH Lethal Hits and Sustained Hits 1." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Multi-Melta", range: "18\"", attacks: "2", skill: "3+", strength: 9, ap: -4, damage: "D6", abilities: ["Melta 2"] },
          { name: "Twin Lascannon", range: "48\"", attacks: "1", skill: "3+", strength: 12, ap: -3, damage: "D6", abilities: ["Twin-Linked"] }
        ],
        melee: [
          { name: "Helbrute Fist", range: "Melee", attacks: "5", skill: "3+", strength: 12, ap: -2, damage: "3" },
          { name: "Helbrute Hammer", range: "Melee", attacks: "4", skill: "4+", strength: 14, ap: -3, damage: "D6" }
        ]
      },
      keywords: ["Vehicle", "Walker", "Helbrute"]
    },
    {
      id: "csm_sorcerer",
      name: "Sorcerer in Terminator Armour",
      type: "Character",
      points: 90,
      squadSize: "1 model",
      stats: { m: "5\"", t: 5, sv: "2+", w: 5, ld: "6+", oc: 1, invul: "4+" },
      abilities: {
        core: ["Leader", "Deep Strike"],
        faction: ["Dark Pacts"],
        datasheet: [
          { name: "Death Hex (Psychic)", description: "In your Shooting phase, select one enemy unit within 18\". Until the end of the phase, worsen the Save characteristic of models in that enemy unit by 1." },
          { name: "Prescience (Psychic)", description: "While leading a unit, each time a model in that unit makes a ranged attack, you can re-roll the Hit roll." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Combi-Bolter", range: "24\"", attacks: "2", skill: "3+", strength: 4, ap: 0, damage: "1", abilities: ["Rapid Fire 2"] },
          { name: "Infernal Gaze (Psychic)", range: "18\"", attacks: "3", skill: "2+", strength: 6, ap: -2, damage: "D3", abilities: ["Psychic", "Devastating Wounds"] }
        ],
        melee: [
          { name: "Force Weapon", range: "Melee", attacks: "4", skill: "2+", strength: 6, ap: -2, damage: "D3", abilities: ["Psychic"] }
        ]
      },
      keywords: ["Infantry", "Character", "Terminator", "Psyker", "Sorcerer"]
    },
    {
      id: "csm_forgefiend",
      name: "Forgefiend",
      type: "Vehicle",
      points: 200,
      squadSize: "1 model",
      stats: { m: "8\"", t: 10, sv: "3+", w: 12, ld: "6+", oc: 3 },
      abilities: {
        core: ["Deadly Demise D3"],
        faction: ["Dark Pacts"],
        datasheet: [
          { name: "Devourer of Souls", description: "In your Shooting phase, after this model has shot, select one enemy unit hit by one or more attacks. That enemy unit must take a Battle-shock test immediately." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Ectoplasma Cannon", range: "36\"", attacks: "D3", skill: "3+", strength: 10, ap: -3, damage: "3", abilities: ["Blast", "Hazardous"] },
          { name: "Hades Autocannon", range: "36\"", attacks: "8", skill: "3+", strength: 8, ap: -1, damage: "2", abilities: ["Devastating Wounds"] }
        ],
        melee: [
          { name: "Forgefiend Claws", range: "Melee", attacks: "3", skill: "4+", strength: 6, ap: 0, damage: "1" }
        ]
      },
      keywords: ["Vehicle", "Daemon", "Forgefiend"]
    },
    {
      id: "csm_abaddon",
      name: "Abaddon the Despoiler",
      type: "Character",
      points: 310,
      squadSize: "1 model",
      stats: { m: "5\"", t: 6, sv: "2+", w: 9, ld: "5+", oc: 4, invul: "4+" },
      abilities: {
        core: ["Leader", "Deep Strike"],
        faction: ["Dark Pacts"],
        datasheet: [
          { name: "Warmaster of Chaos", description: "At the start of your Command phase, if this model is on the battlefield, you gain 1 Command Point." },
          { name: "Mark of Chaos Undivided", description: "Abaddon represents all Chaos Gods, so the unit he is leading has all Marks of Chaos (Khorne, Nurgle, Tzeentch, Slaanesh, Chaos Undivided)." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Talon of Horus (Ranged)", range: "12\"", attacks: "4", skill: "2+", strength: 5, ap: -1, damage: "2" }
        ],
        melee: [
          { name: "Drach'nyen", range: "Melee", attacks: "8", skill: "2+", strength: 14, ap: -4, damage: "D6+2", abilities: ["Devastating Wounds"] },
          { name: "Talon of Horus (Melee)", range: "Melee", attacks: "14", skill: "2+", strength: 7, ap: -2, damage: "2" }
        ]
      },
      keywords: ["Infantry", "Character", "Epic Hero", "Terminator", "Warlord", "Abaddon"]
    },
    {
      id: "csm_apostle",
      name: "Dark Apostle",
      type: "Character",
      points: 75,
      squadSize: "3 models (Dark Apostle & 2 Dark Disciples)",
      stats: { m: "6\"", t: 4, sv: "3+", w: 4, ld: "6+", oc: 1, invul: "4+" },
      abilities: {
        core: ["Leader"],
        faction: ["Dark Pacts"],
        datasheet: [
          { name: "Demagogue", description: "While leading a unit, each time a model in that unit makes a melee attack, add +1 to the Wound roll." },
          { name: "Dark Disciples Guard", description: "While this unit contains one or more Dark Disciple models, attacks made against the Dark Apostle are resolved with a -1 penalty to the Wound roll." }
        ]
      },
      weapons: {
        ranged: [],
        melee: [
          { name: "Accursed Crozius", range: "Melee", attacks: "5", skill: "2+", strength: 6, ap: -1, damage: "2" }
        ]
      },
      keywords: ["Infantry", "Character", "Dark Apostle"]
    },
    {
      id: "csm_mop",
      name: "Master of Possession",
      type: "Character",
      points: 80,
      squadSize: "1 model",
      stats: { m: "6\"", t: 4, sv: "3+", w: 4, ld: "6+", oc: 1, invul: "4+" },
      abilities: {
        core: ["Leader"],
        faction: ["Dark Pacts"],
        datasheet: [
          { name: "Warp Shielding Aura", description: "While leading a unit, models in that unit have a 5+ Invulnerable Save and a 6+ Feel No Pain." },
          { name: "Sacrifice (Psychic)", description: "In your Command phase, you can select one friendly Chaos Space Marines unit within 12\"; that unit activates its Reanimation Protocols immediately." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Gaze of the Abyss (Psychic)", range: "18\"", attacks: "3", skill: "2+", strength: 6, ap: -2, damage: "D3", abilities: ["Psychic", "Devastating Wounds"] }
        ],
        melee: [
          { name: "Staff of Possession", range: "Melee", attacks: "3", skill: "3+", strength: 5, ap: -1, damage: "1" }
        ]
      },
      keywords: ["Infantry", "Character", "Psyker", "Master of Possession"]
    },
    {
      id: "csm_warpsmith",
      name: "Warpsmith",
      type: "Character",
      points: 70,
      squadSize: "1 model",
      stats: { m: "6\"", t: 4, sv: "2+", w: 4, ld: "6+", oc: 1 },
      abilities: {
        core: ["Leader"],
        faction: ["Dark Pacts"],
        datasheet: [
          { name: "Master of Mechanics", description: "At the end of your Movement phase, select one friendly Chaos Space Marines Vehicle model within 3\". That model regains up to D3 lost wounds." },
          { name: "Profane Overcharge", description: "Once per turn, in your Shooting phase, select one friendly Chaos Space Marines Vehicle model within 6\". Until the end of the phase, that vehicle's ranged attacks have the [Sustained Hits 1] ability." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Flamer tendril", range: "12\"", attacks: "D6", skill: "2+", strength: 4, ap: 0, damage: "1", abilities: ["Torrent"] },
          { name: "Melta tendril", range: "12\"", attacks: "1", skill: "3+", strength: 8, ap: -4, damage: "D6", abilities: ["Melta 2"] }
        ],
        melee: [
          { name: "Omnissian Axe", range: "Melee", attacks: "4", skill: "3+", strength: 6, ap: -2, damage: "2" }
        ]
      },
      keywords: ["Infantry", "Character", "Warpsmith"]
    },
    {
      id: "csm_cultists",
      name: "Chaos Cultists",
      type: "Battleline",
      points: 55,
      squadSize: "10 models",
      stats: { m: "6\"", t: 3, sv: "6+", w: 1, ld: "7+", oc: 1 },
      abilities: {
        core: [],
        faction: [],
        datasheet: [
          { name: "Desperate Fanatics", description: "If you control an objective marker with this unit, it remains under your control even if this unit moves away, until an opponent controls it." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Cultist Autogun", range: "24\"", attacks: "1", skill: "4+", strength: 3, ap: 0, damage: "1" }
        ],
        melee: [
          { name: "Brutal Assault Weapon", range: "Melee", attacks: "1", skill: "4+", strength: 3, ap: 0, damage: "1" }
        ]
      },
      keywords: ["Infantry", "Battleline", "Cultists"]
    },
    {
      id: "csm_chosen",
      name: "Chosen",
      type: "Infantry",
      points: 110,
      squadSize: "5 models",
      stats: { m: "6\"", t: 4, sv: "3+", w: 3, ld: "6+", oc: 1 },
      abilities: {
        core: [],
        faction: ["Dark Pacts"],
        datasheet: [
          { name: "Chosen Champions", description: "This unit can Advance or Fall Back and still Shoot and/or Charge in the same turn." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Combi-Weapon", range: "12\"", attacks: "1", skill: "4+", strength: 4, ap: 0, damage: "1", abilities: ["Anti-Infantry 4+", "Devastating Wounds"] },
          { name: "Boltgun", range: "24\"", attacks: "2", skill: "3+", strength: 4, ap: 0, damage: "1" }
        ],
        melee: [
          { name: "Accursed Weapon", range: "Melee", attacks: "5", skill: "3+", strength: 5, ap: -2, damage: "1" }
        ]
      },
      keywords: ["Infantry", "Chosen", "Squad"]
    },
    {
      id: "csm_terminators",
      name: "Chaos Terminators",
      type: "Infantry",
      points: 195,
      squadSize: "5 models",
      stats: { m: "5\"", t: 5, sv: "2+", w: 3, ld: "6+", oc: 1, invul: "4+" },
      abilities: {
        core: ["Deep Strike"],
        faction: ["Dark Pacts"],
        datasheet: [
          { name: "Grim Retribution", description: "Each time this unit makes an attack, add +1 to the Hit roll if the target unit has suffered casualties. If the target is Battle-shocked, you can re-roll the Wound roll instead." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Combi-Bolter", range: "24\"", attacks: "2", skill: "3+", strength: 4, ap: 0, damage: "1", abilities: ["Rapid Fire 2"] }
        ],
        melee: [
          { name: "Accursed Weapon", range: "Melee", attacks: "3", skill: "3+", strength: 5, ap: -2, damage: "1" },
          { name: "Power Fist", range: "Melee", attacks: "3", skill: "4+", strength: 8, ap: -2, damage: "2" }
        ]
      },
      keywords: ["Infantry", "Terminator", "Squad"]
    },
    {
      id: "csm_possessed",
      name: "Possessed",
      type: "Infantry",
      points: 130,
      squadSize: "5 models",
      stats: { m: "9\"", t: 6, sv: "3+", w: 3, ld: "6+", oc: 1, invul: "5+" },
      abilities: {
        core: [],
        faction: ["Dark Pacts"],
        datasheet: [
          { name: "Hideous Mutations", description: "Melee weapons equipped by models in this unit have the [Devastating Wounds] ability." }
        ]
      },
      weapons: {
        ranged: [],
        melee: [
          { name: "Hideous Mutations (Melee)", range: "Melee", attacks: "5", skill: "3+", strength: 5, ap: -1, damage: "2" }
        ]
      },
      keywords: ["Infantry", "Daemon", "Possessed"]
    },
    {
      id: "csm_warp_talons",
      name: "Warp Talons",
      type: "Infantry",
      points: 100,
      squadSize: "5 models",
      stats: { m: "12\"", t: 4, sv: "3+", w: 2, ld: "6+", oc: 1, invul: "5+" },
      abilities: {
        core: ["Deep Strike", "Fly"],
        faction: ["Dark Pacts"],
        datasheet: [
          { name: "Warp Predators", description: "This unit has the [Fights First] ability. Additionally, when this unit destroys an enemy unit in melee, you gain 1 Command Point." }
        ]
      },
      weapons: {
        ranged: [],
        melee: [
          { name: "Warp Claws", range: "Melee", attacks: "5", skill: "3+", strength: 5, ap: -2, damage: "1", abilities: ["Twin-Linked"] }
        ]
      },
      keywords: ["Infantry", "Fly", "Jump Pack", "Daemon", "Warp Talons"]
    },
    {
      id: "csm_raptors",
      name: "Raptors",
      type: "Infantry",
      points: 90,
      squadSize: "5 models",
      stats: { m: "12\"", t: 4, sv: "3+", w: 2, ld: "6+", oc: 1 },
      abilities: {
        core: ["Deep Strike", "Fly"],
        faction: ["Dark Pacts"],
        datasheet: [
          { name: "Fearsome Visage Aura", description: "While an enemy unit is within 6\" of this unit, subtract 1 from Battle-shock tests taken by models in that enemy unit." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Bolt Pistol", range: "12\"", attacks: "1", skill: "3+", strength: 4, ap: 0, damage: "1", abilities: ["Pistol"] }
        ],
        melee: [
          { name: "Astartes Chainsword", range: "Melee", attacks: "4", skill: "3+", strength: 4, ap: -1, damage: "1" }
        ]
      },
      keywords: ["Infantry", "Fly", "Jump Pack", "Raptors"]
    },
    {
      id: "csm_havocs",
      name: "Chaos Havocs",
      type: "Infantry",
      points: 135,
      squadSize: "5 models",
      stats: { m: "6\"", t: 5, sv: "3+", w: 2, ld: "6+", oc: 1 },
      abilities: {
        core: [],
        faction: ["Dark Pacts"],
        datasheet: [
          { name: "Stabilizing Anchor", description: "This unit can shoot with heavy weapons in a turn in which it moved without suffering any penalty to the Hit roll." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Lascannon", range: "48\"", attacks: "1", skill: "3+", strength: 12, ap: -3, damage: "D6+1" },
          { name: "Autocannon", range: "48\"", attacks: "2", skill: "3+", strength: 9, ap: -1, damage: "3" }
        ],
        melee: [
          { name: "Close Combat Weapon", range: "Melee", attacks: "2", skill: "3+", strength: 4, ap: 0, damage: "1" }
        ]
      },
      keywords: ["Infantry", "Havocs", "Squad"]
    },
    {
      id: "csm_obliterators",
      name: "Obliterators",
      type: "Infantry",
      points: 170,
      squadSize: "2 models",
      stats: { m: "4\"", t: 7, sv: "2+", w: 5, ld: "6+", oc: 1, invul: "5+" },
      abilities: {
        core: ["Deep Strike"],
        faction: ["Dark Pacts"],
        datasheet: [
          { name: "Fleshmetal Weapons", description: "Each time this unit shoots, select one profile for its Fleshmetal guns:\n- Warp Hail: Range 24\", S6, AP-1, D2 [Sustained Hits 1]\n- Obliterating Ruin: Range 12\", S12, AP-3, D6 [Melta 2]" }
        ]
      },
      weapons: {
        ranged: [
          { name: "Fleshmetal Guns (Warp Hail)", range: "24\"", attacks: "4", skill: "3+", strength: 6, ap: -1, damage: "2" },
          { name: "Fleshmetal Guns (Ruin)", range: "12\"", attacks: "2", skill: "3+", strength: 12, ap: -3, damage: "D6" }
        ],
        melee: [
          { name: "Fleshmetal Fists", range: "Melee", attacks: "4", skill: "4+", strength: 8, ap: -1, damage: "2" }
        ]
      },
      keywords: ["Infantry", "Daemon", "Obliterators"]
    },
    {
      id: "csm_venomcrawler",
      name: "Venomcrawler",
      type: "Vehicle",
      points: 110,
      squadSize: "1 model",
      stats: { m: "10\"", t: 9, sv: "3+", w: 9, ld: "6+", oc: 3, invul: "5+" },
      abilities: {
        core: ["Deadly Demise 1"],
        faction: ["Dark Pacts"],
        datasheet: [
          { name: "Devourer of Souls", description: "Each time this model destroys an enemy model, increase the attacks characteristic of its ranged weapons by 1 for the rest of the battle." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Excruciator Cannons", range: "36\"", attacks: "12", skill: "3+", strength: 6, ap: -1, damage: "2" }
        ],
        melee: [
          { name: "Soulflayer Tendrils", range: "Melee", attacks: "6", skill: "3+", strength: 6, ap: -1, damage: "1" }
        ]
      },
      keywords: ["Vehicle", "Daemon", "Venomcrawler"]
    },
    {
      id: "csm_maulerfiend",
      name: "Maulerfiend",
      type: "Vehicle",
      points: 155,
      squadSize: "1 model",
      stats: { m: "10\"", t: 10, sv: "3+", w: 12, ld: "6+", oc: 3, invul: "5+" },
      abilities: {
        core: ["Deadly Demise D3"],
        faction: ["Dark Pacts"],
        datasheet: [
          { name: "Siege Beast", description: "Melee attacks made by this model targeting a Monster or Vehicle have the [Lethal Hits] and [Lance] abilities." },
          { name: "Scent of Blood", description: "This model can declare a charge in a turn in which it Advanced if there are any enemy units within 12\" that are under starting strength." }
        ]
      },
      weapons: {
        ranged: [],
        melee: [
          { name: "Maulerfiend Fists", range: "Melee", attacks: "6", skill: "3+", strength: 12, ap: -3, damage: "D6+1" },
          { name: "Lasher Tendrils", range: "Melee", attacks: "6", skill: "3+", strength: 6, ap: -1, damage: "1", abilities: ["Extra Attacks"] }
        ]
      },
      keywords: ["Vehicle", "Daemon", "Maulerfiend"]
    },
    {
      id: "csm_rhino",
      name: "Chaos Rhino",
      type: "Vehicle",
      points: 75,
      squadSize: "1 model",
      stats: { m: "12\"", t: 9, sv: "3+", w: 10, ld: "6+", oc: 2 },
      abilities: {
        core: ["Deadly Demise D3"],
        faction: [],
        datasheet: [
          { name: "Self-repair", description: "At the start of your Command phase, this model regains 1 lost wound." },
          { name: "Firedamp", description: "Models inside can shoot out using the Firing Deck 2 rule." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Combi-Bolter", range: "24\"", attacks: "2", skill: "3+", strength: 4, ap: 0, damage: "1", abilities: ["Rapid Fire 2"] }
        ],
        melee: [
          { name: "Armoured Hull", range: "Melee", attacks: "3", skill: "4+", strength: 6, ap: 0, damage: "1" }
        ]
      },
      keywords: ["Vehicle", "Transport", "Dedicated Transport", "Rhino"]
    },
    {
      id: "csm_daemon_prince",
      name: "Daemon Prince",
      type: "Monster",
      points: 200,
      squadSize: "1 model",
      stats: { m: "8\"", t: 10, sv: "2+", w: 10, ld: "6+", oc: 3, invul: "4+" },
      abilities: {
        core: ["Deep Strike"],
        faction: ["Dark Pacts"],
        datasheet: [
          { name: "Aura of Terror", description: "Each time an enemy unit within 6\" of this model takes a Battle-shock test, subtract 1 from the result." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Malefic Gun", range: "12\"", attacks: "3", skill: "3+", strength: 6, ap: -1, damage: "2", abilities: ["Pistol"] }
        ],
        melee: [
          { name: "Hellforged Weapons", range: "Melee", attacks: "8", skill: "2+", strength: 8, ap: -2, damage: "3" }
        ]
      },
      keywords: ["Monster", "Character", "Chaos", "Daemon Prince"]
    },
    {
      id: "csm_land_raider",
      name: "Chaos Land Raider",
      type: "Vehicle",
      points: 240,
      squadSize: "1 model",
      stats: { m: "10\"", t: 12, sv: "2+", w: 16, ld: "6+", oc: 5 },
      abilities: {
        core: ["Deadly Demise D6", "Assault Ramp"],
        faction: ["Dark Pacts"],
        datasheet: [
          { name: "Daemonic Machine Spirit", description: "Each time this model makes a ranged attack, ignore any or all modifiers to the hit roll." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Twin Soulshatter Lascannon", range: "48\"", attacks: "2", skill: "3+", strength: 12, ap: -3, damage: "D6+1", abilities: ["Twin-Linked"] }
        ],
        melee: [
          { name: "Armoured Tracks", range: "Melee", attacks: "3", skill: "4+", strength: 6, ap: 0, damage: "1" }
        ]
      },
      keywords: ["Vehicle", "Transport", "Chaos", "Land Raider"]
    },
    {
      id: "csm_helbrute_scourge",
      name: "Helbrute with Scourge",
      type: "Vehicle",
      points: 135,
      squadSize: "1 model",
      stats: { m: "6\"", t: 9, sv: "3+", w: 8, ld: "6+", oc: 3 },
      abilities: {
        core: ["Deadly Demise 1"],
        faction: ["Dark Pacts"],
        datasheet: [
          { name: "Scourging Tendrils", description: "Each time this model fights, add +2 to the Attacks characteristic." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Multi-Melta", range: "18\"", attacks: "2", skill: "3+", strength: 9, ap: -4, damage: "D6", abilities: ["Melta 2"] }
        ],
        melee: [
          { name: "Scourge", range: "Melee", attacks: "7", skill: "3+", strength: 6, ap: -1, damage: "1" }
        ]
      },
      keywords: ["Vehicle", "Walker", "Helbrute"]
    },
    {
      id: "csm_dark_disciples",
      name: "Dark Disciples",
      type: "Infantry",
      points: 30,
      squadSize: "2 models",
      stats: { m: "6\"", t: 3, sv: "5+", w: 1, ld: "7+", oc: 1 },
      abilities: {
        core: [],
        faction: [],
        datasheet: [
          { name: "Servants of the Dark", description: "This unit must be attached to a Dark Apostle unit." }
        ]
      },
      weapons: {
        ranged: [],
        melee: [
          { name: "Close Combat Weapon", range: "Melee", attacks: "1", skill: "4+", strength: 3, ap: 0, damage: "1" }
        ]
      },
      keywords: ["Infantry", "Dark Disciples"]
    },
    {
      id: "csm_cultist_firebrand",
      name: "Cultist Firebrand",
      type: "Character",
      points: 35,
      squadSize: "1 model",
      stats: { m: "6\"", t: 3, sv: "6+", w: 2, ld: "7+", oc: 1 },
      abilities: {
        core: ["Leader"],
        faction: [],
        datasheet: [
          { name: "Fanatical Zeal", description: "While leading a unit, models in that unit have +1 to Advance rolls." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Flamer", range: "12\"", attacks: "D6", skill: "4+", strength: 4, ap: 0, damage: "1", abilities: ["Torrent"] }
        ],
        melee: [
          { name: "Close Combat Weapon", range: "Melee", attacks: "2", skill: "4+", strength: 3, ap: 0, damage: "1" }
        ]
      },
      keywords: ["Infantry", "Character", "Cultists", "Firebrand"]
    }
  ]
};
