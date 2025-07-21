'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation'; // Import hooks

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const router = useRouter(); // Initialize router
  const pathname = usePathname(); // Get current path

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      setIsScrolled(scrollTop > 50);
      setIsVisible(true);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    // If we are on the homepage, scroll smoothly
    if (pathname === '/') {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // If we are on another page (like /auth), navigate to the homepage with the hash
      router.push(`/#${sectionId}`);
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-smooth
        ${isScrolled ? 'bg-[#06142e]/95 backdrop-blur-md shadow-none border-none' : 'bg-[#06142e]'}
        ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}
    >
      <div className="w-full px-6 py-3 flex items-center justify-between">
        {/* Left: Logo + Saveora */}
        <div className="flex items-center group animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <Link href="/" className="flex items-center">
            <img
              src="/logo.png"
              alt="Logo"
              className="h-12 w-12 rounded-xl object-cover transition-transform duration-300 group-hover:scale-110 group-hover:rotate-180"
            />
            <span className="ml-3 text-xl font-bold text-white group-hover:text-finance-gold transition-colors duration-300">
              Saveora
            </span>
          </Link>
        </div>

        {/* Center: Navigation Links */}
        <div className="hidden md:flex items-center space-x-8 text-white text-sm font-medium animate-fade-in transition-all duration-700 ease-smooth" style={{ animationDelay: '0.3s' }}>
          <button onClick={() => scrollToSection('how-it-works')} className="relative group py-2 hover:text-finance-gold transition-colors duration-300">
            How it works
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-finance-gold transition-all duration-300 group-hover:w-full"></span>
          </button>
          <button onClick={() => scrollToSection('features')} className="relative group py-2 hover:text-finance-gold transition-colors duration-300">
            Features
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-finance-gold transition-all duration-300 group-hover:w-full"></span>
          </button>
          <button onClick={() => scrollToSection('faqs')} className="relative group py-2 hover:text-finance-gold transition-colors duration-300">
            FAQs
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-finance-gold transition-all duration-300 group-hover:w-full"></span>
          </button>
          <button onClick={() => scrollToSection('contact')} className="relative group py-2 hover:text-finance-gold transition-colors duration-300">
            Contact us
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-finance-gold transition-all duration-300 group-hover:w-full"></span>
          </button>
        </div>

        {/* Right: Login + Signup */}
        <div className="flex items-center gap-x-3 animate-fade-in transition-all duration-700 ease-smooth" style={{ animationDelay: '0.5s' }}>
          <Link href="/auth?type=login">
            <button className="group bg-gradient-gold text-finance-black text-sm font-semibold px-5 py-2.5 rounded-full shadow-elegant hover:shadow-glow transition-all duration-300 hover:scale-105 flex items-center gap-2">
              <span>Login</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0110.5 3h6A2.25 2.25 0 0118.75 5.25v13.5A2.25 2.25 0 0116.5 21h-6A2.25 2.25 0 018.25 18.75V15M12 9l3 3m0 0l-3 3m3-3H2.25" />
              </svg>
            </button>
          </Link>
          <Link href="/auth?type=signup">
            <button className="group bg-transparent border-2 border-finance-gold text-finance-gold text-sm font-semibold px-5 py-2 rounded-full hover:bg-finance-gold hover:text-finance-black transition-all duration-300 hover:scale-105 flex items-center gap-2">
              <span>Signup</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 transition-transform duration-300 group-hover:scale-110"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0ZM3 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 019.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
              </svg>
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;