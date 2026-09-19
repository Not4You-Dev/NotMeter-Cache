(() => {
  "use strict";
  const cacheUrl = "https://raw.githubusercontent.com/Not4You-Dev/NotMeter-Cache/main/presence/notmeter-praise-ranking.json";
  const fields = ["skill", "guardian", "support", "leadership", "mentor"];
  let latest = null, assets = null, pending = null, format = {};
  const el = id => document.getElementById(id);
  const node = (tag, text, className) => {
    const item = document.createElement(tag);
    if (text !== undefined) item.textContent = text;
    if (className) item.className = className;
    return item;
  };
  function validate(value) {
    if (value?.schema !== "notmeter-praise-ranking-v1" || !/^[0-9a-f]{64}$/.test(value.generation) ||
        !Number.isSafeInteger(value.generatedAtUnixSeconds) || value.generatedAtUnixSeconds <= 0 ||
        value.generatedAtUnixSeconds > Date.now()/1000 + 30 || !Array.isArray(value.entries) || value.entries.length > 20)
      throw new Error("Invalid praise ranking");
    const tokens = new Set();
    value.entries.forEach((row, index) => {
      const previous = value.entries[index - 1];
      if (row.rank !== index + 1 || !/^[A-F0-9]{32}$/.test(row.token) || tokens.has(row.token) ||
          typeof row.nickname !== "string" || row.nickname.length > 64 || !row.nickname ||
          !Number.isSafeInteger(row.serverId) || row.serverId <= 0 || typeof row.job !== "string" ||
          !Number.isSafeInteger(row.total) || row.total <= 0 || row.total > 10737418235 ||
          fields.some(field => !Number.isInteger(row.counts?.[field]) || row.counts[field] < 0 || row.counts[field] > 2147483647) ||
          fields.reduce((sum, field) => sum + row.counts[field], 0) !== row.total ||
          previous && (previous.total < row.total || previous.total === row.total &&
            (previous.serverId > row.serverId || previous.serverId === row.serverId && previous.token >= row.token)))
        throw new Error("Invalid praise row");
      tokens.add(row.token);
    });
    return value;
  }
  function icon(file) {
    const img = node("img"); img.src = `./assets/praise/${file}`; img.alt = ""; return img;
  }
  function render() {
    if (!latest || !assets) return;
    const fragment = document.createDocumentFragment();
    for (const row of latest.entries) {
      const article = node("article", undefined, "praise-row");
      article.append(node("span", row.rank, "praise-rank"));
      const character = node("div", undefined, "praise-character");
      const name = node("strong"), job = format.jobIcon?.(row.job);
      if (job) {
        const img = node("img", undefined, "praise-job-icon");
        img.src = job.src; img.alt = job.label; img.title = job.label;
        img.width = 22; img.height = 22;
        img.addEventListener("error", () => img.remove(), { once:true });
        name.append(img);
      }
      name.append(node("span", row.nickname));
      character.append(name, node("span", format.serverLabel?.(row.serverId) || row.serverId, "praise-server"));
      article.append(character);
      const total = node("div", undefined, "praise-total");
      total.setAttribute("aria-label", `총 칭찬 ${row.total.toLocaleString()}회`);
      total.append(icon(assets.total.file), node("span", `${row.total.toLocaleString()}회`)); article.append(total);
      const kinds = node("dl", undefined, "praise-kinds");
      for (const kind of assets.kinds) {
        const group = node("div", undefined, "praise-kind"), label = node("dt");
        label.append(icon(kind.file), node("span", kind.label));
        group.append(label, node("dd", `${row.counts[kind.field].toLocaleString()}회`)); kinds.append(group);
      }
      article.append(kinds); fragment.append(article);
    }
    el("praise-list").replaceChildren(fragment);
    el("praise-list").dataset.generation = latest.generation;
    el("praise-updated").textContent = `마지막 갱신 ${new Date(latest.generatedAtUnixSeconds * 1000).toLocaleString()} · 전체 랭킹 갱신 시 함께 반영됩니다.`;
    el("praise-state").hidden = latest.entries.length > 0;
    el("praise-state").textContent = "아직 수집된 칭찬 기록이 없습니다.";
  }
  async function load() {
    if (pending) return pending;
    pending = (async () => {
      if (!latest) { el("praise-state").hidden = false; el("praise-state").textContent = "칭찬 랭킹을 불러오는 중입니다."; }
      try {
        if (!assets) {
          const response = await fetch("./assets/praise/manifest.json");
          if (!response.ok) throw new Error("Missing praise icons");
          const nextAssets = await response.json();
          if (nextAssets.schema !== "notmeter-praise-assets-v1" || nextAssets.total?.file !== "total.png" ||
              nextAssets.kinds?.length !== 5 || nextAssets.kinds.some((k,i) => k.field !== fields[i] || k.file !== `reason-${i+1}.png`))
            throw new Error("Invalid praise icons");
          assets = nextAssets;
        }
        const response = await fetch(`${cacheUrl}?v=${Date.now()}`, { cache:"no-store", signal:AbortSignal.timeout(10000) });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        if (Number(response.headers.get("content-length")) > 65536) throw new Error("Oversized praise cache");
        const text = await response.text();
        if (new TextEncoder().encode(text).length > 65536) throw new Error("Oversized praise cache");
        const next = validate(JSON.parse(text));
        if (!latest || next.generatedAtUnixSeconds > latest.generatedAtUnixSeconds || next.generation === latest.generation) latest = next;
        render();
      } catch (_) {
        render(); el("praise-state").hidden = false;
        el("praise-state").textContent = latest ? "갱신에 실패해 마지막 확인된 순위를 표시합니다. 잠시 후 다시 시도해 주세요." : "칭찬 랭킹을 불러오지 못했습니다. 새로고침으로 다시 시도해 주세요.";
      }
    })().finally(() => { pending = null; });
    return pending;
  }
  window.NotMeterPraiseRanking = { activate(options) { format = options; void load(); }, validate };
  document.addEventListener("DOMContentLoaded", () => {
    el("praise-refresh")?.addEventListener("click", () => void load());
    window.setInterval(() => {
      if (!document.hidden && el("praise-ranking-surface")?.hidden === false) void load();
    }, 120000);
  });
})();
