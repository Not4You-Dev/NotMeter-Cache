(() => {
  "use strict";
  const base = "https://raw.githubusercontent.com/Not4You-Dev/NotMeter-Global-Ranking-Cache";
  const state = { bundle: null, selection: null, minimum: 0, loading: false, error: false, attempted: "", lastAttempt: 0 };
  const copy = (globalThis.NotMeterI18n?.withVietnamese || (copy => copy))({
    ko: ["글로벌 구간별 TOP 20", "150K 이상 · 25K 구간별 · 캐릭터별 최고 DPS", "보스·직업·CP 구간별로 전체 기간과 이번 주의 최고 기록을 각각 비교합니다. TOP20만 전투 상세를 보관하며, 나머지도 캐릭터별 최고 DPS로 상위 10%·25% 계산에 포함됩니다. 랭커 이펙트와 닉네임 효과는 이번 주 구간별 TOP5에만 적용됩니다.", "이전 방식에서 남아 있던 기록과 변경 후 받은 기록을 기준으로 합니다. 과거에 보관되지 않은 기록은 포함되지 않습니다."],
    en: ["Global TOP 20 by CP bracket", "150K+ · 25K brackets · Personal-best DPS", "Compare each character's best DPS by boss, class and CP bracket, separately for all time and this week. Only the TOP20 keep combat details; everyone else's best DPS still counts toward the top 10% and 25% thresholds. Ranker and nickname effects require a weekly TOP5 place in a bracket.", "Includes records retained by the previous system and records received since the change. Previously discarded records are not included."],
    "zh-TW": ["全球服各戰力區間 TOP 20", "150K 以上 · 每 25K 一區間 · 角色最高 DPS", "依首領、職業及戰力區間，分別比較全期間與本週的角色最高 DPS。僅 TOP20 保留戰鬥詳情；其他角色的最高 DPS 仍納入前 10% 與 25% 門檻計算。排名與暱稱特效僅限各區間本週 TOP5。", "包含舊系統仍保留的紀錄及變更後收到的紀錄，不含過去已捨棄的紀錄。"],
    "ja-JP": ["グローバル CP帯別 TOP 20", "150K以上 · 25KごとのCP帯 · 個人最高DPS", "ボス・クラス・CP帯ごとに、全期間と今週の個人最高DPSを別々に比較します。戦闘詳細はTOP20のみ保存し、それ以外のキャラクターの最高DPSも上位10%・25%の計算に含めます。ランカーと名前のエフェクトは各CP帯の今週TOP5のみ対象です。", "旧方式で残っていた記録と変更後に受信した記録が対象です。過去に破棄された記録は含まれません。"],
    "de-DE": ["Globale TOP 20 je CP-Gruppe", "Ab 150K · 25K-CP-Gruppen · Persönlicher DPS-Bestwert", "Der persönliche DPS-Bestwert wird je Boss, Klasse und CP-Gruppe getrennt für Gesamtzeit und Woche verglichen. Nur die TOP20 behalten Kampfdetails. Die Bestwerte aller übrigen Charaktere zählen weiter für die Top-10%- und Top-25%-Grenzen. Rang- und Namenseffekte gelten nur für die wöchentlichen TOP5 einer Gruppe.", "Enthält zuvor aufbewahrte Einträge und seit der Umstellung empfangene Kämpfe. Früher verworfene Einträge fehlen."],
    "fr-FR": ["TOP 20 Global par tranche de CP", "Dès 150K · Tranches de 25K · Meilleur DPS personnel", "Le meilleur DPS de chaque personnage est comparé par boss, classe et tranche de CP, séparément pour la semaine et tous les temps. Seul le TOP20 conserve les détails de combat. Les autres meilleurs DPS comptent dans les seuils des meilleurs 10 % et 25 %. Les effets de rang et de pseudo sont réservés au TOP5 hebdomadaire de chaque tranche.", "Inclut les anciens résultats encore conservés et ceux reçus depuis le changement, mais pas les résultats déjà supprimés."],
    "es-ES": ["TOP 20 global por intervalo de CP", "Desde 150K · Intervalos de 25K · Mejor DPS personal", "El mejor DPS de cada personaje se compara por jefe, clase e intervalo de CP, separando el histórico y esta semana. Solo el TOP20 conserva detalles de combate. Los demás mejores DPS cuentan para los umbrales del 10 % y 25 % superior. Los efectos de rango y nombre se limitan al TOP5 semanal de cada intervalo.", "Incluye los registros que conservaba el sistema anterior y los recibidos desde el cambio. No incluye los descartados anteriormente."],
    "pt-BR": ["TOP 20 global por faixa de CP", "A partir de 150K · Faixas de 25K · Melhor DPS pessoal", "O melhor DPS de cada personagem é comparado por chefe, classe e faixa de CP, separando o histórico e esta semana. Só o TOP20 mantém detalhes de combate. Os demais melhores DPS contam para os limites dos 10% e 25% melhores. Efeitos de ranking e nome são exclusivos do TOP5 semanal de cada faixa.", "Inclui os registros que o sistema anterior manteve e os recebidos após a mudança. Registros descartados anteriormente não estão incluídos."],
    "ru-RU": ["Глобальный ТОП-20 по диапазонам CP", "От 150K · Шаг 25K · Личный рекорд DPS", "Лучший DPS персонажа сравнивается по боссу, классу и диапазону CP отдельно за всё время и за неделю. Подробности боя хранятся только для ТОП-20. Рекорды остальных персонажей участвуют в расчёте порогов лучших 10% и 25%. Эффекты ранга и имени доступны только недельному ТОП-5 каждого диапазона.", "Учитываются записи, сохранённые старой системой, и записи после перехода. Ранее отброшенные записи не включены."]
  });
  const text = (locale, key) => (copy[locale] || copy.en)[["title", "intro", "rules", "history"].indexOf(key)] || "";
  const notify = () => window.dispatchEvent(new CustomEvent("notmeter-global-ranking-change"));
  const hash = async bytes => Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", bytes)), n => n.toString(16).padStart(2, "0")).join("");
  const safePath = path => /^data\/(?:notmeter-global-cp-ranking-v1\.json|global-cp-manifest\.json|global-cp\/(?:(?:boards|views)\/[a-f0-9]{24}|(?:details|identities)\/[a-f0-9]{2})\.json)$/.test(path);
  async function read(url, maximum = 67108864) {
    const controller = new AbortController(), timeout = setTimeout(() => controller.abort(), 20000);
    try {
      const response = await fetch(url, { cache: "no-cache", signal: controller.signal });
      if (!response.ok) throw Object.assign(new Error(`HTTP ${response.status}`), { status: response.status });
      if (Number(response.headers.get("content-length")) > maximum) throw new Error("Global CP body too large");
      const reader = response.body.getReader(), chunks = []; let length = 0;
      try {
        for (;;) {
          const next = await reader.read(); if (next.done) break;
          length += next.value.length; if (length > maximum) throw new Error("Global CP body too large");
          chunks.push(next.value);
        }
      } finally { await reader.cancel(); }
      const bytes = new Uint8Array(length); let offset = 0;
      for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
      return bytes;
    } finally { clearTimeout(timeout); }
  }
  const parse = bytes => JSON.parse(new TextDecoder().decode(bytes));
  async function verified(root, reference, generatedAt) {
    if (!reference || !safePath(reference.path) || !Number.isSafeInteger(reference.size) || reference.size <= 0 ||
        reference.size > 67108864 || !/^[a-f0-9]{64}$/.test(reference.sha256)) throw new Error("Invalid Global CP reference");
    const bytes = await read(`${root}/${reference.path}`, reference.size);
    if (bytes.length !== reference.size || await hash(bytes) !== reference.sha256) throw new Error("Global CP checksum mismatch");
    const body = parse(bytes);
    if (body.generatedAt !== generatedAt) throw new Error("Mixed Global CP generation");
    return body;
  }
  let indexTask = null, lastIndexAttempt = 0;
  function load(force = false) {
    if (indexTask) return indexTask;
    if (!force && Date.now() - lastIndexAttempt < 60000) return Promise.resolve(state.bundle);
    lastIndexAttempt = Date.now();
    indexTask = (async () => {
      try {
        const pointer = parse(await read(`${base}/main/data/client/notmeter-ranking-latest.json`, 65536));
        const week = globalThis.NotMeterWeeklyReset.globalWindow(pointer.generatedAt * 1000);
        if (pointer.schema !== "notmeter-global-cp-latest-v1" || !/^[a-f0-9]{40}$/.test(pointer.revision) ||
            !Number.isSafeInteger(pointer.generatedAt) || pointer.generatedAt > Date.now() / 1000 + 300 ||
            pointer.manifestPath !== "data/global-cp-manifest.json" || pointer.indexPath !== "data/notmeter-global-cp-ranking-v1.json")
          throw new Error("Invalid Global CP pointer");
        if (state.bundle && pointer.generatedAt < state.bundle.index.generatedAt) return state.bundle;
        if (state.bundle && pointer.generatedAt === state.bundle.index.generatedAt && pointer.manifestSha256 !== state.bundle.manifestSha256)
          throw new Error("Conflicting Global CP generation");
        const root = `${base}/${pointer.revision}`;
        const manifest = await verified(root, { path: pointer.manifestPath, size: pointer.manifestSize, sha256: pointer.manifestSha256 }, pointer.generatedAt);
        if (manifest.schema !== "notmeter-global-cp-manifest-v1" || !Array.isArray(manifest.files) ||
            new Set(manifest.files.map(f => f.path)).size !== manifest.files.length) throw new Error("Invalid Global CP manifest");
        const index = await verified(root, manifest.files.find(f => f.path === pointer.indexPath), pointer.generatedAt);
        if (index.schema !== "notmeter-global-cp-ranking-v1" || index.version !== 1 || index.serviceRegion !== "WW" ||
            index.cpMinimum !== 150000 || index.cpMaximumExclusive !== 1000000 || index.cpStep !== 25000 ||
            index.limit !== 20 || index.weeklyRewardLimit !== 5 || index.weekPolicy !== "ww-tue2330-america-los-angeles-v1" ||
            index.weekStart * 1000 !== week.start || index.weekEnd * 1000 !== week.end ||
            !Array.isArray(index.boards) || !Array.isArray(index.detailShards) || !Array.isArray(index.identityShards))
          throw new Error("Invalid Global CP index");
        const seen = new Set();
        if (index.aggregateViews !== undefined && !Array.isArray(index.aggregateViews)) throw new Error("Invalid Global CP views");
        for (const ref of [...index.boards, ...(index.aggregateViews || []), ...index.detailShards, ...index.identityShards]) {
          const authoritative = manifest.files.find(f => f.path === ref.path);
          if (!authoritative || !safePath(ref.path) || authoritative.sha256 !== ref.sha256 || authoritative.size !== ref.size || seen.has(ref.path))
            throw new Error("Invalid Global CP inventory");
          seen.add(ref.path);
        }
        for (const board of index.boards) {
          const key = JSON.stringify([board.period, board.bossKey, board.job, board.cpMinimum]);
          if (!["all", "weekly"].includes(board.period) || !validMinimum(board.cpMinimum) || seen.has(key) ||
              !globalThis.NotMeterGlobalRankingCatalog.jobs.includes(board.job) ||
              !globalThis.NotMeterGlobalRankingCatalog.dungeons.some(d => d.key !== "global-bakron" && d.bosses.some(b => b.key === board.bossKey)))
            throw new Error("Invalid Global CP board index");
          seen.add(key);
        }
        for (const board of index.aggregateViews || []) {
          const key = JSON.stringify([board.period, board.bossKey, board.job, board.cpMinimum]);
          if (!["all", "weekly"].includes(board.period) || !(board.cpMinimum === 0 || validMinimum(board.cpMinimum)) || seen.has(key) ||
              !globalThis.NotMeterGlobalRankingCatalog.jobs.includes(board.job) ||
              !globalThis.NotMeterGlobalRankingCatalog.dungeons.some(d => d.key !== "global-bakron" &&
                (board.bossKey === `${d.key}:all` || board.cpMinimum === 0 && d.bosses.some(b => b.key === board.bossKey))))
            throw new Error("Invalid Global aggregate view index");
          seen.add(key);
        }
        state.bundle = { root, index, revision: pointer.revision, manifestSha256: pointer.manifestSha256 }; state.error = false;
        if (force) { state.attempted = ""; state.lastAttempt = 0; }
        notify();
      } catch (error) { if (error.status !== 404 || state.bundle) state.error = true; }
      return state.bundle;
    })().finally(() => { indexTask = null; });
    return indexTask;
  }
  const validMinimum = value => Number.isInteger(value) && value >= 150000 && value < 1000000 && value % 25000 === 0;
  function validateBoard(body, reference, bundle) {
    const index = bundle.index;
    const view = reference.path.startsWith("data/global-cp/views/");
    if (body.schema !== (view ? "notmeter-global-cp-view-v1" : "notmeter-global-cp-board-v1") || body.period !== reference.period || body.bossKey !== reference.bossKey ||
        body.job !== reference.job || body.cpMinimum !== reference.cpMinimum || body.cpMaximumExclusive !== (view && body.cpMinimum === 0 ? 1000000 : body.cpMinimum + 25000) ||
        body.weekStart !== index.weekStart || body.weekEnd !== index.weekEnd || body.weekPolicy !== index.weekPolicy ||
        !Number.isSafeInteger(body.participants) || body.participants <= 0 || body.participants !== reference.participants ||
        !Array.isArray(body.distribution) || !Array.isArray(body.top) || body.top.length !== Math.min(20, body.participants))
      throw new Error("Invalid Global CP board");
    let previous = Infinity, count = 0;
    for (const entry of body.distribution) {
      if (!Array.isArray(entry) || entry.length !== 2 || !Number.isFinite(entry[0]) || entry[0] <= 0 || entry[0] >= previous ||
          !Number.isSafeInteger(entry[1]) || entry[1] <= 0) throw new Error("Invalid Global CP distribution");
      previous = entry[0]; count += entry[1];
    }
    if (count !== body.participants) throw new Error("Global CP participant mismatch");
    const threshold = fraction => { let seen = 0; const at = Math.max(1, Math.ceil(count * fraction));
      for (const [dps, n] of body.distribution) if ((seen += n) >= at) return dps; return 0; };
    if (body.top10Dps !== threshold(.10) || body.top25Dps !== threshold(.25)) throw new Error("Global CP threshold mismatch");
    previous = Infinity;
    const identities = new Set(), percentages = new Map(); let better = 0;
    for (const [dps, count] of body.distribution) { percentages.set(dps, Math.min(100, 100 * (better + 1) / body.participants)); better += count; }
    for (const [i, row] of body.top.entries()) {
      const identity = `${row.serverId}:${row.characterId || row.name}`;
      if (row.rank !== i + 1 || !Number.isFinite(row.dps) || row.dps <= 0 || row.dps > previous ||
          typeof row.name !== "string" || !row.name.trim() || row.name.length > 128 ||
          !globalThis.NotMeterGlobalFieldBossCatalog.serviceRegions.some(w => w.servers.some(s => s.id === row.serverId)) ||
          !Number.isInteger(row.combatPower) || row.combatPower < (body.cpMinimum || 150000) || row.combatPower >= body.cpMaximumExclusive ||
          !Number.isSafeInteger(row.battleEnd) || body.period === "weekly" && (row.battleEnd < index.weekStart * 1000 || row.battleEnd >= index.weekEnd * 1000) ||
          (view ? typeof row.weeklyEffectEligible !== "boolean" || body.period !== "weekly" && row.weeklyEffectEligible ||
            !globalThis.NotMeterGlobalRankingCatalog.dungeons.some(d => d.key === body.bossKey.split(":")[0] && d.bosses.some(b => b.key === row.bossKey)) :
            row.weeklyEffectEligible !== (body.period === "weekly" && i < 5)) ||
          row.topPercent !== percentages.get(row.dps) || identities.has(identity) ||
          row.detailAvailable !== Boolean(row.detailToken) || row.detailToken && (!/^[a-f0-9]{64}$/.test(row.detailToken) ||
            !index.detailShards.some(ref => ref.path === `data/global-cp/details/${row.detailToken.slice(0,2)}.json`) ||
            !Number.isInteger(row.actorId) || row.actorId <= 0 || !Number.isFinite(row.totalDamage) || row.totalDamage <= 0 ||
            !Number.isFinite(row.durationSeconds) || row.durationSeconds <= 0 || !Array.isArray(row.partyJobNames)))
        throw new Error("Invalid Global CP leader");
      identities.add(identity);
      previous = row.dps;
    }
    return { ...body, threshold };
  }
  function select(dungeonKey, bossIndex, period) {
    const bundle = state.bundle;
    if (!bundle) return null;
    const dungeon = globalThis.NotMeterGlobalRankingCatalog.dungeons.find(d => d.key === dungeonKey);
    const boss = dungeon?.bosses[bossIndex - 1];
    if (!dungeon || !boss && bossIndex !== 0) return null;
    const bossKey = boss?.key || `${dungeon.key}:all`;
    const key = JSON.stringify([bossKey, period, state.minimum]), attempt = `${bundle.revision}:${key}`;
    const current = state.selection?.key === key ? state.selection : null;
    if (current?.bundle.revision === bundle.revision) return current;
    if (state.loading || state.attempted === attempt && Date.now() - state.lastAttempt < 60000) return current;
    state.loading = true; state.attempted = attempt; state.lastAttempt = Date.now(); state.error = false;
    const inventory = state.minimum === 0 || bossIndex === 0 ? bundle.index.aggregateViews || [] : bundle.index.boards;
    const references = inventory.filter(b => b.bossKey === bossKey && b.period === (period === "Weekly" ? "weekly" : "all") && b.cpMinimum === state.minimum);
    void (async () => {
      try {
        const boards = []; let cursor = 0;
        await Promise.all(Array.from({ length: Math.min(4, references.length) }, async () => {
          while (cursor < references.length) {
            const ref = references[cursor++];
            boards.push(validateBoard(await verified(bundle.root, ref, bundle.index.generatedAt), ref, bundle));
          }
        }));
        state.selection = { key, bundle, boards }; state.error = false;
      } catch { state.error = true; }
      finally { state.loading = false; notify(); }
    })();
    return current;
  }
  const usable = selection => selection && (JSON.parse(selection.key)[1] !== "Weekly" ||
    Date.now() / 1000 >= selection.bundle.index.weekStart && Date.now() / 1000 < selection.bundle.index.weekEnd);
  function rows(selection) {
    if (!usable(selection)) return [];
    return selection.boards.flatMap(b => b.top.map(p => ({ ...p, job: b.job, period: b.period, bossKey: p.bossKey || b.bossKey,
      targetName: globalThis.NotMeterGlobalRanking.targetName({ ...p, bossKey: p.bossKey || b.bossKey }),
      globalRegion: globalThis.NotMeterGlobalFieldBossCatalog.serviceRegions.find(w => w.servers.some(s => s.id === p.serverId))?.key || "",
      _cp: true, _cpRoot: selection.bundle.root, _cpGeneratedAt: selection.bundle.index.generatedAt,
      _cpDetail: selection.bundle.index.detailShards.find(ref => ref.path.endsWith(`/${p.detailToken?.slice(0, 2)}.json`)) })));
  }
  function summary(selection, job) {
    const board = usable(selection) && selection.boards.find(b => b.job === job);
    return { jobName: job, sampleCount: board?.participants || 0, p90Dps: board?.top10Dps || 0,
      p75Dps: board?.top25Dps || 0, averageDps: 0, medianDps: board?.threshold(.5) || 0,
      minDps: board?.distribution.at(-1)?.[0] || 0, maxDps: board?.distribution[0]?.[0] || 0 };
  }
  const detailLoads = new Map();
  const characterLoads = new Map();
  async function characterRows(identity) {
    const bundle = await load();
    if (!bundle || !globalThis.NotMeterGlobalRankingCatalog.jobs.includes(identity.job)) return [];
    const server = Number(identity.serverId), name = String(identity.name || "").trim().normalize("NFC");
    let official = String(identity.characterId || "").trim();
    try { official = decodeURIComponent(official).normalize("NFC"); } catch { return []; }
    const cacheKey = JSON.stringify([bundle.revision, server, name, official, identity.job]);
    if (characterLoads.has(cacheKey)) return characterLoads.get(cacheKey);
    const task = (async () => {
      const entries = [];
      for (const [kind, value] of [["id", official], ["name", name]]) {
        if (!value) continue;
        const key = await hash(new TextEncoder().encode([kind, String(server), value, identity.job].join("\n")));
        const ref = bundle.index.identityShards.find(s => s.path === `data/global-cp/identities/${key.slice(0, 2)}.json`);
        if (!ref) continue;
        const shard = await verified(bundle.root, ref, bundle.index.generatedAt);
        if (shard.schema !== "notmeter-global-cp-identities-v1" || !shard.characters || !Array.isArray(shard.characters[key] || []))
          throw new Error("Invalid Global CP character shard");
        entries.push(...(shard.characters[key] || []));
        if (entries.length) break;
      }
      const references = new Map(), seen = new Set();
      for (const entry of entries) {
        const ref = bundle.index.boards.find(b => b.id === entry.board && b.job === identity.job);
        if (!ref || !Number.isInteger(entry.rank) || entry.rank < 0 || entry.rank > Math.min(20, ref.participants) ||
            !Number.isInteger(entry.combatPower) || entry.combatPower < ref.cpMinimum || entry.combatPower >= ref.cpMinimum + 25000 ||
            !Number.isFinite(entry.dps) || entry.dps <= 0 || !Number.isFinite(entry.topPercent) ||
            entry.topPercent < 100 / ref.participants - 1e-9 || entry.topPercent > 100 ||
            Math.abs(entry.topPercent * ref.participants / 100 - Math.round(entry.topPercent * ref.participants / 100)) > 1e-7 ||
            entry.rank > 0 && entry.topPercent > 100 * entry.rank / ref.participants + 1e-9 ||
            entry.weeklyEffectEligible !== (ref.period === "weekly" && entry.rank > 0 && entry.rank <= 5))
          throw new Error("Invalid Global CP character placement");
        if (seen.has(ref.id)) return [];
        seen.add(ref.id);
        if (ref.period === "weekly" && (Date.now() / 1000 < bundle.index.weekStart || Date.now() / 1000 >= bundle.index.weekEnd)) continue;
        if (entry.rank > 0) references.set(ref.id, ref);
      }
      const result = [], refs = [...references.values()]; let cursor = 0;
      await Promise.all(Array.from({length: Math.min(4, refs.length)}, async () => {
        while (cursor < refs.length) {
          const ref = refs[cursor++];
          const board = validateBoard(await verified(bundle.root, ref, bundle.index.generatedAt), ref, bundle);
          const dungeonOrder = globalThis.NotMeterGlobalRankingCatalog.dungeons.findIndex(d => d.bosses.some(b => b.key === board.bossKey));
          const dungeon = globalThis.NotMeterGlobalRankingCatalog.dungeons[dungeonOrder];
          for (const row of rows({key: JSON.stringify([board.bossKey, board.period === "weekly" ? "Weekly" : "All", board.cpMinimum]), bundle, boards: [board]})) {
            if (row.serverId !== server || (official && row.characterId ? row.characterId !== official : row.name.normalize("NFC") !== name)) continue;
            result.push({...row, dungeonOrder, dungeonKey: dungeon.key, bossIndex: dungeon.bosses.findIndex(b => b.key === board.bossKey) + 1,
              cpMinimum: board.cpMinimum, cpMaximumExclusive: board.cpMaximumExclusive});
          }
        }
      }));
      return result.sort((a, b) => a.dungeonOrder - b.dungeonOrder || a.bossIndex - b.bossIndex || a.cpMinimum - b.cpMinimum || a.period.localeCompare(b.period));
    })().catch(error => { characterLoads.delete(cacheKey); throw error; });
    characterLoads.set(cacheKey, task);
    while (characterLoads.size > 4) characterLoads.delete(characterLoads.keys().next().value);
    return task;
  }
  async function detail(row) {
    if (!row._cp || !new RegExp(`^${base.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}/[a-f0-9]{40}$`).test(row._cpRoot))
      throw new Error("Invalid Global CP detail root");
    const key = `${row._cpRoot}/${row._cpDetail?.path}`;
    if (detailLoads.has(key)) return detailLoads.get(key);
    const task = verified(row._cpRoot, row._cpDetail, row._cpGeneratedAt).then(shard => {
      if (shard.schema !== "notmeter-global-cp-details-v1") throw new Error("Invalid Global CP detail shard");
      return shard;
    }).catch(error => { detailLoads.delete(key); throw error; });
    detailLoads.set(key, task);
    while (detailLoads.size > 4) detailLoads.delete(detailLoads.keys().next().value);
    return task;
  }
  globalThis.NotMeterGlobalCpRanking = { state, load, select, rows, summary, detail, characterRows, validateBoard, validMinimum, text,
    active: key => Boolean(state.bundle) && (key !== "global-training-dummy-60s" || state.bundle.index.trainingDummyCp === true),
    options: (allLabel = "All CP") => [{ value: "preset:0", label: allLabel, minCombatPower: 0, quick: true },
      ...Array.from({ length: 34 }, (_, i) => ({ value: `preset:${150000 + i * 25000}`,
      label: `${150 + i * 25}K~${175 + i * 25}K`, minCombatPower: 150000 + i * 25000, maxCombatPowerExclusive: 175000 + i * 25000 }))] };
})();
