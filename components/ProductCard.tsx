import Link from "next/link";
import { Product } from "@/types/product";
import Image from "next/image";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const stockStatus =
    product.inventory === 0
      ? "Out of Stock"
      : product.inventory < 10
      ? "Low Stock"
      : "In Stock";
  const stockColor =
    product.inventory === 0
      ? "text-red-600"
      : product.inventory < 10
      ? "text-yellow-600"
      : "text-green-600";

  return (
    <Link href={`/products/${product.slug}`}>
      <div className="group relative border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 bg-white/80 backdrop-blur-sm hover:translate-x-[-4px] hover:translate-y-[-4px]">
        {/* Product Image */}
        <div className="relative h-48 bg-gradient-to-br from-purple-100 to-pink-100 overflow-hidden border-b-4 border-black">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-6xl">
              📦
            </div>
          )}
          {/* Stock badge */}
          <div className="absolute top-2 right-2 bg-black text-white px-3 py-1 text-xs font-bold border-2 border-white">
            {product.inventory} LEFT
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-black uppercase tracking-tight group-hover:text-purple-600 transition-colors">
              {product.name}
            </h3>
          </div>

          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {product.description}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-2xl font-black">${product.price}</span>
              <span className={`text-xs font-bold ${stockColor}`}>
                {stockStatus}
              </span>
            </div>
            <div className="bg-black text-white px-3 py-1 text-xs font-bold uppercase">
              {product.category}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
