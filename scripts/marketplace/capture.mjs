/* global process, URL, Buffer, console, fetch, AbortSignal, setTimeout */
// Operator-only source capture. Never writes the content DB or uploads media.
import {readFile, writeFile, mkdir, rename} from 'node:fs/promises';
import {join, resolve} from 'node:path';
import {createHash} from 'node:crypto';
import {runInNewContext} from 'node:vm';
import {pathToFileURL} from 'node:url';
import {extractController, extractTap, extractFeed, extractGallery, extractZoom} from './extractors.mjs';

export const extractors = {controller: extractController, 'trade-a-plane': extractTap};
export const tidy = text => text?.replace(/\s+/g, ' ').trim() || null;
export function stable(value) {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === 'object') return Object.fromEntries(Object.keys(value).sort().map(key => [key, stable(value[key])]));
  return typeof value === 'string' ? tidy(value) : value;
}
export const hash = value => createHash('sha256').update(JSON.stringify(stable(value))).digest('hex');
export function assetIdentity(value) {
  try {
    const url = new URL(value);
    // Barnstormers appends a random numeric cache-buster on each gallery view.
    // The asset pathname already includes the image ID/version timestamp.
    if (url.hostname === 'barnstormers.s3.amazonaws.com' && /^\/media\/listing_images\//.test(url.pathname) && /^\?\d+$/.test(url.search)) { url.search = ''; return url.href; }
    if (url.hostname.endsWith('.cloudfront.net')) return JSON.stringify(stable(JSON.parse(Buffer.from(url.pathname.slice(1), 'base64').toString())));
  } catch { /* Ordinary URLs remain exact identities. */ }
  return value;
}
export function fingerprints(detail) {
  // Audit text includes navigation, advertising and capture times; exclude it.
  const excluded = new Set(['source_text', 'html', 'captured_at', 'checked_at', 'discovery', 'evidence_path', 'url', 'canonical_url', 'links', 'dates', 'images', 'attachments', 'source_id', 'capture_method']);
  const content = Object.fromEntries(Object.entries(detail).filter(([key]) => !excluded.has(key)));
  const documents = detail.attachments || (detail.links || []).filter(link => /\.(?:pdf|docx?|xlsx?)(?:$|\?)/i.test(link.url) || /\/doc\.axd(?:$|\?)/i.test(link.url));
  return {content_hash: hash(content), assets_hash: hash([detail.images || [], documents].map(assets => assets.map(asset => ({url: assetIdentity(asset.source_url || asset.url), caption: asset.caption || asset.text || null}))))};
}
export async function atomicJson(path, value) {
  await mkdir(resolve(path, '..'), {recursive: true});
  const temporary = path + '.tmp';
  await writeFile(temporary, JSON.stringify(value, null, 2), {mode: 0o600});
  await rename(temporary, path);
}
export async function parseCapture(html, url, extractor) {
  // Browser batches don't load the Node DOM parser (the REPL has its own DOM).
  const {parseHTML} = await import('linkedom');
  const {document} = parseHTML(html);
  for (const element of document.querySelectorAll('[href],[src]')) for (const key of ['href', 'src']) {
    const value = element.getAttribute(key);
    if (value) { try { element.setAttribute(key, new URL(value, url).href); } catch { /* Preserve malformed source data for audit. */ } }
  }
  return runInNewContext('(' + extractor.toString() + ')()', {document, location: {href: url}, URL}, {timeout: 5000});
}
export function validateDetail(source, candidate, detail) {
  if (source === 'controller') {
    const observed = detail.url?.match(/\/(?:for-sale|for-fractional-ownership)\/(\d+)/)?.[1];
    if (observed !== candidate.id || !detail.title || !detail.category || !detail.metadata?.Description) throw Error('Incomplete or mismatched Controller source; preserve public status');
  } else if (source === 'trade-a-plane') {
    if (detail.source_id !== candidate.id || !detail.title || !detail.metadata?.sale_status) throw Error('Incomplete or mismatched Trade-A-Plane source; preserve public status');
    const canonical = detail.canonical_url && new URL(detail.canonical_url).searchParams.get('listing_id');
    if (canonical && canonical !== candidate.id) throw Error('Source canonical ID mismatch; preserve public status');
  } else if (source === 'barnstormers') {
    if (detail.source_id !== candidate.id || !detail.title || !detail.description) throw Error('Incomplete or mismatched Barnstormers source; preserve public status');
  } else throw Error('Unknown source');
}

export async function captureBrowser(tab, {source, candidates, directory, minimumIntervalMs = source === 'trade-a-plane' ? 6500 : 500, maximumBatchMs = 45000}) {
  if (!extractors[source]) throw Error('Use direct HTTP for Barnstormers');
  const results = [], began = Date.now();
  const selector = source === 'controller' ? '.detail__category' : '#general_specs';
  for (const candidate of candidates) {
    if (results.length && Date.now() - began >= maximumBatchMs) break;
    const start = Date.now();
    try {
      if (await tab.url() !== candidate.url) await tab.goto(candidate.url);
      const state = await tab.getAXState({emit: false});
      if (/^.{0,300}(?:Just a moment|Rate Limit Exceeded|Access Denied|Forbidden|Service Unavailable)/i.test(state)) throw Error('Source browser access blocked; preserve public status');
      await tab.playwright.locator(selector).waitFor({state: 'attached', timeoutMs: 10000});
      const detail = await tab.playwright.evaluate(extractors[source]);
      validateDetail(source, candidate, detail);
      detail.captured_at = new Date().toISOString();
      detail.discovery = candidate;
      detail.capture_method = 'batched-browser-dom';
      const file = join(directory, 'details', candidate.id + '.json');
      detail.evidence_path = file;
      await atomicJson(file, detail);
      results.push({id: candidate.id, ok: true, ms: Date.now() - start, photos: detail.images.length, documents: detail.attachments?.length || 0, ...fingerprints(detail)});
    } catch (error) {
      const observation = {id: candidate.id, ok: false, state: 'unknown', public_status_action: 'preserve', ms: Date.now() - start, error: error.message};
      await atomicJson(join(directory, 'failures', candidate.id + '.json'), observation);
      results.push(observation);
      // Stop a blocked batch instead of hammering the same source.
      break;
    }
    if (source === 'trade-a-plane' && results.length < candidates.length) {
      const remaining = minimumIntervalMs - (Date.now() - start);
      if (remaining > 0) await new Promise(resolve => setTimeout(resolve, remaining));
    }
  }
  const report = {source, transport: 'browser', at: new Date().toISOString(), elapsed_ms: Date.now() - began, requested: candidates.length, completed: results.filter(r => r.ok).length, results};
  await atomicJson(join(directory, 'capture-report.json'), report);
  return report;
}

export class HttpSource {
  constructor({maximumRequests = 1000, timeoutMs = 20000, request = fetch} = {}) {
    this.maximumRequests = maximumRequests;
    this.timeoutMs = timeoutMs;
    this.requests = 0;
    this.request = request;
    this.cache = new Map();
  }
  async read(url, extractor) {
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:' || parsed.hostname !== 'www.barnstormers.com' || parsed.username || parsed.password) throw Error('Only original Barnstormers HTTPS pages are allowed');
    // Promise cache shares in-flight requests, not just finished ones.
    const key = extractor.name + ':' + url;
    if (this.cache.has(key)) return this.cache.get(key);
    const promise = (async () => {
      if (++this.requests > this.maximumRequests) throw Error('Request budget reached; coverage is incomplete');
      const started = Date.now();
      const response = await this.request(url, {signal: AbortSignal.timeout(this.timeoutMs), redirect: 'manual'});
      // Redirects and HTTP failures are unknown, never disappearance evidence.
      if (response.status !== 200) { await response.body?.cancel(); throw Error('Source HTTP ' + response.status + '; preserve public status'); }
      const html = await response.text();
      if (/just a moment|rate limit exceeded|access denied|px-captcha/i.test(html.slice(0,6000))) throw Error('Source challenge; preserve public status');
      return {url, http_status: 200, elapsed_ms: Date.now() - started, bytes: Buffer.byteLength(html), html, data: await parseCapture(html, url, extractor)};
    })();
    this.cache.set(key, promise);
    return promise;
  }
}
export async function captureBarnstormers(client, candidate, directory, {galleries = true} = {}) {
  const started = Date.now(), evidence = await client.read(candidate.url, extractFeed);
  const detail = evidence.data.items.find(item => item.source_id === candidate.id);
  validateDetail('barnstormers', candidate, detail || {});
  const result = {...detail, captured_at: new Date().toISOString(), url: candidate.url, capture_method: 'direct-source-html', images: [], attachments: detail.links.filter(link => /\/media\/docs\//.test(link.url) || /specification|document|logbook/i.test(link.text))};
  await atomicJson(join(directory, 'browser', 'detail-' + candidate.id + '.json'), {...detail, captured_at: result.captured_at, checked_at: result.captured_at, availability: /^(?:SOLD|SOLD!)(?:\s|$)/i.test(detail.action || '') ? 'sold' : 'available', url: candidate.url});
  await writeFile(join(directory, 'browser', candidate.id + '.html'), evidence.html, {mode: 0o600});
  const galleryLink = detail.links.find(link => link.text === 'View Larger Images');
  if (galleries && galleryLink) {
    const gallery = await client.read(galleryLink.url, extractGallery);
    if (!gallery.data.images.length || !gallery.data.zoom.length) throw Error('Promised gallery incomplete');
    const zoom = await client.read(gallery.data.zoom[0].url, extractZoom);
    if (zoom.data.images.length !== gallery.data.images.length || !zoom.data.images.every(image => new URL(image.url).pathname.includes('_' + candidate.id + '_'))) throw Error('Gallery identity/count mismatch');
    await atomicJson(join(directory, 'browser', 'gallery-' + candidate.id + '.json'), {at: result.captured_at, url: gallery.url, ...gallery.data});
    await atomicJson(join(directory, 'browser', 'zoom-' + candidate.id + '.json'), {at: result.captured_at, url: zoom.url, ...zoom.data});
    result.images = zoom.data.images.map((image,index)=>({...image,caption:gallery.data.images[index]?.caption || null}));
  }
  await atomicJson(join(directory, 'details', candidate.id + '.json'), result);
  if (galleries || !galleryLink) await atomicJson(join(directory, 'browser', 'complete-' + candidate.id + '.json'), {at: result.captured_at, source_id: candidate.id, direct_html: true, galleries_checked: galleries});
  return {id: candidate.id, ok: true, ms: Date.now() - started, photos: result.images.length, documents: result.attachments.length, content_hash: hash({title: result.title, description: result.description, price_text: result.price_text, action: result.action, contact: result.contact}), assets_hash: hash({images:result.images.map(image => ({url:assetIdentity(image.url),caption:image.caption})),attachments:result.attachments.map(link=>({url:assetIdentity(link.url),label:link.text}))})};
}
export async function mapPool(items, concurrency, callback) {
  const results = new Array(items.length);
  let next = 0;
  await Promise.all(Array.from({length: Math.min(concurrency, items.length)}, async () => {
    for (;;) { const index = next++; if (index >= items.length) break; results[index] = await callback(items[index], index); }
  }));
  return results;
}
export async function probeBarnstormers({candidates, directory, concurrency = 2, galleries = true}) {
  const client = new HttpSource(), started = Date.now();
  const results = await mapPool(candidates, concurrency, async candidate => {
    try { return await captureBarnstormers(client, candidate, directory, {galleries}); }
    catch (error) { return {id: candidate.id, ok: false, state: 'unknown', public_status_action: 'preserve', error: error.message}; }
  });
  const report = {source: 'barnstormers', transport: 'http', at: new Date().toISOString(), elapsed_ms: Date.now() - started, requests: client.requests, completed: results.filter(r => r.ok).length, requested: candidates.length, results};
  await atomicJson(join(directory, 'capture-report.json'), report);
  return report;
}

export async function discoverBarnstormers({since, directory, maximumRequests = 100, client = new HttpSource({maximumRequests})}) {
  const boundary = Date.parse(since);
  if (!Number.isFinite(boundary)) throw Error('Provide the last successful discovery timestamp');
  // Posting dates have day precision and may mean renewal. Keep two overlap days.
  const cutoff = boundary - 2 * 86400000, started = Date.now(), seenPages = new Set(), items = new Map();
  let url = 'https://www.barnstormers.com/listing.php', pages = 0, complete = false, reason;
  while (url) {
    if (seenPages.has(url)) throw Error('Source pagination loop');
    seenPages.add(url);
    const page = await client.read(url, extractFeed);
    if (!page.data.heading?.includes('Most Recent Listings') || !page.data.items.length) throw Error('Source discovery incomplete; preserve last successful boundary');
    pages++;
    await atomicJson(join(directory,'browser','feed-' + String(pages).padStart(3,'0') + '.json'), {at: new Date().toISOString(), url, ...page.data});
    const dates = [];
    for (const item of page.data.items) {
      if (!items.has(item.source_id)) items.set(item.source_id, {...item, page, feed_url: url});
      const match = item.text?.match(/Posted\s+([A-Za-z]+\s+\d{1,2},\s*\d{4})/i);
      // No timezone is exposed. Use a conservative latest possible day boundary.
      dates.push(match ? Date.parse(match[1] + ' 23:59:59 UTC') + 14*3600000 : NaN);
    }
    // Stop only when every dated ad on a healthy page is older than the overlap.
    if (dates.length && dates.every(date => Number.isFinite(date) && date < cutoff)) { complete = true; reason = 'Healthy feed page entirely older than two-day overlap'; break; }
    url = page.data.next;
    if (!url) { complete = true; reason = 'Healthy feed reached its end'; }
  }
  const report = {source: 'barnstormers', since, at: new Date().toISOString(), elapsed_ms: Date.now()-started, pages, requests: client.requests, complete, reason, candidates: [...items.values()]};
  await atomicJson(join(directory,'discovery.json'), report);
  return report;
}

if (typeof process !== 'undefined' && process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const args = process.argv.slice(2), flag = (name, fallback) => { const index = args.indexOf(name); return index >= 0 ? args[index+1] : fallback; };
  const source = flag('--source', 'barnstormers');
  if (source !== 'barnstormers') throw Error('Controller/TAP require captureBrowser with a supported cua_repl tab; raw HTTP is blocked');
  const state = JSON.parse(await readFile('data/marketplace-sync/barnstormers/state.json', 'utf8'));
  const limit = Number(flag('--sample', '10'));
  if (!Number.isInteger(limit) || limit < 1 || limit > 1000) throw Error('Invalid sample size');
  const directory = flag('--output', 'data/marketplace-sync/experiments/http-' + new Date().toISOString().replace(/[:.]/g,'-'));
  if (args.includes('--discover')) {
    const report = await discoverBarnstormers({since: flag('--since', state.last_successful_discovery_at || state.last_successful_run_at), directory});
    console.log(JSON.stringify({file:join(directory,'discovery.json'),pages:report.pages,candidates:report.candidates.length,complete:report.complete,elapsed_ms:report.elapsed_ms}));
    process.exit(0);
  }
  const managed = Object.values(state.listings).filter(item => item.zuluniner_id);
  const candidates = (args.includes('--all') ? managed : managed.slice(0,limit)).map(item => ({id: item.source_id, url: item.source_url}));
  const report = await probeBarnstormers({candidates, directory, galleries: !args.includes('--availability-only')});
  console.log(JSON.stringify({file:join(directory,'capture-report.json'),requested:report.requested,completed:report.completed,requests:report.requests,elapsed_ms:report.elapsed_ms,failures:report.results.filter(result=>!result.ok)}, null, 2));
}
