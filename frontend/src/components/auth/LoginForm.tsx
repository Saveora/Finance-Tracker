'use client';

import React, { useState } from 'react';
import { motion, Variants } from 'framer-motion';
import { FaUserAlt, FaLock } from 'react-icons/fa';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

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
  const [showPassword, setShowPassword] = useState(false);

  return (
    <motion.form
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-sm mx-auto text-center"
    >
      <motion.h1
        variants={itemVariants}
        className="text-3xl font-bold mb-2 text-white"
      >
        Welcome Back
      </motion.h1>
      <motion.p
        variants={itemVariants}
        className="text-sm text-gray-400 mb-6"
      >
        Sign in to your finance tracker account
      </motion.p>

      <motion.div variants={itemVariants} className="relative mb-6">
        <FaUserAlt className="absolute left-4 top-3.5 text-gray-400 text-lg pointer-events-none" />
        <input
          type="text"
          placeholder="Username"
          required
          className="w-full py-3 px-5 pl-12 rounded-lg bg-finance-black border border-finance-navy/60 text-gray-200 placeholder-gray-500 text-base focus:outline-none focus:ring-2 focus:ring-finance-gold focus:border-finance-gold transition-all"
        />
      </motion.div>

      <motion.div variants={itemVariants} className="relative mb-6">
        <FaLock className="absolute left-4 top-3.5 text-gray-400 text-lg pointer-events-none" />
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder="Password"
          required
          className="w-full py-3 px-5 pl-12 pr-12 rounded-lg bg-finance-black border border-finance-navy/60 text-gray-200 placeholder-gray-500 text-base focus:outline-none focus:ring-2 focus:ring-finance-gold focus:border-finance-gold transition-all"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-3.5 text-xl text-gray-400 hover:text-gray-200"
        >
          {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
        </button>
      </motion.div>

      <motion.div variants={itemVariants} className="flex items-center justify-between mb-5 text-sm text-gray-400">
        <label className="flex items-center space-x-2">
          <input type="checkbox" className="accent-finance-gold" />
          <span>Remember me</span>
        </label>
        <a href="#" className="text-finance-gold/80 hover:text-finance-gold hover:underline">
          Forgot password?
        </a>
      </motion.div>

      <motion.button
        variants={itemVariants}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        type="submit"
        className="w-full py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-finance-black text-base font-bold rounded-lg transition-transform shadow-md hover:shadow-lg"
      >
        Login
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