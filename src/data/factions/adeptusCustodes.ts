import { Faction } from "../../types";

export const adeptusCustodes: Faction = {
  id: "adeptus_custodes",
  name: "Adeptus Custodes",
  iconName: "Shield",
  description: "The Emperor's personal bodyguard, an elite brotherhood of demigod warriors clad in auramite armor, executing flawless defensive martial katas.",
  overview: {
    playstyle: "Elite, highly durable force with a small number of incredibly powerful models, focusing on defensive stances and surgical strikes.",
    strengths: ["Extreme durability", "High melee power", "Elite stat lines"],
    weaknesses: ["Very low model counts", "Slow movement"]
  },
  factionRule: {
    name: "Martial Ka'tah",
    description: "At the start of the Fight phase, select one Martial Ka'tah to active for your army until the end of that phase:\n- Kaelor Kata: Melee weapons gain [Sustained Hits 1].\n- Dacatarai Kata: Melee weapons gain [Lethal Hits].\n- Rendax Kata: Critical wounds in melee improve armor penetration by 1."
  },
  detachment: {
    name: "Shield Host",
    description: "An impenetrable bulwark of Golden Sentinels standing firm against the tides of darkness.",
    benefit: "Aegis of the Emperor: Models in Adeptus Custodes units have a 4+ Invulnerable Save. Additionally, they have a 4+ Feel No Pain against mortal wounds.",
    stratagems: [
      {
        name: "Slayer of Nightmares",
        cost: 1,
        phase: "Your Fight Phase",
        effect: "Target: One Adeptus Custodes unit. Effect: Add +1 to Wound rolls for melee attacks targeting a Monster or Vehicle."
      },
      {
        name: "Unwavering Sentinels",
        cost: 2,
        phase: "Opponent's Charge Phase",
        effect: "Target: One Adeptus Custodes unit. Effect: This unit gains the [Fights First] ability until the end of the turn."
      },
      {
        name: "Vigilance Eternal",
        cost: 1,
        phase: "Your Movement Phase",
        effect: "Target: One Adeptus Custodes unit. Effect: If you control an objective marker with this unit, it remains under your control even if this unit moves away."
      }
    ],
    enhancements: [
      { name: "Ceaseless Hunter", points: 20, description: "The model's unit can Fall Back and Shoot or Charge." },
      { name: "Veiled Blade", points: 25, description: "Add 2 to the Attacks characteristic of melee weapons equipped by the model." }
    ]
  },
  units: [
    {
      id: "cust_captain",
      name: "Shield-Captain",
      type: "Character",
      points: 140,
      squadSize: "1 model",
      stats: { m: "6\"", t: 6, sv: "2+", w: 7, ld: "6+", oc: 2, invul: "4+" },
      abilities: {
        core: ["Leader"],
        faction: ["Martial Ka'tah"],
        datasheet: [
          { name: "Strategic Mastery", description: "Once per battle round, one unit within 12\" can be targeted with a Stratagem for 0 CP, even if another unit has already been targeted with that stratagem." },
          { name: "Golden Light", description: "Once per battle, in your Movement phase, you can teleport this model and its attached unit anywhere more than 9\" away from all enemy models." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Guardian Spear (Ranged)", range: "24\"", attacks: "2", skill: "2+", strength: 4, ap: -1, damage: "2" }
        ],
        melee: [
          { name: "Guardian Spear (Melee)", range: "Melee", attacks: "6", skill: "2+", strength: 7, ap: -2, damage: "2" },
          { name: "Sentinel Blade", range: "Melee", attacks: "7", skill: "2+", strength: 6, ap: -2, damage: "1" }
        ]
      },
      keywords: ["Infantry", "Character", "Shield-Captain"]
    },
    {
      id: "cust_guard",
      name: "Custodian Guard",
      type: "Battleline",
      points: 225,
      squadSize: "4 models (Max 5 models for 270 pts)",
      stats: { m: "6\"", t: 6, sv: "2+", w: 3, ld: "6+", oc: 2 },
      abilities: {
        core: [],
        faction: ["Martial Ka'tah"],
        datasheet: [
          { name: "Sentinel Storm", description: "Once per battle, in your Shooting phase, this unit can shoot twice with its Guardian Spears." },
          { name: "Praesidium Shields", description: "Models equipped with a Praesidium Shield increase their Wounds characteristic by 1." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Guardian Spear (Ranged)", range: "24\"", attacks: "2", skill: "2+", strength: 4, ap: -1, damage: "2" }
        ],
        melee: [
          { name: "Guardian Spear (Melee)", range: "Melee", attacks: "5", skill: "2+", strength: 7, ap: -2, damage: "2" },
          { name: "Sentinel Blade (Melee)", range: "Melee", attacks: "5", skill: "2+", strength: 6, ap: -2, damage: "1" }
        ]
      },
      keywords: ["Infantry", "Battleline", "Custodian Guard"]
    },
    {
      id: "cust_caladius",
      name: "Caladius Grav-tank",
      type: "Vehicle",
      points: 215,
      squadSize: "1 model",
      stats: { m: "10\"", t: 10, sv: "2+", w: 14, ld: "6+", oc: 3, invul: "5+" },
      abilities: {
        core: ["Deadly Demise D3", "Fly"],
        faction: ["Martial Ka'tah"],
        datasheet: [
          { name: "Grav-backwash", description: "Enemies charging this vehicle subtract 2 from their Charge rolls." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Twin Iliastus Accelerator Cannon", range: "48\"", attacks: "8", skill: "2+", strength: 8, ap: -1, damage: "2", abilities: ["Twin-Linked"] },
          { name: "Twin Arachnus Heavy Lascannon", range: "48\"", attacks: "2", skill: "2+", strength: 12, ap: -3, damage: "D6+1", abilities: ["Twin-Linked"] }
        ],
        melee: [
          { name: "Armoured Hull", range: "Melee", attacks: "4", skill: "4+", strength: 7, ap: 0, damage: "1" }
        ]
      },
      keywords: ["Vehicle", "Fly", "Caladius"]
    },
    {
      id: "cust_blade_champion",
      name: "Blade Champion",
      type: "Character",
      points: 110,
      squadSize: "1 model",
      stats: { m: "6\"", t: 6, sv: "2+", w: 6, ld: "6+", oc: 1, invul: "4+" },
      abilities: {
        core: ["Leader"],
        faction: ["Martial Ka'tah"],
        datasheet: [
          { name: "Legacy of Combat", description: "While leading a unit, models in that unit have the [Fights First] and [Fights On Death 4+] abilities." },
          { name: "Blade-katas", description: "Each time this model fights, select one of the following styles:\n- Hurricane: Melee weapons gain [Sustained Hits 2].\n- Pierce: Melee weapons gain +2 Strength and [Devastating Wounds].\n- Parry: Subtract 1 from Hit rolls for attacks targeting this model." }
        ]
      },
      weapons: {
        ranged: [],
        melee: [
          { name: "Vaultswords", range: "Melee", attacks: "6", skill: "2+", strength: 6, ap: -2, damage: "2" }
        ]
      },
      keywords: ["Infantry", "Character", "Blade Champion"]
    },
    {
      id: "cust_allarus",
      name: "Allarus Custodians",
      type: "Infantry",
      points: 130,
      squadSize: "2 models (Max 6 models for 390 pts)",
      stats: { m: "5\"", t: 7, sv: "2+", w: 4, ld: "6+", oc: 1 },
      abilities: {
        core: ["Deep Strike"],
        faction: ["Martial Ka'tah"],
        datasheet: [
          { name: "Slayers of Tyrants", description: "Each time a model in this unit makes an attack targeting a Character, Monster, or Vehicle, you can re-roll the Wound roll." },
          { name: "From Golden Light", description: "Once per battle, at the end of your opponent's turn, you can remove this unit from the battlefield and place it in Strategic Reserves." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Castellan Axe (Ranged)", range: "24\"", attacks: "2", skill: "2+", strength: 4, ap: -1, damage: "2" },
          { name: "Balistus Grenade Launcher", range: "18\"", attacks: "D3", skill: "2+", strength: 4, ap: -1, damage: "1", abilities: ["Blast"] }
        ],
        melee: [
          { name: "Castellan Axe (Melee)", range: "Melee", attacks: "4", skill: "3+", strength: 9, ap: -1, damage: "3" },
          { name: "Guardian Spear (Melee)", range: "Melee", attacks: "5", skill: "2+", strength: 7, ap: -2, damage: "2" }
        ]
      },
      keywords: ["Infantry", "Terminator", "Allarus Custodians"]
    },
    {
      id: "cust_trajann",
      name: "Trajann Valoris",
      type: "Character",
      points: 150,
      squadSize: "1 model",
      stats: { m: "6\"", t: 6, sv: "2+", w: 7, ld: "5+", oc: 2, invul: "4+" },
      abilities: {
        core: ["Leader"],
        faction: ["Martial Ka'tah"],
        datasheet: [
          { name: "Captain-General", description: "While leading a unit, ignore any and all modifiers to the characteristics of models in that unit or to rolls made for those models." },
          { name: "Moment Shackle", description: "Once per battle, at the start of any phase, choose one of the following shackle powers:\n- Gain a 2+ Invulnerable Save until the end of the phase.\n- Set this model's Melee attacks characteristic to 12 until the end of the phase.\n- Target one friendly unit within 12\"; that unit can be targeted with a Stratagem for 0 CP." }
        ]
      },
      weapons: {
        ranged: [
          { name: "The Watcher's Axe (Ranged)", range: "24\"", attacks: "2", skill: "2+", strength: 5, ap: -1, damage: "2" }
        ],
        melee: [
          { name: "The Watcher's Axe (Melee)", range: "Melee", attacks: "6", skill: "2+", strength: 10, ap: -3, damage: "3" }
        ]
      },
      keywords: ["Infantry", "Character", "Epic Hero", "Shield-Captain", "Trajann Valoris"]
    },
    {
      id: "cust_valerian",
      name: "Valerian",
      type: "Character",
      points: 110,
      squadSize: "1 model",
      stats: { m: "6\"", t: 6, sv: "2+", w: 6, ld: "6+", oc: 1, invul: "4+" },
      abilities: {
        core: ["Leader"],
        faction: ["Martial Ka'tah"],
        datasheet: [
          { name: "Golden Laurels", description: "While leading a unit, each time an attack is allocated to a model in that unit, reduce the Damage characteristic of that attack by 1." },
          { name: "Gnosis", description: "Melee attacks made by Valerian have the [Devastating Wounds] ability." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Gnosis (Ranged)", range: "24\"", attacks: "2", skill: "2+", strength: 4, ap: -1, damage: "2" }
        ],
        melee: [
          { name: "Gnosis (Melee)", range: "Melee", attacks: "6", skill: "2+", strength: 7, ap: -2, damage: "2" }
        ]
      },
      keywords: ["Infantry", "Character", "Epic Hero", "Valerian"]
    },
    {
      id: "cust_aleya",
      name: "Aleya",
      type: "Character",
      points: 80,
      squadSize: "1 model",
      stats: { m: "6\"", t: 4, sv: "3+", w: 5, ld: "6+", oc: 1, invul: "5+" },
      abilities: {
        core: ["Leader"],
        faction: [],
        datasheet: [
          { name: "Witch Hunter", description: "While leading a unit, models in that unit have a 4+ Feel No Pain against psychic attacks." },
          { name: "Sombre Sentinel", description: "Aleya has the [Feel No Pain 4+] and [Fights First] abilities." }
        ]
      },
      weapons: {
        ranged: [],
        melee: [
          { name: "Somnus", range: "Melee", attacks: "5", skill: "2+", strength: 5, ap: -2, damage: "2", abilities: ["Anti-Psyker 2+", "Devastating Wounds"] }
        ]
      },
      keywords: ["Infantry", "Character", "Epic Hero", "Anathema Psykana", "Aleya"]
    },
    {
      id: "cust_allarus_captain",
      name: "Shield-Captain in Allarus Armour",
      type: "Character",
      points: 140,
      squadSize: "1 model",
      stats: { m: "5\"", t: 7, sv: "2+", w: 7, ld: "6+", oc: 2, invul: "4+" },
      abilities: {
        core: ["Leader", "Deep Strike"],
        faction: ["Martial Ka'tah"],
        datasheet: [
          { name: "Strategic Mastery", description: "Once per battle round, one unit within 12\" can be targeted with a Stratagem for 0 CP, even if another unit has already been targeted with that stratagem." },
          { name: "Slayer of Tyrants", description: "Each time this model makes an attack targeting a Character, Monster, or Vehicle, you can re-roll the Wound roll." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Castellan Axe (Ranged)", range: "24\"", attacks: "2", skill: "2+", strength: 4, ap: -1, damage: "2" },
          { name: "Balistus Grenade Launcher", range: "18\"", attacks: "D3", skill: "2+", strength: 4, ap: -1, damage: "1", abilities: ["Blast"] }
        ],
        melee: [
          { name: "Castellan Axe (Melee)", range: "Melee", attacks: "5", skill: "3+", strength: 9, ap: -1, damage: "3" },
          { name: "Guardian Spear (Melee)", range: "Melee", attacks: "6", skill: "2+", strength: 7, ap: -2, damage: "2" }
        ]
      },
      keywords: ["Infantry", "Character", "Terminator", "Shield-Captain"]
    },
    {
      id: "cust_bike_captain",
      name: "Shield-Captain on Dawneagle Jetbike",
      type: "Character",
      points: 145,
      squadSize: "1 model",
      stats: { m: "12\"", t: 6, sv: "2+", w: 8, ld: "6+", oc: 2, invul: "4+" },
      abilities: {
        core: ["Leader", "Fly"],
        faction: ["Martial Ka'tah"],
        datasheet: [
          { name: "Strategic Mastery", description: "Once per battle round, one unit within 12\" can be targeted with a Stratagem for 0 CP." },
          { name: "Swooping Charge", description: "Once per battle, in your Charge phase, after this model ends a Charge move, each enemy unit within engagement range suffers D3+1 mortal wounds." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Salvo Launcher", range: "24\"", attacks: "1", skill: "2+", strength: 9, ap: -2, damage: "3" }
        ],
        melee: [
          { name: "Interceptor Lance", range: "Melee", attacks: "5", skill: "2+", strength: 7, ap: -2, damage: "2", abilities: ["Lance"] }
        ]
      },
      keywords: ["Mounted", "Character", "Fly", "Shield-Captain"]
    },
    {
      id: "cust_wardens",
      name: "Custodian Wardens",
      type: "Infantry",
      points: 200,
      squadSize: "3 models",
      stats: { m: "6\"", t: 6, sv: "2+", w: 3, ld: "6+", oc: 2 },
      abilities: {
        core: [],
        faction: ["Martial Ka'tah"],
        datasheet: [
          { name: "Living Fortress", description: "Once per battle, at the start of any phase, you can activate this ability. Until the end of that phase, models in this unit have a 4+ Feel No Pain." },
          { name: "Guardian Protectors", description: "While a Character is leading this unit, subtract 1 from the Wound roll for attacks targeting this unit." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Guardian Spear (Ranged)", range: "24\"", attacks: "2", skill: "2+", strength: 4, ap: -1, damage: "2" }
        ],
        melee: [
          { name: "Castellan Axe (Melee)", range: "Melee", attacks: "4", skill: "3+", strength: 9, ap: -1, damage: "3" },
          { name: "Guardian Spear (Melee)", range: "Melee", attacks: "5", skill: "2+", strength: 7, ap: -2, damage: "2" }
        ]
      },
      keywords: ["Infantry", "Custodian Wardens", "Squad"]
    },
    {
      id: "cust_prosecutors",
      name: "Prosecutors",
      type: "Battleline",
      points: 40,
      squadSize: "4 models",
      stats: { m: "6\"", t: 3, sv: "3+", w: 1, ld: "6+", oc: 1 },
      abilities: {
        core: [],
        faction: [],
        datasheet: [
          { name: "Witch Hunters", description: "Prosecutors have the [Feel No Pain 3+] against psychic attacks. Ranged attacks made by models in this unit have the [Anti-Psyker 3+] ability." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Boltgun", range: "24\"", attacks: "1", skill: "3+", strength: 4, ap: 0, damage: "1", abilities: ["Rapid Fire 1"] }
        ],
        melee: [
          { name: "Close Combat Weapon", range: "Melee", attacks: "1", skill: "4+", strength: 3, ap: 0, damage: "1" }
        ]
      },
      keywords: ["Infantry", "Battleline", "Anathema Psykana", "Prosecutors"]
    },
    {
      id: "cust_vigilators",
      name: "Vigilators",
      type: "Infantry",
      points: 50,
      squadSize: "4 models",
      stats: { m: "6\"", t: 3, sv: "3+", w: 1, ld: "6+", oc: 1 },
      abilities: {
        core: [],
        faction: [],
        datasheet: [
          { name: "Sombre Vigil", description: "Vigilators have the [Feel No Pain 3+] against psychic attacks and [Fights First] in melee." }
        ]
      },
      weapons: {
        ranged: [],
        melee: [
          { name: "Executioner Greatblade", range: "Melee", attacks: "3", skill: "3+", strength: 5, ap: -2, damage: "2", abilities: ["Anti-Psyker 3+", "Devastating Wounds"] }
        ]
      },
      keywords: ["Infantry", "Anathema Psykana", "Vigilators"]
    },
    {
      id: "cust_witchseekers",
      name: "Witchseekers",
      type: "Infantry",
      points: 50,
      squadSize: "4 models",
      stats: { m: "6\"", t: 3, sv: "3+", w: 1, ld: "6+", oc: 1 },
      abilities: {
        core: ["Scouts 6\""],
        faction: [],
        datasheet: [
          { name: "Cleansing Flame", description: "Witchseekers have the [Feel No Pain 3+] against psychic attacks. At the start of your Shooting phase, you can select one enemy unit hit by this unit's Witchseeker Flamers; that unit must take a Battle-shock test." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Witchseeker Flamer", range: "12\"", attacks: "D6", skill: "3+", strength: 4, ap: 0, damage: "1", abilities: ["Torrent", "Ignores Cover"] }
        ],
        melee: [
          { name: "Close Combat Weapon", range: "Melee", attacks: "1", skill: "4+", strength: 3, ap: 0, damage: "1" }
        ]
      },
      keywords: ["Infantry", "Anathema Psykana", "Scouts", "Witchseekers"]
    },
    {
      id: "cust_vertus_praetors",
      name: "Vertus Praetors",
      type: "Infantry",
      points: 150,
      squadSize: "2 models (Max 6 models for 450 pts)",
      stats: { m: "12\"", t: 6, sv: "2+", w: 5, ld: "6+", oc: 1 },
      abilities: {
        core: ["Fly"],
        faction: ["Martial Ka'tah"],
        datasheet: [
          { name: " Dawneagle Jetbike", description: "Enemies charging this unit subtract 2 from their Charge rolls. In a turn in which this unit charged, add +1 to Melee attack characteristics." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Salvo Launcher", range: "24\"", attacks: "1", skill: "2+", strength: 9, ap: -2, damage: "3" },
          { name: "Hurricane Bolter", range: "18\"", attacks: "6", skill: "2+", strength: 4, ap: 0, damage: "1", abilities: ["Rapid Fire 6"] }
        ],
        melee: [
          { name: "Interceptor Lance", range: "Melee", attacks: "4", skill: "2+", strength: 7, ap: -2, damage: "2", abilities: ["Lance"] }
        ]
      },
      keywords: ["Mounted", "Fly", "Vertus Praetors"]
    },
    {
      id: "cust_aquilon",
      name: "Aquilon Terminators",
      type: "Infantry",
      points: 140,
      squadSize: "2 models",
      stats: { m: "5\"", t: 7, sv: "2+", w: 4, ld: "6+", oc: 1 },
      abilities: {
        core: ["Deep Strike"],
        faction: ["Martial Ka'tah"],
        datasheet: [
          { name: "Aurean Aquilon", description: "Each time this unit is set up on the battlefield using Deep Strike, until the end of the turn, ranged attacks by models in this unit have the [Ignores Cover] ability." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Lastrum Storm Bolter", range: "24\"", attacks: "4", skill: "2+", strength: 5, ap: 0, damage: "1" }
        ],
        melee: [
          { name: "Solerite Power Talon", range: "Melee", attacks: "5", skill: "2+", strength: 8, ap: -2, damage: "2", abilities: ["Twin-Linked"] },
          { name: "Solerite Power Gauntlet", range: "Melee", attacks: "4", skill: "3+", strength: 10, ap: -3, damage: "3" }
        ]
      },
      keywords: ["Infantry", "Terminator", "Aquilon"]
    },
    {
      id: "cust_adrasite_guard",
      name: "Custodian Guard with Adrasite Spears",
      type: "Battleline",
      points: 230,
      squadSize: "4 models",
      stats: { m: "6\"", t: 6, sv: "2+", w: 3, ld: "6+", oc: 2 },
      abilities: {
        core: [],
        faction: ["Martial Ka'tah"],
        datasheet: [
          { name: "Disintegration Ray", description: "Critical hits with the Adrasite Spear (Ranged) weapon have the [Devastating Wounds] ability." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Adrasite Spear (Ranged)", range: "18\"", attacks: "1", skill: "2+", strength: 5, ap: -3, damage: "3" }
        ],
        melee: [
          { name: "Adrasite Spear (Melee)", range: "Melee", attacks: "5", skill: "2+", strength: 7, ap: -2, damage: "2" }
        ]
      },
      keywords: ["Infantry", "Battleline", "Custodian Guard"]
    },
    {
      id: "cust_pyrithite_guard",
      name: "Custodian Guard with Pyrithite Spears",
      type: "Battleline",
      points: 230,
      squadSize: "4 models",
      stats: { m: "6\"", t: 6, sv: "2+", w: 3, ld: "6+", oc: 2 },
      abilities: {
        core: [],
        faction: ["Martial Ka'tah"],
        datasheet: [
          { name: "Melta Spear Blast", description: "Ranged attacks with Pyrithite Spears targeting an enemy within 6\" have the [Melta 2] ability." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Pyrithite Spear (Ranged)", range: "12\"", attacks: "1", skill: "2+", strength: 9, ap: -4, damage: "D6" }
        ],
        melee: [
          { name: "Pyrithite Spear (Melee)", range: "Melee", attacks: "5", skill: "2+", strength: 7, ap: -2, damage: "2" }
        ]
      },
      keywords: ["Infantry", "Battleline", "Custodian Guard"]
    },
    {
      id: "cust_land_raider",
      name: "Venerable Land Raider",
      type: "Vehicle",
      points: 240,
      squadSize: "1 model",
      stats: { m: "10\"", t: 12, sv: "2+", w: 16, ld: "6+", oc: 5, invul: "5+" },
      abilities: {
        core: ["Deadly Demise D6"],
        faction: ["Martial Ka'tah"],
        datasheet: [
          { name: "Assault Ramp", description: "Models can disembark from this transport after it has made a Normal move, and can still declare a charge in that turn." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Twin Godhammer Lascannon", range: "48\"", attacks: "2", skill: "2+", strength: 12, ap: -3, damage: "D6+1", abilities: ["Twin-Linked"] },
          { name: "Hunter-killer Missile", range: "48\"", attacks: "1", skill: "2+", strength: 14, ap: -3, damage: "D6", abilities: ["One Shot"] }
        ],
        melee: [
          { name: "Armoured Tracks", range: "Melee", attacks: "4", skill: "4+", strength: 8, ap: 0, damage: "1" }
        ]
      },
      keywords: ["Vehicle", "Transport", "Dedicated Transport", "Land Raider"]
    },
    {
      id: "cust_contemptor",
      name: "Venerable Contemptor Dreadnought",
      type: "Vehicle",
      points: 150,
      squadSize: "1 model",
      stats: { m: "6\"", t: 9, sv: "2+", w: 8, ld: "6+", oc: 3, invul: "5+" },
      abilities: {
        core: ["Deadly Demise 1"],
        faction: ["Martial Ka'tah"],
        datasheet: [
          { name: "Golden Shield", description: "This model has a 5+ Feel No Pain. Once per battle, in the Fight phase, you can re-roll all Wound rolls for attacks made by this model." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Multi-melta", range: "18\"", attacks: "2", skill: "2+", strength: 9, ap: -4, damage: "D6", abilities: ["Melta 2"] },
          { name: "Kheres-pattern Assault Cannon", range: "24\"", attacks: "6", skill: "2+", strength: 6, ap: -1, damage: "1", abilities: ["Devastating Wounds"] }
        ],
        melee: [
          { name: "Contemptor Combat Weapon", range: "Melee", attacks: "5", skill: "2+", strength: 12, ap: -2, damage: "3" }
        ]
      },
      keywords: ["Vehicle", "Walker", "Dreadnought", "Contemptor"]
    },
    {
      id: "cust_telemon",
      name: "Telemon Heavy Dreadnought",
      type: "Vehicle",
      points: 235,
      squadSize: "1 model",
      stats: { m: "6\"", t: 12, sv: "2+", w: 14, ld: "6+", oc: 3, invul: "4+" },
      abilities: {
        core: ["Deadly Demise D3", "Feel No Pain 5+"],
        faction: ["Martial Ka'tah"],
        datasheet: [
          { name: "Telemon Shielding", description: "Each time an attack is allocated to this model, subtract 1 from the Damage characteristic of that attack." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Twin Arachnus Storm Cannon", range: "36\"", attacks: "6", skill: "2+", strength: 8, ap: -2, damage: "3", abilities: ["Twin-Linked"] }
        ],
        melee: [
          { name: "Telemon Fist", range: "Melee", attacks: "4", skill: "2+", strength: 14, ap: -3, damage: "3" }
        ]
      },
      keywords: ["Vehicle", "Walker", "Dreadnought", "Telemon"]
    }
  ]
};
