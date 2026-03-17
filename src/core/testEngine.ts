import type {
  BaseLevel,
  Level,
  TestQuestion,
  TestResult,
  UserAnswer,
  WordEntry,
} from "./types";
import { TEST_SIZE } from "./constants";
import { isAnswerCorrect } from "./normalize";
import { getWordsByLevel } from "./words";

function shuffleArray<T>(items: T[]): T[] {
  const arr = [...items];

  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  return arr;
}

function createQuestionId(word: WordEntry, index: number): string {
  return `${word.level}_${word.word}_${index}`;
}

function buildQuestion(item: WordEntry, index: number): TestQuestion {
  return {
    id: createQuestionId(item, index),
    word: item.word,
    pos: item.pos,
    level: item.level,
    correctAnswer: item.bg,
    alternativeAnswers: item.bgAlternatives || [],
  };
}

function takeRandomWords(words: WordEntry[], count: number): WordEntry[] {
  return shuffleArray(words).slice(0, count);
}

function generateBalancedQuestions(levels: BaseLevel[]): TestQuestion[] {
  const perLevel = Math.floor(TEST_SIZE / levels.length);
  const remainder = TEST_SIZE % levels.length;

  const selected: WordEntry[] = [];

  levels.forEach((level, index) => {
    const extra = index < remainder ? 1 : 0;
    const count = perLevel + extra;
    const words = getWordsByLevel(level);
    selected.push(...takeRandomWords(words, count));
  });

  return shuffleArray(selected).map(buildQuestion);
}

export function generateQuestions(
  levelOrWords: Level | WordEntry[],
  size: number = TEST_SIZE
): TestQuestion[] {
  if (typeof levelOrWords === "string") {
    switch (levelOrWords) {
      case "ALL":
        return generateBalancedQuestions(["A1", "A2", "B1", "B2", "C1"]);
      case "A1-A2":
        return generateBalancedQuestions(["A1", "A2"]);
      case "A1-B1":
        return generateBalancedQuestions(["A1", "A2", "B1"]);
      case "A1-B2":
        return generateBalancedQuestions(["A1", "A2", "B1", "B2"]);
      default: {
        const words = getWordsByLevel(levelOrWords);
        return takeRandomWords(words, size).map(buildQuestion);
      }
    }
  }

  return takeRandomWords(levelOrWords, size).map(buildQuestion);
}

export function evaluateAnswer(
  question: TestQuestion,
  userAnswer: string
): UserAnswer {
  const correct = isAnswerCorrect(
    userAnswer,
    question.correctAnswer,
    question.alternativeAnswers
  );

  return {
    questionId: question.id,
    word: question.word,
    pos: question.pos,
    level: question.level,
    userAnswer,
    correctAnswer: question.correctAnswer,
    alternativeAnswers: question.alternativeAnswers,
    isCorrect: correct,
  };
}

export function calculateResult(
  selectedLevel: Level,
  answers: UserAnswer[]
): TestResult {
  const correct = answers.filter((a) => a.isCorrect).length;
  const wrongAnswers = answers.filter((a) => !a.isCorrect);
  const wrong = wrongAnswers.length;
  const total = answers.length;
  const percentage = total === 0 ? 0 : Math.round((correct / total) * 100);

  return {
    selectedLevel,
    total,
    correct,
    wrong,
    percentage,
    answers,
    wrongAnswers,
    createdAt: new Date().toISOString(),
  };
}