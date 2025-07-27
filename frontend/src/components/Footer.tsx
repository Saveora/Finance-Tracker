import React from "react";
import Link from "next/link";
import Image from "next/image";


const Footer = () => {
  const quickMenu = ["How it works", "Features", "FAQ"];
  const infoMenu = ["Contact Us", "Privacy Policy", "Terms"];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId.toLowerCase().replace(/\s+/g, '-'));
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer id="footer" className="bg-[#06142e] text-gray-300 px-6 py-16 relative overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between gap-12 mb-12">
          <div className="max-w-md">
            <div className="flex items-center mb-6 group">
              <Image
                src="/logo.png"
                alt="Logo"
                width={40}
                height={40}
                className="rounded-xl object-cover transition-transform duration-300 group-hover:scale-110 group-hover:rotate-180"
              />
              <span className="ml-3 text-2xl font-bold text-white group-hover:text-finance-gold transition-colors duration-300">
                Saveora
              </span>
            </div>
            <p className="text-gray-400 leading-relaxed text-lg mb-6">
              Your all-in-one money management tool.
              <br />
              Track your income, set goals, and stay on top of your finances — effortlessly.
            </p>
            <div className="flex gap-4">
              {["x", "facebook", "instagram"].map((social) => (
                <a
                  key={social}
                  href={`#${social}`}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ease-in-out delay-75 transform hover:scale-110 hover:text-white ${
                    social === 'x'
                      ? 'hover:bg-black'
                      : social === 'facebook'
                      ? 'hover:bg-blue-600'
                      : 'hover:bg-gradient-to-tr hover:from-fuchsia-500 hover:via-rose-500 hover:to-amber-400'
                  } bg-finance-navy/50`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d={
                      social === 'x'
                        ? "M22.5 2h-3.57L12 9.74 5.07 2H1.5l7.92 9.36L1 22h3.57l7.93-8.88L18.93 22H22.5l-8.34-9.88L22.5 2z"
                        : social === 'facebook'
                        ? "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                        : "M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5a4.25 4.25 0 0 0 4.25-4.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 1.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zm5.25-.88a.88.88 0 1 1 0 1.75.88.88 0 0 1 0-1.75z"
                    } />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-12 md:gap-20">
            <div className="md:w-80">
              <h4 className="text-white font-bold mb-6 text-lg">Stay Updated</h4>
              <p className="text-gray-400 mb-4 text-sm">
                Get the latest financial tips and product updates delivered to your inbox.
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 bg-finance-navy/50 border border-finance-navy rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-finance-gold transition-colors duration-300"
                />
                <button className="bg-gradient-gold text-finance-black font-semibold px-4 py-2 rounded-lg hover:scale-105 transition-transform duration-300">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-finance-navy/50 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-500">
              © {new Date().getFullYear()} Saveora. All rights reserved.
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <Link href="/privacy" className="hover:text-finance-gold transition-colors duration-200">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-finance-gold transition-colors duration-200">
                Terms & conditions
              </Link>
              <Link href="/about" className="hover:text-finance-gold transition-colors duration-200">
                About Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
