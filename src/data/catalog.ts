import supplierCatalog from './import/supplier-catalog.json' with { type: 'json' };
import type { Product, ProductCategory, ProductImage } from './catalog-schema.ts';

const invalidImageUrls = new Set([
  'https://acdn-us.mitiendanube.com/assets/themes/amazonas/static/images/empty-placeholder.png',
  'https://acdn-us.mitiendanube.com/tmp/stores/004/253/224/products/calca-orange-jeans-detalhe-costa-6381686a3c5afc72c217751394987782.png',
]);

function normalizeImage(image: ProductImage): ProductImage | null {
  if (!image.src || invalidImageUrls.has(image.src)) return null;

  const src = image.src.replace(/-50-0\.webp$/, '-480-0.webp');
  return { ...image, src };
}

function normalizeProduct(product: Product): Product {
  const images = product.images
    .map(normalizeImage)
    .filter((image): image is ProductImage => Boolean(image))
    .filter((image, index, all) => all.findIndex((item) => item.src === image.src) === index);

  const brand = product.brand && !product.brand.includes('"') && !product.brand.includes('s/>')
    ? product.brand
    : undefined;

  return { ...product, brand, images };
}

/** Canonical dataset. The checked-in snapshot is supplier-sourced; future refreshes use the live importer. */
export const products = (supplierCatalog.products as Product[]).map(normalizeProduct);

export const featuredProducts = products.filter((product) => product.available);

export function productsByCategory(category: ProductCategory) {
  if (category === 'Shapes') {
    return products.filter((product) => product.category.startsWith('Shape '));
  }
  return products.filter((product) => product.category === category);
}

export function productsByBrand(brand: string) {
  return products.filter((product) => product.brand === brand);
}

export function getProductPrice(product: Product) {
  return product.promotionalPrice ?? product.price;
}
