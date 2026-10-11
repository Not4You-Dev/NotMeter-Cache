(() => {
  "use strict";
  let dispose = () => {};

  function create(items, label) {
    dispose();
    const root = document.createElement("div");
    root.className = "character-tabs";
    const nav = document.createElement("nav");
    nav.className = "character-section-nav";
    nav.setAttribute("role", "tablist");
    nav.setAttribute("aria-label", label);
    const panels = document.createElement("div");
    panels.className = "character-tab-panels";
    root.append(nav, panels);
    const entries = items.map(item => {
      const tab = document.createElement("a");
      tab.className = "character-tab";
      tab.id = `character-tab-${item.key}`;
      tab.href = `#character-${item.key}`;
      tab.setAttribute("role", "tab");
      tab.setAttribute("aria-controls", `character-panel-${item.key}`);
      const name = document.createElement("span");
      name.textContent = item.label;
      tab.append(name);
      const panel = document.createElement("div");
      panel.className = "character-tab-panel";
      panel.id = `character-panel-${item.key}`;
      panel.setAttribute("role", "tabpanel");
      panel.setAttribute("aria-labelledby", tab.id);
      panel.tabIndex = 0;
      panel.append(item.content);
      nav.append(tab);
      panels.append(panel);
      return { ...item, tab, panel };
    });
    let active = "";
    const fromLocation = () => entries.find(e => window.location.hash === `#character-${e.key}`)?.key || entries[0]?.key;
    function select(key, navigate = false, focus = false) {
      const next = entries.find(e => e.key === key);
      if (!next) return;
      const returnToTop = navigate && root.getBoundingClientRect().top < 8;
      for (const entry of entries) {
        const selected = entry === next;
        entry.tab.setAttribute("aria-selected", String(selected));
        entry.tab.tabIndex = selected ? 0 : -1;
        entry.panel.hidden = !selected;
      }
      if (navigate && key !== active) {
        const url = new URL(window.location.href);
        url.hash = `character-${key}`;
        window.history.pushState(window.history.state, "", url.href);
      }
      active = key;
      if (focus) next.tab.focus({ preventScroll: true });
      if (returnToTop) root.scrollIntoView({ block: "start", behavior: "instant" });
    }
    entries.forEach((entry, index) => {
      entry.tab.addEventListener("click", event => {
        if (event.button || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        select(entry.key, true);
      });
      entry.tab.addEventListener("keydown", event => {
        let next = index;
        if (event.key === "ArrowRight") next = (index + 1) % entries.length;
        else if (event.key === "ArrowLeft") next = (index + entries.length - 1) % entries.length;
        else if (event.key === "Home") next = 0;
        else if (event.key === "End") next = entries.length - 1;
        else if (event.key !== " ") return;
        event.preventDefault();
        select(entries[next].key, true, true);
      });
    });
    const restore = () => {
      // An advertisement hash is not a character tab navigation.
      if (window.location.hash && !window.location.hash.startsWith("#character-")) return;
      select(fromLocation());
    };
    window.addEventListener("hashchange", restore);
    window.addEventListener("popstate", restore);
    const resize = typeof ResizeObserver === "function" ? new ResizeObserver(() => {
      root.style.setProperty("--character-tabs-height", `${nav.getBoundingClientRect().height}px`);
    }) : null;
    resize?.observe(nav);
    dispose = () => {
      resize?.disconnect();
      window.removeEventListener("hashchange", restore);
      window.removeEventListener("popstate", restore);
    };
    select(fromLocation());
    return root;
  }
  globalThis.NotMeterCharacterTabs = Object.freeze({ create });
})();
