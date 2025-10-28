"use client";

import { useState } from "react";
import { Product } from "@/types/product";
import { useToast } from "./ToastProvider";

interface AddToCartButtonProps {
  product: Product;
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const [isAdding, setIsAdding] = useState(false);
  const { success, error, warning } = useToast();

  const handleAddToCart = () => {
    // Check if product is in stock
    if (product.inventory === 0) {
      error("This product is out of stock!");
      return;
    }

    setIsAdding(true);

    // Simulate adding to cart (replace with actual cart logic)
    setTimeout(() => {
      // Get existing cart from localStorage
      const existingCart = JSON.parse(
        localStorage.getItem("cart") || "[]"
      ) as Array<{ productId: string; quantity: number }>;

      // Check if product already in cart
      const existingItem = existingCart.find(
        (item) => item.productId === product.id
      );

      if (existingItem) {
        // Check if we can add more
        if (existingItem.quantity >= product.inventory) {
          warning(
            `Only ${product.inventory} units available! Already ${existingItem.quantity} in cart.`
          );
          setIsAdding(false);
          return;
        }
        existingItem.quantity += 1;
        success(
          `Added another ${product.name} to cart! (${existingItem.quantity} total)`
        );
      } else {
        existingCart.push({ productId: product.id, quantity: 1 });
        success(`🛒 ${product.name} added to cart!`);
      }

      // Save back to localStorage
      localStorage.setItem("cart", JSON.stringify(existingCart));

      // Dispatch custom event to update cart count
      window.dispatchEvent(new Event("cartUpdate"));

      setIsAdding(false);
    }, 500);
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={isAdding || product.inventory === 0}
      className={`flex-1 px-6 py-4 border-4 border-black font-black text-xl uppercase shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all ${
        product.inventory === 0
          ? "bg-gray-300 cursor-not-allowed opacity-50"
          : isAdding
          ? "bg-gradient-to-r from-yellow-200 to-orange-200"
          : "bg-gradient-to-r from-yellow-300 to-orange-300"
      }`}
    >
      {isAdding
        ? "🔄 Adding..."
        : product.inventory === 0
        ? "❌ Out of Stock"
        : "🛒 Add to Cart"}
    </button>
  );
}
