(() => {
  "use strict";

  let refreshLocale = () => {};
  function init(translate) {
    const guide = document.getElementById("ranker-dungeon-guide");
    const disclosure = guide?.querySelector("details");
    if (!disclosure || guide.dataset.previewsReady) return;
    guide.dataset.previewsReady = "true";
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const previews = Array.from(guide.querySelectorAll("[data-ranker-animation]"), host => {
      const image = host.querySelector("img");
      const button = host.querySelector("button");
      const preview = { host, image, button, poster: image.getAttribute("src"), requested: null };
      button.hidden = false;
      button.addEventListener("click", () => {
        preview.requested = button.getAttribute("aria-pressed") !== "true";
        sync();
      });
      return preview;
    });
    function sync() {
      for (const preview of previews) {
        const { host, image, button, poster } = preview;
        const playing = disclosure.open && !guide.hidden && !document.hidden &&
          (preview.requested ?? (!reduced.matches && host.hasAttribute("data-ranker-autoplay")));
        const src = playing ? host.dataset.rankerAnimation : poster;
        if (image.getAttribute("src") !== src) image.setAttribute("src", src);
        const action = translate(playing ? "rankerPreviewPause" : "rankerPreviewPlay");
        button.textContent = action;
        button.setAttribute("aria-pressed", String(playing));
        button.setAttribute("aria-label", translate("rankerPreviewMotionAria", {
          title: translate(host.dataset.previewTitle), action,
        }));
      }
    }
    refreshLocale = () => {
      guide.querySelectorAll("[data-ranker-alt]").forEach(image => {
        image.alt = translate(image.dataset.rankerAlt);
      });
      sync();
    };
    disclosure.addEventListener("toggle", sync);
    document.addEventListener("visibilitychange", sync);
    new MutationObserver(sync).observe(guide, { attributes: true, attributeFilter: ["hidden"] });
    reduced.addEventListener("change", () => {
      if (reduced.matches) previews.forEach(preview => { preview.requested = false; });
      sync();
    });
    refreshLocale();
  }
  window.NotMeterRankerGuide = { init, refreshLocale: () => refreshLocale() };
})();
