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
  const controls = {
    ko: ["ExitLag 광고 보기", "광고 접기", "오늘 그만 보기"],
    en: ["Show ExitLag ad", "Collapse ad", "Hide for today"],
    "zh-TW": ["查看 ExitLag 廣告", "收起廣告", "今天不再顯示"],
    "ja-JP": ["ExitLag の広告を表示", "広告を閉じる", "今日は表示しない"],
    "de-DE": ["ExitLag-Werbung anzeigen", "Werbung einklappen", "Heute nicht mehr anzeigen"],
    "fr-FR": ["Afficher la publicité ExitLag", "Replier la publicité", "Ne plus afficher aujourd’hui"],
    "es-ES": ["Mostrar anuncio de ExitLag", "Contraer anuncio", "No mostrar más hoy"],
    "pt-BR": ["Mostrar anúncio do ExitLag", "Recolher anúncio", "Não mostrar mais hoje"],
    "ru-RU": ["Показать рекламу ExitLag", "Свернуть рекламу", "Не показывать сегодня"],
    vi: ["Xem quảng cáo ExitLag", "Thu gọn quảng cáo", "Ẩn trong hôm nay"]
  };
  const desktop = matchMedia("(min-width: 1024px) and (hover: hover) and (pointer: fine)");
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  const mobile = navigator.userAgentData?.mobile || /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) ||
    (/Macintosh/i.test(navigator.userAgent) && navigator.maxTouchPoints > 1);
  if (mobile) return;
  const cooldownKey = "notmeter-exitlag-motion-at-v1";
  const dismissKey = "notmeter-exitlag-dismiss-until-v1";
  const driftKey = "notmeter-exitlag-drift-v1";
  const driftDuration = 60000;
  const cooldown = 30 * 60 * 1000;
  const cards = new Set();
  let dock, badge, panel, inlineCard, closeButton, dismissButton, entranceTimer, closeTimer, dismissTimer, motion;
  let dismissedUntil = 0;
  let considered = false, keyboard = false, opened = false;
  let drift, hop, hopFrames = [], hovering = false, leaving = false, driftTime = 0, savedDriftTime;
  try {
    const saved = JSON.parse(sessionStorage.getItem(driftKey));
    if (saved && Number.isFinite(saved.time) && saved.time >= 0 && saved.time < driftDuration &&
        Date.now() - saved.at >= 0 && Date.now() - saved.at < 8 * 60 * 60 * 1000) {
      driftTime = saved.time;
      considered = true;
    }
  } catch {}
  const locale = () => globalThis.NotMeterI18n?.normalize(document.documentElement.lang) || document.documentElement.lang;
  const words = () => copy[locale()] || copy.en;
  const labels = () => controls[locale()] || controls.en;

  function makeCard(titleId) {
    const card = template.content.querySelector(".exitlag-promotion").cloneNode(true);
    card.querySelector("h3").id = titleId;
    card.setAttribute("aria-labelledby", titleId);
    card.querySelector("code").textContent = promotion.coupon;
    card.querySelector("a").href = promotion.url;
    card.querySelector("button").addEventListener("click", async () => {
      const status = card.querySelector("[role=status]");
      try {
        await navigator.clipboard.writeText(promotion.coupon);
        status.textContent = words()[6];
      } catch {
        status.textContent = `${words()[7]} ${promotion.coupon}`;
      }
    });
    cards.add(card);
    return card;
  }

  function translate() {
    cards.forEach(card => {
      card.querySelectorAll("[data-exitlag-text]").forEach(element => {
        element.textContent = words()[Number(element.dataset.exitlagText)];
      });
      card.querySelector("[role=status]").textContent = "";
    });
    if (!badge) return;
    badge.querySelector("span").textContent = words()[0];
    badge.setAttribute("aria-label", labels()[0]);
    badge.title = labels()[0];
    dock.setAttribute("aria-label", labels()[0]);
    if (closeButton) {
      closeButton.setAttribute("aria-label", labels()[1]);
      closeButton.title = labels()[1];
    }
    if (dismissButton) dismissButton.textContent = labels()[2];
    positionPanel();
  }

  function stopMotion() {
    clearTimeout(entranceTimer);
    entranceTimer = undefined;
    motion?.cancel();
    motion = undefined;
    dock?.classList.remove("is-arriving");
    dock?.classList.remove("is-waiting");
  }

  function syncDrift() {
    if (!drift || !dock) return;
    if (leaving || dock.hidden || document.hidden || reducedMotion.matches || opened || hovering ||
        (dock.contains(document.activeElement) && document.activeElement.matches(":focus-visible")) ||
        dock.classList.contains("is-waiting") ||
        dock.classList.contains("is-arriving")) {
      drift.pause();
      hop?.cancel();
      hop = undefined;
    } else {
      if (drift.playState !== "running") drift.play();
      if (!hop && hopFrames.length) {
        hop = badge.animate(hopFrames, { duration: driftDuration, iterations: Infinity });
        hop.id = "exitlag-climb";
        hop.currentTime = drift.currentTime;
      }
    }
  }

  function rememberDrift() {
    if (drift) driftTime = Number(drift.currentTime || 0) % driftDuration;
    if (savedDriftTime === driftTime) return;
    try {
      sessionStorage.setItem(driftKey, JSON.stringify({ time: driftTime, at: Date.now() }));
      savedDriftTime = driftTime;
    } catch {}
  }

  function prepareDrift() {
    if (!dock?.animate) return;
    if (drift) driftTime = Number(drift.currentTime || 0) % driftDuration;
    drift?.cancel();
    hop?.cancel();
    hop = undefined;
    const distance = innerWidth >= 1680
      ? Math.min(240, Math.max(0, innerHeight - 916))
      : Math.min(180, Math.max(0, innerHeight / 2 - 122));
    const path = [{ transform: "translateY(0)", offset: 0 }];
    hopFrames = [{ transform: "scale(1)", offset: 0 }];
    const step = distance / 6;
    for (let index = 0; index < 6; index++) {
      const start = .04 + index * .075;
      const from = -step * index, to = -step * (index + 1);
      path.push(
        { transform: `translateY(${from}px)`, offset: start },
        { transform: `translateY(${from}px)`, offset: start + .017, easing: "cubic-bezier(.12,.75,.3,1)" },
        { transform: `translateY(${to - Math.min(9, step / 4)}px)`, offset: start + .029, easing: "ease-in" },
        { transform: `translateY(${to + Math.min(3, step / 10)}px)`, offset: start + .041, easing: "ease-out" },
        { transform: `translateY(${to}px)`, offset: start + .052 }
      );
      hopFrames.push(
        { transform: "scale(1)", offset: start, easing: "ease-in" },
        { transform: "scale(1.045,.88)", offset: start + .017, easing: "ease-out" },
        { transform: "scale(.985,1.055)", offset: start + .029, easing: "ease-in" },
        { transform: "scale(1.025,.94)", offset: start + .041, easing: "ease-out" },
        { transform: "scale(1)", offset: start + .052 }
      );
    }
    path.push(
      { transform: `translateY(${-distance}px)`, offset: .58, easing: "cubic-bezier(.45,0,.6,1)" },
      { transform: "translateY(0)", offset: .9 },
      { transform: "translateY(0)", offset: 1 }
    );
    hopFrames.push(
      { transform: "scale(1)", offset: .89, easing: "ease-in" },
      { transform: "scale(1.035,.92)", offset: .9, easing: "ease-out" },
      { transform: "scale(1)", offset: .915 },
      { transform: "scale(1)", offset: 1 }
    );
    if (!distance) hopFrames = [];
    drift = dock.animate(path, { duration: driftDuration, iterations: Infinity });
    drift.id = "exitlag-drift";
    drift.pause();
    drift.currentTime = driftTime;
    syncDrift();
  }

  function positionPanel() {
    if (!opened || !panel) return;
    const y = dock.getBoundingClientRect().top;
    const height = panel.offsetHeight;
    const top = Math.max(0, Math.min(innerHeight - height, y + 26 - height / 2));
    panel.style.top = `${top - y}px`;
  }

  function close(returnFocus = false) {
    clearTimeout(closeTimer);
    if (!opened) return;
    opened = false;
    panel.hidden = true;
    badge.setAttribute("aria-expanded", "false");
    dock.classList.remove("is-open");
    if (returnFocus) badge.focus({ preventScroll: true });
    else if (panel.contains(document.activeElement)) document.activeElement.blur();
    syncDrift();
  }

  function open() {
    stopMotion();
    considered = true;
    clearTimeout(closeTimer);
    if (!panel.firstElementChild) {
      const card = makeCard("exitlag-floating-title");
      closeButton = document.createElement("button");
      closeButton.type = "button";
      closeButton.className = "exitlag-flyout-close";
      closeButton.textContent = "×";
      closeButton.addEventListener("click", () => close(keyboard));
      card.querySelector(".exitlag-promotion-brand").append(closeButton);
      const footer = document.createElement("div");
      footer.className = "exitlag-flyout-footer";
      dismissButton = document.createElement("button");
      dismissButton.type = "button";
      dismissButton.className = "exitlag-dismiss-today";
      dismissButton.addEventListener("click", dismissToday);
      footer.append(dismissButton);
      card.append(footer);
      panel.append(card);
      translate();
    }
    panel.hidden = false;
    opened = true;
    badge.setAttribute("aria-expanded", "true");
    dock.classList.add("is-open");
    syncDrift();
    positionPanel();
    if (keyboard) closeButton.focus({ preventScroll: true });
  }

  function animationDue() {
    const now = Date.now();
    let available = false, recent = false;
    for (const storage of ["localStorage", "sessionStorage"]) {
      try {
        const stamp = Number(globalThis[storage].getItem(cooldownKey));
        available = true;
        if (stamp > 0 && stamp <= now + cooldown && now - stamp < cooldown) recent = true;
      } catch {}
    }
    return available && !recent;
  }

  function rememberAnimation() {
    const stamp = String(Date.now());
    let saved = false;
    try { localStorage.setItem(cooldownKey, stamp); saved = true; } catch {}
    try { sessionStorage.setItem(cooldownKey, stamp); saved = true; } catch {}
    return saved;
  }

  function arrive() {
    entranceTimer = undefined;
    if (!dock || dock.hidden || document.hidden || opened || considered) return;
    considered = true;
    dock.classList.remove("is-waiting");
    if (reducedMotion.matches || !animationDue() || !badge.animate || !rememberAnimation()) {
      syncDrift();
      return;
    }
    const bounds = badge.getBoundingClientRect();
    const floor = Math.max(0, innerHeight - 78 - bounds.bottom);
    const frame = (x, y, angle, scaleX = 1, scaleY = 1) => ({
      transform: `translate(${-x}px, ${y}px) rotate(${-angle}deg) scale(${scaleX}, ${scaleY})`
    });
    dock.classList.add("is-arriving");
    syncDrift();
    motion = badge.animate([
      { ...frame(-420, floor - 72, -9), opacity: 0, offset: 0 },
      { ...frame(-380, floor, 0, 1.07, .88), opacity: 1, offset: .12, easing: "cubic-bezier(.2,.7,.4,1)" },
      { ...frame(-320, floor - 78, 5), offset: .25, easing: "cubic-bezier(.6,0,.8,.3)" },
      { ...frame(-260, floor, 0, 1.05, .92), offset: .38, easing: "cubic-bezier(.2,.7,.4,1)" },
      { ...frame(-205, floor - 48, -4), offset: .49, easing: "cubic-bezier(.6,0,.8,.3)" },
      { ...frame(-150, floor, 0, 1.04, .94), offset: .60, easing: "cubic-bezier(.2,.7,.4,1)" },
      { ...frame(-102, floor - 28, 3), offset: .69, easing: "cubic-bezier(.6,0,.8,.3)" },
      { ...frame(-58, floor, 0), offset: .77, easing: "cubic-bezier(.2,.8,.25,1)" },
      { ...frame(-12, -6, -3), offset: .94, easing: "ease-out" },
      { ...frame(0, 0, 0), opacity: 1, offset: 1 }
    ], { duration: 2600, fill: "none" });
    motion.onfinish = () => {
      motion = undefined;
      dock?.classList.remove("is-arriving");
      syncDrift();
    };
  }

  const modalOpen = () => [...document.querySelectorAll('[aria-modal="true"], dialog[open]')]
    .some(element => element.getClientRects().length > 0);

  function dismissalDeadline() {
    const now = Date.now();
    let until = dismissedUntil;
    for (const storage of ["localStorage", "sessionStorage"]) {
      try {
        const stored = Number(globalThis[storage].getItem(dismissKey));
        if (Number.isFinite(stored) && stored > now && stored <= now + 26 * 60 * 60 * 1000)
          until = Math.max(until, stored);
      } catch {}
    }
    return until > now ? until : 0;
  }

  function dismissToday() {
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0);
    dismissedUntil = midnight.getTime();
    try { localStorage.setItem(dismissKey, String(dismissedUntil)); } catch {}
    try { sessionStorage.setItem(dismissKey, String(dismissedUntil)); } catch {}
    considered = true;
    syncVisibility();
  }

  function syncVisibility() {
    if (!dock) return;
    clearTimeout(dismissTimer);
    const until = dismissalDeadline();
    if (until) dismissTimer = setTimeout(syncVisibility, Math.max(1, until - Date.now() + 50));
    dock.hidden = Boolean(until) || document.hidden || modalOpen();
    if (dock.hidden) {
      stopMotion();
      close();
    } else if (!considered && !entranceTimer) {
      if (reducedMotion.matches || !animationDue()) considered = true;
      else {
        dock.classList.add("is-waiting");
        entranceTimer = setTimeout(arrive, 1600);
      }
    }
    syncDrift();
    if (document.hidden) rememberDrift();
  }

  function mount() {
    if (dock || mobile || !desktop.matches) return;
    inlineCard = makeCard("exitlag-promotion-title");
    template.after(inlineCard);
    dock = document.createElement("aside");
    dock.className = "exitlag-dock";
    dock.id = "exitlag-dock";
    badge = document.createElement("button");
    badge.type = "button";
    badge.className = "exitlag-badge";
    badge.setAttribute("aria-expanded", "false");
    badge.setAttribute("aria-controls", "exitlag-flyout");
    const logo = document.createElement("img");
    logo.src = "./assets/exitlag-logo.png";
    logo.alt = "ExitLag";
    logo.width = 94;
    logo.height = 22;
    logo.loading = "lazy";
    badge.append(logo, document.createElement("span"));
    badge.addEventListener("click", event => {
      keyboard = event.detail === 0;
      if (opened) close();
      else open();
    });
    panel = document.createElement("div");
    panel.id = "exitlag-flyout";
    panel.className = "exitlag-flyout";
    panel.hidden = true;
    dock.append(badge, panel);
    dock.addEventListener("pointerdown", () => { keyboard = false; });
    dock.addEventListener("pointerenter", () => {
      clearTimeout(closeTimer);
      hovering = true;
      syncDrift();
    });
    dock.addEventListener("pointerleave", () => {
      hovering = false;
      syncDrift();
      closeTimer = setTimeout(() => {
        if (!keyboard || !dock?.contains(document.activeElement)) close();
      }, 220);
    });
    dock.addEventListener("keydown", event => {
      keyboard = true;
      if (event.key === "Escape" && opened) {
        event.preventDefault();
        event.stopPropagation();
        close(true);
      }
    });
    dock.addEventListener("focusin", syncDrift);
    dock.addEventListener("focusout", event => {
      if (!dock.contains(event.relatedTarget)) close();
      queueMicrotask(syncDrift);
    });
    document.body.append(dock);
    translate();
    syncVisibility();
    prepareDrift();
  }

  function syncDevice() {
    if (!mobile && desktop.matches) { mount(); return; }
    if (!dock) return;
    stopMotion();
    close();
    rememberDrift();
    drift?.cancel();
    drift = undefined;
    hop?.cancel();
    hop = undefined;
    hovering = false;
    clearTimeout(dismissTimer);
    dock.remove();
    inlineCard.remove();
    cards.clear();
    dock = badge = panel = inlineCard = closeButton = dismissButton = undefined;
  }

  document.addEventListener("pointerdown", event => {
    if (opened && !dock.contains(event.target)) close();
  }, { passive: true });
  document.addEventListener("visibilitychange", syncVisibility);
  window.addEventListener("pagehide", () => {
    leaving = true;
    stopMotion();
    syncDrift();
    rememberDrift();
  });
  window.addEventListener("pageshow", () => {
    leaving = false;
    syncVisibility();
  });
  window.addEventListener("resize", () => {
    if (motion) stopMotion();
    prepareDrift();
    positionPanel();
  }, { passive: true });
  window.addEventListener("storage", event => {
    if (event.key === dismissKey) syncVisibility();
    if (event.key === cooldownKey && !animationDue() && !motion) {
      considered = true;
      stopMotion();
      syncDrift();
    }
  });
  desktop.addEventListener("change", syncDevice);
  reducedMotion.addEventListener("change", () => {
    if (reducedMotion.matches) { considered = true; stopMotion(); }
    syncDrift();
  });
  const modalObserver = new MutationObserver(syncVisibility);
  document.querySelectorAll('[aria-modal="true"]').forEach(element => {
    modalObserver.observe(element.closest(".download-modal, .detail-modal") || element, {
      attributes: true, attributeFilter: ["hidden", "open", "class", "style"]
    });
  });
  new MutationObserver(translate).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
  syncDevice();
})();
