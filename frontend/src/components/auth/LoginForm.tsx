// components/auth/LoginForm.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, Variants } from 'framer-motion';
import { FaUserAlt, FaLock } from 'react-icons/fa';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { setAccessToken } from '@/lib/auth';

const containerVariants : Variants= {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      staggerChildren: 0.2,
      duration: 0.6,
      ease: 'easeOut'
    },
  },
};

const itemVariants : Variants= {
  hidden: { y: 30, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.4 } },
};

export default function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Save access token centrally. We store in localStorage for persistence.
  // Security note: localStorage is easier but can be exposed by XSS;
  // for more secure apps, you can keep access token in memory and refresh via httpOnly cookie.
  function saveAccessToken(token: string) {
    setAccessToken(token);
    // keep in-memory pointer for quick usage (optional)
    (window as any).__ACCESS_TOKEN__ = token;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        // important: sends httpOnly refresh cookie (if present) and allows cookie to be set
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError((data && data.error) || (data && data.message) || 'Login failed');
        setLoading(false);
        return;
      }

      // successful login: server sets refresh_token cookie and returns accessToken + user info in JSON
      const accessToken = data && data.accessToken;
      const user = data && data.user;

      if (!accessToken) {
        setError('Login succeeded but no access token returned');
        setLoading(false);
        return;
      }

      // store access token (and optionally use user info)
      saveAccessToken(accessToken);

      // Optionally store user basic info in localStorage for quick UI usage:
      if (user) {
        try {
          localStorage.setItem('me', JSON.stringify(user));
        } catch (err) {
          // ignore storage errors
        }
      }

      // Redirect to dashboard (or desired page)
      router.push('/dashboard');
    } catch (err) {
      console.error('Login error', err);
      setError('Network error — please try again');
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-sm mx-auto text-center"
    >
      <motion.h1 variants={itemVariants} className="text-3xl font-bold mb-2 text-white">
        Welcome Back
      </motion.h1>
      <motion.p variants={itemVariants} className="text-sm text-gray-400 mb-6">
        Sign in to your finance tracker account
      </motion.p>

      <motion.div variants={itemVariants} className="relative mb-6">
        <FaUserAlt className="absolute left-4 top-3.5 text-gray-400 text-lg pointer-events-none" />
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="Email"
          required
          className="w-full py-3 px-5 pl-12 rounded-lg bg-finance-black border border-finance-navy/60 text-gray-200 placeholder-gray-500 text-base focus:outline-none focus:ring-2 focus:ring-finance-gold focus:border-finance-gold transition-all"
        />
      </motion.div>

      <motion.div variants={itemVariants} className="relative mb-6">
        <FaLock className="absolute left-4 top-3.5 text-gray-400 text-lg pointer-events-none" />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type={showPassword ? 'text' : 'password'}
          placeholder="Password"
          required
          className="w-full py-3 px-5 pl-12 pr-12 rounded-lg bg-finance-black border border-finance-navy/60 text-gray-200 placeholder-gray-500 text-base focus:outline-none focus:ring-2 focus:ring-finance-gold focus:border-finance-gold transition-all"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-3.5 text-xl text-gray-400 hover:text-gray-200"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
        </button>
      </motion.div>

      <motion.div variants={itemVariants} className="flex items-center justify-between mb-5 text-sm text-gray-400">
        <label className="flex items-center space-x-2">
          <input checked={remember} onChange={(e) => setRemember(e.target.checked)} type="checkbox" className="accent-finance-gold" />
          <span>Remember me</span>
        </label>
        <button
  type="button"
  onClick={() => router.push('/auth?type=forgot', { scroll: false })}
  className="text-finance-gold/80 hover:text-finance-gold hover:underline"
>
  Forgot password?
</button>
      </motion.div>

      {error && <div className="text-sm text-red-400 mb-3">{error}</div>}

      <motion.button
        variants={itemVariants}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-finance-black text-base font-bold rounded-lg transition-transform shadow-md hover:shadow-lg disabled:opacity-60"
      >
        {loading ? 'Signing in...' : 'Login'}
      </motion.button>

      <motion.p variants={itemVariants} className="text-sm text-center mt-6 mb-2 text-gray-400">
        or continue with
      </motion.p>

      <motion.div variants={itemVariants} className="flex justify-center space-x-5">
        {[
          { icon: 'google', bg: 'bg-white', hover: 'hover:bg-[#DB4437]' },
        ].map(({ icon, bg, hover }, idx) => (
          <a
            key={idx}
            href="#"
            className={`w-11 h-11 group flex items-center justify-center rounded-full ${bg} text-white text-xl transition-colors ${hover} shadow-md hover:shadow-lg`}
          >
            <i className={`bx bxl-${icon} ${icon === 'google' ? 'text-black group-hover:text-white' : ''}`} />
          </a>
        ))}
      </motion.div>
    </motion.form>
  );
}
