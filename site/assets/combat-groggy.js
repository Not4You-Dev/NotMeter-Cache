(() => {
  "use strict";
  const text = {
    ko: ["그로기 구간", "확인된 구간", "관측 시간", "이 구간에 준 피해", "구간 DPS", "일부 구간만 확인됨", "시작 또는 종료를 확인하지 못한 구간은 관측된 시간과 피해만 표시합니다.", "확인된 그로기 구간이 없습니다.", "구간", "스킬", "타수", "피해", "스킬별 상세 보기", "이 캐릭터가 해당 보스의 그로기 상태에서 준 피해입니다. 전체 피해와 DPS에는 영향을 주지 않습니다.", "이 기록에는 구간별 타격 통계가 없습니다.", "해당 스킬 피해량 / 이 구간에서 본인이 준 피해량", "전체 전투 스킬", "이 구간의 스킬", "구간 피해 중 비율", "전체 구간 합계", "구간 선택", "이전 구간", "다음 구간"],
    en: ["Stagger windows", "Observed windows", "Observed time", "Damage in these windows", "Window DPS", "Partial observation", "When a start or end was not observed, only the observed time and damage are shown.", "No Stagger windows were observed.", "Window", "Skill", "Hits", "Damage", "View skill details", "Damage this character dealt while the boss was in Stagger. Overall damage and DPS are unchanged.", "Per-window hit statistics are unavailable for this record.", "Skill damage / your damage in this window", "All combat skills", "Skills in this window", "Share of window damage", "All windows combined", "Select a window", "Previous window", "Next window"],
    "zh-TW": ["眩暈時段", "已確認時段", "觀測時間", "時段內造成的傷害", "時段 DPS", "僅確認部分時段", "未確認開始或結束時，只顯示觀測到的時間與傷害。", "未觀測到眩暈時段。", "時段", "技能", "命中次數", "傷害", "查看技能詳細資料", "此角色在首領眩暈時造成的傷害，不會改變總傷害與 DPS。", "此紀錄沒有各時段的命中統計。", "技能傷害／此時段自己造成的傷害", "整場戰鬥技能", "此時段的技能", "時段傷害占比", "所有時段合計", "選擇時段", "上一時段", "下一時段"],
    "ja-JP": ["グロッキー区間", "確認できた区間", "観測時間", "区間中の与ダメージ", "区間 DPS", "一部のみ確認", "開始または終了を確認できなかった区間は、観測できた時間とダメージのみ表示します。", "グロッキー区間は観測されていません。", "区間", "スキル", "ヒット数", "ダメージ", "スキル詳細を見る", "ボスがグロッキー状態の間に、このキャラクターが与えたダメージです。総ダメージと DPS は変わりません。", "この記録には区間別のヒット統計がありません。", "スキルのダメージ／この区間で自分が与えたダメージ", "戦闘全体のスキル", "この区間のスキル", "区間ダメージの割合", "全区間の合計", "区間を選択", "前の区間", "次の区間"],
    "de-DE": ["Benommenheitsphasen", "Erfasste Phasen", "Erfasste Zeit", "Schaden in diesen Phasen", "Phasen-DPS", "Teilweise erfasst", "Wurde der Beginn oder das Ende nicht erfasst, werden nur die erfasste Zeit und der erfasste Schaden angezeigt.", "Keine Benommenheitsphasen erfasst.", "Phase", "Fähigkeit", "Treffer", "Schaden", "Fähigkeitsdetails anzeigen", "Schaden dieses Charakters, während der Boss benommen war. Gesamtschaden und DPS bleiben unverändert.", "Für diesen Bericht sind keine Trefferstatistiken pro Phase verfügbar.", "Fähigkeitsschaden / eigener Schaden in dieser Phase", "Fähigkeiten im gesamten Kampf", "Fähigkeiten dieser Phase", "Anteil am Phasenschaden", "Alle Phasen zusammen", "Phase auswählen", "Vorherige Phase", "Nächste Phase"],
    "fr-FR": ["Périodes de déséquilibre", "Périodes observées", "Temps observé", "Dégâts pendant ces périodes", "DPS de la période", "Observation partielle", "Si le début ou la fin n’a pas été observé, seuls le temps et les dégâts observés sont affichés.", "Aucune période de déséquilibre observée.", "Période", "Compétence", "Coups", "Dégâts", "Voir le détail des compétences", "Dégâts infligés par ce personnage pendant le déséquilibre du boss. Le total des dégâts et le DPS restent inchangés.", "Les statistiques de coups par période ne sont pas disponibles pour ce rapport.", "Dégâts de la compétence / vos dégâts pendant cette période", "Compétences du combat entier", "Compétences de cette période", "Part des dégâts de la période", "Total de toutes les périodes", "Choisir une période", "Période précédente", "Période suivante"],
    "es-ES": ["Periodos de tambaleo", "Periodos observados", "Tiempo observado", "Daño en estos periodos", "DPS del periodo", "Observación parcial", "Si no se observó el inicio o el final, solo se muestran el tiempo y el daño observados.", "No se observaron periodos de tambaleo.", "Periodo", "Habilidad", "Golpes", "Daño", "Ver detalles de habilidades", "Daño de este personaje mientras el jefe estaba en tambaleo. El daño total y el DPS no cambian.", "Este registro no incluye estadísticas de golpes por periodo.", "Daño de la habilidad / tu daño durante este periodo", "Habilidades de todo el combate", "Habilidades de este periodo", "Porcentaje del daño del periodo", "Total de todos los periodos", "Seleccionar periodo", "Periodo anterior", "Periodo siguiente"],
    "pt-BR": ["Períodos de desequilíbrio", "Períodos observados", "Tempo observado", "Dano nestes períodos", "DPS do período", "Observação parcial", "Quando o início ou o fim não foi observado, apenas o tempo e o dano observados são exibidos.", "Nenhum período de desequilíbrio foi observado.", "Período", "Habilidade", "Acertos", "Dano", "Ver detalhes das habilidades", "Dano deste personagem enquanto o chefe estava em desequilíbrio. O dano total e o DPS permanecem iguais.", "Este registro não possui estatísticas de acertos por período.", "Dano da habilidade / seu dano neste período", "Habilidades do combate inteiro", "Habilidades deste período", "Parcela do dano do período", "Total de todos os períodos", "Selecionar período", "Período anterior", "Próximo período"],
    vi: ["Khoảng Stagger", "Khoảng đã ghi nhận", "Thời gian ghi nhận", "Sát thương trong các khoảng", "DPS trong khoảng", "Chỉ ghi nhận một phần", "Nếu không ghi nhận được lúc bắt đầu hoặc kết thúc, chỉ hiển thị thời gian và sát thương đã ghi nhận.", "Chưa ghi nhận khoảng Stagger nào.", "Khoảng", "Kỹ năng", "Số lần trúng", "Sát thương", "Xem chi tiết kỹ năng", "Sát thương nhân vật này gây ra khi boss ở trạng thái Stagger. Tổng sát thương và DPS không thay đổi.", "Bản ghi này không có thống kê đòn đánh theo từng khoảng.", "Sát thương kỹ năng / sát thương của bạn trong khoảng này", "Kỹ năng toàn trận", "Kỹ năng trong khoảng này", "Tỷ lệ sát thương trong khoảng", "Tổng tất cả các khoảng", "Chọn khoảng", "Khoảng trước", "Khoảng tiếp theo"],
    "ru-RU": ["Периоды ошеломления", "Зафиксированные периоды", "Время наблюдения", "Урон за эти периоды", "DPS за период", "Частичные данные", "Если начало или конец не зафиксированы, показаны только наблюдавшиеся время и урон.", "Периоды ошеломления не зафиксированы.", "Период", "Умение", "Попадания", "Урон", "Подробности по умениям", "Урон этого персонажа, пока босс был ошеломлён. Общий урон и DPS не меняются.", "В этой записи нет статистики попаданий по периодам.", "Урон умения / ваш урон за этот период", "Умения за весь бой", "Умения за этот период", "Доля урона за период", "Итого за все периоды", "Выбрать период", "Предыдущий период", "Следующий период"],
  };
  const keys = ["title", "count", "time", "damage", "dps", "partial", "partialHelp", "empty", "phase", "skill", "hits", "skillDamage", "expand", "help", "metricsUnavailable", "phaseShare", "allSkills", "phaseSkills", "skillShare", "combined", "selectPhase", "previousPhase", "nextPhase"];
  function labels(locale) { return Object.fromEntries(keys.map((key, i) => [key, (text[locale] || text.en)[i]])); }
  function integer(value, maximum = Number.MAX_SAFE_INTEGER) { return Number.isSafeInteger(value) && value >= 0 && value <= maximum; }
  function validMetrics(stats, skill) {
    return stats == null || typeof stats === "object" && !Array.isArray(stats) &&
      integer(stats.attemptCount, 1000000) && stats.attemptCount >= skill.hitCount &&
      integer(stats.evadeCount, stats.attemptCount - skill.hitCount) &&
      ["criticalHits", "frontAttackHits", "backAttackHits", "perfectHits", "doubleDamageHits", "parryHits"].every(key => integer(stats[key], skill.hitCount)) &&
      ["multiHitCount", "useCount", "periodicHitCount"].every(key => integer(stats[key], 1000000)) &&
      integer(stats.minHit, skill.damage) && integer(stats.maxHit, skill.damage) && stats.maxHit >= stats.minHit &&
      integer(stats.periodicDamage, skill.damage);
  }
  function skillDetail(skill, metadata, phaseDamage) {
    const stats = skill.metrics;
    if (!stats || !validMetrics(stats, skill)) return null;
    const rate = value => skill.hitCount > 0 ? value * 100 / skill.hitCount : 0;
    const position = value => stats.frontAttackHits + stats.backAttackHits > 0 ? rate(value) : null;
    return { skillCode: skill.skillCode, rawSkillCode: skill.rawSkillCode, skillName: metadata?.skillName,
      skillLevel: metadata?.skillLevel, specializationFlags: metadata?.specializationFlags || [],
      totalDamage: skill.damage, hitCount: skill.hitCount, attemptCount: stats.attemptCount, evadeCount: stats.evadeCount,
      blockHits: 0, blockRate: 0, multiHitCount: stats.multiHitCount, useCount: stats.useCount,
      periodicDamage: stats.periodicDamage, periodicHitCount: stats.periodicHitCount,
      healingAmount: 0, healingHitCount: 0, drainHealingAmount: 0,
      hitRate: stats.attemptCount > 0 ? skill.hitCount * 100 / stats.attemptCount : 0,
      evadeRate: stats.attemptCount > 0 ? stats.evadeCount * 100 / stats.attemptCount : 0,
      criticalRate: rate(stats.criticalHits), frontAttackRate: position(stats.frontAttackHits), backAttackRate: position(stats.backAttackHits),
      perfectRate: rate(stats.perfectHits), doubleDamageRate: rate(stats.doubleDamageHits), parryRate: rate(stats.parryHits),
      averageDamage: skill.hitCount > 0 ? skill.damage / skill.hitCount : 0, minHit: stats.minHit, maxHit: stats.maxHit,
      damagePercentage: phaseDamage > 0 ? skill.damage * 100 / phaseDamage : 0, averageUseIntervalMilliseconds: null };
  }
  function model(analysis, durationSeconds, totalDamage) {
    if (!analysis || analysis.version !== 1 || !Array.isArray(analysis.phases) || analysis.phases.length > 128 ||
        !Number.isFinite(durationSeconds) || durationSeconds <= 0 || durationSeconds > 86400 || !integer(totalDamage)) return null;
    let previousEnd = 0, damage = 0, milliseconds = 0;
    const phases = [];
    for (const phase of analysis.phases) {
      if (!phase || !integer(phase.startMilliseconds) || !integer(phase.endMilliseconds, Math.ceil(durationSeconds * 1000)) ||
          phase.startMilliseconds < previousEnd || phase.endMilliseconds <= phase.startMilliseconds ||
          !integer(phase.damage, totalDamage - damage) || !integer(phase.hitCount, 1000000) ||
          !Array.isArray(phase.skills) || phase.skills.length > 192) return null;
      let skillDamage = 0, hits = 0;
      const identities = new Set();
      for (const skill of phase.skills) {
        if (!skill || !integer(skill.skillCode, 2147483647) || !integer(skill.rawSkillCode, 2147483647) ||
            !(skill.skillCode > 0 || skill.rawSkillCode > 0) || !integer(skill.damage, phase.damage - skillDamage) ||
            !integer(skill.hitCount, phase.hitCount - hits) || !validMetrics(skill.metrics, skill)) return null;
        const key = `${skill.skillCode}:${skill.rawSkillCode}`;
        if (identities.has(key)) return null;
        identities.add(key); skillDamage += skill.damage; hits += skill.hitCount;
      }
      if (skillDamage !== phase.damage || hits !== phase.hitCount) return null;
      const duration = phase.endMilliseconds - phase.startMilliseconds;
      phases.push({ ...phase, duration, dps: phase.damage * 1000 / duration,
        partial: phase.startObserved !== true || phase.endObserved !== true,
        skills: [...phase.skills].sort((a, b) => b.damage - a.damage || b.hitCount - a.hitCount || a.skillCode - b.skillCode) });
      previousEnd = phase.endMilliseconds; damage += phase.damage; milliseconds += duration;
    }
    return { phases, damage, milliseconds, dps: milliseconds > 0 ? damage * 1000 / milliseconds : null,
      partial: analysis.complete !== true || phases.some(phase => phase.partial) };
  }
  function element(tag, className, content) {
    const node = document.createElement(tag);
    node.className = className;
    if (content != null) node.textContent = content;
    return node;
  }
  function timestamp(milliseconds) {
    const seconds = Math.floor(milliseconds / 1000);
    return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}.${String(milliseconds % 1000).padStart(3, "0")}`;
  }
  const views = new WeakMap();
  function sync(options) {
    const host = document.getElementById("detail-groggy");
    const tabs = document.getElementById("detail-scope-tabs");
    const full = document.getElementById("detail-skill-rows");
    const heading = full?.parentElement.querySelector(".detail-ledger-header");
    if (!host || !tabs || !full || !heading) return;
    host.replaceChildren();
    tabs.replaceChildren();
    tabs.onkeydown = null;
    const data = options.unavailable ? null : model(options.detail?.groggyAnalysis, Number(options.record?.durationSeconds), Number(options.detail?.totalDamage));
    host.hidden = true;
    tabs.hidden = !data;
    full.hidden = heading.hidden = false;
    if (!data) {
      views.delete(host);
      full.removeAttribute("role");
      full.removeAttribute("aria-labelledby");
      return;
    }
    let view = views.get(host);
    if (!view || view.record !== options.record || view.actorId !== options.detail?.actorId) {
      view = { record: options.record, actorId: options.detail?.actorId, scope: "full", phase: 0, fullOffset: 0 };
      views.set(host, view);
    }
    view.phase = Math.max(0, Math.min(view.phase, data.phases.length - 1));
    const t = labels(options.locale);
    const formatter = new Intl.NumberFormat(options.locale === "ko" ? "ko-KR" : options.locale || "en", { maximumFractionDigits: 0 });
    const timeFormat = new Intl.NumberFormat(options.locale || "en", { minimumFractionDigits: 1, maximumFractionDigits: 3 });
    const seconds = ms => `${timeFormat.format(ms / 1000)} s`;
    tabs.setAttribute("role", "tablist");
    const allTab = element("button", "detail-scope-tab", t.allSkills);
    const groggyTab = element("button", "detail-scope-tab", `${t.title}  ${data.phases.length}`);
    allTab.id = "detail-scope-all";
    groggyTab.id = "detail-scope-groggy";
    full.setAttribute("role", "tabpanel");
    full.setAttribute("aria-labelledby", allTab.id);
    host.setAttribute("role", "tabpanel");
    host.setAttribute("aria-labelledby", groggyTab.id);
    for (const [button, panel] of [[allTab, full], [groggyTab, host]]) {
      button.type = "button";
      button.setAttribute("role", "tab");
      button.setAttribute("aria-controls", panel.id);
      tabs.append(button);
    }
    let populated = false;
    function showScope(scope, save = true) {
      if (save && view.scope === "full") view.fullOffset = full.scrollTop;
      view.scope = scope;
      const groggy = scope === "groggy";
      full.hidden = heading.hidden = groggy;
      host.hidden = !groggy;
      for (const [button, selected] of [[allTab, !groggy], [groggyTab, groggy]]) {
        button.setAttribute("aria-selected", String(selected));
        button.tabIndex = selected ? 0 : -1;
      }
      if (groggy && !populated) { populate(); populated = true; }
      if (!groggy) full.scrollTop = view.fullOffset;
    }
    allTab.addEventListener("click", () => showScope("full"));
    groggyTab.addEventListener("click", () => showScope("groggy"));
    tabs.onkeydown = event => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      const scope = event.key === "Home" ? "full" : event.key === "End" ? "groggy" : view.scope === "full" ? "groggy" : "full";
      showScope(scope);
      (scope === "full" ? allTab : groggyTab).focus();
    };
    function metricList(className, values) {
      const list = element("dl", className);
      for (const [label, value] of values) {
        const group = element("div", "");
        group.append(element("dt", "", label), element("dd", "", value));
        list.append(group);
      }
      return list;
    }
    function populate() {
      if (!data.phases.length) { host.append(element("p", "groggy-empty", t.empty)); return; }
      const total = element("div", "groggy-totals");
      total.title = t.help;
      total.append(element("strong", "", t.combined), metricList("groggy-total-metrics", [
        [t.time, seconds(data.milliseconds)], [t.skillDamage, formatter.format(data.damage)], [t.dps, formatter.format(data.dps)],
      ]));
      const selected = element("div", "groggy-selected");
      const navigation = element("div", "groggy-navigation");
      const picker = element("select", "groggy-picker");
      picker.setAttribute("aria-label", t.selectPhase);
      data.phases.forEach((phase, index) => {
        const option = element("option", "", `${t.phase} ${index + 1} / ${data.phases.length} · ${timestamp(phase.startMilliseconds)} – ${timestamp(phase.endMilliseconds)}`);
        option.value = String(index);
        picker.append(option);
      });
      picker.value = String(view.phase);
      const previous = element("button", "groggy-previous", "‹");
      const next = element("button", "groggy-next", "›");
      for (const [button, label] of [[previous, t.previousPhase], [next, t.nextPhase]]) {
        button.type = "button"; button.title = label; button.setAttribute("aria-label", label);
      }
      navigation.append(picker, previous, next);
      const metrics = element("div", "groggy-current-metrics");
      selected.append(navigation, metrics);
      const body = element("div", "groggy-scroll");
      function showPhase(index) {
        view.phase = Math.max(0, Math.min(index, data.phases.length - 1));
        picker.value = String(view.phase);
        previous.disabled = view.phase === 0;
        next.disabled = view.phase === data.phases.length - 1;
        const phase = data.phases[view.phase];
        metrics.replaceChildren(metricList("groggy-metrics", [[t.time, seconds(phase.duration)],
          [t.skillDamage, formatter.format(phase.damage)], [t.dps, formatter.format(phase.dps)]]));
        body.replaceChildren();
        if (phase.partial) body.append(element("p", "groggy-partial", t.partial));
        const skillHeading = element("div", "groggy-skill-heading");
        skillHeading.append(element("strong", "", `${t.phaseSkills}  ${phase.skills.length}`), element("span", "", t.skillShare));
        const rows = element("div", "groggy-skills");
        for (const skill of phase.skills) {
          const metadata = options.detail.skills?.find(row => Number(row.skillCode) === skill.skillCode && Number(row.rawSkillCode) === skill.rawSkillCode) ||
            options.detail.skills?.find(row => Number(row.skillCode) === skill.skillCode) || { ...skill, skillName: t.skill };
          const detail = skillDetail(skill, metadata, phase.damage);
          if (detail && options.skillRow) {
            const row = options.skillRow(detail);
            for (const share of row.querySelectorAll(".detail-skill-share,.detail-skill-track")) share.title = t.phaseShare;
            rows.append(row);
            continue;
          }
          const row = element("div", "groggy-legacy-skill");
          const identity = element("span", "groggy-skill-name");
          const icon = element("span", "groggy-skill-icon");
          options.icon?.(icon, metadata, 24);
          identity.append(icon, element("span", "", options.skillName?.(metadata) || metadata.skillName || t.skill));
          row.append(identity, element("span", "groggy-legacy-value", `${formatter.format(skill.damage)} · ${t.hits} ${formatter.format(skill.hitCount)}`),
            element("p", "groggy-help", t.metricsUnavailable));
          rows.append(row);
        }
        body.append(skillHeading, rows);
        body.scrollTop = 0;
      }
      picker.addEventListener("change", () => showPhase(Number(picker.value)));
      previous.addEventListener("click", () => showPhase(view.phase - 1));
      next.addEventListener("click", () => showPhase(view.phase + 1));
      host.append(total, selected);
      if (data.partial) host.append(element("p", "groggy-observation", t.partialHelp));
      host.append(body);
      showPhase(view.phase);
    }
    showScope(view.scope, false);
  }
  globalThis.NotMeterGroggyAnalysis = Object.freeze({ model, labels, sync, skillDetail });
})();
