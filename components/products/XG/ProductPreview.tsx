import { useState, useEffect } from 'react'
import { Product } from '@/components/data/productData'
import { product, relatedProducts } from '@/components/data/XG/productData'
import { ProductImage } from '@/components/products/XG/ProductImage'
import { ProductInfo } from '@/components/products/XG/ProductInfo'
import { ProductDescription } from '@/components/products/XG/ProductDescription'
import { RelatedProducts } from '@/components/products/XG/RelatedProducts'

interface ProductPreviewProps {
  product: Product;
  // ... rest of the interface
}

export function ProductPreview({ product, ...props }: ProductPreviewProps) {
  const [selectedColor, setSelectedColor] = useState(product.variations.color[0])
  const [selectedSize, setSelectedSize] = useState(product.variations.size[0])
  const [currentMainImage, setCurrentMainImage] = useState(product.mainImage)

  useEffect(() => {
    // Set initial color to the first in-stock color
    const firstInStockColor = product.variations.color.find(color => !product.outOfStock?.includes(color))
    if (firstInStockColor) {
      setSelectedColor(firstInStockColor)
      setCurrentMainImage(product.images[firstInStockColor][0])
    }
  }, [])

  const handleColorChange = (color: string) => {
    if (!product.outOfStock?.includes(color)) {
      setSelectedColor(color);
      setCurrentMainImage(product.images[color][0]);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <ProductImage mainImage={currentMainImage} images={product.images[selectedColor]} />
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

