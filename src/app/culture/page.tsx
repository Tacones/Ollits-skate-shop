const stories = [
  ['01', 'A rua ensina', 'Skate não é só manobra. É olhar para a cidade de outro jeito.'],
  ['02', 'Setup com propósito', 'Cada componente muda a sensação. Conheça o que você pisa, gira e segura.'],
  ['03', 'Ollits Culture', 'Uma comunidade feita de spots, sessões, música, arte e gente que aparece.'],
];

export default function CulturePage() {
  return <div><section className="border-b border-black bg-[#111] py-24 text-white"><div className="container-ollits"><p className="text-xs font-bold uppercase tracking-widest text-white/40">Ollits editorial</p><h1 className="display mt-3 text-[clamp(5rem,13vw,11rem)] uppercase leading-[.75]">Culture<br /><span className="text-[#d8ff35]">Moves.</span></h1></div></section><section className="container-ollits py-20"><div className="grid gap-6">{stories.map(([number, title, text]) => <article key={number} className="grid gap-6 border-b border-black py-8 md:grid-cols-[100px_1fr_1fr]"><span className="font-mono text-sm">{number}</span><h2 className="display text-4xl uppercase">{title}</h2><p className="max-w-md text-black/60">{text}</p></article>)}</div></section></div>;
}
