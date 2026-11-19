import { NextResponse } from 'next/server';
import { products, getProductPrice } from '@/data/catalog';

export const runtime = 'nodejs';

type CheckoutRequest = {
  items?: Array<{ productId?: string; quantity?: number }>;
};

export async function POST(request: Request) {
  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!accessToken) {
    return NextResponse.json(
      { error: 'Checkout ainda não foi ativado. Falta configurar a credencial segura do Mercado Pago na Vercel.' },
      { status: 503 },
    );
  }

  let body: CheckoutRequest;
  try {
    body = await request.json() as CheckoutRequest;
  } catch {
    return NextResponse.json({ error: 'Dados do carrinho inválidos.' }, { status: 400 });
  }

  if (!Array.isArray(body.items) || body.items.length === 0) {
    return NextResponse.json({ error: 'Seu carrinho está vazio.' }, { status: 400 });
  }

  const preferenceItems = [];
  for (const item of body.items) {
    const product = products.find((candidate) => candidate.id === item.productId);
    const quantity = Number(item.quantity);
    if (!product || !product.available || !Number.isInteger(quantity) || quantity < 1 || quantity > 20) {
      return NextResponse.json({ error: 'Um dos produtos não está disponível ou tem quantidade inválida. Atualize seu carrinho.' }, { status: 400 });
    }
    const price = getProductPrice(product);
    if (!Number.isFinite(price) || price <= 0) {
      return NextResponse.json({ error: 'Preço inválido para um dos produtos. Entre em contato com a Ollits.' }, { status: 400 });
    }
    preferenceItems.push({
      id: product.id,
      title: product.name.slice(0, 256),
      quantity,
      currency_id: 'BRL',
      unit_price: Number(price.toFixed(2)),
    });
  }

  const origin = new URL(request.url).origin;
  const preferencePayload = {
    items: preferenceItems,
    back_urls: {
      success: `${origin}/pedido/sucesso`,
      failure: `${origin}/carrinho?pagamento=erro`,
      pending: `${origin}/carrinho?pagamento=pendente`,
    },
    auto_return: 'approved',
    statement_descriptor: 'OLLITS SKATE SHOP',
    external_reference: `ollits-${crypto.randomUUID()}`,
    ...(process.env.MERCADOPAGO_WEBHOOK_URL ? { notification_url: process.env.MERCADOPAGO_WEBHOOK_URL } : {}),
  };

  const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(preferencePayload),
    cache: 'no-store',
  });

  const result = await response.json() as { init_point?: string; message?: string; error?: string };
  if (!response.ok || !result.init_point) {
    console.error('Mercado Pago preference creation failed:', response.status, result.message || result.error);
    return NextResponse.json({ error: 'O Mercado Pago não conseguiu iniciar o pagamento. Tente novamente em instantes.' }, { status: 502 });
  }

  return NextResponse.json({ checkoutUrl: result.init_point });
}
