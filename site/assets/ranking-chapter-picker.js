(() => {
  "use strict";

  const labels = {
    ko: ["챕터", "예정"], en: ["Chapter", "Upcoming"], "zh-TW": ["章節", "即將開放"],
    ja: ["チャプター", "予定"], de: ["Kapitel", "Demnächst"], fr: ["Chapitre", "À venir"],
    es: ["Capítulo", "Próximamente"], pt: ["Capítulo", "Em breve"], ru: ["Глава", "Скоро"],
    vi: ["Chương", "Sắp tới"], th: ["บทที่", "เร็ว ๆ นี้"],
  };

  class RankingChapterPicker extends HTMLElement {
    constructor() {
      super();
      const root = this.attachShadow({ mode: "open" });
      root.innerHTML = `<style>
        :host { display: inline-flex; flex: none; vertical-align: middle; }
        :host([hidden]) { display: none; }
        select { color-scheme: dark; font: inherit; font-size: 13px; font-weight: 600; cursor: pointer;
          height: var(--chapter-control-height, 36px); field-sizing: content; padding: 0 28px 0 12px; color: var(--fg, #e9edf2);
          background: var(--panel-2, #161e29); border: 1px solid var(--line-2, #39424e);
          border-radius: 6px; appearance: none; }
        label { position: relative; display: inline-flex; max-width: 100%; }
        label::after { content: ""; position: absolute; right: 13px; top: 45%; width: 6px; height: 6px;
          border: solid var(--fg-2, #a3adba); border-width: 0 1.5px 1.5px 0; transform: rotate(45deg); pointer-events: none; }
        select:hover { border-color: var(--fg-3, #788390); }
        select:focus-visible { outline: 2px solid var(--fg-2, #a3adba); outline-offset: -2px; }
      </style><label><select></select></label>`;
      this.select = root.querySelector("select");
      this.select.addEventListener("change", () => {
        const next = this.select.selectedOptions[0];
        if (!next || next.disabled || !this.available?.includes(next.value) || next.value === this.chapter) return;
        this.dispatchEvent(new CustomEvent("notmeter:ranking-chapter-select", {
          bubbles: true, composed: true, detail: { chapter: next.value },
        }));
      });
    }

    update(chapter, upcoming, locale, available = [chapter]) {
      const choices = [...new Set(available.filter(id => id === "1-1" || id === "1-2"))];
      const choicesKey = choices.join("|");
      if (this.chapter === chapter && this.upcoming === upcoming && this.lang === locale && this.choicesKey === choicesKey) return;
      this.chapter = chapter;
      this.available = choices;
      this.choicesKey = choicesKey;
      this.upcoming = upcoming;
      this.lang = locale;
      this.hidden = !chapter;
      if (!chapter) {
        this.select.replaceChildren();
        this.select.removeAttribute("data-ranking-chapter");
        return;
      }
      const [name, pending] = labels[locale] || labels[locale.split("-")[0]] || labels.en;
      this.select.setAttribute("aria-label", name);
      this.select.dataset.rankingChapter = chapter;
      this.select.replaceChildren(...choices.map(id => new Option(`${name} ${id}`, id, id === chapter, id === chapter)));
      if (upcoming && !choices.includes(upcoming)) {
        const next = new Option(`${name} ${upcoming} · ${pending}`, upcoming);
        next.disabled = true;
        this.select.add(next);
      }
    }
  }
  customElements.define("notmeter-ranking-chapter", RankingChapterPicker);
})();
