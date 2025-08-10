// src/components/PaymentSchedule/ScheduleForm.tsx
'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { FiX } from 'react-icons/fi';

export type ScheduleItem = {
  id?: string;
  title: string;
  amount: number;
  currency: 'INR' | 'USD';
  payee: string;
  method: 'UPI' | 'Bank' | 'Card';
  startDate: string; // ISO
  recurrence: 'One-time' | 'Daily' | 'Weekly' | 'Monthly';
  active: boolean;
  note?: string;
};

type Props = {
  initial?: ScheduleItem;
  onSave: (s: ScheduleItem) => void;
  onClose: () => void;
};

export default function ScheduleForm({ initial, onSave, onClose }: Props) {
  const { register, handleSubmit, formState } = useForm<ScheduleItem>({
    defaultValues: initial ?? {
      title: '',
      amount: 0,
      currency: 'INR',
      payee: '',
      method: 'UPI',
      startDate: new Date().toISOString().slice(0, 10),
      recurrence: 'Monthly',
      active: true,
      note: '',
    },
  });

  const submit = (data: ScheduleItem) => {
    // normalize date
    const payload: ScheduleItem = { ...data, startDate: new Date(data.startDate).toISOString() };
    onSave(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">{initial ? 'Edit Schedule' : 'Create Schedule'}</h3>
          <button onClick={onClose} className="p-2 rounded-md hover:bg-slate-100">
            <FiX />
          </button>
        </div>

        <form onSubmit={handleSubmit(submit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-500">Title</label>
              <input {...register('title', { required: true })} className="mt-1 w-full rounded-md border px-3 py-2" />
            </div>

            <div>
              <label className="text-xs text-slate-500">Amount</label>
              <input {...register('amount', { required: true, min: 0.01 })} type="number" step="0.01" className="mt-1 w-full rounded-md border px-3 py-2" />
            </div>

            <div>
              <label className="text-xs text-slate-500">Currency</label>
              <select {...register('currency')} className="mt-1 w-full rounded-md border px-3 py-2">
                <option value="INR">INR</option>
                <option value="USD">USD</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-500">Method</label>
              <select {...register('method')} className="mt-1 w-full rounded-md border px-3 py-2">
                <option value="UPI">UPI</option>
                <option value="Bank">Bank</option>
                <option value="Card">Card</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-500">Payee / Recipient</label>
            <input {...register('payee', { required: true })} className="mt-1 w-full rounded-md border px-3 py-2" placeholder="Name or UPI ID / Account" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-500">Start date</label>
              <input {...register('startDate', { required: true })} type="date" className="mt-1 w-full rounded-md border px-3 py-2" />
            </div>

            <div>
              <label className="text-xs text-slate-500">Recurrence</label>
              <select {...register('recurrence')} className="mt-1 w-full rounded-md border px-3 py-2">
                <option>One-time</option>
                <option>Daily</option>
                <option>Weekly</option>
                <option>Monthly</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-500">Note (optional)</label>
            <input {...register('note')} className="mt-1 w-full rounded-md border px-3 py-2" />
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" {...register('active')} className="rounded" />
              Active
            </label>

            <div className="flex items-center gap-3">
              <button type="button" onClick={onClose} className="px-4 py-2 rounded-md border">Cancel</button>
              <button type="submit" className="px-4 py-2 rounded-md bg-slate-900 text-white">
                {initial ? 'Save changes' : 'Create schedule'}
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
