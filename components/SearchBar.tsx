"use client";

import { useState } from "react";

interface SearchBarProps {
  onSearch: (term: string) => void;
  onCategoryFilter: (category: string) => void;
  categories: string[];
}

export default function SearchBar({
  onSearch,
  onCategoryFilter,
  categories,
}: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    onSearch(value);
  };

  return (
    <div className="mb-8 space-y-4">
      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full px-6 py-4 text-lg border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] focus:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[-4px] focus:translate-y-[-4px] transition-all outline-none font-bold uppercase bg-white/80 backdrop-blur-sm"
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl">
          🔍
        </span>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => onCategoryFilter("All")}
          className="px-4 py-2 border-4 border-black font-bold uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all bg-white/90 backdrop-blur-sm"
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryFilter(category)}
            className="px-4 py-2 border-4 border-black font-bold uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all bg-gradient-to-br from-purple-100 to-pink-100 backdrop-blur-sm"
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}
