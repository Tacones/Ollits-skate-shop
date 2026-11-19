'use client';

import Link from 'next/link';
import { useCart } from '@/components/cart-provider';

const departments = ['Shapes', 'Trucks', 'Rodas', 'Rolamentos', 'Acessórios', 'Vestuário'];

export function Header() {
  const { count } = useCart();
  return (
    <header className="sticky top-0 z-50 border-b border-black bg-white">
      <div className="bg-black py-2 text-center text-[9px] font-black uppercase tracking-[.2em] text-white">Ollits Skate Shop • Equipamento e cultura de rua</div>
      <div className="container-ollits flex min-h-[76px] items-center justify-between gap-4">
        <Link href="/" aria-label="Ollits Skate Shop - início" className="display flex items-center text-4xl tracking-tight">
          <span>OLLITS</span><span className="ml-1 inline-block h-3 w-3 rounded-full bg-[#d71920]" />
        </Link>
        <nav className="hidden items-center gap-7 text-[11px] font-black uppercase tracking-wider md:flex">
          <Link href="/loja" className="hover:text-[#d71920]">Loja</Link>
          <Link href="/loja?categoria=Skate%20Completo" className="hover:text-[#d71920]">Skates completos</Link>
          <Link href="/monte-seu-skate" className="hover:text-[#d71920]">Monte seu skate</Link>
          <Link href="/culture" className="hover:text-[#d71920]">Culture</Link>
        </nav>
        <div className="flex items-center gap-3 text-[10px] font-black uppercase">
          <Link href="/loja" className="hidden sm:block hover:text-[#d71920]">Buscar</Link>
          <Link href="/carrinho" className="border border-black px-4 py-3 hover:bg-[#d71920] hover:text-white">Sacola ({count})</Link>
        </div>
      </div>
      <div className="hidden border-t border-black/10 bg-[#f3f3f1] md:block">
        <div className="container-ollits flex items-center justify-center gap-7 overflow-x-auto py-3 text-[9px] font-black uppercase tracking-[.14em]">
          {departments.map((item) => <Link key={item} href={`/loja?categoria=${encodeURIComponent(item)}`} className="whitespace-nowrap hover:text-[#d71920]">{item}</Link>)}
        </div>
      </div>
    </header>
  );
}
