'use client';

import { useState } from 'react'
import { Product, product, relatedProducts } from '@/components/data/productData'
import { ProductImage } from '@/components/products/ProductImage'
import { ProductInfo } from '@/components/products/ProductInfo'
import { ProductDescription } from '@/components/products/ProductDescription'
import { RelatedProducts } from '@/components/products/RelatedProducts'

export function ProductPreview() {
    const [selectedColor, setSelectedColor] = useState(product.variations.color[0])
    const [selectedSize, setSelectedSize] = useState(product.variations.size[0])
  
    const handleColorChange = (color: string) => {
      setSelectedColor(color);
    };
  
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <ProductImage images={product.images[selectedColor]} />
          <ProductInfo
            product={product}
            selectedColor={selectedColor}
            selectedSize={selectedSize}
            onColorChange={handleColorChange}
            onSizeChange={setSelectedSize}
          />
        </div>
        <ProductDescription description={product.description} />
        <RelatedProducts products={relatedProducts} />
      </div>
    )
  }
  

