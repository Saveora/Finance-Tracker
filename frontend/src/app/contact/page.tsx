'use client';

import { useEffect } from 'react';
import { useLayoutEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import React from 'react';

type ContactFormInputs = {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
  agree: boolean;
};

export default function ContactPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ContactFormInputs>();

  const onSubmit: SubmitHandler<ContactFormInputs> = async (data) => {
    try {
      console.log('Submitted Data:', data); // Replace with API call if needed
      toast.success('Message sent successfully! ✅');
      reset();
    } catch (err) {
      toast.error('Something went wrong. ❌');
    }
  };

  return (
    <>
    <Navbar />
      <main className="min-h-screen bg-[#030917] text-white px-4 py-24">
        <div className="text-center mb-10">
          <p className="text-yellow-400 text-md font-bold mb-2">*Contact us</p>
          <h1 className="text-3xl md:text-4xl font-semibold mb-2">We’re here to help</h1>
          <p className="text-gray-300 max-w-xl mx-auto">
            Got questions about Saveora or your plans? Send us a message and we’ll reply soon.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-black max-w-lg mx-auto p-6 md:p-8 rounded-xl shadow-xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 text-left">
            {/* First + Last name */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="w-full">
                <label className="block text-sm mb-1">First name *</label>
                <input
                  {...register('firstName', { required: true })}
                  placeholder="Jane"
                  className="w-full p-2 rounded bg-gray-800 border border-gray-600 text-white"
                />
                {errors.firstName && (
                  <p className="text-red-400 text-xs mt-1">First name is required</p>
                )}
              </div>
              <div className="w-full">
                <label className="block text-sm mb-1">Last name *</label>
                <input
                  {...register('lastName', { required: true })}
                  placeholder="Smith"
                  className="w-full p-2 rounded bg-gray-800 border border-gray-600 text-white"
                />
                {errors.lastName && (
                  <p className="text-red-400 text-xs mt-1">Last name is required</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm mb-1">Email *</label>
              <input
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: 'Enter a valid email'
                  }
                })}
                placeholder="jane@email.com"
                className="w-full p-2 rounded bg-gray-800 border border-gray-600 text-white"
              />
              {errors.email && (
                <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm mb-1">Message *</label>
              <textarea
                {...register('message', { required: true })}
                placeholder="Leave us a message..."
                rows={4}
                className="w-full p-2 rounded bg-gray-800 border border-gray-600 text-white"
              />
              {errors.message && (
                <p className="text-red-400 text-xs mt-1">Message is required</p>
              )}
            </div>

            {/* Checkbox */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="agree"
                {...register('agree', { required: true })}
              />
              <label htmlFor="agree" className="text-sm">
                I agree to the privacy policy.
              </label>
            </div>
            {errors.agree && (
              <p className="text-red-400 text-xs">You must agree to continue</p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-yellow-400 text-black py-2 rounded font-bold hover:bg-yellow-300 transition"
            >
              Submit
            </button>
          </form>
        </div>
      </main>

      {/* Toast Notifications */}
      <ToastContainer position="bottom-right" />

      <Footer />
    </>
  );
}
