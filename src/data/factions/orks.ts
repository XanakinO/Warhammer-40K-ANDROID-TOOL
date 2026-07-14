import { Faction } from "../../types";

export const orks: Faction = {
  id: "orks",
  name: "Orks",
  iconName: "Flame",
  description: "Brutal, green-skinned alien hooligans who love nothing more than a good old-fashioned brawl, charging headlong into battle shouting 'Waaagh!'",
  overview: {
    playstyle: "Aggressive, melee-focused horde army that excels at closing the gap and overwhelming opponents with sheer numbers and brute force.",
    strengths: ["Massive melee output", "Durable infantry", "High model counts"],
    weaknesses: ["Poor shooting accuracy", "Slow base movement without Waaagh!"]
  },
  factionRule: {
    name: "Waaagh!",
    description: "Once per battle, at the start of any battle round, you can declare a Waaagh!. When you do, until the end of that battle round, all Orks units in your army receive: +1 Strength, +1 Attack, a 5+ Invulnerable Save, and they can declare a Charge in a turn in which they Advanced."
  },
  detachment: {
    name: "Waaagh! Tribe",
    description: "A colossal gathering of boyz seeking brutal, close-quarters combat.",
    benefit: "Get 'Em Boyz: Each time a model in an Orks unit makes a melee attack, add +1 to the Strength characteristic of that attack.",
    stratagems: [
      {
        name: "Unbridled Carnage",
        cost: 1,
        phase: "Your Fight Phase",
        effect: "Target: One Orks unit. Effect: Melee attacks score [Sustained Hits 1] on unmodified Hit rolls of 5+ instead of 6+."
      },
      {
        name: "'Ard as Nails",
        cost: 1,
        phase: "Opponent's Shooting or Fight Phase",
        effect: "Target: One Orks unit. Effect: Subtract 1 from the Wound roll of incoming attacks targeting this unit."
      },
      {
        name: "Orks Never Beaten",
        cost: 2,
        phase: "Your Fight Phase",
        effect: "Target: One Orks unit that has not fought yet. Effect: Models in this unit can fight on death on a 4+ (or automatically if Waaagh! is active)."
      }
    ],
    enhancements: [
      { name: "Follow Me, Ladz!", points: 20, description: "Add 2\" to the Move characteristic of the model's unit." },
      { name: "Killa Instinct", points: 15, description: "Add 1 to the Wound roll for melee attacks." }
    ]
  },
  units: [
    {
      id: "ork_warboss",
      name: "Warboss",
      type: "Character",
      points: 65,
      squadSize: "1 model",
      stats: { m: "6\"", t: 5, sv: "3+", w: 6, ld: "7+", oc: 1, invul: "5+" },
      abilities: {
        core: ["Leader"],
        faction: ["Waaagh!"],
        datasheet: [
          { name: "Might Is Right", description: "While this model is leading a unit, add +1 to Hit rolls for melee attacks made by models in that unit." },
          { name: "Dead Klever", description: "Each time this model makes a melee attack, subtract 1 from the target's armor save roll." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Kombi-Weapon", range: "12\"", attacks: "1", skill: "5+", strength: 4, ap: 0, damage: "1", abilities: ["Anti-Infantry 4+", "Devastating Wounds"] }
        ],
        melee: [
          { name: "Power Klaw", range: "Melee", attacks: "4", skill: "3+", strength: 9, ap: -2, damage: "2" },
          { name: "Big Choppa", range: "Melee", attacks: "6", skill: "2+", strength: 7, ap: -1, damage: "2" }
        ]
      },
      keywords: ["Infantry", "Character", "Warboss"]
    },
    {
      id: "ork_boyz",
      name: "Boyz",
      type: "Battleline",
      points: 85,
      squadSize: "10 models (Max 20 models for 170 pts)",
      stats: { m: "6\"", t: 5, sv: "5+", w: 1, ld: "7+", oc: 2 },
      abilities: {
        core: [],
        faction: ["Waaagh!"],
        datasheet: [
          { name: "Get 'Em Boyz", description: "You can re-roll Charge rolls made for this unit." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Slugga", range: "12\"", attacks: "1", skill: "5+", strength: 4, ap: 0, damage: "1", abilities: ["Pistol"] },
          { name: "Shoota", range: "18\"", attacks: "2", skill: "5+", strength: 4, ap: 0, damage: "1", abilities: ["Rapid Fire 1"] }
        ],
        melee: [
          { name: "Choppa", range: "Melee", attacks: "3", skill: "3+", strength: 4, ap: -1, damage: "1" },
          { name: "Power Klaw (Boss Nob)", range: "Melee", attacks: "3", skill: "4+", strength: 9, ap: -2, damage: "2" }
        ]
      },
      keywords: ["Infantry", "Battleline", "Boyz"]
    },
    {
      id: "ork_deff_dread",
      name: "Deff Dread",
      type: "Vehicle",
      points: 130,
      squadSize: "1 model",
      stats: { m: "6\"", t: 9, sv: "3+", w: 8, ld: "7+", oc: 3 },
      abilities: {
        core: ["Deadly Demise 1"],
        faction: ["Waaagh!"],
        datasheet: [
          { name: "Dread Klaws", description: "For each Dread Klaw equipped, increase its Melee claw attacks by 1." },
          { name: "Piston-Driven Terror", description: "At the start of the Fight phase, roll a D6 for each enemy unit within Engagement Range. On a 4+, that enemy unit must take a Battle-shock test." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Kustom Mega-Blasta", range: "24\"", attacks: "1", skill: "5+", strength: 9, ap: -2, damage: "D6", abilities: ["Hazardous"] },
          { name: "Rokkit Launcha", range: "24\"", attacks: "D3", skill: "5+", strength: 9, ap: -2, damage: "3", abilities: ["Blast"] }
        ],
        melee: [
          { name: "Dread Klaw", range: "Melee", attacks: "4", skill: "3+", strength: 10, ap: -2, damage: "3" }
        ]
      },
      keywords: ["Vehicle", "Deff Dread", "Walker"]
    },
    {
      id: "ork_painboy",
      name: "Painboy",
      type: "Character",
      points: 70,
      squadSize: "1 model",
      stats: { m: "6\"", t: 5, sv: "5+", w: 4, ld: "7+", oc: 1 },
      abilities: {
        core: ["Leader"],
        faction: ["Waaagh!"],
        datasheet: [
          { name: "Saw Bones", description: "While leading a unit, models in that unit have the 5+ Feel No Pain ability." },
          { name: "Urty Syringe", description: "In the Fight phase, each time this model makes a melee attack targeting a Character, a critical wound inflicts D3 mortal wounds instead of normal damage." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Urty Syringe (Ranged)", range: "12\"", attacks: "1", skill: "5+", strength: 2, ap: 0, damage: "1", abilities: ["Anti-Infantry 2+", "Pistol"] }
        ],
        melee: [
          { name: "Power Klaw", range: "Melee", attacks: "3", skill: "3+", strength: 9, ap: -2, damage: "2" },
          { name: "Urty Syringe (Melee)", range: "Melee", attacks: "4", skill: "3+", strength: 2, ap: 0, damage: "1", abilities: ["Anti-Infantry 2+", "Devastating Wounds"] }
        ]
      },
      keywords: ["Infantry", "Character", "Painboy"]
    },
    {
      id: "ork_meganobz",
      name: "Meganobz",
      type: "Infantry",
      points: 90,
      squadSize: "2 models (Max 6 models for 270 pts)",
      stats: { m: "5\"", t: 6, sv: "2+", w: 3, ld: "7+", oc: 1 },
      abilities: {
        core: [],
        faction: ["Waaagh!"],
        datasheet: [
          { name: "Mega-Armour", description: "Each time this unit makes an Armor save, you can re-roll a save roll of 1." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Kustom Shoota", range: "18\"", attacks: "4", skill: "5+", strength: 4, ap: 0, damage: "1" }
        ],
        melee: [
          { name: "Power Klaw", range: "Melee", attacks: "3", skill: "4+", strength: 9, ap: -2, damage: "2" },
          { name: "Twin Killsaws", range: "Melee", attacks: "3", skill: "4+", strength: 12, ap: -3, damage: "2", abilities: ["Twin-Linked"] }
        ]
      },
      keywords: ["Infantry", "Meganobz", "Squad"]
    },
    {
      id: "ork_ghazghkull",
      name: "Ghazghkull Thraka",
      type: "Character",
      points: 235,
      squadSize: "2 models (Ghazghkull & Makari)",
      stats: { m: "5\"", t: 6, sv: "2+", w: 10, ld: "6+", oc: 3, invul: "4+" },
      abilities: {
        core: ["Leader"],
        faction: ["Waaagh!"],
        datasheet: [
          { name: "Prophet of the Gork and Mork", description: "While leading a unit, add +1 to the Hit and Wound rolls for melee attacks made by models in that unit." },
          { name: "Makari's Standard", description: "While Makari is alive, models in this unit have a 2+ Invulnerable Save against attacks allocated to Makari." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Gork's Klaw (Ranged)", range: "12\"", attacks: "4", skill: "5+", strength: 5, ap: -1, damage: "1" }
        ],
        melee: [
          { name: "Gork's Klaw (Melee)", range: "Melee", attacks: "6", skill: "2+", strength: 14, ap: -4, damage: "4" }
        ]
      },
      keywords: ["Monster", "Character", "Epic Hero", "Warboss", "Ghazghkull"]
    },
    {
      id: "ork_weirdboy",
      name: "Weirdboy",
      type: "Character",
      points: 55,
      squadSize: "1 model",
      stats: { m: "6\"", t: 5, sv: "5+", w: 4, ld: "7+", oc: 1 },
      abilities: {
        core: ["Leader"],
        faction: ["Waaagh!"],
        datasheet: [
          { name: "Da Jump (Psychic)", description: "At the end of your Movement phase, you can teleport this unit to any point on the battlefield that is more than 9\" away from all enemy models." },
          { name: "Warp Spark", description: "While leading a unit, for every 5 models in that unit, add +1 to the Strength characteristic of this model's psychic attacks." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Eeybrawl (Psychic)", range: "24\"", attacks: "D6", skill: "3+", strength: 6, ap: -2, damage: "D3", abilities: ["Psychic", "Hazardous"] }
        ],
        melee: [
          { name: "Weirdboy Staff", range: "Melee", attacks: "3", skill: "3+", strength: 5, ap: -1, damage: "D3", abilities: ["Psychic"] }
        ]
      },
      keywords: ["Infantry", "Character", "Psyker", "Weirdboy"]
    },
    {
      id: "ork_beastboss",
      name: "Beastboss",
      type: "Character",
      points: 80,
      squadSize: "1 model",
      stats: { m: "6\"", t: 6, sv: "3+", w: 6, ld: "7+", oc: 1, invul: "5+" },
      abilities: {
        core: ["Leader"],
        faction: ["Waaagh!"],
        datasheet: [
          { name: "Beast Claws", description: "While leading a unit, add +1 to the Wound rolls for melee attacks made by models in that unit." },
          { name: "Monster Hunter", description: "Melee attacks made by this model have the [Anti-Monster 4+] and [Anti-Vehicle 4+] abilities." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Shoota", range: "18\"", attacks: "2", skill: "5+", strength: 4, ap: 0, damage: "1" }
        ],
        melee: [
          { name: "Beast Klaw", range: "Melee", attacks: "5", skill: "2+", strength: 10, ap: -2, damage: "2" }
        ]
      },
      keywords: ["Infantry", "Character", "Beast Snagga", "Warboss", "Beastboss"]
    },
    {
      id: "ork_mozrog",
      name: "Mozrog Skragbad",
      type: "Character",
      points: 195,
      squadSize: "1 model",
      stats: { m: "10\"", t: 10, sv: "3+", w: 9, ld: "6+", oc: 3, invul: "4+" },
      abilities: {
        core: [],
        faction: ["Waaagh!"],
        datasheet: [
          { name: "Chompa's Maw", description: "Mozrog has the [Feel No Pain 4+] ability." },
          { name: "Great White Squig", description: "Each time Mozrog ends a Charge move, select one enemy unit within engagement range and roll a D6. On a 2-5, it suffers D3 mortal wounds; on a 6, it suffers 3 mortal wounds." }
        ]
      },
      weapons: {
        ranged: [],
        melee: [
          { name: "Gutrippa", range: "Melee", attacks: "6", skill: "2+", strength: 7, ap: -2, damage: "3", abilities: ["Anti-Monster 4+", "Anti-Vehicle 4+", "Devastating Wounds"] },
          { name: "Chompa's Bite", range: "Melee", attacks: "3", skill: "3+", strength: 7, ap: -1, damage: "2", abilities: ["Extra Attacks"] }
        ]
      },
      keywords: ["Mounted", "Character", "Epic Hero", "Beast Snagga", "Mozrog"]
    },
    {
      id: "ork_beastsnagga_boyz",
      name: "Beast Snagga Boyz",
      type: "Battleline",
      points: 105,
      squadSize: "10 models",
      stats: { m: "6\"", t: 5, sv: "5+", w: 1, ld: "7+", oc: 2, invul: "6+" },
      abilities: {
        core: [],
        faction: ["Waaagh!"],
        datasheet: [
          { name: "Monster Hunters", description: "Each time a model in this unit makes a melee attack targeting a Monster or Vehicle, add +1 to the Wound roll." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Slugga", range: "12\"", attacks: "1", skill: "5+", strength: 4, ap: 0, damage: "1", abilities: ["Pistol"] }
        ],
        melee: [
          { name: "Choppa", range: "Melee", attacks: "3", skill: "3+", strength: 5, ap: -1, damage: "1" }
        ]
      },
      keywords: ["Infantry", "Battleline", "Beast Snagga", "Boyz"]
    },
    {
      id: "ork_gretchin",
      name: "Gretchin",
      type: "Battleline",
      points: 40,
      squadSize: "10 Gretchin & 1 Runtherd",
      stats: { m: "6\"", t: 2, sv: "6+", w: 1, ld: "9+", oc: 2 },
      abilities: {
        core: [],
        faction: [],
        datasheet: [
          { name: "Thieving Scavengers", description: "While this unit is within range of an objective marker you control, at the end of your Command phase, roll a D6. On a 4+, you gain 1 Command Point." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Grot Blasta", range: "12\"", attacks: "1", skill: "4+", strength: 3, ap: 0, damage: "1" }
        ],
        melee: [
          { name: "Grot Smacka", range: "Melee", attacks: "1", skill: "5+", strength: 2, ap: 0, damage: "1" }
        ]
      },
      keywords: ["Infantry", "Battleline", "Gretchin"]
    },
    {
      id: "ork_nobz",
      name: "Nobz",
      type: "Infantry",
      points: 105,
      squadSize: "5 models",
      stats: { m: "6\"", t: 5, sv: "4+", w: 2, ld: "7+", oc: 1 },
      abilities: {
        core: [],
        faction: ["Waaagh!"],
        datasheet: [
          { name: "Clout of the Nobz", description: "While a Character is leading this unit, subtract 1 from the Wound roll of incoming attacks targeting this unit." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Slugga", range: "12\"", attacks: "1", skill: "5+", strength: 4, ap: 0, damage: "1", abilities: ["Pistol"] }
        ],
        melee: [
          { name: "Power Klaw", range: "Melee", attacks: "3", skill: "4+", strength: 9, ap: -2, damage: "2" },
          { name: "Big Choppa", range: "Melee", attacks: "4", skill: "3+", strength: 7, ap: -1, damage: "2" }
        ]
      },
      keywords: ["Infantry", "Nobz", "Squad"]
    },
    {
      id: "ork_burna_boyz",
      name: "Burna Boyz",
      type: "Infantry",
      points: 60,
      squadSize: "4 Burna Boyz & 1 Spanner",
      stats: { m: "6\"", t: 5, sv: "5+", w: 1, ld: "7+", oc: 1 },
      abilities: {
        core: [],
        faction: ["Waaagh!"],
        datasheet: [
          { name: "Burn 'Em Out", description: "Ranged attacks made by this unit ignore the benefit of cover." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Burna", range: "12\"", attacks: "D6", skill: "2+", strength: 4, ap: 0, damage: "1", abilities: ["Torrent"] }
        ],
        melee: [
          { name: "Cuttin' Flame", range: "Melee", attacks: "2", skill: "3+", strength: 4, ap: -2, damage: "1" }
        ]
      },
      keywords: ["Infantry", "Burna Boyz"]
    },
    {
      id: "ork_lootas",
      name: "Lootas",
      type: "Infantry",
      points: 50,
      squadSize: "4 Lootas & 1 Spanner",
      stats: { m: "6\"", t: 5, sv: "5+", w: 1, ld: "7+", oc: 1 },
      abilities: {
        core: [],
        faction: ["Waaagh!"],
        datasheet: [
          { name: "Looted Gunz", description: "Each time a model in this unit makes a ranged attack targeting a unit within range of an objective marker, you can re-roll the Hit roll." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Deffgun", range: "48\"", attacks: "D3", skill: "5+", strength: 8, ap: -1, damage: "2", abilities: ["Heavy", "Rapid Fire 1"] }
        ],
        melee: [
          { name: "Choppa", range: "Melee", attacks: "2", skill: "3+", strength: 4, ap: 0, damage: "1" }
        ]
      },
      keywords: ["Infantry", "Lootas"]
    },
    {
      id: "ork_kommandos",
      name: "Kommandos",
      type: "Infantry",
      points: 135,
      squadSize: "10 models",
      stats: { m: "6\"", t: 5, sv: "5+", w: 1, ld: "7+", oc: 1 },
      abilities: {
        core: ["Infiltrators", "Stealth"],
        faction: ["Waaagh!"],
        datasheet: [
          { name: "Sneaky Gits", description: "Each time an attack is made targeting this unit, subtract 1 from the Hit roll. Additionally, this unit can declare a charge in a turn in which it Advanced." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Slugga", range: "12\"", attacks: "1", skill: "5+", strength: 4, ap: 0, damage: "1", abilities: ["Pistol"] }
        ],
        melee: [
          { name: "Choppa", range: "Melee", attacks: "3", skill: "3+", strength: 4, ap: -1, damage: "1" }
        ]
      },
      keywords: ["Infantry", "Stealth", "Infiltrators", "Kommandos"]
    },
    {
      id: "ork_stormboyz",
      name: "Stormboyz",
      type: "Infantry",
      points: 65,
      squadSize: "5 models",
      stats: { m: "12\"", t: 5, sv: "5+", w: 1, ld: "7+", oc: 1 },
      abilities: {
        core: ["Deep Strike", "Fly"],
        faction: ["Waaagh!"],
        datasheet: [
          { name: "Rokkit Pack Jump", description: "This unit can Advance and Charge in the same turn. When it does, roll a D6; on a 1, one model is destroyed." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Slugga", range: "12\"", attacks: "1", skill: "5+", strength: 4, ap: 0, damage: "1", abilities: ["Pistol"] }
        ],
        melee: [
          { name: "Choppa", range: "Melee", attacks: "3", skill: "3+", strength: 4, ap: -1, damage: "1" }
        ]
      },
      keywords: ["Infantry", "Fly", "Stormboyz"]
    },
    {
      id: "ork_flash_gitz",
      name: "Flash Gitz",
      type: "Infantry",
      points: 95,
      squadSize: "5 models",
      stats: { m: "6\"", t: 5, sv: "4+", w: 2, ld: "7+", oc: 1 },
      abilities: {
        core: [],
        faction: ["Waaagh!"],
        datasheet: [
          { name: "Gun-crazy Show-offs", description: "Once per turn, when this unit destroys an enemy unit in your Shooting phase, it can immediately shoot again at another enemy unit." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Snazzgun", range: "24\"", attacks: "3", skill: "4+", strength: 6, ap: -1, damage: "2", abilities: ["Heavy", "Sustained Hits 1"] }
        ],
        melee: [
          { name: "Choppa", range: "Melee", attacks: "3", skill: "3+", strength: 5, ap: 0, damage: "1" }
        ]
      },
      keywords: ["Infantry", "Flash Gitz"]
    },
    {
      id: "ork_squighog_boyz",
      name: "Squighog Boyz",
      type: "Mounted",
      points: 110,
      squadSize: "3 models",
      stats: { m: "10\"", t: 7, sv: "3+", w: 3, ld: "7+", oc: 1 },
      abilities: {
        core: [],
        faction: ["Waaagh!"],
        datasheet: [
          { name: "Squighog Charge", description: "Each time this unit declares a charge, add +2\" to the Charge roll. In melee, its attacks have the [Lance] ability." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Stikka", range: "12\"", attacks: "1", skill: "5+", strength: 5, ap: -1, damage: "1" }
        ],
        melee: [
          { name: "Saddlegit Weapons", range: "Melee", attacks: "3", skill: "3+", strength: 6, ap: -1, damage: "2" },
          { name: "Squighog Bite", range: "Melee", attacks: "2", skill: "4+", strength: 7, ap: -1, damage: "2", abilities: ["Extra Attacks"] }
        ]
      },
      keywords: ["Mounted", "Beast Snagga", "Squighog Boyz"]
    },
    {
      id: "ork_trukk",
      name: "Trukk",
      type: "Vehicle",
      points: 65,
      squadSize: "1 model",
      stats: { m: "12\"", t: 8, sv: "4+", w: 10, ld: "7+", oc: 2 },
      abilities: {
        core: ["Deadly Demise D3"],
        faction: ["Waaagh!"],
        datasheet: [
          { name: "Trukk Boyz", description: "Models can disembark from this transport after it has made a Normal move, but they cannot declare a charge in that same turn unless Waaagh! is active." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Big Shoota", range: "36\"", attacks: "3", skill: "5+", strength: 5, ap: 0, damage: "1" }
        ],
        melee: [
          { name: "Wreckin' Ball", range: "Melee", attacks: "3", skill: "5+", strength: 8, ap: -1, damage: "2" }
        ]
      },
      keywords: ["Vehicle", "Transport", "Trukk"]
    },
    {
      id: "ork_battlewagon",
      name: "Battlewagon",
      type: "Vehicle",
      points: 160,
      squadSize: "1 model",
      stats: { m: "10\"", t: 10, sv: "3+", w: 16, ld: "7+", oc: 5 },
      abilities: {
        core: ["Deadly Demise D6"],
        faction: ["Waaagh!"],
        datasheet: [
          { name: "Mobile Fortress", description: "Models inside can fire out using the Firing Deck 12 rule. Additionally, enemies charging this vehicle subtract 2 from their Charge rolls." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Kannon (Frag)", range: "36\"", attacks: "D6", skill: "5+", strength: 5, ap: 0, damage: "1", abilities: ["Blast"] },
          { name: "Kannon (Shell)", range: "36\"", attacks: "1", skill: "5+", strength: 8, ap: -2, damage: "D6" }
        ],
        melee: [
          { name: "Grabbin' Klaw", range: "Melee", attacks: "2", skill: "4+", strength: 8, ap: -1, damage: "2" }
        ]
      },
      keywords: ["Vehicle", "Transport", "Titanic", "Battlewagon"]
    },
    {
      id: "ork_killa_kans",
      name: "Killa Kans",
      type: "Vehicle",
      points: 150,
      squadSize: "3 models",
      stats: { m: "6\"", t: 6, sv: "3+", w: 5, ld: "7+", oc: 2 },
      abilities: {
        core: ["Deadly Demise 1"],
        faction: ["Waaagh!"],
        datasheet: [
          { name: "Grot Riggers", description: "At the start of your Command phase, this unit regains 1 lost wound." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Rokkit Launcha", range: "24\"", attacks: "1", skill: "5+", strength: 9, ap: -2, damage: "3" }
        ],
        melee: [
          { name: "Kan Klaw", range: "Melee", attacks: "3", skill: "3+", strength: 8, ap: -2, damage: "2" }
        ]
      },
      keywords: ["Vehicle", "Walker", "Killa Kans"]
    },
    {
      id: "ork_mekboy",
      name: "Mek",
      type: "Character",
      points: 45,
      squadSize: "1 model",
      stats: { m: "6\"", t: 5, sv: "4+", w: 4, ld: "7+", oc: 1 },
      abilities: {
        core: ["Leader"],
        faction: ["Waaagh!"],
        datasheet: [
          { name: "Mekaniak", description: "At the end of your Movement phase, select one friendly Orks Vehicle model within 3\". That model regains up to D3 lost wounds." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Kustom Mega-blasta", range: "24\"", attacks: "1", skill: "5+", strength: 9, ap: -2, damage: "D6", abilities: ["Hazardous"] }
        ],
        melee: [
          { name: "Power Klaw", range: "Melee", attacks: "3", skill: "3+", strength: 9, ap: -2, damage: "2" }
        ]
      },
      keywords: ["Infantry", "Character", "Mek"]
    },
    {
      id: "ork_dakkajet",
      name: "Dakkajet",
      type: "Vehicle",
      points: 135,
      squadSize: "1 model",
      stats: { m: "20\"", t: 8, sv: "4+", w: 10, ld: "7+", oc: 0 },
      abilities: {
        core: ["Deadly Demise D3", "Fly"],
        faction: ["Waaagh!"],
        datasheet: [
          { name: "Supa-Shoota Barrage", description: "Each time this model makes a ranged attack, add 3 to the number of attacks made for its Supa-Shootas." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Supa-Shoota", range: "24\"", attacks: "6", skill: "4+", strength: 6, ap: 0, damage: "1", abilities: ["Sustained Hits 1"] }
        ],
        melee: [
          { name: "Armoured Hull", range: "Melee", attacks: "3", skill: "4+", strength: 6, ap: 0, damage: "1" }
        ]
      },
      keywords: ["Vehicle", "Fly", "Dakkajet"]
    },
    {
      id: "ork_megatrakk_scrapjet",
      name: "Megatrakk Scrapjet",
      type: "Vehicle",
      points: 90,
      squadSize: "1 model",
      stats: { m: "10\"", t: 8, sv: "4+", w: 8, ld: "7+", oc: 2 },
      abilities: {
        core: ["Deadly Demise 1"],
        faction: ["Waaagh!"],
        datasheet: [
          { name: "Turbo-boost", description: "This model can Advance and Shoot without penalty." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Twin Big Shoota", range: "36\"", attacks: "6", skill: "5+", strength: 5, ap: 0, damage: "1" },
          { name: "Rokkit Cannon", range: "24\"", attacks: "2D3", skill: "5+", strength: 9, ap: -2, damage: "3", abilities: ["Blast"] }
        ],
        melee: [
          { name: "Drill-ram", range: "Melee", attacks: "3", skill: "3+", strength: 8, ap: -1, damage: "2" }
        ]
      },
      keywords: ["Vehicle", "Megatrakk Scrapjet"]
    },
    {
      id: "ork_big_mek",
      name: "Big Mek in Mega Armour",
      type: "Character",
      points: 100,
      squadSize: "1 model",
      stats: { m: "5\"", t: 6, sv: "2+", w: 6, ld: "7+", oc: 1 },
      abilities: {
        core: ["Leader"],
        faction: ["Waaagh!"],
        datasheet: [
          { name: "Tellyport Mess-up", description: "While leading a unit, models in that unit have a 4+ Invulnerable Save against ranged attacks." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Kustom Mega-blasta", range: "24\"", attacks: "1", skill: "5+", strength: 9, ap: -2, damage: "D6", abilities: ["Hazardous"] }
        ],
        melee: [
          { name: "Power Klaw", range: "Melee", attacks: "4", skill: "4+", strength: 9, ap: -2, damage: "2" }
        ]
      },
      keywords: ["Infantry", "Character", "Big Mek", "Mega Armour"]
    },
    {
      id: "ork_snaggas",
      name: "Snagga Boyz",
      type: "Infantry",
      points: 100,
      squadSize: "10 models",
      stats: { m: "6\"", t: 5, sv: "5+", w: 1, ld: "7+", oc: 2 },
      abilities: {
        core: [],
        faction: ["Waaagh!"],
        datasheet: [
          { name: "Beast Snagga Zeal", description: "Each time this unit makes a Charge move, add +1 to the Strength of its melee attacks for the rest of the turn." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Slugga", range: "12\"", attacks: "1", skill: "5+", strength: 4, ap: 0, damage: "1", abilities: ["Pistol"] }
        ],
        melee: [
          { name: "Choppa", range: "Melee", attacks: "3", skill: "3+", strength: 5, ap: -1, damage: "1" }
        ]
      },
      keywords: ["Infantry", "Beast Snagga", "Boyz"]
    },
    {
      id: "ork_grot_tank",
      name: "Grot Tank",
      type: "Vehicle",
      points: 50,
      squadSize: "1 model",
      stats: { m: "8\"", t: 6, sv: "4+", w: 5, ld: "8+", oc: 1 },
      abilities: {
        core: [],
        faction: [],
        datasheet: [
          { name: "Grot Gunners", description: "When this model shoots, you can re-roll a Hit roll of 1." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Kannon", range: "36\"", attacks: "1", skill: "4+", strength: 8, ap: -2, damage: "3" }
        ],
        melee: [
          { name: "Armoured Hull", range: "Melee", attacks: "2", skill: "4+", strength: 5, ap: 0, damage: "1" }
        ]
      },
      keywords: ["Vehicle", "Grot", "Tank"]
    }
  ]
};
