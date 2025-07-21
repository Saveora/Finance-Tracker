import React, { useEffect, useRef, useState } from 'react';

const features = [
  {
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
      </svg>
    ),
    title: 'Multi-account sync',
    description: 'Connect and track all your bank accounts in one place.',
    color: 'from-blue-500 to-blue-600',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    ),
    title: 'Goal tracking',
    description: 'Visualize progress toward savings goals in real-time.',
    color: 'from-purple-500 to-purple-600',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M15 1H9v2h6V1zm-4 13h2V8h-2v6zm8.03-6.61l1.42-1.42c-.43-.51-.9-.99-1.41-1.41l-1.42 1.42C16.07 4.74 14.12 4 12 4c-4.97 0-9 4.03-9 9s4.02 9 9 9 9-4.03 9-9c0-2.12-.74-4.07-1.97-5.61zM12 20c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/>
      </svg>
    ),
    title: 'Spending limits',
    description: 'Set monthly caps and get notified when you\'re close.',
    color: 'from-orange-500 to-orange-600',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
      </svg>
    ),
    title: 'Secure & private',
    description: 'Your data is encrypted and never shared — ever.',
    color: 'from-green-500 to-green-600',
  },
];

export default function FeaturesSection() {
  const [visibleFeatures, setVisibleFeatures] = useState<boolean[]>([false, false, false, false]);
  const featureRefs = useRef<(HTMLDivElement | null)[]>([]);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observers = featureRefs.current.map((ref, index) => {
      if (!ref) return null;
      
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              setVisibleFeatures(prev => {
                const newState = [...prev];
                newState[index] = true;
                return newState;
              });
            }, index * 150);
          }
        },
        { threshold: 0.2 }
      );
      
      observer.observe(ref);
      return observer;
    });

    return () => {
      observers.forEach(observer => observer?.disconnect());
    };
  }, []);

  return (
    <section 
      id="features" 
      ref={sectionRef}
      className="bg-[#030917] text-white py-24 px-4 sm:px-8 lg:px-20 relative overflow-hidden"
    >
      {/* Background elements */}
      {/* <div className="absolute inset-0">
        <div className="absolute top-1/4 right-0 w-72 h-72 bg-finance-gold opacity-5 blur-3xl rounded-full animate-float"></div>
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-finance-gold opacity-3 blur-3xl rounded-full animate-glow-pulse"></div>
      </div> */}

      <div className="relative z-10">
        <div className="text-center mb-16">
          <div className="mb-4">
            <span className="text-finance-gold font-semibold text-sm tracking-wide uppercase">
              • Features
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold mt-4 leading-tight mb-6">
            Designed for clarity, built for
            <br />
            <span className="bg-gradient-to-r from-finance-gold to-finance-gold-light bg-clip-text text-transparent">
              better money decisions
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Everything you need to take control of your finances in one powerful platform
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              ref={el => {featureRefs.current[index] = el;}}
              className={`group transition-all duration-700 ease-out ${
                visibleFeatures[index] 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="relative bg-finance-black rounded-3xl p-8 flex items-start gap-6 border border-finance-navy/30 transition-all duration-300 hover:border-finance-gold/50 hover:scale-105 hover:shadow-glow overflow-hidden">
                {/* Background gradient on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-finance-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Icon container */}
                <div className="relative flex-shrink-0">
                  <div className="w-16 h-16 bg-[#06142e] rounded-2xl flex items-center justify-center text-finance-gold group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    {feature.icon}
                  </div>
                </div>
                
                {/* Content */}
                <div className="relative flex-1">
                  <h3 className="font-bold text-xl mb-3 text-white group-hover:text-finance-gold transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                    {feature.description}
                  </p>
                </div>

                {/* Decorative corner accent */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-finance-gold/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to action */}
        <div className="text-center mt-16">
          <a
            href="#"
            className="group inline-flex items-center gap-3 text-finance-gold font-semibold text-lg hover:text-finance-gold-light transition-colors duration-300"
          >
            <span>Get Started</span>
            <div className="w-8 h-8 bg-[#06142e] rounded-full flex items-center justify-center group-hover:bg-[#06142e] transition-all duration-300 group-hover:scale-110">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                strokeWidth={2} 
                stroke="currentColor" 
                className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
              </svg>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}