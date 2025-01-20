export interface Product {
  id: string;
  name: string;
  brand?: string;
  category: string;
  description?: string;
  price: number;
  image: string;
  isNewArrival?: boolean;
  isOnSale?: boolean;
  isOnRecommend?: boolean;
  salePrice?: number;
}