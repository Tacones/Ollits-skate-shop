import Link from 'next/link';
import { notFound } from 'next/navigation';
import { products } from '@/data/products';

export function generateStaticParams() { return products.map((product) => ({ id: product.id })); }

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = products.find((item) => item.id === id);
  if (!product) notFound();
  return <div className="container-ollits py-16"><Link href="/loja" className="text-xs font-bold uppercase underline">← Voltar para loja</Link><div className="mt-8 grid gap-10 md:grid-cols-2"><div className="flex aspect-square items-center justify-center border border-black bg-[#e8e7df]"><div className="display text-center text-7xl uppercase leading-[.75]">{product.category}<br /><span className="text-3xl">OLLITS</span></div></div><div className="flex flex-col justify-center"><p className="text-xs font-bold uppercase tracking-widest text-black/45">{product.category}</p><h1 className="display mt-2 text-6xl uppercase leading-[.8]">{product.name}</h1><p className="mt-7 text-2xl font-bold">R$ {product.price.toFixed(2).replace('.', ',')}</p><p className="mt-5 max-w-md text-black/65">{product.description}</p><button className="mt-8 w-fit bg-black px-7 py-4 text-sm font-black uppercase text-white">Adicionar ao carrinho</button></div></div></div>;
}
