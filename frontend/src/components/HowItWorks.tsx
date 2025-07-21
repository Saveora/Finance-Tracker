"use client";
import React, { useEffect, useRef, useState } from 'react';

const steps = [
  {
    step: 'Step 1',
    title: 'Connect your accounts',
    desc: 'Sync all your bank accounts, credit cards — securely and instantly.',
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M2 6h20v2H2zm0 5h20v2H2zm0 5h20v2H2z" />
      </svg>
    ),
  },
  {
    step: 'Step 2',
    title: 'Track your money',
    desc: 'See where your money goes with real-time spending insights and clear breakdowns.',
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6h-6z" />
      </svg>
    ),
  },
  {
    step: 'Step 3',
    title: 'Set goals & stay on track',
    desc: 'Plan your savings, set monthly budgets, and let Saveora keep you in control.',
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M9 11H7v9a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V9h-2m-1-6H8l-1 1v4a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4l-1-1z" />
      </svg>
    ),
  },
];

export default function HowItWorks() {
  const [visibleSteps, setVisibleSteps] = useState<boolean[]>([false, false, false]);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observers = stepRefs.current.map((ref, index) => {
      if (!ref) return null;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              setVisibleSteps(prev => {
                const newState = [...prev];
                newState[index] = true;
                return newState;
              });
            }, index * 200); // Stagger the animations
          }
        },
        { threshold: 0.3 }
      );

      observer.observe(ref);
      return observer;
    });

    return () => {
      observers.forEach(observer => observer?.disconnect());
    };
  }, []);

  return (
    <section id="how-it-works" className="bg-[#030917] py-24 text-white relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-finance-gold opacity-5 blur-3xl rounded-full animate-glow-pulse"></div>
        <div className="absolute bottom-[10%] right-[10%] w-32 h-32 bg-finance-gold opacity-10 blur-2xl rounded-full animate-float"></div>
      </div>

      <div className="relative max-w-6xl mx-auto px-6 text-center z-10">
        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            How <span className="bg-gradient-to-r from-finance-gold to-finance-gold-light bg-clip-text text-transparent">Saveora</span> works
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Get started in three simple steps and transform your financial life
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((item, idx) => (
            <div
              key={idx}
              ref={el => { stepRefs.current[idx] = el; }}
              className={`relative group transition-all duration-700 ease-out ${visibleSteps[idx]
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-10'
                }`}
              style={{ transitionDelay: `${idx * 100}ms` }}
            >
              {/* Connection line (not on last item) */}
              {idx < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-finance-gold/50 to-transparent z-0 group-hover:from-finance-gold transition-colors duration-300"></div>
              )}

              <div className="relative bg-finance-black rounded-3xl p-8 border border-finance-navy/30 transition-all duration-300 hover:border-finance-gold/50 hover:scale-105 hover:shadow-glow z-10">
                {/* Step number indicator */}
                <div className="absolute -top-4 left-8">
                  <span className="bg-gradient-gold text-finance-black text-sm font-bold px-3 py-1 rounded-full shadow-lg">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                </div>

                {/* Icon */}
                <div className="w-16 h-16 bg-[#06142e] rounded-2xl flex items-center justify-center mx-auto mb-6 text-finance-gold group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>


                {/* Step label */}
                <p className="text-finance-gold font-semibold mb-3 tracking-wide text-sm">
                  • {item.step}
                </p>

                {/* Title */}
                <h3 className="text-xl font-bold mb-4 text-white group-hover:text-finance-gold transition-colors duration-300">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-gray-400 leading-relaxed">
                  {item.desc}
                </p>

                {/* Hover glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-finance-gold/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to action */}
        <div className="mt-16">
          <button className="group bg-transparent border-2 border-finance-gold text-finance-gold font-semibold px-8 py-3 rounded-full hover:bg-finance-gold hover:text-finance-black transition-all duration-300 hover:scale-105 flex items-center gap-2 mx-auto">
            <span>Start Your Journey</span>
            <svg
              className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}