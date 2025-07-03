import type { Product } from './Product';

export interface ApiResponse {
  products: Product[];
  total: number;
}
