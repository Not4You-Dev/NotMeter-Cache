import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { gunzipSync, gzipSync } from 'node:zlib';
import { pathToFileURL } from 'node:url';

export const MAX_GENERATION_BYTES = 400 * 1024 * 1024;
const REPOSITORY = 'Not4You-Dev/NotMeter-Cache';
const POINTER = 'data/client/notmeter-ranking-latest.json';
const WEB_POINTER = 'data/notmeter-ranking-latest.json';
const INVENTORY = 'cache-inventory.json';
const PAGES = 'https://not4you-dev.github.io/NotMeter-Cache';
const digest = bytes => createHash('sha256').update(bytes).digest('hex');

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

async function download(url, maximum, api = false) {
  const headers = api ? { Accept: 'application/vnd.github+json', Authorization: `Bearer ${process.env.GH_TOKEN}` } : {};
  const response = await fetch(url, { headers, signal: AbortSignal.timeout(180000) });
  if (!response.ok) throw Error(`Download HTTP ${response.status}: ${new URL(url).pathname}`);
  if (Number(response.headers.get('content-length')) > maximum) throw Error('Oversized download');
  const chunks = [];
  let size = 0;
  for await (const chunk of response.body) {
    size += chunk.length;
    if (size > maximum) throw Error('Oversized download stream');
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

async function write(root, relativePath, bytes) {
  const destination = path.join(root, safePath(relativePath));
  await fs.mkdir(path.dirname(destination), { recursive: true });
  await fs.writeFile(destination, bytes);
}

async function assemble(root, request) {
  const { tag, generation } = request;
  if (!/^notmeter-cache-[ab]$/.test(tag) || !/^[0-9a-f]{12,64}$/.test(generation)) throw Error('Invalid release selection');
  const release = JSON.parse(await download(`https://api.github.com/repos/${REPOSITORY}/releases/tags/${tag}`, 4 * 1024 * 1024, true));
  const assets = [];
  for (let page = 1; page <= 11; page++) {
    const batch = JSON.parse(await download(`https://api.github.com/repos/${REPOSITORY}/releases/${release.id}/assets?per_page=100&page=${page}`, 4 * 1024 * 1024, true));
    assets.push(...batch);
    if (batch.length < 100) break;
  }
  const byName = new Map(assets.map(asset => [asset.name, asset]));
  async function readAsset(relativePath, maximum) {
    const asset = byName.get(assetName(generation, relativePath));
    if (!asset || asset.state !== 'uploaded' || asset.size > maximum || !/^sha256:[0-9a-f]{64}$/.test(asset.digest))
      throw Error(`Unverified release asset: ${relativePath}`);
    const url = `https://github.com/${REPOSITORY}/releases/download/${tag}/${encodeURIComponent(asset.name)}`;
    const bytes = await download(url, maximum);
    validateBytes(bytes, { path: relativePath, size: asset.size, sha256: asset.digest.slice(7) });
    return bytes;
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
    await write(destination, `data/classes/${dungeonKey}.json.gz`, gzipSync(JSON.stringify({
      schema: 'notmeter-web-class-ranking-v1', version: 1, generatedAt: main.generatedAt, dungeonKey, classRanking,
    })));
  }
  for (const dungeonKey of new Set((main.views || []).map(view => view.dungeonKey))) {
    if (!/^[a-z0-9_-]{1,64}$/.test(dungeonKey)) throw Error('Invalid view dungeon key');
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

async function main() {
  if (process.env.GITHUB_REPOSITORY !== REPOSITORY) throw Error('Wrong publishing repository');
  const request = JSON.parse(await fs.readFile('.cache/deploy.json', 'utf8'));
  const root = path.resolve('_site');
  try { await fs.access(root); throw Error('Output directory already exists'); }
  catch (error) { if (error.code !== 'ENOENT') throw error; }
  await fs.cp('site', root, { recursive: true, dereference: false });
  let previous;
  const previousResponse = await fetch(`${PAGES}/${POINTER}?v=${Date.now()}`, { signal: AbortSignal.timeout(30000) });
  if (previousResponse.ok) previous = await previousResponse.json();
  else if (previousResponse.status !== 404) throw Error('Cannot verify previous public generation');
  if (previous?.storage === 'github-pages-artifact-v1' && previous.release.generation !== request.generation) {
    await assemble(root, { ...previous.release, revision: previous.revision });
  }
  const pointer = await assemble(root, request);
  await write(root, POINTER, pointer);
  await write(root, WEB_POINTER, pointer);
  const bytes = await treeSize(root);
  if (bytes > 850 * 1024 * 1024) throw Error('Pages artifact exceeds 850 MiB safety budget');
  await fs.writeFile(path.join(root, '.nojekyll'), '');
  console.log(`Ready for atomic Pages deployment: ${bytes} bytes`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  main().catch(error => { console.error(error.message); process.exitCode = 1; });
}
