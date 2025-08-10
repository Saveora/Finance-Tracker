// src/components/BudgetGoals/BudgetLayout.tsx
'use client';

import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import GoalsList from './GoalsList';
import GoalsSummary from './GoalsSummary';
import CreateGoalForm, { GoalItem } from './CreateGoalForm';
import MonthlyBudgets from './MonthlyBudgets';
import BudgetSettings from './BudgetSettings';

export default function BudgetLayout() {
  const [goals, setGoals] = useState<GoalItem[]>([
    { id: 'g-1', title: 'Emergency Fund', target: 50000, saved: 12000, currency: 'INR', deadline: '2025-12-31', recurring: false, color: 'bg-yellow-400' },
    { id: 'g-2', title: 'Vacation 2026', target: 150000, saved: 30000, currency: 'INR', deadline: '2026-06-01', recurring: false, color: 'bg-emerald-400' },
    { id: 'g-3', title: 'Car Maintenance', target: 1500, saved: 500, currency: 'USD', deadline: '2025-09-30', recurring: true, color: 'bg-sky-400' },
  ]);

  const [editing, setEditing] = useState<GoalItem | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const totalSaved = useMemo(() => goals.reduce((s, g) => s + g.saved, 0), [goals]);
  const totalTarget = useMemo(() => goals.reduce((s, g) => s + g.target, 0), [goals]);

  const [defaultLimit, setDefaultLimit] = useState<number>(35000);
  const [defaultCurrency, setDefaultCurrency] = useState<'INR'|'USD'>('INR');
  const [defaultMsg, setDefaultMsg] = useState<string | null>(null);

  function handleSave(goal: GoalItem) {
    if (goal.id) setGoals((prev) => prev.map((g) => (g.id === goal.id ? goal : g)));
    else setGoals((prev) => [{ ...goal, id: `g-${Date.now()}` }, ...prev]);
    setModalOpen(false);
    setEditing(null);
  }
  function handleDelete(id: string) { setGoals((prev) => prev.filter((g) => g.id !== id)); }
  function handleEdit(goal: GoalItem) { setEditing(goal); setModalOpen(true); }

  function handleApplyDefault() {
    setDefaultMsg('Default updated. It will be applied to the next created month.');
    setTimeout(()=>setDefaultMsg(null), 3000);
  }

  return (
    <div className="flex">
      <main className="flex-1 py-10 px-10">
        <div className="max-w-7xl mx-auto">
          <header className="flex items-start justify-between mb-8 gap-6">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900">Budget Goals</h1>
              <p className="text-sm text-slate-500 mt-1">Create and track financial goals — set targets, add savings, and monitor progress.</p>
            </div>

            <div className="flex items-center gap-3">
              <button onClick={() => { setEditing(null); setModalOpen(true); }} className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-slate-900 px-4 py-2 rounded-lg shadow">
                + New Goal
              </button>
            </div>
          </header>

          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="grid grid-cols-12 gap-6">
            {/* ROW 1: Goals list full width */}
            <div className="col-span-12">
              <section className="bg-white rounded-2xl p-6 shadow-sm">
                <GoalsList
                  goals={goals}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onTopUp={(id, amount) => setGoals((prev) => prev.map((g) => (g.id === id ? { ...g, saved: g.saved + amount } : g)))}
                />
              </section>
            </div>

            {/* ROW 2: Monthly budgets (wider left) */}
            {/* add top margin to sit nicely below the cards above */}
            <div className="col-span-12 lg:col-span-9 mt-6 lg:mt-6">
              <MonthlyBudgets
                initialYear={new Date().getFullYear()}
                defaultLimitProp={defaultLimit}
                defaultCurrencyProp={defaultCurrency}
                onApplyDefault={(y, n, c) => { setDefaultLimit(n); setDefaultCurrency(c as 'INR'|'USD'); handleApplyDefault(); }}
              />
            </div>

            {/* ROW 2: Budget settings (right, narrower) */}
            <aside className="col-span-12 lg:col-span-3 mt-6 lg:mt-6">
              <BudgetSettings
                defaultLimit={defaultLimit}
                setDefaultLimit={setDefaultLimit}
                defaultCurrency={defaultCurrency}
                setDefaultCurrency={setDefaultCurrency}
                onSaveDefault={handleApplyDefault}
                msg={defaultMsg}
              />
            </aside>
          </motion.div>
        </div>
      </main>

      {modalOpen && (
        <CreateGoalForm initial={editing ?? undefined} onClose={() => { setModalOpen(false); setEditing(null); }} onSave={handleSave} />
      )}
    </div>
  );
}
