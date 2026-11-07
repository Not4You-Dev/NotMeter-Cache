(function () {
  "use strict";

  const INTERVAL = 3 * 3600000;
  const KST = 9 * 3600000;
  const LAUNCH_SLOT = Math.floor(Date.UTC(2026, 9, 10) / INTERVAL);

  function rotationSlot(timestamp) {
    return Math.floor((timestamp + KST) / INTERVAL);
  }

  function sceneForTime(timestamp) {
    const slots = rotationSlot(timestamp) - LAUNCH_SLOT;
    let scene = 4; // Start with the approved crystal garden (option 5).
    // The same sequence on every device, without cookies or storage.
    // A nonzero step modulo 5 prevents consecutive scenes from repeating.
    for (let slot = 1; slot <= slots; slot += 1) {
      let hash = Math.imul(slot ^ 0x6e6d2026, 0x45d9f3b);
      hash = Math.imul(hash ^ (hash >>> 16), 0x45d9f3b);
      hash = (hash ^ (hash >>> 16)) >>> 0;
      scene = (scene + 1 + (hash % 4)) % 5;
    }
    return scene + 1;
  }

  function nextCheckDelay(timestamp) {
    const boundary = (rotationSlot(timestamp) + 1) * INTERVAL - KST;
    // Also recheck after a clock adjustment; never run a per-frame date loop.
    return Math.max(100, Math.min(3600000, boundary - timestamp + 25));
  }

  if (typeof module === "object" && module.exports) {
    module.exports = { sceneForTime, rotationSlot, nextCheckDelay };
    return;
  }

  const root = document.documentElement;
  const scene = document.createElement("div");
  scene.className = "nm-background";
  scene.setAttribute("aria-hidden", "true");
  for (const part of ["landscape", "shade", "shaft", "mist", "particles"]) {
    const layer = document.createElement("div");
    layer.className = `nm-background-${part}`;
    scene.appendChild(layer);
  }
  const particles = scene.lastElementChild;
  for (let i = 0; i < 32; i += 1) {
    const random = n => ((i * 71 + n * 137) % 997) / 997;
    const particle = document.createElement("i");
    particle.className = "nm-background-particle";
    particle.style.cssText = `--x:${random(1) * 100}%;--y:${random(2) * 100}%;` +
      `--s:${0.9 + random(3) * 1.65}px;--duration:${18 + random(4) * 22}s;` +
      `--delay:${-random(5) * 40}s;--alpha:${0.17 + random(6) * 0.25};` +
      `--drift:${-22 + random(7) * 44}px`;
    particles.appendChild(particle);
  }

  let timer;
  let lastSlot;
  function refreshScene() {
    window.clearTimeout(timer);
    const now = Date.now();
    const slot = rotationSlot(now);
    if (slot !== lastSlot) {
      root.dataset.notmeterBackground = String(sceneForTime(now));
      lastSlot = slot;
    }
    scene.dataset.paused = String(document.hidden);
    if (!document.hidden) timer = window.setTimeout(refreshScene, nextCheckDelay(now));
  }

  let scrollFrame = 0;
  function updateShade() {
    scrollFrame = 0;
    scene.style.setProperty("--reading-shade", Math.min(0.82, Math.max(0, window.scrollY) / 1200 * 0.82).toFixed(3));
  }
  window.addEventListener("scroll", () => {
    if (!scrollFrame) scrollFrame = window.requestAnimationFrame(updateShade);
  }, { passive: true });
  document.addEventListener("visibilitychange", refreshScene);
  window.addEventListener("pageshow", () => {
    refreshScene();
    updateShade();
  });
  window.addEventListener("pagehide", () => {
    window.clearTimeout(timer);
    window.cancelAnimationFrame(scrollFrame);
    scrollFrame = 0;
    scene.dataset.paused = "true";
  });

  refreshScene();
  updateShade();
  // Select before insertion: only the current artwork is requested by the browser.
  document.body.prepend(scene);
})();
