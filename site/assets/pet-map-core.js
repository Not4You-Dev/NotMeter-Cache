(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.NotMeterPetMapCore = api;
})(globalThis, function () {
  "use strict";
  function decode(code, catalog, now = Date.now()) {
    const value = String(code || "").trim();
    if (value.length > 100000 || !/^NMP1\.[A-Za-z0-9_-]+$/.test(value)) throw new Error("invalidCode");
    let data;
    try {
      const bytes = Uint8Array.from(atob(value.slice(5).replaceAll("-", "+").replaceAll("_", "/")), c => c.charCodeAt(0));
      data = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
    } catch { throw new Error("invalidCode"); }
    if (data?.region !== "WW") throw new Error("wrongRegion");
    if (data.v !== 1 || typeof data.capturedAt !== "string" || !Number.isFinite(Date.parse(data.capturedAt)) || Date.parse(data.capturedAt) > now + 300000 || !Array.isArray(data.pets) || data.pets.length > 2000) throw new Error("invalidCode");
    const definitions = new Map(catalog.map(pet => [pet.id, pet]));
    const progress = new Map();
    for (const row of data.pets) {
      if (!Array.isArray(row) || row.length !== 3 || !row.every(Number.isSafeInteger) || row[0] <= 0 || row[1] < 0 || row[1] > 100 || row[2] < 0 || row[2] > 2147483647 || progress.has(row[0])) throw new Error("invalidCode");
      const pet = definitions.get(row[0]);
      if (pet && row[1] > pet.maxLevel) throw new Error("invalidCode");
      progress.set(row[0], { level: row[1], souls: row[2] });
    }
    if (catalog.some(pet => !progress.has(pet.id))) throw new Error("incomplete");
    return { capturedAt: data.capturedAt, progress };
  }
  function status(pet, snapshot) {
    const value = snapshot?.progress.get(pet.id);
    if (!value) return { known: false, max: false, level: null, souls: null, required: null, ratio: 0 };
    const max = value.level >= pet.maxLevel;
    const required = max ? null : pet.required[value.level];
    return { known: true, max, ...value, required, ratio: max ? 1 : Math.min(1, Math.max(0, value.souls / required)) };
  }
  function positions(points, project, width, height, margin = 100) {
    const visible = [];
    for (const point of points) {
      const [x, y] = project(point.x, point.y);
      if (x < -margin || y < -margin || x > width + margin || y > height + margin) continue;
      visible.push({ point, x, y });
    }
    return visible;
  }
  function name(names, locale) { return names?.[locale] || names?.[locale.split("-")[0]] || names?.en || "—"; }
  function labelPositions(points, labelWidth, labelHeight, bounds) {
    const accepted = [];
    for (const anchor of points) {
      const x = anchor.x - labelWidth / 2, y = anchor.y - 22 - labelHeight;
      if (x < bounds.x || y < bounds.y || x + labelWidth > bounds.x + bounds.width || y + labelHeight > bounds.y + bounds.height) continue;
      if (accepted.some(item => Math.hypot(item.anchor.x - anchor.x, item.anchor.y - anchor.y) < 90 || x < item.x + labelWidth + 12 && x + labelWidth + 12 > item.x && y < item.y + labelHeight + 12 && y + labelHeight + 12 > item.y)) continue;
      accepted.push({ x, y, anchor });
    }
    return accepted;
  }
  function species(pet) {
    const crystal = /(?:^|\/)Icon_Item_Soulcrystal_(Intellect|Feral|Nature|Trans)\.png$/.exec(pet.crystal || "")?.[1];
    return { Intellect: "cogni", Feral: "fera", Nature: "natura", Trans: "varian" }[crystal] || null;
  }
  function matches(pet, snapshot, level = "all", genus = "all") {
    const state = status(pet, snapshot);
    return !state.max && (level === "all" || state.known && String(state.level) === level) && (genus === "all" || species(pet) === genus);
  }
  return { decode, status, positions, labelPositions, name, species, matches };
});
