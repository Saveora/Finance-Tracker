// src/components/dashboard/StatCard.tsx

import type { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  amount: string;
  icon: ReactNode;
  iconBgColor: string;
  iconTextColor: string;
  borderColor: string;
}

export default function StatCard({
  title,
  amount,
  icon,
  iconBgColor,
  iconTextColor,
  borderColor,
}: StatCardProps) {
  return (
    <div
      className={`
        bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow duration-300
        border-t-4 ${borderColor} flex flex-col justify-between
      `} // <- Removed h-full from this line
    >
      <div className="flex items-start justify-between">
        <div className="flex flex-col">
          <span className="text-md text-black-500 font-medium">{title}</span>
          <span className="text-xl font-bold mt-2 text-gray-800">{amount}</span>
        </div>
        <span className={`p-3 rounded-full ${iconBgColor} ${iconTextColor}`}>
          {icon}
        </span>
      </div>
    </div>
  );
}