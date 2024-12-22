import { useState, useEffect } from 'react'
import { Product } from '@/components/data/productData'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'

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

  useEffect(() => {
    setTotalPrice(product.price * quantity)
  }, [product.price, quantity])

  const handleAddToCart = () => {
    console.log('Added to cart:', {
      ...product,
      color: selectedColor,
      size: selectedSize,
      quantity,
      totalPrice,
    })
  }

  const getColorClass = (color: string) => {
    switch (color.toLowerCase()) {
      case 'red':
        return 'bg-red-500'
      case 'black':
        return 'bg-black'
      case 'blue':
        return 'bg-blue-600'
      default:
        return 'bg-gray-500'
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <Badge className="mb-2">{product.brand}</Badge>
        <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
        <div className="flex items-baseline gap-2">
          <p className="text-2xl font-semibold text-primary">${product.price.toFixed(2)}</p>
          <span className="text-sm text-gray-500">per item</span>
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold mb-3">Color</h2>
          <RadioGroup value={selectedColor} onValueChange={onColorChange} className="flex gap-3">
            {product.variations.color.map((color) => (
              <Label
                key={color}
                className={`cursor-pointer flex items-center space-x-2 border rounded-lg p-3 
                  hover:bg-accent transition-colors
                  ${selectedColor === color ? 'border-primary bg-accent' : 'border-input'}`}
              >
                <RadioGroupItem value={color} id={`color-${color}`} className="sr-only" />
                <div className={`w-4 h-4 rounded-full ${getColorClass(color)}`} />
                <span>{color}</span>
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
              Total: <span className="font-semibold text-primary">${totalPrice.toFixed(2)}</span>
            </span>
          </div>
        </div>
      </div>
      
      <div className="space-y-3">
        <Button onClick={handleAddToCart} className="w-full" size="lg">
          Add to Cart - ${totalPrice.toFixed(2)}
        </Button>
        <Button variant="outline" className="w-full" size="lg">
          Buy Now
        </Button>
      </div>
      
      <div className="prose prose-sm">
        <p>{product.description}</p>
      </div>
    </div>
  )
}

