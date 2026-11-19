import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/data/products';
import { getProductPrice } from '@/data/catalog';

export function ProductCard({ product }: { product: Product }) {
  const currentPrice = getProductPrice(product);
  const hasPromo = product.promotionalPrice !== undefined;
  const image = product.images[0];

  return (
    <article className="card-hover group border border-black bg-white">
      <Link href={`/produto/${product.id}`} className="block">
        <div className="relative flex aspect-square items-center justify-center overflow-hidden bg-[#f0f0ee]">
          {image ? <Image src={image.src} alt={image.alt || product.name} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-contain p-5 transition duration-300 group-hover:scale-[1.04]" /> : <div className="px-6 text-center text-[10px] font-bold uppercase tracking-widest text-black/40">Imagem não disponível</div>}
          {product.discountPercent ? <span className="absolute left-3 top-3 bg-[#d71920] px-2 py-1 text-[9px] font-black uppercase text-white">{product.discountPercentRaw || `${product.discountPercent}% OFF`}</span> : null}
          {!product.available ? <span className="absolute bottom-3 left-3 bg-black px-2 py-1 text-[9px] font-black uppercase text-white">Indisponível</span> : null}
        </div>
        <div className="p-4">
          <p className="text-[9px] font-black uppercase tracking-widest text-[#d71920]">{product.brand || product.category}</p>
          <h3 className="mt-2 min-h-10 text-sm font-bold leading-snug">{product.name}</h3>
          {hasPromo ? <p className="mt-3 text-xs text-black/40 line-through">{product.priceRaw}</p> : null}
          <div className="mt-1 flex items-center justify-between"><p className="text-sm font-black">R$ {currentPrice.toFixed(2).replace('.', ',')}</p><span className="text-[9px] font-black uppercase underline underline-offset-4">Ver produto ↗</span></div>
        </div>
      </Link>
    </article>
  );
}
