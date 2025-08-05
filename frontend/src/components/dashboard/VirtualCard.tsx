// src/components/dashboard/VirtualCard.tsx
import { CreditCard } from "lucide-react";

export default function VirtualCard() {
  return (
    <div className="bg-white rounded-xl p-6 shadow flex flex-col gap-3">
      <span className="font-medium">Virtual Card</span>
      <div className="bg-[#101728] rounded-xl px-5 py-3 flex flex-col text-white">
        <div className="flex justify-between items-center">
          <span className="text-xs">Available Balance</span>
          {/* Mastercard Icon */}
          <span className="bg-white rounded-full px-2">
            {/* Use svg or emoji as fallback */}
            <span className="inline-block text-2xl font-bold text-[#fa6c1d]">◉</span>
            <span className="inline-block text-2xl -ml-2 text-[#fece00]">◉</span>
          </span>
        </div>
        <span className="text-2xl font-bold mt-2">$400.00</span>
        <div className="flex justify-between items-end mt-5">
          <span className="tracking-widest text-base">6764 4354 2344 3245</span>
          <span className="text-xs">09/24</span>
        </div>
      </div>
      <button className="mt-2 w-full border border-[#101728] text-[#101728] rounded-xl py-2 font-semibold hover:bg-gray-50 transition">
        View Card History
      </button>
    </div>
  );
}

