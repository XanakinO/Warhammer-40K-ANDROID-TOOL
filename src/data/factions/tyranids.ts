import { Faction } from "../../types";

export const tyranids: Faction = {
  id: "tyranids",
  name: "Tyranids",
  iconName: "Bug",
  description: "An infinite, voracious biological swarm controlled by a single Hive Mind, seeking to consume all organic life in the galaxy.",
  overview: {
    playstyle: "Aggressive and swarm-oriented, relying on overwhelming numbers, monstrous bio-weapons, and controlling the battlefield through Synapse.",
    strengths: ["Massive unit counts", "Terrifying psychic presence", "Adaptability"],
    weaknesses: ["Fragile small units", "Dependent on Synapse range"]
  },
  factionRule: {
    name: "Synapse & Shadow in the Warp",
    description: "Synapse: If a Tyranids unit is within 6\" of a Synapse unit (or 12\" of a Synapse leader), it is in Synapse Range. Such units roll 3D6 instead of 2D6 for Battle-shock tests. Shadow in the Warp: Once per battle, in either player's Command phase, you can trigger a Shadow in the Warp. When you do, every enemy unit on the battlefield must take a Battle-shock test immediately."
  },
  detachment: {
    name: "Invasion Fleet",
    description: "A fast, hyper-evolutionary swarm adapted to overrun planetary defenses.",
    benefit: "Hyper-Adaptations: At the start of the first battle round, select one of the following adaptations to apply to all Tyranids units in your army:\n- Swarming Instincts: Attacks get [Sustained Hits 1] against Infantry/Swarms.\n- Hyper-Aggression: Attacks get [Lethal Hits] against Monsters/Vehicles.\n- Hive Predators: Melee attacks get [Precision] on Critical Wounds against Characters.",
    stratagems: [
      {
        name: "Rapid Regeneration",
        cost: 1,
        phase: "Any Phase",
        effect: "Target: One Tyranids unit. Effect: Models in this unit gain a 6+ Feel No Pain. If the unit is within Synapse range, they gain a 5+ Feel No Pain instead."
      },
      {
        name: "Adrenal Surge",
        cost: 2,
        phase: "Your Fight Phase",
        effect: "Target: Up to two Tyranids units in Synapse range, or one Tyranids unit. Effect: Critical hits are scored on a 5+ instead of 6+."
      },
      {
        name: "Death Leap",
        cost: 1,
        phase: "Opponent's Charge Phase",
        effect: "Target: One Tyranids unit with Vanguard Invader keyword. Effect: This unit can perform a Heroic Intervention for 0 CP."
      }
    ],
    enhancements: [
      { name: "Adaptive Biology", points: 20, description: "The model has a 5+ Feel No Pain." },
      { name: "Synaptic Lynchpin", points: 25, description: "The model's Synapse range is increased by 6\"." }
    ]
  },
  units: [
    {
      id: "tyr_prime",
      name: "Winged Tyranid Prime",
      type: "Character",
      points: 65,
      squadSize: "1 model",
      stats: { m: "12\"", t: 5, sv: "4+", w: 6, ld: "7+", oc: 1 },
      abilities: {
        core: ["Leader", "Deep Strike"],
        faction: ["Synapse"],
        datasheet: [
          { name: "Alpha Warrior", description: "While this model is leading a unit, models in that unit have the Sustained Hits 1 ability on their melee weapons." },
          { name: "Death From Above", description: "This unit can charge in a turn in which it was set up on the battlefield using the Deep Strike ability." }
        ]
      },
      weapons: {
        ranged: [],
        melee: [
          { name: "Prime Talons", range: "Melee", attacks: "6", skill: "2+", strength: 6, ap: -2, damage: "2", abilities: ["Sustained Hits 1"] }
        ]
      },
      keywords: ["Monster", "Character", "Fly", "Synapse", "Tyranid Prime"]
    },
    {
      id: "tyr_gants",
      name: "Termagants",
      type: "Battleline",
      points: 60,
      squadSize: "10 models (Max 20 models for 120 pts)",
      stats: { m: "6\"", t: 3, sv: "5+", w: 1, ld: "8+", oc: 2 },
      abilities: {
        core: [],
        faction: ["Synapse"],
        datasheet: [
          { name: "Reactive Slinking", description: "Once per opponent's Movement phase, when an enemy unit ends a Normal, Advance, or Fall Back move within 9\" of this unit, this unit can make a Normal move of up to D6\"." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Fleshborer", range: "18\"", attacks: "1", skill: "4+", strength: 5, ap: 0, damage: "1", abilities: ["Assault"] },
          { name: "Spinefists", range: "12\"", attacks: "2", skill: "4+", strength: 3, ap: 0, damage: "1", abilities: ["Assault", "Twin-Linked", "Pistol"] }
        ],
        melee: [
          { name: "Chitinous Claws and Teeth", range: "Melee", attacks: "1", skill: "4+", strength: 3, ap: 0, damage: "1" }
        ]
      },
      keywords: ["Infantry", "Battleline", "Endless Multitude", "Termagants"]
    },
    {
      id: "tyr_carnifex",
      name: "Carnifex",
      type: "Monster",
      points: 125,
      squadSize: "1 model",
      stats: { m: "8\"", t: 9, sv: "2+", w: 8, ld: "7+", oc: 3 },
      abilities: {
        core: ["Deadly Demise 1"],
        faction: [],
        datasheet: [
          { name: "Blistering Charge", description: "Each time an enemy unit shoots this Carnifex's unit, this unit can make a Normal move of up to D6\" toward that enemy unit." },
          { name: "Crushing Stampede", description: "Each time this model ends a Charge move, select one enemy unit in Engagement Range and roll a D6. On a 2-5, that enemy suffers D3 mortal wounds; on a 6, it suffers 3 mortal wounds." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Stranglethorn Cannon", range: "36\"", attacks: "D6", skill: "4+", strength: 7, ap: -1, damage: "2", abilities: ["Blast"] }
        ],
        melee: [
          { name: "Carnifex Scything Talons", range: "Melee", attacks: "6", skill: "4+", strength: 9, ap: -2, damage: "3", abilities: ["Extra Attacks"] },
          { name: "Heavy Crushing Claws", range: "Melee", attacks: "4", skill: "4+", strength: 12, ap: -3, damage: "D6+1" }
        ]
      },
      keywords: ["Monster", "Carnifex"]
    },
    {
      id: "tyr_neurotyrant",
      name: "Neurotyrant",
      type: "Character",
      points: 105,
      squadSize: "1 model",
      stats: { m: "6\"", t: 8, sv: "2+", w: 9, ld: "6+", oc: 3, invul: "4+" },
      abilities: {
        core: ["Leader"],
        faction: ["Synapse"],
        datasheet: [
          { name: "Psychic Terror", description: "While this model is on the battlefield, subtract 1 from Battle-shock tests taken by enemy units. If Shadow in the Warp is active, subtract 2 from those tests instead." },
          { name: "Synaptic Relays", description: "In your Command phase, you can select up to two friendly units within 12\". Until the start of your next Command phase, those units are treated as being in Synapse Range." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Psychic Scream", range: "18\"", attacks: "2D6", skill: "3+", strength: 5, ap: -1, damage: "2", abilities: ["Torrent", "Psychic", "Ignores Cover"] }
        ],
        melee: [
          { name: "Tentacle Claws", range: "Melee", attacks: "6", skill: "3+", strength: 5, ap: -1, damage: "1" }
        ]
      },
      keywords: ["Monster", "Character", "Fly", "Synapse", "Neurotyrant"]
    },
    {
      id: "tyr_screamer_killer",
      name: "Screamer-Killer",
      type: "Monster",
      points: 145,
      squadSize: "1 model",
      stats: { m: "8\"", t: 9, sv: "2+", w: 10, ld: "7+", oc: 3 },
      abilities: {
        core: ["Deadly Demise D3"],
        faction: [],
        datasheet: [
          { name: "Screamer Killer Screech", description: "In your Shooting phase, after this model has shot, select one enemy unit hit by its Bio-plasmic Scream. That unit must take a Battle-shock test with a -1 penalty." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Bio-plasmic Scream", range: "18\"", attacks: "10", skill: "3+", strength: 8, ap: -2, damage: "1", abilities: ["Assault"] }
        ],
        melee: [
          { name: "Screamer-Killer Talons", range: "Melee", attacks: "10", skill: "3+", strength: 10, ap: -2, damage: "3" }
        ]
      },
      keywords: ["Monster", "Screamer-Killer"]
    },
    {
      id: "tyr_hive_tyrant",
      name: "Hive Tyrant",
      type: "Character",
      points: 235,
      squadSize: "1 model",
      stats: { m: "8\"", t: 10, sv: "2+", w: 10, ld: "7+", oc: 3, invul: "4+" },
      abilities: {
        core: ["Leader"],
        faction: ["Synapse"],
        datasheet: [
          { name: "Will of the Hive Mind", description: "Once per battle round, you can target one unit in Synapse range with a Stratagem for 0 CP, even if another unit has already been targeted with that stratagem." },
          { name: "Onslaught Aura", description: "While a friendly Tyranids unit is within 6\" of this model, that unit can shoot in a turn in which it Advanced." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Heavy Venom Cannon", range: "36\"", attacks: "3", skill: "2+", strength: 9, ap: -2, damage: "3", abilities: ["Blast"] }
        ],
        melee: [
          { name: "Monstrous Boneswords", range: "Melee", attacks: "6", skill: "2+", strength: 9, ap: -2, damage: "3" }
        ]
      },
      keywords: ["Monster", "Character", "Synapse", "Hive Tyrant"]
    },
    {
      id: "tyr_swarmlord",
      name: "The Swarmlord",
      type: "Character",
      points: 270,
      squadSize: "1 model",
      stats: { m: "8\"", t: 10, sv: "2+", w: 10, ld: "7+", oc: 3, invul: "4+" },
      abilities: {
        core: ["Leader"],
        faction: ["Synapse"],
        datasheet: [
          { name: "Malign Influence", description: "Once per battle, in your Command phase, select one Stratagem from your opponent's detachment. Until the end of the battle, increase the CP cost of that stratagem by 1 for your opponent." },
          { name: "Hive Commander", description: "At the start of your Command phase, if this model is on the battlefield, you gain 1 Command Point." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Synaptic Pulse", range: "18\"", attacks: "D6", skill: "2+", strength: 6, ap: -1, damage: "2", abilities: ["Psychic"] }
        ],
        melee: [
          { name: "Bone Sabres", range: "Melee", attacks: "8", skill: "2+", strength: 9, ap: -3, damage: "3", abilities: ["Devastating Wounds"] }
        ]
      },
      keywords: ["Monster", "Character", "Epic Hero", "Synapse", "The Swarmlord"]
    },
    {
      id: "tyr_broodlord",
      name: "Broodlord",
      type: "Character",
      points: 80,
      squadSize: "1 model",
      stats: { m: "8\"", t: 5, sv: "4+", w: 6, ld: "7+", oc: 1, invul: "4+" },
      abilities: {
        core: ["Leader", "Infiltrators"],
        faction: ["Synapse"],
        datasheet: [
          { name: "Vanguard Predator", description: "While leading a unit, models in that unit have the [Devastating Wounds] ability on their melee weapons." },
          { name: "Hypnotic Gaze", description: "In the Fight phase, select one enemy character within engagement range. Subtract 1 from that character's melee attacks characteristic." }
        ]
      },
      weapons: {
        ranged: [],
        melee: [
          { name: "Broodlord Claws", range: "Melee", attacks: "6", skill: "2+", strength: 6, ap: -2, damage: "2" }
        ]
      },
      keywords: ["Infantry", "Character", "Synapse", "Broodlord"]
    },
    {
      id: "tyr_deathleaper",
      name: "Deathleaper",
      type: "Character",
      points: 80,
      squadSize: "1 model",
      stats: { m: "8\"", t: 5, sv: "4+", w: 6, ld: "7+", oc: 1 },
      abilities: {
        core: ["Lone Operative", "Infiltrators", "Stealth"],
        faction: [],
        datasheet: [
          { name: "Agent of the Hive Mind", description: "Once per turn, when an enemy unit within 12\" fails a Battle-shock test, you gain 1 Command Point." },
          { name: "Fear Made Manifest", description: "While an enemy unit is within 6\" of this model, worsen that unit's Leadership characteristic by 1." }
        ]
      },
      weapons: {
        ranged: [],
        melee: [
          { name: "Lictor Claws", range: "Melee", attacks: "6", skill: "2+", strength: 6, ap: -2, damage: "2", abilities: ["Precision"] }
        ]
      },
      keywords: ["Infantry", "Character", "Epic Hero", "Vanguard", "Deathleaper"]
    },
    {
      id: "tyr_hormagaunts",
      name: "Hormagaunts",
      type: "Battleline",
      points: 65,
      squadSize: "10 models",
      stats: { m: "10\"", t: 3, sv: "5+", w: 1, ld: "8+", oc: 1 },
      abilities: {
        core: [],
        faction: ["Synapse"],
        datasheet: [
          { name: "Bounding Leap", description: "This unit can declare a charge in a turn in which it Advanced. Additionally, add +2\" to its Pile-in moves." }
        ]
      },
      weapons: {
        ranged: [],
        melee: [
          { name: "Hormagaunt Scythes", range: "Melee", attacks: "3", skill: "4+", strength: 3, ap: -1, damage: "1" }
        ]
      },
      keywords: ["Infantry", "Battleline", "Endless Multitude", "Hormagaunts"]
    },
    {
      id: "tyr_gargoyles",
      name: "Gargoyles",
      type: "Battleline",
      points: 85,
      squadSize: "10 models",
      stats: { m: "12\"", t: 3, sv: "6+", w: 1, ld: "8+", oc: 2 },
      abilities: {
        core: ["Deep Strike", "Fly"],
        faction: ["Synapse"],
        datasheet: [
          { name: "Swoop and Fire", description: "In your Shooting phase, after this unit has shot, it can make a Normal move of up to 6\", but cannot charge in that same turn." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Fleshborer", range: "18\"", attacks: "1", skill: "4+", strength: 5, ap: 0, damage: "1", abilities: ["Assault"] }
        ],
        melee: [
          { name: "Chitinous Claws", range: "Melee", attacks: "1", skill: "4+", strength: 3, ap: 0, damage: "1" }
        ]
      },
      keywords: ["Infantry", "Battleline", "Fly", "Gargoyles"]
    },
    {
      id: "tyr_warriors_ranged",
      name: "Tyranid Warriors with Ranged Bio-weapons",
      type: "Infantry",
      points: 70,
      squadSize: "3 models",
      stats: { m: "6\"", t: 5, sv: "4+", w: 3, ld: "7+", oc: 1 },
      abilities: {
        core: [],
        faction: ["Synapse"],
        datasheet: [
          { name: "Bio-weapon Adaptation", description: "While this unit is within Synapse range, each time a model in this unit makes a ranged attack, you can re-roll a Wound roll of 1." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Deathspitter", range: "24\"", attacks: "3", skill: "3+", strength: 5, ap: -1, damage: "1" },
          { name: "Venom Cannon", range: "36\"", attacks: "1", skill: "3+", strength: 7, ap: -1, damage: "2", abilities: ["Blast"] }
        ],
        melee: [
          { name: "Tyranid Warrior Claws", range: "Melee", attacks: "4", skill: "3+", strength: 5, ap: 0, damage: "1" }
        ]
      },
      keywords: ["Infantry", "Synapse", "Warriors", "Ranged"]
    },
    {
      id: "tyr_warriors_melee",
      name: "Tyranid Warriors with Melee Bio-weapons",
      type: "Infantry",
      points: 85,
      squadSize: "3 models",
      stats: { m: "6\"", t: 5, sv: "4+", w: 3, ld: "7+", oc: 1 },
      abilities: {
        core: [],
        faction: ["Synapse"],
        datasheet: [
          { name: "Relentless Swarm", description: "While this unit is within Synapse range, each time a model in this unit makes a melee attack, you can re-roll a Hit roll of 1." }
        ]
      },
      weapons: {
        ranged: [],
        melee: [
          { name: "Dual Boneswords", range: "Melee", attacks: "6", skill: "3+", strength: 5, ap: -1, damage: "1" },
          { name: "Rending Claws", range: "Melee", attacks: "5", skill: "3+", strength: 5, ap: -1, damage: "1", abilities: ["Twin-Linked"] }
        ]
      },
      keywords: ["Infantry", "Synapse", "Warriors", "Melee"]
    },
    {
      id: "tyr_genestealers",
      name: "Genestealers",
      type: "Infantry",
      points: 75,
      squadSize: "5 models",
      stats: { m: "8\"", t: 4, sv: "5+", w: 2, ld: "7+", oc: 1, invul: "5+" },
      abilities: {
        core: ["Infiltrators", "Scouts 6\""],
        faction: [],
        datasheet: [
          { name: "Vanguard Infiltrators", description: "Each time a model in this unit makes a melee attack, you can re-roll the Wound roll if this unit charged this turn. If within range of an objective marker, re-roll all Wound rolls instead." }
        ]
      },
      weapons: {
        ranged: [],
        melee: [
          { name: "Super-rending Claws", range: "Melee", attacks: "4", skill: "2+", strength: 4, ap: -1, damage: "1", abilities: ["Devastating Wounds"] }
        ]
      },
      keywords: ["Infantry", "Genestealers", "Squad"]
    },
    {
      id: "tyr_zoanthropes",
      name: "Zoanthropes",
      type: "Infantry",
      points: 100,
      squadSize: "3 models",
      stats: { m: "5\"", t: 5, sv: "5+", w: 3, ld: "7+", oc: 1, invul: "4+" },
      abilities: {
        core: ["Fly"],
        faction: ["Synapse"],
        datasheet: [
          { name: "Warp Shielding Aura", description: "While a friendly Tyranids unit is within 6\" of this model, models in that unit have a 5+ Invulnerable Save." },
          { name: "Spirit Siphon", description: "Once per phase, when a model in this unit makes a ranged psychic attack, you can re-roll a Wound roll." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Warp Blast (Witchfire)", range: "24\"", attacks: "1", skill: "3+", strength: 7, ap: -2, damage: "D3", abilities: ["Blast", "Psychic"] },
          { name: "Warp Blast (Focused)", range: "24\"", attacks: "1", skill: "3+", strength: 12, ap: -3, damage: "D6", abilities: ["Psychic"] }
        ],
        melee: [
          { name: "Claws", range: "Melee", attacks: "1", skill: "4+", strength: 3, ap: 0, damage: "1" }
        ]
      },
      keywords: ["Infantry", "Fly", "Synapse", "Psyker", "Zoanthropes"]
    },
    {
      id: "tyr_lictor",
      name: "Lictor",
      type: "Infantry",
      points: 55,
      squadSize: "1 model",
      stats: { m: "8\"", t: 5, sv: "4+", w: 6, ld: "7+", oc: 1 },
      abilities: {
        core: ["Lone Operative", "Infiltrators", "Stealth"],
        faction: [],
        datasheet: [
          { name: "Prowler", description: "You can target this model with the Fire and Fade Stratagem for 0 CP." },
          { name: "Feeder Tendrils", description: "Each time this model destroys an enemy Character model in melee, you gain 1 Command Point." }
        ]
      },
      weapons: {
        ranged: [],
        melee: [
          { name: "Lictor Claws and Talons", range: "Melee", attacks: "6", skill: "2+", strength: 6, ap: -2, damage: "2", abilities: ["Precision"] }
        ]
      },
      keywords: ["Infantry", "Stealth", "Vanguard", "Lictor"]
    },
    {
      id: "tyr_leapers",
      name: "Von Ryan's Leapers",
      type: "Infantry",
      points: 75,
      squadSize: "3 models",
      stats: { m: "10\"", t: 5, sv: "5+", w: 3, ld: "7+", oc: 1 },
      abilities: {
        core: ["Infiltrators", "Stealth"],
        faction: [],
        datasheet: [
          { name: "Pounce from Shadows", description: "This unit can perform a Heroic Intervention for 0 CP." },
          { name: "Slicing Claws", description: "Melee attacks by this unit have the [Fights First] ability." }
        ]
      },
      weapons: {
        ranged: [],
        melee: [
          { name: "Leaper Talons", range: "Melee", attacks: "6", skill: "3+", strength: 5, ap: -1, damage: "1" }
        ]
      },
      keywords: ["Infantry", "Vanguard", "Leapers"]
    },
    {
      id: "tyr_psychophage",
      name: "Psychophage",
      type: "Monster",
      points: 95,
      squadSize: "1 model",
      stats: { m: "8\"", t: 9, sv: "3+", w: 10, ld: "7+", oc: 3 },
      abilities: {
        core: ["Deadly Demise D3", "Feel No Pain 6+"],
        faction: [],
        datasheet: [
          { name: "Feeding Stimulus Aura", description: "While a friendly Tyranids unit is within 6\" of this model, models in that unit have the [Feel No Pain 6+] ability." },
          { name: "Psychic Devourer", description: "This model's melee attacks have the [Anti-Psyker 2+] and [Devastating Wounds] abilities." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Acid Torrent", range: "12\"", attacks: "D6", skill: "2+", strength: 6, ap: -1, damage: "1", abilities: ["Torrent"] }
        ],
        melee: [
          { name: "Psychophage Mandibles", range: "Melee", attacks: "5", skill: "3+", strength: 6, ap: -1, damage: "2" }
        ]
      },
      keywords: ["Monster", "Psychophage"]
    },
    {
      id: "tyr_tyrannofex",
      name: "Tyrannofex",
      type: "Monster",
      points: 190,
      squadSize: "1 model",
      stats: { m: "7\"", t: 12, sv: "2+", w: 16, ld: "7+", oc: 5 },
      abilities: {
        core: ["Deadly Demise D6"],
        faction: [],
        datasheet: [
          { name: "Resilient Carapace", description: "Once per turn, the first time an attack is allocated to this model, reduce the damage characteristic of that attack to 0." },
          { name: "Acid Spray Volley", description: "This model can perform Overwatch for 1 CP even if it has already shot or fired overwatch this turn." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Rupture Cannon", range: "48\"", attacks: "2", skill: "3+", strength: 18, ap: -4, damage: "2D6" },
          { name: "Acid Spray", range: "18\"", attacks: "2D6", skill: "2+", strength: 6, ap: -2, damage: "2", abilities: ["Torrent"] }
        ],
        melee: [
          { name: "Tyrannofex Limbs", range: "Melee", attacks: "3", skill: "4+", strength: 8, ap: 0, damage: "1" }
        ]
      },
      keywords: ["Monster", "Tyrannofex"]
    },
    {
      id: "tyr_maleceptor",
      name: "Maleceptor",
      type: "Monster",
      points: 170,
      squadSize: "1 model",
      stats: { m: "7\"", t: 11, sv: "3+", w: 12, ld: "7+", oc: 3, invul: "4+" },
      abilities: {
        core: ["Deadly Demise D3"],
        faction: ["Synapse"],
        datasheet: [
          { name: "Psychic Overload Aura", description: "While an enemy unit is within 6\" of this model, subtract 1 from the Hit roll and Wound roll of attacks made by that enemy unit." },
          { name: "Synaptic Shielding", description: "This model has a 5+ Feel No Pain against psychic attacks." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Psychic Overload (Focused)", range: "18\"", attacks: "6", skill: "3+", strength: 10, ap: -2, damage: "3", abilities: ["Psychic"] }
        ],
        melee: [
          { name: "Massive Scythes", range: "Melee", attacks: "5", skill: "3+", strength: 9, ap: -2, damage: "3" }
        ]
      },
      keywords: ["Monster", "Psyker", "Synapse", "Maleceptor"]
    },
    {
      id: "ty_hive_tyrant",
      name: "Hive Tyrant",
      type: "Monster",
      points: 235,
      squadSize: "1 model",
      stats: { m: "8\"", t: 10, sv: "2+", w: 10, ld: "6+", oc: 3, invul: "4+" },
      abilities: {
        core: ["Synapse"],
        faction: ["Shadow in the Warp"],
        datasheet: [
          { name: "Will of the Hive Mind", description: "Once per battle round, one unit within 12\" can be targeted with a Stratagem for 0 CP." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Heavy Venom Cannon", range: "36\"", attacks: "3", skill: "3+", strength: 9, ap: -2, damage: "3" }
        ],
        melee: [
          { name: "Monstrous Bonesword and Lashwhip", range: "Melee", attacks: "6", skill: "2+", strength: 8, ap: -2, damage: "3" }
        ]
      },
      keywords: ["Monster", "Character", "Synapse", "Hive Tyrant"]
    },
    {
      id: "ty_barbgaunts",
      name: "Barbgaunts",
      type: "Infantry",
      points: 55,
      squadSize: "5 models",
      stats: { m: "6\"", t: 4, sv: "5+", w: 2, ld: "7+", oc: 1 },
      abilities: {
        core: [],
        faction: ["Shadow in the Warp"],
        datasheet: [
          { name: "Living Artillery", description: "Each time a model in this unit makes a ranged attack targeting an enemy unit, subtract 2\" from that enemy unit's Move characteristic and subtract 2 from Advance and Charge rolls." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Bio-weaponry", range: "24\"", attacks: "D6", skill: "4+", strength: 5, ap: 0, damage: "1", abilities: ["Blast", "Indirect Fire"] }
        ],
        melee: [
          { name: "Chitinous Claws", range: "Melee", attacks: "2", skill: "4+", strength: 3, ap: 0, damage: "1" }
        ]
      },
      keywords: ["Infantry", "Barbgaunts"]
    },
    {
      id: "tyr_biovore",
      name: "Biovore",
      type: "Monster",
      points: 75,
      squadSize: "1 model",
      stats: { m: "6\"", t: 6, sv: "4+", w: 6, ld: "7+", oc: 1 },
      abilities: {
        core: [],
        faction: ["Synapse"],
        datasheet: [
          { name: "Spore Mine Launcher", description: "Each time this model makes a ranged attack, you can set up one Spore Mine model within 6\" of a visible enemy unit." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Biovore Spore Launcher", range: "48\"", attacks: "1", skill: "3+", strength: 5, ap: 0, damage: "1", abilities: ["Blast", "Indirect Fire"] }
        ],
        melee: [
          { name: "Chitinous Claws", range: "Melee", attacks: "2", skill: "4+", strength: 5, ap: 0, damage: "1" }
        ]
      },
      keywords: ["Monster", "Biovore"]
    },
    {
      id: "tyr_pyrovore",
      name: "Pyrovore",
      type: "Infantry",
      points: 35,
      squadSize: "1 model",
      stats: { m: "6\"", t: 6, sv: "4+", w: 3, ld: "7+", oc: 1 },
      abilities: {
        core: [],
        faction: ["Synapse"],
        datasheet: [
          { name: "Acidic Blood", description: "Each time this model is destroyed, roll a D6. On a 3+, it deals D3 mortal wounds to all enemy units within 3\"." }
        ]
      },
      weapons: {
        ranged: [
          { name: "Flamespurt", range: "12\"", attacks: "D6", skill: "3+", strength: 6, ap: -1, damage: "1", abilities: ["Torrent"] }
        ],
        melee: [
          { name: "Acidic Claws", range: "Melee", attacks: "2", skill: "3+", strength: 5, ap: 0, damage: "1" }
        ]
      },
      keywords: ["Infantry", "Pyrovore"]
    },
    {
      id: "tyr_neurogaunts",
      name: "Neurogaunts",
      type: "Infantry",
      points: 45,
      squadSize: "10 models",
      stats: { m: "6\"", t: 2, sv: "6+", w: 1, ld: "7+", oc: 1 },
      abilities: {
        core: [],
        faction: ["Synapse"],
        datasheet: [
          { name: "Synaptic Conduit", description: "While this unit is within Synapse Range of a Neurotyrant, this unit is treated as a Synapse unit." }
        ]
      },
      weapons: {
        ranged: [],
        melee: [
          { name: "Claws and Teeth", range: "Melee", attacks: "1", skill: "4+", strength: 3, ap: 0, damage: "1" }
        ]
      },
      keywords: ["Infantry", "Endless Multitude", "Neurogaunts"]
    }
  ]
};
