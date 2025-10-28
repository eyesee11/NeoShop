"use client";

import { useMemo, useState } from "react";
import ProductCard from "@/components/ProductCard";
import SearchBar from "@/components/SearchBar";
import { Product } from "@/types/product";

export default function ProductList({
  initialProducts,
}: {
  initialProducts: Product[];
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredProducts = useMemo(() => {
    let result = initialProducts;

    // Filter by search term
    if (searchTerm) {
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== "All") {
      result = result.filter(
        (product) => product.category === selectedCategory
      );
    }

    return result;
  }, [searchTerm, selectedCategory, initialProducts]);

  const categories = Array.from(
    new Set(initialProducts.map((p) => p.category))
  );

  return (
    <>
      <SearchBar
        onSearch={setSearchTerm}
        onCategoryFilter={setSelectedCategory}
        categories={categories}
      />

      {filteredProducts.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-black uppercase mb-2">
            No Products Found
          </h2>
          <p className="text-gray-600">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      <div className="mt-8 p-4 border-4 border-black bg-blue-100/80 backdrop-blur-sm">
        <p className="text-sm font-bold">
          {/* ℹ️ <strong>Rendering Info:</strong> This page uses{" "}
          <span className="bg-yellow-300 px-2 py-1">
            Static Site Generation (SSG)
          </span> */}
          . Product data was fetched at build time for optimal performance.
        </p>
      </div>
    </>
  );
}
