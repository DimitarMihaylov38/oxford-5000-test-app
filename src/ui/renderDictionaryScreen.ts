import { APP_TITLE } from "../core/constants";
import type { Level, WordEntry } from "../core/types";

type RenderDictionaryScreenDeps = {
  query: string;
  filteredWords: WordEntry[];
  allWordsCount: number;
  renderDictionaryItem: (word: WordEntry) => string;
  onBack: () => void;
  onRefresh: () => void;
  onSearchChange: (value: string) => void;
};

export function renderDictionaryScreen(
  app: HTMLElement,
  level: Level,
  deps: RenderDictionaryScreenDeps
) {
  const wordsHtml = deps.filteredWords.map(deps.renderDictionaryItem).join("");

  app.innerHTML = `
    <main class="screen screen-dictionary level-${level.toLowerCase()}">
      <header class="app-header">
        <div class="header-top">
          <h1 class="app-title">${APP_TITLE}</h1>
          <button class="refresh-btn" id="refresh-btn" type="button">↻</button>
        </div>
        <p class="app-subtitle">
          Речник за ниво ${level} • ${deps.filteredWords.length} от ${deps.allWordsCount} думи
        </p>
      </header>

      <section class="card dictionary-screen-card">
        <div class="dictionary-top-actions">
          <button id="dictionary-home-btn" class="secondary-btn" type="button">
            Начало
          </button>
        </div>

        <div class="dictionary-search-wrap">
          <input
            id="dictionary-search-input"
            class="dictionary-search-input"
            type="text"
            placeholder="Търси дума или превод"
            value="${deps.query}"
            autocomplete="off"
          />
        </div>

        <div class="dictionary-list">
          ${
            deps.filteredWords.length > 0
              ? wordsHtml
              : `<p class="empty-state">Няма намерени думи за това търсене.</p>`
          }
        </div>
      </section>
    </main>
  `;

  const refreshBtn = document.querySelector<HTMLButtonElement>("#refresh-btn");
  const homeBtn = document.querySelector<HTMLButtonElement>("#dictionary-home-btn");
  const searchInput = document.querySelector<HTMLInputElement>("#dictionary-search-input");

  refreshBtn?.addEventListener("click", () => {
    deps.onRefresh();
  });

  homeBtn?.addEventListener("click", () => {
    deps.onBack();
  });

  searchInput?.addEventListener("input", () => {
    deps.onSearchChange(searchInput.value || "");
  });

  searchInput?.focus();

  const valueLength = searchInput?.value.length ?? 0;
  if (searchInput && valueLength > 0) {
    searchInput.setSelectionRange(valueLength, valueLength);
  }
}