(() => {
  "use strict";
  const labels = {
    ko: ["이용약관", "개인정보처리방침", "쿠키 및 광고 안내", "문의", "광고 개인정보 설정"],
    en: ["Terms of Use", "Privacy Policy", "Cookies & Advertising", "Contact", "Ad privacy choices"],
    "zh-TW": ["使用條款", "隱私權政策", "Cookie 與廣告說明", "聯絡我們", "廣告隱私設定"],
    "ja-JP": ["利用規約", "プライバシーポリシー", "Cookie・広告について", "お問い合わせ", "広告のプライバシー設定"],
    "de-DE": ["Nutzungsbedingungen", "Datenschutzerklärung", "Cookies und Werbung", "Kontakt", "Datenschutz für Werbung"],
    "fr-FR": ["Conditions d’utilisation", "Politique de confidentialité", "Cookies et publicité", "Contact", "Confidentialité des annonces"],
    "es-ES": ["Condiciones de uso", "Política de privacidad", "Cookies y publicidad", "Contacto", "Privacidad de los anuncios"],
    "pt-BR": ["Termos de uso", "Política de privacidade", "Cookies e publicidade", "Contato", "Privacidade dos anúncios"],
    "ru-RU": ["Условия использования", "Политика конфиденциальности", "Cookie и реклама", "Связаться с нами", "Настройки рекламной конфиденциальности"],
  };
  const fallback = {
    "ja-JP": "本文は英語で表示しています。韓国語・英語・繁体字中国語の全文をご用意しています。",
    "de-DE": "Der Text wird auf Englisch angezeigt. Vollständige Fassungen sind auf Koreanisch, Englisch und traditionellem Chinesisch verfügbar.",
    "fr-FR": "Le texte est affiché en anglais. Les versions intégrales sont disponibles en coréen, anglais et chinois traditionnel.",
    "es-ES": "El texto se muestra en inglés. Hay versiones completas en coreano, inglés y chino tradicional.",
    "pt-BR": "O texto é exibido em inglês. As versões completas estão disponíveis em coreano, inglês e chinês tradicional.",
    "ru-RU": "Текст показан на английском. Полные версии доступны на корейском, английском и традиционном китайском.",
  };
  const keys = ["terms", "privacy", "cookies", "contact", "consent"];
  const api = globalThis.NotMeterI18n;
  const page = document.body.dataset.legalPage;
  const select = document.getElementById("legal-language");
  let selected = api?.read() || "en";
  function renderLabels(locale) {
    const words = labels[locale] || labels.en;
    document.querySelectorAll("[data-legal-label]").forEach(element => {
      const index = keys.indexOf(element.dataset.legalLabel);
      if (index >= 0) element.textContent = words[index];
    });
  }
  function renderPage() {
    const all = globalThis.NotMeterLegalContent;
    if (!page || !all) return;
    const contentLocale = all[selected] ? selected : "en";
    const copy = all[contentLocale];
    const documentCopy = copy[page];
    document.documentElement.lang = contentLocale;
    document.title = `${documentCopy.title} | NotMeter`;
    document.querySelector('meta[name="description"]').content = documentCopy.intro;
    api?.syncSelect(select, selected);
    const wrap = select?.closest(".language-select-wrap");
    if (wrap) wrap.dataset.language = selected;
    document.getElementById("legal-title").textContent = documentCopy.title;
    document.getElementById("legal-intro").textContent = documentCopy.intro;
    document.getElementById("legal-date").textContent = copy.updated;
    document.getElementById("legal-operator").textContent = copy.operator;
    document.getElementById("legal-contact-label").textContent = copy.contact;
    document.getElementById("legal-back").textContent = copy.back;
    document.getElementById("legal-contents-label").textContent = copy.contents;
    const notice = document.getElementById("legal-language-note");
    notice.hidden = !fallback[selected];
    notice.lang = selected;
    notice.textContent = fallback[selected] || "";
    const sections = document.getElementById("legal-sections");
    const contents = document.getElementById("legal-contents");
    sections.replaceChildren();
    contents.replaceChildren();
    for (const [id, title, ...paragraphs] of documentCopy.sections) {
      const section = document.createElement("section");
      section.id = id;
      const heading = document.createElement("h2");
      heading.textContent = title;
      section.append(heading);
      for (const text of paragraphs) {
        const paragraph = document.createElement("p");
        paragraph.textContent = text;
        section.append(paragraph);
      }
      sections.append(section);
      const item = document.createElement("li");
      const link = document.createElement("a");
      link.href = `#${id}`;
      link.textContent = title;
      item.append(link);
      contents.append(item);
    }
    renderLabels(selected);
    document.querySelectorAll(".legal-nav a").forEach(link => {
      link.href = `./${link.dataset.legalLabel}.html?lang=${encodeURIComponent(selected)}`;
    });
  }
  if (page) {
    const requested = api?.normalize(new URLSearchParams(location.search).get("lang"));
    if (requested) selected = requested;
    select?.addEventListener("change", () => {
      selected = api?.normalize(select.value) || "en";
      api?.save(selected);
      const url = new URL(location.href);
      url.searchParams.set("lang", selected);
      history.replaceState(null, "", url);
      renderPage();
    });
    renderPage();
  } else {
    const render = () => renderLabels(api?.normalize(document.documentElement.lang) || "en");
    render();
    new MutationObserver(render).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
  }

  const consent = document.getElementById("legal-consent");
  if (!consent) return;
  // The site's existing Google CMP owns consent; this is only its reopening control.
  const fc = globalThis.googlefc = globalThis.googlefc || {};
  fc.callbackQueue = fc.callbackQueue || [];
  fc.callbackQueue.push({ CONSENT_API_READY: () => {
    if (typeof globalThis.__tcfapi !== "function") return;
    globalThis.__tcfapi("addEventListener", 0, (data, success) => {
      consent.hidden = !(success && data?.gdprApplies === true && typeof fc.showRevocationMessage === "function");
    });
  } });
  consent.addEventListener("click", () => {
    fc.callbackQueue.push({ CONSENT_API_READY: () => {
      if (typeof fc.showRevocationMessage === "function") fc.showRevocationMessage();
    } });
  });
})();
