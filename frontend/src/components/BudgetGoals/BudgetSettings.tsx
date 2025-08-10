// src/components/BudgetGoals/BudgetSettings.tsx
'use client';

import React from 'react';
import { FiSave } from 'react-icons/fi';

type Props = {
  defaultLimit: number;
  setDefaultLimit: (v: number) => void;
  defaultCurrency: 'INR' | 'USD';
  setDefaultCurrency: (c: 'INR'|'USD') => void;
  onSaveDefault: () => void;
  msg?: string | null;
};

export default function BudgetSettings({ defaultLimit, setDefaultLimit, defaultCurrency, setDefaultCurrency, onSaveDefault, msg }: Props) {
  return (
    <div className="p-4 rounded-lg border border-slate-100 bg-white shadow-sm">
      <div className="mb-3">
        <h4 className="text-lg font-semibold">Budget settings</h4>
        <div className="text-xs text-slate-400">Defaults used when creating new months.</div>
      </div>

      <div className="space-y-3">
        <div>
          <label className="text-xs text-slate-500">Default monthly limit</label>
          <input type="number" value={defaultLimit} onChange={(e)=>setDefaultLimit(Number(e.target.value || 0))} className="mt-1 w-full rounded-md border px-3 py-2" />
        </div>

        <div>
          <label className="text-xs text-slate-500">Currency</label>
          <select value={defaultCurrency} onChange={(e)=>setDefaultCurrency(e.target.value as 'INR'|'USD')} className="mt-1 w-full rounded-md border px-3 py-2">
            <option value="INR">INR</option>
            <option value="USD">USD</option>
          </select>
        </div>

        <div className="text-xs text-slate-400">This will not change past months. It will be applied to the next created month (on rollover).</div>
      </div>

      <div className="mt-4 flex items-center justify-end gap-2">
        <button onClick={onSaveDefault} className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-yellow-400 text-slate-900">
          <FiSave /> Save default
        </button>
      </div>

      {msg && <div className="mt-3 text-xs text-rose-600">{msg}</div>}
    </div>
  );
}
