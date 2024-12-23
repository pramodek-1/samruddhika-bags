import { useState, useEffect } from 'react'
import { product, relatedProducts } from '@/components/data/productData'
import { ProductImage } from '@/components/products/ProductImage'
import { ProductInfo } from '@/components/products/ProductInfo'
import { ProductDescription } from '@/components/products/ProductDescription'
import { RelatedProducts } from '@/components/products/RelatedProducts'

export function ProductPreview() {
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

