(() => {
  "use strict";
  const cacheUrl = "https://raw.githubusercontent.com/Not4You-Dev/NotMeter-Cache/main/presence/notmeter-praise-ranking.json";
  const fields = ["skill", "guardian", "support", "leadership", "mentor"];
  const copy = {
    ko: {
      title: "칭찬 랭킹", description: "미터기에서 수집된 캐릭터 기준 · 전체 서버 통합 누적 칭찬 순위입니다.",
      benefit: "TOP 20을 유지하는 동안 모든 닉네임 효과를 사용할 수 있습니다. 순위 밖으로 나가면 칭찬 혜택만 종료되며, 기존 쿠폰과 DPS 랭커 혜택은 유지됩니다.",
      note: "칭찬 횟수와 순위는 전체 랭킹 갱신 시 함께 반영됩니다. 다음 갱신 전까지 확정된 TOP 20 혜택이 유지됩니다. 동점은 서버와 캐릭터의 고정 식별 순서로 정렬하며, 공개에 동의하지 않은 닉네임은 가려집니다.",
      updated: "마지막 갱신 {time} · 전체 랭킹 갱신 시 함께 반영됩니다.", empty: "아직 수집된 칭찬 기록이 없습니다.",
      loading: "칭찬 랭킹을 불러오는 중입니다.", stale: "갱신에 실패해 마지막 확인된 순위를 표시합니다. 잠시 후 다시 시도해 주세요.", error: "칭찬 랭킹을 불러오지 못했습니다. 새로고침으로 다시 시도해 주세요.",
      refresh: "새로고침", total: "총 칭찬 {count}회", count: "{count}회", skill: "뛰어난 실력", guardian: "든든한 수호자", support: "헌신적인 지원", leadership: "훌륭한 리더십", mentor: "친절한 멘토",
    },
    en: {
      title: "Praise ranking", description: "Total praise rankings across all servers, based on characters recorded by NotMeter.",
      benefit: "All nickname effects are available while you remain in the Top 20. Leaving the Top 20 ends only the praise benefit; existing coupon and DPS-ranking benefits remain valid.",
      note: "Praise counts and ranks update together with the overall rankings. Confirmed Top 20 benefits remain active until the next update. Ties use a fixed server and character order. Names are hidden unless the player has agreed to make them public.",
      updated: "Updated {time} · Updates alongside the overall rankings.", empty: "No praise records yet.",
      loading: "Loading praise rankings…", stale: "Could not refresh. Showing the last confirmed rankings. Please try again shortly.", error: "Could not load praise rankings. Refresh to try again.",
      refresh: "Refresh", total: "Total praise: {count}", count: "{count}", skill: "Exceptional Skill", guardian: "Reliable Guardian", support: "Dedicated Support", leadership: "Great Leadership", mentor: "Helpful Mentor",
    },
    "zh-TW": {
      title: "讚賞排名", description: "依 NotMeter 記錄的角色，統計全伺服器累計讚賞排名。",
      benefit: "維持前 20 名期間可使用所有暱稱特效。離開前 20 名後僅結束讚賞福利，既有優惠券與 DPS 排名福利不受影響。",
      note: "讚賞次數與名次隨整體排名一同更新。已確認的前 20 名福利會維持至下次更新。同分時依固定的伺服器與角色順序排列；未同意公開的暱稱會隱藏。",
      updated: "更新時間 {time} · 隨整體排名一同更新。", empty: "尚無讚賞紀錄。",
      loading: "正在載入讚賞排名…", stale: "更新失敗，目前顯示上次確認的排名，請稍後再試。", error: "無法載入讚賞排名，請重新整理後再試。",
      refresh: "重新整理", total: "累計讚賞 {count} 次", count: "{count} 次", skill: "戰鬥技巧", guardian: "可靠守護", support: "暖心支援", leadership: "優秀領導", mentor: "親切指導",
    },
  };
  globalThis.NotMeterI18n?.extend(copy);
  let locale = globalThis.NotMeterI18n?.read() || "ko";
  const t = (key, values = {}) => Object.entries(values).reduce((value, [name, replacement]) => value.replaceAll(`{${name}}`, replacement), (copy[locale] || copy.en)[key] || key);
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
      total.setAttribute("aria-label", t("total", {count:row.total.toLocaleString(locale)}));
      total.append(icon(assets.total.file), node("span", t("count", {count:row.total.toLocaleString(locale)}))); article.append(total);
      const kinds = node("dl", undefined, "praise-kinds");
      for (const kind of assets.kinds) {
        const group = node("div", undefined, "praise-kind"), label = node("dt");
        label.append(icon(kind.file), node("span", t(kind.field)));
        group.append(label, node("dd", t("count", {count:row.counts[kind.field].toLocaleString(locale)}))); kinds.append(group);
      }
      article.append(kinds); fragment.append(article);
    }
    el("praise-list").replaceChildren(fragment);
    el("praise-list").dataset.generation = latest.generation;
    el("praise-updated").textContent = t("updated", {time:new Date(latest.generatedAtUnixSeconds * 1000).toLocaleString(locale)});
    el("praise-state").hidden = latest.entries.length > 0;
    el("praise-state").textContent = t("empty");
  }
  async function load() {
    if (pending) return pending;
    pending = (async () => {
      if (!latest) { el("praise-state").hidden = false; el("praise-state").textContent = t("loading"); }
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
        el("praise-state").textContent = t(latest ? "stale" : "error");
      }
    })().finally(() => { pending = null; });
    return pending;
  }
  window.NotMeterPraiseRanking = { activate(options) { format = options; void load(); }, validate,
    setLocale(value) {
      locale = copy[value] ? value : "en";
      for (const [id,key] of Object.entries({"praise-title":"title","praise-description":"description","praise-benefit":"benefit","praise-note":"note","praise-refresh":"refresh"})) {
        if (el(id)) el(id).textContent = t(key);
      }
      if (!latest && el("praise-state")) el("praise-state").textContent = t("loading");
      render();
    },
  };
  document.addEventListener("DOMContentLoaded", () => {
    el("praise-refresh")?.addEventListener("click", () => void load());
    window.setInterval(() => {
      if (!document.hidden && el("praise-ranking-surface")?.hidden === false) void load();
    }, 120000);
  });
})();
