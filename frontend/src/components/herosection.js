'use client'

import Image from 'next/image'
import Link from 'next/link'

export default function HeroSection() {
  return (
    <section className="bg-[#030917] text-white py-24 relative overflow-hidden">
      {/* Optional background glow (you can keep or remove it) */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[60%] w-[500px] h-[500px] bg-black opacity-10 blur-[150px] rounded-full z-0"></div>

      <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
        {/* Badge */}
<span className="text-xs px-3 py-1 rounded-full bg-[#1a1f30] text-[#FFD700] border border-[#FFD700] inline-block mb-4 font-medium tracking-wide">
  All-in-One Finance Toolkit
</span>


        {/* Heading */}
        <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6 text-white">
          Take control of your <br className="hidden md:block" />
          finances — with Saveora
        </h1>

        {/* Subtext */}
        <p className="text-gray-300 max-w-2xl mx-auto mb-8 text-sm md:text-base">
          All your money insights, finally in one place — track income,
          spending, and reach your goals with ease.
        </p>

        {/* CTA Button */}
        <div className="flex justify-center mt-8">
          <button className="bg-yellow-400 text-black font-semibold px-6 py-3 rounded-full shadow-md hover:bg-yellow-300 hover:shadow-[0_5px_30px_rgba(0,0,0,0.6)] transition duration-300 flex items-center gap-2">
            Get Started Now
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={3}
              stroke="currentColor"
              className="size-3"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Dashboard Image Section */}
      <div className="mt-20 flex justify-center relative z-10">
        <div className="w-full max-w-4xl rounded-3xl overflow-hidden border border-[#2c3e50] backdrop-blur-sm transition-transform duration-300 transform hover:scale-105 hover:shadow-[0_15px_50px_rgba(0,0,0,0.2)] shadow-[0_25px_60px_-10px_rgba(0,0,0,0)]">
          <Image
            src="/dashboard-preview.png"
            alt="Finance Dashboard Preview"
            width={1200}
            height={700}
            className="w-full h-auto object-cover"
          />
        </div>

        {/* Bottom Shadow (like it's floating) */}
        <div className="absolute bottom-[-40px] left-1/2 -translate-x-1/2 w-[300px] h-[60px] bg-black opacity-40 blur-2xl rounded-full z-0" />
      </div>
    </section>
  )
}
