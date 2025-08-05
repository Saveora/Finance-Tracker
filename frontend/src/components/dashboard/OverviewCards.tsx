// src/components/dashboard/OverviewCards.tsx
import { DollarSign, ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function OverviewCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
      <div className="flex items-center gap-4 bg-white rounded-xl px-8 py-6 shadow">
        <span className="p-3 bg-[#EDF4FD] rounded-md text-sky-600">
          <DollarSign size={24}/>
        </span>
        <div>
          <div className="text-sm text-gray-400 font-medium">Deposits</div>
          <div className="text-2xl font-bold">$3,000.00</div>
        </div>
      </div>
      <div className="flex items-center gap-4 bg-white rounded-xl px-8 py-6 shadow">
        <span className="p-3 bg-[#FFF7ED] rounded-md text-orange-500">
          <DollarSign size={24}/>
        </span>
        <div>
          <div className="text-sm text-gray-400 font-medium">Spent</div>
          <div className="text-2xl font-bold">$351.02</div>
        </div>
      </div>
    </div>
  );
}

