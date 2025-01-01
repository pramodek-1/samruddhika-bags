import { Product } from '../types/product';

export const products: Product[] = [
  {
    id: '1',
    name: "Columbia 'L' School BackPack",
    description: 'Durable and spacious backpack perfect for students',
    price: 1999,
    category: 'school-bags',
    image: '/images/products/columbiaL_main.png',
    isNewArrival: true
  },
  {
    id: '2',
    name: 'Field School BackPack',
    description: 'Elegant leather handbag for everyday use',
    price: 2199,
    category: 'hand-bags',
    image: '/images/products/field_main.jpg',
    isOnSale: true,
    salePrice: 1999
  },
  {
    id: '3',
    name: 'XG School-Travel BackPack',
    description: 'Spacious duffel bag perfect for weekend getaways',
    price: 3099,
    category: 'travelling-bags',
    image: '/images/products/XG_main.jpg',
    isNewArrival: true
  },
  {
    id: '4',
    name: 'Weizhina School-Class Bag',
    description: 'Colorful and lightweight bag for pre-school children',
    price: 1650,
    category: 'pre-school-bags',
    image: '/images/products/weizhina_main.jpg',
    isNewArrival: true
  },
  {
    id: '5',
    name: "Office Bag 'S'",
    description: 'Small and convenient bag for daily essentials',
    price: 1950,
    category: 'pocket-bags',
    image: '/images/products/lapS_main.jpg',
    isOnSale: true,
    salePrice: 1750
  },
  {
    id: '6',
    name: "Travelling 'M' Bag",
    description: 'Perfect bag for carrying books and supplies',
    price: 1350,
    category: 'class-bags',
    image: '/images/products/travellingM_main.jpg',
    isNewArrival: true
  }
];