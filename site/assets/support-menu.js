(() => {
  "use strict";
  const header = document.querySelector(".topbar");
  const language = document.getElementById("language-button");
  if (!header || !language) return;

  const email = "Not4You.dev@gmail.com";
  const wallets = [
    { coin: "USDT", network: "TRON · TRC20", address: "TFZ2CVMLEREi2XVi876vqUPEf92sJyRmUt" },
    { coin: "USDC", network: "BNB Smart Chain · BEP20", address: "0x01e56B3B459ff2ebcb889c0F5FC721ba3a5787aC" },
  ];
  const cryptoCopy = (globalThis.NotMeterI18n?.withVietnamese || (copy => copy))({
    en: ["Crypto donations", "Copy address", "Address copied", "Copy the address manually.", "Use the network shown for each address.", "Choose a support method."],
    "ja-JP": ["暗号資産で支援", "アドレスをコピー", "コピーしました", "アドレスを手動でコピーしてください。", "各アドレスに表示されたネットワークで送金してください。", "支援方法を選んでください。"],
    "de-DE": ["Krypto-Spenden", "Adresse kopieren", "Adresse kopiert", "Bitte kopiere die Adresse manuell.", "Nutze für jede Adresse das angegebene Netzwerk.", "Wähle eine Unterstützungsmethode."],
    "fr-FR": ["Dons en cryptomonnaie", "Copier l’adresse", "Adresse copiée", "Copiez l’adresse manuellement.", "Utilisez le réseau indiqué pour chaque adresse.", "Choisissez un moyen de soutien."],
    "es-ES": ["Donaciones en criptomonedas", "Copiar dirección", "Dirección copiada", "Copia la dirección manualmente.", "Usa la red indicada para cada dirección.", "Elige cómo apoyar el proyecto."],
    "pt-BR": ["Doações em criptomoedas", "Copiar endereço", "Endereço copiado", "Copie o endereço manualmente.", "Use a rede indicada para cada endereço.", "Escolha como apoiar o projeto."],
    "ru-RU": ["Пожертвования в криптовалюте", "Копировать адрес", "Адрес скопирован", "Скопируйте адрес вручную.", "Используйте сеть, указанную для каждого адреса.", "Выберите способ поддержки."],
  });
  const copy = (globalThis.NotMeterI18n?.withVietnamese || (copy => copy))({
    en: ["Support", "Support NotMeter", "Help us maintain and improve NotMeter.", "Copy the PayPal email, or visit Ko-fi.", "Copy PayPal email", "Open NotMeter on Ko-fi", "Close support panel", "PayPal email copied.", "Copy this email manually:"],
    "zh-TW": ["贊助", "支持 NotMeter", "幫助我們維護並持續改進 NotMeter。", "複製 PayPal 電子郵件，或前往 Ko-fi。", "複製 PayPal 電子郵件", "開啟 NotMeter 的 Ko-fi 頁面", "關閉贊助選單", "已複製 PayPal 電子郵件。", "請手動複製此電子郵件："],
    "ja-JP": ["支援する", "NotMeter を支援", "NotMeter の維持と改善にご協力ください。", "PayPal のメールアドレスをコピーするか、Ko-fi を開いてください。", "PayPal のメールアドレスをコピー", "NotMeter の Ko-fi ページを開く", "支援メニューを閉じる", "PayPal のメールアドレスをコピーしました。", "このメールアドレスを手動でコピーしてください："],
    "de-DE": ["Unterstützen", "NotMeter unterstützen", "Hilf uns, NotMeter zu pflegen und zu verbessern.", "Kopiere die PayPal-E-Mail-Adresse oder besuche Ko-fi.", "PayPal-E-Mail-Adresse kopieren", "NotMeter auf Ko-fi öffnen", "Spendenmenü schließen", "PayPal-E-Mail-Adresse kopiert.", "Diese E-Mail-Adresse manuell kopieren:"],
    "fr-FR": ["Soutenir", "Soutenir NotMeter", "Aidez-nous à maintenir et à améliorer NotMeter.", "Copiez l’adresse e-mail PayPal ou rendez-vous sur Ko-fi.", "Copier l’adresse e-mail PayPal", "Ouvrir NotMeter sur Ko-fi", "Fermer le menu de soutien", "Adresse e-mail PayPal copiée.", "Copiez cette adresse e-mail manuellement :"],
    "es-ES": ["Apoyar", "Apoya a NotMeter", "Ayúdanos a mantener y mejorar NotMeter.", "Copia el correo de PayPal o visita Ko-fi.", "Copiar el correo de PayPal", "Abrir NotMeter en Ko-fi", "Cerrar el menú de apoyo", "Correo de PayPal copiado.", "Copia este correo manualmente:"],
    "pt-BR": ["Apoiar", "Apoie o NotMeter", "Ajude-nos a manter e melhorar o NotMeter.", "Copie o e-mail do PayPal ou visite o Ko-fi.", "Copiar e-mail do PayPal", "Abrir NotMeter no Ko-fi", "Fechar o menu de apoio", "E-mail do PayPal copiado.", "Copie este e-mail manualmente:"],
    "ru-RU": ["Поддержать", "Поддержать NotMeter", "Помогите нам поддерживать и улучшать NotMeter.", "Скопируйте адрес PayPal или перейдите на Ko-fi.", "Скопировать адрес PayPal", "Открыть страницу NotMeter на Ko-fi", "Закрыть меню поддержки", "Адрес PayPal скопирован.", "Скопируйте этот адрес вручную:"],
  });
  const coffee = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8h13v8a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4Z"/><path d="M17 9h2a3 3 0 0 1 0 6h-2M7 3v2M11 2v3M15 3v2"/></svg>';
  const benefits = {
    en: ["NotMeter is free to use. Your support helps cover server costs and ongoing development.", "Get a nickname effect coupon", "Support NotMeter and receive a coupon that unlocks nickname effects for a limited time.", "Redeem your coupon in NotMeter → Settings → Nickname Effects."],
    "zh-TW": ["NotMeter 提供免費服務。您的贊助將用於伺服器費用與持續開發。", "獲得角色名稱特效兌換券", "贊助 NotMeter 即可獲得兌換券，在限定期間內使用角色名稱特效。", "請至 NotMeter → 設定 → 角色名稱特效，登錄兌換券。"],
    "ja-JP": ["NotMeter は無料でご利用いただけます。ご支援はサーバー費用と継続的な開発に役立てられます。", "名前エフェクトのクーポン", "NotMeter を支援すると、名前エフェクトを一定期間利用できるクーポンを受け取れます。", "NotMeter → 設定 → 名前エフェクトでクーポンを登録できます。"],
    "de-DE": ["NotMeter ist kostenlos. Deine Unterstützung hilft, Serverkosten und die Weiterentwicklung zu finanzieren.", "Gutschein für Namenseffekte erhalten", "Unterstütze NotMeter und erhalte einen Gutschein, der Namenseffekte für einen begrenzten Zeitraum freischaltet.", "Löse deinen Gutschein in NotMeter → Einstellungen → Namenseffekte ein."],
    "fr-FR": ["NotMeter est gratuit. Votre soutien contribue aux frais des serveurs et au développement continu.", "Recevez un coupon d’effets de pseudo", "Soutenez NotMeter et recevez un coupon pour utiliser les effets de pseudo pendant une durée limitée.", "Activez votre coupon dans NotMeter → Paramètres → Effets du pseudo."],
    "es-ES": ["NotMeter es gratuito. Tu apoyo ayuda a cubrir los gastos de los servidores y el desarrollo continuo.", "Recibe un cupón de efectos de nombre", "Apoya a NotMeter y recibe un cupón que desbloquea los efectos de nombre durante un tiempo limitado.", "Canjea tu cupón en NotMeter → Ajustes → Efectos del nombre."],
    "pt-BR": ["O NotMeter é gratuito. Seu apoio ajuda a cobrir os custos dos servidores e o desenvolvimento contínuo.", "Receba um cupom de efeitos do nome", "Apoie o NotMeter e receba um cupom que libera os efeitos do nome por tempo limitado.", "Resgate seu cupom no NotMeter → Configurações → Efeitos do nome."],
    "ru-RU": ["NotMeter бесплатен. Ваша поддержка помогает оплачивать серверы и дальнейшую разработку.", "Получите купон на эффекты имени", "Поддержите NotMeter и получите купон, открывающий эффекты имени на ограниченный срок.", "Активируйте купон в NotMeter → Настройки → Эффекты имени."],
    vi: ["NotMeter hoàn toàn miễn phí. Sự ủng hộ của bạn giúp trang trải chi phí máy chủ và duy trì việc phát triển.", "Nhận mã kích hoạt hiệu ứng tên", "Ủng hộ NotMeter để nhận mã kích hoạt hiệu ứng tên trong thời gian giới hạn.", "Nhập mã tại NotMeter → Cài đặt → Hiệu ứng tên."],
  };
  const gift = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 11h16v10H4ZM3 7h18v4H3ZM12 7v14M12 7H7.5A2.5 2.5 0 1 1 10 4.5L12 7Zm0 0h4.5A2.5 2.5 0 1 0 14 4.5L12 7Z"/></svg>';
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
    <p class="s-description"></p>
    <section class="s-benefit" aria-labelledby="support-benefit-title">
      <div class="s-benefit-heading">${gift}<h3 id="support-benefit-title"></h3></div>
      <p class="s-benefit-description"></p><p class="s-benefit-redeem"></p>
    </section>
    <div class="s-method"><span class="s-mark paypal" aria-hidden="true">P</span><span class="s-copy"><strong>PayPal</strong><span class="s-address">${email}</span></span><button type="button" class="s-action" data-support-copy><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M15 8V4H4v11h4"/></svg></button></div>
    <div class="s-method"><span class="s-mark kofi" aria-hidden="true">${heartCup}</span><span class="s-copy"><strong>Ko-fi</strong><span class="s-address">ko-fi.com/notmeter</span></span><a class="s-action kofi" href="https://ko-fi.com/notmeter" target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 4h6v6M20 4 10 14M10 4H4v16h16v-6"/></svg></a></div>
    <section class="s-crypto" hidden aria-labelledby="support-crypto-title"><h3 id="support-crypto-title"></h3>
      ${wallets.map((wallet, index) => `<div class="s-wallet"><div class="s-wallet-heading"><strong>${wallet.coin}</strong><span>${wallet.network}</span></div><code class="s-wallet-address" dir="ltr">${wallet.address}</code><button type="button" class="s-action" data-wallet-copy="${index}"></button></div>`).join("")}
      <p class="s-crypto-note"></p>
    </section>
    <p class="s-note"></p><div class="s-status" role="status" aria-live="polite"></div>`;
  document.body.append(panel);
  const close = panel.querySelector(".s-close");
  const copyButton = panel.querySelector("[data-support-copy]");
  const kofi = panel.querySelector("a");
  const status = panel.querySelector(".s-status");
  const crypto = panel.querySelector(".s-crypto");
  const walletButtons = [...panel.querySelectorAll("[data-wallet-copy]")];
  let locale = "";
  let words = copy.en;
  let cryptoWords = cryptoCopy.en;

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
      panel.scrollTop = 0;
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
    const benefit = benefits[locale] || benefits.en;
    cryptoWords = cryptoCopy[locale] || cryptoCopy.en;
    crypto.hidden = locale === "ko" || locale === "zh-TW";
    trigger.querySelector("span").textContent = words[0];
    panel.querySelector("h2").textContent = words[1];
    panel.querySelector(".s-description").textContent = benefit[0];
    panel.querySelector("#support-benefit-title").textContent = benefit[1];
    panel.querySelector(".s-benefit-description").textContent = benefit[2];
    panel.querySelector(".s-benefit-redeem").textContent = benefit[3];
    panel.querySelector(".s-note").textContent = crypto.hidden ? words[3] : cryptoWords[5];
    crypto.querySelector("h3").textContent = cryptoWords[0];
    crypto.querySelector(".s-crypto-note").textContent = cryptoWords[4];
    walletButtons.forEach((button, index) => {
      button.textContent = cryptoWords[1];
      button.setAttribute("aria-label", `${cryptoWords[1]} · ${wallets[index].coin} · ${wallets[index].network}`);
    });
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
    } else if (event.key === "Tab" && !event.shiftKey && document.activeElement === (crypto.hidden ? kofi : walletButtons.at(-1))) {
      event.preventDefault();
      setOpen(false, true);
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
  walletButtons.forEach((button, index) => button.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(wallets[index].address);
      button.textContent = cryptoWords[2];
      status.textContent = `${wallets[index].coin} · ${wallets[index].network}: ${cryptoWords[2]}`;
    } catch {
      status.textContent = `${cryptoWords[3]} ${wallets[index].address}`;
    }
    positionPanel();
  }));
  addEventListener("resize", positionPanel);
  addEventListener("scroll", positionPanel, { passive: true });
  new MutationObserver(render).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
  render();
})();
