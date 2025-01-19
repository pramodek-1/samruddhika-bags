'use client';

import React, { useState } from 'react';
import { products } from '@/lib/data/products';
import { ProductCard } from '@/components/products/ProductCard';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function AllProducts() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Get unique categories from products
  const categories = ['all', ...Array.from(new Set(products.map(product => product.category)))];

  // Filter products based on selected category
  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(product => product.category === selectedCategory);

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">All Products</h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-2">
          Browse our complete collection of bag
        </p>
      </div>

      {/* Category Filter */}
      <div className="mb-6 sm:mb-8 overflow-x-auto">
        <div className="flex gap-2 sm:gap-4 min-w-max pb-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant="outline"
              size="sm"
              className={cn(
                "text-xs sm:text-sm capitalize",
                selectedCategory === category && "bg-primary text-primary-foreground"
              )}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
        {filteredProducts.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product}
          />
        ))}
      </div>

      {/* No Products Message */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No products found in the {selectedCategory} category
          </p>
        </div>
      )}
    </div>
  );
}
