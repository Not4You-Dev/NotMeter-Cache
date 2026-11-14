(() => {
  "use strict";
  const pinKey = "nm-fbx-pins-v2", lastKey = "nm-fbx-last-server", scopeKey = "nm-fbx-search-scope";
  const memory = new Map();
  const read = (key, fallback = {}) => {
    if (memory.has(key)) return memory.get(key);
    try {
      const value = JSON.parse(localStorage.getItem(key));
      return value && typeof value === "object" && !Array.isArray(value) ? value : fallback;
    } catch { return fallback; }
  };
  const write = (key, value) => {
    try { localStorage.setItem(key, JSON.stringify(value)); memory.delete(key); }
    catch { memory.set(key, value); }
  };
  const old = key => { try { return localStorage.getItem(key); } catch { return null; } };
  const defaultPins = { KR: ["이스라펠", "지켈"], TW: ["希埃爾", "伊斯拉佩爾"], GL: ["Siel", "Israphel"] };
  const groupKey = key => key === "kr" || key === "tw" ? key.toUpperCase() : key === "as" ? "GL" : "GL:" + key;
  const worlds = () => globalThis.NotMeterGlobalFieldBossCatalog.serviceRegions;
  const isKey = key => ["kr", "tw"].includes(key) || worlds().some(world => world.key === key);
  function servers(key, locale) {
    if (key === "kr") return globalThis.NotMeterHomepage.koreanServers(locale).map(server => ({
      ...server, value: globalThis.NotMeterServerName(server.id, "ko") || server.name,
      aliases: ["ko", "en", "zh-TW"].map(lang => globalThis.NotMeterServerName(server.id, lang)),
    }));
    if (key === "tw") return [...new Set(globalThis.NotMeterTaiwanAbyssPairs.flatMap(pair => [pair[1], pair[3]]))].sort((a, b) => a - b).map(id => {
      const value = globalThis.NotMeterServerName(id, "zh-TW");
      const name = globalThis.NotMeterServerName(id, locale) || value;
      return { id, name, value, aliases: ["ko", "en", "zh-TW"].map(lang => globalThis.NotMeterServerName(id, lang)) };
    }).filter(server => server.name);
    return (worlds().find(world => world.key === key)?.servers || []).map(server => ({
      id: server.id, name: server.names[locale] || server.names.en, value: server.names.en, aliases: Object.values(server.names),
    }));
  }
  function pins(key, list) {
    const group = groupKey(key), saved = read(pinKey)[group];
    const defaults = defaultPins[group] || [];
    const valid = values => [...new Set(values.filter(value => list.some(server => server.value === value)))];
    if (!Array.isArray(saved)) return valid(defaults);
    const filtered = valid(saved);
    return filtered.length === saved.length ? filtered : valid([...filtered, ...defaults]);
  }
  function preferred(key, id) {
    const list = servers(key, "ko");
    const group = groupKey(key);
    const legacy = Number(old(group === "KR" || group === "TW" ? "notmeter-field-boss-server-id-" + group : "notmeter-global-field-server-" + key));
    return (list.find(server => server.id === Number(id)) ||
      list.find(server => server.value === read(lastKey)[group]) ||
      list.find(server => server.id === legacy) ||
      list.find(server => server.value === pins(key, list)[0]) || list[0])?.id;
  }
  function remember(key, id) {
    const server = servers(key, "ko").find(item => item.id === id);
    if (!server) return;
    const values = read(lastKey), group = groupKey(key);
    if (values[group] !== server.value) write(lastKey, { ...values, [group]: server.value });
  }
  function scope() {
    const saved = read(scopeKey, null);
    if (!saved || !isKey(saved.key)) return null;
    return { key: saved.key, id: servers(saved.key, "ko").some(server => server.id === saved.id) ? saved.id : 0 };
  }
  function setScope(key, id) {
    const current = scope(), next = { key, id: Number(id) || 0 };
    if (current?.key === next.key && current.id === next.id) return;
    write(scopeKey, next);
    document.dispatchEvent(new CustomEvent("notmeter:field-boss-scope", { detail: next }));
  }
  const copy = {
    ko: ["서버 이름 검색", "고정한 서버", "전체 서버", "일치하는 서버가 없습니다", "지우기", "현재", "고정", "고정 해제", "★ 를 누르면 다음부터 한 번에", "갱신 중", "화면 갱신"],
    en: ["Search servers", "Pinned servers", "All servers", "No matching servers", "Clear", "Current", "Pin", "Unpin", "★ pins a server for quick access", "Updating", "View updated"],
    "zh-TW": ["搜尋伺服器名稱", "已釘選伺服器", "所有伺服器", "找不到相符的伺服器", "清除", "目前", "釘選", "取消釘選", "按 ★ 釘選伺服器", "更新中", "畫面更新"],
    "ja-JP": ["サーバー名を検索", "固定したサーバー", "全サーバー", "一致するサーバーがありません", "消去", "現在", "固定", "固定解除", "★ でサーバーを固定", "更新中", "表示更新"],
    "de-DE": ["Server suchen", "Angeheftete Server", "Alle Server", "Keine passenden Server", "Löschen", "Aktuell", "Anheften", "Lösen", "★ heftet den Server an", "Wird aktualisiert", "Ansicht aktualisiert"],
    "fr-FR": ["Rechercher un serveur", "Serveurs épinglés", "Tous les serveurs", "Aucun serveur trouvé", "Effacer", "Actuel", "Épingler", "Désépingler", "★ épingle le serveur", "Actualisation", "Vue actualisée"],
    "es-ES": ["Buscar servidor", "Servidores fijados", "Todos los servidores", "No hay servidores coincidentes", "Borrar", "Actual", "Fijar", "Desfijar", "★ fija el servidor", "Actualizando", "Vista actualizada"],
    "pt-BR": ["Buscar servidor", "Servidores fixados", "Todos os servidores", "Nenhum servidor encontrado", "Limpar", "Atual", "Fixar", "Desafixar", "★ fixa o servidor", "Atualizando", "Visualização atualizada"],
    "ru-RU": ["Поиск сервера", "Закреплённые серверы", "Все серверы", "Серверы не найдены", "Очистить", "Текущий", "Закрепить", "Открепить", "★ закрепляет сервер", "Обновление", "Вид обновлён"],
    vi: ["Tìm máy chủ", "Máy chủ đã ghim", "Tất cả máy chủ", "Không tìm thấy máy chủ", "Xóa", "Hiện tại", "Ghim", "Bỏ ghim", "★ để ghim máy chủ", "Đang cập nhật", "Đã cập nhật hiển thị"],
    th: ["ค้นหาเซิร์ฟเวอร์", "เซิร์ฟเวอร์ที่ปักหมุด", "เซิร์ฟเวอร์ทั้งหมด", "ไม่พบเซิร์ฟเวอร์ที่ตรงกัน", "ล้าง", "ปัจจุบัน", "ปักหมุด", "เลิกปักหมุด", "กด ★ เพื่อปักหมุด", "กำลังอัปเดต", "อัปเดตหน้าจอ"],
  };
  const node = (tag, cls, text) => {
    const el = document.createElement(tag);
    el.className = cls;
    if (text !== undefined) el.textContent = text;
    return el;
  };
  const button = (cls, text, action) => {
    const el = node("button", cls, text);
    el.type = "button"; el.addEventListener("click", action);
    return el;
  };
  const normalize = value => String(value ?? "").normalize("NFC").trim().toLowerCase();
  const initials = value => Array.from(String(value ?? ""), character => {
    const code = character.charCodeAt(0) - 0xac00;
    return code >= 0 && code < 11172 ? "ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ"[Math.floor(code / 588)] : character;
  }).join("");
  function mount(host, onPick) {
    let key, id, lang, list = [], words = copy.en, rows = [], cursor = -1;
    const prefix = host.id;
    const wrap = node("div", "fbx-sv"), chips = node("div", "fbx-chips");
    const trigger = button("fbx-sv-trigger", "", () => open(pop.hidden));
    trigger.id = prefix + "-trigger";
    const name = node("span", "fbx-sv-name"), arrow = node("span", "caret");
    trigger.append(name, arrow);
    trigger.setAttribute("aria-controls", prefix + "-pop");
    trigger.setAttribute("aria-haspopup", "dialog");
    trigger.setAttribute("aria-expanded", "false");
    const pop = node("div", "fbx-sv-pop"); pop.id = prefix + "-pop"; pop.hidden = true;
    pop.setAttribute("role", "dialog");
    const search = node("div", "fbx-sv-search"), glass = node("span", "glass");
    const input = node("input", "");
    input.type = "text"; input.autocomplete = "off"; input.spellcheck = false;
    input.setAttribute("role", "combobox");
    input.setAttribute("aria-autocomplete", "list");
    input.setAttribute("aria-expanded", "false");
    input.setAttribute("aria-controls", prefix + "-list");
    const shortcut = node("kbd", "", "/");
    const clear = button("fbx-sv-clear", "", () => { input.value = ""; render(); input.focus(); });
    search.append(glass, input, clear, shortcut);
    const options = node("div", "fbx-sv-list"); options.id = prefix + "-list"; options.setAttribute("role", "listbox");
    const foot = node("div", "fbx-sv-foot"), hint = node("span", "hint");
    foot.append(...["↑↓", "Enter", "Esc"].map(text => node("span", "", text)), hint);
    pop.append(search, options, foot); wrap.append(trigger, chips, pop); host.replaceChildren(wrap);
    const choose = server => { open(false, true); onPick(server.id); };
    function renderChips() {
      const current = list.find(server => server.id === id);
      name.textContent = current?.name || "—";
      const pinned = pins(key, list).map(value => list.find(server => server.value === value));
      chips.replaceChildren(...pinned.filter(server => server.id !== id).slice(0, 3).map(server =>
        button("fbx-chip", server.name, () => choose(server))));
    }
    function position() {
      if (pop.hidden) return;
      const rect = wrap.getBoundingClientRect();
      pop.style.left = Math.min(0, innerWidth - 14 - rect.left - pop.offsetWidth) + "px";
      const below = innerHeight - rect.bottom, above = rect.top;
      const up = below < pop.offsetHeight + 16 && above > below;
      pop.classList.toggle("is-above", up);
      options.style.maxHeight = Math.max(74, Math.min(252, (up ? above : below) - 118)) + "px";
    }
    function move(index, scroll = false) {
      cursor = rows.length ? Math.max(0, Math.min(rows.length - 1, index)) : -1;
      rows.forEach((row, i) => row.classList.toggle("cur", i === cursor));
      if (cursor < 0) input.removeAttribute("aria-activedescendant");
      else {
        input.setAttribute("aria-activedescendant", rows[cursor].id);
        if (scroll) rows[cursor].scrollIntoView({ block: "nearest" });
      }
    }
    function render(preferredId) {
      const query = normalize(input.value), pinned = pins(key, list);
      clear.hidden = !input.value; shortcut.hidden = !clear.hidden;
      const matching = list.filter(server => [server.name, ...server.aliases].some(value =>
        normalize(value).includes(query) || normalize(initials(value)).includes(query)));
      rows = []; options.replaceChildren();
      for (const isPinned of [true, false]) {
        const matches = matching.filter(server => pinned.includes(server.value) === isPinned);
        if (!matches.length) continue;
        const section = node("div", "fbx-sv-sec", words[isPinned ? 1 : 2]);
        section.append(node("small", "", String(matches.length))); options.append(section);
        for (const server of matches) {
          const selected = server.id === id, row = node("div", "fbx-sv-row" + (selected ? " on" : ""));
          row.id = prefix + "-option-" + server.id; row.setAttribute("role", "option");
          row.dataset.serverId = String(server.id);
          row.setAttribute("aria-selected", String(selected));
          const tick = node("span", "tick", "✓"); tick.setAttribute("aria-hidden", "true");
          const index = rows.length;
          row.append(tick, node("b", "", server.name));
          if (selected) row.append(node("em", "", words[5]));
          const star = button("star" + (isPinned ? " on" : ""), isPinned ? "★" : "☆", event => {
            event.stopPropagation();
            const next = isPinned ? pinned.filter(value => value !== server.value) : [server.value, ...pinned];
            write(pinKey, { ...read(pinKey), [groupKey(key)]: next });
            renderChips(); render(server.id);
            options.querySelector("#" + row.id + " .star")?.focus({ preventScroll: true });
          });
          star.setAttribute("aria-label", server.name + " · " + words[isPinned ? 7 : 6]);
          star.setAttribute("aria-pressed", String(isPinned));
          row.append(star); row.addEventListener("mouseenter", () => move(index));
          row.addEventListener("click", () => choose(server));
          row.pick = () => choose(server);
          options.append(row); rows.push(row);
        }
      }
      if (!rows.length) options.append(node("p", "fbx-sv-empty", words[3]));
      move(rows.findIndex(row => row.id === prefix + "-option-" + preferredId));
      position();
    }
    function outside(event) { if (!wrap.contains(event.target)) open(false); }
    function open(next, restore = false) {
      if (next === !pop.hidden) return;
      pop.hidden = !next;
      trigger.classList.toggle("open", next);
      trigger.setAttribute("aria-expanded", String(next));
      input.setAttribute("aria-expanded", String(next));
      if (next) {
        document.addEventListener("pointerdown", outside, true);
        globalThis.addEventListener("resize", position);
        input.value = ""; render(id); input.focus({ preventScroll: true });
      } else {
        document.removeEventListener("pointerdown", outside, true);
        globalThis.removeEventListener("resize", position);
        if (restore) trigger.focus({ preventScroll: true });
      }
    }
    input.addEventListener("input", () => render());
    input.addEventListener("keydown", event => {
      if (event.isComposing) return;
      if (["ArrowDown", "ArrowUp"].includes(event.key)) {
        event.preventDefault(); move(cursor + (event.key === "ArrowDown" ? 1 : -1), true);
      } else if (event.key === "Enter" && rows[cursor]) {
        event.preventDefault(); rows[cursor].pick();
      }
    });
    wrap.addEventListener("keydown", event => {
      if (event.key === "Escape" && !event.isComposing && !pop.hidden) {
        event.preventDefault(); event.stopPropagation(); open(false, true);
      }
    });
    return {
      update(nextKey, nextId, nextLocale) {
        if (key === nextKey && id === nextId && lang === nextLocale) return;
        open(false); key = nextKey; id = nextId; lang = nextLocale;
        list = servers(key, lang); words = copy[lang] || copy.en;
        input.placeholder = words[0]; input.setAttribute("aria-label", words[0]);
        pop.setAttribute("aria-label", words[0]); options.setAttribute("aria-label", words[2]);
        clear.textContent = words[4]; hint.textContent = words[8]; renderChips();
      },
      close: () => open(false),
    };
  }

  const transitions = new WeakMap();
  function feedback(bar, server, locale, zone, animate = true) {
    const words = copy[locale] || copy.en;
    let stamp = bar.querySelector(".fbx-stamp");
    if (!stamp) { stamp = node("span", "fbx-stamp"); stamp.setAttribute("role", "status"); bar.append(stamp); }
    const time = new Intl.DateTimeFormat(locale, { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23", timeZone: zone }).format(Date.now());
    if (!animate) {
      stamp.textContent = server + " · " + words[10] + " " + time;
      return;
    }
    const updating = node("span", "fbx-updating", words[9] + " · ");
    stamp.replaceChildren(updating, document.createTextNode(server + " · " + words[10] + " " + time));
    clearTimeout(transitions.get(bar));
    bar.classList.add("fbx-is-loading");
    transitions.set(bar, setTimeout(() => { bar.classList.remove("fbx-is-loading"); updating.remove(); }, 420));
  }
  function slide(title) {
    if (title && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
      title.animate([{ transform: "translateY(6px)" }, { transform: "translateY(0)" }], { duration: 340, easing: "cubic-bezier(.2,.9,.3,1)" });
    }
  }
  const localTimeCopy = {
    ko: "내 시간", en: "Your time", "zh-TW": "我的時間", "ja-JP": "現地時刻", "de-DE": "Ortszeit", "fr-FR": "Heure locale",
    "es-ES": "Hora local", "pt-BR": "Hora local", "ru-RU": "Местное время", vi: "Giờ địa phương", th: "เวลาท้องถิ่น",
  };
  function clocks(bar, locale, serverLabel, timeZone, offset) {
    const wrap = node("div", "fbx-clocks");
    const server = node("time", ""), local = node("time", "");
    const serverLine = node("span", "", serverLabel + " "), localLine = node("span", "", (localTimeCopy[locale] || localTimeCopy.en) + " ");
    serverLine.append(server, node("small", "", " " + offset)); localLine.append(local); wrap.append(serverLine, localLine);
    const options = { hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23" };
    const serverFormat = new Intl.DateTimeFormat(locale, { ...options, timeZone }), localFormat = new Intl.DateTimeFormat(locale, options);
    const previous = bar.querySelector(".fbx-clocks");
    if (previous) previous.replaceWith(wrap); else bar.append(wrap);
    return now => {
      server.textContent = serverFormat.format(now);
      local.textContent = localFormat.format(now);
    };
  }
  const alertCopy = {
    ko: ["전체 보스", "내 알림"], en: ["All bosses", "My alerts"], "zh-TW": ["所有首領", "我的通知"],
    "ja-JP": ["すべてのボス", "マイ通知"], "de-DE": ["Alle Bosse", "Meine Alarme"], "fr-FR": ["Tous les boss", "Mes alertes"],
    "es-ES": ["Todos los jefes", "Mis alertas"], "pt-BR": ["Todos os chefes", "Meus alertas"], "ru-RU": ["Все боссы", "Мои уведомления"],
    vi: ["Tất cả boss", "Thông báo của tôi"], th: ["บอสทั้งหมด", "การแจ้งเตือนของฉัน"],
  };
  function alertFilter(bar, panel, getSelection, getLocale) {
    const group = node("div", "fbx-alert-filter");
    group.setAttribute("role", "group");
    const all = button("", "", () => { panel.classList.remove("fbx-mine"); group.update(); });
    const mine = button("", "", () => { panel.classList.add("fbx-mine"); group.update(); });
    group.append(all, mine); bar.append(group);
    group.update = () => {
      const { key, id } = getSelection(), words = alertCopy[getLocale()] || alertCopy.en;
      const active = panel.classList.contains("fbx-mine");
      const count = globalThis.NotMeterBossAlerts?.countForServer?.(key, id) || 0;
      all.textContent = words[0]; mine.textContent = words[1] + " " + count;
      group.setAttribute("aria-label", words[0] + " / " + words[1]);
      all.setAttribute("aria-pressed", String(!active)); mine.setAttribute("aria-pressed", String(active));
    };
    group.update();
    return group.update;
  }
  document.addEventListener("notmeter:boss-watch-change", () => {
    document.querySelectorAll(".fbx-alert-filter").forEach(group => group.update());
  });
  globalThis.NotMeterFieldBossServer = { servers, preferred, remember, scope, setScope, mount, feedback, slide, alertFilter, clocks };
})();
