// components/auth/ResetPasswordForm.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, Variants } from 'framer-motion';
import { clearAccessToken } from '@/lib/auth';

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.28 } },
};

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams?.get('token') ?? '';
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle'|'success'|'error'>('idle');
  const [error, setError] = useState<string | null>(null);


  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password })
      });
      

      if (res.ok) {
        clearAccessToken();
        setStatus('success');
        // optional: redirect to login with success query
        setTimeout(() => router.replace('/auth?type=login'), 1400);
      } else {
        const d = await res.json().catch(() => ({}));
        setError(d?.message || 'Reset failed or token expired.');
        setStatus('error');
      }
    } catch (err) {
      console.error(err);
      setError('Network error — try again.');
      setStatus('error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div variants={itemVariants} initial="hidden" animate="visible" className="max-w-md mx-auto p-6 rounded-2xl bg-finance-black/60 border border-finance-navy/40 shadow-lg">
      <h2 className="text-2xl font-bold text-white mb-2">Create a new password</h2>
      <p className="text-sm text-gray-400 mb-4">Make sure it is strong and something you will remember.</p>

      {status === 'success' ? (
        <div className="p-4 rounded-md bg-green-900/30 text-green-200">Password updated — redirecting to login…</div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="New password"
            className="w-full rounded-lg py-3 px-4 bg-transparent border border-finance-navy/60 placeholder-gray-500 text-gray-200 focus:outline-none focus:ring-2 focus:ring-finance-gold"
            aria-label="New password"
            required
          />
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Confirm password"
            className="w-full rounded-lg py-3 px-4 bg-transparent border border-finance-navy/60 placeholder-gray-500 text-gray-200 focus:outline-none focus:ring-2 focus:ring-finance-gold"
            aria-label="Confirm password"
            required
          />
          {error && <div className="text-red-400 text-sm">{error}</div>}

          <button disabled={loading} type="submit" className="w-full py-3 font-semibold rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-500 text-finance-black shadow-md hover:scale-[1.02] transition-transform disabled:opacity-60">
            {loading ? 'Updating...' : 'Update password'}
          </button>
        </form>
      )}
    </motion.div>
  );
}
