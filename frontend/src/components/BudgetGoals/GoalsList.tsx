'use client';

import React, { useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import type { GoalItem } from './CreateGoalForm';

type Props = {
  goals: GoalItem[];
  onEdit: (g: GoalItem) => void;
  onDelete: (id: string) => void;
  onTopUp: (id: string, amount: number) => void;
};

export default function GoalsList({ goals, onEdit, onDelete, onTopUp }: Props) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [topUpValue, setTopUpValue] = useState<Record<string, number>>({});

  if (!goals || goals.length === 0) {
    return <div className="text-sm text-slate-500">No goals yet. Create one to get started.</div>;
  }

  return (
    <div className="space-y-4">
      {goals.map((g, index) => {
        const id = g.id ?? `__tmp_${index}`;

        // ensure numeric values for safe math/formatting
        const savedNum = Number(g.saved ?? 0);
        const targetNum = Number(g.target ?? 0);
        const progress = Math.min(100, Math.round((savedNum / Math.max(1, targetNum)) * 100));

        return (
          <div key={id} className="p-4 rounded-lg border border-slate-100 flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${g.color ?? 'bg-yellow-400'}`} />
                    <div className="text-sm font-semibold">{g.title}</div>
                    {g.recurring && <div className="text-xs text-slate-400 rounded-full px-2 py-0.5 bg-slate-100">Recurring</div>}
                  </div>

                  {/* Use deterministic formatting with explicit locale */}
                  <div className="text-xs text-slate-400 mt-1">
                    {g.currency === 'USD' ? '$' : '₹'}
                    {formatCurrency(savedNum, g.currency)} saved • target {g.currency === 'USD' ? '$' : '₹'}
                    {formatCurrency(targetNum, g.currency)}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-semibold">{g.currency === 'USD' ? '$' : '₹'}{formatCurrency(targetNum, g.currency)}</div>
                  <div className="text-xs text-slate-400">by {formatDate(g.deadline)}</div>
                </div>
              </div>

              <div className="mt-3">
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="h-2 rounded-full bg-yellow-400" style={{ width: `${progress}%` }} />
                </div>
                <div className="text-xs text-slate-500 mt-2">{progress}% completed</div>
              </div>

              <div className="mt-3 flex items-center gap-3">
                <button onClick={() => onEdit(g)} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm border hover:bg-slate-50">
                  <FiEdit2 /> Edit
                </button>

                <button
                  onClick={() => {
                    if (g.id) onDelete(g.id);
                    else console.warn('Delete skipped: goal has no id');
                  }}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm border text-red-500 hover:bg-slate-50"
                >
                  <FiTrash2 /> Delete
                </button>

                <button onClick={() => setExpanded((prev) => (prev === id ? null : id))} className="ml-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm bg-slate-100 hover:bg-slate-200">
                  <FiPlus /> Top-up
                </button>
              </div>

              {expanded === id && (
                <div className="mt-3 flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    step="0.01"
                    value={topUpValue[id] ?? ''}
                    onChange={(e) => setTopUpValue((p) => ({ ...p, [id]: Number(e.target.value) }))}
                    className="rounded-md border px-3 py-2 w-36"
                    placeholder="Amount"
                  />
                  <button
                    onClick={() => {
                      const value = Number(topUpValue[id] || 0);
                      if (value > 0) {
                        if (g.id) {
                          onTopUp(g.id, value);
                        } else {
                          onTopUp(id, value);
                        }
                        setTopUpValue((p) => ({ ...p, [id]: 0 }));
                      }
                    }}
                    className="px-3 py-2 rounded-md bg-slate-900 text-white"
                  >
                    Add
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/** deterministic currency formatter */
function formatCurrency(amount: number, currency?: string) {
  // choose locale explicitly for deterministic output
  const locale = currency === 'USD' ? 'en-US' : 'en-IN';
  // show no fractional digits for whole currency amounts, but allow 2 decimals when needed
  const hasFraction = Math.abs(amount % 1) > 0;
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: hasFraction ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

/** deterministic date formatter (DD/MM/YYYY) */
function formatDate(dateStr?: string) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}
