"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/components/ToastProvider";
import { CartItem, ShippingAddress } from "@/types/order";
import { Product } from "@/types/product";

export default function CheckoutPage() {
  const router = useRouter();
  const { user, token, isAuthenticated, isLoading: authLoading } = useAuth();
  const { success, error, info } = useToast();

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: user?.name || "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "USA",
    phone: "",
  });

  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
    paymentMethod: "credit_card",
  });

  // check auth and load cart stuff
  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated) {
      info("Please login to proceed with checkout");
      router.push("/login?redirect=/checkout");
      return;
    }

    const loadCart = async () => {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]") as Array<{
        productId: string;
        quantity: number;
      }>;

      if (cart.length === 0) {
        info("Your cart is empty");
        router.push("/");
        return;
      }

      // grab product details from api
      try {
        const response = await fetch("/api/products");
        const products: Product[] = await response.json();

        const items: CartItem[] = cart.map((item) => {
          const product = products.find((p) => p.id === item.productId);
          return {
            productId: item.productId,
            productName: product?.name || "Unknown",
            price: product?.price || 0,
            quantity: item.quantity,
            image: product?.image,
          };
        });

        setCartItems(items);
      } catch (err) {
        error("Failed to load cart items");
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, [isAuthenticated, authLoading, router, info, error]);

  // math time - calculate all the totals
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.08; // 8% tax
  const shipping = subtotal > 100 ? 0 : 9.99;
  const total = subtotal + tax + shipping;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    try {
      // make sure shipping info is filled out
      if (
        !shippingAddress.fullName ||
        !shippingAddress.street ||
        !shippingAddress.city ||
        !shippingAddress.state ||
        !shippingAddress.zipCode ||
        !shippingAddress.phone
      ) {
        error("Please fill in all shipping address fields");
        setProcessing(false);
        return;
      }

      // check payment fields too
      if (
        !paymentDetails.cardNumber ||
        !paymentDetails.cardName ||
        !paymentDetails.expiryDate ||
        !paymentDetails.cvv
      ) {
        error("Please fill in all payment details");
        setProcessing(false);
        return;
      }

      // basic card number check (just digits and length)
      const cardNumberClean = paymentDetails.cardNumber.replace(/\s/g, "");
      if (cardNumberClean.length !== 16 || !/^\d+$/.test(cardNumberClean)) {
        error("Please enter a valid 16-digit card number");
        setProcessing(false);
        return;
      }

      // cvv should be 3 digits
      if (
        paymentDetails.cvv.length !== 3 ||
        !/^\d+$/.test(paymentDetails.cvv)
      ) {
        error("Please enter a valid 3-digit CVV");
        setProcessing(false);
        return;
      }

      // send order to server
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: cartItems,
          subtotal,
          tax,
          shipping,
          total,
          shippingAddress,
          paymentMethod: paymentDetails.paymentMethod,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      // clear the cart since order is done
      localStorage.removeItem("cart");

      success(`🎉 Order placed successfully! Order ID: ${data.order.id}`);

      // send them to success page after a sec
      setTimeout(() => {
        router.push(`/order-success?orderId=${data.order.id}`);
      }, 2000);
    } catch (err) {
      error(err instanceof Error ? err.message : "Failed to place order");
      setProcessing(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-4xl font-black animate-pulse">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 border-4 border-black p-8 bg-gradient-to-r from-green-200 to-blue-300 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
        <h1 className="text-5xl font-black uppercase mb-2">💳 Checkout</h1>
        <p className="text-lg font-bold">Complete your order, {user?.name}!</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="border-4 border-black p-6 bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="text-2xl font-black uppercase mb-6 flex items-center gap-2">
              📦 Shipping Address
            </h2>
            <form className="space-y-4">
              <div>
                <label className="block font-bold mb-2 uppercase text-sm">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={shippingAddress.fullName}
                  onChange={(e) =>
                    setShippingAddress({
                      ...shippingAddress,
                      fullName: e.target.value,
                    })
                  }
                  required
                  className="w-full px-4 py-3 border-4 border-black font-bold outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                />
              </div>

              <div>
                <label className="block font-bold mb-2 uppercase text-sm">
                  Street Address *
                </label>
                <input
                  type="text"
                  value={shippingAddress.street}
                  onChange={(e) =>
                    setShippingAddress({
                      ...shippingAddress,
                      street: e.target.value,
                    })
                  }
                  required
                  className="w-full px-4 py-3 border-4 border-black font-bold outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold mb-2 uppercase text-sm">
                    City *
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.city}
                    onChange={(e) =>
                      setShippingAddress({
                        ...shippingAddress,
                        city: e.target.value,
                      })
                    }
                    required
                    className="w-full px-4 py-3 border-4 border-black font-bold outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-2 uppercase text-sm">
                    State *
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.state}
                    onChange={(e) =>
                      setShippingAddress({
                        ...shippingAddress,
                        state: e.target.value,
                      })
                    }
                    required
                    className="w-full px-4 py-3 border-4 border-black font-bold outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold mb-2 uppercase text-sm">
                    ZIP Code *
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.zipCode}
                    onChange={(e) =>
                      setShippingAddress({
                        ...shippingAddress,
                        zipCode: e.target.value,
                      })
                    }
                    required
                    className="w-full px-4 py-3 border-4 border-black font-bold outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-2 uppercase text-sm">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    value={shippingAddress.phone}
                    onChange={(e) =>
                      setShippingAddress({
                        ...shippingAddress,
                        phone: e.target.value,
                      })
                    }
                    required
                    className="w-full px-4 py-3 border-4 border-black font-bold outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                  />
                </div>
              </div>
            </form>
          </div>

          <div className="border-4 border-black p-6 bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="text-2xl font-black uppercase mb-6 flex items-center gap-2">
              💳 Payment Details
            </h2>
            <form className="space-y-4">
              <div>
                <label className="block font-bold mb-2 uppercase text-sm">
                  Card Number *
                </label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={paymentDetails.cardNumber}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\s/g, "");
                    const formatted =
                      value.match(/.{1,4}/g)?.join(" ") || value;
                    setPaymentDetails({
                      ...paymentDetails,
                      cardNumber: formatted,
                    });
                  }}
                  maxLength={19}
                  required
                  className="w-full px-4 py-3 border-4 border-black font-bold outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                />
              </div>

              <div>
                <label className="block font-bold mb-2 uppercase text-sm">
                  Cardholder Name *
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={paymentDetails.cardName}
                  onChange={(e) =>
                    setPaymentDetails({
                      ...paymentDetails,
                      cardName: e.target.value,
                    })
                  }
                  required
                  className="w-full px-4 py-3 border-4 border-black font-bold outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold mb-2 uppercase text-sm">
                    Expiry Date *
                  </label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={paymentDetails.expiryDate}
                    onChange={(e) => {
                      let value = e.target.value.replace(/\D/g, "");
                      if (value.length >= 2) {
                        value = value.slice(0, 2) + "/" + value.slice(2, 4);
                      }
                      setPaymentDetails({
                        ...paymentDetails,
                        expiryDate: value,
                      });
                    }}
                    maxLength={5}
                    required
                    className="w-full px-4 py-3 border-4 border-black font-bold outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-2 uppercase text-sm">
                    CVV *
                  </label>
                  <input
                    type="text"
                    placeholder="123"
                    value={paymentDetails.cvv}
                    onChange={(e) =>
                      setPaymentDetails({
                        ...paymentDetails,
                        cvv: e.target.value.replace(/\D/g, "").slice(0, 3),
                      })
                    }
                    maxLength={3}
                    required
                    className="w-full px-4 py-3 border-4 border-black font-bold outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                  />
                </div>
              </div>

              <div className="bg-yellow-100 border-4 border-black p-4">
                <p className="text-sm font-bold">
                  🔒 <strong>Secure Payment:</strong> Your payment information
                  is encrypted and secure. This is a demo - no real charges will
                  be made.
                </p>
              </div>
            </form>
          </div>
        </div>

        <div>
          <div className="border-4 border-black p-6 bg-gradient-to-br from-purple-100 to-pink-100 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] sticky top-4">
            <h2 className="text-2xl font-black uppercase mb-6">
              📋 Order Summary
            </h2>

            <div className="space-y-4 mb-6">
              {cartItems.map((item) => (
                <div
                  key={item.productId}
                  className="flex gap-3 pb-4 border-b-2 border-black"
                >
                  <div className="w-16 h-16 border-2 border-black bg-white flex items-center justify-center text-2xl">
                    📦
                  </div>
                  <div className="flex-1">
                    <h3 className="font-black text-sm">{item.productName}</h3>
                    <p className="text-sm font-bold">
                      ${item.price.toFixed(2)} × {item.quantity}
                    </p>
                  </div>
                  <div className="font-black">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2 mb-6">
              <div className="flex justify-between font-bold">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Tax (8%):</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Shipping:</span>
                <span>
                  {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              {subtotal > 100 && (
                <div className="bg-green-200 border-2 border-black p-2 text-xs font-bold">
                  🎉 Free shipping on orders over $100!
                </div>
              )}
              <div className="border-t-4 border-black pt-2 mt-2">
                <div className="flex justify-between text-xl font-black">
                  <span>TOTAL:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={processing}
              className={`w-full px-6 py-4 border-4 border-black font-black text-xl uppercase shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all ${
                processing
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-gradient-to-r from-green-300 to-emerald-300"
              }`}
            >
              {processing ? "🔄 Processing..." : "🎉 Place Order"}
            </button>

            <p className="text-xs font-bold text-center mt-4 opacity-75">
              By placing this order, you agree to our Terms of Service
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
