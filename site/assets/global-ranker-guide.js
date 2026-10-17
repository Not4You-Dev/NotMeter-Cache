(() => {
  "use strict";
  const fields = ["title", "intro", "markTitle", "mark", "motionTitle", "motion", "effectTitle", "effect", "badgeTitle", "badge", "shareTitle", "share", "dungeons", "dummyTitle", "dummy", "lossTitle", "loss", "faqTitle"];
  const copy = {};
  let panel, original, guide, currentLocale;
  function apply(locale, global) {
    const notice = globalThis.NotMeterGlobalCpNotice?.copy;
    if (!notice) return;
    for (const [language, text] of Object.entries(notice)) {
      copy[language] = [text.guideTitle, text.guideIntro,
        text.staticTitle, text.staticBody, text.animatedTitle, text.animatedBody,
        text.effectTitle, text.items[7][1] + " " + text.effectUse,
        text.timingTitle, text.items[6][1], text.shareTitle, text.share,
        text.dungeons, text.dummyTitle, text.dummy, text.lossTitle, text.loss, text.faqTitle];
    }
    guide = document.getElementById("ranker-dungeon-guide");
    if (!guide) return;
    if (!original) original = guide.querySelector("details");
    if (!panel) {
      panel = document.createElement("details"); panel.dataset.globalRankerGuide = "";
      panel.innerHTML = `<summary><span class="weekly-guide-icon" aria-hidden="true">R</span><span class="weekly-guide-heading ranker-guide-heading"><strong data-global-copy="title"></strong><span data-global-copy="intro"></span></span><span class="weekly-guide-toggle" aria-hidden="true">⌄</span></summary>
        <div class="weekly-guide-body ranker-dungeon-guide-body"><div class="global-ranker-loss"><strong data-global-copy="lossTitle"></strong><p data-global-copy="loss"></p></div><div class="ranker-guide-answer-grid">
        <article class="ranker-guide-answer-card"><strong data-global-copy="motionTitle"></strong><p data-global-copy="motion"></p><img data-global-motion width="96" height="96" alt="" src="./assets/ranker-previews/alltime-rank-1-5.png" loading="lazy"></article>
        <article class="ranker-guide-answer-card ranker-guide-answer-marker"><strong data-global-copy="markTitle"></strong><p data-global-copy="mark"></p><div class="global-ranker-static-previews"><figure><img data-global-static="6–10" width="96" height="96" alt="" src="./assets/ranker-previews/rank-6-10.png" loading="lazy"><figcaption>6–10</figcaption></figure><figure><img data-global-static="11–20" width="96" height="96" alt="" src="./assets/ranker-previews/rank-11-20.png" loading="lazy"><figcaption>11–20</figcaption></figure></div></article></div>
        <div class="ranker-guide-other-access"><h3 data-global-copy="effectTitle"></h3><p data-global-copy="effect"></p></div>
        <section class="global-ranker-faq"><h3 data-global-copy="faqTitle"></h3><div data-global-faq></div></section>
        <div class="ranker-guide-other-access"><h3 data-global-copy="dummyTitle"></h3><p data-global-copy="dummy"></p></div>
        <div class="ranker-guide-other-access"><h3 data-global-copy="badgeTitle"></h3><p data-global-copy="badge"></p></div>
        <div class="ranker-guide-retention"><strong data-global-copy="shareTitle"></strong><p data-global-copy="share"></p></div>
        <div class="ranker-dungeon-section-title"><strong data-global-copy="dungeons"></strong></div><div class="ranker-dungeon-list" data-global-dungeons></div></div>`;
      guide.append(panel);
      panel.addEventListener("toggle", syncMotion);
      document.addEventListener("visibilitychange", syncMotion);
      new MutationObserver(syncMotion).observe(guide, { attributes: true, attributeFilter: ["hidden"] });
      matchMedia("(prefers-reduced-motion: reduce)").addEventListener("change", syncMotion);
    }
    original.hidden = global; panel.hidden = !global;
    const renderKey = locale;
    if (global && renderKey !== currentLocale) {
      const text = Object.fromEntries(fields.map((key, i) => [key, (copy[locale] || copy.en)[i]]));
      panel.querySelectorAll("[data-global-copy]").forEach(el => { el.textContent = text[el.dataset.globalCopy]; });
      const faq = panel.querySelector("[data-global-faq]"); faq.replaceChildren();
      for (const [question, answer] of (notice[locale] || notice.en).faq) {
        const item = document.createElement("article"), heading = document.createElement("h4"), body = document.createElement("p");
        heading.textContent = question; body.textContent = answer;
        item.append(heading, body); faq.append(item);
      }
      panel.classList.add("is-global-cp-guide");
      panel.querySelector("[data-global-motion]").alt = text.motionTitle;
      panel.querySelectorAll("[data-global-static]").forEach(image => { image.alt = `${text.markTitle} · ${image.dataset.globalStatic}`; });
      const list = panel.querySelector("[data-global-dungeons]"); list.replaceChildren();
      for (const [i, dungeon] of globalThis.NotMeterGlobalRankingCatalog.dungeons.entries()) {
        const item = document.createElement("article"); item.className = "ranker-dungeon-item";
        const number = document.createElement("span"); number.className = "ranker-dungeon-number"; number.textContent = String(i + 1).padStart(2, "0");
        const body = document.createElement("div"), title = document.createElement("strong"), bosses = document.createElement("p");
        title.textContent = `${dungeon.names[locale] || dungeon.names.en} (${globalThis.NotMeterGlobalRanking.t(dungeon.kind)})`;
        bosses.textContent = dungeon.bosses.map(b => b.names[locale] || b.names.en).join(" · ");
        body.append(title, bosses); item.append(number, body); list.append(item);
      }
      currentLocale = renderKey;
    }
    syncMotion();
  }
  function syncMotion() {
    if (!panel) return;
    const image = panel.querySelector("[data-global-motion]");
    const animate = !image.closest("article").hidden && panel.open && !panel.hidden && !guide.hidden && !document.hidden && !matchMedia("(prefers-reduced-motion: reduce)").matches;
    const source = `./assets/ranker-previews/alltime-rank-1-5.${animate ? "gif" : "png"}`;
    if (image.getAttribute("src") !== source) image.setAttribute("src", source);
  }
  globalThis.NotMeterGlobalRankerGuide = { apply, copy, fields };
})();
