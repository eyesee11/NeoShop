import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getProductBySlug, readProducts } from "@/lib/db";
import WishlistButton from "@/components/WishlistButton";
import AddToCartButton from "@/components/AddToCartButton";

export async function generateStaticParams() {
  const products = await readProducts();
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const stockStatus =
    product.inventory === 0
      ? "Out of Stock"
      : product.inventory < 10
      ? "Low Stock"
      : "In Stock";
  const stockColor =
    product.inventory === 0
      ? "bg-red-500"
      : product.inventory < 10
      ? "bg-yellow-500"
      : "bg-green-500";

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center px-4 py-2 border-4 border-black font-bold bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
        >
          ← Back to Products
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Product Image */}
        <div className="border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] overflow-hidden bg-white">
          <div className="relative h-96 md:h-[600px] bg-gradient-to-br from-purple-100 to-pink-100">
            {product.image ? (
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-9xl">
                📦
              </div>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div className="border-4 border-black p-6 bg-white/90 backdrop-blur-sm shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="inline-block bg-black text-white px-3 py-1 text-sm font-bold mb-4">
              {product.category}
            </div>
            <h1 className="text-4xl md:text-5xl font-black uppercase mb-4 tracking-tight">
              {product.name}
            </h1>
            <p className="text-gray-700 text-lg mb-6">{product.description}</p>

            <div className="flex items-center gap-4 mb-6">
              <span className="text-5xl font-black">${product.price}</span>
              <div
                className={`${stockColor} text-white px-4 py-2 font-bold border-2 border-black`}
              >
                {product.inventory} in stock
              </div>
            </div>

            <div
              className={`inline-block px-4 py-2 font-bold border-2 border-black ${stockColor} text-white mb-6`}
            >
              {stockStatus}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <AddToCartButton product={product} />
            <WishlistButton product={product} />
          </div>

          {/* Product Details */}
          <div className="border-4 border-black p-6 bg-gradient-to-br from-blue-100 to-purple-100 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="text-2xl font-black uppercase mb-4">
              Product Details
            </h2>
            <dl className="space-y-2">
              <div className="flex justify-between py-2 border-b-2 border-black">
                <dt className="font-bold">Product ID:</dt>
                <dd>{product.id}</dd>
              </div>
              <div className="flex justify-between py-2 border-b-2 border-black">
                <dt className="font-bold">Category:</dt>
                <dd>{product.category}</dd>
              </div>
              <div className="flex justify-between py-2 border-b-2 border-black">
                <dt className="font-bold">Available:</dt>
                <dd>{product.inventory} units</dd>
              </div>
              <div className="flex justify-between py-2">
                <dt className="font-bold">Last Updated:</dt>
                <dd>{new Date(product.lastUpdated).toLocaleDateString()}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Rendering Info */}
      <div className="p-4 border-4 border-black bg-purple-100/80 backdrop-blur-sm">
        <p className="text-sm font-bold">
          {/* ℹ️ <strong>Rendering Info:</strong> This page uses{" "}
          <span className="bg-yellow-300 px-2 py-1">
            Incremental Static Regeneration (ISR)
          </span> */}
          Pages are pre-generated at build time and automatically updated
          every 60 seconds.
        </p>
      </div>
    </div>
  );
}

// ISR: Revalidate every 60 seconds
export const revalidate = 60;
