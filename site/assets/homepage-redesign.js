(() => {
  "use strict";
  const copy = {
    ko: ["직업별 DPS, 같은 조건에서", "정직하게 비교합니다", "던전 랭킹", "직업별 분포", "분포", "표", "전체 기록 보기", "접기", "캐릭터 검색", "전체 메뉴", "상위 20명", "선택한 직업의 최고 기록", "최저 – 최고 · 중앙값 – 상위 10%", "닫기"],
    en: ["DPS by class, on equal terms.", "Compare with confidence.", "Dungeon rankings", "Class distribution", "Chart", "Table", "View all records", "Collapse", "Search characters", "All menus", "Top 20 players", "Personal bests for the selected class", "Min – max · Median – top 10%", "Close"],
    "zh-TW": ["相同條件下的各職業 DPS", "公平比較實際表現", "副本排名", "職業分布", "分布圖", "表格", "查看全部紀錄", "收合", "搜尋角色", "所有選單", "前 20 名", "所選職業的個人最佳紀錄", "最低 – 最高 · 中位數 – 前 10%", "關閉"],
    ja: ["同じ条件で職業別 DPS を比較", "実績を公平に比較します", "ダンジョンランキング", "職業別分布", "分布", "表", "全記録を表示", "閉じる", "キャラクター検索", "全メニュー", "上位20名", "選択した職業の自己ベスト", "最低 – 最高 · 中央値 – 上位10%", "閉じる"],
    de: ["Klassen-DPS unter gleichen Bedingungen.", "Leistung fair vergleichen.", "Dungeon-Ranglisten", "Klassenverteilung", "Diagramm", "Tabelle", "Alle Aufzeichnungen", "Einklappen", "Charaktere suchen", "Alle Menüs", "Top 20", "Bestleistungen der gewählten Klasse", "Min. – Max. · Median – Top 10 %", "Schließen"],
    fr: ["Les DPS par classe, à conditions égales.", "Comparez en toute confiance.", "Classements des donjons", "Répartition par classe", "Graphique", "Tableau", "Tous les combats", "Réduire", "Rechercher un personnage", "Tous les menus", "Top 20", "Records personnels de la classe choisie", "Min. – max. · Médiane – top 10 %", "Fermer"],
    es: ["DPS por clase en igualdad de condiciones.", "Compara con confianza.", "Clasificaciones de mazmorras", "Distribución por clase", "Gráfico", "Tabla", "Ver todos los registros", "Contraer", "Buscar personajes", "Todos los menús", "Top 20", "Mejores marcas de la clase seleccionada", "Mín. – máx. · Mediana – 10 % superior", "Cerrar"],
    pt: ["DPS por classe em condições iguais.", "Compare com confiança.", "Classificações de masmorras", "Distribuição por classe", "Gráfico", "Tabela", "Ver todos os registros", "Recolher", "Buscar personagens", "Todos os menus", "Top 20", "Melhores marcas da classe selecionada", "Mín. – máx. · Mediana – top 10%", "Fechar"],
    ru: ["DPS классов в равных условиях.", "Сравнивайте реальные результаты.", "Рейтинг подземелий", "Распределение по классам", "График", "Таблица", "Все записи", "Свернуть", "Поиск персонажей", "Все разделы", "Топ-20", "Личные рекорды выбранного класса", "Мин. – макс. · Медиана – лучшие 10%", "Закрыть"],
    vi: ["DPS từng lớp trong cùng điều kiện.", "So sánh một cách công bằng.", "Xếp hạng phó bản", "Phân bố theo lớp", "Biểu đồ", "Bảng", "Xem mọi bản ghi", "Thu gọn", "Tìm nhân vật", "Tất cả mục", "Top 20", "Kỷ lục cá nhân của lớp đã chọn", "Thấp nhất – cao nhất · Trung vị – top 10%", "Đóng"],
    th: ["เปรียบเทียบ DPS แต่ละอาชีพในเงื่อนไขเดียวกัน", "เปรียบเทียบผลงานอย่างเป็นธรรม", "อันดับดันเจี้ยน", "การกระจายตามอาชีพ", "กราฟ", "ตาราง", "ดูบันทึกทั้งหมด", "ย่อ", "ค้นหาตัวละคร", "เมนูทั้งหมด", "20 อันดับแรก", "สถิติสูงสุดของอาชีพที่เลือก", "ต่ำสุด – สูงสุด · มัธยฐาน – 10% แรก", "ปิด"]
  };
  const host = document.getElementById("homepage-redesign");
  if (!host) return;

  const root = host.attachShadow({ mode: "open" });
  const source = id => document.getElementById(id);
  const $ = selector => root.querySelector(selector);
  const i18n = globalThis.NotMeterI18n;
  const api = globalThis.NotMeterHomepage;
  const standalone = host.dataset.shellView;
  const languageControl = () => source(host.dataset.shellLanguage || "language-button");
  const tr = (key, values) => api?.text(key, values);
  const esc = value => String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);
  const item = (key, label, icon, desc, href = (standalone ? "./" : "") + "?view=" + key) => ({ key, label, icon, desc, href });
  const menu = [
    ["랭킹 · 통계", "Rankings · Stats", [
      item("ranking", "던전 랭킹", "bars", "보스·직업·CP 구간별 DPS TOP 20과 상위 %"),
      item("class-top10", "직업 종합 TOP 10", "stack", "여러 던전·CP 구간 성적을 합산한 직업별 종합 순위"),
      item("class-performance", "직업 DPS 비교", "dot-line", "CP 보정 · 중앙값 100 기준 직업 성능과 신뢰도"),
      item("boss-resistance", "보스 저항", "shield", "보스별 강타·완벽 저항, 치명타·회피 판정 통계"),
    ]],
    ["빌드 · 도구", "Builds · Tools", [
      item("setup-guide", "세팅 가이드", "grid", "상위 랭커의 PVE 장비·마석·아르카나·스킬 채택률"),
      item("stat-efficiency", "스탯 효율 계산기", "plus", "옵션을 바꿔 피해 상승량을 확인"),
      item("pet-tracker", "펫 트래커", "paw", "이해도가 미완성인 펫의 출현 위치", "./pet-tracker.html"),
    ]],
    ["실시간", "Live", [
      item("field-boss", "필드보스", "field-boss", "서버별 출현 시간·남은 시간과 내 알림"),
      item("artifact", "아티팩트", "artifact", "서버 대진별 점령 현황"),
    ]],
    ["커뮤니티", "Community", [
      item("meter-sharing", "미터 공유", "pair", "직업별로 공유된 미터기 레이아웃과 설정 코드"),
    ]],
  ];
  const optimizationRoute = item("optimization", "최적화", "grid", "그래픽 설정과 성능 최적화 가이드", "./optimization.html");
  const routes = menu.flatMap(group => group[2]);
  const navKeys = {
    "class-top10": "classTop10", "class-performance": "classPerformance", "boss-resistance": "bossResistanceStats",
    "setup-guide": "contributionStats", "stat-efficiency": "statEfficiencyCalculator", "field-boss": "fieldBoss",
    artifact: "artifactStatus", optimization: "optimization",
  };
  const order = ["sorrow-snowfield", "deus-research-hard", "noiran-legacy-4", "fire-temple-trial",
    "fallen-deva-hard", "abyss-horn-4", "nightmare-atheron-10", "training-dummy-60s"];
  const hues = { 마도성: 300, 살성: 15, 호법성: 70, 궁성: 150, 검성: 200, 수호성: 240, 정령성: 180, 치유성: 95, 권성: 28 };
  const hue = job => 'oklch(0.74 0.12 ' + (hues[job] ?? 28) + ')';
  const bossColor = index => 'oklch(0.78 0.11 ' + ([205, 35, 140, 310][(index - 1 + 4) % 4]) + ')';
  const pad = number => String(number).padStart(2, "0");
  let locale = i18n.read();
  let surface = "";
  let chromeSignature = "";
  let snapshot;
  let selectedJob;
  let selection;
  let renderedGlobalScope = "";
  let view = "table";
  let expanded = false;
  let onlyBoss = 0;
  let cpPending = false;
  let cpError = "";
  let scopeOpen = false;
  let langOpen = false;
  let menuOpen = false;
  let searchServer = "";
  let searchSuggestion = false;
  const taiwan = {
    "Rankings · Stats": "排行 · 統計", "Builds · Tools": "配裝 · 工具", Live: "即時", Community: "社群",
    "KR · TW": "韓國 · 台灣", Global: "全球", "Download NotMeter": "下載 NotMeter", Rankings: "排行", Builds: "配裝", All: "全部",
    "No matching servers": "沒有符合的伺服器", "Search character name": "搜尋角色名稱", "All NotMeter features": "在同一處找到所有 NotMeter 功能",
    "Ranking service": "排行地區", Language: "語言", "All-time records retained": "保留全部期間紀錄",
    "Last updated": "最後統計", "Aggregation starts on the hour and half hour": "每小時整點及 30 分開始統計",
    "Daily active users": "每日活躍使用者", "Characters using the meter · 05:00 cutoff": "使用統計器的角色 · 以 05:00 為界",
    "Compare class percentiles and the top 20 personal bests by dungeon, boss and combat power.": "依副本、首領與戰力區間比較職業的前 10% 與前 25% 門檻，以及個人最佳紀錄前 20 名。",
    "Normal · Hard": "普通 · 困難", "Awakened Atheron · Stage 10": "覺醒阿特隆 · 第 10 階段", "By time": "依時間", "Rankings only": "僅排行",
    Metric: "指標", "Buff adjusted": "增益校正", Difficulty: "難度", "CP bracket": "戰力區間", "25K lower": "降低 25K",
    "25K higher": "提高 25K", "Enter CP": "輸入戰力", "All-boss ranks do not count toward ranker benefits": "所有首領的名次不計入排行獎勵",
    "Top 10%": "前 10%", "Top 10% comparison": "前 10% 比較", Characters: "角色", "Select a row to view the top 20": "選取一列以查看前 20 名",
    "Lowest – highest": "最低 – 最高", "Median – top 10%": "中位數 – 前 10%",
    "Distribution of retained global top records": "以已公開的全球頂尖紀錄統計",
    "Personal best per character": "依每位角色的個人最佳紀錄",
    "One representative value per character · boss DPS is not added together": "每位角色取一個代表值 · 不加總各首領的 DPS",
    "Boss scope": "統計首領", "All bosses": "所有首領", "Ranked across bosses": "合併首領排名",
    "Back to all bosses": "返回所有首領", "Rank 1": "第 1 名", "/s": "/秒", "Show first 10": "僅顯示前 10 名",
    "Select a name for combat details": "點選名稱查看戰鬥詳情", "This CP bracket is unavailable": "此戰力區間尚未發布",
    "What if my CP bracket changes?": "戰力區間變更時怎麼辦？", "Eligibility is checked in your current CP bracket. Records stay in their original bracket.": "依目前戰力區間重新判定資格。原有紀錄保留在原本的區間。",
    "Animated gold diamond": "動態金色菱形", "Includes nickname effect eligibility": "包含暱稱效果資格",
    "Sky-blue frame": "天藍色邊框", "Static frame": "靜態邊框", "Purple frame": "紫色邊框",
    "5 players": "5 人", "Confirmed kill": "確認擊殺", "Aggregation schedule": "統計週期", "Combat details": "戰鬥詳情",
    "Combat details are available for published top records.": "已發布的頂尖紀錄可查看戰鬥詳情。",
    "Ranker marks · Nickname effects": "排行標記 · 暱稱效果", "Weekly ranks": "本週名次", "appear in the meter": "會顯示在傷害統計器",
    "Frequently asked questions": "常見問題", "Shortest combat time": "依最短戰鬥時間",
    "Can't find your record?": "找不到自己的紀錄？", "Check the four ranking eligibility rules": "查看排行統計的四項條件",
    "AION 2 damage meter · Dungeon statistics and real-time DPS / nDPS analysis.": "AION 2 傷害統計器 · 副本統計與即時 DPS / nDPS 分析。",
    "All servers": "所有伺服器", "Search scope": "搜尋範圍", Region: "地區", "Specific server": "指定伺服器",
    "Find a server": "尋找伺服器", Character: "角色", Search: "搜尋", Dungeon: "副本", Menu: "選單",
    "Install Npcap": "安裝 Npcap", "Extract the ZIP": "解壓縮 ZIP", "Run NotMeter.exe from the extracted folder.": "從解壓縮的資料夾執行 NotMeter.exe。",
    "Enter combat in game": "在遊戲中開始戰鬥", "NotMeter displays combat data when you enter combat in AION 2.": "在 AION 2 中進入戰鬥後，NotMeter 會顯示戰鬥資料。",
    Latest: "最新版", "AION 2 live meter · DPS / nDPS analysis · Ranker marks": "AION 2 即時傷害統計器 · DPS / nDPS 分析 · 排行標記",
    "Same PC as the game": "與遊戲使用同一台電腦", Free: "免費",
    Required: "必須安裝", "Packet capture driver for combat data": "用於擷取戰鬥資料的封包驅動程式",
    "Get Npcap": "下載 Npcap", "Download requested. Follow the steps below to install.": "已送出下載要求。請依下方步驟安裝。",
    "Using an older version?": "正在使用舊版？", "Check for updates in NotMeter settings.": "請在 NotMeter 設定中檢查更新。",
    "Copy download link": "複製下載連結", "Getting started guide": "新手指南",
    "Link copied ✓": "已複製連結 ✓", "Download again": "重新下載",
  };
  const words = () => copy[locale] || copy[locale.split("-")[0]] || copy.en;
  const shellKeys = ["Rankings · Stats", "Builds · Tools", "Live", "Community", "Rankings", "Builds", "Search character name",
    "Search scope", "All NotMeter features", "Pet Tracker", "Meter Sharing", "Class DPS Comparison", "Boss Resistance",
    "User guide", "Ranking service", "Find a server", "Specific server"];
  const shellWords = {
    "zh-TW": ["排行 · 統計", "配裝 · 工具", "即時", "社群", "排行", "配裝", "搜尋角色名稱", "搜尋範圍", "在同一處找到所有 NotMeter 功能",
      "寵物追蹤", "Meter 分享", "職業 DPS 比較", "首領抗性", "使用指南", "排行地區", "尋找伺服器", "指定伺服器"],
    "ja-JP": ["ランキング · 統計", "ビルド · ツール", "ライブ", "コミュニティ", "ランキング", "ビルド", "キャラクター名で検索", "検索範囲", "NotMeter のすべての機能",
      "ペットトラッカー", "Meter 共有", "クラス別 DPS 比較", "ボス耐性", "使い方ガイド", "ランキング地域", "サーバーを検索", "サーバーを指定"],
    "de-DE": ["Ranglisten · Statistik", "Builds · Werkzeuge", "Live", "Community", "Ranglisten", "Builds", "Charakternamen suchen", "Suchbereich", "Alle NotMeter-Funktionen",
      "Pet-Tracker", "Meter teilen", "Klassen-DPS-Vergleich", "Bossresistenz", "Benutzerhandbuch", "Ranglistenregion", "Server suchen", "Bestimmter Server"],
    "fr-FR": ["Classements · Statistiques", "Builds · Outils", "En direct", "Communauté", "Classements", "Builds", "Rechercher un personnage", "Périmètre de recherche", "Toutes les fonctions de NotMeter",
      "Suivi des familiers", "Partage de Meter", "Comparaison du DPS par classe", "Résistance des boss", "Guide d’utilisation", "Région du classement", "Rechercher un serveur", "Serveur précis"],
    "es-ES": ["Clasificaciones · Estadísticas", "Configuraciones · Herramientas", "En directo", "Comunidad", "Clasificaciones", "Configuraciones", "Buscar por nombre de personaje", "Ámbito de búsqueda", "Todas las funciones de NotMeter",
      "Seguimiento de mascotas", "Compartir Meter", "Comparación de DPS por clase", "Resistencia de jefes", "Guía de uso", "Región de clasificación", "Buscar un servidor", "Servidor específico"],
    "pt-BR": ["Classificações · Estatísticas", "Builds · Ferramentas", "Ao vivo", "Comunidade", "Classificações", "Builds", "Buscar por nome de personagem", "Escopo da busca", "Todos os recursos do NotMeter",
      "Rastreador de mascotes", "Compartilhar Meter", "Comparação de DPS por classe", "Resistência de chefes", "Guia de uso", "Região da classificação", "Buscar um servidor", "Servidor específico"],
    "ru-RU": ["Рейтинги · Статистика", "Сборки · Инструменты", "В реальном времени", "Сообщество", "Рейтинги", "Сборки", "Поиск по имени персонажа", "Область поиска", "Все возможности NotMeter",
      "Трекер питомцев", "Обмен настройками Meter", "Сравнение DPS классов", "Сопротивление боссов", "Руководство", "Регион рейтинга", "Найти сервер", "Конкретный сервер"],
    vi: ["Xếp hạng · Thống kê", "Lối xây dựng · Công cụ", "Trực tiếp", "Cộng đồng", "Xếp hạng", "Lối xây dựng", "Tìm theo tên nhân vật", "Phạm vi tìm kiếm", "Tất cả tính năng của NotMeter",
      "Theo dõi thú cưng", "Chia sẻ Meter", "So sánh DPS theo lớp", "Kháng của trùm", "Hướng dẫn sử dụng", "Khu vực xếp hạng", "Tìm máy chủ", "Máy chủ cụ thể"],
  };
  const shellText = en => shellWords[locale]?.[shellKeys.indexOf(en)] ||
    (locale === "zh-TW" ? taiwan[en] : null) || i18n.text(en, locale);
  const label = (ko, en) => locale === "ko" ? ko : shellText(en);
  const integerFormats = new Map();
  function integer(number) {
    if (!integerFormats.has(locale)) integerFormats.set(locale, new Intl.NumberFormat(i18n.tag(locale), { maximumFractionDigits: 0 }));
    return integerFormats.get(locale).format(number);
  }
  const compact = value => {
    if (!(value > 0)) return "—";
    if (value >= 1000000) return Number((value / 1000000).toFixed(2)) + "M";
    if (value >= 1000) return Number((value / 1000).toFixed(value >= 100000 ? 0 : value >= 10000 ? 1 : 2)) + "K";
    return String(Math.round(value));
  };
  const button = (action, value, text, active = false, extra = "") =>
    `<button type="button" data-action="${action}" data-value="${esc(value)}" class="${active ? "on" : ""}" aria-pressed="${active}" ${extra}>${text}</button>`;
  const seg = (action, active, options) =>
    `<div class="nm-seg">${options.map(([value, text, extra]) => button(action, value, text, value === active, extra)).join("")}</div>`;
  const navIcon = icon => icon === "field-boss" || icon === "artifact"
    ? `<img class="nv-ic nv-game" src="./assets/${icon === "field-boss" ? "boss-icon" : "artifact-neutral"}.png" alt="">`
    : `<span class="nv-ic nv-${icon}" aria-hidden="true"><i></i><i></i><i></i></span>`;
  const cpIcon = alt => `<img class="nm-cp-icon" src="./assets/combat-power.png" alt="${alt}" width="14" height="14">`;
  const markup = new WeakMap();
  function setMarkup(element, html) {
    if (markup.get(element) === html) return false;
    markup.set(element, html);
    element.innerHTML = html;
    return true;
  }
  function navigationSlot(name, html) {
    const slot = "navigation-" + name;
    let group = host.querySelector(`:scope > [slot="${slot}"]`);
    if (!group) {
      group = document.createElement("span");
      group.className = "nm-navigation-links";
      group.slot = slot;
      host.append(group);
    }
    setMarkup(group, html);
    return `<slot name="${slot}"></slot>`;
  }
  const gridIcon = '<span class="nv-grid" aria-hidden="true"><i></i><i></i><i></i><i></i></span>';
  const brand = '<a class="nm-logo" href="./"><img src="./assets/notmeter-icon.png" alt=""><span>NotMeter</span></a>';
  const download = () => `<a class="hd-dl" href="?download=1" data-action="download">${esc(label("미터기 다운로드", "Download NotMeter"))}</a>`;
  const navLabel = route => locale === "ko" ? route.label : route.key === "ranking" ? words()[2] :
    (navKeys[route.key] && tr(navKeys[route.key])) ||
    shellText({
      "class-top10": "Class TOP 10", "class-performance": "Class DPS Comparison", "boss-resistance": "Boss Resistance",
      "setup-guide": "Build Guide", "stat-efficiency": "Stat Efficiency Calculator", "pet-tracker": "Pet Tracker",
      "field-boss": "Field Boss", artifact: "Artifact Status", "meter-sharing": "Meter Sharing",
    }[route.key] || route.label);
  const menuGroup = group => label(group[0], group[1]);
  const routeKeys = { classTop10: "class-top10", classPerformance: "class-performance", bossResistance: "boss-resistance",
    contribution: "setup-guide", statEfficiency: "stat-efficiency", fieldBoss: "field-boss", meterSharing: "meter-sharing" };
  const sameNav = route => route.key === (routeKeys[surface] || surface);
  const currentLink = route => sameNav(route) ? ' aria-current="page"' : "";
  const hasRankingScope = () => ["ranking", "classPerformance", "classTop10"].includes(surface);
  const rankingService = () => surface === "classPerformance" ? globalThis.NotMeterClassPerformance?.service :
    surface === "classTop10" ? globalThis.NotMeterClassTop10?.service : globalThis.NotMeterGlobalRanking?.state.service;
  const extraLinks = () => [
    ["navigation-guide-button", "./tutorial.html", label("사용 가이드", "User guide")],
    ["notmeter-discord", "https://discord.com/invite/DuAuuhdrwy", "NotMeter Discord"],
  ].map(([id, href, text]) => {
    const link = source(id);
    return { href: link?.getAttribute("href") || href, text,
      external: link?.target === "_blank" || href.startsWith("https:") };
  });
  const legalLinks = () => {
    const links = [...document.querySelectorAll(".page-footer .footer-links a, .legal-nav a")];
    const defaults = [
      ["./terms.html", locale === "zh-TW" ? "使用條款" : label("이용약관", "Terms")],
      ["./privacy.html", locale === "zh-TW" ? "隱私權政策" : label("개인정보처리방침", "Privacy policy")],
      ["./cookies.html", locale === "zh-TW" ? "Cookie 與廣告說明" : label("쿠키 및 광고 안내", "Cookies and advertising")],
      ["mailto:Not4You.dev@gmail.com", locale === "zh-TW" ? "聯絡我們" : label("문의", "Contact")],
    ];
    return defaults.map(([href, fallback]) => {
      const link = links.find(link => link.getAttribute("href")?.split("?")[0] === href);
      return [link?.getAttribute("href") || href, link?.textContent || fallback];
    });
  };

  root.innerHTML = `
    <link rel="stylesheet" href="./assets/homepage-reference.css?v=20261108-profile-navigation">
    <div class="nm-app">
      <div class="nm-ambient"></div>
      <header class="hd nav-grouped">
        <div class="hd-row1"><div class="hd-in">
          ${navigationSlot("brand", brand)}
          <form class="hs" role="search" autocomplete="off">
            <div class="hs-scope"></div><span class="glass"></span>
            <input class="hs-input" type="search" maxlength="20" spellcheck="false">
            <kbd class="hs-shortcut">/</kbd>
            <div class="hs-drop" hidden><div class="hs-suggestions"></div><slot name="character-results"></slot></div>
          </form>
          <span class="hd-sp"></span>
          <slot name="support-menu"></slot>
          <div class="hd-region hd-rank-region"></div><div class="hd-pop"></div>
          <button class="nv-all" type="button" data-action="menu">${gridIcon}<span></span></button>
          <span class="hd-download"></span>
          <button class="hd-burger" type="button" data-action="menu"><i></i><i></i><i></i></button>
        </div></div>
        <nav class="hd-row2"><div class="hd-in"></div></nav>
      </header>
      <main class="nm-wrap nm-ranking">
        <section class="nm-hero">
          <div class="hero-copy"></div>
          <div class="nm-status">
            <div class="st-block"><span class="st-label st-reset"></span><span class="st-val mono st-remaining">—</span>
              <span class="st-bar"><i></i></span><span class="st-sub st-schedule"></span></div><div class="st-sep"></div>
            <div class="st-block"><span class="st-label st-updated"></span><span class="st-val mono"><span class="live"></span><time class="st-timestamp">—</time></span>
              <span class="st-sub st-cadence"></span></div><div class="st-sep"></div>
            <div class="st-block"><span class="st-label st-daily-label"></span><span class="st-val mono st-daily">—</span></div>
          </div>
        </section>
        <div class="nm-rail" role="tablist"></div>
        <div class="nm-filters"></div>
        <div class="nm-bosses"></div>
        <div class="nm-main">
          <div class="nm-main-col">
            <div class="nm-card"><div class="nm-card-head"></div><div class="nm-dist"></div></div>
            <slot name="ranking-discord"></slot>
            <slot name="party-finder"></slot>
          </div>
          <aside class="nm-top20"></aside>
          <span class="nm-boss-switch-status" role="status" hidden></span>
        </div>
        <div class="help"></div>
        <slot name="sponsor"></slot>
      </main>
      <slot name="service"></slot>
      <div class="nm-wrap nm-footer"><footer class="ft"></footer></div>
      <nav class="mtabs"></nav>
      <div class="menu-layer"></div>
      <dialog class="dl-overlay" aria-label="NotMeter"></dialog>
    </div>`;
  const shellStyle = $("link");
  const pageMotion = matchMedia("(prefers-reduced-motion: no-preference)");
  let pageEntry;
  addEventListener("pageswap", event => {
    if (!event.viewTransition || !menuOpen) return;
    menuOpen = false;
    renderMenu();
  });
  function animatePageEntry() {
    pageEntry?.cancel();
    if (!pageMotion.matches || document.hidden) return;
    const content = surface === "ranking" ? $(".nm-ranking") : host.querySelector('[slot="service"]:not(header)');
    const page = content?.querySelector("#class-top10-surface:not([hidden]) .t10-host, #class-performance-surface:not([hidden]) notmeter-performance")?.shadowRoot || content;
    const heading = page && [...page.querySelectorAll("h1, h2")].find(element => element.getClientRects().length);
    pageEntry = heading?.animate?.([{ translate: "0 4px" }, { translate: "0 0" }], {
      duration: 150, easing: "cubic-bezier(.2,.8,.2,1)",
    });
  }
  function revealShell() {
    const html = document.documentElement;
    if (!html.hasAttribute("data-nm-shell-pending")) return;
    html.removeAttribute("data-nm-shell-pending");
    const navigation = performance.getEntriesByType("navigation")[0];
    if (document.referrer.startsWith(location.origin + "/") && navigation?.type !== "reload") {
      requestAnimationFrame(animatePageEntry);
    }
  }
  host.addEventListener("notmeter:page-enter", animatePageEntry);
  function revealWhenStyled() {
    const content = surface === "classTop10" ? host.querySelector(".t10-host") :
      surface === "classPerformance" ? host.querySelector("notmeter-performance") : null;
    const styles = [shellStyle, content?.shadowRoot?.querySelector('link[rel="stylesheet"]')];
    const waiting = styles.filter(style => style && !style.sheet);
    if (!waiting.length) revealShell();
    else for (const style of waiting) {
      style.addEventListener("load", () => {
        if (waiting.every(link => link.sheet)) revealShell();
      }, { once: true });
    }
  }

  function navLink(route, className = "") {
    const live = ["field-boss", "artifact"].includes(route.key);
    return `<a href="${route.href}" class="${className}${sameNav(route) ? " on" : ""}"${currentLink(route)}>${navIcon(route.icon)}
      <span>${esc(navLabel(route))}</span>${live ? '<span class="nv-live"></span>' : ""}</a>`;
  }

  function regionButtons() {
    return [["KR/TW", label("한국 · 대만", "KR · TW")], ["Global", label("글로벌", "Global")]].map(([value, name]) =>
      button("region", value, esc(name), value === rankingService())).join("");
  }

  const availableLanguages = () => standalone
    ? [...languageControl().options].map(option => ({ code: option.value, name: option.textContent }))
    : i18n.languages;

  function languages() {
    return availableLanguages().map(language => button("language", language.code,
      esc(language.name) + (langOpen && locale === language.code ? '<span class="lang-check"></span>' : ""), locale === language.code)).join("");
  }

  function renderHeader() {
    const current = availableLanguages().find(language => language.code === locale);
    $(".hd-rank-region").hidden = !hasRankingScope();
    $(".hd-rank-region").innerHTML = hasRankingScope() ? regionButtons() : "";
    $(".hd-pop").innerHTML = `<button class="hd-chip" type="button" data-action="languages" aria-expanded="${langOpen}">
      <span class="globe"></span>${esc(current?.name)}<span class="caret"></span></button>
      <div class="hd-menu" ${langOpen ? "" : "hidden"}>${languages()}</div>`;
    $(".nv-all span:last-child").textContent = words()[9];
    $(".hd-burger").setAttribute("aria-label", words()[9]);
    $(".hd-download").innerHTML = download();
    $(".hd-row2 .hd-in").innerHTML = menu.map((group, index) => `<div class="nv-group"><span class="nv-glabel">${esc(menuGroup(group))}</span>
      <div class="nv-items">${navigationSlot("desktop-" + index, group[2].filter(route => route.key !== "boss-resistance").map(route => navLink(route, "nv")).join(""))}</div></div>`).join("");
    $(".mtabs").innerHTML = navigationSlot("mobile", ["ranking", "class-top10", "field-boss", "setup-guide"].map((key, index) => {
      const route = routes.find(item => item.key === key);
      const text = [label("랭킹", "Rankings"), "TOP 10", navLabel(route), label("세팅", "Builds")][index];
      return `<a class="${sameNav(route) ? "on" : ""}" href="${route.href}"${currentLink(route)}>${navIcon(route.icon)}<span>${esc(text)}</span></a>`;
    }).join("")) + `<button type="button" data-action="menu">${gridIcon}<span>${esc(label("전체", "All"))}</span></button>`;
    $(".hs-input").placeholder = label("캐릭터 이름 검색", "Search character name");
    $(".hs-input").setAttribute("aria-label", words()[8]);
    if (!standalone) renderScope();
    else $(".hs-scope").hidden = true;
    renderMenu();
  }

  function renderMenu() {
    if (!menuOpen) {
      $(".menu-layer").replaceChildren();
      for (const group of host.querySelectorAll(':scope > [slot^="navigation-sheet-"]')) group.remove();
      return;
    }
    $(".menu-layer").innerHTML = `<div class="sheet-ov" data-action="close-menu">
      <div class="sheet" role="dialog" aria-modal="true" aria-label="${esc(words()[9])}">
        <div class="sheet-head"><b>${esc(words()[9])}</b><span class="sub">${esc(label("NotMeter의 모든 기능을 한 곳에서", "All NotMeter features"))}</span>
          <button class="x" type="button" data-action="close-menu" aria-label="${esc(words()[13])}"></button></div>
        <div class="sheet-grid">${menu.map((group, index) => `<div class="sheet-col"><h4>${esc(menuGroup(group))}</h4>
          ${navigationSlot("sheet-" + index, (index === 1 ? [...group[2], optimizationRoute] : group[2]).map(route => `<a href="${route.href}" class="sheet-item${sameNav(route) ? " on" : ""}"${currentLink(route)}>${navIcon(route.icon)}<span><b>${esc(navLabel(route))}${["field-boss", "artifact"].includes(route.key) ? '<em class="live-tag">LIVE</em>' : ""}</b>
          <small>${esc(locale === "ko" ? route.desc : navLabel(route))}</small></span></a>`).join(""))}</div>`).join("")}</div>
        <div class="sheet-extra">${navigationSlot("sheet-extra", extraLinks().map(link => `<a href="${esc(link.href)}"${link.external ? ' target="_blank" rel="noopener noreferrer"' : ""}>${esc(link.text)}</a>`).join(""))}</div>
        <div class="sheet-foot"><div class="sf-row" ${hasRankingScope() ? "" : "hidden"}><span>${esc(label("랭킹 지역", "Ranking service"))}</span><div class="hd-region">${hasRankingScope() ? regionButtons() : ""}</div></div>
          <div class="sf-row"><span>${esc(label("언어", "Language"))}</span><div class="hd-region">${languages()}</div></div>${download()}</div>
      </div></div>`;
  }

  const statusZone = "Asia/Seoul";
  const statusDay = new Intl.DateTimeFormat("en-CA", { timeZone: statusZone, dateStyle: "short" });
  const statusTimeOptions = { timeZone: statusZone, hour: "2-digit", minute: "2-digit", hourCycle: "h23" };
  let statusLocale, statusTime, statusDate, renderedTimestamp;
  function renderStatus() {
    const global = snapshot?.service === "Global";
    const date = new Date();
    if (locale !== statusLocale) {
      statusLocale = locale;
      const tag = i18n.tag(locale);
      statusTime = new Intl.DateTimeFormat(tag, statusTimeOptions);
      statusDate = new Intl.DateTimeFormat(tag, { ...statusTimeOptions, month: "short", day: "numeric" });
    }
    if (surface !== "ranking") return;
    const reset = globalThis.NotMeterWeeklyReset;
    $(".st-remaining").textContent = reset.remaining(+date, locale, global);
    $(".st-bar i").style.width = (100 * (1 - (reset.nextReset(+date, global) - +date) / (7 * 86400000))) + "%";
    $(".st-schedule").textContent = (source("weekly-reset").querySelector("[data-reset-schedule]").textContent || "") +
      (global ? "" : " · " + label("전체 기간 기록 유지", "All-time records retained"));
    $(".st-daily").textContent = source("daily-user-count").textContent;
    $(".st-daily").title = source("daily-user-count").title;
    const timestamp = $(".st-timestamp");
    const generatedAt = snapshot?.generatedAt;
    const key = [locale, generatedAt, locale === "ko" ? statusDay.format(date) : ""].join("|");
    if (key === renderedTimestamp) return;
    renderedTimestamp = key;
    if (generatedAt > 0) {
      timestamp.dateTime = new Date(generatedAt).toISOString();
      const today = locale === "ko" && statusDay.format(date) === statusDay.format(generatedAt);
      timestamp.textContent = today ? "오늘 " + statusTime.format(generatedAt) : statusDate.format(generatedAt);
    } else {
      timestamp.removeAttribute("datetime");
      timestamp.textContent = "—";
    }
  }

  function renderCopy() {
    const [first, second] = words();
    const split = locale === "ko" ? first.indexOf("같은") : -1;
    $(".hero-copy").innerHTML = `<div class="crumb"><span>${esc(menuGroup(menu[0]))}</span><i></i>${esc(words()[2])}</div>
      <h1>${split < 0 ? esc(first) : esc(first.slice(0, split)) + "<em>" + esc(first.slice(split)) + "</em>"}<br>${esc(second)}</h1>
      <p>${esc(label("캐릭터별 대표값을 보스·직업·25K CP 구간으로 나눕니다. 상위 10%·25% 기준선과 개인 최고 기록 TOP 20을 한 화면에서 확인하세요.",
        "Compare class percentiles and the top 20 personal bests by dungeon, boss and combat power."))}</p>`;
    $(".st-reset").textContent = source("weekly-reset").querySelector("[data-reset-title]").textContent;
    $(".st-updated").textContent = label("마지막 집계", "Last updated");
    $(".st-cadence").textContent = globalGuideCopy()?.items[6][0] || label("매시 정각·30분 집계 시작", "Aggregation starts on the hour and half hour");
    $(".st-daily-label").textContent = label("일일 활성 사용자", "Daily active users");
    renderHelp();
  }

  function dungeonOptions() {
    return [...source("dungeon-filter-buttons").children].sort((a, b) => {
      const position = element => {
        const index = order.indexOf(element.dataset.dungeonKey);
        return index < 0 ? order.length : index;
      };
      return position(a) - position(b);
    }).map(element => {
      const key = element.dataset.dungeonKey;
      const text = element.firstElementChild.textContent;
      const parts = text.match(/^(.+?)\s*[（(]([^）)]+)[）)]$/);
      const raidDifficulty = globalThis.NotMeterGlobalRanking?.catalog.raidDifficultyNames;
      const diff = key === "global-rudra-difficulty" ? [raidDifficulty.normal, raidDifficulty.hard].map(globalThis.NotMeterGlobalRanking.label).join(" · ")
        : key === "sorrow-snowfield" ? label("보통 · 어려움", "Normal · Hard") : parts?.[2] ||
        (key === "nightmare-atheron-10" ? label("각성한 아테론 10단계", "Awakened Atheron · Stage 10") : "");
      return { key, text: parts?.[1] || text, diff, active: element.getAttribute("aria-checked") === "true",
        tag: key.includes("nightmare") ? label("시간순", "By time") : key.includes("dummy") ? label("랭킹 전용", "Rankings only") : "" };
    });
  }

  function bosses() {
    return [...source("boss-filter-buttons").children].map(element => ({
      index: Number(element.dataset.bossIndex),
      name: locale === "ko" ? element.lastElementChild.textContent.replace("델트라스 (2페이즈)", "델트라스 2페이즈") : element.lastElementChild.textContent,
      order: Number(element.firstElementChild.textContent), active: element.getAttribute("aria-checked") === "true",
    }));
  }

  function cpLabel() {
    const option = snapshot.cpOptions.find(option => option.value === snapshot.cpValue);
    if (!option?.minCombatPower) return tr("allCp");
    if (option.minCombatPower < 1000 || !option.maxCombatPowerExclusive) return option.label;
    return (option.minCombatPower / 1000) + "K – " + (option.maxCombatPowerExclusive / 1000) + "K";
  }

  function cpBrackets() {
    return snapshot.cpOptions.filter(option => option.maxCombatPowerExclusive - option.minCombatPower === 25000);
  }

  function updateChoices(container, choices, action) {
    for (const control of container.querySelectorAll(`[data-action="${action}"]`)) {
      const active = choices.some(choice => String(choice.value) === control.dataset.value && choice.active);
      control.classList.toggle("on", active);
      control.setAttribute(control.getAttribute("role") === "tab" ? "aria-selected" : "aria-pressed", String(active));
    }
  }

  function renderFilters(dungeons, bossOptions, currentDungeon) {
    const cp = snapshot.cpOptions.some(option => option.value === snapshot.cpValue && option.minCombatPower > 0);
    const disabled = cpPending || !cpBrackets().length;
    const draft = $(".cp-input")?.value || "";
    const rail = snapshot.service === "Global" ? dungeons : dungeons.filter(dungeon => order.includes(dungeon.key));
    const dungeonRail = $(".nm-rail");
    setMarkup(dungeonRail, rail.map((dungeon, index) => `<button class="dg" type="button"
      role="tab" data-action="dungeon" data-value="${esc(dungeon.key)}">
      <span class="dg-no mono">${pad(index + 1)}</span><span class="dg-name">${esc(dungeon.text)}</span>
      <span class="dg-diff">${esc(dungeon.diff)}</span>${dungeon.tag ? '<span class="dg-tag">' + esc(dungeon.tag) + '</span>' : ""}</button>`).join(""));
    updateChoices(dungeonRail, rail.map(dungeon => ({ value: dungeon.key, active: dungeon.active })), "dungeon");
    const group = (name, body) => `<div class="f-group"><span class="f-label">${esc(name)}</span>${body}</div>`;
    const groupOptions = (id, key) => Array.from(source(id).children, element => [element.dataset[key], esc(element.textContent)]);
    const difficulty = groupOptions("dungeon-difficulty-buttons", "difficultyKey");
    const period = groupOptions("period-filter-buttons", "rankingPeriod");
    const allowNdps = snapshot.service !== "Global" && !snapshot.timeBased && !snapshot.dungeon.includes("dummy");
    setMarkup($(".nm-filters"), group(label("지표", "Metric"), seg("metric", snapshot.metric, [
      ["dps", "DPS"], ["ndps", "nDPS <small>" + esc(label("버프 보정", "Buff adjusted")) + "</small>", allowNdps ? "" : "disabled"],
    ])) + group(tr("period"), seg("period", snapshot.period, period)) +
      (difficulty.length ? group(label("난이도", "Difficulty"), seg("difficulty", snapshot.dungeon, difficulty)) : "") +
      group(label("CP 구간", "CP bracket"), `<div class="nm-cp">
        <button type="button" class="cp-all${cp ? "" : " on"}" data-action="cp-all" ${cpPending || !snapshot.cpOptions.length ? "disabled" : ""}>${esc(label("전체", "All"))}</button>
        <div class="cp-box${cp ? " on" : ""}">
          <button type="button" class="cp-step" data-action="cp-step" data-value="-25" aria-label="${esc(label("25K 낮게", "25K lower"))}" ${disabled ? "disabled" : ""}>−</button>
          <span class="cp-label mono">${cpIcon("")}${esc(cpLabel())}</span>
          <button type="button" class="cp-step" data-action="cp-step" data-value="25" aria-label="${esc(label("25K 높게", "25K higher"))}" ${disabled ? "disabled" : ""}>+</button>
        </div><input class="cp-input mono" inputmode="decimal" value="${esc(draft)}" placeholder="${esc(label("내 CP 입력", "Enter CP"))}" aria-label="${esc(label("내 CP 입력", "Enter CP"))}" ${disabled ? "disabled" : ""}></div>`) +
      '<span class="f-spacer"></span>' + seg("view", view, [["chart", esc(words()[4])], ["table", esc(words()[5])]]));
    const bossRail = $(".nm-bosses");
    setMarkup(bossRail, bossOptions.map(boss => `<button type="button" class="boss" data-action="boss"
      data-value="${boss.index}">${boss.index ? '<span class="bn">' + pad(boss.order) + '</span>' : ""}${esc(boss.name)}</button>`).join("") + '<span class="note"></span>');
    updateChoices(bossRail, bossOptions.map(boss => ({ value: boss.index, active: boss.active })), "boss");
    bossRail.querySelector(".note").textContent = cpError || (snapshot.boss
      ? [currentDungeon?.text, currentDungeon?.diff].filter(Boolean).join(" · ")
      : label("‘전체 보스’ 순번은 랭커 혜택 기준이 아닙니다", "All-boss ranks do not count toward ranker benefits"));
  }

  const top10 = () => label("상위 10%", "Top 10%");
  function notice() {
    const state = snapshot.name;
    const message = source(state === "error" ? "error-message" : state === "empty" ? "empty-message" : "loading-state");
    return `<div class="nm-message" role="status">${esc(message?.textContent.trim() || tr("loading"))}
      ${state === "error" ? button("retry", "", esc(source("retry-button").textContent)) : ""}</div>`;
  }

  function renderDistribution(currentBoss) {
    const rows = snapshot.rows;
    const metric = snapshot.metric === "ndps" ? "nDPS" : "DPS";
    const period = source("period-filter").selectedOptions[0]?.textContent;
    const region = snapshot.service === "Global" ? label("글로벌", "Global") : label("한국 · 대만", "KR · TW");
    $(".nm-card-head").innerHTML = `<h2>${esc(locale === "ko" ? "직업별 " + metric + " 분포" : metric + " · " + words()[3])}</h2>
      <span class="sub">${[region, currentBoss, cpLabel(), period].map(esc).join(" · ")}</span><span class="sp"></span>
      <span class="sub">${esc(label("행을 선택하면 오른쪽에 TOP 20", "Select a row to view the top 20"))}</span>`;
    const limit = Math.max(1, ...rows.map(row => row.max || 0)) * 1.04;
    const peak = Math.max(1, ...rows.map(row => row.p10));
    const targetStep = Math.max(limit / 5, limit > 400000 ? 100000 : 50000);
    const unit = 10 ** Math.floor(Math.log10(targetStep));
    const step = [1, 2, 2.5, 5, 10].map(size => size * unit).find(size => size >= targetStep);
    const ticks = Array.from({ length: Math.floor(limit / step) + 1 }, (_, index) => index * step);
    const x = number => ((Number(number) || 0) / limit * 100) + "%";
    const plot = (className, left, right) => `<i class="${className}" style="left:${x(left)}${right == null ? "" : ";width:calc(" + x(right) + " - " + x(left) + ")"}"></i>`;
    const dist = $(".nm-dist");
    dist.className = "nm-dist view-" + view;
    const html = `<div class="dist-head"><span class="c-rank">#</span><span class="c-cls">${esc(tr("job"))}</span><span class="c-plot">
      ${view === "chart" ? '<span class="axis">' + ticks.map(tick => `<span class="tick mono" style="left:${x(tick)}">${tick ? compact(tick) : "0"}</span>`).join("") + '</span>' :
        '<span class="axis-label">' + esc(label("상위 10% 비교", "Top 10% comparison")) + '</span>'}</span>
      ${[top10(), tr("top25"), tr("median"), tr("max"), label("캐릭터", "Characters")].map((text, index) => `<span class="c-num${index === 4 ? " c-n" : ""}">${esc(text)}</span>`).join("")}</div>
      ${rows.map((row, index) => `<button class="dist-row${row.job === selectedJob ? " on" : ""}" type="button" data-action="job" data-value="${esc(row.job)}"
        aria-pressed="${row.job === selectedJob}" style="--tint:${hue(row.job)};--d:${index * 35}ms">
        <span class="c-rank mono">${index + 1}</span><span class="c-cls"><img src="${esc(row.icon)}" alt=""><b>${esc(row.label)}</b></span>
        <span class="c-plot"><span>${ticks.map(tick => plot("grid", tick)).join("")}</span>${plot("range", row.min, row.max)}${plot("iqr", row.med, row.p10)}
          ${plot("p25", row.p25)}${plot("med", row.med)}${plot("mx", row.max)}<i class="tbar" style="width:${row.p10 / peak * 100}%"></i></span>
        <span class="c-num mono hi">${compact(row.p10)}</span><span class="c-num mono">${compact(row.p25)}</span>
        <span class="c-num mono dim">${compact(row.med)}</span><span class="c-num mono">${compact(row.max)}</span>
        <span class="c-num c-n mono dim">${integer(row.n)}</span></button>`).join("") || notice()}
      <div class="dist-legend">${[["range", label("최저 – 최고", "Lowest – highest")], ["iqr", label("중앙값 – 상위 10%", "Median – top 10%")],
        ["p25", tr("top25")], ["mx", tr("max")]].map(([key, text]) => `<span><i class="lg-${key}"></i>${esc(text)}</span>`).join("")}
        <span class="lg-note" title="${esc(snapshot.service === "Global" ? "" : tr("sampleBasisDescription"))}">${esc(snapshot.retainedSample
          ? label("공개된 글로벌 상위 기록 기준", "Distribution of retained global top records")
          : snapshot.service === "Global" ? label("캐릭터별 최고 기록 기준", "Personal best per character")
            : label("캐릭터별 대표값 · 보스 DPS는 합산하지 않습니다", "One representative value per character · boss DPS is not added together"))}</span></div>`;
    if (markup.get(dist) === html) return;
    markup.set(dist, html);
    const template = document.createElement("template");
    template.innerHTML = html;
    const currentRows = new Map([...dist.querySelectorAll(".dist-row")].map(row => [row.dataset.value, row]));
    const nextRows = [...template.content.querySelectorAll(".dist-row")];
    if (!currentRows.size || !nextRows.length) {
      dist.replaceChildren(template.content);
      return;
    }
    const currentHead = dist.firstElementChild;
    const nextHead = template.content.firstElementChild;
    if (!currentHead.isEqualNode(nextHead)) currentHead.replaceWith(nextHead);
    let previous = dist.firstElementChild;
    for (const next of nextRows) {
      const row = currentRows.get(next.dataset.value) || next;
      currentRows.delete(next.dataset.value);
      const cursor = previous.nextElementSibling;
      if (cursor !== row) {
        if (row.parentNode === dist && typeof dist.moveBefore === "function") dist.moveBefore(row, cursor);
        else dist.insertBefore(row, cursor);
      }
      previous = row;
      if (row === next || row.isEqualNode(next)) continue;
      for (const attr of next.attributes) row.setAttribute(attr.name, attr.value);
      for (const [index, cell] of [...row.children].entries()) {
        const nextCell = next.children[index];
        if (cell.isEqualNode(nextCell)) continue;
        if (!cell.classList.contains("c-plot")) { cell.replaceWith(nextCell.cloneNode(true)); continue; }
        const grid = cell.firstElementChild;
        if (!grid.isEqualNode(nextCell.firstElementChild)) grid.replaceWith(nextCell.firstElementChild.cloneNode(true));
        for (let i = 1; i < cell.children.length; i++) cell.children[i].style.cssText = nextCell.children[i].style.cssText;
      }
    }
    for (const row of currentRows.values()) row.remove();
    const legend = template.content.lastElementChild;
    if (!dist.lastElementChild.isEqualNode(legend)) dist.lastElementChild.replaceWith(legend);
  }

  function renderTop20(bossOptions, dungeon, currentBoss) {
    const job = snapshot.rows.find(row => row.job === selectedJob);
    const panel = $(".nm-top20");
    panel.style.setProperty("--tint", hue(job?.job));
    const records = snapshot.job === selectedJob ? snapshot.records.filter(Boolean) : [];
    const top = records[0];
    const visible = onlyBoss ? records.filter(record => record.boss === onlyBoss) : records;
    const bosses = bossOptions.filter(boss => boss.index > 0);
    const merged = snapshot.boss === 0 && bosses.length > 1;
    const period = source("period-filter").selectedOptions[0]?.textContent;
    const metric = snapshot.timeBased ? tr("duration") : snapshot.metric === "ndps" ? "nDPS" : "DPS";
    const counts = bosses.map(boss => ({ ...boss, count: records.filter(record => record.boss === boss.index).length }));
    const bossTag = (record, featured = false) => !merged || !record.bossName ? "" : `<span class="t20-boss${featured ? " lg" : ""}" style="--c:${bossColor(record.boss)}"><i></i>${esc(bosses.find(boss => boss.index === record.boss)?.name || record.bossName)}</span>`;
    const meta = (record, duration) => [esc(record.server), Number(record.cp) > 0
      ? `<span class="t20-cp" title="${esc(integer(record.cp))} CP">${cpIcon("CP")} ${esc(api.combatPower(record.cp))}</span>` : "",
      esc(duration)].filter(Boolean).join(" · ");
    const measure = record => snapshot.timeBased ? record.durationText : compact(record.value);
    const profileTitle = tr("characterProfile");
    const privateNames = globalThis.NotMeterPrivateName;
    const identity = (record, tag, className = "") => `<span class="t20-identity">
      <${tag} class="${className}">${record.nameHidden ? privateNames.create(record, locale).outerHTML : esc(record.name)}</${tag}>${!record.nameHidden && record.profileHref
        ? `<a class="t20-profile" href="${esc(record.profileHref)}" aria-label="${esc(record.name + " " + profileTitle)}">${esc(profileTitle)}</a>` : ""}</span>`;
    const openRecord = record => `<button class="t20-open" type="button" data-action="record" data-value="${record.rank}"
      aria-label="${esc((record.nameHidden ? privateNames.label(locale) : record.name) + " · " + label("전투 상세", "Combat details"))}"></button>`;
    const badge = rank => {
      const tier = rank <= 5 ? "gold" : rank <= 10 ? "sky" : "purple";
      const diamond = tier === "gold" && snapshot.period === "Weekly";
      const effect = "./assets/ranker-previews/effect-";
      return `<span class="rk rk-${tier}${diamond ? " rk-diamond" : ""}">
        ${job ? `<img class="rk-job" src="${esc(job.icon)}" alt="" width="24" height="24">` : ""}
        <picture class="rk-effect" aria-hidden="true">
          ${diamond ? `<source media="(prefers-reduced-motion: reduce)" srcset="${effect}diamond.png">` : ""}
          <img src="${effect}${diamond ? "diamond-animated" : tier}.png" alt="" width="144" height="144">
        </picture><span class="rk-n">${rank}</span></span>`;
    };
    const base = `<div class="t20-head">${job ? `<img src="${esc(job.icon)}" alt="">` : ""}<div>
      <span class="t20-eyebrow">${esc(period)} · ${esc(metric)} TOP 20</span><h3>${esc(job?.label || words()[10])}</h3></div></div>
      <div class="t20-ctx${merged ? " all" : ""}"><span class="t20-ctx-l">${esc(label("기준 보스", "Boss scope"))}</span>
        <b>${snapshot.boss ? `<i class="t20-bdot" style="background:${bossColor(snapshot.boss)}"></i>` : ""}${esc(merged
          ? (locale === "ko" ? "전체 보스 " + bosses.length + "개 통합" : label("전체 보스", "All bosses")) : currentBoss)}</b>
        <small>${[dungeon?.text, dungeon?.diff, merged && !snapshot.timeBased ? label("보스 구분 없이 DPS 순", "Ranked across bosses") : ""].filter(Boolean).map(esc).join(" · ")}</small>
        ${merged && top ? `<div class="t20-mix"><span class="t20-mixbar">${counts.filter(boss => boss.count).map(boss => `<i style="flex:${boss.count};background:${bossColor(boss.index)}"></i>`).join("")}</span>
          <div class="t20-mixleg">${counts.map(boss => button("only-boss", boss.index, "<i></i>" + esc(boss.name) + '<span class="mono">' + boss.count + '</span>',
            onlyBoss === boss.index, `style="--c:${bossColor(boss.index)}" ${boss.count ? "" : "disabled"}`)).join("")}</div></div>` : ""}
        ${snapshot.boss && bossOptions.some(boss => !boss.index) ? `<button class="t20-ctx-x" type="button" data-action="boss" data-value="0">${esc(label("전체 보스로", "Back to all bosses"))}</button>` : ""}</div>`;
    const changed = setMarkup(panel, base + (!top ? (job && snapshot.name !== "empty" && snapshot.name !== "error"
      ? `<div class="nm-message" role="status">${esc(tr("loading"))}</div>` : notice()) : `
      <div class="t20-hero">${openRecord(top)}<div>
        <span class="t20-k">${esc(label("1위", "Rank 1"))}</span>${identity(top, "span", "t20-name")}
        <span class="t20-meta">${meta(top, top.durationText)}</span>${bossTag(top, true)}</div>
        <span class="t20-big mono">${esc(snapshot.timeBased ? measure(top) : integer(top.value))}${snapshot.timeBased ? "" : "<small>" + esc(label("/초", "/s")) + "</small>"}</span></div>
      <ol class="t20-list">${(expanded ? visible : visible.slice(0, 10)).map(record => {
        const width = snapshot.timeBased ? top.duration / record.duration : record.value / top.value;
        return `<li><div class="t20-entry">${openRecord(record)}
          ${badge(record.rank)}<span class="t20-who">${identity(record, "b")}<small>${meta(record)}</small>${bossTag(record)}</span>
          <span class="t20-bar"><i style="width:${Math.max(0, Math.min(1, width || 0)) * 100}%"></i></span><span class="t20-dps mono">${esc(measure(record))}</span>
        </div></li>`;
      }).join("")}</ol><div class="t20-foot">${visible.length > 10
        ? `<button class="t20-more" type="button" data-action="expand" aria-expanded="${expanded}">${esc(expanded ? label("10위까지만 보기", "Show first 10") : (locale === "ko" ? "11 – " + visible.length + "위 보기" : locale === "zh-TW" ? "顯示第 11–" + visible.length + " 名" : "Show 11–" + visible.length))}</button>`
        : '<span class="t20-more-sp"></span>'}<span>${esc(label("이름을 누르면 전투 상세", "Select a name for combat details"))}</span></div>`));
    if (changed) api.projectRankingProfileLinks(host, panel);
  }

  function renderRanking() {
    const active = root.activeElement;
    const focus = active?.dataset.action ? [active.dataset.action, active.dataset.value] : null;
    const cpFocused = active?.classList.contains("cp-input");
    const dungeons = dungeonOptions();
    const dungeon = dungeons.find(item => item.active);
    const bossOptions = bosses();
    const currentBoss = bossOptions.find(item => item.active)?.name || tr("allBosses");
    const archive = $(".archive-dungeons");
    if (archive) archive.innerHTML = snapshot.service === "Global" ? "" : dungeons.filter(dungeon => !order.includes(dungeon.key))
      .map(dungeon => `<button type="button" class="archive-dungeon" data-action="dungeon" data-value="${esc(dungeon.key)}">${esc(dungeon.text)}</button>`).join(" · ");
    renderFilters(dungeons, bossOptions, dungeon);
    const globalScope = snapshot.service === "Global" ? snapshot.locale : "";
    const switchingBoss = snapshot.name === "loading" && globalScope !== "" && renderedGlobalScope === globalScope;
    const main = $(".nm-main"), status = $(".nm-boss-switch-status");
    if (main.classList.toggle("is-switching-boss", switchingBoss)) {
      status.hidden = false;
      status.textContent = tr("loading");
    } else if (!status.hidden) {
      status.hidden = true;
      status.textContent = "";
    }
    for (const panel of [$(".nm-card"), $(".nm-top20")]) {
      panel.inert = switchingBoss;
      panel.setAttribute("aria-busy", String(switchingBoss));
    }
    if (!switchingBoss) {
      renderDistribution(currentBoss);
      renderTop20(bossOptions, dungeon, currentBoss);
      renderedGlobalScope = snapshot.rows.length ? globalScope : "";
    }
    if (focus && !active.isConnected) {
      const [action, value] = focus;
      root.querySelectorAll("[data-action]").forEach(control => {
        if (control.dataset.action === action && control.dataset.value === value) control.focus({ preventScroll: true });
      });
    } else if (cpFocused && !active.isConnected) $(".cp-input").focus({ preventScroll: true });
  }

  async function selectCp(value) {
    if (cpPending || value == null || value === snapshot.cpValue) return;
    cpError = "";
    cpPending = true;
    renderRanking();
    try {
      await api.selectCp(value);
      if (snapshot.cpValue !== value) cpError = source("custom-cp-result").textContent || tr("cacheUnavailable");
    } finally {
      cpPending = false;
      if (!host.hidden) renderRanking();
    }
  }

  function selectCpBracket(k) {
    const options = cpBrackets();
    if (!options.length || !Number.isFinite(k)) return;
    const exact = options.find(option => k * 1000 >= option.minCombatPower && k * 1000 < option.maxCombatPowerExclusive);
    if (exact) void selectCp(exact.value);
    else if (k * 1000 < options[0].minCombatPower && snapshot.cpOptions.some(option => option.value === "preset:99")) void selectCp("preset:99");
    else {
      cpError = label("게시된 CP 구간이 없습니다", "This CP bracket is unavailable");
      renderRanking();
    }
  }

  function applyCpInput(input) {
    const raw = input.value.trim().replace(/[,\s]/g, "");
    if (!/^\d+(\.\d+)?[kKmM]?$/.test(raw)) return;
    input.value = "";
    const parsed = parseFloat(raw);
    const k = /m$/i.test(raw) ? parsed * 1000 : /k$/i.test(raw) || parsed <= 5000 ? parsed : parsed / 1000;
    selectCpBracket(k);
  }

  function globalGuideCopy() {
    const copy = globalThis.NotMeterGlobalCpNotice?.copy;
    return hasRankingScope() && rankingService() === "Global" && copy ? copy[locale] || copy.en : null;
  }

  const previewMotion = matchMedia("(prefers-reduced-motion: no-preference)");
  let rankerPreview, previewVisible = false;
  const previewObserver = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.target !== rankerPreview) continue;
      previewVisible = entry.isIntersecting;
      syncRankerPreview();
    }
  });
  function syncRankerPreview() {
    if (!rankerPreview) return;
    const animate = previewVisible && !document.hidden && previewMotion.matches &&
      ["class", "empty", "error"].includes(snapshot?.name);
    const next = animate ? rankerPreview.dataset.motion : rankerPreview.dataset.still;
    if (rankerPreview.getAttribute("src") !== next) rankerPreview.setAttribute("src", next);
  }
  previewMotion.addEventListener("change", syncRankerPreview);
  document.addEventListener("visibilitychange", syncRankerPreview);

  function renderHelp() {
    const global = globalGuideCopy();
    const faqKeys = ["Use", "Save", "Others", "Retention"];
    const domesticFaqs = faqKeys.map(key => [tr("rankerDungeonGuide" + key + "Title"), tr("rankerDungeonGuide" + key + "Body")]);
    domesticFaqs.push([tr("rankerPreviewCombinedTitle"), tr("rankerPreviewCombinedBody")],
      [label("CP가 올라 구간이 바뀌면?", "What if my CP bracket changes?"), label("현재 CP 구간에서 자격을 다시 판정합니다. 기록은 원래 구간에 남습니다.", "Eligibility is checked in your current CP bracket. Records stay in their original bracket.")]);
    const faqs = global ? [...global.faq, [global.effectTitle, global.effectUse], [global.dummyTitle, global.dummy]] : domesticFaqs;
    const tiers = [
      ["gold", "alltime-rank-1-5", "Alltime", label("움직이는 금색 다이아몬드", "Animated gold diamond"), label("닉네임 효과 자격 포함", "Includes nickname effect eligibility")],
      ["sky", "rank-6-10", "Ten", label("하늘색 테두리", "Sky-blue frame"), label("정지 테두리", "Static frame")],
      ["purple", "rank-11-20", "Twenty", label("보라색 테두리", "Purple frame"), label("정지 테두리", "Static frame")],
    ];
    const ranking = globalThis.NotMeterGlobalRanking;
    const guideDungeons = global ? ranking.catalog.dungeons.map(dungeon => ({
      name: ranking.label(dungeon.names),
      bosses: dungeon.bosses.map(boss => ranking.label(boss.names)).join(" · "),
      timeBased: dungeon.kind === "nightmare",
    })) : Array.from(document.querySelectorAll(".ranker-dungeon-item")).slice(0, 7).map(entry => ({
      name: entry.querySelector("strong")?.textContent.replace(/\s*[（(][^）)]+[）)]$/, ""),
      bosses: entry.querySelector("small")?.textContent || entry.querySelector("p")?.textContent,
      timeBased: entry.dataset.dungeonKey?.includes("nightmare"),
    }));
    const rules = global ? [
      ["150K–<1000K", ...global.items[0]],
      ["DPS", ...global.items[2]],
      ["TOP 20", ...global.items[3]],
      ["25K", ...global.items[5]],
    ] : [
      ["200K", tr("rankingEntrySpreadTitle"), tr("rankingEntrySpread")],
      [label("5인", "5 players"), label("처치 확인", "Confirmed kill"), tr("rankingEntryNote")],
      [":00 :30", label("집계 주기", "Aggregation schedule"), label("통계 집계는 매시 정각과 30분에 시작합니다.", "Aggregation starts on the hour and half hour.")],
      ["TOP 20", label("상세 보관", "Combat details"), label("상위 기록의 전투 상세를 확인할 수 있습니다.", "Combat details are available for published top records.")],
    ];
    $(".help").innerHTML = `<section class="nm-guide"><div class="g-top"><div class="g-intro">
      <span class="eyebrow">${esc(global ? label("글로벌", "Global") : label("랭커 마크 · 닉네임 효과", "Ranker marks · Nickname effects"))}</span>
      <h2>${global ? esc(global.guideTitle) : esc(label("주간 순위가", "Weekly ranks")) + "<br>" + esc(label("미터기 위에 표시됩니다", "appear in the meter"))}</h2>
      <p>${esc(global ? global.guideIntro : locale === "ko" ? "CP 800K 이상, 현재 25K 구간(2M 이상은 단일 구간)에서 주간 DPS·nDPS 중 더 높은 순위로 판정합니다. 전체 기간 순위는 혜택에 포함되지 않으며, 유효한 쿠폰 혜택은 별도로 유지됩니다." : tr("rankerDungeonGuideMarkerBody"))}</p></div><div class="g-tiers">
        ${tiers.map(([color, image, key, title, desc]) => `<div class="g-tier ${color}"><img src="./assets/ranker-previews/${image}.png" ${color === "gold"
          ? `data-still="./assets/ranker-previews/${image}.png" data-motion="./assets/ranker-previews/${image}.gif"` : ""} alt="" width="96" height="96" loading="lazy">
          <span class="g-k mono">${esc(tr("rankerPreview" + key + "Title"))}</span><b>${esc(title)}</b><small>${esc(desc)}</small></div>`).join("")}
      </div></div><div class="g-bottom"><div class="g-faq"><h4>${esc(global?.faqTitle || label("자주 묻는 질문", "Frequently asked questions"))}</h4>
        ${faqs.map(([q, a]) => `<div class="fq"><button type="button" data-action="faq" aria-expanded="false"><span>${esc(q)}</span><span class="el-plus sm"></span></button>
          <div class="fq-a"><div><p>${esc(a)}</p></div></div></div>`).join("")}
      </div><div class="g-dgs"><h4>${esc(global?.dungeons || tr("rankerDungeonGuideDungeonTitle"))}</h4><ul>${guideDungeons.map(entry => `<li>
        <b>${esc(entry.name)}</b><span>${esc(entry.bosses)}</span>
        ${entry.timeBased ? "<em>" + esc(label("빠른 전투 시간 순", "Shortest combat time")) + "</em>" : ""}</li>`).join("")}</ul>
        ${global ? "" : `<p class="g-ex">${esc(tr("rankerGuideFrozenExcluded"))} ${esc(tr("rankerDungeonGuideDummy"))}
          <span class="archive-dungeons"></span></p>`}</div></div></section>
      <section class="nm-elig"><button class="el-toggle" type="button" data-action="eligibility" aria-expanded="false">
        <span><b>${esc(label("내 기록이 보이지 않나요?", "Can't find your record?"))}</b><small>${esc(label("랭킹 집계 조건 4가지를 확인하세요", "Check the four ranking eligibility rules"))}</small></span><span class="el-plus"></span></button>
        <div class="el-body"><div><div class="el-grid">${rules.map(([number, title, text]) => `<div class="el-card"><span class="el-n mono">${esc(number)}</span><b>${esc(title)}</b><p>${esc(text)}</p></div>`).join("")}</div>
        <p class="el-foot">${esc(global ? global.items[7][1] : tr("rankingEntryRankerDisplay"))}</p></div></div></section>`;
    previewObserver.disconnect();
    previewVisible = false;
    rankerPreview = $(".g-tier.gold img");
    previewObserver.observe(rankerPreview);
  }

  function renderFooter() {
    const global = globalGuideCopy();
    const schedule = global && surface !== "ranking" ? globalThis.NotMeterWeeklyReset.schedule(locale) :
      source("weekly-reset")?.querySelector("[data-reset-schedule]").textContent || "";
    const cadence = global?.items[6][0] || label("매시 정각·30분 집계 시작", "Aggregation starts on the hour and half hour");
    $(".ft").innerHTML = `<div class="ft-top"><div class="ft-brand">${navigationSlot("footer-brand", brand)}
      <p>${esc(label("아이온2 딜미터기 · 던전 통계. 실시간 전투 정보와 DPS / nDPS 분석.", "AION 2 damage meter · Dungeon statistics and real-time DPS / nDPS analysis."))}</p>${download()}</div>
      ${menu.map((group, index) => `<div class="ft-col"><h5>${esc(menuGroup(group))}</h5>
        ${navigationSlot("footer-" + index, group[2].map(route => `<a href="${route.href}"${currentLink(route)}>${esc(navLabel(route))}</a>`).join(""))}</div>`).join("")}</div>
      <div class="ft-bot"><span>${esc(schedule)} ${standalone ? "" : " · " + esc(cadence)}</span>
        <span>${navigationSlot("legal", legalLinks().map(([href, text]) => `<a href="${esc(href)}">${esc(text)}</a>`).join(" · "))}
          <slot name="ad-consent"></slot></span></div>`;
  }

  const searchRegions = () => [...source("character-search-regions").querySelectorAll("[data-character-region]")].map(input => ({
    key: input.dataset.characterGlobalRegion || input.dataset.characterRegion,
    label: input.parentElement.querySelector("[data-region-name]").textContent,
    checked: input.checked, global: input.dataset.characterRegion === "ww",
  }));
  const searchScope = () => searchRegions().find(region => region.checked);
  function searchServers(key) {
    return globalThis.NotMeterFieldBossServer.servers(key, locale);
  }

  function filterSearchServers() {
    const query = $(".hs-sv-head input").value.trim().toLocaleLowerCase();
    const servers = [...root.querySelectorAll(".hs-sv-grid button")];
    for (const server of servers) {
      const names = server.dataset.serverAliases.split("|");
      server.hidden = ![server.textContent, ...names].some(name => name.toLocaleLowerCase().includes(query));
    }
    $(".hs-empty").hidden = servers.some(server => !server.hidden);
  }

  function renderScope() {
    const regions = searchRegions();
    const region = regions.find(item => item.checked);
    if (!region) return;
    const scope = $(".hs-scope");
    if (!scope.firstElementChild) scope.innerHTML = `<button class="hs-scope-btn" type="button" data-action="scope">
      <b></b><span class="hs-dot"></span><span class="hs-selected-server"></span><span class="caret"></span></button>
      <div class="hs-pop" hidden><div class="hs-pop-head"><span></span><div class="hd-region"></div></div>
      <div class="hd-region hs-global-worlds"></div>
      <button class="hs-all" type="button" data-action="search-server" data-value="">
        <span class="hs-all-ic"><i></i><i></i><i></i><i></i></span><span><b></b><small></small></span></button>
      <div class="hs-sv-head"><span></span><input type="search"></div>
      <div class="hs-sv-grid"></div><span class="hs-empty" hidden></span></div>`;
    const servers = searchServers(region.key);
    const all = label("전체 서버", "All servers");
    const serverName = servers.find(server => String(server.id) === searchServer)?.name || all;
    const toggle = $(".hs-scope-btn");
    toggle.classList.toggle("open", scopeOpen);
    toggle.setAttribute("aria-expanded", String(scopeOpen));
    toggle.setAttribute("aria-label", `${label("검색 범위", "Search scope")} · ${region.label} · ${serverName}`);
    toggle.querySelector("b").textContent = region.label;
    $(".hs-selected-server").textContent = serverName;
    const popup = $(".hs-pop");
    popup.hidden = !scopeOpen;
    if (!scopeOpen) return;
    const primary = regions.filter(item => !item.global).concat({ key: "global", label: label("글로벌", "Global") });
    const worlds = regions.filter(item => item.global);
    const primaryTabs = $(".hs-pop-head .hd-region");
    const worldTabs = $(".hs-global-worlds");
    $(".hs-pop-head > span").textContent = label("지역", "Region");
    setMarkup(primaryTabs, primary.map(item => button("search-region", item.key, esc(item.label))).join(""));
    setMarkup(worldTabs, worlds.map(item => button("search-world", item.key, esc(item.label))).join(""));
    worldTabs.hidden = !region.global;
    updateChoices(primaryTabs, [{ value: region.global ? "global" : region.key, active: true }], "search-region");
    updateChoices(worldTabs, [{ value: region.key, active: true }], "search-world");
    const allServers = $(".hs-all");
    allServers.querySelector("b").textContent = all;
    allServers.querySelector("small").textContent = region.label;
    $(".hs-sv-head > span").textContent = label("특정 서버", "Specific server");
    const query = $(".hs-sv-head input");
    query.placeholder = label("서버 찾기", "Find a server");
    query.setAttribute("aria-label", query.placeholder);
    $(".hs-empty").textContent = label("일치하는 서버 없음", "No matching servers");
    setMarkup($(".hs-sv-grid"), servers.map(server => button("search-server", server.id, esc(server.name), false,
      `data-server-aliases="${esc(server.aliases.filter(Boolean).join("|"))}"`)).join(""));
    updateChoices(popup, [{ value: searchServer, active: true }], "search-server");
    filterSearchServers();
  }

  function applySearchScope(region, server = "") {
    searchServer = server;
    globalThis.NotMeterCharacter.setHomepageScope(region.key, server);
    globalThis.NotMeterFieldBossServer.setScope(region.key, server);
    api.selectFieldBossScope(region.key, server);
    const service = region.global ? "Global" : "KR/TW";
    if (surface === "ranking" && service !== rankingService()) actions.region(service);
    renderScope();
  }

  function renderSearchSuggestions() {
    const query = $(".hs-input").value.trim();
    if (standalone) {
      $(".hs-drop").hidden = true;
      $(".hs-shortcut").hidden = Boolean(query);
      return;
    }
    const scope = searchScope();
    const where = [scope?.label, searchServers(scope?.key).find(server => String(server.id) === searchServer)?.name ||
      label("전체 서버", "All servers")].filter(Boolean).join(" · ");
    const matches = (text) => String(text || "").toLocaleLowerCase().includes(query.toLocaleLowerCase());
    const jobs = (surface === "ranking" ? snapshot?.rows || [] : []).filter(job => matches(job.label));
    const dungeons = (surface === "ranking" ? dungeonOptions() : []).filter(dungeon => matches(dungeon.text)).slice(0, 3);
    const views = routes.filter(route => matches(navLabel(route))).slice(0, 3);
    const section = (title, items) => items.length ? `<div class="pal-sec"><h4>${esc(title)}</h4>${items.join("")}</div>` : "";
    $(".hs-suggestions").innerHTML = !query ? "" :
      section(label("캐릭터", "Character"), [`<button class="pal-item on" type="submit"><span class="pal-av">${esc(query[0])}</span>
        ‘${esc(query)}’ ${esc(label("검색", "Search"))}<small>${esc(where)}</small><kbd class="hs-enter">Enter</kbd></button>`]) +
      section(tr("job"), jobs.map(job => `<button type="button" class="pal-item" data-action="job" data-value="${esc(job.job)}"><img src="${esc(job.icon)}" alt="">
        ${esc(job.label)}<small>${esc(words()[2])}</small></button>`)) +
      section(label("던전", "Dungeon"), dungeons.map(dungeon => `<button type="button" class="pal-item" data-action="dungeon" data-value="${esc(dungeon.key)}">
        <span class="pal-av sq"></span>${esc(dungeon.text)}<small>${esc(dungeon.diff)}</small></button>`)) +
      section(label("메뉴", "Menu"), views.map(route => navLink(route, "pal-item"))) +
      `<div class="pal-hint">${esc(label("검색 범위", "Search scope"))} <b>${esc(where)}</b></div>`;
    $(".hs-drop").hidden = scopeOpen || (!searchSuggestion && source("character-search-popover").hidden);
    $(".hs-input").setAttribute("aria-expanded", String(!$(".hs-drop").hidden));
    $(".hs-shortcut").hidden = searchSuggestion || Boolean(query);
  }

  function submitSearch(event) {
    event.preventDefault();
    const query = $(".hs-input").value.trim();
    if (!query) return;
    if (standalone) {
      location.assign("./#character-search=" + encodeURIComponent(query));
      return;
    }
    searchSuggestion = false;
    $(".hs-suggestions").replaceChildren();
    globalThis.NotMeterCharacter.homepageSearch(query);
  }

  function renderSurface(nextSurface, nextLocale = i18n.read()) {
    const active = nextSurface === "ranking";
    if (surface !== nextSurface || locale !== nextLocale) {
      if (!standalone || surface !== nextSurface) {
        menuOpen = false;
        langOpen = false;
      }
      scopeOpen = false;
      searchSuggestion = false;
      if (locale !== nextLocale) searchServer = "";
    }
    const scopeChanged = surface !== nextSurface || locale !== nextLocale;
    surface = nextSurface;
    locale = nextLocale;
    if (!standalone && scopeChanged) restoreFieldBossSearchScope();
    host.hidden = false;
    if (!host.dataset.surfaceReady) host.dataset.surfaceReady = "true";
    document.body.classList.add("notmeter-shared-shell");
    document.body.classList.toggle("notmeter-homepage", active);
    $(".nm-ranking").hidden = !active;
    const serviceSlot = $('slot[name="service"]');
    serviceSlot.hidden = active;
    if (!host.querySelector('[slot="service"]')) {
      const style = getComputedStyle(document.body);
      for (const prop of ["fontFamily", "fontSize", "lineHeight", "fontWeight", "color"]) serviceSlot.style[prop] = style[prop];
      const content = standalone ? [...document.querySelectorAll("[data-shell-content]")] : [document.querySelector(".app-shell")];
      for (const node of content) {
        node.slot = "service";
        host.append(node);
      }
      for (const [id, slot] of [["character-search-popover", "character-results"], ["legal-consent", "ad-consent"]]) {
        const node = source(id);
        if (!node) continue;
        node.slot = slot;
        host.append(node);
      }
    }
    const discord = !standalone && source("notmeter-discord");
    if (discord && !host.querySelector('[slot="ranking-discord"]')) {
      const banner = document.createElement("div");
      banner.className = "topbar grouped-topbar";
      banner.slot = "ranking-discord";
      banner.append(discord);
      host.append(banner);
    }
    const partyFinder = source("party-finder-guide");
    if (partyFinder && partyFinder.parentElement !== host) {
      partyFinder.slot = "party-finder";
      host.append(partyFinder);
    }
    if (partyFinder) partyFinder.hidden = !active || locale !== "ko";
    const sponsor = document.querySelector(".sponsor-mobile");
    if (active && sponsor?.parentElement !== host && sponsor) {
      sponsor.slot = "sponsor";
      host.append(sponsor);
    } else if (!active && sponsor?.parentElement === host) {
      sponsor.removeAttribute("slot");
      host.querySelector(".app-shell").insertBefore(sponsor, source("optimization-surface"));
    }
    const signature = [surface, locale, rankingService()].join("|");
    if (chromeSignature !== signature) {
      chromeSignature = signature;
      renderHeader();
      renderFooter();
    }
  }

  const clickLegacy = (id, key, value) => {
    [...source(id).querySelectorAll("button")].find(control => control.dataset[key] === value)?.click();
  };

  function openDownload() {
    const dialog = $(".dl-overlay");
    if (dialog.open) return;
    const link = source("meter-download-link");
    const npcap = source("npcap-download-link");
    const release = new URL(link.href);
    // A cached GitHub /latest redirect can point to an asset removed during a release.
    release.searchParams.set("t", String(Math.floor(Date.now() / 60000)));
    const steps = [
      [label("Npcap 설치", "Install Npcap"), tr("downloadStepNpcapDescription")],
      [label("압축 풀기", "Extract the ZIP"), tr("downloadStepMeterDescription")],
      ["NotMeter.exe", label("압축을 푼 폴더에서 NotMeter.exe를 실행하세요.", "Run NotMeter.exe from the extracted folder.")],
      [label("게임에서 전투", "Enter combat in game"), label("아이온2에서 전투를 시작하면 미터기가 전투 데이터를 표시합니다.", "NotMeter displays combat data when you enter combat in AION 2.")],
    ];
    dialog.innerHTML = `<div class="dl" aria-label="${esc(label("미터기 다운로드", "Download NotMeter"))}">
      <button class="x dl-x" type="button" data-action="close-download" aria-label="${esc(words()[13])}"></button>
      <header class="dl-hero"><img src="./assets/notmeter-icon.png" alt=""><div>
        <div class="dl-title">${esc(label("NotMeter 미터기", "NotMeter"))}<span class="dl-ver mono"><i></i>${esc(label("최신", "Latest"))}</span></div>
        <p>${esc(label("아이온2 실시간 딜미터기 · DPS / nDPS 분석 · 랭커 마크", "AION 2 live meter · DPS / nDPS analysis · Ranker marks"))}</p></div></header>
      <div class="dl-cta"><a class="dl-btn" href="${esc(release.href)}" download="${esc(link.download)}" autofocus>
        <span class="dl-arrow"></span><span><b>${esc(tr("downloadMeterButton"))}</b><small class="mono">${esc(link.download)}</small></span></a>
        <div class="dl-req"><span>Windows 10 · 11 (64-bit)</span><span>${esc(label("게임과 같은 PC", "Same PC as the game"))}</span><span>${esc(label("무료", "Free"))}</span></div>
        <div class="dl-pre"><span class="dl-pre-tag mono">${esc(label("필수", "Required"))}</span>
          <div><b>Npcap</b><small>${esc(label("전투 데이터 패킷 캡처 드라이버", "Packet capture driver for combat data"))}</small></div>
          <a class="dl-pre-btn" href="${esc(npcap.href)}" download="${esc(npcap.download)}">${esc(label("Npcap 받기", "Get Npcap"))}<i></i></a></div>
        <div class="dl-done" hidden aria-live="polite"><i></i>${esc(label("다운로드를 시작했습니다. 아래 순서대로 설치하세요.", "Download requested. Follow the steps below to install."))}</div>
      </div>
      <ol class="dl-steps">${steps.map(([title, text], index) => `<li><span class="dl-n mono">${index + 1}</span><div><b>${esc(title)}</b>
        ${index === 0 ? '<span class="dl-req-tag">' + esc(label("필수", "Required")) + '</span>' : ""}<small>${esc(text)}</small></div></li>`).join("")}</ol>
      <div class="dl-note"><span class="se3-bang">!</span><p><b>${esc(label("이전 버전을 쓰고 있나요?", "Using an older version?"))}</b>
        ${esc(label("미터기 설정 › 업데이트 확인에서 갱신할 수 있습니다.", "Check for updates in NotMeter settings."))}</p></div>
      <slot name="download-ad"></slot>
      <footer class="dl-foot"><button class="se3-link" type="button" data-action="copy-download">${esc(label("다운로드 링크 복사", "Copy download link"))}</button>
        ${navigationSlot("download-guide", `<a href="./tutorial.html">${esc(label("처음 사용자 가이드", "Getting started guide"))}</a>`)}</footer></div>`;
    if (globalThis.NotMeterExitLag?.makeCard) {
      host.querySelector('[slot="download-ad"]')?.remove();
      const card = globalThis.NotMeterExitLag.makeCard("exitlag-download-title");
      card.slot = "download-ad";
      host.append(card);
    }
    dialog.showModal();
    document.body.classList.add("download-open");
  }


  const actions = {
    home() {
      if (surface !== "ranking") {
        location.assign("./");
        return;
      }
      menuOpen = false;
      renderMenu();
      scrollTo(0, 0);
    },
    menu() { menuOpen = true; renderMenu(); $(".sheet .x").focus(); },
    "close-menu"() {
      menuOpen = false;
      renderMenu();
      (matchMedia("(max-width: 860px)").matches ? $(".hd-burger") : $(".nv-all")).focus();
    },
    languages() {
      langOpen = !langOpen;
      renderHeader();
      $(".hd-chip").focus();
    },
    language(value) {
      langOpen = false;
      menuOpen = false;
      searchServer = "";
      const select = languageControl();
      if (select.value === value) { renderHeader(); return; }
      select.value = value;
      select.dispatchEvent(new Event("change", { bubbles: true }));
    },
    region(value) {
      if (surface === "classTop10") {
        api.selectTop10Service(value);
        return;
      }
      if (surface === "classPerformance") {
        document.querySelector('[data-performance-service="' + value + '"]')?.click();
        renderSurface(surface, locale);
        return;
      }
      const current = searchScope();
      if (surface === "ranking" && current && current.global !== (value === "Global")) {
        const target = value === "Global" ? globalThis.NotMeterCharacter.homepageWorld() : locale === "zh-TW" ? "tw" : "kr";
        searchServer = "";
        globalThis.NotMeterCharacter.setHomepageScope(target, "");
        renderScope();
      }
      const buttons = source("ranking-service-switch").querySelectorAll("button");
      buttons[value === "Global" ? 1 : 0]?.click();
    },
    download() {
      if (standalone) { location.assign("./?download=1"); return; }
      menuOpen = false;
      renderMenu();
      openDownload();
    },
    "close-download"() { $(".dl-overlay").close(); },
    async "copy-download"(value, control) {
      const url = new URL("./?download=1", location.href);
      try { await navigator.clipboard.writeText(url.href); } catch { return; }
      control.textContent = label("링크 복사됨 ✓", "Link copied ✓");
    },
    scope() {
      scopeOpen = !scopeOpen;
      searchSuggestion = false;
      $(".hs").classList.remove("focus");
      source("character-search-popover").hidden = true;
      renderScope();
      if (scopeOpen) {
        $(".hs-sv-head input").value = "";
        filterSearchServers();
      }
      renderSearchSuggestions();
    },
    "search-region"(value) {
      const regions = searchRegions();
      const region = value === "global"
        ? regions.find(item => item.global && item.checked) ||
          regions.find(item => item.key === globalThis.NotMeterCharacter.homepageWorld()) ||
          regions.find(item => item.global)
        : regions.find(item => item.key === value);
      if (region) actions["search-world"](region.key);
    },
    "search-world"(value) {
      const region = searchRegions().find(item => item.key === value);
      if (!region) return;
      $(".hs-sv-head input").value = "";
      applySearchScope(region);
    },
    "search-server"(value) {
      const region = searchScope();
      if (!region) return;
      scopeOpen = false;
      applySearchScope(region, value);
      $(".hs-input").focus();
    },
    dungeon(value, control) {
      clickLegacy("dungeon-filter-buttons", "dungeonKey", value);
      if (control.closest(".hs-drop, .g-ex")) {
        closeTransient();
        $(".nm-filters").scrollIntoView({ block: "center" });
      }
    },
    difficulty(value) { clickLegacy("dungeon-difficulty-buttons", "difficultyKey", value); },
    boss(value) { clickLegacy("boss-filter-buttons", "bossIndex", value); },
    period(value) { clickLegacy("period-filter-buttons", "rankingPeriod", value); },
    metric(value) { source("ranking-metric-" + value).click(); },
    view(value) { view = value; renderRanking(); },
    job(value) {
      if (selectedJob === value && snapshot.job === value) return;
      closeTransient();
      selectedJob = value;
      expanded = false;
      onlyBoss = 0;
      api.selectJob(value);
    },
    "cp-all"() { void selectCp(snapshot.cpOptions.find(option => !option.minCombatPower)?.value); },
    "cp-step"(value) {
      const current = snapshot.cpOptions.find(option => option.value === snapshot.cpValue)?.minCombatPower / 1000 || 800;
      const options = cpBrackets();
      const next = Math.min(options.at(-1).minCombatPower / 1000, current + Number(value));
      const hasUnder800 = snapshot.cpOptions.some(option => option.value === "preset:99");
      selectCpBracket(hasUnder800 ? next : Math.max(options[0].minCombatPower / 1000, next));
    },
    "only-boss"(value) { onlyBoss = onlyBoss === Number(value) ? 0 : Number(value); renderRanking(); },
    expand() { expanded = !expanded; renderRanking(); },
    record(value, control) { snapshot.records.find(record => record?.rank === Number(value))?.open(control); },
    retry() { source("retry-button").click(); },
    faq(value, control) {
      const open = !control.closest(".fq").classList.contains("open");
      for (const item of root.querySelectorAll(".fq")) {
        item.classList.toggle("open", open && item.contains(control));
        item.querySelector("button").setAttribute("aria-expanded", String(item.classList.contains("open")));
      }
    },
    eligibility(value, control) {
      control.setAttribute("aria-expanded", String(control.closest(".nm-elig").classList.toggle("open")));
    },
  };

  root.addEventListener("click", event => {
    const link = event.target.closest("a[href]");
    if (link && (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey)) return;
    if (link?.closest(".nm-navigation-links")) {
      const current = link.getAttribute("aria-current") === "page" || link.href === location.href;
      const home = link.classList.contains("nm-logo") && surface === "ranking";
      if ((!link.target || link.target === "_self") && (current || home)) {
        event.preventDefault();
        if (surface === "ranking") actions.home();
        else if (menuOpen) actions["close-menu"]();
        closeTransient();
      }
      return;
    }
    const control = event.target.closest("[data-action]");
    if (!control || !root.contains(control) || (control.classList.contains("sheet-ov") && event.target !== control)) return;
    event.preventDefault();
    actions[control.dataset.action]?.(control.dataset.value, control, event);
  });
  host.addEventListener("notmeter:download", openDownload);
  $(".dl-overlay").addEventListener("click", event => {
    if (event.target === event.currentTarget) event.currentTarget.close();
    if (event.target.closest(".dl-btn")) {
      $(".dl").classList.add("started");
      $(".dl-steps li").classList.add("now");
      $(".dl-done").hidden = false;
      $(".dl-btn b").textContent = label("다시 다운로드", "Download again");
    }
  });
  $(".dl-overlay").addEventListener("close", event => {
    if (event.currentTarget.open) return;
    host.querySelector('[slot="download-ad"]')?.remove();
    host.querySelector('[slot="navigation-download-guide"]')?.remove();
    document.body.classList.remove("download-open");
  });
  root.addEventListener("submit", event => { if (event.target === $(".hs")) submitSearch(event); });
  root.addEventListener("focusin", event => {
    if (event.target !== $(".hs-input")) return;
    $(".hs").classList.add("focus");
    if (standalone) return;
    searchSuggestion = true;
    scopeOpen = false;
    renderScope();
    if (!event.target.value) globalThis.NotMeterCharacter.homepageRecent();
    renderSearchSuggestions();
  });
  root.addEventListener("input", event => {
    if (event.target === $(".hs-input")) {
      searchSuggestion = true;
      if (!standalone) source("character-search-popover").hidden = true;
      renderSearchSuggestions();
    }
    if (event.target.matches(".hs-sv-head input")) filterSearchServers();
  });
  root.addEventListener("focusout", event => {
    if (event.target.matches(".cp-input") && event.target.isConnected) applyCpInput(event.target);
  });

  function closeTransient() {
    if (scopeOpen) { scopeOpen = false; renderScope(); }
    if (langOpen) { langOpen = false; renderHeader(); }
    searchSuggestion = false;
    $(".hs").classList.remove("focus");
    if (!standalone) source("character-search-popover").hidden = true;
    renderSearchSuggestions();
  }

  document.addEventListener("pointerdown", event => {
    if (host.hidden) return;
    const inside = event.composedPath();
    if ((langOpen && !inside.includes($(".hd-pop"))) ||
        ((scopeOpen || searchSuggestion || source("character-search-popover")?.hidden === false) && !inside.includes($(".hs")))) closeTransient();
  });
  document.addEventListener("keydown", event => {
    if (host.hidden || event.isComposing) return;
    if (event.key === "/" && standalone !== "tutorial" && !event.ctrlKey && !event.metaKey && !event.altKey && !(root.activeElement || document.activeElement)?.matches("input,textarea,select,[contenteditable]")) {
      event.preventDefault();
      $(".hs-input").focus();
    }
    if (event.key === "Escape" && !$(".dl-overlay").open) {
      if (menuOpen) actions["close-menu"]();
      closeTransient();
    }
    if (event.key === "Enter" && root.activeElement?.matches(".cp-input")) {
      event.preventDefault();
      applyCpInput(root.activeElement);
    }
  });

  new ResizeObserver(() => {
    const height = $(".hd").offsetHeight + "px";
    host.style.setProperty("--hd-h", height);
    if (standalone === "tutorial") document.body.style.setProperty("--nm-shell-height", height);
  }).observe($(".hd"));
  addEventListener("scroll", () => {
    const app = $(".nm-app");
    app.classList.toggle("scrolled", scrollY > (app.classList.contains("scrolled") ? 0 : 40));
  }, { passive: true });
  function restoreFieldBossSearchScope() {
    const saved = globalThis.NotMeterFieldBossServer?.scope();
    if (!saved) return;
    const server = saved.id ? String(saved.id) : "";
    if (searchScope()?.key === saved.key && searchServer === server) return;
    searchServer = server;
    globalThis.NotMeterCharacter.setHomepageScope(saved.key, server);
  }

  document.addEventListener("notmeter:field-boss-scope", () => {
    if (standalone) return;
    restoreFieldBossSearchScope();
    renderScope();
  });
  document.addEventListener("notmeter:surface", event => renderSurface(event.detail.surface, event.detail.locale));
  window.addEventListener("notmeter-performance-service-change", () => {
    if (surface === "classPerformance") renderSurface(surface, locale);
  });
  document.addEventListener("notmeter:ranking-render", event => {
    const previous = snapshot;
    snapshot = event.detail;
    locale = snapshot.locale;
    const next = [snapshot.service, snapshot.dungeon, snapshot.boss, snapshot.metric, snapshot.period, snapshot.cpValue].join("|");
    if (next !== selection) {
      expanded = false;
      onlyBoss = 0;
      cpError = "";
      selection = next;
    }
    if (snapshot.rows.length && !snapshot.rows.some(row => row.job === selectedJob)) selectedJob = snapshot.rows[0].job;
    renderSurface("ranking", snapshot.locale);
    if (!previous || previous.locale !== locale || previous.service !== snapshot.service) {
      renderCopy();
    }
    renderRanking();
    syncRankerPreview();
    renderStatus();
    if (snapshot.name === "summary" && selectedJob) {
      const current = snapshot;
      queueMicrotask(() => {
        if (current === snapshot && !host.hidden && snapshot.name === "summary") api.selectJob(selectedJob);
      });
    }
  });
  document.addEventListener("DOMContentLoaded", () => {
    if (standalone) {
      const language = languageControl();
      const sync = () => {
        chromeSignature = "";
        renderSurface(standalone, language.value || i18n.read());
      };
      sync();
      language.addEventListener("change", sync);
      const observer = new MutationObserver(sync);
      observer.observe(language, { childList: true, subtree: true });
      observer.observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
    } else {
      chromeSignature = "";
      renderSurface(api.surface(), i18n.normalize(document.documentElement.lang) || i18n.read());
      const popover = source("character-search-popover");
      new MutationObserver(() => {
        $(".hs-drop").hidden = scopeOpen || (popover.hidden && !searchSuggestion);
        $(".hs-input").setAttribute("aria-expanded", String(!$(".hs-drop").hidden));
      }).observe(popover, { attributes: true, attributeFilter: ["hidden"] });
      if (location.hash.startsWith("#character-search=")) {
        let query = "";
        try { query = decodeURIComponent(location.hash.slice("#character-search=".length)).trim().slice(0, 20); } catch {}
        history.replaceState(history.state, "", location.pathname + location.search);
        if (query) {
          $(".hs-input").value = query;
          globalThis.NotMeterCharacter.homepageSearch(query);
        }
      }
    }
    renderStatus();
    revealWhenStyled();
    setInterval(() => { if (!host.hidden && !document.hidden) renderStatus(); }, 1000);
  });
})();
