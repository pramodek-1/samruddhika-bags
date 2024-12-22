import React from 'react';
import { ProductGrid } from '@/components/products/ProductGrid';
import { products } from '@/lib/data/products';
import { notFound } from 'next/navigation';

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const categoryProducts = products.filter(
    (product) => product.category === params.slug
  );

  if (categoryProducts.length === 0) {
    notFound();
  }

  const categoryTitle = params.slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">{categoryTitle}</h1>
      <ProductGrid title="All Products" products={categoryProducts} />
    </div>
  );
}