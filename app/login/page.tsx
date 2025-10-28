import { Suspense } from "react";
import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto">
            <div className="mb-8 border-4 border-black p-8 bg-gradient-to-r from-blue-200 to-purple-300 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
              <h1 className="text-4xl font-black uppercase mb-2">🔐 Login</h1>
              <p className="text-lg font-bold">Loading...</p>
            </div>
          </div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
