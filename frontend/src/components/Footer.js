// components/Footer.jsx
import Image from "next/image";

const Footer = () => {
  const quickMenu = ["How it works", "Features", "FAQ"];
  const infoMenu = ["Contact Us", "Privacy Policy", "Terms"];

  return (
    <footer className="bg-[#06142E] text-gray-300 px-6 py-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-12">
        {/* Logo and description */}
        <div className="max-w-md">
          <div className="flex items-center mb-4">
            <Image
              src="/logo.png" // Make sure to place your logo image in the public folder
              alt="Logo"
              width={40}
              height={40}
              className=""
            />
            <span className="ml-3 text-xl font-semibold text-white">Saveora</span>
          </div>
          <p className="text-sm leading-relaxed">
            Your all-in-one money management tool. <br />
            Track your income, set goals, and stay on top of your finances — effortlessly.
          </p>
        </div>

        {/* Menu columns */}
        <div className="flex flex-col sm:flex-row gap-12">
          <div>
            <h4 className="text-white font-semibold mb-3 text-lg">Quick Menu</h4>
            <ul className="space-y-2 text-sm">
              {quickMenu.map((item, index) => (
                <li
                  key={index}
                  className="cursor-pointer hover:text-gold hover:underline transition-all duration-200"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3 text-lg">Information</h4>
            <ul className="space-y-2 text-sm">
              {infoMenu.map((item, index) => (
                <li
                  key={index}
                  className="cursor-pointer hover:text-gold hover:underline transition-all duration-200"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom copyright */}
      <div className="mt-12 border-t border-gray-700 pt-6 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} Saveora. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
