import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { gunzipSync, gzipSync } from 'node:zlib';
import { pathToFileURL } from 'node:url';

export const MAX_PAGES_ARTIFACT_BYTES = 1_000_000_000;
export const MAX_GENERATION_BYTES = MAX_PAGES_ARTIFACT_BYTES;
const REPOSITORY = 'Not4You-Dev/NotMeter-Cache';
const POINTER = 'data/client/notmeter-ranking-latest.json';
const WEB_POINTER = 'data/notmeter-ranking-latest.json';
const INVENTORY = 'cache-inventory.json';
const PAGES = 'https://not4you-dev.github.io/NotMeter-Cache';
const digest = bytes => createHash('sha256').update(bytes).digest('hex');
const GAME_CATALOG_LOCALES = ['ja-JP', 'de-DE', 'fr-FR', 'es-ES', 'pt-BR', 'ru-RU'];
const CATALOG_REVISION_MARKER = '__NOTMETER_GAME_CATALOG_REVISION__';
const RETENTION = 'data/cache-generation-retention.json';

export function previousGeneration(request, publicPointer, retention) {
  const candidate = publicPointer?.release?.generation !== request.generation ? publicPointer : retention?.previous;
  if (!candidate || candidate.release?.generation === request.generation) return null;
  if (candidate.storage !== 'github-pages-artifact-v1' || !/^[0-9a-f]{40}$/.test(candidate.revision || '') ||
      !/^[a-f0-9]{16}$/.test(candidate.release?.generation || '') ||
      !/^notmeter-cache-[ab]$/.test(candidate.release?.tag || '')) throw Error('Invalid retained generation');
  return candidate;
}

