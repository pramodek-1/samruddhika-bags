import React from 'react';
import { ProductCard } from './ProductCard';
import { Product } from '@/lib/types/product';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface ProductGridProps {
  products: Product[];
  title: string;
  viewMoreLink?: string;
}

export function ProductGrid({ products, title, viewMoreLink }: ProductGridProps) {
  return (
    <section className="py-4 sm:py-8">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">{title}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      {viewMoreLink && (
        <div className="flex justify-center mt-6 sm:mt-8">
          <Link href="/products/all">
            <Button 
              variant="outline" 
              size="sm"
              className="text-xs sm:text-sm px-6 py-2 sm:px-8 sm:py-2.5 hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              View More
            </Button>
          </Link>
        </div>
      )}
    </section>
  );
}