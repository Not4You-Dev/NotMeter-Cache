(() => {
  "use strict";

  const WEEK_MS = 7 * 24 * 60 * 60 * 1000;
  // Wednesday 05:00 KST, matching NotMeterWeeklyStatsWindow.
  const RESET_ANCHOR = Date.UTC(2026, 0, 6, 20);
  const copy = {
    ko: ["주간 랭킹 초기화", "매주 수요일 05:00", "초기화까지", "다음 초기화 · 내 시간:", "전체 기간 기록은 유지됩니다."],
    en: ["Weekly ranking reset", "Every Wednesday, 05:00", "Reset in", "Next reset in your time:", "All-time records are kept."],
    "zh-TW": ["每週排行榜重置", "每週三 05:00", "距離重置", "下次重置（你的當地時間）：", "全期間紀錄不會重置。"],
    "ja-JP": ["週間ランキングのリセット", "毎週水曜日 05:00", "リセットまで", "次回リセット（お使いの地域の時刻）：", "全期間の記録は保持されます。"],
    "de-DE": ["Wöchentlicher Ranglistenreset", "Jeden Mittwoch, 05:00", "Reset in", "Nächster Reset in deiner Ortszeit:", "Gesamtzeitrekorde bleiben erhalten."],
    "fr-FR": ["Remise à zéro du classement hebdomadaire", "Chaque mercredi à 05:00", "Remise à zéro dans", "Prochaine remise à zéro, heure locale :", "Les records de tous les temps sont conservés."],
    "es-ES": ["Reinicio de la clasificación semanal", "Cada miércoles, 05:00", "Reinicio en", "Próximo reinicio en tu hora local:", "Los récords históricos se conservan."],
    "pt-BR": ["Reinício da classificação semanal", "Toda quarta-feira, 05:00", "Reinício em", "Próximo reinício no seu horário local:", "Os recordes de todos os tempos são mantidos."],
    "ru-RU": ["Сброс недельного рейтинга", "Каждую среду в 05:00", "До сброса", "Следующий сброс по вашему времени:", "Рекорды за всё время сохраняются."],
  };
  const formatters = new Map();
  let locale = "en";
  let visible = false;
  let globalRegion = false;
  const pacific = new Intl.DateTimeFormat("en-US", { timeZone: "America/Los_Angeles", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23" });
  function localParts(instant) {
    const p = Object.fromEntries(pacific.formatToParts(instant).map(part => [part.type, part.value]));
    return Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute, +p.second);
  }
  function pacificToUtc(local) {
    let utc = local;
    for (let i = 0; i < 3; i++) utc += local - localParts(utc);
    return utc;
  }
  function globalWindow(now) {
    const local = localParts(now), date = new Date(local);
    let start = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() - (date.getUTCDay() + 5) % 7, 23, 30);
    if (local < start) start -= WEEK_MS;
    return { start: pacificToUtc(start), end: pacificToUtc(start + WEEK_MS) };
  }

  function nextReset(now, global = false) {
    if (global) return globalWindow(now).end;
    return RESET_ANCHOR + (Math.floor((now - RESET_ANCHOR) / WEEK_MS) + 1) * WEEK_MS;
  }

  function getFormatters(language, global = false) {
    const key = `${language}:${global}`;
    const zone = global ? {} : { timeZone: "Asia/Seoul" };
    if (!formatters.has(key)) {
      formatters.set(key, {
        days: new Intl.NumberFormat(language, { style: "unit", unit: "day", unitDisplay: "narrow" }),
        localDeadline: new Intl.DateTimeFormat(language, {
          year: "numeric", month: "short", day: "numeric", weekday: "short",
          hour: "2-digit", minute: "2-digit", hourCycle: "h23", timeZoneName: "shortOffset",
          ...zone,
        }),
        schedule: new Intl.DateTimeFormat(language, { weekday: "long", hour: "2-digit", minute: "2-digit", hourCycle: "h23", ...zone }),
        zone: new Intl.DateTimeFormat("en", { timeZoneName: "shortOffset", ...zone }),
      });
    }
    return formatters.get(key);
  }

  function remaining(now, language, global = false) {
    const seconds = Math.ceil((nextReset(now, global) - now) / 1000);
    const days = Math.floor(seconds / 86400);
    const clock = [Math.floor(seconds % 86400 / 3600), Math.floor(seconds % 3600 / 60), seconds % 60]
      .map(value => String(value).padStart(2, "0")).join(":");
    return days ? `${getFormatters(language).days.format(days)} ${clock}` : clock;
  }

  function refresh() {
    if (!visible || document.hidden) return;
    const element = document.getElementById("weekly-reset");
    if (!element) return;
    const now = Date.now();
    const deadline = nextReset(now, globalRegion);
    const dateTime = new Date(deadline).toISOString();
    const value = element.querySelector("[data-reset-countdown]");
    value.textContent = remaining(now, locale, globalRegion);
    value.dateTime = dateTime;
    const date = element.querySelector("[data-reset-date]");
    const formatter = getFormatters(locale, globalRegion);
    const formatted = formatter.localDeadline.format(deadline);
    element.querySelector("[data-reset-schedule]").textContent = globalRegion ? formatter.schedule.format(deadline) : copy[locale][1];
    element.querySelector("[data-reset-zone]").textContent = formatter.zone.formatToParts(deadline).find(p => p.type === "timeZoneName").value;
    if (date.textContent !== formatted) date.textContent = formatted;
    date.dateTime = dateTime;
  }

  function update(language, show, global = false) {
    locale = Object.hasOwn(copy, language) ? language : "en";
    visible = show;
    globalRegion = global;
    const element = document.getElementById("weekly-reset");
    if (!element) return;
    element.hidden = !visible;
    const fields = ["title", "schedule", "label", "next", "scope"];
    fields.forEach((field, index) => {
      element.querySelector(`[data-reset-${field}]`).textContent = copy[locale][index];
    });
    if (!globalRegion) element.querySelector("[data-reset-next]").textContent = `${copy[locale][0]} · KST:`;
    refresh();
  }

  document.addEventListener("DOMContentLoaded", () => {
    window.setInterval(refresh, 1000);
    document.addEventListener("visibilitychange", refresh);
    window.addEventListener("pageshow", refresh);
  });
  function schedule(language, now = Date.now()) {
    return getFormatters(language, true).localDeadline.format(nextReset(now, true));
  }
  globalThis.NotMeterWeeklyReset = { update, nextReset, remaining, globalWindow, schedule };
})();
