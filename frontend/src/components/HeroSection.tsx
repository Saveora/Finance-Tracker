import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ContainerScroll } from "@/components/ui/container-scroll-animation"; // Make sure path is correct

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative bg-[#030917] text-white pt-36 pb-24 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[60%] w-[600px] h-[600px] bg-finance-gold opacity-5 blur-[150px] rounded-full animate-glow-pulse"></div>
      </div>

      <div className="relative max-w-6xl mx-auto px-6 text-center z-10">
        <div 
          className={`inline-block mb-8 transition-all duration-1000 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
          style={{ transitionDelay: '0.2s' }}
        >
          <span className="px-5 py-1.5 rounded-full text-finance-gold text-sm font-semibold border border-finance-gold bg-[#030917] transition-all duration-300">
            All-in-One Finance Toolkit
          </span>
        </div>

        <h1 
          className={`text-5xl md:text-6xl lg:text-6xl font-bold leading-tight mb-10 transition-all duration-1000 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
          style={{ transitionDelay: '0.4s' }}
        >
          <span className="block text-white">Take control of your</span>
          <span className="block bg-gradient-to-r from-finance-gold to-finance-gold-light bg-clip-text text-transparent">
            finances - with Saveora
          </span>
        </h1>

        <p 
          className={`text-gray-300 max-w-2xl mx-auto mb-12 text-xs md:text-base leading-relaxed transition-all duration-1000 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
          style={{ transitionDelay: '0.6s' }}
        >
          All your money insights, finally in one place — track income,
          spending, and reach your goals with ease.
        </p>

        <div 
          className={`flex justify-center transition-all duration-1000 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
          style={{ transitionDelay: '0.8s' }}
        >
          <Link href="/get-started">
            <button className="group relative bg-gradient-gold text-finance-black font-bold px-6 py-3 rounded-full shadow-elegant hover:shadow-glow transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2 overflow-hidden">
              <span className="absolute inset-0 bg-gradient-to-r from-finance-gold-light to-finance-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span className="relative z-10 text-sm md:text-base">Get Started Now</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="relative z-10 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25"
                />
              </svg>
            </button>
          </Link>
        </div>
      </div>

      {/* Scroll Animation */}
      <div className="mt-40 relative z-30">
        <ContainerScroll
          titleComponent={
          <h2 className="text-6xl font-bold text-center">
            <span className="text-white">Smart Tracking, </span>
            <span className="text-finance-gold">Smarter Savings</span>
            </h2>
            }

        >
          <img
            src="/dashboard-preview.png"
            alt="Saveora Dashboard Preview"
            className="w-full h-full object-contain"
          />
        </ContainerScroll>
      </div>
    </section>
  );
}
