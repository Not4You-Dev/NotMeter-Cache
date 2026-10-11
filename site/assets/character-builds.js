(() => {
  "use strict";
  const words = {
    ko: ["전송한 스킬트리", "캐릭터 주인이 전송한 스킬 레벨과 선택 특성입니다.", "갱신", "전송 기록을 확인하는 중…", "전송 기록을 확인하지 못했습니다. 랭킹 기록이 있으면 대신 표시합니다.", "다시 시도"],
    en: ["Shared skill build", "Skill levels and specializations shared by the character's owner.", "Updated", "Checking shared builds…", "Could not check shared builds. Ranking records are shown when available.", "Try again"],
    "zh-TW": ["已傳送的技能配置", "角色主人傳送的技能等級與選擇的特化。", "更新", "正在查詢已傳送的配置…", "無法查詢已傳送的配置。如有排名紀錄，將改為顯示。", "重試"],
    "ja-JP": ["共有されたスキル構成", "キャラクターの所有者が送信したスキルレベルと選択した特化です。", "更新", "共有された構成を確認中…", "共有された構成を確認できませんでした。ランキング記録がある場合は代わりに表示します。", "再試行"],
    "de-DE": ["Geteilter Skill-Build", "Vom Charakterbesitzer geteilte Skill-Level und Spezialisierungen.", "Aktualisiert", "Geteilte Builds werden geprüft…", "Geteilte Builds konnten nicht geprüft werden. Ranglistendaten werden angezeigt, sofern verfügbar.", "Erneut versuchen"],
    "fr-FR": ["Configuration partagée", "Niveaux des compétences et spécialisations partagés par le propriétaire du personnage.", "Mise à jour", "Vérification des configurations partagées…", "Impossible de vérifier les configurations partagées. Les données du classement sont affichées si disponibles.", "Réessayer"],
    "es-ES": ["Configuración compartida", "Niveles de habilidad y especializaciones compartidos por el dueño del personaje.", "Actualizada", "Comprobando configuraciones compartidas…", "No se pudieron comprobar las configuraciones compartidas. Se muestran los registros del ranking cuando están disponibles.", "Reintentar"],
    "pt-BR": ["Build compartilhada", "Níveis das habilidades e especializações compartilhados pelo dono do personagem.", "Atualizada", "Verificando builds compartilhadas…", "Não foi possível verificar as builds compartilhadas. Os registros do ranking são exibidos quando disponíveis.", "Tentar novamente"],
    "ru-RU": ["Опубликованная сборка", "Уровни навыков и специализации, отправленные владельцем персонажа.", "Обновлено", "Проверка опубликованных сборок…", "Не удалось проверить опубликованные сборки. При наличии показаны данные рейтинга.", "Повторить"],
  };
  function copy(locale) { return Object.fromEntries(["title", "note", "updated", "loading", "error", "retry"].map((key, i) => [key, (words[locale] || words.en)[i]])); }
  function identity(profile, params, region) {
    let characterId = String(profile?.characterId || params.get("characterId") || "").trim();
    try { characterId = decodeURIComponent(characterId); } catch { characterId = ""; }
    return { region: String(region).toUpperCase(), serverId: Number(profile?.serverId || params.get("serverId")), characterId };
  }
  const key = id => JSON.stringify([id.region, id.serverId, id.characterId]);
  function validate(data, id) {
    if (data?.version !== 2 || key(data) !== key(id) || !Number.isSafeInteger(data.generatedAt) || data.generatedAt < 0 ||
        !Array.isArray(data.modes) || data.modes.length > 2 || new Set(data.modes.map(m => m?.mode)).size !== data.modes.length)
      throw new Error("Invalid character build cache");
    for (const mode of data.modes) {
      if (!["PVE", "PVP"].includes(mode.mode) || !Number.isSafeInteger(mode.submittedAt) || mode.submittedAt <= 0 || mode.submittedAt > data.generatedAt ||
          !Array.isArray(mode.build) || !mode.build.length || mode.build.length > 128 ||
          new Set(mode.build.map(s => s?.[0])).size !== mode.build.length || !mode.build.some(s => s?.length === 3)) throw new Error("Invalid character build");
      for (const row of mode.build) if (!Array.isArray(row) || ![2, 3].includes(row.length) || !row.every(Number.isInteger) ||
          row[0] < 11000000 || row[0] > 19999999 || row[0] % 10000 !== 0 || row[1] < 1 || row[1] > 99 ||
          (row.length === 3 && (row[2] < 0 || row[2] > 31))) throw new Error("Invalid skill selection");
    }
    return data;
  }
  function select(cache, mode) {
    const modes = cache?.modes || [];
    const selected = modes.find(m => m.mode === mode) || modes.find(m => m.mode === "PVE") || modes[0];
    if (!selected) return null;
    return { status: "ready", kind: "submitted", mode: selected.mode, submittedAt: selected.submittedAt,
      flags: new Map(selected.build.filter(s => s.length === 3).map(s => [s[0], Array.from({ length: 5 }, (_, i) => Boolean(s[2] & (1 << i)))])),
      levels: new Map(selected.build.filter(s => s.length === 3 && s[2] > 0).map(s => [s[0], s[1]])), sources: new Map(), row: null,
      modes: modes.map(m => m.mode), showTabs: modes.some(m => m.mode === "PVP") && modes.some(m => m.mode === "PVE") };
  }
  globalThis.NotMeterCharacterBuilds = Object.freeze({ identity, key, validate, select, copy });
})();
