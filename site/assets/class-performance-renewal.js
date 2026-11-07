(() => {
  "use strict";
  const order = ["마도성","살성","호법성","궁성","검성","수호성","정령성","치유성","권성"];
  const hues = { "마도성":300,"살성":15,"호법성":70,"궁성":150,"검성":200,"수호성":240,"정령성":180,"치유성":95,"권성":30 };
  const labels = {
    ko:["랭킹 · 통계","직업 DPS 비교","CP 보정 · 중앙값 100 기준 직업 성능과 신뢰도","CP 보정 직업 점수","신뢰도 등급","상위 25%","초기화","제외된 직업 없음 · 전체 파티 집계","{count}개 직업 제외 · 해당 직업이 없는 파티만 집계","직업 {jobs}개 · 보스 {contents}개"],
    en:["Rankings · Statistics","Class DPS comparison","CP-adjusted class performance and reliability, with a median baseline of 100","CP-adjusted class scores","Confidence grades","Top 25%","Reset","No excluded classes · all parties","{count} excluded classes · parties without those classes","{jobs} classes · {contents} bosses"],
    "zh-TW":["排名 · 統計","職業 DPS 比較","CP 校正 · 以中位數 100 比較職業表現與樣本穩定性","CP 校正職業分數","樣本穩定性等級","前 25%","重設","未排除職業 · 全部隊伍","排除 {count} 個職業 · 僅統計不含這些職業的隊伍","{jobs} 個職業 · {contents} 個首領"],
    "ja-JP":["ランキング · 統計","クラスDPS比較","CP補正 · 中央値100を基準にクラス性能と標本の安定性を比較","CP補正クラススコア","信頼度グレード","上位25%","リセット","除外なし · 全パーティ","{count}クラス除外 · 該当クラスのいないパーティのみ","{jobs}クラス · {contents}ボス"],
    "de-DE":["Ranglisten · Statistik","Klassen-DPS im Vergleich","CP-bereinigte Klassenleistung und Stichprobenstabilität mit Median 100","CP-bereinigte Klassenwerte","Stabilitätsstufen","Obere 25%","Zurücksetzen","Keine Klassen ausgeschlossen · alle Gruppen","{count} Klassen ausgeschlossen · Gruppen ohne diese Klassen","{jobs} Klassen · {contents} Bosse"],
    "fr-FR":["Classements · Statistiques","Comparaison des DPS par classe","Performances et stabilité des échantillons corrigées des CP, médiane à 100","Scores corrigés des CP","Niveaux de fiabilité","Top 25%","Réinitialiser","Aucune classe exclue · tous les groupes","{count} classes exclues · groupes sans ces classes","{jobs} classes · {contents} boss"],
    "es-ES":["Clasificaciones · Estadísticas","Comparación de DPS por clase","Rendimiento y estabilidad de muestras ajustados por CP, con mediana 100","Puntuación ajustada por CP","Grados de fiabilidad","25% superior","Restablecer","Sin clases excluidas · todos los grupos","{count} clases excluidas · grupos sin esas clases","{jobs} clases · {contents} jefes"],
    "pt-BR":["Rankings · Estatísticas","Comparação de DPS por classe","Desempenho e estabilidade da amostra ajustados por CP, com mediana 100","Pontuação ajustada por CP","Graus de confiabilidade","Top 25%","Redefinir","Nenhuma classe excluída · todos os grupos","{count} classes excluídas · grupos sem essas classes","{jobs} classes · {contents} chefes"],
    "ru-RU":["Рейтинги · Статистика","Сравнение DPS классов","Показатели классов с поправкой на CP и устойчивость выборки, медиана 100","Оценки с поправкой на CP","Уровни надёжности","Лучшие 25%","Сбросить","Без исключений · все группы","Исключено классов: {count} · группы без них","Классов: {jobs} · боссов: {contents}"],
    vi:["Xếp hạng · Thống kê","So sánh DPS theo lớp","Hiệu suất và độ ổn định mẫu đã điều chỉnh CP, lấy trung vị 100","Điểm lớp đã điều chỉnh CP","Mức độ tin cậy","Top 25%","Đặt lại","Không loại trừ · tất cả nhóm","Loại {count} lớp · nhóm không có các lớp đó","{jobs} lớp · {contents} boss"],
  };
  const scopeLabels = {
    ko: ["한국 · 대만", "글로벌", "집계 범위", "집계 서비스", "집계 CP 기준", "최소 CP", "한국·대만은 같은 주간 캐시를 사용하고, 글로벌은 별도 표본입니다.", "글로벌은 CP 150K+ 단일 기준으로만 집계합니다.", "최소 CP만 지정하며 상한은 없습니다.", "단일 기준", "현재 CP {cp}K 이상 전체 표본 · 파티 CP 차이 ≤100K · 기여 >10%"],
    en: ["Korea · Taiwan", "Global", "Sample scope", "Sample region", "CP threshold", "Minimum CP", "Korea and Taiwan share the weekly cache. Global uses a separate sample.", "Global uses a single threshold of CP 150K+.", "Only minimum CP is applied. There is no upper limit.", "Fixed threshold", "All samples at CP {cp}K+ · party CP gap ≤100K · contribution >10%"],
    "zh-TW": ["韓國 · 台灣", "全球", "統計範圍", "統計服務區", "統計 CP 門檻", "最低 CP", "韓國和台灣共用每週快取，全球使用獨立樣本。", "全球僅使用 CP 150K+ 的單一門檻。", "只設最低 CP，沒有上限。", "固定門檻", "目前 CP {cp}K 以上的所有樣本 · 隊伍 CP 差距 ≤100K · 貢獻 >10%"],
    "ja-JP": ["韓国 · 台湾", "グローバル", "集計範囲", "集計地域", "集計CP基準", "最低CP", "韓国と台湾は週次キャッシュを共有し、グローバルは別の標本を使用します。", "グローバルはCP 150K+の固定基準で集計します。", "最低CPのみを指定し、上限はありません。", "固定基準", "CP {cp}K以上の全標本 · パーティー内CP差 ≤100K · 貢献度 >10%"],
    "th-TH": ["เกาหลี · ไต้หวัน", "โกลบอล", "ขอบเขตการนับ", "ภูมิภาค", "เกณฑ์ CP", "CP ขั้นต่ำ", "เกาหลีและไต้หวันใช้แคชรายสัปดาห์ร่วมกัน ส่วนโกลบอลใช้กลุ่มตัวอย่างแยก", "โกลบอลใช้เกณฑ์ CP 150K+ เพียงเกณฑ์เดียว", "กำหนดเฉพาะ CP ขั้นต่ำ โดยไม่มีขีดจำกัดสูงสุด", "เกณฑ์คงที่", "ตัวอย่างทั้งหมดที่ CP {cp}K+ · ส่วนต่าง CP ในปาร์ตี้ ≤100K · สัดส่วนความเสียหาย >10%"],
    "de-DE": ["Korea · Taiwan", "Global", "Stichprobenbereich", "Region", "CP-Schwelle", "Mindest-CP", "Korea und Taiwan teilen sich den Wochencache. Global nutzt eine eigene Stichprobe.", "Global nutzt nur die feste Schwelle von CP 150K+.", "Es gilt nur der CP-Mindestwert. Es gibt keine Obergrenze.", "Feste Schwelle", "Alle Stichproben ab CP {cp}K · CP-Abstand der Gruppe ≤100K · Schadensanteil >10%"],
    "fr-FR": ["Corée · Taïwan", "Global", "Périmètre", "Région", "Seuil de CP", "CP min.", "La Corée et Taïwan partagent le cache hebdomadaire. Global utilise un échantillon distinct.", "Global utilise le seuil fixe de CP 150K+.", "Seul le minimum de CP s’applique. Il n’y a pas de plafond.", "Seuil fixe", "Tous les échantillons à CP {cp}K+ · écart de CP du groupe ≤100K · contribution >10%"],
    "es-ES": ["Corea · Taiwán", "Global", "Ámbito", "Región", "Umbral de CP", "CP mín.", "Corea y Taiwán comparten la caché semanal. Global usa una muestra aparte.", "Global usa un único umbral de CP 150K+.", "Solo se aplica el CP mínimo. No hay límite superior.", "Umbral fijo", "Todas las muestras con CP {cp}K+ · diferencia de CP del grupo ≤100K · contribución >10%"],
    "pt-BR": ["Coreia · Taiwan", "Global", "Escopo", "Região", "Limite de CP", "CP mín.", "Coreia e Taiwan compartilham o cache semanal. Global usa uma amostra separada.", "Global usa apenas o limite fixo de CP 150K+.", "Só se aplica o CP mínimo. Não há limite máximo.", "Limite fixo", "Todas as amostras com CP {cp}K+ · diferença de CP do grupo ≤100K · contribuição >10%"],
    "ru-RU": ["Корея · Тайвань", "Глобальный", "Область выборки", "Регион", "Порог CP", "Мин. CP", "Корея и Тайвань используют общий недельный кэш. У глобального региона своя выборка.", "Для глобального региона действует единый порог CP 150K+.", "Действует только минимум CP. Верхнего предела нет.", "Единый порог", "Все образцы с CP {cp}K+ · разброс CP в группе ≤100K · вклад >10%"],
    vi: ["Hàn Quốc · Đài Loan", "Toàn cầu", "Phạm vi", "Khu vực", "Ngưỡng CP", "CP tối thiểu", "Hàn Quốc và Đài Loan dùng chung bộ nhớ đệm tuần. Toàn cầu dùng mẫu riêng.", "Toàn cầu chỉ dùng ngưỡng CP 150K+.", "Chỉ áp dụng CP tối thiểu, không có giới hạn trên.", "Ngưỡng cố định", "Mọi mẫu từ CP {cp}K+ · chênh lệch CP nhóm ≤100K · đóng góp >10%"],
  };
  let root, legacy, model, chipsSignature = "", headerLocale = "", headerRegion = "KR";
  const element = (tag, cls, value) => {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (value != null) node.textContent = value;
    return node;
  };
  const query = selector => root.querySelector(selector);
  function position(value, minimum, maximum) { return Math.max(0,Math.min(100,(Number(value)-minimum)/(maximum-minimum)*100)); }
  function range(rows, metric) {
    const values = rows.flatMap(row => [row[metric],row.confidenceLow,row.confidenceHigh]).map(Number).filter(n=>Number.isFinite(n)&&n>0);
    const minimum = Math.floor(Math.min(70,...values)/10)*10, maximum = Math.ceil(Math.max(120,...values)/10)*10;
    const step = Math.max(10,Math.ceil((maximum-minimum)/60)*10), ticks=[];
    for(let n=minimum;n<=maximum;n+=step) ticks.push(n);
    if(ticks.at(-1)!==maximum) ticks.push(maximum);
    return {minimum,maximum,ticks};
  }

  function createRow(jobName) {
    const row = element("article", "perf-row entering");
    row.dataset.jobName = jobName;
    row.style.setProperty("--tint", `oklch(.74 .12 ${hues[jobName] || 30})`);
    const identity = element("span", "c-cls");
    const icon = element("img");
    icon.src = `./assets/jobs/${encodeURIComponent(jobName)}.png`;
    icon.alt = "";
    identity.append(icon, element("b"), element("em", "grade"));
    const plot = element("span", "pr-plot");
    plot.append(element("i", "base"), element("i", "bar"), element("i", "ci"));
    const score = element("span", "pr-score");
    score.append(element("b", "mono"), element("small", "mono"));
    row.append(element("span", "mono pr-rank"), identity, plot, score, element("span", "pr-meta mono"));
    return row;
  }

  function renderChart(ranked, metric, contents, t) {
    const scale = range(ranked.map(item => item.row), metric);
    const x = value => position(value, scale.minimum, scale.maximum);
    const axis = query(".pa-track");
    const axisKey = `${scale.minimum}:${scale.maximum}`;
    if (axis.dataset.range !== axisKey) {
      axis.dataset.range = axisKey;
      axis.replaceChildren(...scale.ticks.map(value => {
        const tick = element("span", "mono", value);
        tick.style.left = x(value) + "%";
        return tick;
      }));
    }

    const list = query(".perf-rows");
    const rows = new Map(Array.from(list.children, node => [node.dataset.jobName, node]));
    const jobs = new Set(model.rows.map(({ row }) => row.jobName));
    for (const [jobName, node] of rows) if (!jobs.has(jobName)) node.remove();
    const legacyRows = legacy.querySelectorAll(".class-performance-row");
    const baseline = x(100);
    let cursor = list.firstElementChild;
    model.rows.forEach(({ row, rank, insufficient }, index) => {
      const node = rows.get(row.jobName) || createRow(row.jobName);
      // Move retained rows only when ranks change. Their bars keep their previous geometry.
      if (rows.has(row.jobName)) node.classList.remove("entering");
      if (node !== cursor) {
        if (node.parentNode === list && typeof list.moveBefore === "function") list.moveBefore(node, cursor);
        else list.insertBefore(node, cursor);
      }
      cursor = node.nextElementSibling;
      node.classList.toggle("ex", insufficient);
      const score = Number(row[metric]) || 0;
      const low = Number(row.confidenceLow), high = Number(row.confidenceHigh);
      node.dataset.score = String(score);
      node.title = legacyRows[index]?.textContent || "";
      node.querySelector(".pr-rank").textContent = insufficient ? "—" : rank;
      node.querySelector(".c-cls b").textContent = model.jobName(row.jobName);
      const grade = node.querySelector(".grade");
      grade.className = `grade g-${insufficient ? "off" : row.confidenceGrade}`;
      grade.textContent = insufficient ? "—" : row.confidenceGrade;
      grade.title = t("classPerformanceConfidenceNote");

      const bar = node.querySelector(".bar"), ci = node.querySelector(".ci");
      const scorePosition = x(score);
      node.querySelector(".base").style.left = baseline + "%";
      bar.style.left = Math.min(scorePosition, baseline) + "%";
      bar.style.width = Math.abs(scorePosition - baseline) + "%";
      bar.hidden = insufficient;
      ci.style.left = x(low) + "%";
      ci.style.width = Math.max(0, x(high) - x(low)) + "%";
      ci.title = `P75: ${low.toFixed(1)}–${high.toFixed(1)}`;
      ci.hidden = insufficient || !Number.isFinite(low) || !Number.isFinite(high);

      node.querySelector(".pr-score b").textContent = insufficient ? "—" : score.toFixed(1);
      const delta = node.querySelector(".pr-score small");
      delta.hidden = insufficient;
      delta.className = `mono ${score >= 100 ? "up" : "dn"}`;
      delta.textContent = `${score >= 100 ? "+" : ""}${(score - 100).toFixed(1)}%`;
      node.querySelector(".pr-meta").textContent = `${row.contentCoverage}/${contents} · ${low.toFixed(1)}–${high.toFixed(1)}`;
    });
  }
  function action(selector) { legacy.querySelector(selector)?.click(); }
  const serviceSegments = '<button type="button" data-service="KR/TW"></button><button type="button" data-service="Global"></button>';
  const cpSegments = [800, 900, 1000].map(cp => `<button type="button" data-cp="${cp * 1000}">${cp}K+</button>`).join("");
  function setScopeOpen(open, restoreFocus = false) {
    const button = query('[data-action="scope"]');
    query(".scope-menu").hidden = !open;
    button.setAttribute("aria-expanded", String(open));
    if (restoreFocus) button.focus();
  }
  function renderScope(locale, service, cp, week) {
    const [domestic, global, scope, region, threshold, minimum, regionHelp, fixedHelp, minimumHelp, fixed, status] =
      scopeLabels[locale] || scopeLabels.en;
    const isGlobal = service === "Global";
    const serviceName = isGlobal ? global : domestic;
    query(".scope-label").textContent = `${serviceName} · ${week} · CP ${cp}K+`;
    query(".scope-menu").setAttribute("aria-label", scope);
    const fields = { scope, region, threshold, minimum, regionHelp, fixedHelp: isGlobal ? fixedHelp : "", minimumHelp, fixed };
    root.querySelectorAll("[data-scope-copy]").forEach(node => {
      node.textContent = fields[node.dataset.scopeCopy];
    });
    root.querySelectorAll("[data-service], [data-cp]").forEach(button => {
      const selected = button.dataset.service ? button.dataset.service === service : Number(button.dataset.cp) === cp * 1000;
      if (button.dataset.service) {
        button.textContent = button.dataset.service === "Global" ? global : locale === "ko" ? "한국·대만" : domestic;
      }
      button.classList.toggle("on", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
    root.querySelectorAll(".cp-scopes").forEach(group => { group.hidden = isGlobal; });
    query(".scope-strip-fixed").hidden = !isGlobal;
    query('[data-scope-copy="fixedHelp"]').hidden = !isGlobal;
    query(".scope-strip-status span").textContent = status.replace("{cp}", cp);
  }
  function setSearchOpen(open) {
    document.body.classList.toggle("performance-search-open",open);
    query('[data-action="search-scope"]').setAttribute("aria-expanded",String(open));
  }
  function header() {
    const n=element("header","hd");
    n.innerHTML=`<div class="hd-row1"><div class="hd-in"><a class="nm-logo" href="./"><img src="./assets/notmeter-icon.png" alt=""><span>NotMeter</span></a><form class="hs" role="search"><button type="button" class="hs-scope-btn" data-action="search-scope"><b>한국</b><span class="hs-dot"></span><span class="all-servers">전체 서버</span><span class="caret"></span></button><span class="glass"></span><input type="search" maxlength="20" placeholder="캐릭터 이름 검색" aria-label="캐릭터 이름 검색"><kbd>/</kbd></form><span class="hd-sp"></span><span class="hd-clock mono"><i class="nv-live"></i><time></time><small>KST</small></span><div class="hd-region"><button type="button" data-header-region="KR">한국</button><button type="button" data-header-region="TW">대만</button><button type="button" data-header-region="GL">글로벌</button></div><div class="hd-pop"><span class="globe"></span><select aria-label="Language"></select><span class="caret"></span></div><button type="button" class="nv-all" data-action="menu"><span class="nv-grid"><i></i><i></i><i></i><i></i></span><span class="all-menu-label">전체 메뉴</span></button><button type="button" class="hd-dl" data-action="download">미터기 다운로드</button><button type="button" class="hd-burger" data-action="menu" aria-label="전체 메뉴"><i></i><i></i><i></i></button></div></div><div class="hd-row2"><nav class="hd-in" aria-label="주 메뉴"></nav></div><div class="header-region-menu" hidden><button type="button" data-header-region="KR">한국 · 전체 서버</button><button type="button" data-header-region="TW">대만 · 전체 서버</button><button type="button" data-header-region="GL">글로벌 · 전체 서버</button></div><div class="all-menu-sheet" hidden></div>`;
    n.querySelector("form").addEventListener("submit",event=>{
      event.preventDefault();const input=document.getElementById("character-search-input");input.value=n.querySelector("input").value;
      input.dispatchEvent(new Event("input",{bubbles:true}));setSearchOpen(true);
      document.getElementById("character-search-form").requestSubmit();
    });
    n.querySelector(".header-region-menu").remove();
    const language=element("button","language-trigger");language.type="button";language.dataset.action="language";language.setAttribute("aria-expanded","false");
    language.append(element("span","language-label"),n.querySelector(".hd-pop > .caret"));n.querySelector("select").replaceWith(language);
    const menu=element("div","language-menu");menu.hidden=true;n.querySelector(".hd-pop").append(menu);
    return n;
  }
  function syncHeader(locale) {
    const ko=locale==="ko";
    if(headerLocale!==locale) {
      headerLocale=locale;
      const groups=[['랭킹 · 통계',[['ranking','던전 랭킹','bars'],['class-top10','직업 종합 TOP 10','stack'],['class-performance','직업 DPS 비교','dot-line'],['boss-resistance','보스 저항','shield']]],['빌드 · 도구',[['setup-guide','세팅 가이드','grid'],['stat-efficiency','스탯 효율 계산기','plus'],['pet-tracker','펫 트래커','paw']]],['실시간',[['field-boss','필드보스','diamond'],['artifact','아티팩트','square']]],['커뮤니티',[['meter-sharing','미터 공유','pair']]]];
      const ids={'class-top10':'class-top10-button','class-performance':'class-performance-button','boss-resistance':'boss-resistance-button','setup-guide':'contribution-button','stat-efficiency':'stat-efficiency-button','pet-tracker':'pet-tracker-button','field-boss':'field-boss-button','artifact':'artifact-button','meter-sharing':'optimization-button'};
      const nav=query(".hd-row2 nav");nav.replaceChildren();
      groups.forEach(([group,items],index)=>{
        const section=element("div","nv-group"),title=element("div","nv-glabel",ko?group:(index===2?model.t("navigationCommunity"):model.t(["navigationRankings","navigationBuilds","navigationCommunity","navigationCommunity"][index])));const links=element("div","nv-items");
        items.forEach(([id,name,glyph])=>{const link=element("a",`nv${id==="class-performance"?" on":""}`);link.href=id==="pet-tracker"?"./pet-tracker.html":`./?view=${id}`;
          const icon=element("span",`nv-ic nv-${glyph}`);icon.setAttribute("aria-hidden","true");icon.append(element("i"),element("i"),element("i"));
          const text=ko?name:id==="class-performance"?(labels[locale]||labels.en)[1]:document.getElementById(ids[id])?.textContent.replace(/NEW/g,"").trim()||model.t("backToRanking");
          if(glyph==="grid")icon.append(element("i"));
          if(id==="class-performance")link.setAttribute("aria-current","page");
          link.append(icon,document.createTextNode(text));if(["field-boss","artifact"].includes(id))link.append(element("i","nv-live"));links.append(link);
        });section.append(title,links);nav.append(section);
      });
      query(".all-menu-sheet").replaceChildren(...Array.from(nav.children).map(n=>n.cloneNode(true)));
      for(const original of document.querySelectorAll('.topbar .service-links a')) {
        const target=new URL(original.href);
        if([...root.querySelectorAll('.all-menu-sheet a')].some(a=>{const existing=new URL(a.href);return existing.pathname===target.pathname&&existing.searchParams.get("view")===target.searchParams.get("view");}))continue;
        const link=element("a","nv",original.querySelector(".service-link-label")?.textContent||original.textContent.trim());link.href=original.getAttribute("href");
        if(original.target){link.target=original.target;link.rel=original.rel;}
        query(".all-menu-sheet .nv-group:last-child .nv-items").append(link);
      }
      const original=document.getElementById("language-button");query(".language-menu").replaceChildren(...Array.from(original.options).map(option=>{const button=element("button",option.value===locale?"on":"",option.textContent);button.type="button";button.dataset.locale=option.value;button.setAttribute("aria-pressed",String(option.value===locale));return button;}));query(".language-label").textContent=original.selectedOptions[0]?.textContent;
      query(".hs input").placeholder=ko?"캐릭터 이름 검색":document.getElementById("character-search-input").placeholder;
      query(".hs input").setAttribute("aria-label",query(".hs input").placeholder);
      for(const [region,selector] of [["KR",'[data-character-region="kr"]'],["TW",'[data-character-region="tw"]'],["GL",'#character-global-region-label']])query(`.hd-region [data-header-region="${region}"]`).textContent=region==="GL"?document.querySelector(selector).textContent:document.querySelector(selector).closest("label").querySelector("[data-region-name]").textContent;
      query(".all-servers").textContent=ko?"전체 서버":"All servers";query(".all-menu-label").textContent=ko?"전체 메뉴":"All menus";query(".hd-dl").textContent=ko?"미터기 다운로드":"Download NotMeter";
    }
    const active=model.service==="Global"?"GL":headerRegion==="TW"?"TW":"KR";
    headerRegion=active;root.querySelectorAll('[data-header-region]').forEach(n=>n.classList.toggle("on",n.dataset.headerRegion===active));
    const selected=document.querySelector('#character-search-regions input:checked');
    query(".hs-scope-btn b").textContent=selected?.closest("label")?.querySelector("[data-region-name]")?.textContent||"KR";
    query(".all-servers").textContent=document.getElementById("character-global-server-value")?.textContent||(ko?"전체 서버":"All servers");
    query(".hd-clock time").textContent=new Date().toLocaleTimeString("ko-KR",{hour12:false,timeZone:"Asia/Seoul"});
  }
  function fonts() {
    if(!document.body.classList.contains("class-performance-view")) return;
    for(const [id,href] of [["performance-renewal-sans","https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"],["performance-renewal-mono","https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap"]]) {
      if(document.getElementById(id)) continue;
      const link=element("link"); link.id=id; link.rel="stylesheet"; link.href=href; document.head.append(link);
    }
  }
  function mount() {
    const surface=document.getElementById("class-performance-surface");
    if(!surface||surface.querySelector("notmeter-performance")) return;
    legacy=element("div"); legacy.dataset.performanceLegacy="";
    legacy.append(...surface.childNodes);
    const host=element("notmeter-performance"); root=host.attachShadow({mode:"open"});
    root.innerHTML=`<link rel="stylesheet" href="./assets/class-performance-renewal.css?v=20261104-performance-rails"><div class="nm-wrap"><section class="pg"><div class="pg-l"><div class="crumb"><button type="button" data-action="back"></button><i></i><span data-copy="title"></span></div><h1 data-copy="title"></h1><p data-copy="description"></p></div><div class="pg-r">
  <button type="button" class="tag-mono" data-action="scope" aria-haspopup="true" aria-expanded="false" aria-controls="perf-scope-menu"><span class="scope-label"></span><i class="scope-caret" aria-hidden="true"></i></button>
  <div class="scope-menu" id="perf-scope-menu" role="group" hidden>
    <div class="scope-menu-group">
      <b id="perf-scope-region" data-scope-copy="region"></b>
      <div class="seg" role="group" aria-labelledby="perf-scope-region">${serviceSegments}</div>
      <p data-scope-copy="regionHelp"></p>
    </div>
    <div class="scope-menu-group">
      <b id="perf-scope-threshold" data-scope-copy="threshold"></b>
      <div class="seg cp-scopes" role="group" aria-labelledby="perf-scope-threshold">${cpSegments}</div>
      <p data-scope-copy="fixedHelp" hidden></p>
      <p data-scope-copy="minimumHelp"></p>
    </div>
  </div>
</div></section><aside class="warning" hidden></aside>
<div class="scope-strip">
  <div class="scope-strip-controls">
    <div class="scope-strip-group">
      <span id="perf-strip-scope" data-scope-copy="scope"></span>
      <div class="seg" role="group" aria-labelledby="perf-strip-scope">${serviceSegments}</div>
    </div>
    <div class="scope-strip-group">
      <span id="perf-strip-minimum" data-scope-copy="minimum"></span>
      <div class="seg cp-scopes" role="group" aria-labelledby="perf-strip-minimum">${cpSegments}</div>
      <span class="scope-strip-fixed mono" hidden>150K+ <small data-scope-copy="fixed"></small></span>
    </div>
  </div>
  <span class="scope-strip-status" role="status"><i aria-hidden="true"></i><span></span></span>
</div>
<div class="steps"></div><div class="perf-wrap"><section class="nm-card perf"><div class="nm-card-head"><h2 data-copy="score"></h2><span class="sub"></span><span class="sp"></span><div class="seg"><button type="button" data-metric="p50Score">P50</button><button type="button" data-metric="p75Score">P75<small></small></button><button type="button" data-metric="p90Score">P90</button></div></div><div class="perf-axis"><span></span><span class="pa-track"></span><span></span></div><div class="perf-rows"></div><div class="empty" role="status"></div><p class="foot-note in"></p></section><aside class="perf-side"><section class="side-card exclusions"><h4></h4><p></p><div class="ex-grid"></div><div class="ex-status"><span></span><button type="button" data-action="reset"></button></div></section><section class="side-card confidence"><h4></h4><div class="grades"></div><p class="tiny"></p></section></aside></div><details class="method-details"><summary></summary><div></div></details></div>`;
    const ownHeader = !document.getElementById("homepage-redesign");
    if (ownHeader) root.prepend(element("div","nm-ambient"),header());
    root.addEventListener("click",event=>{
      const button=event.target.closest("button"); if(!button) return;
      if(button.dataset.action==="back") action("#class-performance-back-button");
      if(button.dataset.action==="download") document.getElementById("download-button").click();
      if(button.dataset.action==="menu") {const menu=query(".all-menu-sheet");menu.hidden=!menu.hidden;button.setAttribute("aria-expanded",String(!menu.hidden));}
      if(button.dataset.action==="language") {const menu=query(".language-menu");menu.hidden=!menu.hidden;button.setAttribute("aria-expanded",String(!menu.hidden));}
      if(button.dataset.locale) {const original=document.getElementById("language-button");original.value=button.dataset.locale;original.dispatchEvent(new Event("change",{bubbles:true}));query(".language-menu").hidden=true;query('[data-action="language"]').setAttribute("aria-expanded","false");}
      if(button.dataset.action==="search-scope") setSearchOpen(!document.body.classList.contains("performance-search-open"));
      if(button.dataset.headerRegion) {headerRegion=button.dataset.headerRegion;action(`[data-performance-service="${headerRegion==="GL"?"Global":"KR/TW"}"]`);syncHeader(model.locale);}
      if(button.dataset.action==="scope") setScopeOpen(query(".scope-menu").hidden);
      if(button.dataset.action==="reset") action("#class-performance-composition-reset");
      if(button.dataset.metric) action(`[data-performance-metric="${button.dataset.metric}"]`);
      if(button.dataset.service || button.dataset.cp) {
        if (button.closest(".scope-menu")) setScopeOpen(false, true);
        if (button.dataset.service) action(`[data-performance-service="${button.dataset.service}"]`);
        else action(`[data-performance-minimum-cp="${button.dataset.cp}"]`);
      }
      if(button.dataset.job) action(`[data-composition-job="${button.dataset.job}"]`);
    });
    document.addEventListener("mousedown", event => {
      if (!query(".scope-menu").hidden && !event.composedPath().includes(query(".pg-r"))) setScopeOpen(false);
    });
    document.addEventListener("keydown",event=>{if(event.key==="Escape"){if(!query(".scope-menu").hidden)setScopeOpen(false,true);if(ownHeader){setSearchOpen(false);query(".all-menu-sheet").hidden=true;query(".language-menu").hidden=true;}root.querySelectorAll('[aria-expanded="true"]').forEach(n=>n.setAttribute("aria-expanded","false"));}});
    if (ownHeader) document.addEventListener("click",event=>{if(!event.composedPath().some(n=>n===host||n.id==="global-character-search"))setSearchOpen(false);});
    if (ownHeader) document.getElementById("character-search-regions").addEventListener("change",()=>syncHeader(model.locale));
    if (ownHeader) document.getElementById("character-search-input").addEventListener("input",event=>{query(".hs input").value=event.target.value;});
    if (ownHeader) new MutationObserver(()=>{if(model)syncHeader(model.locale);}).observe(document.getElementById("character-global-server-value"),{childList:true,characterData:true,subtree:true});
    surface.append(host,legacy);
    setInterval(()=>{if(document.body.classList.contains("class-performance-view")&&query(".hd-clock time"))query(".hd-clock time").textContent=new Date().toLocaleTimeString("ko-KR",{hour12:false,timeZone:"Asia/Seoul"});},1000);
  }
  function render(next) {
    if(!root) mount(); if(!root) return;
    const previous = model;
    model=next;
    const {t,locale,jobs,metric,exclusionMask}=model;
    const localeChanged = previous?.locale !== locale;
    const scopeChanged = localeChanged || previous?.service !== model.service || previous?.minimumCombatPower !== model.minimumCombatPower;
    const copy=labels[locale]||labels.en, ko=locale==="ko";
    fonts();
    if (query(".hd")) syncHeader(locale);
    query('.crumb button').textContent=copy[0];
    root.querySelectorAll('[data-copy="title"]').forEach(n=>n.textContent=copy[1]);
    query('[data-copy="description"]').textContent=copy[2]; query('[data-copy="score"]').textContent=copy[3];
    const cp=model.minimumCombatPower/1000;
    if (scopeChanged) renderScope(locale, model.service, cp, t("thisWeek"));
    const steps=ko?[["검증된 처치 기록만",`CP ${cp}K 이상 던전 처치 기록. 상한 없음. 훈련용 허수아비 제외.`],["파티 표본 필터","파티원과 CP가 모두 확인되어야 하며 파티 CP 차이 100K 이하, 캐릭터 피해 기여 10% 초과."],["대표 기록 1개","보스별 상위 3개 기록 중 두 번째 DPS를 사용. 같은 전투 재전송은 중복 집계하지 않음."],["같은 조건끼리 비교","같은 보스, 10K CP 구간에서 비교하고 직업 간 중앙값을 100으로 맞춰 CP 차이를 줄입니다."]]:[[t("classPerformanceCpTitle"),legacy.querySelector("#class-performance-cp-text").textContent],[t("classPerformancePartyTitle"),t("classPerformancePartyText")],[t("classPerformanceDedupeTitle"),t("classPerformanceDedupeText")],[t("classPerformanceTrustTitle"),t("classPerformanceTrustText")]];
    if(scopeChanged) query(".steps").replaceChildren(...steps.map(([title,body],i)=>{const n=element("article","step");n.append(element("span","step-n mono",String(i+1).padStart(2,"0")),element("b","",title),element("p","",body));return n;}));
    const ranked=model.rows.filter(item=>!item.insufficient), selected=model.selectedSnapshot;
    const period=model.periodLabel||t("thisWeek");
    const summary=copy[9].replace("{jobs}",String(ranked.length)).replace("{contents}",String(selected?.totalContentCount||0));
    const serviceName=(scopeLabels[locale]||scopeLabels.en)[model.service==="Global"?1:0];
    query(".sub").textContent=`${serviceName} · CP ${cp}K+ · ${period} · ${summary}`;
    query(".sub").title=legacy.querySelector("#class-performance-summary").textContent;
    root.querySelectorAll('[data-metric]').forEach(n=>{const active=n.dataset.metric===metric;n.classList.toggle("on",active);n.setAttribute("aria-pressed",String(active));n.title=t(`classPerformance${n.textContent.slice(0,3)}Text`);});
    query('[data-metric="p75Score"] small').textContent=copy[5];
    renderChart(ranked, metric, selected?.totalContentCount || 0, t);
    query(".empty").hidden=model.available&&model.rows.length>0;
    query(".empty").textContent=t(!model.available?"classPerformancePending":"classPerformanceEmpty");
    query(".perf-axis").hidden=!query(".empty").hidden;
    query(".foot-note.in").textContent=ko?"점수 = 직업 백분위 DPS ÷ 같은 조건 직업 중앙값 × 100. 105는 비슷한 조건의 중앙값보다 약 5% 높다는 뜻이며 장비·파티·플레이 실력이 여전히 영향을 줍니다.":`${t("classPerformanceFormulaExpression")}. ${t("classPerformanceFormulaText")}`;
    query(".exclusions h4").textContent=t("classPerformanceCompositionTitle");query(".exclusions > p").textContent=ko?"선택한 직업이 하나도 없는 파티만으로 다시 계산합니다.":t("classPerformanceCompositionText");
    const signature=locale+jobs.join("|");
    if(chipsSignature!==signature){chipsSignature=signature;query(".ex-grid").replaceChildren(...order.filter(job=>jobs.includes(job)).map(job=>{const b=element("button","ex-chip"),img=element("img");b.type="button";b.dataset.job=String(jobs.indexOf(job));img.src=`./assets/jobs/${encodeURIComponent(job)}.png`;img.alt="";b.append(img,document.createTextNode(model.jobName(job)),element("span","chk"));return b;}));}
    root.querySelectorAll('[data-job]').forEach(n=>{const active=(exclusionMask&(1<<Number(n.dataset.job)))!==0;n.classList.toggle("on",active);n.setAttribute("aria-pressed",String(active));n.setAttribute("aria-label",t("classPerformanceCompositionExcludeJob",{job:model.jobName(jobs[Number(n.dataset.job)])}));});
    const count=jobs.filter((_,i)=>(exclusionMask&(1<<i))!==0).length;
    query(".ex-status span").textContent=count?copy[8].replace("{count}",String(count)):copy[7];query('[data-action="reset"]').hidden=count===0;query('[data-action="reset"]').textContent=copy[6];query(".ex-status").title=legacy.querySelector("#class-performance-composition-status").textContent;
    query(".confidence h4").textContent=copy[4];
    const descriptions=ko?["고유 캐릭터 250+ · 커버리지 75%+ · 보스 6+ · 변동 ±4%","100+ · 50%+ · 4+ · ±7%","40+ · 3+ · ±12%","조건 미달 · 순위에서 제외"]:[t("classPerformanceGradeAText"),t("classPerformanceGradeBText"),t("classPerformanceGradeCText"),t("classPerformanceGradeOffText")];
    if(localeChanged) query(".grades").replaceChildren(...["A","B","C","—"].map((g,i)=>{const n=element("div","gr");n.append(element("em",`grade g-${g==="—"?"off":g}`,g),element("span","",descriptions[i]));return n;}));
    query(".tiny").textContent=ko?"A/B/C는 정확도가 아니라 표본 안정성입니다. 비교 셀마다 전체 30개, 직업당 5개, 비교 가능한 직업 4개 이상이 필요하며 보스별 가중치는 동일합니다.":t("classPerformanceConfidenceNote");
    query(".tiny").title=t("classPerformanceConfidenceNote");
    query(".method-details summary").textContent=t("classPerformanceNoticeTitle");
    if(scopeChanged) query(".method-details > div").replaceChildren(...[legacy.querySelector("#class-performance-notice-text").textContent,t("classPerformanceConfidenceNote"),t("classPerformanceCellGateText"),t("classPerformanceCombineText")].map(s=>element("p","",s)));
    const warning=legacy.querySelector("#class-performance-progression-warning");query(".warning").hidden=warning.hidden;query(".warning").textContent=warning.textContent.trim();
  }
  globalThis.NotMeterClassPerformanceRenewal=Object.freeze({render,range,position});
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",mount,{once:true}); else mount();
})();
