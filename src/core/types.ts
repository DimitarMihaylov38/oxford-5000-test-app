export type Level =
  | "A1"
  | "A2"
  | "B1"
  | "B2"
  | "C1"
  | "A1-A2"
  | "A1-B1"
  | "A1-B2"
  | "ALL";

export type BaseLevel = "A1" | "A2" | "B1" | "B2" | "C1";

export type WordEntry = {
  word: string;
  pos: string;
  level: BaseLevel;
  bg: string;
  bgAlternatives: string[];
  source?: string;
};

export type TestQuestion = {
  id: string;
  word: string;
  pos: string;
  level: BaseLevel;
  correctAnswer: string;
  alternativeAnswers: string[];
};

export type UserAnswer = {
  questionId: string;
  word: string;
  pos: string;
  level: BaseLevel;
  userAnswer: string;
  correctAnswer: string;
  alternativeAnswers: string[];
  isCorrect: boolean;
};

export type TestResult = {
  selectedLevel: Level;
  total: number;
  correct: number;
  wrong: number;
  percentage: number;
  answers: UserAnswer[];
  wrongAnswers: UserAnswer[];
  createdAt: string;
};