import { Suspense } from "react";
import OrderSuccessContent from "@/components/OrderSuccessContent";

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="border-4 border-black p-12 bg-yellow-300 inline-block shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
            <p className="text-2xl font-black uppercase">Loading...</p>
          </div>
        </div>
      }
    >
      <OrderSuccessContent />
    </Suspense>
  );
}
