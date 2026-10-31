(() => {
  "use strict";
  const core = globalThis.NotMeterBossAlertCore;
  const mobile = matchMedia("(max-width: 760px), (hover: none) and (pointer: coarse)");
  const key = "notmeter-boss-alerts-v1", ledgerKey = key + "-sent";
  const assets = new URL(".", document.currentScript.src);
  const read = (name, fallback) => { try { return JSON.parse(localStorage.getItem(name)) ?? fallback; } catch { return fallback; } };
  const readObject = name => { const value = read(name, {}); return value && typeof value === "object" && !Array.isArray(value) ? value : {}; };
  let storageAvailable = true;
  const write = (name, value) => { try { localStorage.setItem(name, JSON.stringify(value)); } catch { storageAvailable = false; } };
  let config = core.settings(read(key, {})), locale = "en", expanded = false, editing = false, root, body, clockRefs = [], compactRefs;
  let audio, audioReady = false, soundBusyUntil = 0, message = "", ticker = 0, checking = false;
  let previewing = false, previewRequest = 0;
  let drag = null, positionFrame = 0;
  const soundNodes = new Map();
  let permissionBusy = false, permissionDismissed = false, notificationUnavailable = false;
  let lastCheck = Date.now(), lastLocale = "", renderSignature = "", toast, toastTimer, catalogRetryAt = 0, orderSignature = "";
  const lastFetch = new Map(), retryAfter = new Map(), fetching = new Set(), scriptLoads = new Map(), snapshots = new Map();
  const tabId = globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`;
  const t = (key, values = {}) => Object.entries(values).reduce((text, [key, value]) => text.replaceAll(`{${key}}`, value),
    (globalThis.NotMeterBossAlertCopy[locale] || globalThis.NotMeterBossAlertCopy.en)[key] || key);
  const nameOf = entry => entry.names[globalThis.NotMeterI18n?.gameLocale(locale) || locale] || (entry.service !== "WW" && entry.names.ko && globalThis.NotMeterI18n?.game(entry.names.ko, locale)) || entry.names.en || entry.names.ko || String(entry.code);
  const serverOf = entry => `${entry.service === "WW" ? entry.region.toUpperCase().replace("LA", "SA") : entry.service} · ${entry.serverNames[locale] || entry.serverNames.en || entry.serverNames.ko || entry.serverId}`;
  function node(tag, className = "", text) {
    const element = document.createElement(tag); element.className = className;
    if (text != null) element.textContent = text;
    return element;
  }
  function button(text, action, className = "") {
    const element = node("button", className, text); element.type = "button"; element.addEventListener("click", action); return element;
  }
  function bell() {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 24 24"); svg.setAttribute("aria-hidden", "true");
    const path = document.createElementNS(svg.namespaceURI, "path");
    path.setAttribute("d", "M5 17h14l-2-3V9a5 5 0 0 0-10 0v5l-2 3Zm5 3h4M12 2v2"); svg.append(path); return svg;
  }
  function syncLocale() {
    const value = globalThis.NotMeterI18n?.read() || document.documentElement.lang || "en";
    locale = Object.hasOwn(globalThis.NotMeterBossAlertCopy, value) ? value : "en";
  }
  function save() {
    write(key, config); renderSignature = ""; render(); renderEntry(); syncButtons(); scheduleWork();
  }
  function placePanel() {
    if (!root || root.hidden) return;
    root.style.setProperty("--ba-bottom", config.position || drag ? "12px" : "112px");
    if (config.position || drag) {
      const bounds = root.getBoundingClientRect(), width = Math.max(0, innerWidth - bounds.width - 24), height = Math.max(0, innerHeight - bounds.height - 24);
      const x = drag ? drag.x : 12 + config.position.x * width, y = drag ? drag.y : 12 + config.position.y * height;
      root.style.left = Math.max(12, Math.min(12 + width, x)) + "px";
      root.style.top = Math.max(12, Math.min(12 + height, y)) + "px";
      root.style.right = "auto"; root.style.bottom = "auto";
    } else {
      for (const property of ["left", "top", "right", "bottom"]) root.style.removeProperty(property);
    }
    placeToast();
  }
  function queuePosition() {
    if (!positionFrame) positionFrame = requestAnimationFrame(() => { positionFrame = 0; placePanel(); });
  }
  function placeToast() {
    if (!toast?.isConnected || !root || mobile.matches) return;
    const panel = root.getBoundingClientRect(), box = toast.getBoundingClientRect(), margin = 12;
    let x = panel.right - box.width, y = panel.top - box.height - 8;
    if (y < margin) {
      if (panel.bottom + box.height + 8 <= innerHeight - margin) y = panel.bottom + 8;
      else if (panel.right + box.width + 8 <= innerWidth - margin) { x = panel.right + 8; y = panel.top; }
      else if (panel.left - box.width - 8 >= margin) { x = panel.left - box.width - 8; y = panel.top; }
      else y = innerHeight - box.height - margin;
    }
    toast.style.left = Math.max(margin, Math.min(innerWidth - box.width - margin, x)) + "px";
    toast.style.top = Math.max(margin, Math.min(innerHeight - box.height - margin, y)) + "px";
    toast.style.right = "auto"; toast.style.bottom = "auto";
  }
  function rememberPosition(x, y) {
    const box = root.getBoundingClientRect();
    change(value => { value.position = { x: (x - 12) / Math.max(1, innerWidth - box.width - 24), y: (y - 12) / Math.max(1, innerHeight - box.height - 24) };
      value.position.x = Math.max(0, Math.min(1, value.position.x)); value.position.y = Math.max(0, Math.min(1, value.position.y)); });
  }
  function resetPosition() { change(value => { value.position = null; value.side = "right"; }); }
  function hidePanel() {
    finishDrag(); expanded = false;
    change(value => { value.hidden = true; });
    document.getElementById("nmba-entry-open")?.focus({ preventScroll: true });
  }
  function hideButton() {
    const control = button("×", hidePanel, "nmba-icon-button nmba-hide");
    control.setAttribute("aria-label", t("hidePanel")); control.title = t("hideHelp");
    return control;
  }
  function finishDrag(commit = false) {
    if (!drag) return;
    const previous = drag; drag = null; root.classList.remove("is-dragging");
    if (previous.handle.hasPointerCapture(previous.id)) previous.handle.releasePointerCapture(previous.id);
    if (commit && previous.moved) {
      const box = root.getBoundingClientRect(); rememberPosition(box.left, box.top);
    } else { renderSignature = ""; render(); }
    document.getElementById("nmba-move")?.focus({ preventScroll: true });
  }
  function moveHandle() {
    const handle = button("", () => {}, "nmba-move nmba-icon-button"); handle.id = "nmba-move";
    handle.title = t("moveHelp"); handle.setAttribute("aria-label", t("moveHelp"));
    const icon = bell(); icon.querySelector("path").setAttribute("d", "M12 3v18M3 12h18M9 6l3-3 3 3M9 18l3 3 3-3M6 9l-3 3 3 3M18 9l3 3-3 3"); handle.append(icon);
    handle.addEventListener("pointerdown", event => {
      if (!event.isPrimary || event.button !== 0) return;
      event.preventDefault(); handle.focus({ preventScroll: true });
      const box = root.getBoundingClientRect();
      drag = { handle, id: event.pointerId, startX: event.clientX, startY: event.clientY, left: box.left, top: box.top, x: box.left, y: box.top, moved: false };
      handle.setPointerCapture(event.pointerId); root.classList.add("is-dragging");
    });
    handle.addEventListener("pointermove", event => {
      if (!drag || drag.id !== event.pointerId) return;
      const dx = event.clientX - drag.startX, dy = event.clientY - drag.startY;
      if (!drag.moved && Math.hypot(dx, dy) < 4) return;
      drag.moved = true; drag.x = drag.left + dx; drag.y = drag.top + dy; placePanel();
    });
    handle.addEventListener("pointerup", event => { if (drag?.id === event.pointerId) finishDrag(true); });
    handle.addEventListener("pointercancel", () => finishDrag());
    handle.addEventListener("lostpointercapture", () => finishDrag());
    handle.addEventListener("keydown", event => {
      if (event.key === "Escape" && drag) { event.preventDefault(); finishDrag(); return; }
      if (event.key === "Home") { event.preventDefault(); resetPosition(); document.getElementById("nmba-move")?.focus({ preventScroll: true }); return; }
      const directions = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }, direction = directions[event.key];
      if (!direction || drag) return;
      event.preventDefault(); const box = root.getBoundingClientRect(), step = event.shiftKey ? 40 : 10;
      rememberPosition(box.left + direction[0] * step, box.top + direction[1] * step);
    });
    return handle;
  }
  function change(update) {
    config = core.settings(read(key, config)); update(config); save();
  }
  async function loadScript(name) {
    if (!scriptLoads.has(name)) scriptLoads.set(name, new Promise((resolve, reject) => {
      const version = name === "field-boss-catalog.js" ? "20261028-agro" : "20261015-boss-alerts";
      const script = document.createElement("script"); script.src = new URL(name + "?v=" + version, assets).href;
      script.onload = resolve; script.onerror = () => { scriptLoads.delete(name); reject(new Error("Catalog unavailable")); }; document.head.append(script);
    }));
    return scriptLoads.get(name);
  }
  async function ensureCatalogs() {
    if (Date.now() < catalogRetryAt) throw new Error("Catalog retry pending");
    const jobs = [];
    if (config.entries.some(e => e.service !== "WW") && !globalThis.NotMeterFieldBossFixedSchedules) jobs.push(loadScript("field-boss-catalog.js"));
    if (config.entries.some(e => e.service === "WW") && !globalThis.NotMeterGlobalFieldBossCatalog) jobs.push(loadScript("field-boss-global-catalog.js"));
    try { await Promise.all(jobs); }
    catch (error) { catalogRetryAt = Date.now() + 30000; throw error; }
  }
  function updateNames(entry) {
    if (entry.service !== "WW") return;
    const catalog = globalThis.NotMeterGlobalFieldBossCatalog;
    const boss = catalog?.maps.find(m => m.mapId === entry.mapId)?.bosses.find(b => b.code === entry.code);
    const server = catalog?.serviceRegions.find(r => r.key === entry.region)?.servers.find(s => s.id === entry.serverId);
    if (boss) entry.names = { ...entry.names, ...boss.names };
    if (server) entry.serverNames = { ...entry.serverNames, ...server.names };
  }
  function receiveCache(service, region, cache) {
    if (mobile.matches) return;
    const group = service === "WW" ? `WW:${region}` : service, now = Date.now();
    try { core.validateCache(cache, group, now); } catch { return; }
    if (snapshots.has(group) && snapshots.get(group).generatedAt > cache.generatedAt) return;
    snapshots.set(group, cache); lastFetch.set(group, now);
    write(key + "-fetched", { ...readObject(key + "-fetched"), [group]: now });
    let changed = false;
    config = core.settings(read(key, config));
    for (const entry of config.entries.filter(entry => core.cacheGroup(entry) === group)) {
      const next = core.observation(cache, entry, now);
      if (next && Object.entries(next).some(([key, value]) => entry[key] !== value)) { Object.assign(entry, next); changed = true; }
    }
    if (changed) { write(key, config); renderSignature = ""; render(); }
  }
  async function refresh() {
    if (mobile.matches || !config.entries.length) return;
    try { await ensureCatalogs(); } catch { message = t("stale"); render(); return; }
    if (mobile.matches) return;
    const now = Date.now(), groups = new Set(config.entries.filter(entry => !core.scheduleFor(entry)).map(core.cacheGroup));
    await Promise.all([...groups].map(async group => {
      const fetchGroup = async () => {
        if (mobile.matches || fetching.has(group) || now < (retryAfter.get(group) || 0) ||
            now - Math.max(lastFetch.get(group) || 0, Number(readObject(key + "-fetched")[group]) || 0) < 120000) return;
        fetching.add(group);
        const controller = new AbortController(), timeout = setTimeout(() => controller.abort(), 10000);
        try {
          const readResponse = async response => {
            if (!response.ok || Number(response.headers.get("content-length")) > 2000000) throw new Error("Unavailable");
            const text = await response.text();
            if (text.length > 2000000) throw new Error("Oversized");
            return core.validateCache(JSON.parse(text), group, now);
          };
          let cache = null, source = core.cacheUrl(group);
          try {
            const fetchCache = url => fetch(`${url}?v=${Math.floor(now / 60000)}`, { signal: controller.signal, cache: "no-cache" });
            let response = await fetchCache(source);
            if (response.status === 404 && source !== core.cacheUrl(group, true)) {
              source = core.cacheUrl(group, true); response = await fetchCache(source);
            }
            cache = await readResponse(response);
          } catch {}
          const selected = core.settings(read(key, config)).entries.filter(entry => core.cacheGroup(entry) === group && !core.scheduleFor(entry));
          const age = now - Number(cache?.generatedAt || 0) * 1000;
          const missing = cache && selected.some(entry => {
            const next = core.observation(cache, entry, now);
            return !next || !core.target({ ...entry, ...next }, now) || next.targetAt <= now;
          });
          if (!cache || age >= 720000 || (missing && age >= 120000) || selected.some(entry => entry.generatedAt > cache.generatedAt)) {
            const revisions = readObject(key + "-revisions"), previous = revisions[group];
            let revision = previous?.source === source ? previous.revision : "";
            if (previous?.source !== source || !(previous?.checkedAt > now - 600000 && previous.checkedAt <= now)) {
              revisions[group] = { source, revision, checkedAt: now }; write(key + "-revisions", revisions);
              try {
                const file = source.split("/main/")[1];
                const response = await fetch(`https://api.github.com/repos/Not4You-Dev/NotMeter-Cache/commits?path=${encodeURIComponent(file)}&per_page=1`,
                  { signal: controller.signal, cache: "no-cache", headers: { Accept: "application/vnd.github+json" } });
                if (!response.ok) throw new Error("Revision unavailable");
                const commits = await response.json();
                if (!/^[0-9a-f]{40}$/i.test(commits?.[0]?.sha || "")) throw new Error("Invalid revision");
                revision = commits[0].sha;
                write(key + "-revisions", { ...readObject(key + "-revisions"), [group]: { source, revision, checkedAt: now } });
              } catch {}
            }
            if (/^[0-9a-f]{40}$/i.test(revision)) {
              try {
                const latest = await readResponse(await fetch(source.replace("/main/", `/${revision}/`),
                  { signal: controller.signal, cache: "force-cache" }));
                if (!cache || latest.generatedAt > cache.generatedAt) cache = latest;
              } catch {}
            }
          }
          if (!cache) throw new Error("Unavailable");
          retryAfter.delete(group);
          lastFetch.set(group, Date.now());
          message = ""; receiveCache(group.split(":")[0], group.split(":")[1], cache);
        } catch { retryAfter.set(group, Date.now() + 15000); message = t("stale"); render(); }
        finally { clearTimeout(timeout); fetching.delete(group); }
      };
      if (navigator.locks?.request) await navigator.locks.request(`notmeter-boss-alert-fetch-${group}`, { ifAvailable: true }, lock => lock ? fetchGroup() : undefined);
      else await fetchGroup();
    }));
  }
  async function unlockSound(preview = false) {
    if (mobile.matches || (!config.sound && !preview)) return false;
    try {
      const Audio = globalThis.AudioContext || globalThis.webkitAudioContext;
      if (!Audio) throw new Error("No audio");
      if (!audio) {
        audio = new Audio();
        audio.addEventListener("statechange", () => { audioReady = audio.state === "running"; if (!audioReady) stopSound(); render(); });
      }
      if (audio.state !== "running") await audio.resume();
      if (mobile.matches) { await audio.suspend(); return false; }
      audioReady = audio.state === "running";
      if (audioReady) message = "";
      renderSignature = ""; render(); return audioReady;
    } catch { audioReady = false; message = t("errorSound"); render(); return false; }
  }
  function updatePreview() {
    const control = root?.querySelector(".nmba-sound-preview");
    if (!control) return;
    control.textContent = t(previewing ? "soundStop" : "soundPreview");
    control.setAttribute("aria-label", `${t(previewing ? "soundStop" : "soundPreview")}: ${t("sound_" + config.soundId)}`);
    control.setAttribute("aria-pressed", String(previewing));
  }
  function stopSound() {
    previewRequest++;
    for (const [oscillator, gain] of soundNodes) {
      try { oscillator.stop(); } catch {}
      oscillator.disconnect(); gain.disconnect();
    }
    soundNodes.clear(); previewing = false; soundBusyUntil = 0; updatePreview();
  }
  function playSound(preview = false) {
    if (mobile.matches || (!config.sound && !preview) || !audioReady || audio?.state !== "running" || config.volume <= 0 ||
        (!preview && !previewing && Date.now() < soundBusyUntil)) return;
    stopSound(); previewing = preview; updatePreview();
    const preset = core.sounds[config.soundId];
    soundBusyUntil = preview ? 0 : Date.now() + Math.max(1.8, ...preset.notes.map(([offset, , duration]) => offset + duration + .02)) * 1000;
    const start = audio.currentTime;
    for (const [offset, frequency, duration, strength] of preset.notes) {
      const oscillator = audio.createOscillator(), gain = audio.createGain();
      oscillator.type = preset.wave; oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0, start + offset); gain.gain.linearRampToValueAtTime(config.volume * .16 * strength, start + offset + .025);
      gain.gain.exponentialRampToValueAtTime(.0001, start + offset + duration);
      oscillator.connect(gain); gain.connect(audio.destination); soundNodes.set(oscillator, gain);
      oscillator.start(start + offset); oscillator.stop(start + offset + duration + .02);
      oscillator.onended = () => {
        oscillator.disconnect(); gain.disconnect(); soundNodes.delete(oscillator);
        if (!soundNodes.size) { previewing = false; updatePreview(); }
      };
    }
  }
  async function previewSound() {
    if (previewing) { stopSound(); return; }
    const request = ++previewRequest;
    if (await unlockSound(true) && request === previewRequest) playSound(true);
  }
  function showAlert(text, test = false) {
    if (mobile.matches) return;
    toast?.remove(); clearTimeout(toastTimer);
    if (!config.hidden) {
      toast = node("aside", "nmba-toast"); toast.dataset.side = config.side; toast.setAttribute("role", "status");
      const copy = node("div"); copy.append(node("strong", "", test ? t("test") : t("title")), node("p", "", text));
      const close = button("×", () => toast.remove(), "nmba-icon-button"); close.setAttribute("aria-label", t("remove"));
      toast.append(bell(), copy, close); document.body.append(toast); placeToast(); toastTimer = setTimeout(() => toast?.remove(), 18000);
    }
    playSound();
    if (config.desktop && globalThis.Notification?.permission === "granted") {
      try {
        const notification = new Notification(`NotMeter · ${test ? t("test") : t("title")}`, {
          body: text, icon: new URL("notmeter-icon.png", assets).href, tag: "notmeter-boss-alert", silent: config.sound && audioReady,
        });
        notification.onclick = () => { window.focus(); openPermission(); notification.close(); };
        setTimeout(() => notification.close(), 20000);
      } catch { notificationUnavailable = true; refreshPermission(); }
    }
  }
  function permissionState() {
    if (notificationUnavailable || !globalThis.Notification || !globalThis.isSecureContext) return "unsupported";
    if (permissionBusy) return "pending";
    if (Notification.permission === "denied") return "blocked";
    if (Notification.permission === "granted") return config.desktop ? "ready" : "off";
    return "needed";
  }
  function permissionLabel(state = permissionState()) {
    return t({ needed: "permissionNeeded", ready: "permissionGranted", off: "permissionDisabled", blocked: "permissionBlocked",
      unsupported: "permissionUnavailable", pending: "permissionPending" }[state]);
  }
  function refreshPermission() {
    renderSignature = ""; render(); renderEntry();
  }
  function openPermission() {
    if (mobile.matches) return;
    expanded = true;
    if (config.hidden) change(value => { value.hidden = false; }); else refreshPermission();
    body.scrollTop = 0; root.querySelector(".nmba-permission-action")?.focus({ preventScroll: true });
  }
  function permissionShortcut(className) {
    const control = button("", openPermission, className); control.dataset.permission = permissionState();
    control.append(node("span", "nmba-permission-dot"), node("span", "", `${t("desktop")} · ${permissionLabel()}`));
    return control;
  }
  function renderPermission() {
    const state = permissionState(), section = node("section", "nmba-permission"); section.dataset.permission = state;
    section.setAttribute("aria-label", t("desktop"));
    const heading = node("div", "nmba-permission-heading");
    const title = node("strong", "", t("desktop")), badge = node("span", "nmba-permission-badge", permissionLabel(state));
    badge.setAttribute("role", "status"); heading.append(title, badge);
    const description = node("p", "nmba-permission-description", t({ needed: permissionDismissed ? "permissionPrompt" : "permissionIntro",
      ready: "permissionReady", off: "permissionOff", blocked: "permissionBlockedHelp", unsupported: "unsupported", pending: "permissionPrompt" }[state]));
    section.append(heading, description);
    const actions = node("div", "nmba-permission-actions");
    if (state !== "unsupported") {
      const action = button(t({ needed: "allow", ready: "permissionDisable", off: "permissionEnable", blocked: "permissionCheck", pending: "permissionPending" }[state]),
        state === "blocked" ? refreshPermission : requestDesktop, "nmba-permission-action");
      action.disabled = permissionBusy; actions.append(action);
    }
    actions.append(button(t("test"), async () => { await unlockSound(); showAlert(t("testBody"), true); }, "nmba-test"));
    section.append(actions); return section;
  }
  async function requestDesktop() {
    if (mobile.matches) return;
    if (permissionBusy || ["unsupported", "blocked"].includes(permissionState())) { refreshPermission(); return; }
    let permission = Notification.permission;
    if (permission === "default") {
      permissionBusy = true; permissionDismissed = false;
      try {
        const response = Notification.requestPermission(); refreshPermission(); permission = await response;
      } catch { permission = Notification.permission; }
      finally { permissionBusy = false; }
      permissionDismissed = permission === "default";
      if (permission === "granted") change(value => { value.desktop = true; });
      refreshPermission(); return;
    }
    if (permission === "granted") change(value => { value.desktop = !value.desktop; });
    refreshPermission();
  }
  async function dispatch(since, now) {
    const send = () => {
      if (mobile.matches) return;
      config = core.settings(read(key, config));
      const ledger = readObject(ledgerKey), events = core.due(config, ledger, since, now);
      if (!events.length) return;
      for (const event of events) ledger[`${core.id(event.entry)}:${event.minute}`] = { targetAt: event.time, sentAt: now };
      for (const [key, value] of Object.entries(ledger)) if (!value || now - Number(value.sentAt) > 86400000) delete ledger[key];
      write(ledgerKey, ledger);
      const text = events.slice(0, 3).map(event => `${t(event.minute ? "dueBefore" : "dueNow", { name: nameOf(event.entry), n: event.minute })}\n${serverOf(event.entry)}`).join("\n\n") +
        (events.length > 3 ? `\n${t("more", { n: events.length - 3 })}` : "");
      showAlert(text);
    };
    if (navigator.locks?.request) {
      await navigator.locks.request("notmeter-boss-alert-dispatch", { ifAvailable: true }, lock => { if (lock) send(); });
    } else {
      const leaseKey = key + "-lease", lease = read(leaseKey, {});
      if (lease.id !== tabId && Number(lease.until) > now) return;
      write(leaseKey, { id: tabId, until: now + 2500 });
      await new Promise(resolve => setTimeout(resolve, 80));
      if (read(leaseKey, {}).id === tabId) send();
    }
  }
  function scheduleWork() {
    if (mobile.matches || !config.entries.length) { clearInterval(ticker); ticker = 0; return; }
    if (ticker) return;
    ticker = setInterval(tick, 1000);
    void refresh();
  }
  async function tick() {
    if (mobile.matches) { lastCheck = Date.now(); return; }
    syncLocale();
    if (lastLocale !== locale) { message = ""; renderSignature = ""; render(); renderEntry(); syncButtons(); }
    const order = ordered().map(item => `${core.id(item.entry)}:${item.time}`).join("|");
    if (order !== orderSignature) { orderSignature = order; renderSignature = ""; }
    render();
    updateClocks();
    if (!config.entries.length || checking) { lastCheck = Date.now(); return; }
    checking = true;
    try {
      await ensureCatalogs();
      const now = Date.now(), since = lastCheck; lastCheck = now;
      try { sessionStorage.setItem(key + "-checked", String(now)); } catch {}
      if (config.enabled) await dispatch(since, now);
      void refresh();
    } catch { message = t("loading"); render(); }
    finally { checking = false; }
  }
  function select(entry) {
    if (mobile.matches) return;
    const valid = core.selection(entry);
    if (!valid) return;
    const itemId = core.id(valid);
    change(value => {
      const index = value.entries.findIndex(item => core.id(item) === itemId);
      if (index >= 0) value.entries.splice(index, 1);
      else { updateNames(valid); value.entries.push(valid); value.hidden = false; expanded = true; }
      if (!value.entries.length) value.enabled = false;
    });
    void unlockSound();
    if (snapshots.has(core.cacheGroup(valid))) receiveCache(valid.service, valid.region, snapshots.get(core.cacheGroup(valid)));
    void refresh();
  }
  function createButton(entry) {
    const valid = core.selection(entry);
    const control = button("", () => select(entry), "nmba-watch");
    if (!valid) { control.disabled = true; return control; }
    const existing = config.entries.find(item => core.id(item) === core.id(valid));
    if (existing && !mobile.matches) {
      const before = JSON.stringify([existing.names, existing.serverNames]);
      existing.names = { ...existing.names, ...valid.names }; existing.serverNames = { ...existing.serverNames, ...valid.serverNames };
      if (before !== JSON.stringify([existing.names, existing.serverNames])) { write(key, config); renderSignature = ""; }
    }
    control.dataset.bossWatch = core.id(valid); control.dataset.bossName = nameOf(valid);
    control.append(bell(), node("span")); updateButton(control); return control;
  }
  function updateButton(control) {
    const selected = config.entries.some(entry => core.id(entry) === control.dataset.bossWatch);
    control.setAttribute("aria-pressed", String(selected)); control.setAttribute("aria-label", `${t(selected ? "remove" : "add")}: ${control.dataset.bossName}`);
    control.querySelector("span").textContent = t(selected ? "selected" : "add");
  }
  function syncButtons() { document.querySelectorAll("[data-boss-watch]").forEach(updateButton); }
  function chooseBosses() {
    expanded = false; renderSignature = ""; render();
    const open = document.getElementById("field-boss-button");
    if (open) { open.click(); document.getElementById("field-boss-surface")?.scrollIntoView({ behavior: "smooth" }); }
    else location.href = new URL("../?view=field-boss", assets).href;
  }
  function remaining(time) {
    if (!time || time <= Date.now()) return t("waiting");
    const seconds = Math.ceil((time - Date.now()) / 1000), hours = Math.floor(seconds / 3600), minutes = Math.floor(seconds % 3600 / 60);
    return `${hours ? String(hours).padStart(2, "0") + ":" : ""}${String(minutes).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
  }
  function ordered() {
    const now = Date.now();
    return config.entries.map(entry => ({ entry, time: core.target(entry, now) }))
      .sort((a, b) => (a.time > now ? a.time : Infinity) - (b.time > now ? b.time : Infinity) || nameOf(a.entry).localeCompare(nameOf(b.entry)));
  }
  function updateClocks() {
    const items = ordered(), next = items.find(item => item.time > Date.now());
    for (const item of clockRefs) {
      const time = core.target(item.entry, Date.now());
      item.clock.textContent = remaining(time);
      item.clock.classList.toggle("is-soon", !!time && time > Date.now() && time - Date.now() <= 600000);
    }
    if (compactRefs) {
      compactRefs.title.textContent = next ? nameOf(next.entry) : t(config.entries.length ? "waiting" : "title");
      compactRefs.time.textContent = next ? remaining(next.time) : "";
      compactRefs.detail.textContent = next ? serverOf(next.entry) : t(config.entries.length ? config.enabled ? "active" : "paused" : "choose");
      compactRefs.state.textContent = t(config.enabled ? "active" : "paused");
    }
  }
  function render() {
    if (!root) return;
    syncLocale(); lastLocale = locale;
    root.hidden = mobile.matches || config.hidden;
    if (root.hidden) {
      toast?.remove(); clearTimeout(toastTimer); clockRefs = []; compactRefs = null;
      return;
    }
    if (drag) return;
    const signature = JSON.stringify([config, locale, expanded, editing, audioReady, message, permissionState(), permissionDismissed]);
    if (signature === renderSignature) return;
    const scrollTop = body?.scrollTop || 0, focused = document.activeElement?.id;
    renderSignature = signature; root.dataset.side = config.side; root.classList.toggle("is-expanded", expanded);
    root.classList.toggle("is-running", config.enabled); root.classList.toggle("is-compact", config.compact);
    root.replaceChildren(); clockRefs = []; compactRefs = null;
    const toggle = button("", () => { expanded = !expanded; renderSignature = ""; render(); }, "nmba-dock");
    toggle.setAttribute("aria-label", `${t(expanded ? "close" : "open")} · ${t("title")}`); toggle.setAttribute("aria-expanded", String(expanded));
    toggle.append(bell());
    const compact = node("span", "nmba-dock-copy"), title = node("strong"), detail = node("small"), state = node("span", "nmba-state"), time = node("span", "nmba-dock-time");
    compact.append(title, detail); toggle.append(compact, time, node("span", "nmba-chevron", expanded ? "⌄" : "⌃"));
    compactRefs = { title, detail, state, time };
    root.setAttribute("aria-label", t("title"));
    if (!expanded) {
      const dock = node("div", "nmba-dock-row"); dock.append(moveHandle(), toggle, hideButton());
      root.append(dock, permissionShortcut("nmba-permission-shortcut")); updateClocks(); placePanel();
      if (focused === "nmba-move") document.getElementById(focused)?.focus({ preventScroll: true });
      return;
    }
    const header = node("header", "nmba-header");
    const heading = node("div"); heading.append(node("strong", "", t("title")), state);
    const side = button("↺", resetPosition, "nmba-icon-button"); side.title = t("resetPosition"); side.setAttribute("aria-label", t("resetPosition"));
    const close = button("−", () => { expanded = false; renderSignature = ""; render(); }, "nmba-icon-button"); close.setAttribute("aria-label", t("close"));
    close.id = "nmba-collapse";
    header.append(moveHandle(), heading, side, close, hideButton()); root.append(header);
    body = node("div", "nmba-body");
    body.append(renderPermission());
    const items = ordered(), next = items.find(item => item.time > Date.now());
    if (next) {
      const lead = node("div", "nmba-next");
      const top = node("div", "nmba-next-top"); top.append(node("span", "", t("next")), node("span", "", serverOf(next.entry)));
      const countdown = node("strong", "nmba-next-time"); clockRefs.push({ entry: next.entry, clock: countdown });
      lead.append(top, countdown, node("strong", "nmba-next-name", nameOf(next.entry)));
      const stamp = new Intl.DateTimeFormat(locale, { weekday: "short", hour: "2-digit", minute: "2-digit" }).format(next.time);
      lead.append(node("small", "", `${t("timezone")} · ${stamp} · ${t(core.scheduleFor(next.entry) ? "scheduled" : "reported")}`)); body.append(lead);
    }
    if (!items.length) body.append(node("p", "nmba-empty", t("empty")));
    const list = node("ul", "nmba-list");
    for (const { entry } of items) {
      const row = node("li"), copy = node("div", "nmba-item-copy"), clock = node("strong", "nmba-item-time");
      copy.append(node("strong", "", nameOf(entry)), node("small", "", serverOf(entry)));
      clockRefs.push({ entry, clock });
      const remove = button("×", () => select(entry), "nmba-icon-button"); remove.setAttribute("aria-label", `${t("remove")}: ${nameOf(entry)}`);
      row.append(copy, clock, remove); list.append(row);
    }
    body.append(list);
    const actions = node("div", "nmba-actions");
    const power = button(t(config.enabled ? "pause" : "start"), async () => {
      lastCheck = Date.now(); await unlockSound(); change(value => { value.enabled = !value.enabled; }); void refresh();
    }, "nmba-primary"); power.disabled = !items.length; if (power.disabled) power.title = t("noSelection");
    actions.append(power, button(t("choose"), chooseBosses)); body.append(actions);
    const details = node("details", "nmba-settings"); details.open = editing;
    const summary = node("summary", "", t("manage")); details.append(summary);
    details.addEventListener("toggle", () => { editing = details.open; });
    details.append(node("span", "nmba-label", t("panelSize")));
    const sizes = node("div", "nmba-sizes"); sizes.setAttribute("role", "group"); sizes.setAttribute("aria-label", t("panelSize"));
    for (const compact of [true, false]) {
      const choice = button(t(compact ? "sizeCompact" : "sizeStandard"), () => change(value => { value.compact = compact; }));
      choice.id = compact ? "nmba-size-compact" : "nmba-size-standard"; choice.setAttribute("aria-pressed", String(config.compact === compact)); sizes.append(choice);
    }
    details.append(sizes, node("p", "nmba-help", t("moveHelp")));
    details.append(button(t("hidePanel"), hidePanel), node("p", "nmba-help", t("hideHelp")));
    details.append(node("span", "nmba-label", t("timing")));
    const timings = node("div", "nmba-timings"); timings.setAttribute("role", "group"); timings.setAttribute("aria-label", t("timing"));
    for (const minute of [10, 5, 1, 0]) {
      const choice = button(t(minute ? "before" : "spawn", { n: minute }), () => change(value => {
        if (value.minutes.includes(minute)) { if (value.minutes.length > 1) value.minutes = value.minutes.filter(item => item !== minute); }
        else value.minutes.push(minute);
      })); choice.setAttribute("aria-pressed", String(config.minutes.includes(minute))); timings.append(choice);
    }
    details.append(timings);
    const sound = node("label", "nmba-setting-row"), soundCheck = node("input"); soundCheck.type = "checkbox"; soundCheck.checked = config.sound;
    soundCheck.id = "nmba-sound-enabled";
    soundCheck.addEventListener("change", () => { stopSound(); change(value => { value.sound = soundCheck.checked; }); if (config.sound) void unlockSound(); });
    sound.append(node("span", "", t("sound")), soundCheck); details.append(sound);
    const soundLabel = node("label", "nmba-label", t("soundChoice")); soundLabel.htmlFor = "nmba-sound-choice";
    const soundRow = node("div", "nmba-sound-picker"), soundChoice = node("select"); soundChoice.id = "nmba-sound-choice";
    for (const id of Object.keys(core.sounds)) {
      const option = node("option", "", t("sound_" + id)); option.value = id; soundChoice.append(option);
    }
    soundChoice.value = config.soundId;
    soundChoice.addEventListener("change", () => { stopSound(); change(value => { value.soundId = soundChoice.value; }); });
    const preview = button("", previewSound, "nmba-sound-preview"); preview.id = "nmba-sound-preview"; preview.disabled = config.volume <= 0;
    soundRow.append(soundChoice, preview); details.append(soundLabel, soundRow);
    const volumeRow = node("label", "nmba-volume"), volume = node("input"), output = node("output", "", `${Math.round(config.volume * 100)}%`);
    volume.id = "nmba-sound-volume";
    volume.type = "range"; volume.min = "0"; volume.max = "100"; volume.step = "5"; volume.value = String(config.volume * 100); volume.setAttribute("aria-label", t("volume"));
    volume.addEventListener("input", () => { output.textContent = `${volume.value}%`; });
    volume.addEventListener("change", () => { stopSound(); change(value => { value.volume = Number(volume.value) / 100; }); });
    volumeRow.append(node("span", "", t("volume")), volume, output); details.append(volumeRow);
    details.append(node("p", "nmba-sound-help", t(config.volume <= 0 ? "soundMuted" : "soundPreviewHelp")));
    body.append(details);
    if (config.sound && config.enabled && !audioReady) body.append(button(t("audioUnlock"), () => unlockSound(), "nmba-audio-unlock"));
    if (message) body.append(node("p", "nmba-hint", message));
    body.append(node("p", "nmba-help", t("help")), node("small", "nmba-saved", storageAvailable ? t("saved") : t("sessionOnly")));
    root.append(body); updateClocks(); updatePreview(); placePanel(); body.scrollTop = scrollTop;
    if (["nmba-move", "nmba-size-compact", "nmba-size-standard", "nmba-sound-enabled", "nmba-sound-choice", "nmba-sound-preview", "nmba-sound-volume"].includes(focused))
      document.getElementById(focused)?.focus({ preventScroll: true });
  }
  function renderEntry() {
    const host = document.getElementById("field-boss-alert-entry"); if (!host) return;
    host.hidden = mobile.matches;
    if (mobile.matches) return;
    host.replaceChildren(); const copy = node("div"); copy.append(node("strong", "", t("title")), node("span", "", t(config.hidden ? "hiddenStatus" : "setup")));
    const open = button(t(config.hidden ? "showPanel" : "manage"), openPermission); open.id = "nmba-entry-open";
    const actions = node("div", "nmba-entry-actions"); actions.append(permissionShortcut("nmba-entry-permission"), open);
    host.append(bell(), copy, actions);
  }
  function init() {
    syncLocale();
    root = node("aside", "nmba"); root.setAttribute("aria-label", t("title")); document.body.append(root);
    new ResizeObserver(queuePosition).observe(root);
    globalThis.addEventListener("resize", () => { finishDrag(); queuePosition(); });
    render(); renderEntry(); syncButtons(); scheduleWork();
    try { const previous = Number(sessionStorage.getItem(key + "-checked")); if (previous > Date.now() - 90000 && previous <= Date.now()) lastCheck = previous; } catch {}
    const observer = new MutationObserver(() => { syncLocale(); renderSignature = ""; render(); renderEntry(); syncButtons(); });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
    globalThis.addEventListener("storage", event => {
      if (event.key === key) {
        const next = core.settings(read(key, {}));
        if (next.sound !== config.sound || next.soundId !== config.soundId || next.volume !== config.volume) stopSound();
        config = next; refreshPermission(); syncButtons(); scheduleWork(); void refresh();
      }
      if (event.key === "notmeter-stats-locale") { syncLocale(); renderSignature = ""; render(); renderEntry(); }
    });
    document.addEventListener("click", () => { if (config.enabled && config.sound && !audioReady) void unlockSound(); }, { passive: true });
    document.addEventListener("visibilitychange", () => { void tick(); });
    globalThis.addEventListener("focus", refreshPermission);
    if (globalThis.Notification && navigator.permissions?.query) {
      navigator.permissions.query({ name: "notifications" }).then(status => status.addEventListener("change", refreshPermission)).catch(() => {});
    }
    if (!mobile.matches) void ensureCatalogs().then(() => { config.entries.forEach(updateNames); renderSignature = ""; render(); }).catch(() => {});
    mobile.addEventListener("change", () => {
      lastCheck = Date.now(); renderSignature = "";
      if (mobile.matches) {
        stopSound();
        toast?.remove(); clearTimeout(toastTimer);
        if (audio?.state === "running") void audio.suspend().catch(() => {});
      }
      render(); renderEntry(); scheduleWork();
    });
  }
  globalThis.NotMeterBossAlerts = { createButton, receiveCache };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true }); else init();
})();
