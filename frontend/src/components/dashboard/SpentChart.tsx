// src/components/dashboard/SpentChart.tsx
'use client';

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

// Helper component to safely format numbers on the client
function ClientFormattedNumber({ amount }: { amount: number }) {
  const [formattedAmount, setFormattedAmount] = useState<string>(amount.toString());

  useEffect(() => {
    // This effect runs only on the client, after hydration
    setFormattedAmount(amount.toLocaleString('en-IN'));
  }, [amount]);

  return <>{formattedAmount}</>;
}

const BAR_DATA = [
  { month: "Jan", amount: 80892 }, { month: "Feb", amount: 89500 },
  { month: "Mar", amount: 101245 }, { month: "Apr", amount: 115000 },
  { month: "May", amount: 92500 }, { month: "Jun", amount: 82000 },
  { month: "Jul", amount: 89492 }, { month: "Aug", amount: 90000 },
  { month: "Sep", amount: 47000 }, { month: "Oct", amount: 65886 },
  { month: "Nov", amount: 81000 }, { month: "Dec", amount: 85000 }
];

// Dynamically get the current month's short name
const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const currentMonthName = monthNames[new Date().getMonth()];

// Determine the user's login year.
// By default this uses the current year; replace this logic if you get the login year from your auth/user data.
const userLoginYearFull = new Date().getFullYear();
const CURRENT_YEAR = String(userLoginYearFull).slice(2); // short form used in tooltips (like '25')

export default function SpentChart() {
  const [hoveredBar, setHoveredBar] = useState<string | null>(null);
  // Keep highlighting the current month by default (unchanged behavior)
  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonthName);

  // Year dropdown state (shows only the year user logged in from)
  const [selectedYear, setSelectedYear] = useState<string>(String(userLoginYearFull));
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);
  
  const maxAmount = Math.max(...BAR_DATA.map(d => d.amount));

  return (
    // Using a solid "deep ocean" top border (like other cards)
    <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow duration-300 border border-gray-100 border-t-4 border-t-indigo-600">
      
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-lg text-gray-800">Spent Analysis</h2>

        {/* YEAR DROPDOWN (replaces month dropdown) */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 bg-gray-100 rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
          >
            {selectedYear}
            <ChevronDown size={16} className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {isDropdownOpen && (
            <div className="absolute top-full right-0 mt-2 w-32 bg-white rounded-lg shadow-xl z-20 border">
              {/* Only the login year is displayed here as requested */}
              <button
                onClick={() => {
                  setSelectedYear(String(userLoginYearFull));
                  setIsDropdownOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                {userLoginYearFull}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="w-full h-64 flex items-end justify-between mt-10">
        {BAR_DATA.map((bar) => {
          const barHeight = `${Math.max(10, (bar.amount / maxAmount) * 100)}%`;
          const isSelected = bar.month === selectedMonth;
          const isHovered = hoveredBar === bar.month;

          return (
            <div
              key={bar.month}
              className="h-full w-8 flex flex-col items-center justify-end cursor-pointer group"
              onMouseEnter={() => setHoveredBar(bar.month)}
              onMouseLeave={() => setHoveredBar(null)}
              onClick={() => setSelectedMonth(bar.month)}
            >
              <div
                className={`relative w-full flex justify-center transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
              >
                <span className="absolute bottom-2 px-2 py-1 bg-[#101728] text-white text-xs rounded-md shadow-lg whitespace-nowrap z-10">
                  ₹<ClientFormattedNumber amount={bar.amount} /> {bar.month} '{CURRENT_YEAR}
                </span>
              </div>
              
              <div
                className={`w-7 rounded-md transition-all duration-300 group-hover:bg-blue-500 ${isSelected ? 'bg-gradient-to-t from-blue-800 to-blue-400' : 'bg-blue-300'}`}
                style={{ height: barHeight }}
              />

              <span className={`text-xs mt-2 font-semibold ${isSelected ? "text-blue-700" : "text-black-400"}`}>
                {bar.month}
              </span>

            </div>
          );
        })}
      </div>
    </div>
  );
}
