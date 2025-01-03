import React from 'react';
import { ProductGrid } from '@/components/products/ProductGrid';
import { products } from '@/lib/data/products';
import { Button } from '@/components/ui/button';

export default function Home() {
  const newArrivals = products.filter((product) => product.isNewArrival);
  const saleProducts = products.filter((product) => product.isOnSale);

  return (
    <main>
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&q=80')] bg-cover bg-center">
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative text-center text-white space-y-4">
          <h1 className="text-5xl font-bold">Premium Quality Bags</h1>
          <p className="text-xl">Discover our collection of stylish and durable bags</p>
          <Button size="lg" variant="secondary">
            Shop Now
          </Button>
        </div>
      </section>

      <div className="container mx-auto px-4">
        <ProductGrid 
          products={newArrivals} 
          title="New Arrivals" 
          viewMoreLink="/category/new-arrivals"
        />
        
        <ProductGrid 
          products={saleProducts} 
          title="On Sale" 
          viewMoreLink="/category/on-sale"
        />
      </div>
    </main>
  );
}