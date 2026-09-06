'use client';

import { useMemo, useState } from 'react';
import { products } from '@/data/products';

const groups = [
  { label: 'Shape', category: 'Shapes' as const },
  { label: 'Trucks', category: 'Trucks' as const },
  { label: 'Rodas', category: 'Rodas' as const },
  { label: 'Rolamentos', category: 'Rolamentos' as const },
];

export default function MonteSeuSkatePage() {
  const [selected, setSelected] = useState<Record<string, string>>({});
  const total = useMemo(() => groups.reduce((sum, group) => sum + (products.find((p) => p.id === selected[group.category])?.price ?? 0), 0), [selected]);
  return <div className="container-ollits py-16"><p className="text-xs font-bold uppercase tracking-widest text-black/45">Builder</p><h1 className="display mt-2 text-7xl uppercase leading-[.8]">Monte seu<br />Skate.</h1><p className="mt-6 max-w-xl text-lg text-black/65">Escolha cada componente. O total é atualizado na hora.</p><div className="mt-12 grid gap-5 md:grid-cols-2">{groups.map((group, index) => <section key={group.category} className="border border-black bg-white p-6"><div className="flex items-center justify-between"><h2 className="font-black uppercase">0{index + 1} / {group.label}</h2><span className="text-xs text-black/45">{group.category}</span></div><select value={selected[group.category] ?? ''} onChange={(e) => setSelected({ ...selected, [group.category]: e.target.value })} className="mt-6 w-full border border-black bg-[#f5f4ef] p-4 text-sm font-semibold"><option value="">Selecionar componente</option>{products.filter((p) => p.category === group.category).map((p) => <option key={p.id} value={p.id}>{p.name} — R$ {p.price.toFixed(2).replace('.', ',')}</option>)}</select></section>)}</div><div className="mt-8 flex flex-col justify-between gap-5 border border-black bg-[#d8ff35] p-6 sm:flex-row sm:items-center"><div><p className="text-xs font-bold uppercase">Total estimado</p><p className="display mt-1 text-4xl">R$ {total.toFixed(2).replace('.', ',')}</p></div><button className="bg-black px-7 py-4 text-sm font-black uppercase text-white">Adicionar setup ao carrinho</button></div></div>;
}
