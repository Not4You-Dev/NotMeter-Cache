(() => {
  "use strict";

  const localCacheOverride = ["localhost", "127.0.0.1"].includes(window.location.hostname)
    ? new URLSearchParams(window.location.search).get("artifactApi") : "";
  let PUBLIC_CACHE_PATH = "https://raw.githubusercontent.com/Not4You-Dev/NotMeter-Cache/main/presence/notmeter-artifact-occupation-public.json";
  let PUBLIC_CACHE_REF_URL = "https://api.github.com/repos/Not4You-Dev/NotMeter-Cache/commits?path=presence/notmeter-artifact-occupation-public.json&per_page=1";
  let serviceRegion = "KR";
  let serviceSelected = false;
  const EXPECTED_SCHEMA = "notmeter-artifact-occupation-public-v1";
  let EXPECTED_REVISION = "kr-2026-09-23";
  const MATCH_DURATION_DAYS = 14;
  const MATCH_BATTLE_WEEKDAYS = new Set([3, 6]);
  const DAY_MS = 24 * 60 * 60_000;
  let KOREA_OFFSET_MS = 9 * 60 * 60_000;
  const NORMAL_POLL_INTERVAL_MS = 5 * 60_000;
  const BATTLE_POLL_INTERVAL_MS = 2 * 60_000;
  const BATTLE_REFRESH_DURATION_MS = 20 * 60_000;
  const REQUEST_TIMEOUT_MS = 8_000;
  const BATTLE_REVEAL_DELAY_MS = 5 * 60_000;
  let FAVORITE_STORAGE_KEY = "notmeter-artifact-favorite-servers-v1";
  const SNAPSHOT_WIDTH = 2400;
  const SNAPSHOT_HEIGHT = 2680;
  const SNAPSHOT_COLUMNS = 2;
  const SNAPSHOT_CARD_WIDTH = 1158;
  const SNAPSHOT_CARD_HEIGHT = 204;
  const ICON_URLS = Object.freeze({
    neutral: "./assets/artifact-neutral.png",
    west: "./assets/artifact-west.png?v=20260902-2",
    east: "./assets/artifact-east.png",
  });
  const PAIRS = [
    [1, 1001, "시엘", 2004, "루미엘"], [2, 2002, "지켈", 2001, "이스라펠"],
    [3, 1002, "네자칸", 2006, "아스펠"], [4, 1003, "바이젤", 2003, "트리니엘"],
    [5, 1005, "유스티엘", 2005, "마르쿠탄"], [6, 1006, "아리엘", 1004, "카이시넬"],
    [7, 1008, "메스람타에다", 2020, "인드나흐"], [8, 1010, "나니아", 2008, "브리트라"],
    [9, 2011, "루드라", 2007, "에레슈키갈"], [10, 1011, "타하바타", 2015, "젠카카"],
    [11, 1013, "페르노스", 1009, "히타니에"], [12, 2014, "오다르", 2012, "울고른"],
    [13, 1014, "다미누", 1012, "루터스"], [14, 1015, "카사카", 1007, "프레기온"],
    [15, 1016, "바카르마", 2013, "무닌"], [16, 2016, "크로메데", 2017, "콰이링"],
    [17, 1017, "챈가룽", 2010, "하달"], [18, 1018, "코치룽", 1020, "티아마트"],
    [19, 1019, "이슈타르", 2009, "네몬"], [20, 2021, "이스할겐", 2018, "바바룽"],
    [21, 1021, "포에타", 2019, "파프니르"],
  ].map(([pairId, westId, west, eastId, east]) => ({
    pairId, west: { serverId: westId, name: west }, east: { serverId: eastId, name: east },
  }));
  const KOREAN_PAIRS = [...PAIRS];
  const TAIWAN_PAIRS = (globalThis.NotMeterTaiwanAbyssPairs || []).map(([pairId, westId, west, eastId, east]) => ({
    pairId, west:{serverId:westId, name:west}, east:{serverId:eastId, name:east},
  }));
  const KNOWN_SERVERS = new Map(PAIRS.flatMap(pair => [pair.west, pair.east]).map(server => [server.serverId, server.name]));
  const ARTIFACTS = {
    1: [
      [1001, "에레슈란타의 뿌리 아티팩트"],
      [1002, "유황나무섬 아티팩트"],
      [1003, "시엘의 날개 군도 아티팩트"],
    ],
    2: [
      [2001, "침식된 중앙섬 아티팩트"],
      [2002, "오염된 늪지 아티팩트"],
      [2003, "뒤틀린 고목나무 숲 아티팩트"],
    ],
  };
  const COPY = {
    ko: {
      snapshotTitle: "아티팩트 현황",
      description: "한국 서버 21개 대진의 점령 현황을 한눈에 확인하세요.",
      overviewTitle: "전체 21개 서버 대진", overviewCaption: "별을 누른 서버는 항상 위에 표시됩니다.",
      roundLabel: "점령전 회차", currentRound: "현재 현황", historyOption: "{date} 점령전",
      historyTitle: "{date} 점령 결과", historyCaption: "종료된 회차의 하층·중층 점령 결과입니다.",
      historyRecord: "점령전 종료 기록", historySource: "완료된 점령전 결과를 회차별로 보관합니다.",
      matchLabel: "현재 서버 매칭", matchWeek: "2주 매칭 · {week}주차", matchRange: "{start} 시작 · {end} 교체 예정",
      matchRoundLabel: "2주 점령전", matchRounds: "점령전 총 {total}회", matchSchedule: "수·토 · 그룹별 21:20 / 21:50 / 22:20",
      matchRemaining: "매칭 교체까지", matchEnded: "새 매칭 확인 중", matchReset: "새 매칭 시작 시 누적 점수가 초기화됩니다.",
      currentScore: "현재 점령", roundScore: "회차 결과", cumulativeScore: "2주 누적",
      cumulativeCoverage: "{count}/{total}회 집계", cumulativePending: "집계 준비 중",
      scoringGuide: "아티팩트 1곳을 1점으로 계산하며, 하층·중층이 모두 확인된 회차만 2주 누적 점수에 반영합니다.",
      snapshot: "이미지 복사", snapshotWorking: "이미지 만드는 중", snapshotCopied: "복사 완료",
      snapshotDownloaded: "파일 저장 완료", snapshotFailedShort: "다시 시도",
      loading: "아티팩트 현황을 불러오는 중입니다",
      refreshFailed: "갱신 실패 · 이전 자료 표시 중",
      errorTitle: "현황을 불러오지 못했습니다", error: "잠시 후 다시 확인해 주세요.",
      west: "서부 진영", east: "동부 진영", occupied: "현재 점령", waiting: "현황 확인 중",
      partial: "일부 현황 확인 중",
      westLead: "서부 진영 우세", eastLead: "동부 진영 우세", draw: "양 진영 동률",
      next: "다음 아티팩트 점령전", lower: "어비스 하층", middle: "어비스 중층",
      lowerCaption: "하층 아티팩트 3곳", middleCaption: "중층 아티팩트 3곳",
      neutral: "미확인", confirmed: "확인됨", updated: "캐시 갱신 {time}",
      noData: "새 회차 정보 확인 중", source: "한국 서버에서 확인된 현황을 약 5분마다 반영합니다.",
      favoriteServer: "{server} 즐겨찾기", unfavoriteServer: "{server} 즐겨찾기 해제",
      copied: "이미지를 클립보드에 복사했습니다.", downloaded: "이미지 파일로 저장했습니다.",
      snapshotFailed: "이미지를 만들지 못했습니다.", koreaOnly: "한국 서버 전용",
    },
    en: {
      snapshotTitle: "Artifact Status",
      description: "See all 21 Korean server matchups and their artifact control at once.",
      overviewTitle: "All 21 server matchups", overviewCaption: "Star a server to keep its matchup at the top.",
      roundLabel: "Battle round", currentRound: "Current status", historyOption: "{date} battle",
      historyTitle: "Results for {date}", historyCaption: "Final Lower and Middle Abyss control for this round.",
      historyRecord: "Final battle result", historySource: "Completed artifact battles are saved by round.",
      matchLabel: "Current server match", matchWeek: "Two-week match · Week {week}", matchRange: "{start} start · {end} change",
      matchRoundLabel: "Two-week battles", matchRounds: "{total} artifact battles", matchSchedule: "Wed & Sat · 21:20 / 21:50 / 22:20 KST",
      matchRemaining: "Until matchup change", matchEnded: "Waiting for new matchup", matchReset: "The total resets when a new matchup begins.",
      currentScore: "Current control", roundScore: "Round result", cumulativeScore: "Two-week total",
      cumulativeCoverage: "{count}/{total} rounds", cumulativePending: "Waiting for data",
      scoringGuide: "Each artifact is worth one point. Only rounds with all Lower and Middle Abyss locations confirmed are included.",
      snapshot: "Copy image", snapshotWorking: "Creating image", snapshotCopied: "Copied",
      snapshotDownloaded: "File saved", snapshotFailedShort: "Try again",
      loading: "Loading artifact status",
      refreshFailed: "Refresh failed · showing previous data",
      errorTitle: "Artifact status is unavailable", error: "Please try again shortly.",
      west: "West", east: "East", occupied: "Current control", waiting: "Checking status",
      partial: "Some locations pending",
      westLead: "West leads", eastLead: "East leads", draw: "Tied",
      next: "Next artifact battle", lower: "Lower Abyss", middle: "Middle Abyss",
      lowerCaption: "3 lower artifacts", middleCaption: "3 middle artifacts",
      neutral: "Unknown", confirmed: "Confirmed", updated: "Cache updated {time}",
      noData: "Waiting for the new round", source: "Verified Korean server status is updated about every 5 minutes.",
      favoriteServer: "Favorite {server}", unfavoriteServer: "Remove {server} from favorites",
      copied: "Image copied to the clipboard.", downloaded: "Image downloaded.",
      snapshotFailed: "Could not create the image.", koreaOnly: "Korean servers only",
    },
    "zh-TW": {
      snapshotTitle: "神器佔領狀態",
      description: "一次查看韓國伺服器全部 21 組對戰的神器佔領狀態。",
      overviewTitle: "全部 21 組伺服器對戰", overviewCaption: "點選星號後，該伺服器的對戰會固定顯示在最上方。",
      roundLabel: "佔領戰場次", currentRound: "目前狀態", historyOption: "{date} 佔領戰",
      historyTitle: "{date} 佔領結果", historyCaption: "此場次結束時的深淵下層與中層佔領結果。",
      historyRecord: "佔領戰最終記錄", historySource: "已結束的神器佔領戰會依場次保存。",
      matchLabel: "目前伺服器配對", matchWeek: "兩週配對 · 第 {week} 週", matchRange: "{start} 開始 · {end} 預計更換",
      matchRoundLabel: "兩週佔領戰", matchRounds: "神器佔領戰共 {total} 場", matchSchedule: "每週三、六・各組 21:20／21:50／22:20（韓國時間）",
      matchRemaining: "距離配對更換", matchEnded: "等待新配對", matchReset: "新配對開始時累計分數會重設。",
      currentScore: "目前佔領", roundScore: "本場結果", cumulativeScore: "兩週累計",
      cumulativeCoverage: "已統計 {count}/{total} 場", cumulativePending: "等待資料",
      scoringGuide: "每座神器計 1 分，僅在深淵下層與中層全部確認後納入兩週累計。",
      snapshot: "複製圖片", snapshotWorking: "正在建立圖片", snapshotCopied: "已複製",
      snapshotDownloaded: "檔案已儲存", snapshotFailedShort: "再試一次",
      loading: "正在載入神器佔領狀態",
      refreshFailed: "更新失敗 · 顯示先前資料",
      errorTitle: "無法載入佔領狀態", error: "請稍後再試。",
      west: "西部陣營", east: "東部陣營", occupied: "目前佔領", waiting: "確認中",
      partial: "部分地點確認中",
      westLead: "西部陣營領先", eastLead: "東部陣營領先", draw: "雙方平手",
      next: "下一場神器佔領戰", lower: "深淵下層", middle: "深淵中層",
      lowerCaption: "下層神器 3 處", middleCaption: "中層神器 3 處",
      neutral: "未確認", confirmed: "已確認", updated: "快取更新 {time}",
      noData: "等待新回合資訊", source: "僅顯示韓國伺服器資料，約每 5 分鐘更新。",
      favoriteServer: "將 {server} 加入最愛", unfavoriteServer: "取消 {server} 的最愛",
      copied: "圖片已複製到剪貼簿。", downloaded: "圖片已下載。",
      snapshotFailed: "無法建立圖片。", koreaOnly: "僅限韓國伺服器",
    },
  };

  const ARTIFACT_TRANSLATIONS = {
    "zh-TW": {
      1001: ["艾雷修藍塔之根神器", "根部"],
      1002: ["硫磺樹島神器", "硫磺樹島"],
      1003: ["希埃爾之翼群島神器", "希埃爾群島"],
      2001: ["被侵蝕的中央島神器", "中央島"],
      2002: ["受污染的沼澤神器", "沼澤"],
      2003: ["扭曲的古樹森林神器", "古樹森林"],
    },
    en: {
      1001: ["Reshanta's Root Artifact", "Root"],
      1002: ["Sulfur Tree Island Artifact", "Sulfur Isle"],
      1003: ["Archipelago of Siel's Wings Artifact", "Siel's Wings"],
      2001: ["Corroded Heart Artifact", "Heart"],
      2002: ["Contaminated Marsh Artifact", "Marsh"],
      2003: ["Distorted Old Growth Forest Artifact", "Old Growth"],
    },
  };

  globalThis.NotMeterI18n?.extend(COPY);

  globalThis.NotMeterI18n?.extend(ARTIFACT_TRANSLATIONS);

  const state = {
    active: false,
    bound: false,
    locale: "ko",
    data: null,
    request: null,
    requestController: null,
    revision: "",
    refCheckedAt: Number.NEGATIVE_INFINITY,
    pollTimer: 0,
    clockTimer: 0,
    snapshotFeedbackTimer: 0,
    selectedRoundKey: "current",
    visibilitySignature: "",
    favoriteServerIds: readFavoriteServerIds(),
    presentations: [],
  };
  const elements = {};

  function selectService(region, manual = true) {
    if (region !== "KR" && region !== "TW") return;
    if (manual) serviceSelected = true;
    if (serviceRegion !== region) {
      serviceRegion = region;
      state.requestController?.abort(); state.requestController = null; state.request = null;
      state.data = null; state.revision = ""; state.refCheckedAt = Number.NEGATIVE_INFINITY;
      state.selectedRoundKey = "current"; state.presentations = []; state.visibilitySignature = "";
      const file = `notmeter-artifact-occupation-public${region === "TW" ? "-tw" : ""}.json`;
      PUBLIC_CACHE_PATH = `https://raw.githubusercontent.com/Not4You-Dev/NotMeter-Cache/main/presence/${file}`;
      PUBLIC_CACHE_REF_URL = `https://api.github.com/repos/Not4You-Dev/NotMeter-Cache/commits?path=presence/${file}&per_page=1`;
      EXPECTED_REVISION = `${region.toLowerCase()}-2026-09-23`;
      KOREA_OFFSET_MS = (region === "TW" ? 8 : 9) * 3600000;
      FAVORITE_STORAGE_KEY = `notmeter-artifact-favorite-servers-v1${region === "TW" ? "-tw" : ""}`;
      PAIRS.splice(0, PAIRS.length, ...(region === "TW" ? TAIWAN_PAIRS : KOREAN_PAIRS));
      KNOWN_SERVERS.clear(); PAIRS.flatMap(p => [p.west,p.east]).forEach(server => KNOWN_SERVERS.set(server.serverId,server.name));
      state.favoriteServerIds = readFavoriteServerIds();
      if (state.bound) { setStaticCopy(); render(); }
      if (state.active) refreshOnResume();
    }
    document.getElementById("artifact-service-tabs")?.querySelectorAll("button").forEach(button => {
      button.setAttribute("aria-pressed", String(button.dataset.worldService === region));
      button.onclick = () => selectService(button.dataset.worldService);
    });
    const zone = document.getElementById("artifact-service-timezone");
    if (zone) zone.textContent = region === "TW" ? "UTC+8" : "UTC+9";
    const kicker = document.getElementById("artifact-kicker");
    if (kicker) kicker.textContent = region;
  }

  function text(key, replacements = {}) {
    let value = COPY[state.locale]?.[key] || COPY.ko[key] || key;
    if (serviceRegion === "TW") {
      const tw = {
        ko: { description:"대만 서버 18개 대진의 점령 현황을 확인하세요.", overviewTitle:"전체 18개 서버 대진", source:"대만 서버에서 확인된 현황을 약 5분마다 반영합니다.", matchSchedule:"수·토 21:30 (대만 시간)", koreaOnly:"대만 서버" },
        en: { description:"Artifact control across 18 Taiwan server matchups.", overviewTitle:"All 18 server matchups", source:"Taiwan server status updates about every 5 minutes.", matchSchedule:"Wed & Sat · 21:30 UTC+8", koreaOnly:"Taiwan servers" },
        "zh-TW": { description:"查看台灣伺服器全部 18 組配對的神器佔領狀態。", overviewTitle:"全部 18 組伺服器配對", source:"顯示台灣伺服器資料，約每 5 分鐘更新。", matchSchedule:"每週三、六 21:30（台灣時間）", koreaOnly:"台灣伺服器" },
      };
      globalThis.NotMeterI18n?.extend(tw);
      value = tw[state.locale]?.[key] || value;
    }
    for (const [name, replacement] of Object.entries(replacements)) {
      value = value.replace(`{${name}}`, replacement);
    }
    return value;
  }

  function normalizeLocale(locale) {
    if (globalThis.NotMeterI18n) return globalThis.NotMeterI18n.normalize(locale) || "en";
    return locale === "en" || locale === "zh-TW" ? locale : "ko";
  }

  async function cacheUrl(signal) {
    if (localCacheOverride) return localCacheOverride;
    if (Date.now() - state.refCheckedAt >= BATTLE_POLL_INTERVAL_MS) {
      state.refCheckedAt = Date.now();
      const response = await fetch(PUBLIC_CACHE_REF_URL, {
        cache: "no-store",
        headers: { Accept: "application/vnd.github+json" },
        signal,
      });
      if (!response.ok) throw new Error(`revision HTTP ${response.status}`);
      const commits = await response.json();
      const revision = String(commits?.[0]?.sha || "");
      if (!/^[0-9a-f]{40}$/i.test(revision)) throw new Error("invalid revision");
      if (signal.aborted) throw new Error("aborted");
      state.revision = revision.toLowerCase();
    }
    if (!state.revision) throw new Error("revision unavailable");
    return PUBLIC_CACHE_PATH.replace("/main/", `/${state.revision}/`);
  }

  function nextPollDelay(now = Date.now()) {
    const korea = new Date(now + KOREA_OFFSET_MS);
    if (!MATCH_BATTLE_WEEKDAYS.has(korea.getUTCDay())) {
      return NORMAL_POLL_INTERVAL_MS;
    }

    let latestActiveEnd = 0;
    let earliestFutureStart = Number.POSITIVE_INFINITY;
    for (const pairId of [1, 2, 3]) {
      const battleStart = roundTimestampForPair(korea.toISOString().slice(0, 10), pairId);
      const battleEnd = battleStart + BATTLE_REFRESH_DURATION_MS;
      if (now >= battleStart && now < battleEnd) {
        latestActiveEnd = Math.max(latestActiveEnd, battleEnd);
      } else if (battleStart > now) {
        earliestFutureStart = Math.min(earliestFutureStart, battleStart);
      }
    }

    if (latestActiveEnd > now) {
      return Math.min(BATTLE_POLL_INTERVAL_MS, latestActiveEnd - now);
    }
    if (earliestFutureStart < Number.POSITIVE_INFINITY) {
      return Math.min(NORMAL_POLL_INTERVAL_MS, earliestFutureStart - now);
    }
    return NORMAL_POLL_INTERVAL_MS;
  }

  function schedulePoll() {
    window.clearTimeout(state.pollTimer);
    state.pollTimer = window.setTimeout(async () => {
      if (!state.active) return;
      if (!document.hidden) await refresh();
      if (state.active) schedulePoll();
    }, Math.max(1_000, nextPollDelay()));
  }

  function bind() {
    if (state.bound) return;
    for (const id of [
      "artifact-description", "artifact-overview-title", "artifact-overview-caption",
      "artifact-round-label", "artifact-round-select",
      "artifact-snapshot-button", "artifact-snapshot-label", "artifact-refresh-button",
      "artifact-retry-button", "artifact-loading-state", "artifact-loading-text",
      "artifact-error-state", "artifact-error-title", "artifact-error-message",
      "artifact-dashboard", "artifact-overview-grid", "artifact-updated-at",
      "artifact-source-note", "artifact-copy-status", "artifact-cycle-label",
      "artifact-cycle-week", "artifact-cycle-range", "artifact-cycle-round-label",
      "artifact-cycle-rounds", "artifact-cycle-schedule", "artifact-cycle-remaining-label",
      "artifact-cycle-countdown", "artifact-cycle-reset", "artifact-score-guide",
    ]) {
      elements[id] = document.getElementById(id);
    }
    elements["artifact-refresh-button"].addEventListener("click", () => void refresh());
    elements["artifact-retry-button"].addEventListener("click", () => void refresh());
    elements["artifact-snapshot-button"].addEventListener("click", () => void copySnapshot());
    elements["artifact-round-select"].addEventListener("change", event => {
      state.selectedRoundKey = event.target.value || "current";
      render();
    });
    elements["artifact-overview-grid"].addEventListener("click", event => {
      const button = event.target instanceof Element
        ? event.target.closest("[data-artifact-favorite-server]")
        : null;
      if (!button) return;
      toggleFavoriteServer(Number(button.dataset.artifactFavoriteServer));
    });
    window.addEventListener("storage", event => {
      if (event.key !== FAVORITE_STORAGE_KEY) return;
      state.favoriteServerIds = readFavoriteServerIds();
      if (state.active) render();
    });
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) refreshOnResume();
    });
    window.addEventListener("pageshow", refreshOnResume);
    window.addEventListener("online", refreshOnResume);
    state.bound = true;
  }

  function setStaticCopy() {
    elements["artifact-description"].textContent = text("description");
    elements["artifact-overview-title"].textContent = text("overviewTitle");
    elements["artifact-overview-caption"].textContent = text("overviewCaption");
    elements["artifact-round-label"].textContent = text("roundLabel");
    if (!state.data && elements["artifact-round-select"].options.length > 0) {
      elements["artifact-round-select"].options[0].textContent = text("currentRound");
    }
    elements["artifact-snapshot-label"].textContent = text("snapshot");
    elements["artifact-loading-text"].textContent = text("loading");
    elements["artifact-error-title"].textContent = text("errorTitle");
    elements["artifact-source-note"].textContent = text("source");
    elements["artifact-cycle-label"].textContent = text("matchLabel");
    elements["artifact-cycle-round-label"].textContent = text("matchRoundLabel");
    elements["artifact-cycle-remaining-label"].textContent = text("matchRemaining");
    elements["artifact-cycle-reset"].textContent = text("matchReset");
    elements["artifact-score-guide"].textContent = text("scoringGuide");
  }

  async function refresh() {
    if (!state.active || state.request) return state.request;
    showLoading(!state.data);
    const controller = new AbortController();
    state.requestController = controller;
    const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    state.request = (async () => {
      try {
        const response = await fetch(await cacheUrl(controller.signal), {
          cache: "no-store",
          headers: { Accept: "application/json" },
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("unavailable");
        const payload = await response.json();
        if (controller.signal.aborted || state.requestController !== controller) return;
        if (!isValidPayload(payload)) throw new Error("invalid");
        if (Number(payload.generatedAt) < Number(state.data?.generatedAt || 0)) throw new Error("older-generation");
        PAIRS.splice(0, PAIRS.length, ...payload.pairs.map(pair => ({ pairId: pair.pairId, west: pair.west, east: pair.east })));
        state.data = { ...payload, history: normalizeHistory(payload.history) };
        if (state.active) render();
      } catch (error) {
        if (state.active && state.requestController === controller) {
          if (!state.data) showError();
          else elements["artifact-updated-at"].textContent = `${text("refreshFailed")} · ${text("updated", { time: formatObservedAt(state.data.generatedAt) })}`;
        }
      } finally {
        window.clearTimeout(timeout);
        if (state.requestController === controller) { state.requestController = null; state.request = null; }
      }
    })();
    return state.request;
  }

  function isValidPayload(payload) {
    if (!(payload && payload.schema === EXPECTED_SCHEMA && payload.version === 1 &&
      validPairingRevision(payload.pairingRevision) && payload.region === serviceRegion &&
      Number.isSafeInteger(payload.generatedAt) && payload.generatedAt > 0 &&
      Array.isArray(payload.pairs) && payload.pairs.length === PAIRS.length)) return false;
    if (new Set(payload.pairs.map(pair => pair?.pairId)).size !== PAIRS.length) return false;
    const servers = new Set();
    return payload.pairs.every(pair => {
        const expected = PAIRS.find(item => item.pairId === pair?.pairId);
        const validServer = server => server && KNOWN_SERVERS.get(server.serverId) === server.name &&
          !servers.has(server.serverId) && Boolean(servers.add(server.serverId));
        return Number.isInteger(pair.pairId) && pair.pairId >= 1 && pair.pairId <= PAIRS.length &&
          pair.group === (serviceRegion === "TW" ? 1 : ((pair.pairId - 1) % 3) + 1) && validServer(pair.west) && validServer(pair.east) &&
          pair.west.serverId === expected?.west.serverId && pair.east.serverId === expected?.east.serverId &&
          Number.isSafeInteger(pair.nextBattleAt) && pair.nextBattleAt > 0 &&
          Array.isArray(pair.layers) && pair.layers.length === 2;
      });
  }

  function validPairingRevision(revision) {
    if (revision !== EXPECTED_REVISION) return false;
    if (!/^(?:kr|tw)-\d{4}-\d{2}-\d{2}$/.test(String(revision))) return false;
    const date = new Date(`${revision.slice(3)}T00:00:00Z`);
    return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === revision.slice(3) && date.getUTCDay() === 3;
  }

  function normalizeHistory(history) {
    if (!Array.isArray(history)) return [];
    const seen = new Set();
    return history
      .filter(item => {
        const pair = PAIRS.find(expected => expected.pairId === Number(item?.pairId));
        const battleAt = Number(item?.battleAt);
        if (!pair || !Number.isSafeInteger(battleAt) || battleAt <= 0 ||
          !Array.isArray(item.layers) || item.layers.length !== 2) return false;
        const layers = item.layers.map(layer => Number(layer?.layer)).sort();
        if (layers[0] !== 1 || layers[1] !== 2 || !item.layers.every(isValidHistoryLayer)) return false;
        const key = `${pair.pairId}:${battleAt}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .sort((left, right) => Number(right.battleAt) - Number(left.battleAt));
  }

  function isValidHistoryLayer(layer) {
    if (!(layer && (Number(layer.layer) === 1 || Number(layer.layer) === 2) &&
      (layer.state === "confirmed" || layer.state === "waiting") && Array.isArray(layer.entries))) return false;
    if (layer.state === "waiting") return layer.entries.length === 0;
    const expectedIds = new Set(ARTIFACTS[Number(layer.layer)].map(([artifactId]) => artifactId));
    return layer.entries.length === 3 && layer.entries.every(entry =>
      expectedIds.delete(Number(entry?.artifactId)) && [0, 1, 2].includes(Number(entry?.ownerSide)));
  }

  function koreaDateKey(timestamp) {
    const parts = Object.fromEntries(new Intl.DateTimeFormat("en-CA", {
      timeZone: serviceRegion === "TW" ? "Asia/Taipei" : "Asia/Seoul", year: "numeric", month: "2-digit", day: "2-digit",
    }).formatToParts(new Date(timestamp)).filter(part => part.type !== "literal")
      .map(part => [part.type, part.value]));
    return `${parts.year}-${parts.month}-${parts.day}`;
  }

  function availableRoundKeys() {
    return [...new Set((state.data?.history || []).map(item => koreaDateKey(Number(item.battleAt))))]
      .sort((left, right) => right.localeCompare(left));
  }

  function populateRoundSelect() {
    const select = elements["artifact-round-select"];
    const roundKeys = availableRoundKeys();
    if (state.selectedRoundKey !== "current" && !roundKeys.includes(state.selectedRoundKey)) {
      state.selectedRoundKey = "current";
    }
    const options = [new Option(text("currentRound"), "current")];
    for (const roundKey of roundKeys) {
      options.push(new Option(text("historyOption", { date: formatRoundDate(roundKey) }), roundKey));
    }
    select.replaceChildren(...options);
    select.value = state.selectedRoundKey;
    select.disabled = roundKeys.length === 0;
  }

  function payloadPair(pairId) {
    return state.data?.pairs?.find(pair => Number(pair.pairId) === Number(pairId)) ||
      PAIRS.find(pair => pair.pairId === Number(pairId));
  }

  function normalizedLayer(pair, layerNumber, historical = false) {
    const source = pair?.layers?.find(item => Number(item.layer) === layerNumber);
    const byId = new Map(Array.isArray(source?.entries)
      ? source.entries.map(entry => [Number(entry.artifactId), Number(entry.ownerSide)])
      : []);
    const confirmed = (historical || !isCurrentRoundHeld(pair)) && source?.state === "confirmed";
    return {
      layer: layerNumber,
      confirmed,
      observedAt: confirmed ? Number(source.observedAt) || 0 : 0,
      entries: ARTIFACTS[layerNumber].map(([artifactId, name]) => ({
        artifactId,
        name: globalThis.NotMeterI18n?.supported.indexOf(state.locale) > 2
          ? globalThis.NotMeterI18n.game(name, state.locale)
          : ARTIFACT_TRANSLATIONS[state.locale]?.[artifactId]?.[0] || name,
        ownerSide: confirmed && (byId.get(artifactId) === 1 || byId.get(artifactId) === 2)
          ? byId.get(artifactId) : 0,
      })),
    };
  }

  function render() {
    if (!state.active || !state.bound) return;
    setStaticCopy();
    renderCycleSummary();
    if (!state.data) {
      showLoading(true);
      updateCountdown();
      return;
    }
    populateRoundSelect();
    const historical = state.selectedRoundKey !== "current";
    const presentations = sortPresentationsByFavorites(PAIRS.map(pair => historical
      ? buildPairPresentation(historyPair(pair, state.selectedRoundKey), true)
      : buildPairPresentation(payloadPair(pair.pairId), false)));
    state.presentations = presentations;
    if (historical) {
      const date = formatRoundDate(state.selectedRoundKey);
      elements["artifact-overview-title"].textContent = text("historyTitle", { date });
      elements["artifact-overview-caption"].textContent = text("historyCaption");
      elements["artifact-source-note"].textContent = text("historySource");
    }
    elements["artifact-overview-grid"].replaceChildren(...presentations.map(renderPairCard));
    const generatedAt = Number(state.data.generatedAt) || 0;
    elements["artifact-updated-at"].textContent = generatedAt > 0
      ? text("updated", { time: formatObservedAt(generatedAt) }) : text("noData");
    elements["artifact-loading-state"].hidden = true;
    elements["artifact-error-state"].hidden = true;
    elements["artifact-dashboard"].hidden = false;
    state.visibilitySignature = historical ? "" : currentVisibilitySignature();
    updateCountdown();
  }

  function historyPair(pair, roundKey) {
    const record = (state.data?.history || []).find(item =>
      Number(item.pairId) === pair.pairId && koreaDateKey(Number(item.battleAt)) === roundKey);
    return {
      ...pair,
      group: serviceRegion === "TW" ? 1 : ((pair.pairId - 1) % 3) + 1,
      nextBattleAt: Number(record?.battleAt) || roundTimestampForPair(roundKey, pair.pairId),
      archivedAt: Number(record?.archivedAt) || 0,
      updatedAt: Number(record?.updatedAt) || 0,
      layers: record?.layers || [],
    };
  }

  function roundTimestampForPair(roundKey, pairId) {
    const group = (Number(pairId) - 1) % 3;
    const minutes = serviceRegion === "TW" ? (roundKey >= "2026-09-30" ? 21 * 60 + 30 : 22 * 60) : roundKey >= "2026-09-30" ? 21 * 60 + 20 + group * 30 : 22 * 60 + group * 5;
    const timestamp = Date.parse(`${roundKey}T00:00:00${serviceRegion === "TW" ? "+08:00" : "+09:00"}`) + minutes * 60_000;
    return Number.isFinite(timestamp) ? timestamp : 0;
  }

  function matchingPeriod(now = Date.now()) {
    const revisionDate = (state.data?.pairingRevision || EXPECTED_REVISION).replace(/^(?:kr|tw)-/, "");
    const startAt = Date.parse(`${revisionDate}T00:00:00${serviceRegion === "TW" ? "+08:00" : "+09:00"}`);
    const endAt = startAt + MATCH_DURATION_DAYS * DAY_MS;
    const elapsedWeeks = Math.floor(Math.max(0, now - startAt) / (7 * DAY_MS));
    let totalRounds = 0;
    for (let day = 0; day < MATCH_DURATION_DAYS; day += 1) {
      const koreaDate = new Date(startAt + day * DAY_MS + KOREA_OFFSET_MS);
      if (MATCH_BATTLE_WEEKDAYS.has(koreaDate.getUTCDay())) totalRounds += 1;
    }
    return {
      startAt,
      endAt,
      week: Math.min(2, Math.max(1, elapsedWeeks + 1)),
      totalRounds,
    };
  }

  function renderCycleSummary() {
    const period = matchingPeriod();
    elements["artifact-cycle-week"].textContent = text("matchWeek", { week: period.week });
    elements["artifact-cycle-range"].textContent = text("matchRange", {
      start: formatCycleDate(period.startAt),
      end: formatCycleDate(period.endAt),
    });
    elements["artifact-cycle-rounds"].textContent = text("matchRounds", { total: period.totalRounds });
    elements["artifact-cycle-schedule"].textContent = text("matchSchedule");
    updateCycleCountdown(period);
  }

  function previousBattleAt(nextBattleAt, pairId) {
    if (!Number.isSafeInteger(nextBattleAt) || nextBattleAt <= 0) return 0;
    const koreaDate = new Date(nextBattleAt + KOREA_OFFSET_MS);
    const weekday = koreaDate.getUTCDay();
    if (weekday === 3 || weekday === 6) {
      const previous = new Date(koreaDate.getTime() - (weekday === 3 ? 4 : 3) * DAY_MS);
      return roundTimestampForPair(previous.toISOString().slice(0, 10), pairId);
    }
    return 0;
  }

  function completeRoundScore(layers) {
    if (!Array.isArray(layers) || layers.length !== 2) return null;
    const ordered = [...layers].sort((left, right) => Number(left?.layer) - Number(right?.layer));
    if (Number(ordered[0]?.layer) !== 1 || Number(ordered[1]?.layer) !== 2 ||
      ordered.some(layer => layer?.state !== "confirmed" || !isValidHistoryLayer(layer))) return null;
    const entries = ordered.flatMap(layer => layer.entries);
    return {
      west: entries.filter(entry => Number(entry.ownerSide) === 1).length,
      east: entries.filter(entry => Number(entry.ownerSide) === 2).length,
    };
  }

  function buildCumulativeScore(pairId, cutoffAt = Number.POSITIVE_INFINITY) {
    const period = matchingPeriod();
    const rounds = new Map();
    for (const record of state.data?.history || []) {
      const battleAt = Number(record?.battleAt);
      if (Number(record?.pairId) !== Number(pairId) || battleAt < period.startAt ||
        battleAt >= period.endAt || battleAt > cutoffAt) continue;
      const score = completeRoundScore(record.layers);
      if (score) rounds.set(battleAt, score);
    }

    const currentPair = state.data?.pairs?.find(pair => Number(pair?.pairId) === Number(pairId));
    const currentBattleAt = previousBattleAt(publishedBattleAt(currentPair), pairId);
    const currentScore = completeRoundScore(currentPair?.layers);
    if (currentScore && currentBattleAt >= period.startAt && currentBattleAt < period.endAt &&
      currentBattleAt <= cutoffAt && !rounds.has(currentBattleAt)) {
      rounds.set(currentBattleAt, currentScore);
    }

    return {
      west: [...rounds.values()].reduce((sum, score) => sum + score.west, 0),
      east: [...rounds.values()].reduce((sum, score) => sum + score.east, 0),
      count: rounds.size,
      total: period.totalRounds,
    };
  }

  function buildPairPresentation(pair, historical = false) {
    const layers = [normalizedLayer(pair, 1, historical), normalizedLayer(pair, 2, historical)];
    const entries = layers.flatMap(layer => layer.entries);
    const confirmedLayers = layers.filter(layer => layer.confirmed).length;
    const west = entries.filter(entry => entry.ownerSide === 1).length;
    const east = entries.filter(entry => entry.ownerSide === 2).length;
    const lead = confirmedLayers === 0 ? text("waiting")
      : confirmedLayers < layers.length ? text("partial")
      : west > east ? text("westLead") : east > west ? text("eastLead") : text("draw");
    const cumulative = buildCumulativeScore(
      pair?.pairId,
      historical ? Number(pair?.nextBattleAt) || 0 : Number.POSITIVE_INFINITY);
    return {
      pair,
      layers,
      west,
      east,
      confirmedLayers,
      lead,
      cumulative,
      historical,
      favoriteCount: favoriteCount(pair),
    };
  }

  function readFavoriteServerIds() {
    try {
      const validIds = new Set(PAIRS.flatMap(pair => [pair.west.serverId, pair.east.serverId]));
      const stored = JSON.parse(localStorage.getItem(FAVORITE_STORAGE_KEY) || "[]");
      return new Set(Array.isArray(stored)
        ? stored.map(Number).filter(serverId => validIds.has(serverId))
        : []);
    } catch {
      return new Set();
    }
  }

  function saveFavoriteServerIds() {
    try {
      localStorage.setItem(FAVORITE_STORAGE_KEY, JSON.stringify([...state.favoriteServerIds]));
    } catch {
    }
  }

  function favoriteCount(pair) {
    return [pair?.west?.serverId, pair?.east?.serverId]
      .filter(serverId => state.favoriteServerIds.has(Number(serverId))).length;
  }

  function sortPresentationsByFavorites(presentations) {
    return [...presentations].sort((left, right) =>
      right.favoriteCount - left.favoriteCount ||
      Number(left.pair?.pairId) - Number(right.pair?.pairId));
  }

  function toggleFavoriteServer(serverId) {
    if (!PAIRS.some(pair => pair.west.serverId === serverId || pair.east.serverId === serverId)) return;
    if (state.favoriteServerIds.has(serverId)) {
      state.favoriteServerIds.delete(serverId);
    } else {
      state.favoriteServerIds.add(serverId);
    }
    saveFavoriteServerIds();
    render();
  }

  function favoriteButton(server) {
    const active = state.favoriteServerIds.has(Number(server.serverId));
    const label = text(active ? "unfavoriteServer" : "favoriteServer", { server: serverDisplayName(server) });
    return `<button class="artifact-favorite-button${active ? " is-active" : ""}" type="button" ` +
      `data-artifact-favorite-server="${Number(server.serverId)}" aria-pressed="${active}" ` +
      `aria-label="${escapeHtml(label)}" title="${escapeHtml(label)}"><span aria-hidden="true">★</span></button>`;
  }

  function serverDisplayName(server) {
    return globalThis.NotMeterServerName?.(server.serverId, state.locale) || server.name;
  }

  function renderPairCard(presentation) {
    const { pair, layers, west, east, lead, cumulative, historical, favoriteCount } = presentation;
    const card = document.createElement("article");
    const leadSide = west > east ? "west" : east > west ? "east" : "neutral";
    card.className = `artifact-overview-card ${leadSide}${favoriteCount > 0 ? " is-favorite" : ""}`;
    card.dataset.pairId = String(pair.pairId);
    const battleAt = historical ? Number(pair.nextBattleAt) : effectiveNextBattleAt(pair);
    const battleTime = battleAt ? formatBattleTime(battleAt) : text("koreaOnly");
    card.innerHTML = `
      <header class="artifact-overview-card-head">
        <span>${escapeHtml(String(pair.pairId).padStart(2, "0"))} · ${escapeHtml(battleTime)}</span>
        <strong class="artifact-overview-lead ${leadSide}">${escapeHtml(lead)}</strong>
      </header>
      <div class="artifact-overview-versus">
        <div class="artifact-overview-server west">
          ${favoriteButton(pair.west)}
          <strong title="${escapeHtml(serverDisplayName(pair.west))}">${escapeHtml(serverDisplayName(pair.west))}</strong>
        </div>
        <span class="artifact-overview-score-block">
          <small>${escapeHtml(historical ? text("roundScore") : text("currentScore"))}</small>
          <span class="artifact-overview-score"><b class="west">${west}</b><i>:</i><b class="east">${east}</b></span>
        </span>
        <div class="artifact-overview-server east">
          <strong title="${escapeHtml(serverDisplayName(pair.east))}">${escapeHtml(serverDisplayName(pair.east))}</strong>
          ${favoriteButton(pair.east)}
        </div>
      </div>
      <div class="artifact-overview-cumulative">
        <span><b>${escapeHtml(text("cumulativeScore"))}</b><small>${escapeHtml(cumulative.count > 0
          ? text("cumulativeCoverage", { count: cumulative.count, total: cumulative.total })
          : text("cumulativePending"))}</small></span>
        <strong>${cumulative.count > 0
          ? `<b class="west">${cumulative.west}</b><i>:</i><b class="east">${cumulative.east}</b>`
          : "<b>—</b><i>:</i><b>—</b>"}</strong>
      </div>
      <div class="artifact-overview-layers"></div>
      <footer class="artifact-overview-next">
        <span>${escapeHtml(historical ? text("historyRecord") : text("next"))}</span>
        <strong${historical ? "" : ` data-artifact-countdown="${pair.pairId}"`}>${battleAt ? escapeHtml(historical ? formatHistoryMoment(battleAt) : formatCountdown(Math.max(0, battleAt - Date.now()))) : "—"}</strong>
      </footer>`;
    card.querySelector(".artifact-overview-layers")
      .replaceChildren(...layers.map(renderCompactLayer));
    return card;
  }

  function renderCompactLayer(layer) {
    const section = document.createElement("section");
    const west = layer.entries.filter(entry => entry.ownerSide === 1).length;
    const east = layer.entries.filter(entry => entry.ownerSide === 2).length;
    const title = layer.layer === 1 ? text("lower") : text("middle");
    section.className = "artifact-overview-layer";
    section.innerHTML = `
      <header>
        <strong>${escapeHtml(title)}</strong>
        <span><b class="west">${west}</b> : <b class="east">${east}</b></span>
      </header>
      <div class="artifact-overview-artifacts"></div>`;
    const list = section.querySelector(".artifact-overview-artifacts");
    list.replaceChildren(...layer.entries.map(entry => {
      const side = entry.ownerSide === 1 ? "west" : entry.ownerSide === 2 ? "east" : "neutral";
      const item = document.createElement("span");
      item.className = `artifact-overview-artifact ${side}`;
      item.title = entry.name;
      item.innerHTML = `
        <img src="${artifactIconUrl(entry.ownerSide)}" alt="">
        <span><b>${escapeHtml(shortArtifactName(entry.name))}</b><small>${escapeHtml(layer.confirmed ? ownerName(entry.ownerSide) : text("waiting"))}</small></span>`;
      return item;
    }));
    return section;
  }

  function shortArtifactName(name) {
    return String(name).replace(/\s*(?:아티팩트|神器|Artifact)$/u, "");
  }

  function ownerName(side) {
    return side === 1 ? text("west") : side === 2 ? text("east") : text("neutral");
  }

  function artifactIconKey(side) {
    return side === 1 ? "west" : side === 2 ? "east" : "neutral";
  }

  function artifactIconUrl(side) {
    return ICON_URLS[artifactIconKey(side)];
  }

  function showLoading(visible) {
    elements["artifact-loading-state"].hidden = !visible;
    elements["artifact-error-state"].hidden = true;
    elements["artifact-dashboard"].hidden = visible;
  }

  function showError() {
    elements["artifact-loading-state"].hidden = true;
    elements["artifact-dashboard"].hidden = true;
    elements["artifact-error-message"].textContent = text("error");
    elements["artifact-error-state"].hidden = false;
  }

  function updateCountdown() {
    if (!state.active || !state.bound) return;
    updateCycleCountdown();
    if (state.selectedRoundKey !== "current") return;
    const signature = currentVisibilitySignature();
    if (state.visibilitySignature && state.visibilitySignature !== signature) {
      render();
      return;
    }
    state.visibilitySignature = signature;
    document.querySelectorAll("[data-artifact-countdown]").forEach(element => {
      const pair = payloadPair(Number(element.dataset.artifactCountdown));
      const nextBattleAt = effectiveNextBattleAt(pair);
      element.textContent = nextBattleAt
        ? formatCountdown(Math.max(0, nextBattleAt - Date.now())) : "—";
    });
  }

  function updateCycleCountdown(period = matchingPeriod()) {
    const remaining = period.endAt - Date.now();
    elements["artifact-cycle-countdown"].textContent = remaining > 0
      ? formatCountdown(remaining)
      : text("matchEnded");
  }

  function publishedBattleAt(pair) {
    const timestamp = Number(pair?.nextBattleAt) || 0;
    if (timestamp <= 0) return 0;
    const date = new Date(timestamp + KOREA_OFFSET_MS).toISOString().slice(0, 10);
    return roundTimestampForPair(date, Number(pair?.pairId) || 1);
  }

  function effectiveNextBattleAt(pair) {
    const pairId = Number(pair?.pairId) || 1;
    const now = Date.now();
    const korea = new Date(now + 9 * 60 * 60_000);
    for (let days = 0; days <= 7; days += 1) {
      const date = new Date(Date.UTC(
        korea.getUTCFullYear(), korea.getUTCMonth(), korea.getUTCDate() + days,
        0, 0, 0, 0));
      if (date.getUTCDay() !== 3 && date.getUTCDay() !== 6) continue;
      const candidate = roundTimestampForPair(date.toISOString().slice(0, 10), pairId);
      if (candidate > now) return candidate;
    }
    return 0;
  }

  function isCurrentRoundHeld(pair, now = Date.now()) {
    const published = publishedBattleAt(pair);
    if (published <= now) return true;
    const startedAt = previousBattleAt(published, Number(pair?.pairId) || 1);
    return startedAt > 0 && now < startedAt + BATTLE_REVEAL_DELAY_MS;
  }

  function currentVisibilitySignature(now = Date.now()) {
    return PAIRS.map(pair => {
      const current = payloadPair(pair.pairId);
      return `${pair.pairId}:${isCurrentRoundHeld(current, now) ? 1 : 0}`;
    }).join("|");
  }

  function formatBattleTime(timestamp) {
    return new Intl.DateTimeFormat(state.locale, {
      timeZone: serviceRegion === "TW" ? "Asia/Taipei" : "Asia/Seoul", weekday: "short", hour: "2-digit", minute: "2-digit", hour12: false,
    }).format(new Date(timestamp));
  }

  function formatRoundDate(roundKey) {
    const timestamp = Date.parse(`${roundKey}T03:00:00Z`);
    return new Intl.DateTimeFormat(state.locale, {
      timeZone: serviceRegion === "TW" ? "Asia/Taipei" : "Asia/Seoul", year: "numeric", month: "short", day: "numeric",
    }).format(new Date(timestamp));
  }

  function formatCycleDate(timestamp) {
    return new Intl.DateTimeFormat(state.locale, {
      timeZone: serviceRegion === "TW" ? "Asia/Taipei" : "Asia/Seoul", month: "short", day: "numeric",
    }).format(new Date(timestamp));
  }

  function formatHistoryMoment(timestamp) {
    return new Intl.DateTimeFormat(state.locale, {
      timeZone: serviceRegion === "TW" ? "Asia/Taipei" : "Asia/Seoul", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", hour12: false,
    }).format(new Date(timestamp));
  }

  function formatCountdown(milliseconds) {
    const total = Math.floor(milliseconds / 1000);
    const days = Math.floor(total / 86_400);
    const hours = Math.floor((total % 86_400) / 3_600);
    const minutes = Math.floor((total % 3_600) / 60);
    const seconds = total % 60;
    const clock = [hours, minutes, seconds].map(value => String(value).padStart(2, "0")).join(":");
    return days > 0 ? `${days}일 ${clock}` : clock;
  }

  function formatObservedAt(seconds) {
    return new Intl.DateTimeFormat(state.locale, {
      timeZone: serviceRegion === "TW" ? "Asia/Taipei" : "Asia/Seoul", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
    }).format(new Date(seconds * 1000));
  }

  async function copySnapshot() {
    if (!state.data) return;
    const status = elements["artifact-copy-status"];
    status.textContent = "";
    status.removeAttribute("data-state");
    setSnapshotButtonState("working");
    try {
      const canvas = await createSnapshotCanvas();
      const blob = await new Promise((resolve, reject) => canvas.toBlob(
        value => value ? resolve(value) : reject(new Error("blob")), "image/png"));
      if (navigator.clipboard?.write && globalThis.ClipboardItem) {
        try {
          await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
          showSnapshotResult("copied", "copied");
        } catch {
          downloadBlob(blob);
          showSnapshotResult("downloaded", "downloaded");
        }
      } else {
        downloadBlob(blob);
        showSnapshotResult("downloaded", "downloaded");
      }
    } catch {
      showSnapshotResult("failed", "snapshotFailed");
    }
  }

  function showSnapshotResult(buttonState, messageKey) {
    const status = elements["artifact-copy-status"];
    status.textContent = text(messageKey);
    status.dataset.state = buttonState;
    setSnapshotButtonState(buttonState);
  }

  function setSnapshotButtonState(buttonState) {
    const button = elements["artifact-snapshot-button"];
    const label = elements["artifact-snapshot-label"];
    const icon = button?.querySelector("[data-artifact-snapshot-icon]");
    if (!button || !label) return;

    window.clearTimeout(state.snapshotFeedbackTimer);
    button.classList.remove("is-working", "is-copied", "is-downloaded", "is-failed");
    button.disabled = buttonState === "working";
    button.setAttribute("aria-busy", buttonState === "working" ? "true" : "false");
    if (buttonState === "working") {
      button.classList.add("is-working");
      label.textContent = text("snapshotWorking");
      if (icon) icon.textContent = "◌";
      return;
    }

    const presentation = {
      copied: ["is-copied", "snapshotCopied", "✓"],
      downloaded: ["is-downloaded", "snapshotDownloaded", "↓"],
      failed: ["is-failed", "snapshotFailedShort", "!"],
    }[buttonState];
    if (presentation) {
      button.classList.add(presentation[0]);
      label.textContent = text(presentation[1]);
      if (icon) icon.textContent = presentation[2];
    }

    state.snapshotFeedbackTimer = window.setTimeout(() => {
      button.classList.remove("is-copied", "is-downloaded", "is-failed");
      button.disabled = false;
      button.setAttribute("aria-busy", "false");
      label.textContent = text("snapshot");
      if (icon) icon.textContent = "▣";
      const status = elements["artifact-copy-status"];
      if (status) {
        status.textContent = "";
        status.removeAttribute("data-state");
      }
    }, 3_200);
  }

  async function createSnapshotCanvas() {
    const canvas = document.createElement("canvas");
    canvas.width = SNAPSHOT_WIDTH;
    canvas.height = SNAPSHOT_HEIGHT;
    const context = canvas.getContext("2d");
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";
    const gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, "#0d2330"); gradient.addColorStop(0.52, "#06121c"); gradient.addColorStop(1, "#180d20");
    context.fillStyle = gradient; context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "rgba(36,219,229,.12)"; context.beginPath(); context.arc(100, 180, 280, 0, Math.PI * 2); context.fill();
    context.fillStyle = "rgba(214,76,235,.11)"; context.beginPath(); context.arc(2050, 180, 360, 0, Math.PI * 2); context.fill();
    const [neutralIcon, westIcon, eastIcon] = await Promise.all([
      loadImage(ICON_URLS.neutral),
      loadImage(ICON_URLS.west),
      loadImage(ICON_URLS.east),
    ]);
    const icons = { neutral: neutralIcon, west: westIcon, east: eastIcon };
    context.drawImage(icons.neutral, 40, 30, 86, 86);
    context.fillStyle = "#f7fcfd"; context.font = "900 56px Pretendard, sans-serif"; context.fillText(text("snapshotTitle"), 150, 77);
    const historical = state.selectedRoundKey !== "current";
    const snapshotRound = historical ? text("historyTitle", { date: formatRoundDate(state.selectedRoundKey) })
      : `${text("koreaOnly")} · ${text("overviewTitle")}`;
    context.fillStyle = "#a9bec8"; context.font = "750 27px Pretendard, sans-serif"; context.fillText(`NotMeter · ${snapshotRound}`, 151, 113);
    const period = matchingPeriod();
    context.fillStyle = "#aaf8fb"; context.font = "850 24px Pretendard, sans-serif";
    context.fillText(text("matchWeek", { week: period.week }), 40, 154);
    context.fillStyle = "#9bb2bd"; context.font = "750 22px Pretendard, sans-serif";
    context.fillText(text("matchRange", {
      start: formatCycleDate(period.startAt), end: formatCycleDate(period.endAt),
    }), 330, 154);
    context.textAlign = "right"; context.fillStyle = "#fff2b8"; context.font = "850 23px Pretendard, sans-serif";
    context.fillText(`${text("matchRounds", { total: period.totalRounds })} · ${text("matchSchedule")}`, 2360, 154);
    roundedRect(context, 40, 171, 2320, 38, 10, "rgba(18,53,64,.68)", "rgba(79,121,135,.7)", 2);
    context.textAlign = "center"; context.fillStyle = "#d9e8ec"; context.font = "800 21px Pretendard, sans-serif";
    const legend = [1, 2].map(layer => `${text(layer === 1 ? "lower" : "middle")}  ${ARTIFACTS[layer]
      .map(([id, name]) => snapshotArtifactName(name, id)).join(" · ")}`).join("     |     ");
    context.fillText(legend, 1200, 198, 2260);
    const presentations = state.presentations.length === PAIRS.length
      ? state.presentations
      : sortPresentationsByFavorites(PAIRS.map(pair =>
          buildPairPresentation(payloadPair(pair.pairId), false)));
    presentations.forEach((presentation, index) => {
      const column = index % SNAPSHOT_COLUMNS;
      const row = Math.floor(index / SNAPSHOT_COLUMNS);
      const isLastSolo = presentations.length % SNAPSHOT_COLUMNS !== 0
        && index === presentations.length - 1;
      const cardX = isLastSolo
        ? (SNAPSHOT_WIDTH - SNAPSHOT_CARD_WIDTH) / 2
        : 30 + column * 1182;
      drawSnapshotPair(context, presentation, cardX, 220 + row * 218, icons);
    });
    context.textAlign = "left"; context.fillStyle = "#91aab6"; context.font = "700 20px Pretendard, sans-serif";
    context.fillText(text("source"), 40, 2654);
    context.textAlign = "right"; context.fillStyle = "#d7e5e9"; context.font = "850 21px Pretendard, sans-serif";
    context.fillText(new Intl.DateTimeFormat(state.locale, { timeZone: serviceRegion === "TW" ? "Asia/Taipei" : "Asia/Seoul", dateStyle: "medium", timeStyle: "short" }).format(new Date()), 2360, 2654);
    return canvas;
  }

  function drawSnapshotPair(context, presentation, x, y, icons) {
    const { pair, layers, west, east, lead, cumulative, historical, favoriteCount } = presentation;
    roundedRect(context, x, y, SNAPSHOT_CARD_WIDTH, SNAPSHOT_CARD_HEIGHT, 18, "rgba(5,18,27,.97)", favoriteCount > 0 ? "#d0b35d" : "#3a5968", 2);
    context.textAlign = "left"; context.fillStyle = "#a9bdc6"; context.font = "800 19px Pretendard, sans-serif";
    const battleAt = historical ? Number(pair.nextBattleAt) : effectiveNextBattleAt(pair);
    context.fillText(`${favoriteCount > 0 ? "★ " : ""}${String(pair.pairId).padStart(2, "0")} · ${battleAt ? formatBattleTime(battleAt) : "—"}`, x + 20, y + 27);
    context.textAlign = "right"; context.fillStyle = west > east ? "#8af5ff" : east > west ? "#f0a5ff" : "#c0d0d7";
    context.font = "900 20px Pretendard, sans-serif"; context.fillText(lead, x + 1138, y + 27);
    context.textAlign = "left"; context.fillStyle = "#8df2fb"; context.font = "900 38px Pretendard, sans-serif";
    context.fillText(serverDisplayName(pair.west), x + 20, y + 70, 370);
    context.textAlign = "right"; context.fillStyle = "#f0a7fc"; context.fillText(serverDisplayName(pair.east), x + 1138, y + 70, 370);
    context.textAlign = "center"; context.font = "950 44px Pretendard, sans-serif";
    context.fillStyle = "#44e5f3"; context.fillText(String(west), x + 508, y + 72);
    context.fillStyle = "#8ba2ad"; context.fillText(":", x + 579, y + 72);
    context.fillStyle = "#e37cf3"; context.fillText(String(east), x + 650, y + 72);
    const entries = layers.flatMap(layer => layer.entries);
    entries.forEach((entry, entryIndex) => {
      const itemX = x + 20 + entryIndex * 186;
      const itemY = y + 88;
      const fill = entry.ownerSide === 1 ? "rgba(24,201,222,.25)" : entry.ownerSide === 2 ? "rgba(203,73,229,.25)" : "rgba(126,153,164,.14)";
      const border = entry.ownerSide === 1 ? "#3195a4" : entry.ownerSide === 2 ? "#9a48aa" : "#3a5968";
      const foreground = entry.ownerSide === 1 ? "#9af7fd" : entry.ownerSide === 2 ? "#f1adfb" : "#c0d0d7";
      roundedRect(context, itemX, itemY, 174, 55, 10, fill, border, 2);
      context.drawImage(icons[artifactIconKey(entry.ownerSide)], itemX + 8, itemY + 9, 37, 37);
      context.textAlign = "left"; context.fillStyle = foreground; context.font = "900 23px Pretendard, sans-serif";
      context.fillText(snapshotArtifactName(entry.name, entry.artifactId), itemX + 51, itemY + 36, 115);
    });
    drawSnapshotCumulative(context, cumulative, x + 16, y + 150);
    context.textAlign = "right"; context.fillStyle = "#fff3b9"; context.font = "900 20px Pretendard, sans-serif";
    const timeText = battleAt ? (historical ? formatHistoryMoment(battleAt) : formatCountdown(Math.max(0, battleAt - Date.now()))) : "—";
    context.fillText(`${historical ? text("historyRecord") : text("next")} ${timeText}`, x + 1138, y + 179, 360);
  }

  function drawSnapshotCumulative(context, cumulative, x, y) {
    const width = 720;
    const height = 43;
    roundedRect(context, x, y, width, height, 11, "rgba(8,34,45,.98)", "#67cbd5", 2);
    context.fillStyle = "#f5dc8c";
    context.fillRect(x + 3, y + 10, 4, 23);
    context.textAlign = "left";
    context.fillStyle = "#fff0b5";
    context.font = "900 18px Pretendard, sans-serif";
    context.fillText(text("cumulativeScore"), x + 17, y + 28, 145);

    if (cumulative.count > 0) {
      const westText = String(cumulative.west);
      const eastText = String(cumulative.east);
      context.font = "950 30px Pretendard, sans-serif";
      const westWidth = context.measureText(westText).width;
      const colonWidth = context.measureText(":").width;
      const eastWidth = context.measureText(eastText).width;
      const totalWidth = westWidth + colonWidth + eastWidth + 14;
      let scoreX = x + 338 - totalWidth / 2;
      context.fillStyle = "#67edf7";
      context.fillText(westText, scoreX, y + 32);
      scoreX += westWidth + 7;
      context.fillStyle = "#a9bdc6";
      context.fillText(":", scoreX, y + 32);
      scoreX += colonWidth + 7;
      context.fillStyle = "#ed9cf8";
      context.fillText(eastText, scoreX, y + 32);
      context.textAlign = "right";
      context.fillStyle = "#d9e8ec";
      context.font = "850 17px Pretendard, sans-serif";
      context.fillText(text("cumulativeCoverage", { count: cumulative.count, total: cumulative.total }), x + width - 16, y + 28, 180);
      return;
    }

    context.textAlign = "center";
    context.fillStyle = "#e6f2f5";
    context.font = "900 21px Pretendard, sans-serif";
    context.fillText(text("cumulativePending"), x + 420, y + 29, 450);
  }

  function snapshotArtifactName(name, artifactId) {
    const translated = ARTIFACT_TRANSLATIONS[state.locale]?.[artifactId]?.[1];
    if (translated) return translated;
    return String(name || "")
      .replace("에레슈란타의 뿌리 아티팩트", "뿌리")
      .replace("유황나무섬 아티팩트", "유황섬")
      .replace("시엘의 날개 군도 아티팩트", "시엘 군도")
      .replace("침식된 중앙섬 아티팩트", "중앙섬")
      .replace("오염된 늪지 아티팩트", "늪지")
      .replace("뒤틀린 고목나무 숲 아티팩트", "고목숲")
      .replace(/\s*아티팩트$/u, "");
  }

  function roundedRect(context, x, y, width, height, radius, fill, stroke, lineWidth = 1) {
    context.beginPath();
    context.moveTo(x + radius, y); context.lineTo(x + width - radius, y); context.quadraticCurveTo(x + width, y, x + width, y + radius);
    context.lineTo(x + width, y + height - radius); context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    context.lineTo(x + radius, y + height); context.quadraticCurveTo(x, y + height, x, y + height - radius);
    context.lineTo(x, y + radius); context.quadraticCurveTo(x, y, x + radius, y); context.closePath();
    context.fillStyle = fill; context.fill(); context.strokeStyle = stroke; context.lineWidth = lineWidth; context.stroke();
  }

  function loadImage(source) {
    return new Promise((resolve, reject) => {
      const image = new Image(); image.onload = () => resolve(image); image.onerror = reject; image.src = source;
    });
  }

  function downloadBlob(blob) {
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = state.selectedRoundKey === "current"
      ? "NotMeter-아티팩트-전체-서버.png"
      : `NotMeter-아티팩트-${state.selectedRoundKey}.png`;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(link.href), 1_000);
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, character => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;",
    })[character]);
  }

  function activate() {
    bind();
    selectService(serviceRegion, false);
    if (state.active) return;
    state.active = true;
    setStaticCopy();
    render();
    refreshOnResume();
    state.clockTimer = window.setInterval(updateCountdown, 1_000);
  }

  function refreshOnResume() {
    if (!state.active) return;
    void refresh().finally(() => {
      if (state.active) schedulePoll();
    });
  }

  function deactivate() {
    state.active = false;
    window.clearTimeout(state.pollTimer); state.pollTimer = 0;
    window.clearInterval(state.clockTimer); state.clockTimer = 0;
    state.requestController?.abort(); state.requestController = null;
  }

  function setLocale(locale) {
    state.locale = normalizeLocale(locale);
    selectService(serviceSelected ? serviceRegion : state.locale === "zh-TW" ? "TW" : "KR", false);
    if (state.bound) render();
  }

  window.NotMeterArtifactOccupation = { activate, deactivate, setLocale };
})();
