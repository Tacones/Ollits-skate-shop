'use client';

import Link from 'next/link';
import { useCart } from '@/components/cart-provider';
import { getProductPrice } from '@/data/catalog';

export default function CarrinhoPage() {
  const { lines, total, remove } = useCart();
  return <div className="container-ollits py-16"><p className="text-xs font-bold uppercase tracking-widest text-black/45">Seu setup</p><h1 className="display mt-2 text-7xl uppercase leading-[.8]">Carrinho</h1>{lines.length === 0 ? <div className="mt-12 border-y border-black py-16 text-center"><p className="text-lg font-semibold">Seu carrinho está vazio.</p><p className="mt-2 text-sm text-black/55">Adicione peças e comece a montar seu próximo setup.</p><Link href="/loja" className="mt-7 inline-block bg-black px-6 py-3 text-sm font-black uppercase text-white">Explorar loja →</Link></div> : <div className="mt-12 grid gap-8 md:grid-cols-[1fr_320px]"><div className="border-y border-black">{lines.map(({ product, quantity }) => { const unitPrice = getProductPrice(product); return <div key={product.id} className="flex items-center justify-between gap-4 border-b border-black/15 py-5"><div><p className="font-bold">{product.name}</p><p className="text-xs text-black/50">Qtd. {quantity}</p></div><div className="flex items-center gap-5"><strong>R$ {(unitPrice * quantity).toFixed(2).replace('.', ',')}</strong><button onClick={() => remove(product.id)} className="text-xs font-bold uppercase underline">Remover</button></div></div>; })}</div><aside className="h-fit border border-black bg-[#d8ff35] p-6"><p className="text-xs font-bold uppercase">Total</p><p className="display mt-2 text-4xl">R$ {total.toFixed(2).replace('.', ',')}</p><button className="mt-6 w-full bg-black px-5 py-4 text-sm font-black uppercase text-white">Continuar checkout</button></aside></div>}</div>;
}
