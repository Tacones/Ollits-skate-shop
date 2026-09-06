import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const BASE_URL = 'https://www.ossoskateshop.com.br';
const START_PATHS = ['/produtos/', '/skate/', '/skate/acessorios/', '/vestuario/'];
const MAX_LISTING_PAGES = 60;
const USER_AGENT = 'OllitsCatalogImporter/1.0 (+https://github.com/Tacones/Ollits-skate-shop)';
const sleep = (ms) => new Promise((resolvePromise) => setTimeout(resolvePromise, ms));

function absoluteUrl(value) {
  if (!value) return undefined;
  try { return new URL(value, BASE_URL).href; } catch { return undefined; }
}

function decodeHtml(value) {
  return value
    .replaceAll('&amp;', '&').replaceAll('&quot;', '"').replaceAll('&#39;', "'")
    .replaceAll('&lt;', '<').replaceAll('&gt;', '>')
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)));
}

function stripHtml(value) { return decodeHtml(value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()); }

function parseMoney(value) {
  if (typeof value === 'number') return value;
  if (!value) return undefined;
  const normalized = String(value).replace(/[^\d,.-]/g, '').replace(/\./g, '').replace(',', '.');
  const number = Number(normalized);
  return Number.isFinite(number) ? number : undefined;
}

function extractJsonLd(html) {
  const scripts = [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  const records = [];
  for (const match of scripts) {
    try {
      const parsed = JSON.parse(match[1].trim());
      if (Array.isArray(parsed)) records.push(...parsed); else records.push(parsed);
    } catch {}
  }
  return records;
}

function firstProductJsonLd(records) {
  return records.find((record) => record?.['@type'] === 'Product' || (Array.isArray(record?.['@type']) && record['@type'].includes('Product')));
}

function extractProductLinks(html) {
  const links = new Set();
  for (const match of html.matchAll(/href=["']([^"']*\/produtos\/[^"'#?]+)["']/gi)) {
    const url = absoluteUrl(match[1]);
    if (url) links.add(url);
  }
  return [...links];
}

function extractImageUrls(html, jsonLd) {
  const urls = [];
  const push = (value) => {
    const url = absoluteUrl(value);
    if (url && /\.(?:jpe?g|png|webp|avif)(?:\?|$)/i.test(url) && !urls.includes(url)) urls.push(url);
  };
  const jsonImages = jsonLd?.image;
  if (Array.isArray(jsonImages)) jsonImages.forEach(push);
  else if (typeof jsonImages === 'string') push(jsonImages);
  push(html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)?.[1]);
  for (const match of html.matchAll(/(?:src|data-src|data-large|data-image)=["']([^"']+)["']/gi)) push(match[1]);
  return urls;
}

function extractDiscount(html) {
  const match = html.match(/(\d{1,3})%\s*OFF/i);
  return match ? Number(match[1]) : undefined;
}

function extractRawPricePair(html) {
  const money = [...html.matchAll(/R\$\s*[\d.]+,\d{2}/g)].map((match) => match[0].replace(/\s+/g, ' '));
  const unique = [...new Set(money)];
  return unique.length ? { priceRaw: unique[0], promotionalPriceRaw: unique[1] } : {};
}

function extractAvailability(jsonLd, html) {
  const availability = jsonLd?.offers?.availability;
  if (typeof availability === 'string') {
    if (/OutOfStock/i.test(availability)) return false;
    if (/InStock|LimitedAvailability|PreOrder/i.test(availability)) return true;
  }
  return !/Esgotado/i.test(html);
}

function extractVariants(html) {
  const variants = [];
  const seen = new Set();
  for (const block of html.matchAll(/<(?:select)[^>]*>([\s\S]*?)<\/select>/gi)) {
    const selectHtml = block[0];
    const label = /(?:name|aria-label)=["']([^"']+)["']/i.exec(selectHtml)?.[1] || 'Variação';
    for (const option of selectHtml.matchAll(/<option[^>]*value=["']([^"']*)["'][^>]*>([\s\S]*?)<\/option>/gi)) {
      const value = stripHtml(option[2]);
      if (!value || /^selecione|^escolha/i.test(value)) continue;
      const key = `${label}:${value}`;
      if (!seen.has(key)) {
        seen.add(key);
        variants.push({ id: key.toLowerCase().replace(/[^a-z0-9]+/g, '-'), name: label, value, available: !/esgotado/i.test(value) });
      }
    }
  }
  return variants;
}

function extractCategory(pathname, name) {
  if (/acessorios/i.test(pathname)) return 'Acessórios';
  if (/vestuario/i.test(pathname)) return 'Vestuário';
  if (/roda/i.test(name)) return 'Rodas';
  if (/truck/i.test(name)) return 'Trucks';
  if (/rolamento/i.test(name)) return 'Rolamentos';
  if (/skate completo|skate infantil/i.test(name)) return 'Skate Completo';
  if (/longboard/i.test(name)) return 'Longboard';
  if (/shape/i.test(name)) return name.toLowerCase().includes('marfim') ? 'Shape Marfim / Fiber' : 'Shape Maple';
  return 'Acessórios';
}

function extractBrand(jsonLd, html) {
  const brand = jsonLd?.brand?.name || jsonLd?.brand;
  if (typeof brand === 'string' && brand.trim()) return brand.trim();
  const match = html.match(/Marca\s*[:\-]?\s*([^<\n]{2,80})/i);
  return match ? stripHtml(match[1]).replace(/\s{2,}/g, ' ').trim() : undefined;
}

async function fetchHtml(url) {
  const response = await fetch(url, { headers: { 'user-agent': USER_AGENT, accept: 'text/html,application/xhtml+xml' } });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${url}`);
  return response.text();
}

async function crawlListing(path) {
  const links = new Set();
  for (let page = 1; page <= MAX_LISTING_PAGES; page += 1) {
    const url = `${BASE_URL}${path}${path.includes('?') ? '&' : '?'}page=${page}`;
    const html = await fetchHtml(url);
    const pageLinks = extractProductLinks(html);
    pageLinks.forEach((link) => links.add(link));
    if (!pageLinks.length || pageLinks.length < 5) break;
    await sleep(150);
  }
  return links;
}

async function parseProduct(url) {
  const html = await fetchHtml(url);
  const jsonLd = firstProductJsonLd(extractJsonLd(html));
  const name = jsonLd?.name || stripHtml(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1] || '');
  if (!name) return null;
  const offer = Array.isArray(jsonLd?.offers) ? jsonLd.offers[0] : jsonLd?.offers;
  const rawPair = extractRawPricePair(html);
  const price = parseMoney(offer?.price) ?? parseMoney(rawPair.priceRaw) ?? 0;
  const promotionalPrice = parseMoney(rawPair.promotionalPriceRaw);
  const discountPercent = extractDiscount(html);
  const description = jsonLd?.description ? stripHtml(String(jsonLd.description)) : undefined;
  const images = extractImageUrls(html, jsonLd).map((src, index) => ({ src, alt: name, position: index + 1 }));
  const sku = jsonLd?.sku || jsonLd?.mpn || undefined;
  const parsedUrl = new URL(url);
  return {
    id: sku || parsedUrl.pathname.replace(/^\/produtos\//, '').replace(/\/$/, ''),
    sku,
    name,
    brand: extractBrand(jsonLd, html),
    category: extractCategory(parsedUrl.pathname, name),
    department: parsedUrl.pathname.split('/')[1] || undefined,
    price,
    priceRaw: rawPair.priceRaw,
    promotionalPrice,
    promotionalPriceRaw: rawPair.promotionalPriceRaw,
    discountPercent,
    discountPercentRaw: discountPercent === undefined ? undefined : `${discountPercent}% OFF`,
    variants: extractVariants(html),
    description,
    specifications: {},
    images,
    available: extractAvailability(jsonLd, html),
    sourceUrl: url,
    source: 'Osso Skate Shop',
  };
}

async function main() {
  const productUrls = new Set();
  for (const path of START_PATHS) {
    const links = await crawlListing(path);
    links.forEach((link) => productUrls.add(link));
  }

  const products = [];
  for (const url of productUrls) {
    try {
      const product = await parseProduct(url);
      if (product) products.push(product);
    } catch (error) {
      console.warn(`Skipping ${url}: ${error.message}`);
    }
    await sleep(150);
  }

  products.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
  const payload = {
    source: 'Osso Skate Shop',
    sourceUrl: BASE_URL,
    authorized: true,
    importedAt: new Date().toISOString(),
    importer: 'scripts/import-osso-catalog.mjs',
    products,
  };

  const outputPath = resolve('src/data/import/supplier-catalog.json');
  await mkdir(resolve('src/data/import'), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  console.log(`Imported ${products.length} products into ${outputPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
