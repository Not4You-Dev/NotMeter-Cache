(() => {
  function normalized(player) {
    const verified = player.A ?? player.raidDpsVerified;
    return verified === true || Number(verified) === 1
      ? Math.max(0, Number(player.Y ?? player.normalizedDps) || 0) : 0;
  }

  function compare(left, right, mode) {
    if (mode === "time") {
      const duration = player => {
        const value = Number(player.U ?? player.durationSeconds);
        return Number.isFinite(value) && value > 0 ? value : Infinity;
      };
      const difference = duration(left) - duration(right);
      if (difference !== 0) return difference;
    }
    const difference = mode === "ndps" ? normalized(right) - normalized(left)
      : (Number(right.X ?? right.dps) || 0) - (Number(left.X ?? left.dps) || 0);
    if (difference !== 0) return difference;
    const rank = Number(left.rank || 0) - Number(right.rank || 0);
    if (rank !== 0) return rank;
    return Number(left.S ?? left.serverId) - Number(right.S ?? right.serverId)
      || String(left.N ?? left.name ?? "").localeCompare(String(right.N ?? right.name ?? ""));
  }

  function selector(minimum, maximum, dungeonKey) {
    const groups = new Map();
    const modes = dungeonKey === "nightmare-atheron-10" ? ["time"]
      : dungeonKey === "training-dummy-60s" ? ["dps"] : ["dps", "ndps"];
    let ordinal = 0;
    return {
      add(bucket) {
        if (!(Number(bucket.K) >= minimum && Number(bucket.K) <= maximum)) return;
        const key = JSON.stringify([Number(bucket.B) || 0, Number(bucket.M), String(bucket.J || "")]);
        let group = groups.get(key);
        if (!group) groups.set(key, group = modes.map(mode => ({ mode, rows: [] })));
        const header = { ...bucket, L: [] };
        for (const player of Array.isArray(bucket.L) ? bucket.L : []) {
          const name = String(player.N || ""), serverId = Number(player.S) || 0;
          if (!name || serverId <= 0) continue;
          const candidate = { player, bucket: header, ordinal: ordinal++, identity: String(player.G || `${serverId}:${name}`) };
          for (const { mode, rows } of group) {
            if (mode === "ndps" && normalized(player) <= 0) continue;
            if (rows.length === 20 && compare(player, rows[19].player, mode) >= 0) continue;
            const previous = rows.findIndex(row => row.identity === candidate.identity);
            if (previous >= 0) {
              if (!(compare(player, rows[previous].player, mode) < 0)) continue;
              rows.splice(previous, 1);
            }
            const at = rows.findIndex(row => compare(player, row.player, mode) < 0);
            rows.splice(at < 0 ? rows.length : at, 0, candidate);
            if (rows.length > 20) rows.pop();
          }
        }
      },
      finish() {
        const selected = new Map();
        for (const group of groups.values()) for (const { rows } of group)
          for (const row of rows) selected.set(row.ordinal, row);
        const buckets = new Map();
        for (const row of [...selected.values()].sort((a, b) => a.ordinal - b.ordinal)) {
          let bucket = buckets.get(row.bucket);
          if (!bucket) buckets.set(row.bucket, bucket = { ...row.bucket, L: [] });
          bucket.L.push(row.player);
        }
        return [...buckets.values()];
      },
    };
  }

  async function read(chunks, options) {
    const selected = selector(options.minimum, options.maximum, options.dungeonKey);
    let prefix = "", suffix = "", item = "", phase = 0, depth = 0, quoted = false, escaped = false;
    let expectItem = true, hasItem = false;
    for await (let chunk of chunks) {
      if (phase === 0) {
        prefix += chunk;
        const match = /"rankBuckets"\s*:\s*\[/.exec(prefix);
        if (!match) {
          if (prefix.length > 1048576) throw new Error("Invalid CP rank header");
          continue;
        }
        const end = match.index + match[0].length;
        chunk = prefix.slice(end);
        prefix = prefix.slice(0, end);
        phase = 1;
      }
      if (phase === 2) {
        suffix += chunk;
        if (suffix.length > 1048576) throw new Error("Invalid CP rank footer");
        continue;
      }
      let start = depth ? 0 : -1;
      for (let index = 0; index < chunk.length; index++) {
        const code = chunk.charCodeAt(index);
        if (!depth) {
          if (code === 32 || code === 10 || code === 13 || code === 9) continue;
          if (code === 93) {
            if (expectItem && hasItem) throw new Error("Invalid CP rank array");
            suffix = chunk.slice(index);
            phase = 2;
            break;
          }
          if (code === 44 && !expectItem) { expectItem = true; continue; }
          if (code !== 123 || !expectItem) throw new Error("Invalid CP rank bucket");
          start = index; depth = 1; expectItem = false; hasItem = true;
          continue;
        }
        if (quoted) {
          if (escaped) escaped = false;
          else if (code === 92) escaped = true;
          else if (code === 34) quoted = false;
        } else if (code === 34) quoted = true;
        else if (code === 123) depth++;
        else if (code === 125 && --depth === 0) {
          selected.add(JSON.parse(item + chunk.slice(start, index + 1)));
          item = ""; start = -1;
        }
      }
      if (start >= 0) item += chunk.slice(start);
      if (item.length > 8388608) throw new Error("CP rank bucket too large");
    }
    if (phase === 0) return JSON.parse(prefix);
    if (phase !== 2 || depth || quoted) throw new Error("Incomplete CP rank cache");
    const result = JSON.parse(prefix + suffix);
    result.rankBuckets = selected.finish();
    return result;
  }

  globalThis.NotMeterCpRankReader = { read, selector };
  if (typeof WorkerGlobalScope === "undefined" || !(globalThis instanceof WorkerGlobalScope)) return;
  globalThis.onmessage = async ({ data }) => {
    const controller = new AbortController();
    let timeout, lastProgress = 0;
    const touch = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => controller.abort(), data.idleTimeout);
      if (Date.now() - lastProgress > 1000) {
        postMessage({ progress: true });
        lastProgress = Date.now();
      }
    };
    try {
      touch();
      const response = await fetch(data.url, { cache: data.force ? "reload" : "no-cache",
        headers: { Accept: "application/gzip, application/json" }, signal: controller.signal });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const input = response.body.getReader();
      const leading = [];
      let leadingSize = 0;
      while (leadingSize < 2) {
        const next = await input.read();
        if (next.done) break;
        if (next.value.length) { leading.push(next.value); leadingSize += next.value.length; }
        touch();
      }
      const stream = new ReadableStream({
        start(target) { for (const bytes of leading) target.enqueue(bytes); },
        async pull(target) {
          try {
            const next = await input.read();
            touch();
            if (next.done) target.close(); else target.enqueue(next.value);
          } catch (error) { target.error(error); }
        },
        cancel(reason) { return input.cancel(reason); },
      });
      const decoded = leading[0]?.[0] === 31 && (leading[0]?.[1] ?? leading[1]?.[0]) === 139
        ? stream.pipeThrough(new DecompressionStream("gzip")) : stream;
      const result = await read(decoded.pipeThrough(new TextDecoderStream()), data);
      postMessage({ result });
    } catch (error) {
      postMessage({ error: String(error.message || error) });
    } finally {
      clearTimeout(timeout);
    }
  };
})();
