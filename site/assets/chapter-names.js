(() => {
  "use strict";
  const cache = new Map(), pending = new Set(), inFlight = new Set();
  let scheduled = false, busy = false, version = 0, wakeTimer, wakeAt = Infinity;
  function changed() {
    version++;
    document.dispatchEvent(new Event("notmeter:chapter-names"));
  }
  function wake(at) {
    if (at >= wakeAt) return;
    clearTimeout(wakeTimer);
    wakeAt = at;
    wakeTimer = setTimeout(() => {
      wakeAt = Infinity;
      if (!document.hidden) changed();
    }, Math.max(20, at - Date.now()));
  }
  function prepare(player) {
    const ticket = player?.chapterNameTicket;
    if (!ticket) return;
    const known = cache.get(ticket), now = Date.now();
    const fresh = known?.expires > now;
    const name = fresh ? known.name : null;
    if ("N" in player) player.N = name || "***";
    else player.name = name || "***";
    player.nameHidden = !name;
    player.chapterNameStatus = fresh ? name ? "public" : "private" : known?.failed ? "unavailable" : "loading";
    const retryAt = known?.retryAt || 0;
    if ((!fresh || known.expires - now <= 8000) && retryAt <= now && !inFlight.has(ticket)) {
      pending.add(ticket);
      if (!scheduled) { scheduled = true; setTimeout(flush, 20); }
    }
    if (fresh) wake(known.expires - now > 8000 ? known.expires - 8000 : known.expires);
    if (retryAt > now) wake(retryAt);
  }
  function unavailable(ticket) {
    const previous = cache.get(ticket), failures = (previous?.failures || 0) + 1;
    cache.set(ticket, { name: previous?.name || null, expires: previous?.expires || 0,
      failed: true, failures, retryAt: Date.now() + Math.min(10000, 2000 * failures) });
  }
  async function request(tickets) {
    const endpoints = await globalThis.NotMeterControlEndpoint?.getEndpoints();
    for (const endpoint of [...new Set(endpoints || [])].slice(0, 2)) {
      try {
        const url = new URL("/ranking/v1/chapter-names", endpoint);
        if (url.protocol !== "https:") continue;
        const response = await fetch(url, { method: "POST", credentials: "omit", cache: "no-store",
          redirect: "error", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tickets }), signal: AbortSignal.timeout(6000) });
        if (!response.ok) { await response.body?.cancel(); continue; }
        const data = await response.json();
        if (!Array.isArray(data) || data.length !== tickets.length ||
            data.some((row, i) => !row || row.ticket !== tickets[i] ||
              !(row.name === null || typeof row.name === "string" && row.name.trim().length > 0 && row.name.length <= 32) ||
              !(row.unavailable === undefined || typeof row.unavailable === "boolean") || row.unavailable && row.name !== null))
          continue;
        return data;
      } catch {}
    }
    throw Error("Name status unavailable");
  }
  async function flush() {
    scheduled = false;
    if (busy || !pending.size) return;
    busy = true;
    const tickets = [...pending].slice(0, 20);
    tickets.forEach(ticket => { pending.delete(ticket); inFlight.add(ticket); });
    const requestedAt = Date.now();
    try {
      const data = await request(tickets);
      data.forEach(row => row.unavailable ? unavailable(row.ticket)
        : cache.set(row.ticket, { name: row.name, expires: requestedAt + 18000 }));
    } catch {
      tickets.forEach(unavailable);
    } finally {
      tickets.forEach(ticket => inFlight.delete(ticket));
      busy = false;
      changed();
      if (pending.size && !scheduled) { scheduled = true; setTimeout(flush, 20); }
    }
  }
  function nameOrder(a, b, ordinal = false) {
    const key = ordinal ? "chapterOrdinalOrder" : "chapterNameOrder";
    return Number.isInteger(a?.[key]) && Number.isInteger(b?.[key]) ? a[key] - b[key] : null;
  }
  function identityOrder(a, b) {
    return Number.isInteger(a?.chapterIdentityOrder) && Number.isInteger(b?.chapterIdentityOrder)
      ? a.chapterIdentityOrder - b.chapterIdentityOrder : null;
  }
  document.addEventListener("visibilitychange", () => { if (!document.hidden && cache.size) changed(); });
  globalThis.NotMeterChapterNames = Object.freeze({ prepare, nameOrder, identityOrder, revision: () => version });
})();

