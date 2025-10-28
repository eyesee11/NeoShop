import { readProducts } from "@/lib/db";
import ProductList from "@/components/ProductList";

export default async function HomePage() {
  const products = await readProducts();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-12 border-4 border-black p-8 bg-gradient-to-r from-purple-200 via-pink-200 to-yellow-200 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
        <h1 className="text-5xl md:text-7xl font-black uppercase mb-4 tracking-tighter">
          Welcome to NeoShop
        </h1>
        <p className="text-xl font-bold max-w-2xl">
          Experience the future of online shopping with our unique neo-brutalist
          design. Browse our curated collection of premium products!
        </p>
      </div>

      <ProductList initialProducts={products} />
    </div>
  );
}

export const dynamic = "force-static";
export const revalidate = 60;