export async function prepareSite(source, root, revision) {
  if (!/^[0-9a-f]{40}$/.test(revision || '')) throw Error('Invalid site source revision');
  const catalogs = new Set(GAME_CATALOG_LOCALES.map(locale => `assets/locales/${locale}.game.json`));
  let externalBytes = 0;
  for (const relative of catalogs) {
    const file = path.join(source, relative);
    if (!(await fs.lstat(file)).isFile()) throw Error(`Invalid game catalog file: ${relative}`);
    const bytes = await fs.readFile(file);
    const catalog = JSON.parse(bytes);
    if (catalog.locale !== path.basename(relative, '.game.json') || !catalog.names)
      throw Error(`Invalid game catalog: ${relative}`);
    externalBytes += bytes.length;
  }
  const script = await fs.readFile(path.join(source, 'assets/i18n.js'), 'utf8');
  if (script.split(CATALOG_REVISION_MARKER).length !== 2) throw Error('Game catalog loader revision marker missing');
  await fs.cp(source, root, { recursive: true, dereference: false,
    filter: file => !catalogs.has(path.relative(source, file).split(path.sep).join('/')),
  });
  await fs.writeFile(path.join(root, 'assets/i18n.js'), script.replace(CATALOG_REVISION_MARKER, revision));
  // The unchanged dictionaries remain available in the exact source commit.
  for (const entry of await fs.readdir(root, { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith('.html')) continue;
    const file = path.join(root, entry.name);
    const html = await fs.readFile(file, 'utf8');
    await fs.writeFile(file, html.replace(/(src=["']\.\/assets\/i18n\.js)(?:\?[^"']*)?(["'])/g,
      `$1?v=catalog-${revision}$2`));
  }
  console.log(`Game catalogs pinned: revision=${revision} files=${catalogs.size} bytes=${externalBytes}`);
  return { files: catalogs.size, externalBytes };
}

export function safePath(value) {
  if (typeof value !== 'string' || !/^(data\/[a-zA-Z0-9_./-]+|cache-inventory\.json)$/.test(value) ||
      value.split('/').some(part => !part || part === '.' || part === '..')) throw Error('Unsafe cache path');
  return value;
}

export function validateInventory(inventory, generation) {
  if (inventory.schema !== 'notmeter-cache-inventory-v1' || inventory.version !== 1 ||
      inventory.generation !== generation || !Array.isArray(inventory.files) || !inventory.files.length ||
      inventory.files.length > 1000) throw Error('Invalid cache inventory');
  const paths = new Set();
  let total = 0;
  for (const entry of inventory.files) {
    safePath(entry.path);
    if (paths.has(entry.path.toLowerCase()) || !Number.isSafeInteger(entry.size) || entry.size < 1 ||
        entry.size > 100 * 1024 * 1024 || !/^[0-9a-f]{64}$/.test(entry.sha256)) throw Error('Invalid inventory entry');
    paths.add(entry.path.toLowerCase());
    total += entry.size;
  }
  if (total > MAX_GENERATION_BYTES || !paths.has('data/notmeter-ranking.json.gz') ||
      !paths.has('data/client/notmeter-ranking.json')) throw Error('Incomplete or oversized cache generation');
  return inventory.files;
}

export function validateBytes(bytes, entry) {
  if (bytes.length !== entry.size || digest(bytes) !== entry.sha256) throw Error(`Cache checksum mismatch: ${entry.path}`);
}

function assetName(generation, relativePath) {
  return `g-${generation}-p-${Buffer.from(safePath(relativePath)).toString('base64url')}`;
}

export async function download(url, maximum, api = false, {
  fetchImpl = fetch,
  delay = ms => new Promise(resolve => setTimeout(resolve, ms)),
} = {}) {
  const headers = api ? { Accept: 'application/vnd.github+json', Authorization: `Bearer ${process.env.GH_TOKEN}` } : {};
  const attempts = 4;
  for (let attempt = 1; attempt <= attempts; attempt++) {
    let retryAfter = 0;
    try {
      const response = await fetchImpl(url, { headers, signal: AbortSignal.timeout(180000) });
      if (!response.ok) {
        await response.body?.cancel();
        const error = Error(`Download HTTP ${response.status}: ${new URL(url).pathname}`);
        error.retryable = [408, 429, 500, 502, 503, 504].includes(response.status);
        const value = response.headers.get('retry-after');
        retryAfter = value === null ? 0 : /^\d+$/.test(value)
          ? Number(value) * 1000 : Date.parse(value) - Date.now();
        throw error;
      }
      if (Number(response.headers.get('content-length')) > maximum) {
        await response.body?.cancel();
        throw Error('Oversized download');
      }
      const chunks = [];
      let size = 0;
      for await (const chunk of response.body) {
        size += chunk.length;
        if (size > maximum) throw Error('Oversized download stream');
        chunks.push(chunk);
      }
      return Buffer.concat(chunks);
    } catch (error) {
      const transient = error.retryable || error instanceof TypeError ||
        error.name === 'TimeoutError' || error.name === 'AbortError';
      if (!transient || attempt === attempts) throw error;
      const waitMs = Math.min(30000, Math.max(1000 * 2 ** (attempt - 1), Number.isFinite(retryAfter) ? retryAfter : 0));
      console.warn(`Cache download retry ${attempt}/${attempts - 1}: ${new URL(url).pathname} wait=${waitMs}ms (${error.message})`);
      await delay(waitMs);
    }
  }
}

async function write(root, relativePath, bytes) {
  const destination = path.join(root, safePath(relativePath));
  await fs.mkdir(path.dirname(destination), { recursive: true });
  await fs.writeFile(destination, bytes);
}

export async function publishedGenerationReader(pointer, fetchBytes = download) {
  const generation = pointer?.release?.generation;
  const base = `${PAGES}/g/${generation}`;
  if (pointer?.schema !== 'notmeter-cache-generation-v1' || pointer.version !== 1 ||
      pointer.storage !== 'github-pages-artifact-v1' || !/^[0-9a-f]{16}$/.test(generation || '') ||
      !/^[0-9a-f]{40}$/.test(pointer.revision || '') || !/^notmeter-cache-[ab]$/.test(pointer.release?.tag || '') ||
      pointer.pagesRoot !== base) throw Error('Invalid published generation');
  const inventoryBytes = await fetchBytes(`${base}/${INVENTORY}`, 1024 * 1024);
  const entries = validateInventory(JSON.parse(inventoryBytes), generation);
  const byPath = new Map(entries.map(entry => [entry.path, entry]));
  return async (relativePath, maximum) => {
    safePath(relativePath);
    if (relativePath === INVENTORY) return inventoryBytes;
    if (relativePath === POINTER || relativePath === WEB_POINTER) return Buffer.from(JSON.stringify(pointer));
    const entry = byPath.get(relativePath);
    if (!entry || entry.size > maximum) throw Error(`Unverified published file: ${relativePath}`);
    const bytes = await fetchBytes(`${base}/${relativePath}`, entry.size);
    validateBytes(bytes, entry);
    return bytes;
  };
}

async function assemble(root, request, published = null) {
  const { tag, generation } = request;
  if (!/^notmeter-cache-[ab]$/.test(tag) || !/^[0-9a-f]{12,64}$/.test(generation)) throw Error('Invalid release selection');
  let readAsset;
  if (published) {
    readAsset = await publishedGenerationReader(published);
  } else {
    const release = JSON.parse(await download(`https://api.github.com/repos/${REPOSITORY}/releases/tags/${tag}`, 4 * 1024 * 1024, true));
    const assets = [];
    for (let page = 1; page <= 11; page++) {
      const batch = JSON.parse(await download(`https://api.github.com/repos/${REPOSITORY}/releases/${release.id}/assets?per_page=100&page=${page}`, 4 * 1024 * 1024, true));
      assets.push(...batch);
      if (batch.length < 100) break;
    }
    const byName = new Map(assets.map(asset => [asset.name, asset]));
    readAsset = async (relativePath, maximum) => {
      const asset = byName.get(assetName(generation, relativePath));
      if (!asset || asset.state !== 'uploaded' || asset.size > maximum || !/^sha256:[0-9a-f]{64}$/.test(asset.digest))
        throw Error(`Unverified release asset: ${relativePath}`);
      const url = `https://github.com/${REPOSITORY}/releases/download/${tag}/${encodeURIComponent(asset.name)}`;
      const bytes = await download(url, maximum);
      validateBytes(bytes, { path: relativePath, size: asset.size, sha256: asset.digest.slice(7) });
      return bytes;
    };
  }
  const inventoryBytes = await readAsset(INVENTORY, 1024 * 1024);
  const entries = validateInventory(JSON.parse(inventoryBytes), generation);
  const pointerBytes = await readAsset(POINTER, 16384);
  const pointer = JSON.parse(pointerBytes);
  if (pointer.schema !== 'notmeter-cache-generation-v1' || pointer.version !== 1 ||
      pointer.storage !== 'github-pages-artifact-v1' || pointer.release?.generation !== generation ||
      pointer.release?.tag !== tag || pointer.revision !== request.revision ||
      !/^[0-9a-f]{40}$/.test(pointer.revision) ||
      pointer.pagesRoot !== `${PAGES}/g/${generation}`) throw Error('Invalid generation pointer');
  if (!(await readAsset(WEB_POINTER, 16384)).equals(pointerBytes)) throw Error('Cache pointers differ');
  const destination = path.join(root, 'g', generation);
  let main;
  const pending = [...entries];
  await Promise.all(Array.from({ length: 4 }, async () => {
    while (pending.length) {
      const entry = pending.shift();
      const bytes = await readAsset(entry.path, entry.size);
      validateBytes(bytes, entry);
      if (entry.path === 'data/notmeter-ranking.json.gz') main = JSON.parse(gunzipSync(bytes, { maxOutputLength: 1024 * 1024 * 1024 }));
      await write(destination, entry.path, bytes);
    }
  }));
  if (main.schema !== 'notmeter-web-ranking-v1' || !Number.isFinite(Date.parse(main.generatedAt))) throw Error('Invalid web cache');
  for (const [dungeonKey, classRanking] of Object.entries(main.classRankings || {})) {
    if (!/^[a-z0-9_-]{1,64}$/.test(dungeonKey)) throw Error('Invalid dungeon key');
    if (entries.some(entry => entry.path === `data/classes/${dungeonKey}.json.gz`)) continue;
    await write(destination, `data/classes/${dungeonKey}.json.gz`, gzipSync(JSON.stringify({
      schema: 'notmeter-web-class-ranking-v1', version: 1, generatedAt: main.generatedAt, dungeonKey, classRanking,
    })));
  }
  for (const dungeonKey of new Set((main.views || []).map(view => view.dungeonKey))) {
    if (!/^[a-z0-9_-]{1,64}$/.test(dungeonKey)) throw Error('Invalid view dungeon key');
    if (entries.some(entry => entry.path === `data/views/${dungeonKey}.json.gz`)) continue;
    await write(destination, `data/views/${dungeonKey}.json.gz`, gzipSync(JSON.stringify({
      schema: 'notmeter-web-view-ranking-v1', version: 1, generatedAt: main.generatedAt, dungeonKey,
      views: main.views.filter(view => view.dungeonKey === dungeonKey),
    })));
  }
  await write(destination, INVENTORY, inventoryBytes);
  console.log(`Verified generation=${generation} files=${entries.length} generatedAt=${main.generatedAt}`);
  return pointerBytes;
}

async function treeSize(root) {
  let bytes = 0;
  for (const entry of await fs.readdir(root, { withFileTypes: true })) {
    const target = path.join(root, entry.name);
    if (entry.isSymbolicLink()) throw Error('Symbolic links are prohibited');
    bytes += entry.isDirectory() ? await treeSize(target) : (await fs.stat(target)).size;
  }
  return bytes;
}

export function validateArtifactSize(bytes) {
  if (!Number.isSafeInteger(bytes) || bytes < 1) throw Error('Invalid Pages artifact size');
  if (bytes > MAX_PAGES_ARTIFACT_BYTES)
    throw Error(`Pages artifact exceeds GitHub Pages 1 GB limit: bytes=${bytes} limit=${MAX_PAGES_ARTIFACT_BYTES}`);
}

async function main() {
  if (process.env.GITHUB_REPOSITORY !== REPOSITORY) throw Error('Wrong publishing repository');
  const request = JSON.parse(await fs.readFile('.cache/deploy.json', 'utf8'));
  const root = path.resolve('_site');
  try { await fs.access(root); throw Error('Output directory already exists'); }
  catch (error) { if (error.code !== 'ENOENT') throw error; }
  await prepareSite(path.resolve('site'), root, process.env.GITHUB_SHA);
  let previous;
  const previousResponse = await fetch(`${PAGES}/${POINTER}?v=${Date.now()}`, { signal: AbortSignal.timeout(30000) });
  if (previousResponse.ok) previous = await previousResponse.json();
  else if (previousResponse.status !== 404) throw Error('Cannot verify previous public generation');
  let retention;
  const retainedResponse = await fetch(`${PAGES}/${RETENTION}?v=${Date.now()}`, { signal: AbortSignal.timeout(30000) });
  if (retainedResponse.ok) retention = await retainedResponse.json();
  else if (retainedResponse.status !== 404) throw Error('Cannot verify retained generation');
  else {
    try { retention = JSON.parse(await fs.readFile('.cache/retained-generation.json', 'utf8')); }
    catch (error) { if (error.code !== 'ENOENT') throw error; }
  }
  const retained = previousGeneration(request, previous, retention);
  if (retained) {
    await assemble(root, { ...retained.release, revision: retained.revision }, retained);
  }
  const pointer = await assemble(root, request);
  await write(root, POINTER, pointer);
  await write(root, WEB_POINTER, pointer);
  await write(root, RETENTION, Buffer.from(JSON.stringify({ current: JSON.parse(pointer), previous: retained })));
  const bytes = await treeSize(root);
  console.log(`Pages artifact size=${bytes} bytes budget=${MAX_PAGES_ARTIFACT_BYTES} bytes`);
  validateArtifactSize(bytes);
  await fs.writeFile(path.join(root, '.nojekyll'), '');
  console.log(`Ready for atomic Pages deployment: ${bytes} bytes`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  main().catch(error => { console.error(error.message); process.exitCode = 1; });
}
