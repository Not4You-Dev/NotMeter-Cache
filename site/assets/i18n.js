(() => {
  "use strict";
  const languages = Object.freeze([
    { code: "ko", tag: "ko-KR", name: "한국어", flag: "kr" },
    { code: "en", tag: "en-US", name: "English", flag: "us" },
    { code: "zh-TW", tag: "zh-TW", name: "繁體中文", flag: "tw" },
    { code: "ja-JP", tag: "ja-JP", name: "日本語", flag: "jp" },
    { code: "de-DE", tag: "de-DE", name: "Deutsch", flag: "de" },
    { code: "fr-FR", tag: "fr-FR", name: "Français", flag: "fr" },
    { code: "es-ES", tag: "es-ES", name: "Español", flag: "es" },
    { code: "pt-BR", tag: "pt-BR", name: "Português (Brasil)", flag: "br" },
    { code: "ru-RU", tag: "ru-RU", name: "Русский", flag: "ru" },
  ]);
  const supported = languages.map(item => item.code);
  const aliases = { ko: "ko", en: "en", zh: "zh-TW", ja: "ja-JP", de: "de-DE", fr: "fr-FR", es: "es-ES", pt: "pt-BR", ru: "ru-RU" };
  const normalize = value => {
    const tag = String(value || "").trim().replaceAll("_", "-").toLowerCase();
    if (/^zh-(?:hans|cn|sg)(?:-|$)/.test(tag)) return "";
    return aliases[tag.split("-")[0]] || "";
  };
  const detect = (preferences = [...(navigator.languages || []), navigator.language]) => {
    for (const language of preferences) {
      const locale = normalize(language);
      if (locale) return locale;
    }
    return "en";
  };
  const read = () => {
    try {
      const saved = normalize(localStorage.getItem("notmeter-stats-locale"));
      if (saved) return saved;
    } catch { /* Language selection also works without storage. */ }
    return detect();
  };
  const save = locale => { try { localStorage.setItem("notmeter-stats-locale", locale); } catch { /* Optional preference. */ } };
  const text = (value, locale) => {
    const pack = globalThis.NotMeterWebTranslations?.[locale];
    return pack && Object.hasOwn(pack, value) && typeof pack[value] === "string" ? pack[value] : value;
  };
  const translateTree = (value, locale) => typeof value === "string" ? text(value, locale)
    : Array.isArray(value) ? value.map(item => translateTree(item, locale))
    : value && typeof value === "object" ? Object.fromEntries(Object.entries(value).map(([key, item]) => [key, translateTree(item, locale)])) : value;
  const extend = (copy, scope) => {
    for (const locale of supported.slice(3)) copy[locale] = translateTree(copy.en, locale);
    return globalThis.NotMeterClientTerms?.apply(copy, scope) || copy;
  };
  const catalogs = new Map(), requests = new Map();
  const catalogRevision = "__NOTMETER_GAME_CATALOG_REVISION__";
  const catalogBase = /^[0-9a-f]{40}$/.test(catalogRevision)
    ? `https://raw.githubusercontent.com/Not4You-Dev/NotMeter-Cache/${catalogRevision}/site/assets/locales/`
    : "./assets/locales/";
  async function loadGame(locale) {
    if (!supported.slice(3).includes(locale)) return null;
    if (catalogs.has(locale)) return catalogs.get(locale);
    if (requests.has(locale)) return requests.get(locale);
    const request = (async () => {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);
      try {
        const response = await fetch(`${catalogBase}${locale}.game.json?v=20261008-client-terms`, { signal: controller.signal, cache: "force-cache" });
        if (!response.ok) throw new Error(`Game language HTTP ${response.status}`);
        const data = await response.json();
        if (data.locale !== locale || !data.names) throw new Error("Invalid game language catalog");
        catalogs.set(locale, data);
        return data;
      } catch { return null; }
      finally { clearTimeout(timeout); requests.delete(locale); }
    })();
    requests.set(locale, request);
    return request;
  }
  function game(value, locale) {
    const original = String(value ?? "").normalize("NFC").replace(/\s+/g, " ").trim();
    const names = catalogs.get(locale)?.names;
    const direct = names && Object.hasOwn(names, original) && typeof names[original] === "string" ? names[original] : text(original, locale);
    if (direct !== original) return direct;
    const qualifier = original.match(/^(.*?)\s*[（(](어려움|보통|일반|Hard|Normal|\d+단계|Stage \d+|\d+페이즈|Phase \d+|\d+분|\d+ min)[）)]$/u);
    if (qualifier) {
      const label = qualifier[2];
      const number = label.match(/\d+/)?.[0];
      const key = /단계|Stage/.test(label) ? "Stage {value}" : /페이즈|Phase/.test(label) ? "Phase {value}"
        : /분|min/.test(label) ? "{value} min" : /어려움|Hard/.test(label) ? "Hard" : "Normal";
      return `${game(qualifier[1], locale)} (${text(key, locale).replace("{value}", number)})`;
    }
    const stage = original.match(/^(.*?)\s+(\d+)단계$/u);
    if (stage) return `${game(stage[1], locale)} (${text("Stage {value}", locale).replace("{value}", stage[2])})`;
    const prefix = original.match(/^(시련|악몽|Trial|Nightmare)\s*:\s*(.+)$/u);
    if (prefix) return `${game(/시련|Trial/.test(prefix[1]) ? "Trial" : "Nightmare", locale)}: ${game(prefix[2], locale)}`;
    return original;
  }
  function syncSelect(select, locale) {
    if (!select) return;
    if (select.options.length !== languages.length) {
      select.replaceChildren(...languages.map(language => {
        const option = document.createElement("option");
        option.value = language.code; option.textContent = language.name;
        option.lang = language.tag;
        return option;
      }));
    }
    select.value = normalize(locale) || read();
    select.dataset.language = select.value;
    select.setAttribute("aria-label", locale === "ko" ? "언어 선택" : locale === "zh-TW" ? "選擇語言" : text("Select language", locale));
  }
  globalThis.NotMeterI18n = Object.freeze({ languages, supported, normalize, detect, read, save, text, extend, translateTree, loadGame, game, syncSelect,
    tag: locale => languages.find(item => item.code === locale)?.tag || "en-US",
  });
})();
