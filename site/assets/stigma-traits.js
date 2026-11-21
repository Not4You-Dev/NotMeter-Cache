(() => {
  "use strict";
  const data = globalThis.NotMeterStigmaTraitData;
  const expanded = new WeakMap();
  function compactCode(value) {
    let code = Number(value);
    if (!Number.isSafeInteger(code) || code < 11000000) return 0;
    while (code > 99999999) code = Math.trunc(code / 10);
    return code;
  }
  const baseCode = value => Math.trunc(compactCode(value) / 100) * 100;
  function levelsFor(code, region) {
    return data?.levels?.[region === "ww" ? "ww" : "kr"]?.[baseCode(code)] || [];
  }
  function recordedCount(skill, code, region) {
    const variants = data.variants?.[region === "ww" ? "ww" : "kr"];
    const effects = data.effects?.[region === "ww" ? "ww" : "kr"];
    const abnormals = data.abnormals?.[region === "ww" ? "ww" : "kr"];
    const variant = [skill.rawSkillCode, compactCode(skill.skillCode) === code ? 0 : skill.skillCode]
      .map(value => {
        const effect = effects?.[value];
        if (effect) return effect[1] >= 0 ? effect : null;
        const abnormal = abnormals?.[value];
        if (abnormal) return abnormal[1] >= 0 ? abnormal : null;
        const known = variants?.[compactCode(value)];
        return known?.[1] > 0 ? known : null;
      }).find(value => value?.[0] === code);
    const level = Number(skill.skillLevel);
    return variant ? variant[1] : Number.isInteger(level) && level > 0 && level <= 99
      ? levelsFor(code, region).filter(required => level >= required).length : null;
  }
  function buffCount(skill, code, region, buffs, actorId) {
    const receivedHealing = Number(skill.healingAmount) > 0 && !(Number(skill.totalDamage) > 0) && !(Number(skill.hitCount) > 0);
    let result = null;
    for (const buff of buffs) {
      if (baseCode(buff.code) !== code && baseCode(buff.rawCode) !== code) continue;
      if (!(Number(buff.count) > 0) && !(Number(buff.uptimeSeconds) > 0)) continue;
      const source = Number(buff.sourceActorId);
      if (!receivedHealing && (buff.hasExternalSource || source !== Number(actorId))) continue;
      if (buff.hasUnknownSource || !(source > 0) || buff.hasExternalSource && source === Number(actorId)) return null;
      const count = recordedCount({ skillCode: code, rawSkillCode: buff.rawCode || buff.code, skillLevel: buff.skillLevel }, code, region);
      if (count === null || result !== null && result !== count) return null;
      result = count;
    }
    return result;
  }
  function ownSkillCount(skill, code, region, buffs, actorId, skills) {
    const damage = Number(skill.totalDamage) > 0 || Number(skill.hitCount) > 0;
    if (!damage && Number(skill.healingAmount) > 0) return null;
    if (!damage) {
      const sources = buffs.filter(buff => [Number(buff.rawCode), Number(buff.code)].includes(Number(skill.rawSkillCode)) &&
        (Number(buff.count) > 0 || Number(buff.uptimeSeconds) > 0));
      if (!sources.length || sources.some(buff => buff.hasUnknownSource || buff.hasExternalSource ||
        !(Number(buff.sourceActorId) > 0) || Number(buff.sourceActorId) !== Number(actorId))) return null;
    }
    let result = null;
    for (const other of skills) {
      if (baseCode(other.skillCode) !== code) continue;
      const count = recordedCount(other, code, region);
      if (count === null) continue;
      if (result !== null && result !== count) return null;
      result = count;
    }
    return result;
  }
  function model(skill, region, locale, buffs = [], actorId = 0, skills = []) {
    const code = [skill.skillCode, skill.rawSkillCode].map(baseCode).find(value => levelsFor(value, region).length);
    if (!code) return null;
    const words = data.copy[locale] || data.copy.en;
    let count = recordedCount(skill, code, region);
    count ??= ownSkillCount(skill, code, region, buffs, actorId, skills);
    let fromBuff = count === null;
    count ??= buffCount(skill, code, region, buffs, actorId);
    fromBuff &&= count !== null;
    const known = count !== null;
    const rows = levelsFor(code, region).map((required, index) => ({ number: index + 1, level: required,
      active: known ? index < count : null }));
    return { code, words, rows, fromBuff, summary: known ? words.count.replace("{0}", count).replace("{1}", rows.length) : words.unknown };
  }
  function element(tag, className, text) {
    const node = document.createElement(tag);
    node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }
  function create(skill, { region, locale, owner, buffs = [], actorId = 0, skills = [] } = {}) {
    const value = model(skill, region, locale, buffs, actorId, skills);
    if (!value) return null;
    const { words, code } = value;
    const detail = element("details", "detail-stigma");
    detail.title = "";
    detail.dataset.detailMetric = "specialization";
    detail.dataset.stigmaCode = String(code);
    const summary = element("summary", "detail-stigma-summary");
    const chevron = element("span", "detail-stigma-chevron", "⌄");
    chevron.setAttribute("aria-hidden", "true");
    const count = element("span", "detail-stigma-count", value.summary);
    count.dataset.state = value.rows.some(row => row.active) ? "active"
      : value.rows.some(row => row.active == null) ? "unknown" : "locked";
    summary.append(element("strong", "detail-stigma-title", words.title), count, chevron);
    const body = element("div", "detail-stigma-body");
    const list = element("ol", "detail-stigma-list");
    const notice = element("div", "detail-stigma-notice");
    notice.setAttribute("role", "status");
    body.append(list, notice, element("p", "detail-stigma-help", value.fromBuff ? words.buffHelp : words.help));
    detail.append(summary, body);
    const traits = globalThis.NotMeterSkillTraits;
    const copy = traits.copy(locale);
    let pending = false;
    let loaded = false;
    function renderRows() {
      const descriptions = traits.automaticOptions(code, region, locale);
      list.replaceChildren(...value.rows.map(row => {
        const text = descriptions.find(item => item.number === row.number);
        const item = element("li", "detail-stigma-trait");
        item.dataset.active = String(row.active);
        const effect = element("span", "detail-stigma-effect", text?.description || copy.missing);
        if (text?.language) effect.append(element("small", "detail-stigma-source", copy.english));
        const status = row.active == null ? words.pending : row.active ? words.active : words.locked;
        item.append(element("span", "detail-stigma-level", `Lv ${row.level}`), effect,
          element("span", "detail-stigma-status", `${row.active == null ? "? " : row.active ? "✓ " : "– "}${status}`));
        return item;
      }));
    }
    async function load() {
      if (pending || loaded) return;
      pending = true;
      notice.replaceChildren(element("span", "", copy.loading));
      try {
        await traits.load(region, locale);
        loaded = true;
        renderRows();
        notice.replaceChildren();
      } catch {
        const retry = element("button", "detail-stigma-retry", copy.retry);
        retry.type = "button";
        retry.addEventListener("click", () => void load());
        notice.replaceChildren(element("span", "", copy.error), retry);
      } finally { pending = false; }
    }
    let open = null;
    const identity = `${region}:${code}`;
    if (owner && typeof owner === "object") {
      if (!expanded.has(owner)) expanded.set(owner, new Set());
      open = expanded.get(owner);
    }
    detail.addEventListener("toggle", () => {
      if (detail.open) { open?.add(identity); void load(); }
      else open?.delete(identity);
    });
    renderRows();
    detail.open = Boolean(open?.has(identity));
    if (detail.open) void load();
    return detail;
  }
  globalThis.NotMeterStigmaTraits = Object.freeze({ baseCode, levelsFor, model, create });
})();
