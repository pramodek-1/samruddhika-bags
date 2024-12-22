export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  isNewArrival?: boolean;
  isOnSale?: boolean;
  salePrice?: number;
}