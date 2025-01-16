'use client';

import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/lib/types/product';
import Link from 'next/link';
import Image from 'next/image';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="group overflow-hidden">
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-square">
        <Image
            src={product.image}
            alt={product.name}
            width={400}
            height={400}
            className="object-cover w-full h-full transition-transform group-hover:scale-105"
          />
          {product.isNewArrival && (
            <Badge className="absolute top-2 right-2">New Arrival</Badge>
          )}
          {product.isOnSale && (
            <Badge variant="destructive" className="absolute top-2 left-2">
              Sale
            </Badge>
          )}
        </div>
      </Link>
      <CardContent className="p-4">
        <h3 className="font-semibold truncate">{product.name}</h3>
        <div className="flex items-center gap-2 mt-1">
          {product.isOnSale ? (
            <>
              <span className="text-lg font-bold text-destructive">
                LKR {product.salePrice?.toFixed(2)}
              </span>
              <span className="text-sm line-through text-muted-foreground">
                LKR {product.price.toFixed(2)}
              </span>
            </>
          ) : (
            <span className="text-lg font-bold">LKR {product.price.toFixed(2)}</span>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full">Add to Cart</Button>
      </CardFooter>
    </Card>
  );
}