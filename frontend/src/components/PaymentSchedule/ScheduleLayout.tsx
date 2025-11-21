// frontend/src/components/PaymentSchedule/ScheduleLayout.tsx
'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import ScheduleForm, { ScheduleItem } from './ScheduleForm';
import ScheduleList from './ScheduleList';
import ScheduleSummary from './ScheduleSummary';
import UpcomingPayments from './UpcomingPayments';
import useUser from '@/hooks/useUser';
import { fetchWithAuth } from '@/lib/fetchWithAuth';

export default function ScheduleLayout() {
  const { user, loading: userLoading } = useUser();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ScheduleItem | null>(null);
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch schedules once user is known
  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        // Protected endpoint expects Authorization header (fetchWithAuth attaches it)
        const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/payment-schedules`, {
          method: 'GET',
        });

        if (!mounted) return;

        if (!res.ok) {
          // If unauthorized (401), fetchWithAuth will try refresh; but handle failures gracefully
          console.error('Failed to fetch schedules', res.status);
          setSchedules([]);
          return;
        }

        const data = await res.json().catch(() => ({}));
        let list: any[] = [];
        if (Array.isArray(data)) list = data;
        else if (data && Array.isArray(data.schedules)) list = data.schedules;
        else if (data && Array.isArray((data as any).rows)) list = (data as any).rows;
        else list = [];

        const normalized = list.map((s: any) => ({
          id: String(s.id),
          title: s.title,
          amount: Number(s.amount),
          currency: s.currency || 'INR',
          payee: s.payee,
          method: s.method,
          startDate: s.startDate || s.start_date || null,
          recurrence: s.recurrence,
          active: typeof s.active === 'boolean' ? s.active : !!s.is_active,
          note: s.note || '',
        }));
        setSchedules(normalized);
      } catch (err) {
        console.error('Failed to load schedules', err);
        setSchedules([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    if (userLoading) return; // wait for user check
    load();

    return () => { mounted = false; };
  }, [userLoading]);

  // Save (create or update)
  const handleSave = async (payload: ScheduleItem) => {
    try {
      const isEdit = !!payload.id;
      const url = isEdit
        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/payment-schedules/${payload.id}`
        : `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/payment-schedules`;

      // Do NOT attach userId in body: the backend uses req.user (requireAuth) to resolve user
      const body = { ...payload };

      const res = await fetchWithAuth(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        console.error('Save failed', res.status);
        return;
      }

      const data = await res.json().catch(() => ({}));
      const saved = data && data.id ? data : (Array.isArray(data) ? data[0] : data);

      if (isEdit) {
        setSchedules((prev) => prev.map((p) => (p.id === saved.id ? saved : p)));
      } else {
        setSchedules((prev) => [saved, ...prev]);
      }

      setModalOpen(false);
      setEditing(null);
    } catch (err) {
      console.error('Failed to save schedule', err);
    }
  };

  // Delete
  const handleDelete = async (id: string) => {
    try {
      const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/payment-schedules/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        console.error('Failed to delete schedule', res.status);
        return;
      }

      const data = await res.json().catch(() => ({}));
      if (data && data.ok) {
        setSchedules((prev) => prev.filter((p) => p.id !== id));
      } else {
        // fallback: still remove locally if server returned success id
        setSchedules((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete schedule', err);
    }
  };

  // Toggle active
  const handleToggle = async (id: string) => {
    try {
      const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/payment-schedules/${id}/toggle`, {
        method: 'PATCH',
      });

      if (!res.ok) {
        console.error('Toggle failed', res.status);
        return;
      }

      const updated = await res.json().catch(() => ({}));
      if (updated && updated.id) {
        setSchedules((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      }
    } catch (err) {
      console.error('Failed to toggle schedule', err);
    }
  };

  const handleEdit = (item: ScheduleItem) => {
    setEditing(item);
    setModalOpen(true);
  };

  // Derived data (upcoming)
  const upcoming = useMemo(() => {
    const active = (schedules || []).filter((s) => s && s.active);
    return active
      .map((s) => ({ ...s, nextDate: new Date(s.startDate) }))
      .sort((a, b) => +a.nextDate - +b.nextDate)
      .slice(0, 5);
  }, [schedules]);

  const totalUpcomingAmount = useMemo(() => upcoming.reduce((sum, s) => sum + Number(s.amount || 0), 0), [upcoming]);

  return (
    <div className="flex">
      <main className="flex-1 py-10 px-10">
        <div className="max-w-7xl mx-auto">
          <header className="flex items-start justify-between mb-8 gap-6">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900">Payment Schedule</h1>
              <p className="text-sm text-slate-500 mt-1">Schedule recurring payments and keep track of upcoming bills.</p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => { setEditing(null); setModalOpen(true); }}
                className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-slate-900 px-4 py-2 rounded-lg shadow"
              >
                + Create Schedule
              </button>
            </div>
          </header>

          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="grid grid-cols-12 gap-6">
            <section className="col-span-8 bg-white rounded-2xl p-6 shadow-sm">
              {loading ? <div className="py-12 text-center text-slate-500">Loading schedules...</div> :
                <ScheduleList items={schedules} onEdit={handleEdit} onDelete={handleDelete} onToggle={handleToggle} />
              }
            </section>

            <aside className="col-span-4 space-y-6">
              <ScheduleSummary totalUpcomingAmount={totalUpcomingAmount} count={(schedules || []).length} />
              <UpcomingPayments items={upcoming} />
            </aside>
          </motion.div>
        </div>
      </main>

      {modalOpen && (
        <ScheduleForm
          initial={editing ?? undefined}
          onClose={() => { setModalOpen(false); setEditing(null); }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
