"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Home,
  Calendar,
  Goal,
  Settings,
} from "lucide-react";

const navItems = [
  {
    label: "Home",
    href: "/dashboard",
    icon: <Home size={26} strokeWidth={2.2} />,
  },
  {
    label: "My Bank",
    href: "/dashboard/my-bank",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="1.5 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="size-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z"
        />
      </svg>
    ), // Replace icon as needed
  },
  {
    label: "Connect Bank",
    href: "/dashboard/connect-bank",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="1 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="size-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z"
        />
      </svg>
    ), // Replace icon as needed
  },
  {
    label: "Transactions",
    href: "/dashboard/transactions",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="1.5 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="size-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
        />
      </svg>
    ),
  },
  {
    label: "Transfer Funds",
    href: "/dashboard/payment-transfer",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="1.5 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="size-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 8.25H9m6 3H9m3 6-3-3h1.5a3 3 0 1 0 0-6M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
        />
      </svg>
    ), // Replace icon as needed
  },
  {
    label: "Payment Schedule",
    href: "/dashboard/payment-schedule",
    icon: <Calendar size={26} strokeWidth={2.2} />,
  },
  {
    label: "Budget Goals",
    href: "/dashboard/budget-goals",
    icon: <Goal size={26} strokeWidth={2.2} />,
  },
];

const bottomNav = [
  {
    label: "Support",
    href: "/dashboard/support",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="1.5 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="size-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
        />
      </svg>
    ),
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: <Settings size={26} strokeWidth={2.2} />,
  },
];

// Removed hover effect: removed hover: classes from linkClasses
const linkClasses = (isActive: boolean) =>
  `group flex items-center gap-2 px-3 py-2 rounded-lg 
    transition-colors duration-150 cursor-pointer
    ${
      isActive
        ? "bg-yellow-400 text-[#101728] font-semibold shadow"
        : "text-white"
    }
  `;

export default function Sidebar() {
  const path = usePathname();

  return (
    <aside className="w-[240px] min-w-[240px] h-screen bg-[#101728] flex flex-col justify-between fixed left-0 top-0 z-20">
      <div>
        <div className="flex items-center gap-2 px-3 pt-4 pb-8">
          <div className="w-10 h-10 bg-[#15203A] rounded-full flex items-center justify-center">
            <span className="text-yellow-400 text-2xl font-bold">S</span>
          </div>
          <span className="text-xl font-semibold text-white tracking-wide">
            Saveora
          </span>
        </div>
        <nav className="flex flex-col gap-1 px-2 select-none">
          {navItems.map(({ label, href, icon }) => {
            const isActive =
              (href === "/dashboard" && path === "/dashboard") ||
              (href !== "/dashboard" && path.startsWith(href));
            return (
              <Link href={href} key={label} className={linkClasses(isActive)}>
                {icon}
                <span className="text-base">{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="flex flex-col gap-0 px-4 pb-6 select-none">
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
