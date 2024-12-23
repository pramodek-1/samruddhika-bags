import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ProductImageProps {
  mainImage: string;
  images: string[]
}

export function ProductImage({ mainImage, images }: ProductImageProps) {
  const [currentImage, setCurrentImage] = useState(mainImage)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setCurrentImage(mainImage)
  }, [mainImage])

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200
      const currentScroll = scrollContainerRef.current.scrollLeft
      scrollContainerRef.current.scrollTo({
        left: direction === 'left' ? currentScroll - scrollAmount : currentScroll + scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  return (
    <div className="space-y-4">
      <div className="aspect-square w-full relative overflow-hidden rounded-lg">
        <Image
          src={currentImage}
          alt="FILA Backpack main view"
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
        />
      </div>
      <div className="relative">
        <div 
          ref={scrollContainerRef}
          className="flex space-x-2 overflow-x-auto scrollbar-hide"
        >
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentImage(image)}
              className={`flex-shrink-0 ${
                currentImage === image ? 'ring-2 ring-primary' : ''
              }`}
            >
              <Image
                src={image}
                alt={`FILA Backpack view ${index + 1}`}
                width={100}
                height={100}
                className="object-cover rounded-md"
              />
            </button>
          ))}
        </div>
        <Button
          variant="outline"
          size="icon"
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-background/80"
          onClick={() => scroll('left')}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-background/80"
          onClick={() => scroll('right')}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

