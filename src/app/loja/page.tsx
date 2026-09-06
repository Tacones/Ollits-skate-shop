import { ProductCard } from '@/components/product-card';
import { categories, products } from '@/data/products';

export default function LojaPage() {
  return <div className="container-ollits py-16"><div className="mb-12 border-b border-black pb-8"><p className="text-xs font-bold uppercase tracking-widest text-black/45">Ollits Skate Shop</p><h1 className="display mt-2 text-7xl uppercase leading-[.8]">Loja</h1><p className="mt-6 max-w-xl text-lg text-black/65">Componentes, acessórios e apparel para montar seu próximo rolê.</p></div><div className="mb-8 flex flex-wrap gap-2">{categories.map((category) => <span key={category} className="border border-black px-3 py-2 text-[11px] font-bold uppercase">{category}</span>)}</div><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div></div>;
}
