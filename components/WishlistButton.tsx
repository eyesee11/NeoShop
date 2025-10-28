"use client";

import { useState } from "react";
import { Product } from "@/types/product";
import { useToast } from "./ToastProvider";

interface WishlistButtonProps {
  product: Product;
}

export default function WishlistButton({ product }: WishlistButtonProps) {
  const [isInWishlist, setIsInWishlist] = useState(false);
  const { success, info } = useToast();

  const handleAddToWishlist = () => {
    // Get existing wishlist from localStorage
    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");

    // Check if product already exists
    const exists = wishlist.some((item: Product) => item.id === product.id);

    if (!exists) {
      wishlist.push(product);
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
      setIsInWishlist(true);
      success(`❤️ ${product.name} added to wishlist!`);
    } else {
      info(`${product.name} is already in your wishlist!`);
    }
  };

  return (
    <button
      onClick={handleAddToWishlist}
      className={`px-6 py-3 border-4 border-black font-black uppercase shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all ${
        isInWishlist
          ? "bg-gradient-to-r from-pink-400 to-purple-400"
          : "bg-gradient-to-r from-pink-300 to-purple-300"
      }`}
    >
      {isInWishlist ? "💖 In Wishlist" : "❤️ Add to Wishlist"}
    </button>
  );
}
