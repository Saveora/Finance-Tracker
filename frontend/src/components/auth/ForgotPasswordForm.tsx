// components/auth/ForgotPasswordForm.tsx
'use client';

import React, { useState } from 'react';
import { motion, Variants } from 'framer-motion';

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'sent' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`{${process.env.NEXT_PUBLIC_BACKEND_URL}/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      // show a generic success (do NOT reveal existence)
      if (res.ok) {
        setStatus('sent');
      } else {
        // still show generic message but set error for dev debugging if needed
        setStatus('sent');
      }
    } catch (err) {
      console.error(err);
      setError('Network error — please try again later.');
      setStatus('error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="max-w-md mx-auto p-6 rounded-2xl bg-finance-black/60 backdrop-blur-sm border border-finance-navy/40 shadow-lg">
      <h2 className="text-2xl font-bold text-white mb-2">Forgot your password?</h2>
      <p className="text-sm text-gray-400 mb-4">Enter your email and we'll send a secure link to reset your password.</p>

      {status === 'sent' ? (
        <div className="p-4 bg-finance-navy/20 rounded-md text-sm text-gray-200">
          If that email exists, we sent password reset instructions. Check your inbox.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-left text-sm text-gray-300">
            Email
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full rounded-lg py-3 px-4 bg-transparent border border-finance-navy/60 placeholder-gray-500 text-gray-200 focus:outline-none focus:ring-2 focus:ring-finance-gold"
              placeholder="name@company.com"
              aria-label="Email"
            />
          </label>

          {error && <div className="text-red-400 text-sm">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 font-semibold rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-500 text-finance-black shadow-md hover:scale-[1.02] transition-transform disabled:opacity-60"
          >
            {loading ? 'Sending...' : 'Send reset link'}
          </button>

          <p className="text-xs text-gray-500">Link expires in <strong>30 minutes</strong>.</p>
        </form>
      )}
    </motion.div>
  );
}
