(() => {
  "use strict";
  const root = document.documentElement;
  const keys = {
    "first-guide": "notmeter.notice.first-guide.dismissed.v1",
    "meter-use": "notmeter.notice.meter-use.dismissed.v1",
  };
  const dismissed = {};
  const copy = {
    ko: "더 이상 보지 않기",
    en: "Don't show again",
    "zh-TW": "不再顯示",
    "ja-JP": "今後表示しない",
    "de-DE": "Nicht mehr anzeigen",
    "fr-FR": "Ne plus afficher",
    "es-ES": "No volver a mostrar",
    "pt-BR": "Não mostrar novamente",
    "ru-RU": "Больше не показывать",
  };

  function apply(name) {
    root.toggleAttribute(`data-hide-${name}`, dismissed[name]);
    document.querySelectorAll(`[data-site-notice="${name}"]`).forEach(node => {
      node.hidden = dismissed[name];
    });
  }

  // Set root flags before parsing the body to avoid flashing dismissed cards.
  for (const [name, key] of Object.entries(keys)) {
    try { dismissed[name] = localStorage.getItem(key) === "1"; }
    catch { dismissed[name] = false; }
    apply(name);
  }

  function renderLabels() {
    const locale = globalThis.NotMeterI18n?.normalize(root.lang) || root.lang;
    document.querySelectorAll("[data-dismiss-notice]").forEach(button => {
      button.textContent = copy[locale] || copy.en;
    });
  }

  function init() {
    Object.keys(keys).forEach(apply);
    renderLabels();
    new MutationObserver(renderLabels).observe(root, { attributes: true, attributeFilter: ["lang"] });
    document.querySelectorAll("[data-dismiss-notice]").forEach(button => {
      button.addEventListener("click", () => {
        const name = button.dataset.dismissNotice;
        if (!Object.hasOwn(keys, name)) return;
        const active = document.activeElement;
        const next = active === button ? [...document.querySelectorAll("a[href], button:not([disabled]), input:not([disabled]), select:not([disabled])")].find(node =>
          !node.closest(`[data-site-notice="${name}"]`) &&
          (active.compareDocumentPosition(node) & Node.DOCUMENT_POSITION_FOLLOWING) &&
          node.getClientRects().length && getComputedStyle(node).visibility !== "hidden") : null;
        dismissed[name] = true;
        try { localStorage.setItem(keys[name], "1"); } catch { /* Still dismiss for this visit. */ }
        apply(name);
        next?.focus({ preventScroll: true });
      });
    });
  }

  addEventListener("storage", event => {
    let storage;
    try { storage = localStorage; } catch { return; }
    if (event.storageArea !== storage) return;
    for (const [name, key] of Object.entries(keys)) {
      if (event.key !== key && event.key !== null) continue;
      dismissed[name] = event.key !== null && event.newValue === "1";
      apply(name);
    }
  });
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
