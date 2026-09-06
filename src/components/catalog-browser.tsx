'use client';

import { useMemo, useState } from 'react';
import { ProductCard } from '@/components/product-card';
import { categories, products } from '@/data/products';

const categoryLabels = ['Todos', ...categories] as const;

export function CatalogBrowser() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<(typeof categoryLabels)[number]>('Todos');

  const filteredProducts = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase('pt-BR');
    return products.filter((product) => {
      const matchesCategory = category === 'Todos' || (category === 'Shapes'
        ? product.category.startsWith('Shape ')
        : product.category === category);
      if (!matchesCategory) return false;
      if (!normalized) return true;
      return [product.name, product.brand, product.category, product.sku]
        .filter(Boolean)
        .some((value) => String(value).toLocaleLowerCase('pt-BR').includes(normalized));
    });
  }, [category, query]);

  return (
    <section aria-label="Catálogo de produtos">
      <div className="mb-6 grid gap-3 md:grid-cols-[1fr_auto]">
        <label className="sr-only" htmlFor="catalog-search">Buscar produtos</label>
        <input
          id="catalog-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Buscar por produto, marca ou SKU"
          className="border border-black bg-white px-4 py-3 text-sm outline-none placeholder:text-black/40 focus:ring-2 focus:ring-black"
        />
        <p className="flex items-center border border-black bg-white px-4 py-3 text-xs font-bold uppercase tracking-widest">
          {filteredProducts.length} {filteredProducts.length === 1 ? 'produto' : 'produtos'}
        </p>
      </div>

      <div className="mb-8 flex flex-wrap gap-2" aria-label="Filtrar por categoria">
        {categoryLabels.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setCategory(item)}
            className={`border border-black px-3 py-2 text-[11px] font-bold uppercase transition ${category === item ? 'bg-black text-white' : 'bg-white text-black hover:bg-black hover:text-white'}`}
            aria-pressed={category === item}
          >
            {item}
          </button>
        ))}
      </div>

      {filteredProducts.length === 0 ? (
        <div className="border border-black bg-white p-8">
          <p className="text-xs font-black uppercase tracking-widest">Nenhum resultado</p>
          <p className="mt-3 text-sm text-black/65">Tente outro termo ou selecione outra categoria.</p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      )}
    </section>
  );
}
