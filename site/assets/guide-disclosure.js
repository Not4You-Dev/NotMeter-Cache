(() => {
  "use strict";

  const labels = {
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
  };
  const controls = new WeakMap();
  let currentLabels = labels.en;

  function apply(locale) {
    currentLabels = labels[locale] || labels.en;
    for (const details of document.querySelectorAll(".guide-disclosure > details")) {
      let label = controls.get(details);
      if (!label) {
        const summary = details.querySelector(":scope > summary");
        const arrow = summary?.querySelector(".weekly-guide-toggle");
        if (!arrow) continue;
        const action = document.createElement("span");
        action.className = "guide-disclosure-action";
        action.setAttribute("aria-hidden", "true");
        label = document.createElement("span");
        summary.append(action);
        action.append(label, arrow);
        controls.set(details, label);
        details.addEventListener("toggle", () => {
          label.textContent = currentLabels[Number(details.open)];
        });
      }
      label.textContent = currentLabels[Number(details.open)];
    }
  }

  window.NotMeterGuideDisclosure = { apply };
})();
