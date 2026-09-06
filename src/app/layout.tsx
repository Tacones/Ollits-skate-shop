import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { CartProvider } from '@/components/cart-provider';

export const metadata: Metadata = {
  title: 'Ollits Skate Shop | Skate, Street & Culture',
  description: 'Ollits Skate Shop — peças, shapes, trucks, rodas e cultura skate.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body><CartProvider><Header /><main>{children}</main><Footer /></CartProvider></body>
    </html>
  );
}
