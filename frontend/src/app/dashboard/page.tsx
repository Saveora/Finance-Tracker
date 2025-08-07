// src/app/dashboard/page.tsx

import OverviewCards from '@/components/dashboard/OverviewCards';
import SpentChart from '@/components/dashboard/SpentChart';
import PaymentSchedule from '@/components/dashboard/PaymentSchedule';
import VirtualCard from '@/components/dashboard/VirtualCard';
import BudgetGoals from '@/components/dashboard/BudgetGoals';
import RecentTransactions from '@/components/dashboard/RecentTransactions';
import Header from '@/components/dashboard/Header';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#F8f9fb] flex">
      <main className="flex-1 flex flex-col px-2 pt-0 pb-0">
        <Header />

        {/* Top Row: OverviewCards (left), VirtualCard (right) */}
        <div className="w-full flex flex-col xl:flex-row gap-6">
          {/* OverviewCards takes flexible width */}
          <div className="flex-1">
            <OverviewCards />
          </div>

          {/* VirtualCard fixed width, aligned top, with optional top margin on small screens */}
          <div className="w-[360px] mt-6 xl:mt-0">
            <VirtualCard />
          </div>
        </div>

        {/* Main Dashboard Grids under the first row */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">
          <div className="xl:col-span-2 flex flex-col gap-6">
            <SpentChart />
            <RecentTransactions />
          </div>
          <div className="flex flex-col gap-6">
            <PaymentSchedule />
            <BudgetGoals />
          </div>
        </div>
      </main>
    </div>
  );
}
