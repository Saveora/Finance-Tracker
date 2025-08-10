// src/components/PaymentSchedule/ScheduleLayout.tsx
'use client';

import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import ScheduleForm, { ScheduleItem } from './ScheduleForm';
import ScheduleList from './ScheduleList';
import ScheduleSummary from './ScheduleSummary';
import UpcomingPayments from './UpcomingPayments';

/**
 * Holds schedule state and handlers. Replace mock data with backend fetches later.
 */

export default function ScheduleLayout() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ScheduleItem | null>(null);

  const [schedules, setSchedules] = useState<ScheduleItem[]>([
    {
      id: 's-1',
      title: 'Monthly Rent',
      amount: 12000,
      currency: 'INR',
      payee: 'Landlord •••• 4321',
      method: 'UPI',
      startDate: new Date('2025-08-05').toISOString(),
      recurrence: 'Monthly',
      active: true,
      note: 'Rent for apt #3B',
    },
    {
      id: 's-2',
      title: 'Gym Membership',
      amount: 799,
      currency: 'INR',
      payee: 'FitGym',
      method: 'Bank',
      startDate: new Date('2025-08-10').toISOString(),
      recurrence: 'Monthly',
      active: true,
      note: '',
    },
    {
      id: 's-3',
      title: 'Netflix',
      amount: 200,
      currency: 'INR',
      payee: 'Netflix',
      method: 'Card',
      startDate: new Date('2025-08-12').toISOString(),
      recurrence: 'Monthly',
      active: false,
      note: 'Streaming',
    },
  ]);

  // Quick derived metrics
  const upcoming = useMemo(() => {
    // compute next occurrences (simple: use startDate as next)
    const activeSchedules = schedules.filter((s) => s.active);
    return activeSchedules
      .map((s) => ({ ...s, nextDate: new Date(s.startDate) }))
      .sort((a, b) => +a.nextDate - +b.nextDate)
      .slice(0, 5);
  }, [schedules]);

  const totalUpcomingAmount = useMemo(() => {
    return upcoming.reduce((sum, s) => sum + s.amount, 0);
  }, [upcoming]);

  // handlers
  const handleSave = (payload: ScheduleItem) => {
    if (payload.id) {
      // edit
      setSchedules((prev) => prev.map((p) => (p.id === payload.id ? payload : p)));
    } else {
      // create
      const newItem = { ...payload, id: `s-${Date.now()}` };
      setSchedules((prev) => [newItem, ...prev]);
    }
    setModalOpen(false);
    setEditing(null);
  };

  const handleDelete = (id: string) => {
    setSchedules((prev) => prev.filter((p) => p.id !== id));
  };

  const handleToggle = (id: string) => {
    setSchedules((prev) => prev.map((p) => (p.id === id ? { ...p, active: !p.active } : p)));
  };

  const handleEdit = (item: ScheduleItem) => {
    setEditing(item);
    setModalOpen(true);
  };

  return (
    <div className="flex">
      <main className="flex-1 py-10 px-10">
        <div className="max-w-7xl mx-auto">
          <header className="flex items-start justify-between mb-8 gap-6">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900">Payment Schedule</h1>
              <p className="text-sm text-slate-500 mt-1">
                Schedule recurring payments and keep track of upcoming bills.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setEditing(null);
                  setModalOpen(true);
                }}
                className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-slate-900 px-4 py-2 rounded-lg shadow"
              >
                + Create Schedule
              </button>
            </div>
          </header>

          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="grid grid-cols-12 gap-6"
          >
            <section className="col-span-8 bg-white rounded-2xl p-6 shadow-sm">
              <ScheduleList
                items={schedules}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggle={handleToggle}
              />
            </section>

            <aside className="col-span-4 space-y-6">
              <ScheduleSummary totalUpcomingAmount={totalUpcomingAmount} count={schedules.length} />
              <UpcomingPayments items={upcoming} />
            </aside>
          </motion.div>
        </div>
      </main>

      {modalOpen && (
        <ScheduleForm
          initial={editing ?? undefined}
          onClose={() => {
            setModalOpen(false);
            setEditing(null);
          }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
