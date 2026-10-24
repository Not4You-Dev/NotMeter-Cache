(() => {
  "use strict";
  const regions = ["as", "naw", "nae", "eu", "la"];
  const languages = ["ko", "en", "zh-TW", "ja-JP", "de-DE", "fr-FR", "es-ES", "pt-BR", "ru-RU"];
  const sounds = {
    classic: { wave: "sine", notes: [[0, 659.25, .7, 1], [.22, 880, .7, 1]] },
    bell: { wave: "sine", notes: [[0, 880, 1.15, 1], [0, 1760, .55, .25]] },
    chime: { wave: "sine", notes: [[0, 783.99, .65, .8], [.25, 659.25, .65, .8], [.5, 523.25, .8, .8]] },
    melody: { wave: "triangle", notes: [[0, 523.25, .22, .8], [.18, 659.25, .22, .8], [.36, 783.99, .22, .8], [.54, 1046.5, .65, .8]] },
    radar: { wave: "sine", notes: [[0, 1174.66, .2, .8], [.4, 1174.66, .2, .8], [.8, 1174.66, .2, .8]] },
    signal: { wave: "square", notes: [[0, 739.99, .16, .35], [.22, 987.77, .16, .35], [.44, 739.99, .25, .35]] },
  };
  const id = item => `${item.service}:${item.region || ""}:${item.serverId}:${item.code}`;
  const names = value => Object.fromEntries(languages.filter(key => typeof value?.[key] === "string").map(key => [key, value[key].slice(0, 160)]));
  function selection(value) {
    if (!value || !["KR", "TW", "WW"].includes(value.service) ||
        (value.service === "WW" && !regions.includes(value.region)) ||
        !Number.isSafeInteger(value.serverId) || value.serverId <= 0 ||
        !Number.isSafeInteger(value.code) || value.code <= 0 || !Number.isSafeInteger(value.mapId)) return null;
    return { service: value.service, region: value.service === "WW" ? value.region : "", serverId: value.serverId,
      code: value.code, mapId: value.mapId, names: names(value.names), serverNames: names(value.serverNames),
      targetAt: Number(value.targetAt) || 0, observedAt: Number(value.observedAt) || 0, generatedAt: Number(value.generatedAt) || 0,
      spawned: value.spawned === true };
  }
  function settings(value) {
    const entries = new Map();
    for (const raw of Array.isArray(value?.entries) ? value.entries.slice(0, 512) : []) {
      const entry = selection(raw);
      if (entry) entries.set(id(entry), entry);
    }
    const minutes = [...new Set((Array.isArray(value?.minutes) ? value.minutes : [5, 0]).filter(minute => [10, 5, 1, 0].includes(minute)))];
    return { version: 1, enabled: value?.enabled === true, sound: value?.sound !== false, desktop: value?.desktop === true,
      soundId: typeof value?.soundId === "string" && Object.hasOwn(sounds, value.soundId) ? value.soundId : "classic",
      volume: Number.isFinite(value?.volume) ? Math.max(0, Math.min(1, value.volume)) : .3,
      compact: value?.compact !== false,
      hidden: value?.hidden === true,
      position: Number.isFinite(value?.position?.x) && Number.isFinite(value?.position?.y)
        ? { x: Math.max(0, Math.min(1, value.position.x)), y: Math.max(0, Math.min(1, value.position.y)) } : null,
      minutes: minutes.length ? minutes : [5, 0], side: value?.side === "left" ? "left" : "right", entries: [...entries.values()] };
  }
  const formatters = new Map();
  function parts(epoch, zone) {
    if (!formatters.has(zone)) formatters.set(zone, new Intl.DateTimeFormat("en-GB", {
      timeZone: zone, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23",
    }));
    return Object.fromEntries(formatters.get(zone).formatToParts(epoch).filter(p => p.type !== "literal").map(p => [p.type, Number(p.value)]));
  }
  function wallTimeToUtc(day, minute, zone) {
    const wall = day + minute * 60000, offsets = new Set(), matches = [];
    for (const hours of [-36, 0, 36]) {
      const probe = wall + hours * 3600000, p = parts(probe, zone);
      offsets.add(Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second) - probe);
    }
    for (const offset of offsets) {
      const epoch = wall - offset, p = parts(epoch, zone);
      if (Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute) === wall) matches.push(epoch);
    }
    return matches.length ? Math.min(...matches) : null;
  }
  function nextSpawn(schedule, now, zone = schedule?.timeZone) {
    if (!schedule) return null;
    const p = parts(now, zone), today = Date.UTC(p.year, p.month - 1, p.day);
    for (let ahead = 0; ahead <= 8; ahead++) {
      const day = today + ahead * 86400000;
      if (!schedule.weekdays.includes(new Date(day).getUTCDay())) continue;
      for (let minute = schedule.startMinute; minute < 1440; minute += schedule.intervalMinutes || 1440) {
        const epoch = wallTimeToUtc(day, minute, zone);
        if (epoch !== null && epoch > now) return epoch;
      }
    }
    return null;
  }
  function scheduleFor(entry) {
    if (entry.service === "WW") {
      const catalog = globalThis.NotMeterGlobalFieldBossCatalog;
      const service = catalog?.serviceRegions.find(region => region.key === entry.region);
      const boss = catalog?.maps.find(map => map.mapId === entry.mapId)?.bosses.find(boss => boss.code === entry.code);
      return boss?.schedule && service ? { ...boss.schedule, timeZone: service.timeZone } : null;
    }
    const schedule = globalThis.NotMeterFieldBossFixedSchedules?.[entry.code];
    if (!schedule || (entry.service === "TW" && entry.code === 2600089)) return null;
    let startMinute = schedule.koreaStartHour * 60 + (schedule.koreaStartMinute || 0);
    if (schedule.weekdays) {
      const base = schedule.weekdays.includes(5) ? 22 * 60 : 21 * 60 + 45;
      const group = (globalThis.NotMeterAbyssServerGroups || []).findIndex(ids => ids.includes(entry.serverId));
      if (entry.service === "KR" && group < 0) return null;
      startMinute = base + (entry.service === "KR" ? group * 30 : 0);
    }
    return { timeZone: entry.service === "TW" ? "Asia/Taipei" : "Asia/Seoul", startMinute,
      weekdays: schedule.weekdays || [0, 1, 2, 3, 4, 5, 6], intervalMinutes: (schedule.intervalHours || 0) * 60 };
  }
  const targetCache = new Map();
  function target(entry, now, includeRecent = false) {
    const schedule = scheduleFor(entry);
    if (schedule) {
      const at = now - (includeRecent ? 90001 : 0), key = `${id(entry)}:${includeRecent}:${JSON.stringify(schedule)}`;
      const cached = targetCache.get(key);
      if (cached && at >= cached.from && at < cached.time) return cached.time;
      const time = nextSpawn(schedule, at);
      if (targetCache.size > 2048) targetCache.clear();
      targetCache.set(key, { from: at, time }); return time;
    }
    if (entry.spawned || !Number.isSafeInteger(entry.targetAt) || entry.targetAt <= 0 ||
        entry.targetAt > now + 14 * 86400000 || entry.observedAt > now + 300000 || now - entry.observedAt > 86400000) return null;
    return entry.targetAt;
  }
  function due(config, ledger, since, now) {
    if (!config.enabled || now < since) return [];
    const result = [], earliest = Math.max(since, now - 90000);
    for (const entry of config.entries) {
      const time = target(entry, now, true);
      if (!time) continue;
      const candidates = config.minutes.map(minute => ({ entry, minute, time, dueAt: time - minute * 60000 }))
        .filter(event => event.dueAt > earliest && event.dueAt <= now)
        .sort((a, b) => b.dueAt - a.dueAt);
      for (const event of candidates.slice(0, 1)) {
        const sent = ledger[`${id(entry)}:${event.minute}`];
        if (sent && Math.abs(Number(sent.targetAt) - time) < 120000 && now - Number(sent.sentAt) < 86400000) continue;
        result.push(event);
      }
    }
    return result;
  }
  function cacheGroup(entry) { return entry.service === "WW" ? `WW:${entry.region}` : entry.service; }
  function cacheUrl(group, legacy = false) {
    if (!["KR", "TW", ...regions.map(region => `WW:${region}`)].includes(group)) throw new Error("Invalid region");
    const region = group.split(":")[1];
    const suffix = group === "KR" ? "" : group === "TW" ? "-tw" : `-ww-${region}${!legacy && ["as", "nae", "eu"].includes(region) ? "-expanded" : ""}`;
    return `https://raw.githubusercontent.com/Not4You-Dev/NotMeter-Cache/main/presence/notmeter-field-boss-public${suffix}.json`;
  }
  function validateCache(cache, group, now) {
    const global = group.startsWith("WW:");
    if (!cache || cache.schema !== (global ? "notmeter-global-field-boss-public-cache-v1" : "notmeter-field-boss-public-cache-v1") ||
        Number(cache.version) !== 1 || (cache.serviceRegion || "KR") !== group.split(":")[0] ||
        (global && cache.globalRegion !== group.split(":")[1]) || !Number.isSafeInteger(cache.generatedAt) ||
        cache.generatedAt <= 0 || cache.generatedAt * 1000 > now + 300000 || !Array.isArray(cache.servers) || cache.servers.length > 256) throw new Error("Invalid boss cache");
    for (const server of cache.servers) {
      const maps = global ? server?.maps : server?.regions;
      if (!Number.isSafeInteger(server?.serverId) || !Array.isArray(maps) || maps.length > 6) throw new Error("Invalid boss server");
      for (const map of maps) {
        if (!Number.isSafeInteger(global ? map?.mapId : map?.region) || !Array.isArray(map?.entries) || map.entries.length > 256 ||
            map.entries.some(record => !record || !Number.isSafeInteger(record.bossCode))) throw new Error("Invalid boss map");
      }
    }
    return cache;
  }
  function observation(cache, entry, now) {
    validateCache(cache, cacheGroup(entry), now);
    if (cache.generatedAt < entry.generatedAt) return null;
    const server = cache.servers.find(server => server.serverId === entry.serverId);
    const global = entry.service === "WW";
    const map = (global ? server?.maps : server?.regions)?.find(map => (global ? map.mapId : map.region) === entry.mapId);
    const boss = globalThis.NotMeterGlobalFieldBossCatalog?.maps.find(map => map.mapId === entry.mapId)?.bosses.find(boss => boss.code === entry.code);
    const aliases = globalThis.NotMeterFieldBossAliases || {};
    let record = global ? map?.entries?.find(record => boss?.codes.includes(record.bossCode) || record.bossCode === entry.code) :
      map?.entries?.find(record => record.bossCode === entry.code) ||
      map?.entries?.find(record => Number(aliases[record.bossCode]) === entry.code);
    if (entry.service === "KR" && entry.code === 2600068 &&
        ![2600097, 2600098].every(code => map?.entries.some(record => record.bossCode === code))) record = null;
    const observedAt = Number(map?.observedAt) * 1000;
    const time = Number(record?.targetAt);
    if (!record || !Number.isSafeInteger(time) || time <= 0 || time > now + 14 * 86400000 ||
        !Number.isSafeInteger(observedAt) || observedAt <= 0 || observedAt > cache.generatedAt * 1000 || observedAt > now + 300000) {
      return { targetAt: 0, observedAt: 0, generatedAt: cache.generatedAt, spawned: false };
    }
    const hold = !global && !scheduleFor(entry) && observedAt <= entry.observedAt && entry.targetAt > now && Math.abs(time - entry.targetAt) >= 600000;
    return { targetAt: hold ? entry.targetAt : time, observedAt, generatedAt: cache.generatedAt, spawned: record.spawned === true };
  }
  globalThis.NotMeterBossAlertCore = { id, settings, sounds, selection, nextSpawn, wallTimeToUtc, scheduleFor, target, due, cacheGroup, cacheUrl, validateCache, observation };
})();
