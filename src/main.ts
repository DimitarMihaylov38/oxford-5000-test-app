
import { getWordsByLevel } from "./core/words";
import { calculateResult, evaluateAnswer, generateQuestions } from "./core/testEngine";
import { saveHistoryItem, saveLastResult, saveWrongAnswers } from "./core/storage";
import type { Level, UserAnswer, WordEntry } from "./core/types";
import { appState, resetAppState } from "./state/appState";
import { renderDictionaryDetails } from "./ui/renderDictionary";
import { renderHomeScreen } from "./ui/renderHome";
import { renderDictionaryLevelsScreen } from "./ui/renderDictionaryLevels";
import { renderDictionaryScreen as renderDictionaryScreenView } from "./ui/renderDictionaryScreen";
import { renderResultScreen as renderResultScreenView } from "./ui/renderResult";
import { renderTestScreen as renderTestScreenView } from "./ui/renderTest";

let isSubmittingAnswer = false;

const app = document.querySelector<HTMLDivElement>("#app")!;

if (!app) {
  throw new Error("App root #app not found");
}

function getCurrentQuestion() {
  return appState.questions[appState.currentIndex] || null;
}

function startTest(level: Level) {
  const questions = generateQuestions(level);

  appState.screen = "test";
  appState.selectedLevel = level;
  appState.questions = questions;
  appState.currentIndex = 0;
  appState.answers = [];
  appState.result = null;

  renderTestScreen();
}

function openDictionary(level: Level) {
  const words = getWordsByLevel(level);

  appState.screen = "dictionary";
  appState.selectedLevel = level;
  appState.dictionaryWords = words;
  appState.dictionaryQuery = "";
  appState.questions = [];
  appState.currentIndex = 0;
  appState.answers = [];
  appState.result = null;

  renderDictionaryScreen();
}

function openDictionaryLevels() {
  appState.screen = "dictionary-levels";
  appState.selectedLevel = null;
  appState.dictionaryWords = [];
  appState.questions = [];
  appState.currentIndex = 0;
  appState.answers = [];
  appState.result = null;

  renderDictionaryLevelsScreen(app, {
    openDictionary,
    renderHome: () =>
      renderHomeScreen(app, {
        startTest,
        openDictionaryLevels,
      }),
  });
}

function showAnswerFeedback(isCorrect: boolean) {
  const overlay = document.createElement("div");
  overlay.className = "feedback-overlay";

  const icon = document.createElement("div");
  icon.className = `feedback-icon ${
    isCorrect ? "feedback-success" : "feedback-error"
  }`;
  icon.textContent = isCorrect ? "✓" : "✕";

  overlay.appendChild(icon);
  document.body.appendChild(overlay);

  setTimeout(() => {
    overlay.remove();
  }, 200);
}

function submitAnswer(userAnswer: string) {
  if (isSubmittingAnswer) return;

  const question = getCurrentQuestion();
  if (!question || !appState.selectedLevel) return;

  isSubmittingAnswer = true;

  const answer = evaluateAnswer(question, userAnswer);
  appState.answers.push(answer);

  showAnswerFeedback(answer.isCorrect);

  const isLastQuestion = appState.currentIndex >= appState.questions.length - 1;

  setTimeout(() => {
    if (isLastQuestion) {
      isSubmittingAnswer = false;
      finishTest();
      return;
    }

    appState.currentIndex += 1;
    isSubmittingAnswer = false;
    renderTestScreen();
  }, 100);
}

function finishTest() {
  if (!appState.selectedLevel) return;

  const result = calculateResult(appState.selectedLevel, appState.answers);

  appState.screen = "result";
  appState.result = result;

  saveLastResult(result);
  saveWrongAnswers(result.wrongAnswers);
  saveHistoryItem(result);

  renderResultScreen();
}

function retryWrongAnswers() {
  if (!appState.result || !appState.result.wrongAnswers.length) {
    renderHomeScreen(app, {
  startTest,
  openDictionaryLevels,
});
    return;
  }

  const retryQuestions = appState.result.wrongAnswers.map((item, index) => ({
    id: `retry_${index}_${item.word}`,
    word: item.word,
    pos: "",
    level: item.level,
    correctAnswer: item.correctAnswer,
    alternativeAnswers: item.alternativeAnswers || [],
  }));

  appState.screen = "test";
  appState.questions = retryQuestions;
  appState.currentIndex = 0;
  appState.answers = [];
  appState.result = null;

  renderTestScreen();
}

