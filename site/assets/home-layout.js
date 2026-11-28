(() => {
  "use strict";
  const find = selector => document.querySelector(selector);
  const make = (tag, className, children = []) => {
    const element = document.createElement(tag);
    element.className = className;
    element.append(...children.filter(Boolean));
    return element;
  };
  const top = find(".topbar"), nav = find(".service-links");
  const service = find("#ranking-service-panel"), filters = find("#rankings");
  if (!top || !nav || !service || !filters) return;

  const rankingNodes = [];
  for (let node = service; node && !node.matches(".page-footer"); node = node.nextElementSibling) rankingNodes.push(node);
  const workspace = make("section", "home-workspace");
  service.before(workspace);
  const title = make("h2", "home-ranking-title");
  title.id = "home-ranking-title";
  workspace.setAttribute("aria-labelledby", title.id);
  const lead = make("div", "home-ranking-lead", [title, service]);
  const notice = find("#meter-use-notice");
  const rail = make("aside", "home-dungeon-rail", [find(".filter-choice-dungeon")]);
  const results = make("div", "home-results", [find(".snapshot-bar"), find(".ranking-panel")]);
  const body = make("div", "home-dungeon-body", [filters, find("#custom-cp-panel"), find("#weekly-reset"),
    find("#global-training-dummy-guide"), results]);
  workspace.append(lead, notice, make("div", "home-dungeon-columns", [rail, body]));
  const help = make("div", "home-ranking-help", rankingNodes.filter(node => !workspace.contains(node)));
  workspace.append(help);

  const community = make("aside", "home-community", [find("#notmeter-discord"), find(".first-guide")]);
  const tools = make("div", "home-tools", [find(".live-pill"), find(".s-menu-anchor"), find("#download-button"), find(".language-select-wrap")]);
  const menu = make("details", "home-more");
  const more = make("summary", "home-more-label");
  const menuBody = make("div", "home-more-body");
  for (const link of [...nav.children]) {
    if (!["class-top10-button", "class-performance-button", "field-boss-button", "contribution-button"].includes(link.id)) menuBody.append(link);
  }
  const home = make("a", "service-link home-ranking-link");
  home.href = "./#rankings";
  const homeText = make("span", "service-link-label");
  home.append(homeText);
  nav.prepend(home);
  menu.append(more, menuBody);
  nav.append(menu);
  const brand = find(".brand");
  top.replaceChildren(brand, tools);
  top.after(nav);
  nav.after(make("div", "home-utility", [find("#global-character-search"), community]));

  const words = {
    ko: ["랭킹", "더 보기", "던전 랭킹"],
    en: ["Rankings", "More", "Dungeon rankings"],
    "zh-TW": ["排行榜", "更多", "副本排行榜"],
    "ja-JP": ["ランキング", "その他", "ダンジョンランキング"],
    "de-DE": ["Ranglisten", "Mehr", "Dungeon-Ranglisten"],
    "fr-FR": ["Classements", "Plus", "Classements des donjons"],
    "es-ES": ["Clasificaciones", "Más", "Clasificación de mazmorras"],
    "pt-BR": ["Rankings", "Mais", "Rankings de masmorras"],
    "ru-RU": ["Рейтинги", "Ещё", "Рейтинги подземелий"],
  };
  function translate() {
    const text = words[document.documentElement.lang] || words.en;
    homeText.textContent = text[0];
    more.textContent = text[1];
    title.textContent = text[2];
  }
  function syncSurface() {
    workspace.hidden = service.hidden;
    home.setAttribute("aria-current", workspace.hidden ? "false" : "page");
  }
  menuBody.addEventListener("click", event => { if (event.target.closest("a")) menu.open = false; });
  document.addEventListener("pointerdown", event => { if (!menu.contains(event.target)) menu.open = false; });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && menu.open) { menu.open = false; more.focus(); }
  });
  new MutationObserver(translate).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
  new MutationObserver(syncSurface).observe(service, { attributes: true, attributeFilter: ["hidden"] });
  translate();
  syncSurface();
  document.body.classList.add("home-layout");
})();
