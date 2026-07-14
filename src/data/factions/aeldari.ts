import { Faction } from "../../types";

export const aeldari: Faction = {
  id: "aeldari",
  name: "Aeldari (Eldar)",
  iconName: "Sparkles",
  description: "An ancient, highly advanced, dying race whose specialized speed, psychic prowess, and mastery of Fate allow them to strike from shadows.",
  overview: {
    playstyle: "Highly mobile, glass-cannon playstyle relying on psychic mastery, fate manipulation, and specialized elite units.",
    strengths: ["Superior speed", "Fate dice manipulation", "Highly specialized elite units"],
    weaknesses: ["Fragile units", "High skill floor"]
  },
  factionRule: {
    name: "Strands of Fate",
    description: "At the start of the battle, roll 6 Fate Dice (D6s). Keep these dice in a Fate pool. Once per phase, you can substitute one of these pre-rolled Fate Dice for any hit, wound, save, advance, charge, or battle-shock roll made by a model in your army."
  },
  detachment: {
    name: "Battle Host",
    description: "A fast, elite strike force using combined arms and lightning strikes to dissect enemy formations.",
    benefit: "Unparalleled Foresight: Each time an Aeldari unit is selected to shoot or fight, you can re-roll one Hit roll and you can re-roll one Wound roll.",
    stratagems: [
      {
        name: "Phantasm",
        cost: 1,
        phase: "End of Opponent's Movement Phase",
        effect: "Target: One Aeldari unit. Effect: This unit can make a Normal move of up to 6\" immediately. It cannot end within engagement range of enemy units."
      },
      {
        name: "Feigned Retreat",
        cost: 1,
        phase: "Your Movement Phase",
        effect: "Target: One Aeldari unit. Effect: This unit can Fall Back and still shoot and/or charge in this turn."
      },
      {
        name: "Fire and Fade",
        cost: 2,
        phase: "Your Shooting Phase",
        effect: "Target: One Aeldari unit that has shot. Effect: This unit can immediately make a Normal move of up to 6\" but cannot charge."
      }
    ],
    enhancements: [
      { name: "Fate's Messenger", points: 15, description: "Once per battle, you can re-roll a hit roll, wound roll, or damage roll." },
      { name: "Reader of the Runes", points: 25, description: "Add 1 to the Leadership characteristic of the model's unit." }
    ]
  },
  units: [
    {
      id: "ael_farseer",
      name: "Farseer",
      type: "Character",
      points: 80,
      squadSize: "1 model",
      stats: { m: "6\"", t: 3, sv: "6+", w: 4, ld: "6+", oc: 1, invul: "4+" },
      abilities: {
        core: ["Leader"],
        faction: ["Strands of Fate"],
        datasheet: [
          { name: "Branching Fates", description: "Once per turn, when you use a Fate die to substitute a roll for a unit within 12\" of this model, you can treat that Fate die as a 6, regardless of its original value." },
          { name: "Fortune (Psychic)", description: "In your Command phase, select one friendly Aeldari unit within 12\". Until the start of your next Command phase, each time an attack targets that unit, subtract 1 from the Wound roll." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Singing Spear (Ranged)", range: "12\"", attacks: "1", skill: "2+", strength: 9, ap: 0, damage: "3", abilities: ["Psychic", "Assault"] }
        ],
        melee: [
          { name: "Witchblade", range: "Melee", attacks: "3", skill: "2+", strength: 3, ap: 0, damage: "2", abilities: ["Anti-Monster 2+", "Anti-Vehicle 2+"] },
          { name: "Singing Spear (Melee)", range: "Melee", attacks: "2", skill: "2+", strength: 3, ap: 0, damage: "3", abilities: ["Psychic"] }
        ]
      },
      keywords: ["Infantry", "Character", "Psiker", "Farseer"]
    },
    {
      id: "ael:guardians",
      name: "Guardian Defenders",
      type: "Battleline",
      points: 110,
      squadSize: "10 Defenders & 1 Support Platform",
      stats: { m: "6\"", t: 3, sv: "4+", w: 1, ld: "7+", oc: 2 },
      abilities: {
        core: [],
        faction: ["Strands of Fate"],
        datasheet: [
          { name: "Defenders of Destiny", description: "While this unit is within range of an objective marker you control, at the end of your Command phase, you gain 1 Fate Die." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Shuriken Catapult", range: "18\"", attacks: "2", skill: "3+", strength: 4, ap: -1, damage: "1", abilities: ["Assault"] },
          { name: "Bright Lance (Platform)", range: "36\"", attacks: "1", skill: "3+", strength: 12, ap: -3, damage: "D6+1" }
        ],
        melee: [
          { name: "Close Combat Weapon", range: "Melee", attacks: "1", skill: "3+", strength: 3, ap: 0, damage: "1" }
        ]
      },
      keywords: ["Infantry", "Battleline", "Guardians"]
    },
    {
      id: "ael_wraithlord",
      name: "Wraithlord",
      type: "Monster",
      points: 160,
      squadSize: "1 model",
      stats: { m: "8\"", t: 11, sv: "3+", w: 10, ld: "6+", oc: 3 },
      abilities: {
        core: ["Deadly Demise 1"],
        faction: ["Strands of Fate"],
        datasheet: [
          { name: "Grave Wrath", description: "Each time this model destroys an enemy unit, you can return 1 of your discarded Fate Dice back to your Fate pool as a 6." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Shuriken Cannon", range: "24\"", attacks: "3", skill: "3+", strength: 6, ap: -1, damage: "2", abilities: ["Sustained Hits 1"] }
        ],
        melee: [
          { name: "Ghostglaive", range: "Melee", attacks: "4", skill: "3+", strength: 10, ap: -2, damage: "D6" },
          { name: "Wraith Fists", range: "Melee", attacks: "4", skill: "3+", strength: 8, ap: 0, damage: "2" }
        ]
      },
      keywords: ["Monster", "Wraithlord"]
    },
    {
      id: "ael_autarch",
      name: "Autarch Wayleaper",
      type: "Character",
      points: 115,
      squadSize: "1 model",
      stats: { m: "14\"", t: 4, sv: "2+", w: 5, ld: "6+", oc: 1, invul: "4+" },
      abilities: {
        core: ["Lone Operative", "Fly", "Deep Strike"],
        faction: ["Strands of Fate"],
        datasheet: [
          { name: "Path of command", description: "If this model is your Warlord, at the start of your Command phase, you gain 1 Command Point." },
          { name: "Superb strategist", description: "Once per battle round, you can target one unit within 12\" of this model with a Stratagem for 0 CP." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Reaper Launcher", range: "36\"", attacks: "1", skill: "2+", strength: 8, ap: -2, damage: "2" },
          { name: "Fusion Pistol", range: "6\"", attacks: "1", skill: "2+", strength: 9, ap: -4, damage: "D6", abilities: ["Melta 2", "Pistol"] }
        ],
        melee: [
          { name: "Star Glaive", range: "Melee", attacks: "5", skill: "2+", strength: 6, ap: -2, damage: "2" }
        ]
      },
      keywords: ["Infantry", "Character", "Warlord", "Fly", "Jump Pack", "Autarch"]
    },
    {
      id: "ael_fire_prism",
      name: "Fire Prism",
      type: "Vehicle",
      points: 180,
      squadSize: "1 model",
      stats: { m: "10\"", t: 9, sv: "3+", w: 12, ld: "7+", oc: 3, invul: "6+" },
      abilities: {
        core: ["Deadly Demise D3"],
        faction: ["Strands of Fate"],
        datasheet: [
          { name: "Prism Link", description: "Each time this model is selected to shoot, you can select one other friendly Fire Prism. That friendly model can be treated as the firing model for line of sight and range calculations for this model's Prism Cannon." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Prism Cannon (Dispersed)", range: "60\"", attacks: "2D6", skill: "3+", strength: 6, ap: -1, damage: "2", abilities: ["Blast"] },
          { name: "Prism Cannon (Focused)", range: "60\"", attacks: "2", skill: "3+", strength: 18, ap: -4, damage: "6" }
        ],
        melee: [
          { name: "Wraithbone Hull", range: "Melee", attacks: "3", skill: "4+", strength: 6, ap: 0, damage: "1" }
        ]
      },
      keywords: ["Vehicle", "Fly", "Fire Prism"]
    },
    {
      id: "ael_spiritseer",
      name: "Spiritseer",
      type: "Character",
      points: 65,
      squadSize: "1 model",
      stats: { m: "6\"", t: 3, sv: "6+", w: 4, ld: "6+", oc: 1, invul: "4+" },
      abilities: {
        core: ["Leader"],
        faction: ["Strands of Fate"],
        datasheet: [
          { name: "Tears of Isha", description: "While this model is leading a unit, in your Command phase, you can return one destroyed model to that unit." },
          { name: "Spirit Mark", description: "While leading a unit, each time a model in that unit makes an attack, add +1 to the Hit roll." }
        ]
      },
      weapons: {
        ranged: [],
        melee: [
          { name: "Witchstaff", range: "Melee", attacks: "3", skill: "3+", strength: 3, ap: -1, damage: "D3", abilities: ["Anti-Monster 2+", "Anti-Vehicle 2+"] }
        ]
      },
      keywords: ["Infantry", "Character", "Psyker", "Spiritseer"]
    },
    {
      id: "ael_avatar_khaine",
      name: "Avatar of Khaine",
      type: "Character",
      points: 335,
      squadSize: "1 model",
      stats: { m: "10\"", t: 12, sv: "2+", w: 14, ld: "6+", oc: 4, invul: "4+" },
      abilities: {
        core: [],
        faction: ["Strands of Fate"],
        datasheet: [
          { name: "Khaine's Wrath", description: "This model has the [Feel No Pain 5+] ability. Additionally, halve the Damage characteristic of attacks allocated to this model." },
          { name: "Awakened God", description: "While a friendly Aeldari unit is within 6\" of this model, add +1 to the Wound rolls for attacks made by that unit." }
        ]
      },
      weapons: {
        ranged: [
          { name: "The Wailing Doom (Ranged)", range: "12\"", attacks: "1", skill: "2+", strength: 12, ap: -4, damage: "D6+2", abilities: ["Melta 2"] }
        ],
        melee: [
          { name: "The Wailing Doom (Sweep)", range: "Melee", attacks: "14", skill: "2+", strength: 7, ap: -2, damage: "2" },
          { name: "The Wailing Doom (Strike)", range: "Melee", attacks: "7", skill: "2+", strength: 14, ap: -4, damage: "D6+2" }
        ]
      },
      keywords: ["Monster", "Character", "Epic Hero", "Avatar of Khaine"]
    },
    {
      id: "ael_eldrad",
      name: "Eldrad Ulthran",
      type: "Character",
      points: 110,
      squadSize: "1 model",
      stats: { m: "6\"", t: 3, sv: "6+", w: 5, ld: "5+", oc: 1, invul: "3+" },
      abilities: {
        core: ["Leader"],
        faction: ["Strands of Fate"],
        datasheet: [
          { name: "Foretold Path", description: "At the start of the battle, you gain 3 Fate Dice instead of 0 from your Fate Pool." },
          { name: "Mind War (Psychic)", description: "Once per turn, in your Shooting phase, select one enemy Character model within 18\". Roll a D6; on a 2-5, that enemy suffers 3 mortal wounds. On a 6, it suffers D6 mortal wounds." }
        ]
      },
      weapons: {
        ranged: [],
        melee: [
          { name: "Staff of Ulthamar", range: "Melee", attacks: "4", skill: "2+", strength: 3, ap: -2, damage: "2", abilities: ["Psychic"] }
        ]
      },
      keywords: ["Infantry", "Character", "Epic Hero", "Psyker", "Farseer", "Eldrad"]
    },
    {
      id: "ael_karandras",
      name: "Karandras",
      type: "Character",
      points: 100,
      squadSize: "1 model",
      stats: { m: "7\"", t: 4, sv: "3+", w: 5, ld: "6+", oc: 1, invul: "4+" },
      abilities: {
        core: ["Leader", "Infiltrators", "Stealth"],
        faction: ["Strands of Fate"],
        datasheet: [
          { name: "Shadow Hunter", description: "While leading a unit, models in that unit have the [Fights First] ability." },
          { name: "The Scorpion's Bite", description: "In the Fight phase, each time this model makes a melee attack, on a critical hit, the target suffers D3 mortal wounds in addition to normal damage." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Mandiblasters", range: "3\"", attacks: "4", skill: "2+", strength: 4, ap: 0, damage: "1" }
        ],
        melee: [
          { name: "The Scorpion's Claw", range: "Melee", attacks: "6", skill: "2+", strength: 8, ap: -3, damage: "2", abilities: ["Sustained Hits 1"] }
        ]
      },
      keywords: ["Infantry", "Character", "Epic Hero", "Phoenix Lord", "Karandras"]
    },
    {
      id: "ael_storm_guardians",
      name: "Storm Guardians",
      type: "Battleline",
      points: 115,
      squadSize: "10 Guardians",
      stats: { m: "6\"", t: 3, sv: "5+", w: 1, ld: "7+", oc: 2 },
      abilities: {
        core: [],
        faction: ["Strands of Fate"],
        datasheet: [
          { name: "Controlled Chaos", description: "If you control an objective marker with this unit, it remains under your control even if this unit moves away, until an opponent controls it." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Guardian Fusion Gun", range: "12\"", attacks: "1", skill: "3+", strength: 9, ap: -4, damage: "D6", abilities: ["Melta 2"] },
          { name: "Flamer", range: "12\"", attacks: "D6", skill: "3+", strength: 4, ap: 0, damage: "1", abilities: ["Torrent"] }
        ],
        melee: [
          { name: "Guardian Blade", range: "Melee", attacks: "2", skill: "3+", strength: 3, ap: -1, damage: "1" }
        ]
      },
      keywords: ["Infantry", "Battleline", "Storm Guardians"]
    },
    {
      id: "ael_rangers",
      name: "Rangers",
      type: "Infantry",
      points: 55,
      squadSize: "5 models",
      stats: { m: "7\"", t: 3, sv: "5+", w: 1, ld: "7+", oc: 1 },
      abilities: {
        core: ["Infiltrators", "Stealth"],
        faction: ["Strands of Fate"],
        datasheet: [
          { name: "Pathfinders", description: "Each time an attack is made targeting this unit, subtract 1 from the Hit roll. Additionally, this unit can make a Normal move of up to 6\" in your opponent's Charge phase." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Ranger Long Rifle", range: "36\"", attacks: "1", skill: "3+", strength: 4, ap: -1, damage: "2", abilities: ["Heavy", "Precision"] }
        ],
        melee: [
          { name: "Close Combat Weapon", range: "Melee", attacks: "1", skill: "3+", strength: 3, ap: 0, damage: "1" }
        ]
      },
      keywords: ["Infantry", "Stealth", "Rangers"]
    },
    {
      id: "ael_dire_avengers",
      name: "Dire Avengers",
      type: "Infantry",
      points: 70,
      squadSize: "5 models",
      stats: { m: "7\"", t: 3, sv: "4+", w: 1, ld: "6+", oc: 1 },
      abilities: {
        core: [],
        faction: ["Strands of Fate"],
        datasheet: [
          { name: "Defense Tactics", description: "This unit can fire Overwatch for 0 CP and hits on a 5+ (instead of 6+)." },
          { name: "Avenging Strikes", description: "While this unit is under its starting strength, each time a model makes an attack, add +1 to the Hit roll." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Avenger Shuriken Catapult", range: "18\"", attacks: "3", skill: "3+", strength: 4, ap: -1, damage: "1", abilities: ["Assault"] }
        ],
        melee: [
          { name: "Close Combat Weapon", range: "Melee", attacks: "1", skill: "3+", strength: 3, ap: 0, damage: "1" }
        ]
      },
      keywords: ["Infantry", "Aspect Warrior", "Dire Avengers"]
    },
    {
      id: "ael_howling_banshees",
      name: "Howling Banshees",
      type: "Infantry",
      points: 70,
      squadSize: "5 models",
      stats: { m: "8\"", t: 3, sv: "4+", w: 1, ld: "6+", oc: 1 },
      abilities: {
        core: [],
        faction: ["Strands of Fate"],
        datasheet: [
          { name: "Acrobatic Charge", description: "This unit can Advance and Charge in the same turn. Add +1 to Charge rolls made for this unit." },
          { name: "Screaming Banshee Mask", description: "Enemy units within engagement range of this unit cannot perform Stand and Shoot or Overwatch." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Shuriken Pistol", range: "12\"", attacks: "1", skill: "3+", strength: 4, ap: -1, damage: "1", abilities: ["Pistol"] }
        ],
        melee: [
          { name: "Banshee Blade", range: "Melee", attacks: "4", skill: "3\"", strength: 4, ap: -3, damage: "1", abilities: ["Fights First"] }
        ]
      },
      keywords: ["Infantry", "Aspect Warrior", "Howling Banshees"]
    },
    {
      id: "ael_striking_scorpions",
      name: "Striking Scorpions",
      type: "Infantry",
      points: 65,
      squadSize: "5 models",
      stats: { m: "7\"", t: 3, sv: "3+", w: 1, ld: "6+", oc: 1 },
      abilities: {
        core: ["Infiltrators", "Stealth"],
        faction: ["Strands of Fate"],
        datasheet: [
          { name: "Mandiblasters", description: "At the start of the Fight phase, roll a D6 for each enemy unit within engagement range. On a 4+, that enemy unit suffers 1 mortal wound." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Shuriken Pistol", range: "12\"", attacks: "1", skill: "3+", strength: 4, ap: -1, damage: "1", abilities: ["Pistol"] }
        ],
        melee: [
          { name: "Scorpion Chainsword", range: "Melee", attacks: "4", skill: "3+", strength: 4, ap: -1, damage: "1", abilities: ["Sustained Hits 1"] }
        ]
      },
      keywords: ["Infantry", "Aspect Warrior", "Striking Scorpions"]
    },
    {
      id: "ael_fire_dragons",
      name: "Fire Dragons",
      type: "Infantry",
      points: 85,
      squadSize: "5 models",
      stats: { m: "7\"", t: 3, sv: "4+", w: 1, ld: "6+", oc: 1 },
      abilities: {
        core: [],
        faction: ["Strands of Fate"],
        datasheet: [
          { name: "Tank Hunters", description: "Each time a model in this unit makes a ranged attack targeting a Monster or Vehicle, re-roll the Wound roll." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Dragon Fusion Gun", range: "12\"", attacks: "1", skill: "3+", strength: 9, ap: -4, damage: "D6", abilities: ["Melta 3"] }
        ],
        melee: [
          { name: "Close Combat Weapon", range: "Melee", attacks: "1", skill: "3+", strength: 3, ap: 0, damage: "1" }
        ]
      },
      keywords: ["Infantry", "Aspect Warrior", "Fire Dragons"]
    },
    {
      id: "ael_warp_spiders",
      name: "Warp Spiders",
      type: "Infantry",
      points: 115,
      squadSize: "5 models",
      stats: { m: "12\"", t: 3, sv: "3+", w: 1, ld: "6+", oc: 1 },
      abilities: {
        core: ["Deep Strike", "Fly", "Flickerjump"],
        faction: ["Strands of Fate"],
        datasheet: [
          { name: "Warp Jump Generator", description: "This unit can Advance up to 12\" automatically instead of rolling a D6." },
          { name: "Flickerjump", description: "Once per turn, in your opponent's Command phase, if this unit is on the battlefield, you can remove it and place it in Strategic Reserves." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Deathspinner", range: "12\"", attacks: "D6", skill: "3+", strength: 6, ap: 0, damage: "1", abilities: ["Torrent", "Devastating Wounds"] }
        ],
        melee: [
          { name: "Close Combat Weapon", range: "Melee", attacks: "1", skill: "3+", strength: 3, ap: 0, damage: "1" }
        ]
      },
      keywords: ["Infantry", "Aspect Warrior", "Fly", "Warp Spiders"]
    },
    {
      id: "ael_swooping_hawks",
      name: "Swooping Hawks",
      type: "Infantry",
      points: 75,
      squadSize: "5 models",
      stats: { m: "14\"", t: 3, sv: "4+", w: 1, ld: "6+", oc: 1 },
      abilities: {
        core: ["Deep Strike", "Fly"],
        faction: ["Strands of Fate"],
        datasheet: [
          { name: "Skyleap", description: "At the end of your turn, if this unit is more than 6\" from all enemy models, you can remove it from the battlefield and place it in Strategic Reserves." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Lasblaster", range: "24\"", attacks: "4", skill: "3+", strength: 3, ap: 0, damage: "1", abilities: ["Assault"] }
        ],
        melee: [
          { name: "Close Combat Weapon", range: "Melee", attacks: "1", skill: "3+", strength: 3, ap: 0, damage: "1" }
        ]
      },
      keywords: ["Infantry", "Aspect Warrior", "Fly", "Swooping Hawks"]
    },
    {
      id: "ael_wraithguard",
      name: "Wraithguard",
      type: "Infantry",
      points: 170,
      squadSize: "5 models",
      stats: { m: "5\"", t: 7, sv: "3+", w: 3, ld: "6+", oc: 1 },
      abilities: {
        core: [],
        faction: ["Strands of Fate"],
        datasheet: [
          { name: "Warplock Armaments", description: "Each time an attack is allocated to a model in this unit, subtract 1 from the Damage characteristic of that attack." },
          { name: "Wraith-construct", description: "Once per phase, in your opponent's Shooting phase, after an enemy unit has shot at this unit, this unit can shoot back at that enemy unit." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Wraithcannon", range: "18\"", attacks: "1", skill: "4+", strength: 10, ap: -4, damage: "D6", abilities: ["Devastating Wounds"] }
        ],
        melee: [
          { name: "Fists", range: "Melee", attacks: "3", skill: "4+", strength: 5, ap: 0, damage: "1" }
        ]
      },
      keywords: ["Infantry", "Wraithguard", "Squad"]
    },
    {
      id: "ael_wraithblades",
      name: "Wraithblades",
      type: "Infantry",
      points: 170,
      squadSize: "5 models",
      stats: { m: "5\"", t: 7, sv: "3+", w: 3, ld: "6+", oc: 1 },
      abilities: {
        core: [],
        faction: ["Strands of Fate"],
        datasheet: [
          { name: "Dispersion Shields", description: "Models in this unit equipped with a Dispersion Shield have a 4+ Invulnerable Save." },
          { name: "Ghostglaive Fury", description: "Melee attacks by this unit have the [Fights First] ability." }
        ]
      },
      weapons: {
        ranged: [],
        melee: [
          { name: "Ghostswords", range: "Melee", attacks: "5", skill: "3+", strength: 6, ap: -3, damage: "1", abilities: ["Sustained Hits 1"] },
          { name: "Ghostaxe", range: "Melee", attacks: "3", skill: "4+", strength: 8, ap: -2, damage: "2" }
        ]
      },
      keywords: ["Infantry", "Wraithblades", "Squad"]
    },
    {
      id: "ael_wave_serpent",
      name: "Wave Serpent",
      type: "Vehicle",
      points: 120,
      squadSize: "1 model",
      stats: { m: "12\"", t: 9, sv: "3+", w: 12, ld: "7+", oc: 3, invul: "5+" },
      abilities: {
        core: ["Deadly Demise D3", "Fly"],
        faction: ["Strands of Fate"],
        datasheet: [
          { name: "Serpent Shield", description: "Once per battle, in your Shooting phase, you can discharge this transport's energy shield. If you do, select one enemy unit within 12\"; that enemy unit must take a Battle-shock test and suffers D3 mortal wounds." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Twin Shuriken Cannon", range: "24\"", attacks: "3", skill: "3+", strength: 6, ap: -1, damage: "2", abilities: ["Twin-Linked", "Sustained Hits 1"] }
        ],
        melee: [
          { name: "Wraithbone Hull", range: "Melee", attacks: "3", skill: "4+", strength: 6, ap: 0, damage: "1" }
        ]
      },
      keywords: ["Vehicle", "Transport", "Fly", "Wave Serpent"]
    },
    {
      id: "ael_harlequins",
      name: "Harlequin Troupe",
      type: "Infantry",
      points: 75,
      squadSize: "5 models",
      stats: { m: "8\"", t: 3, sv: "4+", w: 1, ld: "6+", oc: 1, invul: "4+" },
      abilities: {
        core: ["Deep Strike"],
        faction: ["Strands of Fate"],
        datasheet: [
          { name: "Cegorach's Jest", description: "This unit can Advance and Charge in the same turn. Models in this unit have the [Fights First] ability." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Shuriken Pistol", range: "12\"", attacks: "1", skill: "3+", strength: 4, ap: -1, damage: "1", abilities: ["Pistol"] }
        ],
        melee: [
          { name: "Harlequin's Blade", range: "Melee", attacks: "4", skill: "3+", strength: 3, ap: -1, damage: "1", abilities: ["Sustained Hits 1"] }
        ]
      },
      keywords: ["Infantry", "Harlequins", "Troupe"]
    },
    {
      id: "ael_seer_council",
      name: "Seer Council",
      type: "Infantry",
      points: 100,
      squadSize: "3 models",
      stats: { m: "6\"", t: 3, sv: "6+", w: 3, ld: "6+", oc: 1, invul: "4+" },
      abilities: {
        core: ["Leader"],
        faction: ["Strands of Fate"],
        datasheet: [
          { name: "Warlocks' Might", description: "While leading a unit, models in that unit have +1 to Wound rolls in melee." }
        ]
      },
      weapons: {
        ranged: [],
        melee: [
          { name: "Witchblade", range: "Melee", attacks: "3", skill: "3+", strength: 3, ap: 0, damage: "2", abilities: ["Psychic"] }
        ]
      },
      keywords: ["Infantry", "Character", "Psyker", "Warlock"]
    },
    {
      id: "ael_vyper",
      name: "Vyper",
      type: "Vehicle",
      points: 85,
      squadSize: "1 model",
      stats: { m: "16\"", t: 6, sv: "4+", w: 6, ld: "7+", oc: 2, invul: "5+" },
      abilities: {
        core: ["Fly"],
        faction: ["Strands of Fate"],
        datasheet: [
          { name: "Swift Strike", description: "This unit can Fall Back and Shoot in the same turn." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Shuriken Cannon", range: "24\"", attacks: "3", skill: "3+", strength: 6, ap: -1, damage: "2", abilities: ["Sustained Hits 1"] }
        ],
        melee: [
          { name: "Wraithbone Hull", range: "Melee", attacks: "2", skill: "4+", strength: 5, ap: 0, damage: "1" }
        ]
      },
      keywords: ["Vehicle", "Fly", "Vyper"]
    },
    {
      id: "ael_shadow_spectres",
      name: "Shadow Spectres",
      type: "Infantry",
      points: 100,
      squadSize: "5 models",
      stats: { m: "8\"", t: 3, sv: "3+", w: 1, ld: "6+", oc: 1 },
      abilities: {
        core: ["Fly"],
        faction: ["Strands of Fate"],
        datasheet: [
          { name: "Prism Rifles", description: "Ranged attacks with Prism Rifles have the [Precision] ability." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Prism Rifle", range: "24\"", attacks: "2", skill: "3+", strength: 5, ap: -1, damage: "2" }
        ],
        melee: [
          { name: "Close Combat Weapon", range: "Melee", attacks: "1", skill: "3+", strength: 3, ap: 0, damage: "1" }
        ]
      },
      keywords: ["Infantry", "Aspect Warrior", "Fly", "Shadow Spectres"]
    }
  ]
};
