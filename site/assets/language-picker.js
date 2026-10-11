(() => {
  "use strict";

  function enhance(select) {
    if (!select || select.dataset.languagePicker) return;
    const wrapper = select.closest(".language-select-wrap") || document.createElement("span");
    if (!wrapper.parentElement) {
      select.before(wrapper);
      wrapper.append(select);
    }
    wrapper.classList.add("language-picker");
    const button = document.createElement("button");
    button.type = "button";
    button.className = "language-picker-trigger";
    button.setAttribute("role", "combobox");
    button.setAttribute("aria-haspopup", "listbox");
    button.setAttribute("aria-expanded", "false");
    const flag = document.createElement("img");
    flag.alt = "";
    flag.className = "language-picker-flag";
    const label = document.createElement("span");
    label.className = "language-picker-label";
    const caret = document.createElement("span");
    caret.className = "language-picker-caret";
    caret.setAttribute("aria-hidden", "true");
    button.append(flag, label, caret);
    const panel = document.createElement("div");
    panel.className = "language-picker-panel";
    panel.hidden = true;
    const heading = document.createElement("div");
    heading.className = "language-picker-heading";
    heading.id = `${select.id}-heading`;
    const list = document.createElement("div");
    list.id = `${select.id}-options`;
    list.className = "language-picker-options";
    list.setAttribute("role", "listbox");
    list.setAttribute("aria-labelledby", heading.id);
    button.setAttribute("aria-controls", list.id);
    panel.append(heading, list);
    wrapper.append(button);
    document.body.append(panel);

    let items = [], signature = "", active = 0, search = "", searchTime = 0;
    const selectedIndex = () => Math.max(0, items.findIndex(item => item.value === select.value));
    const isOpen = () => !panel.hidden;
    function move(index) {
      if (!items.length) return;
      active = Math.max(0, Math.min(items.length - 1, index));
      items.forEach((item, i) => item.element.classList.toggle("is-focused", i === active));
      button.setAttribute("aria-activedescendant", items[active].element.id);
      items[active].element.scrollIntoView({ block: "nearest" });
    }
    function place() {
      const rect = button.getBoundingClientRect(), viewport = window.visualViewport;
      const left = viewport?.offsetLeft || 0, top = viewport?.offsetTop || 0;
      const width = viewport?.width || innerWidth, height = viewport?.height || innerHeight;
      const panelWidth = Math.min(256, width - 24);
      const below = top + height - rect.bottom - 20, above = rect.top - top - 20;
      const heightNeeded = panel.scrollHeight;
      const upwards = below < heightNeeded && above > below;
      panel.style.width = `${panelWidth}px`;
      panel.style.maxHeight = `${Math.max(80, upwards ? above : below)}px`;
      panel.style.left = `${Math.max(left + 12, Math.min(rect.right - panelWidth, left + width - panelWidth - 12))}px`;
      panel.style.top = `${upwards ? rect.top - panel.getBoundingClientRect().height - 8 : rect.bottom + 8}px`;
    }
    function close() {
      panel.hidden = true;
      button.setAttribute("aria-expanded", "false");
      button.removeAttribute("aria-activedescendant");
      search = "";
    }
    function open() {
      if (!items.length || button.disabled) return;
      panel.hidden = false;
      button.setAttribute("aria-expanded", "true");
      place();
      move(selectedIndex());
    }
    function commit(index) {
      const value = items[index]?.value;
      if (!value) return;
      close();
      if (select.value !== value) {
        select.value = value;
        select.dispatchEvent(new Event("change", { bubbles: true }));
      }
      sync();
      button.focus({ preventScroll: true });
    }
    function sync() {
      const options = [...select.options].filter(option => !option.disabled);
      const nextSignature = JSON.stringify(options.map(option => [option.value, option.textContent]));
      if (nextSignature !== signature) {
        signature = nextSignature;
        items = options.map((option, index) => {
          const language = globalThis.NotMeterI18n?.languages.find(item => item.code === option.value);
          const element = document.createElement("div");
          element.className = "language-picker-option";
          element.id = `${select.id}-option-${index}`;
          element.dataset.value = option.value;
          element.setAttribute("role", "option");
          element.lang = language?.tag || option.lang;
          const image = document.createElement("img");
          image.className = "language-picker-flag";
          image.alt = "";
          if (language) image.src = `./assets/flag-${language.flag}.svg`;
          else image.hidden = true;
          const name = document.createElement("span");
          name.textContent = option.textContent;
          const check = document.createElement("span");
          check.className = "language-picker-check";
          check.setAttribute("aria-hidden", "true");
          check.textContent = "✓";
          element.append(image, name, check);
          element.addEventListener("click", () => commit(index));
          return { value: option.value, name: option.textContent, language, element };
        });
        list.replaceChildren(...items.map(item => item.element));
      }
      const selected = items.find(item => item.value === select.value);
      label.textContent = selected?.name || "";
      label.lang = selected?.language?.tag || "";
      flag.hidden = !selected?.language;
      if (selected?.language) flag.src = `./assets/flag-${selected.language.flag}.svg`;
      const title = select.getAttribute("aria-label") || "Language";
      heading.textContent = title;
      button.setAttribute("aria-label", `${title}: ${selected?.name || ""}`);
      button.title = selected?.name || title;
      button.disabled = select.disabled || !items.length;
      items.forEach(item => item.element.setAttribute("aria-selected", String(item.value === select.value)));
      if (isOpen()) { place(); move(active); }
    }
    button.addEventListener("click", () => isOpen() ? close() : open());
    button.addEventListener("keydown", event => {
      const { key } = event;
      if (key === "Escape") {
        if (isOpen()) { event.preventDefault(); event.stopPropagation(); close(); }
      } else if (key === "Tab") {
        close();
      } else if (["Enter", " "].includes(key)) {
        event.preventDefault();
        if (isOpen()) commit(active); else open();
      } else if (["ArrowDown", "ArrowUp", "Home", "End"].includes(key)) {
        event.preventDefault();
        if (!isOpen()) open();
        else if (key === "ArrowDown") move(active + 1);
        else if (key === "ArrowUp") move(active - 1);
        if (key === "Home") move(0);
        if (key === "End") move(items.length - 1);
      } else if (key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
        event.preventDefault();
        if (!isOpen()) open();
        const now = Date.now();
        search = (now - searchTime > 700 ? "" : search) + key.toLocaleLowerCase();
        searchTime = now;
        const index = items.findIndex(item => item.name.toLocaleLowerCase().startsWith(search) || item.value.toLowerCase().startsWith(search));
        if (index >= 0) move(index);
      }
    });
    panel.addEventListener("pointerdown", event => event.preventDefault());
    document.addEventListener("pointerdown", event => {
      if (!wrapper.contains(event.target) && !panel.contains(event.target)) close();
    });
    document.addEventListener("focusin", event => { if (!wrapper.contains(event.target)) close(); });
    window.addEventListener("resize", close);
    window.addEventListener("beforeprint", close);
    window.addEventListener("scroll", event => {
      if (event.target !== panel && !panel.contains(event.target)) close();
    }, { capture: true, passive: true });
    window.visualViewport?.addEventListener("resize", close);
    select.addEventListener("change", sync);
    new MutationObserver(sync).observe(select, {
      childList: true, subtree: true, characterData: true, attributes: true,
      attributeFilter: ["aria-label", "data-language", "disabled", "selected"],
    });
    sync();
    select.dataset.languagePicker = "true";
    wrapper.classList.add("is-enhanced");
  }
  const init = () => document.querySelectorAll("#language-button, #guide-language").forEach(enhance);
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
