// src/components/BudgetGoals/GoalsSummary.tsx
'use client';

import React from 'react';

export default function GoalsSummary({ totalSaved, totalTarget, count }: { totalSaved: number; totalTarget: number; count: number }) {
  const pct = totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0;

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      <h3 className="text-md font-semibold mb-3">Overview</h3>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-500">Total saved</div>
          <div className="font-semibold">₹ {totalSaved.toLocaleString('en-IN')}</div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-500">Total target</div>
          <div className="font-semibold">₹ {totalTarget.toLocaleString('en-IN')}</div>
        </div>

        <div>
          <div className="text-xs text-slate-400 mb-2">Overall progress</div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div className="h-2 rounded-full bg-yellow-400" style={{ width: `${pct}%` }} />
          </div>
          <div className="text-xs text-slate-400 mt-1">{pct}% across {count} goals</div>
        </div>
      </div>
    </div>
  );
}
