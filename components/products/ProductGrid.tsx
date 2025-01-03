import React from 'react';
import { ProductCard } from './ProductCard';
import { Product } from '@/lib/types/product';

interface ProductGridProps {
  products: Product[];
  title: string;
}

export function ProductGrid({ products, title }: ProductGridProps) {
  return (
    <section className="py-4 sm:py-8">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">{title}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}