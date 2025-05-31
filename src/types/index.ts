export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  image: string;
  images: string[];
  inStock: boolean;
  isNew: boolean;
  date: string;
  rating: number;
  colors: string[];
  sizes: string[];
  shippingInfo: string;
  sizeChart: Record<string, string>;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}