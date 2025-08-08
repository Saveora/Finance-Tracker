// src/components/dashboard/BudgetGoals.tsx
import { Goal } from "lucide-react";

// Mock data for a single budget goal
const budget = {
  name: "Monthly Budget",
  spent: 35102.00,
  goal: 75000.00,
};

// Calculate the progress percentage
const progressPercentage = Math.min((budget.spent / budget.goal) * 100, 100);

// Get the current month name
const currentMonth = new Date().toLocaleString('default', { month: 'long' });

export default function BudgetGoals() {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow duration-300 border-t-4 border-t-teal-500">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-lg text-gray-800">Budget Goal</h2>
        <a href="/dashboard/budget-goals" className="text-sm text-sky-600 hover:text-sky-800 font-semibold transition-colors">
          View All
        </a>
      </div>
      <div className="mt-4">
        <div className="flex items-center gap-3">
            <span className="p-2 rounded-full bg-teal-100 text-teal-600">
                <Goal size={24} />
            </span>
            <div className="w-full">
                <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">{budget.name} ({currentMonth})</span>
                    <span className="font-bold text-teal-600">{progressPercentage.toFixed(0)}%</span>
                </div>
            </div>
        </div>
        
        {/* Progress Bar with increased top margin for more space */}
        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
          <div
            className="bg-teal-500 h-2.5 rounded-full"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>

        {/* Amount Details */}
        <div className="flex justify-between mt-2 text-sm text-gray-600">
          <span className="font-medium">
            Spent: <span className="font-bold text-gray-800">₹{budget.spent.toLocaleString('en-IN')}</span>
          </span>
          <span className="text-gray-500">
            Goal: ₹{budget.goal.toLocaleString('en-IN')}
          </span>
        </div>
      </div>
    </div>
  );
}
