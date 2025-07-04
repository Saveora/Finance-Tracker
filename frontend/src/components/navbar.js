"use client";
import React from "react";
import Link from "next/link";
import HowItWorks from "./Howitworks";

const Navbar = () => {
  return (
    <nav className="w-full px-6 py-4 bg-[#06142E] flex items-center justify-between">
      {/* Logo */}
      <div className="flex items-center">
        <div className="text-[#FFD700]-400 text-2xl font-bold border-2 border-gold rounded-full w-10 h-10 flex items-center justify-center">
          S
        </div>
      </div>

      {/* Navigation Links */}
      <div className="hidden md:flex space-x-8 text-white text-sm font-medium">
        <Link href="#how-it-works" className="hover:text-gold transition">
          How it works
        </Link>
        <Link href="#features" className="hover:text-gold transition">
          Features
        </Link>
        <Link href="#testimonials" className="hover:text-gold transition">
          Testimonials
        </Link>
        <Link href="#pricing" className="hover:text-gold transition">
          Pricing
        </Link>
      </div>

      {/* Contact Us Button */}
      <Link href="#contact">
        <button className="bg-gold text-black text-sm font-medium px-5 py-2 rounded-full shadow-lg hover:brightness-110 transition-all flex items-center gap-2">
          Contact us
          <span className="text-lg">↗</span>
        </button>
      </Link>
    </nav>
  );
};

export default Navbar;
