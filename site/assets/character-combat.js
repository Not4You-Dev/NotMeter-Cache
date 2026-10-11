(function (root) {
  "use strict";

  const characterId = "rKx-d-9c8YwO5HqimeieGKFfAjEyjWj6vSvkkuQtXQo=";
  function matches(profile, params, region, globalRegion) {
    return region === "ww" && globalRegion === "nae" &&
      Number(profile?.serverId || params.get("serverId")) === 1101 &&
      String(profile?.characterId || params.get("characterId") || "") === characterId;
  }

  function latest(rows) {
    return (Array.isArray(rows) ? rows : []).reduce((result, row) => {
      const time = Number(row.battleEnd);
      return Number.isFinite(time) && time > 0 && (!result || time > Number(result.battleEnd)) ? row : result;
    }, null);
  }

  // The regional index and class cache round DPS differently. Match the complete
  // published record, never just a nickname, rank or the currently selected tab.
  function regionalPlayer(row, ranking, identity) {
    const name = String(identity.name || "").trim().normalize("NFC");
    const parts = typeof Intl.Segmenter === "function"
      ? [...new Intl.Segmenter(undefined, { granularity: "grapheme" }).segment(name)].map(part => part.segment)
      : Array.from(name);
    const masked = parts.length <= 1 ? "*" : parts[0] + "*".repeat(parts.length - 1);
    const candidates = new Map();
    const byTier = new Map();
    for (const view of ranking?.views || []) {
      if (Number(view.bossIndex) !== row.bossIndex || view.period !== "All") continue;
      const views = byTier.get(view.cpTierIndex) || [];
      views.push(view);
      byTier.set(view.cpTierIndex, views);
    }
    for (const views of byTier.values()) {
      // The publisher appends the current-week All view after the all-time one.
      if (row.periodKey === "weekly" && views.length < 2) continue;
      const view = row.periodKey === "weekly" ? views.at(-1) : views[0];
      const job = view.rows?.find(value => value.jobName === identity.job);
      // A 25K nDPS placement can be outside the broader class nDPS TOP 20,
      // while the exact same fight is still published in the DPS list.
      const players = [...(job?.players || []), ...(job?.Y || [])];
      for (const player of players || []) {
        const publishedName = String(player.name || "").trim().normalize("NFC");
        if (![row.combatPower, row.dps, row.durationSeconds, player.combatPower, player.dps, player.durationSeconds].every(value => Number.isFinite(Number(value)) && Number(value) > 0) ||
            Number(player.serverId) !== Number(identity.serverId) ||
            ![name, masked].includes(publishedName) ||
            Number(player.combatPower) !== row.combatPower ||
            Math.abs(Number(player.dps) - row.dps) > 0.501 ||
            Math.abs(Number(player.durationSeconds) - row.durationSeconds) > 0.000501 ||
            (row.rankingUnit === "nDPS" && (!(Number(player.Y) > 0) || Math.abs(Number(player.Y) - row.rankingValue) > 0.501))) continue;
        const key = String(player.Q || "");
        if (/^[0-9a-f]{64}$/.test(key)) candidates.set(key, player);
      }
    }
    return candidates.size === 1 ? candidates.values().next().value : null;
  }

  async function forEachLimited(items, action, isCurrent = () => true) {
    let next = 0;
    await Promise.all(Array.from({ length: Math.min(2, items.length) }, async () => {
      while (next < items.length && isCurrent()) {
        const index = next++;
        await action(items[index], index);
      }
    }));
  }

  async function loadLatest(rows, load, isCurrent = () => true) {
    if (!rows.length) return null;
    let available = rows;
    let partial = false;
    const documents = new Map();
    if (rows.some(row => row.detailRegion !== "ww")) {
      // KR/TW's compact index has no battle timestamps. Resolve each unique
      // published fight once, with bounded concurrency and the shared detail cache.
      available = rows.filter(row => /^[0-9a-f]{64}$/.test(row.detailLookupKey || ""));
      if (rows.some(row => !available.includes(row) && !row.detailResolved)) {
        throw new Error("ranking fight lookup failed");
      }
      partial = available.length !== rows.length;
      const groups = new Map();
      for (const row of available) {
        const key = `${row.dungeonKey}|${row.detailLookupKey}`;
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key).push(row);
      }
      let failed = false;
      await forEachLimited([...groups.values()], async group => {
        try {
          const document = await load(group[0]);
          const time = Date.parse(document.record?.battleEnd);
          const actorId = Number(document.selectors?.[group[0].detailLookupKey]);
          if (!(time > 0) || !(actorId > 0)) throw new Error("ranking fight identity unavailable");
          for (const row of group) {
            Object.assign(row, { battleEnd: time, actorId });
            documents.set(row, document);
          }
        } catch (error) {
          if (error?.status === 404) partial = true;
          else failed = true;
        }
      }, isCurrent);
      if (failed) throw new Error("latest ranking fight could not be verified");
      available = available.filter(row => documents.has(row));
    }
    if (!isCurrent()) return null;
    if (!available.length) return { row: null, document: null, partial };
    const row = latest(available);
    if (!row) throw new Error("ranking fight time unavailable");
    return { row, document: documents.get(row) || await load(row), partial };
  }

  function specializations(document, actorId) {
    const player = document?.record?.players?.find(value => Number(value.actorId) === Number(actorId));
    const result = new Map();
    const effects = new Map();
    const remember = (target, code, flags) => {
      if (!target.has(code)) target.set(code, flags.slice());
      else if (target.get(code)?.some((value, index) => value !== flags[index])) target.set(code, null);
    };
    for (const recorded of player?.skills || []) {
      const skill = document?.dungeonKey?.startsWith("global-") && root.NotMeterGlobalRanking
        ? root.NotMeterGlobalRanking.normalizeDetailSkill(recorded) : recorded;
      const code = Number(skill.skillCode), raw = Number(skill.rawSkillCode || code);
      const flags = skill.specializationFlags;
      if (!Number.isSafeInteger(code) || !Number.isSafeInteger(raw) ||
          !Array.isArray(flags) || flags.length !== 5 ||
          flags.some(value => typeof value !== "boolean")) continue;
      if (raw >= 110000000 && raw <= 199999999) {
        // Buff-only casts retain an abnormal ID (e.g. 153104501), not the profile's skill ID.
        // Use only the ranked actor's recorded skill flags, never received party buffs.
        const family = Math.floor(raw / 100000) * 10000;
        const storedFamily = code > 99999999 ? Math.floor(code / 100000) * 10000 : code;
        // An unmodified secondary effect cannot prove that its source skill has no traits.
        if (storedFamily === family && flags.some(Boolean)) remember(effects, family, flags);
      } else if (code >= 10000000 && code <= 99999999 && raw > 0 && raw <= 99999999) {
        remember(result, code, flags);
      }
    }
    // A secondary slow/bleed effect can have fewer flags than the actual cast.
    // It must not erase the specialization selection recorded on that cast.
    for (const [code, flags] of effects) if (!result.has(code)) result.set(code, flags);
    return result;
  }

  async function loadSpecializations(rows, load, { skillIds = null, isCurrent = () => true, onProgress = () => {} } = {}) {
    const documents = new Map();
    const keyOf = row => {
      const token = row.detailRegion === "ww" ? row.detailToken : row.detailLookupKey;
      return token ? [row.detailRegion, row.detailGeneration, row.dungeonKey || row.bossKey,
        token, row.detailRegion === "ww" ? row.actorId : ""].join("|") : row;
    };
    const read = row => {
      const key = keyOf(row);
      if (!documents.has(key)) documents.set(key, Promise.resolve().then(() => load(row)));
      return documents.get(key);
    };
    const result = await loadLatest(rows, read, isCurrent);
    if (!result || !isCurrent()) return null;
    result.flags = new Map();
    result.sources = new Map();
    result.loadingHistory = false;
    result.historyFailed = false;
    if (!result.document) return result;
    const wanted = skillIds ? new Set(skillIds) : null;
    const merge = (document, row) => {
      for (const [code, flags] of specializations(document, row.actorId)) {
        // An explicit empty selection or conflicting cast in a newer fight blocks older builds.
        if ((!wanted || wanted.has(code)) && !result.flags.has(code)) {
          result.flags.set(code, flags);
          result.sources.set(code, row);
        }
      }
    };
    const complete = () => wanted && [...wanted].every(code => result.flags.has(code));
    merge(result.document, result.row);
    const seen = new Set([keyOf(result.row)]);
    const older = rows.filter(row => Number(row.battleEnd) > 0 && Number(row.battleEnd) <= Number(result.row.battleEnd))
      .slice().sort((a, b) => Number(b.battleEnd) - Number(a.battleEnd)).filter(row => {
        const key = keyOf(row);
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    result.loadingHistory = !complete() && older.length > 0;
    onProgress(result);
    for (const row of older) {
      if (!isCurrent()) return null;
      if (complete()) break;
      try {
        const document = await read(row);
        if (!isCurrent()) return null;
        merge(document, row);
        onProgress(result);
      } catch (error) {
        if (!isCurrent()) return null;
        if (error?.status === 404) continue;
        // Do not jump over an unread fight and present an older selection as the most recent one.
        result.historyFailed = true;
        break;
      }
    }
    result.loadingHistory = false;
    return isCurrent() ? result : null;
  }

  const keys = ["title", "note", "loading", "unavailable", "empty", "unknown", "selected", "detail", "label"];
  const translations = {
    ko: ["최근 전투의 스킬 특성", "최근 공개 랭킹 기록에서 확인된 특성입니다. 현재 설정과 다를 수 있습니다. 밝은 번호가 선택된 특성입니다.", "최근 전투의 특성을 불러오는 중…", "이 전투의 특성 정보를 불러오지 못했습니다.", "공개된 랭킹 기록이 없습니다.", "기록 없음", "선택된 특성", "전투 상세", "특성"],
    en: ["Skill specializations from the latest fight", "From the most recent published ranking record; your current setup may differ. Highlighted numbers are selected specializations.", "Loading specializations from the latest fight…", "Could not load specializations for this fight.", "No published ranking records.", "Not recorded", "Selected specializations", "Combat details", "Specializations"],
    "zh-TW": ["最近一場戰鬥的技能特化", "取自最近公布的排名紀錄，可能與目前配置不同。亮起的數字表示已選擇的特化。", "正在載入最近一場戰鬥的特化…", "無法載入這場戰鬥的特化資料。", "沒有已公布的排名紀錄。", "未記錄", "已選擇的特化", "戰鬥詳情", "特化"],
    "ja-JP": ["直近の戦闘でのスキル特化", "公開済みランキングの最新の戦闘記録です。現在の設定とは異なる場合があります。明るい番号が選択された特化です。", "直近の戦闘の特化を読み込み中…", "この戦闘の特化情報を読み込めませんでした。", "公開済みのランキング記録がありません。", "記録なし", "選択された特化", "戦闘詳細", "特化"],
    "de-DE": ["Skill-Spezialisierungen aus dem letzten Kampf", "Aus dem neuesten veröffentlichten Ranglisteneintrag. Die aktuelle Konfiguration kann abweichen. Markierte Zahlen zeigen gewählte Spezialisierungen.", "Spezialisierungen des letzten Kampfes werden geladen…", "Die Spezialisierungen dieses Kampfes konnten nicht geladen werden.", "Keine veröffentlichten Ranglisteneinträge.", "Nicht erfasst", "Gewählte Spezialisierungen", "Kampfdetails", "Spezialisierungen"],
    "fr-FR": ["Spécialisations de compétences du dernier combat", "Tirées du combat le plus récent publié au classement. La configuration actuelle peut différer. Les numéros en surbrillance indiquent les spécialisations choisies.", "Chargement des spécialisations du dernier combat…", "Impossible de charger les spécialisations de ce combat.", "Aucun résultat publié au classement.", "Non enregistré", "Spécialisations choisies", "Détails du combat", "Spécialisations"],
    "es-ES": ["Especializaciones de habilidades del último combate", "Del combate más reciente publicado en la clasificación. La configuración actual puede ser distinta. Los números resaltados indican las especializaciones elegidas.", "Cargando especializaciones del último combate…", "No se pudieron cargar las especializaciones de este combate.", "No hay registros publicados en la clasificación.", "Sin registrar", "Especializaciones elegidas", "Detalles del combate", "Especializaciones"],
    "pt-BR": ["Especializações de habilidades do último combate", "Do combate mais recente publicado no ranking. A configuração atual pode ser diferente. Os números destacados indicam as especializações escolhidas.", "Carregando especializações do último combate…", "Não foi possível carregar as especializações deste combate.", "Nenhum registro publicado no ranking.", "Não registrado", "Especializações escolhidas", "Detalhes do combate", "Especializações"],
    "ru-RU": ["Специализации навыков в последнем бою", "Из самого свежего опубликованного результата рейтинга. Текущие настройки могут отличаться. Выбранные специализации выделены яркими номерами.", "Загрузка специализаций последнего боя…", "Не удалось загрузить специализации этого боя.", "Нет опубликованных результатов рейтинга.", "Нет данных", "Выбранные специализации", "Подробности боя", "Специализации"],
  };
  const partialTranslations = {
    ko: ["확인 가능한 최근 전투의 스킬 특성", "일부 랭킹에는 공개된 전투 상세가 없어, 확인 가능한 기록 중 가장 최근 전투의 특성을 표시합니다. 현재 설정과 다를 수 있습니다. 밝은 번호가 선택된 특성입니다."],
    en: ["Skill specializations from the latest available fight", "Some ranking entries have no published combat details. These specializations are from the latest available fight and may differ from the current setup. Highlighted numbers are selected specializations."],
    "zh-TW": ["最近可查閱戰鬥的技能特化", "部分排名紀錄沒有公開的戰鬥詳情，因此顯示可查閱紀錄中最近一場戰鬥的特化，可能與目前配置不同。亮起的數字表示已選擇的特化。"],
    "ja-JP": ["確認できる直近の戦闘でのスキル特化", "一部のランキング記録には公開された戦闘詳細がないため、確認できる最新の戦闘の特化を表示します。現在の設定とは異なる場合があります。明るい番号が選択された特化です。"],
    "de-DE": ["Skill-Spezialisierungen aus dem letzten verfügbaren Kampf", "Einige Ranglisteneinträge haben keine veröffentlichten Kampfdetails. Angezeigt werden die Spezialisierungen des letzten verfügbaren Kampfes. Die aktuelle Konfiguration kann abweichen. Markierte Zahlen zeigen gewählte Spezialisierungen."],
    "fr-FR": ["Spécialisations de compétences du dernier combat disponible", "Certains résultats du classement n’ont pas de détails de combat publiés. Les spécialisations affichées proviennent du dernier combat disponible et peuvent différer de la configuration actuelle. Les numéros en surbrillance indiquent les spécialisations choisies."],
    "es-ES": ["Especializaciones de habilidades del último combate disponible", "Algunos registros de la clasificación no tienen detalles de combate publicados. Se muestran las especializaciones del último combate disponible; pueden diferir de la configuración actual. Los números resaltados indican las especializaciones elegidas."],
    "pt-BR": ["Especializações de habilidades do último combate disponível", "Alguns registros do ranking não têm detalhes de combate publicados. As especializações são do último combate disponível e podem diferir da configuração atual. Os números destacados indicam as especializações escolhidas."],
    "ru-RU": ["Специализации навыков в последнем доступном бою", "Для некоторых результатов рейтинга подробности боя не опубликованы. Показаны специализации из последнего доступного боя; они могут отличаться от текущих настроек. Выбранные специализации выделены яркими номерами."],
  };
  const historyKeys = ["historyTitle", "historyNote", "earlier", "historyLoading", "historyUnavailable"];
  const historyTranslations = {
    ko: ["스킬별 최근 확인 특성", "공개 랭킹의 최신 전투부터 확인하고, 비어 있는 스킬만 이전 기록으로 보완합니다. 현재 설정과 다를 수 있습니다. 이전 기록의 날짜를 누르면 해당 전투를 볼 수 있습니다.", "이전 기록", "비어 있는 스킬을 이전 기록에서 확인하는 중…", "이전 기록 일부를 불러오지 못했습니다. 확인된 특성은 유지됩니다."],
    en: ["Latest recorded specializations for each skill", "The latest published ranking fight is checked first. Missing skills are filled from earlier fights, so this may differ from the current setup. Select an earlier record’s date to view that fight.", "Earlier record", "Checking earlier fights for missing skills…", "Some earlier fights could not be loaded. Verified specializations are still shown."],
    "zh-TW": ["各技能最近記錄的特化", "優先使用最新公開排名戰鬥的資料，僅以較早的紀錄補上缺少的技能，可能與目前配置不同。點選較早紀錄的日期可查看該場戰鬥。", "較早紀錄", "正在從較早的紀錄查找缺少的技能…", "部分較早的戰鬥紀錄無法載入，已確認的特化仍會顯示。"],
    "ja-JP": ["各スキルで最後に確認された特化", "公開ランキングの最新の戦闘を優先し、記録のないスキルだけを過去の戦闘から補います。現在の設定とは異なる場合があります。過去の記録の日付を選ぶと、その戦闘を確認できます。", "過去の記録", "過去の戦闘から未記録のスキルを確認中…", "一部の過去の戦闘を読み込めませんでした。確認済みの特化は引き続き表示されます。"],
    "de-DE": ["Zuletzt erfasste Spezialisierungen je Skill", "Der neueste veröffentlichte Ranglistenkampf hat Vorrang. Fehlende Skills werden aus früheren Kämpfen ergänzt; die aktuelle Konfiguration kann abweichen. Über das Datum eines früheren Eintrags lassen sich dessen Kampfdetails öffnen.", "Früherer Eintrag", "Frühere Kämpfe werden nach fehlenden Skills durchsucht…", "Einige frühere Kämpfe konnten nicht geladen werden. Bereits bestätigte Spezialisierungen bleiben sichtbar."],
    "fr-FR": ["Dernières spécialisations enregistrées par compétence", "Le combat le plus récent publié au classement est prioritaire. Seules les compétences manquantes sont complétées à partir de combats antérieurs ; la configuration actuelle peut différer. Sélectionnez la date d’un ancien enregistrement pour consulter ce combat.", "Ancien enregistrement", "Recherche des compétences manquantes dans les combats antérieurs…", "Certains combats antérieurs n’ont pas pu être chargés. Les spécialisations déjà confirmées restent affichées."],
    "es-ES": ["Últimas especializaciones registradas por habilidad", "Se da prioridad al combate más reciente publicado en la clasificación. Solo las habilidades que faltan se completan con combates anteriores; la configuración actual puede ser distinta. Selecciona la fecha de un registro anterior para ver ese combate.", "Registro anterior", "Buscando las habilidades que faltan en combates anteriores…", "No se pudieron cargar algunos combates anteriores. Las especializaciones verificadas siguen visibles."],
    "pt-BR": ["Últimas especializações registradas por habilidade", "O combate mais recente publicado no ranking tem prioridade. Apenas habilidades sem dados são preenchidas com combates anteriores; a configuração atual pode ser diferente. Selecione a data de um registro anterior para ver esse combate.", "Registro anterior", "Buscando habilidades sem dados nos combates anteriores…", "Não foi possível carregar alguns combates anteriores. As especializações já verificadas continuam visíveis."],
    "ru-RU": ["Последние записанные специализации каждого навыка", "Приоритет у самого свежего боя, опубликованного в рейтинге. Данные отсутствующих навыков дополняются из более ранних боёв и могут отличаться от текущих настроек. Нажмите на дату более ранней записи, чтобы открыть этот бой.", "Ранняя запись", "Поиск недостающих навыков в более ранних боях…", "Не удалось загрузить некоторые ранние бои. Подтверждённые специализации остаются на экране."],
  };
  function copy(locale) {
    const values = translations[locale] || translations.en;
    const partial = partialTranslations[locale] || partialTranslations.en;
    const history = historyTranslations[locale] || historyTranslations.en;
    return { ...Object.fromEntries(keys.map((key, index) => [key, values[index]])),
      ...Object.fromEntries(historyKeys.map((key, index) => [key, history[index]])),
      partialTitle: partial[0], partialNote: partial[1] };
  }
  root.NotMeterCharacterCombat = Object.freeze({ matches, latest, specializations, regionalPlayer, forEachLimited, loadLatest, loadSpecializations, copy });
})(globalThis);
