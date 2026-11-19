import test from 'node:test';
import assert from 'node:assert/strict';
import { categories, products } from '../src/data/products.ts';
import { getProductPrice } from '../src/data/catalog.ts';

test('catalog exposes the scalable storefront taxonomy', () => {
  assert.deepEqual(categories, ['Shapes', 'Trucks', 'Rodas', 'Rolamentos', 'Acessórios', 'Vestuário', 'Skate Completo', 'Longboard']);
  assert.ok(Array.isArray(products));
  assert.ok(products.length > 0);
});

test('supplier products keep stable ids and valid monetary fields', () => {
  const ids = new Set(products.map((product) => product.id));
  assert.equal(ids.size, products.length);
  assert.ok(products.every((product) => product.price >= 0));
  assert.ok(products.every((product) => product.promotionalPrice === undefined || product.promotionalPrice >= 0));
  assert.ok(products.every((product) => product.source === 'Osso Skate Shop'));
});

test('effective product price prefers a promotional price and falls back to regular price', () => {
  const productWithPromo = {
    id: 'test-promo',
    name: 'Produto de teste com promoção',
    category: 'Acessórios',
    price: 100,
    promotionalPrice: 80,
    variants: [],
    specifications: {},
    images: [],
    available: true,
    source: 'Osso Skate Shop' as const,
  };
  assert.equal(getProductPrice(productWithPromo), 80);

  const productWithoutPromo = {
    ...productWithPromo,
    id: 'test-regular',
    promotionalPrice: undefined,
  };
  assert.equal(getProductPrice(productWithoutPromo), 100);
});

test('variants and images follow the scalable catalog contract', () => {
  assert.ok(products.every((product) => Array.isArray(product.variants)));
  assert.ok(products.every((product) => Array.isArray(product.images)));
  assert.ok(products.every((product) => typeof product.specifications === 'object'));
});

test('supplier image URLs are absolute when present', () => {
  assert.ok(products.every((product) => product.images.every((image) => /^https?:\/\//.test(image.src))));
});
