(() => {
  "use strict";

  const labels = (globalThis.NotMeterI18n?.withVietnamese || (copy => copy))({
    ko: ["자세히 보기", "접기"],
    en: ["Show details", "Hide details"],
    "zh-TW": ["查看詳情", "收起詳情"],
    "ja-JP": ["詳しく見る", "閉じる"],
    "de-DE": ["Details anzeigen", "Details ausblenden"],
    "fr-FR": ["Voir les détails", "Masquer les détails"],
    "es-ES": ["Ver detalles", "Ocultar detalles"],
    "pt-BR": ["Ver detalhes", "Ocultar detalhes"],
    "ru-RU": ["Подробнее", "Свернуть"],
    th: ["ดูรายละเอียด", "ซ่อนรายละเอียด"],
  });
  const actions = (globalThis.NotMeterI18n?.withVietnamese || (copy => copy))({
    ko: ["등록 기준 확인", "랭커 혜택 확인"],
    en: ["Check eligibility", "Explore ranker rewards"],
    "zh-TW": ["查看登錄條件", "查看排名獎勵"],
    "ja-JP": ["登録条件を確認", "ランカー特典を確認"],
    "de-DE": ["Teilnahmebedingungen", "Rangbelohnungen ansehen"],
    "fr-FR": ["Conditions de classement", "Voir les récompenses"],
    "es-ES": ["Requisitos de clasificación", "Ver recompensas"],
    "pt-BR": ["Requisitos de classificação", "Ver recompensas"],
    "ru-RU": ["Условия попадания в рейтинг", "Награды за рейтинг"],
    th: ["ดูเงื่อนไขการจัดอันดับ", "ดูรางวัลอันดับ"],
  });
  const controls = new WeakMap();
  const observed = new WeakSet();
  const observer = typeof IntersectionObserver === "function" ? new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add("guide-discovered", "guide-attention");
      observer.unobserve(entry.target);
    }
  }, { threshold: 0.35 }) : null;
  let currentLabels = labels.en;
  let currentActions = actions.en;

  function labelFor(details) {
    if (details.open) return currentLabels[1];
    const id = details.parentElement.id;
    if (id === "ranking-entry-guide") return currentActions[0];
    if (id === "ranker-dungeon-guide") return currentActions[1];
    return currentLabels[0];
  }

  function apply(locale) {
    currentLabels = labels[locale] || labels.en;
    currentActions = actions[locale] || actions.en;
    for (const details of document.querySelectorAll(".guide-disclosure > details")) {
      let label = controls.get(details);
      if (!label) {
        const summary = details.querySelector(":scope > summary");
        const arrow = summary?.querySelector(".weekly-guide-toggle");
        if (!arrow) continue;
        const action = document.createElement("span");
        action.className = "guide-disclosure-action";
        label = document.createElement("span");
        summary.append(action);
        action.append(label, arrow);
        controls.set(details, label);
        details.addEventListener("toggle", () => {
          label.textContent = labelFor(details);
          if (details.open) details.parentElement.classList.remove("guide-attention");
        });
      }
      label.textContent = labelFor(details);
      const guide = details.parentElement;
      if (observer && !observed.has(guide)) {
        observed.add(guide);
        guide.addEventListener("animationend", event => {
          if (event.animationName === "guide-discovery-sweep") guide.classList.remove("guide-attention");
        });
        observer.observe(guide);
      }
    }
  }

  window.NotMeterGuideDisclosure = { apply };
})();
