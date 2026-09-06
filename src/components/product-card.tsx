import Link from 'next/link';
import type { Product } from '@/data/products';

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="card-hover group border border-black bg-white">
      <Link href={`/produto/${product.id}`} className="block">
        <div className="relative flex aspect-square items-center justify-center overflow-hidden bg-[#e8e7df] p-8">
          <div className="display rotate-[-8deg] text-center text-5xl uppercase leading-[.8] text-black/80">{product.category}<br /><span className="text-2xl">OLLITS</span></div>
          {product.tag && <span className="absolute left-3 top-3 bg-[#d8ff35] px-2 py-1 text-[10px] font-black uppercase">{product.tag}</span>}
        </div>
        <div className="p-4"><p className="text-[10px] font-bold uppercase tracking-widest text-black/45">{product.category}</p><h3 className="mt-1 font-bold">{product.name}</h3><p className="mt-2 text-sm font-semibold">R$ {product.price.toFixed(2).replace('.', ',')}</p></div>
      </Link>
    </article>
  );
}
