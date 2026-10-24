(() => {
  "use strict";
  const words = (globalThis.NotMeterI18n?.withVietnamese || (copy => copy))({
    ko: ["최다 선택", "집계 없음", "특성 표본 {count}명", "{count}/{total}명 선택"],
    en: ["Most used", "No samples", "Specialization sample: {count}", "{count}/{total} selected"],
    "zh-TW": ["最多人選擇", "暫無樣本", "特化樣本 {count} 人", "{count}/{total} 人選擇"],
    "ja-JP": ["最多選択", "集計なし", "特化サンプル {count}人", "{count}/{total}人が選択"],
    "de-DE": ["Am häufigsten", "Keine Stichprobe", "Spezialisierungen: {count} Spieler", "{count}/{total} gewählt"],
    "fr-FR": ["Le plus choisi", "Aucun échantillon", "Échantillon : {count} joueurs", "{count}/{total} ont choisi"],
    "es-ES": ["Más elegida", "Sin muestras", "Muestra: {count} jugadores", "{count}/{total} la eligieron"],
    "pt-BR": ["Mais escolhida", "Sem amostras", "Amostra: {count} jogadores", "{count}/{total} escolheram"],
    "ru-RU": ["Самый частый", "Нет данных", "Выборка: {count} игроков", "Выбрали {count}/{total}"],
  });
  const states = new Map();
  let index = null;
  let indexRequest = null;
  const text = (locale, key, values = {}) => (words[locale] || words.en)[key]
    .replace(/\{(\w+)\}/g, (_, name) => String(values[name] ?? ""));
  const node = (tag, className, value = "") => {
    const element = document.createElement(tag);
    element.className = className;
    element.textContent = value;
    return element;
  };
  async function loadIndex() {
    if (index) return index;
    if (indexRequest) return indexRequest;
    indexRequest = (async () => {
      const response = await fetch("./assets/skill-traits/guide-index.json?v=20261013-trait-effects", {
        cache: "force-cache", signal: AbortSignal.timeout(15000),
      });
      if (!response.ok) throw new Error(`Guide skill index HTTP ${response.status}`);
      const data = await response.json();
      if (data?.schema !== 1 || !data.skills || Array.isArray(data.skills) || typeof data.skills !== "object" ||
          Object.values(data.skills).some(id => !Number.isInteger(id) || !/^1\d{7}$/.test(String(id)))) {
        throw new Error("Invalid guide skill index");
      }
      index = data.skills;
      return index;
    })();
    try { return await indexRequest; }
    finally { indexRequest = null; }
  }
  function fill(block) {
    const locale = block.dataset.traitLocale;
    const copy = globalThis.NotMeterSkillTraits.copy(locale);
    const id = index && Object.hasOwn(index, block.dataset.traitSkill) ? index[block.dataset.traitSkill] : 0;
    const options = globalThis.NotMeterSkillTraits.options(id, "kr", locale);
    const state = states.get(locale);
    for (const item of block.querySelectorAll("[data-trait-number]")) {
      const option = options.find(option => option.number === Number(item.dataset.traitNumber));
      const description = item.querySelector(".setup-guide-trait-description");
      description.textContent = option?.description || (state?.status === "loading" || !state ? copy.loading : copy.missing);
      if (option?.language) description.append(node("small", "setup-guide-trait-language", copy.english));
    }
  }
  function create(choice, job, locale) {
    const integer = new Intl.NumberFormat(locale, { maximumFractionDigits: 0 });
    const percent = new Intl.NumberFormat(locale, { style: "percent", maximumFractionDigits: 0 });
    const sampleCount = Math.max(0, Math.trunc(Number(choice?.specializationSampleCount) || 0));
    const measured = sampleCount > 0 && Array.isArray(choice?.specializations);
    const rows = new Map((Array.isArray(choice?.specializations) ? choice.specializations : []).map(item =>
      [Math.trunc(Number(item?.index)), Math.min(sampleCount, Math.max(0, Math.trunc(Number(item?.characterCount) || 0)))]));
    const counts = Array.from({ length: 5 }, (_, i) => rows.get(i + 1) || 0);
    const highest = measured ? Math.max(...counts) : 0;
    const block = node("div", "setup-guide-traits");
    block.dataset.traitSkill = `${job}:${choice?.name || ""}`;
    block.dataset.traitLocale = locale;
    block.append(node("span", "setup-guide-traits-summary", measured
      ? text(locale, 2, { count: integer.format(sampleCount) }) : text(locale, 1)));
    const list = node("ol", "setup-guide-trait-list");
    counts.forEach((count, offset) => {
      const popular = measured && count > 0 && count === highest;
      const item = node("li", `setup-guide-trait${popular ? " is-top" : ""}`);
      item.dataset.traitNumber = String(offset + 1);
      const description = node("p", "setup-guide-trait-description");
      const usage = node("div", "setup-guide-trait-usage");
      usage.append(node("span", "setup-guide-trait-rate", measured ? percent.format(count / sampleCount) : "—"));
      usage.append(node("span", "setup-guide-trait-count", measured
        ? text(locale, 3, { count: integer.format(count), total: integer.format(sampleCount) }) : text(locale, 1)));
      if (popular) usage.append(node("span", "setup-guide-trait-popular", text(locale, 0)));
      item.append(node("b", "setup-guide-trait-index", integer.format(offset + 1)), description, usage);
      list.append(item);
    });
    block.append(list);
    fill(block);
    return block;
  }
  function refresh(root, locale) {
    const copy = globalThis.NotMeterSkillTraits.copy(locale);
    const state = states.get(locale);
    let status = root.querySelector(".setup-guide-trait-status");
    if (!status) {
      status = node("div", "setup-guide-trait-status");
      status.setAttribute("role", "status");
      root.querySelector(".setup-guide-section-heading").append(status);
    }
    status.replaceChildren();
    status.hidden = state?.status === "ready";
    if (state?.status === "error") {
      const retry = node("button", "setup-guide-trait-retry", copy.retry);
      retry.type = "button";
      retry.addEventListener("click", () => { states.delete(locale); activate(root, locale); });
      status.append(node("span", "", copy.error), retry);
    } else if (!status.hidden) status.textContent = copy.loading;
    for (const block of root.querySelectorAll(".setup-guide-traits")) fill(block);
  }
  async function activate(root, locale) {
    if (!root || !root.querySelector(".setup-guide-traits")) return;
    root.dataset.traitLocale = locale;
    let state = states.get(locale);
    if (!state) {
      state = { status: "loading" };
      states.set(locale, state);
      state.request = Promise.all([loadIndex(), globalThis.NotMeterSkillTraits.load("kr", locale)])
        .then(() => { state.status = "ready"; }, () => { state.status = "error"; });
    }
    refresh(root, locale);
    if (state.status === "loading") {
      await state.request;
      if (root.isConnected && root.dataset.traitLocale === locale) refresh(root, locale);
    }
  }
  globalThis.NotMeterSetupGuideTraits = Object.freeze({ create, activate });
})();
