import type { Level } from "../core/types";
import { APP_TITLE } from "../core/constants";
import { resetAppState, appState } from "../state/appState";

type RenderHomeDeps = {
  startTest: (level: Level) => void;
  openDictionaryLevels: () => void;
};

export function renderHomeScreen(app: HTMLElement, deps: RenderHomeDeps) {
  appState.screen = "home";

  app.innerHTML = `
    <main class="screen screen-home">
      <header class="app-header">
        <div class="header-top">
          <h1 class="app-title">${APP_TITLE}</h1>
          <button class="refresh-btn" id="refresh-btn" type="button">↻</button>
        </div>

        <p class="app-subtitle">
          Това приложение използва думите от Oxford 3000 и Oxford 5000 word lists –
          над 4500 английски думи, подредени по CEFR нива A1–C1.
          Избери ниво и тествай знанията си.
        </p>
      </header>

      <section class="card">
        <h2 class="section-title">Избери ниво за тест</h2>

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
          <button id="open-dictionary-btn" class="secondary-btn" type="button">
            Отвори речник
          </button>
        </div>
      </section>

      <footer class="app-source">
        Source: Oxford 3000™ and Oxford 5000™ word lists
        (Oxford Learner's Dictionaries)
      </footer>
    </main>
  `;

  const refreshBtn = document.querySelector<HTMLButtonElement>("#refresh-btn");
  const dictionaryBtn = document.querySelector<HTMLButtonElement>("#open-dictionary-btn");
  const levelButtons = document.querySelectorAll<HTMLButtonElement>(".level-btn");

  refreshBtn?.addEventListener("click", () => {
    resetAppState();
    window.location.reload();
  });

  levelButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const level = btn.dataset.level as Level;
      deps.startTest(level);
    });
  });

  dictionaryBtn?.addEventListener("click", () => {
    deps.openDictionaryLevels();
  });
}