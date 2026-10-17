(() => {
  "use strict";
  const locales = ["ko","en","zh-TW","ja-JP","de-DE","fr-FR","es-ES","pt-BR","ru-RU"];
  const memo = new Map(), ns = "http://www.w3.org/2000/svg";
  let retained = 0;
  const context = document.createElement("canvas").getContext("2d");
  function translate(source, index) {
    const catalog = globalThis.NotMeterPreviewTranslations;
    if (!catalog || typeof source !== "string" || source.length > 128) return source;
    if (index === 0) return source;
    if (source === '치명(제외)') return globalThis.NotMeterCriticalAnalysisData?.copy[locales[index]]?.endLabel || source;
    const direct = catalog.phrases[source]?.[index];
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
    if (prefix && catalog.phrases[prefix[1]]?.[index]) return catalog.phrases[prefix[1]][index] + prefix[2];
    return source;
  }
  function render(source, locale) {
    const index = locales.indexOf(locale === "vi" ? "en" : locale);
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
