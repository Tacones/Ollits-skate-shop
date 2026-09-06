import type { Product, ProductCategory } from './catalog-schema';

/** Canonical product dataset. Populate only from the authorized supplier source. */
export const products: Product[] = [];

export const featuredProducts = products.filter((product) => product.available);

export function productsByCategory(category: ProductCategory) {
  return products.filter((product) => product.category === category);
}

export function productsByBrand(brand: string) {
  return products.filter((product) => product.brand === brand);
}

export function getProductPrice(product: Product) {
  return product.promotionalPrice ?? product.price;
}
