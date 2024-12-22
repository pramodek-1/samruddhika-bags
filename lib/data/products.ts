import { Product } from '../types/product';

export const products: Product[] = [
  {
    id: '1',
    name: "Columbia 'L' School Backpack",
    description: 'Durable and spacious backpack perfect for students',
    price: 49.99,
    category: 'school-bags',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80',
    isNewArrival: true
  },
  {
    id: '2',
    name: 'Premium Leather Handbag',
    description: 'Elegant leather handbag for everyday use',
    price: 89.99,
    category: 'hand-bags',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80',
    isOnSale: true,
    salePrice: 69.99
  },
  {
    id: '3',
    name: 'Travel Duffel Bag',
    description: 'Spacious duffel bag perfect for weekend getaways',
    price: 79.99,
    category: 'travelling-bags',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80',
    isNewArrival: true
  },
  {
    id: '4',
    name: 'Kids School Bag',
    description: 'Colorful and lightweight bag for pre-school children',
    price: 34.99,
    category: 'pre-school-bags',
    image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=80',
    isNewArrival: true
  },
  {
    id: '5',
    name: 'Compact Pocket Bag',
    description: 'Small and convenient bag for daily essentials',
    price: 29.99,
    category: 'pocket-bags',
    image: 'https://images.unsplash.com/photo-1548863227-3af567fc3b27?auto=format&fit=crop&q=80',
    isOnSale: true,
    salePrice: 24.99
  },
  {
    id: '6',
    name: 'Student Class Bag',
    description: 'Perfect bag for carrying books and supplies',
    price: 44.99,
    category: 'class-bags',
    image: 'https://images.unsplash.com/photo-1591375275624-c2f9bb480238?auto=format&fit=crop&q=80',
    isNewArrival: true
  }
];