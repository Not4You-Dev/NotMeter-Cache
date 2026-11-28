(() => {
  const notice = document.getElementById("live-broadcast-notice");
  if (!notice) return;
  const startsAt = new Date(notice.dataset.startsAt);
  const expiresAt = Date.parse(notice.dataset.expiresAt);
  const copy = (globalThis.NotMeterI18n?.withVietnamese || (copy => copy))({
    ko: {
      region: "한국 서버 공식 방송", title: "AION2 업데이트 프리뷰 라이브",
      drops: "드롭스는 퍼플 라이브에서만 참여할 수 있습니다.",
      watch: "퍼플 라이브 보기", youtube: "유튜브", notice: "공식 공지",
      localTime: "현지 시간", koreaTime: "한국 시간"
    },
    en: {
      region: "Official Korean server livestream", title: "AION2 update preview live",
      drops: "Drops are only available through PURPLE Live.",
      watch: "Watch on PURPLE", youtube: "YouTube", notice: "Official notice",
      localTime: "Your local time", koreaTime: "Korea time", translation: "Live translation on Twitch"
    },
    "zh-TW": {
      region: "韓國伺服器官方直播", title: "AION2 更新搶先看直播",
      drops: "僅限透過 PURPLE Live 參與掉寶活動。",
      watch: "前往 PURPLE 觀看", youtube: "YouTube", notice: "官方公告",
      localTime: "當地時間", koreaTime: "韓國時間"
    },
    "ja-JP": {
      region: "韓国サーバー公式生放送", title: "AION2 アップデート先行紹介",
      drops: "Dropsへの参加はPURPLE Live限定です。",
      watch: "PURPLEで視聴", youtube: "YouTube", notice: "公式お知らせ",
      localTime: "現地時間", koreaTime: "韓国時間", translation: "Twitchで翻訳付き中継"
    },
    "de-DE": {
      region: "Offizieller Livestream für den koreanischen Server", title: "AION2: Update-Vorschau live",
      drops: "Drops sind nur über PURPLE Live verfügbar.",
      watch: "Auf PURPLE ansehen", youtube: "YouTube", notice: "Offizielle Ankündigung",
      localTime: "Deine Ortszeit", koreaTime: "Zeit in Korea", translation: "Live-Übersetzung auf Twitch"
    },
    "fr-FR": {
      region: "Direct officiel du serveur coréen", title: "AION2 : aperçu de la mise à jour",
      drops: "Les Drops sont disponibles uniquement sur PURPLE Live.",
      watch: "Regarder sur PURPLE", youtube: "YouTube", notice: "Annonce officielle",
      localTime: "Heure locale", koreaTime: "Heure en Corée", translation: "Traduction en direct sur Twitch"
    },
    "es-ES": {
      region: "Directo oficial del servidor coreano", title: "AION2: avance de la actualización",
      drops: "Los Drops solo están disponibles en PURPLE Live.",
      watch: "Ver en PURPLE", youtube: "YouTube", notice: "Aviso oficial",
      localTime: "Tu hora local", koreaTime: "Hora de Corea", translation: "Traducción en directo en Twitch"
    },
    "pt-BR": {
      region: "Transmissão oficial do servidor coreano", title: "AION2: prévia da atualização ao vivo",
      drops: "Os Drops estão disponíveis apenas no PURPLE Live.",
      watch: "Assistir no PURPLE", youtube: "YouTube", notice: "Anúncio oficial",
      localTime: "Seu horário local", koreaTime: "Horário da Coreia", translation: "Tradução ao vivo na Twitch"
    },
    "ru-RU": {
      region: "Официальная трансляция корейского сервера", title: "AION2: обзор будущего обновления",
      drops: "Drops доступны только на PURPLE Live.",
      watch: "Смотреть на PURPLE", youtube: "YouTube", notice: "Официальный анонс",
      localTime: "Местное время", koreaTime: "Время в Корее", translation: "Перевод в прямом эфире на Twitch"
    }
  });
  let expiryTimer;

  function sync(locale = document.documentElement.lang) {
    clearTimeout(expiryTimer);
    const remaining = expiresAt - Date.now();
    notice.hidden = !Number.isFinite(startsAt.getTime()) || !Number.isFinite(remaining) || remaining <= 0;
    if (notice.hidden) return;
    const text = copy[locale] || copy.en;
    const tag = copy[locale] ? locale : "en";
    notice.querySelectorAll("[data-live-copy]").forEach(element => {
      element.textContent = text[element.dataset.liveCopy] || copy.en[element.dataset.liveCopy];
    });
    document.getElementById("live-broadcast-translation").hidden = locale === "ko" || locale === "zh-TW";
    const dateOptions = { month: "short", day: "numeric", weekday: "short" };
    const timeOptions = { hour: "numeric", minute: "2-digit" };
    document.getElementById("live-broadcast-date").textContent = new Intl.DateTimeFormat(tag, dateOptions).format(startsAt);
    document.getElementById("live-broadcast-time").textContent = new Intl.DateTimeFormat(tag, timeOptions).format(startsAt);
    document.getElementById("live-broadcast-zone").textContent = new Intl.DateTimeFormat(tag, { timeZoneName: "shortOffset" })
      .formatToParts(startsAt).find(part => part.type === "timeZoneName")?.value || "";
    const koreaTime = new Intl.DateTimeFormat(tag, { ...dateOptions, ...timeOptions, timeZone: "Asia/Seoul" }).format(startsAt);
    document.getElementById("live-broadcast-korea").textContent = `${text.koreaTime} · ${koreaTime} (UTC+9)`;
    expiryTimer = setTimeout(() => sync(), Math.min(remaining, 2_147_483_647));
  }

  window.addEventListener("pageshow", () => sync());
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) sync();
  });
  globalThis.NotMeterLiveBroadcast = Object.freeze({ sync });
  sync();
})();
