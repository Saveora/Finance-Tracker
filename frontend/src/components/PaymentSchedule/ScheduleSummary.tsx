// src/components/PaymentSchedule/ScheduleSummary.tsx
'use client';

import React from 'react';

export default function ScheduleSummary({ totalUpcomingAmount, count }: { totalUpcomingAmount: number; count: number }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      <h3 className="text-md font-semibold mb-3">Overview</h3>

      <div className="space-y-3 text-sm text-slate-600">
        <div className="flex justify-between">
          <span>Scheduled items</span>
          <span className="font-medium">{count}</span>
        </div>

        <div className="flex justify-between">
          <span>Next few payments</span>
          <span className="font-medium">₹ {totalUpcomingAmount.toLocaleString()}</span>
        </div>

        <div className="text-xs text-slate-400">
          Tip: Use schedules to automate bills and avoid late fees. You can enable or disable schedules at any time.
        </div>
      </div>
    </div>
  );
}
