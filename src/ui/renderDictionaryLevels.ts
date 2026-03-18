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
          <button class="level-btn" data-level="A1" style="background:#facc15; color:#111827;">A1</button>
          <button class="level-btn" data-level="A2" style="background:#fb923c; color:#111827;">A2</button>
          <button class="level-btn" data-level="B1" style="background:#ef4444; color:#ffffff;">B1</button>
          <button class="level-btn" data-level="B2" style="background:#f472b6; color:#ffffff;">B2</button>
          <button class="level-btn" data-level="C1" style="background:#a855f7; color:#ffffff;">C1</button>

          <button
            class="level-btn"
            data-level="A1-A2"
            style="background: linear-gradient(135deg, #fde68a 0%, #fb923c 100%); color: #111827;"
          >
            A1-A2
          </button>

          <button
            class="level-btn"
            data-level="A1-B1"
            style="background: linear-gradient(135deg, #fde68a 0%, #fb923c 45%, #ef4444 100%); color: #ffffff;"
          >
            A1-B1
          </button>

          <button
            class="level-btn"
            data-level="A1-B2"
            style="background: linear-gradient(135deg, #fde68a 0%, #fb923c 30%, #ef4444 65%, #f472b6 100%); color: #ffffff;"
          >
            A1-B2
          </button>

          <button
            class="level-btn"
            data-level="ALL"
            style="background: linear-gradient(135deg, #fde68a 0%, #fb923c 25%, #ef4444 50%, #f472b6 75%, #a855f7 100%); color: #111827;"
          >
            ALL
          </button>
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