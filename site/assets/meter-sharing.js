(() => {
  "use strict";
  const jobs = ["검성","수호성","살성","궁성","마도성","정령성","치유성","호법성","권성"];
  const pageSize = 20, storageKey = "notmeter-shared-meter-likes-v1";
  const state = { entries: null, manifest: null, locale: "ko", job: "", region: "", search: "", sort: "likes", scene: "combat", page: 1 };
  const documents = new Map(), votes = new Map(), sceneOverrides = new Map();
  let format = {}, root, grid, status, count, pagination, filters, controls, pending, checked = false, renderToken = 0;
  let thumbnails = null, thumbnailObserver = null, urls = new Set(), modal = null, likes = null;
  const cache = () => globalThis.NotMeterCharacterSettings;
  const c = () => globalThis.NotMeterSharingCopy[state.locale] || globalThis.NotMeterSharingCopy.en;
  const text = (key, values = {}) => Object.entries(values).reduce((s,[k,v]) => s.replaceAll(`{${k}}`,v), c()[key] || key);
  const node = (tag, value, className) => {
    const el = document.createElement(tag); if (value !== undefined) el.textContent = value;
    if (className) el.className = className; return el;
  };
  const identity = entry => `${entry.region}:${entry.serverId}:${entry.characterId}`;
  function serverInfo(entry) {
    if (entry.region !== "WW") return {label:format.serverLabel?.(entry.serverId) || String(entry.serverId),globalRegion:""};
    for (const world of globalThis.NotMeterGlobalFieldBossCatalog?.serviceRegions || []) {
      const server = world.servers.find(server => server.id === entry.serverId);
      if (!server) continue;
      const label = names => names[state.locale] || names.en;
      return {label:`${label(world.names)} · ${label(server.names)}`,globalRegion:world.key};
    }
    return {label:String(entry.serverId),globalRegion:""};
  }
  const creatorChannels = new Map([
    ["KR:1001:sGRa94iGhTg4WN-TNJIdgS-Q1gcyFVV-3IW-c7E7Zxc=", "https://www.youtube.com/@%EC%95%84%EC%9D%B4%EC%98%A8%EC%97%B0%EA%B5%AC%EC%86%8C"]
  ]);
  function creatorLink(entry) {
    const url = creatorChannels.get(identity(entry));
    if (!url) return null;
    const link = node("a",undefined,"meter-sharing-creator");
    link.href = url; link.target = "_blank"; link.rel = "noopener noreferrer";
    link.title = text("creatorOpen",{name:entry.characterName}); link.setAttribute("aria-label",link.title);
    const play = icon("play");
    const arrow = node("span","↗"); arrow.setAttribute("aria-hidden","true");
    link.append(play,node("span",text("creator")),arrow); return link;
  }
  function icon(kind) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg","svg");
    svg.setAttribute("viewBox","0 0 24 24"); svg.setAttribute("aria-hidden","true");
    const path = document.createElementNS(svg.namespaceURI,"path");
    path.setAttribute("d", kind === "heart" ? "M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z" : kind === "refresh" ? "M20 7v5h-5M4 17v-5h5M6.1 6a8 8 0 0 1 13.2 3M4.7 15a8 8 0 0 0 13.2 3" : kind === "play" ? "m9 6 9 6-9 6Z" : "m6 6 12 12M6 18 18 6");
    svg.append(path); return svg;
  }
  function button(label, action, className) {
    const b = node("button",label,className); b.type = "button"; b.onclick = action; return b;
  }
  async function pool(items, action, concurrency = 4) {
    let i = 0; const values = new Array(items.length);
    await Promise.all(Array.from({length: Math.min(concurrency,items.length)}, async () => {
      for (;;) { const n = i++; if (n >= items.length) return; values[n] = await action(items[n],n); }
    })); return values;
  }
  function validEntry(row, generatedAt) {
    return row && ["KR","TW","WW"].includes(row.region) && Number.isSafeInteger(row.serverId) && row.serverId > 0 &&
      /^[A-Za-z0-9_+/=-]{12,256}$/.test(row.characterId) && typeof row.characterName === "string" && row.characterName.length > 0 && row.characterName.length <= 64 &&
      Number.isSafeInteger(row.updatedAt) && row.updatedAt > 0 && row.updatedAt <= generatedAt &&
      (row.job == null || row.job === "" || jobs.includes(row.job)) &&
      (row.likes == null || Number.isSafeInteger(row.likes) && row.likes >= 0) &&
      row.file && /^[a-f0-9]{64}$/.test(row.file.sha256) && row.file.path === `entries/${row.file.sha256}.json.gz` &&
      Number.isSafeInteger(row.file.size) && row.file.size > 0 && row.file.size <= 1048576;
  }
  async function loadList() {
    return cache().readSnapshot(async (manifest,read) => {
    if (manifest.schema !== "notmeter-settings-cache-v1" || !/^[a-f0-9]{32}$/.test(manifest.generation) ||
        !Number.isSafeInteger(manifest.generatedAt) || manifest.generatedAt > Date.now()/1000+60 ||
        !Number.isSafeInteger(manifest.count) || manifest.count < 0 || manifest.count > 100000 ||
        !Array.isArray(manifest.files) || manifest.files.length > 768 ||
        manifest.catalog != null && (!Array.isArray(manifest.catalog) || manifest.catalog.length > 200)) throw Error("Invalid gallery manifest");
    if (state.manifest && manifest.generatedAt < state.manifest.generatedAt) throw Error("Older gallery");
    const list = manifest.catalog || manifest.files;
    const parts = await pool(list, async file => {
      if (!(manifest.catalog ? /^catalog\/[0-9]{4}\.json\.gz$/ : /^(kr|tw|ww)\/[a-f0-9]{2}\.json\.gz$/).test(file?.path)) throw Error("Invalid gallery index");
      const data = await read(file);
      if (!data.entries || manifest.catalog && !Array.isArray(data.entries)) throw Error("Invalid gallery index");
      return Object.values(data.entries);
    });
    const entries = parts.flat(), seen = new Set();
    if (entries.length !== manifest.count) throw Error("Incomplete gallery");
    for (const row of entries) {
      const key = identity(row);
      if (!validEntry(row,manifest.generatedAt) || seen.has(key)) throw Error("Invalid gallery identity");
      seen.add(key); row.likes ??= 0; row.job ??= "";
    }
    if (!manifest.catalog) {
      try {
        const response = await fetch("./assets/meter-sharing-legacy.json",{credentials:"omit",signal:AbortSignal.timeout(5000)});
        if (response.ok) {
          const legacy = await response.json();
          for (const row of entries) {
            const job = legacy[identity(row)]?.[row.file.sha256];
            if (jobs.includes(job)) row.job = job;
          }
        }
      } catch {}
    }
    return {entries,manifest};
    });
  }
  async function refresh(force = false) {
    if (pending || checked && !force) return pending;
    status.textContent = text("loading"); root.setAttribute("aria-busy","true");
    const refreshButton = root.querySelector(".meter-sharing-refresh"); refreshButton.disabled = true;
    pending = loadList().then(result => {
      state.entries = result.entries; state.manifest = result.manifest; status.textContent = state.manifest.likesEnabled ? "" : text("unavailable");
      if (force) documents.clear();
      paintFilters(); render();
    }).catch(() => {
      status.textContent = text(state.entries ? "stale" : "error");
      if (!state.entries) grid.replaceChildren(button(text("retry"),() => refresh(true),"meter-sharing-retry"));
    }).finally(() => {
      checked = true; pending = null; root.setAttribute("aria-busy","false"); refreshButton.disabled = false;
    }); return pending;
  }
  function readLikes() {
    if (likes) return likes;
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || "null");
      if (saved && /^[a-f0-9]{32}$/.test(saved.voter) && Array.isArray(saved.entries) && saved.entries.length <= 5000)
        likes = {voter:saved.voter,entries:new Set(saved.entries.filter(x => typeof x === "string" && x.length < 300))};
      else likes = {voter:crypto.randomUUID().replaceAll("-",""),entries:new Set()};
      saveLikes(); return likes;
    } catch { likes = null; return null; }
  }
  function saveLikes() { localStorage.setItem(storageKey,JSON.stringify({voter:likes.voter,entries:[...likes.entries]})); }
  function likeButton(entry) {
    const b = button("",() => like(entry),"meter-sharing-like"); b.dataset.identity = identity(entry); b.append(icon("heart"),node("span"));
    updateLikeButton(b,entry); return b;
  }
  function updateLikeButton(b,entry) {
    const vote = votes.get(identity(entry)), selected = readLikes()?.entries.has(identity(entry));
    const enabled = state.manifest?.likesEnabled === true;
    b.disabled = !enabled || !!selected || !!vote?.pending;
    b.setAttribute("aria-pressed",String(!!selected));
    b.setAttribute("aria-label", text(!enabled ? "unavailable" : selected ? "liked" : "like")); b.title = b.getAttribute("aria-label");
    b.lastElementChild.textContent = (vote?.count != null && vote.at > state.manifest.generatedAt ? vote.count : entry.likes).toLocaleString(state.locale);
  }
  function updateLikes(entry) {
    for (const b of document.querySelectorAll(".meter-sharing-like")) if (b.dataset.identity === identity(entry)) updateLikeButton(b,entry);
  }
  async function like(entry) {
    const local = readLikes(), key = identity(entry);
    if (!local || local.entries.has(key) || votes.get(key)?.pending || !state.manifest?.likesEnabled) return;
    votes.set(key,{...votes.get(key),pending:true}); updateLikes(entry);
    try {
      const endpoints = await globalThis.NotMeterControlEndpoint?.getEndpoints();
      const roots = [...new Set((endpoints || []).map(value => {
        try { const u = new URL(value); return u.protocol === "https:" && !u.username && !u.password ? u.origin : null; } catch { return null; }
      }).filter(Boolean))].slice(0,2);
      if (!roots.length) throw Error("offline");
      let reply;
      for (const origin of roots) {
        try {
          const response = await fetch(`${origin}/custom-settings/v1/like`,{method:"POST",credentials:"omit",headers:{"Content-Type":"application/json"},
            body:JSON.stringify({region:entry.region,serverId:entry.serverId,characterId:entry.characterId,voter:local.voter,liked:true}),signal:AbortSignal.timeout(10000)});
          if (response.status === 429) throw Error("rate_limited");
          if (!response.ok) throw Error("offline");
          reply = await response.json();
          if (reply.status !== "ok" || reply.liked !== true || !Number.isSafeInteger(reply.likes) || reply.likes < 1) throw Error("offline");
          break;
        } catch (error) { if (error.message === "rate_limited" || origin === roots.at(-1)) throw error; }
      }
      local.entries.add(key); saveLikes();
      votes.set(key,{pending:false,count:reply.likes,at:Date.now()/1000}); status.textContent = text("liked");
    } catch (error) {
      votes.set(key,{...votes.get(key),pending:false}); status.textContent = text(error.message === "rate_limited" ? "rateLimited" : "voteError");
    }
    updateLikes(entry);
  }
  async function documentFor(entry,signal) {
    const key = `${entry.region}:${entry.file.sha256}`;
    if (documents.has(key)) {
      const data = documents.get(key); documents.delete(key); documents.set(key,data); return {...data,...entry};
    }
    const data = await cache().loadEntry(entry,signal);
    if (signal?.aborted) throw new DOMException("Aborted","AbortError");
    documents.set(key,data); while (documents.size > 24) documents.delete(documents.keys().next().value);
    return data;
  }
  function closeModal() {
    if (!modal) return;
    cache().close(); modal.close(); modal.remove(); modal = null;
  }
  async function open(entry,trigger) {
    closeModal(); const dialog = node("dialog",undefined,"meter-sharing-dialog"), heading = node("header");
    const title = node("h2",entry.characterName); title.id = "meter-sharing-dialog-title";
    const back = button(text("close"),() => dialog.close(),"meter-sharing-close"); back.prepend(icon("close"));
    heading.append(title,likeButton(entry),back); const body = node("div",text("loading"),"meter-sharing-detail");
    const character = node("a",text("open"),"meter-sharing-character");
    const url = new URL("./",location.href); url.search = new URLSearchParams({view:"character",region:entry.region,serverId:entry.serverId,characterId:entry.characterId,name:entry.characterName,lang:state.locale}); url.hash = "notmeter-settings";
    const {globalRegion} = serverInfo(entry); if (globalRegion) url.searchParams.set("globalRegion",globalRegion);
    character.href = url.href; character.textContent = entry.characterName;
    title.replaceChildren(character);
    const creator = creatorLink(entry); if (creator) { title.classList.add("meter-sharing-name-line"); title.append(creator); }
    dialog.append(heading,body); dialog.setAttribute("aria-labelledby",title.id);
    const cancellation = new AbortController();
    dialog.addEventListener("close",() => { cancellation.abort(); if (modal === dialog) closeModal(); trigger?.focus({preventScroll:true}); },{once:true});
    cache().dismissOnBackdrop(dialog);
    document.body.append(dialog); modal = dialog; dialog.showModal(); back.focus();
    try {
      const data = await documentFor(entry,cancellation.signal); if (modal !== dialog) return;
      cache().prime(entry,data); body.replaceChildren(cache().create({identity:entry,locale:state.locale}));
    } catch { if (modal === dialog) body.replaceChildren(node("p",text("error")),button(text("retry"),() => open(entry,trigger))); }
  }
  function filtered() {
    return (state.entries || []).filter(row => (!state.job || row.job === state.job) && (!state.region || row.region === state.region) &&
      (!state.search || row.characterName.toLocaleLowerCase(state.locale).includes(state.search.toLocaleLowerCase(state.locale))))
      .sort((a,b) => (state.sort === "likes" ? b.likes-a.likes : 0) || b.updatedAt-a.updatedAt || (identity(a)<identity(b)?-1:1));
  }
  function render() {
    thumbnailObserver?.disconnect(); thumbnailObserver = null;
    thumbnails?.abort(); thumbnails = new AbortController(); const signal = thumbnails.signal, token = ++renderToken;
    for (const url of urls) URL.revokeObjectURL(url);
    urls.clear();
    const entries = filtered(), pages = Math.max(1,Math.ceil(entries.length/pageSize)); state.page = Math.min(state.page,pages);
    count.textContent = text("count",{count:entries.length.toLocaleString(state.locale)});
    pagination.replaceChildren();
    const navigate = page => { state.page = page; render(); root.querySelector(".meter-sharing-results").scrollIntoView({block:"start",behavior:"instant"}); };
    const previous = button(text("previous"),() => navigate(state.page-1)), next = button(text("next"),() => navigate(state.page+1));
    previous.disabled = state.page <= 1; next.disabled = state.page >= pages;
    const label = node("span",text("page",{page:state.page,pages})); label.setAttribute("aria-live","polite");
    pagination.append(previous,label,next); grid.replaceChildren();
    if (!entries.length) {
      const empty = node("div",undefined,"meter-sharing-empty"); empty.append(node("h3",text("empty")),node("p",text("emptyHint"))); grid.append(empty); return;
    }
    const sceneLabels = cache().copy(state.locale), visible = entries.slice((state.page-1)*pageSize,state.page*pageSize), images = [];
    for (const entry of visible) {
      const card = node("article",undefined,"meter-sharing-card"); card.dataset.job = entry.job;
      const preview = button("",() => open(entry,preview),"meter-sharing-thumbnail"); preview.setAttribute("aria-label",`${entry.characterName}: ${text("open")}`);
      const placeholder = node("span",sceneLabels.loading,"meter-sharing-placeholder"); preview.append(placeholder);
      const sceneTabs = node("div",undefined,"meter-sharing-card-scenes"); sceneTabs.setAttribute("role","group");
      sceneTabs.setAttribute("aria-label",`${entry.characterName}: ${sceneLabels.preview}`);
      let scene = sceneOverrides.get(identity(entry)) || state.scene, loaded = null, imageUrl = null, sceneToken = 0;
      const paintScene = async () => {
        if (token !== renderToken || !loaded) return;
        const selected = ++sceneToken;
        if (imageUrl) { URL.revokeObjectURL(imageUrl); urls.delete(imageUrl); imageUrl = null; }
        preview.querySelector("img")?.remove();
        const original = loaded.previews?.[scene];
        let svg = globalThis.NotMeterPreviewLocale?.render(original,state.locale) ?? original;
        if (!svg) { placeholder.textContent = sceneLabels.hidden; preview.append(placeholder); return; }
        if (globalThis.NotMeterPreviewIcons) svg = await globalThis.NotMeterPreviewIcons.restore(svg);
        if (selected !== sceneToken || token !== renderToken || signal.aborted) return;
        imageUrl = URL.createObjectURL(new Blob([svg],{type:"image/svg+xml"})); urls.add(imageUrl);
        const img = node("img"); img.alt = `${entry.characterName} · ${sceneLabels[scene]}`; img.draggable = false;
        img.onload = () => { if (token === renderToken && img.isConnected) placeholder.remove(); };
        img.onerror = () => { if (img.isConnected) { placeholder.textContent = sceneLabels.error; preview.append(placeholder); img.remove(); } };
        img.src = imageUrl; preview.prepend(img);
      };
      for (const key of ["idle","combat","assist"]) {
        const b = button(sceneLabels[key],() => {
          scene = key; sceneOverrides.set(identity(entry),scene);
          while (sceneOverrides.size > 200) sceneOverrides.delete(sceneOverrides.keys().next().value);
          for (const child of sceneTabs.children) child.setAttribute("aria-pressed",String(child === b));
          paintScene();
        });
        b.setAttribute("aria-pressed",String(scene === key)); sceneTabs.append(b);
      }
      const info = node("div",undefined,"meter-sharing-card-info"), avatar = node("span",undefined,"meter-sharing-job-icon");
      if (jobs.includes(entry.job)) { const img = node("img"); img.src = `./assets/jobs/${encodeURIComponent(entry.job)}.png`; img.alt = ""; avatar.append(img); }
      const names = node("div",undefined,"meter-sharing-names"), nameLine = node("div",undefined,"meter-sharing-name-line");
      nameLine.append(node("h3",entry.characterName)); const creator = creatorLink(entry); if (creator) nameLine.append(creator);
      names.append(nameLine,node("p",`${format.jobName?.(entry.job) || text("unknown")} · ${entry.region === "WW" ? "Global" : entry.region} · ${serverInfo(entry).label}`));
      info.append(avatar,names,likeButton(entry));
      const footer = node("footer"); const date = node("time",`${sceneLabels.updated} ${new Date(entry.updatedAt*1000).toLocaleDateString(state.locale)}`); date.dateTime = new Date(entry.updatedAt*1000).toISOString();
      footer.append(date,button(text("open"),() => open(entry,preview),"meter-sharing-open"));
      card.append(sceneTabs,preview,info,footer); grid.append(card);
      images.push({card,entry,placeholder,show(data) { loaded = data; return paintScene(); }});
    }
    const waiting = new Map(images.map(item => [item.card,item])), queue = [];
    let active = 0;
    const drain = () => {
      while (active < 3 && queue.length && !signal.aborted) {
        const {entry,placeholder,show} = queue.shift(); active++;
        void documentFor(entry,signal).then(data => {
          if (token === renderToken && !signal.aborted) return show(data);
        }).catch(() => {
          if (token === renderToken && !signal.aborted) placeholder.textContent = sceneLabels.error;
        }).finally(() => { active--; drain(); });
      }
    };
    if (typeof IntersectionObserver === "function") {
      thumbnailObserver = new IntersectionObserver(changes => {
        for (const change of changes) {
          if (!change.isIntersecting || !waiting.has(change.target)) continue;
          queue.push(waiting.get(change.target)); waiting.delete(change.target);
          thumbnailObserver?.unobserve(change.target);
        }
        drain();
      },{rootMargin:"160px 0px"});
      for (const item of images) thumbnailObserver.observe(item.card);
    } else { queue.push(...images); waiting.clear(); drain(); }
  }
  function paintFilters() {
    filters.replaceChildren();
    for (const job of ["",...jobs]) {
      const b = button("",() => { state.job = job; state.page = 1; paintFilters(); render(); },"meter-sharing-job");
      if (job) { const img = node("img"); img.src = `./assets/jobs/${encodeURIComponent(job)}.png`; img.alt = ""; b.append(img); }
      b.append(node("span",job ? format.jobName?.(job) || job : text("all")),node("small",String((state.entries || []).filter(row => !job || row.job === job).length)));
      b.setAttribute("aria-pressed",String(state.job === job)); filters.append(b);
    }
  }
  function build() {
    root = document.getElementById("meter-sharing-root"); root.replaceChildren();
    const heading = node("header",undefined,"meter-sharing-heading"), title = node("div"); title.append(node("h2",text("title")),node("p",text("description")));
    heading.append(title);
    const share = globalThis.NotMeterSettingsShareGuide.create(state.locale,{gallery:true});
    filters = node("div",undefined,"meter-sharing-jobs"); filters.setAttribute("role","group"); filters.setAttribute("aria-label",text("all"));
    controls = node("div",undefined,"meter-sharing-controls");
    const search = node("input"); search.type = "search"; search.maxLength = 64; search.placeholder = text("search"); search.setAttribute("aria-label",text("search")); search.value = state.search;
    let timer; search.oninput = () => { clearTimeout(timer); timer = setTimeout(() => { state.search = search.value.trim(); state.page = 1; render(); },200); };
    const select = (label,options,value,change) => {
      const field = node("select"); field.setAttribute("aria-label",label);
      for (const [key,title] of options) { const option = node("option",title); option.value = key; field.append(option); }
      field.value = value; field.onchange = () => { change(field.value); state.page = 1; render(); }; return field;
    };
    const region = select(text("region"),[["",text("region")],["KR","KR"],["TW","TW"],["WW","Global"]],state.region,value => state.region = value);
    const order = select(text("likes"),[["likes",text("likes")],["recent",text("recent")]],state.sort,value => state.sort = value);
    const refreshButton = button(text("refresh"),() => refresh(true),"meter-sharing-refresh"); refreshButton.prepend(icon("refresh"));
    controls.append(search,region,order,refreshButton);
    const results = node("div",undefined,"meter-sharing-results"); count = node("strong"); const scenes = node("div",undefined,"meter-sharing-scenes"); scenes.setAttribute("role","group");
    const labels = cache().copy(state.locale); scenes.setAttribute("aria-label",labels.preview);
    for (const scene of ["idle","combat","assist"]) {
      const b = button(labels[scene],() => { state.scene = scene; sceneOverrides.clear(); for (const child of scenes.children) child.setAttribute("aria-pressed",String(child === b)); render(); });
      b.setAttribute("aria-pressed",String(state.scene === scene)); scenes.append(b);
    }
    results.append(count,scenes); status = node("p",undefined,"meter-sharing-status"); status.setAttribute("role","status");
    grid = node("div",undefined,"meter-sharing-grid"); pagination = node("nav",undefined,"meter-sharing-pagination"); pagination.setAttribute("aria-label",text("page",{page:"",pages:""}));
    root.append(heading,share,filters,controls,results,status,grid,pagination,node("p",text("note"),"meter-sharing-note"));
    paintFilters(); if (state.entries) { render(); status.textContent = state.manifest?.likesEnabled ? "" : text("unavailable"); }
    else status.textContent = text(checked ? "error" : "loading");
  }
  globalThis.NotMeterSharing = Object.freeze({
    activate(options = {}) {
      format = {...format,...options}; const locale = options.locale || state.locale, changed = locale !== state.locale; state.locale = locale;
      if (!root || changed) { closeModal(); build(); }
      else { paintFilters(); if (thumbnails?.signal.aborted && state.entries) render(); }
      void refresh();
    },
    close() { closeModal(); thumbnailObserver?.disconnect(); thumbnails?.abort(); },
    pageText(locale) { const value = globalThis.NotMeterSharingCopy[locale] || globalThis.NotMeterSharingCopy.en; return {title:value.title,subtitle:value.description}; }
  });
})();
