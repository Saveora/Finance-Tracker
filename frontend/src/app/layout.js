// src/app/layout.js

import './globals.css' // Tailwind CSS must be imported here
import Navbar from '../components/navbar' // Optional if Navbar is global

export const metadata = {
  title: 'Finance Tracker',
  description: 'Track your income, expenses, and financial goals with ease.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#0C1A2A] text-white font-sans">
        {/* Global Navbar (optional) */}
        <Navbar />

        {/* Page Content */}
        <main>{children}</main>
      </body>
    </html>
  )
}
