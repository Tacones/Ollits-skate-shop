import Link from 'next/link';

export function Footer() {
  return (
    <footer className="mt-24 border-t border-black bg-[#111] text-white">
      <div className="container-ollits grid gap-10 py-14 md:grid-cols-3">
        <div><div className="display text-4xl">OLLITS.</div><p className="mt-3 max-w-sm text-sm text-white/60">Skate shop independente. Equipamento, estilo e cultura para quem vive a rua.</p></div>
        <div><p className="mb-3 text-xs font-bold uppercase tracking-widest text-white/40">Explorar</p><div className="grid gap-2 text-sm"><Link href="/loja">Loja</Link><Link href="/monte-seu-skate">Monte seu Skate</Link><Link href="/culture">Ollits Culture</Link></div></div>
        <div><p className="mb-3 text-xs font-bold uppercase tracking-widest text-white/40">Atendimento</p><p className="text-sm text-white/70">Dúvidas sobre setup? Fale com a Ollits.</p></div>
      </div>
      <div className="border-t border-white/10 py-5"><div className="container-ollits flex flex-col justify-between gap-2 text-xs text-white/40 sm:flex-row"><span>© 2026 Ollits Skate Shop</span><span>Feito para a rua.</span></div></div>
    </footer>
  );
}
