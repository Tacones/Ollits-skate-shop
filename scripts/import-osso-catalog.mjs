import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const BASE_URL = 'https://www.ossoskateshop.com.br';
const START_PATHS = ['/produtos/', '/skate/', '/skate/acessorios/', '/vestuario/'];
const MAX_LISTING_PAGES = 60;
const MIN_EXPECTED_PRODUCTS = 800;
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
function normalizeText(value) { return stripHtml(String(value || '')).toLowerCase().replace(/\s+/g, ' ').trim(); }

function parseMoney(value) {
  if (typeof value === 'number') return value;
  if (value === undefined || value === null || value === '') return undefined;
  const normalized = String(value).trim().replace(/[^\d,.-]/g, '');
  // Brazilian display values use comma decimals; JSON-LD commonly uses dot decimals.
  const canonical = normalized.includes(',')
    ? normalized.replace(/\./g, '').replace(',', '.')
    : normalized;
  const number = Number(canonical);
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

function productJsonLd(records, pageName, pageUrl) {
  const products = records.filter((record) => record?.['@type'] === 'Product' || (Array.isArray(record?.['@type']) && record['@type'].includes('Product')));
  const normalizedName = normalizeText(pageName);
  return products.find((record) => normalizeText(record?.name) === normalizedName)
    || products.find((record) => normalizeText(record?.url) === normalizeText(pageUrl))
    || products[0];
}

function extractProductLinks(html) {
  const links = new Set();
  for (const match of html.matchAll(/href=["']([^"']*\/produtos\/[^"'#?]+)["']/gi)) {
    const url = absoluteUrl(match[1]);
    if (url) links.add(url);
  }
  return [...links];
}

function extractImageUrls(html, jsonLd, productName) {
  const urls = [];
  const rejectedAsset = /(?:payment|visa|mastercard|boleto|pix|amex|hiper|shipping|frete|logo|selo)/i;
  const push = (value, { allowCdn = false } = {}) => {
    const candidate = typeof value === 'object' && value !== null
      ? value.url || value.contentUrl || value['@id']
      : value;
    const url = absoluteUrl(candidate);
    if (!url) return;
    let parsed;
    try { parsed = new URL(url); } catch { return; }
    const path = parsed.pathname;
    const hasImageExtension = /\.(?:jpe?g|png|webp|avif)$/i.test(path);
    const productPath = /\/products\//i.test(path);
    const knownImageCdn = /(?:cloudfront\.net|mitiendanube\.com)$/i.test(parsed.hostname);
    if ((!hasImageExtension && !productPath) || rejectedAsset.test(path)) return;
    if (!productPath && !(allowCdn && knownImageCdn)) return;
    if (!urls.includes(url)) urls.push(url);
  };

  const jsonImages = jsonLd?.image;
  if (Array.isArray(jsonImages)) jsonImages.forEach((image) => push(image, { allowCdn: true }));
  else if (jsonImages) push(jsonImages, { allowCdn: true });

  const ogImage = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)?.[1];
  if (ogImage) push(ogImage, { allowCdn: true });

  const normalizedName = normalizeText(productName || '');
  for (const match of html.matchAll(/<img\b[^>]*>/gi)) {
    const tag = match[0];
    const alt = normalizeText(tag.match(/alt=["']([^"']*)["']/i)?.[1] || '');
    const source = tag.match(/(?:src|data-src|data-large|data-image)=["']([^"']+)["']/i)?.[1];
    if (source && ((alt && normalizedName && (alt.includes(normalizedName) || normalizedName.includes(alt))) || /\/products\//i.test(source))) {
      push(source, { allowCdn: true });
    }
  }
  return urls;
}

function extractDiscount(html) {
  const match = html.match(/(\d{1,3})%\s*OFF/i);
  return match ? Number(match[1]) : undefined;
}

function extractStructuredPrice(html) {
  const match = html.match(/itemprop=["']price["'][^>]*content=["']([^"']+)["']/i)
    || html.match(/content=["']([^"']+)["'][^>]*itemprop=["']price["']/i);
  return match ? parseMoney(match[1]) : undefined;
}

function extractVisiblePricePair(html, currentPrice) {
  const struckPrices = [];
  for (const match of html.matchAll(/<(?:del|s|strike)\b[^>]*>([\s\S]*?)<\/(?:del|s|strike)>/gi)) {
    for (const money of match[1].matchAll(/R\$\s*[\d.]+,\d{2}/g)) {
      const parsed = parseMoney(money[0]);
      if (Number.isFinite(parsed) && parsed > (currentPrice ?? 0)) struckPrices.push(parsed);
    }
  }
  const original = struckPrices.find((value) => value > (currentPrice ?? 0));
  const currentRaw = currentPrice === undefined ? undefined : 'R$' + currentPrice.toFixed(2).replace('.', ',');
  return {
    priceRaw: original === undefined ? currentRaw : 'R$' + original.toFixed(2).replace('.', ','),
    promotionalPriceRaw: original === undefined ? undefined : currentRaw,
  };
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
    const url = page === 1 ? `${BASE_URL}${path}` : `${BASE_URL}${path}${path.includes('?') ? '&' : '?'}page=${page}`;
    const html = await fetchHtml(url);
    if (page === 1) console.log(`Listing diagnostic ${path}: ${html.length} chars; title=${html.match(/<title[^>]*>([\\s\\S]*?)<\\/title>/i)?.[1]?.slice(0, 120) || 'no title'}; sample=${html.slice(0, 180).replace(/\\s+/g, ' ')}`);
    const pageLinks = extractProductLinks(html);
    pageLinks.forEach((link) => links.add(link));
    if (!pageLinks.length || pageLinks.length < 5) break;
    await sleep(150);
  }
  return links;
}

async function parseProduct(url) {
  const html = await fetchHtml(url);
  const h1Name = stripHtml(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1] || '');
  const jsonLd = productJsonLd(extractJsonLd(html), h1Name, url);
  const name = h1Name || stripHtml(jsonLd?.name || '');
  if (!name) return null;
  const offer = Array.isArray(jsonLd?.offers) ? jsonLd.offers[0] : jsonLd?.offers;
  const currentPrice = extractStructuredPrice(html) ?? parseMoney(offer?.price);
  const visiblePair = extractVisiblePricePair(html, currentPrice);
  const price = currentPrice ?? parseMoney(visiblePair.promotionalPriceRaw) ?? parseMoney(visiblePair.priceRaw) ?? 0;
  const promotionalPrice = visiblePair.promotionalPriceRaw ? parseMoney(visiblePair.promotionalPriceRaw) : undefined;
  const discountPercent = extractDiscount(html);
  const description = jsonLd?.description ? stripHtml(String(jsonLd.description)) : undefined;
  const images = extractImageUrls(html, jsonLd, name).map((src, index) => ({ src, alt: name, position: index + 1 }));
  const sku = jsonLd?.sku || jsonLd?.mpn || undefined;
  const parsedUrl = new URL(url);
  const canonicalUrl = absoluteUrl(jsonLd?.url) || url;
  return {
    id: new URL(canonicalUrl).pathname.split('/').filter(Boolean).at(-1) || sku,
    sku,
    name,
    brand: extractBrand(jsonLd, html),
    category: extractCategory(parsedUrl.pathname, name),
    department: parsedUrl.pathname.split('/')[1] || undefined,
    price,
    priceRaw: visiblePair.priceRaw,
    promotionalPrice,
    promotionalPriceRaw: visiblePair.promotionalPriceRaw,
    discountPercent,
    discountPercentRaw: discountPercent === undefined ? undefined : `${discountPercent}% OFF`,
    variants: extractVariants(html),
    description,
    specifications: {},
    images,
    available: extractAvailability(jsonLd, html),
    sourceUrl: canonicalUrl,
    source: 'Osso Skate Shop',
  };
}

async function main() {
  const productUrls = new Set();
  for (const path of START_PATHS) {
    const links = await crawlListing(path);
    console.log(`Discovered ${links.size} product URLs from ${path}`);
    links.forEach((link) => productUrls.add(link));
  }

  if (productUrls.size < MIN_EXPECTED_PRODUCTS) {
    throw new Error(`Catalog discovery returned only ${productUrls.size} products; refusing to overwrite the last complete snapshot (minimum ${MIN_EXPECTED_PRODUCTS}).`);
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
  if (products.length < MIN_EXPECTED_PRODUCTS) {
    throw new Error(`Only ${products.length} products could be parsed; refusing to overwrite the last complete snapshot.`);
  }
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
