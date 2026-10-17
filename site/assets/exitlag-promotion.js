(() => {
  "use strict";
  const promotion = { enabled: true, coupon: "NOTMETER", url: "https://www.exitlag.com/refer/notmeter" };
  const template = document.getElementById("exitlag-promotion-template");
  if (!promotion.enabled || !template) return;
  const copy = (globalThis.NotMeterI18n?.withVietnamese || (copy => copy))({
    ko: ["광고", "게임 전용 네트워크 최적화", "ExitLag에서 지원 게임과 이용 혜택을 확인하세요.", "쿠폰 코드", "코드 복사", "ExitLag 알아보기", "쿠폰 코드를 복사했습니다.", "코드를 직접 복사해 주세요."],
    en: ["Ad", "Network optimization for gaming", "Explore supported games and offers on ExitLag.", "Coupon code", "Copy code", "Explore ExitLag", "Coupon code copied.", "Please copy the code manually."],
    "zh-TW": ["廣告", "遊戲專用網路最佳化", "前往 ExitLag 查看支援遊戲與優惠。", "優惠碼", "複製代碼", "了解 ExitLag", "已複製優惠碼。", "請手動複製代碼。"],
    "ja-JP": ["広告", "ゲーム向けネットワーク最適化", "ExitLag の対応ゲームや特典をご確認ください。", "クーポンコード", "コードをコピー", "ExitLag を見る", "クーポンコードをコピーしました。", "コードを手動でコピーしてください。"],
    "de-DE": ["Werbung", "Netzwerkoptimierung für Spiele", "Entdecke unterstützte Spiele und Angebote bei ExitLag.", "Gutscheincode", "Code kopieren", "ExitLag entdecken", "Gutscheincode kopiert.", "Bitte kopiere den Code manuell."],
    "fr-FR": ["Publicité", "Optimisation réseau pour les jeux", "Découvrez les jeux compatibles et les offres sur ExitLag.", "Code promo", "Copier le code", "Découvrir ExitLag", "Code promo copié.", "Copiez le code manuellement."],
    "es-ES": ["Publicidad", "Optimización de red para juegos", "Consulta los juegos compatibles y las ofertas en ExitLag.", "Código promocional", "Copiar código", "Explorar ExitLag", "Código promocional copiado.", "Copia el código manualmente."],
    "pt-BR": ["Publicidade", "Otimização de rede para jogos", "Confira os jogos compatíveis e as ofertas no ExitLag.", "Cupom", "Copiar código", "Conhecer o ExitLag", "Código do cupom copiado.", "Copie o código manualmente."],
    "ru-RU": ["Реклама", "Оптимизация сети для игр", "Узнайте о поддерживаемых играх и предложениях ExitLag.", "Промокод", "Копировать код", "Узнать об ExitLag", "Промокод скопирован.", "Скопируйте код вручную."]
  });
  const fragment = template.content.cloneNode(true);
  const card = fragment.querySelector(".exitlag-promotion");
  card.querySelector("code").textContent = promotion.coupon;
  card.querySelector("a").href = promotion.url;
  template.replaceWith(fragment);
  const status = card.querySelector("[role=status]");
  const words = () => copy[globalThis.NotMeterI18n?.normalize(document.documentElement.lang)] || copy.en;
  function translate() {
    card.querySelectorAll("[data-exitlag-text]").forEach(element => {
      element.textContent = words()[Number(element.dataset.exitlagText)];
    });
    status.textContent = "";
  }
  card.querySelector("button").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(promotion.coupon);
      status.textContent = words()[6];
    } catch {
      status.textContent = `${words()[7]} ${promotion.coupon}`;
    }
  });
  new MutationObserver(translate).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
  translate();
})();
