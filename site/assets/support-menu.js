(() => {
  "use strict";
  const header = document.querySelector(".topbar");
  const language = document.getElementById("language-button");
  if (!header || !language) return;

  const email = "Not4You.dev@gmail.com";
  const copy = {
    en: ["Support", "Support NotMeter", "Help us maintain and improve NotMeter.", "Copy the PayPal email, or visit Ko-fi.", "Copy PayPal email", "Open NotMeter on Ko-fi", "Close support panel", "PayPal email copied.", "Copy this email manually:"],
    "zh-TW": ["贊助", "支持 NotMeter", "幫助我們維護並持續改進 NotMeter。", "複製 PayPal 電子郵件，或前往 Ko-fi。", "複製 PayPal 電子郵件", "開啟 NotMeter 的 Ko-fi 頁面", "關閉贊助選單", "已複製 PayPal 電子郵件。", "請手動複製此電子郵件："],
    "ja-JP": ["支援する", "NotMeter を支援", "NotMeter の維持と改善にご協力ください。", "PayPal のメールアドレスをコピーするか、Ko-fi を開いてください。", "PayPal のメールアドレスをコピー", "NotMeter の Ko-fi ページを開く", "支援メニューを閉じる", "PayPal のメールアドレスをコピーしました。", "このメールアドレスを手動でコピーしてください："],
    "de-DE": ["Unterstützen", "NotMeter unterstützen", "Hilf uns, NotMeter zu pflegen und zu verbessern.", "Kopiere die PayPal-E-Mail-Adresse oder besuche Ko-fi.", "PayPal-E-Mail-Adresse kopieren", "NotMeter auf Ko-fi öffnen", "Spendenmenü schließen", "PayPal-E-Mail-Adresse kopiert.", "Diese E-Mail-Adresse manuell kopieren:"],
    "fr-FR": ["Soutenir", "Soutenir NotMeter", "Aidez-nous à maintenir et à améliorer NotMeter.", "Copiez l’adresse e-mail PayPal ou rendez-vous sur Ko-fi.", "Copier l’adresse e-mail PayPal", "Ouvrir NotMeter sur Ko-fi", "Fermer le menu de soutien", "Adresse e-mail PayPal copiée.", "Copiez cette adresse e-mail manuellement :"],
    "es-ES": ["Apoyar", "Apoya a NotMeter", "Ayúdanos a mantener y mejorar NotMeter.", "Copia el correo de PayPal o visita Ko-fi.", "Copiar el correo de PayPal", "Abrir NotMeter en Ko-fi", "Cerrar el menú de apoyo", "Correo de PayPal copiado.", "Copia este correo manualmente:"],
    "pt-BR": ["Apoiar", "Apoie o NotMeter", "Ajude-nos a manter e melhorar o NotMeter.", "Copie o e-mail do PayPal ou visite o Ko-fi.", "Copiar e-mail do PayPal", "Abrir NotMeter no Ko-fi", "Fechar o menu de apoio", "E-mail do PayPal copiado.", "Copie este e-mail manualmente:"],
    "ru-RU": ["Поддержать", "Поддержать NotMeter", "Помогите нам поддерживать и улучшать NotMeter.", "Скопируйте адрес PayPal или перейдите на Ko-fi.", "Скопировать адрес PayPal", "Открыть страницу NotMeter на Ko-fi", "Закрыть меню поддержки", "Адрес PayPal скопирован.", "Скопируйте этот адрес вручную:"],
  };
  const coffee = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8h13v8a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4Z"/><path d="M17 9h2a3 3 0 0 1 0 6h-2M7 3v2M11 2v3M15 3v2"/></svg>';
  const heartCup = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 7h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><path d="M17 8h2a3 3 0 0 1 0 6h-2"/><path d="m6.5 11.7 3.5 4 3.5-4c1.6-2.7-2.2-4-3.5-1.7-1.3-2.3-5.1-1-3.5 1.7Z" fill="currentColor" stroke="none"/></svg>';
  const anchor = document.createElement("div");
  anchor.className = "nm-support s-menu-anchor";
  anchor.hidden = true;
  anchor.innerHTML = `<button type="button" class="s-trigger" aria-expanded="false" aria-haspopup="dialog" aria-controls="support-panel">${coffee}<span></span></button>`;
  language.closest(".language-select-wrap").before(anchor);
  const trigger = anchor.querySelector("button");
  const panel = document.createElement("section");
  panel.className = "nm-support s-menu-panel";
  panel.id = "support-panel";
  panel.hidden = true;
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-labelledby", "support-title");
  panel.innerHTML = `
    <div class="s-panel-heading"><h2 id="support-title"></h2><button type="button" class="s-close"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg></button></div>
    <p class="s-description"></p><div class="s-rule"></div>
    <div class="s-method"><span class="s-mark paypal" aria-hidden="true">P</span><span class="s-copy"><strong>PayPal</strong><span class="s-address">${email}</span></span><button type="button" class="s-action" data-support-copy><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M15 8V4H4v11h4"/></svg></button></div>
    <div class="s-method"><span class="s-mark kofi" aria-hidden="true">${heartCup}</span><span class="s-copy"><strong>Ko-fi</strong><span class="s-address">ko-fi.com/notmeter</span></span><a class="s-action kofi" href="https://ko-fi.com/notmeter" target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 4h6v6M20 4 10 14M10 4H4v16h16v-6"/></svg></a></div>
    <p class="s-note"></p><div class="s-status" role="status" aria-live="polite"></div>`;
  document.body.append(panel);
  const close = panel.querySelector(".s-close");
  const copyButton = panel.querySelector("[data-support-copy]");
  const kofi = panel.querySelector("a");
  const status = panel.querySelector(".s-status");
  let locale = "";
  let words = copy.en;

  function positionPanel() {
    if (panel.hidden) return;
    const rect = trigger.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > innerHeight) { setOpen(false); return; }
    panel.style.top = `${Math.max(16, Math.min(rect.bottom + 12, innerHeight - panel.offsetHeight - 16))}px`;
    panel.style.left = `${Math.max(16, Math.min(rect.right - panel.offsetWidth, innerWidth - panel.offsetWidth - 16))}px`;
  }
  function setOpen(open, restoreFocus = false) {
    panel.hidden = !open || anchor.hidden;
    trigger.setAttribute("aria-expanded", String(!panel.hidden));
    if (!panel.hidden) {
      status.textContent = "";
      positionPanel();
      if (!panel.hidden) close.focus({ preventScroll: true });
    } else if (restoreFocus && !anchor.hidden) trigger.focus({ preventScroll: true });
  }
  function render() {
    const selected = globalThis.NotMeterI18n?.normalize(document.documentElement.lang) || globalThis.NotMeterI18n?.read() || "en";
    if (selected === locale) return;
    locale = selected;
    setOpen(false);
    anchor.hidden = locale === "ko";
    header.classList.toggle("has-support-menu", !anchor.hidden);
    words = copy[locale] || copy.en;
    trigger.querySelector("span").textContent = words[0];
    panel.querySelector("h2").textContent = words[1];
    panel.querySelector(".s-description").textContent = words[2];
    panel.querySelector(".s-note").textContent = words[3];
    for (const [element, text] of [[copyButton, words[4]], [kofi, words[5]], [close, words[6]]]) {
      element.setAttribute("aria-label", text);
      element.title = text;
    }
    status.textContent = "";
  }

  trigger.addEventListener("click", () => setOpen(panel.hidden));
  close.addEventListener("click", () => setOpen(false, true));
  document.addEventListener("pointerdown", event => {
    if (!panel.hidden && !panel.contains(event.target) && !anchor.contains(event.target)) setOpen(false);
  });
  document.addEventListener("keydown", event => {
    if (panel.hidden) return;
    if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false, true);
    } else if (event.key === "Tab" && event.shiftKey && document.activeElement === close) {
      event.preventDefault();
      setOpen(false, true);
    } else if (event.key === "Tab" && !event.shiftKey && document.activeElement === kofi) {
      event.preventDefault();
      setOpen(false);
      language.focus();
    }
  });
  panel.addEventListener("focusout", event => {
    if (event.relatedTarget && !panel.contains(event.relatedTarget) && !anchor.contains(event.relatedTarget)) setOpen(false);
  });
  copyButton.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(email);
      status.textContent = words[7];
    } catch {
      status.textContent = `${words[8]} ${email}`;
    }
  });
  addEventListener("resize", positionPanel);
  addEventListener("scroll", positionPanel, { passive: true });
  new MutationObserver(render).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
  render();
})();
