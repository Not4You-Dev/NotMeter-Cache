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

  function isPrivate(player, requiresConsent = false) {
    return player?.nameHidden === true || (requiresConsent && player?.nameHidden !== false) ||
      /[*＊]/u.test(player?.name || "");
  }

  function create(player, locale) {
    const [label, tooltip] = copy[locale] || copy.en;
    const block = document.createElement("span");
    block.className = "nmask";
    block.setAttribute("role", "img");
    block.setAttribute("aria-label", label);
    block.title = tooltip;
    const length = Number(player?.nameLength);
    if (Number.isInteger(length) && length > 0) block.style.setProperty("--w", String(Math.min(8, Math.max(4, length))));
    return block;
  }

  globalThis.NotMeterPrivateName = Object.freeze({ isPrivate, create, label: locale => (copy[locale] || copy.en)[0] });
})();
