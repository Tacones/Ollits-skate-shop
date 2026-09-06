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

  const image = product.images[0];
  const currentPrice = getProductPrice(product);

  return (
    <div className="container-ollits py-16">
      <Link href="/loja" className="text-xs font-bold uppercase underline">← Voltar para loja</Link>
      <div className="mt-8 grid gap-10 md:grid-cols-2">
        <div className="relative flex aspect-square items-center justify-center overflow-hidden border border-black bg-[#e8e7df]">
          {image ? (
            <Image src={image.src} alt={image.alt || product.name} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-contain p-8" />
          ) : (
            <span className="px-8 text-center text-xs font-bold uppercase tracking-widest text-black/45">
              Imagem do fornecedor será carregada na próxima sincronização
            </span>
          )}
        </div>
        <div className="flex flex-col justify-center">
          <p className="text-xs font-bold uppercase tracking-widest text-black/45">{product.brand || product.category}</p>
          <h1 className="display mt-2 text-6xl uppercase leading-[.8]">{product.name}</h1>
          {product.promotionalPrice !== undefined ? <p className="mt-7 text-sm text-black/40 line-through">{product.priceRaw}</p> : null}
          <p className="mt-1 text-2xl font-bold">R$ {currentPrice.toFixed(2).replace('.', ',')}</p>
          {product.description ? <p className="mt-5 max-w-md text-black/65">{product.description}</p> : null}
          <button onClick={() => add(product)} className="mt-8 w-fit bg-black px-7 py-4 text-sm font-black uppercase text-white">Adicionar ao carrinho</button>
        </div>
      </div>
    </div>
  );
}
