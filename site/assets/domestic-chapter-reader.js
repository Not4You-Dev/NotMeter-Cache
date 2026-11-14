(() => {
  "use strict";
  const repository = "Not4You-Dev/NotMeter-Chapter-1-1-Cache";
  const raw = "https://raw.githubusercontent.com/" + repository + "/";
  const sha = /^[a-f0-9]{64}$/;
  const allowed = /^(?:data\/(?:notmeter-ranking(?:-class-overall)?\.json\.gz|(?:classes|views|custom-cp)\/[a-z0-9-]+\.json\.gz|notmeter-ranking-custom-cp-[a-z0-9-]+-boss-\d{1,3}\.json\.gz)|detail-index\/[a-f0-9]{2}\.json\.gz)$/;
  const detailPath = /^details\/([a-f0-9]{2})\/([a-f0-9]{64})\.json\.gz$/;
  const visible = (surface, service) => service === "KR/TW" && ["ranking", "classTop10"].includes(surface);
  function selection(surface, service, search, activation) {
    if (!visible(surface, service)) return null;
    if (!activation) return "1-1";
    return new URLSearchParams(search).get("chapter") === "1-1" ? "1-1" : "1-2";
  }
  function target(url, chapter, activation) {
    if (!activation || !["1-1", "1-2"].includes(chapter)) throw Error("Unavailable chapter");
    const next = new URL(url);
    if (chapter === "1-1") next.searchParams.set("chapter", chapter);
    else next.searchParams.delete("chapter");
    return next.href;
  }
  function hex(bytes) {
    return Array.from(new Uint8Array(bytes), b => b.toString(16).padStart(2, "0")).join("");
  }
  async function bytes(response, max) {
    if (response.status !== 200) throw Error("Chapter file unavailable");
    const r = response.body.getReader(), parts = [];
    let count = 0;
    try {
      for (;;) {
        const { done, value } = await r.read(); if (done) break;
        count += value.length;
        if (count > max) throw Error("Chapter file exceeds limit");
        parts.push(value);
      }
    } catch (error) { await r.cancel(); throw error; }
    const result = new Uint8Array(count);
    let offset = 0;
    for (const part of parts) { result.set(part, offset); offset += part.length; }
    return result;
  }
  function reader(activation, get = fetch) {
    if (!activation || !/^[a-f0-9]{40}$/.test(activation.archiveRevision) ||
        !sha.test(activation.inventorySha256) || !Number.isFinite(Date.parse(activation.cutoff))) {
      throw Error("Invalid archive activation");
    }
    const prefix = raw + activation.archiveRevision + "/";
    async function verified(path, expectedHash, limit, signal) {
      const result = await bytes(await get(prefix + path, { credentials: "omit", redirect: "error", signal }), limit);
      if (hex(await crypto.subtle.digest("SHA-256", result)) !== expectedHash) throw Error("Chapter digest mismatch");
      return result;
    }
    let pending;
    async function inventory() {
      const b = await verified("chapter-inventory.json", activation.inventorySha256, 16 << 20, AbortSignal.timeout(45000));
      const obj = JSON.parse(new TextDecoder().decode(b));
      if (obj.schema !== "notmeter-domestic-chapter-archive-v1" || obj.chapter !== "1-1" ||
          obj.battleEndInclusive !== activation.cutoff || obj.services?.join(",") !== "KR,TW" ||
          !Array.isArray(obj.files) || !Number.isFinite(Date.parse(obj.generatedAt))) throw Error("Wrong archive");
      const files = new Map();
      for (const f of obj.files) {
        if (!allowed.test(f.path) || files.has(f.path) || !sha.test(f.sha256) ||
            !Number.isSafeInteger(f.size) || f.size < 1 || f.size > 64 << 20) throw Error("Invalid archive inventory");
        files.set(f.path, Object.freeze({ size: f.size, sha256: f.sha256 }));
      }
      for (const p of ["data/notmeter-ranking.json.gz", "data/notmeter-ranking-class-overall.json.gz"]) {
        if (!files.has(p)) throw Error("Incomplete archive");
      }
      return { files, generatedAt: obj.generatedAt };
    }
    function ready() {
      return pending ||= inventory().catch(e => { pending = null; throw e; });
    }
    async function read(path, signal) {
      const manifest = await ready(), file = manifest.files.get(path);
      if (!file || !allowed.test(path)) throw Error("File outside archived rankings");
      const json = await readFile(path, file, signal);
      if (json.generatedAt !== manifest.generatedAt) throw Error("Mixed chapter generations");
      return json;
    }
    async function readFile(path, file, signal) {
      const b = await verified(path, file.sha256, file.size, signal ?? AbortSignal.timeout(45000));
      if (b.length !== file.size) throw Error("Chapter size mismatch");
      const stream = new Blob([b]).stream().pipeThrough(new DecompressionStream("gzip"));
      const json = JSON.parse(new TextDecoder().decode(await bytes(new Response(stream), 192 << 20)));
      return json;
    }
    const indexes = new Map(), details = new Map();
    async function detail(key, signal) {
      if (!sha.test(key)) throw Error("Invalid archived detail key");
      if (details.has(key)) return details.get(key);
      const prefix = key.slice(0, 2);
      if (!indexes.has(prefix)) indexes.set(prefix, read("detail-index/" + prefix + ".json.gz", signal).catch(error => {
        indexes.delete(prefix); throw error;
      }));
      const index = await indexes.get(prefix), file = index.entries?.[key];
      const match = detailPath.exec(file?.path || "");
      if (index.schema !== "notmeter-chapter-detail-index-v1" || !match || match[2].slice(0, 2) !== match[1] ||
          !sha.test(file.sha256) || !Number.isSafeInteger(file.size) || file.size <= 0 || file.size > 8 << 20)
        throw Error("Missing archived detail");
      const result = await readFile(file.path, file, signal);
      if (!Number.isInteger(result.selectors?.[key]) || result.selectors[key] <= 0) throw Error("Wrong archived detail reference");
      details.set(key, result);
      while (details.size > 20) details.delete(details.keys().next().value);
      return result;
    }
    return Object.freeze({ read, ready, detail });
  }
  globalThis.NotMeterDomesticChapter = Object.freeze({ reader, selection, target });
})();
