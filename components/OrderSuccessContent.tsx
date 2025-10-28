"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";

export default function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const orderId = searchParams.get("orderId") || "";

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (!orderId) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="border-4 border-black p-12 bg-yellow-300 inline-block shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
          <p className="text-2xl font-black uppercase">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Success Header */}
        <div className="mb-8 border-4 border-black p-12 text-center bg-gradient-to-r from-green-300 to-blue-300 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
          <div className="text-8xl mb-4">🎉</div>
          <h1 className="text-5xl font-black uppercase mb-4">
            Order Placed Successfully!
          </h1>
          <p className="text-xl font-bold">
            Thank you for your purchase, {user?.name}!
          </p>
        </div>

        {/* Order Details */}
        <div className="border-4 border-black p-8 bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-8">
          <h2 className="text-3xl font-black uppercase mb-6 border-b-4 border-black pb-4">
            📦 Order Details
          </h2>

          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 border-4 border-black bg-yellow-100">
              <span className="font-bold uppercase">Order ID:</span>
              <span className="font-black text-lg">{orderId}</span>
            </div>

            <div className="flex justify-between items-center p-4 border-4 border-black bg-green-100">
              <span className="font-bold uppercase">Status:</span>
              <span className="font-black text-lg uppercase text-green-700">
                ✅ Pending
              </span>
            </div>

            <div className="flex justify-between items-center p-4 border-4 border-black bg-blue-100">
              <span className="font-bold uppercase">Email:</span>
              <span className="font-bold">{user?.email}</span>
            </div>
          </div>
        </div>

        {/* What's Next */}
        <div className="border-4 border-black p-8 bg-gradient-to-r from-purple-200 to-pink-200 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-8">
          <h2 className="text-2xl font-black uppercase mb-4">
            📬 What Happens Next?
          </h2>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="text-2xl">1️⃣</span>
              <span className="font-bold">
                You&apos;ll receive a confirmation email shortly
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl">2️⃣</span>
              <span className="font-bold">
                We&apos;ll process your order within 24 hours
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl">3️⃣</span>
              <span className="font-bold">
                You&apos;ll get tracking information once shipped
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl">4️⃣</span>
              <span className="font-bold">
                Estimated delivery: 3-5 business days
              </span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/"
            className="block px-6 py-4 border-4 border-black font-black text-center uppercase bg-gradient-to-r from-yellow-300 to-orange-300 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
          >
            🛍️ Continue Shopping
          </Link>
          <Link
            href="/dashboard"
            className="block px-6 py-4 border-4 border-black font-black text-center uppercase bg-gradient-to-r from-green-300 to-blue-300 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
          >
            📋 View My Orders
          </Link>
        </div>

        {/* Support Info */}
        <div className="mt-8 border-4 border-black p-6 bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <p className="font-bold text-center">
            Need help? Contact us at{" "}
            <a
              href="mailto:support@neoshop.com"
              className="underline hover:bg-yellow-300 transition-colors"
            >
              support@neoshop.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
