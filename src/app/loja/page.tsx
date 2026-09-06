import { CatalogBrowser } from '@/components/catalog-browser';

export default function LojaPage() {
  return (
    <div className="container-ollits py-16">
      <div className="mb-12 border-b border-black pb-8">
        <p className="text-xs font-bold uppercase tracking-widest text-black/45">Ollits Skate Shop</p>
        <h1 className="display mt-2 text-7xl uppercase leading-[.8]">Loja</h1>
        <p className="mt-6 max-w-xl text-lg text-black/65">Componentes, acessórios e apparel para montar seu próximo rolê.</p>
      </div>
      <CatalogBrowser />
    </div>
  );
}
