(() => {
  "use strict";
  const catalog = globalThis.NotMeterGlobalRankingCatalog;
  const worlds = globalThis.NotMeterGlobalFieldBossCatalog.serviceRegions;
  const fields = ["title", "intro", "weekly", "all", "dungeon", "boss", "job", "character", "duration", "date", "empty", "loading", "error", "refresh", "rules", "expedition", "raid", "stage4", "updated", "reset", "service"];
  const translations = {
    ko: ["글로벌 클래스 TOP 50", "전 지역 통합 · 캐릭터별 최고 DPS", "이번 주", "전체기간", "던전", "보스", "클래스", "캐릭터", "전투 시간", "처치 시각", "아직 등록된 기록이 없습니다.", "랭킹을 불러오는 중입니다.", "랭킹을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.", "새로고침", "던전·보스·클래스별 TOP 50만 보관합니다. CP 구간은 나누지 않으며, 파티원 간 CP 차이가 200K 이상인 기록은 제외합니다. CP 미확인 파티원은 차이 계산에서 제외됩니다. 캐릭터명은 공개됩니다.", "원정", "성역", "초월 · 4단계", "갱신", "매주 수요일 05:00 (한국시간) 초기화", "랭킹 서비스"],
    en: ["Global Class TOP 50", "All regions · Personal-best DPS", "This week", "All time", "Dungeon", "Boss", "Class", "Character", "Duration", "Kill time", "No records yet.", "Loading rankings…", "Couldn't load the rankings. Please try again shortly.", "Refresh", "Only the top 50 per dungeon, boss and class are retained. There are no CP brackets. Runs with a party CP gap of 200K or more are excluded; players with unknown CP are left out of this check. Character names are public.", "Expedition", "Sanctuary", "Transcendence · Stage 4", "Updated", "Resets Wednesday at 05:00 KST (UTC+9)", "Ranking service"],
    "zh-TW": ["全球服職業 TOP 50", "全區合併 · 角色最高 DPS", "本週", "全期間", "副本", "首領", "職業", "角色", "戰鬥時間", "擊殺時間", "目前尚無紀錄。", "正在載入排行榜…", "無法載入排行榜，請稍後再試。", "重新整理", "各副本、首領及職業僅保留前 50 名，不區分 CP 級距。隊員 CP 差距達 200K 以上的紀錄不列入；CP 未知的隊員不參與差距計算。角色名稱一律公開。", "遠征", "聖域", "超越 · 第 4 階段", "更新", "每週三韓國時間 05:00（UTC+9）重置", "排行榜服務地區"],
    "ja-JP": ["グローバル クラス別 TOP 50", "全地域共通 · キャラクター別の最高DPS", "今週", "全期間", "ダンジョン", "ボス", "クラス", "キャラクター", "戦闘時間", "討伐日時", "まだ記録がありません。", "ランキングを読み込み中…", "ランキングを読み込めませんでした。しばらくしてから再度お試しください。", "更新", "ダンジョン・ボス・クラスごとに上位50名の記録のみを保存します。CP帯の区分はありません。パーティー内のCP差が200K以上の記録は対象外です。CP不明のメンバーは差の計算から除外します。キャラクター名は公開されます。", "遠征", "聖域", "超越 · 段階4", "更新日時", "毎週水曜05:00（韓国時間／UTC+9）にリセット", "ランキングのサービス地域"],
    "de-DE": ["Globale Klassen-TOP-50", "Alle Regionen · Persönlicher DPS-Bestwert", "Diese Woche", "Gesamtzeit", "Dungeon", "Boss", "Klasse", "Charakter", "Kampfdauer", "Besiegt am", "Noch keine Einträge vorhanden.", "Rangliste wird geladen…", "Die Rangliste konnte nicht geladen werden. Bitte versuche es später erneut.", "Aktualisieren", "Pro Dungeon, Boss und Klasse werden nur die besten 50 gespeichert, ohne CP-Gruppen. Kämpfe mit einer CP-Differenz von mindestens 200K innerhalb der Gruppe zählen nicht. Spieler mit unbekannten CP werden bei dieser Prüfung ausgelassen. Charakternamen sind öffentlich.", "Expedition", "Heiligtum", "Transzendenz · Stufe 4", "Aktualisiert", "Zurücksetzung: Mittwoch, 05:00 KST (UTC+9)", "Ranglistenregion"],
    "fr-FR": ["TOP 50 mondial par classe", "Toutes les régions · Meilleur DPS personnel", "Cette semaine", "Depuis toujours", "Donjon", "Boss", "Classe", "Personnage", "Durée", "Date du combat", "Aucun résultat pour le moment.", "Chargement du classement…", "Impossible de charger le classement. Veuillez réessayer dans un instant.", "Actualiser", "Seuls les 50 meilleurs résultats par donjon, boss et classe sont conservés, sans tranches de CP. Les combats avec un écart de CP d’au moins 200K dans le groupe sont exclus. Les joueurs dont les CP sont inconnus ne sont pas pris en compte pour ce contrôle. Les noms sont publics.", "Expédition", "Sanctuaire", "Transcendance · Palier 4", "Mis à jour", "Réinitialisation le mercredi à 05:00 KST (UTC+9)", "Région du classement"],
    "es-ES": ["TOP 50 global por clase", "Todas las regiones · Mejor DPS personal", "Esta semana", "Histórico", "Mazmorra", "Jefe", "Clase", "Personaje", "Duración", "Fecha del combate", "Aún no hay registros.", "Cargando clasificación…", "No se ha podido cargar la clasificación. Vuelve a intentarlo en unos instantes.", "Actualizar", "Solo se conservan los 50 mejores por mazmorra, jefe y clase, sin intervalos de CP. Se excluyen los combates con una diferencia de CP de 200K o más en el grupo. Los jugadores con CP desconocidos no se incluyen en esta comprobación. Los nombres son públicos.", "Expedición", "Santuario", "Trascendencia · Nivel 4", "Actualizado", "Se reinicia los miércoles a las 05:00 KST (UTC+9)", "Región de clasificación"],
    "pt-BR": ["TOP 50 global por classe", "Todas as regiões · Melhor DPS pessoal", "Esta semana", "Todo o período", "Masmorra", "Chefe", "Classe", "Personagem", "Duração", "Data do combate", "Ainda não há registros.", "Carregando classificação…", "Não foi possível carregar a classificação. Tente novamente em instantes.", "Atualizar", "Apenas os 50 melhores por masmorra, chefe e classe são mantidos, sem faixas de CP. Combates com uma diferença de CP de 200K ou mais no grupo são excluídos. Jogadores com CP desconhecido não entram nessa verificação. Os nomes são públicos.", "Expedição", "Santuário", "Transcendência · Etapa 4", "Atualizado", "Reinicia às quartas-feiras, às 05:00 KST (UTC+9)", "Região da classificação"],
    "ru-RU": ["Глобальный ТОП-50 по классам", "Все регионы · Личный рекорд DPS", "Эта неделя", "Всё время", "Подземелье", "Босс", "Класс", "Персонаж", "Длительность", "Время победы", "Записей пока нет.", "Загрузка рейтинга…", "Не удалось загрузить рейтинг. Повторите попытку чуть позже.", "Обновить", "Хранятся только 50 лучших результатов для каждого подземелья, босса и класса, без разделения по CP. Бои с разницей CP в группе от 200K не учитываются. Игроки с неизвестным CP исключаются из этой проверки. Имена персонажей открыты.", "Экспедиция", "Святилище", "Превосхождение · Этап 4", "Обновлено", "Сброс по средам в 05:00 KST (UTC+9)", "Регион рейтинга"],
  };
  const copy = Object.fromEntries(Object.entries(translations).map(([locale, values]) => [locale, Object.fromEntries(fields.map((key, i) => [key, values[i]]))]));
  const nightmare10 = { ko: "악몽 · 10단계", en: "Nightmare · Stage 10", "zh-TW": "惡夢 · 第 10 階段", "ja-JP": "悪夢 · 段階10", "de-DE": "Albtraum · Stufe 10", "fr-FR": "Cauchemar · Palier 10", "es-ES": "Pesadilla · Nivel 10", "pt-BR": "Pesadelo · Etapa 10", "ru-RU": "Кошмар · Этап 10" };
  for (const locale of Object.keys(copy)) copy[locale].nightmare10 = nightmare10[locale];
  const dummy60 = { ko: "1분", en: "1 min", "zh-TW": "1分鐘", "ja-JP": "1分", "de-DE": "1 Min.", "fr-FR": "1 min", "es-ES": "1 min", "pt-BR": "1 min", "ru-RU": "1 мин" };
  const dummyRules = {
    ko: ["레기온 비공정에서만 등록되는 1분 랭킹", "다른 장소에서는 다른 직업의 디버프가 측정에 영향을 줄 수 있습니다. 레기온 비공정에서 측정한 정확한 60초 기록만 등록하며, 다른 캐릭터의 파티 버프나 대상 디버프가 확인되면 등록하지 않습니다. 두 종류의 허수아비 기록을 합쳐 클래스별 TOP 50을 집계하고, 각 기록에 측정한 허수아비 종류를 표시합니다."],
    en: ["1-minute rankings · Legion Airships only", "In other locations, debuffs from other classes can affect your measurement. Only exact 60-second records from a Legion Airship qualify. Records are excluded if party buffs from another character or another character’s target debuffs are detected. Both scarecrow types share one class TOP 50, and each record shows the type used."],
    "zh-TW": ["1分鐘排行榜・僅限軍團飛船（Legion Airship）", "其他地點可能受到其他職業的減益效果影響。僅登錄於軍團飛船測得的完整60秒紀錄；若偵測到其他角色提供的隊伍增益或施加於目標的減益，該紀錄將不予登錄。兩種稻草人的紀錄合併計算各職業TOP 50，並標示實際測試的種類。"],
    "ja-JP": ["1分ランキング・レギオンの飛行艇限定", "他の場所では、他クラスのデバフが測定結果に影響することがあります。レギオンの飛行艇で測定した正確な60秒間の記録のみ対象です。他のキャラクターからのパーティーバフや、対象へのデバフが確認された記録は登録されません。2種類のカカシを同じクラス別TOP 50にまとめ、各記録に測定対象を表示します。"],
    "de-DE": ["1-Minuten-Rangliste · Nur auf Legions-Luftschiffen", "An anderen Orten können Debuffs anderer Klassen die Messung beeinflussen. Nur Messungen von genau 60 Sekunden auf einem Legions-Luftschiff zählen. Erkannte Gruppenbuffs oder Ziel-Debuffs anderer Charaktere schließen einen Eintrag aus. Beide Trainingspuppen teilen sich die Klassen-TOP-50; jeder Eintrag nennt die verwendete Puppe."],
    "fr-FR": ["Classement sur 1 minute · Aéronefs de la Légion uniquement", "Ailleurs, les affaiblissements d’autres classes peuvent fausser la mesure. Seuls les relevés d’exactement 60 secondes effectués dans un Aéronef de la Légion sont admis. Tout bonus de groupe reçu d’un autre personnage ou affaiblissement qu’il applique à la cible exclut le relevé. Les deux types de cibles partagent le même TOP 50 par classe ; chaque relevé indique la cible utilisée."],
    "es-ES": ["Clasificación de 1 minuto · Solo en Dirigibles de la Legión", "En otros lugares, los perjuicios de otras clases pueden alterar la medición. Solo se admiten registros de exactamente 60 segundos en un Dirigible de la Legión. Se excluyen los registros con beneficios de grupo recibidos de otro personaje o perjuicios que este aplique al objetivo. Ambos muñecos comparten un TOP 50 por clase y cada registro muestra el tipo utilizado."],
    "pt-BR": ["Classificação de 1 minuto · Apenas em Naves Aéreas da Legião", "Em outros locais, efeitos negativos de outras classes podem alterar a medição. Só valem registros de exatamente 60 segundos em uma Nave Aérea da Legião. Registros com bônus de grupo de outro personagem ou efeitos negativos que ele aplique ao alvo são excluídos. Os dois espantalhos compartilham o TOP 50 por classe, e cada registro mostra o tipo usado."],
    "ru-RU": ["Рейтинг за 1 минуту · Только на летучих кораблях легиона", "В других местах отрицательные эффекты других классов могут исказить замер. Принимаются только записи ровно за 60 секунд на летучем корабле легиона. Запись исключается, если обнаружены групповые усиления от другого персонажа или наложенные им отрицательные эффекты на цель. Оба вида чучел входят в общий ТОП-50 класса; у каждой записи указан использованный вид."],
  };
  for (const locale of Object.keys(copy)) { copy[locale].dummy60 = dummy60[locale]; [copy[locale].dummyTitle, copy[locale].dummyRules] = dummyRules[locale]; }
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
  const t = key => key === "reset" ? globalThis.NotMeterWeeklyReset.schedule(state.locale) : (copy[state.locale] || copy.en)[key];
  const label = names => names[state.locale] || names.en;
  const defaultService = locale => ["ko", "zh-TW"].includes(locale) ? "KR/TW" : "Global";
  const active = () => state.service === "Global" && state.surface === "ranking";
  const notify = () => window.dispatchEvent(new CustomEvent("notmeter-global-ranking-change"));
  let weekBoundaryTimer, visibleWeekCurrent = null;
  function isCurrentWeek(now = Date.now()) {
    return Boolean(state.data && now / 1000 >= state.data.weekStart && now / 1000 < state.data.weekEnd);
  }
  function syncWeekVisibility(emitChange = true) {
    clearTimeout(weekBoundaryTimer);
    if (!state.data) return;
    const now = Date.now(), current = isCurrentWeek(now);
    const changed = visibleWeekCurrent !== null && visibleWeekCurrent !== current;
    visibleWeekCurrent = current;
    const boundary = (now / 1000 < state.data.weekStart ? state.data.weekStart : state.data.weekEnd) * 1000;
    if (boundary > now) weekBoundaryTimer = setTimeout(syncWeekVisibility, Math.min(2147000000, boundary - now + 1));
    if (changed && emitChange) notify();
  }
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
    const week = globalThis.NotMeterWeeklyReset.globalWindow(Number(data?.generatedAt) * 1000);
    if (data?.schema !== "notmeter-global-ranking-regional-v2" || data.version !== 2 || data.weekPolicy !== "ww-tue2330-america-los-angeles-v1" || data.serviceRegion !== "WW" || data.limit !== 50 ||
        !Array.isArray(data.rows) || (data.additionalRows !== undefined && !Array.isArray(data.additionalRows)) ||
        (data.trainingDummyRows !== undefined && !Array.isArray(data.trainingDummyRows)) ||
        (data.expandedServerRows !== undefined && !Array.isArray(data.expandedServerRows)) ||
        data.rows.length + (data.additionalRows?.length || 0) + (data.trainingDummyRows?.length || 0) + (data.expandedServerRows?.length || 0) > maxRows || !Number.isFinite(data.generatedAt) || data.generatedAt > Date.now() / 1000 + 300 ||
        !Number.isFinite(data.weekStart) || data.weekStart * 1000 !== week.start || data.weekEnd * 1000 !== week.end) throw new Error("Invalid Global cache");
    const rows = [...data.rows, ...(data.additionalRows || []), ...(data.trainingDummyRows || []), ...(data.expandedServerRows || [])];
    for (const row of rows) {
      const world = worlds.find(w => w.key === row.globalRegion);
      if (row.bossKey === "global-training-dummy-60s:2400032" &&
          (![2400032, 2400035].includes(row.mobCode) || Math.abs(row.durationSeconds - 60) > 0.01)) throw new Error("Invalid training record");
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
    const { additionalRows, trainingDummyRows, expandedServerRows, ...base } = data;
    return { ...base, rows };
  }
  let loadTask = null;
  function load(force = false, background = false) {
    // Expiry must update already rendered rows even when the publication has not changed.
    syncWeekVisibility();
    if (loadTask) return loadTask;
    if (!force && Date.now() - state.lastAttempt < 60000) return Promise.resolve(state.data);
    loadTask = Promise.resolve().then(() => fetchRanking(force, background)).finally(() => { loadTask = null; });
    return loadTask;
  }
  async function fetchRanking(force, background) {
    state.lastAttempt = Date.now(); state.loading = true; state.error = false; state.pending = false;
    let changed = false;
    if (!background || !state.data) notify();
    let timeout;
    try {
      const root = await globalThis.NotMeterGlobalRanking.resolveRoot(force, background);
      if (background && !force && state.data && state.pagesRoot === root) return;
      const controller = new AbortController();
      timeout = setTimeout(() => controller.abort(), 15000);
      const response = await fetch(`${root}/data/notmeter-global-ranking-regional-v2.json`, { signal: controller.signal, cache: "no-cache" });
      if (response.status === 404 && !state.data) { state.pending = true; return; }
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      if (Number(response.headers.get("content-length")) > 32000000) throw new Error("Global cache too large");
      const text = await response.text();
      if (text.length > 32000000) throw new Error("Global cache too large");
      const next = validate(JSON.parse(text));
      if (!state.data || next.generatedAt >= state.data.generatedAt) {
        state.data = next; state.pagesRoot = root; changed = true;
        syncWeekVisibility(false);
      }
    } catch { state.error = true; }
    finally { clearTimeout(timeout); state.loading = false; if (!background || !state.data || changed) notify(); }
  }
  const detailLanguages = new Map(); let detailIcons, detailPolicy;
  const otherDamage = {
    ko: "기타 피해", en: "Other damage", "zh-TW": "其他傷害", "ja-JP": "その他のダメージ",
    "de-DE": "Sonstiger Schaden", "fr-FR": "Autres dégâts", "es-ES": "Otros daños",
    "pt-BR": "Outros danos", "ru-RU": "Прочий урон",
  };
  async function loadDetailLanguage(locale) {
    if (!detailLanguages.has(locale)) {
      const [names,icons,policy] = await Promise.all([fetch(`./assets/global-details/${locale}.json?v=20261008-client-terms`).then(r=>{if(!r.ok)throw new Error("Global language unavailable");return r.json();}),
        detailIcons || fetch("./assets/global-details/icons.json?v=20261004-ui-bindings").then(r=>{if(!r.ok)throw new Error("Global icons unavailable");return r.json();}),
        detailPolicy || fetch("./assets/global-details/presentation.json?v=20261011-charge-traits").then(r=>{if(!r.ok)throw new Error("Global detail policy unavailable");return r.json();})]);
      if (policy.version !== 1 || !policy.skills || !policy.buffs) throw new Error("Invalid Global detail policy");
      detailLanguages.set(locale,names); detailIcons=icons; detailPolicy=policy;
    }
  }
  function detailIdentity(type, codes) {
    const raw = codes.map(Number).find(value => Number.isSafeInteger(value) && value > 0);
    if (!raw || !detailPolicy) return null;
    // Abnormal IDs must never be truncated into an unrelated skill family.
    const buff = detailPolicy.buffs[raw];
    if (buff) return { type: "buffs", key: raw, meta: buff };
    if (type === "buff") return null;
    let key = raw;
    while (key > 99999999) key = Math.trunc(key / 10);
    const skill = detailPolicy.skills[key];
    if (skill) return { type: "skills", key, meta: skill };
    const source = detailPolicy.periodicSkills[raw];
    if (source && detailPolicy.skills[source]) {
      return { type: "skills", key: source, meta: detailPolicy.skills[source] };
    }
    return null;
  }
  function lookupDetail(collection, identity) {
    if (!identity) return null;
    return collection?.[identity.type]?.[identity.key] ?? collection?.skills?.[identity.meta[0]] ?? null;
  }
  function detailName(type, ...codes) {
    return lookupDetail(detailLanguages.get(state.locale), detailIdentity(type, codes)) || "";
  }
  function shouldDisplayBuff(buff) {
    const identity = detailIdentity("buff", [buff?.rawCode, buff?.code]);
    return Boolean(identity?.meta[1] && detailName("buff", buff.rawCode, buff.code));
  }
  function shouldDisplayHealing(skill) {
    const identity = detailIdentity("skill", [skill?.rawSkillCode, skill?.skillCode]);
    if (!identity || !detailName("skill", skill.rawSkillCode, skill.skillCode)) return false;
    return identity.type === "skills" ? Boolean(identity.meta[1]) : Boolean(identity.meta[2]);
  }
  function shouldDisplaySkill(skill) {
    if (Number(skill?.totalDamage) > 0 || Number(skill?.periodicDamage) > 0) return true;
    if (Number(skill?.healingAmount) > 0 || Number(skill?.drainHealingAmount) > 0) return shouldDisplayHealing(skill);
    const identity = detailIdentity("skill", [skill?.rawSkillCode, skill?.skillCode]);
    if (!identity || !detailName("skill", skill.rawSkillCode, skill.skillCode)) return false;
    return identity.type === "skills" ? Boolean(identity.meta[1] && !identity.meta[2]) : Boolean(identity.meta[1]);
  }
  function normalizeDetailSkill(skill) {
    const healingValid = shouldDisplayHealing(skill);
    let raw = Number(skill.rawSkillCode);
    const abnormal = raw > 99999999 && detailPolicy?.buffs[raw];
    while (raw > 99999999) raw = Math.trunc(raw / 10);
    const meta = !abnormal && Number.isSafeInteger(raw) ? detailPolicy?.skills[raw] : null;
    const matches = meta && [raw, meta[0]].includes(Number(skill.skillCode));
    const mask = matches ? meta[3] : null;
    const flags = Number(skill.rawSkillCode) > 0 && Number.isInteger(mask) && mask >= 0 && mask < 32 && (mask > 0 || meta?.[4] === true)
      ? Array.from({ length: 5 }, (_, bit) => (mask & (1 << bit)) !== 0)
      : skill.specializationFlags;
    return { ...skill,
      specializationFlags: flags,
      skillName: detailName("skill", skill.rawSkillCode, skill.skillCode) || otherDamage[state.locale] || otherDamage.en,
      healingAmount: healingValid ? skill.healingAmount : 0,
      drainHealingAmount: healingValid ? skill.drainHealingAmount : 0,
      healingHitCount: healingValid ? skill.healingHitCount : 0,
    };
  }
  function detailIcon(element,type,codes,size) {
    const index = lookupDetail(detailIcons, detailIdentity(type, codes));
    if(!Number.isInteger(index))return false;
    element.style.backgroundImage='url("./assets/global-details/icons.webp?v=20261004-ui-bindings")';
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
      const dungeon = catalog.dungeons.find(d => d.bosses.some(b => b.key === row.bossKey));
      if (dungeon.targets && Number(doc.record.mobCode) !== Number(row.mobCode))
        throw new Error("Global detail target does not match ranking");
      doc.record.bossName = targetName(row);
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
    if (period === "Weekly" && !isCurrentWeek()) return [];
    return (state.data?.rows || []).filter(r => r.bossKey === boss.key && r.period === (period === "Weekly" ? "weekly" : "all"));
  }
  function rankedRows(input, job) {
    return input.filter(row => row.job === job)
      .sort((a, b) => b.dps - a.dps || a.battleEnd - b.battleEnd || a.serverId - b.serverId ||
        (a.name < b.name ? -1 : a.name > b.name ? 1 : 0))
      .slice(0, 50).map((row, index) => ({ ...row, rank: index + 1, targetName: targetName(row) }));
  }
  const dummyRewardNotice = {"ko":"글로벌 모든 지역을 통합한 동일 직업의 이번 주 DPS 1~10위에 들면 랭커 마크, 움직이는 테두리와 모든 닉네임 효과를 사용할 수 있습니다. CP 제한은 없습니다. 전체 기간 순위만 있거나 이번 주 11위 이하인 경우에는 허수아비 랭킹 혜택이 적용되지 않습니다. 1분 측정을 마친 뒤 홈페이지의 이번 주 랭킹에 반영되어야 하며, 전투 직후 예상 순위만으로는 자격이 부여되지 않습니다.","en":"Place 1st–10th in the published weekly DPS leaderboard for your class, combining all Global regions, to unlock a rank marker, an animated border, and all nickname effects. There is no CP requirement. An all-time placement alone or a weekly rank of 11th or lower does not grant training dummy rewards. Your completed 1-minute test must appear in the published weekly leaderboard; the rank estimate immediately after a test does not grant eligibility.","zh-TW":"在合併全球伺服器所有地區的同職業本週 DPS 排行榜中，正式排名第 1～10 名即可使用排名標記、動態外框及所有暱稱特效，無戰力限制。僅有全期間名次，或本週排名第 11 名以後，不會獲得稻草人排名福利。完成 1 分鐘測試後，紀錄須先反映至網站的本週排行榜；測試結束時的預估名次不會立即授予資格。","ja-JP":"グローバルの全地域を統合した同じクラスの週間DPSランキングで、公開済みの順位が1～10位になると、ランカーマーク、動くフレーム、すべての名前エフェクトを利用できます。CP制限はありません。全期間の順位のみ、または今週11位以下の場合は、カカシのランキング特典は適用されません。1分間の測定結果がサイトの週間ランキングに反映される必要があります。測定直後の推定順位だけでは資格は付与されません。","de-DE":"Platz 1–10 in der veröffentlichten wöchentlichen DPS-Rangliste deiner Klasse, die alle Global-Regionen zusammenfasst, schaltet Rangmarkierung, animierten Rahmen und alle Namenseffekte frei. Es gibt keine CP-Anforderung. Ein Platz nur in der Gesamtwertung oder Platz 11 und darunter in der Wochenwertung gewährt keine Trainingspuppen-Belohnungen. Dein vollständiger 1-Minuten-Test muss in der veröffentlichten Wochenrangliste erscheinen. Die Schätzung direkt nach dem Test gewährt noch keine Berechtigung.","fr-FR":"Une place de 1 à 10 au classement DPS hebdomadaire publié de votre classe, toutes les régions Global confondues, débloque une marque de classement, une bordure animée et tous les effets de pseudo. Aucun minimum de CP n’est requis. Une place uniquement au classement de tous les temps ou un rang hebdomadaire de 11 ou plus ne donne pas accès aux récompenses du mannequin. Votre test complet de 1 minute doit figurer au classement hebdomadaire publié. Le rang estimé juste après le test ne suffit pas.","es-ES":"Quedar entre los puestos 1 y 10 de la clasificación semanal de DPS publicada de tu clase, que reúne todas las regiones Global, desbloquea una marca de clasificación, un borde animado y todos los efectos de nombre. No hay requisito de CP. Un puesto solo en la clasificación histórica o un puesto semanal de 11 o inferior no concede recompensas del muñeco. Tu prueba completa de 1 minuto debe aparecer en la clasificación semanal publicada; el puesto estimado al terminar la prueba no concede acceso.","pt-BR":"Ficar entre o 1º e o 10º lugar no ranking semanal de DPS publicado da sua classe, que reúne todas as regiões Global, libera uma marca de ranking, uma borda animada e todos os efeitos de nome. Não há requisito de CP. Uma posição apenas no ranking geral ou do 11º lugar em diante no semanal não concede as recompensas do espantalho. Seu teste completo de 1 minuto precisa aparecer no ranking semanal publicado; a posição estimada ao terminar o teste não libera o acesso.","ru-RU":"Места с 1-го по 10-е в опубликованном недельном рейтинге DPS вашего класса, объединяющем все регионы Global, дают значок рейтинга, анимированную рамку и доступ ко всем эффектам имени. Ограничений по CP нет. Одного места в рейтинге за всё время или места с 11-го и ниже в недельном рейтинге недостаточно для наград за чучело. Завершённый минутный тест должен попасть в опубликованный недельный рейтинг; предварительное место сразу после теста не даёт доступа к наградам."};
  for (const [locale, notice] of Object.entries(dummyRewardNotice)) copy[locale].dummyRules += " " + notice;
  function targetName(row) {
    const dungeon = catalog.dungeons.find(d => d.bosses.some(b => b.key === row.bossKey));
    const boss = dungeon?.bosses.find(b => b.key === row.bossKey);
    if (!boss) return "";
    return label(dungeon?.targets?.find(target => target.code === Number(row.mobCode))?.names || boss?.names);
  }
  function characterRows(identity, now = Date.now()) {
    const data = state.data;
    if (!data) return [];
    const world = worlds.find(item => item.key === identity.globalRegion);
    if (!world?.servers.some(server => server.id === identity.serverId) || !catalog.jobs.includes(identity.job)) return [];
    const normalizeId = value => { try { return decodeURIComponent(String(value || "").trim()); } catch { return ""; } };
    const matches = row => {
      if (row.serverId !== identity.serverId || row.globalRegion !== identity.globalRegion) return false;
      if (row.characterId && identity.characterId) {
        const id = normalizeId(identity.characterId);
        return id.length > 0 && normalizeId(row.characterId) === id;
      }
      return row.name.normalize("NFC") === String(identity.name || "").trim().normalize("NFC");
    };
    const periods = isCurrentWeek(now) ? ["all", "weekly"] : ["all"];
    return periods.flatMap(period => {
      const rows = data.rows.filter(row => row.period === period);
      return catalog.dungeons.flatMap((dungeon, dungeonOrder) => dungeon.bosses.flatMap((boss, index) => {
        const row = rankedRows(rows.filter(item => item.bossKey === boss.key), identity.job).find(matches);
        return row ? [{ ...row, dungeonKey: dungeon.key, dungeonOrder, bossIndex: index + 1 }] : [];
      }));
    });
  }
  function serverName(row) {
    const world = worlds.find(w => w.key === row.globalRegion || (!row.globalRegion && w.servers.some(s => s.id === row.serverId))), server = world?.servers.find(s => s.id === row.serverId);
    return world && server ? `${label(world.names)} – ${label(server.names)}` : "";
  }
  globalThis.NotMeterGlobalRanking = { sync, validate, defaultService, characterLink, copy, active, load, loadDetail, detailName, detailIcon, loadDetailLanguage, shouldDisplayBuff, shouldDisplaySkill, shouldDisplayHealing, normalizeDetailSkill, state, t, label, catalog, dungeon, rows, rankedRows, characterRows, isCurrentWeek, serverName, targetName,
    pageText: () => active() ? { title: `NotMeter · ${t("title")}`, subtitle: t("intro") } : null,
  };
})();
