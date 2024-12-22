import { useState, useEffect } from 'react'
import Image from 'next/image'

interface ProductImageProps {
  images: string[]
}

export function ProductImage({ images }: ProductImageProps) {
  const [mainImage, setMainImage] = useState(images[0] || null)

  useEffect(() => {
    setMainImage(images[0] || null)
  }, [images])

  return (
    <div className="flex flex-col items-center">
      <div className="mb-4 w-full max-w-xl">
        {mainImage && (
          <Image
            src={mainImage}
            alt="FILA Backpack"
            width={600}
            height={800}
            className="w-full h-auto object-contain rounded-lg"
            priority
          />
        )}
      </div>
      {images.length > 1 && (
        <div className="flex space-x-2 overflow-x-auto">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setMainImage(image)}
              className={`focus:outline-none flex-shrink-0 border-2 rounded-md 
                ${mainImage === image ? 'border-primary' : 'border-transparent'}`}
            >
              <Image
                src={image}
                alt={`Product thumbnail ${index + 1}`}
                width={80}
                height={80}
                className="w-20 h-20 object-cover rounded-md"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

