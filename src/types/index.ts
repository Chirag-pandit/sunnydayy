export type Product = {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  category: 'tshirt' | 'hoodie' | 'shorts' | 'coming-soon';
  images: string[];
  isNew?: boolean;
  rating: number;
  reviewCount: number;
  description: string;
  sizes: string[];
  colors: string[];
  material: string;
  careInstructions: string[];
  stock: number;
  inStock?: boolean;
  shippingInfo?: string;
}

export interface Category {
  id: string;
  name: string;
  count: number;
}

export interface PriceRange {
  id: string;
  label: string;
  min: number;
  max: number | null;
}