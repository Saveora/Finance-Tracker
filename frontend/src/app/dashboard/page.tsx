// src/app/dashboard/page.tsx
import OverviewCards from '@/components/dashboard/OverviewCards';
import SpentChart from '@/components/dashboard/SpentChart';
import PaymentSchedule from '@/components/dashboard/PaymentSchedule';
import VirtualCard from '@/components/dashboard/VirtualCard';
import BudgetGoals from '@/components/dashboard/BudgetGoals';
import RecentTransactions from '@/components/dashboard/RecentTransactions';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#F8f9fb] flex">
      {/* Main */}
      <main className="flex-1 flex flex-col px-8 py-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex items-center gap-4">
            <button className="p-2 bg-white rounded-full shadow border">
              <i className="bx bx-search text-xl"></i>
            </button>
            <button className="p-2 bg-white rounded-full shadow border">
              <i className="bx bx-bell text-xl"></i>
            </button>
            <div className="flex items-center gap-2 bg-[#f7f7f8] py-1.5 px-4 rounded-full">
              <span className="text-sm font-medium">Diptesh</span>
              <span className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center border">
                {/* Use a placeholder or user's avatar */}
                <i className="bx bx-user text-2xl text-gray-400"></i>
              </span>
              <i className="bx bx-chevron-down text-xl text-gray-500"></i>
            </div>
          </div>
        </div>

        {/* Welcome Bar / Cards */}
        <OverviewCards />

        {/* Dashboard Grids */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">
          <div className="xl:col-span-2 flex flex-col gap-6">
            {/* Spent Analysis Chart */}
            <SpentChart />
            {/* Recent Transactions */}
            <RecentTransactions />
          </div>
          <div className="flex flex-col gap-6">
            <PaymentSchedule />
            <VirtualCard />
            <BudgetGoals />
          </div>
        </div>
      </main>
    </div>
  );
}


