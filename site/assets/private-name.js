(() => {
  "use strict";
  const copy = {
    ko: ["비공개 닉네임", "비공개로 설정된 닉네임입니다"],
    en: ["Private nickname", "This nickname is set to private"],
    "zh-TW": ["非公開暱稱", "此暱稱設為非公開"],
    "ja-JP": ["非公開のニックネーム", "このニックネームは非公開です"],
    "de-DE": ["Privater Spitzname", "Dieser Spitzname ist privat"],
    "fr-FR": ["Pseudo privé", "Ce pseudo est défini comme privé"],
    "es-ES": ["Apodo privado", "Este apodo está configurado como privado"],
    "pt-BR": ["Apelido privado", "Este apelido está definido como privado"],
    "ru-RU": ["Скрытый никнейм", "Этот никнейм скрыт"],
    vi: ["Tên nhân vật ẩn", "Tên nhân vật này được đặt ở chế độ riêng tư"],
  };
  const lookupCopy = {
    ko: ["이름 확인 중", "이름 조회 지연"], en: ["Loading name", "Name lookup delayed"],
    "zh-TW": ["正在確認暱稱", "暱稱查詢延遲"], "ja-JP": ["名前を確認中", "名前の照会が遅延"],
    "de-DE": ["Name wird geladen", "Namensabfrage verzögert"], "fr-FR": ["Nom en cours", "Recherche du nom retardée"],
    "es-ES": ["Cargando nombre", "Consulta del nombre demorada"], "pt-BR": ["Carregando nome", "Consulta do nome atrasada"],
    "ru-RU": ["Загрузка имени", "Поиск имени задерживается"], vi: ["Đang xác nhận tên", "Tra cứu tên bị chậm"],
  };
  function label(locale, player) {
    const status = player?.chapterNameStatus;
    return status === "loading" || status === "unavailable"
      ? (lookupCopy[locale] || lookupCopy.en)[status === "loading" ? 0 : 1] : (copy[locale] || copy.en)[0];
  }

  function isPrivate(player, requiresConsent = false) {
    globalThis.NotMeterChapterNames?.prepare(player);
    return player?.nameHidden === true || (requiresConsent && player?.nameHidden !== false) ||
      /[*＊]/u.test(player?.name || "");
  }

  function create(player, locale) {
    if (player?.chapterNameStatus === "loading" || player?.chapterNameStatus === "unavailable") {
      const pending = document.createElement("span");
      pending.className = "chapter-name-pending";
      pending.textContent = label(locale, player);
      pending.setAttribute("aria-busy", String(player.chapterNameStatus === "loading"));
      return pending;
    }
    const [privateLabel, tooltip] = copy[locale] || copy.en;
    const block = document.createElement("span");
    block.className = "nmask";
    block.setAttribute("role", "img");
    block.setAttribute("aria-label", privateLabel);
    block.title = tooltip;
    const length = Number(player?.nameLength);
    if (Number.isInteger(length) && length > 0) block.style.setProperty("--w", String(Math.min(8, Math.max(4, length))));
    return block;
  }

  globalThis.NotMeterPrivateName = Object.freeze({ isPrivate, create, label });
})();
