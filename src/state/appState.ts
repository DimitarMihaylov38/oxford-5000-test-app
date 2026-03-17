import type { Level, TestQuestion, TestResult, UserAnswer, WordEntry } from "../core/types";

export type AppScreen =
  | "home"
  | "test"
  | "result"
  | "retry"
  | "dictionary"
  | "dictionary-levels";

export type AppState = {
  screen: AppScreen;
  selectedLevel: Level | null;
  questions: TestQuestion[];
  dictionaryWords: WordEntry[];
  dictionaryQuery: string;
  currentIndex: number;
  answers: UserAnswer[];
  result: TestResult | null;
};

export const appState: AppState = {
  screen: "home",
  selectedLevel: null,
  questions: [],
  dictionaryWords: [],
  dictionaryQuery: "",
  currentIndex: 0,
  answers: [],
  result: null,
};

export function resetAppState(): void {
  appState.screen = "home";
  appState.selectedLevel = null;
  appState.questions = [];
  appState.currentIndex = 0;
  appState.dictionaryQuery = "";
  appState.answers = [];
  appState.result = null;
}