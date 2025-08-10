// src/components/BudgetGoals/MonthlyBudgets.tsx
'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { FiSave } from 'react-icons/fi';

type MonthBudget = {
  month: number;
  name: string;
  spent?: number;
  saved?: number;
  goal: number; // spend-limit
  currency?: 'INR' | 'USD';
  notes?: string;
  active?: boolean;
};

type Props = {
  budgetsByYear?: Record<number, MonthBudget[]>;
  initialYear?: number;
  defaultLimitProp?: number;
  defaultCurrencyProp?: 'INR' | 'USD';
  onApplyDefault?: (year: number, newLimit: number, currency: string) => void;
};

const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export default function MonthlyBudgets({
  budgetsByYear,
  initialYear,
  defaultLimitProp,
  defaultCurrencyProp,
  onApplyDefault,
}: Props) {
  const mock = useMemo(() => buildMockBudgets([2024, 2025]), []);
  const source = budgetsByYear ?? mock;

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonthIndex = today.getMonth();

  const years = Object.keys(source).map((y)=>Number(y)).filter(y=>y<=currentYear).sort((a,b)=>b-a);

  const [year, setYear] = useState<number>(initialYear ?? (years[0] ?? currentYear));
  const [months, setMonths] = useState<MonthBudget[]>(() => (source[year] ?? []).map((m: MonthBudget) => cloneMonth(m)));

  const computedDefaultLimit = useMemo(() => {
    const yr = source[year] ?? [];
    const avg = yr.length ? Math.round(yr.reduce((s, x) => s + x.goal, 0) / yr.length) : 0;
    return yr[0]?.goal ?? avg ?? 0;
  }, [source, year]);

  const defaultLimit = defaultLimitProp ?? computedDefaultLimit;
  const defaultCurrency = defaultCurrencyProp ?? (source[year]?.[0]?.currency ?? 'INR');

  useEffect(() => {
    setMonths((source[year] ?? []).map((m: MonthBudget) => cloneMonth(m)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year, source]);

  useEffect(() => {
    if (year !== currentYear) return;
    setMonths((prev) => {
      const map = new Map<number, MonthBudget>();
      prev.forEach((m) => map.set(m.month, cloneMonth(m)));
      (source[year] ?? []).forEach((m) => { if (!map.has(m.month)) map.set(m.month, cloneMonth(m)); });
      for (let i = 0; i <= currentMonthIndex; i++) {
        if (!map.has(i)) {
          map.set(i, {
            month: i,
            name: MONTH_NAMES[i],
            spent: 0,
            goal: defaultLimit,
            currency: defaultCurrency,
            notes: '',
            active: true,
          });
        }
      }
      return Array.from(map.values()).sort((a,b)=>a.month-b.month);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year, defaultLimit, defaultCurrency, source]);

  const displayedMonths = (() => {
    if (year < currentYear) return months.slice().sort((a,b)=>a.month-b.month);
    if (year > currentYear) return [];
    return months.filter((m) => m.month <= currentMonthIndex).sort((a,b)=>a.month-b.month);
  })();

  function applyDefaultForNextMonthOnly() {
    if (onApplyDefault) {
      try { onApplyDefault(year, defaultLimit, defaultCurrency); } catch (_) {}
    }
  }

  function spentVal(m: MonthBudget) {
    return Number(m.spent ?? m.saved ?? 0);
  }

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <h4 className="text-lg font-semibold">Monthly Budgets</h4>
        <div className="text-xs text-slate-400">Track spending vs monthly limit</div>
      </div>

      <div className="p-4 rounded-lg border border-slate-100 bg-white shadow-sm">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold">{year === currentYear ? `${MONTH_NAMES[currentMonthIndex]} — Current month` : 'Month overview'}</div>
          <div>
            <select value={year} onChange={(e)=>setYear(Number(e.target.value))} className="rounded-md border px-3 py-1 text-sm">
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        </div>

        <div className="mt-4">
          {year === currentYear ? (
            <div>
              <div className="flex items-start gap-6">
                <div className="flex-1">
                  <div className="text-sm font-semibold">{MONTH_NAMES[currentMonthIndex]} — Live</div>
                  <div className="text-xs text-slate-400 mt-1">Live totals for this month.</div>

                  <div className="mt-4 grid grid-cols-3 gap-4 text-xs text-slate-500">
                    <div>
                      <div className="text-sm font-medium">Spent</div>
                      <div className="mt-1 font-semibold text-slate-800">
                        {(() => { const cur = months.find((m) => m.month === currentMonthIndex); return cur ? (cur.currency === 'USD' ? '$' : '₹') + formatCurrency(spentVal(cur), cur.currency) : '-'; })()}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm font-medium">Remaining</div>
                      <div className="mt-1 font-semibold text-slate-800">
                        {(() => { const cur = months.find((m) => m.month === currentMonthIndex); if (!cur) return '-'; return (cur.currency === 'USD' ? '$' : '₹') + formatCurrency(Math.max(0, cur.goal - spentVal(cur)), cur.currency); })()}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm font-medium">Limit</div>
                      <div className="mt-1 font-semibold text-slate-800">
                        {(() => { const cur = months.find((m) => m.month === currentMonthIndex); return cur ? (cur.currency === 'USD' ? '$' : '₹') + formatCurrency(cur.goal, cur.currency) : '-'; })()}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="w-1/3">
                  <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                    <div className="h-3 rounded-full bg-red-600" style={{ width: `${(() => { const cur = months.find((m) => m.month === currentMonthIndex); if (!cur) return 0; return Math.min(100, Math.round((spentVal(cur) / Math.max(1, cur.goal)) * 100)); })()}%` }} />
                  </div>
                  <div className="mt-2 text-xs text-slate-500 flex justify-between">
                    <div>Limit: {(() => { const cur = months.find((m) => m.month === currentMonthIndex); return cur ? (cur.currency === 'USD' ? '$' : '₹') + formatCurrency(cur.goal, cur.currency) : '-'; })()}</div>
                    <div>{(() => { const cur = months.find((m) => m.month === currentMonthIndex); return cur ? `${Math.min(100, Math.round((spentVal(cur) / Math.max(1, cur.goal)) * 100))}% used` : ''; })()}</div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-sm text-slate-500">Viewing historical months</div>
          )}
        </div>

        <div className="mt-6">
          <div className="text-sm font-semibold mb-3">Past months</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {displayedMonths.map((m: MonthBudget) => {
              const spent = spentVal(m);
              const remaining = Math.max(0, m.goal - spent);
              const pct = m.goal > 0 ? Math.round((spent / m.goal) * 100) : 0;
              const over = spent >= m.goal;
              return (
                <div key={m.month} className={`rounded-md p-3 ${over ? 'bg-red-50' : 'bg-slate-50'} border`}>
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">{m.name}</div>
                    <div className="text-xs">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${over ? 'bg-red-100 text-red-700' : 'bg-white text-slate-700'}`}>
                        {over ? 'Over' : `${pct}%`}
                      </span>
                    </div>
                  </div>

                  <div className="mt-2 text-xs text-slate-500 flex justify-between">
                    <div>Spent</div>
                    <div className="font-medium">{m.currency === 'USD' ? '$' : '₹'}{formatCurrency(spent, m.currency)}</div>
                  </div>

                  <div className="mt-1 text-xs text-slate-500 flex justify-between">
                    <div>Remaining</div>
                    <div className="font-medium">{m.currency === 'USD' ? '$' : '₹'}{formatCurrency(remaining, m.currency)}</div>
                  </div>

                  <div className="mt-3">
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className={`h-2 rounded-full ${over ? 'bg-red-700' : 'bg-red-600'}`} style={{ width: `${Math.min(100, pct)}%` }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <button onClick={applyDefaultForNextMonthOnly} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-900 text-white text-sm">
            <FiSave /> Apply default for next month
          </button>
        </div>
      </div>
    </div>
  );
}

/* helpers */
function cloneMonth(m: MonthBudget): MonthBudget { return { ...m }; }

function formatCurrency(amount: number, currency?: string) {
  const locale = currency === 'USD' ? 'en-US' : 'en-IN';
  const hasFraction = Math.abs(amount % 1) > 0;
  return new Intl.NumberFormat(locale, { minimumFractionDigits: hasFraction ? 2 : 0, maximumFractionDigits: 2 }).format(amount);
}

function buildMockBudgets(years: number[]): Record<number, MonthBudget[]> {
  const res: Record<number, MonthBudget[]> = {};
  for (const y of years) {
    const arr: MonthBudget[] = [];
    for (let m = 0; m < 12; m++) {
      const baseGoal = 35000 + (y - 2024) * 2000 + (m % 6) * 1500;
      const spent = Math.round(baseGoal * (0.65 + ((m + y) % 5) * 0.04));
      arr.push({ month: m, name: MONTH_NAMES[m], spent, goal: baseGoal, currency: 'INR', notes: '', active: true });
    }
    res[y] = arr;
  }
  return res;
}
