import { STORAGE_KEYS } from "./constants";
import type { TestResult, UserAnswer } from "./types";

export function saveLastResult(result: TestResult): void {
  localStorage.setItem(STORAGE_KEYS.lastResult, JSON.stringify(result));
}

export function getLastResult(): TestResult | null {
  const raw = localStorage.getItem(STORAGE_KEYS.lastResult);

  if (!raw) return null;

  try {
    return JSON.parse(raw) as TestResult;
  } catch {
    return null;
  }
}

export function saveWrongAnswers(wrongAnswers: UserAnswer[]): void {
  localStorage.setItem(
    STORAGE_KEYS.wrongAnswers,
    JSON.stringify(wrongAnswers)
  );
}

export function getWrongAnswers(): UserAnswer[] {
  const raw = localStorage.getItem(STORAGE_KEYS.wrongAnswers);

  if (!raw) return [];

  try {
    return JSON.parse(raw) as UserAnswer[];
  } catch {
    return [];
  }
}

export function saveHistoryItem(result: TestResult): void {
  const history = getHistory();

  history.unshift(result);

  localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(history));
}

export function getHistory(): TestResult[] {
  const raw = localStorage.getItem(STORAGE_KEYS.history);

  if (!raw) return [];

  try {
    return JSON.parse(raw) as TestResult[];
  } catch {
    return [];
  }
}

export function clearAllStorage(): void {
  localStorage.removeItem(STORAGE_KEYS.lastResult);
  localStorage.removeItem(STORAGE_KEYS.wrongAnswers);
  localStorage.removeItem(STORAGE_KEYS.history);
}