'use client';

import { useState, useEffect } from 'react'
import { Product } from '@/components/data/productData'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { useCart } from '@/lib/context/CartContext'
import { toast } from 'sonner'

interface ProductInfoProps {
  product: Product
  selectedColor: string
  selectedSize: string
  onColorChange: (color: string) => void
  onSizeChange: (size: string) => void
}

export function ProductInfo({
  product,
  selectedColor,
  selectedSize,
  onColorChange,
  onSizeChange,
}: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1)
  const [totalPrice, setTotalPrice] = useState(product.price)
  const { addToCart } = useCart()

  useEffect(() => {
    setTotalPrice(product.price * quantity)
  }, [product.price, quantity])

  const handleAddToCart = () => {
    const colorImage = product.images?.[selectedColor]?.[0] || product.image;
    
    addToCart(
      product, 
      quantity, 
      selectedColor, 
      selectedSize,
      colorImage
    );
    toast.success(`${product.name} has been added to your cart`)
  }

  const getColorClass = (color: string) => {
    switch (color.toLowerCase()) {
      case 'red':
        return 'bg-red-500'
      case 'black':
        return 'bg-black'
      case 'dark blue':
        return 'bg-blue-900'
      case 'light blue':
        return 'bg-blue-600'
      default:
        return 'bg-gray-500'
    }
  }

  const isColorOutOfStock = (color: string) => {
    return product.outOfStock?.includes(color)
  }

  return (
    <div className="space-y-6">
      <div>
        <Badge className="mb-2">{product.brand}</Badge>
        <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
        <div className="flex items-baseline gap-2">
          <p className="text-2xl font-semibold text-primary">LKR {product.price.toFixed(2)}</p>
          <span className="text-sm text-gray-500">per item</span>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold mb-3">Color</h2>
          <RadioGroup value={selectedColor} onValueChange={onColorChange} className="flex flex-wrap gap-3">
            {product.variations.color.map((color) => (
              <Label
                key={color}
                className={`cursor-pointer flex items-center space-x-2 border rounded-lg p-3 
                  hover:bg-accent transition-colors
                  ${selectedColor === color ? 'border-primary bg-accent' : 'border-input'}
                  ${isColorOutOfStock(color) ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <RadioGroupItem
                  value={color}
                  id={`color-${color}`}
                  className="sr-only"
                  disabled={isColorOutOfStock(color)}
                />
                <div className={`w-4 h-4 rounded-full ${getColorClass(color)}`} />
                <span>{color}</span>
                {isColorOutOfStock(color) && (
                  <span className="text-xs text-red-500 ml-1">(Out of Stock)</span>
                )}
              </Label>
            ))}
          </RadioGroup>
        </div>

        {product.variations.size.length > 1 && (
          <div>
            <h2 className="text-lg font-semibold mb-3">Size</h2>
            <RadioGroup value={selectedSize} onValueChange={onSizeChange} className="flex gap-3">
              {product.variations.size.map((size) => (
                <Label
                  key={size}
                  className={`cursor-pointer border rounded-lg p-3 
                    hover:bg-accent transition-colors
                    ${selectedSize === size ? 'border-primary bg-accent' : 'border-input'}`}
                >
                  <RadioGroupItem value={size} id={`size-${size}`} className="sr-only" />
                  {size}
                </Label>
              ))}
            </RadioGroup>
          </div>
        )}

        <div>
          <h2 className="text-lg font-semibold mb-3">Quantity</h2>
          <div className="flex items-center gap-4">
            <input
              type="number"
              min="1"
              max="10"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-20 px-3 py-2 border rounded-md"
            />
            <span className="text-sm text-gray-500">
              Total: <span className="font-semibold text-primary">LKR {totalPrice.toFixed(2)}</span>
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <Button
          variant="outline"
          onClick={handleAddToCart}
          className="w-full"
          size="lg"
          disabled={isColorOutOfStock(selectedColor)}
        >
          {isColorOutOfStock(selectedColor) ? 'Out of Stock' : `Add to Cart - LKR ${totalPrice.toFixed(2)}`}
        </Button>
        <Button
          className="w-full"
          size="lg"
          disabled={isColorOutOfStock(selectedColor)}
        >
          Buy Now
        </Button>
      </div>

      <div className="prose prose-sm">
        <p>{product.description}</p>
      </div>
    </div>
  )
}

