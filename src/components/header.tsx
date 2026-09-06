import Link from 'next/link';

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-black bg-[#f5f4ef]/95 backdrop-blur">
      <div className="container-ollits flex h-16 items-center justify-between gap-6">
        <Link href="/" className="display text-2xl tracking-tight">OLLITS<span className="text-[#b7d900]">.</span></Link>
        <nav className="hidden items-center gap-6 text-xs font-bold uppercase tracking-wider md:flex">
          <Link href="/loja" className="hover:underline">Loja</Link>
          <Link href="/monte-seu-skate" className="hover:underline">Monte seu Skate</Link>
          <Link href="/culture" className="hover:underline">Ollits Culture</Link>
        </nav>
        <div className="flex items-center gap-3 text-xs font-bold uppercase">
          <Link href="/loja" aria-label="Buscar produtos" className="hidden sm:block">Buscar</Link>
          <Link href="/carrinho" className="rounded-full border border-black px-4 py-2 hover:bg-black hover:text-white">Carrinho (0)</Link>
        </div>
      </div>
    </header>
  );
}
