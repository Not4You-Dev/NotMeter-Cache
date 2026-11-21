(() => {
  "use strict";

  const styleUrl = document.currentScript?.src && new URL("artifact-redesign.css?v=20261104-artifact-table", document.currentScript.src);
  const localCacheOverride = ["localhost", "127.0.0.1"].includes(window.location.hostname)
    ? new URLSearchParams(window.location.search).get("artifactApi") : "";
  let PUBLIC_CACHE_PATH = "https://raw.githubusercontent.com/Not4You-Dev/NotMeter-Cache/main/presence/notmeter-artifact-occupation-public.json";
  let PUBLIC_CACHE_REF_URL = "https://api.github.com/repos/Not4You-Dev/NotMeter-Cache/commits?path=presence/notmeter-artifact-occupation-public.json&per_page=1";
  let serviceRegion = "KR";
  let serviceSelected = false;
  const EXPECTED_SCHEMA = "notmeter-artifact-occupation-public-v1";
  let EXPECTED_REVISION = "kr-2026-11-11";
  const MATCH_DURATION_DAYS = 14;
  const MATCH_BATTLE_WEEKDAYS = new Set([3, 6]);
  const DAY_MS = 24 * 60 * 60_000;
  const CYCLE_RESTART_DATE = "2026-11-04";
  const CYCLE_END_DATE = "2026-11-11";
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
    [1,1001,"시엘",2002,"지켈"],
    [2,1003,"바이젤",2018,"바바룽"],
    [3,2003,"트리니엘",2006,"아스펠"],
    [4,1004,"카이시넬",2004,"루미엘"],
    [5,2005,"마르쿠탄",2021,"이스할겐"],
    [6,1005,"유스티엘",2007,"에레슈키갈"],
    [7,1006,"아리엘",2009,"네몬"],
    [8,1007,"프레기온",1018,"코치룽"],
    [9,1008,"메스람타에다",2012,"울고른"],
    [10,1010,"나니아",2015,"젠카카"],
    [11,2011,"루드라",2008,"브리트라"],
    [12,2013,"무닌",2019,"파프니르"],
    [13,1013,"페르노스",2017,"콰이링"],
    [14,2014,"오다르",2020,"인드나흐"],
    [15,1014,"다미누",1012,"루터스"],
    [16,1015,"카사카",1011,"타하바타"],
    [17,1016,"바카르마",1002,"네자칸"],
    [18,2016,"크로메데",2010,"하달"],
    [19,1017,"챈가룽",1009,"히타니에"],
    [20,1019,"이슈타르",2001,"이스라펠"],
    [21,1021,"포에타",1020,"티아마트"],
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
  const COPY = (globalThis.NotMeterI18n?.withVietnamese || (copy => copy))({
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
      matchingPending: "새 대진을 표시합니다. 점령 결과는 확인 후 반영됩니다.",
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
      matchingPending: "New matchups are shown. Control results will appear once confirmed.",
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
      matchingPending: "已顯示新配對，佔領結果將於確認後更新。",
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
  });

  const VIEW_COPY = {
    ko: ["실시간", "아티팩트", "한국 {count}개 서버 매치의 아티팩트 점령 현황을 한눈에", "대만 {count}개 서버 매치의 아티팩트 점령 현황을 한눈에", "점령 보고 갱신 {time}", "현재 서버 매치", "2주 매치 · {week}주차", "{start} 시작 · {end} 매치 변경", "2주간 점령전", "{total}회", "다음 점령전", "{slot} 매치", "{count}개 매치 동시 진행", "현재 점령 판세 · {count}개 매치", "내 서버 찾기 (예: {server})", "{count}개 매치", "없음", "전체", "서쪽 우세", "동률", "동쪽 우세", "매치 번호", "시간 순", "격차 큰 순", "접전 순", "카드", "표", "하층", "중층", "혼돈의 에레슈란타 하층", "혼돈의 에레슈란타 중층", "지점별 점령 · {count}개 매치", "서쪽 서버 점령", "동쪽 서버 점령", "하층(뿌리·유황섬·시엘 군도) 3개 + 중층(중앙섬·늪지·고목숲) 3개 = 아티팩트 6개, 1개당 1점 · 2주 누적은 하층·중층 점령지가 모두 확인된 회차만 합산", "즐겨찾기", "전체 매치", "조건에 맞는 매치가 없습니다.", "점령 정보는 미터기 사용자 보고로 갱신되며 실제와 몇 분 차이가 날 수 있습니다. 새 매치가 시작되면 2주 누적이 초기화됩니다.", "수·토", "랭킹 · 통계", "빌드 · 도구", "커뮤니티", "전체 메뉴", "캐릭터 이름 검색", "미터기 다운로드"],
    en: ["Live", "Artifact", "Artifact control across {count} Korean server matchups", "Artifact control across {count} Taiwan server matchups", "Occupation reports updated {time}", "Current matchup", "Two-week matchup · Week {week}", "{start} start · {end} rotation", "Battles in two weeks", "{total} rounds", "Next battle", "{slot} matchups", "{count} simultaneous matchups", "Current control · {count} matchups", "Find my server (e.g. {server})", "{count} matchups", "None", "All", "West leads", "Tied", "East leads", "Match number", "Time", "Largest gap", "Closest", "Cards", "Table", "Lower", "Middle", "Lower Abyss", "Middle Abyss", "Control by location · {count} matchups", "West server control", "East server control", "Three Lower and three Middle artifacts are worth one point each. Only rounds with both layers confirmed count toward the two-week total.", "Favorites", "All matchups", "No matchups match the filter.", "Meter users report artifact control, so updates may lag by a few minutes. The total resets when a new matchup starts.", "Wed · Sat", "Rankings", "Builds & Tools", "Community", "All menus", "Search character names", "Download meter"],
    "zh-TW": ["即時", "神器", "查看韓國 {count} 組伺服器配對的神器佔領狀態", "查看台灣 {count} 組伺服器配對的神器佔領狀態", "佔領回報更新 {time}", "目前伺服器配對", "兩週配對 · 第 {week} 週", "{start} 開始 · {end} 更換配對", "兩週佔領戰", "{total} 場", "下一場佔領戰", "{slot} 配對", "{count} 組配對同時進行", "目前佔領局勢 · {count} 組配對", "尋找伺服器（例如 {server}）", "{count} 組配對", "無", "全部", "西方領先", "平手", "東方領先", "配對編號", "時間排序", "差距最大", "差距最小", "卡片", "表格", "下層", "中層", "混沌艾雷修藍塔下層", "混沌艾雷修藍塔中層", "各據點佔領 · {count} 組配對", "西方伺服器佔領", "東方伺服器佔領", "下層與中層各有 3 座神器，每座計 1 分。兩層均確認的場次才納入兩週累計。", "最愛", "全部配對", "沒有符合條件的配對。", "佔領資訊由計量器使用者回報，可能延遲數分鐘。新配對開始時，兩週累計分數將重設。", "三・六", "排名與統計", "配置與工具", "社群", "全部選單", "搜尋角色名稱", "下載計量器"],
  };
  const VIEW_KEYS = "live title krDescription twDescription updated matchLabel matchWeek matchRange matchRoundLabel rounds next slot simultaneous control search matches none all westLead draw eastLead number time gap close cards table lower middle lowerTitle middleTitle spots westOwner eastOwner guide favorites allMatches empty note days rankings tools community menu searchCharacter download".split(" ");
  const VIEW_TEXT = Object.fromEntries(Object.entries(VIEW_COPY).map(([locale, values]) =>
    [locale, Object.fromEntries(VIEW_KEYS.map((key, index) => [key, values[index]]))]));
  const HELP_KEYS = "guideTitle guideHeadline faq cpQuestion goldTier blueTier purpleTier eligibleTier staticTier missingRecord conditions partyCount killConfirm aggregate retained retainedNote".split(" ");
  const HELP_TEXT = {
    ko: ["랭커 마크 · 닉네임 효과", "주간 순위가\n미터기 위에 표시됩니다", "자주 묻는 질문", "CP가 올라 구간이 바뀌면?", "움직이는 금색 다이아몬드", "하늘색 테두리", "보라색 테두리", "닉네임 효과 자격 포함", "정지 테두리", "내 기록이 보이지 않나요?", "랭킹 집계 조건 4가지를 확인하세요", "5인", "처치 확인", "집계 주기", "상세 보관", "TOP 20만 전투 상세를 보관합니다. 나머지 기록도 상위 10%·25% 기준선 계산에는 포함됩니다."],
    en: ["Ranker marks and nickname effects", "Your weekly rank\nappears on the meter", "Frequently asked questions", "What happens when my CP bracket changes?", "Animated gold diamond", "Sky blue frame", "Purple frame", "Includes nickname effect eligibility", "Static frame", "Can't see your record?", "Check the four ranking requirements", "5 players", "Confirmed kill", "Aggregation schedule", "Detail retention", "Combat details are retained for the top 20. Other records still contribute to the top 10% and 25% benchmarks."],
    "zh-TW": ["排名標記與暱稱特效", "每週排名會\n顯示在計量器上", "常見問題", "戰鬥力提升並跨區間時會怎樣？", "動態金色菱形", "天藍色邊框", "紫色邊框", "包含暱稱特效資格", "靜態邊框", "找不到你的紀錄？", "請確認 4 項排名統計條件", "5 人", "確認擊殺", "統計週期", "詳細紀錄保留", "僅保留前 20 名的戰鬥詳細紀錄。其餘紀錄仍會計入前 10% 和 25% 的門檻計算。"],
  };
  for (const locale of ["ko", "en", "zh-TW"]) {
    HELP_KEYS.forEach((key, index) => { VIEW_TEXT[locale][key] = HELP_TEXT[locale][index]; });
  }
  const LOCALIZED_VIEW_COPY = {
    "ja-JP": [
      "ライブ", "アーティファクト", "韓国 {count} 組のサーバーの占領状況を一覧表示", "台湾 {count} 組のサーバーの占領状況を一覧表示", "占領報告更新 {time}",
      "現在のサーバー組み合わせ", "2週間マッチ · 第{week}週", "{start} 開始 · {end} 組み合わせ変更", "2週間の占領戦", "{total}回", "次回の占領戦", "{slot} の対戦", "{count} 組が同時開催", "現在の占領状況 · {count} 組",
      "サーバーを検索（例: {server}）", "{count} 組", "なし", "すべて", "西側優勢", "同点", "東側優勢", "対戦番号", "時間順", "得点差が大きい順", "得点差が小さい順", "カード", "表", "下層", "中層",
      "アビス下層", "アビス中層", "拠点別の占領 · {count} 組", "西側サーバー占領", "東側サーバー占領", "下層と中層に各3拠点あり、各1点です。両層の占領が確認できた回だけ2週間の合計に加算します。",
      "お気に入り", "すべての対戦", "条件に一致する対戦がありません。", "占領情報はメーター利用者の報告に基づき、数分遅れることがあります。組み合わせが変わると累計がリセットされます。",
      "水・土", "ランキング・統計", "ビルド・ツール", "コミュニティ", "全メニュー", "キャラクター名で検索", "メーターをダウンロード",
      "ランカーマークと名前エフェクト", "週間順位が\nメーターに表示されます", "よくある質問", "戦闘力の区間が変わるとどうなりますか？", "動く金色のひし形", "水色の枠", "紫色の枠", "名前エフェクトの資格を含む", "静止枠", "記録が表示されませんか？", "ランキングの4つの集計条件を確認してください", "5人", "討伐確認", "集計周期", "詳細の保存", "戦闘詳細を保存するのは上位20件です。他の記録も上位10％・25％の基準計算に含まれます。",
    ],
    "de-DE": [
      "Live", "Artefakte", "Artefaktkontrolle in {count} koreanischen Serverpaarungen", "Artefaktkontrolle in {count} taiwanischen Serverpaarungen", "Besetzungsberichte aktualisiert {time}",
      "Aktuelle Serverpaarung", "Zweiwöchige Paarung · Woche {week}", "{start} Start · {end} Wechsel", "Kämpfe in zwei Wochen", "{total} Runden", "Nächster Kampf", "Paarungen um {slot}", "{count} gleichzeitige Kämpfe", "Aktuelle Kontrolle · {count} Paarungen",
      "Server suchen (z. B. {server})", "{count} Paarungen", "Keine", "Alle", "Westen führt", "Gleichstand", "Osten führt", "Paarungsnummer", "Uhrzeit", "Größter Abstand", "Kleinster Abstand", "Karten", "Tabelle", "Unten", "Mitte",
      "Unterer Abyss", "Mittlerer Abyss", "Kontrolle pro Standort · {count} Paarungen", "Westserver kontrolliert", "Ostserver kontrolliert", "Je drei Artefakte pro Ebene ergeben je einen Punkt. Nur Runden mit beiden bestätigten Ebenen zählen zur Zweiwochenwertung.",
      "Favoriten", "Alle Paarungen", "Keine Paarung entspricht dem Filter.", "Meter-Nutzer melden die Kontrolle. Meldungen können sich um einige Minuten verzögern. Mit einer neuen Paarung beginnt die Wertung erneut.",
      "Mi · Sa", "Ranglisten · Statistik", "Builds · Werkzeuge", "Community", "Alle Menüs", "Charakternamen suchen", "Meter herunterladen",
      "Rangabzeichen und Namenseffekte", "Dein Wochenrang\nerscheint im Meter", "Häufig gestellte Fragen", "Was passiert beim Wechsel der CP-Gruppe?", "Animierte goldene Raute", "Hellblauer Rahmen", "Violetter Rahmen", "Berechtigung für Namenseffekte", "Statischer Rahmen", "Fehlt dein Eintrag?", "Prüfe die vier Ranglistenregeln", "5 Spieler", "Bestätigter Sieg", "Auswertungsrhythmus", "Gespeicherte Details", "Kampfdetails bleiben für die besten 20 erhalten. Andere Einträge zählen zu den Schwellen für die besten 10 % und 25 %.",
    ],
    "fr-FR": [
      "En direct", "Artefacts", "Contrôle des artefacts pour {count} duels de serveurs coréens", "Contrôle des artefacts pour {count} duels de serveurs taïwanais", "Rapports de contrôle mis à jour à {time}",
      "Duel de serveurs actuel", "Duel de deux semaines · Semaine {week}", "{start} début · {end} rotation", "Combats en deux semaines", "{total} manches", "Prochain combat", "Duels de {slot}", "{count} duels simultanés", "Contrôle actuel · {count} duels",
      "Rechercher un serveur (ex. {server})", "{count} duels", "Aucun", "Tous", "Ouest en tête", "Égalité", "Est en tête", "Numéro du duel", "Horaire", "Plus grand écart", "Plus serrés", "Cartes", "Tableau", "Inférieur", "Intermédiaire",
      "Abysses inférieurs", "Abysses intermédiaires", "Contrôle par site · {count} duels", "Contrôle par le serveur ouest", "Contrôle par le serveur est", "Chaque niveau compte trois artefacts valant un point chacun. Seules les manches confirmées sur les deux niveaux comptent au total.",
      "Favoris", "Tous les duels", "Aucun duel ne correspond au filtre.", "Les utilisateurs du compteur signalent le contrôle, avec un décalage possible de quelques minutes. Le total repart de zéro au prochain duel.",
      "Mer. · Sam.", "Classements · Statistiques", "Builds · Outils", "Communauté", "Tous les menus", "Rechercher un personnage", "Télécharger le compteur",
      "Marques de classement et effets de nom", "Votre rang hebdomadaire\ns’affiche dans le compteur", "Questions fréquentes", "Que se passe-t-il si ma tranche de PC change ?", "Losange doré animé", "Cadre bleu ciel", "Cadre violet", "Inclut l’accès aux effets de nom", "Cadre fixe", "Votre combat n’apparaît pas ?", "Vérifiez les quatre critères du classement", "5 joueurs", "Victoire confirmée", "Cycle de calcul", "Conservation des détails", "Les détails des combats sont conservés pour le top 20. Les autres combats contribuent aux seuils des 10 % et 25 %.",
    ],
    "es-ES": [
      "En directo", "Artefactos", "Control de artefactos en {count} cruces de servidores coreanos", "Control de artefactos en {count} cruces de servidores taiwaneses", "Informes de ocupación actualizados {time}",
      "Cruce actual de servidores", "Cruce de dos semanas · Semana {week}", "{start} inicio · {end} cambio", "Batallas en dos semanas", "{total} rondas", "Próxima batalla", "Cruces de las {slot}", "{count} cruces simultáneos", "Control actual · {count} cruces",
      "Buscar mi servidor (p. ej. {server})", "{count} cruces", "Ninguno", "Todos", "Oeste por delante", "Empate", "Este por delante", "Número de cruce", "Hora", "Mayor diferencia", "Menor diferencia", "Tarjetas", "Tabla", "Inferior", "Intermedio",
      "Abismo inferior", "Abismo intermedio", "Control por ubicación · {count} cruces", "Control del servidor oeste", "Control del servidor este", "Hay tres artefactos por nivel y cada uno vale un punto. Solo las rondas con ambos niveles confirmados suman al total.",
      "Favoritos", "Todos los cruces", "Ningún cruce coincide con el filtro.", "Los usuarios del medidor informan del control y puede haber unos minutos de retraso. El total se reinicia cuando cambia el cruce.",
      "Mié. · Sáb.", "Clasificaciones · Estadísticas", "Configuraciones · Herramientas", "Comunidad", "Todos los menús", "Buscar personajes por nombre", "Descargar medidor",
      "Insignias de clasificación y efectos de nombre", "Tu puesto semanal\naparece en el medidor", "Preguntas frecuentes", "¿Qué pasa si cambia mi tramo de PC?", "Rombo dorado animado", "Marco celeste", "Marco morado", "Incluye acceso al efecto de nombre", "Marco fijo", "¿No ves tu registro?", "Comprueba los cuatro requisitos del ranking", "5 jugadores", "Victoria confirmada", "Ciclo de cálculo", "Conservación de detalles", "Se guardan los detalles de combate del top 20. Los demás registros cuentan para los umbrales del 10 % y el 25 %.",
    ],
    "pt-BR": [
      "Ao vivo", "Artefatos", "Controle de artefatos em {count} confrontos de servidores coreanos", "Controle de artefatos em {count} confrontos de servidores taiwaneses", "Relatórios de ocupação atualizados {time}",
      "Confronto atual", "Confronto de duas semanas · Semana {week}", "{start} início · {end} troca", "Batalhas em duas semanas", "{total} rodadas", "Próxima batalha", "Confrontos às {slot}", "{count} confrontos simultâneos", "Controle atual · {count} confrontos",
      "Buscar meu servidor (ex.: {server})", "{count} confrontos", "Nenhum", "Todos", "Oeste na frente", "Empate", "Leste na frente", "Número do confronto", "Horário", "Maior diferença", "Menor diferença", "Cartões", "Tabela", "Inferior", "Intermediário",
      "Abismo inferior", "Abismo intermediário", "Controle por local · {count} confrontos", "Controle do servidor oeste", "Controle do servidor leste", "Há três artefatos por camada e cada um vale um ponto. Somente rodadas com as duas camadas confirmadas entram na soma.",
      "Favoritos", "Todos os confrontos", "Nenhum confronto corresponde ao filtro.", "Usuários do medidor informam o controle, com possível atraso de alguns minutos. O total reinicia quando o confronto muda.",
      "Qua. · Sáb.", "Rankings · Estatísticas", "Builds · Ferramentas", "Comunidade", "Todos os menus", "Buscar personagens pelo nome", "Baixar medidor",
      "Marcas de ranking e efeitos de nome", "Sua posição semanal\naparece no medidor", "Perguntas frequentes", "O que acontece se minha faixa de PC mudar?", "Losango dourado animado", "Moldura azul-clara", "Moldura roxa", "Inclui acesso ao efeito de nome", "Moldura estática", "Seu registro não aparece?", "Confira os quatro requisitos do ranking", "5 jogadores", "Derrota do chefe confirmada", "Ciclo de cálculo", "Retenção dos detalhes", "Os detalhes de combate são mantidos para o top 20. Os demais registros entram no cálculo dos limites de 10% e 25%.",
    ],
    "ru-RU": [
      "В реальном времени", "Артефакты", "Контроль артефактов в {count} парах корейских серверов", "Контроль артефактов в {count} парах тайваньских серверов", "Отчёты о захвате обновлены {time}",
      "Текущая пара серверов", "Двухнедельная пара · Неделя {week}", "{start} начало · {end} смена", "Бои за две недели", "{total} раундов", "Следующий бой", "Бои в {slot}", "{count} одновременных боёв", "Текущий контроль · {count} пар",
      "Найти свой сервер (например, {server})", "Пар: {count}", "Нет", "Все", "Запад лидирует", "Ничья", "Восток лидирует", "Номер пары", "Время", "Наибольший разрыв", "Наименьший разрыв", "Карточки", "Таблица", "Нижний", "Средний",
      "Нижний Абисс", "Средний Абисс", "Контроль по точкам · {count} пар", "Контроль западного сервера", "Контроль восточного сервера", "На каждом ярусе три артефакта по одному очку. В общий счёт входят только раунды с подтверждением по обоим ярусам.",
      "Избранное", "Все пары", "Нет пар, соответствующих фильтру.", "Данные поступают от пользователей измерителя и могут задерживаться на несколько минут. При смене пары общий счёт сбрасывается.",
      "Ср · Сб", "Рейтинги · Статистика", "Сборки · Инструменты", "Сообщество", "Все меню", "Поиск по имени персонажа", "Скачать измеритель",
      "Знаки рейтинга и эффекты имени", "Недельное место\nпоказывается в измерителе", "Частые вопросы", "Что происходит при смене диапазона боевой мощи?", "Анимированный золотой ромб", "Голубая рамка", "Фиолетовая рамка", "Включает доступ к эффектам имени", "Статичная рамка", "Не видно вашей записи?", "Проверьте четыре условия рейтинга", "5 игроков", "Подтверждённая победа", "График подсчёта", "Хранение деталей", "Подробности боя сохраняются для первых 20 результатов. Остальные записи учитываются при расчёте порогов 10% и 25%.",
    ],
    vi: [
      "Trực tiếp", "Cổ vật", "Tình trạng chiếm cổ vật của {count} cặp máy chủ Hàn Quốc", "Tình trạng chiếm cổ vật của {count} cặp máy chủ Đài Loan", "Báo cáo chiếm đóng cập nhật {time}",
      "Cặp máy chủ hiện tại", "Ghép cặp hai tuần · Tuần {week}", "{start} bắt đầu · {end} đổi cặp", "Trận chiến trong hai tuần", "{total} lượt", "Trận tiếp theo", "Cặp đấu lúc {slot}", "{count} cặp đấu đồng thời", "Chiếm đóng hiện tại · {count} cặp",
      "Tìm máy chủ (ví dụ: {server})", "{count} cặp", "Không có", "Tất cả", "Phía Tây dẫn", "Hòa", "Phía Đông dẫn", "Số cặp", "Theo giờ", "Chênh lệch lớn", "Chênh lệch nhỏ", "Thẻ", "Bảng", "Tầng dưới", "Tầng giữa",
      "Abyss tầng dưới", "Abyss tầng giữa", "Chiếm đóng theo vị trí · {count} cặp", "Máy chủ phía Tây chiếm", "Máy chủ phía Đông chiếm", "Mỗi tầng có ba cổ vật, mỗi cổ vật một điểm. Chỉ các lượt xác nhận cả hai tầng mới được cộng vào tổng hai tuần.",
      "Yêu thích", "Tất cả cặp đấu", "Không có cặp đấu phù hợp với bộ lọc.", "Người dùng trình đo báo cáo tình trạng chiếm đóng nên có thể chậm vài phút. Tổng điểm đặt lại khi đổi cặp.",
      "Thứ tư · Thứ bảy", "Xếp hạng · Thống kê", "Trang bị · Công cụ", "Cộng đồng", "Tất cả menu", "Tìm theo tên nhân vật", "Tải trình đo",
      "Dấu xếp hạng và hiệu ứng tên", "Hạng tuần xuất hiện\ntrên trình đo", "Câu hỏi thường gặp", "Điều gì xảy ra khi đổi bậc lực chiến?", "Hình thoi vàng động", "Viền xanh da trời", "Viền tím", "Kèm quyền dùng hiệu ứng tên", "Viền tĩnh", "Không thấy bản ghi của bạn?", "Kiểm tra bốn điều kiện xếp hạng", "5 người", "Xác nhận hạ gục", "Lịch tổng hợp", "Lưu chi tiết", "Chi tiết chiến đấu được lưu cho 20 hạng đầu. Các bản ghi khác vẫn góp vào ngưỡng 10% và 25%.",
    ],
  };
  for (const [locale, values] of Object.entries(LOCALIZED_VIEW_COPY)) {
    VIEW_TEXT[locale] = Object.fromEntries([...VIEW_KEYS, ...HELP_KEYS].map((key, index) => [key, values[index]]));
  }

  function viewText(key, replacements = {}) {
    const strings = VIEW_TEXT[state.locale] || VIEW_TEXT.en;
    return (shortCycleCopy(key) || strings[key] || VIEW_TEXT.en[key]).replace(/\{(\w+)\}/g, (_, name) => replacements[name] ?? "");
  }

  function shortCycleCopy(key) {
    if (!displayMatchingPeriod().reset) return "";
    const copy = {
      ko: { matchWeek:"1주 매치 · {week}주차", matchRoundLabel:"이번 매칭 점령전", cumulativeScore:"매칭 누적", scoringGuide:"아티팩트 1곳을 1점으로 계산하며 하층·중층이 모두 확인된 회차만 이번 매칭에 합산합니다.", guide:"하층 3개 + 중층 3개 = 아티팩트 6개, 1개당 1점 · 두 층이 모두 확인된 회차만 이번 매칭에 합산", note:"이번 매칭은 11월 4일부터 11월 11일까지이며 기존 대진을 유지합니다. 점령 정보는 미터기 사용자 보고로 갱신됩니다." },
      en: { matchWeek:"One-week matchup · Week {week}", matchRoundLabel:"Battles this matchup", cumulativeScore:"Matchup total", scoringGuide:"Each artifact is worth one point. Only rounds with both layers confirmed count toward this matchup.", guide:"Three Lower and three Middle artifacts are worth one point each. Only rounds with both layers confirmed count toward this matchup.", note:"This matchup runs from November 4 to November 11 with the same opponents. Meter users report artifact control." },
      "zh-TW": { matchWeek:"一週配對 · 第 {week} 週", matchRoundLabel:"本次配對佔領戰", cumulativeScore:"配對累計", scoringGuide:"每座神器計 1 分，僅在下層與中層全部確認後納入本次配對累計。", guide:"下層與中層各有 3 座神器，每座計 1 分。兩層均確認的場次才納入本次配對累計。", note:"本次配對期間為 11 月 4 日至 11 月 11 日，對戰組合不變。佔領資訊由計量器使用者回報。" },
    };
    return (copy[state.locale] || copy.en)[key] || "";
  }

  function readPreference(key, choices) {
    try {
      const value = localStorage.getItem("notmeter-artifact-" + key);
      if (choices.includes(value)) return value;
    } catch {
    }
    return choices[0];
  }
  const ARTIFACT_TRANSLATIONS = (globalThis.NotMeterI18n?.withVietnamese || (copy => copy))({
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
  }, true);

  globalThis.NotMeterI18n?.extend(COPY);

  globalThis.NotMeterI18n?.extend(ARTIFACT_TRANSLATIONS);
  ARTIFACT_TRANSLATIONS.vi = ARTIFACT_TRANSLATIONS.en;

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
    filter: "all",
    sort: readPreference("sort", ["no", "time", "gap", "close"]),
    mode: readPreference("mode", ["table", "grid"]),
    query: "",
    selectedRoundKey: "current",
    visibilitySignature: "",
    favoriteServerIds: readFavoriteServerIds(),
    presentations: [],
  };
  const elements = {};
  let chrome;

  const MENU = [
    ["rankings", [
      ["ranking", "bars", "", "던전 랭킹", "Dungeon rankings"],
      ["class-top10", "stack", "class-top10-button", "직업 종합 TOP 10"],
      ["class-performance", "dot-line", "class-performance-button", "직업 DPS 비교"],
      ["boss-resistance", "shield", "boss-resistance-button", "보스 저항"],
    ]],
    ["tools", [
      ["setup-guide", "grid", "contribution-button", "세팅 가이드"],
      ["stat-efficiency", "plus", "stat-efficiency-button", "스탯 효율 계산기"],
      ["pet-tracker", "paw", "pet-tracker-button", "펫 트래커"],
    ]],
    ["live", [
      ["field-boss", "diamond", "field-boss-button", "필드보스"],
      ["artifact", "square", "artifact-button", "아티팩트"],
    ]],
    ["community", [
      ["meter-sharing", "pair", "optimization-button", "미터 공유"],
    ]],
  ];

  function menuLink(item, variant = "nav") {
    const [id, icon, sourceId, korean, fallback] = item;
    const source = document.getElementById(sourceId);
    const label = state.locale === "ko" ? korean : id === "artifact" ? viewText("title")
      : source?.querySelector(".service-link-label")?.textContent.trim() || (id === "ranking" ? viewText("rankings") : fallback) || korean;
    const active = id === "artifact";
    const live = active || id === "field-boss";
    const description = active ? elements["artifact-description"].textContent : source?.getAttribute("title") || "";
    const glyph = `<span class="nv-ic nv-${icon}" aria-hidden="true"><i></i><i></i><i></i></span>`;
    const href = source?.getAttribute("href") || "./#rankings";
    const textLabel = escapeHtml(label);
    const current = active ? ' aria-current="page"' : "";
    if (variant === "footer") return `<a href="${escapeHtml(href)}"${current}>${textLabel}</a>`;
    if (variant === "sheet") return `<a class="sheet-item${active ? " on" : ""}" href="${escapeHtml(href)}"${current}>
      ${glyph}<span><b>${textLabel}${live ? '<em class="live-tag">LIVE</em>' : ""}</b>${description ? `<small>${escapeHtml(description)}</small>` : ""}</span></a>`;
    if (variant === "mobile") {
      const short = { ranking: state.locale === "ko" ? "랭킹" : state.locale === "zh-TW" ? "排名" : label, "class-top10": "TOP 10", "setup-guide": state.locale === "ko" ? "세팅" : label };
      return `<a href="${escapeHtml(href)}">${glyph}<span>${escapeHtml(short[id] || label)}</span></a>`;
    }
    return `<a class="nv${active ? " on" : ""}" href="${escapeHtml(href)}"${current}>${glyph}<span>${textLabel}</span>${live ? '<span class="nv-live"></span>' : ""}</a>`;
  }

  function mountArtifactChrome() {
    const surface = document.getElementById("artifact-surface");
    const app = surface.closest(".app-shell");
    const search = document.getElementById("global-character-search");
    const footer = app.querySelector(".page-footer");
    const chrome = document.createElement("div");
    const brand = '<a class="nm-logo" href="./#rankings"><img src="./assets/notmeter-icon.png?v=20260927-split" alt=""><span>NotMeter</span></a>';
    const download = '<button class="hd-dl" type="button" data-af-download data-af-copy="download"></button>';
    const menuIcon = '<span class="nv-grid" aria-hidden="true"><i></i><i></i><i></i><i></i></span>';
    chrome.innerHTML = `
      <header class="hd af-chrome" hidden>
        <div class="hd-row1"><div class="hd-in">
          ${brand}<div class="af-search-slot"></div><span class="hd-sp"></span>
          <span class="hd-clock mono"><span class="nv-live"></span><time></time><small>KST</small></span>
          <div class="hd-region" data-af-regions></div>
          <div class="hd-pop"><button type="button" class="hd-chip" aria-expanded="false" aria-controls="artifact-language-options"><span class="globe"></span><span data-af-current-language></span><span class="caret"></span></button>
            <div class="hd-menu" id="artifact-language-options" hidden></div>
          </div>
          <button class="nv-all" type="button" data-af-open-menu>${menuIcon}<span data-af-copy="menu"></span></button>
          ${download}
          <button class="hd-burger" type="button" data-af-open-menu><i></i><i></i><i></i></button>
        </div></div>
        <nav class="hd-row2"><div class="hd-in"></div></nav>
      </header>
      <nav class="mtabs af-chrome" hidden></nav>
      <dialog class="sheet-ov af-chrome" id="artifact-menu" aria-labelledby="artifact-menu-title">
        <div class="sheet">
          <div class="sheet-head"><b id="artifact-menu-title" data-af-copy="menu"></b><span class="sub">NotMeter</span><button class="x" type="button" data-af-close-menu></button></div>
          <div class="sheet-grid"></div>
          <div class="sheet-foot"><div class="sf-row"><div class="hd-region" data-af-regions></div></div>
            <div class="sf-row"><div class="hd-region" data-af-languages></div></div>${download}
          </div>
        </div>
      </dialog>
      <footer class="ft af-chrome" hidden>
        <div class="ft-top"><div class="ft-brand">${brand}<p></p>${download}</div></div>
        <div class="ft-bot"><span class="af-footer-schedule"></span></div>
      </footer>`;
    const [header, tabs, menu, pageFooter] = chrome.children;
    app.before(header, tabs, menu);
    footer.after(pageFooter);
    const legalPlaceholder = document.createTextNode("");
    const legal = footer.querySelector(".footer-links");
    legal.before(legalPlaceholder);
    const searchPlaceholder = document.createTextNode("");
    search.before(searchPlaceholder);
    const bar = document.createElement("div");
    bar.className = "af-search-scope";
    bar.innerHTML = `<button class="hs-scope-btn" type="button" aria-expanded="false" aria-controls="character-search-regions"><b></b><span class="hs-dot"></span><span></span><span class="caret"></span></button>`;
    const scope = bar.querySelector("button");
    const key = document.createElement("kbd");
    key.className = "af-search-key";
    key.textContent = "/";
    const searchRegion = search.querySelector("#character-search-regions");
    const searchInput = search.querySelector("#character-search-input");
    let originalPlaceholder = "";
    const language = document.getElementById("language-button");
    const selectLanguage = header.querySelector(".hd-chip");
    const languageMenu = header.querySelector(".hd-menu");
    const downloadButton = document.getElementById("download-button");
    const observer = new ResizeObserver(() => document.body.style.setProperty("--af-header-height", header.offsetHeight + "px"));
    observer.observe(header);
    window.addEventListener("scroll", () => {
      if (state.active) header.classList.toggle("artifact-scrolled", window.scrollY > 40);
    }, { passive: true });

    function closeScope() {
      scope.setAttribute("aria-expanded", "false");
      search.classList.remove("af-scope-open");
    }
    function closeLanguage() {
      languageMenu.hidden = true;
      selectLanguage.setAttribute("aria-expanded", "false");
    }
    function syncScope() {
      const selected = searchRegion.querySelector(":checked");
      const label = selected?.parentElement.querySelector("[data-region-name]");
      scope.querySelector("b").textContent = label?.textContent || "";
      const current = (selected?.dataset.characterRegion || "kr").toUpperCase();
      for (const root of [header, menu]) root.querySelectorAll("[data-af-region]").forEach(button => {
        const active = current === button.dataset.afRegion;
        button.classList.toggle("on", active);
        button.setAttribute("aria-pressed", String(active));
      });
      scope.querySelector(".hs-dot + span").textContent = document.getElementById("character-global-server-value")?.textContent || "";
    }
    scope.addEventListener("click", () => {
      const expanded = search.classList.toggle("af-scope-open");
      scope.setAttribute("aria-expanded", String(expanded));
      if (expanded) searchRegion.querySelector(":checked")?.focus();
    });
    searchRegion.addEventListener("change", () => { syncScope(); closeScope(); scope.focus(); });
    selectLanguage.addEventListener("click", () => {
      languageMenu.hidden = !languageMenu.hidden;
      selectLanguage.setAttribute("aria-expanded", String(!languageMenu.hidden));
      if (!languageMenu.hidden) languageMenu.querySelector(".on")?.focus();
    });
    const onChromeClick = event => {
      const trigger = event.target.closest("[data-af-open-menu], [data-af-close-menu], [data-af-language], [data-af-region], [data-af-download]");
      if (!trigger) return;
      if (trigger.hasAttribute("data-af-open-menu")) menu.showModal();
      if (trigger.hasAttribute("data-af-close-menu")) menu.close();
      if (trigger.hasAttribute("data-af-download")) {
        if (menu.open) menu.close();
        downloadButton.click();
        document.querySelector("#download-modal button")?.focus();
      }
      if (trigger.dataset.afLanguage) {
        closeLanguage();
        language.value = trigger.dataset.afLanguage;
        language.dispatchEvent(new Event("change", { bubbles: true }));
        if (!menu.open) selectLanguage.focus();
      }
      if (trigger.dataset.afRegion) {
        const region = trigger.dataset.afRegion.toLowerCase();
        const choice = searchRegion.querySelector(`[data-character-region="${region}"]:checked`) ||
          searchRegion.querySelector(`[data-character-region="${region}"]`);
        if (choice && !choice.checked) choice.click();
        try {
          localStorage.setItem(`notmeter-ranking-service:${state.locale}`, region === "ww" ? "Global" : "KR/TW");
        } catch {
        }
        syncScope();
      }
    };
    [header, tabs, menu, pageFooter].forEach(node => node.addEventListener("click", onChromeClick));
    menu.addEventListener("click", event => { if (event.target === menu) menu.close(); });
    document.addEventListener("click", event => {
      if (!state.active) return;
      if (!event.target.closest("#global-character-search")) closeScope();
      if (!event.target.closest(".af-chrome .hd-pop")) closeLanguage();
    });
    document.addEventListener("keydown", event => {
      if (!state.active || menu.open) return;
      if (event.key === "Escape") {
        if (!languageMenu.hidden) selectLanguage.focus();
        if (search.classList.contains("af-scope-open")) scope.focus();
        closeScope();
        closeLanguage();
      }
      if (event.key === "/" && !event.altKey && !event.ctrlKey && !event.metaKey &&
          !event.target.closest("input, textarea, [contenteditable], dialog, [role=dialog]")) {
        event.preventDefault();
        search.querySelector("#character-search-input").focus();
      }
    });
    return {
      show() {
        header.hidden = tabs.hidden = pageFooter.hidden = false;
        originalPlaceholder = searchInput.placeholder;
        header.querySelector(".af-search-slot").append(search);
        search.classList.add("af-header-search");
        search.querySelector(".character-search-entry").prepend(bar);
        search.querySelector(".character-search-entry").append(key);
        pageFooter.querySelector(".ft-bot").append(legal);
        syncScope();
      },
      hide() {
        header.hidden = tabs.hidden = pageFooter.hidden = true;
        if (menu.open) menu.close();
        closeScope();
        closeLanguage();
        search.classList.remove("af-header-search");
        searchInput.placeholder = originalPlaceholder;
        bar.remove();
        key.remove();
        searchPlaceholder.after(search);
        legalPlaceholder.after(legal);
      },
      render() {
        const localize = root => root.querySelectorAll("[data-af-copy]").forEach(node => {
          node.textContent = viewText(node.dataset.afCopy);
        });
        [header, menu, pageFooter].forEach(localize);
        if (searchInput.placeholder !== viewText("searchCharacter")) originalPlaceholder = searchInput.placeholder;
        searchInput.placeholder = viewText("searchCharacter");
        for (const root of [header, menu, tabs]) {
          root.querySelectorAll("[data-af-open-menu]").forEach(button => button.setAttribute("aria-label", viewText("menu")));
        }
        menu.querySelector("[data-af-close-menu]").setAttribute("aria-label", state.locale === "ko" ? "닫기" : state.locale === "zh-TW" ? "關閉" : "Close");
        const menuGroups = (variant, groupClass, titleClass) => MENU.map(([group, items]) =>
          `<div class="${groupClass}"><${variant === "footer" ? "h5" : "span"} class="${titleClass}">${viewText(group)}</${variant === "footer" ? "h5" : "span"}><div class="${variant === "nav" ? "nv-items" : ""}">${items.map(item => menuLink(item, variant)).join("")}</div></div>`).join("");
        header.querySelector(".hd-row2 .hd-in").innerHTML = menuGroups("nav", "nv-group", "nv-glabel");
        menu.querySelector(".sheet-grid").innerHTML = menuGroups("sheet", "sheet-col", "sheet-group");
        menu.querySelector(".sheet-grid").insertAdjacentHTML("beforeend", `<div class="sheet-extra">${["graphics-optimization-button", "navigation-guide-button", "notmeter-discord"].map(id => {
          const item = document.getElementById(id);
          if (!item) return "";
          const label = item.querySelector(".service-link-label, strong")?.textContent || "";
          return `<a href="${escapeHtml(item.getAttribute("href"))}">${escapeHtml(label)}</a>`;
        }).join("")}</div>`);
        pageFooter.querySelectorAll(".ft-col").forEach(column => column.remove());
        pageFooter.querySelector(".ft-top").insertAdjacentHTML("beforeend", menuGroups("footer", "ft-col", ""));
        pageFooter.querySelector(".ft-brand p").textContent = state.locale === "ko" ? "아이온2 딜미터기 · 던전 통계. 실시간 전투 정보와 DPS / nDPS 분석."
          : state.locale === "zh-TW" ? "AION2 傷害計量器與副本統計。即時戰鬥資訊及 DPS / nDPS 分析。" : "AION2 damage meter and dungeon statistics. Real-time combat data and DPS / nDPS analysis.";
        const schedule = state.locale === "ko" ? "이번 주: 수요일 05:00 – 다음 수요일 05:00 (KST) · 통계 집계 매시 정각·30분"
          : state.locale === "zh-TW" ? "本週：週三 05:00 至下週三 05:00（KST）・每小時整點及半點統計"
          : "Weekly: Wednesday 05:00 to next Wednesday 05:00 KST · Statistics calculated on the hour and half hour";
        pageFooter.querySelector(".af-footer-schedule").textContent = globalThis.NotMeterI18n?.text(schedule, state.locale) || schedule;
        tabs.innerHTML = [MENU[0][1][0], MENU[0][1][1], MENU[2][1][0], MENU[1][1][0]]
          .map(item => menuLink(item, "mobile")).join("") + `<button type="button" data-af-open-menu aria-label="${viewText("menu")}">${menuIcon}<span>${viewText("all")}</span></button>`;
        const names = { KR: state.locale === "ko" ? "한국" : "KR", TW: state.locale === "ko" ? "대만" : "TW", WW: state.locale === "ko" ? "글로벌" : "Global" };
        for (const root of [header, menu]) {
          root.querySelector("[data-af-regions]").innerHTML = Object.entries(names).map(([region, name]) =>
            `<button type="button" data-af-region="${region}" aria-pressed="false">${name}</button>`).join("");
        }
        const options = Array.from(language.options);
        const languageButtons = options.map(option => {
          const active = option.value === state.locale;
          return `<button type="button" data-af-language="${escapeHtml(option.value)}" class="${active ? "on" : ""}" aria-pressed="${active}">${escapeHtml(option.textContent)}${active ? '<span class="lang-check"></span>' : ""}</button>`;
        }).join("");
        languageMenu.innerHTML = languageButtons;
        menu.querySelector("[data-af-languages]").innerHTML = languageButtons;
        header.querySelector("[data-af-current-language]").textContent = options.find(option => option.value === state.locale)?.textContent || state.locale;
        syncScope();
      },
      tick() {
        header.querySelector("time").textContent = new Date().toLocaleTimeString(state.locale, { timeZone: "Asia/Seoul", hourCycle: "h23" });
      },
    };
  }

  function buildArtifactHelp() {
    const node = document.createElement("div");
    node.className = "help";
    const guide = document.getElementById("ranker-dungeon-guide");
    const entry = document.getElementById("ranking-entry-guide");
    const content = key => {
      const source = guide.querySelector(`[data-i18n="${key}"]`) || entry.querySelector(`[data-i18n="${key}"]`);
      return source ? `<span data-i18n="${key}">${escapeHtml(source.textContent.trim())}</span>` : "";
    };
    const faq = [
      ["rankerDungeonGuideUseTitle", "rankerDungeonGuideUseBody"],
      ["rankerDungeonGuideSaveTitle", "rankerDungeonGuideSaveBody"],
      ["rankerDungeonGuideOthersTitle", "rankerDungeonGuideOthersBody"],
      ["rankerDungeonGuideRetentionTitle", "rankerDungeonGuideRetentionBody"],
      ["rankerPreviewCombinedTitle", "rankerPreviewCombinedBody"],
      ["rankerGuideCpChangeTitle", "rankerGuideCpChangeBody"],
    ];
    const faqRows = faq.map(([title, body], index) => {
      const question = content(title) || (index === 5 ? '<span data-af-copy="cpQuestion"></span>' : "");
      const answer = content(body) || content("rankerDungeonGuideMarkerBody");
      return `<details class="fq" name="artifact-guide-faq"><summary>${question}<span class="el-plus sm"></span></summary><p>${answer}</p></details>`;
    }).join("");
    const tiers = Array.from(guide.querySelectorAll(".ranker-preview-grid figure")).map((figure, index) => {
      const image = figure.querySelector("img");
      const frame = index === 0 && !matchMedia("(prefers-reduced-motion: reduce)").matches ? figure.dataset.rankerAnimation : image.getAttribute("src");
      return `<div class="g-tier ${["gold", "sky", "purple"][index]}">
        <img src="${escapeHtml(frame)}" alt="" loading="lazy"><span class="g-k mono">${content(figure.querySelector("h4").dataset.i18n)}</span>
        <b data-af-copy="${["goldTier", "blueTier", "purpleTier"][index]}"></b>
        <small data-af-copy="${index === 0 ? "eligibleTier" : "staticTier"}"></small></div>`;
    }).join("");
    const dungeons = Array.from(guide.querySelectorAll(".ranker-dungeon-list article")).map(item => {
      const title = item.querySelector("strong").dataset.i18n;
      const bosses = item.querySelector("p").dataset.i18n;
      return `<li><b>${content(title)}</b><span>${content(bosses)}</span></li>`;
    }).join("");
    const rules = [
      ["200K", content("rankingEntrySpreadTitle"), content("rankingEntrySpread")],
      ["<span data-af-copy=\"partyCount\"></span>", '<span data-af-copy="killConfirm"></span>', content("rankingEntryNote")],
      [":00 :30", '<span data-af-copy="aggregate"></span>', content("rankerDungeonGuideUseBody")],
      ["TOP 20", '<span data-af-copy="retained"></span>', '<span data-af-copy="retainedNote"></span>'],
    ];
    node.innerHTML = `
      <section class="nm-guide">
        <div class="g-top">
          <div class="g-intro"><span class="eyebrow" data-af-copy="guideTitle"></span><h2 data-af-copy="guideHeadline"></h2>
            <p>${content("rankingEntryRankerDisplay")}</p></div>
          <div class="g-tiers">${tiers}</div>
        </div>
        <div class="g-bottom">
          <div class="g-faq"><h4 data-af-copy="faq"></h4>${faqRows}</div>
          <div class="g-dgs"><h4>${content("rankerDungeonGuideDungeonTitle")}</h4><ul>${dungeons}</ul>
            <p class="g-ex">${content("rankerGuideFrozenExcluded")} ${content("rankerDungeonGuideDummy")}</p></div>
        </div>
      </section>
      <details class="nm-elig">
        <summary class="el-toggle"><span><b data-af-copy="missingRecord"></b><small data-af-copy="conditions"></small></span><span class="el-plus"></span></summary>
        <div class="el-grid">${rules.map(([number, title, detail]) => `<div class="el-card">
          <span class="el-n mono">${number}</span><b>${title}</b><p>${detail}</p></div>`).join("")}</div>
        <p class="el-foot">${content("rankerDungeonGuidePeriod")}</p>
      </details>`;
    return node;
  }

  function mountLayout() {
    const surface = document.getElementById("artifact-surface");
    const find = selector => surface.querySelector(selector);
    const title = find("#artifact-title");
    const description = find("#artifact-description");
    const actions = find(".world-heading-actions");
    const round = find(".artifact-round-field");
    const buttons = find(".artifact-actions");
    const loading = find("#artifact-loading-state");
    const error = find("#artifact-error-state");
    const dashboard = find("#artifact-dashboard");
    const grid = find("#artifact-overview-grid");
    const updated = find("#artifact-updated-at");
    const foot = find("#artifact-source-note");
    const heading = document.createElement("h1");
    heading.id = title.id;
    const frame = document.createElement("div");
    frame.innerHTML = `
      <section class="pg">
        <div class="pg-l"><div class="crumb"><span data-af-copy="live"></span><i></i><b data-af-copy="title"></b></div></div>
        <div class="pg-r"><span class="tag-mono" hidden><span class="nv-live"></span></span></div>
      </section><div class="af-service"></div>`;
    frame.querySelector(".pg-l").append(heading, description);
    frame.querySelector(".tag-mono").append(updated);
    find("#artifact-back-button")?.remove();
    frame.querySelector(".af-service").append(actions, round, buttons);
    dashboard.className = "af-dashboard";
    grid.className = "af-lists";
    foot.className = "foot-note";
    dashboard.innerHTML = `
      <div class="af-round" id="artifact-round-summary"></div>
      <div class="nm-filters af-filters">
        <label class="af-find"><span class="glass" aria-hidden="true"></span><input type="search" id="artifact-match-query" autocomplete="off"><small class="mono" id="artifact-match-hits"></small></label>
        <div class="nm-seg" id="artifact-match-filter" role="group"></div>
        <span class="f-spacer"></span>
        <div class="nm-seg" id="artifact-match-sort" role="group"></div>
        <div class="nm-seg" id="artifact-match-mode" role="group"></div>
      </div>
      <div class="af-spotmap" id="artifact-spotmap"></div>
      <div class="af-rule">
        <span class="af-legend"><i class="w"></i><span data-af-copy="westOwner"></span></span>
        <span class="af-legend"><i class="e"></i><span data-af-copy="eastOwner"></span></span>
        <span class="af-legend"><i class="u"></i><span id="artifact-unknown-label"></span></span>
        <span class="af-rule-t" id="artifact-score-guide" data-af-copy="guide"></span>
      </div>`;
    dashboard.append(grid, foot);
    surface.replaceChildren(...frame.childNodes, loading, error, dashboard, buildArtifactHelp());
    surface.classList.add("artifact-redesign");
    if (styleUrl) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = styleUrl;
      document.head.append(link);
    }
  }

  function bindSegment(id, key, choices) {
    const group = elements[id];
    group.innerHTML = choices.map(value => `<button type="button" data-value="${value}"></button>`).join("");
    group.addEventListener("click", event => {
      const button = event.target.closest("button[data-value]");
      if (!button || state[key] === button.dataset.value) return;
      state[key] = button.dataset.value;
      if (key !== "filter") {
        try {
          localStorage.setItem("notmeter-artifact-" + key, state[key]);
        } catch {
        }
      }
      selectSegment(group, state[key]);
      renderMatchList();
    });
  }

  function selectSegment(group, value) {
    for (const button of group.children) {
      const selected = button.dataset.value === value;
      button.classList.toggle("on", selected);
      button.setAttribute("aria-pressed", String(selected));
    }
  }
  function selectService(region, manual = true) {
    if (region !== "KR" && region !== "TW") return;
    if (manual) serviceSelected = true;
    if (serviceRegion !== region) {
      serviceRegion = region;
      state.requestController?.abort(); state.requestController = null; state.request = null;
      state.data = null; state.revision = ""; state.refCheckedAt = Number.NEGATIVE_INFINITY;
      state.matchingPending = false;
      state.selectedRoundKey = "current"; state.presentations = []; state.visibilitySignature = ""; state.refreshFailed = false;
      const file = `notmeter-artifact-occupation-public${region === "TW" ? "-tw" : ""}.json`;
      PUBLIC_CACHE_PATH = `https://raw.githubusercontent.com/Not4You-Dev/NotMeter-Cache/main/presence/${file}`;
      PUBLIC_CACHE_REF_URL = `https://api.github.com/repos/Not4You-Dev/NotMeter-Cache/commits?path=presence/${file}&per_page=1`;
      EXPECTED_REVISION = region === "KR" ? "kr-2026-11-11" : "tw-2026-10-21";
      KOREA_OFFSET_MS = (region === "TW" ? 8 : 9) * 3600000;
      FAVORITE_STORAGE_KEY = `notmeter-artifact-favorite-servers-v1${region === "TW" ? "-tw" : ""}`;
      PAIRS.splice(0, PAIRS.length, ...(region === "TW" ? TAIWAN_PAIRS : KOREAN_PAIRS));
      KNOWN_SERVERS.clear(); PAIRS.flatMap(p => [p.west,p.east]).forEach(server => KNOWN_SERVERS.set(server.serverId,server.name));
      state.favoriteServerIds = readFavoriteServerIds();
      if (state.active) { setStaticCopy(); chrome?.render(); render(); }
      if (state.active) refreshOnResume();
    }
    document.getElementById("artifact-service-tabs")?.querySelectorAll("button").forEach(button => {
      button.setAttribute("aria-pressed", String(button.dataset.worldService === region));
      button.onclick = () => selectService(button.dataset.worldService);
    });
    const zone = document.getElementById("artifact-service-timezone");
    if (zone) zone.textContent = region === "TW" ? "UTC+8" : "UTC+9";
  }

  function text(key, replacements = {}) {
    let value = shortCycleCopy(key) || COPY[state.locale]?.[key] || COPY.ko[key] || key;
    if (serviceRegion === "TW") {
      const tw = (globalThis.NotMeterI18n?.withVietnamese || (copy => copy))({
        ko: { description:"대만 서버 18개 대진의 점령 현황을 확인하세요.", overviewTitle:"전체 18개 서버 대진", source:"대만 서버에서 확인된 현황을 약 5분마다 반영합니다.", matchSchedule:"수·토 21:30 (대만 시간)", koreaOnly:"대만 서버" },
        en: { description:"Artifact control across 18 Taiwan server matchups.", overviewTitle:"All 18 server matchups", source:"Taiwan server status updates about every 5 minutes.", matchSchedule:"Wed & Sat · 21:30 UTC+8", koreaOnly:"Taiwan servers" },
        "zh-TW": { description:"查看台灣伺服器全部 18 組配對的神器佔領狀態。", overviewTitle:"全部 18 組伺服器配對", source:"顯示台灣伺服器資料，約每 5 分鐘更新。", matchSchedule:"每週三、六 21:30（台灣時間）", koreaOnly:"台灣伺服器" },
      });
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
    mountLayout();
    for (const id of [
      "artifact-description", "artifact-unknown-label",
      "artifact-round-summary", "artifact-spotmap", "artifact-match-query", "artifact-match-hits",
      "artifact-match-filter", "artifact-match-sort", "artifact-match-mode",
      "artifact-round-label", "artifact-round-select",
      "artifact-snapshot-button", "artifact-snapshot-label", "artifact-refresh-button",
      "artifact-retry-button", "artifact-loading-state", "artifact-loading-text",
      "artifact-error-state", "artifact-error-title", "artifact-error-message",
      "artifact-dashboard", "artifact-overview-grid", "artifact-updated-at",
      "artifact-source-note", "artifact-copy-status",
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
      const button = event.target.closest("[data-artifact-favorite-server]");
      if (button) toggleFavoriteServer(Number(button.dataset.artifactFavoriteServer));
    });
    elements["artifact-match-query"].addEventListener("input", event => {
      state.query = event.target.value.trim().toLocaleLowerCase(state.locale);
      renderMatchList();
    });
    bindSegment("artifact-match-filter", "filter", ["all", "w", "t", "e"]);
    bindSegment("artifact-match-sort", "sort", ["no", "time", "gap", "close"]);
    bindSegment("artifact-match-mode", "mode", ["grid", "table"]);

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
    const sharedShell = document.getElementById("homepage-redesign");
    if (!sharedShell) chrome = mountArtifactChrome();
    else {
      const surface = document.getElementById("artifact-surface");
      const syncHeaderHeight = () => {
        surface.style.setProperty("--af-header-height", sharedShell.style.getPropertyValue("--hd-h"));
      };
      new MutationObserver(syncHeaderHeight).observe(sharedShell, { attributes: true, attributeFilter: ["style"] });
      syncHeaderHeight();
    }
    state.bound = true;
  }

  function setStaticCopy() {
    const count = PAIRS.length;
    const surface = document.getElementById("artifact-surface");
    surface.querySelectorAll("[data-af-copy]").forEach(element => {
      element.textContent = viewText(element.dataset.afCopy);
    });
    document.getElementById("artifact-title").textContent = viewText("title");
    elements["artifact-description"].textContent = viewText(serviceRegion === "TW" ? "twDescription" : "krDescription", { count });
    elements["artifact-round-label"].textContent = text("roundLabel");
    if (!elements["artifact-snapshot-button"].classList.contains("is-working")) elements["artifact-snapshot-label"].textContent = text("snapshot");
    elements["artifact-loading-text"].textContent = text("loading");
    elements["artifact-error-title"].textContent = text("errorTitle");
    elements["artifact-unknown-label"].textContent = text("neutral");
    const query = elements["artifact-match-query"];
    query.placeholder = viewText("search", { server: state.locale === "ko" && serviceRegion === "KR" ? "지켈" : serverDisplayName(PAIRS[0].west) });
    query.setAttribute("aria-label", query.placeholder);
    elements["artifact-match-filter"].setAttribute("aria-label", viewText("control", { count }));
    elements["artifact-match-sort"].setAttribute("aria-label", viewText("number"));
    elements["artifact-match-mode"].setAttribute("aria-label", viewText("cards") + " / " + viewText("table"));
    const labels = {
      sort: { no: "number", time: "time", gap: "gap", close: "close" },
      mode: { grid: "cards", table: "table" },
    };
    for (const [key, keys] of Object.entries(labels)) {
      const group = elements["artifact-match-" + key];
      for (const button of group.children) button.textContent = viewText(keys[button.dataset.value]);
      selectSegment(group, state[key]);
    }
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
        if (!isValidPayload(payload)) {
          if (!state.data && serviceRegion === "KR" && payload?.schema === EXPECTED_SCHEMA &&
              payload.region === "KR" && payload.pairingRevision === "kr-2026-10-21") {
            state.matchingPending = true;
            if (state.active) render();
            return;
          }
          throw new Error("invalid");
        }
        if (Number(payload.generatedAt) < Number(state.data?.generatedAt || 0)) throw new Error("older-generation");
        PAIRS.splice(0, PAIRS.length, ...payload.pairs.map(pair => ({ pairId: pair.pairId, west: pair.west, east: pair.east })));
        state.data = { ...payload, history: normalizeHistory(payload.history) };
        state.matchingPending = false;
        state.refreshFailed = false;
        if (state.active) render();
      } catch (error) {
        if (state.active && state.requestController === controller) {
          if (!state.data && state.matchingPending) render();
          else if (!state.data) showError();
          else { state.refreshFailed = true; renderUpdateLabel(); }
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
    renderUpdateLabel();
    if (!state.data && !state.matchingPending) {
      showLoading(true);
      return;
    }
    populateRoundSelect();
    const historical = state.selectedRoundKey !== "current";
    const presentations = sortPresentationsByFavorites(PAIRS.map(pair => historical
      ? buildPairPresentation(historyPair(pair, state.selectedRoundKey), true)
      : buildPairPresentation(payloadPair(pair.pairId), false)));
    state.presentations = presentations;
    elements["artifact-source-note"].textContent = state.matchingPending ? text("matchingPending") : historical
      ? text("historySource")
      : `${elements["artifact-description"].textContent}. ${viewText("note")}`;
    renderCycleSummary(presentations, historical);
    renderMatchList();
    elements["artifact-loading-state"].hidden = true;
    elements["artifact-error-state"].hidden = true;
    elements["artifact-dashboard"].hidden = false;
    elements["artifact-snapshot-button"].disabled = elements["artifact-snapshot-button"].classList.contains("is-working");
    state.visibilitySignature = historical ? "" : currentVisibilitySignature();
    updateCountdown();
  }

  function renderUpdateLabel() {
    const updated = elements["artifact-updated-at"];
    const generatedAt = Number(state.data?.generatedAt) || 0;
    updated.parentElement.hidden = !generatedAt;
    if (!generatedAt) return;
    const time = new Intl.DateTimeFormat("en-GB", { timeZone: serviceRegion === "TW" ? "Asia/Taipei" : "Asia/Seoul", month: "2-digit", day: "2-digit" }).formatToParts(generatedAt * 1000);
    const date = ["month", "day"].map(part => time.find(item => item.type === part).value).join(".");
    const label = viewText("updated", { time: date + " " + battleSlot(generatedAt * 1000) });
    updated.textContent = state.refreshFailed ? `${text("refreshFailed")} · ${label}` : label;
    updated.title = text("updated", { time: formatObservedAt(generatedAt) });
  }

  function renderMatchList() {
    const matches = state.presentations;
    const query = state.query;
    const hits = new Set(matches.filter(({ pair }) => query && [pair.west, pair.east].some(server =>
      [server.name, serverDisplayName(server)].some(name => name.toLocaleLowerCase(state.locale).includes(query))))
      .map(({ pair }) => pair.pairId));
    elements["artifact-match-hits"].textContent = query ? hits.size ? viewText("matches", { count: hits.size }) : viewText("none") : "";
    const visible = matches.filter(match => state.filter === "all" || match.side === state.filter);
    const scoreGap = match => Math.abs(match.west - match.east);
    visible.sort((a, b) => {
      if (state.sort === "time" && a.battleAt !== b.battleAt) return a.battleAt - b.battleAt;
      if (state.sort === "gap" || state.sort === "close") {
        if ((a.side === "u") !== (b.side === "u")) return a.side === "u" ? 1 : -1;
        const difference = scoreGap(a) - scoreGap(b);
        if (difference) return state.sort === "gap" ? -difference : difference;
      }
      return a.pair.pairId - b.pair.pairId;
    });
    const pinned = visible.filter(match => match.favoriteCount);
    const rest = visible.filter(match => !match.favoriteCount);
    const table = state.mode === "table";
    const renderSection = (items, title) => `<section class="af-sec">
      ${title ? `<h3 class="af-h">${title} <small>${items.length}</small></h3>` : ""}
      ${items.length ? `<div class="${table ? "aft-table" : "afm-grid"}">${items.map(match =>
        renderPairCard(match, table, hits.has(match.pair.pairId))).join("")}</div>`
        : `<div class="empty wide">${viewText("empty")}</div>`}</section>`;
    const grid = elements["artifact-overview-grid"];
    grid.innerHTML = (pinned.length ? renderSection(pinned, "★ " + viewText("favorites")) : "") +
      (rest.length || !pinned.length ? renderSection(rest, pinned.length ? viewText("allMatches") : "") : "");
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
    const minutes = serviceRegion === "TW" ? (roundKey >= "2026-09-30" ? 21 * 60 + 30 : 22 * 60) : roundKey >= "2026-11-11" ? 22 * 60 + group * 30 : roundKey >= "2026-09-30" ? 21 * 60 + 20 + group * 30 : 22 * 60 + group * 5;
    const timestamp = Date.parse(`${roundKey}T00:00:00${serviceRegion === "TW" ? "+08:00" : "+09:00"}`) + minutes * 60_000;
    return Number.isFinite(timestamp) ? timestamp : 0;
  }

  function matchingPeriod(now = Date.now()) {
    const revisionDate = (state.data?.pairingRevision || EXPECTED_REVISION).replace(/^(?:kr|tw)-/, "");
    const offset = serviceRegion === "TW" ? "+08:00" : "+09:00";
    const restartAt = Date.parse(`${CYCLE_RESTART_DATE}T00:00:00${offset}`);
    const reset = revisionDate === "2026-10-21" && now >= restartAt;
    const startAt = reset ? restartAt : Date.parse(`${revisionDate}T00:00:00${offset}`);
    const endAt = reset ? Date.parse(`${CYCLE_END_DATE}T00:00:00${offset}`) : startAt + MATCH_DURATION_DAYS * DAY_MS;
    const durationDays = Math.round((endAt - startAt) / DAY_MS);
    const elapsedWeeks = Math.floor(Math.max(0, now - startAt) / (7 * DAY_MS));
    let totalRounds = 0;
    for (let day = 0; day < durationDays; day += 1) {
      const koreaDate = new Date(startAt + day * DAY_MS + KOREA_OFFSET_MS);
      if (MATCH_BATTLE_WEEKDAYS.has(koreaDate.getUTCDay())) totalRounds += 1;
    }
    return {
      startAt,
      endAt,
      week: Math.min(Math.ceil(durationDays / 7), Math.max(1, elapsedWeeks + 1)),
      totalRounds,
      reset,
    };
  }

  function displayMatchingPeriod() {
    return matchingPeriod(state.selectedRoundKey === "current" ? Date.now() : roundTimestampForPair(state.selectedRoundKey, 1));
  }

  function renderCycleSummary(matches, historical) {
    const period = displayMatchingPeriod();
    const counts = { w: 0, t: 0, e: 0, u: 0 };
    for (const match of matches) counts[match.side] += 1;
    const round = elements["artifact-round-summary"];
    const filter = elements["artifact-match-filter"];
    const labels = { all: viewText("all"), w: viewText("westLead"), t: viewText("draw"), e: viewText("eastLead"), u: text("neutral") };
    for (const button of filter.children) {
      const side = button.dataset.value;
      button.innerHTML = `${labels[side]} <small>${counts[side] ?? matches.length}</small>`;
    }
    selectSegment(filter, state.filter);
    const bars = (west, east) => `<span class="asl-bar${west + east ? "" : " unconfirmed"}"><i style="width:${west / (west + east || 1) * 100}%"></i></span>`;
    const scores = (west, east) => `<em class="w">${west}</em> : <em class="e">${east}</em>`;
    const layerSums = [0, 1].map(layer => ARTIFACTS[layer + 1].map(([, name], index) => {
      const entries = matches.map(match => match.layers[layer].entries[index]);
      return {
        name: shortArtifactName(entries[0]?.name || name),
        west: entries.filter(entry => entry.ownerSide === 1).length,
        east: entries.filter(entry => entry.ownerSide === 2).length,
      };
    }));
    const slots = [...new Set(matches.map(match => battleSlot(match.battleAt)))].sort();
    const soonest = Math.min(...matches.map(match => match.battleAt));
    const cycleEnding = !historical && period.reset && soonest >= period.endAt;
    const cycleEnded = cycleEnding && Date.now() >= period.endAt;
    const nextTime = Number.isFinite(soonest) ? battleSlot(soonest) : "—";
    const nextCount = matches.filter(match => match.battleAt === soonest).length;
    const visibleSides = counts.u ? ["w", "t", "e", "u"] : ["w", "t", "e"];
    round.innerHTML = `
      <div><span>${viewText("matchLabel")}</span><b>${viewText("matchWeek", { week: period.week })}</b><small>${viewText("matchRange", { start: formatCycleDate(period.startAt), end: formatCycleDate(period.endAt) })}</small></div>
      <div><span>${viewText("matchRoundLabel")}</span><b>${viewText("rounds", { total: period.totalRounds })}</b><small>${viewText("days")} · ${slots.join(" / ")} ${serviceRegion === "TW" ? "UTC+8" : "KST"}</small></div>
      <div class="hot"><span>${historical ? text("historyRecord") : cycleEnding ? text("matchRemaining") : `${viewText("next")} · ${viewText("slot", { slot: nextTime })}`}</span><b class="mono" id="artifact-cycle-countdown">${historical ? formatRoundDate(state.selectedRoundKey) : cycleEnded ? text("matchEnded") : formatCountdownShort((cycleEnding ? period.endAt : soonest) - Date.now())}</b><small>${historical ? text("historyCaption") : cycleEnding ? viewText("matchRange", { start: formatCycleDate(period.startAt), end: formatCycleDate(period.endAt) }) : viewText("simultaneous", { count: nextCount })}</small></div>
      <div class="af-sum"><span>${historical ? text("historyTitle", { date: formatRoundDate(state.selectedRoundKey) }) : viewText("control", { count: matches.length })}</span>
        <div class="af-sum-bar">${visibleSides.map(side => `<i class="${side}" style="flex:${counts[side]}">${counts[side]}</i>`).join("")}</div>
        <small>${visibleSides.map(side => `<em class="${side}">${labels[side]}</em>`).join(" · ")}</small>
        <div class="af-sum-layers">${layerSums.map((spots, layer) => {
          const west = spots.reduce((sum, spot) => sum + spot.west, 0);
          const east = spots.reduce((sum, spot) => sum + spot.east, 0);
          return `<div><span>${viewText(layer ? "middle" : "lower")}</span>${bars(west, east)}<span class="mono">${scores(west, east)}</span></div>`;
        }).join("")}</div>
      </div>`;
    const countdown = round.querySelector("#artifact-cycle-countdown");
    if (!historical && !cycleEnded) countdown.dataset.artifactNext = String(cycleEnding ? period.endAt : soonest);
    elements["artifact-spotmap"].innerHTML = layerSums.map((spots, layer) => `
      <div class="afs-layer"><h4>${viewText(layer ? "middleTitle" : "lowerTitle")} <small>${viewText("spots", { count: matches.length })}</small></h4>
        ${spots.map(spot => `<div class="afs-row"><span class="afs-name">${escapeHtml(spot.name)}</span>${bars(spot.west, spot.east)}<span class="mono afs-n">${scores(spot.west, spot.east)}</span></div>`).join("")}
      </div>`).join("");
  }

  function battleSlot(timestamp) {
    return new Intl.DateTimeFormat("en-GB", { timeZone: serviceRegion === "TW" ? "Asia/Taipei" : "Asia/Seoul", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(timestamp);
  }

  function formatCountdownShort(milliseconds) {
    if (!Number.isFinite(milliseconds)) return "—";
    const total = Math.max(0, Math.floor(milliseconds / 1000));
    const seconds = total % 60;
    const minutes = Math.floor(total / 60) % 60;
    const hours = Math.floor(total / 3600) % 24;
    const days = Math.floor(total / 86400);
    if (state.locale === "ko") {
      return days ? `${days}일 ${hours}시간 ${minutes}분` : `${hours ? hours + "시간 " : ""}${minutes}분 ${String(seconds).padStart(2, "0")}초`;
    }
    return formatCountdown(milliseconds).replace(/^([0-9]+)일/, "$1d");
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
    const period = matchingPeriod(Number.isFinite(cutoffAt) ? cutoffAt : Date.now());
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
      side: confirmedLayers === layers.length ? (west > east ? "w" : east > west ? "e" : "t") : "u",
      battleAt: historical ? Number(pair.nextBattleAt) : effectiveNextBattleAt(pair),
      favoriteCount: favoriteCount(pair),
    };
  }

  function readFavoriteServerIds() {
    try {
      const validIds = new Set(PAIRS.flatMap(pair => [pair.west.serverId, pair.east.serverId]));
      const stored = JSON.parse(localStorage.getItem(FAVORITE_STORAGE_KEY) ?? (serviceRegion === "KR" ? "[2002]" : "[]"));
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
    const pair = PAIRS.find(pair => pair.west.serverId === serverId || pair.east.serverId === serverId);
    if (!pair) return;
    if (favoriteCount(pair)) {
      state.favoriteServerIds.delete(pair.west.serverId);
      state.favoriteServerIds.delete(pair.east.serverId);
    } else {
      state.favoriteServerIds.add(serverId);
    }
    saveFavoriteServerIds();
    render();
    elements["artifact-overview-grid"].querySelector(`[data-pair-id="${pair.pairId}"] .af-star`)?.focus({ preventScroll: true });
  }

  function favoriteButton(server, active = state.favoriteServerIds.has(server.serverId)) {
    const label = text(active ? "unfavoriteServer" : "favoriteServer", { server: serverDisplayName(server) });
    return `<button class="af-star${active ? " on" : ""}" type="button"
      data-artifact-favorite-server="${server.serverId}" aria-pressed="${active}"
      aria-label="${escapeHtml(label)}" title="${escapeHtml(label)}">${active ? "★" : "☆"}</button>`;
  }

  function serverDisplayName(server) {
    return globalThis.NotMeterServerName?.(server.serverId, state.locale) || server.name;
  }

  function renderPairCard(presentation, table, hit) {
    const { pair, layers, west, east, lead, side, cumulative, historical, favoriteCount, battleAt } = presentation;
    const westName = escapeHtml(serverDisplayName(pair.west));
    const eastName = escapeHtml(serverDisplayName(pair.east));
    const number = `<span class="mono afm-no">${String(pair.pairId).padStart(2, "0")}</span>`;
    const score = `<span class="afm-score mono${table ? " sm" : ""}"><b class="w">${west}</b><em>:</em><b class="e">${east}</b></span>`;
    const status = `<span class="afm-st ${side}">${escapeHtml(({ w: viewText("westLead"), e: viewText("eastLead"), t: viewText("draw") })[side] || lead)}</span>`;
    const star = favoriteButton(state.favoriteServerIds.has(pair.east.serverId) ? pair.east : pair.west, favoriteCount > 0);
    const slot = battleSlot(battleAt);
    const pips = `<div class="af-layers" aria-label="${escapeHtml(text(historical ? "roundScore" : "currentScore"))} ${west} : ${east}">
      ${layers.map(layer => renderCompactLayer(layer, table, pair)).join("")}</div>`;
    const total = `<span class="af-total" title="${escapeHtml(text(cumulative.count ? "cumulativeCoverage" : "cumulativePending", cumulative))}">
      <span class="aft-bar${cumulative.count ? "" : " unconfirmed"}"><i style="width:${cumulative.west / (cumulative.west + cumulative.east || 1) * 100}%"></i></span>
      <span class="mono aft-n"><b class="${cumulative.count && cumulative.west >= cumulative.east ? "w" : ""}">${cumulative.count ? cumulative.west : "—"}</b><em>:</em><b class="${cumulative.count && cumulative.east >= cumulative.west ? "e" : ""}">${cumulative.count ? cumulative.east : "—"}</b></span></span>`;
    const countdown = historical ? formatHistoryMoment(battleAt) : formatCountdownShort(battleAt - Date.now());
    const clock = historical ? "" : ` data-artifact-countdown="${pair.pairId}"`;
    const flags = `s-${side}${hit ? " hit" : ""}`;
    if (table) return `<article class="aft-row ${flags}" data-pair-id="${pair.pairId}">
      ${number}<span class="mono aft-slot">${slot}</span><b class="aft-w" title="${westName}">${westName}</b>
      <span class="aft-mid">${score}</span>${pips}<b class="aft-e" title="${eastName}">${eastName}</b>
      ${total}${status}<span class="mono aft-left"${clock}>${escapeHtml(countdown)}</span>${star}
    </article>`;
    return `<article class="afm ${flags}${favoriteCount ? " starred" : ""}" data-pair-id="${pair.pairId}">
      <div class="afm-head">${number}<span class="afm-slot mono">${viewText("days")} ${slot}</span>${status}${star}</div>
      <div class="afm-vs"><b class="afm-w" title="${westName}">${westName}</b>${score}<b class="afm-e" title="${eastName}">${eastName}</b></div>
      ${pips}
      <div class="afm-foot"><span class="afm-lbl">${text("cumulativeScore")} <small>${viewText("rounds", { total: `${cumulative.count}/${cumulative.total}` })}</small></span>${total}</div>
      <div class="afm-next"><span>${historical ? text("historyRecord") : viewText("next")}</span><b class="mono"${clock}>${escapeHtml(countdown)}</b></div>
    </article>`;
  }

  function renderCompactLayer(layer, compact, pair) {
    const west = layer.entries.filter(entry => entry.ownerSide === 1).length;
    const east = layer.entries.filter(entry => entry.ownerSide === 2).length;
    const title = viewText(layer.layer === 1 ? "lower" : "middle");
    return `<div class="af-layer${compact ? " compact" : ""}">
      <span class="afl-name">${title}</span>
      <span class="afl-spots">${layer.entries.map(entry => {
        const side = entry.ownerSide === 1 ? "w" : entry.ownerSide === 2 ? "e" : "u";
        const owner = side === "u" ? text("neutral") : serverDisplayName(side === "w" ? pair.west : pair.east);
        const name = state.locale === "ko" && entry.artifactId === 1003 ? "시엘 군도" : snapshotArtifactName(entry.name, entry.artifactId);
        return `<i class="${side}" title="${escapeHtml(entry.name + " · " + owner)}">${escapeHtml(name)}</i>`;
      }).join("")}</span>
      <span class="afl-n mono"><b class="${west > east ? "w" : ""}">${west}</b><em>:</em><b class="${east > west ? "e" : ""}">${east}</b></span>
    </div>`;
  }

  function shortArtifactName(name) {
    return String(name).replace(/\s*(?:아티팩트|神器|Artifact)$/u, "");
  }

  function artifactIconKey(side) {
    return side === 1 ? "west" : side === 2 ? "east" : "neutral";
  }

  function showLoading(visible) {
    elements["artifact-loading-state"].hidden = !visible;
    elements["artifact-error-state"].hidden = true;
    elements["artifact-dashboard"].hidden = visible;
    if (visible) elements["artifact-round-select"].disabled = true;
    elements["artifact-snapshot-button"].disabled = visible || elements["artifact-snapshot-button"].classList.contains("is-working");
  }

  function showError() {
    elements["artifact-loading-state"].hidden = true;
    elements["artifact-dashboard"].hidden = true;
    elements["artifact-error-message"].textContent = text("error");
    elements["artifact-error-state"].hidden = false;
  }

  function updateCountdown() {
    if (!state.active || !state.bound || (!state.data && !state.matchingPending) || state.selectedRoundKey !== "current") return;
    const signature = currentVisibilitySignature();
    if (state.presentations.some(match => match.battleAt > 0 && match.battleAt <= Date.now()) ||
        (state.visibilitySignature && state.visibilitySignature !== signature)) {
      render();
      return;
    }
    state.visibilitySignature = signature;
    const soonest = elements["artifact-round-summary"].querySelector("[data-artifact-next]");
    if (soonest) soonest.textContent = formatCountdownShort(Number(soonest.dataset.artifactNext) - Date.now());
    elements["artifact-overview-grid"].querySelectorAll("[data-artifact-countdown]").forEach(element => {
      const match = state.presentations.find(match => match.pair.pairId === Number(element.dataset.artifactCountdown));
      element.textContent = formatCountdownShort(match.battleAt - Date.now());
    });
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
    const korea = new Date(now + KOREA_OFFSET_MS);
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
    const period = matchingPeriod(now);
    if (period.reset && startedAt < period.startAt) return true;
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
    const period = displayMatchingPeriod();
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
    chrome?.show();
    setStaticCopy();
    queueMicrotask(() => { if (state.active) chrome?.render(); });
    chrome?.tick();
    render();
    refreshOnResume();
    state.clockTimer = window.setInterval(() => { chrome?.tick(); updateCountdown(); }, 1_000);
  }

  function refreshOnResume() {
    if (!state.active) return;
    void refresh().finally(() => {
      if (state.active) schedulePoll();
    });
  }

  function deactivate() {
    state.active = false;
    chrome?.hide();
    window.clearTimeout(state.pollTimer); state.pollTimer = 0;
    window.clearInterval(state.clockTimer); state.clockTimer = 0;
    state.requestController?.abort(); state.requestController = null; state.request = null;
  }

  function setLocale(locale) {
    state.locale = normalizeLocale(locale);
    selectService(serviceSelected ? serviceRegion : state.locale === "zh-TW" ? "TW" : "KR", false);
    if (state.active) queueMicrotask(() => {
      if (!state.active) return;
      setStaticCopy();
      chrome?.render();
      render();
    });
  }

  window.NotMeterArtifactOccupation = { activate, deactivate, setLocale };
})();
