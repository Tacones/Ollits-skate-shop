import Link from 'next/link';
import { ProductCard } from '@/components/product-card';
import { products } from '@/data/products';

export default function Home() {
  const featured = products.filter((p) => p.featured);
  return (
    <>
      <div className="marquee"><div className="container-ollits"><span>Skate para a rua</span><span>Setup sob medida</span><span>Ollits Culture</span><span>Skate para a rua</span></div></div>
      <section className="border-b border-black bg-[#d8ff35]">
        <div className="container-ollits grid min-h-[640px] items-center gap-10 py-20 md:grid-cols-[1.2fr_.8fr]">
          <div><p className="mb-5 text-xs font-black uppercase tracking-[.25em]">Skate shop • desde a rua</p><h1 className="display max-w-4xl text-[clamp(5rem,13vw,11rem)] uppercase leading-[.78]">Ride<br />Your<br />Way.</h1><p className="mt-8 max-w-md text-lg font-medium">Peças certas, setup certo e uma cultura que não para na pista.</p><div className="mt-8 flex flex-wrap gap-3"><Link href="/loja" className="border border-black bg-black px-6 py-3 text-sm font-black uppercase text-white">Ver loja</Link><Link href="/monte-seu-skate" className="border border-black px-6 py-3 text-sm font-black uppercase">Montar skate</Link></div></div>
          <div className="relative flex aspect-square items-center justify-center border border-black bg-[#f5f4ef] p-10"><div className="display rotate-[-9deg] text-center text-[clamp(5rem,12vw,10rem)] leading-[.7]">OLLITS<br /><span className="text-5xl">SKATE SHOP</span></div><div className="absolute bottom-4 right-4 max-w-40 text-right text-[10px] font-bold uppercase tracking-widest">Equipamento & cultura independente</div></div>
        </div>
      </section>
      <section className="container-ollits py-20"><div className="mb-8 flex items-end justify-between"><div><p className="text-xs font-bold uppercase tracking-widest text-black/45">Seleção Ollits</p><h2 className="display mt-1 text-5xl uppercase">Destaques</h2></div><Link href="/loja" className="text-xs font-black uppercase underline">Ver tudo →</Link></div><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{featured.map((p) => <ProductCard key={p.id} product={p} />)}</div></section>
      <section className="border-y border-black bg-[#111] py-20 text-white"><div className="container-ollits grid gap-8 md:grid-cols-[1fr_1fr] md:items-end"><div><p className="text-xs font-bold uppercase tracking-widest text-white/40">Do seu jeito</p><h2 className="display mt-2 text-6xl uppercase leading-[.8]">Monte<br />seu<br />Skate.</h2></div><div><p className="max-w-lg text-lg text-white/70">Escolha shape, trucks, rodas e rolamentos. A base para transformar componentes em um setup com a sua cara.</p><Link href="/monte-seu-skate" className="mt-7 inline-block bg-[#d8ff35] px-6 py-3 text-sm font-black uppercase text-black">Começar setup →</Link></div></div></section>
      <section className="container-ollits py-20"><div className="grid gap-6 md:grid-cols-2"><Link href="/culture" className="group border border-black bg-[#d8ff35] p-8"><p className="text-xs font-bold uppercase tracking-widest">Ollits Culture</p><h2 className="display mt-16 text-6xl uppercase leading-[.8]">Mais que<br />skate.</h2><p className="mt-8 max-w-sm text-sm font-medium">Histórias, spots, pessoas e tudo que mantém a rua em movimento.</p><span className="mt-8 block text-xs font-black uppercase underline">Explorar culture →</span></Link><div className="flex min-h-80 items-end border border-black bg-[#e8e7df] p-8"><div><p className="text-xs font-bold uppercase tracking-widest text-black/45">Ollits</p><p className="display mt-2 text-6xl uppercase leading-[.8]">Street<br />is a<br />state of mind.</p></div></div></div></section>
    </>
  );
}
