(() => {
  "use strict";
  const words = (globalThis.NotMeterI18n?.withVietnamese || (copy => copy))({
    ko: ["최다 선택", "선택 특성 자료가 없어 선택률을 표시할 수 없습니다. 아래에서 특성 효과를 확인할 수 있습니다.", "특성 표본 {count}명", "{count}/{total}명 선택"],
    en: ["Most used", "Selection rates are unavailable because no specialization selections were recorded. The effects are listed below.", "Specialization sample: {count}", "{count}/{total} selected"],
    "zh-TW": ["最多人選擇", "尚無特化選擇紀錄，無法顯示選擇比例。可在下方查看特化效果。", "特化樣本 {count} 人", "{count}/{total} 人選擇"],
    "ja-JP": ["最多選択", "特化の選択記録がないため、選択率を表示できません。各特化の効果は以下で確認できます。", "特化サンプル {count}人", "{count}/{total}人が選択"],
    "de-DE": ["Am häufigsten", "Ohne aufgezeichnete Spezialisierungen sind keine Auswahlquoten verfügbar. Die Effekte stehen unten.", "Spezialisierungen: {count} Spieler", "{count}/{total} gewählt"],
    "fr-FR": ["Le plus choisi", "Aucun choix de spécialisation n’a été enregistré : les taux de sélection sont indisponibles. Les effets sont présentés ci-dessous.", "Échantillon : {count} joueurs", "{count}/{total} ont choisi"],
    "es-ES": ["Más elegida", "No hay selecciones de especialización registradas para calcular los porcentajes. Los efectos se muestran a continuación.", "Muestra: {count} jugadores", "{count}/{total} la eligieron"],
    "pt-BR": ["Mais escolhida", "Sem escolhas de especialização registradas, as taxas de seleção não estão disponíveis. Os efeitos estão listados abaixo.", "Amostra: {count} jogadores", "{count}/{total} escolheram"],
    "ru-RU": ["Самый частый", "Нет записей о выбранных специализациях, поэтому доли выбора недоступны. Эффекты перечислены ниже.", "Выборка: {count} игроков", "Выбрали {count}/{total}"],
    vi: ["Được chọn nhiều nhất", "Chưa có dữ liệu về đặc tính đã chọn nên không thể hiển thị tỷ lệ lựa chọn. Hiệu ứng được liệt kê bên dưới.", "Mẫu đặc tính: {count} người", "{count}/{total} đã chọn"],
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
    const id = Number(block.dataset.traitId) || (block.dataset.traitRegion !== "ww" && index && Object.hasOwn(index, block.dataset.traitSkill) ? index[block.dataset.traitSkill] : 0);
    const options = globalThis.NotMeterSkillTraits.options(id, block.dataset.traitRegion || "kr", locale);
    const state = states.get((block.dataset.traitRegion || "kr") + ":" + locale);
    for (const item of block.querySelectorAll("[data-trait-number]")) {
      const option = options.find(option => option.number === Number(item.dataset.traitNumber));
      const description = item.querySelector(".setup-guide-trait-description");
      description.textContent = option?.description || (state?.status === "loading" || !state ? copy.loading : copy.missing);
      if (option?.language) description.append(node("small", "setup-guide-trait-language", copy.english));
    }
  }
  function create(choice, job, locale, region = "kr") {
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
    block.dataset.traitRegion = region;
    block.dataset.traitId = String(choice?.skillId || 0);
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
      if (measured) usage.append(node("span", "setup-guide-trait-count",
        text(locale, 3, { count: integer.format(count), total: integer.format(sampleCount) })));
      if (popular) usage.append(node("span", "setup-guide-trait-popular", text(locale, 0)));
      const track = node("span", "setup-guide-trait-track");
      track.setAttribute("aria-hidden", "true");
      const fill = node("span", "");
      fill.setAttribute("style", `width:${measured ? count / sampleCount * 100 : 0}%`);
      track.append(fill);
      usage.append(track);
      item.append(node("b", "setup-guide-trait-index", integer.format(offset + 1)), description, usage);
      list.append(item);
    });
    block.append(list);
    fill(block);
    return block;
  }
  function refresh(root, locale) {
    const copy = globalThis.NotMeterSkillTraits.copy(locale);
    const state = states.get((root?.querySelector?.(".setup-guide-traits")?.dataset.traitRegion || "kr") + ":" + locale);
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
      retry.addEventListener("click", () => { states.delete((root.querySelector(".setup-guide-traits")?.dataset.traitRegion || "kr") + ":" + locale); activate(root, locale); });
      status.append(node("span", "", copy.error), retry);
    } else if (!status.hidden) status.textContent = copy.loading;
    for (const block of root.querySelectorAll(".setup-guide-traits")) fill(block);
  }
  async function activate(root, locale) {
    if (!root || !root.querySelector(".setup-guide-traits")) return;
    root.dataset.traitLocale = locale;
    let state = states.get((root?.querySelector?.(".setup-guide-traits")?.dataset.traitRegion || "kr") + ":" + locale);
    if (!state) {
      state = { status: "loading" };
      states.set((root.querySelector(".setup-guide-traits")?.dataset.traitRegion || "kr") + ":" + locale, state);
      const needsIndex = root.querySelector(".setup-guide-traits")?.dataset.traitRegion !== "ww";
      state.request = Promise.all([needsIndex ? loadIndex() : null, globalThis.NotMeterSkillTraits.load(root.querySelector(".setup-guide-traits")?.dataset.traitRegion || "kr", locale)])
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
