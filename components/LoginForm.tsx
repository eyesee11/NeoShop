"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/components/ToastProvider";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  const { login, register, isAuthenticated } = useAuth();
  const { success, error: showError } = useToast();

  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (isAuthenticated) {
      router.push(redirect);
    }
  }, [isAuthenticated, router, redirect]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(loginData.email, loginData.password);
      success("✅ Login successful! Welcome back!");
      router.push(redirect);
    } catch (err) {
      showError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (registerData.password !== registerData.confirmPassword) {
      showError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await register(
        registerData.email,
        registerData.password,
        registerData.name
      );
      success("✅ Registration successful! Welcome to NeoShop!");
      router.push(redirect);
    } catch (err) {
      showError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <div className="mb-8 border-4 border-black p-8 bg-gradient-to-r from-blue-200 to-purple-300 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
          <h1 className="text-4xl font-black uppercase mb-2">
            {isLogin ? "🔐 Login" : "✨ Register"}
          </h1>
          <p className="text-lg font-bold">
            {isLogin
              ? "Welcome back to NeoShop!"
              : "Create your NeoShop account"}
          </p>
        </div>

        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 px-6 py-3 border-4 border-black font-black uppercase transition-all ${
              isLogin
                ? "bg-gradient-to-r from-yellow-300 to-orange-300 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
                : "bg-white hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 px-6 py-3 border-4 border-black font-black uppercase transition-all ${
              !isLogin
                ? "bg-gradient-to-r from-green-300 to-blue-300 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
                : "bg-white hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            }`}
          >
            Register
          </button>
        </div>

        <div className="border-4 border-black p-8 bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          {isLogin ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block font-bold mb-2 uppercase text-sm">
                  Email *
                </label>
                <input
                  type="email"
                  value={loginData.email}
                  onChange={(e) =>
                    setLoginData({ ...loginData, email: e.target.value })
                  }
                  required
                  className="w-full px-4 py-3 border-4 border-black font-bold outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                />
              </div>

              <div>
                <label className="block font-bold mb-2 uppercase text-sm">
                  Password *
                </label>
                <input
                  type="password"
                  value={loginData.password}
                  onChange={(e) =>
                    setLoginData({ ...loginData, password: e.target.value })
                  }
                  required
                  className="w-full px-4 py-3 border-4 border-black font-bold outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full px-6 py-4 border-4 border-black font-black text-xl uppercase shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all ${
                  loading
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-gradient-to-r from-yellow-300 to-orange-300"
                }`}
              >
                {loading ? "🔄 Logging in..." : "🔐 Login"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block font-bold mb-2 uppercase text-sm">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={registerData.name}
                  onChange={(e) =>
                    setRegisterData({ ...registerData, name: e.target.value })
                  }
                  required
                  className="w-full px-4 py-3 border-4 border-black font-bold outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                />
              </div>

              <div>
                <label className="block font-bold mb-2 uppercase text-sm">
                  Email *
                </label>
                <input
                  type="email"
                  value={registerData.email}
                  onChange={(e) =>
                    setRegisterData({ ...registerData, email: e.target.value })
                  }
                  required
                  className="w-full px-4 py-3 border-4 border-black font-bold outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                />
              </div>

              <div>
                <label className="block font-bold mb-2 uppercase text-sm">
                  Password * (min 6 characters)
                </label>
                <input
                  type="password"
                  value={registerData.password}
                  onChange={(e) =>
                    setRegisterData({
                      ...registerData,
                      password: e.target.value,
                    })
                  }
                  required
                  minLength={6}
                  className="w-full px-4 py-3 border-4 border-black font-bold outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                />
              </div>

              <div>
                <label className="block font-bold mb-2 uppercase text-sm">
                  Confirm Password *
                </label>
                <input
                  type="password"
                  value={registerData.confirmPassword}
                  onChange={(e) =>
                    setRegisterData({
                      ...registerData,
                      confirmPassword: e.target.value,
                    })
                  }
                  required
                  minLength={6}
                  className="w-full px-4 py-3 border-4 border-black font-bold outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full px-6 py-4 border-4 border-black font-black text-xl uppercase shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all ${
                  loading
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-gradient-to-r from-green-300 to-blue-300"
                }`}
              >
                {loading ? "🔄 Creating account..." : "✨ Create Account"}
              </button>
            </form>
          )}
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="inline-block px-6 py-3 border-4 border-black font-bold uppercase bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
          >
            ← Back to Shop
          </Link>
        </div>
      </div>
    </div>
  );
}
