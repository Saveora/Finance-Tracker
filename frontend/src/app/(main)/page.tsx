'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation'; // Keep next/navigation hooks
import HowItWorks from "../../components/HowItWorks";
import HeroSection from "../../components/HeroSection";
import FeaturesSection from "@/components/Features";
import FaqAccordion from "@/components/FaqAccordion";
import SmartBanner from "../../components/SmartBanner";

export default function Home() {
  const hash: string | null = typeof window !== 'undefined' ? window.location.hash : null;

  useEffect(() => {
  const scrollToHash = () => {
    const hash = window.location.hash;
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  };

  scrollToHash(); // scroll on first load
  window.addEventListener('hashchange', scrollToHash); // scroll on hash change

  return () => {
    window.removeEventListener('hashchange', scrollToHash);
  };
}, []);


  return (
    
      <div className="min-h-screen bg-[#030917] text-white">
      <HeroSection />
      <section id="how-it-works"><HowItWorks /></section>
      <section id="features"><FeaturesSection /></section>
      <section id="faqs"><FaqAccordion /></section>
      <section id="smartbanner"><SmartBanner /></section>
      </div>
  
  );
}
