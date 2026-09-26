(() => {
  "use strict";
  const PREFIX = "NOTMETER_DUMMY_V1:";
  const DUNGEON = "training-dummy-60s";
  const LIMIT = 262144;
  const jobs = [
    ["검성", "Gladiator", "劍星"], ["수호성", "Templar", "守護星"],
    ["살성", "Assassin", "殺星"], ["궁성", "Ranger", "弓星"],
    ["마도성", "Sorcerer", "魔道星"], ["정령성", "Spiritmaster", "Elementalist", "精靈星"],
    ["치유성", "Cleric", "治癒星"], ["호법성", "Chanter", "護法星"], ["권성", "Brawler", "拳星"],
  ];
  function job(value) {
    return jobs.find(names => names.some(name => name.toLowerCase() === String(value || "").trim().toLowerCase()))?.[0] || "";
  }
  function number(value) { return typeof value === "number" && Number.isFinite(value) && value >= 0 ? value : null; }
  function minute(value) { return number(value) !== null && Math.abs(value - 60) <= 0.01; }
  function fail(key) { const error = new Error(key); error.code = key; throw error; }
  function validateSkills(skills) {
    if (!Array.isArray(skills) || !skills.length || skills.length > 512) fail("invalid");
    const codes = new Set();
    for (const skill of skills) {
      if (!skill || !Number.isSafeInteger(skill.skillCode) || skill.skillCode <= 0 || codes.has(skill.skillCode)) fail("invalid");
      codes.add(skill.skillCode);
      if (typeof skill.skillName !== "string" || skill.skillName.length > 200) fail("invalid");
      for (const key of ["totalDamage", "maxHit", "hitCount", "averageDamage", "useCount", "periodicDamage", "periodicHitCount"])
        if (skill[key] != null && (number(skill[key]) === null || skill[key] > Number.MAX_SAFE_INTEGER)) fail("invalid");
      for (const key of ["criticalRate", "perfectRate", "doubleDamageRate", "frontAttackRate", "backAttackRate"])
        if (skill[key] != null && (number(skill[key]) === null || skill[key] > 100)) fail("invalid");
      if (skill.skillLevel != null && (!Number.isInteger(skill.skillLevel) || skill.skillLevel < 0 || skill.skillLevel > 99)) fail("invalid");
      if (skill.specializationFlags != null && (!Array.isArray(skill.specializationFlags) ||
          skill.specializationFlags.length > 16 || skill.specializationFlags.some(flag => typeof flag !== "boolean"))) fail("invalid");
    }
    return skills;
  }
  function parse(text) {
    if (typeof text !== "string" || text.length > LIMIT) fail("size");
    const code = text.trim();
    if (!code.startsWith(PREFIX)) fail("prefix");
    let data;
    try {
      const encoded = code.slice(PREFIX.length);
      if (!/^[A-Za-z0-9+/]+={0,2}$/.test(encoded)) fail("invalid");
      const raw = atob(encoded);
      data = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(Uint8Array.from(raw, ch => ch.charCodeAt(0))));
    } catch { fail("invalid"); }
    if (!data || data.schema !== "notmeter-dummy-comparison-v1" || data.version !== 1 || data.dungeonKey !== DUNGEON) fail("invalid");
    if (!minute(data.durationSeconds)) fail("duration");
    if (!job(data.jobName) || typeof data.name !== "string" || data.name.length > 100 ||
        number(data.totalDamage) === null || !Number.isSafeInteger(data.totalDamage) || data.totalDamage <= 0 ||
        number(data.combatPower) === null || data.combatPower > 100000000 ||
        typeof data.recordedAt !== "string" || !Number.isFinite(Date.parse(data.recordedAt)) ||
        typeof data.externalBuff !== "boolean") fail("invalid");
    validateSkills(data.skills);
    return data;
  }
  function metric(skill, key) {
    if (!skill) return null;
    const value = number(skill[key]);
    if (key === "useCount") return value > 0 ? value : null;
    if ((key === "averageDamage" || key === "maxHit") && !(value > 0)) return null;
    if (["averageDamage", "maxHit", "criticalRate", "perfectRate", "doubleDamageRate", "frontAttackRate", "backAttackRate"].includes(key) &&
        !(number(skill.hitCount) > 0)) return null;
    return value;
  }
  function difference(mine, ranker) {
    if (mine === null || ranker === null) return null;
    return { amount: mine - ranker, percent: ranker > 0 ? (mine - ranker) / ranker * 100 : null };
  }
  function compare(mine, ranker, record) {
    if (!minute(record?.durationSeconds) || record.comparisonDurationKnown === false) fail("duration");
    if (!job(ranker?.jobName) || job(mine.jobName) !== job(ranker.jobName)) fail("job");
    if (number(ranker.totalDamage) === null || ranker.totalDamage <= 0) fail("unavailable");
    validateSkills(ranker.skills);
    const mineMap = new Map(mine.skills.map(skill => [skill.skillCode, globalThis.NotMeterCombatDetailBuffs?.normalizeSkill?.(skill) || skill]));
    const rankMap = new Map(ranker.skills.map(skill => [skill.skillCode, globalThis.NotMeterCombatDetailBuffs?.normalizeSkill?.(skill) || skill]));
    const rows = [...new Set([...mineMap.keys(), ...rankMap.keys()])].map(code => {
      const own = mineMap.get(code), other = rankMap.get(code);
      const levelDifferent = knownLevel(own) > 0 && knownLevel(other) > 0 && own.skillLevel !== other.skillLevel;
      const traits = { mine: traitFlags(own), ranker: traitFlags(other) };
      const traitsDifferent = Boolean(traits.mine && traits.ranker &&
        traits.mine.some((flag, index) => flag !== traits.ranker[index]));
      return { code, mine: own, ranker: other, levelDifferent, traitsDifferent, traits,
        delta: difference(metric(own, "totalDamage"), metric(other, "totalDamage")) };
    });
    rows.sort((a, b) => Math.abs(b.delta?.amount || 0) - Math.abs(a.delta?.amount || 0) ||
      (number(b.ranker?.totalDamage) || number(b.mine?.totalDamage) || 0) - (number(a.ranker?.totalDamage) || number(a.mine?.totalDamage) || 0));
    return { rows, dps: difference(mine.totalDamage / 60, ranker.totalDamage / 60) };
  }
  function knownLevel(skill) { return skill?.skillLevel > 1 || (skill?.skillLevel === 1 && skill.skillLevelConfirmed === true) ? skill.skillLevel : 0; }
  function traitFlags(skill) {
    const flags = skill?.specializationFlags;
    return Array.isArray(flags) && flags.length ? Array.from({ length: 5 }, (_, index) => flags[index] === true) : null;
  }

  const copy = {
    ko: {
      compare: "내 기록과 비교", close: "비교 닫기", title: "허수아비 1분 비교", how: "미터기 → 처치 기록 → 허수아비 → ‘1분 기록 비교 코드 복사’ 후 붙여넣으세요.",
      placeholder: "복사한 비교 코드를 여기에 붙여넣으세요", apply: "비교하기", replace: "다른 기록 넣기", mine: "내 기록", ranker: "랭커 기록", clear: "내 기록 지우기",
      local: "붙여넣은 기록은 이 탭에서만 사용하며 서버에 전송하지 않습니다.", skill: "스킬", damage: "피해·횟수", rates: "공격 판정", search: "스킬 검색",
      totalDamage: "총 피해", averageDamage: "평균 1타", maxHit: "최고 1타", useCount: "사용 횟수", hitCount: "타수",
      criticalRate: "치명타", perfectRate: "완벽", doubleDamageRate: "강타", frontAttackRate: "전방", backAttackRate: "후방",
      legend: "각 칸: 내 기록 / 랭커 기록 · 차이는 내 기록 − 랭커 기준", note: "최고 피해는 한 번의 최대 타격입니다. 장비·버프·스킬 레벨과 판정에 영향을 받으므로 평균 피해·사용 횟수도 함께 확인하세요.",
      level: "레벨 차이", traits: "특성 차이", noRecord: "기록 없음", unknown: "미기록", empty: "검색 결과가 없습니다.",
      lower: "랭커보다 낮음", higher: "랭커보다 높음", equal: "동일", gap: "총 피해 차이가 큰 스킬", noGap: "양쪽에 기록된 스킬을 비교합니다.",
      conditions: "비교 조건", external: "내 기록에 외부 버프·대상 효과가 있어 조건이 다릅니다.", missing: "일부 피해의 스킬 상세가 없어 스킬 합계와 총 피해가 다릅니다.",
      size: "비교 코드가 너무 큽니다. 미터기에서 다시 복사해 주세요.", prefix: "‘내 스탯 복사’가 아닌 ‘1분 기록 비교 코드 복사’를 사용해 주세요.",
      invalid: "비교 코드를 읽을 수 없습니다. 미터기에서 전체 코드를 다시 복사해 주세요.", duration: "정확히 1분으로 저장된 허수아비 기록만 비교할 수 있습니다.",
      job: "같은 직업의 랭커 기록을 선택해 주세요.", unavailable: "스킬 상세 기록이 없어 비교할 수 없습니다.", cp: "전투력", date: "측정", levelFormat: "레벨 내 {0} / 랭커 {1}",
    },
    en: {
      compare: "Compare my record", close: "Close comparison", title: "1-minute dummy comparison", how: "NotMeter → Combat records → Dummy → Copy 1-min comparison, then paste below.",
      placeholder: "Paste your comparison code", apply: "Compare", replace: "Use another record", mine: "My record", ranker: "Ranked record", clear: "Clear my record",
      local: "Your pasted record stays in this tab and is not sent to a server.", skill: "Skill", damage: "Damage & uses", rates: "Hit outcomes", search: "Find a skill",
      totalDamage: "Total damage", averageDamage: "Average hit", maxHit: "Highest hit", useCount: "Uses", hitCount: "Hits", criticalRate: "Critical", perfectRate: "Perfect", doubleDamageRate: "Power hit", frontAttackRate: "Front", backAttackRate: "Back",
      legend: "Each cell: mine / ranked · Difference = mine − ranked", note: "Highest hit is one observed hit. Gear, buffs, skill levels and hit outcomes affect it; compare average hits and use counts too.",
      level: "Different level", traits: "Different traits", noRecord: "No record", unknown: "Not recorded", empty: "No matching skills.", lower: "Below ranked", higher: "Above ranked", equal: "Equal",
      gap: "Largest total damage gaps", noGap: "Comparing skills recorded on both sides.", conditions: "Conditions", external: "Your record includes external buffs or target effects.", missing: "Some skill details are missing; skill totals differ from total damage.",
      size: "This code is too large. Copy it again from NotMeter.", prefix: "Use ‘Copy 1-min comparison’, not ‘Copy my stats’.", invalid: "Unable to read this code. Copy the complete code again.", duration: "Only exact one-minute dummy records can be compared.", job: "Select a ranked record of the same class.", unavailable: "Skill details are unavailable.", cp: "CP", date: "Recorded", levelFormat: "Level mine {0} / ranked {1}",
    },
    "zh-TW": {
      compare: "比較我的紀錄", close: "關閉比較", title: "稻草人1分鐘比較", how: "NotMeter → 戰鬥紀錄 → 稻草人 →「複製1分鐘比較碼」，然後貼上。", placeholder: "在此貼上比較碼", apply: "開始比較", replace: "使用其他紀錄", mine: "我的紀錄", ranker: "排名紀錄", clear: "清除我的紀錄", local: "貼上的紀錄僅用於此分頁，不會傳送至伺服器。",
      skill: "技能", damage: "傷害與次數", rates: "攻擊判定", search: "搜尋技能", totalDamage: "總傷害", averageDamage: "平均單次", maxHit: "最高單次", useCount: "使用次數", hitCount: "命中次數", criticalRate: "暴擊", perfectRate: "完美", doubleDamageRate: "強擊", frontAttackRate: "正面", backAttackRate: "背面",
      legend: "每格：我的 / 排名紀錄 · 差值＝我的 − 排名", note: "最高傷害是一次命中的最大值，受裝備、增益、技能等級及判定影響，請搭配平均傷害與使用次數查看。", level: "等級不同", traits: "特性不同", noRecord: "無紀錄", unknown: "未記錄", empty: "沒有符合的技能。", lower: "低於排名", higher: "高於排名", equal: "相同", gap: "總傷害差距最大的技能", noGap: "比較雙方都有記錄的技能。", conditions: "比較條件", external: "我的紀錄包含外部增益或目標效果，條件不同。", missing: "部分技能詳情缺失，技能傷害合計與總傷害不同。", size: "比較碼過大，請重新複製。", prefix: "請使用「複製1分鐘比較碼」，而非「複製我的屬性」。", invalid: "無法讀取比較碼，請重新複製完整內容。", duration: "僅能比較完整1分鐘的稻草人紀錄。", job: "請選擇相同職業的排名紀錄。", unavailable: "沒有技能詳情，無法比較。", cp: "戰鬥力", date: "測量", levelFormat: "等級 我的 {0} / 排名 {1}",
    },
  };
  Object.assign(copy.ko, { sort: "정렬", damageGap: "총 피해 차이 큰 순", maximumGap: "최고 피해 차이 큰 순", usesGap: "사용 횟수 차이 큰 순", ownOnly: "내 기록에만 있음", rankedOnly: "랭커 기록에만 있음", times: "회", points: "%p", legend: "윗줄 내 기록 · 아랫줄 랭커 기록", deltaHint: "차이 = 내 기록 − 랭커", equal: "같음", swipe: "좌우로 밀어 모든 지표를 확인하세요", matched: "같은 직업 · 허수아비 1분" });
  Object.assign(copy.en, { sort: "Sort", damageGap: "Largest damage gap", maximumGap: "Largest highest-hit gap", usesGap: "Largest use-count gap", ownOnly: "Only in my record", rankedOnly: "Only in ranked record", times: " uses", points: "pp", legend: "Top: my record · Bottom: ranked record", deltaHint: "Difference = mine − ranked", swipe: "Scroll sideways to see all metrics", matched: "Same class · 1-minute dummy" });
  Object.assign(copy["zh-TW"], { sort: "排序", damageGap: "總傷害差距最大", maximumGap: "最高單次差距最大", usesGap: "使用次數差距最大", ownOnly: "僅我的紀錄", rankedOnly: "僅排名紀錄", times: "次", points: "百分點", legend: "上行：我的紀錄 · 下行：排名紀錄", deltaHint: "差值＝我的 − 排名", swipe: "左右滑動查看所有指標", matched: "相同職業 · 稻草人1分鐘" });
  Object.assign(copy.ko, { imageCopy: "이미지 복사", imageSave: "PNG 저장", imageCopied: "비교 이미지가 복사되었습니다.", imageSaved: "비교 이미지를 저장했습니다.", imageFailed: "이미지를 만들지 못했습니다. PNG 저장을 이용해 주세요.", imageBusy: "이미지 만드는 중…", imageLarge: "항목이 많습니다. 스킬 검색으로 범위를 나누어 저장해 주세요." });
  Object.assign(copy.en, { imageCopy: "Copy image", imageSave: "Save PNG", imageCopied: "Comparison image copied.", imageSaved: "Comparison image saved.", imageFailed: "Unable to copy the image. Try Save PNG.", imageBusy: "Creating image…", imageLarge: "Too many rows. Narrow your skill search before saving." });
  Object.assign(copy["zh-TW"], { imageCopy: "複製圖片", imageSave: "儲存 PNG", imageCopied: "已複製比較圖片。", imageSaved: "已儲存比較圖片。", imageFailed: "無法複製圖片，請使用儲存 PNG。", imageBusy: "正在製作圖片…", imageLarge: "項目過多，請透過技能搜尋分批儲存。" });
  Object.assign(copy.ko, { rankedLabel: "랭커", deltaLabel: "차이", hitsUnit: "타" });
  Object.assign(copy.en, { rankedLabel: "Ranked", deltaLabel: "Gap", hitsUnit: " hits" });
  Object.assign(copy["zh-TW"], { rankedLabel: "排名", deltaLabel: "差值", hitsUnit: "次命中" });
  Object.assign(copy.ko, { mineTraits: "내 특성", rankerTraits: "랭커 특성", selectedTraits: "선택: {0}", noTraits: "선택 없음" });
  Object.assign(copy.en, { mineTraits: "My traits", rankerTraits: "Ranked traits", selectedTraits: "Selected: {0}", noTraits: "None selected" });
  Object.assign(copy["zh-TW"], { mineTraits: "我的特性", rankerTraits: "排名特性", selectedTraits: "已選：{0}", noTraits: "未選擇" });
  let profile = null, context = null, open = false, result = false, mode = "damage", query = "", order = "damageGap";
  const el = (tag, className, text) => { const node = document.createElement(tag); if (className) node.className = className; if (text != null) node.textContent = text; return node; };
  const t = key => (copy[context?.locale] || copy.en)[key] || key;
  const fmt = (value, digits = 0) => value === null ? "—" : new Intl.NumberFormat(context?.locale || "ko", { maximumFractionDigits: digits }).format(value);
  function button(text, action, className = "") { const node = el("button", className, text); node.type = "button"; node.addEventListener("click", action); return node; }
  function render() {
    const host = document.getElementById("detail-comparison");
    const trigger = document.getElementById("detail-compare-toggle");
    if (!host || !trigger) return;
    host.hidden = !open;
    host.closest(".detail-panel").classList.toggle("comparing", open);
    trigger.textContent = t(open ? "close" : "compare");
    trigger.setAttribute("aria-expanded", String(open));
    host.replaceChildren();
    if (!open) return;
    if (!result) renderInput(host); else renderResult(host);
    host.scrollTop = 0;
  }
  function renderInput(host) {
    const box = el("div", "comparison-import");
    box.append(el("strong", "", t("title")), el("p", "", t("how")));
    const input = el("textarea"); input.id = "dummy-comparison-code"; input.rows = 2; input.maxLength = LIMIT;
    input.placeholder = t("placeholder"); input.setAttribute("aria-label", t("placeholder")); input.spellcheck = false;
    const error = el("p", "comparison-error"); error.setAttribute("role", "alert");
    function apply() {
      try {
        const candidate = input.value.trim() ? parse(input.value) : profile;
        if (!candidate) fail("prefix");
        compare(candidate, context.detail, context.record);
        profile = candidate; result = true; query = ""; render();
        document.getElementById("comparison-results-title")?.focus({ preventScroll: true });
      } catch (reason) { error.textContent = t(reason.code || "invalid"); input.setAttribute("aria-invalid", "true"); }
    }
    const actions = el("div", "comparison-actions");
    actions.append(button(t("apply"), apply, "comparison-primary"));
    if (profile) actions.append(el("span", "", `${t("mine")}: ${profile.name}`), button(t("clear"), () => { profile = null; render(); }));
    input.addEventListener("keydown", event => { if ((event.ctrlKey || event.metaKey) && event.key === "Enter") apply(); });
    box.append(input, actions, error, el("small", "", t("local"))); host.append(box);
  }
  function renderResult(host) {
    let model;
    try { model = compare(profile, context.detail, context.record); }
    catch (error) { result = false; renderInput(host); host.append(el("p", "comparison-error", t(error.code))); return; }
    const heading = el("div", "comparison-heading");
    const title = el("h3", "", t("title")); title.id = "comparison-results-title"; title.tabIndex = -1;
    const headingText = el("div"); headingText.append(title, el("span", "comparison-match", t("matched")));
    const actions = el("div", "comparison-heading-actions");
    const imageStatus = el("span", "comparison-image-status"); imageStatus.setAttribute("role", "status");
    const copyImage = button(t("imageCopy"), () => saveImage(true, model, imageStatus, [copyImage, downloadImage]));
    const downloadImage = button(t("imageSave"), () => saveImage(false, model, imageStatus, [copyImage, downloadImage]));
    actions.append(copyImage, downloadImage, button(t("replace"), () => { result = false; render(); document.getElementById("dummy-comparison-code")?.focus(); }));
    heading.append(headingText, actions);
    const summary = el("div", "comparison-summary");
    for (const [data, own] of [[profile, true], [context.detail, false]]) {
      const card = el("div", own ? "comparison-person mine" : "comparison-person ranker");
      card.append(el("span", "comparison-eyebrow", t(own ? "mine" : "ranker")), el("strong", "comparison-name", data.name || "—"),
        el("b", "comparison-dps", `${fmt(data.totalDamage / 60)} DPS`), el("span", "comparison-context", `${t("cp")} ${fmt(number(data.combatPower))} · 01:00`));
      const date = own ? profile.recordedAt : context.record.battleEnd;
      if (date && Number.isFinite(Date.parse(date))) card.append(el("small", "", `${t("date")} ${new Date(date).toLocaleString(context.locale)}`));
      summary.append(card);
    }
    const delta = el("div", "comparison-overall");
    delta.append(el("span", "", t(model.dps.amount < 0 ? "lower" : model.dps.amount > 0 ? "higher" : "equal")),
      el("strong", model.dps.amount < 0 ? "comparison-negative" : "comparison-positive", `${model.dps.percent > 0 ? "+" : ""}${fmt(model.dps.percent, 1)}%`),
      el("small", "", `${model.dps.amount > 0 ? "+" : ""}${fmt(model.dps.amount)} DPS`)); summary.append(delta);
    host.append(heading, imageStatus, summary);
    const warnings = comparisonWarnings();
    if (warnings.length) host.append(el("p", "comparison-warning", `${t("conditions")}: ${warnings.join(" ")}`));
    const gaps = model.rows.filter(row => row.delta?.amount && row.mine && row.ranker).slice(0, 3);
    const insights = el("div", "comparison-insights"); insights.append(el("span", "", t("gap")));
    for (const row of gaps) insights.append(el("span", "comparison-gap", `${skillName(row)} ${row.delta.amount > 0 ? "+" : ""}${fmt(row.delta.amount)}`));
    if (gaps.length) host.append(insights);
    const toolbar = el("div", "comparison-toolbar");
    for (const key of ["damage", "rates"]) {
      const tab = button(t(key), () => { mode = key; render(); }, mode === key ? "active" : ""); tab.setAttribute("aria-pressed", String(mode === key)); toolbar.append(tab);
    }
    const search = el("input"); search.type = "search"; search.placeholder = t("search"); search.setAttribute("aria-label", t("search")); search.value = query;
    const tableHost = el("div", "comparison-table-wrap");
    const sorting = el("select"); sorting.setAttribute("aria-label", t("sort"));
    for (const key of ["damageGap", "maximumGap", "usesGap"]) { const option = el("option", "", t(key)); option.value = key; sorting.append(option); }
    sorting.value = order; sorting.addEventListener("change", () => { order = sorting.value; renderTable(tableHost, model); });
    search.addEventListener("input", () => { query = search.value; renderTable(tableHost, model); }); toolbar.append(sorting, search);
    const legend = el("div", "comparison-legend");
    legend.append(el("span", "comparison-legend-mine", t("mine")), el("span", "comparison-legend-ranked", t("ranker")), el("span", "", `${t("legend")} · ${t("deltaHint")}`));
    host.append(toolbar, legend, el("p", "comparison-swipe", t("swipe")), tableHost, el("p", "comparison-note", t("note")));
    renderTable(tableHost, model);
  }
  function skillName(row) { const skill = row.ranker || row.mine; return context.skillName ? context.skillName(skill) : skill.skillName; }
  function renderTable(host, model) {
    host.replaceChildren();
    const table = el("table", "comparison-table"); const head = el("thead"), header = el("tr");
    const keys = mode === "damage" ? ["totalDamage", "averageDamage", "maxHit", "useCount", "hitCount"]
      : ["criticalRate", "perfectRate", "doubleDamageRate", "frontAttackRate", "backAttackRate"];
    for (const label of ["skill", ...keys]) { const cell = el("th", "", t(label)); cell.scope = "col"; header.append(cell); }
    head.append(header); const body = el("tbody"); table.append(head, body);
    const rows = visibleRows(model);
    for (const row of rows) {
      const tr = el("tr"), name = el("th"); name.scope = "row";
      const identity = el("div", "comparison-skill");
      const icon = el("span", "detail-skill-icon"); if (context.icon) context.icon(icon, row.ranker || row.mine, 28);
      const text = el("div"); text.append(el("strong", "", skillName(row)));
      text.append(el("small", "", t("levelFormat").replace("{0}", knownLevel(row.mine) || "—").replace("{1}", knownLevel(row.ranker) || "—")));
      const traits = el("div", "comparison-traits");
      for (const item of traitPresentation(row)) {
        const chip = item.flags ? context.specialization(item.flags, item.label) : el("span", "detail-chip", item.label);
        chip.classList.add("comparison-trait", item.side);
        chip.title = `${item.label}: ${item.description}`;
        if (item.flags) {
          const dots = chip.querySelector(".detail-spec-dots");
          dots.setAttribute("role", "img"); dots.setAttribute("aria-label", item.description);
        } else chip.append(el("span", "comparison-traits-unknown", item.description));
        traits.append(chip);
      }
      text.append(traits);
      if (row.levelDifferent) text.append(el("span", "comparison-condition", t("level")));
      if (!row.mine || !row.ranker) text.append(el("span", "comparison-condition", t(row.mine ? "ownOnly" : "rankedOnly")));
      identity.append(icon, text); name.append(identity); tr.append(name);
      for (const key of keys) {
        const { a, b, diff, rate, ownText, rankText, changeText } = cellPresentation(row, key);
        const cell = el("td"), pair = el("div", "comparison-pair");
        const ownValue = el("span", "comparison-mine");
        ownValue.append(el("span", "comparison-value-label", t("mine")), el("strong", "", ownText));
        const rankValue = el("span", "comparison-ranker");
        rankValue.append(el("span", "comparison-value-label", t("rankedLabel")), el("strong", "", rankText));
        pair.append(ownValue, rankValue); cell.append(pair);
        if (diff) {
          const sign = diff.amount > 0 ? "+" : "";
          const change = el("small", diff.amount < 0 ? "comparison-negative" : diff.amount > 0 ? "comparison-positive" : "comparison-neutral", `${t("deltaLabel")} ${changeText}`);
          change.title = `${t("mine")} − ${t("ranker")}: ${sign}${fmt(diff.amount, rate ? 1 : 0)}${rate ? "%p" : ""}`; cell.append(change);
        } else cell.append(el("small", "comparison-neutral", `${t("deltaLabel")} —`));
        tr.append(cell);
      }
      body.append(tr);
    }
    host.append(table); if (!rows.length) host.append(el("p", "comparison-note", t("empty")));
  }
  function visibleRows(model) {
    const key = order === "maximumGap" ? "maxHit" : order === "usesGap" ? "useCount" : "totalDamage";
    return model.rows.filter(row => skillName(row).toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()) &&
      (!context.showSkill || context.showSkill(row.mine || row.ranker)))
      .sort((a, b) => Math.abs(difference(metric(b.mine, key), metric(b.ranker, key))?.amount || 0) -
        Math.abs(difference(metric(a.mine, key), metric(a.ranker, key))?.amount || 0));
  }
  function cellPresentation(row, key) {
    const a = metric(row.mine, key), b = metric(row.ranker, key), diff = difference(a, b), rate = key.endsWith("Rate");
    const display = (skill, value) => !skill ? t("noRecord") : value === null ? "—" : `${fmt(value, rate ? 1 : 0)}${rate ? "%" : ""}`;
    const sign = diff?.amount > 0 ? "+" : "";
    const changeText = !diff ? t("unknown") : diff.amount === 0 ? t("equal") : rate ? `${sign}${fmt(diff.amount, 1)}${t("points")}`
      : key === "useCount" || key === "hitCount" ? `${sign}${fmt(diff.amount)}${t(key === "hitCount" ? "hitsUnit" : "times")}`
      : `${sign}${fmt(diff.amount)}${diff.percent === null ? "" : ` · ${diff.percent > 0 ? "+" : ""}${fmt(diff.percent, 1)}%`}`;
    return { a, b, diff, rate, ownText: display(row.mine, a), rankText: display(row.ranker, b), changeText };
  }
  function comparisonWarnings() {
    const warnings = [];
    if (profile.externalBuff) warnings.push(t("external"));
    if ([profile, context.detail].some(data => Math.abs(data.skills.reduce((sum, s) => sum + (number(s.totalDamage) || 0), 0) - data.totalDamage) > 1)) warnings.push(t("missing"));
    return warnings;
  }
  function traitPresentation(row) {
    return ["mine", "ranker"].map(side => {
      const flags = row.traits[side], selected = flags?.flatMap((active, index) => active ? [index + 1] : []);
      return { side, label: t(side === "mine" ? "mineTraits" : "rankerTraits"), flags,
        description: !row[side] ? t("noRecord") : !flags ? t("unknown") : selected.length ? t("selectedTraits").replace("{0}", selected.join(" · ")) : t("noTraits") };
    });
  }
  async function saveImage(clipboard, model, status, buttons) {
    const snapshotMode = mode;
    buttons.forEach(node => { node.disabled = true; }); status.textContent = t("imageBusy");
    try {
      const keys = mode === "damage" ? ["totalDamage", "averageDamage", "maxHit", "useCount", "hitCount"]
        : ["criticalRate", "perfectRate", "doubleDamageRate", "frontAttackRate", "backAttackRate"];
      const rows = visibleRows(model);
      if (rows.length > 160) fail("imageLarge");
      const snapshot = {
        title: `${t("title")} · ${t(mode)}`, subtitle: t("matched"), legend: `${t("legend")} · ${t("deltaHint")}`,
        mineLabel: t("mine"), rankerLabel: t("rankedLabel"), deltaLabel: t("deltaLabel"),
        columns: [t("skill"), ...keys.map(t)], note: t("note"),
        conditions: [t(order), query ? `${t("search")}: ${query}` : ""].filter(Boolean).join(" · "),
        warnings: comparisonWarnings(),
        people: [[profile, true], [context.detail, false]].map(([data, own]) => ({ label: t(own ? "mine" : "ranker"), name: data.name || "—",
          dps: `${fmt(data.totalDamage / 60)} DPS`, context: `${t("cp")} ${fmt(number(data.combatPower))} · 01:00`,
          date: own ? profile.recordedAt : context.record.battleEnd,
          dateText: (() => { const value = own ? profile.recordedAt : context.record.battleEnd; return value && Number.isFinite(Date.parse(value)) ? new Date(value).toLocaleString(context.locale) : ""; })() })),
        gap: `${model.dps.percent > 0 ? "+" : ""}${fmt(model.dps.percent, 1)}%`,
        gapLabel: t(model.dps.amount < 0 ? "lower" : model.dps.amount > 0 ? "higher" : "equal"),
        rows: rows.map(row => {
          const icon = el("span"); if (context.icon) context.icon(icon, row.ranker || row.mine, 28);
          return { name: skillName(row), level: t("levelFormat").replace("{0}", knownLevel(row.mine) || "—").replace("{1}", knownLevel(row.ranker) || "—"),
            condition: [row.levelDifferent ? t("level") : "", !row.mine || !row.ranker ? t(row.mine ? "ownOnly" : "rankedOnly") : ""].filter(Boolean).join(" · "),
            traits: traitPresentation(row),
            icon: { image: icon.style.backgroundImage, position: icon.style.backgroundPosition, size: icon.style.backgroundSize },
            values: keys.map(key => { const cell = cellPresentation(row, key); return { mine: cell.ownText, ranker: cell.rankText, delta: cell.changeText, sign: Math.sign(cell.diff?.amount || 0) }; }) };
        }),
      };
      const blobPromise = globalThis.NotMeterDummyComparisonImage.create(snapshot);
      if (clipboard) {
        if (!navigator.clipboard?.write || typeof ClipboardItem === "undefined") { await blobPromise; fail("imageFailed"); }
        await navigator.clipboard.write([new ClipboardItem({ "image/png": blobPromise })]);
      } else {
        const blob = await blobPromise, url = URL.createObjectURL(blob), link = el("a");
        link.href = url; link.download = `NotMeter-1min-comparison-${snapshotMode}.png`; link.click();
        setTimeout(() => URL.revokeObjectURL(url), 30000);
      }
      status.textContent = t(clipboard ? "imageCopied" : "imageSaved");
    } catch (error) { status.textContent = t(error.code || "imageFailed"); }
    finally { buttons.forEach(node => { node.disabled = false; }); }
  }
  function sync(next) {
    const trigger = document.getElementById("detail-compare-toggle");
    if (!trigger) return;
    if (context?.record !== next.record || context?.detail !== next.detail) { open = false; result = false; query = ""; }
    context = next;
    const eligible = next.dungeonKey === DUNGEON && !next.unavailable && next.record?.comparisonDurationKnown !== false &&
      minute(next.record?.durationSeconds) && next.detail?.skills?.length > 0;
    trigger.hidden = !eligible;
    if (!eligible) { open = false; result = false; }
    trigger.onclick = () => { open = !open; if (!open) result = false; render(); if (open) document.getElementById("dummy-comparison-code")?.focus(); };
    render();
  }
  function close() { open = false; result = false; if (typeof document !== "undefined") render(); }
  globalThis.NotMeterDummyComparison = Object.freeze({ parse, compare, metric, difference, sync, close });
})();
