// src/app/dashboard/page.tsx
'use client';

import useUser from '@/hooks/useUser';
import StatCard from '@/components/dashboard/StatCard';
import VirtualCard from '@/components/dashboard/VirtualCard';
import SpentChart from '@/components/dashboard/SpentChart';
import PaymentSchedule from '@/components/dashboard/PaymentSchedule';
import BudgetGoals from '@/components/dashboard/BudgetGoals';
import RecentTransactions from '@/components/dashboard/RecentTransactions';
import Header from '@/components/dashboard/Header';
import { IndianRupee, Wallet } from 'lucide-react';

export default function DashboardPage() {
  const { user, loading } = useUser();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8f9fb] flex items-center justify-center">
        Loading...
      </div>
    );
  }

  // Middleware already blocks unauthenticated users.
  // If we still have no user here, just render nothing or fallback UI.
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F8f9fb]">
      <main className="flex-1 flex flex-col">
        <Header />

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6 items-start">
          
          {/* == LEFT COLUMN (2/3 width) == */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard
                title="Deposits"
                amount="₹3,00,000.00"
                icon={<IndianRupee size={28} />}
                iconBgColor="bg-sky-100"
                iconTextColor="text-sky-600"
                borderColor="border-t-sky-500"
              />
              <StatCard
                title="Spent"
                amount="₹35,102.00"
                icon={<IndianRupee size={28} />}
                iconBgColor="bg-orange-100"
                iconTextColor="text-orange-600"
                borderColor="border-t-orange-500"
              />
              <StatCard
                title="Total Current Balance"
                amount="₹2,64,898.00"
                icon={<Wallet size={28} />}
                iconBgColor="bg-green-100"
                iconTextColor="text-green-600"
                borderColor="border-t-green-500"
              />
            </div>
            <SpentChart />
            <RecentTransactions />
          </div>

          {/* == RIGHT COLUMN (1/3 width) == */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <VirtualCard />
            <PaymentSchedule />
            <BudgetGoals />
          </div>
        </div>
      </main>
    </div>
  );
}
