//frontend/src/app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import useUser from '@/hooks/useUser';
import { useRouter } from 'next/navigation';
import SpentChart from '@/components/dashboard/SpentChart';
import PaymentSchedule from '@/components/dashboard/PaymentSchedule';
import BudgetGoals from '@/components/dashboard/BudgetGoals';
import RecentTransactions from '@/components/dashboard/RecentTransactions';
import Header from '@/components/dashboard/Header';
import VirtualCard from '@/components/dashboard/VirtualCard';
import AccountSummary from '@/components/dashboard/AccountSummary';
import { fetchWithAuth } from '@/lib/fetchWithAuth';

type Account = {
  id: number | string;
  bank_name?: string;
  account_masked?: string;
  raw_meta?: any;
};

export default function DashboardPage() {
  const { user, loading } = useUser();
  const router = useRouter();

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [accountsLoading, setAccountsLoading] = useState(true);
  const [selectedAccountId, setSelectedAccountId] = useState<string>('ALL');

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/auth?type=login');
    }
  }, [loading, user, router]);

  // Fetch accounts once for header & summary (lifted up)
  useEffect(() => {
    let mounted = true;
    (async () => {
      setAccountsLoading(true);
      try {
        const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/accounts`, {
          credentials: 'include',
        });
        const json = await res.json();
        if (!mounted) return;
        const list: Account[] = Array.isArray(json.accounts) ? json.accounts : [];
        setAccounts(list);
        if (list.length === 1) setSelectedAccountId(String(list[0].id));
        else setSelectedAccountId('ALL');
      } catch (err) {
        console.error('Failed to load accounts', err);
        setAccounts([]);
        setSelectedAccountId('ALL');
      } finally {
        if (mounted) setAccountsLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8f9fb] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-gray-300 border-t-yellow-500 rounded-full" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#F8f9fb]">
      <main className="flex-1 flex flex-col">
        {/* pass accounts + selection handlers into Header so dropdown sits on same line */}
        <Header
          accounts={accounts}
          selectedAccountId={selectedAccountId}
          onAccountChange={(id: string) => setSelectedAccountId(id)}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6 items-start">
          {/* LEFT (2/3 width) */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Account summary (cards) - receives accounts + selectedAccountId */}
            <AccountSummary
              accounts={accounts}
              selectedAccountId={selectedAccountId}
            />

            <SpentChart />
           <RecentTransactions
              selectedAccountId={selectedAccountId}
            />
          </div>

          {/* RIGHT (1/3) */}
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
