import { Faction } from "../../types";

export const astraMilitarum: Faction = {
  id: "astra_militarum",
  name: "Astra Militarum (Imperial Guard)",
  iconName: "Sword",
  description: "The sprawling, un-augmented human armies of the Imperium, holding the line with billions of soldiers, heavy artillery, and armored tanks.",
  overview: {
    playstyle: "Disciplined combined-arms army, utilizing massive numbers of infantry supported by overwhelming artillery and armored vehicle formations.",
    strengths: ["Massive infantry numbers", "Powerful artillery", "Durable tank formations"],
    weaknesses: ["Individual units are weak", "Reliance on Order issuance"]
  },
  factionRule: {
    name: "Voice of Command",
    description: "In your Command phase, Officer models can issue Orders to friendly Regiment or Squadron units within 6\". The Order lasts until the start of your next Command phase. Standard orders include:\n- Move! Move! Move!: +3\" Movement.\n- First Rank, Fire! Second Rank, Fire!: Ranged weapons gain +1 Attack.\n- Take Aim!: +1 to Hit rolls.\n- Take Cover!: +1 to Save rolls (excluding Invulnerable Saves)."
  },
  detachment: {
    name: "Combined Regiment",
    description: "The combined arms of the Imperial Guard, integrating infantry divisions with armored tank support.",
    benefit: "Born Soldiers: Each time a Regiment or Squadron unit remains stationary during the Movement phase, until the end of the turn, ranged attacks by models in that unit score Critical Hits on unmodified Hit rolls of 6+ (Lethal Hits).",
    stratagems: [
      {
        name: "Reinforcements!",
        cost: 2,
        phase: "Any Phase",
        effect: "Target: One friendly Regiment unit that has just been destroyed. Effect: Place an identical replacement unit of full strength into Strategic Reserves."
      },
      {
        name: "Fields of Fire",
        cost: 2,
        phase: "Your Shooting Phase",
        effect: "Target: One Regiment or Squadron unit that has scored a hit on an enemy unit. Effect: Until the end of the phase, each time a friendly unit shoots that enemy unit, improve AP by 1."
      },
      {
        name: "Take Aim",
        cost: 1,
        phase: "Any Phase",
        effect: "Target: One Astra Militarum unit. Effect: This unit counts as having remained stationary this turn for the purpose of Born Soldiers benefit."
      }
    ],
    enhancements: [
      { name: "Grand Strategist", points: 20, description: "The model's unit can issue an additional Order each Command phase." },
      { name: "Laurels of Command", points: 15, description: "Once per battle, you can issue an order to an additional unit within 6\"." }
    ]
  },
  units: [
    {
      id: "am_command",
      name: "Cadian Command Squad",
      type: "Character",
      points: 65,
      squadSize: "5 models",
      stats: { m: "6\"", t: 3, sv: "5+", w: 3, ld: "7+", oc: 1 },
      abilities: {
        core: ["Leader"],
        faction: ["Voice of Command"],
        datasheet: [
          { name: "Commanding Officers", description: "Officer model can issue up to 1 Order per phase to friendly Regiment units within 6\"." },
          { name: "Cadian Command Vox", description: "Each time this unit's Officer issues an Order, the range of that order is increased to 24\"." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Lasgun", range: "24\"", attacks: "1", skill: "4+", strength: 3, ap: 0, damage: "1", abilities: ["Rapid Fire 1"] },
          { name: "Plasma Gun", range: "24\"", attacks: "1", skill: "4+", strength: 7, ap: -2, damage: "1", abilities: ["Rapid Fire 1", "Hazardous"] }
        ],
        melee: [
          { name: "Chainsword", range: "Melee", attacks: "3", skill: "4+", strength: 3, ap: 0, damage: "1" }
        ]
      },
      keywords: ["Infantry", "Character", "Officer", "Cadian", "Command Squad"]
    },
    {
      id: "am_shock_troops",
      name: "Cadian Shock Troops",
      type: "Battleline",
      points: 60,
      squadSize: "10 models (Max 20 models for 120 pts)",
      stats: { m: "6\"", t: 3, sv: "5+", w: 1, ld: "7+", oc: 2 },
      abilities: {
        core: [],
        faction: ["Voice of Command"],
        datasheet: [
          { name: "Shock Troops", description: "If you control an objective marker with this unit, it remains under your control even if this unit moves away, until an opponent controls it." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Lasgun", range: "24\"", attacks: "1", skill: "4+", strength: 3, ap: 0, damage: "1", abilities: ["Rapid Fire 1"] },
          { name: "Drum-Fed Autogun", range: "24\"", attacks: "2", skill: "4+", strength: 3, ap: 0, damage: "1" }
        ],
        melee: [
          { name: "Close Combat Weapon", range: "Melee", attacks: "1", skill: "4+", strength: 3, ap: 0, damage: "1" }
        ]
      },
      keywords: ["Infantry", "Battleline", "Regiment", "Shock Troops"]
    },
    {
      id: "am_leman_russ",
      name: "Leman Russ Battle Tank",
      type: "Vehicle",
      points: 170,
      squadSize: "1 model",
      stats: { m: "10\"", t: 11, sv: "2+", w: 13, ld: "7+", oc: 3 },
      abilities: {
        core: ["Deadly Demise D3"],
        faction: ["Voice of Command"],
        datasheet: [
          { name: "Armoured Tracks", description: "This model can make attacks in melee even if within Engagement Range of enemy units." },
          { name: "Battle Cannon Volley", description: "Each time this model shoots its Battle Cannon at an enemy unit, you can re-roll Hit rolls of 1. If that enemy unit is within range of an objective marker, you can re-roll the entire Hit roll instead." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Leman Russ Battle Cannon", range: "48\"", attacks: "D6+3", skill: "4+", strength: 10, ap: -1, damage: "3", abilities: ["Blast"] },
          { name: "Heavy Bolter", range: "36\"", attacks: "3", skill: "4+", strength: 5, ap: -1, damage: "2", abilities: ["Sustained Hits 1"] },
          { name: "Lascannon", range: "48\"", attacks: "1", skill: "4+", strength: 12, ap: -3, damage: "D6" }
        ],
        melee: [
          { name: "Armoured Tracks", range: "Melee", attacks: "6", skill: "4+", strength: 6, ap: 0, damage: "1" }
        ]
      },
      keywords: ["Vehicle", "Squadron", "Leman Russ"]
    },
    {
      id: "am_bullgryns",
      name: "Bullgryn Squad",
      type: "Infantry",
      points: 90,
      squadSize: "3 models",
      stats: { m: "6\"", t: 6, sv: "3+", w: 3, ld: "7+", oc: 1 },
      abilities: {
        core: [],
        faction: ["Voice of Command"],
        datasheet: [
          { name: "Slabshields", description: "Models in this unit equipped with a Slabshield have a 4+ Invulnerable Save." },
          { name: "Bullgryn Plate", description: "Each time an attack is allocated to a model in this unit, subtract 1 from the Damage characteristic of that attack." }
        ]
      },
      weapons: {
        ranged: [],
        melee: [
          { name: "Bullgryn Maul", range: "Melee", attacks: "4", skill: "3+", strength: 7, ap: -1, damage: "2" },
          { name: "Grenadier Gauntlet (Melee)", range: "Melee", attacks: "3", skill: "3+", strength: 5, ap: 0, damage: "1" }
        ]
      },
      keywords: ["Infantry", "Abhuman", "Bullgryns", "Squad"]
    },
    {
      id: "am_basilisk",
      name: "Basilisk",
      type: "Vehicle",
      points: 140,
      squadSize: "1 model",
      stats: { m: "10\"", t: 9, sv: "3+", w: 11, ld: "7+", oc: 3 },
      abilities: {
        core: ["Deadly Demise D3"],
        faction: ["Voice of Command"],
        datasheet: [
          { name: "Earthshaker Shells", description: "In your Shooting phase, after this model has shot its Earthshaker Cannon, select one enemy unit hit by one or more of those attacks. Until the start of your next Movement phase, subtract 2\" from that enemy unit's Move characteristic and subtract 2 from Advance and Charge rolls made for it." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Earthshaker Cannon", range: "240\"", attacks: "D6+1", skill: "4+", strength: 8, ap: -2, damage: "2", abilities: ["Blast", "Indirect Fire"] },
          { name: "Heavy Bolter", range: "36\"", attacks: "3", skill: "4+", strength: 5, ap: -1, damage: "2" }
        ],
        melee: [
          { name: "Armoured Tracks", range: "Melee", attacks: "3", skill: "4+", strength: 6, ap: 0, damage: "1" }
        ]
      },
      keywords: ["Vehicle", "Squadron", "Artillery", "Basilisk"]
    },
    {
      id: "am_leontus",
      name: "Lord Solar Leontus",
      type: "Character",
      points: 125,
      squadSize: "1 model",
      stats: { m: "10\"", t: 4, sv: "2+", w: 6, ld: "6+", oc: 1, invul: "4+" },
      abilities: {
        core: [],
        faction: ["Voice of Command"],
        datasheet: [
          { name: "Grand Commander", description: "This model can issue up to 3 Orders per Command phase to Regiment or Squadron units up to 12\"." },
          { name: "The Lord Solar", description: "At the start of your Command phase, you gain 1 Command Point." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Sol's Righteous Wrath", range: "12\"", attacks: "2", skill: "2+", strength: 5, ap: -2, damage: "2", abilities: ["Pistol"] }
        ],
        melee: [
          { name: "Konstantin's Hooves", range: "Melee", attacks: "4", skill: "2+", strength: 5, ap: 0, damage: "1" },
          { name: "Sol's Righteous Sabre", range: "Melee", attacks: "6", skill: "2+", strength: 6, ap: -2, damage: "2" }
        ]
      },
      keywords: ["Mounted", "Character", "Epic Hero", "Officer", "Warlord", "Leontus"]
    },
    {
      id: "am_creed",
      name: "Ursula Creed",
      type: "Character",
      points: 55,
      squadSize: "1 model",
      stats: { m: "6\"", t: 3, sv: "4+", w: 4, ld: "6+", oc: 1 },
      abilities: {
        core: ["Leader"],
        faction: ["Voice of Command"],
        datasheet: [
          { name: "Tactical Genius", description: "Once per battle round, one unit within 12\" can be targeted with a Stratagem for 0 CP, even if another unit has already been targeted with that stratagem." },
          { name: "Lord Castellan's Orders", description: "This model can issue up to 2 Orders per phase to Regiment units within 6\"." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Duty and Vengeance", range: "12\"", attacks: "4", skill: "2+", strength: 4, ap: -1, damage: "2", abilities: ["Pistol"] }
        ],
        melee: [
          { name: "Power Sword", range: "Melee", attacks: "4", skill: "3+", strength: 4, ap: -2, damage: "1" }
        ]
      },
      keywords: ["Infantry", "Character", "Epic Hero", "Officer", "Cadian", "Creed"]
    },
    {
      id: "am_straken",
      name: "\"Iron Hand\" Straken",
      type: "Character",
      points: 55,
      squadSize: "1 model",
      stats: { m: "6\"", t: 4, sv: "4+", w: 5, ld: "6+", oc: 1, invul: "5+" },
      abilities: {
        core: ["Leader"],
        faction: ["Voice of Command"],
        datasheet: [
          { name: "Cold Steel and Courage", description: "While leading a unit, models in that unit have the [Fights First] ability. Additionally, add +1 to Wound rolls for melee attacks made by models in that unit." },
          { name: "Iron Hand Bionic", description: "This model has the [Feel No Pain 5+] ability." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Shotgun", range: "12\"", attacks: "2", skill: "3+", strength: 4, ap: 0, damage: "1", abilities: ["Assault"] }
        ],
        melee: [
          { name: "Bionic Arm and Combat Blade", range: "Melee", attacks: "6", skill: "2+", strength: 7, ap: -1, damage: "2" }
        ]
      },
      keywords: ["Infantry", "Character", "Epic Hero", "Officer", "Catachan", "Straken"]
    },
    {
      id: "am_commissar",
      name: "Commissar",
      type: "Character",
      points: 30,
      squadSize: "1 model",
      stats: { m: "6\"", t: 3, sv: "4+", w: 3, ld: "6+", oc: 1 },
      abilities: {
        core: ["Leader"],
        faction: [],
        datasheet: [
          { name: "Political Commissar", description: "While leading a unit, each time that unit takes a Battle-shock test, you can re-roll that test." },
          { name: "Summary Execution", description: "Once per battle, when the unit this model is leading fails a Battle-shock test, you can execute one model in that unit. If you do, that unit passes that test automatically." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Bolt Pistol", range: "12\"", attacks: "1", skill: "3+", strength: 4, ap: 0, damage: "1", abilities: ["Pistol"] }
        ],
        melee: [
          { name: "Chainsword", range: "Melee", attacks: "3", skill: "3+", strength: 3, ap: 0, damage: "1" }
        ]
      },
      keywords: ["Infantry", "Character", "Commissar"]
    },
    {
      id: "am_psyker",
      name: "Primaris Psyker",
      type: "Character",
      points: 60,
      squadSize: "1 model",
      stats: { m: "6\"", t: 3, sv: "5+", w: 3, ld: "7+", oc: 1, invul: "4+" },
      abilities: {
        core: ["Leader"],
        faction: [],
        datasheet: [
          { name: "Mental Barrier (Psychic)", description: "While leading a unit, models in that unit have a 4+ Invulnerable Save against ranged attacks." },
          { name: "Psychic Maelstrom", description: "This model's psychic ranged attacks have the [Blast] and [Devastating Wounds] abilities." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Psychic Barrier (Witchfire)", range: "18\"", attacks: "3", skill: "3+", strength: 6, ap: -2, damage: "D3", abilities: ["Psychic"] }
        ],
        melee: [
          { name: "Force Weapon", range: "Melee", attacks: "3", skill: "3+", strength: 5, ap: -1, damage: "D3", abilities: ["Psychic"] }
        ]
      },
      keywords: ["Infantry", "Character", "Psyker"]
    },
    {
      id: "am_infantry_squad",
      name: "Infantry Squad",
      type: "Battleline",
      points: 60,
      squadSize: "10 models",
      stats: { m: "6\"", t: 3, sv: "5+", w: 1, ld: "7+", oc: 2 },
      abilities: {
        core: [],
        faction: ["Voice of Command"],
        datasheet: [
          { name: "Defender of the Realm", description: "While this unit is within range of an objective marker you control, each time an attack is allocated to a model in this unit, add 1 to the Armor save." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Lasgun", range: "24\"", attacks: "1", skill: "4+", strength: 3, ap: 0, damage: "1", abilities: ["Rapid Fire 1"] }
        ],
        melee: [
          { name: "Close Combat Weapon", range: "Melee", attacks: "1", skill: "4+", strength: 3, ap: 0, damage: "1" }
        ]
      },
      keywords: ["Infantry", "Battleline", "Regiment", "Infantry Squad"]
    },
    {
      id: "am_catachans",
      name: "Catachan Jungle Fighters",
      type: "Battleline",
      points: 55,
      squadSize: "10 models",
      stats: { m: "6\"", t: 3, sv: "5+", w: 1, ld: "7+", oc: 2 },
      abilities: {
        core: ["Scouts 6\""],
        faction: ["Voice of Command"],
        datasheet: [
          { name: "Jungle Fighters", description: "This unit can Advance and Charge in the same turn. Melee attacks by this unit have the [Sustained Hits 1] ability." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Lasgun", range: "24\"", attacks: "1", skill: "4+", strength: 3, ap: 0, damage: "1", abilities: ["Rapid Fire 1"] }
        ],
        melee: [
          { name: "Catachan Combat Blade", range: "Melee", attacks: "2", skill: "3+", strength: 4, ap: 0, damage: "1" }
        ]
      },
      keywords: ["Infantry", "Battleline", "Regiment", "Catachan"]
    },
    {
      id: "am_krieg",
      name: "Death Korps of Krieg",
      type: "Battleline",
      points: 65,
      squadSize: "10 models",
      stats: { m: "6\"", t: 3, sv: "5+", w: 1, ld: "7+", oc: 2 },
      abilities: {
        core: [],
        faction: ["Voice of Command"],
        datasheet: [
          { name: "Grim Demeanor", description: "Each time a model in this unit is destroyed, on a D6 roll of 4+, do not remove it; it can shoot or fight before being removed." },
          { name: "Krieg Medipack", description: "In your Command phase, you can return 1 destroyed Infantry model back to this unit." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Lasgun", range: "24\"", attacks: "1", skill: "4+", strength: 3, ap: 0, damage: "1", abilities: ["Rapid Fire 1"] }
        ],
        melee: [
          { name: "Close Combat Weapon", range: "Melee", attacks: "1", skill: "4+", strength: 3, ap: 0, damage: "1" }
        ]
      },
      keywords: ["Infantry", "Battleline", "Regiment", "Krieg"]
    },
    {
      id: "am_scions",
      name: "Tempestus Scions",
      type: "Infantry",
      points: 55,
      squadSize: "5 models",
      stats: { m: "6\"", t: 3, sv: "4+", w: 1, ld: "6+", oc: 1 },
      abilities: {
        core: ["Deep Strike"],
        faction: ["Voice of Command"],
        datasheet: [
          { name: "Storm Troopers", description: "Each time a model in this unit makes a ranged attack, you can re-roll a Hit roll of 1. If this unit was set up using Deep Strike this turn, you can re-roll all Hit rolls instead." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Hot-shot Lasgun", range: "18\"", attacks: "2", skill: "3+", strength: 3, ap: -1, damage: "1" }
        ],
        melee: [
          { name: "Close Combat Weapon", range: "Melee", attacks: "1", skill: "4+", strength: 3, ap: 0, damage: "1" }
        ]
      },
      keywords: ["Infantry", "Regiment", "Deep Strike", "Scions"]
    },
    {
      id: "am_kasrkin",
      name: "Kasrkin",
      type: "Infantry",
      points: 100,
      squadSize: "10 models",
      stats: { m: "6\"", t: 3, sv: "4+", w: 1, ld: "7+", oc: 1 },
      abilities: {
        core: ["Scouts 6\""],
        faction: ["Voice of Command"],
        datasheet: [
          { name: "Warrior Elite", description: "At the start of the battle, select one Combat Doctrine to apply to this unit for the rest of the battle, or select one additional Order to be issued to this unit." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Hot-shot Lasgun", range: "18\"", attacks: "2", skill: "3+", strength: 3, ap: -1, damage: "1", abilities: ["Rapid Fire 1"] }
        ],
        melee: [
          { name: "Close Combat Weapon", range: "Melee", attacks: "1", skill: "4+", strength: 3, ap: 0, damage: "1" }
        ]
      },
      keywords: ["Infantry", "Regiment", "Kasrkin"]
    },
    {
      id: "am_heavy_weapons",
      name: "Heavy Weapons Squad",
      type: "Infantry",
      points: 60,
      squadSize: "3 heavy weapon teams",
      stats: { m: "6\"", t: 3, sv: "5+", w: 2, ld: "7+", oc: 1 },
      abilities: {
        core: [],
        faction: ["Voice of Command"],
        datasheet: [
          { name: "Entrenched Teams", description: "While this unit is within range of an objective marker you control, models in this unit have the [Benefit of Cover] ability." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Heavy Bolter", range: "36\"", attacks: "3", skill: "4+", strength: 5, ap: -1, damage: "2", abilities: ["Heavy"] },
          { name: "Lascannon", range: "48\"", attacks: "1", skill: "4+", strength: 12, ap: -3, damage: "D6", abilities: ["Heavy"] }
        ],
        melee: [
          { name: "Close Combat Weapon", range: "Melee", attacks: "2", skill: "4+", strength: 3, ap: 0, damage: "1" }
        ]
      },
      keywords: ["Infantry", "Regiment", "Heavy Weapons"]
    },
    {
      id: "am_scout_sentinel",
      name: "Scout Sentinel",
      type: "Vehicle",
      points: 60,
      squadSize: "1 model (Max 3 models for 180 pts)",
      stats: { m: "12\"", t: 7, sv: "3+", w: 7, ld: "7+", oc: 2 },
      abilities: {
        core: ["Scouts 9\""],
        faction: ["Voice of Command"],
        datasheet: [
          { name: "Daring Recon", description: "At the start of your Shooting phase, select one enemy unit within 18\" of this model. Until the end of the phase, friendly Regiment or Squadron units shooting that selected enemy unit ignore the penalty for indirect firing and can re-roll Hit rolls of 1." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Multi-laser", range: "36\"", attacks: "3", skill: "4+", strength: 6, ap: 0, damage: "1" }
        ],
        melee: [
          { name: "Sentinel Chainsaw", range: "Melee", attacks: "2", skill: "4+", strength: 5, ap: -1, damage: "1" }
        ]
      },
      keywords: ["Vehicle", "Squadron", "Walker", "Scout Sentinel"]
    },
    {
      id: "am_armoured_sentinel",
      name: "Armoured Sentinel",
      type: "Vehicle",
      points: 70,
      squadSize: "1 model (Max 3 models for 210 pts)",
      stats: { m: "10\"", t: 8, sv: "2+", w: 7, ld: "7+", oc: 2 },
      abilities: {
        core: [],
        faction: ["Voice of Command"],
        datasheet: [
          { name: "Hunter-killers", description: "Each time this model makes an attack targeting a Vehicle or Monster, you can re-roll the Wound roll." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Plasma Cannon", range: "36\"", attacks: "D3", skill: "4+", strength: 7, ap: -2, damage: "2", abilities: ["Blast", "Hazardous"] }
        ],
        melee: [
          { name: "Sentinel Chainsaw", range: "Melee", attacks: "2", skill: "4+", strength: 5, ap: -1, damage: "1" }
        ]
      },
      keywords: ["Vehicle", "Squadron", "Walker", "Armoured Sentinel"]
    },
    {
      id: "am_rogal_dorn",
      name: "Rogal Dorn Battle Tank",
      type: "Vehicle",
      points: 260,
      squadSize: "1 model",
      stats: { m: "10\"", t: 12, sv: "2+", w: 18, ld: "7+", oc: 5 },
      abilities: {
        core: ["Deadly Demise D6"],
        faction: ["Voice of Command"],
        datasheet: [
          { name: "Ablative Plating", description: "Once per battle, the first time this model is targeted by an attack, reduce the damage characteristic of that attack to 0." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Oppressor Cannon", range: "48\"", attacks: "D3+1", skill: "4+", strength: 12, ap: -3, damage: "4", abilities: ["Blast"] },
          { name: "Heavy Stubber", range: "36\"", attacks: "3", skill: "4+", strength: 4, ap: 0, damage: "1" }
        ],
        melee: [
          { name: "Armoured Tracks", range: "Melee", attacks: "6", skill: "4+", strength: 8, ap: 0, damage: "1" }
        ]
      },
      keywords: ["Vehicle", "Squadron", "Rogal Dorn"]
    },
    {
      id: "am_chimera",
      name: "Chimera",
      type: "Vehicle",
      points: 70,
      squadSize: "1 model",
      stats: { m: "12\"", t: 9, sv: "3+", w: 9, ld: "7+", oc: 2 },
      abilities: {
        core: ["Deadly Demise D3"],
        faction: [],
        datasheet: [
          { name: "Mobile command post", description: "Officer models inside can issue Orders to Regiment units within 6\"." },
          { name: "Firing Deck", description: "Up to 2 models inside can shoot out using the Firing Deck 2 rule." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Multi-laser", range: "36\"", attacks: "3", skill: "4+", strength: 6, ap: 0, damage: "1" },
          { name: "Heavy Flamers", range: "12\"", attacks: "D6", skill: "2+", strength: 5, ap: -1, damage: "1", abilities: ["Torrent"] }
        ],
        melee: [
          { name: "Armoured Tracks", range: "Melee", attacks: "3", skill: "4+", strength: 6, ap: 0, damage: "1" }
        ]
      },
      keywords: ["Vehicle", "Transport", "Dedicated Transport", "Chimera"]
    },
    {
      id: "am_valkyrie",
      name: "Valkyrie",
      type: "Vehicle",
      points: 190,
      squadSize: "1 model",
      stats: { m: "20\"", t: 9, sv: "3+", w: 12, ld: "7+", oc: 3 },
      abilities: {
        core: ["Deadly Demise D3", "Fly"],
        faction: ["Voice of Command"],
        datasheet: [
          { name: "Grav-chute Insertion", description: "Models can disembark from this transport even after it has made a Normal move, and can declare a charge in the same turn." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Multi-laser", range: "36\"", attacks: "3", skill: "4+", strength: 6, ap: 0, damage: "1" },
          { name: "Rocket Pods", range: "24\"", attacks: "2D6", skill: "4+", strength: 4, ap: 0, damage: "1", abilities: ["Blast"] }
        ],
        melee: [
          { name: "Armoured Hull", range: "Melee", attacks: "3", skill: "4+", strength: 6, ap: 0, damage: "1" }
        ]
      },
      keywords: ["Vehicle", "Transport", "Fly", "Valkyrie"]
    },
    {
      id: "am_deathstrike",
      name: "Deathstrike",
      type: "Vehicle",
      points: 160,
      squadSize: "1 model",
      stats: { m: "10\"", t: 9, sv: "3+", w: 11, ld: "7+", oc: 3 },
      abilities: {
        core: ["Deadly Demise D6"],
        faction: ["Voice of Command"],
        datasheet: [
          { name: "Deathstrike Missile", description: "Once per battle, select one enemy unit on the battlefield. Roll a D6; on a 2-5, that unit suffers 3D6 mortal wounds. On a 6, it suffers 4D6 mortal wounds." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Heavy Bolter", range: "36\"", attacks: "3", skill: "4+", strength: 5, ap: -1, damage: "2" }
        ],
        melee: [
          { name: "Armoured Tracks", range: "Melee", attacks: "3", skill: "4+", strength: 6, ap: 0, damage: "1" }
        ]
      },
      keywords: ["Vehicle", "Squadron", "Artillery", "Deathstrike"]
    },
    {
      id: "am_valiant_dorn",
      name: "Valiant Dorn Battle Tank",
      type: "Vehicle",
      points: 250,
      squadSize: "1 model",
      stats: { m: "10\"", t: 12, sv: "2+", w: 18, ld: "7+", oc: 5 },
      abilities: {
        core: ["Deadly Demise D6"],
        faction: ["Voice of Command"],
        datasheet: [
          { name: "Heavy Support", description: "This model's ranged weapons have [Sustained Hits 1]." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Oppressor Cannon", range: "48\"", attacks: "D3+1", skill: "4+", strength: 12, ap: -3, damage: "4" }
        ],
        melee: [
          { name: "Tracks", range: "Melee", attacks: "6", skill: "4+", strength: 8, ap: 0, damage: "1" }
        ]
      },
      keywords: ["Vehicle", "Squadron", "Rogal Dorn"]
    },
    {
      id: "am_veteran_sergeant",
      name: "Veteran Sergeant",
      type: "Character",
      points: 40,
      squadSize: "1 model",
      stats: { m: "6\"", t: 3, sv: "5+", w: 3, ld: "7+", oc: 1 },
      abilities: {
        core: ["Leader"],
        faction: ["Voice of Command"],
        datasheet: [
          { name: "Veteran Tactician", description: "While leading a unit, models in that unit have +1 to Hit rolls." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Bolt Pistol", range: "12\"", attacks: "1", skill: "3+", strength: 4, ap: 0, damage: "1" }
        ],
        melee: [
          { name: "Power Sword", range: "Melee", attacks: "3", skill: "3+", strength: 4, ap: -2, damage: "1" }
        ]
      },
      keywords: ["Infantry", "Character", "Regiment", "Veteran Sergeant"]
    },
    {
      id: "am_heavy_support_squad",
      name: "Heavy Support Squad",
      type: "Infantry",
      points: 80,
      squadSize: "3 heavy weapon teams",
      stats: { m: "6\"", t: 3, sv: "5+", w: 2, ld: "7+", oc: 1 },
      abilities: {
        core: [],
        faction: ["Voice of Command"],
        datasheet: [
          { name: "Artillery Support", description: "Ranged attacks from this unit have the [Indirect Fire] ability." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Mortar", range: "48\"", attacks: "D6", skill: "4+", strength: 5, ap: 0, damage: "1", abilities: ["Indirect Fire"] }
        ],
        melee: [
          { name: "Close Combat Weapon", range: "Melee", attacks: "2", skill: "4+", strength: 3, ap: 0, damage: "1" }
        ]
      },
      keywords: ["Infantry", "Regiment", "Heavy Weapons"]
    }
  ]
};
