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
    category: 'school-bags',
    image: '/images/products/field_main.jpg',
    isOnSale: true,
    salePrice: 1999
  },
  {
    id: '3',
    name: 'XG School-Travel BackPack',
    description: 'Spacious duffel bag perfect for weekend getaways',
    price: 3099,
    category: 'school-bags',
    image: '/images/products/XG_main.jpg',
    isNewArrival: true
  },
  {
    id: '4',
    name: 'Weizhina School-Class Bag',
    description: 'Colorful and lightweight bag for pre-school children',
    price: 1650,
    category: 'class-bags',
    image: '/images/products/weizhina_main.jpg',
    isOnRecommend: true
  },
  {
    id: '5',
    name: "Office Bag 'S'",
    description: 'Small and convenient bag for daily essentials',
    price: 1950,
    category: 'travelling-bags',
    image: '/images/products/lapS_main.jpg',
    isOnSale: true,
    salePrice: 1750
  },
  {
    id: '6',
    name: "Travelling 'M' Bag",
    description: 'Perfect bag for carrying Gods and supplies',
    price: 1350,
    category: 'travelling-bags',
    image: '/images/products/travellingM_main.jpg',
    isOnRecommend: true
  },
  {
    id: '7',
    name: "Kitty Bag",
    description: 'Perfect class bag for Girls',
    price: 1650,
    category: 'class-bags',
    image: '/images/products/kitty_main.jpg',
    isOnRecommend: true
  },
  {
    id: '8',
    name: "Dell School BackPack",
    description: 'School bag-Class bag-Laptop bag for Girls & Boys',
    price: 2000,
    category: 'school-bags',
    image: '/images/products/dell_main.jpg',
    isOnSale: true,
    salePrice: 1899
  },
  {
    id: '9',
    name: "Fila Side Bag",
    description: 'Suitable for both boys & gils as class bag/sidebag',
    price: 2000,
    category: 'class-bags',
    image: '/images/products/fila_side_main.jpg',
    isOnRecommend: true
  }
];