function renderTestScreen() {
  const question = getCurrentQuestion();
  const level = appState.selectedLevel;

  if (!question || !level) {
    renderHomeScreen(app, {
      startTest,
      openDictionaryLevels,
    });
    return;
  }

  const total = appState.questions.length;
  const currentNumber = appState.currentIndex + 1;

  renderTestScreenView(app, {
    level,
    question,
    currentNumber,
    total,
    isSubmittingAnswer,
    onRefresh: () => {
      resetAppState();
      renderHomeScreen(app, {
        startTest,
        openDictionaryLevels,
      });
    },
    onSubmit: (value: string) => {
      submitAnswer(value);
    },
  });
}

function createWrongAnswersHtml(wrongAnswers: UserAnswer[]): string {
  if (!wrongAnswers.length) {
    return `<p class="empty-state">Няма грешни думи.</p>`;
  }

  return wrongAnswers
    .map(
      (item) => `
        <div class="wrong-item">
          <div class="wrong-item-top">
            <strong>${item.word}</strong>
            <span class="wrong-level">${item.level}</span>
          </div>
          <p><span class="label">Твоят отговор:</span> ${item.userAnswer || "—"}</p>
          <p><span class="label">Правилен:</span> ${item.correctAnswer}</p>
        </div>
      `
    )
    .join("");
}

function renderResultScreen() {
  const result = appState.result;

  if (!result) {
    renderHomeScreen(app, {
      startTest,
      openDictionaryLevels,
    });
    return;
  }

  renderResultScreenView(app, {
    result,
    wrongAnswersHtml: createWrongAnswersHtml(result.wrongAnswers),
    onRetry: () => {
      retryWrongAnswers();
    },
    onHome: () => {
      resetAppState();
      renderHomeScreen(app, {
        startTest,
        openDictionaryLevels,
      });
    },
    onRefresh: () => {
      resetAppState();
      renderHomeScreen(app, {
        startTest,
        openDictionaryLevels,
      });
    },
  });
}

function normalizeSearchText(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/\u00A0/g, " ")
    .replace(/\s+/g, " ");
}

function filterDictionaryWords(words: WordEntry[], query: string): WordEntry[] {
  const normalizedQuery = normalizeSearchText(query);

  if (!normalizedQuery) {
    return words;
  }

  return words.filter((word) => {
    const english = normalizeSearchText(word.word);
    const bg = normalizeSearchText(word.bg || "");
    const alternatives = (word.bgAlternatives || [])
      .map((item) => normalizeSearchText(item))
      .join(" ");

    return (
      english.includes(normalizedQuery) ||
      bg.includes(normalizedQuery) ||
      alternatives.includes(normalizedQuery)
    );
  });
}

function renderDictionaryItem(word: WordEntry): string {
  const alternatives =
    word.bgAlternatives && word.bgAlternatives.length > 0
      ? word.bgAlternatives.join(", ")
      : "Няма";

  return `
    <details class="dictionary-list-item">
      <summary class="dictionary-list-summary">
        <span class="dictionary-list-word">${word.word}</span>
        <span class="dictionary-list-badge">${word.level}</span>
      </summary>

      <div class="dictionary-list-content">
        <p><span class="label">Word:</span> ${word.word}</p>
        <p><span class="label">POS:</span> ${word.pos || "—"}</p>
        <p><span class="label">Level:</span> ${word.level}</p>
        <p><span class="label">Основен превод:</span> ${word.bg || "—"}</p>
        <p><span class="label">Други преводи:</span> ${alternatives}</p>
      </div>
    </details>
  `;
}

function renderDictionaryScreen() {
  const level = appState.selectedLevel;
  const words = appState.dictionaryWords;

  if (!level) {
    renderHomeScreen(app, {
      startTest,
      openDictionaryLevels,
    });
    return;
  }

  const filteredWords = filterDictionaryWords(words, appState.dictionaryQuery);

  renderDictionaryScreenView(app, level, {
    query: appState.dictionaryQuery,
    filteredWords,
    allWordsCount: words.length,
    renderDictionaryItem,
    onBack: () => {
      resetAppState();
      renderHomeScreen(app, {
        startTest,
        openDictionaryLevels,
      });
    },
    onRefresh: () => {
      resetAppState();
      renderHomeScreen(app, {
        startTest,
        openDictionaryLevels,
      });
    },
    onSearchChange: (value: string) => {
      appState.dictionaryQuery = value;
      renderDictionaryScreen();
    },
  });
}

renderHomeScreen(app, {
  startTest,
  openDictionaryLevels,
});