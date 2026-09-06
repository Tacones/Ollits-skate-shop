import Link from 'next/link';

export default function CarrinhoPage() {
  return <div className="container-ollits py-16"><p className="text-xs font-bold uppercase tracking-widest text-black/45">Seu setup</p><h1 className="display mt-2 text-7xl uppercase leading-[.8]">Carrinho</h1><div className="mt-12 border-y border-black py-16 text-center"><p className="text-lg font-semibold">Seu carrinho está vazio.</p><p className="mt-2 text-sm text-black/55">Adicione peças e comece a montar seu próximo setup.</p><Link href="/loja" className="mt-7 inline-block bg-black px-6 py-3 text-sm font-black uppercase text-white">Explorar loja →</Link></div></div>;
}
