(() => {
  "use strict";
  const catalog = globalThis.NotMeterGlobalRankingCatalog;
  const worlds = globalThis.NotMeterGlobalFieldBossCatalog.serviceRegions;
  const fields = ["title", "intro", "weekly", "all", "dungeon", "boss", "job", "character", "duration", "date", "empty", "loading", "error", "refresh", "rules", "expedition", "raid", "stage4", "updated", "reset", "service"];
  const translations = {
    ko: ["글로벌 클래스 TOP 50", "전 지역 통합 · 캐릭터별 최고 DPS", "이번 주", "전체기간", "던전", "보스", "클래스", "캐릭터", "전투 시간", "처치 시각", "아직 등록된 기록이 없습니다.", "랭킹을 불러오는 중입니다.", "랭킹을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.", "새로고침", "던전·보스·클래스별 TOP 50만 보관합니다. CP 구간은 나누지 않으며, 파티원 간 CP 차이가 200K 이상인 기록은 제외합니다. CP 미확인 파티원은 차이 계산에서 제외됩니다. 캐릭터명은 공개되며 미터기에는 순위가 표시되지 않습니다.", "원정", "성역", "초월 · 4단계", "갱신", "매주 수요일 05:00 (한국시간) 초기화", "랭킹 서비스"],
    en: ["Global Class TOP 50", "All regions · Personal-best DPS", "This week", "All time", "Dungeon", "Boss", "Class", "Character", "Duration", "Kill time", "No records yet.", "Loading rankings…", "Couldn't load the rankings. Please try again shortly.", "Refresh", "Only the top 50 per dungeon, boss and class are retained. There are no CP brackets. Runs with a party CP gap of 200K or more are excluded; players with unknown CP are left out of this check. Character names are public. Rankings are shown on the website only.", "Expedition", "Sanctuary", "Transcendence · Stage 4", "Updated", "Resets Wednesday at 05:00 KST (UTC+9)", "Ranking service"],
    "zh-TW": ["全球服職業 TOP 50", "全區合併 · 角色最高 DPS", "本週", "全期間", "副本", "首領", "職業", "角色", "戰鬥時間", "擊殺時間", "目前尚無紀錄。", "正在載入排行榜…", "無法載入排行榜，請稍後再試。", "重新整理", "各副本、首領及職業僅保留前 50 名，不區分 CP 級距。隊員 CP 差距達 200K 以上的紀錄不列入；CP 未知的隊員不參與差距計算。角色名稱一律公開，排名僅顯示於網站。", "遠征", "聖域", "超越 · 第 4 階段", "更新", "每週三韓國時間 05:00（UTC+9）重置", "排行榜服務地區"],
    "ja-JP": ["グローバル クラス別 TOP 50", "全地域共通 · キャラクター別の最高DPS", "今週", "全期間", "ダンジョン", "ボス", "クラス", "キャラクター", "戦闘時間", "討伐日時", "まだ記録がありません。", "ランキングを読み込み中…", "ランキングを読み込めませんでした。しばらくしてから再度お試しください。", "更新", "ダンジョン・ボス・クラスごとに上位50名の記録のみを保存します。CP帯の区分はありません。パーティー内のCP差が200K以上の記録は対象外です。CP不明のメンバーは差の計算から除外します。キャラクター名は公開され、順位はウェブサイトにのみ表示されます。", "遠征", "聖域", "超越 · 段階4", "更新日時", "毎週水曜05:00（韓国時間／UTC+9）にリセット", "ランキングのサービス地域"],
    "de-DE": ["Globale Klassen-TOP-50", "Alle Regionen · Persönlicher DPS-Bestwert", "Diese Woche", "Gesamtzeit", "Dungeon", "Boss", "Klasse", "Charakter", "Kampfdauer", "Besiegt am", "Noch keine Einträge vorhanden.", "Rangliste wird geladen…", "Die Rangliste konnte nicht geladen werden. Bitte versuche es später erneut.", "Aktualisieren", "Pro Dungeon, Boss und Klasse werden nur die besten 50 gespeichert, ohne CP-Gruppen. Kämpfe mit einer CP-Differenz von mindestens 200K innerhalb der Gruppe zählen nicht. Spieler mit unbekannten CP werden bei dieser Prüfung ausgelassen. Charakternamen sind öffentlich; Platzierungen erscheinen nur auf der Website.", "Expedition", "Heiligtum", "Transzendenz · Stufe 4", "Aktualisiert", "Zurücksetzung: Mittwoch, 05:00 KST (UTC+9)", "Ranglistenregion"],
    "fr-FR": ["TOP 50 mondial par classe", "Toutes les régions · Meilleur DPS personnel", "Cette semaine", "Depuis toujours", "Donjon", "Boss", "Classe", "Personnage", "Durée", "Date du combat", "Aucun résultat pour le moment.", "Chargement du classement…", "Impossible de charger le classement. Veuillez réessayer dans un instant.", "Actualiser", "Seuls les 50 meilleurs résultats par donjon, boss et classe sont conservés, sans tranches de CP. Les combats avec un écart de CP d’au moins 200K dans le groupe sont exclus. Les joueurs dont les CP sont inconnus ne sont pas pris en compte pour ce contrôle. Les noms sont publics ; les rangs s’affichent uniquement sur le site.", "Expédition", "Sanctuaire", "Transcendance · Palier 4", "Mis à jour", "Réinitialisation le mercredi à 05:00 KST (UTC+9)", "Région du classement"],
    "es-ES": ["TOP 50 global por clase", "Todas las regiones · Mejor DPS personal", "Esta semana", "Histórico", "Mazmorra", "Jefe", "Clase", "Personaje", "Duración", "Fecha del combate", "Aún no hay registros.", "Cargando clasificación…", "No se ha podido cargar la clasificación. Vuelve a intentarlo en unos instantes.", "Actualizar", "Solo se conservan los 50 mejores por mazmorra, jefe y clase, sin intervalos de CP. Se excluyen los combates con una diferencia de CP de 200K o más en el grupo. Los jugadores con CP desconocidos no se incluyen en esta comprobación. Los nombres son públicos y los puestos solo se muestran en la web.", "Expedición", "Santuario", "Trascendencia · Nivel 4", "Actualizado", "Se reinicia los miércoles a las 05:00 KST (UTC+9)", "Región de clasificación"],
    "pt-BR": ["TOP 50 global por classe", "Todas as regiões · Melhor DPS pessoal", "Esta semana", "Todo o período", "Masmorra", "Chefe", "Classe", "Personagem", "Duração", "Data do combate", "Ainda não há registros.", "Carregando classificação…", "Não foi possível carregar a classificação. Tente novamente em instantes.", "Atualizar", "Apenas os 50 melhores por masmorra, chefe e classe são mantidos, sem faixas de CP. Combates com uma diferença de CP de 200K ou mais no grupo são excluídos. Jogadores com CP desconhecido não entram nessa verificação. Os nomes são públicos, e as posições aparecem apenas no site.", "Expedição", "Santuário", "Transcendência · Etapa 4", "Atualizado", "Reinicia às quartas-feiras, às 05:00 KST (UTC+9)", "Região da classificação"],
    "ru-RU": ["Глобальный ТОП-50 по классам", "Все регионы · Личный рекорд DPS", "Эта неделя", "Всё время", "Подземелье", "Босс", "Класс", "Персонаж", "Длительность", "Время победы", "Записей пока нет.", "Загрузка рейтинга…", "Не удалось загрузить рейтинг. Повторите попытку чуть позже.", "Обновить", "Хранятся только 50 лучших результатов для каждого подземелья, босса и класса, без разделения по CP. Бои с разницей CP в группе от 200K не учитываются. Игроки с неизвестным CP исключаются из этой проверки. Имена персонажей открыты, а места в рейтинге отображаются только на сайте.", "Экспедиция", "Святилище", "Превосхождение · Этап 4", "Обновлено", "Сброс по средам в 05:00 KST (UTC+9)", "Регион рейтинга"],
  };
  const copy = Object.fromEntries(Object.entries(translations).map(([locale, values]) => [locale, Object.fromEntries(fields.map((key, i) => [key, values[i]]))]));
  const averages = { ko: "TOP 50 평균 DPS", en: "TOP 50 average DPS", "zh-TW": "TOP 50 平均 DPS", "ja-JP": "TOP 50 平均DPS", "de-DE": "TOP 50 · Ø DPS", "fr-FR": "DPS moyen du TOP 50", "es-ES": "DPS medio del TOP 50", "pt-BR": "DPS médio do TOP 50", "ru-RU": "Средний DPS ТОП-50" };
  const averageNotes = { ko: "평균은 보관된 클래스별 TOP 50 기록으로 계산하며, 50명 미만이면 실제 등록 인원을 기준으로 합니다.", en: "Averages use the retained top 50 per class, or all ranked characters when fewer than 50 are available.", "zh-TW": "平均值以各職業保留的前 50 名計算；不足 50 名時，以實際上榜人數計算。", "ja-JP": "平均はクラス別上位50名の記録から算出します。50名未満の場合は実際の登録人数で計算します。", "de-DE": "Der Durchschnitt basiert auf den gespeicherten Top 50 der Klasse. Bei weniger als 50 Einträgen zählen alle platzierten Charaktere.", "fr-FR": "La moyenne porte sur le top 50 conservé par classe, ou sur tous les personnages classés s’ils sont moins de 50.", "es-ES": "La media se calcula con los 50 mejores de cada clase, o con todos los personajes clasificados si hay menos de 50.", "pt-BR": "A média considera os 50 melhores de cada classe, ou todos os personagens classificados quando houver menos de 50.", "ru-RU": "Среднее рассчитывается по сохранённым 50 лучшим персонажам класса. Если их меньше 50, учитываются все участники рейтинга." };
  for (const locale of Object.keys(copy)) { copy[locale].average = averages[locale]; copy[locale].averageNote = averageNotes[locale]; }
  const pendingMessages = {
    ko: "글로벌 랭킹을 준비 중입니다. 첫 집계가 완료되면 자동으로 표시됩니다.",
    en: "Global rankings are being prepared. Results will appear automatically once the first update is ready.",
    "zh-TW": "全球服排行榜準備中，首次統計完成後將自動顯示。",
    "ja-JP": "グローバルランキングを準備中です。初回の集計が完了すると自動で表示されます。",
    "de-DE": "Die globale Rangliste wird vorbereitet. Die Ergebnisse erscheinen automatisch, sobald die erste Auswertung abgeschlossen ist.",
    "fr-FR": "Le classement mondial est en cours de préparation. Les résultats s’afficheront automatiquement dès la fin du premier calcul.",
    "es-ES": "La clasificación global se está preparando. Los resultados aparecerán automáticamente cuando termine el primer cálculo.",
    "pt-BR": "A classificação global está sendo preparada. Os resultados aparecerão automaticamente assim que o primeiro cálculo for concluído.",
    "ru-RU": "Глобальный рейтинг готовится. Результаты появятся автоматически после первого подсчёта."
  };
  for (const locale of Object.keys(copy)) copy[locale].pending = pendingMessages[locale];
  const serviceCopy = {
    ko: ["랭킹 지역", "확인할 서버를 선택하세요"],
    en: ["Ranking region", "Choose the servers to view"],
    "zh-TW": ["排行榜地區", "選擇要查看的伺服器"],
    "ja-JP": ["ランキング地域", "表示するサーバーを選択"],
    "de-DE": ["Ranglistenregion", "Wähle die gewünschten Server"],
    "fr-FR": ["Région du classement", "Choisissez les serveurs à afficher"],
    "es-ES": ["Región de clasificación", "Elige los servidores que quieres ver"],
    "pt-BR": ["Região da classificação", "Escolha os servidores que deseja ver"],
    "ru-RU": ["Регион рейтинга", "Выберите серверы для просмотра"]
  };
  for (const [locale, [title, hint]] of Object.entries(serviceCopy)) {
    copy[locale].service = title; copy[locale].serviceHint = hint;
  }
  const state = { locale: "", service: "", surface: "ranking", data: null, error: false, pending: false, loading: false, lastAttempt: 0 };
  const t = key => (copy[state.locale] || copy.en)[key];
  const label = names => names[state.locale] || names.en;
  const defaultService = locale => ["ko", "zh-TW"].includes(locale) ? "KR/TW" : "Global";
  const active = () => state.service === "Global" && state.surface === "ranking";
  const notify = () => window.dispatchEvent(new CustomEvent("notmeter-global-ranking-change"));
  function readService(locale) {
    const query = new URLSearchParams(location.search).get("rankingRegion");
    if (["Global", "KR/TW"].includes(query)) return query;
    try { const value = localStorage.getItem(`notmeter-ranking-service:${locale}`); if (["Global", "KR/TW"].includes(value)) return value; } catch { }
    return defaultService(locale);
  }
  function characterLink(row) {
    const params = new URLSearchParams({ view: "character", region: "ww", globalRegion: row.globalRegion || worlds.find(w => w.servers.some(s => s.id === row.serverId))?.key || "",
      serverId: String(row.serverId), name: row.name });
    if (row.characterId) params.set("characterId", row.characterId);
    return `./?${params}`;
  }
  function validate(data) {
    const bosses = new Set(catalog.dungeons.flatMap(d => d.bosses.map(b => b.key))), groups = new Map(), seen = new Set();
    const maxRows = bosses.size * catalog.jobs.length * 50 * 2;
    if (data?.schema !== "notmeter-global-ranking-v1" || data.version !== 1 || data.serviceRegion !== "WW" || data.limit !== 50 ||
        !Array.isArray(data.rows) || data.rows.length > maxRows || !Number.isFinite(data.generatedAt) || data.generatedAt > Date.now() / 1000 + 300 ||
        !Number.isFinite(data.weekStart) || data.weekEnd - data.weekStart !== 604800) throw new Error("Invalid Global cache");
    for (const row of data.rows) {
      const world = worlds.find(w => w.key === row.globalRegion);
      if (!bosses.has(row.bossKey) || !catalog.jobs.includes(row.job) || !["weekly", "all"].includes(row.period) ||
          !world?.servers.some(s => s.id === row.serverId) || typeof row.name !== "string" || !row.name.trim() || row.name.length > 128 ||
          typeof row.characterId !== "string" || row.characterId.length > 512 || !Number.isFinite(row.dps) || row.dps <= 0 ||
          !/^[0-9a-f]{64}$/.test(row.detailToken) || !Number.isInteger(row.actorId) || row.actorId <= 0 || !Number.isInteger(row.combatPower) || row.combatPower < 0 || !Number.isFinite(row.durationSeconds) || row.durationSeconds < 1 || !Number.isFinite(row.totalDamage) || row.totalDamage <= 0 ||
          !Number.isFinite(row.battleEnd) || (row.period === "weekly" && (row.battleEnd < data.weekStart * 1000 || row.battleEnd >= data.weekEnd * 1000))) throw new Error("Invalid Global row");
      const group = JSON.stringify([row.period, row.bossKey, row.job]);
      const identity = JSON.stringify([group, row.serverId, row.name.normalize("NFC")]);
      groups.set(group, (groups.get(group) || 0) + 1);
      if (seen.has(identity) || groups.get(group) > 50) throw new Error("Duplicate or oversized Global board");
      seen.add(identity);
    }
    return data;
  }
  async function load(force = false) {
    if (state.loading || (!force && Date.now() - state.lastAttempt < 60000)) return;
    state.lastAttempt = Date.now(); state.loading = true; state.error = false; state.pending = false; notify();
    const controller = new AbortController(), timeout = setTimeout(() => controller.abort(), 15000);
    try {
      const root = await globalThis.NotMeterGlobalRanking.resolveRoot(force);
      const response = await fetch(`${root}/data/notmeter-global-ranking.json`, { signal: controller.signal, cache: "no-cache" });
      if (response.status === 404 && !state.data) { state.pending = true; return; }
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      if (Number(response.headers.get("content-length")) > 32000000) throw new Error("Global cache too large");
      const text = await response.text();
      if (text.length > 32000000) throw new Error("Global cache too large");
      const next = validate(JSON.parse(text));
      if (!state.data || next.generatedAt >= state.data.generatedAt) { state.data = next; state.pagesRoot = root; }
    } catch { state.error = true; }
    finally { clearTimeout(timeout); state.loading = false; notify(); }
  }
  const detailLanguages = new Map(); let detailIcons;
  async function loadDetailLanguage(locale) {
    if (!detailLanguages.has(locale)) {
      const [names,icons] = await Promise.all([fetch(`./assets/global-details/${locale}.json?v=20261004`).then(r=>{if(!r.ok)throw new Error("Global language unavailable");return r.json();}),
        detailIcons || fetch("./assets/global-details/icons.json?v=20261004").then(r=>{if(!r.ok)throw new Error("Global icons unavailable");return r.json();})]);
      detailLanguages.set(locale,names); detailIcons=icons;
    }
  }
  function lookupDetail(collection, codes) {
    for (const raw of codes) {
      let code = Math.abs(Math.trunc(Number(raw)||0));
      for (;;) { if(Object.hasOwn(collection||{},String(code)))return collection[String(code)];
        if(code<=99999999)break; code=Math.trunc(code/10); }
    }
    return null;
  }
  function detailName(type, ...codes) {
    const names = detailLanguages.get(state.locale);
    return (type === "buff" ? lookupDetail(names?.buffs,codes)
      : lookupDetail(names?.skills,codes) || lookupDetail(names?.buffs,codes)) || "";
  }
  function detailIcon(element,type,codes,size) {
    const index=type === "buff" ? lookupDetail(detailIcons?.buffs,codes)
      : lookupDetail(detailIcons?.skills,codes) ?? lookupDetail(detailIcons?.buffs,codes);
    if(!Number.isInteger(index))return false;
    element.style.backgroundImage='url("./assets/global-details/icons.webp?v=20261004")';
    element.style.backgroundSize=`${detailIcons.columns*size}px ${detailIcons.rows*size}px`;
    element.style.backgroundPosition=`${-(index%detailIcons.columns)*size}px ${-Math.floor(index/detailIcons.columns)*size}px`;
    return true;
  }
  async function loadDetail(row, generation, root = state.pagesRoot) {
    if (!/^[0-9a-f]{64}$/.test(row.detailToken)) throw new Error("Invalid Global detail reference");
    const controller = new AbortController(), timeout = setTimeout(() => controller.abort(), 20000);
    try {
      const response = await fetch(`${root}/data/global-ranking-details/${row.detailToken.slice(0,2)}.json?g=${encodeURIComponent(generation)}`,
        {signal:controller.signal,cache:"no-cache"});
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      if (Number(response.headers.get("content-length")) > 64000000) throw new Error("Global detail shard too large");
      const text = await response.text();
      if (text.length > 64000000) throw new Error("Global detail shard too large");
      const shard = JSON.parse(text), encoded = shard.details?.[row.detailToken];
      if (shard.schema !== "notmeter-global-ranking-details-v1" || Number(shard.generatedAt) !== Number(generation) ||
          typeof encoded !== "string" || encoded.length > 2800000)
        throw new Error("Global detail unavailable");
      const compressed = Uint8Array.from(atob(encoded), c => c.charCodeAt(0));
      const reader = new Blob([compressed]).stream().pipeThrough(new DecompressionStream("gzip")).getReader();
      const chunks = []; let size = 0;
      try { for (;;) { const {value,done} = await reader.read(); if (done) break;
        size += value.byteLength; if (size > 8388608) throw new Error("Global detail too large"); chunks.push(value); }
      } finally { await reader.cancel(); }
      const bytes = new Uint8Array(size); let offset=0;
      for (const chunk of chunks) { bytes.set(chunk,offset); offset+=chunk.byteLength; }
      const hash = Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256",bytes)),n=>n.toString(16).padStart(2,"0")).join("");
      if (hash !== row.detailToken) throw new Error("Global detail checksum mismatch");
      await loadDetailLanguage(state.locale);
      const doc = JSON.parse(new TextDecoder().decode(bytes));
      const player = doc.record?.players?.find(p=>p.actorId===row.actorId);
      if (doc.schema !== "notmeter-ranking-combat-detail-v1" || doc.version !== 1 ||
          doc.dungeonKey !== row.bossKey.split(":")[0] || doc.record?.bossKey !== row.bossKey ||
          !player || player.name.normalize("NFC") !== row.name.normalize("NFC") || player.serverId !== row.serverId ||
          player.totalDamage !== row.totalDamage || doc.record.durationSeconds !== row.durationSeconds ||
          doc.selectors?.[String(row.actorId)] !== row.actorId || doc.record.players.length > 10 ||
          doc.record.players.some(p => !Array.isArray(p.skills) || p.skills.length > 192 || !Array.isArray(p.buffs) || p.buffs.length > 80))
        throw new Error("Global detail does not match ranking");
      const boss = catalog.dungeons.flatMap(d=>d.bosses).find(b=>b.key===row.bossKey);
      doc.record.bossName = label(boss.names);
      return doc;
    } finally { clearTimeout(timeout); }
  }
  function sync(locale, surface) {
    if (locale !== state.locale) { state.locale = locale; state.service = readService(locale); }
    state.surface = surface;
    const bar = document.getElementById("ranking-service-switch");
    if (!bar) return;
    const panel = document.getElementById("ranking-service-panel");
    if (panel) panel.hidden = surface !== "ranking";
    const title = document.getElementById("ranking-service-title"), hint = document.getElementById("ranking-service-hint");
    if (title) title.textContent = t("service");
    if (hint) hint.textContent = t("serviceHint");
    bar.hidden = surface !== "ranking";
    document.body.classList.toggle("global-ranking-active", active());
    bar.setAttribute("aria-label", t("service"));
    bar.replaceChildren(...["KR/TW", "Global"].map(service => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "ranking-service-button";
      const icon = document.createElement("span");
      icon.className = "ranking-service-icon";
      icon.setAttribute("aria-hidden", "true");
      if (service === "KR/TW") {
        for (const flag of ["kr", "tw"]) {
          const image = document.createElement("img");
          image.src = `./assets/flag-${flag}.svg`; image.alt = "";
          icon.append(image);
        }
      } else {
        icon.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18M5 6.5h14M5 17.5h14"/></svg>';
      }
      const name = document.createElement("span"); name.textContent = service;
      button.append(icon, name);
      button.classList.toggle("is-active", service === state.service);
      button.setAttribute("aria-pressed", String(service === state.service));
      button.addEventListener("click", () => {
        state.service = service;
        try { localStorage.setItem(`notmeter-ranking-service:${locale}`, service); } catch { }
        const url = new URL(location.href); url.searchParams.delete("rankingRegion"); history.replaceState(history.state, "", url);
        sync(locale, surface); notify();
      });
      return button;
    }));
    if (active() && !state.data) void load();
  }
  function dungeon(key) { return catalog.dungeons.find(d => d.key === key) || catalog.dungeons[0]; }
  function rows(key, bossIndex, period) {
    const target = dungeon(key), boss = target.bosses[Math.max(0, bossIndex - 1)] || target.bosses[0];
    if (period === "Weekly" && state.data && Date.now() / 1000 >= state.data.weekEnd) return [];
    return (state.data?.rows || []).filter(r => r.bossKey === boss.key && r.period === (period === "Weekly" ? "weekly" : "all"));
  }
  function serverName(row) {
    const world = worlds.find(w => w.key === row.globalRegion || (!row.globalRegion && w.servers.some(s => s.id === row.serverId))), server = world?.servers.find(s => s.id === row.serverId);
    return world && server ? `${label(world.names)} – ${label(server.names)}` : "";
  }
  globalThis.NotMeterGlobalRanking = { sync, validate, defaultService, characterLink, copy, active, load, loadDetail, detailName, detailIcon, loadDetailLanguage, state, t, label, catalog, dungeon, rows, serverName,
    pageText: () => active() ? { title: `NotMeter · ${t("title")}`, subtitle: t("intro") } : null,
  };
  setInterval(() => { if (!document.hidden && active()) void load(true); }, 300000);
})();
