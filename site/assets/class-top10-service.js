(() => {
  "use strict";
  const keys = ["description", "score", "entry", "dedupe", "empty", "pending", "subtitle"];
  const translations = {
    ko: ["글로벌 지원 던전의 전체 기간 보스·클래스별 TOP 50 성적을 합산한 종합 TOP 10입니다. 전 지역·모든 CP를 통합합니다.", "보스별 1위 100점부터 50위 2점까지 2점 간격으로 환산해 합산합니다.", "종합 점수, 총합 DPS, 1위 횟수, TOP 50 진입 보스 수 순으로 클래스별 10명을 선정합니다.", "같은 서버·캐릭터·클래스는 보스마다 전체 기간 최고 DPS 기록 한 개만 반영합니다. 이번 주 순위와 닉네임 효과 조건은 별도입니다.", "종합 랭킹에 반영할 글로벌 TOP 50 기록이 아직 없습니다.", "글로벌 종합 랭킹을 준비 중입니다. 집계가 게시되면 자동으로 표시됩니다.", "Global · 전체 기간 · 지원 보스 TOP 50 성적 합산"],
    en: ["An overall class TOP 10 combining all-time boss and class TOP 50 results from supported Global dungeons, across all regions and CP levels.", "Each boss awards 100 points for 1st down to 2 points for 50th, decreasing by 2 points per rank. Points are added together.", "Each class TOP 10 is ordered by total points, total DPS, 1st-place finishes, then the number of bosses with a TOP 50 result.", "One all-time personal-best DPS record per server, character, class and boss. Weekly ranks and nickname-effect eligibility remain separate.", "No Global TOP 50 records are available for the overall ranking yet.", "Global overall rankings are being prepared. Results appear automatically once published.", "Global · All time · Combined results from supported boss TOP 50s"],
    "zh-TW": ["彙總 Global 支援副本中，各首領、各職業全期間 TOP 50 成績，選出職業綜合 TOP 10。合併所有地區與 CP。", "各首領第 1 名 100 分，每下降一名減 2 分，第 50 名 2 分，再合計總分。", "依總分、總 DPS、第 1 名次數、進入 TOP 50 的首領數，選出各職業前 10 名。", "同伺服器、角色、職業及首領只計入全期間最高 DPS 紀錄一次。本週排名與暱稱特效資格另行計算。", "尚無可計入綜合排名的 Global TOP 50 紀錄。", "Global 綜合排名準備中，統計公布後將自動顯示。", "Global · 全期間 · 支援首領 TOP 50 成績總和"],
    "ja-JP": ["Global対応ダンジョンの全期間ボス・クラス別TOP 50を合算した総合TOP 10です。全地域・全CPを対象にします。", "ボスごとに1位100点から50位2点まで、順位が1つ下がるごとに2点減らして合算します。", "合計点、合計DPS、1位回数、TOP 50入りしたボス数の順に、各クラスの上位10人を選びます。", "サーバー・キャラクター・クラス・ボスごとに全期間の自己最高DPSを1回だけ集計します。今週の順位とニックネーム効果の条件は別です。", "総合ランキングに反映できるGlobal TOP 50の記録がまだありません。", "Global総合ランキングを準備中です。集計が公開されると自動で表示されます。", "Global · 全期間 · 対応ボスTOP 50の成績を合算"],
    "de-DE": ["Die Klassen-Gesamt-TOP-10 kombiniert die Allzeit-TOP-50 je Boss und Klasse in unterstützten Global-Dungeons, über alle Regionen und CP-Werte hinweg.", "Pro Boss gibt es 100 Punkte für Platz 1 bis 2 Punkte für Platz 50, mit 2 Punkten weniger je Rang. Die Punkte werden addiert.", "Die Klassen-TOP-10 wird nach Gesamtpunkten, Gesamt-DPS, ersten Plätzen und der Anzahl der Bosse mit TOP-50-Ergebnis sortiert.", "Pro Server, Charakter, Klasse und Boss zählt nur der persönliche Allzeit-DPS-Bestwert. Wochenränge und Namenseffekt-Berechtigung bleiben getrennt.", "Noch keine Global-TOP-50-Ergebnisse für die Gesamtrangliste vorhanden.", "Die globale Gesamtrangliste wird vorbereitet und nach Veröffentlichung automatisch angezeigt.", "Global · Alle Zeiten · Kombinierte Ergebnisse der unterstützten Boss-TOP-50"],
    "fr-FR": ["Un TOP 10 général par classe combinant les TOP 50 historiques par boss et classe des donjons Global pris en charge, toutes régions et tous CP confondus.", "Chaque boss rapporte de 100 points pour la 1re place à 2 points pour la 50e, par paliers de 2 points. Ces points sont additionnés.", "Le TOP 10 de chaque classe est trié par points totaux, DPS total, nombre de premières places, puis nombre de boss avec un résultat TOP 50.", "Un seul meilleur DPS historique par serveur, personnage, classe et boss. Les rangs hebdomadaires et l’accès aux effets de pseudo restent distincts.", "Aucun résultat Global TOP 50 disponible pour le classement général.", "Le classement général Global est en préparation. Il apparaîtra automatiquement après publication.", "Global · Toutes périodes · Résultats cumulés des TOP 50 des boss pris en charge"],
    "es-ES": ["TOP 10 general por clase que combina los TOP 50 históricos por jefe y clase de las mazmorras Global compatibles, de todas las regiones y niveles de CP.", "Cada jefe otorga 100 puntos al 1.º y 2 puntos al 50.º, bajando 2 puntos por puesto. Los puntos se suman.", "El TOP 10 de cada clase se ordena por puntos totales, DPS total, primeros puestos y número de jefes con resultado TOP 50.", "Solo se cuenta el mejor DPS histórico por servidor, personaje, clase y jefe. Los puestos semanales y los requisitos de efectos de apodo son independientes.", "Aún no hay registros Global TOP 50 para la clasificación general.", "La clasificación general Global se está preparando. Aparecerá automáticamente al publicarse.", "Global · Histórico · Resultados combinados de los TOP 50 de jefes compatibles"],
    "pt-BR": ["TOP 10 geral por classe que combina os TOP 50 históricos por chefe e classe das masmorras Global compatíveis, de todas as regiões e níveis de CP.", "Cada chefe concede 100 pontos ao 1.º e 2 pontos ao 50.º, diminuindo 2 pontos por posição. Os pontos são somados.", "O TOP 10 de cada classe é ordenado por pontos totais, DPS total, primeiros lugares e quantidade de chefes com resultado TOP 50.", "Conta apenas o melhor DPS de todos os tempos por servidor, personagem, classe e chefe. As posições semanais e os requisitos de efeitos de apelido são separados.", "Ainda não há registros Global TOP 50 para o ranking geral.", "O ranking geral Global está sendo preparado. Ele aparecerá automaticamente após a publicação.", "Global · Todos os tempos · Resultados combinados dos TOP 50 dos chefes compatíveis"],
    "ru-RU": ["Общий ТОП-10 класса объединяет результаты ТОП-50 за всё время по боссу и классу в поддерживаемых подземельях Global. Учитываются все регионы и значения CP.", "За каждого босса начисляется от 100 очков за 1-е место до 2 очков за 50-е, с шагом 2 очка. Очки суммируются.", "ТОП-10 класса определяется по сумме очков, суммарному DPS, числу первых мест и числу боссов с результатом в ТОП-50.", "Для каждого сервера, персонажа, класса и босса учитывается один личный рекорд DPS за всё время. Недельные места и условия эффектов имени учитываются отдельно.", "Пока нет результатов Global ТОП-50 для общего рейтинга.", "Общий рейтинг Global готовится. Результаты появятся автоматически после публикации.", "Global · Всё время · Сумма результатов ТОП-50 поддерживаемых боссов"],
  };
  const copy = Object.fromEntries(Object.entries(translations).map(([locale, values]) =>
    [locale, Object.fromEntries(keys.map((key, index) => [key, values[index]]))]));
  const overrides = { classTop10Description: "description", classTop10ScoreText: "score",
    classTop10EntryText: "entry", classTop10DedupeText: "dedupe", classTop10Empty: "empty",
    classTop10Pending: "pending", classTop10PageSubtitle: "subtitle" };
  let locale = "", service = "";
  const defaultService = value => ["ko", "zh-TW"].includes(value) ? "KR/TW" : "Global";
  function sync(value) {
    if (locale !== value) {
      locale = value; service = defaultService(locale);
      try { const saved = localStorage.getItem(`notmeter-top10-service:${locale}`); if (["KR/TW", "Global"].includes(saved)) service = saved; } catch { }
    }
    const bar = document.getElementById("top10-service-switch");
    if (!bar) return;
    const regionCopy = globalThis.NotMeterGlobalRanking?.copy[locale] || globalThis.NotMeterGlobalRanking?.copy.en;
    document.getElementById("top10-service-title").textContent = regionCopy?.service || "Region";
    document.getElementById("top10-service-hint").textContent = regionCopy?.serviceHint || "";
    document.getElementById("class-top10-kicker").textContent = service === "Global" ? "GLOBAL · ALL TIME · TOP 50" : "KR / TW · ALL CONTENT";
    for (const button of bar.querySelectorAll("[data-top10-service]")) {
      const selected = button.dataset.top10Service === service;
      button.classList.toggle("is-active", selected);
      button.setAttribute("aria-pressed", String(selected));
      button.onclick = () => {
        service = button.dataset.top10Service;
        try { localStorage.setItem(`notmeter-top10-service:${locale}`, service); } catch { }
        sync(locale);
        window.dispatchEvent(new CustomEvent("notmeter-top10-service-change"));
      };
    }
  }
  function text(key, language) { return service === "Global" ? (copy[language] || copy.en)[overrides[key]] : undefined; }
  function snapshot(data) {
    const value = data?.classOverall;
    return value?.rankingBasis === "global_all_time_boss_top50_points_v1" &&
      value.topRankLimit === 50 && value.pointsPerRankStep === 2 && Array.isArray(value.jobs) &&
      value.jobs.every(job => Array.isArray(job.players) && job.players.length <= 10 &&
        job.players.every(player => Array.isArray(player.placements))) ? value : undefined;
  }
  function placementName(placement, language) {
    const dungeon = globalThis.NotMeterGlobalRankingCatalog?.dungeons.find(item => item.key === placement.dungeonKey);
    const boss = dungeon?.bosses.find(item => item.key === placement.bossKey);
    const name = names => names?.[language] || names?.en || "";
    return `${name(dungeon?.names)} · ${name(boss?.names)}`;
  }
  globalThis.NotMeterClassTop10 = { sync, text, snapshot, placementName, defaultService, copy, get service() { return service; } };
})();
