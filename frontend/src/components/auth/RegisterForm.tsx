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

      {/* form fields remain unchanged */}
      {/* ... */}

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
