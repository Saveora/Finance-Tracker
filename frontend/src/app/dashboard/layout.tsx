// src/app/dashboard/layout.tsx
// src/app/dashboard/layout.tsx
import Sidebar from "@/components/dashboard/Sidebar";
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F8f9fb] flex">
      <Sidebar />
      <main className="flex-1 flex flex-col px-8 py-6">
        {children}
      </main>
    </div>
  );
}

