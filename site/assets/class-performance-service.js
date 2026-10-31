(() => {
  "use strict";
  const keys = ["title", "kicker", "description", "selection", "party", "dedupe", "comparison", "formula", "gate", "combine", "notice", "summary", "pending", "empty"];
  const translations = (globalThis.NotMeterI18n?.withVietnamese || (copy => copy))({
    "ko": [
      "Global 직업 DPS 통계",
      "GLOBAL · 이번 주 · CP 150K+",
      "이번 주 150K 이상 기록을 랭킹 순위와 관계없이 집계합니다. 같은 보스·비슷한 CP끼리 비교하며, TOP20 밖의 전투 상세는 보관하지 않습니다.",
      "글로벌 전체 지역의 150K 이상 던전 처치 기록이 대상입니다. CP 상한은 없으며 훈련용 허수아비는 제외합니다.",
      "파티원 기록과 CP가 모두 확인되고, 파티 CP 차이 100K 이하·본인 피해 기여도 10% 초과인 기록만 반영합니다.",
      "캐릭터·보스별 상위 3회 중 두 번째 DPS를 대표값으로 사용합니다. 한 번만 기록됐다면 그 값을 사용하며, 같은 전투를 다시 보내도 중복 집계하지 않습니다.",
      "같은 보스의 10K CP 범위 안에서 직업별 DPS를 비교합니다. 직업 중앙값을 100으로 두어 CP 차이의 영향을 줄입니다.",
      "점수 105는 비교 조건이 같은 직업 중앙값보다 관측 DPS가 약 5% 높다는 뜻입니다. 장비·파티·숙련도의 차이를 모두 제거한 수치는 아닙니다.",
      "같은 보스·10K CP 범위에 표본 30개 이상, 직업별 5개 이상, 비교 가능한 직업 4개 이상일 때 계산합니다.",
      "보스별 점수를 같은 비중으로 합쳐 특정 보스에 기록이 몰리는 영향을 줄입니다. 자료가 부족하면 순위를 매기지 않습니다.",
      "TOP20 여부와 관계없이 통계에 필요한 수치만 모읍니다. 이번 주만 사용하며 글로벌 주간 초기화에 맞춰 새로 집계합니다. 수집된 기록의 비교이지 모든 플레이어를 대표하는 결과는 아닙니다.",
      "{period} · 150K+ · {jobs}개 직업 · {contents}개 보스",
      "150K 이상 글로벌 직업 성능 통계가 게시되기를 기다리는 중입니다.",
      "아직 비교 조건을 충족한 글로벌 직업 기록이 충분하지 않습니다."
    ],
    "en": [
      "Global Class DPS",
      "GLOBAL · THIS WEEK · CP 150K+",
      "Includes this week's eligible records at 150K CP or above, regardless of ranking. Compares the same boss at similar CP without retaining combat details outside the TOP20.",
      "Dungeon kills across all Global regions at 150K CP or above, with no upper CP limit. Training dummies are excluded.",
      "All party members and their CP must be known. Party CP spread must be at most 100K and the character's damage contribution must exceed 10%.",
      "Uses the second-best DPS among each character's top three runs per boss. A single run uses its own value. Resending the same battle does not count twice.",
      "Compares class DPS on the same boss within 10K CP bands. The median across classes is set to 100 to reduce CP differences.",
      "A score of 105 means observed DPS is about 5% above the class median under comparable conditions. Gear, party and player skill still affect results.",
      "Each boss and 10K CP band needs at least 30 samples overall, 5 per class and 4 comparable classes.",
      "Boss scores receive equal weight so heavily played bosses do not dominate. Insufficient evidence is not ranked.",
      "Collects only the values needed for statistics, including records outside the TOP20. Uses the current week and resets with the Global weekly schedule. This is a comparison of collected records, not all players.",
      "{period} · 150K+ · {jobs} classes · {contents} bosses",
      "Waiting for Global class statistics at 150K CP or above to be published.",
      "Not enough Global class records meet the comparison requirements yet."
    ],
    "zh-TW": [
      "Global 職業 DPS 統計",
      "GLOBAL · 本週 · CP 150K+",
      "統計本週 CP 150K 以上的合格紀錄，不限排名。比較同一首領、相近 CP 的表現，不保留 TOP20 以外的戰鬥詳情。",
      "包含 Global 全地區 CP 150K 以上的副本擊殺紀錄，無 CP 上限；不含訓練用稻草人。",
      "須完整確認隊員及其 CP，隊伍 CP 差距不超過 100K，且本人傷害貢獻超過 10%。",
      "每個角色、首領採用最高三次中的第二高 DPS；只有一次則採用該次。重送同一場戰鬥不會重複計算。",
      "在同一首領、10K CP 範圍內比較職業 DPS，以職業中位數為 100，減少 CP 差異的影響。",
      "105 分表示相近條件下觀測 DPS 約高於職業中位數 5%；裝備、隊伍及操作差異仍會影響結果。",
      "每個首領及 10K CP 範圍須有至少 30 個樣本、每職業至少 5 個，且至少 4 個可比較職業。",
      "各首領採相同權重，避免紀錄集中特定首領。資料不足時不排名。",
      "TOP20 以外也只累積統計必要數值。僅使用本週紀錄，依 Global 每週重置時間重新統計。結果不代表所有玩家。",
      "{period} · 150K+ · {jobs} 個職業 · {contents} 位首領",
      "等待公布 CP 150K 以上的 Global 職業統計。",
      "符合比較條件的 Global 職業紀錄尚不足。"
    ],
    "ja-JP": [
      "Global クラス別DPS",
      "GLOBAL · 今週 · CP 150K+",
      "今週のCP 150K以上の有効な記録を順位に関係なく集計します。同じボス・近いCPで比較し、TOP20以外の戦闘詳細は保存しません。",
      "Global全地域のCP 150K以上のダンジョン討伐が対象です。CP上限はなく、訓練用かかしは対象外です。",
      "全パーティーメンバーとCPが確認でき、CP差が100K以下、本人のダメージ貢献率が10%を超える記録が対象です。",
      "キャラクター・ボスごとの上位3回から2番目のDPSを採用します。1回だけならその値を使用し、同じ戦闘の再送は重複計上しません。",
      "同じボスの10K CP帯内でクラス別DPSを比較し、クラス間の中央値を100にしてCP差の影響を抑えます。",
      "105点は同条件のクラス中央値より観測DPSが約5%高いことを示します。装備・パーティー・習熟度の影響は残ります。",
      "ボス・10K CP帯ごとに合計30件以上、各クラス5件以上、比較可能な4クラス以上が必要です。",
      "各ボスを同じ重みで合算し、特定ボスへの偏りを抑えます。資料不足の場合は順位を付けません。",
      "TOP20以外も統計に必要な数値だけ集計します。今週のみ対象とし、Globalの週間リセットに合わせて更新します。全プレイヤーを代表する結果ではありません。",
      "{period} · 150K+ · {jobs}クラス · {contents}ボス",
      "CP 150K以上のGlobalクラス統計の公開を待っています。",
      "比較条件を満たすGlobalの記録がまだ不足しています。"
    ],
    "de-DE": [
      "Globaler Klassen-DPS-Vergleich",
      "GLOBAL · DIESE WOCHE · CP 150K+",
      "Berücksichtigt gültige Wochenrekorde ab 150K CP unabhängig vom Rang. Vergleicht denselben Boss bei ähnlichen CP, ohne Kampfdaten außerhalb der TOP20 zu behalten.",
      "Dungeon-Abschlüsse aller Global-Regionen ab 150K CP ohne CP-Obergrenze. Trainingspuppen sind ausgeschlossen.",
      "Alle Gruppenmitglieder und CP müssen bekannt sein. CP-Abstand höchstens 100K und eigener Schadensanteil über 10%.",
      "Pro Charakter und Boss zählt der zweitbeste DPS der drei besten Kämpfe. Bei nur einem Kampf zählt dieser. Erneutes Senden zählt nicht doppelt.",
      "Vergleicht Klassen beim selben Boss in 10K-CP-Bereichen. Der Klassenmedian entspricht 100 und reduziert den Einfluss der CP-Unterschiede.",
      "105 Punkte bedeuten rund 5% mehr beobachteten DPS als der Klassenmedian bei vergleichbaren Bedingungen. Ausrüstung, Gruppe und Spielstärke wirken weiterhin.",
      "Je Boss und 10K-CP-Bereich sind mindestens 30 Stichproben insgesamt, 5 je Klasse und 4 vergleichbare Klassen nötig.",
      "Bosse werden gleich gewichtet. Bei unzureichenden Daten wird kein Rang vergeben.",
      "Auch außerhalb der TOP20 werden nur notwendige Statistikwerte gesammelt. Nur die laufende Woche zählt; Zurücksetzung nach dem Global-Wochenplan. Keine Repräsentation aller Spieler.",
      "{period} · 150K+ · {jobs} Klassen · {contents} Bosse",
      "Warte auf Global-Klassenstatistik ab 150K CP.",
      "Noch nicht genügend vergleichbare Global-Klassendaten."
    ],
    "fr-FR": [
      "DPS des classes — Global",
      "GLOBAL · CETTE SEMAINE · CP 150K+",
      "Inclut les résultats valides de la semaine dès 150K CP, quel que soit le rang. Compare le même boss à CP proches, sans conserver les détails de combat hors TOP20.",
      "Victoires en donjon de toutes les régions Global dès 150K CP, sans plafond. Mannequins d’entraînement exclus.",
      "Tous les membres et leurs CP doivent être connus. Écart du groupe de 100K maximum et contribution personnelle supérieure à 10%.",
      "Retient le deuxième meilleur DPS parmi les trois meilleurs combats par personnage et boss. Un seul combat conserve sa valeur. Un renvoi ne compte pas deux fois.",
      "Compare les classes sur le même boss par tranches de 10K CP. La médiane des classes vaut 100 pour limiter l’effet des CP.",
      "105 indique environ 5% de DPS observé au-dessus de la médiane des classes à conditions comparables. Équipement, groupe et maîtrise influencent toujours le résultat.",
      "Par boss et tranche de 10K CP : au moins 30 échantillons au total, 5 par classe et 4 classes comparables.",
      "Chaque boss a le même poids. Les données insuffisantes ne reçoivent pas de rang.",
      "Seules les valeurs utiles aux statistiques sont conservées, même hors TOP20. Semaine en cours uniquement, remise à zéro selon le calendrier Global. Ne représente pas tous les joueurs.",
      "{period} · 150K+ · {jobs} classes · {contents} boss",
      "En attente des statistiques Global dès 150K CP.",
      "Pas encore assez de résultats Global comparables."
    ],
    "es-ES": [
      "DPS por clase — Global",
      "GLOBAL · ESTA SEMANA · CP 150K+",
      "Incluye registros válidos de esta semana desde 150K CP sin importar el puesto. Compara el mismo jefe con CP similares, sin guardar detalles de combate fuera del TOP20.",
      "Victorias de mazmorra de todas las regiones Global desde 150K CP, sin límite superior. Se excluyen muñecos de entrenamiento.",
      "Deben conocerse todos los miembros y sus CP. Diferencia de CP del grupo de hasta 100K y contribución personal al daño superior al 10%.",
      "Usa el segundo mejor DPS de los tres mejores combates por personaje y jefe. Si solo hay uno, usa ese valor. Reenviar el mismo combate no lo duplica.",
      "Compara clases contra el mismo jefe en bandas de 10K CP. La mediana entre clases equivale a 100 para reducir diferencias de CP.",
      "105 indica un DPS observado un 5% superior a la mediana entre clases en condiciones comparables. Equipo, grupo y habilidad aún influyen.",
      "Cada jefe y banda de 10K CP necesita al menos 30 muestras totales, 5 por clase y 4 clases comparables.",
      "Cada jefe tiene el mismo peso. Los datos insuficientes no reciben puesto.",
      "Solo se guardan valores necesarios para estadísticas, incluso fuera del TOP20. Se usa la semana actual y el reinicio semanal Global. No representa a todos los jugadores.",
      "{period} · 150K+ · {jobs} clases · {contents} jefes",
      "Esperando estadísticas Global desde 150K CP.",
      "Aún no hay suficientes registros Global comparables."
    ],
    "pt-BR": [
      "DPS por classe — Global",
      "GLOBAL · ESTA SEMANA · CP 150K+",
      "Inclui registros válidos desta semana a partir de 150K CP, independentemente da posição. Compara o mesmo chefe com CP próximos, sem guardar detalhes de combate fora do TOP20.",
      "Vitórias em masmorras de todas as regiões Global a partir de 150K CP, sem limite superior. Bonecos de treinamento não entram.",
      "Todos os membros e seus CP precisam ser conhecidos. Diferença de CP do grupo de até 100K e contribuição pessoal de dano acima de 10%.",
      "Usa o segundo melhor DPS dos três melhores combates por personagem e chefe. Se houver só um, usa esse valor. Reenvios não contam duas vezes.",
      "Compara classes no mesmo chefe em faixas de 10K CP. A mediana entre classes vale 100 para reduzir diferenças de CP.",
      "105 indica DPS observado cerca de 5% acima da mediana entre classes em condições comparáveis. Equipamento, grupo e habilidade ainda influenciam.",
      "Cada chefe e faixa de 10K CP precisa de 30 amostras no total, 5 por classe e 4 classes comparáveis.",
      "Cada chefe tem o mesmo peso. Dados insuficientes não recebem posição.",
      "Somente valores necessários às estatísticas são guardados, inclusive fora do TOP20. Apenas a semana atual, com reinício no horário semanal Global. Não representa todos os jogadores.",
      "{period} · 150K+ · {jobs} classes · {contents} chefes",
      "Aguardando estatísticas Global a partir de 150K CP.",
      "Ainda não há registros Global comparáveis suficientes."
    ],
    "ru-RU": [
      "DPS классов — Global",
      "GLOBAL · ЭТА НЕДЕЛЯ · CP 150K+",
      "Учитываются подходящие записи недели от 150K CP независимо от места. Сравнивается один босс при близких CP; детали боёв вне ТОП20 не сохраняются.",
      "Победы в подземельях всех регионов Global от 150K CP без верхнего предела. Тренировочные манекены исключены.",
      "Должны быть известны все участники и их CP. Разница CP группы не более 100K, личный вклад в урон выше 10%.",
      "Для персонажа и босса берётся второй DPS из трёх лучших боёв. Если бой один, используется его значение. Повторная отправка не дублирует бой.",
      "Классы сравниваются на одном боссе в диапазонах по 10K CP. Медиана классов равна 100, чтобы уменьшить влияние CP.",
      "105 означает наблюдаемый DPS примерно на 5% выше медианы классов при сопоставимых условиях. Экипировка, группа и навыки всё ещё влияют.",
      "На босса и диапазон 10K CP нужны минимум 30 образцов, 5 на класс и 4 сравнимых класса.",
      "Все боссы имеют равный вес. При недостаточных данных место не присваивается.",
      "Даже вне ТОП20 собираются только нужные числовые показатели. Учитывается текущая неделя со сбросом по расписанию Global. Это не статистика всех игроков.",
      "{period} · 150K+ · классов: {jobs} · боссов: {contents}",
      "Ожидается статистика Global от 150K CP.",
      "Пока недостаточно сравнимых записей Global."
    ]
  });
  const copy = Object.fromEntries(Object.entries(translations).map(([locale, values]) => [locale, Object.fromEntries(keys.map((key, i) => [key, values[i]]))]));
  const extra = (globalThis.NotMeterI18n?.withVietnamese || (copy => copy))({
    ko: ["{jobs}이 없는 파티로 비교 중입니다.", "집계를 도입한 첫 주에는 도입 이후 수집된 기록만 반영됩니다. 이전 TOP20 기록만으로 누락된 통계를 채우지 않습니다."],
    en: ["Comparing parties without {jobs}.", "The first week includes only records collected after this method was introduced. Missing history is not filled using TOP20 records alone."],
    "zh-TW": ["比較未包含 {jobs} 的隊伍。", "啟用首週僅計入啟用後收集的紀錄，不會只用既有 TOP20 紀錄補足缺少的歷史統計。"],
    "ja-JP": ["{jobs}を含まないパーティーを比較しています。", "導入した最初の週は導入後に収集した記録のみ集計します。以前のTOP20だけで不足した統計を補いません。"],
    "de-DE": ["Vergleich von Gruppen ohne {jobs}.", "In der ersten Woche zählen nur seit Einführung erfasste Kämpfe. Fehlende Historie wird nicht allein aus TOP20-Daten ergänzt."],
    "fr-FR": ["Comparaison des groupes sans {jobs}.", "La première semaine ne comprend que les résultats collectés après l’introduction de cette méthode. L’historique manquant n’est pas reconstitué à partir du seul TOP20."],
    "es-ES": ["Comparando grupos sin {jobs}.", "La primera semana solo incluye registros recogidos desde la introducción del método. No se rellena el historial faltante solo con datos del TOP20."],
    "pt-BR": ["Comparando grupos sem {jobs}.", "A primeira semana inclui apenas registros coletados após a introdução do método. O histórico ausente não é preenchido só com dados do TOP20."],
    "ru-RU": ["Сравниваются группы без {jobs}.", "В первую неделю учитываются только записи, собранные после внедрения метода. Пропущенная история не заполняется только данными ТОП20."],
  });
  for (const [language, values] of Object.entries(extra)) {
    copy[language].classPerformanceGlobalCompositionExcluded = values[0];
    copy[language].classPerformancePartialWeek = values[1];
  }
  const progressionWarningTitle = (globalThis.NotMeterI18n?.withVietnamese || (copy => copy))({
    ko: "직업 밸런스 판단 전 꼭 확인하세요",
    en: "Read before comparing class balance",
    "zh-TW": "比較職業平衡前，請務必閱讀",
    "ja-JP": "クラスバランスを判断する前にご確認ください",
    "de-DE": "Vor dem Vergleich der Klassenbalance beachten",
    "fr-FR": "À lire avant de comparer l’équilibrage des classes",
    "es-ES": "Lee esto antes de comparar el equilibrio entre clases",
    "pt-BR": "Leia antes de comparar o equilíbrio entre classes",
    "ru-RU": "Прочитайте перед сравнением баланса классов",
  });
  const progressionWarning = (globalThis.NotMeterI18n?.withVietnamese || (copy => copy))({
    ko: "스킬과 스티그마가 모두 20레벨에 도달하기 전에는 직업 간 성능 비교가 정확하지 않을 수 있습니다.",
    en: "Class balance comparisons may be unreliable until both skills and Stigmas reach level 20.",
    "zh-TW": "技能與烙印皆達到 20 級之前，各職業之間的強度比較可能不夠準確。",
    "ja-JP": "スキルとスティグマがどちらもレベル20に達するまでは、クラス間の性能比較が正確でない場合があります。",
    "de-DE": "Solange Fertigkeiten und Stigmen nicht beide Stufe 20 erreicht haben, sind Vergleiche der Klassenbalance möglicherweise nicht aussagekräftig.",
    "fr-FR": "Les comparaisons d’équilibrage entre classes peuvent manquer de fiabilité tant que les compétences et les stigmas n’ont pas tous atteint le niveau 20.",
    "es-ES": "Las comparaciones del equilibrio entre clases pueden ser poco fiables hasta que tanto las habilidades como los estigmas alcancen el nivel 20.",
    "pt-BR": "As comparações de equilíbrio entre classes podem ser pouco confiáveis enquanto as habilidades e os estigmas não atingirem o nível 20.",
    "ru-RU": "Сравнения баланса классов могут быть неточными, пока умения и стигмы не достигнут 20-го уровня.",
  });
  const overrides = { classPerformanceTitle: "title", classPerformancePageTitle: "title", classPerformancePageSubtitle: "kicker", classPerformanceKicker800: "kicker", classPerformanceDescription: "description", classPerformanceCpText: "selection", classPerformancePartyText: "party", classPerformanceDedupeText: "dedupe", classPerformanceTrustText: "comparison", classPerformanceFormulaText: "formula", classPerformanceCellGateText: "gate", classPerformanceCombineText: "combine", classPerformanceNoticeText: "notice", classPerformanceSummary: "summary", classPerformancePending: "pending", classPerformanceEmpty: "empty" };
  let locale = "", service = "";
  const defaultService = value => ["ko", "zh-TW"].includes(value) ? "KR/TW" : "Global";
  function sync(value) {
    if (locale !== value) {
      locale = value; service = defaultService(locale);
      try { const saved = localStorage.getItem(`notmeter-performance-service:${locale}`); if (["KR/TW", "Global"].includes(saved)) service = saved; } catch { }
    }
    const bar = document.getElementById("performance-service-switch");
    if (!bar) return;
    const warning = document.getElementById("class-performance-progression-warning");
    if (warning) {
      warning.hidden = service !== "Global";
      warning.querySelector("#class-performance-warning-title").textContent = progressionWarningTitle[locale] || progressionWarningTitle.en;
      warning.querySelector("#class-performance-warning-message").textContent = progressionWarning[locale] || progressionWarning.en;
    }
    const regionCopy = globalThis.NotMeterGlobalRanking?.copy[locale] || globalThis.NotMeterGlobalRanking?.copy.en;
    document.getElementById("performance-service-title").textContent = regionCopy?.service || "Region";
    document.getElementById("performance-service-hint").textContent = regionCopy?.serviceHint || "";
    for (const button of bar.querySelectorAll("[data-performance-service]")) {
      const selected = button.dataset.performanceService === service;
      button.classList.toggle("is-active", selected);
      button.setAttribute("aria-pressed", String(selected));
      button.onclick = () => {
        service = button.dataset.performanceService;
        try { localStorage.setItem(`notmeter-performance-service:${locale}`, service); } catch { }
        sync(locale);
        window.dispatchEvent(new CustomEvent("notmeter-performance-service-change"));
      };
    }
  }
  function text(key, language) { return service === "Global" ? (copy[language] || copy.en)[overrides[key] || key] : undefined; }
  function snapshot(data, now = Date.now()) {
    const coverage = data?.classPerformanceCoverage;
    return coverage && now / 1000 >= coverage.weekStart && now / 1000 < coverage.weekEnd &&
      data.classPerformance?.rankingBasis?.startsWith("global_current_week_lightweight_second_best_of_top3;cp_min_150k_no_max;") &&
      Array.isArray(data.classPerformance.rows) ? data.classPerformance : undefined;
  }
  globalThis.NotMeterClassPerformance = { sync, text, snapshot, defaultService, copy, get service() { return service; } };
})();
