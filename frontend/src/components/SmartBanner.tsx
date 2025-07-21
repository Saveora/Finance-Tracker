import React, { useRef, useEffect, useState } from "react";

const SmartBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const bannerRef = useRef<HTMLDivElement>(null);

  const handleGetStarted = () => {
    // Navigate to get started page or show modal
    console.log("Redirecting to setup wizard...");
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (bannerRef.current) {
      observer.observe(bannerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
     <section className="relative bg-[#030917] text-white pt-32 pb-24 overflow-hidden">
    <div 
      ref={bannerRef}
      className="relative max-w-6xl mx-auto my-24 px-6"
    >
      <div 
        className={`relative bg-finance-black rounded-3xl p-12 md:p-16 text-white border border-finance-navy/30 overflow-hidden transition-all duration-1000 ease-out ${
          isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95'
        }`}
      >
        {/* Background elements */}
        

        {/* Content */}
        <div className="relative z-10 text-center">
          <div className="mb-8">
            <h1 
              className={`text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6 transition-all duration-700 ease-out ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
              }`}
              style={{ transitionDelay: '0.2s' }}
            >
              Ready to manage your money{' '}
              <span className="bg-gradient-to-r from-finance-gold to-finance-gold-light bg-clip-text text-transparent">
                smarter?
              </span>
            </h1>
            
            <p 
              className={`text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed transition-all duration-700 ease-out ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
              }`}
              style={{ transitionDelay: '0.4s' }}
            >
              Start your journey to smarter spending and better saving — it only
              takes 2 minutes.
            </p>
          </div>

         <div 
  className={`transition-all duration-700 ease-out ${
    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
  }`}
  style={{ transitionDelay: '0.6s' }}
>
  <button 
    className="group relative bg-gradient-gold text-finance-black font-semibold px-6 py-3 rounded-full shadow-elegant hover:shadow-glow transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2 mx-auto overflow-hidden"
    onClick={handleGetStarted}
  >
    {/* Background animation */}
    <span className="absolute inset-0 bg-gradient-to-r from-finance-gold-light to-finance-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
    
    <span className="relative z-10 text-sm md:text-base">Get Started</span>
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24" 
      strokeWidth={2} 
      stroke="currentColor" 
      className="relative z-10 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
    </svg>
  </button>
</div>


          {/* Trust indicators */}
          <div 
            className={`mt-12 flex flex-wrap justify-center items-center gap-8 text-gray-500 text-sm transition-all duration-700 ease-out ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
            }`}
            style={{ transitionDelay: '0.8s' }}
          >
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-finance-gold" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L13.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L10.91 8.26L12 2Z"/>
              </svg>
              <span>Bank-level security</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-finance-gold" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              <span>Trusted by 50,000+ users</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-finance-gold" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              <span>2-minute setup</span>
            </div>
          </div>
        </div>

        {/* Decorative border glow */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-finance-gold/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ padding: '1px' }}>
          <div className="w-full h-full bg-finance-black rounded-3xl"></div>
        </div>
      </div>
    </div>
  
  </section>
  );
};

export default SmartBanner;