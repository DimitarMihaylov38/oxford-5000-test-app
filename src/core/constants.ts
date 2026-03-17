import type { BaseLevel, Level } from "./types";

export const APP_TITLE = "Oxford 5000 Test";
export const TEST_SIZE = 100;

export const LEVELS: Level[] = [
  "A1",
  "A2",
  "B1",
  "B2",
  "C1",
  "A1-A2",
  "A1-B1",
  "A1-B2",
  "ALL",
];

export const BASE_LEVELS: BaseLevel[] = ["A1", "A2", "B1", "B2", "C1"];

export const LEVEL_COLORS: Record<Level, string> = {
  A1: "#facc15",
  A2: "#fb923c",
  B1: "#ef4444",
  B2: "#f472b6",
  C1: "#a855f7",
  "A1-A2": "linear-gradient(135deg, #facc15 0%, #fb923c 100%)",
  "A1-B1": "linear-gradient(135deg, #facc15 0%, #fb923c 45%, #ef4444 100%)",
  "A1-B2": "linear-gradient(135deg, #facc15 0%, #fb923c 30%, #ef4444 65%, #f472b6 100%)",
  ALL: "linear-gradient(135deg, #facc15 0%, #fb923c 25%, #ef4444 50%, #f472b6 75%, #a855f7 100%)",
};

export const STORAGE_KEYS = {
  lastResult: "oxford_last_result",
  wrongAnswers: "oxford_wrong_answers",
  history: "oxford_history",
} as const;