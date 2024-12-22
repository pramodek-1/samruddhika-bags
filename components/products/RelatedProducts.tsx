import { Product } from '@/components/data/productData'
import Image from 'next/image'

interface RelatedProductsProps {
  products: Product[]
}

export function RelatedProducts({ products }: RelatedProductsProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Related Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map((product) => (
          <div key={product.id} className="border rounded-lg p-4">
            {Object.values(product.images)[0]?.[0] && (
              <Image
                src={Object.values(product.images)[0][0]}
                alt={product.name}
                width={200}
                height={200}
                className="w-full h-48 object-cover mb-4 rounded-md"
              />
            )}
            <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
            <p className="text-gray-700 mb-2">${product.price.toFixed(2)}</p>
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

