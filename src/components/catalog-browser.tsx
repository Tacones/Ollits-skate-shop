'use client';

import { useEffect, useMemo, useState } from 'react';
import { ProductCard } from '@/components/product-card';
import { categories, products } from '@/data/products';

const categoryLabels = ['Todos', ...categories] as const;

export function CatalogBrowser() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<(typeof categoryLabels)[number]>('Todos');
  const [brand, setBrand] = useState('Todas as marcas');
  const [availability, setAvailability] = useState(false);
  const [sort, setSort] = useState('relevance');

  useEffect(() => {
    const requestedCategory = new URLSearchParams(window.location.search).get('categoria');
    if (requestedCategory && categoryLabels.includes(requestedCategory as (typeof categoryLabels)[number])) {
      setCategory(requestedCategory as (typeof categoryLabels)[number]);
    }
  }, []);

  const brands = useMemo(() => ['Todas as marcas', ...Array.from(new Set(products.map((p) => p.brand).filter((value): value is string => Boolean(value))).values()).sort((a, b) => a.localeCompare(b, 'pt-BR'))], []);

  const filteredProducts = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase('pt-BR');
    const result = products.filter((product) => {
      const matchesCategory = category === 'Todos' || (category === 'Shapes'
        ? product.category.toLocaleLowerCase('pt-BR').startsWith('shape')
        : product.category === category);
      if (!matchesCategory) return false;
      if (brand !== 'Todas as marcas' && product.brand !== brand) return false;
      if (availability && !product.available) return false;
      if (!normalized) return true;
      return [product.name, product.brand, product.category, product.sku]
        .filter(Boolean)
        .some((value) => String(value).toLocaleLowerCase('pt-BR').includes(normalized));
    });
    if (sort === 'price-asc') result.sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') result.sort((a, b) => b.price - a.price);
    if (sort === 'name') result.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
    return result;
  }, [availability, brand, category, query, sort]);

  return (
    <section id="catalogo" aria-label="Catálogo de produtos">
      <div className="mb-5 grid gap-3 md:grid-cols-[1fr_220px_190px]">
        <label className="sr-only" htmlFor="catalog-search">Buscar produtos</label>
        <input id="catalog-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar produto, marca ou SKU" className="min-w-0 border border-black bg-white px-4 py-3 text-sm outline-none placeholder:text-black/40 focus:ring-2 focus:ring-[var(--accent)]" />
        <label className="sr-only" htmlFor="catalog-brand">Filtrar por marca</label>
        <select id="catalog-brand" value={brand} onChange={(event) => setBrand(event.target.value)} className="border border-black bg-white px-3 py-3 text-xs font-bold uppercase outline-none focus:ring-2 focus:ring-[var(--accent)]">{brands.map((item) => <option key={item} value={item}>{item}</option>)}</select>
        <label className="sr-only" htmlFor="catalog-sort">Ordenar produtos</label>
        <select id="catalog-sort" value={sort} onChange={(event) => setSort(event.target.value)} className="border border-black bg-white px-3 py-3 text-xs font-bold uppercase outline-none focus:ring-2 focus:ring-[var(--accent)]">
          <option value="relevance">Relevância</option><option value="price-asc">Menor preço</option><option value="price-desc">Maior preço</option><option value="name">Nome A–Z</option>
        </select>
      </div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2" aria-label="Filtrar por categoria">
          {categoryLabels.map((item) => <button key={item} type="button" onClick={() => setCategory(item)} className={`border border-black px-3 py-2 text-[10px] font-black uppercase transition ${category === item ? 'bg-[var(--accent)] text-white' : 'bg-white text-black hover:bg-black hover:text-white'}`} aria-pressed={category === item}>{item}</button>)}
        </div>
        <label className="flex items-center gap-2 text-[10px] font-bold uppercase"><input type="checkbox" checked={availability} onChange={(event) => setAvailability(event.target.checked)} className="accent-[var(--accent)]" /> Apenas disponíveis</label>
      </div>
      <div className="mb-4 flex items-center justify-between border-b border-black pb-3"><p className="text-[10px] font-black uppercase tracking-widest">{filteredProducts.length} {filteredProducts.length === 1 ? 'produto encontrado' : 'produtos encontrados'}</p><button onClick={() => { setQuery(''); setCategory('Todos'); setBrand('Todas as marcas'); setAvailability(false); setSort('relevance'); }} className="text-[10px] font-bold uppercase underline">Limpar filtros</button></div>
      {filteredProducts.length === 0 ? <div className="border border-black bg-white p-8"><p className="text-xs font-black uppercase tracking-widest">Nenhum resultado</p><p className="mt-3 text-sm text-black/65">Tente outro termo ou remova algum filtro.</p></div> : <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{filteredProducts.map((product) => <ProductCard key={product.id} product={product} />)}</div>}
    </section>
  );
}
