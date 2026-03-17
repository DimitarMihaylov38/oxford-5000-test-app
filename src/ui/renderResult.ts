import { APP_TITLE } from "../core/constants";
import type { TestResult, UserAnswer } from "../core/types";

type RenderResultDeps = {
  result: TestResult;
  wrongAnswersHtml: string;
  onRetry: () => void;
  onHome: () => void;
  onRefresh: () => void;
};

export function renderResultScreen(app: HTMLElement, deps: RenderResultDeps) {
  const { result } = deps;

  app.innerHTML = `
    <main class="screen screen-result">
      <header class="app-header">
        <div class="header-top">
          <h1 class="app-title">${APP_TITLE}</h1>
          <button class="refresh-btn" id="refresh-btn" type="button">↻</button>
        </div>
        <p class="app-subtitle">Резултат от теста</p>
      </header>

      <section class="card result-card">
        <div class="result-percentage">${result.percentage}%</div>
        <p class="result-line">Верни: ${result.correct}</p>
        <p class="result-line">Грешни: ${result.wrong}</p>
        <p class="result-line">Общо: ${result.total}</p>

        <div class="result-actions">
          <button id="retry-btn" class="primary-btn" type="button" ${
            result.wrongAnswers.length === 0 ? "disabled" : ""
          }>
            Пререши грешните
          </button>

          <button id="home-btn" class="secondary-btn" type="button">
            Начало
          </button>
        </div>
      </section>

      <section class="card wrong-list-card">
        <h2 class="section-title">Грешни думи</h2>
        <div class="wrong-list">
          ${deps.wrongAnswersHtml}
        </div>
      </section>
    </main>
  `;

  const refreshBtn = document.querySelector<HTMLButtonElement>("#refresh-btn");
  const retryBtn = document.querySelector<HTMLButtonElement>("#retry-btn");
  const homeBtn = document.querySelector<HTMLButtonElement>("#home-btn");

  refreshBtn?.addEventListener("click", () => {
    deps.onRefresh();
  });

  retryBtn?.addEventListener("click", () => {
    deps.onRetry();
  });

  homeBtn?.addEventListener("click", () => {
    deps.onHome();
  });
}