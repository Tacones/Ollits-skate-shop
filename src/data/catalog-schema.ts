export type ProductImage = {
  src: string;
  alt?: string;
  position?: number;
};

export type ProductVariant = {
  id: string;
  name: string;
  value: string;
  price?: number;
  promotionalPrice?: number;
  available: boolean;
  sku?: string;
  stock?: number;
  color?: string;
};

export type Product = {
  id: string;
  sku?: string;
  name: string;
  brand?: string;
  category: string;
  department?: string;
  price: number;
  priceRaw?: string;
  promotionalPrice?: number;
  promotionalPriceRaw?: string;
  discountPercent?: number;
  discountPercentRaw?: string;
  variants: ProductVariant[];
  description?: string;
  specifications: Record<string, string>;
  images: ProductImage[];
  available: boolean;
  stock?: number;
  sourceUrl?: string;
  source: 'Osso Skate Shop';
};

/** UI taxonomy retained for the existing builder/catalog navigation. */
export const categories = [
  'Shapes',
  'Trucks',
  'Rodas',
  'Rolamentos',
  'Acessórios',
  'Vestuário',
  'Skate Completo',
  'Longboard',
] as const;

export type ProductCategory = (typeof categories)[number];
