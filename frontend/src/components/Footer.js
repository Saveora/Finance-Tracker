// components/Footer.jsx
const Footer = () => {
  const quickMenu = ["How it works", "Features", "FAQ"];
  const infoMenu = ["ContactUs", "Privacy Policy", "Terms",];

  return (
    <footer className="bg-[#06142E] text-gray-300 px-6 py-12 flex flex-col md:flex-row justify-between">
      {/* Logo and description */}
      <div className="max-w-md mb-10 md:mb-0">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 rounded-full border-2 border-gold text-gold flex items-center justify-center text-lg font-bold">
            S
          </div>
        </div>
        <p className="text-sm leading-relaxed">
          Your all-in-one money management tool.<br />
          Track your income, set goals, and stay on top of your finances — effortlessly.
        </p>
      </div>

      {/* Menu columns */}
      <div className="flex gap-16">
        <div>
          <h4 className="text-white font-semibold mb-3">Quick Menu</h4>
          <ul className="space-y-2">
            {quickMenu.map((item, index) => (
              <li
                key={index}
                className="cursor-pointer hover:text-gold transition-colors"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Information</h4>
          <ul className="space-y-2">
            {infoMenu.map((item, index) => (
              <li
                key={index}
                className="cursor-pointer hover:text-gold transition-colors"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
