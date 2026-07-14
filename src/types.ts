/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Weapon {
  name: string;
  range: string; // e.g., "24\"" or "Melee"
  attacks: string; // e.g., "4" or "D6" or "D3+3"
  skill: string; // BS or WS, e.g., "3+" or "4+"
  strength: number;
  ap: number; // AP, e.g., 0, -1, -2, -4
  damage: string; // e.g., "1" or "2" or "D3" or "D6"
  abilities?: string[]; // e.g., ["Assault", "Rapid Fire 1", "Lethal Hits"]
}

export interface UnitStats {
  m: string; // Movement, e.g., "6\""
  t: number; // Toughness
  sv: string; // Save, e.g., "3+"
  w: number; // Wounds
  ld: string; // Leadership, e.g., "6+"
  oc: number; // Objective Control
  invul?: string; // Optional Invulnerable Save, e.g., "4+"
}

export interface Datacard {
  id: string;
  name: string;
  type: "Character" | "Battleline" | "Infantry" | "Mounted" | "Vehicle" | "Monster" | "Swarm" | "Fortification";
  points: number;
  squadSize: string; // e.g., "5 models" or "1 model" or "10-20 models"
  stats: UnitStats;
  abilities: {
    core?: string[];
    faction?: string[];
    datasheet: { name: string; description: string }[];
  };
  weapons: {
    ranged: Weapon[];
    melee: Weapon[];
  };
  keywords: string[];
}

export interface DetachmentRule {
  name: string;
  description: string;
  benefit: string;
  stratagems: { name: string; cost: number; phase: string; effect: string }[];
  enhancements: { name: string; points: number; description: string }[];
}

export interface Faction {
  id: string;
  name: string;
  iconName: string; // Corresponds to Lucide-React icons
  description: string;
  overview: {
    playstyle: string;
    strengths: string[];
    weaknesses: string[];
  };
  factionRule: {
    name: string;
    description: string;
  };
  detachment: DetachmentRule;
  units: Datacard[];
}

export interface RosterItem {
  id: string; // Unique instance ID for the list
  datacardId: string; // Refers to Datacard ID
  name: string;
  points: number;
  count: number; // Number of units of this squad size
  isWarlord?: boolean;
  enhancementName?: string;
  enhancementPoints?: number;
}

export interface ArmyRoster {
  id: string;
  name: string;
  factionId: string;
  pointsLimit: number; // 500, 1000, 2000, etc.
  items: RosterItem[];
  createdAt: string;
  detachmentName?: string;
  selectedStratagemNames?: string[];
  selectedEnhancementNames?: string[];
}

export type GamePhase = 
  | "SETUP" 
  | "COMMAND" 
  | "MOVEMENT" 
  | "SHOOTING" 
  | "CHARGE" 
  | "FIGHT" 
  | "BATTLESHOCK"
  | "CLEANUP";

export interface MatchLogEntry {
  id: string;
  timestamp: string;
  message: string;
  type: "system" | "score" | "phase" | "dice";
}

export interface MatchState {
  currentRound: number; // 1 to 5
  activePlayer: "Player 1" | "Player 2";
  phase: GamePhase;
  p1Name: string;
  p2Name: string;
  p1Faction: string;
  p2Faction: string;
  p1Vp: number;
  p2Vp: number;
  p1Cp: number;
  p2Cp: number;
  log: MatchLogEntry[];
}
