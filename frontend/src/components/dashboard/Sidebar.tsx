// src/components/dashboard/Sidebar.tsx
import { Home, PieChart, Target, Calendar, List, LifeBuoy, Settings } from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="w-64 h-screen flex flex-col bg-[#101728] text-white">
      <div className="flex items-center gap-2 px-8 pt-8 pb-5">
        <span className="flex items-center justify-center w-10 h-10 bg-[#15203A] rounded-full">
          <span className="text-yellow-400 text-3xl font-bold">S</span>
        </span>
        <span className="text-2xl font-semibold text-white tracking-wide">Saveora</span>
      </div>
      <nav className="flex-1 flex flex-col gap-2 px-6">
        <SidebarItem icon={<Home size={20}/>} text="Home" active />
        <SidebarItem icon={<PieChart size={20}/>} text="Spent Analysis" />
        <SidebarItem icon={<Target size={20}/>} text="Budget Goals" />
        <SidebarItem icon={<Calendar size={20}/>} text="Payment Schedule" />
        <SidebarItem icon={<List size={20}/>} text="Transactions" />
      </nav>
      <div className="mt-auto flex flex-col gap-2 px-6 pb-6">
        <SidebarItem icon={<LifeBuoy size={20}/>} text="Support" />
        <SidebarItem icon={<Settings size={20}/>} text="Settings" />
      </div>
    </aside>
  );
}

function SidebarItem({ icon, text, active }: { icon: React.ReactNode, text: string, active?: boolean }) {
  return (
    <button 
      className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition
        ${active ? 'bg-yellow-400 text-[#101728] font-bold' : 'hover:bg-[#283655]'}
      `}
    >
      {icon}
      <span className="text-base">{text}</span>
    </button>
  );
}

