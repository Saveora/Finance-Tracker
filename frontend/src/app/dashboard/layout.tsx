
// src/app/dashboard/layout.tsx
import type { ReactNode } from "react";
import Sidebar from "@/components/dashboard/Sidebar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="w-full min-h-screen flex">
      {/* Sidebar stays fixed with dark navy background */}
      <Sidebar />
      {/* Main has a distinct surface in both themes */}
      <main className="flex-1 ml-[240px] px-8 py-3 min-h-screen bg-[#F8F9FB] dark:bg-[#000000]">
        {children}
      </main>
    </div>

  );
}
