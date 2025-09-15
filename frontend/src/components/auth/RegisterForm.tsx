'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, Variants } from 'framer-motion';
import { FaUserAlt, FaEnvelope, FaLock, FaPhoneAlt } from 'react-icons/fa';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

const containerVariants: Variants = {
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

const itemVariants: Variants = {
  hidden: { y: 30, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.4 } },
};

export default function RegisterForm() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !username.trim() ||
      !email.trim() ||
      !phone.trim() ||
      !password
    ) {
      setError('Please fill all required fields.');
      return;
    }
    if (username.trim().length < 3) {
      setError('Username must be at least 3 characters.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!agree) {
      setError('You must agree to Terms & Condition and Privacy Policy.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          username: username.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          password
        })
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data?.error || data?.message || 'Signup failed');
        setLoading(false);
        return;
      }

      if (data?.redirectTo) {
        router.push(data.redirectTo);
      } else {
        router.push('/auth?type=login');
      }
    } catch (err) {
      console.error('Signup error', err);
      setError('Network error — please try again');
    } finally {
      setLoading(false);
    }
  }

  // --- NEW: Google login handler ---
  function handleGoogleLogin() {
    window.location.href = "http://localhost:5000/auth/google";
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
        Create Account
      </motion.h1>
      <motion.p variants={itemVariants} className="text-sm text-gray-400 mb-6">
        Start your finance tracking journey today
      </motion.p>

      <motion.div variants={itemVariants} className="flex gap-4 mb-6">
        <div className="relative w-1/2">
          <FaUserAlt className="absolute left-4 top-3.5 text-gray-400 text-lg pointer-events-none" />
          <input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            type="text"
            placeholder="First Name"
            required
            className="w-full py-3 px-5 pl-12 rounded-lg bg-finance-black border border-finance-navy/60 text-gray-200 placeholder-gray-500 text-base focus:outline-none focus:ring-2 focus:ring-finance-gold focus:border-finance-gold transition-all"
          />
        </div>

        <div className="relative w-1/2">
          <FaUserAlt className="absolute left-4 top-3.5 text-gray-400 text-lg pointer-events-none" />
          <input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            type="text"
            placeholder="Last Name"
            required
            className="w-full py-3 px-5 pl-12 rounded-lg bg-finance-black border border-finance-navy/60 text-gray-200 placeholder-gray-500 text-base focus:outline-none focus:ring-2 focus:ring-finance-gold focus:border-finance-gold transition-all"
          />
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="relative mb-6">
        <FaUserAlt className="absolute left-4 top-3.5 text-gray-400 text-lg pointer-events-none" />
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          type="text"
          placeholder="Username"
          required
          className="w-full py-3 px-5 pl-12 rounded-lg bg-finance-black border border-finance-navy/60 text-gray-200 placeholder-gray-500 text-base focus:outline-none focus:ring-2 focus:ring-finance-gold focus:border-finance-gold transition-all"
        />
      </motion.div>

      <motion.div variants={itemVariants} className="relative mb-6">
        <FaEnvelope className="absolute left-4 top-3.5 text-gray-400 text-lg pointer-events-none" />
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
        <FaPhoneAlt className="absolute left-4 top-3.5 text-gray-400 text-lg pointer-events-none" />
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          type="tel"
          placeholder="Phone (e.g. +919876543210)"
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

      <motion.div variants={itemVariants} className="relative mb-6">
        <FaLock className="absolute left-4 top-3.5 text-gray-400 text-lg pointer-events-none" />
        <input
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          type={showConfirmPassword ? 'text' : 'password'}
          placeholder="Confirm Password"
          required
          className="w-full py-3 px-5 pl-12 pr-12 rounded-lg bg-finance-black border border-finance-navy/60 text-gray-200 placeholder-gray-500 text-base focus:outline-none focus:ring-2 focus:ring-finance-gold focus:border-finance-gold transition-all"
        />
        <button
          type="button"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          className="absolute right-4 top-3.5 text-xl text-gray-400 hover:text-gray-200"
          aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
        >
          {showConfirmPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
        </button>
      </motion.div>

      <motion.div variants={itemVariants} className="flex items-center mb-5 text-sm text-gray-400">
        <input checked={agree} onChange={(e) => setAgree(e.target.checked)} type="checkbox" className="accent-finance-gold mr-2" />
        <span>
          I agree to the <a href="#" className="text-finance-gold hover:underline">Terms & Condition</a> and <a href="#" className="text-finance-gold hover:underline">Privacy Policy</a>
        </span>
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
        {loading ? 'Creating account...' : 'Register'}
      </motion.button>

      <motion.p variants={itemVariants} className="text-sm text-center mt-6 mb-2 text-gray-400">
        or continue with
      </motion.p>

      <motion.div variants={itemVariants} className="flex justify-center space-x-5">
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-11 h-11 group flex items-center justify-center rounded-full bg-white text-white text-xl transition-colors hover:bg-[#DB4437] shadow-md hover:shadow-lg"
        >
          <i className="bx bxl-google text-black group-hover:text-white" />
        </button>
      </motion.div>
    </motion.form>
  );
}
