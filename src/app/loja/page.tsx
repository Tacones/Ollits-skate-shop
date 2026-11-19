import { CatalogBrowser } from '@/components/catalog-browser';

export default function LojaPage() {
  return (
    <div className="container-ollits py-12 md:py-16">
      <div className="mb-10 flex flex-col justify-between gap-5 border-b border-black pb-8 md:flex-row md:items-end">
        <div><p className="text-[10px] font-black uppercase tracking-[.2em] text-[#d71920]">Ollits Skate Shop / Catálogo</p><h1 className="display mt-2 text-7xl uppercase leading-[.8] md:text-8xl">Loja</h1><p className="mt-5 max-w-xl text-sm text-black/60">Explore peças, equipamentos e acessórios. Use a busca e os filtros para encontrar o que procura.</p></div>
        <p className="text-[10px] font-black uppercase tracking-widest">Equipamento & cultura de rua</p>
      </div>
      <CatalogBrowser />
    </div>
  );
}
