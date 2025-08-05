// src/components/dashboard/BudgetGoals.tsx

export default function BudgetGoals() {
  return (
    <div className="bg-white rounded-xl p-6 shadow flex flex-col gap-3">
      <span className="font-medium mb-2">Budget Goals</span>
      <div className="flex items-center justify-center">
        {/* Simulated Pie/Doughnut Chart */}
        <div className="relative w-24 h-24">
          <svg width="96" height="96" viewBox="0 0 96 96">
            <circle
              cx="48"
              cy="48"
              r="40"
              stroke="#e6e9f4"
              strokeWidth="13"
              fill="none"
            />
            <circle
              cx="48"
              cy="48"
              r="40"
              stroke="#111928"
              strokeWidth="13"
              fill="none"
              strokeDasharray="170 81"
              strokeDashoffset="0"
              transform="rotate(-90 48 48)"
            />
          </svg>
        </div>
      </div>
      <div className="flex items-center justify-between mt-2 text-xs font-medium">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-[#111928] rounded-full"></span>
          Expenses
        </div>
        <span>6,472</span>
      </div>
      <div className="flex items-center justify-between text-xs font-medium">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-[#e6e9f4] rounded-full"></span>
          Goal
        </div>
        <span>4,314</span>
      </div>
    </div>
  );
}

