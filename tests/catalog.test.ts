import test from 'node:test';
import assert from 'node:assert/strict';
import { categories, products } from '../src/data/products';

test('catalog has products in every storefront category', () => {
  assert.ok(products.length > 0);
  for (const category of categories) {
    assert.ok(products.some((product) => product.category === category), `missing ${category}`);
  }
});

test('product ids are unique and prices are positive', () => {
  const ids = new Set(products.map((product) => product.id));
  assert.equal(ids.size, products.length);
  assert.ok(products.every((product) => product.price > 0));
});
