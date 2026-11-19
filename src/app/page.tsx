import Link from 'next/link';
import { ProductCard } from '@/components/product-card';
import { featuredProducts } from '@/data/products';

const departments = [
  { name: 'Shapes', detail: 'Madeira, fibra e setups', href: '/loja?categoria=Shapes', number: '01' },
  { name: 'Trucks', detail: 'Controle para cada sessão', href: '/loja?categoria=Trucks', number: '02' },
  { name: 'Rodas', detail: 'Aderência e velocidade', href: '/loja?categoria=Rodas', number: '03' },
  { name: 'Rolamentos', detail: 'Giro livre, rolê longo', href: '/loja?categoria=Rolamentos', number: '04' },
  { name: 'Acessórios', detail: 'Peças e essenciais', href: '/loja?categoria=Acessórios', number: '05' },
  { name: 'Vestuário', detail: 'Vista a cultura', href: '/loja?categoria=Vestuário', number: '06' },
];

export default function Home() {
  return (
    <>
      <div className="marquee"><div className="container-ollits flex justify-between gap-8"><span>Skate para a rua</span><span>Seu próximo setup começa aqui</span><span>Ollits Skate Shop</span><span>Skate para a rua</span></div></div>
      <section className="bg-[#d71920] text-white">
        <div className="container-ollits grid min-h-[570px] items-center gap-8 py-16 md:grid-cols-[1.1fr_.9fr]">
          <div className="py-8">
            <p className="mb-6 text-[10px] font-black uppercase tracking-[.25em]">Ollits Skate Shop • Desde a rua</p>
            <h1 className="display text-[clamp(5rem,13vw,10.5rem)] uppercase leading-[.75]">Skate<br/>your<br/><span className="text-black">way.</span></h1>
            <p className="mt-8 max-w-md text-base font-medium text-white/90">Peças, equipamentos e atitude para montar seu próximo rolê. Encontre o que combina com sua sessão.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/loja" className="bg-black px-7 py-4 text-[11px] font-black uppercase tracking-wider text-white hover:bg-white hover:text-black">Comprar agora</Link>
              <Link href="/monte-seu-skate" className="border border-white px-7 py-4 text-[11px] font-black uppercase tracking-wider hover:bg-white hover:text-black">Monte seu skate</Link>
            </div>
          </div>
          <div className="relative flex aspect-square max-h-[470px] items-center justify-center overflow-hidden border border-white/40 bg-[#111] p-8">
            <div className="absolute inset-5 border border-white/20" />
            <div className="relative text-center"><p className="display text-[clamp(4.5rem,11vw,9rem)] leading-[.72]">OLLITS</p><p className="mt-6 text-[10px] font-black uppercase tracking-[.45em] text-[#d71920]">Skate shop</p><div className="mx-auto mt-8 h-1 w-20 bg-[#d71920]" /></div>
            <span className="absolute bottom-7 right-7 text-right text-[9px] font-bold uppercase tracking-widest text-white/50">Equipamento<br/> & cultura independente</span>
          </div>
        </div>
      </section>
      <section className="container-ollits py-16 md:py-20">
        <div className="mb-8 flex items-end justify-between gap-4"><div><p className="text-[10px] font-black uppercase tracking-[.2em] text-[#d71920]">Encontre seu equipamento</p><h2 className="display mt-2 text-5xl uppercase md:text-6xl">Compre por categoria</h2></div><Link href="/loja" className="text-[10px] font-black uppercase underline underline-offset-4">Ver todas →</Link></div>
        <div className="grid grid-cols-2 border-l border-t border-black md:grid-cols-3">
          {departments.map((item) => <Link key={item.name} href={item.href} className="group min-h-36 border-b border-r border-black bg-white p-5 transition hover:bg-black hover:text-white md:min-h-44 md:p-7"><div className="flex items-center justify-between"><span className="text-[9px] font-black text-[#d71920]">{item.number}</span><span className="text-lg transition group-hover:translate-x-1">↗</span></div><h3 className="display mt-7 text-3xl uppercase md:text-4xl">{item.name}</h3><p className="mt-1 text-[10px] text-black/55 group-hover:text-white/60">{item.detail}</p></Link>)}
        </div>
      </section>
      <section className="bg-[#efefed] py-16 md:py-20"><div className="container-ollits"><div className="mb-8 flex items-end justify-between"><div><p className="text-[10px] font-black uppercase tracking-[.2em] text-[#d71920]">Escolhas para sua próxima sessão</p><h2 className="display mt-2 text-5xl uppercase md:text-6xl">Destaques</h2></div><Link href="/loja" className="text-[10px] font-black uppercase underline underline-offset-4">Ver catálogo →</Link></div><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{featuredProducts.slice(0, 6).map((product) => <ProductCard key={product.id} product={product} />)}</div></div></section>
      <section className="bg-black py-16 text-white md:py-20"><div className="container-ollits grid gap-8 md:grid-cols-2 md:items-center"><div><p className="text-[10px] font-black uppercase tracking-[.2em] text-[#d71920]">Setup com a sua assinatura</p><h2 className="display mt-3 text-6xl uppercase leading-[.8] md:text-8xl">Monte seu<br/>skate.</h2></div><div><p className="max-w-lg text-base text-white/65">Escolha os componentes e construa um skate que acompanha seu estilo. O próximo rolê começa pelas peças certas.</p><Link href="/monte-seu-skate" className="mt-7 inline-block bg-[#d71920] px-7 py-4 text-[10px] font-black uppercase tracking-wider hover:bg-white hover:text-black">Começar meu setup →</Link></div></div></section>
      <section className="container-ollits py-16 md:py-20"><div className="grid gap-5 md:grid-cols-2"><Link href="/culture" className="group flex min-h-72 flex-col justify-between bg-[#d71920] p-8 text-white transition hover:bg-black"><p className="text-[10px] font-black uppercase tracking-[.2em]">Ollits Culture</p><div><h2 className="display text-6xl uppercase leading-[.8]">Mais que<br/>skate.</h2><p className="mt-6 text-xs font-bold uppercase underline underline-offset-4">Explorar cultura →</p></div></Link><div className="flex min-h-72 flex-col justify-between border border-black bg-white p-8"><p className="text-[10px] font-black uppercase tracking-[.2em] text-[#d71920]">Ollits Skate Shop</p><p className="display max-w-lg text-5xl uppercase leading-[.85] md:text-6xl">A rua é o nosso ponto de partida.</p></div></div></section>
    </>
  );
}
