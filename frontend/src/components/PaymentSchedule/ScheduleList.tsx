// src/components/PaymentSchedule/ScheduleList.tsx
'use client';

import React from 'react';
import { FiEdit2, FiTrash2, FiToggleLeft, FiToggleRight } from 'react-icons/fi';
import { ScheduleItem } from './ScheduleForm';

type Props = {
  items: ScheduleItem[];
  onEdit: (item: ScheduleItem) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
};

function formatDateISO(dateStr?: string) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0'); // numeric month
  const year = d.getFullYear();
  // Use a deterministic format (DD/MM/YYYY)
  return `${day}/${month}/${year}`;
}

export default function ScheduleList({ items, onEdit, onDelete, onToggle }: Props) {
  if (!items.length) {
    return <div className="text-sm text-slate-500">No scheduled payments yet. Create one to get started.</div>;
  }

  return (
    <div className="space-y-4">
      {items.map((s) => (
        <div key={s.id} className="flex items-center justify-between p-4 rounded-lg border border-slate-100">
          <div>
            <div className="flex items-center gap-3">
              <div className="text-sm font-semibold">{s.title}</div>
              <div className="text-xs text-slate-400 rounded-full px-2 py-0.5 bg-slate-100">{s.recurrence}</div>
            </div>

            <div className="text-xs text-slate-500">
              {s.payee} • {formatDateISO(s.startDate)}
            </div>

            <div className="text-sm mt-2 font-medium">{s.currency === 'USD' ? '$' : '₹'}{s.amount}</div>
            {s.note && <div className="text-xs text-slate-400 mt-1">{s.note}</div>}
          </div>

          <div className="flex items-center gap-3">
            <button
              title={s.active ? 'Disable' : 'Enable'}
              onClick={() => onToggle(s.id!)}
              className="p-2 rounded-md hover:bg-slate-50"
            >
              {s.active ? <FiToggleRight size={18} /> : <FiToggleLeft size={18} />}
            </button>

            <button title="Edit" onClick={() => onEdit(s)} className="p-2 rounded-md hover:bg-slate-50">
              <FiEdit2 size={16} />
            </button>

            <button title="Delete" onClick={() => onDelete(s.id!)} className="p-2 rounded-md hover:bg-slate-50 text-red-500">
              <FiTrash2 size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
