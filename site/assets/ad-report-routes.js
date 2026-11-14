(() => {
  "use strict";
  const allowed = window.top === window.self && navigator.globalPrivacyControl !== true;
  const index = url => ["/", "/index.html"].includes(url.pathname);
  const home = url => index(url) && !url.searchParams.get("view") && !url.searchParams.has("download");
  const landing = new URL(location.href);
  const source = landing.searchParams.get("nm_from");
  const view = landing.searchParams.get("view");
  let referredFromHome = false;
  try {
    const ref = new URL(document.referrer);
    referredFromHome = ref.origin === landing.origin && home(ref);
  } catch { /* Direct visits and withheld referrers stay unclassified. */ }
  let channel = "";
  if (allowed && referredFromHome) {
    if (source === "home-ranking" && index(landing) && ["ranking", "class-top10", "class-performance"].includes(view)) channel = "1454386074";
    if (source === "home-character" && index(landing) && view === "character") channel = "6480636995";
    if (source === "home-pet" && landing.pathname === "/pet-tracker.html") channel = "7263894761";
  }
  // No beacon, new identifier or artificial impression. Apply only before an organic request.
  globalThis.NotMeterAdRoutes = Object.freeze({
    isHome: () => allowed && home(new URL(location.href)),
    onHomeRankingSelected() { if (allowed && home(new URL(location.href))) channel = "1454386074"; },
    applyTo(element) {
      if (!allowed) return;
      const group = document.getElementById("guide-bottom-trial")?.dataset.adCohort;
      const id = group === "bottom" ? "9141304400" : group === "control" ? "6762553073" : channel;
      if (id) element.dataset.adChannel = id;
    }
  });
})();
