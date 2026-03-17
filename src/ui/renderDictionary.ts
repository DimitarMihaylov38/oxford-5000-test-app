import type { BaseLevel } from "../core/types";

type DictionaryEntryView = {
  word: string;
  pos: string;
  level: BaseLevel;
  bg: string;
  bgAlternatives: string[];
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function renderDictionaryDetails(
  entry: DictionaryEntryView,
  summaryLabel: string = "Провери в речника"
): string {
  const alternatives =
    entry.bgAlternatives.length > 0
      ? entry.bgAlternatives.map(escapeHtml).join(", ")
      : "Няма";

  return `
    <details class="dictionary-details">
      <summary class="dictionary-summary">${escapeHtml(summaryLabel)}</summary>

      <div class="dictionary-card">
        <div class="dictionary-row">
          <span class="dictionary-label">Word:</span>
          <strong>${escapeHtml(entry.word)}</strong>
        </div>

        <div class="dictionary-row">
          <span class="dictionary-label">POS:</span>
          <span>${escapeHtml(entry.pos || "—")}</span>
        </div>

        <div class="dictionary-row">
          <span class="dictionary-label">Level:</span>
          <span>${escapeHtml(entry.level)}</span>
        </div>

        <div class="dictionary-row">
          <span class="dictionary-label">Основен превод:</span>
          <span>${escapeHtml(entry.bg || "—")}</span>
        </div>

        <div class="dictionary-row">
          <span class="dictionary-label">Други преводи:</span>
          <span>${alternatives}</span>
        </div>
      </div>
    </details>
  `;
}