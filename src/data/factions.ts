/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Faction } from "../types";
import { spaceMarines } from "./factions/spaceMarines";
import { tyranids } from "./factions/tyranids";
import { necrons } from "./factions/necrons";
import { aeldari } from "./factions/aeldari";
import { orks } from "./factions/orks";
import { chaosSpaceMarines } from "./factions/chaosSpaceMarines";
import { astraMilitarum } from "./factions/astraMilitarum";
import { adeptusCustodes } from "./factions/adeptusCustodes";

export const FACTIONS: Faction[] = [
  spaceMarines,
  tyranids,
  necrons,
  aeldari,
  orks,
  chaosSpaceMarines,
  astraMilitarum,
  adeptusCustodes
];
