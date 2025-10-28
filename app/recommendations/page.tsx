import { readProducts } from "@/lib/db";
import WishlistButton from "@/components/WishlistButton";
import Image from "next/image";

// Server Component - fetches data on the server
export default async function RecommendationsPage() {
  // Server-side data fetching
  const allProducts = await readProducts();

  // Get top-rated/featured products (simulate recommendation algorithm)
  const recommendations = allProducts
    .sort((a, b) => b.price - a.price) // Sort by price for demo
    .slice(0, 6);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 border-4 border-black p-8 bg-gradient-to-r from-green-200 to-blue-300 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
        <h1 className="text-5xl font-black uppercase mb-2">
          ✨ Recommended for You
        </h1>
        <p className="text-lg font-bold">
          Handpicked premium products just for you
        </p>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
        {recommendations.map((product) => (
          <div
            key={product.id}
            className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white/90 backdrop-blur-sm"
          >
            {/* Image */}
            <div className="relative h-48 bg-gradient-to-br from-purple-100 to-pink-100 border-b-4 border-black">
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-6xl">
                  📦
                </div>
              )}
              <div className="absolute top-2 left-2 bg-yellow-300 text-black px-3 py-1 text-xs font-black border-2 border-black">
                ⭐ RECOMMENDED
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="mb-3">
                <h3 className="text-xl font-black uppercase mb-2">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {product.description}
                </p>
              </div>

              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl font-black">${product.price}</span>
                <span className="bg-black text-white px-3 py-1 text-xs font-bold">
                  {product.category}
                </span>
              </div>

              {/* Client Component Button */}
              <WishlistButton product={product} />
            </div>
          </div>
        ))}
      </div>

      {/* Info Sections */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="border-4 border-black p-6 bg-purple-100/90 backdrop-blur-sm">
          <h2 className="text-2xl font-black uppercase mb-3">
            🎯 Why These Products?
          </h2>
          <ul className="space-y-2 font-bold">
            <li>✅ Premium quality materials</li>
            <li>✅ Highest customer ratings</li>
            <li>✅ Perfect for your needs</li>
            <li>✅ Limited stock available</li>
          </ul>
        </div>

        <div className="border-4 border-black p-6 bg-blue-100/90 backdrop-blur-sm">
          <h2 className="text-2xl font-black uppercase mb-3">
            🔥 Special Offers
          </h2>
          <ul className="space-y-2 font-bold">
            <li>🎁 Free shipping on orders over $100</li>
            <li>💳 Secure payment options</li>
            <li>🔄 30-day return policy</li>
            <li>⚡ Fast delivery available</li>
          </ul>
        </div>
      </div>

      {/* Rendering Info */}
      <div className="p-4 border-4 border-black bg-green-100/80 backdrop-blur-sm">
        <p className="text-sm font-bold">
          ℹ️ <strong>Rendering Info:</strong> This page uses{" "}
          <span className="bg-yellow-300 px-2 py-1">
            React Server Components
          </span>
          . Product data is fetched on the server, while the &quot;Add to
          Wishlist&quot; buttons are interactive client components. This
          demonstrates the hybrid server/client component architecture.
        </p>
      </div>
    </div>
  );
}
