import type { Level, WordEntry } from "./types";

import A1 from "../data/A1.json";
import A2 from "../data/A2.json";
import B1 from "../data/B1.json";
import B2 from "../data/B2.json";
import C1 from "../data/C1.json";

const wordsByLevel = {
  A1: A1 as WordEntry[],
  A2: A2 as WordEntry[],
  B1: B1 as WordEntry[],
  B2: B2 as WordEntry[],
  C1: C1 as WordEntry[],
};

export function getWordsByLevel(level: Level): WordEntry[] {
  switch (level) {
    case "A1":
      return [...wordsByLevel.A1];
    case "A2":
      return [...wordsByLevel.A2];
    case "B1":
      return [...wordsByLevel.B1];
    case "B2":
      return [...wordsByLevel.B2];
    case "C1":
      return [...wordsByLevel.C1];
    case "A1-A2":
      return [...wordsByLevel.A1, ...wordsByLevel.A2];
    case "A1-B1":
      return [...wordsByLevel.A1, ...wordsByLevel.A2, ...wordsByLevel.B1];
    case "A1-B2":
      return [
        ...wordsByLevel.A1,
        ...wordsByLevel.A2,
        ...wordsByLevel.B1,
        ...wordsByLevel.B2,
      ];
    case "ALL":
      return [
        ...wordsByLevel.A1,
        ...wordsByLevel.A2,
        ...wordsByLevel.B1,
        ...wordsByLevel.B2,
        ...wordsByLevel.C1,
      ];
    default:
      return [];
  }
}

export function getWordCountByLevel(level: Level): number {
  return getWordsByLevel(level).length;
}