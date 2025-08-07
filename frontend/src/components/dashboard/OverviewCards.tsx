// src/components/dashboard/OverviewCards.tsx
import { DollarSign } from "lucide-react";

export default function OverviewCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
      <div className="flex items-center gap-5 bg-white rounded-xl px-10 py-6 shadow min-w-[260px]">
        <span className="p-3 bg-[#EDF4FD] rounded-md text-sky-600">
          <DollarSign size={28} />
        </span>
        <div>
          <div className="text-sm text-gray-500 font-medium">Deposits</div>
          <div className="text-2xl font-bold">$3,000.00</div>
        </div>
      </div>

      <div className="flex items-center gap-5 bg-white rounded-xl px-10 py-6 shadow min-w-[260px]">
        <span className="p-3 bg-[#FFF7ED] rounded-md text-orange-600">
          <DollarSign size={28} />
        </span>
        <div>
          <div className="text-sm text-gray-500 font-medium">Spent</div>
          <div className="text-2xl font-bold">$351.02</div>
        </div>
      </div>
    </div>
  );
}
