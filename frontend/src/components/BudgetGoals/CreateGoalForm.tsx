// src/components/BudgetGoals/CreateGoalForm.tsx
'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { FiX } from 'react-icons/fi';

export type GoalItem = {
  id?: string;
  title: string;
  target: number;
  saved: number;
  currency: 'INR' | 'USD';
  deadline: string; // ISO date YYYY-MM-DD
  recurring: boolean;
  color?: string;
};

type Props = {
  initial?: GoalItem;
  onSave: (g: GoalItem) => void;
  onClose: () => void;
};

export default function CreateGoalForm({ initial, onSave, onClose }: Props) {
  const { register, handleSubmit, setValue } = useForm<GoalItem>({
    defaultValues: initial ?? {
      title: '',
      target: 0,
      saved: 0,
      currency: 'INR',
      deadline: new Date().toISOString().slice(0, 10),
      recurring: false,
      color: 'bg-yellow-400',
    },
  });

  const submit = (data: GoalItem) => {
    const payload = { ...data, deadline: new Date(data.deadline).toISOString() };
    onSave(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">{initial ? 'Edit Goal' : 'Create Goal'}</h3>
          <button onClick={onClose} className="p-2 rounded-md hover:bg-slate-100"><FiX /></button>
        </div>

        <form onSubmit={handleSubmit(submit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-500">Title</label>
              <input {...register('title', { required: true })} className="mt-1 w-full rounded-md border px-3 py-2" />
            </div>

            <div>
              <label className="text-xs text-slate-500">Target Amount</label>
              <input {...register('target', { valueAsNumber: true })} type="number" step="0.01" className="mt-1 w-full rounded-md border px-3 py-2" />
            </div>

            <div>
              <label className="text-xs text-slate-500">Currency</label>
              <select {...register('currency')} className="mt-1 w-full rounded-md border px-3 py-2">
                <option value="INR">INR</option>
                <option value="USD">USD</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-500">Saved</label>
              <input {...register('saved', { valueAsNumber: true })} type="number" step="0.01" className="mt-1 w-full rounded-md border px-3 py-2" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-500">Deadline</label>
              <input {...register('deadline')} type="date" className="mt-1 w-full rounded-md border px-3 py-2" />
            </div>

            <div>
              <label className="text-xs text-slate-500">Recurring</label>
              <select {...register('recurring')} className="mt-1 w-full rounded-md border px-3 py-2" onChange={(e) => setValue('recurring', e.target.value === 'true')}>
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-500">Color accent</label>
            <div className="mt-2 flex gap-2 items-center">
              {['bg-yellow-400', 'bg-emerald-400', 'bg-sky-400', 'bg-pink-400'].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setValue('color', c)}
                  className={`${c} w-8 h-8 rounded-full border-2 border-white shadow`}></button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-md border">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded-md bg-slate-900 text-white">{initial ? 'Save' : 'Create'}</button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
