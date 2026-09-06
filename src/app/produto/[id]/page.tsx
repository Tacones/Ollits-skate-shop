'use client';

import Image from 'next/image';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import { getProductPrice, products } from '@/data/catalog';
import { useCart } from '@/components/cart-provider';

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const product = products.find((item) => item.id === id);
  const { add } = useCart();
  if (!product) notFound();

  const currentPrice = getProductPrice(product);

  return (
    <div className="container-ollits py-16">
      <Link href="/loja" className="text-xs font-bold uppercase underline">← Voltar para loja</Link>
      <div className="mt-8 grid gap-10 md:grid-cols-2">
        <div>
          <div className="relative flex aspect-square items-center justify-center overflow-hidden border border-black bg-[#e8e7df]">
            {product.images[0] ? (
              <Image src={product.images[0].src} alt={product.images[0].alt || product.name} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-contain p-8" priority />
            ) : (
              <span className="px-8 text-center text-xs font-bold uppercase tracking-widest text-black/45">Imagem do fornecedor será carregada na próxima sincronização</span>
            )}
          </div>
          {product.images.length > 1 ? (
            <div className="mt-3 grid grid-cols-4 gap-3">
              {product.images.slice(1, 9).map((image) => (
                <div key={image.src} className="relative aspect-square overflow-hidden border border-black/20 bg-[#e8e7df]">
                  <Image src={image.src} alt={image.alt || product.name} fill sizes="120px" className="object-contain p-2" />
                </div>
              ))}
            </div>
          ) : null}
        </div>
        <div className="flex flex-col justify-center">
          <p className="text-xs font-bold uppercase tracking-widest text-black/45">{product.brand || product.category}</p>
          <h1 className="display mt-2 text-6xl uppercase leading-[.8]">{product.name}</h1>
          {product.promotionalPrice !== undefined ? <p className="mt-7 text-sm text-black/40 line-through">{product.priceRaw}</p> : null}
          <p className="mt-1 text-2xl font-bold">R$ {currentPrice.toFixed(2).replace('.', ',')}</p>
          <div className="mt-5 space-y-1 text-xs uppercase tracking-widest text-black/55">
            {product.sku ? <p>SKU: {product.sku}</p> : null}
            <p>{product.available ? 'Disponível' : 'Indisponível'}</p>
          </div>
          {product.variants.length > 0 ? (
            <div className="mt-6 border-y border-black/15 py-4">
              <p className="text-xs font-black uppercase tracking-widest">Variações</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.variants.map((variant) => <span key={variant.id} className="border border-black px-3 py-2 text-xs">{variant.name}: {variant.value}</span>)}
              </div>
            </div>
          ) : null}
          {product.description ? <p className="mt-5 max-w-md text-black/65">{product.description}</p> : null}
          <button disabled={!product.available} onClick={() => add(product)} className="mt-8 w-fit bg-black px-7 py-4 text-sm font-black uppercase text-white disabled:cursor-not-allowed disabled:opacity-40">{product.available ? 'Adicionar ao carrinho' : 'Produto indisponível'}</button>
        </div>
      </div>
    </div>
  );
}
