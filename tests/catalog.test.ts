import test from 'node:test';
import assert from 'node:assert/strict';
import { categories, products } from '../src/data/products';

test('catalog is supplier-ready and exposes the storefront categories', () => {
  assert.deepEqual(categories, ['Shapes', 'Trucks', 'Rodas', 'Rolamentos', 'Acessórios', 'Vestuário']);
  assert.ok(Array.isArray(products));
});

test('product ids are unique and catalog prices are valid when imported', () => {
  const ids = new Set(products.map((product) => product.id));
  assert.equal(ids.size, products.length);
  assert.ok(products.every((product) => product.price >= 0));
  assert.ok(products.every((product) => product.promotionalPrice === undefined || product.promotionalPrice >= 0));
});

test('variants and images follow the scalable catalog contract', () => {
  assert.ok(products.every((product) => Array.isArray(product.variants)));
  assert.ok(products.every((product) => Array.isArray(product.images)));
  assert.ok(products.every((product) => typeof product.specifications === 'object'));
});
