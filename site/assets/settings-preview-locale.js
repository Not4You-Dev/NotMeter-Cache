(() => {
  "use strict";
  const locales = ["ko","en","zh-TW","ja-JP","de-DE","fr-FR","es-ES","pt-BR","ru-RU","vi"];
  const pvpPhrases = {
    "[ 총사령관 ]": ["[ 총사령관 ]","[ Supreme Commander ]","[ 總司令官 ]","[ Supreme Commander ]","[ Supreme Commander ]","[ Supreme Commander ]","[ Supreme Commander ]","[ Supreme Commander ]","[ Supreme Commander ]","[ Supreme Commander ]"],
    "[ 1성장교 ]": ["[ 1성장교 ]","[ 1-Star Officer ]","[ 1星軍官 ]","[ 1-Star Officer ]","[ 1-Star Officer ]","[ 1-Star Officer ]","[ 1-Star Officer ]","[ 1-Star Officer ]","[ 1-Star Officer ]","[ 1-Star Officer ]"],
    "[ 훈련병 ]": ["[ 훈련병 ]","[ Trainee ]","[ 訓練兵 ]","[ Trainee ]","[ Trainee ]","[ Trainee ]","[ Trainee ]","[ Trainee ]","[ Trainee ]","[ Trainee ]"],
    "공격 통계": ["공격 통계","Attack stats","攻擊統計","Attack stats","Attack stats","Attack stats","Attack stats","Attack stats","Attack stats","Thống kê tấn công"],
    "방어 통계": ["방어 통계","Defense stats","防禦統計","Defense stats","Defense stats","Defense stats","Defense stats","Defense stats","Defense stats","Thống kê phòng thủ"],
    "상대": ["상대","Opponent","對手","Opponent","Opponent","Opponent","Opponent","Opponent","Opponent","Đối thủ"],
    "처치·도움": ["처치·도움","Kills + assists","擊殺＋助攻","キル・アシスト","Kills + Assists","Éliminations + assistances","Bajas + asistencias","Abates + assistências","Убийства + помощь","Hạ gục + hỗ trợ"],
    "준 피해": ["준 피해","Damage dealt","造成傷害","Damage dealt","Damage dealt","Damage dealt","Damage dealt","Damage dealt","Damage dealt","Damage dealt"],
    "받은 피해": ["받은 피해","Damage taken","受到傷害","Damage taken","Damage taken","Damage taken","Damage taken","Damage taken","Damage taken","Damage taken"],
    "치명타": ["치명타","Critical hit","暴擊","クリティカル","Kritischer Treffer","CRIT","Crítico","Acerto Crítico","Крит. удар","Critical hit"],
    "막기": ["막기","Block","盾牌格擋","ガード","Block","Blocage","Bloqueo","Bloqueio","Блок","Block"],
    "패리": ["패리","Parry","招架","パリィ","Parieren","Parade","Parada","Aparo","Парирование","Parry"],
    "다단 히트": ["다단 히트","Multi-hit","多段打擊","多段ヒット","Mehrfachtreffer","Coups multiples","Golpes múltiples","Golpes múltiplos","Мультиудары","Multi-hit"],
    "공격 시도": ["공격 시도","Attack attempts","攻擊次數","Attack attempts","Attack attempts","Attack attempts","Attack attempts","Attack attempts","Attack attempts","Attack attempts"],
    "사용 횟수": ["사용 횟수","Uses","使用次數","使用回数","Einsätze","Utilisations","Usos","Usos","Применения","Uses"],
    "평균 데미지": ["평균 데미지","Average Damage","平均傷害","平均ダメージ","Ø Schaden","Dégâts moyens","Daño medio","Dano médio","Средний урон","Average Damage"],
    "최대 피해": ["최대 피해","Highest damage","最高傷害","Highest damage","Highest damage","Highest damage","Highest damage","Highest damage","Highest damage","Highest damage"],
    "완벽 막기": ["완벽 막기","Perfect Block","完美格擋","完璧ガード","Perfektions-Block","Blocage parfait","Bloqueo perfecto","Bloqueio Perfeito","Совершенный блок","Perfect Block"]
  };
  const memo = new Map(), ns = "http://www.w3.org/2000/svg";
  let retained = 0;
  const context = document.createElement("canvas").getContext("2d");
  function translate(source, index) {
    const catalog = globalThis.NotMeterPreviewTranslations;
    if (!catalog || typeof source !== "string" || source.length > 128) return source;
    if (index === 0) return source;
    if (source === '치명(제외)') return globalThis.NotMeterCriticalAnalysisData?.copy[locales[index]]?.endLabel || source;
    const direct = catalog.phrases[source]?.[index] || pvpPhrases[source]?.[index];
    if (direct) return direct;
    const rage = source.match(/^분노 ([\d,]+) 이하$/), current = source.match(/^현재 ([\d,]+)$/);
    const template = catalog.templates?.[rage ? "rageThreshold" : current ? "rageCurrent" : ""]?.[index];
    if (template) return template.replace("{value}", (rage || current)[1]);
    source = source.replace(/(?:[\d.,]+[조억만천])+[\d.,]*/g, number => {
      const units = {조:1e12, 억:1e8, 만:1e4, 천:1e3};
      let value = 0;
      for (const part of number.matchAll(/([\d.,]+)([조억만천]?)/g)) value += Number(part[1].replaceAll(",","")) * (units[part[2]] || 1);
      if (!Number.isFinite(value)) return number;
      const unit = value >= 1e12 ? "T" : value >= 1e9 ? "B" : value >= 1e6 ? "M" : value >= 1e3 ? "K" : "";
      const divisor = {T:1e12,B:1e9,M:1e6,K:1e3}[unit] || 1;
      return String(Number((value / divisor).toFixed(2))) + unit;
    });
    const suffix = source.match(/^([\d.,KMBT]+)\/초$/);
    if (suffix) return suffix[1] + catalog.perSecond[index];
    const prefix = source.match(/^(.*?[가-힣])([\s\d:.,%+\-/KMBT].*)$/);
    const label = prefix && (catalog.phrases[prefix[1]]?.[index] || pvpPhrases[prefix[1]]?.[index]);
    if (label) return label + prefix[2];
    return source;
  }
  function render(source, locale) {
    const index = locales.indexOf(locale);
    if (!source || index < 0 || !source.includes('id="nml_')) return source;
    const key = locale + source;
    if (memo.has(key)) return memo.get(key);
    const svg = new DOMParser().parseFromString(source,"image/svg+xml");
    if (svg.querySelector("parsererror") || svg.documentElement.localName !== "svg") return source;
    let changed = false;
    for (const group of svg.querySelectorAll('g[id^="nml_"]')) {
      try {
        const encoded = group.id.match(/^nml_[a-zA-Z0-9]+_([a-zA-Z0-9_-]{1,16000})$/)?.[1];
        if (!encoded) continue;
        const value = JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(encoded.replaceAll("-","+").replaceAll("_","/")),c => c.charCodeAt(0))));
        if (value.literal === true) continue;
        const label = translate(value.source,index);
        if (value.v !== 1 ||
            typeof label !== "string" || label.length > 256 || label === value.source ||
            ![value.size,value.width,value.height,value.baseline,value.weight].every(Number.isFinite) ||
            value.size <= 0 || value.size > 256 || value.width <= 0 || value.width > 2048 ||
            value.height <= 0 || value.height > 2048 || value.baseline < 0 || value.baseline > 2048 ||
            value.weight < 100 || value.weight > 1000) continue;
        const text = svg.createElementNS(ns,"text"), family = '"Segoe UI", Arial, sans-serif';
        context.font = `${value.weight} ${value.size}px ${family}`;
        const measured = context.measureText(label).width;
        const fitWidth = Number.isFinite(value.fitWidth) && value.fitWidth >= value.width && value.fitWidth <= 2048 ? value.fitWidth : value.width;
        const size = Math.min(value.size,value.size * fitWidth / Math.max(1,measured));
        const anchor = value.align === "Right" ? "end" : value.align === "Center" ? "middle" : "start";
        text.setAttribute("x",String(anchor === "end" ? value.width : anchor === "middle" ? value.width/2 : 0));
        text.setAttribute("y",String(value.baseline - (value.size-size)*.25));
        text.setAttribute("font-size",String(size)); text.setAttribute("font-family",family);
        text.setAttribute("font-weight",String(value.weight)); text.setAttribute("text-anchor",anchor);
        text.setAttribute("lang",locale); text.textContent = label;
        if (fitWidth > value.width) group.removeAttribute("clip-path");
        group.replaceChildren(text); changed = true;
      } catch {}
    }
    const output = changed ? new XMLSerializer().serializeToString(svg.documentElement) : source;
    memo.set(key,output); retained += (key.length + output.length) * 2;
    while (memo.size > 24 || retained > 8388608) {
      const first = memo.keys().next().value;
      retained -= (first.length + memo.get(first).length) * 2; memo.delete(first);
    }
    return output;
  }
  globalThis.NotMeterPreviewLocale = Object.freeze({render});
})();
