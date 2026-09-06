export type ProductCategory =
  | 'Shapes'
  | 'Trucks'
  | 'Rodas'
  | 'Rolamentos'
  | 'Acessórios'
  | 'Vestuário';

export type ProductImage = {
  src: string;
  alt: string;
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
};

export type Product = {
  id: string;
  sku?: string;
  name: string;
  brand: string;
  category: ProductCategory;
  price: number;
  promotionalPrice?: number;
  variants: ProductVariant[];
  description: string;
  specifications: Record<string, string>;
  images: ProductImage[];
  available: boolean;
  stock?: number;
};

export const categories: ProductCategory[] = [
  'Shapes',
  'Trucks',
  'Rodas',
  'Rolamentos',
  'Acessórios',
  'Vestuário',
];
