package com.example.domain

object FactionRepository {
    val FACTIONS: List<Faction> = listOf(
        Faction(
            id = "space_marines",
            name = "Space Marines (Adeptus Astartes)",
            iconName = "Shield",
            description = "The ultimate defenders of humanity, genetic super-soldiers armored in power armor and armed with deadly bolt weapons.",
            overview = FactionOverview(
                playstyle = "Versatile and balanced, capable of adapting to any combat situation with superior armor and flexible weaponry.",
                strengths = listOf("Highly durable infantry", "Excellent all-around shooting", "Strong character buffs"),
                weaknesses = listOf("Expensive in points", "Limited mobility compared to specialized armies")
            ),
            factionRule = FactionRule(
                name = "Oath of Moment",
                description = "At the start of your Command phase, select one unit from your opponent's army. Until the start of your next Command phase, each time a model from your army makes an attack that targets that selected enemy unit, you can re-roll the Hit roll."
            ),
            detachment = DetachmentRule(
                name = "Gladius Task Force",
                description = "A highly adaptable force trained to react seamlessly to any battlefield threat.",
                benefit = "Combat Doctrines: In your Command phase, you can select one of the active Combat Doctrines until your next Command phase:\n- Devastator Doctrine: Advance and Shoot.\n- Tactical Doctrine: Fall Back and Shoot/Charge.\n- Assault Doctrine: Advance and Charge.",
                enhancements = listOf(
                    Enhancement("Artificer Armour", 10, "The model has a 2+ Save characteristic."),
                    Enhancement("Bolter Discipline", 25, "While leading a unit, ranged weapons in that unit have the [Sustained Hits 1] ability.")
                ),
                stratagems = listOf(
                    Stratagem("Armor of Contempt", 1, "Opponent's Shooting or Fight Phase", "Worsen AP characteristic of incoming attacks against target unit by 1."),
                    Stratagem("Honor the Chapter", 1, "Your Fight Phase", "Melee weapons get +1 AP (+1 Attack if in Assault Doctrine)."),
                    Stratagem("Adaptive Strategy", 1, "Any Phase", "Choose one Combat Doctrine to apply to target unit individually.")
                )
            ),
            units = listOf(
                Datacard(
                    id = "sm_captain",
                    name = "Captain in Terminator Armour",
                    type = "Character",
                    points = 95,
                    squadSize = "1 model",
                    stats = UnitStats("5\"", 5, "2+", 6, "6+", 1, "4+"),
                    abilities = AbilitiesBlock(
                        core = listOf("Leader", "Deep Strike"),
                        faction = listOf("Oath of Moment"),
                        datasheet = listOf(
                            DatasheetAbility("Rites of Battle", "Once per battle round, target unit with a Stratagem for 0 CP, even if another unit was already targeted."),
                            DatasheetAbility("The Imperium's Sword", "Once per battle on charge, add +2 Strength and +2 Attacks to melee.")
                        )
                    ),
                    weapons = WeaponsBlock(
                        ranged = listOf(Weapon("Storm Bolter", "24\"", "4", "2+", 4, 0, "1", listOf("Rapid Fire 2"))),
                        melee = listOf(
                            Weapon("Relic Weapon", "Melee", "6", "2+", 5, -2, "2"),
                            Weapon("Power Fist", "Melee", "5", "3+", 8, -2, "2")
                        )
                    ),
                    keywords = listOf("Infantry", "Character", "Terminator", "Captain")
                ),
                Datacard(
                    id = "sm_intercessors",
                    name = "Intercessor Squad",
                    type = "Battleline",
                    points = 80,
                    squadSize = "5 models (Max 10 models for 160 pts)",
                    stats = UnitStats("6\"", 4, "3+", 2, "6+", 2),
                    abilities = AbilitiesBlock(
                        faction = listOf("Oath of Moment"),
                        datasheet = listOf(
                            DatasheetAbility("Objective Secured", "This unit controls an objective marker even if it moves away, until an opponent controls it.")
                        )
                    ),
                    weapons = WeaponsBlock(
                        ranged = listOf(Weapon("Bolt Rifle", "24\"", "2", "3+", 4, -1, "1", listOf("Assault", "Heavy"))),
                        melee = listOf(Weapon("Close Combat Weapon", "Melee", "3", "3+", 4, 0, "1"))
                    ),
                    keywords = listOf("Infantry", "Battleline", "Grenades", "Tacticus", "Intercessors")
                ),
                Datacard(
                    id = "sm_terminators",
                    name = "Terminator Squad",
                    type = "Infantry",
                    points = 185,
                    squadSize = "5 models",
                    stats = UnitStats("5\"", 5, "2+", 3, "6+", 1, "4+"),
                    abilities = AbilitiesBlock(
                        core = listOf("Deep Strike"),
                        faction = listOf("Oath of Moment"),
                        datasheet = listOf(
                            DatasheetAbility("Fury of the First", "Add +1 to Hit rolls against your Oath of Moment target.")
                        )
                    ),
                    weapons = WeaponsBlock(
                        ranged = listOf(Weapon("Storm Bolter", "24\"", "4", "3+", 4, 0, "1", listOf("Rapid Fire 2"))),
                        melee = listOf(Weapon("Power Fist", "Melee", "3", "3+", 8, -2, "2"))
                    ),
                    keywords = listOf("Infantry", "Terminator", "Squad")
                ),
                Datacard(
                    id = "sm_dreadnought",
                    name = "Redemptor Dreadnought",
                    type = "Vehicle",
                    points = 210,
                    squadSize = "1 model",
                    stats = UnitStats("6\"", 9, "2+", 12, "6+", 4),
                    abilities = AbilitiesBlock(
                        core = listOf("Deadly Demise D3"),
                        faction = listOf("Oath of Moment"),
                        datasheet = listOf(
                            DatasheetAbility("Duty Eternal", "Subtract 1 from damage characteristic of allocated attacks (min 1).")
                        )
                    ),
                    weapons = WeaponsBlock(
                        ranged = listOf(Weapon("Macro Plasma Incinerator", "36\"", "D6", "3+", 8, -3, "2", listOf("Blast"))),
                        melee = listOf(Weapon("Redemptor Fist", "Melee", "5", "3+", 12, -2, "3"))
                    ),
                    keywords = listOf("Vehicle", "Walker", "Dreadnought")
                )
            )
        ),
        Faction(
            id = "tyranids",
            name = "Tyranids",
            iconName = "Bug",
            description = "An infinite, voracious biological swarm controlled by a single Hive Mind, seeking to consume all organic life.",
            overview = FactionOverview(
                playstyle = "Aggressive swarm tactics relying on numbers, biological adaptations, and Synapse control.",
                strengths = listOf("Huge unit models", "Mental shadow battle-shock presence", "Strong high-damage monsters"),
                weaknesses = listOf("Fragile small units", "Dependent on Synapse reach")
            ),
            factionRule = FactionRule(
                name = "Synapse & Shadow in the Warp",
                description = "Synapse: Units within 6\" of a Synapse unit roll 3D6 for Battle-shock instead of 2D6. Shadow in the Warp: Once per battle in Command phase, force Battle-shock tests on all enemy units."
            ),
            detachment = DetachmentRule(
                name = "Invasion Fleet",
                description = "Fast hyper-evolutionary swarm adapted to overrun any defenses.",
                benefit = "Hyper-Adaptations chosen at start of battle round: Swarming Instincts (Sustained Hits 1 vs Infantry), Hyper-Aggression (Lethal Hits vs Vehicles), Hive Predators (Precision in melee vs Characters).",
                enhancements = listOf(
                    Enhancement("Adaptive Biology", 20, "Model has a 5+ Feel No Pain save."),
                    Enhancement("Synaptic Lynchpin", 25, "Increase model's Synapse range by 6\".")
                ),
                stratagems = listOf(
                    Stratagem("Rapid Regeneration", 1, "Any Phase", "Unit gets 6+ Feel No Pain (5+ if in Synapse range)."),
                    Stratagem("Adrenal Surge", 2, "Your Fight Phase", "Critical hits scored on 5+ for target Tyranid units.")
                )
            ),
            units = listOf(
                Datacard(
                    id = "tyr_prime",
                    name = "Winged Tyranid Prime",
                    type = "Character",
                    points = 65,
                    squadSize = "1 model",
                    stats = UnitStats("12\"", 5, "4+", 6, "7+", 1),
                    abilities = AbilitiesBlock(
                        core = listOf("Leader", "Deep Strike"),
                        faction = listOf("Synapse"),
                        datasheet = listOf(
                            DatasheetAbility("Alpha Warrior", "Leading unit's melee weapons gain Sustained Hits 1.")
                        )
                    ),
                    weapons = WeaponsBlock(
                        melee = listOf(Weapon("Prime Talons", "Melee", "6", "2+", 6, -2, "2", listOf("Sustained Hits 1")))
                    ),
                    keywords = listOf("Monster", "Character", "Fly", "Synapse")
                ),
                Datacard(
                    id = "tyr_gants",
                    name = "Termagants",
                    type = "Battleline",
                    points = 60,
                    squadSize = "10 models",
                    stats = UnitStats("6\"", 3, "5+", 1, "8+", 2),
                    abilities = AbilitiesBlock(
                        faction = listOf("Synapse"),
                        datasheet = listOf(
                            DatasheetAbility("Reactive Slinking", "Once per opponent's movement, move Termagants up to D6\" away if enemy ends within 9\".")
                        )
                    ),
                    weapons = WeaponsBlock(
                        ranged = listOf(Weapon("Fleshborer", "18\"", "1", "4+", 5, 0, "1", listOf("Assault"))),
                        melee = listOf(Weapon("Chitinous Claws", "Melee", "1", "4+", 3, 0, "1"))
                    ),
                    keywords = listOf("Infantry", "Battleline", "Endless Multitude")
                )
            )
        ),
        Faction(
            id = "necrons",
            name = "Necrons",
            iconName = "Skull",
            description = "Ancient, skeletal machine-warriors awakening from multi-million year stasis tombs to reclaim their lost empire.",
            overview = FactionOverview(
                playstyle = "Durable mechanical resurrection army that slowly marches forward, self-repairing wounds on the fly.",
                strengths = listOf("Legendary self-healing", "Devastating Gauss weaponry", "Extremely tough elite guards"),
                weaknesses = listOf("Very slow base movement", "Vulnerable to high-mobility flyers")
            ),
            factionRule = FactionRule(
                name = "Reanimation Protocols",
                description = "At the start of your Command phase, each of your units reanimates and regains D3 lost wounds (or returns destroyed models with their full wounds remaining)."
            ),
            detachment = DetachmentRule(
                name = "Awakened Dynasty",
                description = "Command protocols activating across the tomb world.",
                benefit = "Command Protocols: Add +1 to Hit rolls for models in units being led by a Necron Character.",
                enhancements = listOf(
                    Enhancement("Sempiternal Weave", 10, "Model has a 4+ Feel No Pain save."),
                    Enhancement("Veil of Darkness", 20, "Once per battle, redeploy this unit anywhere outside 9\" of enemy.")
                ),
                stratagems = listOf(
                    Stratagem("Protocol of the Undying Legion", 1, "Opponent's Shooting/Fight Phase", "Trigger Reanimation Protocols on target unit right after they take casualties."),
                    Stratagem("Protocol of the Hungry Void", 1, "Your Fight Phase", "Melee weapons get +1 Strength and +1 AP.")
                )
            ),
            units = listOf(
                Datacard(
                    id = "nec_overlord",
                    name = "Necron Overlord",
                    type = "Character",
                    points = 85,
                    squadSize = "1 model",
                    stats = UnitStats("5\"", 5, "2+", 6, "6+", 1, "4+"),
                    abilities = AbilitiesBlock(
                        core = listOf("Leader"),
                        faction = listOf("Reanimation Protocols"),
                        datasheet = listOf(
                            DatasheetAbility("My Will Be Done", "Once per battle round, target led unit with a Stratagem for 0 CP."),
                            DatasheetAbility("Resurrection Orb", "Reanimate D3 additional wounds at the end of opponent's turn.")
                        )
                    ),
                    weapons = WeaponsBlock(
                        melee = listOf(Weapon("Voidscythe", "Melee", "4", "3+", 8, -3, "3", listOf("Devastating Wounds")))
                    ),
                    keywords = listOf("Infantry", "Character", "Overlord")
                ),
                Datacard(
                    id = "nec_warriors",
                    name = "Necron Warriors",
                    type = "Battleline",
                    points = 100,
                    squadSize = "10 models",
                    stats = UnitStats("5\"", 4, "4+", 1, "7+", 2),
                    abilities = AbilitiesBlock(
                        faction = listOf("Reanimation Protocols"),
                        datasheet = listOf(
                            DatasheetAbility("Their Number is Legion", "Reanimate D6 wounds instead of D3 when reanimating on objectives.")
                        )
                    ),
                    weapons = WeaponsBlock(
                        ranged = listOf(Weapon("Gauss Flayer", "24\"", "1", "4+", 4, 0, "1", listOf("Lethal Hits"))),
                        melee = listOf(Weapon("Close Combat Weapon", "Melee", "1", "4+", 4, 0, "1"))
                    ),
                    keywords = listOf("Infantry", "Battleline", "Warriors")
                )
            )
        ),
        Faction(
            id = "aeldari",
            name = "Aeldari (Eldar)",
            iconName = "Sparkles",
            description = "An ancient, highly advanced elven race who rely on extreme speed, psychic foresight, and specialized aspect warriors.",
            overview = FactionOverview(
                playstyle = "High mobility and hyper-lethality glass cannons utilizing tactical movement trickery and dice manipulation.",
                strengths = listOf("Foresight Strands dice manipulation", "Extremely fast movement", "Specialist aspect armor"),
                weaknesses = listOf("Low armor toughness", "Highly unforgiving of tactical mistakes")
            ),
            factionRule = FactionRule(
                name = "Strands of Fate",
                description = "At the start of the battle, roll twelve D6 dice to form your Fate Die pool. Throughout the battle, you can substitute a Fate Die from this pool for any Hit, Wound, Save, Damage, or Advance roll."
            ),
            detachment = DetachmentRule(
                name = "Battle Host",
                description = "Masterful strategy from a galaxy-spanning race.",
                benefit = "Unparalleled Foresight: Each time an Aeldari unit is selected to Shoot or Fight, you can re-roll one Hit roll and one Wound roll.",
                enhancements = listOf(
                    Enhancement("Phoenix Gem", 25, "The first time this model is destroyed, it returns to life with 1 wound remaining."),
                    Enhancement("Fate\'s Messenger", 15, "Once per turn, turn one roll made for this model into a 6.")
                ),
                stratagems = listOf(
                    Stratagem("Phantasm", 1, "Opponent's Movement Phase", "Move target Aeldari unit up to 7\" immediately after enemy moves."),
                    Stratagem("Fire and Fade", 2, "Your Shooting Phase", "Shoot, then move target Aeldari unit up to 7\" instead of remaining static.")
                )
            ),
            units = listOf(
                Datacard(
                    id = "ael_farseer",
                    name = "Farseer",
                    type = "Character",
                    points = 80,
                    squadSize = "1 model",
                    stats = UnitStats("6\"", 3, "6+", 4, "6+", 1, "4+"),
                    abilities = AbilitiesBlock(
                        core = listOf("Leader"),
                        faction = listOf("Strands of Fate"),
                        datasheet = listOf(
                            DatasheetAbility("Fortune", "In your Command phase, subtract 1 from wound rolls made against one friendly unit within 12\"."),
                            DatasheetAbility("Branching Fates", "Once per turn, substitute a Fate Die with an automatic 6.")
                        )
                    ),
                    weapons = WeaponsBlock(
                        ranged = listOf(Weapon("Singing Spear", "12\"", "1", "2+", 3, 0, "D3", listOf("Psychic", "Anti-Monster 2+", "Anti-Vehicle 2+"))),
                        melee = listOf(Weapon("Witchblade", "Melee", "2", "3+", 3, 0, "D3", listOf("Psychic", "Anti-Monster 2+", "Anti-Vehicle 2+")))
                    ),
                    keywords = listOf("Infantry", "Character", "Psykers", "Farseer")
                ),
                Datacard(
                    id = "ael_guardians",
                    name = "Guardian Defenders",
                    type = "Battleline",
                    points = 110,
                    squadSize = "10 models + Heavy platform",
                    stats = UnitStats("6\"", 3, "4+", 1, "7+", 2),
                    abilities = AbilitiesBlock(
                        faction = listOf("Strands of Fate"),
                        datasheet = listOf(
                            DatasheetAbility("Foresight Generators", "While this unit controls an objective marker, gain 1 Fate Die at the end of your Command phase.")
                        )
                    ),
                    weapons = WeaponsBlock(
                        ranged = listOf(Weapon("Shuriken Catapult", "18\"", "2", "3+", 4, -1, "1", listOf("Assault"))),
                        melee = listOf(Weapon("Close Combat Weapon", "Melee", "1", "3+", 3, 0, "1"))
                    ),
                    keywords = listOf("Infantry", "Battleline", "Defenders")
                )
            )
        ),
        Faction(
            id = "orks",
            name = "Orks",
            iconName = "Sword",
            description = "A savage, green-skinned alien horde fueled by a constant desire for war, screaming 'Waaagh!' as they rush into close combat.",
            overview = FactionOverview(
                playstyle = "Aggressive melee swarm relying on charge bonuses, huge volumes of low-accuracy melee attacks, and ramshackle vehicles.",
                strengths = listOf("Brutal melee attacks", "High model counts", "Unpredictable charge surges"),
                weaknesses = listOf("Abysmal shooting accuracy (Hits on 5+)", "Weak armor saves")
            ),
            factionRule = FactionRule(
                name = "Waaagh!",
                description = "Once per battle, at the start of any battle round, declare a 'Waaagh!'. Until the end of that battle round, Orks gain: +1 Strength and +1 Attack to melee, a 5+ Invulnerable Save, and can Advance and Charge."
            ),
            detachment = DetachmentRule(
                name = "Waaagh! Tribe",
                description = "A massive gathering of Orks ready to tear the galaxy apart.",
                benefit = "Get Stuck In: Ork melee weapons have the [Sustained Hits 1] ability.",
                enhancements = listOf(
                    Enhancement("Headwoppa\'s Killchoppa", 20, "Model's melee weapons gain Devastating Wounds."),
                    Enhancement("Kunnin\' but Brutal", 15, "Once per turn, model's unit can Fall Back and Charge.")
                ),
                stratagems = listOf(
                    Stratagem("Orks Never Beaten", 2, "Your Fight Phase", "Models in target unit can fight on death before being removed."),
                    Stratagem("Unbridled Carnage", 1, "Your Fight Phase", "Target unit scores Sustained Hits on a 5+ instead of 6+.")
                )
            ),
            units = listOf(
                Datacard(
                    id = "ork_warboss",
                    name = "Warboss",
                    type = "Character",
                    points = 65,
                    squadSize = "1 model",
                    stats = UnitStats("6\"", 5, "4+", 6, "6+", 1, "5+"),
                    abilities = AbilitiesBlock(
                        core = listOf("Leader"),
                        faction = listOf("Waaagh!"),
                        datasheet = listOf(
                            DatasheetAbility("I\'m da Boss", "While leading a unit, add +1 to Hit rolls for melee attacks in that unit."),
                            DatasheetAbility("Kombi-Weapon", "Equipped with a kustom combi-weapon.")
                        )
                    ),
                    weapons = WeaponsBlock(
                        melee = listOf(Weapon("Big Choppa", "Melee", "6", "2+", 7, -1, "2", listOf("Devastating Wounds")))
                    ),
                    keywords = listOf("Infantry", "Character", "Warboss")
                ),
                Datacard(
                    id = "ork_boyz",
                    name = "Boyz",
                    type = "Battleline",
                    points = 85,
                    squadSize = "10 models",
                    stats = UnitStats("6\"", 5, "5+", 1, "7+", 1),
                    abilities = AbilitiesBlock(
                        faction = listOf("Waaagh!"),
                        datasheet = listOf(
                            DatasheetAbility("Choppa Storm", "Reroll charge distances for this unit.")
                        )
                    ),
                    weapons = WeaponsBlock(
                        ranged = listOf(Weapon("Slugga", "12\"", "1", "5+", 4, 0, "1", listOf("Pistol"))),
                        melee = listOf(Weapon("Choppa", "Melee", "4", "3+", 4, -1, "1"))
                    ),
                    keywords = listOf("Infantry", "Battleline", "Boyz")
                )
            )
        ),
        Faction(
            id = "chaos_space_marines",
            name = "Chaos Space Marines",
            iconName = "Skull",
            description = "Traitor legions who sold their souls to the Dark Gods, wielding dark blessings and demonic machinery.",
            overview = FactionOverview(
                playstyle = "High risk, high reward playstyle focused on Dark Pacts that boost damage in exchange for self-inflicted wounds.",
                strengths = listOf("Powerful Dark Pact buffs", "Daemon Engines", "Highly versatile Marks of Chaos"),
                weaknesses = listOf("Self-inflicted mortal wounds", "High unit points cost")
            ),
            factionRule = FactionRule(
                name = "Dark Pacts",
                description = "Each time a Chaos unit shoots or fights, it can make a Dark Pact. If it does, its weapons gain either [Sustained Hits 1] or [Lethal Hits]. After resolving attacks, take a Leadership test; if failed, the unit suffers D3 mortal wounds."
            ),
            detachment = DetachmentRule(
                name = "Slaves to Darkness",
                description = "The traitor armies pledge eternal service to the Ruinous Powers.",
                benefit = "Marks of Chaos: You can assign a specific Mark (Khorne, Nurgle, Tzeentch, Slaanesh, Undivided) to units, offering unique buffs to Dark Pacts.",
                enhancements = listOf(
                    Enhancement("Liber Hereticus", 20, "Mark of Chaos Undivided. The model's unit scores critical hits on a 5+."),
                    Enhancement("Khorne\'s Talisman", 15, "Mark of Khorne. Melee attacks gain +2 Attacks.")
                ),
                stratagems = listOf(
                    Stratagem("Profane Zeal", 1, "Your Shooting/Fight Phase", "Reroll hit and wound rolls for target Chaos Undivided unit."),
                    Stratagem("Dark Obscuration", 1, "Opponent's Shooting Phase", "Mark of Nurgle. Target unit gains Stealth, and cannot be targeted from outside 12\".")
                )
            ),
            units = listOf(
                Datacard(
                    id = "csm_lord",
                    name = "Chaos Lord",
                    type = "Character",
                    points = 90,
                    squadSize = "1 model",
                    stats = UnitStats("6\"", 4, "3+", 5, "6+", 1, "4+"),
                    abilities = AbilitiesBlock(
                        core = listOf("Leader"),
                        faction = listOf("Dark Pacts"),
                        datasheet = listOf(
                            DatasheetAbility("Lord of Chaos", "Once per battle round, target led unit with a Stratagem for 0 CP."),
                            DatasheetAbility("Chance for Glory", "Once per battle, gain +2 melee attacks and Devastating Wounds.")
                        )
                    ),
                    weapons = WeaponsBlock(
                        melee = listOf(Weapon("Daemon Hammer", "Melee", "5", "3+", 8, -2, "3", listOf("Devastating Wounds")))
                    ),
                    keywords = listOf("Infantry", "Character", "Chaos Lord")
                ),
                Datacard(
                    id = "csm_legionaries",
                    name = "Legionaries",
                    type = "Battleline",
                    points = 90,
                    squadSize = "5 models",
                    stats = UnitStats("6\"", 4, "3+", 2, "6+", 2),
                    abilities = AbilitiesBlock(
                        faction = listOf("Dark Pacts"),
                        datasheet = listOf(
                            DatasheetAbility("Veterans of the Long War", "Reroll Wound rolls of 1 in melee (reroll all wound rolls if targeting enemy on an objective).")
                        )
                    ),
                    weapons = WeaponsBlock(
                        ranged = listOf(Weapon("Boltgun", "24\"", "2", "3+", 4, 0, "1")),
                        melee = listOf(Weapon("Astartes Chainsword", "Melee", "4", "3+", 4, -1, "1"))
                    ),
                    keywords = listOf("Infantry", "Battleline", "Legionaries")
                )
            )
        ),
        Faction(
            id = "astra_militarum",
            name = "Astra Militarum (Imperial Guard)",
            iconName = "Shield",
            description = "The endless human ranks of the Imperial Guard, relying on massed infantry cohorts and heavy armored artillery.",
            overview = FactionOverview(
                playstyle = "Static defensive gunline utilizing tactical Orders (FRFSRF, Move Move Move!) to coordinate massive tank fire.",
                strengths = listOf("Endless artillery bombardments", "Tactical Command Orders", "Very cheap infantry"),
                weaknesses = listOf("Weak individual soldiers", "Heavy reliance on officers staying alive")
            ),
            factionRule = FactionRule(
                name = "Voice of Command",
                description = "Officer models can issue tactical Orders in your Command phase to friendly squads within 6\". Orders include: 'First Rank, Fire! Second Rank, Fire!' (+1 Attack to ranged) and 'Take Aim!' (+1 to Hit rolls)."
            ),
            detachment = DetachmentRule(
                name = "Combined Regiment",
                description = "Perfect synergy between infantry shields and armored shells.",
                benefit = "Born Soldiers: Ranged attacks by Astra Militarum infantry units gain [Lethal Hits] if they remained stationary this turn.",
                enhancements = listOf(
                    Enhancement("Grand Strategist", 15, "The Officer can issue one additional Order in your Command phase."),
                    Enhancement("Kurov\'s Aquila", 40, "Increase the CP cost of one opponent Stratagem by 1 for the rest of battle.")
                ),
                stratagems = listOf(
                    Stratagem("Reinforcements!", 2, "Any Phase", "When an Astra Militarum Infantry unit is destroyed, add an identical replacement unit to Strategic Reserves."),
                    Stratagem("Fields of Fire", 2, "Your Shooting Phase", "Target an enemy hit by your attacks; worsen their Save against subsequent attacks by 1 AP.")
                )
            ),
            units = listOf(
                Datacard(
                    id = "am_cadian_shock",
                    name = "Cadian Shock Troops",
                    type = "Battleline",
                    points = 60,
                    squadSize = "10 models",
                    stats = UnitStats("6\"", 3, "5+", 1, "7+", 2),
                    abilities = AbilitiesBlock(
                        faction = listOf("Voice of Command"),
                        datasheet = listOf(
                            DatasheetAbility("Shock Troops", "Objectives captured by this unit remain under control even if this unit moves away.")
                        )
                    ),
                    weapons = WeaponsBlock(
                        ranged = listOf(Weapon("Lasgun", "24\"", "1", "4+", 3, 0, "1", listOf("Rapid Fire 1"))),
                        melee = listOf(Weapon("Close Combat Weapon", "Melee", "1", "4+", 3, 0, "1"))
                    ),
                    keywords = listOf("Infantry", "Battleline", "Cadian")
                )
            )
        ),
        Faction(
            id = "adeptus_custodes",
            name = "Adeptus Custodes",
            iconName = "Shield",
            description = "The Emperor\'s personal demigod bodyguards, armored in shimmering auramite with unparalleled martial skill.",
            overview = FactionOverview(
                playstyle = "Elite micro-army where every single model is a walking raid boss of immense armor and combat damage.",
                strengths = listOf("Virtually indestructible", "Supreme weapon profiles", "High invulnerable saves"),
                weaknesses = listOf("Absurdly expensive in points", "Can be overwhelmed on wide multi-objective boards")
            ),
            factionRule = FactionRule(
                name = "Martial Ka\'tah",
                description = "At the start of the Fight phase, choose one Ka\'tah stance: Kaelor (Sustained Hits 1 in melee), Dacatarai (Lethal Hits in melee), or Rendax (+1 AP on Critical Wounds)."
            ),
            detachment = DetachmentRule(
                name = "Shield Host",
                description = "The ultimate vanguard of golden guardians.",
                benefit = "Aegis of the Emperor: Custodes units have a 4+ Invulnerable Save against Mortal Wounds.",
                enhancements = listOf(
                    Enhancement("Veiled Blade", 15, "Model gains +2 Attacks to its melee weapons."),
                    Enhancement("Unstoppable Destroyer", 10, "Model's unit can ignore modifiers to its movement and charge rolls.")
                ),
                stratagems = listOf(
                    Stratagem("Slayer of Tyrants", 1, "Your Charge Phase", "Target Custodes unit gets +1 to Hit and Wound rolls when targeting enemy Characters."),
                    Stratagem("Vigil Unending", 1, "Opponent's Fight Phase", "When a Custodes model is destroyed, it can immediately fight before being removed.")
                )
            ),
            units = listOf(
                Datacard(
                    id = "cust_guard",
                    name = "Custodian Guard",
                    type = "Battleline",
                    points = 225,
                    squadSize = "5 models",
                    stats = UnitStats("6\"", 6, "2+", 3, "6+", 2, "4+"),
                    abilities = AbilitiesBlock(
                        faction = listOf("Martial Ka\'tah"),
                        datasheet = listOf(
                            DatasheetAbility("Praesidium Shield", "If equipped, increase Wounds characteristic by 1."),
                            DatasheetAbility("Sentinel Blades", "Reroll Wound rolls of 1 (reroll all wound rolls if on objectives).")
                        )
                    ),
                    weapons = WeaponsBlock(
                        ranged = listOf(Weapon("Guardian Spear (Ranged)", "24\"", "2", "2+", 4, -1, "2")),
                        melee = listOf(Weapon("Guardian Spear (Melee)", "Melee", "5", "2+", 7, -2, "2"))
                    ),
                    keywords = listOf("Infantry", "Battleline", "Custodian Guard")
                )
            )
        )
    )

    fun getFactionById(id: String): Faction? {
        return FACTIONS.find { it.id == id }
    }
}
