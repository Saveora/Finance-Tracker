"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";

const Navbar = () => {
  return (
    <nav className="relative w-full px-6 py-3 bg-[#06142E] flex items-center justify-between">
      {/* Left: Logo */}
      <Link href="/" className="flex items-center z-10">
        <Image
          src="/logo.png"
          alt="Logo"
          width={45}
          height={45}
          className="cursor-pointer"
        />
      </Link>

      {/* Center: Navigation Links */}
      <div className="absolute left-1/2 transform -translate-x-1/2 flex space-x-6 text-white text-sm font-medium">
        <Link href="#how-it-works" className="hover:text-yellow-300 transition">How it works</Link>
        <Link href="#features" className="hover:text-yellow-300 transition">Features</Link>
        <Link href="#faqs" className="hover:text-yellow-300 transition">FAQs</Link>
        <Link href="#contact" className="hover:text-yellow-300 transition">Contact us</Link>
      </div>

      {/* Right: Login & Signup */}
      <div className="flex items-center gap-x-3 z-10">
        {/* Login */}
        <Link href="#login">
          <button className="bg-yellow-400 text-black text-sm font-medium px-4 py-1.5 rounded-full shadow-md hover:brightness-110 transition flex items-center gap-1.5">
            Login
            <svg xmlns="http://www.w3.org/2000/svg" className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0110.5 3h6A2.25 2.25 0 0118.75 5.25v13.5A2.25 2.25 0 0116.5 21h-6A2.25 2.25 0 018.25 18.75V15M12 9l3 3m0 0l-3 3m3-3H2.25" />
            </svg>
          </button>
        </Link>

        {/* Signup */}
        <Link href="#signup">
          <button className="bg-yellow-400 text-black text-sm font-medium px-4 py-1.5 rounded-full shadow-md hover:brightness-110 transition flex items-center gap-1.5">
            Signup
            <svg xmlns="http://www.w3.org/2000/svg" className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0ZM3 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 019.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
            </svg>
          </button>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
