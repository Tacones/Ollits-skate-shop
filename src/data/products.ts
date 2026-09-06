export type ProductCategory = 'Shapes' | 'Trucks' | 'Rodas' | 'Rolamentos' | 'Acessórios' | 'Vestuário';

export type Product = {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  featured?: boolean;
  tag?: string;
  description: string;
};

export const products: Product[] = [
  { id: 'shape-ollits-825', name: 'Ollits Street 8.25', category: 'Shapes', price: 249.9, featured: true, tag: 'Novo', description: 'Shape maple 7 lâminas, concave médio e construção para street.' },
  { id: 'truck-venture-139', name: 'Venture V-Hollow 5.25', category: 'Trucks', price: 319.9, featured: true, description: 'Truck leve para setup street com resposta rápida.' },
  { id: 'wheels-ollits-53', name: 'Ollits Street 53mm', category: 'Rodas', price: 169.9, featured: true, description: 'Rodas 53mm para equilíbrio entre velocidade e controle.' },
  { id: 'bearing-ollits-abec7', name: 'Ollits ABEC-7', category: 'Rolamentos', price: 89.9, description: 'Jogo com 8 rolamentos para giro suave e consistente.' },
  { id: 'tee-core-black', name: 'Ollits Core Tee', category: 'Vestuário', price: 119.9, tag: 'Core', description: 'Camiseta de algodão com identidade Ollits.' },
  { id: 'wax-block', name: 'Ollits Curb Wax', category: 'Acessórios', price: 39.9, description: 'Cera compacta para sessões de street.' },
];

export const categories: ProductCategory[] = ['Shapes', 'Trucks', 'Rodas', 'Rolamentos', 'Acessórios', 'Vestuário'];
