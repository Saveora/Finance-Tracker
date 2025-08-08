'use client';

import { useState } from "react";

// Chart setup:
const CHART_HEIGHT_PX = 224; // Tailwind 'h-56'
const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];
const BAR_DATA = [
  { amount: 80892 },
  { amount: 89500 },
  { amount: 101245 },
  { amount: 115000 },
  { amount: 92500 },
  { amount: 82000 },
  { amount: 89492 }, // July
  { amount: 90000 },
  { amount: 47000 },
  { amount: 65886 },
  { amount: 81000 },
  { amount: 85000 }
];

// For scaling:
const maxAmount = Math.max(...BAR_DATA.map(d => d.amount));
const minBarHeightPx = 28; // min px per bar (customizable)

export default function SpentChart() {
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  return (
    <div className="bg-white rounded-xl p-6 shadow flex flex-col relative">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-lg">Spent Analysis</h2>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 bg-blue-500 rounded-full" />
            <span className="text-xs text-gray-500">Spent Trend</span>
          </span>
          <select className="ml-4 bg-gray-100 rounded-md px-3 py-1 text-xs font-medium outline-none border">
            <option>This Month</option>
          </select>
        </div>
      </div>
      <div className="w-full h-56 flex items-end gap-3 overflow-x-auto">
        {BAR_DATA.map((bar, i) => {
          const isCurrent = i === 6;
          const isHovered = hoveredBar === i;
          // Calculate bar pixel height
          const barHeightPx = Math.round(
            minBarHeightPx + ((bar.amount / maxAmount) * (CHART_HEIGHT_PX - minBarHeightPx))
          );

          const baseClass = isCurrent
            ? "bg-gradient-to-t from-blue-800 to-blue-400"
            : "bg-blue-300";
          const hoverClass = isCurrent
            ? "bg-gradient-to-t from-blue-700 to-blue-200"
            : "bg-blue-500";

          return (
            <div
              key={i}
              className="flex-1 flex flex-col items-center cursor-pointer"
              tabIndex={0}
              aria-label={`Spent in ${MONTHS[i]}: $${bar.amount.toLocaleString('en-US')}`}
              onMouseEnter={() => setHoveredBar(i)}
              onMouseLeave={() => setHoveredBar(null)}
              onFocus={() => setHoveredBar(i)}
              onBlur={() => setHoveredBar(null)}
            >
              <div
                className={`
                  relative w-6 rounded-md transition-colors duration-200
                  ${isHovered ? hoverClass : baseClass}
                `}
                style={{
                  height: `${barHeightPx}px`,
                  minHeight: `${minBarHeightPx}px`
                }}
              >
                {/* Tooltip or active label */}
                {isHovered && (
                  <span className="absolute left-1/2 -top-10 -translate-x-1/2 px-3 py-1 bg-[#101728] text-white text-xs rounded shadow whitespace-nowrap z-20">
                    ${bar.amount.toLocaleString('en-US')} {MONTHS[i]}'25
                  </span>
                )}
                {isCurrent && !isHovered && (
                  <span className="absolute left-1/2 -top-8 -translate-x-1/2 px-2 py-1 bg-[#101728] text-white text-xs rounded shadow whitespace-nowrap">
                    ${bar.amount.toLocaleString('en-US')} July '25
                  </span>
                )}
              </div>
              <div className={`
                text-xs mt-2 font-semibold select-none transition-colors
                ${isCurrent ? "text-blue-700" : isHovered ? "text-blue-500" : "text-gray-400"}
              `}>
                {MONTHS[i]}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
