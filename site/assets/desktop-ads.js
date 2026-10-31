(() => {
  "use strict";
  if (navigator.globalPrivacyControl === true || window.top !== window.self) return;
  if (document.getElementById("desktop-ad-left")) return;
  const content = document.querySelector(".app-shell, .optimization-shell, .guide-layout");
  if (!content) return;
  const desktop = matchMedia("(min-width: 1680px) and (hover: hover) and (pointer: fine)");
  const slots = [["left", "6964936897"], ["right", "7175233617"]];
  const labels = {
    ko: "광고", en: "Advertisement", "zh-TW": "廣告", "ja-JP": "広告",
    "de-DE": "Werbung", "fr-FR": "Publicité", "es-ES": "Publicidad",
    "pt-BR": "Publicidade", "ru-RU": "Реклама", th: "โฆษณา", vi: "Quảng cáo"
  };
  const rails = [];
  let pending = false;

  function translate() {
    const label = labels[document.documentElement.lang] || labels.en;
    for (const { rail, caption } of rails) {
      rail.setAttribute("aria-label", label);
      caption.textContent = label;
    }
  }

  function layout() {
    pending = false;
    const bounds = content.getBoundingClientRect();
    const viewport = document.documentElement.clientWidth;
    for (const [side, slot] of slots) {
      let state = rails.find(item => item.side === side);
      const space = (side === "left" ? bounds.left : viewport - bounds.right) - 48;
      const eligible = desktop.matches && space >= 160;
      if (!state && eligible && !document.hidden) {
        const rail = document.createElement("aside");
        rail.id = `desktop-ad-${side}`;
        rail.className = `desktop-ad-rail desktop-ad-rail--${side}`;
        rail.setAttribute("google-side-rail-overlap", "false");
        const caption = document.createElement("span");
        caption.className = "desktop-ad-caption";
        const unit = document.createElement("ins");
        unit.className = "adsbygoogle";
        unit.dataset.adClient = "ca-pub-7318383767094918";
        unit.dataset.adSlot = slot;
        const width = Math.min(300, Math.floor(space));
        rail.style.width = `${width}px`;
        unit.style.cssText = `display:block;width:${width}px;height:600px`;
        rail.append(caption, unit);
        document.body.append(rail);
        state = { side, rail, caption, unit, width, requested: false };
        rails.push(state);
        document.body.classList.add("desktop-ads-ready");
        translate();
      }
      if (!state) continue;
      state.rail.hidden = !eligible || space < state.width;
      state.rail.style.left = `${Math.round(side === "left" ? bounds.left - 24 - state.width : bounds.right + 24)}px`;
      if (state.requested || state.rail.hidden || document.hidden ||
          getComputedStyle(state.rail).visibility !== "visible" ||
          state.unit.getBoundingClientRect().width < 160) continue;
      state.requested = true;
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch {
        state.rail.dataset.failed = "true";
      }
    }
  }

  function schedule() {
    if (pending) return;
    pending = true;
    requestAnimationFrame(layout);
  }

  new ResizeObserver(schedule).observe(content);
  new MutationObserver(schedule).observe(document.body, { attributes: true, attributeFilter: ["class"] });
  new MutationObserver(translate).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
  window.addEventListener("resize", schedule, { passive: true });
  window.addEventListener("pageshow", schedule);
  document.addEventListener("visibilitychange", schedule);
  desktop.addEventListener("change", schedule);
  schedule();
})();
