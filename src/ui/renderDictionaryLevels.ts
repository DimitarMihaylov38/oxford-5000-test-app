import type { Level } from "../core/types";
import { APP_TITLE } from "../core/constants";
import { resetAppState } from "../state/appState";

type RenderDictionaryLevelsDeps = {
  openDictionary: (level: Level) => void;
  renderHome: () => void;
};

export function renderDictionaryLevelsScreen(
  app: HTMLElement,
  deps: RenderDictionaryLevelsDeps
) {
  app.innerHTML = `
    <main class="screen screen-home">
      <header class="app-header">
        <div class="header-top">
          <h1 class="app-title">${APP_TITLE}</h1>
          <button class="refresh-btn" id="refresh-btn" type="button">↻</button>
        </div>
        <p class="app-subtitle">Избери ниво за речников преглед.</p>
      </header>

      <section class="card">
        <h2 class="section-title">Речник по нива</h2>

        <div class="level-grid">
          <button class="level-btn level-a1" data-level="A1">A1</button>
          <button class="level-btn level-a2" data-level="A2">A2</button>
          <button class="level-btn level-b1" data-level="B1">B1</button>
          <button class="level-btn level-b2" data-level="B2">B2</button>
          <button class="level-btn level-c1" data-level="C1">C1</button>
          <button class="level-btn level-a1-a2" data-level="A1-A2">A1-A2</button>
          <button class="level-btn level-a1-b1" data-level="A1-B1">A1-B1</button>
          <button class="level-btn level-a1-b2" data-level="A1-B2">A1-B2</button>
          <button class="level-btn level-all" data-level="ALL">ALL</button>
        </div>

        <div class="home-actions">
          <button id="dictionary-back-btn" class="secondary-btn" type="button">
            Назад
          </button>
        </div>
      </section>
    </main>
  `;

  const refreshBtn = document.querySelector<HTMLButtonElement>("#refresh-btn");
  const backBtn = document.querySelector<HTMLButtonElement>("#dictionary-back-btn");
  const levelButtons = document.querySelectorAll<HTMLButtonElement>(".level-btn");

  refreshBtn?.addEventListener("click", () => {
    resetAppState();
    deps.renderHome();
  });

  backBtn?.addEventListener("click", () => {
    resetAppState();
    deps.renderHome();
  });

  levelButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const level = btn.dataset.level as Level;
      deps.openDictionary(level);
    });
  });
}