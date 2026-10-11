(() => {
  "use strict";

  const percentages = [
    "attackIncreasePercent", "damageAmplificationPercent", "weaponDamageAmplificationPercent",
    "pveDamageAmplificationPercent", "bossDamageAmplificationPercent", "criticalDamageAmplificationPercent",
    "perfectPercent", "hardHitPercent", "frontDamageAmplificationPercent", "backDamageAmplificationPercent",
    "raceDamageAmplificationPercent", "criticalChancePercent", "frontAttackRatePercent", "backAttackRatePercent",
    "combatAttackIncreasePercent", "partyDamageAmplificationPercent", "bossDamageTolerancePercent",
    "partyHardHitPercent", "bossHardHitResistancePercent",
  ];
  const attacks = ["attack", "additionalAttack", "minimumAttack", "maximumAttack", "pveAttack", "bossAttack"];
  const optionFields = [
    "baseAttack", "gearAttack", "maxAttack", "pveAttack", "bossAttack", "attackIncreasePercent",
    "damageBoostPercent", "weaponDamageBoostPercent", "criticalDamageBoostPercent", "perfectPercent",
    "smitePercent", "frontDamageBoostPercent", "backDamageBoostPercent",
  ];
  const standardDeltas = [
    ["power", "point", 1, { attackIncreasePercent: 0.1 }],
    ["destruction", "point", 1, { attackIncreasePercent: 0.2 }],
    ["justice", "point", 1, { perfectPercent: 0.2 }],
    ["wisdom", "point", 1, { smitePercent: 0.2 }],
    ["additionalAttack", "flat", 10, { baseAttack: 10 }],
    ["attack", "flat", 10, { gearAttack: 10 }],
    ["minimumAttack", "flat", 10, { minAttack: 10 }],
    ["maximumAttack", "flat", 10, { maxAttack: 10 }],
    ["pveAttack", "flat", 10, { pveAttack: 10 }],
    ["bossAttack", "flat", 10, { bossAttack: 10 }],
    ["attackIncrease", "percentPoint", 1, { attackIncreasePercent: 1 }],
    ["damageAmplification", "percentPoint", 1, { damageBoostPercent: 1 }],
    ["weaponDamageAmplification", "percentPoint", 1, { weaponDamageBoostPercent: 1 }],
    ["pveDamageAmplification", "percentPoint", 1, { pveDamageBoostPercent: 1 }],
    ["bossDamageAmplification", "percentPoint", 1, { bossDamageBoostPercent: 1 }],
    ["criticalDamageAmplification", "percentPoint", 1, { criticalDamageBoostPercent: 1 }],
    ["perfect", "percentPoint", 1, { perfectPercent: 1 }],
    ["hardHit", "percentPoint", 1, { smitePercent: 1 }],
    ["frontDamageAmplification", "percentPoint", 1, { frontDamageBoostPercent: 1 }],
    ["backDamageAmplification", "percentPoint", 1, { backDamageBoostPercent: 1 }],
  ];
  const inRange = (value, min, max) => Number.isFinite(value) && value >= min && value <= max;
  const clamp = value => Math.min(100, Math.max(0, value));
  const invalid = () => ({ status: "invalid", jobName: "", statWindowAttack: 0, effectiveAttack: 0,
    expectedDamage: 0, adjustedStatWindowAttack: 0, adjustedEffectiveAttack: 0,
    adjustedExpectedDamage: 0, damageGainPercent: 0, effects: [] });

  function evaluate(r, delta = {}) {
    const d = key => delta[key] ?? 0;
    const gearAttack = r.attack + d("gearAttack");
    const baseAttack = r.additionalAttack + d("baseAttack");
    const maximumAttack = r.maximumAttack + d("maxAttack");
    const minimumAttack = r.minimumAttack + d("minAttack");
    const averageAttack = (maximumAttack + minimumAttack) / 2;
    const attackIncrease = r.attackIncreasePercent + r.combatAttackIncreasePercent + d("attackIncreasePercent");
    const statWindowAttack = (gearAttack + baseAttack + averageAttack) * (1 + attackIncrease / 100);
    const perfectRate = clamp(r.perfectPercent + d("perfectPercent")) / 100;
    const perfectWeightedAttack = perfectRate * maximumAttack + (1 - perfectRate) * averageAttack;
    const weaponDamageRate = (r.weaponDamageAmplificationPercent + d("weaponDamageBoostPercent")) / 100;
    const rawAttack = gearAttack * (1 + weaponDamageRate) + baseAttack + perfectWeightedAttack * (1 + weaponDamageRate);
    const effectiveAttack = rawAttack * (1 + attackIncrease / 100) + r.pveAttack + d("pveAttack") + r.bossAttack + d("bossAttack");
    const criticalMultiplier = 1 + clamp(r.criticalChancePercent) / 100 *
      ((150 + r.criticalDamageAmplificationPercent + d("criticalDamageBoostPercent")) / 100 - 1);
    const hardHitChance = clamp(r.partyHardHitPercent + r.hardHitPercent + d("smitePercent") - r.bossHardHitResistancePercent);
    const hardHitMultiplier = 1 + hardHitChance / 100;
    const directionalMultiplier = r.attackType === "front"
      ? 1 + clamp(r.frontAttackRatePercent) / 100 * ((r.frontDamageAmplificationPercent + d("frontDamageBoostPercent")) / 100)
      : r.attackType === "back"
        ? 1 + clamp(r.backAttackRatePercent) / 100 * ((r.backDamageAmplificationPercent + d("backDamageBoostPercent")) / 100) : 1;
    const amplificationPercent = r.damageAmplificationPercent + d("damageBoostPercent") +
      r.pveDamageAmplificationPercent + d("pveDamageBoostPercent") + r.bossDamageAmplificationPercent +
      d("bossDamageBoostPercent") + r.raceDamageAmplificationPercent + r.partyDamageAmplificationPercent - r.bossDamageTolerancePercent;
    const amplificationMultiplier = 1 + amplificationPercent / 100;
    const expectedDamage = effectiveAttack * amplificationMultiplier * criticalMultiplier * hardHitMultiplier * directionalMultiplier;
    return { statWindowAttack, effectiveAttack, expectedDamage, amplificationMultiplier,
      criticalMultiplier, hardHitMultiplier, directionalMultiplier };
  }

  function validEvaluation(value) {
    return [value.statWindowAttack, value.effectiveAttack, value.expectedDamage]
      .every(number => Number.isFinite(number) && number > 0) &&
      value.amplificationMultiplier > 0 && value.criticalMultiplier > 0 &&
      value.hardHitMultiplier > 0 && value.directionalMultiplier > 0;
  }

  function calculate(input) {
    if (!input || typeof input !== "object" || Array.isArray(input)) return invalid();
    const r = Object.fromEntries([...attacks, ...percentages].map(key =>
      [key, input[key] === undefined ? (key === "bossHardHitResistancePercent" ? 30 : 0) : input[key]]));
    const attackType = input.attackType === undefined ? "none" : input.attackType;
    if (typeof attackType !== "string") return invalid();
    r.attackType = attackType.trim().toLowerCase();
    if (!attacks.every(key => inRange(r[key], key === "attack" ? 0.0001 : key === "maximumAttack" ? r.minimumAttack : 0, 100_000_000)) ||
        !percentages.every(key => inRange(r[key], -1_000, 1_000)) || !["none", "front", "back"].includes(r.attackType)) return invalid();
    const option = input.optionDelta === undefined ? {} : input.optionDelta;
    if (!option || typeof option !== "object" || Array.isArray(option)) return invalid();
    const delta = Object.fromEntries(optionFields.map(key => [key, option[key] === undefined ? 0 : option[key]]));
    if (!optionFields.every(key => inRange(delta[key], -100_000_000, 100_000_000))) return invalid();
    const baseline = evaluate(r), adjusted = evaluate(r, delta);
    if (!validEvaluation(baseline) || !validEvaluation(adjusted) ||
        r.attack + delta.gearAttack < 0 || r.additionalAttack + delta.baseAttack < 0 ||
        r.maximumAttack + delta.maxAttack < r.minimumAttack ||
        r.pveAttack + delta.pveAttack < 0 || r.bossAttack + delta.bossAttack < 0) return invalid();
    const effects = standardDeltas.map(([key, unit, amount, change]) => {
      const candidate = evaluate(r, change);
      return { key, unit, amount, gainPercent: candidate.expectedDamage / baseline.expectedDamage * 100 - 100,
        effectiveAttack: candidate.effectiveAttack, expectedDamage: candidate.expectedDamage };
    });
    return {
      status: "ready", jobName: typeof input.jobName === "string" ? input.jobName.trim().slice(0, 24) : "",
      statWindowAttack: baseline.statWindowAttack, effectiveAttack: baseline.effectiveAttack, expectedDamage: baseline.expectedDamage,
      adjustedStatWindowAttack: adjusted.statWindowAttack, adjustedEffectiveAttack: adjusted.effectiveAttack,
      adjustedExpectedDamage: adjusted.expectedDamage, damageGainPercent: adjusted.expectedDamage / baseline.expectedDamage * 100 - 100, effects,
    };
  }

  const calculator = Object.freeze({ calculate });
  globalThis.NotMeterStatEfficiencyCalculator = calculator;
  if (typeof module !== "undefined" && module.exports) module.exports = calculator;
})();
