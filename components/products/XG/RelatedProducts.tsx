import { Product } from '@/components/data/productData'
import Image from 'next/image'
import Link from 'next/link';

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
            <div className="aspect-square relative mb-4">
              <Image
                src={product.mainImage}
                alt={product.name}
                fill
                className="object-cover rounded-md"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
              />
            </div>
            <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
            <p className="text-gray-700 mb-2">LKR {product.price.toFixed(2)}</p>
            <Link href={`/products/${product.id}`}>
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
              View Details
            </button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}

