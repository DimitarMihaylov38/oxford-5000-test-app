import { APP_TITLE } from "../core/constants";
import type { Level, TestQuestion } from "../core/types";
import { renderDictionaryDetails } from "./renderDictionary";

type RenderTestDeps = {
  level: Level;
  question: TestQuestion;
  currentNumber: number;
  total: number;
  onRefresh: () => void;
  onSubmit: (value: string) => void;
  isSubmittingAnswer: boolean;
};

export function renderTestScreen(app: HTMLElement, deps: RenderTestDeps) {
  const { level, question, currentNumber, total } = deps;

  app.innerHTML = `
    <main class="screen screen-test level-${level.toLowerCase()}">
      <header class="app-header">
        <div class="header-top">
          <h1 class="app-title">${APP_TITLE}</h1>
          <button class="refresh-btn" id="refresh-btn" type="button">↻</button>
        </div>
        <p class="progress-text">Въпрос ${currentNumber} от ${total}</p>
      </header>

      <section class="card test-card">
        <p class="question-level">${question.level}</p>
        <h2 class="question-word">${question.word}</h2>
        <p class="question-pos">${question.pos}</p>

        <input
          id="answer-input"
          class="answer-input"
          type="text"
          placeholder="Напиши превода на български"
          autocomplete="off"
        />

        <button id="next-btn" class="primary-btn" type="button">
          ${currentNumber === total ? "Завърши" : "Следваща"}
        </button>

        ${renderDictionaryDetails({
          word: question.word,
          pos: question.pos,
          level: question.level,
          bg: question.correctAnswer,
          bgAlternatives: question.alternativeAnswers,
        })}
      </section>
    </main>
  `;

  const refreshBtn = document.querySelector<HTMLButtonElement>("#refresh-btn");
  const input = document.querySelector<HTMLInputElement>("#answer-input");
  const nextBtn = document.querySelector<HTMLButtonElement>("#next-btn");

  refreshBtn?.addEventListener("click", () => {
    deps.onRefresh();
  });

  nextBtn?.addEventListener("click", () => {
    if (deps.isSubmittingAnswer) return;
    deps.onSubmit(input?.value || "");
  });

  input?.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (deps.isSubmittingAnswer) return;
      deps.onSubmit(input?.value || "");
    }
  });

  input?.focus();
}