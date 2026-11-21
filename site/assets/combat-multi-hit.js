(function () {
  "use strict";

  const translations = {
  "ko": [
    "다단히트 상세",
    "다단히트 총 추가 피해",
    "종료 타수",
    "발동 횟수",
    "최종 타수별 추가 피해 합계",
    "각 타격의 도달률과 피해",
    "누적 피해",
    "다단히트 상세 보기",
    "다단히트 접기",
    "전체 명중 중 도달률",
    "다단 발동 중 4타 도달",
    "추가 타격",
    "{0}타째",
    "해당 타격 횟수",
    "평균 피해",
    "최대 피해",
    "스킬 피해 중 추가 피해 비중",
    "명중 1회당 평균 추가 피해",
    "발동 1회당 평균 추가 타수",
    "다음 타격 연결률",
    "전체 명중 {hits}회 중 {procs}회에 추가 타격이 발동했습니다. 피해 비중은 NotMeter에 기록된 스킬 총 피해를 기준으로 합니다."
  ],
  "zh-TW": [
    "多段命中明細",
    "多段命中追加總傷害",
    "最終打擊數",
    "觸發次數",
    "依最終打擊數統計追加總傷害",
    "各擊到達率與傷害",
    "累計傷害",
    "查看多段命中",
    "收合明細",
    "佔全部命中",
    "觸發後達到第 4 擊",
    "追加打擊",
    "第 {0} 擊",
    "該擊次數",
    "平均傷害",
    "最高傷害",
    "追加傷害佔技能總傷害",
    "每次命中的平均追加傷害",
    "每次觸發的平均追加打擊數",
    "接續下一擊的比例",
    "共命中 {hits} 次，其中 {procs} 次觸發追加打擊。傷害占比以 NotMeter 記錄的技能總傷害為準。"
  ],
  "ja-JP": [
    "追加ヒットの詳細",
    "追加ヒットの総ダメージ",
    "最終ヒット数",
    "発動回数",
    "最終ヒット数別の合計追加ダメージ",
    "各ヒットの到達率とダメージ",
    "累計ダメージ",
    "追加ヒット詳細を表示",
    "詳細を閉じる",
    "全命中に対する到達率",
    "発動時の4撃目到達率",
    "追加ヒット",
    "{0}撃目",
    "この段の命中数",
    "平均ダメージ",
    "最大ダメージ",
    "スキル総ダメージに占める割合",
    "命中1回あたりの平均追加ダメージ",
    "発動1回あたりの平均追加ヒット数",
    "次のヒットに続く割合",
    "命中 {hits} 回のうち {procs} 回で追加ヒットが発動しました。ダメージの割合は NotMeter が記録したスキルの総ダメージを基準にしています。"
  ],
  "th-TH": [
    "รายละเอียดการโจมตีเพิ่มเติม",
    "ความเสียหายเพิ่มเติมสะสมทั้งหมด",
    "จำนวนครั้งสุดท้าย",
    "จำนวนที่เกิด",
    "ความเสียหายเพิ่มเติมรวมตามจำนวนครั้งสุดท้าย",
    "อัตราการเกิดและความเสียหายของแต่ละการโจมตี",
    "ความเสียหายสะสม",
    "ดูรายละเอียดการโจมตีเพิ่ม",
    "ซ่อนรายละเอียด",
    "สัดส่วนต่อการโจมตีที่โดนทั้งหมด",
    "ถึงครั้งที่ 4 เมื่อโจมตีเพิ่มทำงาน",
    "การโจมตีเพิ่ม",
    "ครั้งที่ {0}",
    "จำนวนครั้งที่โดน",
    "ความเสียหายเฉลี่ย",
    "ความเสียหายสูงสุด",
    "สัดส่วนความเสียหายเสริมต่อความเสียหายสกิล",
    "ความเสียหายเสริมเฉลี่ยต่อครั้งที่โจมตีโดน",
    "จำนวนครั้งที่โจมตีเพิ่มเฉลี่ยต่อการทำงาน",
    "อัตราที่ต่อถึงการโจมตีครั้งถัดไป",
    "การโจมตีเสริมเกิดขึ้น {procs} ครั้งจากการโจมตีที่โดน {hits} ครั้ง สัดส่วนความเสียหายเทียบกับความเสียหายรวมของสกิลที่ NotMeter บันทึกไว้"
  ],
  "de-DE": [
    "Zusatztreffer im Detail",
    "Gesamtschaden aller Zusatztreffer",
    "Serienlänge",
    "Auslösungen",
    "Zusatzschaden nach Trefferzahl pro Serie",
    "Anteil und Schaden je Zusatztreffer",
    "Gesamtschaden",
    "Zusatztreffer anzeigen",
    "Details ausblenden",
    "Anteil aller Treffer",
    "4. Zusatztreffer bei Auslösung",
    "Zusatztreffer",
    "{0}. Treffer",
    "Trefferanzahl",
    "Ø Schaden",
    "Max. Schaden",
    "Anteil am Fertigkeitsschaden",
    "Zusatzschaden je gelandetem Treffer",
    "Zusatztreffer je Auslösung",
    "Nächster Treffer erreicht",
    "Bei {procs} von {hits} Treffern wurden Zusatztreffer ausgelöst. Der Schadensanteil bezieht sich auf den von NotMeter erfassten Gesamtschaden der Fertigkeit."
  ],
  "fr-FR": [
    "Détail des coups supplémentaires",
    "Dégâts cumulés des coups supplémentaires",
    "Longueur de série",
    "Déclenchements",
    "Dégâts supplémentaires par longueur de série",
    "Fréquence et dégâts de chaque coup",
    "Dégâts cumulés",
    "Voir les coups supplémentaires",
    "Masquer le détail",
    "Part de tous les coups au but",
    "Séries ayant atteint le 4ᵉ coup",
    "Coup supplémentaire",
    "Coup n° {0}",
    "Coups observés",
    "Dégâts moyens",
    "Dégâts maximums",
    "Part des dégâts de la compétence",
    "Dégâts supplémentaires par coup au but",
    "Coups supplémentaires par déclenchement",
    "Coup suivant atteint",
    "Sur {hits} coups au but, {procs} ont déclenché des coups supplémentaires. Leur part est calculée sur les dégâts totaux de la compétence enregistrés par NotMeter."
  ],
  "es-ES": [
    "Detalle de golpes adicionales",
    "Daño total de los golpes adicionales",
    "Golpes por serie",
    "Activaciones",
    "Daño adicional por longitud de la serie",
    "Frecuencia y daño de cada golpe",
    "Daño acumulado",
    "Ver golpes adicionales",
    "Ocultar detalles",
    "% de todos los aciertos",
    "Activaciones con 4 golpes extra",
    "Golpe adicional",
    "Golpe {0}",
    "Golpes registrados",
    "Daño medio",
    "Daño máximo",
    "Porcentaje del daño de la habilidad",
    "Daño adicional por acierto",
    "Golpes adicionales por activación",
    "Alcance del siguiente golpe",
    "De {hits} aciertos, {procs} activaron golpes adicionales. El porcentaje de daño se calcula sobre el daño total de la habilidad registrado por NotMeter."
  ],
  "pt-BR": [
    "Detalhes dos golpes adicionais",
    "Dano total dos golpes adicionais",
    "Golpes por sequência",
    "Ativações",
    "Dano adicional por tamanho da sequência",
    "Frequência e dano de cada golpe",
    "Dano acumulado",
    "Ver golpes adicionais",
    "Ocultar detalhes",
    "% de todos os acertos",
    "Ativações com 4 golpes extras",
    "Golpe adicional",
    "Golpe {0}",
    "Golpes registrados",
    "Dano médio",
    "Dano máximo",
    "Parcela do dano da habilidade",
    "Dano adicional por acerto",
    "Golpes adicionais por ativação",
    "Chance observada de continuar",
    "Dos {hits} acertos, {procs} ativaram golpes adicionais. A porcentagem de dano usa o dano total da habilidade registrado pelo NotMeter."
  ],
  "ru-RU": [
    "Дополнительные удары",
    "Общий урон дополнительных ударов",
    "Длина серии",
    "Срабатывания",
    "Суммарный урон по длине серии",
    "Частота и урон каждого удара",
    "Суммарный урон",
    "Показать доп. удары",
    "Скрыть подробности",
    "Доля всех попаданий",
    "Серии с 4 доп. ударами",
    "Доп. удар",
    "Удар № {0}",
    "Число ударов",
    "Средний урон",
    "Макс. урон",
    "Доля в уроне умения",
    "Доп. урон за попадание",
    "Доп. ударов за срабатывание",
    "Доля серий со следующим ударом",
    "Дополнительные удары сработали при {procs} из {hits} попаданий. Доля урона рассчитана от общего урона умения, зафиксированного NotMeter."
  ],
  "vi": [
    "Chi tiết đòn đánh thêm",
    "Tổng sát thương của các đòn đánh thêm",
    "Độ dài chuỗi",
    "Số lần kích hoạt",
    "Tổng sát thương thêm theo độ dài chuỗi",
    "Tần suất và sát thương từng đòn",
    "Sát thương tích lũy",
    "Xem đòn đánh thêm",
    "Ẩn chi tiết",
    "Tỷ lệ trên tổng số đòn trúng",
    "Lần kích hoạt đạt đòn thứ 4",
    "Đòn đánh thêm",
    "Đòn {0}",
    "Số đòn ghi nhận",
    "Sát thương TB",
    "Sát thương tối đa",
    "Tỷ lệ sát thương trong tổng sát thương kỹ năng",
    "Sát thương thêm mỗi lần đánh trúng",
    "Số đòn thêm mỗi lần kích hoạt",
    "Tỷ lệ nối tiếp đòn sau",
    "Trong {hits} lần đánh trúng, có {procs} lần kích hoạt đòn đánh thêm. Tỷ lệ sát thương được tính trên tổng sát thương kỹ năng mà NotMeter ghi nhận."
  ],
  "en": [
    "Additional hit breakdown",
    "Total extra hit damage",
    "Chain length",
    "Procs",
    "Total extra damage by chain length",
    "Reach rate and damage per hit",
    "Cumulative damage",
    "View additional hits",
    "Hide hit details",
    "% of all landed hits",
    "Procs reaching 4 extra hits",
    "Additional hit",
    "Hit {0}",
    "Hits recorded",
    "Average damage",
    "Max damage",
    "Share of skill damage",
    "Extra damage per landed hit",
    "Extra hits per proc",
    "Reached next hit",
    "Extra hits triggered on {procs} of {hits} landed hits. Damage share uses the total skill damage recorded by NotMeter."
  ]
};
  const keys = ["title", "totalExtraDamage", "length", "procs", "chains", "individual", "total", "show", "hide", "reach", "fourHit", "hit", "ordinal", "samples", "average", "maximum", "damageShare", "extraPerHit", "hitsPerProc", "nextHit", "reading"];
  const expanded = new WeakMap();
  let sequence = 0;

  function labels(locale) {
    return Object.fromEntries(keys.map((key, i) => [key, (translations[locale] || translations.en)[i]]));
  }

  function integer(value, maximum = Number.MAX_SAFE_INTEGER) {
    return Number.isSafeInteger(value) && value >= 0 && value <= maximum;
  }

  function model(skill) {
    const buckets = skill?.additionalHits;
    const procs = skill?.multiHitCount;
    const hits = skill?.hitCount;
    if (!Array.isArray(buckets) || buckets.length !== 4 || !integer(hits, 1000000) ||
        !integer(procs, hits) || !procs || !integer(skill.totalDamage) ||
        buckets.some(b => !b || typeof b !== "object" || Array.isArray(b))) return null;
    const bins = buckets.map(bucket => ({
      finished: bucket?.finished ?? 0, damage: bucket?.damageSum ?? 0,
      maximum: bucket?.maximum ?? 0, chains: bucket?.chains,
    }));
    if (bins.some(b => !integer(b.finished, procs) || !integer(b.damage, skill.totalDamage) || !integer(b.maximum, b.damage)) ||
        bins.reduce((sum, b) => sum + b.finished, 0) !== procs) return null;
    const total = bins.reduce((sum, b) => sum + b.damage, 0);
    if (!integer(total, skill.totalDamage)) return null;
    let reached = procs;
    let chainTotal = 0;
    let complete = true;
    const rows = [];
    for (const [i, b] of bins.entries()) {
      if (b.damage > b.maximum * reached) return null;
      const c = b.chains;
      if (c != null && (!integer(c.observed ?? 0, b.finished) || !integer(c.total ?? 0, total) ||
          !integer(c.maximum ?? 0, c.total ?? 0) || (c.total ?? 0) > (c.maximum ?? 0) * (c.observed ?? 0))) return null;
      const known = b.finished === 0 || c?.observed === b.finished;
      chainTotal += c?.total ?? 0;
      complete &&= known;
      const nextReached = reached - b.finished;
      rows.push({ ordinal: i + 1, finished: b.finished, reached, reach: reached / hits * 100,
        nextReached, nextRate: i < bins.length - 1 && reached > 0 ? nextReached / reached * 100 : null,
        average: reached ? b.damage / reached : null, maximum: reached ? b.maximum : null,
        chainAverage: known && b.finished ? (c?.total ?? 0) / b.finished : null,
        chainTotal: known ? c?.total ?? 0 : null, chainMaximum: known && b.finished ? c?.maximum ?? 0 : null });
      reached = nextReached;
    }
    if (chainTotal > total || complete && chainTotal !== total) return null;
    const extraHits = rows.reduce((count, row) => count + row.reached, 0);
    return {
      total, procs, hits, fullChains: bins[3].finished, fourHit: bins[3].finished / procs * 100, rows,
      damageShare: skill.totalDamage > 0 ? total / skill.totalDamage * 100 : null,
      extraPerHit: total / hits, hitsPerProc: extraHits / procs,
    };
  }

  function percent(value, locale) {
    if (value > 0 && value < 0.1) return `<${new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(0.1)}%`;
    return `${new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(value)}%`;
  }

  function rate(skill, locale) {
    return skill.hitCount > 0 ? percent((Number(skill.multiHitCount) || 0) / skill.hitCount * 100, locale) : "—";
  }

  function element(tag, className, text) {
    const node = document.createElement(tag);
    node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function create(skill, label, locale, owner) {
    const data = model(skill);
    if (!data) return null;
    const copy = labels(locale);
    const wholeNumber = new Intl.NumberFormat(locale, { maximumFractionDigits: 0 });
    const decimal = new Intl.NumberFormat(locale, { maximumFractionDigits: 1 });
    const hitAverage = new Intl.NumberFormat(locale, { maximumFractionDigits: 2 });
    const format = value => value == null ? "—" : wholeNumber.format(value);
    const fraction = (part, count, rate) => rate == null ? "—" :
      `${format(part)}/${format(count)} (${percent(rate, locale)})`;
    const button = element("button", "detail-chip double multi-hit-toggle");
    button.type = "button";
    button.append(element("span", "", label), element("b", "", rate(skill, locale)), element("span", "multi-hit-chevron"));
    const panel = element("section", "multi-hit-detail");
    panel.id = `multi-hit-${++sequence}`;
    panel.hidden = true;
    panel.setAttribute("aria-label", copy.title);
    button.setAttribute("aria-controls", panel.id);
    let remembered;
    const key = `${owner?.actorId}/${skill.skillCode}/${skill.rawSkillCode}`;
    if (owner && typeof owner === "object") {
      if (!expanded.has(owner)) expanded.set(owner, new Set());
      remembered = expanded.get(owner);
    }

    function table(caption, headings, values) {
      const wrapper = element("div", "multi-hit-table-scroll");
      wrapper.tabIndex = 0;
      wrapper.setAttribute("role", "region");
      wrapper.setAttribute("aria-label", caption);
      const table = element("table", "multi-hit-table");
      table.append(element("caption", "", caption));
      const head = element("thead", "");
      const heading = element("tr", "");
      for (const title of headings) {
        const th = element("th", "", title);
        th.scope = "col";
        heading.append(th);
      }
      head.append(heading);
      const body = element("tbody", "");
      for (const row of values) {
        const tr = element("tr", "");
        for (const [i, value] of row.entries()) {
          const cell = element(i === 0 ? "th" : "td", "", value);
          if (i === 0) cell.scope = "row";
          tr.append(cell);
        }
        body.append(tr);
      }
      table.append(head, body);
      wrapper.append(table);
      return wrapper;
    }

    function populate() {
      const summary = element("div", "multi-hit-summary");
      const reading = copy.reading.replace("{hits}", format(data.hits)).replace("{procs}", format(data.procs));
      panel.append(element("h4", "multi-hit-title", copy.title), element("p", "multi-hit-reading", reading));
      const metrics = [
        [copy.totalExtraDamage, format(data.total)],
        [copy.damageShare, data.damageShare == null ? "—" : percent(data.damageShare, locale)],
        [copy.extraPerHit, decimal.format(data.extraPerHit)],
        [copy.hitsPerProc, hitAverage.format(data.hitsPerProc)],
        [copy.fourHit, fraction(data.fullChains, data.procs, data.fourHit)],
      ];
      for (const [name, value] of metrics) {
        const item = element("div", "");
        item.append(element("span", "", name), element("strong", "", value));
        summary.append(item);
      }
      panel.append(summary,
        table(copy.chains, [copy.length, copy.procs, copy.average, copy.total, copy.maximum], data.rows.map(r =>
          [format(r.ordinal), format(r.finished), format(r.chainAverage), format(r.chainTotal), format(r.chainMaximum)])),
        table(copy.individual, [copy.hit, copy.reach, copy.nextHit, copy.average, copy.maximum], data.rows.map(r =>
          [copy.ordinal.replace("{0}", r.ordinal), fraction(r.reached, data.hits, r.reach),
            fraction(r.nextReached, r.reached, r.nextRate), format(r.average), format(r.maximum)])));
    }

    function setOpen(open) {
      if (open && !panel.children.length) populate();
      panel.hidden = !open;
      button.setAttribute("aria-expanded", String(open));
      button.setAttribute("aria-label", `${label} ${rate(skill, locale)} · ${open ? copy.hide : copy.show}`);
      button.title = open ? copy.hide : copy.show;
      if (open) remembered?.add(key);
      else remembered?.delete(key);
    }
    button.addEventListener("click", event => { event.stopPropagation(); setOpen(panel.hidden); });
    setOpen(remembered?.has(key) ?? false);
    return { button, panel };
  }

  globalThis.NotMeterMultiHit = { model, labels, rate, create };
})();
