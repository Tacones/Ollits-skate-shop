'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/components/cart-provider';
import { getProductPrice } from '@/data/catalog';

export default function CarrinhoPage() {
  const { lines, total, remove } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function startCheckout() {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: lines.map(({ product, quantity }) => ({ productId: product.id, quantity })) }),
      });
      const data = await response.json() as { checkoutUrl?: string; error?: string };
      if (!response.ok || !data.checkoutUrl) throw new Error(data.error || 'Não foi possível iniciar o pagamento.');
      window.location.assign(data.checkoutUrl);
    } catch (checkoutError) {
      setError(checkoutError instanceof Error ? checkoutError.message : 'Erro ao iniciar checkout.');
      setLoading(false);
    }
  }

  return <div className="container-ollits py-12 md:py-16">
    <p className="text-[10px] font-black uppercase tracking-[.2em] text-[#d71920]">Seu setup</p>
    <h1 className="display mt-2 text-7xl uppercase leading-[.8] md:text-8xl">Sacola</h1>
    {lines.length === 0 ? <div className="mt-12 border-y border-black py-16 text-center"><p className="text-lg font-semibold">Sua sacola está vazia.</p><p className="mt-2 text-sm text-black/55">Encontre as peças para seu próximo rolê.</p><Link href="/loja" className="mt-7 inline-block bg-black px-6 py-4 text-[10px] font-black uppercase tracking-wider text-white">Explorar loja →</Link></div> :
      <div className="mt-10 grid gap-8 md:grid-cols-[1fr_340px]">
        <div className="border-y border-black">{lines.map(({ product, quantity }) => { const unitPrice = getProductPrice(product); return <div key={product.id} className="flex items-center justify-between gap-4 border-b border-black/15 py-5"><div><p className="font-bold">{product.name}</p><p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-black/45">Qtd. {quantity} · {product.sku ? `SKU ${product.sku}` : product.category}</p></div><div className="flex items-center gap-4"><strong className="whitespace-nowrap text-sm">R$ {(unitPrice * quantity).toFixed(2).replace('.', ',')}</strong><button onClick={() => remove(product.id)} className="text-[10px] font-bold uppercase underline">Remover</button></div></div>; })}</div>
        <aside className="h-fit border border-black bg-white p-6">
          <p className="text-[10px] font-black uppercase tracking-widest">Resumo do pedido</p>
          <div className="mt-5 flex justify-between border-b border-black/15 pb-4 text-sm"><span>Subtotal</span><span>R$ {total.toFixed(2).replace('.', ',')}</span></div>
          <div className="mt-4 flex justify-between"><span className="text-sm font-bold">Total</span><strong className="display text-3xl">R$ {total.toFixed(2).replace('.', ',')}</strong></div>
          <p className="mt-3 text-[10px] leading-relaxed text-black/50">O frete e os dados de entrega serão definidos na etapa de pagamento.</p>
          <button onClick={startCheckout} disabled={loading} className="mt-6 w-full bg-[#d71920] px-5 py-4 text-[10px] font-black uppercase tracking-wider text-white hover:bg-black disabled:opacity-50">{loading ? 'Conectando...' : 'Finalizar compra →'}</button>
          {error ? <p role="alert" className="mt-3 text-xs font-semibold text-[#d71920]">{error}</p> : null}
          <Link href="/loja" className="mt-4 block text-center text-[10px] font-bold uppercase underline">Continuar comprando</Link>
        </aside>
      </div>}
  </div>;
}
