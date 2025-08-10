// src/components/PaymentSchedule/UpcomingPayments.tsx
'use client';

import React from 'react';
import { ScheduleItem } from './ScheduleForm';

function formatDateISO(dateStr?: string) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

export default function UpcomingPayments({ items }: { items: (ScheduleItem & { nextDate?: Date })[] }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      <h3 className="text-md font-semibold mb-3">Upcoming</h3>

      <ul className="space-y-3 text-sm text-slate-700">
        {items.length === 0 && <li className="text-slate-400">No upcoming scheduled payments</li>}
        {items.map((it) => (
          <li key={it.id} className="flex items-center justify-between">
            <div>
              <div className="font-medium">{it.title}</div>
              <div className="text-xs text-slate-400">{it.payee}</div>
            </div>
            <div className="text-right">
              <div className="font-semibold">{it.currency === 'USD' ? '$' : '₹'}{it.amount}</div>
              <div className="text-xs text-slate-400">{formatDateISO(it.startDate)}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
