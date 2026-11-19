import Link from 'next/link';

export default function PedidoSucessoPage() {
  return (
    <main className="container-ollits py-20">
      <div className="mx-auto max-w-2xl border border-black bg-white p-8 md:p-12">
        <p className="text-[10px] font-black uppercase tracking-[.2em] text-[#d71920]">Ollits Skate Shop</p>
        <h1 className="display mt-4 text-6xl uppercase leading-[.82]">Valeu pelo<br/>pedido.</h1>
        <p className="mt-7 text-sm leading-relaxed text-black/65">Você voltou da etapa de pagamento. A confirmação definitiva depende da notificação do Mercado Pago; se o pagamento ainda estiver em processamento, aguarde a atualização antes de considerar o pedido aprovado.</p>
        <Link href="/loja" className="mt-8 inline-block bg-black px-6 py-4 text-[10px] font-black uppercase tracking-wider text-white">Voltar para a loja →</Link>
      </div>
    </main>
  );
}
