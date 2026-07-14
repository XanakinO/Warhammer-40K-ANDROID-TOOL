import { Faction } from "../../types";

export const spaceMarines: Faction = {
  id: "space_marines",
  name: "Space Marines (Adeptus Astartes)",
  iconName: "Shield",
  description: "The ultimate defenders of humanity, genetic super-soldiers armored in power armor and armed with deadly bolt weapons.",
  overview: {
    playstyle: "Versatile and balanced, capable of adapting to any combat situation with superior armor and flexible weaponry.",
    strengths: ["Highly durable infantry", "Excellent all-around shooting", "Strong character buffs"],
    weaknesses: ["Expensive in points", "Limited mobility compared to specialized armies"]
  },
  factionRule: {
    name: "Oath of Moment",
    description: "At the start of your Command phase, select one unit from your opponent's army. Until the start of your next Command phase, each time a model from your army makes an attack that targets that selected enemy unit, you can re-roll the Hit roll."
  },
  detachment: {
    name: "Gladius Task Force",
    description: "A highly adaptable force trained to react seamlessly to any battlefield threat.",
    benefit: "Combat Doctrines: In your Command phase, you can select one of the following Combat Doctrines to be active until your next Command phase. Each doctrine can only be used once per battle:\n- Devastator Doctrine: Your units can Advance and Shoot.\n- Tactical Doctrine: Your units can Fall Back and Shoot/Charge.\n- Assault Doctrine: Your units can Advance and Charge.",
    enhancements: [
      { name: "Artificer Armour", points: 10, description: "The model has a 2+ Save characteristic." },
      { name: "Bolter Discipline", points: 25, description: "While the model is leading a unit, ranged weapons equipped by models in that unit have the [Sustained Hits 1] ability." }
    ],
    stratagems: [
      {
        name: "Armor of Contempt",
        cost: 1,
        phase: "Opponent's Shooting or Fight Phase",
        effect: "Target: One Adeptus Astartes unit. Effect: Until the end of the phase, worsen the AP characteristic of incoming attacks by 1."
      },
      {
        name: "Honor the Chapter",
        cost: 1,
        phase: "Your Fight Phase",
        effect: "Target: One Adeptus Astartes unit. Effect: Melee weapons get +1 AP. If in Assault Doctrine, also get +1 Attack."
      },
      {
        name: "Adaptive Strategy",
        cost: 1,
        phase: "Any Phase",
        effect: "Target: One Adeptus Astartes unit. Effect: Choose one Combat Doctrine. Until the end of the turn, that doctrine is active for that unit instead of the army's active doctrine."
      }
    ]
  },
  units: [
    {
      id: "sm_captain",
      name: "Captain in Terminator Armour",
      type: "Character",
      points: 95,
      squadSize: "1 model",
      stats: { m: "5\"", t: 5, sv: "2+", w: 6, ld: "6+", oc: 1, invul: "4+" },
      abilities: {
        core: ["Leader", "Deep Strike"],
        faction: ["Oath of Moment"],
        datasheet: [
          { name: "Rites of Battle", description: "Once per battle round, one unit within 12\" can be targeted with a Stratagem for 0 CP, even if another unit has already been targeted with that stratagem." },
          { name: "The Imperium's Sword", description: "Once per battle, when this model makes a Charge move, until the end of the turn, add +2 to the Strength and Attacks of its melee weapons." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Storm Bolter", range: "24\"", attacks: "4", skill: "2+", strength: 4, ap: 0, damage: "1", abilities: ["Rapid Fire 2"] }
        ],
        melee: [
          { name: "Relic Weapon", range: "Melee", attacks: "6", skill: "2+", strength: 5, ap: -2, damage: "2" },
          { name: "Power Fist", range: "Melee", attacks: "5", skill: "3+", strength: 8, ap: -2, damage: "2" }
        ]
      },
      keywords: ["Infantry", "Character", "Terminator", "Captain"]
    },
    {
      id: "sm_intercessors",
      name: "Intercessor Squad",
      type: "Battleline",
      points: 80,
      squadSize: "5 models (Max 10 models for 160 pts)",
      stats: { m: "6\"", t: 4, sv: "3+", w: 2, ld: "6+", oc: 2 },
      abilities: {
        core: [],
        faction: ["Oath of Moment"],
        datasheet: [
          { name: "Objective Secured", description: "If you control an objective marker with this unit, it remains under your control even if this unit moves away, until an opponent controls it." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Bolt Rifle", range: "24\"", attacks: "2", skill: "3+", strength: 4, ap: -1, damage: "1", abilities: ["Assault", "Heavy"] }
        ],
        melee: [
          { name: "Close Combat Weapon", range: "Melee", attacks: "3", skill: "3+", strength: 4, ap: 0, damage: "1" },
          { name: "Astartes Grenade Launcher", range: "24\"", attacks: "1", skill: "3+", strength: 9, ap: -2, damage: "D3" }
        ]
      },
      keywords: ["Infantry", "Battleline", "Grenades", "Tacticus", "Intercessors"]
    },
    {
      id: "sm_terminators",
      name: "Terminator Squad",
      type: "Infantry",
      points: 185,
      squadSize: "5 models",
      stats: { m: "5\"", t: 5, sv: "2+", w: 3, ld: "6+", oc: 1, invul: "4+" },
      abilities: {
        core: ["Deep Strike"],
        faction: ["Oath of Moment"],
        datasheet: [
          { name: "Fury of the First", description: "Each time a model in this unit makes an attack, add +1 to the Hit roll if the target is your Oath of Moment target." },
          { name: "Teleport Homer", description: "Once per battle, you can set up this unit using the Rapid Ingress Stratagem for 0 CP, placed within 3\" of its teleport homer token." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Storm Bolter", range: "24\"", attacks: "4", skill: "3+", strength: 4, ap: 0, damage: "1", abilities: ["Rapid Fire 2"] },
          { name: "Assault Cannon", range: "24\"", attacks: "6", skill: "3+", strength: 6, ap: 0, damage: "1", abilities: ["Devastating Wounds"] }
        ],
        melee: [
          { name: "Power Fist", range: "Melee", attacks: "3", skill: "3+", strength: 8, ap: -2, damage: "2" },
          { name: "Chainfist", range: "Melee", attacks: "3", skill: "4+", strength: 8, ap: -2, damage: "2", abilities: ["Anti-Vehicle 3+"] }
        ]
      },
      keywords: ["Infantry", "Terminator", "Squad"]
    },
    {
      id: "sm_dreadnought",
      name: "Redemptor Dreadnought",
      type: "Vehicle",
      points: 210,
      squadSize: "1 model",
      stats: { m: "6\"", t: 9, sv: "2+", w: 12, ld: "6+", oc: 4 },
      abilities: {
        core: ["Deadly Demise D3"],
        faction: ["Oath of Moment"],
        datasheet: [
          { name: "Duty Eternal", description: "Each time an attack is allocated to this model, subtract 1 from the Damage characteristic of that attack (to a minimum of 1)." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Macro Plasma Incinerator (Standard)", range: "36\"", attacks: "D6", skill: "3+", strength: 8, ap: -3, damage: "2", abilities: ["Blast"] },
          { name: "Macro Plasma Incinerator (Supercharge)", range: "36\"", attacks: "D6", skill: "3+", strength: 9, ap: -3, damage: "3", abilities: ["Blast", "Hazardous"] },
          { name: "Onslaught Heavy Gatling Cannon", range: "24\"", attacks: "8", skill: "3+", strength: 5, ap: -1, damage: "1", abilities: ["Devastating Wounds"] }
        ],
        melee: [
          { name: "Redemptor Fist", range: "Melee", attacks: "5", skill: "3+", strength: 12, ap: -2, damage: "3" }
        ]
      },
      keywords: ["Vehicle", "Walker", "Dreadnought", "Redemptor"]
    },
    {
      id: "sm_hellblasters",
      name: "Hellblaster Squad",
      type: "Infantry",
      points: 115,
      squadSize: "5 models",
      stats: { m: "6\"", t: 4, sv: "3+", w: 2, ld: "6+", oc: 1 },
      abilities: {
        core: [],
        faction: ["Oath of Moment"],
        datasheet: [
          { name: "For the Emperor!", description: "Each time a model in this unit is destroyed, roll a D6. On a 3+, do not remove it from play. It can shoot with its ranged weapons as if it were your Shooting phase, and is then removed from play." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Plasma Incinerator (Standard)", range: "24\"", attacks: "2", skill: "3+", strength: 7, ap: -2, damage: "1", abilities: ["Assault"] },
          { name: "Plasma Incinerator (Supercharge)", range: "24\"", attacks: "2", skill: "3+", strength: 8, ap: -3, damage: "2", abilities: ["Assault", "Hazardous"] }
        ],
        melee: [
          { name: "Close Combat Weapon", range: "Melee", attacks: "3", skill: "3+", strength: 4, ap: 0, damage: "1" }
        ]
      },
      keywords: ["Infantry", "Tacticus", "Hellblasters", "Squad"]
    },
    {
      id: "sm_land_raider",
      name: "Land Raider",
      type: "Vehicle",
      points: 240,
      squadSize: "1 model",
      stats: { m: "10\"", t: 12, sv: "2+", w: 16, ld: "6+", oc: 5 },
      abilities: {
        core: ["Deadly Demise D6"],
        faction: ["Oath of Moment"],
        datasheet: [
          { name: "Assault Ramp", description: "Models can declare a charge in a turn in which they disembarked from this transport, even if this transport made a Normal move or Advanced this turn." },
          { name: "Power of the Machine Spirit", description: "Once per turn, in your opponent's Charge phase, when an enemy unit declares a charge targeting this model, this model can shoot with one of its weapons at that enemy unit." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Godhammer Lascannon", range: "48\"", attacks: "2", skill: "3+", strength: 12, ap: -3, damage: "D6+1" },
          { name: "Twin Heavy Bolter", range: "36\"", attacks: "3", skill: "3+", strength: 5, ap: -1, damage: "2", abilities: ["Twin-Linked"] },
          { name: "Hunter-Killer Missile", range: "48\"", attacks: "1", skill: "2+", strength: 14, ap: -3, damage: "D6", abilities: ["One Shot"] }
        ],
        melee: [
          { name: "Armoured Tracks", range: "Melee", attacks: "6", skill: "4+", strength: 8, ap: 0, damage: "1" }
        ]
      },
      keywords: ["Vehicle", "Transport", "Titanic", "Land Raider"]
    },
    {
      id: "sm_lieutenant",
      name: "Primaris Lieutenant",
      type: "Character",
      points: 65,
      squadSize: "1 model",
      stats: { m: "6\"", t: 4, sv: "3+", w: 4, ld: "6+", oc: 1, invul: "4+" },
      abilities: {
        core: ["Leader"],
        faction: ["Oath of Moment"],
        datasheet: [
          { name: "Tactical Precision", description: "While this model is leading a unit, weapons equipped by models in that unit have the [Lethal Hits] ability." },
          { name: "Target Acquisition", description: "This unit can Fall Back and still Shoot or Charge in the same turn." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Master-crafted Bolt Rifle", range: "24\"", attacks: "2", skill: "2+", strength: 4, ap: -1, damage: "2" }
        ],
        melee: [
          { name: "Power Weapon", range: "Melee", attacks: "5", skill: "2+", strength: 5, ap: -2, damage: "1" }
        ]
      },
      keywords: ["Infantry", "Character", "Lieutenant"]
    },
    {
      id: "sm_chaplain",
      name: "Primaris Chaplain",
      type: "Character",
      points: 60,
      squadSize: "1 model",
      stats: { m: "6\"", t: 4, sv: "3+", w: 4, ld: "5+", oc: 1, invul: "4+" },
      abilities: {
        core: ["Leader"],
        faction: ["Oath of Moment"],
        datasheet: [
          { name: "Litany of Hate", description: "While this model is leading a unit, each time a model in that unit makes a melee attack, add +1 to the Wound roll." },
          { name: "Spiritual Leader", description: "Once per turn, when a friendly Adeptus Astartes unit within 12\" fails a Battle-shock test, you can re-roll that test." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Absolvor Pistol", range: "18\"", attacks: "1", skill: "3+", strength: 5, ap: -1, damage: "1" }
        ],
        melee: [
          { name: "Crozius Arcanum", range: "Melee", attacks: "5", skill: "2+", strength: 6, ap: -1, damage: "2" }
        ]
      },
      keywords: ["Infantry", "Character", "Chaplain"]
    },
    {
      id: "sm_tigurius",
      name: "Chief Librarian Tigurius",
      type: "Character",
      points: 75,
      squadSize: "1 model",
      stats: { m: "6\"", t: 4, sv: "3+", w: 5, ld: "6+", oc: 1, invul: "4+" },
      abilities: {
        core: ["Leader"],
        faction: ["Oath of Moment"],
        datasheet: [
          { name: "Guided by Prescience", description: "While this model is leading a unit, models in that unit have a 4+ Feel No Pain against psychic attacks and mortal wounds." },
          { name: "Hood of Hellfire", description: "Once per battle round, when this model makes a ranged psychic attack, you can re-roll the Hit, Wound, or Damage roll." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Storm of the Emperor's Wrath (Psychic)", range: "24\"", attacks: "D6", skill: "2+", strength: 6, ap: -2, damage: "2", abilities: ["Blast", "Psychic"] }
        ],
        melee: [
          { name: "Rod of Tigurius", range: "Melee", attacks: "4", skill: "2+", strength: 7, ap: -2, damage: "D3", abilities: ["Psychic"] }
        ]
      },
      keywords: ["Infantry", "Character", "Psyker", "Librarian", "Epic Hero", "Tigurius"]
    },
    {
      id: "sm_calgar",
      name: "Marneus Calgar",
      type: "Character",
      points: 185,
      squadSize: "3 models (Marneus Calgar & 2 Victrix Guard)",
      stats: { m: "6\"", t: 6, sv: "2+", w: 6, ld: "6+", oc: 2, invul: "4+" },
      abilities: {
        core: ["Leader"],
        faction: ["Oath of Moment"],
        datasheet: [
          { name: "Master Tactician", description: "At the start of your Command phase, if this model is on the battlefield, you gain 1 Command Point." },
          { name: "Victrix Guard Bodyguards", description: "While this unit contains one or more Victrix Guard models, Marneus Calgar has the [Feel No Pain 4+] ability." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Gauntlets of Ultramar (Ranged)", range: "18\"", attacks: "4", skill: "2+", strength: 4, ap: -1, damage: "2" }
        ],
        melee: [
          { name: "Gauntlets of Ultramar (Melee)", range: "Melee", attacks: "6", skill: "2+", strength: 8, ap: -3, damage: "3" }
        ]
      },
      keywords: ["Infantry", "Character", "Epic Hero", "Victrix Guard", "Marneus Calgar"]
    },
    {
      id: "sm_guilliman",
      name: "Roboute Guilliman",
      type: "Character",
      points: 350,
      squadSize: "1 model",
      stats: { m: "8\"", t: 9, sv: "2+", w: 10, ld: "5+", oc: 4, invul: "3+" },
      abilities: {
        core: ["Deep Strike"],
        faction: ["Oath of Moment"],
        datasheet: [
          { name: "Author of the Codex", description: "Once per battle round, you can target one friendly Adeptus Astartes unit within 12\" of this model with a Stratagem for 0 CP." },
          { name: "Armor of Fate", description: "The first time this model is destroyed, roll a D6 at the end of the phase. On a 3+, set this model back up with 6 wounds remaining." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Hand of Dominion (Ranged)", range: "24\"", attacks: "3", skill: "2+", strength: 6, ap: -1, damage: "2", abilities: ["Rapid Fire 3"] }
        ],
        melee: [
          { name: "The Emperor's Sword", range: "Melee", attacks: "14", skill: "2+", strength: 8, ap: -4, damage: "2", abilities: ["Devastating Wounds"] },
          { name: "Hand of Dominion (Melee)", range: "Melee", attacks: "7", skill: "2+", strength: 14, ap: -4, damage: "4" }
        ]
      },
      keywords: ["Monster", "Character", "Epic Hero", "Primarch", "Roboute Guilliman"]
    },
    {
      id: "sm_assault_intercessors",
      name: "Assault Intercessor Squad",
      type: "Battleline",
      points: 75,
      squadSize: "5 models",
      stats: { m: "6\"", t: 4, sv: "3+", w: 2, ld: "6+", oc: 2 },
      abilities: {
        core: [],
        faction: ["Oath of Moment"],
        datasheet: [
          { name: "Shock Assault", description: "Each time a model in this unit makes a melee attack, re-roll a Wound roll of 1. If this unit is within range of an objective marker your opponent controls, re-roll all Wound rolls instead." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Heavy Bolt Pistol", range: "18\"", attacks: "1", skill: "3+", strength: 4, ap: -1, damage: "1", abilities: ["Pistol"] }
        ],
        melee: [
          { name: "Astartes Chainsword", range: "Melee", attacks: "4", skill: "3+", strength: 4, ap: -1, damage: "1" }
        ]
      },
      keywords: ["Infantry", "Battleline", "Grenades", "Tacticus", "Assault Intercessors"]
    },
    {
      id: "sm_heavy_intercessors",
      name: "Heavy Intercessor Squad",
      type: "Battleline",
      points: 100,
      squadSize: "5 models",
      stats: { m: "5\"", t: 6, sv: "3+", w: 3, ld: "6+", oc: 2 },
      abilities: {
        core: [],
        faction: ["Oath of Moment"],
        datasheet: [
          { name: "Unholy Fortitude", description: "While this unit is within range of an objective marker you control, each time an attack is allocated to a model in this unit, add 1 to the Armor save." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Heavy Bolt Rifle", range: "30\"", attacks: "2", skill: "3+", strength: 5, ap: -1, damage: "1", abilities: ["Heavy"] }
        ],
        melee: [
          { name: "Close Combat Weapon", range: "Melee", attacks: "3", skill: "3+", strength: 4, ap: 0, damage: "1" }
        ]
      },
      keywords: ["Infantry", "Battleline", "Gravis", "Heavy Intercessors"]
    },
    {
      id: "sm_infiltrators",
      name: "Infiltrator Squad",
      type: "Infantry",
      points: 100,
      squadSize: "5 models",
      stats: { m: "6\"", t: 4, sv: "3+", w: 2, ld: "6+", oc: 1 },
      abilities: {
        core: ["Infiltrators", "Scouts 6\""],
        faction: ["Oath of Moment"],
        datasheet: [
          { name: "Omni-scramblers", description: "Enemy models cannot be set up on the battlefield within 12\" of this unit using the Deep Strike ability." },
          { name: "Helix Gauntlet", description: "While this unit contains a model with a Helix Gauntlet, the first time an attack is allocated to this unit in each phase, damage of that attack is reduced to 0." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Marksman Bolt Carbine", range: "24\"", attacks: "1", skill: "3+", strength: 4, ap: 0, damage: "1", abilities: ["Heavy", "Lethal Hits"] }
        ],
        melee: [
          { name: "Close Combat Weapon", range: "Melee", attacks: "3", skill: "3+", strength: 4, ap: 0, damage: "1" }
        ]
      },
      keywords: ["Infantry", "Phobos", "Infiltrators"]
    },
    {
      id: "sm_scouts",
      name: "Scout Squad",
      type: "Infantry",
      points: 65,
      squadSize: "5 models",
      stats: { m: "6\"", t: 4, sv: "4+", w: 1, ld: "7+", oc: 1 },
      abilities: {
        core: ["Infiltrators", "Scouts 6\""],
        faction: ["Oath of Moment"],
        datasheet: [
          { name: "Guerrilla Tactics", description: "At the end of your opponent's turn, if this unit is more than 6\" from all enemy models, you can remove it from the battlefield and place it in Strategic Reserves." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Astartes Shotgun", range: "12\"", attacks: "2", skill: "3+", strength: 4, ap: 0, damage: "1", abilities: ["Assault"] },
          { name: "Scout Sniper Rifle", range: "36\"", attacks: "1", skill: "3+", strength: 4, ap: -2, damage: "2", abilities: ["Heavy", "Precision"] }
        ],
        melee: [
          { name: "Combat Knife", range: "Melee", attacks: "3", skill: "3+", strength: 4, ap: 0, damage: "1" }
        ]
      },
      keywords: ["Infantry", "Scout", "Squad"]
    },
    {
      id: "sm_inceptors",
      name: "Inceptor Squad",
      type: "Infantry",
      points: 130,
      squadSize: "3 models",
      stats: { m: "10\"", t: 6, sv: "3+", w: 3, ld: "6+", oc: 1 },
      abilities: {
        core: ["Deep Strike", "Fly"],
        faction: ["Oath of Moment"],
        datasheet: [
          { name: "Meteoric Descent", description: "When setting up this unit using its Deep Strike ability, it can be set up anywhere that is more than 3\" from all enemy models." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Assault Bolters", range: "18\"", attacks: "6", skill: "3+", strength: 5, ap: -1, damage: "1", abilities: ["Pistol", "Sustained Hits 1"] }
        ],
        melee: [
          { name: "Close Combat Weapon", range: "Melee", attacks: "3", skill: "3+", strength: 4, ap: 0, damage: "1" }
        ]
      },
      keywords: ["Infantry", "Fly", "Jump Pack", "Gravis", "Inceptors"]
    },
    {
      id: "sm_eradicators",
      name: "Eradicator Squad",
      type: "Infantry",
      points: 95,
      squadSize: "3 models",
      stats: { m: "5\"", t: 6, sv: "3+", w: 3, ld: "6+", oc: 1 },
      abilities: {
        core: [],
        faction: ["Oath of Moment"],
        datasheet: [
          { name: "Total Obliteration", description: "Each time a model in this unit makes a ranged attack targeting a Monster or Vehicle, you can re-roll the Hit, Wound, and Damage roll." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Melta Rifle", range: "18\"", attacks: "1", skill: "3+", strength: 9, ap: -4, damage: "D6", abilities: ["Melta 2", "Heavy"] }
        ],
        melee: [
          { name: "Close Combat Weapon", range: "Melee", attacks: "3", skill: "3+", strength: 4, ap: 0, damage: "1" }
        ]
      },
      keywords: ["Infantry", "Gravis", "Eradicators"]
    },
    {
      id: "sm_aggressors",
      name: "Aggressor Squad",
      type: "Infantry",
      points: 120,
      squadSize: "3 models",
      stats: { m: "5\"", t: 6, sv: "3+", w: 3, ld: "6+", oc: 1 },
      abilities: {
        core: [],
        faction: ["Oath of Moment"],
        datasheet: [
          { name: "Close-quarters Fire-fight", description: "While this unit is within 6\" of any enemy units, models in this unit gain +1 to their ranged attacks characteristic." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Auto Boltstorm Gauntlets", range: "18\"", attacks: "3", skill: "3+", strength: 4, ap: 0, damage: "1", abilities: ["Twin-Linked", "Assault"] },
          { name: "Fragstorm Grenade Launcher", range: "18\"", attacks: "D6", skill: "3+", strength: 4, ap: 0, damage: "1", abilities: ["Blast"] }
        ],
        melee: [
          { name: "Twin Power Fists", range: "Melee", attacks: "4", skill: "3+", strength: 8, ap: -2, damage: "2", abilities: ["Twin-Linked"] }
        ]
      },
      keywords: ["Infantry", "Gravis", "Aggressors"]
    },
    {
      id: "sm_repulsor",
      name: "Repulsor",
      type: "Vehicle",
      points: 190,
      squadSize: "1 model",
      stats: { m: "10\"", t: 12, sv: "3+", w: 16, ld: "6+", oc: 5 },
      abilities: {
        core: ["Deadly Demise D6"],
        faction: ["Oath of Moment"],
        datasheet: [
          { name: "Emergency Embarkation", description: "Once per turn, in your opponent's Charge phase, when an enemy unit declares a charge targeting a friendly Adeptus Astartes Infantry unit within 3\" of this transport, that friendly unit can embark inside this transport instead of taking a Stand and Shoot or Overwatch." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Twin Lascannon", range: "48\"", attacks: "1", skill: "3+", strength: 12, ap: -3, damage: "D6", abilities: ["Twin-Linked"] },
          { name: "Heavy Stubber", range: "36\"", attacks: "3", skill: "3+", strength: 4, ap: 0, damage: "1" }
        ],
        melee: [
          { name: "Armoured Hull", range: "Melee", attacks: "3", skill: "4+", strength: 8, ap: 0, damage: "1" }
        ]
      },
      keywords: ["Vehicle", "Transport", "Dedicated Transport", "Repulsor"]
    },
    {
      id: "sm_gladiator_lancer",
      name: "Gladiator Lancer",
      type: "Vehicle",
      points: 160,
      squadSize: "1 model",
      stats: { m: "10\"", t: 10, sv: "3+", w: 12, ld: "6+", oc: 3 },
      abilities: {
        core: ["Deadly Demise D3"],
        faction: ["Oath of Moment"],
        datasheet: [
          { name: "Lancer Optics", description: "Each time this model is selected to shoot, you can re-roll one Hit roll, one Wound roll, and one Damage roll made for its Lancer Laser Destroyer." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Lancer Laser Destroyer", range: "72\"", attacks: "2", skill: "3+", strength: 14, ap: -4, damage: "D6+3" }
        ],
        melee: [
          { name: "Armoured Hull", range: "Melee", attacks: "3", skill: "4+", strength: 8, ap: 0, damage: "1" }
        ]
      },
      keywords: ["Vehicle", "Gladiator", "Lancer"]
    },
    {
      id: "sm_ballistus",
      name: "Ballistus Dreadnought",
      type: "Vehicle",
      points: 140,
      squadSize: "1 model",
      stats: { m: "8\"", t: 10, sv: "3+", w: 12, ld: "6+", oc: 3 },
      abilities: {
        core: ["Deadly Demise D3"],
        faction: ["Oath of Moment"],
        datasheet: [
          { name: "Ballistus Strength", description: "Re-roll Hit rolls of 1 against Vehicles or Monsters." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Ballistus Lascannon", range: "48\"", attacks: "2", skill: "3+", strength: 12, ap: -3, damage: "D6+1" },
          { name: "Ballistus Missile Launcher", range: "48\"", attacks: "D6", skill: "3+", strength: 9, ap: -2, damage: "D6" }
        ],
        melee: [
          { name: "Armoured Feet", range: "Melee", attacks: "3", skill: "4+", strength: 8, ap: 0, damage: "1" }
        ]
      },
      keywords: ["Vehicle", "Walker", "Dreadnought"]
    },
    {
      id: "sm_vanguard_veterans",
      name: "Vanguard Veteran Squad",
      type: "Infantry",
      points: 105,
      squadSize: "5 models",
      stats: { m: "12\"", t: 4, sv: "3+", w: 2, ld: "6+", oc: 1 },
      abilities: {
        core: ["Fly", "Deep Strike"],
        faction: ["Oath of Moment"],
        datasheet: [
          { name: "Heroic Intervention", description: "Each time this unit makes a melee attack, add +1 to the Wound roll." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Plasma Pistol", range: "12\"", attacks: "1", skill: "3+", strength: 7, ap: -2, damage: "1", abilities: ["Pistol"] }
        ],
        melee: [
          { name: "Power Weapon", range: "Melee", attacks: "4", skill: "3+", strength: 5, ap: -2, damage: "1" }
        ]
      },
      keywords: ["Infantry", "Fly", "Jump Pack", "Vanguard Veterans"]
    },
    {
      id: "sm_storm_speeder",
      name: "Storm Speeder Thunderstrike",
      type: "Vehicle",
      points: 160,
      squadSize: "1 model",
      stats: { m: "12\"", t: 9, sv: "3+", w: 10, ld: "6+", oc: 3 },
      abilities: {
        core: ["Deadly Demise D3", "Fly"],
        faction: ["Oath of Moment"],
        datasheet: [
          { name: "Thunderstrike", description: "Each time this model makes a ranged attack against a Monster or Vehicle, add +1 to the Wound roll." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Thunderstrike Las-talon", range: "36\"", attacks: "2", skill: "3+", strength: 10, ap: -3, damage: "D6+1" },
          { name: "Stormstrike Missile Launcher", range: "36\"", attacks: "1", skill: "3+", strength: 12, ap: -3, damage: "D6+2" }
        ],
        melee: [
          { name: "Armoured Hull", range: "Melee", attacks: "3", skill: "4+", strength: 6, ap: 0, damage: "1" }
        ]
      },
      keywords: ["Vehicle", "Fly", "Storm Speeder"]
    },
    {
      id: "sm_eliminators",
      name: "Eliminator Squad",
      type: "Infantry",
      points: 85,
      squadSize: "3 models",
      stats: { m: "6\"", t: 4, sv: "3+", w: 2, ld: "6+", oc: 1 },
      abilities: {
        core: ["Stealth"],
        faction: ["Oath of Moment"],
        datasheet: [
          { name: "Reposition", description: "After this unit makes an attack, it can make a Normal move of up to 6\"." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Las Fusil", range: "36\"", attacks: "1", skill: "3+", strength: 10, ap: -3, damage: "3", abilities: ["Precision"] }
        ],
        melee: [
          { name: "Close Combat Weapon", range: "Melee", attacks: "2", skill: "3+", strength: 4, ap: 0, damage: "1" }
        ]
      },
      keywords: ["Infantry", "Phobos", "Eliminators"]
    },
    {
      id: "sm_infernus",
      name: "Infernus Squad",
      type: "Infantry",
      points: 80,
      squadSize: "5 models",
      stats: { m: "6\"", t: 4, sv: "3+", w: 2, ld: "6+", oc: 1 },
      abilities: {
        core: [],
        faction: ["Oath of Moment"],
        datasheet: [
          { name: "Pyreblaster", description: "Each time this unit makes a ranged attack, you can re-roll the Wound roll if the target is within 12\"." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Pyreblaster", range: "12\"", attacks: "D6", skill: "3+", strength: 5, ap: -1, damage: "1", abilities: ["Torrent"] }
        ],
        melee: [
          { name: "Close Combat Weapon", range: "Melee", attacks: "2", skill: "3+", strength: 4, ap: 0, damage: "1" }
        ]
      },
      keywords: ["Infantry", "Tacticus", "Infernus Squad"]
    }
  ]
};
