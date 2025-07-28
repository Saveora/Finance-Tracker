import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import OverviewCards from "@/components/dashboard/OverviewCards";
import SpentChart from "@/components/dashboard/SpentChart";
import PaymentSchedule from "@/components/dashboard/PaymentSchedule";
import VirtualCard from "@/components/dashboard/VirtualCard";
import BudgetGoals from "@/components/dashboard/BudgetGoals";
import RecentTransactions from "@/components/dashboard/RecentTransactions";

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-4">
        <Header />
        <OverviewCards />
        <SpentChart />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <PaymentSchedule />
          <VirtualCard />
        </div>
        <BudgetGoals />
        <RecentTransactions />
      </div>
    </div>
  );
}

