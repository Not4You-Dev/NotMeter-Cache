(() => {
  const repository = "Not4You-Dev/NotMeter-Web-CP-Cache";
  const manifestPath = "data/web-cp-manifest.json";
  const allowedPath = path => path === "data/web-cp-source.json" ||
    /^data\/notmeter-ranking-custom-cp(?:-[a-z0-9_-]{1,64}-boss-[0-9]{1,3})?\.json\.gz$/.test(path) ||
    /^data\/custom-cp\/[a-z0-9_-]{1,64}\.json\.gz$/.test(path);
  function validate(manifest, generation, generatedAt) {
    if (manifest?.schema !== "notmeter-web-cp-manifest-v1" || manifest.version !== 1 ||
        manifest.repository !== repository || manifest.generation !== generation ||
        manifest.generatedAt !== generatedAt || !/^[a-f0-9]{40}$/.test(manifest.revision || "") ||
        !Array.isArray(manifest.files) || !manifest.files.length || manifest.files.length > 200)
      throw Error("Invalid web CP generation");
    const paths = new Set();
    for (const file of manifest.files) {
      if (!allowedPath(file.path) || paths.has(file.path) || !Number.isSafeInteger(file.size) ||
          file.size <= 0 || file.size > 64 * 1024 * 1024 || !/^[a-f0-9]{64}$/.test(file.sha256 || ""))
        throw Error("Invalid web CP inventory");
      paths.add(file.path);
    }
    return manifest;
  }
  function create(fetchImpl = fetch, cryptoImpl = globalThis.crypto) {
    const loaded = new Map();
    async function bytes(url, maximum) {
      const response = await fetchImpl(url, { cache: "no-cache", signal: AbortSignal.timeout(30000) });
      if (!response.ok) throw Error(`Web CP metadata HTTP ${response.status}`);
      if (Number(response.headers.get("content-length")) > maximum) throw Error("Oversized web CP metadata");
      const result = new Uint8Array(await response.arrayBuffer());
      if (result.length > maximum) throw Error("Oversized web CP metadata");
      return result;
    }
    async function load(root, generation) {
      const inventory = JSON.parse(new TextDecoder().decode(await bytes(`${root}/cache-inventory.json`, 1048576)));
      if (inventory.schema !== "notmeter-cache-inventory-v1" || inventory.generation !== generation || !Array.isArray(inventory.files))
        throw Error("Invalid main cache inventory");
      const entry = inventory.files.find(file => file.path === manifestPath);
      if (!entry) return null;
      if (!Number.isSafeInteger(entry.size) || entry.size <= 0 || entry.size > 1048576 || !/^[a-f0-9]{64}$/.test(entry.sha256 || ""))
        throw Error("Invalid web CP descriptor entry");
      const content = await bytes(`${root}/${manifestPath}`, entry.size);
      const hash = [...new Uint8Array(await cryptoImpl.subtle.digest("SHA-256", content))].map(b => b.toString(16).padStart(2, "0")).join("");
      if (content.length !== entry.size || hash !== entry.sha256) throw Error("Web CP descriptor checksum mismatch");
      return JSON.parse(new TextDecoder().decode(content));
    }
    return {
      async resolve(root, generatedAt, path, legacy) {
        if (!root) return legacy;
        const match = /^https:\/\/(?:notmeter\.com|not4you-dev\.github\.io\/NotMeter-Cache)\/g\/([a-f0-9]{16})$/.exec(root);
        if (!match || !allowedPath(path)) throw Error("Invalid web CP destination");
        if (!loaded.has(root)) {
          const promise = load(root, match[1]).catch(error => { loaded.delete(root); throw error; });
          loaded.set(root, promise);
          if (loaded.size > 2) loaded.delete(loaded.keys().next().value);
        }
        const manifest = await loaded.get(root);
        if (!manifest) return legacy;
        validate(manifest, match[1], String(generatedAt || ""));
        if (!manifest.files.some(file => file.path === path)) throw Error("Missing web CP file for this generation");
        return [`https://raw.githubusercontent.com/${repository}/${manifest.revision}/${path}`];
      },
    };
  }
  const api = { create, validate, allowedPath };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else globalThis.NotMeterWebCpCache = create();
})();
