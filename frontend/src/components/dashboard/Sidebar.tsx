// src/components/dashboard/Sidebar.tsx
'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Home, PieChart, Target, Calendar, List, LifeBuoy, Settings
} from 'lucide-react';

const navItems = [
  {
    label: 'Home',
    href: '/dashboard',
    icon: <Home size={18} strokeWidth={2.2} />,
  },
  {
    label: 'Spent Analysis',
    href: '/dashboard/spent-analysis',
    icon: <PieChart size={18} strokeWidth={2.2} />,
  },
  {
    label: 'Budget Goals',
    href: '/dashboard/budget-goals',
    icon: <Target size={18} strokeWidth={2.2} />,
  },
  {
    label: 'Payment Schedule',
    href: '/dashboard/payment-schedule',
    icon: <Calendar size={18} strokeWidth={2.2} />,
  },
  {
    label: 'Transactions',
    href: '/dashboard/transactions',
    icon: <List size={18} strokeWidth={2.2} />,
  },
];

const bottomNav = [
  {
    label: 'Support',
    href: '/dashboard/support',
    icon: <LifeBuoy size={18} strokeWidth={2.2} />,
  },
  {
    label: 'Settings',
    href: '/dashboard/settings',
    icon: <Settings size={18} strokeWidth={2.2} />,
  },
];

export default function Sidebar() {
  const path = usePathname();

  const linkClasses = (isActive: boolean) =>
    `group flex items-center gap-2 px-3 py-2 rounded-lg 
     transition-colors duration-150 cursor-pointer
     ${isActive
        ? 'bg-yellow-400 text-[#101728] font-semibold shadow'
        : 'text-white hover:bg-yellow-400/80 hover:text-[#101728]'
      }`;

  return (
    <aside className="w-[240px] min-w-[240px] h-screen bg-[#101728] flex flex-col justify-between fixed left-0 top-0 z-20">
      <div>
        <div className="flex items-center gap-2 px-3 pt-4 pb-8">
          <div className="w-10 h-10 bg-[#15203A] rounded-full flex items-center justify-center">
            <span className="text-yellow-400 text-2xl font-bold">S</span>
          </div>
          <span className="text-xl font-semibold text-white tracking-wide">Saveora</span>
        </div>
        <nav className="flex flex-col gap-1 px-2 select-none">
          {navItems.map(({ label, href, icon }) => {
            // Home: has exact match, others: startsWith for sub-routes
            const isActive = 
              (href === '/dashboard' && path === '/dashboard') ||
              (href !== '/dashboard' && path.startsWith(href));
            return (
              <Link href={href} key={label} className={linkClasses(isActive)}>
                {icon}
                <span className="text-base">{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="flex flex-col gap-0 px-4 pb-6">
        {bottomNav.map(({ label, href, icon }) => {
          const isActive = path.startsWith(href);
          return (
            <Link href={href} key={label} className={linkClasses(isActive)}>
              {icon}
              <span className="text-base">{label}</span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}


