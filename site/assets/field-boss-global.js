(() => {
  "use strict";
  const catalog = globalThis.NotMeterGlobalFieldBossCatalog;
  const cacheRoot = "https://raw.githubusercontent.com/Not4You-Dev/NotMeter-Cache/main/presence/";
  const copy = {
    ko: {
      alive: "출현 중", verifySpawn: "출현 여부 확인 필요", region: "접속 지역", server: "서버", elyos: "천족", asmodian: "마족", refresh: "새로고침",
      serverTime: "서버 시간", localTime: "내 시간", timeNote: "출현 일정은 선택한 지역의 서버 시간 기준입니다. 내 시간은 기기 시간대로 변환하며, 서머타임을 자동 반영합니다.",
      map: "필드 지역", schedule: "고정 일정", observed: "관측 기록", waiting: "관측 대기", reached: "예정 시각 지남",
      noObservation: "이 서버의 출현 기록이 아직 없습니다.", pending: "고정 일정은 바로 확인할 수 있습니다. 이 서버의 미터기 사용자가 월드맵을 열면 관측된 보스 정보가 공유됩니다.",
      loadError: "출현 기록을 불러오지 못했습니다. 고정 일정은 계속 확인할 수 있습니다.", stale: "이전 관측 기록을 표시하고 있습니다.",
      updated: "관측 갱신", scheduled: "다음 출현", source: "글로벌 클라이언트 기준", every: "매일 {time}부터 {hours}시간마다", days: "{days} {time}",
      remaining: "남은 시간", local: "내 시간", all: "전체", onlyScheduled: "고정 일정만", bosses: "보스 {count}종", locations: "출현 지점 {count}곳",
      timezone: "시간대", showAll: "전체 보스 보기", fixedNote: "고정 일정은 글로벌 클라이언트 기준이며 점검·운영 일정 변경 시 달라질 수 있습니다.",
      loading: "출현 기록 확인 중", duration: "{h}시간 {m}분 {s}초", minutes: "{m}분 {s}초", seconds: "{s}초",
    },
    en: {
      alive: "Alive", verifySpawn: "Refresh to check spawn status", region: "Game region", server: "Server", elyos: "Elyos", asmodian: "Asmodian", refresh: "Refresh",
      serverTime: "Server time", localTime: "Your time", timeNote: "Spawn schedules follow the selected game region. Your time uses your device’s time zone. Daylight saving time is handled automatically.",
      map: "Zone", schedule: "Scheduled", observed: "Reported", waiting: "Awaiting reports", reached: "Expected time passed",
      noObservation: "No spawn report for this server yet.", pending: "Fixed schedules are available now. Boss reports are shared when a NotMeter user on this server opens the world map.",
      loadError: "Spawn reports could not be loaded. Fixed schedules are still available.", stale: "Showing previously loaded spawn reports.",
      updated: "Reports updated", scheduled: "Next spawn", source: "Global client schedule", every: "Every {hours} hours from {time}, daily", days: "{days} at {time}",
      remaining: "Time remaining", local: "Your time", all: "All bosses", onlyScheduled: "Scheduled only", bosses: "{count} bosses", locations: "{count} spawn locations",
      timezone: "Time zone", showAll: "Show all bosses", fixedNote: "Fixed schedules come from the Global client. Maintenance or live schedule changes may affect spawn times.",
      loading: "Checking spawn reports", duration: "{h}h {m}m {s}s", minutes: "{m}m {s}s", seconds: "{s}s",
    },
    "zh-TW": {
      alive: "出現中", verifySpawn: "請重新整理以確認出現狀態", region: "遊戲地區", server: "伺服器", elyos: "天族", asmodian: "魔族", refresh: "重新整理",
      serverTime: "伺服器時間", localTime: "我的時間", timeNote: "出現時程以所選遊戲地區的伺服器時間為準。我的時間依裝置時區換算，並自動調整夏令時間。",
      map: "地圖區域", schedule: "固定時程", observed: "觀測紀錄", waiting: "等待觀測", reached: "預定時間已過",
      noObservation: "此伺服器尚無出現紀錄。", pending: "目前可查看固定時程。此伺服器的 NotMeter 使用者開啟世界地圖後，將分享觀測到的首領資訊。",
      loadError: "無法載入出現紀錄，仍可查看固定時程。", stale: "目前顯示先前載入的觀測紀錄。",
      updated: "觀測更新", scheduled: "下次出現", source: "全球服客戶端時程", every: "每天從 {time} 起，每 {hours} 小時一次", days: "{days} {time}",
      remaining: "剩餘時間", local: "我的時間", all: "全部首領", onlyScheduled: "僅固定時程", bosses: "{count} 隻首領", locations: "{count} 個出現地點",
      timezone: "時區", showAll: "查看全部首領", fixedNote: "固定時程依全球服客戶端資料整理，維護或營運調整可能影響實際出現時間。",
      loading: "正在確認出現紀錄", duration: "{h}小時 {m}分 {s}秒", minutes: "{m}分 {s}秒", seconds: "{s}秒",
    },
  };
  globalThis.NotMeterI18n?.extend(copy);
  const pickerCopy = {
    ko: ["서버명 또는 초성 검색", "전체", "검색 결과가 없습니다. 다른 이름으로 검색해 주세요.", "검색어 지우기", "서버 선택 닫기", "서버 {count}개"],
    en: ["Search servers", "All", "No servers found. Try another name.", "Clear search", "Close server picker", "{count} servers"],
    "zh-TW": ["搜尋伺服器名稱", "全部", "找不到伺服器，請試試其他名稱。", "清除搜尋", "關閉伺服器選單", "{count} 個伺服器"],
    "ja-JP": ["サーバー名で検索", "すべて", "サーバーが見つかりません。別の名前で検索してください。", "検索をクリア", "サーバー選択を閉じる", "{count} サーバー"],
    "de-DE": ["Server suchen", "Alle", "Keine Server gefunden. Versuche einen anderen Namen.", "Suche löschen", "Serverauswahl schließen", "{count} Server"],
    "fr-FR": ["Rechercher un serveur", "Tous", "Aucun serveur trouvé. Essayez un autre nom.", "Effacer la recherche", "Fermer la sélection du serveur", "{count} serveurs"],
    "es-ES": ["Buscar servidor", "Todos", "No se encontraron servidores. Prueba con otro nombre.", "Borrar búsqueda", "Cerrar selección de servidor", "{count} servidores"],
    "pt-BR": ["Buscar servidor", "Todos", "Nenhum servidor encontrado. Tente outro nome.", "Limpar busca", "Fechar seleção de servidor", "{count} servidores"],
    "ru-RU": ["Поиск по названию сервера", "Все", "Серверы не найдены. Попробуйте другое название.", "Очистить поиск", "Закрыть выбор сервера", "Серверов: {count}"],
  };
  for (const [locale, values] of Object.entries(pickerCopy)) {
    if (copy[locale]) Object.assign(copy[locale], Object.fromEntries(
      ["searchServers", "allFactions", "noServers", "clearSearch", "closePicker", "serverCount"].map((key, i) => [key, values[i]])));
  }

  const state = { active: false, locale: "en", region: "as", serverId: 1501, mapId: 20, timer: 0, generation: 0,
    cache: null, cacheStatus: "pending", controller: null, lastFetch: 0, scheduledOnly: false };
  const zoneFormatters = new Map();
  const displayFormatters = new Map();
  let panel, refs = {}, countdowns = [];
  let disposeServerPicker = () => {};
  const readSaved = key => { try { return localStorage.getItem(key); } catch { return null; } };
  const save = (key, value) => { try { localStorage.setItem(key, String(value)); } catch { /* Optional preference. */ } };
  const t = (key, values = {}) => Object.entries(values).reduce((text, [name, value]) => text.replaceAll(`{${name}}`, value), (copy[state.locale] || copy.en)[key] || key);
  const nameOf = item => item.names[state.locale] || item.names.en;
  const regionOf = () => catalog.serviceRegions.find(r => r.key === state.region);
  const serverOf = () => regionOf().servers.find(s => s.id === state.serverId);

  function localParts(epoch, zone) {
    if (!zoneFormatters.has(zone)) zoneFormatters.set(zone, new Intl.DateTimeFormat("en-GB", {
      timeZone: zone, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23",
    }));
    return Object.fromEntries(zoneFormatters.get(zone).formatToParts(epoch).filter(p => p.type !== "literal").map(p => [p.type, Number(p.value)]));
  }

  function wallTimeToUtc(day, minute, zone) {
    const wall = day + minute * 60000;
    const offsets = new Set();
    for (const delta of [-36, 0, 36]) {
      const probe = wall + delta * 3600000;
      const p = localParts(probe, zone);
      offsets.add(Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second) - probe);
    }
    const matches = [];
    for (const offset of offsets) {
      const epoch = wall - offset;
      const p = localParts(epoch, zone);
      if (Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute) === wall) matches.push(epoch);
    }
    // Skip nonexistent spring-forward times; use the first occurrence of a repeated wall time.
    return matches.length ? Math.min(...matches) : null;
  }

  function nextSpawn(schedule, now, zone) {
    if (!schedule) return null;
    const p = localParts(now, zone);
    const today = Date.UTC(p.year, p.month - 1, p.day);
    for (let ahead = 0; ahead <= 8; ahead++) {
      const day = today + ahead * 86400000;
      if (!schedule.weekdays.includes(new Date(day).getUTCDay())) continue;
      const step = schedule.intervalMinutes || 1440;
      for (let minute = schedule.startMinute; minute < 1440; minute += step) {
        const epoch = wallTimeToUtc(day, minute, zone);
        if (epoch !== null && epoch > now) return epoch;
      }
    }
    return null;
  }

  function cacheUrl(region, legacy = false) {
    if (!catalog.serviceRegions.some(r => r.key === region)) throw new Error("Unknown Global region");
    return `${cacheRoot}notmeter-field-boss-public-ww-${!legacy && ["as", "nae", "eu"].includes(region) ? region + "-expanded" : region}.json`;
  }

  function validateCache(cache, region, now = Date.now()) {
    const service = catalog.serviceRegions.find(r => r.key === region);
    if (!service || cache?.schema !== "notmeter-global-field-boss-public-cache-v1" || cache.version !== 1 ||
        cache.serviceRegion !== "WW" || cache.globalRegion !== region || !Number.isSafeInteger(cache.generatedAt) ||
        cache.generatedAt <= 0 || cache.generatedAt * 1000 > now + 300000 || !Array.isArray(cache.servers) || cache.servers.length > 100) throw new Error("Invalid Global cache");
    const servers = new Set();
    for (const server of cache.servers) {
      if (!service.servers.some(s => s.id === server.serverId) || servers.has(server.serverId) || !Array.isArray(server.maps) || server.maps.length > catalog.maps.length) throw new Error("Invalid Global server");
      servers.add(server.serverId);
      const maps = new Set();
      for (const map of server.maps) {
        const spec = catalog.maps.find(m => m.mapId === map.mapId);
        if (!spec || maps.has(map.mapId) || !Array.isArray(map.entries) || map.entries.length > spec.bosses.reduce((n, b) => n + b.codes.length, 0) ||
            !Number.isSafeInteger(map.observedAt) || map.observedAt <= 0 || map.observedAt > cache.generatedAt) throw new Error("Invalid Global map");
        maps.add(map.mapId);
        const codes = new Set();
        for (const entry of map.entries) {
          if (!spec.bosses.some(b => b.codes.includes(entry.bossCode)) || codes.has(entry.bossCode) ||
              !Number.isSafeInteger(entry.targetAt) || entry.targetAt <= 0 || entry.targetAt > (cache.generatedAt + 14 * 86400) * 1000) throw new Error("Invalid Global boss");
          if (entry.spawned !== undefined && (typeof entry.spawned !== "boolean" || (entry.spawned && (map.mapId === 20 || entry.targetAt > now + 5000)))) throw new Error("Invalid Global spawn state");
          codes.add(entry.bossCode);
        }
      }
    }
    return cache;
  }

  function targetFor(boss, now = Date.now()) {
    if (boss.schedule) return { time: nextSpawn(boss.schedule, now, regionOf().timeZone), fixed: true };
    const map = state.cache?.servers.find(s => s.serverId === state.serverId)?.maps.find(m => m.mapId === state.mapId);
    if (!map || now - map.observedAt * 1000 > 86400000) return null;
    const entry = map.entries.find(e => boss.codes.includes(e.bossCode));
    return entry ? { time: entry.targetAt, fixed: false, spawned: entry.spawned === true } : null;
  }

  function node(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text != null) element.textContent = text;
    return element;
  }
  function button(text, action, className = "") {
    const result = node("button", className, text);
    result.type = "button";
    result.addEventListener("click", action);
    return result;
  }
  function zoneLabel(zone, now = Date.now()) {
    const key = `offset:${zone}`;
    if (!displayFormatters.has(key)) displayFormatters.set(key, new Intl.DateTimeFormat("en", { timeZone: zone, timeZoneName: "shortOffset" }));
    return displayFormatters.get(key).formatToParts(now).find(p => p.type === "timeZoneName").value.replace("GMT", "UTC");
  }
  function dateTime(epoch, zone, clock = false) {
    const key = `${state.locale}:${zone}:${clock}`;
    if (!displayFormatters.has(key)) displayFormatters.set(key, new Intl.DateTimeFormat(state.locale, { timeZone: zone, ...(clock ? { hour: "2-digit", minute: "2-digit", second: "2-digit" } :
      { month: "short", day: "numeric", weekday: "short", hour: "2-digit", minute: "2-digit" }), hourCycle: "h23" }));
    return displayFormatters.get(key).format(epoch);
  }
  function localZone() { return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC"; }
  function scheduleText(schedule) {
    const time = `${String(Math.floor(schedule.startMinute / 60)).padStart(2, "0")}:${String(schedule.startMinute % 60).padStart(2, "0")}`;
    if (schedule.intervalMinutes) return t("every", { time, hours: schedule.intervalMinutes / 60 });
    const weekdays = new Intl.DateTimeFormat(state.locale, { timeZone: "UTC", weekday: "short" });
    return t("days", { days: schedule.weekdays.map(d => weekdays.format(Date.UTC(2026, 0, 4 + d))).join(" · "), time });
  }
  function duration(ms) {
    if (ms <= 0) return t("reached");
    const total = Math.ceil(ms / 1000), h = Math.floor(total / 3600), m = Math.floor(total % 3600 / 60), s = total % 60;
    return t(h ? "duration" : m ? "minutes" : "seconds", { h, m, s });
  }

  function serverMatches(server, query) {
    const normalize = value => String(value).normalize("NFD").replace(/[\u0300-\u036f]/g, "").normalize("NFC").toLowerCase().replace(/\s+/g, "");
    const initials = value => Array.from(value, character => {
      const code = character.charCodeAt(0) - 0xac00;
      return code >= 0 && code <= 11171 ? "ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ"[Math.floor(code / 588)] : character;
    }).join("");
    const needle = normalize(query);
    return Object.values(server.names).some(name => normalize(name).includes(needle) || normalize(initials(name)).includes(needle));
  }

  function buildServerPicker() {
    const field = node("div", "gfb-server-field");
    const label = node("label", "gfb-label", t("server")); label.htmlFor = "gfb-server";
    const trigger = button("", () => setOpen(popup.hidden), "gfb-server"); trigger.id = "gfb-server";
    trigger.setAttribute("aria-haspopup", "dialog"); trigger.setAttribute("aria-expanded", "false");
    trigger.setAttribute("aria-controls", "gfb-server-picker");
    const currentName = node("strong", "gfb-server-current");
    const currentRace = node("span", "gfb-server-race");
    const arrow = node("span", "gfb-server-arrow"); arrow.setAttribute("aria-hidden", "true");
    trigger.append(currentName, currentRace, arrow);
    const popup = node("div", "gfb-server-picker"); popup.id = "gfb-server-picker"; popup.hidden = true;
    popup.setAttribute("role", "dialog"); popup.setAttribute("aria-label", t("server"));
    const searchRow = node("div", "gfb-picker-search-row");
    const searchBox = node("div", "gfb-picker-search");
    const searchIcon = node("span", "gfb-picker-search-icon"); searchIcon.setAttribute("aria-hidden", "true");
    const input = node("input"); input.type = "text"; input.placeholder = t("searchServers"); input.autocomplete = "off"; input.spellcheck = false;
    input.setAttribute("aria-label", t("searchServers")); input.setAttribute("role", "combobox");
    input.setAttribute("aria-autocomplete", "list"); input.setAttribute("aria-controls", "gfb-server-results"); input.setAttribute("aria-expanded", "false");
    const clear = button("×", () => { input.value = ""; render(); input.focus(); }, "gfb-picker-clear"); clear.setAttribute("aria-label", t("clearSearch"));
    const close = button("×", () => setOpen(false, true), "gfb-picker-close"); close.setAttribute("aria-label", t("closePicker"));
    searchBox.append(searchIcon, input, clear); searchRow.append(searchBox, close);
    const filters = node("div", "gfb-picker-filters"); filters.setAttribute("role", "group"); filters.setAttribute("aria-label", t("server"));
    const results = node("div", "gfb-picker-results"); results.id = "gfb-server-results";
    results.setAttribute("role", "listbox"); results.setAttribute("aria-label", t("server"));
    const status = node("div", "gfb-picker-status"); status.setAttribute("role", "status");
    let race = 0, options = [], active = -1;
    const raceButtons = [0, 1, 2].map(value => {
      const choice = button(t(value === 0 ? "allFactions" : value === 1 ? "elyos" : "asmodian"), () => { race = value; render(); }, "gfb-picker-filter");
      choice.setAttribute("data-race", String(value)); filters.append(choice); return choice;
    });
    function position() {
      if (popup.hidden) return;
      const rect = field.getBoundingClientRect();
      const below = innerHeight - rect.bottom - 20, above = rect.top - 20;
      const openAbove = below < 320 && above > below;
      popup.classList.toggle("is-above", openAbove);
      results.style.maxHeight = `${Math.max(80, Math.min(330, (openAbove ? above : below) - 180))}px`;
    }
    function setOpen(open, restoreFocus = false) {
      popup.hidden = !open; trigger.setAttribute("aria-expanded", String(open)); input.setAttribute("aria-expanded", String(open));
      if (open) { input.value = ""; race = 0; render(); input.focus({ preventScroll: true }); }
      else { input.removeAttribute("aria-activedescendant"); if (restoreFocus) trigger.focus({ preventScroll: true }); }
    }
    function render() {
      results.replaceChildren(); options = []; active = -1; input.removeAttribute("aria-activedescendant");
      clear.hidden = !input.value;
      raceButtons.forEach((choice, i) => choice.setAttribute("aria-pressed", String(i === race)));
      for (const faction of [1, 2]) {
        const matches = regionOf().servers.filter(server => server.race === faction && (!race || race === faction) && serverMatches(server, input.value));
        if (!matches.length) continue;
        const group = node("div", "gfb-picker-group"); group.setAttribute("role", "group");
        const heading = node("div", "gfb-picker-heading", t(faction === 1 ? "elyos" : "asmodian")); heading.id = `gfb-picker-race-${faction}`;
        heading.append(node("span", "", String(matches.length))); group.setAttribute("aria-labelledby", heading.id);
        const grid = node("div", "gfb-picker-grid");
        for (const server of matches) {
          const option = button("", () => { selectServer(server.id); setOpen(false, true); }, "gfb-picker-option");
          option.id = `gfb-server-option-${server.id}`; option.tabIndex = -1;
          option.setAttribute("data-server-id", String(server.id)); option.setAttribute("role", "option");
          option.setAttribute("aria-selected", String(server.id === state.serverId));
          option.append(node("span", "", nameOf(server)));
          const check = node("span", "gfb-picker-check", "✓"); check.setAttribute("aria-hidden", "true"); option.append(check);
          grid.append(option); options.push(option);
        }
        group.append(heading, grid); results.append(group);
      }
      if (!options.length) results.append(node("p", "gfb-picker-empty", t("noServers")));
      status.textContent = t("serverCount", { count: options.length });
      position();
    }
    input.addEventListener("input", render);
    input.addEventListener("keydown", event => {
      if (event.isComposing) return;
      if (["ArrowDown", "ArrowUp"].includes(event.key)) {
        event.preventDefault();
        if (!options.length) return;
        active = (active + (event.key === "ArrowDown" ? 1 : active < 0 ? 0 : -1) + options.length) % options.length;
        options.forEach((option, i) => option.classList.toggle("is-active", i === active));
        input.setAttribute("aria-activedescendant", options[active].id); options[active].scrollIntoView({ block: "nearest" });
      } else if (event.key === "Enter" && options.length) { event.preventDefault(); options[Math.max(active, 0)].click(); }
    });
    popup.addEventListener("keydown", event => { if (event.key === "Escape" && !event.isComposing) { event.preventDefault(); event.stopPropagation(); setOpen(false, true); } });
    const outside = event => { if (!popup.hidden && !field.contains(event.target)) setOpen(false); };
    document.addEventListener("pointerdown", outside);
    globalThis.addEventListener?.("resize", position);
    field.addEventListener("focusout", event => { if (event.relatedTarget && !field.contains(event.relatedTarget)) setOpen(false); });
    disposeServerPicker = () => { document.removeEventListener("pointerdown", outside); globalThis.removeEventListener?.("resize", position); setOpen(false); };
    refs.updateServerSelection = () => {
      const server = serverOf(); currentName.textContent = nameOf(server); currentRace.textContent = t(server.race === 1 ? "elyos" : "asmodian");
    };
    refs.updateServerSelection();
    popup.append(searchRow, filters, results, status); field.append(label, trigger, popup);
    return field;
  }

  function buildPanel() {
    disposeServerPicker();
    panel = document.getElementById("field-boss-global");
    panel.replaceChildren();
    const controls = node("div", "gfb-controls");
    const regions = node("div", "gfb-region-field");
    regions.append(node("span", "gfb-label", t("region")));
    const choices = node("div", "gfb-region-choices");
    choices.setAttribute("role", "group"); choices.setAttribute("aria-label", t("region"));
    for (const region of catalog.serviceRegions) {
      const option = button(nameOf(region), () => selectRegion(region.key), "gfb-region-button");
      option.setAttribute("aria-pressed", String(region.key === state.region));
      choices.append(option);
    }
    regions.append(choices);
    const field = buildServerPicker();
    refs.refresh = button(t("refresh"), () => void refresh(true), "gfb-refresh");
    refs.refresh.disabled = !!state.controller;
    controls.append(regions, field, refs.refresh);
    const clocks = node("div", "gfb-clocks");
    for (const key of ["serverTime", "localTime"]) {
      const block = node("div", "gfb-clock");
      block.append(node("span", "gfb-label", t(key)));
      refs[key] = node("time", "gfb-clock-time"); refs[key + "Zone"] = node("span", "gfb-zone");
      block.append(refs[key], refs[key + "Zone"]); clocks.append(block);
    }
    clocks.append(node("p", "gfb-time-note", t("timeNote")));
    refs.notice = node("p", "gfb-notice"); refs.notice.setAttribute("role", "status");
    const heading = node("div", "gfb-zone-heading");
    refs.title = node("h3");
    const filter = node("label", "gfb-schedule-filter");
    const checkbox = node("input"); checkbox.type = "checkbox"; checkbox.checked = state.scheduledOnly;
    checkbox.addEventListener("change", () => { state.scheduledOnly = checkbox.checked; renderRows(); });
    filter.append(checkbox, node("span", "", t("onlyScheduled")));
    heading.append(refs.title, filter);
    refs.tabs = node("nav", "gfb-map-tabs"); refs.tabs.setAttribute("aria-label", t("map"));
    refs.rows = node("div", "gfb-rows");
    panel.append(controls, clocks, refs.notice, heading, refs.tabs, refs.rows, node("p", "gfb-footnote", t("fixedNote")));
    renderTabs(); renderRows(); tick();
  }

  function renderTabs() {
    refs.tabs.replaceChildren();
    for (const map of catalog.maps) {
      const tab = button(nameOf(map), () => { state.mapId = map.mapId; save("notmeter-global-field-map", map.mapId); renderTabs(); renderRows(); }, "gfb-map-tab");
      tab.setAttribute("aria-pressed", String(map.mapId === state.mapId));
      tab.append(node("span", "gfb-map-count", String(map.bosses.length)));
      refs.tabs.append(tab);
    }
  }
  function renderRows() {
    const map = catalog.maps.find(m => m.mapId === state.mapId);
    refs.title.textContent = `${nameOf(regionOf())} · ${nameOf(serverOf())}`;
    refs.rows.replaceChildren(); countdowns = [];
    const now = Date.now();
    const bosses = map.bosses.filter(b => !state.scheduledOnly || b.schedule).map(boss => ({ boss, target: targetFor(boss, now) }));
    for (const { boss, target } of bosses) {
      const row = node("article", `gfb-row${target ? "" : " is-waiting"}`);
      const icon = node("img", "gfb-boss-icon"); icon.src = "./assets/boss-icon.png"; icon.alt = "";
      const title = node("div", "gfb-boss-copy");
      title.append(node("h4", "", nameOf(boss)));
      if (boss.kibelisk) {
        const location = node("div", "gfb-kibelisk", `(${boss.kibelisk.order}) ${nameOf(boss.kibelisk)}`);
        title.append(location);
      }
      if (boss.codes.length > 1) title.append(node("small", "gfb-locations", t("locations", { count: boss.codes.length })));
      const timing = node("div", "gfb-timing");
      const detail = node("span", "gfb-schedule-detail", boss.schedule ? scheduleText(boss.schedule) : t("noObservation"));
      detail.hidden = !!target && !boss.schedule;
      const next = node("time", "gfb-next"), local = node("span", "gfb-local");
      timing.append(next, local, detail);
      const remaining = node("strong", "gfb-countdown");
      if (target?.time) countdowns.push({ boss, time: target.time, spawned: target.spawned, next, local, remaining, detail, row, index: countdowns.length });
      else remaining.textContent = "—";
      row.append(icon, title, timing, remaining); refs.rows.append(row);
    }
    if (!bosses.length) refs.rows.append(button(t("showAll"), () => { state.scheduledOnly = false; buildPanel(); }, "gfb-empty"));
    updateNotice(); tick();
  }
  function updateNotice() {
    refs.notice.textContent = state.cacheStatus === "error" ? t("loadError") + (state.cache ? " " + t("stale") : "") :
      state.cacheStatus === "loading" ? t("loading") : !state.cache?.servers.some(s => s.serverId === state.serverId && s.maps.some(m => m.entries.length)) ? t("pending") :
      `${t("updated")} ${dateTime(state.cache.generatedAt * 1000, localZone())} (${zoneLabel(localZone())})`;
  }
  function tick() {
    if (!panel || !state.active) return;
    const now = Date.now(), zone = regionOf().timeZone, local = localZone();
    refs.serverTime.textContent = dateTime(now, zone, true);
    refs.serverTimeZone.textContent = `${nameOf(regionOf())} · ${zoneLabel(zone, now)}`;
    refs.localTime.textContent = dateTime(now, local, true);
    refs.localTimeZone.textContent = `${local} · ${zoneLabel(local, now)}`;
    for (const item of countdowns) {
      item.local.hidden = zone === local;
      if (item.spawned) {
        item.remaining.textContent = t(now - item.time <= 300000 ? "alive" : "verifySpawn");
        item.remaining.classList.toggle("is-reached", true);
        item.detail.textContent = t("observed");
        item.next.textContent = `${t("updated")} ${dateTime(item.time, zone)} (${zoneLabel(zone, item.time)})`;
        item.local.textContent = `${t("local")} ${dateTime(item.time, local)} (${zoneLabel(local, item.time)})`;
        continue;
      }
      if (item.boss.schedule && item.time <= now) item.time = nextSpawn(item.boss.schedule, now, zone);
      if (item.displayedTime !== item.time || item.displayedZone !== local) {
        item.next.textContent = `${t("scheduled")} ${dateTime(item.time, zone)} (${zoneLabel(zone, item.time)})`;
        item.next.dateTime = new Date(item.time).toISOString();
        item.local.textContent = `${t("local")} ${dateTime(item.time, local)} (${zoneLabel(local, item.time)})`;
        item.displayedTime = item.time;
        item.displayedZone = local;
      }
      item.remaining.textContent = duration(item.time - now);
      item.remaining.classList.toggle("is-soon", item.time > now && item.time - now <= 600000);
      item.remaining.classList.toggle("is-warning", item.time - now > 600000 && item.time - now <= 1800000);
      item.remaining.classList.toggle("is-reached", item.time <= now);
      if (!item.boss.schedule) item.detail.textContent = t("observed");
    }
    const priority = item => !item.spawned && item.time > now ? 0 : item.spawned && now - item.time <= 300000 ? 1 : 2;
    const ordered = [...countdowns].sort((a, b) => priority(a) - priority(b) ||
      (priority(a) === 0 ? a.time - b.time : 0) || a.index - b.index);
    ordered.forEach((item, index) => {
      if (refs.rows.children[index] !== item.row) refs.rows.insertBefore(item.row, refs.rows.children[index]);
    });
    if (!document.hidden && now - state.lastFetch >= 120000) void refresh();
  }

  function selectServer(id) {
    if (!regionOf().servers.some(s => s.id === id)) return;
    state.serverId = id; save(`notmeter-global-field-server-${state.region}`, id); refs.updateServerSelection(); renderRows();
  }
  function selectRegion(key) {
    if (!catalog.serviceRegions.some(r => r.key === key) || key === state.region) return;
    state.generation++; state.controller?.abort(); state.controller = null;
    state.region = key; state.cache = null; state.cacheStatus = "pending"; state.lastFetch = Date.now();
    const saved = Number(readSaved(`notmeter-global-field-server-${key}`));
    state.serverId = regionOf().servers.some(s => s.id === saved) ? saved : regionOf().servers[0].id;
    save("notmeter-global-field-region", key); buildPanel(); void refresh(true);
  }

  async function refresh(force = false) {
    if (!state.active || state.controller || (!force && Date.now() - state.lastFetch < 120000)) return;
    const generation = state.generation, region = state.region, controller = new AbortController();
    state.controller = controller; state.lastFetch = Date.now();
    state.cacheStatus = "loading"; refs.refresh.disabled = true; updateNotice();
    const timeout = setTimeout(() => controller.abort(), 10000);
    try {
      const request = url => fetch(`${url}?v=${Math.floor(Date.now() / 60000)}`, { signal: controller.signal, cache: "no-cache" });
      let response = await request(cacheUrl(region));
      if (response.status === 404 && cacheUrl(region) !== cacheUrl(region, true)) response = await request(cacheUrl(region, true));
      let cache = null;
      if (response.status !== 404) {
        if (!response.ok || Number(response.headers.get("content-length")) > 1500000) throw new Error("Global cache unavailable");
        const text = await response.text();
        if (text.length > 1500000) throw new Error("Global cache too large");
        cache = validateCache(JSON.parse(text), region);
      }
      if (generation !== state.generation || !state.active) return;
      if (cache && (!state.cache || cache.generatedAt >= state.cache.generatedAt)) state.cache = cache;
      state.cacheStatus = cache ? "ready" : state.cache ? "error" : "pending";
    } catch {
      if (generation !== state.generation || !state.active) return;
      state.cacheStatus = "error";
    } finally {
      clearTimeout(timeout);
      if (generation === state.generation && state.active) {
        state.controller = null; refs.refresh.disabled = false; renderRows();
      }
    }
  }

  function activate(locale) {
    const nextLocale = copy[locale] ? locale : "en";
    const localeChanged = state.locale !== nextLocale;
    state.locale = nextLocale;
    if (!state.active) {
      const region = readSaved("notmeter-global-field-region");
      if (catalog.serviceRegions.some(r => r.key === region) && region !== state.region) {
        state.region = region; state.cache = null; state.cacheStatus = "pending";
      }
      const saved = Number(readSaved(`notmeter-global-field-server-${state.region}`));
      state.serverId = regionOf().servers.some(s => s.id === saved) ? saved : regionOf().servers[0].id;
      const map = Number(readSaved("notmeter-global-field-map"));
      if (catalog.maps.some(m => m.mapId === map)) state.mapId = map;
      state.active = true; state.lastFetch = Date.now();
      buildPanel();
      state.timer = setInterval(tick, 1000); void refresh(true);
    } else if (localeChanged) buildPanel();
  }
  function deactivate() {
    disposeServerPicker();
    state.active = false; state.generation++;
    state.controller?.abort(); state.controller = null;
    clearInterval(state.timer); state.timer = 0; countdowns = [];
  }
  globalThis.NotMeterGlobalFieldBoss = { activate, deactivate, refresh };
})();
