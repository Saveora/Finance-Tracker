// File: src/app/layout.js

import "./globals.css"; // Tailwind CSS styles

export const metadata = {
  title: "Finance Tracker",
  description: "Track your spending, income, goals — all in one place.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#0C1A2A] text-white">
        {children}
      </body>
    </html>
  );
}
