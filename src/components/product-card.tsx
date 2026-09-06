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
        <div className="relative flex aspect-square items-center justify-center overflow-hidden bg-[#e8e7df]">
          {image ? (
            <Image
              src={image.src}
              alt={image.alt || product.name}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-contain p-5"
            />
          ) : (
            <div className="px-6 text-center text-xs font-bold uppercase tracking-widest text-black/45">
              Imagem do fornecedor será carregada na próxima sincronização
            </div>
          )}
          {product.discountPercent ? (
            <span className="absolute left-3 top-3 bg-[#d8ff35] px-2 py-1 text-[10px] font-black uppercase">
              {product.discountPercentRaw || `${product.discountPercent}% OFF`}
            </span>
          ) : null}
        </div>
        <div className="p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-black/45">{product.brand || product.category}</p>
          <h3 className="mt-1 font-bold">{product.name}</h3>
          {hasPromo ? <p className="mt-2 text-xs text-black/40 line-through">{product.priceRaw}</p> : null}
          <p className="mt-1 text-sm font-semibold">R$ {currentPrice.toFixed(2).replace('.', ',')}</p>
        </div>
      </Link>
    </article>
  );
}
