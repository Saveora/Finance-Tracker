'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { AnimatePresence, motion, Variants } from 'framer-motion';
import LoginForm from '../../components/auth/LoginForm';
import RegisterForm from '../../components/auth/RegisterForm';
import Image from 'next/image';

function AuthFormSwitcher() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const type = searchParams.get('type') || 'login';

  const switchTo = (target: string) => {
    router.push(`?type=${target}`, { scroll: false });
  };

  const direction = type === 'signup' ? 1 : -1;

  const formVariants: Variants = {
    initial: { x: direction * 150, opacity: 0 },
    animate: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.4, ease: 'easeInOut' },
    },
    exit: {
      x: direction * -150,
      opacity: 0,
      transition: { duration: 0.4, ease: 'easeInOut' },
    },
  };

  const logoVariants: Variants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { delay: 0.2, duration: 0.5, ease: 'easeOut' },
    },
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#030917] p-4">
      <div className="relative w-full max-w-md bg-[#06142e] rounded-3xl shadow-elegant overflow-hidden border border-finance-navy/50">
        <AnimatePresence mode="wait">
          <motion.div
            key={type}
            variants={logoVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="w-full flex justify-center items-center mt-8 mb-4"
          >
            <Link href="/" className="flex items-center space-x-2 hover:scale-105 transition-transform">
              <Image src="/logo.png" alt="Saveora Logo" width={32} height={32} />
              <span className="text-finance-gold font-bold text-xl">Saveora</span>
            </Link>
          </motion.div>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {type === 'signup' ? (
            <motion.div
              key="signup"
              variants={formVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="p-8 sm:p-12 pt-4"
            >
              <RegisterForm />
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-400">Already have an account?</p>
                <button
                  onClick={() => switchTo('login')}
                  className="mt-1 font-semibold text-finance-gold hover:text-finance-gold-light transition-all"
                >
                  Login
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="login"
              variants={formVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="p-8 sm:p-12 pt-4"
            >
              <LoginForm />
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-400">Don&apos;t have an account?</p>
                <button
                  onClick={() => switchTo('signup')}
                  className="mt-1 font-semibold text-finance-gold hover:text-finance-gold-light transition-all"
                >
                  Register
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="bg-finance-darker min-h-screen" />}>
      <AuthFormSwitcher />
    </Suspense>
  );
}
