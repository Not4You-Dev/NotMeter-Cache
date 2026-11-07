(() => {
  "use strict";
  const core = globalThis.NotMeterPetMapCore;
  const copy = globalThis.NotMeterPetMapCopy;
  const $ = id => document.getElementById(id);
  const local = ["127.0.0.1", "localhost"].includes(location.hostname);
  const base = new URL(local ? "/_petdata/" : "https://not4you-dev.github.io/NotMeter-Pet/", location.href);
  const savedKey = "notmeter-pet-map-v1";
  let locale = new URL(location.href).searchParams.get("lang") || globalThis.NotMeterI18n?.read() || "en";
  if (!copy[locale]) locale = "en";
  let manifest, pets = new Map(), map, image, snapshot = null, selected = null, outside = false;
  const listControls = $("list-controls");
  const filters = { level: "all", species: "all" };
  const mapKey = "notmeter-pet-map-view-v1";
  let outsidePets = [], mapCounts = new Map();
  let view = { x: 0, y: 0, width: 1, height: 1 }, autoFit = true;
  let width = 0, height = 0, zoom = 1, panX = 0, panY = 0, pendingFrame = 0, loadSerial = 0;
  let dragging = null, suppressClick = false, touchDistance = 0;
  const pointers = new Map();
  const iconCache = new Map(), spriteCache = new Map();
  let pageActive = true, loadingImage;
  let drawPoints = [], projectedPoints = [], landmarks = [], popupKey = "";
  const t = (key, values = {}) => Object.entries(values).reduce((s, [k, v]) => s.replaceAll(`{${k}}`, String(v)), copy[locale]?.[key] || copy.en[key] || key);
  const name = obj => core.name(obj.names, locale);
  const asset = path => {
    if (typeof path !== "string" || !path || path.includes("..") || /^[a-z]+:|^[/\\]/i.test(path)) throw new Error("Invalid asset path");
    const url = new URL(path, base);
    if (url.origin !== base.origin || !url.pathname.startsWith(base.pathname)) throw new Error("Invalid asset origin");
    return url.href;
  };
  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  const button = (className, text, action) => {
    const node = el("button", className, text); node.type = "button"; node.addEventListener("click", action); return node;
  };
  const picture = (pet, size = 40) => {
    const img = el("img", "pm-ic"); img.src = asset(pet.icon); img.alt = ""; img.width = size; img.height = size; img.loading = "lazy"; img.draggable = false; return img;
  };
  function levelLabel(state) { return !state.known ? t("unknown") : state.max ? t("max") : state.level === 0 ? t("unowned") : t("level", { level: state.level }); }
  function progressLabel(state) { return !state.known ? "— / —" : state.max ? "MAX" : `${state.souls.toLocaleString(locale)} / ${state.required.toLocaleString(locale)}`; }
  function sourceLabel(source) {
    const kinds = { field: "sourceField", dungeon: "sourceDungeon", shop: "sourceShop", chest: "sourceChest", shopChest: "sourceShopChest" };
    const detail = source.names ? name(source) : "";
    return detail ? `${t(kinds[source.kind] || "sources")} · ${detail}` : t(kinds[source.kind] || "sources");
  }
  function sources(pet) { return pet.sources?.length ? [...new Set(pet.sources.map(sourceLabel))] : [t("sourceUnknown")]; }
  function translate() {
    document.documentElement.lang = locale;
    document.title = `${t("title")} · NotMeter`;
    document.querySelectorAll("[data-copy]").forEach(node => { node.textContent = t(node.dataset.copy); });
    $("pet-code").placeholder = t("importPlaceholder");
    $("search").placeholder = t("search"); $("search").setAttribute("aria-label", t("search"));
    $("map").setAttribute("aria-label", t("mapLabel"));
    for (const [id, key] of [["zoom-in", "zoomIn"], ["zoom-out", "zoomOut"], ["reset-map", "resetMap"]]) { $(id).title = t(key); $(id).setAttribute("aria-label", t(key)); }
    $("guide-large").alt = t("guideAlt");
    $("import-close").setAttribute("aria-label", t("close"));
    $("guide-image-open").title = t("guideEnlarge");
    $("language").value = locale;
    if (manifest) { spriteCache.clear(); closePopup(); renderLandmarks(); renderTabs(); renderList(); updateSnapshot(); schedule(); }
  }
  function validateManifest(data) {
    if (data?.version !== 1 || data.region !== "WW" || !Array.isArray(data.petCatalog) || !data.petCatalog.length || !Array.isArray(data.maps) || !data.maps.length) throw new Error("Invalid map catalog");
    const ids = new Set();
    for (const pet of data.petCatalog) {
      if (!Number.isSafeInteger(pet.id) || ids.has(pet.id) || !pet.names?.en || !Number.isInteger(pet.maxLevel) || !Array.isArray(pet.required) || pet.required.length < pet.maxLevel || !pet.required.slice(0, pet.maxLevel).every(x => Number.isSafeInteger(x) && x > 0)) throw new Error("Invalid pet catalog");
      asset(pet.icon); ids.add(pet.id);
    }
    for (const item of data.maps) {
      if (!item.names?.en || !(item.width > 0 && item.height > 0) || !Array.isArray(item.spawns) || !Array.isArray(item.obelisks)) throw new Error("Invalid map");
      asset(item.image);
      for (const point of [...item.spawns, ...item.obelisks]) if (![point.x, point.y].every(x => Number.isFinite(x) && x >= 0 && x <= 1) || (point.petId && !ids.has(point.petId))) throw new Error("Invalid position");
    }
    return data;
  }
  async function loadCatalog() {
    $("map-status").hidden = false; $("map-status").textContent = t("mapLoading");
    try {
      const response = await fetch(asset("manifest.json?v=20261102-4"), { credentials: "omit", signal: AbortSignal.timeout(20000) });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      manifest = validateManifest(await response.json());
      pets = new Map(manifest.petCatalog.map(pet => [pet.id, pet]));
      try {
        const saved = localStorage.getItem(savedKey);
        if (saved) { snapshot = core.decode(saved, manifest.petCatalog); $("remember").checked = true; }
      } catch { snapshot = null; }
      const mappedIds = new Set(manifest.maps.flatMap(item => item.spawns.map(point => point.petId)));
      outsidePets = manifest.petCatalog.filter(pet => !mappedIds.has(pet.id));
      mapCounts = new Map(manifest.maps.map(item => [item.id, new Set(item.spawns.map(point => point.petId)).size]));
      $("landmark-icon").src = asset(manifest.maps[0].kibeliskIcon || manifest.maps[0].obelisks[0]?.icon || manifest.maps[0].image);
      let savedMap;
      try { savedMap = localStorage.getItem(mapKey); } catch {}
      updateSnapshot();
      if (savedMap === "other") selectOutside();
      else await selectMap(manifest.maps.find(item => String(item.id) === savedMap) || manifest.maps[0]);
    } catch {
      $("map-status").replaceChildren(el("span", "", t("mapError")), button("", t("retry"), loadCatalog));
    }
  }
  function renderTabs() {
    const tab = (label, count, active, action) => {
      const node = button(active ? "on" : "", undefined, action);
      node.append(el("span", "", label), el("small", "mono", count.toLocaleString(locale)));
      node.setAttribute("role", "tab");
      node.setAttribute("aria-selected", String(active));
      return node;
    };
    const tabs = manifest.maps.map(item => tab(name(item), mapCounts.get(item.id), !outside && map?.id === item.id, () => {
      if (outside || map?.id !== item.id) selectMap(item);
    }));
    tabs.push(tab(t("outsideMaps"), outsidePets.length, outside, () => { if (!outside) selectOutside(); }));
    $("map-tabs").replaceChildren(...tabs);
  }
  function rememberMap(value) {
    try { localStorage.setItem(mapKey, value); } catch {}
  }
  function selectOutside() {
    outside = true; selected = null;
    rememberMap("other");
    $("map-body").hidden = true; $("outside-info").hidden = false; $("landmark-toggle").hidden = true;
    $("outside-heading").append(listControls);
    $("search").classList.add("outside-search");
    renderTabs(); renderList();
  }
  let spawnCounts = new Map(), fieldBosses = new Set();
  function selectMap(item) {
    map = item; outside = false; selected = null; image = null;
    rememberMap(String(item.id));
    spawnCounts = new Map(); fieldBosses = new Set();
    for (const point of item.spawns) {
      spawnCounts.set(point.petId, (spawnCounts.get(point.petId) || 0) + 1);
      if (point.fieldBoss) fieldBosses.add(point.petId);
    }
    document.querySelector(".pet-list-panel").prepend(listControls);
    $("search").classList.remove("outside-search");
    $("map-body").hidden = false; $("outside-info").hidden = true; $("landmark-toggle").hidden = false;
    closePopup(); renderLandmarks();
    $("map-status").hidden = false; $("map-status").textContent = t("mapLoading");
    renderTabs(); renderList(); reset();
    loadMapImage(item);
  }
  function loadMapImage(item) {
    if (!pageActive) return;
    const serial = ++loadSerial;
    const nextImage = loadingImage = new Image();
    nextImage.onload = () => { if (serial !== loadSerial) return; loadingImage = null; image = nextImage; $("map-status").hidden = true; schedule(); };
    nextImage.onerror = () => { if (serial !== loadSerial) return; loadingImage = null; $("map-status").replaceChildren(el("span", "", t("mapError")), button("", t("retry"), () => selectMap(item))); };
    nextImage.src = asset(item.image);
  }
  function visiblePets() {
    const query = $("search").value.trim().toLocaleLowerCase(locale);
    const pool = outside ? outsidePets : Array.from(spawnCounts.keys(), id => pets.get(id));
    return pool.filter(pet => core.matches(pet, snapshot, filters.level, filters.species) &&
      (!query || [name(pet), pet.names.en].some(label => label.toLocaleLowerCase(locale).includes(query))))
      .sort((a, b) => name(a).localeCompare(name(b), locale));
  }
  function progressAmount(pet, state) {
    const amount = el("span", "pm-row-p");
    if (pet.crystal) amount.append(picture({ icon: pet.crystal }, 12));
    amount.append(el("span", "mono", progressLabel(state)));
    return amount;
  }
  function progressTrack(state) {
    const track = el("span", "pm-track"), fill = el("i");
    fill.style.width = `${state.ratio * 100}%`;
    track.append(fill);
    return track;
  }
  function progressDetail(pet, state) {
    const block = el("div", "pm-pop-prog"), line = el("div");
    if (pet.crystal) line.append(picture({ icon: pet.crystal }, 14));
    line.append(el("b", "mono", progressLabel(state)), el("small", "", t("remaining", {
      count: Math.max(0, state.required - state.souls).toLocaleString(locale),
    })));
    block.append(line, progressTrack(state));
    return block;
  }
  function renderList() {
    if (!manifest) return;
    const list = visiblePets();
    const filtered = $("search").value.trim() || filters.level !== "all" || filters.species !== "all";
    const empty = filtered || !snapshot ? t("noResults") : t("noTargets");
    closePopup();
    if (outside) { renderSources(list, empty); return; }
    const allowed = new Set(list.map(pet => pet.id));
    drawPoints = map.spawns.filter(point => allowed.has(point.petId));
    const withCount = (key, value) => {
      const [before, after] = t(key, { count: "{count}" }).split("{count}");
      return [before, el("b", "mono", value.toLocaleString(locale)), after ?? ""];
    };
    $("list-count").replaceChildren(...withCount("results", list.length), " · ", ...withCount("locations", drawPoints.length));
    $("map-name").textContent = name(map);
    const rows = list.map(pet => {
      const state = core.status(pet, snapshot);
      const row = button(`pm-row pet-row${selected === pet.id ? " on" : ""}`, undefined, () => selectPet(pet.id));
      row.setAttribute("aria-pressed", String(selected === pet.id));
      row.dataset.petId = String(pet.id);
      const body = el("span", "pm-row-b"), title = el("span", "pm-row-t"), sub = el("span", "pm-row-s pet-sub");
      const label = el("b", "", name(pet)); label.title = name(pet); title.append(label);
      if (fieldBosses.has(pet.id)) title.append(el("em", "pm-boss", t("fieldBoss")));
      sub.append(el("span", "", levelLabel(state)), state.known ? progressAmount(pet, state) :
        el("span", "mono dim", t("pointCount", { count: spawnCounts.get(pet.id).toLocaleString(locale) })));
      body.append(title, sub);
      if (state.known) body.append(progressTrack(state));
      row.append(picture(pet), body);
      return row;
    });
    $("pet-list").replaceChildren(...(rows.length ? rows : [el("p", "pm-empty", empty)]));
    if (selected && !allowed.has(selected)) selected = null;
    syncSelection();
  }
  function renderSources(list, empty) {
    const cards = list.map(pet => {
      const state = core.status(pet, snapshot), card = el("article", "pm-src source-card"), head = el("div", "pm-src-hd"), title = el("div");
      title.append(el("b", "", name(pet)), el("span", "", levelLabel(state)));
      head.append(picture(pet, 48), title); card.append(head);
      if (state.known) card.append(progressDetail(pet, state));
      const routes = el("ul");
      routes.append(...sources(pet).map(label => el("li", "", label)));
      card.append(routes);
      return card;
    });
    $("source-grid").replaceChildren(...(cards.length ? cards : [el("div", "empty wide", empty)]));
  }
  function selectPet(id) {
    if (outside || !drawPoints.some(point => point.petId === id)) return;
    selected = selected === id ? null : id;
    syncSelection();
  }
  function clearSelection() {
    selected = null;
    syncSelection();
  }
  function syncSelection() {
    closePopup();
    if (!selected || outside) { $("focus-canvas").hidden = true; $("focus-canvas").width = 1; $("focus-canvas").height = 1; }
    $("pet-list").querySelectorAll("[data-pet-id]").forEach(row => {
      const active = Number(row.dataset.petId) === selected;
      row.classList.toggle("on", active);
      row.setAttribute("aria-pressed", String(active));
    });
    $("selection-bar").hidden = !selected || outside;
    $("selection-name").textContent = selected ? t("selectionActive", { name: name(pets.get(selected)) }) : "";
    if (selected) {
      const pet = pets.get(selected), state = core.status(pet, snapshot);
      $("selection-icon").src = asset(pet.icon);
      const amount = state.known ? progressLabel(state) : t("locations", { count: spawnCounts.get(selected).toLocaleString(locale) });
      $("selection-detail").textContent = [levelLabel(state), amount, sources(pet)[0]].join(" · ");
    }
    $("clear-selection").title = t("selectionHint");
    $("empty-progress").hidden = !!snapshot || outside || !!selected;
    schedule();
  }
  function measureView() {
    view = { x: 0, y: 0, width, height };
  }
  function scale() { return map ? Math.min(view.width / map.width, view.height / map.height) : 1; }
  function project(x, y) { const s = scale() * zoom; return [view.x + view.width / 2 + panX + (x - .5) * map.width * s, view.y + view.height / 2 + panY + (y - .5) * map.height * s]; }
  function schedule() { if (pageActive && !pendingFrame) pendingFrame = requestAnimationFrame(draw); }
  function releaseCanvas(canvas) { canvas.width = canvas.height = 1; }
  function clearSprites() {
    for (const { canvas } of spriteCache.values()) releaseCanvas(canvas);
    spriteCache.clear();
  }
  window.addEventListener("pagehide", () => {
    pageActive = false;
    cancelAnimationFrame(pendingFrame);
    pendingFrame = 0;
    loadSerial++;
    if (loadingImage) loadingImage.onload = loadingImage.onerror = null;
    loadingImage = image = null;
    for (const icon of iconCache.values()) icon.onload = null;
    iconCache.clear();
    clearSprites();
    releaseCanvas($("map-canvas"));
    releaseCanvas($("focus-canvas"));
  });
  window.addEventListener("pageshow", event => {
    pageActive = true;
    if (event.persisted && map && !outside) loadMapImage(map);
  });
  function iconFor(pet) {
    let icon = iconCache.get(pet.id);
    if (!icon) {
      icon = new Image(); icon.decoding = "async";
      icon.onload = () => { schedule(); };
      icon.src = asset(pet.icon); iconCache.set(pet.id, icon);
    }
    return icon;
  }
  function spriteFor(pet, size, fieldBoss, focused = false) {
    const ratio = Math.min(devicePixelRatio || 1, 2);
    const key = `${pet.id}:${fieldBoss}:${focused}`;
    const existing = spriteCache.get(key);
    const icon = iconFor(pet);
    const loaded = icon.complete && icon.naturalWidth > 0;
    if (existing?.size === size && existing.ratio === ratio && existing.loaded === loaded) return existing;
    if (existing) releaseCanvas(existing.canvas);
    const w = size + (focused ? 12 : 3);
    const canvas = document.createElement("canvas"), ctx = canvas.getContext("2d");
    canvas.width = canvas.height = Math.ceil(w * ratio);
    ctx.scale(ratio, ratio);
    const center = w / 2;
    function circle(radius, color) {
      ctx.beginPath();
      ctx.arc(center, center, radius, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
    }
    if (focused) {
      circle(size / 2 + 6, "oklch(0.74 0.13 28 / .28)");
      circle(size / 2 + 2.5, "oklch(0.74 0.13 28)");
    }
    circle(size / 2 + 1.5, fieldBoss ? "#f0c977" : "rgba(12,18,26,.82)");
    if (loaded) {
      circle(size / 2, "#1a2330");
      ctx.clip();
      ctx.drawImage(icon, center - size / 2, center - size / 2, size, size);
    }
    const sprite = { canvas, size, ratio, w, h: w, loaded };
    spriteCache.set(key, sprite);
    return sprite;
  }
  function drawProgressLabels(ctx, size) {
    ctx.font = '600 11.5px "JetBrains Mono", monospace';
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    const labels = new Map();
    for (const item of projectedPoints) {
      const id = item.point.petId;
      if (labels.has(id)) continue;
      const state = core.status(pets.get(id), snapshot);
      const text = t("levelShort", { level: state.level }) + " " + progressLabel(state);
      labels.set(id, state.known ? { text, width: Math.ceil(ctx.measureText(text).width) + 12 } : null);
    }
    const cellWidth = Math.max(0, ...Array.from(labels.values(), label => label?.width || 0)) + 6;
    const cellHeight = 24;
    const placed = new Map();
    for (const item of projectedPoints) {
      const label = labels.get(item.point.petId);
      if (!label) continue;
      const left = item.x - label.width / 2, top = item.y - size / 2 - 20;
      if (left < 4 || left + label.width > width - 4 || top < 4 || item.y > height - 4) continue;
      const col = Math.floor(item.x / cellWidth), row = Math.floor(top / cellHeight);
      let overlaps = false;
      for (let i = col - 1; i <= col + 1 && !overlaps; i++) {
        for (let j = row - 1; j <= row + 1 && !overlaps; j++) {
          overlaps = placed.get(i + ":" + j)?.some(point =>
            Math.abs(point.x - item.x) < (point.width + label.width) / 2 + 6 &&
            Math.abs(point.top - top) < cellHeight) ?? false;
        }
      }
      if (overlaps) continue;
      ctx.beginPath(); ctx.roundRect(left, top, label.width, 18, 5);
      ctx.fillStyle = "rgba(12,18,26,.88)"; ctx.fill();
      ctx.fillStyle = "#e9edf2"; ctx.fillText(label.text, item.x, top + 9);
      const key = col + ":" + row;
      if (!placed.has(key)) placed.set(key, []);
      placed.get(key).push({ x: item.x, top, width: label.width });
    }
  }
  function drawSelectionLabels(ctx, focused, pet) {
    const state = core.status(pet, snapshot);
    const title = name(pet);
    const detail = state.known ? levelLabel(state) + " · " + progressLabel(state) : levelLabel(state);
    const titleFont = '600 13px "Pretendard Variable", sans-serif';
    const detailFont = '600 11.5px "JetBrains Mono", monospace';
    ctx.font = titleFont;
    const titleWidth = ctx.measureText(title).width;
    ctx.font = detailFont;
    const bounds = { x: 8, y: 8, width: width - 16, height: height - 16 };
    const labelWidth = Math.min(bounds.width, Math.ceil(Math.max(titleWidth, ctx.measureText(detail).width)) + 16);
    if (labelWidth <= 16) return;
    const labels = core.labelPositions(focused, labelWidth, 38, bounds);
    if (!labels.length) {
      const visible = focused.find(({ x, y }) => x >= 0 && x < width && y >= 0 && y < height);
      if (!visible) return;
      labels.push({
        x: Math.max(8, Math.min(width - labelWidth - 8, visible.x - labelWidth / 2)),
        y: Math.max(8, Math.min(height - 46, visible.y < 68 ? visible.y + 22 : visible.y - 60)),
      });
    }
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    for (const { x, y } of labels) {
      ctx.fillStyle = "#111821";
      ctx.beginPath(); ctx.roundRect(x, y, labelWidth, 38, 6); ctx.fill();
      ctx.fillStyle = "#e9edf2"; ctx.font = titleFont;
      ctx.fillText(title, x + labelWidth / 2, y + 11, labelWidth - 16);
      ctx.fillStyle = "oklch(0.8 0.14 150)"; ctx.font = detailFont;
      ctx.fillText(detail, x + labelWidth / 2, y + 26, labelWidth - 16);
      ctx.fillRect(x + 8, y + 35, labelWidth - 16, 2);
    }
  }
  function renderLandmarks() {
    if (!map) return;
    landmarks = map.obelisks.map(point => {
      const node = button("marker landmark", undefined, event => { event.stopPropagation(); if (!suppressClick) landmarkPopup(point, event); });
      const icon = el("img"); icon.src = asset(point.icon || map.kibeliskIcon || manifest.obeliskIcon); icon.alt = ""; icon.draggable = false; node.append(icon);
      node.setAttribute("aria-label", t("obelisks") + " · " + name(point));
      node.addEventListener("pointermove", event => { if (!dragging) landmarkPopup(point, event); });
      node.addEventListener("pointerleave", closePopup);
      node.addEventListener("focus", () => landmarkPopup(point));
      node.addEventListener("blur", closePopup);
      return { point, node };
    });
    $("markers").replaceChildren(...landmarks.map(item => item.node));
  }
  function draw() {
    pendingFrame = 0;
    if (!map || outside || !width || !height) return;
    const canvas = $("map-canvas"), ctx = canvas.getContext("2d");
    const ratio = Math.min(devicePixelRatio || 1, 2);
    if (canvas.width !== Math.round(width * ratio) || canvas.height !== Math.round(height * ratio)) { canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio); clearSprites(); }
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0); ctx.clearRect(0, 0, width, height);
    if (image) { const [x, y] = project(0, 0); ctx.drawImage(image, x, y, map.width * scale() * zoom, map.height * scale() * zoom); }
    projectedPoints = core.positions(drawPoints, project, width, height);
    const size = Math.max(16, Math.min(32, 10 + zoom * 3.2));
    const sprites = new Map();
    for (const { point } of projectedPoints) {
      const key = point.petId + ":" + !!point.fieldBoss;
      if (!sprites.has(key)) sprites.set(key, spriteFor(pets.get(point.petId), size, !!point.fieldBoss));
    }
    ctx.globalAlpha = selected ? .28 : 1;
    for (const item of projectedPoints) {
      if (selected === item.point.petId) continue;
      const sprite = sprites.get(item.point.petId + ":" + !!item.point.fieldBoss);
      if (sprite) ctx.drawImage(sprite.canvas, item.x - sprite.w / 2, item.y - sprite.h / 2, sprite.w, sprite.h);
    }
    ctx.globalAlpha = 1;
    if (selected) {
      const focus = $("focus-canvas"), foreground = focus.getContext("2d");
      if (focus.width !== canvas.width || focus.height !== canvas.height) { focus.width = canvas.width; focus.height = canvas.height; }
      focus.hidden = false; foreground.setTransform(ratio, 0, 0, ratio, 0, 0); foreground.clearRect(0, 0, width, height);
      const sizeFocused = Math.max(26, size + 8);
      const pet = pets.get(selected), sprite = spriteFor(pet, sizeFocused, false, true);
      const focused = projectedPoints.filter(item => item.point.petId === selected);
      if (sprite) for (const item of focused) {
        foreground.drawImage(sprite.canvas, item.x - sprite.w / 2, item.y - sprite.h / 2, sprite.w, sprite.h);
      }
      drawSelectionLabels(foreground, focused, pet);
    } else if (snapshot) {
      drawProgressLabels(ctx, size);
    }
    for (const { point, node } of landmarks) {
      const [x, y] = project(point.x, point.y);
      node.hidden = !$("obelisks").checked || x < -20 || y < -20 || x > width + 20 || y > height + 20;
      node.style.left = x + "px"; node.style.top = y + "px";
      const size = Math.max(18, Math.min(28, 14 + zoom * 2));
      node.style.width = node.style.height = size + "px";
    }
  }
  function closePopup() { popupKey = ""; $("map-popup").hidden = true; $("map").classList.remove("over-pet"); }
  function positionPopup(x, y) {
    const popup = $("map-popup");
    popup.style.left = "8px"; popup.style.top = "8px"; popup.hidden = false;
    const w = popup.offsetWidth, h = popup.offsetHeight;
    popup.style.left = Math.max(8, Math.min(width - w - 8, x + 20 + w > width ? x - w - 20 : x + 20)) + "px";
    popup.style.top = Math.max(8, Math.min(height - h - 8, y - 40)) + "px";
  }
  function landmarkPopup(point, event) {
    const key = "k:" + point.id;
    if (popupKey !== key || $("map-popup").hidden) {
      popupKey = key;
      $("map-popup").replaceChildren(el("b", "", name(point)), el("span", "pm-pop-k", t("landmarkHint")));
    }
    const rect = $("map").getBoundingClientRect();
    positionPopup(...(event ? [event.clientX - rect.left, event.clientY - rect.top] : project(point.x, point.y)));
  }
  function showPopup(items, x, y, bosses = new Set()) {
    const key = items.map(pet => pet.id + ":" + bosses.has(pet.id)).join(":");
    if (popupKey !== key || $("map-popup").hidden) {
      popupKey = key;
      const nodes = items.slice(0, 3).map(pet => {
        const state = core.status(pet, snapshot), block = el("div", "pm-pop-pet");
        const head = el("div", "pm-pop-hd"), body = el("div"), status = el("span", "", levelLabel(state));
        if (bosses.has(pet.id)) status.append(el("em", "pm-boss", t("fieldBoss")));
        body.append(el("b", "", name(pet)), status);
        head.append(picture(pet), body);
        block.append(head);
        if (state.known) block.append(progressDetail(pet, state));
        block.append(el("p", "pm-pop-src", sources(pet).join(" / ")));
        return block;
      });
      if (items.length > 3) nodes.push(el("p", "pm-pop-more", t("morePets", { count: items.length - 3 })));
      $("map-popup").replaceChildren(...nodes);
    }
    positionPopup(x, y);
  }
  function hitPet(x, y) {
    if (selected) {
      let focused = null, distance = 20;
      for (const item of projectedPoints) if (item.point.petId === selected) {
        const d = Math.hypot(item.x - x, item.y - y);
        if (d < distance) { focused = item; distance = d; }
      }
      return focused;
    }
    let closest = null, distance = 19;
    for (const item of projectedPoints) {
      const d = Math.hypot(item.x - x, item.y - y);
      if (d < distance) { closest = item; distance = d; }
    }
    return closest;
  }
  function hoverPet(event) {
    if (event.target.closest("button")) return;
    const rect = $("map").getBoundingClientRect(), hit = hitPet(event.clientX - rect.left, event.clientY - rect.top);
    $("map").classList.toggle("over-pet", !!hit);
    if (hit) {
      const points = projectedPoints.filter(p => Math.hypot(p.x - hit.x, p.y - hit.y) < 1);
      const ids = new Set(points.map(p => p.point.petId)), bosses = new Set(points.filter(p => p.point.fieldBoss).map(p => p.point.petId));
      showPopup([...ids].map(id => pets.get(id)), event.clientX - rect.left, event.clientY - rect.top, bosses);
    } else closePopup();
  }
  function reset() {
    autoFit = true;
    zoom = 1; panX = 0; panY = 0;
    measureView();
    if (map && width && height) {
      const points = [...map.spawns, ...map.obelisks];
      if (points.length) {
        const xs = points.map(p => p.x), ys = points.map(p => p.y);
        const x1 = Math.min(...xs), x2 = Math.max(...xs), y1 = Math.min(...ys), y2 = Math.max(...ys);
        const fit = scale();
        zoom = Math.max(.5, Math.min(10, (view.width - 60) / (Math.max(.08, x2 - x1) * map.width * fit), (view.height - 60) / (Math.max(.08, y2 - y1) * map.height * fit)));
        panX = -((x1 + x2) / 2 - .5) * map.width * fit * zoom;
        panY = -((y1 + y2) / 2 - .5) * map.height * fit * zoom;
      }
    }
    schedule();
  }
  function zoomAt(x, y, factor) {
    autoFit = false;
    closePopup();
    const next = Math.max(.5, Math.min(16, zoom * factor)), applied = next / zoom;
    const centerX = view.x + view.width / 2, centerY = view.y + view.height / 2;
    panX = x - centerX - (x - centerX - panX) * applied;
    panY = y - centerY - (y - centerY - panY) * applied; zoom = next; schedule();
  }
  function syncFilters() {
    $("level-group").classList.toggle("off", !snapshot);
    $("level-group").title = snapshot ? "" : t("missingBody");
    for (const [key, value] of Object.entries(filters)) {
      for (const node of $(key + "-filter").querySelectorAll("button")) {
        const active = node.dataset.filter === value;
        node.classList.toggle("on", active);
        node.setAttribute("aria-pressed", String(active));
        node.disabled = key === "level" && !snapshot;
      }
    }
  }
  function updateSnapshot() {
    syncFilters();
    $("clear").hidden = !snapshot;
    $("empty-progress").hidden = !!snapshot || outside || !!selected;
    $("data-status").hidden = !snapshot;
    $("import-open").classList.toggle("ghost", !!snapshot);
    $("import-open").textContent = t(snapshot?.sample ? "sampleReplace" : snapshot ? "reimport" : "openImport");
    document.querySelectorAll("[data-pet-sample]").forEach(node => { node.disabled = !manifest; });
    if (!snapshot) return;
    const totals = { max: 0, progress: 0, unowned: 0 };
    for (const pet of manifest.petCatalog) {
      const state = core.status(pet, snapshot);
      totals[state.max ? "max" : state.level ? "progress" : "unowned"]++;
    }
    $("data-status").querySelectorAll(".pm-sum-bar i").forEach((bar, index) => { bar.style.flex = Object.values(totals)[index]; });
    for (const [key, value] of Object.entries(totals)) $("total-" + key).textContent = value.toLocaleString(locale);
    const time = snapshot.sample ? t("sampleData") : t("updated", { time: new Intl.DateTimeFormat(locale, {
      month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit",
    }).format(new Date(snapshot.capturedAt)) });
    $("total-note").textContent = time + " · " + t("snapshotReminder");
  }
  function saveCode(code) {
    try {
      if (code) localStorage.setItem(savedKey, code);
      else localStorage.removeItem(savedKey);
    } catch { $("remember").checked = false; }
  }
  function applySnapshot(next, code) {
    const wasSample = !!snapshot?.sample;
    snapshot = next; selected = null;
    filters.level = "all"; filters.species = "all"; $("search").value = "";
    if (!next?.sample && !(!next && wasSample)) {
      $("remember").checked = !!code;
      saveCode(code);
    }
    updateSnapshot(); renderList(); reset();
    $("pet-code").value = "";
    if ($("import-dialog").open) $("import-dialog").close();
  }
  function showSample() {
    if (!manifest) return;
    let seed = 7;
    const random = () => (seed = seed * 16807 % 2147483647) / 2147483647;
    const progress = new Map(manifest.petCatalog.map(pet => {
      const draw = random();
      const level = Math.min(pet.maxLevel, draw < .32 ? pet.maxLevel : draw < .55 ? 0 : draw < .8 ? 1 : 2);
      return [pet.id, { level, souls: level >= pet.maxLevel ? 0 : Math.floor(random() * pet.required[level]) }];
    }));
    applySnapshot({ sample: true, progress }, null);
  }
  $("import-form").addEventListener("submit", event => {
    event.preventDefault();
    if (!manifest) return;
    try {
      const code = $("pet-code").value.trim();
      applySnapshot(core.decode(code, manifest.petCatalog), $("remember").checked ? code : null);
    } catch (error) {
      $("import-status").textContent = t(Object.hasOwn(copy.en, error.message) ? error.message : "invalidCode");
      $("import-status").hidden = false; $("pet-code").classList.add("err");
    }
  });
  $("clear").addEventListener("click", () => applySnapshot(null, null));
  $("remember").addEventListener("change", () => {
    if (snapshot?.sample) return;
    if (!$("remember").checked) saveCode(null);
    else if (snapshot && !snapshot.sample) {
      const data = { v: 1, region: "WW", capturedAt: snapshot.capturedAt, pets: [...snapshot.progress].map(([id, p]) => [id, p.level, p.souls]) };
      const bytes = new TextEncoder().encode(JSON.stringify(data));
      saveCode("NMP1." + btoa(String.fromCharCode(...bytes)).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", ""));
    }
  });
  for (const key of Object.keys(filters)) {
    $(key + "-filter").addEventListener("click", event => {
      const node = event.target.closest("button[data-filter]");
      if (!node || node.disabled || filters[key] === node.dataset.filter) return;
      filters[key] = node.dataset.filter; selected = null; syncFilters(); renderList();
    });
  }
  $("search").addEventListener("input", () => { selected = null; renderList(); });
  $("clear-selection").addEventListener("click", () => { clearSelection(); $("map").focus({ preventScroll: true }); });
  $("obelisks").addEventListener("change", schedule);
  $("reset-map").addEventListener("click", () => { clearSelection(); reset(); });
  $("zoom-in").addEventListener("click", () => zoomAt(width / 2, height / 2, 1.5));
  $("zoom-out").addEventListener("click", () => zoomAt(width / 2, height / 2, 1 / 1.5));
  $("map").addEventListener("wheel", event => { if (outside) return; closePopup(); event.preventDefault(); const rect = $("map").getBoundingClientRect(); zoomAt(event.clientX - rect.left, event.clientY - rect.top, Math.exp(-event.deltaY * .002)); }, { passive: false });
  $("map").addEventListener("pointerdown", event => {
    suppressClick = false;
    if (event.button !== 0 || event.target.closest("button")) return;
    autoFit = false;
    closePopup(); event.preventDefault();
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    dragging = { x: event.clientX, y: event.clientY, startX: event.clientX, startY: event.clientY };
    suppressClick = false; $("map").setPointerCapture(event.pointerId); $("map").classList.add("dragging");
    if (pointers.size === 2) { const [a, b] = [...pointers.values()]; touchDistance = Math.hypot(a.x - b.x, a.y - b.y); }
  });
  $("map").addEventListener("pointermove", event => {
    if (!pointers.has(event.pointerId) || !dragging) { if (event.pointerType !== "touch") hoverPet(event); return; }
    closePopup();
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (pointers.size === 2) {
      const [a, b] = [...pointers.values()], distance = Math.hypot(a.x - b.x, a.y - b.y), rect = $("map").getBoundingClientRect();
      if (touchDistance > 0) zoomAt((a.x + b.x) / 2 - rect.left, (a.y + b.y) / 2 - rect.top, distance / touchDistance);
      touchDistance = distance; suppressClick = true;
    } else {
      panX += event.clientX - dragging.x; panY += event.clientY - dragging.y;
      if (Math.hypot(event.clientX - dragging.startX, event.clientY - dragging.startY) > 4) suppressClick = true;
      schedule();
    }
    dragging.x = event.clientX; dragging.y = event.clientY;
  });
  function stopPointer(event) { pointers.delete(event.pointerId); if (!pointers.size) { dragging = null; $("map").classList.remove("dragging"); } else { const p = [...pointers.values()][0]; dragging = { ...p, startX: p.x, startY: p.y }; } touchDistance = 0; }
  $("map").addEventListener("pointerup", stopPointer); $("map").addEventListener("pointercancel", stopPointer);
  $("map").addEventListener("lostpointercapture", stopPointer);
  $("map").addEventListener("keydown", event => {
    if (event.target !== $("map")) return;
    const moves = { ArrowLeft: [60, 0], ArrowRight: [-60, 0], ArrowUp: [0, 60], ArrowDown: [0, -60] };
    if (moves[event.key]) { autoFit = false; closePopup(); event.preventDefault(); panX += moves[event.key][0]; panY += moves[event.key][1]; schedule(); }
    else if (["+", "=", "-"].includes(event.key)) { event.preventDefault(); zoomAt(view.x + view.width / 2, view.y + view.height / 2, event.key === "-" ? 1 / 1.5 : 1.5); }
    else if (event.key === "Escape") closePopup();
  });
  $("map").addEventListener("click", event => {
    if (suppressClick || event.target.closest("button")) return;
    const rect = $("map").getBoundingClientRect(), hit = hitPet(event.clientX - rect.left, event.clientY - rect.top);
    if (hit) selectPet(hit.point.petId); else clearSelection();
  });
  document.addEventListener("keydown", event => {
    if (event.key !== "Escape" || !selected || document.querySelector("dialog[open]") || event.target.closest("input,textarea,select,[contenteditable=true]")) return;
    event.preventDefault(); clearSelection();
  });
  $("map").addEventListener("pointerleave", closePopup);
  $("map").addEventListener("dragstart", event => event.preventDefault());
  new ResizeObserver(entries => { const rect = entries[0].contentRect; if (!rect.width || !rect.height) return; width = rect.width; height = rect.height; if (autoFit) reset(); else { measureView(); schedule(); } }).observe($("map"));
  function updateCodeInput() {
    $("import-apply").disabled = !manifest || !$("pet-code").value.trim();
    $("import-status").hidden = true;
    $("pet-code").classList.remove("err");
  }
  function openImport() {
    closePopup();
    $("pet-code").value = "";
    updateCodeInput();
    $("import-dialog").showModal();
  }
  document.querySelectorAll("[data-open-import], [data-open-guide]").forEach(node => node.addEventListener("click", openImport));
  document.querySelectorAll("[data-pet-sample]").forEach(node => node.addEventListener("click", showSample));
  $("pet-code").addEventListener("input", updateCodeInput);
  $("import-close").addEventListener("click", () => $("import-dialog").close());
  $("import-dialog").addEventListener("click", event => { if (event.target === $("import-dialog")) {
    const rect = event.target.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) event.target.close();
  } });
  $("guide-image-open").addEventListener("click", () => {
    $("guide-large").src = `./assets/pet-map-guide-${locale}.png`;
    $("guide-dialog").showModal();
  });
  $("guide-dialog-close").addEventListener("click", () => $("guide-dialog").close());
  const languageNames = { ko: "한국어", en: "English", "zh-TW": "繁體中文", "ja-JP": "日本語", "de-DE": "Deutsch", "fr-FR": "Français", "es-ES": "Español", "pt-BR": "Português", "ru-RU": "Русский", vi: "Tiếng Việt", th: "ไทย" };
  for (const [code, label] of Object.entries(languageNames)) { const option = el("option", "", label); option.value = code; $("language").append(option); }
  $("language").addEventListener("change", () => { locale = $("language").value; globalThis.NotMeterI18n?.save(locale); const url = new URL(location.href); url.searchParams.set("lang", locale); history.replaceState(null, "", url); translate(); });
  translate(); loadCatalog();
})();
