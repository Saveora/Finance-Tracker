'use client'

import Image from 'next/image'

export default function HeroSection() {
  return (
    <section className="bg-[#04192d] text-white py-24 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
        {/* Badge */}
        <span className="text-xs px-3 py-1 rounded-full bg-[#1a1f30] text-lime-400 border border-lime-500 inline-block mb-4 font-medium">
          All-in-One Finance Toolkit
        </span>

        {/* Heading */}
        <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
          Take control of your <br className="hidden md:block" />
          finances — with clarity
        </h1>

        {/* Subtext */}
        <p className="text-gray-300 max-w-2xl mx-auto mb-8 text-sm md:text-base">
          All your money insights, finally in one place — track income,
          spending, and reach your goals with ease.
        </p>

        {/* Call-to-action button */}
        <button className="bg-yellow-400 text-black font-semibold px-6 py-3 rounded-full shadow-lg hover:bg-yellow-300 transition duration-200">
          Get Started Now →
        </button>
      </div>

      {/* Mocked Dashboard Image */}
      <div className="mt-20 flex justify-center relative z-0">
        <div className="w-full max-w-4xl rounded-t-3xl overflow-hidden shadow-xl border border-gray-800">
          <Image
            src="/dashboard-preview.png" // 🔁 Replace with your real image path
            alt="Finance Dashboard Preview"
            width={1200}
            height={700}
            className="w-full object-cover"
          />
        </div>
      </div>

      {/* Optional glowing background effect behind button */}
      <div className="absolute top-[265px] left-1/2 -translate-x-1/2 w-72 h-72 bg-yellow-400 opacity-20 blur-3xl rounded-full z-0" />
    </section>
  )
}
