(() => {
  const link = document.getElementById("pet-tracker-button");
  if (!link) return;
  const labels = { ko: "펫 트래커", en: "Pet Tracker", "zh-TW": "寵物追蹤", "ja-JP": "ペットトラッカー", "de-DE": "Pet-Tracker", "fr-FR": "Suivi des familiers", "es-ES": "Seguimiento de mascotas", "pt-BR": "Rastreador de mascotes", "ru-RU": "Трекер питомцев", vi: "Theo dõi thú cưng", th: "ติดตามสัตว์เลี้ยง" };
  const update = () => {
    const requested = document.documentElement.lang;
    const locale = labels[requested] ? requested : globalThis.NotMeterI18n?.normalize(requested) || "en";
    link.querySelector("[data-pet-tracker-label]").textContent = labels[locale] || labels.en;
    link.href = `./pet-tracker.html?lang=${encodeURIComponent(locale)}`;
  };
  new MutationObserver(update).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
  update();
})();
