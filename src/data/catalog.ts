import supplierCatalog from './import/supplier-catalog.json';
import type { Product, ProductCategory } from './catalog-schema.ts';

/** Canonical dataset. The checked-in snapshot is supplier-sourced; future refreshes use the live importer. */
export const products = supplierCatalog.products as Product[];

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
