(() => {
  "use strict";
  const locales = new Set(["ko", "en", "zh-TW", "ja-JP", "de-DE", "fr-FR", "es-ES", "pt-BR", "ru-RU"]);
  const catalogs = new Map();
  const requests = new Map();
  const introductions = {
    "ko": "스킬 레벨과 1~5번 특성 효과를 함께 확인하세요. 색상과 체크 표시가 있는 항목은 전송한 스킬트리 또는 전투 기록의 선택 특성입니다.",
    "en": "Compare skill levels and all five specialization effects. Highlighted rows with a check mark show selections from the shared build or recorded fight.",
    "zh-TW": "查看技能等級與1～5號特化效果。以顏色及勾號標示的項目，來自已傳送的技能配置或戰鬥紀錄。",
    "ja-JP": "スキルレベルと1～5番の特化効果を確認できます。色とチェックマークは、共有されたスキル構成または戦闘記録で選択された特化を示します。",
    "de-DE": "Vergleiche Skill-Level und alle fünf Spezialisierungseffekte. Farbige Zeilen mit Häkchen zeigen die Auswahl des geteilten Builds oder aufgezeichneten Kampfes.",
    "fr-FR": "Comparez les niveaux des compétences et les cinq effets de spécialisation. Les lignes colorées et cochées indiquent les choix de la configuration partagée ou du combat enregistré.",
    "es-ES": "Compara los niveles de habilidad y los cinco efectos de especialización. Las filas resaltadas con una marca muestran las selecciones de la configuración compartida o del combate registrado.",
    "pt-BR": "Compare os níveis das habilidades e os cinco efeitos de especialização. As linhas destacadas com uma marca mostram as escolhas da build compartilhada ou do combate registrado.",
    "ru-RU": "Сравните уровни навыков и эффекты всех пяти специализаций. Цветные строки с галочкой показывают выбор в опубликованной сборке или записанном бою."
};
  const words = {
    ko: ["선택", "선택 안 함", "특성 설명을 불러오는 중…", "특성 설명을 불러오지 못했습니다.", "다시 시도", "설명 미확인", "영문 원문"],
    en: ["Selected", "Not selected", "Loading specialization descriptions…", "Could not load specialization descriptions.", "Try again", "Description unavailable", "English source"],
    "zh-TW": ["已選擇", "未選擇", "正在載入特化說明…", "無法載入特化說明。", "重試", "暫無說明", "英文原文"],
    "ja-JP": ["選択済み", "未選択", "特化の説明を読み込み中…", "特化の説明を読み込めませんでした。", "再試行", "説明なし", "英語原文"],
    "de-DE": ["Gewählt", "Nicht gewählt", "Beschreibungen der Spezialisierungen werden geladen…", "Beschreibungen konnten nicht geladen werden.", "Erneut versuchen", "Beschreibung nicht verfügbar", "Englischer Originaltext"],
    "fr-FR": ["Sélectionnées", "Non sélectionnée", "Chargement des descriptions des spécialisations…", "Impossible de charger les descriptions.", "Réessayer", "Description indisponible", "Texte original anglais"],
    "es-ES": ["Seleccionadas", "Sin seleccionar", "Cargando descripciones de especializaciones…", "No se pudieron cargar las descripciones.", "Reintentar", "Descripción no disponible", "Texto original en inglés"],
    "pt-BR": ["Selecionadas", "Não selecionada", "Carregando descrições das especializações…", "Não foi possível carregar as descrições.", "Tentar novamente", "Descrição indisponível", "Texto original em inglês"],
    "ru-RU": ["Выбрано", "Не выбрано", "Загрузка описаний специализаций…", "Не удалось загрузить описания.", "Повторить", "Описание недоступно", "Оригинал на английском"],
  };
  function identity(region, locale) {
    return { region: region === "ww" ? "ww" : "kr", locale: locales.has(locale) ? locale : "en" };
  }
  function key(region, locale) {
    const value = identity(region, locale);
    return `${value.region}.${value.locale}`;
  }
  function validate(data, region, locale) {
    if (data?.schema !== 1 || data.region !== region || data.locale !== locale || !data.skills || typeof data.skills !== "object")
      throw new Error("Invalid skill trait catalog");
    for (const [id, rows] of Object.entries(data.skills)) {
      if (!/^1\d{7}$/.test(id) || !Array.isArray(rows) || rows.length > 5) throw new Error("Invalid skill traits");
      const seen = new Set();
      for (const row of rows) {
        if (!Array.isArray(row) || !Number.isInteger(row[0]) || row[0] < 1 || row[0] > 5 || seen.has(row[0]) ||
            !Number.isInteger(row[1]) || row[1] < 0 || typeof row[2] !== "string" || !row[2].trim() || /[{}<>\uFFFD]/.test(row[2]))
          throw new Error("Invalid skill trait description");
        seen.add(row[0]);
      }
    }
    return data;
  }
  async function load(region, locale) {
    const id = key(region, locale);
    if (catalogs.has(id)) return catalogs.get(id);
    if (requests.has(id)) return requests.get(id);
    const expected = identity(region, locale);
    const request = (async () => {
      const response = await fetch(`./assets/skill-traits/${id}.json?v=20261008-client-specializations`, {
        cache: "force-cache", signal: AbortSignal.timeout(15000),
      });
      if (!response.ok) throw new Error(`Skill trait catalog HTTP ${response.status}`);
      const data = validate(await response.json(), expected.region, expected.locale);
      catalogs.set(id, data);
      return data;
    })();
    requests.set(id, request);
    try { return await request; }
    finally { if (requests.get(id) === request) requests.delete(id); }
  }
  function options(skillId, region, locale) {
    const rows = catalogs.get(key(region, locale))?.skills?.[String(skillId)];
    if (!rows) return [];
    return Array.from({ length: 5 }, (_, index) => {
      const row = rows.find(value => value[0] === index + 1);
      return { number: index + 1, level: row?.[1], description: row?.[2] || "", language: row?.[3] || "" };
    });
  }
  function copy(locale) {
    return { description: introductions[locale] || introductions.en,
      ...Object.fromEntries(["selected", "unselected", "loading", "error", "retry", "missing", "english"].map(
        (name, index) => [name, (words[locale] || words.en)[index]])) };
  }
  globalThis.NotMeterSkillTraits = Object.freeze({ key, load, options, copy, validate });
})();
