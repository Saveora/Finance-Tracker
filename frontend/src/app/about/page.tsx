'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-[#030917] text-white py-28 px-4 md:px-20">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-10">
          <span className="text-white">About </span>
          <span className="text-finance-gold">Us</span>
        </h1>

        <p className="text-lg leading-relaxed mb-8 text-gray-300 text-center">
          At <span className="text-finance-gold font-semibold">Saveora</span>, we are on a mission to empower individuals to take control of their financial future. 
          We believe that smart savings start with smart tracking.
        </p>

        <div className="grid md:grid-cols-2 gap-10">
          <div>
            <h2 className="text-2xl font-semibold text-finance-gold mb-4">Our Vision</h2>
            <p className="text-gray-300 leading-relaxed">
              To revolutionize the way people manage and grow their savings by making financial tools accessible, intuitive, and powerful.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-finance-gold mb-4">Our Mission</h2>
            <p className="text-gray-300 leading-relaxed">
              Provide user-friendly budgeting tools, real-time analysis, and actionable insights to help individuals save smarter and achieve their financial goals faster.
            </p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <h3 className="text-xl font-semibold text-finance-gold mb-2">Meet the Team</h3>
          <p className="text-gray-400">
            We're a team of passionate developers, designers, and finance geeks building tools we wished existed.
          </p>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
};

export default AboutPage;
