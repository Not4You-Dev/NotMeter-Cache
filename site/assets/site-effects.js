(() => {
  "use strict";
  const selector = ".first-guide, .meter-use-notice, .snapshot-meta, .ranking-metric-button, .ranking-service-button, .filter-cp-field, #back-button";
  const visible = new IntersectionObserver(entries => {
    for (const entry of entries) entry.target.style.setProperty("--nm-effect-play", entry.isIntersecting ? "running" : "paused");
  });
  function mount(element) {
    if (element.querySelector(":scope > .nm-flow-border")) return;
    const border = document.createElement("span");
    border.className = "nm-flow-border";
    border.setAttribute("aria-hidden", "true");
    element.append(border);
    element.classList.add("nm-composited-border");
    visible.observe(element);
  }
  function scan(element) {
    if (element.matches(selector)) mount(element);
    element.querySelectorAll(selector).forEach(mount);
  }
  scan(document.body);
  const hint = document.getElementById("class-ranking-hint");
  if (hint) visible.observe(hint);
  new MutationObserver(records => {
    for (const record of records) {
      if (record.target instanceof Element && record.target.matches(selector)) mount(record.target);
      for (const node of record.addedNodes) if (node instanceof Element && !node.matches(".nm-flow-border")) scan(node);
      for (const node of record.removedNodes) if (node instanceof Element && !node.isConnected) {
        if (node.matches(selector)) visible.unobserve(node);
        node.querySelectorAll(selector).forEach(element => visible.unobserve(element));
      }
    }
  }).observe(document.body, { childList: true, subtree: true });
  const sync = () => { document.documentElement.dataset.nmEffectsPaused = String(document.hidden); };
  document.addEventListener("visibilitychange", sync);
  window.addEventListener("pageshow", sync);
  window.addEventListener("pagehide", () => { document.documentElement.dataset.nmEffectsPaused = "true"; });
  sync();
})();
