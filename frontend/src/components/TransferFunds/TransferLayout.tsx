// src/components/TransferFunds/TransferLayout.tsx
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import TransferForm, { TransferPayload } from './TransferForm';
import RecentTransactions from './RecentTransactions';
import TransferSummary from './TransferSummary';

type Tx = {
  id: string;
  name: string;
  amount: number;
  date: string;
  method: string;
};

type Account = {
  id: string;
  bank: string;
  last4: string;
  balance: number;
  currency?: 'INR' | 'USD';
};

export default function TransferLayout() {
  // demo accounts (replace with real user accounts fetched from backend)
  const [accounts, setAccounts] = useState<Account[]>([
    { id: 'acc-icici-1', bank: 'ICICI Bank', last4: '0123', balance: 28450.0, currency: 'INR' },
    { id: 'acc-sbi-2', bank: 'State Bank', last4: '4321', balance: 102500.55, currency: 'INR' },
    { id: 'acc-chase-3', bank: 'Chase', last4: '9987', balance: 1200.75, currency: 'USD' },
  ]);

  const [primaryAccountId, setPrimaryAccountId] = useState<string>(accounts[0].id);

  const [dailyUsed, setDailyUsed] = useState<number>(5000);
  const dailyLimit = 50000;

  const [transactions, setTransactions] = useState<Tx[]>([
    { id: 't3', name: 'Grocery - BigMart', amount: -2200, date: 'Jul 28', method: 'Card' },
    { id: 't2', name: 'Salary', amount: 45000, date: 'Jul 30', method: 'Bank' },
    { id: 't1', name: 'Rent - Ankit', amount: -12000, date: 'Aug 1', method: 'UPI' },
  ]);

  // handle transfer — called by TransferForm
  const handleTransferComplete = (data: TransferPayload) => {
    console.log('[TransferLayout] handleTransferComplete received:', data);

    const amt = Number(data.amount) || 0;
    setDailyUsed((prev) => prev + amt);

    const newTx: Tx = {
      id: String(Date.now()),
      name: data.to,
      amount: -Math.abs(amt),
      date: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      method: data.method === 'UPI' ? 'UPI' : 'Bank',
    };
    setTransactions((prev) => [newTx, ...prev]);
  };

  // change primary account (from TransferForm)
  const handleSetPrimary = (accountId: string) => {
    setPrimaryAccountId(accountId);
    // optionally persist the user's primary selection by calling backend here
    console.log('[TransferLayout] primary account set to:', accountId);
  };

  return (
    <div className="flex">
      <main className="flex-1 py-10 px-10">
        <div className="max-w-6xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-extrabold text-slate-900">Payment Transfer</h1>
            <p className="text-sm text-slate-500 mt-1">Send money quickly and securely. Use saved accounts or UPI.</p>
          </header>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="grid grid-cols-12 gap-6"
          >
            <section className="col-span-7 bg-white rounded-2xl p-6 shadow-sm">
              <TransferForm
                accounts={accounts}
                primaryAccountId={primaryAccountId}
                onSetPrimary={handleSetPrimary}
                onTransferComplete={handleTransferComplete}
              />
            </section>

            <aside className="col-span-5 space-y-6">
              <TransferSummary dailyUsed={dailyUsed} dailyLimit={dailyLimit} />
              <RecentTransactions transactions={transactions} />
            </aside>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
