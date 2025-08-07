// src/app/dashboard/layout.tsx
import type { ReactNode } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-[#F8f9fb] min-h-screen flex">
      <Sidebar />
      <main className="flex-1 ml-[240px] px-8 py-3">{children}</main>
    </div>
  );
}


