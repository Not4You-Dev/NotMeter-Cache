(() => {
  "use strict";

  const surface = document.getElementById("stat-efficiency-surface");
  if (!surface) return;

  const CLIPBOARD_PREFIX = "NOTMETER_STATS_V4:";
  const CLIPBOARD_SCHEMA = "notmeter-stat-efficiency-profile-v4";
  const RECALCULATE_DELAY_MS = 180;
  const EXAMPLE_PROFILE = {
    schema: CLIPBOARD_SCHEMA, jobName: "검성", power: 132, destruction: 48, justice: 41, wisdom: 37,
    attack: 3420, additionalAttack: 812, minimumAttack: 1960, maximumAttack: 2640, pveAttack: 540, bossAttack: 310,
    attackIncreasePercent: 38.4, damageAmplificationPercent: 21.5, weaponDamageAmplificationPercent: 14.2,
    pveDamageAmplificationPercent: 9.8, bossDamageAmplificationPercent: 6.4, criticalDamageAmplificationPercent: 42.6,
    perfectPercent: 18.2, hardHitPercent: 33.6, frontDamageAmplificationPercent: 7.5, backDamageAmplificationPercent: 12,
  };
  const BASELINE_INPUTS = [
    "power", "destruction", "justice", "wisdom",
    "attack", "additionalAttack", "minimumAttack", "maximumAttack",
    "pveAttack", "bossAttack", "attackIncreasePercent",
    "damageAmplificationPercent", "weaponDamageAmplificationPercent",
    "pveDamageAmplificationPercent", "bossDamageAmplificationPercent",
    "criticalDamageAmplificationPercent", "perfectPercent", "hardHitPercent",
    "frontDamageAmplificationPercent", "backDamageAmplificationPercent",
  ];
  const EFFECT_GROUPS = [
    ["point", "pointEffectGroup"],
    ["flat", "flatEffectGroup"],
    ["percentPoint", "percentEffectGroup"],
  ];
  const EFFECT_LABEL_KEYS = {
    damageAmplification: "damageAmp", weaponDamageAmplification: "weaponDamageAmp",
    pveDamageAmplification: "pveAmp", bossDamageAmplification: "bossAmp",
    criticalDamageAmplification: "criticalDamageAmp",
    frontDamageAmplification: "frontAmp", backDamageAmplification: "backAmp",
  };
  const TEXT = (globalThis.NotMeterI18n?.withVietnamese || (copy => copy))({
    ko: {
      pageKicker: "실시간 스탯 비교",
      title: "스탯 효율 계산기", subtitle: "옵션 수치를 바꾸는 즉시 현재 스탯과 비교해 피해 상승량을 보여줍니다.",
      importTitle: "딜미터기에서 복사한 내 스탯 붙여넣기",
      importDescription: "‘내 스탯 복사’ 값을 붙여넣으면 현재 스탯이 채워지고 바로 계산됩니다.",
      importPlaceholder: "여기를 누르고 Ctrl+V로 붙여넣기", importWaiting: "복사한 값을 기다리고 있습니다",
      importSuccess: "{job} · 피해 계산 스탯 {count}개 입력 완료", importInvalid: "딜미터기에서 복사한 유효한 스탯 값이 아닙니다.",
      noticeTitle: "표시 기준", notice: "현재 고정 계산식에서 피해 기대값을 직접 바꾸는 스탯만 표시합니다. 명중·방어·재시전 시간·전투 속도·속성 증폭·봉혼석·관통 등 미검증 항목은 계산 UI와 순위에서 제외됩니다.",
      optionTitle: "비교할 옵션 증가량", optionHelp: "장비를 바꿨을 때 늘어나는 값만 입력하세요. 음수도 입력할 수 있습니다.",
      flatOptionGroup: "공격 수치", percentOptionGroup: "증폭·판정",
      pointEffectGroup: "주신 스탯 · +1", flatEffectGroup: "공격 수치 · +10", percentEffectGroup: "증폭·판정 · +1%",
      decreaseBy: "{value} 감소", increaseBy: "{value} 증가",
      currentDetails: "현재 스탯 상세 보기 · 필요할 때만 펼치세요", divineStats: "피해 연동 주신 스탯",
      divineStatsHelp: "복사한 값에서 올리면 증가분이 자동으로 옵션 비교에 합산됩니다.",
      power: "위력", destruction: "파괴", justice: "정의", wisdom: "지혜",
      powerGrowth: "1당 공격력 증가 +0.1%p", destructionGrowth: "1당 공격력 증가 +0.2%p",
      justiceGrowth: "1당 완벽 +0.2%p", wisdomGrowth: "1당 강타 +0.2%p",
      attackStats: "현재 공격 수치", attackStatsHelp: "복사 기능을 사용하면 자동 입력됩니다.",
      attack: "공격력", additionalAttack: "추가 공격력", minimumAttack: "최소 공격력", maximumAttack: "최대 공격력",
      pveAttack: "PVE 공격력", bossAttack: "보스 공격력", percentStats: "현재 피해 증폭·판정",
      percentStatsHelp: "현재 캐릭터 창에 표시된 값을 입력합니다.", attackIncrease: "공격력 증가율",
      damageAmp: "피해 증폭", weaponDamageAmp: "무기 피해 증폭", pveAmp: "PVE 피해 증폭", bossAmp: "보스 피해 증폭",
      criticalDamageAmp: "치명타 피해 증폭", perfect: "완벽", hardHit: "강타",
      frontAmp: "전방 피해 증폭", backAmp: "후방 피해 증폭",
      combatAssumptions: "세부 판정 조건", combatAssumptionsHelp: "치명타와 강타 기대값을 세부 조정할 때 사용합니다.",
      criticalChance: "치명타 발동률", partyHardHit: "파티 강타 버프", bossHardHitResistance: "보스 강타 저항",
      attackType: "공격 방향", attackNone: "방향 적용 안 함", attackFront: "전방", attackBack: "후방",
      directionHelp: "전방·후방 피해 증폭을 비교할 방향을 선택하세요.",
      frontRate: "전방 공격 비율", backRate: "후방 공격 비율",
      deltaBaseAttack: "추가 공격력", deltaGearAttack: "공격력", deltaMaxAttack: "최대 공격력",
      deltaPveAttack: "PVE 공격력", deltaBossAttack: "보스 공격력", deltaAttackIncrease: "공격력 증가율",
      deltaDamageAmp: "피해 증폭", deltaWeaponAmp: "무기 피해 증폭", deltaCriticalAmp: "치명타 피해 증폭",
      deltaPerfect: "완벽", deltaHardHit: "강타", deltaFrontAmp: "전방 피해 증폭", deltaBackAmp: "후방 피해 증폭",
      resultKicker: "실시간 옵션 비교", resultTitle: "예상 피해 변화", waitingTitle: "내 스탯을 붙여넣어 주세요",
      waitingDescription: "붙여넣은 뒤 옵션 증가량을 바꾸면 결과가 같은 위치에서 즉시 갱신됩니다.",
      resultGuide: "결과는 현재값 대비 선택한 옵션 증가량의 기대값입니다.",
      ready: "자동 계산 완료", calculating: "자동 계산 중", source: "{job} · 마지막 입력 반영",
      invalid: "공격력·최소/최대 공격력 값을 확인해 주세요.",
      statWindowAttack: "게임 표시 공격력", effectiveAttack: "보스 유효 공격력", expectedDamage: "기대 피해 지수",
      damageGain: "예상 피해 상승", before: "현재", after: "변경", quickCompare: "스탯별 기본 증가량 비교",
      easyTitle: "사용 방법", easyOne: "딜미터기 처치 기록 상단에서 ‘내 스탯 복사’를 누릅니다.",
      easyTwo: "이 페이지 상단 입력칸에 붙여넣습니다.", easyThree: "비교할 옵션 수치를 바꾸면 결과가 같은 위치에서 즉시 갱신됩니다.",
    },
    en: {
      pageKicker: "LIVE STAT COMPARISON",
      title: "Stat Efficiency Calculator", subtitle: "Every edit instantly compares the selected option against your current stats.",
      importTitle: "Paste stats copied from NotMeter", importDescription: "Paste Copy My Stats to fill the baseline and calculate immediately.",
      importPlaceholder: "Click here and press Ctrl+V", importWaiting: "Waiting for copied stats",
      importSuccess: "{job} · Filled {count} damage stats", importInvalid: "This is not a valid NotMeter stat copy.",
      noticeTitle: "Calculation basis", notice: "Common expected damage under your critical, Double Chance and direction assumptions. Class skill mix, cooldowns and rotation changes are not modeled. Invalid final attack values cannot be calculated.",
      optionTitle: "Option increase to compare", optionHelp: "Enter only the values gained by changing gear. Negative values are allowed.",
      flatOptionGroup: "Attack values", percentOptionGroup: "Amplification and rolls",
      pointEffectGroup: "Divine stats · +1", flatEffectGroup: "Attack values · +10", percentEffectGroup: "Amplification and rolls · +1%",
      decreaseBy: "Decrease by {value}", increaseBy: "Increase by {value}",
      currentDetails: "Current stat details · expand only when needed", divineStats: "Damage-linked divine stats",
      divineStatsHelp: "Changes from the copied baseline are added to the option delta.", power: "Might", destruction: "Destruction",
      justice: "Justice", wisdom: "Wisdom", powerGrowth: "+0.1%p Attack Increase per point",
      destructionGrowth: "+0.2%p Attack Increase per point", justiceGrowth: "+0.2%p Perfect Chance per point", wisdomGrowth: "+0.2%p Double Chance per point",
      attackStats: "Current attack values", attackStatsHelp: "Filled automatically by Copy My Stats.", attack: "Attack",
      additionalAttack: "Attack Bonus", minimumAttack: "Min Attack", maximumAttack: "Max Attack", pveAttack: "PvE Attack", bossAttack: "Boss Attack",
      percentStats: "Current amplification and rolls", percentStatsHelp: "Enter the values shown in the character window.", attackIncrease: "Attack Increase",
      damageAmp: "Damage Boost", weaponDamageAmp: "Weapon Damage Boost", pveAmp: "PvE Damage Boost", bossAmp: "Boss Damage Boost",
      criticalDamageAmp: "Critical Damage Boost", perfect: "Perfect Chance", hardHit: "Double Chance", frontAmp: "Front Attack Damage Boost", backAmp: "Back Attack Damage Boost",
      combatAssumptions: "Detailed proc conditions", combatAssumptionsHelp: "Fine-tune critical and Double Chance expectations.", criticalChance: "Critical proc rate",
      partyHardHit: "Party Double Chance buff", bossHardHitResistance: "Boss Double Resist", attackType: "Attack direction",
      attackNone: "No direction", attackFront: "Front", attackBack: "Back", frontRate: "Front attack rate", backRate: "Back attack rate",
      directionHelp: "Choose the direction used to compare Front or Back Attack Damage Boost.",
      deltaBaseAttack: "Attack Bonus", deltaGearAttack: "Attack", deltaMaxAttack: "Max Attack", deltaPveAttack: "PvE Attack", deltaBossAttack: "Boss Attack",
      deltaAttackIncrease: "Attack Increase", deltaDamageAmp: "Damage Boost", deltaWeaponAmp: "Weapon Damage Boost",
      deltaCriticalAmp: "Critical Damage Boost", deltaPerfect: "Perfect Chance", deltaHardHit: "Double Chance", deltaFrontAmp: "Front Attack Damage Boost", deltaBackAmp: "Back Attack Damage Boost",
      resultKicker: "LIVE OPTION COMPARISON", resultTitle: "Expected damage change", waitingTitle: "Paste your stats",
      waitingDescription: "After pasting, every option edit updates the result in place.", resultGuide: "The result compares your current values with the selected option increase.",
      ready: "Up to date", calculating: "Updating", source: "{job} · latest input", invalid: "Check Attack and Min/Max Attack values.",
      statWindowAttack: "Displayed Attack", effectiveAttack: "Effective Boss Attack",
      expectedDamage: "Expected Damage Index", damageGain: "Expected damage gain", before: "Current", after: "Changed", quickCompare: "Quick stat comparison",
      easyTitle: "How to use", easyOne: "Click Copy My Stats at the top of NotMeter combat records.",
      easyTwo: "Paste the copied value into the field at the top of this page.", easyThree: "Change any option value and the result updates instantly in place.",
    },
    "zh-TW": {
      pageKicker: "即時屬性比較",
      title: "屬性效率計算器", subtitle: "每次修改數值都會立即比較目前屬性與選擇的增量。",
      importTitle: "貼上從 NotMeter 複製的角色屬性", importDescription: "貼上「複製我的屬性」即可填入基準並立即計算。",
      importPlaceholder: "點擊此處並按 Ctrl+V", importWaiting: "等待貼上屬性", importSuccess: "{job} · 已填入 {count} 項傷害屬性", importInvalid: "這不是有效的 NotMeter 屬性資料。",
      noticeTitle: "計算依據", notice: "依輸入的暴擊、強擊與攻擊方向計算共通期望傷害，不包含各職業技能比重、冷卻與輸出循環變化。套用選項後無效的攻擊數值不予計算。",
      optionTitle: "要比較的選項增量", optionHelp: "只輸入更換裝備後增加的數值，也可輸入負數。", currentDetails: "目前屬性詳細資料 · 需要時再展開",
      flatOptionGroup: "攻擊數值", percentOptionGroup: "增幅與判定",
      pointEffectGroup: "主神屬性 · +1", flatEffectGroup: "攻擊數值 · +10", percentEffectGroup: "增幅・判定 · +1%",
      decreaseBy: "減少 {value}", increaseBy: "增加 {value}",
      divineStats: "傷害連動主神屬性", divineStatsHelp: "相對於貼上基準的變化會自動加入選項增量。", power: "威力", destruction: "破壞", justice: "正義", wisdom: "智慧",
      powerGrowth: "每點攻擊力增加 +0.1%p", destructionGrowth: "每點攻擊力增加 +0.2%p", justiceGrowth: "每點完美 +0.2%p", wisdomGrowth: "每點強擊 +0.2%p",
      attackStats: "目前攻擊數值", attackStatsHelp: "可透過複製功能自動填入。", attack: "攻擊力", additionalAttack: "額外攻擊力", minimumAttack: "最小攻擊力", maximumAttack: "最大攻擊力",
      pveAttack: "PVE 攻擊力", bossAttack: "Boss 攻擊力", percentStats: "目前傷害增幅與判定", percentStatsHelp: "請輸入角色視窗顯示的數值。", attackIncrease: "攻擊力增加率",
      damageAmp: "傷害增幅", weaponDamageAmp: "武器傷害增幅", pveAmp: "PVE 傷害增幅", bossAmp: "Boss 傷害增幅", criticalDamageAmp: "暴擊傷害增幅",
      perfect: "完美", hardHit: "強擊", frontAmp: "前方傷害增幅", backAmp: "後方傷害增幅", combatAssumptions: "詳細判定條件", combatAssumptionsHelp: "用於微調暴擊與強擊期望值。",
      criticalChance: "暴擊發動率", partyHardHit: "隊伍強擊增益", bossHardHitResistance: "首領強擊抗性", attackType: "攻擊方向", attackNone: "不套用方向", attackFront: "前方", attackBack: "後方",
      directionHelp: "請選擇要比較前方或後方傷害增幅的方向。",
      frontRate: "前方攻擊比例", backRate: "後方攻擊比例", deltaBaseAttack: "額外攻擊力", deltaGearAttack: "攻擊力", deltaMaxAttack: "最大攻擊力", deltaPveAttack: "PVE 攻擊力",
      deltaBossAttack: "Boss 攻擊力", deltaAttackIncrease: "攻擊力增加率", deltaDamageAmp: "傷害增幅", deltaWeaponAmp: "武器傷害增幅", deltaCriticalAmp: "暴擊傷害增幅",
      deltaPerfect: "完美", deltaHardHit: "強擊", deltaFrontAmp: "前方傷害增幅", deltaBackAmp: "後方傷害增幅", resultKicker: "即時選項比較", resultTitle: "預期傷害變化",
      waitingTitle: "請貼上角色屬性", waitingDescription: "貼上後修改任一增量，結果會在原位立即更新。", resultGuide: "結果是目前數值與所選增量的期望值比較。",
      ready: "已更新", calculating: "計算中", source: "{job} · 已套用最後輸入", invalid: "請確認攻擊力與最小／最大攻擊力。",
      statWindowAttack: "遊戲顯示攻擊力", effectiveAttack: "首領有效攻擊力", expectedDamage: "預期傷害指數", damageGain: "預期傷害提升", before: "目前", after: "變更後", quickCompare: "屬性快速比較",
      easyTitle: "使用方式", easyOne: "在 NotMeter 戰鬥紀錄上方點擊「複製我的屬性」。",
      easyTwo: "將複製的內容貼到本頁上方輸入框。", easyThree: "修改任一選項數值，結果會在原位立即更新。",
    },
  });

  const form = document.getElementById("efficiency-form");
  const importInput = document.getElementById("stat-import");
  const importStatus = document.getElementById("stat-import-status");
  const resultEmpty = document.getElementById("result-empty");
  const resultSummary = document.getElementById("result-summary");
  const resultList = document.getElementById("result-list");
  const resultSource = document.getElementById("result-source");
  const confidence = document.getElementById("confidence");
  const formError = document.getElementById("form-error");
  const importCard = document.getElementById("stat-import-card");
  const exampleButton = document.getElementById("stat-example");
  const detailsImport = document.getElementById("stat-details-imported");
  const resultCard = document.getElementById("result-card");
  const quickEmpty = document.getElementById("stat-quick-empty");
  const liveDot = document.getElementById("stat-live-dot");
  const resetButton = document.getElementById("stat-reset");
  const directionButtons = surface.querySelectorAll("[data-stat-direction]");
  const numericFields = form.querySelectorAll('input[type="number"]');
  const optionFields = form.querySelectorAll(".option-flat-grid input, .option-percent-grid input");
  let locale = resolveLocale();
  let baselineDivine = null;
  let recalculateTimer = 0;
  let lastResult = null;
  let resultStatus = "pending";
  let importState = "waiting", importedJob = "";
  const calculator = globalThis.NotMeterStatEfficiencyCalculator;
  const regionStorageKey = "notmeter-stat-calculator-region";
  let region = initialRegion();
  const resistanceByRegion = Object.fromEntries(Object.entries(calculator.profiles).map(([key, profile]) => [key, profile.bossHardHitResistancePercent]));

  globalThis.NotMeterI18n?.extend(TEXT, "stat-efficiency");
  const regionCopy = {
    ko: ["게임 서버", "플레이하는 서버를 선택하세요. 붙여넣은 스탯은 그대로 유지됩니다.", "한국 · 대만", "글로벌", "{stat}: 1당 +{growth}%p", "{stats}: 1당 +{growth}%p", "{stat}: {value}%"],
    en: ["Game server", "Choose the server you play on. Your pasted stats stay unchanged.", "Korea · Taiwan", "Global", "+{growth}%p {stat} per point", "{stats}: +{growth}%p per point", "{stat}: {value}%"],
    "zh-TW": ["遊戲伺服器", "請選擇遊玩的伺服器。已貼上的屬性數值會保留。", "韓國 · 台灣", "全球", "每點{stat} +{growth}%p", "{stats}：每點 +{growth}%p", "{stat}：{value}%"],
    "ja-JP": ["ゲームサーバー", "プレイするサーバーを選択してください。貼り付けたステータスは保持されます。", "韓国・台湾", "グローバル", "1ポイントにつき{stat} +{growth}%p", "{stats}：1ポイントにつき +{growth}%p", "{stat}：{value}%"],
    "de-DE": ["Spielserver", "Wähle deinen Spielserver. Deine eingefügten Werte bleiben unverändert.", "Korea · Taiwan", "Global", "{stat}: +{growth} Prozentpunkte pro Punkt", "{stats}: +{growth} Prozentpunkte pro Punkt", "{stat}: {value} %"],
    "fr-FR": ["Serveur de jeu", "Choisissez votre serveur de jeu. Les statistiques collées sont conservées.", "Corée · Taïwan", "Global", "{stat} : +{growth} point de pourcentage par point", "{stats} : +{growth} point de pourcentage par point", "{stat} : {value} %"],
    "es-ES": ["Servidor de juego", "Elige el servidor en el que juegas. Tus estadísticas pegadas no cambiarán.", "Corea · Taiwán", "Global", "{stat}: +{growth} puntos porcentuales por punto", "{stats}: +{growth} puntos porcentuales por punto", "{stat}: {value} %"],
    "pt-BR": ["Servidor do jogo", "Escolha o servidor em que você joga. Os atributos colados serão mantidos.", "Coreia · Taiwan", "Global", "{stat}: +{growth} pontos percentuais por ponto", "{stats}: +{growth} pontos percentuais por ponto", "{stat}: {value}%"],
    vi: ["Máy chủ trò chơi", "Chọn máy chủ bạn đang chơi. Các chỉ số đã dán được giữ nguyên.", "Hàn Quốc · Đài Loan", "Toàn cầu", "{stat}: +{growth} điểm phần trăm mỗi điểm", "{stats}: +{growth} điểm phần trăm mỗi điểm", "{stat}: {value}%"],
    "ru-RU": ["Игровой сервер", "Выберите сервер, на котором играете. Вставленные характеристики сохранятся.", "Корея · Тайвань", "Глобальный", "{stat}: +{growth} процентного пункта за очко", "{stats}: +{growth} процентного пункта за очко", "{stat}: {value}%"],
  };
  for (const [language, values] of Object.entries(regionCopy)) {
    const keys = ["regionTitle", "regionHelp", "regionDomestic", "regionGlobal", "growthPerPoint", "regionGrowth", "regionResistance"];
    if (TEXT[language]) Object.assign(TEXT[language], Object.fromEntries(keys.map((key, index) => [key, values[index]])));
  }
  const hardHitCopy = (globalThis.NotMeterI18n?.withVietnamese || (copy => copy))({
    ko: ["{stat} 적용 발동률: {before}% → {after}%", "변경 후에도 설정한 저항 이하라 이번 강타 변경분은 피해량에 영향을 주지 않습니다.", "변경 전후 모두 발동률 상한 100%라 이번 강타 변경분은 피해량에 영향을 주지 않습니다.", "계산 조건 확인"],
    en: ["Effective {stat}: {before}% → {after}%", "The changed value is still at or below the configured resistance, so this change adds no damage.", "Both values reach the 100% proc cap, so this change adds no damage.", "Review calculation conditions"],
    "zh-TW": ["實際套用{stat}機率：{before}% → {after}%", "變更後仍未超過設定的抗性，因此這次增量不會增加傷害。", "變更前後皆已達發動率上限 100%，因此這次增量不會增加傷害。", "查看計算條件"],
    "ja-JP": ["適用される{stat}確率：{before}% → {after}%", "変更後も設定した抵抗値以下のため、今回の増加分ではダメージが増えません。", "変更前後とも発動率の上限100%に達しているため、今回の増加分ではダメージが増えません。", "計算条件を確認"],
    "de-DE": ["Wirksame Rate ({stat}): {before}% → {after}%", "Auch nach der Änderung liegt der Wert höchstens beim eingestellten Widerstand. Diese Änderung erhöht daher den Schaden nicht.", "Beide Werte erreichen die Obergrenze von 100 %. Diese Änderung erhöht daher den Schaden nicht.", "Berechnungsbedingungen prüfen"],
    "fr-FR": ["Taux effectif ({stat}) : {before}% → {after}%", "Après modification, la valeur ne dépasse toujours pas la résistance définie. Cette variation n’ajoute donc aucun dégât.", "Les deux valeurs atteignent le plafond de 100 %. Cette variation n’ajoute donc aucun dégât.", "Vérifier les conditions de calcul"],
    "es-ES": ["Probabilidad efectiva ({stat}): {before}% → {after}%", "El valor modificado sigue sin superar la resistencia configurada, por lo que este cambio no aumenta el daño.", "Ambos valores alcanzan el límite del 100 %, por lo que este cambio no aumenta el daño.", "Revisar las condiciones de cálculo"],
    "pt-BR": ["Chance efetiva ({stat}): {before}% → {after}%", "Mesmo após a alteração, o valor não supera a resistência configurada. Esta alteração não aumenta o dano.", "Os dois valores atingem o limite de 100%. Esta alteração não aumenta o dano.", "Verificar condições de cálculo"],
    "ru-RU": ["Итоговая вероятность ({stat}): {before}% → {after}%", "После изменения значение по-прежнему не превышает заданное сопротивление, поэтому это изменение не увеличивает урон.", "Оба значения достигают предела 100%, поэтому это изменение не увеличивает урон.", "Проверить условия расчёта"],
  });
  for (const [language, [hardHitRate, hardHitBlocked, hardHitCapped, hardHitSettings]] of Object.entries(hardHitCopy))
    if (TEXT[language]) Object.assign(TEXT[language], { hardHitRate, hardHitBlocked, hardHitCapped, hardHitSettings });

  const renewalCopy = {
    ko: ["빌드 · 도구", "예시 코드로 미리보기", "초기화", "스탯을 붙여넣으면 계산됩니다.", "스탯을 붙여넣으면 스탯별 기본 증가량 순위가 표시됩니다.", "대기", "{job} · 붙여넣은 값", "변경", "계산 버튼 없이 모든 입력을 즉시 반영합니다. 입력 도중에는 이전 요청을 취소하고 마지막 값만 표시합니다."],
    en: ["Builds & Tools", "Preview with an example code", "Reset", "Paste your stats to calculate.", "Paste your stats to see the ranking by standard stat increase.", "Waiting", "{job} · Imported stats", "Changed", "Each edit calculates automatically. Only the latest input is used."],
    "zh-TW": ["配置與工具", "使用範例代碼預覽", "重設", "貼上屬性即可計算。", "貼上屬性後會顯示各項基本增量的排名。", "等待", "{job} · 已貼上的數值", "已變更", "每次輸入都會自動計算，僅採用最新的數值。"],
    "ja-JP": ["ビルド・ツール", "サンプルコードでプレビュー", "リセット", "ステータスを貼り付けると計算します。", "貼り付けると各ステータスの基本上昇量の順位を表示します。", "待機", "{job} · 貼り付けた値", "変更", "入力すると自動で計算し、最新の値だけを反映します。"],
    "de-DE": ["Builds · Werkzeuge", "Vorschau mit Beispielcode", "Zurücksetzen", "Füge deine Werte ein, um zu rechnen.", "Nach dem Einfügen siehst du die Rangfolge der Standarderhöhungen.", "Warten", "{job} · Importierte Werte", "Geändert", "Jede Eingabe wird automatisch berechnet. Nur der letzte Wert zählt."],
    "fr-FR": ["Builds · Outils", "Aperçu avec un code d’exemple", "Réinitialiser", "Collez vos stats pour calculer.", "Collez vos stats pour afficher le classement des augmentations de base.", "En attente", "{job} · Stats importées", "Modifié", "Le calcul est automatique et utilise uniquement la dernière valeur saisie."],
    "es-ES": ["Configuraciones · Herramientas", "Vista previa con código de ejemplo", "Restablecer", "Pega tus estadísticas para calcular.", "Pega tus estadísticas para ver la clasificación por aumento base.", "En espera", "{job} · Estadísticas importadas", "Modificado", "Cada cambio se calcula automáticamente y solo se usa el último valor."],
    "pt-BR": ["Builds · Ferramentas", "Prévia com código de exemplo", "Redefinir", "Cole seus atributos para calcular.", "Cole seus atributos para ver o ranking dos aumentos básicos.", "Aguardando", "{job} · Atributos importados", "Alterado", "Cada edição é calculada automaticamente usando apenas o último valor."],
    vi: ["Trang bị · Công cụ", "Xem thử với mã mẫu", "Đặt lại", "Dán chỉ số để tính.", "Dán chỉ số để xem xếp hạng theo mức tăng cơ bản.", "Đang chờ", "{job} · Chỉ số đã nhập", "Đã đổi", "Mỗi lần nhập đều tự tính và chỉ dùng giá trị mới nhất."],
    "ru-RU": ["Сборки · Инструменты", "Просмотр с примером кода", "Сбросить", "Вставьте характеристики для расчёта.", "После вставки появится рейтинг стандартных прибавок.", "Ожидание", "{job} · Импортированные значения", "Изменено", "Изменения рассчитываются автоматически по последнему введённому значению."],
  };
  const renewalKeys = ["pageGroup", "example", "reset", "pendingSource", "quickEmpty", "pending", "importedDetails", "changed", "autoHelp"];
  for (const [language, values] of Object.entries(renewalCopy)) {
    if (TEXT[language]) Object.assign(TEXT[language], Object.fromEntries(renewalKeys.map((key, index) => [key, values[index]])));
  }
  for (const copy of Object.values(TEXT)) {
    [copy.detailsTitle, copy.detailsHint = ""] = copy.currentDetails.split(" · ");
  }

  function displayJob(job) {
    if (!job || job === "unknown") return "—";
    return globalThis.NotMeterI18n?.game(job, locale) || job;
  }

  function resolveLocale() {
    const value = document.documentElement.lang;
    return globalThis.NotMeterI18n?.normalize(value) || (value === "en" || value === "zh-TW" ? value : "ko");
  }

  function t(key, values = {}) {
    let text = TEXT[locale]?.[key] || TEXT.ko[key] || key;
    for (const [name, value] of Object.entries(values)) text = text.replaceAll(`{${name}}`, String(value));
    return text;
  }

  function applyLocale() {
    const growthStats = { powerGrowth: "attackIncrease", destructionGrowth: "attackIncrease", justiceGrowth: "perfect", wisdomGrowth: "hardHit" };
    surface.querySelectorAll("[data-stat-i18n]").forEach(element => {
      const key = element.dataset.statI18n;
      element.textContent = growthStats[key] ? t("growthPerPoint", { stat: t(growthStats[key]),
        growth: formatNumber(calculator.profiles[region][key === "powerGrowth" ? "powerGrowth" : "divineGrowth"], 1) }) : t(key);
    });
    surface.querySelectorAll("[data-stat-i18n-placeholder]").forEach(element => { element.placeholder = t(element.dataset.statI18nPlaceholder); });
    surface.querySelectorAll(".option-step-button").forEach(button => {
      const label = t(Number(button.dataset.step) > 0 ? "increaseBy" : "decreaseBy", { value: button.dataset.stepDisplay });
      button.setAttribute("aria-label", label);
      button.title = label;
    });
    updateRegionSummary();
    renderImportStatus();
    renderFieldStates();
    if (lastResult && resultStatus === "ready") renderResult(lastResult);
    else {
      if (resultStatus === "pending") resultSource.textContent = t("pendingSource");
      if (resultStatus === "invalid") formError.textContent = t("invalid");
      setResultStatus(resultStatus);
    }
  }

  function renderImportStatus() {
    importStatus.textContent = importState === "success"
      ? t("importSuccess", { job: importedJob || "—", count: BASELINE_INPUTS.length })
      : t(importState === "error" ? "importInvalid" : "importWaiting");
    importCard.className = `se3-import s-${importState}`;
    exampleButton.hidden = importState === "success";
    detailsImport.hidden = importState !== "success";
    detailsImport.textContent = t("importedDetails", { job: importedJob || "—" });
  }

  function initialRegion() {
    const language = globalThis.NotMeterI18n?.read() || locale;
    try {
      const saved = localStorage.getItem(regionStorageKey);
      if (Object.hasOwn(calculator.profiles, saved)) return saved;
      const service = localStorage.getItem(`notmeter-ranking-service:${language}`);
      if (service === "Global") return "GLOBAL";
      if (service === "KR/TW") return "KR_TW";
    } catch { }
    return ["ko", "zh-TW"].includes(language) ? "KR_TW" : "GLOBAL";
  }

  function updateRegionSummary() {
    for (const [id, key] of [["stat-region-domestic", "KR_TW"], ["stat-region-global", "GLOBAL"]]) {
      const button = document.getElementById(id);
      button.classList.toggle("on", region === key);
      button.setAttribute("aria-pressed", String(region === key));
    }
    document.getElementById("stat-region-growth").textContent = t("regionGrowth", {
      stats: ["destruction", "justice", "wisdom"].map(key => t(key)).join(" · "),
      growth: formatNumber(calculator.profiles[region].divineGrowth, 1),
    });
    document.getElementById("stat-region-resistance").textContent = t("regionResistance", {
      stat: t("bossHardHitResistance"), value: formatNumber(value("bossHardHitResistancePercent"), 2),
    });
  }

  function selectRegion(next) {
    if (next === region || !Object.hasOwn(calculator.profiles, next)) return;
    resistanceByRegion[region] = value("bossHardHitResistancePercent");
    region = next;
    setField("bossHardHitResistancePercent", resistanceByRegion[region]);
    try { localStorage.setItem(regionStorageKey, region); } catch { }
    lastResult = null;
    applyLocale();
    scheduleCalculation(0);
  }

  function setupNumericFields() {
    const stepped = new Set(optionFields);
    for (const input of numericFields) {
      const percent = input.name.endsWith("Percent");
      const step = percent ? 1 : 5;
      const control = document.createElement("span");
      control.className = stepped.has(input) ? "se3-in step" : "se3-in";
      input.replaceWith(control);
      control.append(input);
      if (percent) {
        const unit = document.createElement("em");
        unit.setAttribute("aria-hidden", "true");
        unit.textContent = "%";
        control.append(unit);
      }
      if (stepped.has(input)) {
        for (const direction of [-1, 1]) {
          const button = document.createElement("button");
          button.type = "button";
          button.className = "option-step-button";
          button.dataset.step = String(step * direction);
          button.dataset.stepDisplay = percent ? "1%" : "5";
          button.textContent = direction < 0 ? "−" : "+";
          if (direction < 0) control.prepend(button);
          else control.append(button);
        }
      }
    }
  }

  function renderFieldStates() {
    let changed = 0;
    for (const input of optionFields) {
      const active = Number(input.value) !== 0;
      input.closest(".se3-f").classList.toggle("on", active);
      if (active) changed++;
    }
    for (const name of ["power", "destruction", "justice", "wisdom"]) {
      const input = form.elements.namedItem(name);
      const label = input.closest?.(".se3-f");
      if (!label) continue;
      const active = Boolean(baselineDivine && Number(input.value) !== baselineDivine[name]);
      label.classList.toggle("moved", active);
      label.querySelector(".se3-fl").dataset.change = active ? " · " + t("changed") : "";
      if (active) changed++;
    }
    resetButton.disabled = changed === 0;
    resetButton.textContent = t("reset") + (changed ? " · " + changed : "");
  }

  function numeric(source, key) {
    const value = Number(source?.[key]);
    return Number.isFinite(value) ? value : 0;
  }

  function parseClipboard(value) {
    const trimmed = String(value || "").trim();
    if (!trimmed.startsWith(CLIPBOARD_PREFIX)) throw new Error("prefix");
    const bytes = Uint8Array.from(atob(trimmed.slice(CLIPBOARD_PREFIX.length)), character => character.charCodeAt(0));
    const profile = JSON.parse(new TextDecoder().decode(bytes));
    if (profile?.schema !== CLIPBOARD_SCHEMA || numeric(profile, "attack") <= 0) throw new Error("schema");
    return profile;
  }

  function setField(name, value) {
    const input = form.elements.namedItem(name);
    if (input) input.value = String(Number.isFinite(Number(value)) ? Number(value) : 0);
  }

  function value(name) {
    return numeric(Object.fromEntries(new FormData(form)), name);
  }

  function applyClipboardProfile(profile) {
    document.getElementById("stat-job").value = String(profile.jobName || "").trim();
    for (const name of BASELINE_INPUTS) setField(name, numeric(profile, name));
    baselineDivine = Object.fromEntries(["power", "destruction", "justice", "wisdom"].map(name => [name, numeric(profile, name)]));
    importedJob = String(profile.jobName || "").trim();
    importState = "success";
    renderImportStatus();
    renderFieldStates();
    scheduleCalculation(0);
  }

  function requestPayload() {
    if (!baselineDivine) {
      baselineDivine = { power: value("power"), destruction: value("destruction"), justice: value("justice"), wisdom: value("wisdom") };
    }
    const divine = calculator.divineDelta(region, Object.fromEntries(
      Object.keys(baselineDivine).map(key => [key, value(key) - baselineDivine[key]])));
    return {
      region,
      jobName: document.getElementById("stat-job").value || "unknown",
      attack: value("attack"), additionalAttack: value("additionalAttack"), minimumAttack: value("minimumAttack"), maximumAttack: value("maximumAttack"),
      pveAttack: value("pveAttack"), bossAttack: value("bossAttack"), attackIncreasePercent: value("attackIncreasePercent"),
      damageAmplificationPercent: value("damageAmplificationPercent"), weaponDamageAmplificationPercent: value("weaponDamageAmplificationPercent"),
      pveDamageAmplificationPercent: value("pveDamageAmplificationPercent"), bossDamageAmplificationPercent: value("bossDamageAmplificationPercent"),
      criticalDamageAmplificationPercent: value("criticalDamageAmplificationPercent"), perfectPercent: value("perfectPercent"), hardHitPercent: value("hardHitPercent"),
      frontDamageAmplificationPercent: value("frontDamageAmplificationPercent"), backDamageAmplificationPercent: value("backDamageAmplificationPercent"),
      raceDamageAmplificationPercent: 0, criticalChancePercent: value("criticalChancePercent"), frontAttackRatePercent: value("frontAttackRatePercent"),
      backAttackRatePercent: value("backAttackRatePercent"), attackType: String(form.elements.namedItem("attackType")?.value || "none"),
      combatAttackIncreasePercent: 0, partyDamageAmplificationPercent: 0, bossDamageTolerancePercent: 0,
      partyHardHitPercent: value("partyHardHitPercent"), bossHardHitResistancePercent: value("bossHardHitResistancePercent"),
      optionDelta: {
        baseAttack: value("deltaBaseAttack"), gearAttack: value("deltaGearAttack"), maxAttack: value("deltaMaxAttack"),
        pveAttack: value("deltaPveAttack"), bossAttack: value("deltaBossAttack"),
        attackIncreasePercent: value("deltaAttackIncreasePercent") + divine.attackIncreasePercent,
        damageBoostPercent: value("deltaDamageBoostPercent"), weaponDamageBoostPercent: value("deltaWeaponDamageBoostPercent"),
        criticalDamageBoostPercent: value("deltaCriticalDamageBoostPercent"), perfectPercent: value("deltaPerfectPercent") + divine.perfectPercent,
        smitePercent: value("deltaSmitePercent") + divine.smitePercent, frontDamageBoostPercent: value("deltaFrontDamageBoostPercent"),
        backDamageBoostPercent: value("deltaBackDamageBoostPercent"),
      },
    };
  }

  function formatNumber(value, digits = 0) {
    return new Intl.NumberFormat(locale, { maximumFractionDigits: digits }).format(Number(value) || 0);
  }

  function makeCompareRow(label, before, after) {
    const row = document.createElement("div");
    if (after > before + 1e-9) row.className = "up";
    else if (after < before - 1e-9) row.className = "dn";
    const name = document.createElement("span");
    const values = document.createElement("span");
    values.className = "mono";
    const current = document.createElement("small");
    const arrow = document.createElement("i");
    const changed = document.createElement("b");
    name.textContent = t(label);
    current.textContent = formatNumber(before, 2);
    arrow.textContent = "→";
    changed.textContent = formatNumber(after, 2);
    values.append(current, arrow, changed);
    row.append(name, values);
    return row;
  }

  function signed(number) {
    return `${number >= 0 ? "+" : ""}${formatNumber(number, 4)}%`;
  }

  function renderResult(result) {
    lastResult = result;
    resultEmpty.hidden = true;
    resultSummary.hidden = false;
    resultList.hidden = false;
    quickEmpty.hidden = true;
    setResultStatus("ready");
    resultSource.textContent = `${t(region === "GLOBAL" ? "regionGlobal" : "regionDomestic")} · ${t("source", { job: displayJob(result.jobName) })}`;

    const gain = document.createElement("div");
    const gainLabel = document.createElement("span");
    const gainValue = document.createElement("b");
    const gainNumber = Number(result.damageGainPercent) || 0;
    gain.className = "se3-gain" + (gainNumber > 0 ? " up" : gainNumber < 0 ? " dn" : "");
    gainLabel.textContent = t("damageGain");
    gainValue.textContent = signed(gainNumber);
    gainValue.className = "mono";
    gain.append(gainLabel, gainValue);
    if (result.hardHit?.deltaPercent) {
      const chance = result.hardHit;
      const details = document.createElement("div");
      details.className = "se3-hh";
      const rate = document.createElement("p");
      rate.textContent = t("hardHitRate", { stat: t("hardHit"), before: formatNumber(chance.before, 4), after: formatNumber(chance.after, 4) });
      const inputs = document.createElement("p");
      inputs.className = "mono sm";
      inputs.textContent = `${t("hardHit")} ${formatNumber(chance.basePercent, 4)}% (${signed(chance.deltaPercent)}) · ${t("partyHardHit")} ${formatNumber(chance.partyPercent, 4)}% · ${t("bossHardHitResistance")} ${formatNumber(chance.resistancePercent, 4)}%`;
      details.append(rate, inputs);
      if (chance.before === chance.after && (chance.after === 0 || chance.after === 100)) {
        const reason = document.createElement("p");
        reason.className = "warn";
        reason.textContent = t(chance.after === 0 ? "hardHitBlocked" : "hardHitCapped");
        details.append(reason);
      }
      const review = document.createElement("button");
      review.type = "button";
      review.className = "se3-link";
      review.textContent = t("hardHitSettings") + " →";
      review.addEventListener("click", () => {
        const input = form.elements.namedItem("criticalChancePercent");
        input.closest("details").open = true;
        window.requestAnimationFrame(() => {
          input.scrollIntoView({ block: "center", behavior: "smooth" });
          input.focus({ preventScroll: true });
        });
      });
      details.append(review);
      gain.append(details);
    }
    const comparison = document.createElement("div");
    comparison.className = "se3-cmp";
    comparison.append(
      makeCompareRow("expectedDamage", result.expectedDamage, result.adjustedExpectedDamage),
      makeCompareRow("effectiveAttack", result.effectiveAttack, result.adjustedEffectiveAttack),
      makeCompareRow("statWindowAttack", result.statWindowAttack, result.adjustedStatWindowAttack),
    );
    resultSummary.replaceChildren(gain, comparison);

    resultList.replaceChildren(...EFFECT_GROUPS.map(([unit, title]) => {
      const section = document.createElement("section");
      section.className = "se3-eg";
      const heading = document.createElement("h4");
      heading.textContent = t(title);
      section.append(heading);
      const effects = result.effects.filter(effect => effect.unit === unit).sort((a, b) => b.gainPercent - a.gainPercent);
      const max = Math.max(effects[0]?.gainPercent || 0, 1e-9);
      for (const [index, effect] of effects.entries()) {
        const row = document.createElement("div");
        row.className = index === 0 ? "se3-er top" : "se3-er";
        const rank = document.createElement("span");
        rank.className = "mono se3-er-n";
        rank.textContent = String(index + 1);
        const name = document.createElement("span");
        name.className = "se3-er-l";
        name.title = name.textContent = t(EFFECT_LABEL_KEYS[effect.key] || effect.key);
        const bar = document.createElement("span");
        bar.className = "se3-er-b";
        bar.setAttribute("aria-hidden", "true");
        const fill = document.createElement("i");
        fill.style.width = `${Math.max(0, effect.gainPercent / max) * 100}%`;
        bar.append(fill);
        const amount = document.createElement("b");
        amount.className = "mono";
        amount.textContent = signed(effect.gainPercent);
        row.append(rank, name, bar, amount);
        section.append(row);
      }
      return section;
    }));
  }

  function canCalculate() {
    return form.checkValidity() && value("attack") > 0 && value("maximumAttack") >= value("minimumAttack");
  }

  function setResultStatus(status) {
    resultStatus = status;
    resultCard.className = "se3-res st-" + status;
    confidence.className = "se3-conf " + status;
    confidence.textContent = status === "invalid" ? "!" : t(status === "busy" ? "calculating" : status);
    liveDot.classList.toggle("on", status === "busy");
  }

  function showInvalid() {
    lastResult = null;
    resultEmpty.hidden = false;
    resultSummary.hidden = true;
    resultList.hidden = true;
    quickEmpty.hidden = false;
    resultSource.textContent = t("pendingSource");
    formError.textContent = t("invalid");
    formError.hidden = false;
    setResultStatus("invalid");
  }

  function calculate() {
    if (!canCalculate()) return;
    formError.hidden = true;
    const result = globalThis.NotMeterStatEfficiencyCalculator.calculate(requestPayload());
    if (result.status !== "ready") { showInvalid(); return; }
    renderResult(result);
  }

  function scheduleCalculation(delay = RECALCULATE_DELAY_MS) {
    window.clearTimeout(recalculateTimer);
    if (!canCalculate()) return;
    setResultStatus("busy");
    recalculateTimer = window.setTimeout(() => void calculate(), delay);
  }

  function importStats() {
    try {
      applyClipboardProfile(parseClipboard(importInput.value));
    } catch {
      importState = importInput.value.trim() ? "error" : "waiting";
      renderImportStatus();
    }
  }
  importInput.addEventListener("input", importStats);
  exampleButton.addEventListener("click", () => {
    const bytes = new TextEncoder().encode(JSON.stringify(EXAMPLE_PROFILE));
    importInput.value = CLIPBOARD_PREFIX + btoa(String.fromCharCode(...bytes));
    importStats();
  });
  resetButton.addEventListener("click", () => {
    optionFields.forEach(input => { input.value = "0"; });
    if (baselineDivine) for (const [name, amount] of Object.entries(baselineDivine)) setField(name, amount);
    renderFieldStates();
    scheduleCalculation();
  });
  for (const button of directionButtons) {
    button.addEventListener("click", () => {
      const direction = form.elements.namedItem("attackType");
      direction.value = button.dataset.statDirection;
      for (const option of directionButtons) {
        const selected = option === button;
        option.classList.toggle("on", selected);
        option.setAttribute("aria-pressed", String(selected));
      }
      scheduleCalculation();
    });
  }
  form.addEventListener("submit", event => event.preventDefault());
  form.addEventListener("click", event => {
    const button = event.target.closest(".option-step-button");
    if (!button || !form.contains(button)) return;
    const input = button.closest(".se3-in")?.querySelector("input");
    if (!input) return;
    const current = Number(input.value);
    const step = Number(button.dataset.step);
    input.value = String(Math.round(((Number.isFinite(current) ? current : 0) + step) * 100) / 100);
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });
  form.addEventListener("input", event => {
    if (event.target === importInput) return;
    renderFieldStates();
    if (event.target.name === "bossHardHitResistancePercent") updateRegionSummary();
    if (!canCalculate()) {
      window.clearTimeout(recalculateTimer);
      if (lastResult || resultStatus !== "pending" || form.elements.namedItem("attack").value) showInvalid();
      return;
    }
    formError.hidden = true;
    scheduleCalculation();
  });
  form.addEventListener("change", event => {
    if (event.target !== importInput) scheduleCalculation(0);
  });

  document.getElementById("stat-region-domestic").addEventListener("click", () => selectRegion("KR_TW"));
  document.getElementById("stat-region-global").addEventListener("click", () => selectRegion("GLOBAL"));
  setField("bossHardHitResistancePercent", resistanceByRegion[region]);
  setupNumericFields();
  applyLocale();
  function syncSharedHelp() {
    const shell = document.getElementById("homepage-redesign")?.shadowRoot;
    const footer = shell?.querySelector(".nm-footer");
    if (!footer) return;
    let holder = shell.querySelector(".se3-shared-help");
    if (surface.hidden) {
      if (holder) holder.hidden = true;
      return;
    }
    if (!holder) {
      holder = document.createElement("div");
      holder.className = "nm-wrap se3-shared-help";
      holder.style.paddingBottom = "0";
      footer.before(holder);
    }
    holder.hidden = false;
    if (holder.dataset.locale === locale) return;
    holder.dataset.locale = locale;

    const escape = value => String(value || "").replace(/[&<>"']/g, char => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    })[char]);
    const label = (ko, en) => escape(locale === "ko" ? ko : (globalThis.NotMeterI18n?.text(en, locale) || en));
    const guide = document.getElementById("ranker-dungeon-guide");
    const from = key => escape(document.querySelector(`[data-i18n="${key}"]`)?.textContent.trim());
    const faq = ["Use", "Save", "Others", "Retention"].map(key => [
      from("rankerDungeonGuide" + key + "Title"), from("rankerDungeonGuide" + key + "Body"),
    ]);
    faq.push([from("rankerPreviewCombinedTitle"), from("rankerPreviewCombinedBody")],
      [label("CP가 올라 구간이 바뀌면?", "What if my CP bracket changes?"), from("rankerDungeonGuideMarkerBody")]);
    const tiers = [
      ["gold", label("움직이는 금색 다이아몬드", "Animated gold diamond"), label("닉네임 효과 자격 포함", "Includes nickname effect eligibility")],
      ["sky", label("하늘색 테두리", "Sky-blue frame"), label("정지 테두리", "Static frame")],
      ["purple", label("보라색 테두리", "Purple frame"), label("정지 테두리", "Static frame")],
    ];
    const rules = [
      ["200K", from("rankingEntrySpreadTitle"), from("rankingEntrySpread")],
      [label("5인", "5 players"), label("처치 확인", "Confirmed kill"), from("rankingEntryNote")],
      [":00 :30", label("집계 주기", "Aggregation schedule"), label("통계 집계는 매시 정각과 30분에 시작합니다.", "Aggregation starts on the hour and half hour.")],
      ["TOP 20", label("상세 보관", "Combat details"), label("TOP 20만 전투 상세를 보관합니다. 나머지 기록도 상위 10%·25% 기준선 계산에는 포함됩니다.", "Combat details are retained for the top 20. Other records contribute to the top 10% and 25% benchmarks.")],
    ];
    holder.innerHTML = `<div class="help"><section class="nm-guide">
      <div class="g-top"><div class="g-intro">
        <span class="eyebrow">${label("랭커 마크 · 닉네임 효과", "Ranker marks · Nickname effects")}</span>
        <h2>${label("주간 순위가", "Weekly ranks")}<br>${label("미터기 위에 표시됩니다", "appear in the meter")}</h2>
        <p>${label("CP 800K 이상, 현재 25K 구간(2M 이상은 단일 구간)에서 주간 DPS·nDPS 중 더 높은 순위로 판정합니다. 전체 기간 순위는 혜택에 포함되지 않으며, 유효한 쿠폰 혜택은 별도로 유지됩니다.", "The better weekly DPS or nDPS rank in the current 25K CP bracket counts from 800K CP. At 2M CP or above, there is one bracket. Valid coupon benefits apply independently.")}</p>
      </div><div class="g-tiers">${Array.from(guide.querySelectorAll(".ranker-preview-grid figure")).map((item, index) => {
        const [color, title, desc] = tiers[index];
        return `<div class="g-tier ${color}"><img src="${escape(item.querySelector("img").getAttribute("src"))}" alt="" width="96" height="96" loading="lazy"><span class="g-k mono">${from(item.dataset.previewTitle)}</span><b>${title}</b><small>${desc}</small></div>`;
      }).join("")}</div></div>
      <div class="g-bottom"><div class="g-faq"><h4>${label("자주 묻는 질문", "Frequently asked questions")}</h4>
        ${faq.map(([q, a]) => `<div class="fq"><button type="button" data-action="faq" aria-expanded="false"><span>${q}</span><span class="el-plus sm"></span></button><div class="fq-a"><div><p>${a}</p></div></div></div>`).join("")}
      </div><div class="g-dgs"><h4>${from("rankerDungeonGuideDungeonTitle")}</h4>
        <ul>${Array.from(guide.querySelectorAll(".ranker-dungeon-item")).slice(0, 7).map(item => {
          const name = item.querySelector("strong").textContent.trim().replace(/\s*[（(][^）)]+[）)]$/, "");
          const bosses = item.querySelector("p").textContent.trim();
          return `<li><b>${escape(name)}</b><span>${escape(bosses)}</span>${item.dataset.rankingBasis === "combat-time" ? `<em>${label("빠른 전투 시간 순", "Shortest combat time")}</em>` : ""}</li>`;
        }).join("")}</ul><p class="g-ex">${from("rankerGuideFrozenExcluded")} ${from("rankerDungeonGuideDummy")}</p>
      </div></div></section>
      <section class="nm-elig"><button class="el-toggle" type="button" data-action="eligibility" aria-expanded="false"><span>
        <b>${label("내 기록이 보이지 않나요?", "Can't find your record?")}</b><small>${label("랭킹 집계 조건 4가지를 확인하세요", "Check the four ranking eligibility rules")}</small></span><span class="el-plus"></span></button>
        <div class="el-body"><div><div class="el-grid">${rules.map(([number,title,desc]) => `<div class="el-card"><span class="el-n mono">${number}</span><b>${title}</b><p>${desc}</p></div>`).join("")}</div>
          <p class="el-foot">${from("rankerDungeonGuidePeriod")}</p></div></div>
      </section></div>`;
  }

  document.addEventListener("DOMContentLoaded", syncSharedHelp, { once: true });
  document.addEventListener("notmeter:surface", () => window.requestAnimationFrame(syncSharedHelp));

  window.NotMeterStatEfficiency = {
    activate() { applyLocale(); scheduleCalculation(0); },
    setLocale(value) { locale = globalThis.NotMeterI18n?.normalize(value) || (value === "en" || value === "zh-TW" ? value : "ko"); applyLocale(); },
  };
})();
