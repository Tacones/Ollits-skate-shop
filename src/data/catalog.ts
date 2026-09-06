import type { Product } from './catalog-schema';

/**
 * Canonical product dataset.
 *
 * Keep supplier data here (or replace this module with an importer) and keep
 * presentation components independent from the source format.
 * No placeholder products are intentionally included.
 */
export const products: Product[] = [];

export const featuredProducts = products.filter((product) => product.available);
