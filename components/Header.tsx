"use client";

import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import { useEffect, useState } from "react";

export default function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const totalItems = cart.reduce(
        (sum: number, item: { quantity: number }) => sum + item.quantity,
        0
      );
      setCartCount(totalItems);
    };

    updateCartCount();
    window.addEventListener("storage", updateCartCount);
    window.addEventListener("cartUpdate", updateCartCount);

    return () => {
      window.removeEventListener("storage", updateCartCount);
      window.removeEventListener("cartUpdate", updateCartCount);
    };
  }, []);

  return (
    <header className="border-b-4 border-black bg-white/70 backdrop-blur-md sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 group bg-white">
            <img
              src="/logo.png"
              alt="NeoShop logo"
              className="w-20 h-20 object-contain bg-white"
            />
            <h1 className="text-3xl font-black uppercase tracking-tighter group-hover:text-purple-600 transition-colors">
              NeoShop
            </h1>
          </Link>

          <nav className="hidden md:flex items-center space-x-2">
            <Link
              href="/"
              className="px-4 py-2 font-bold uppercase border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all bg-white"
            >
              Home
            </Link>
            <Link
              href="/dashboard"
              className="px-4 py-2 font-bold uppercase border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all bg-gradient-to-r from-yellow-200 to-yellow-300"
            >
              Dashboard
            </Link>
            <Link
              href="/admin"
              className="px-4 py-2 font-bold uppercase border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all bg-gradient-to-r from-pink-200 to-purple-300"
            >
              Admin
            </Link>
            <Link
              href="/recommendations"
              className="px-4 py-2 font-bold uppercase border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all bg-gradient-to-r from-green-200 to-blue-300"
            >
              Picks
            </Link>

            <Link
              href="/checkout"
              className="relative px-4 py-2 font-bold uppercase border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all bg-gradient-to-r from-orange-200 to-red-300"
            >
              🛒 Cart
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-white text-xs font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-white">
                  {cartCount}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <>
                <span className="px-4 py-2 font-bold border-4 border-black bg-blue-100">
                  👤 {user?.name}
                </span>
                <button
                  onClick={logout}
                  className="px-4 py-2 font-bold uppercase border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all bg-red-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 font-bold uppercase border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all bg-gradient-to-r from-green-300 to-blue-300"
              >
                🔐 Login
              </Link>
            )}
          </nav>

          <button className="md:hidden px-3 py-2 border-4 border-black font-bold bg-white">
            ☰
          </button>
        </div>
      </div>
    </header>
  );
}
