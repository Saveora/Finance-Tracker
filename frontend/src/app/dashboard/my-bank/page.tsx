'use client'

import React, { useEffect, useState } from "react";
import { Eye, EyeOff, Plus } from "lucide-react";
import Link from "next/link";

export type BankAccount = {
  id: string;
  bankName: string;
  holderName: string;
  accountNumber: string;
  currency: string;
  balance: number;
  type: "Savings" | "Checking" | "Credit" | "Other";
  logoColor?: string;
};

const mockAccounts: BankAccount[] = [
  {
    id: "a1",
    bankName: "Axis Bank",
    holderName: "Jay K. Patra",
    accountNumber: "123456789012",
    currency: "INR",
    balance: 154320.5,
    type: "Savings",
    logoColor: "bg-gradient-to-r from-indigo-500 to-purple-500",
  },
  {
    id: "a2",
    bankName: "State Bank of India",
    holderName: "Jay K. Patra",
    accountNumber: "987654321000",
    currency: "INR",
    balance: 50200,
    type: "Checking",
    logoColor: "bg-gradient-to-r from-emerald-400 to-green-600",
  },
  {
    id: "a3",
    bankName: "HDFC Bank",
    holderName: "Jay K. Patra",
    accountNumber: "111122223333",
    currency: "INR",
    balance: 78000.75,
    type: "Credit",
    logoColor: "bg-gradient-to-r from-pink-400 to-rose-500",
  },
];

function formatCurrency(amount: number, currency = "INR") {
  const code = currency === "INR" ? "INR" : currency;
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: code,
    maximumFractionDigits: 2,
  }).format(amount);
}

function maskAccount(acc: string) {
  const last4 = acc.slice(-4);
  return acc.length <= 4 ? acc : `•••• •••• ${last4}`;
}

export default function MyBankPage() {
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNumbers, setShowNumbers] = useState(false);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => {
      setAccounts(mockAccounts);
      setLoading(false);
    }, 700);
    return () => clearTimeout(t);
  }, []);

  const totalBalance = accounts.reduce((s, a) => s + a.balance, 0);

 

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <header className="rounded-2xl bg-white shadow-md p-6 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">My Bank</h1>
              <p className="text-sm text-slate-500">Overview of connected accounts & balances</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-slate-500">Connected accounts</p>
              <p className="text-lg font-medium">{loading ? "..." : accounts.length}</p>
            </div>

            <button
              onClick={() => setShowNumbers((s) => !s)}
              className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-slate-50"
            >
              {showNumbers ? <EyeOff size={16} /> : <Eye size={16} />}
              <span>{showNumbers ? "Hide numbers" : "Show numbers"}</span>
            </button>

            <button className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:scale-105 text-white px-5 py-2 rounded-lg shadow-lg transition-transform duration-300">
              <Plus size={16} />
              <Link href="./connect-bank">
              <span>Connect New Bank</span>
              </Link>
            </button>
          </div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="rounded-2xl bg-white shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold">Total balance</h2>
                  <p className="text-sm text-slate-500">Across all connected accounts</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-500">Currency</p>
                  <p className="text-xl font-semibold">INR</p>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-6">
                <div className="rounded-xl p-4 bg-gradient-to-r from-yellow-400 to-orange-400 text-white">
                  <h3 className="text-xs uppercase">Combined</h3>
                  <p className="text-2xl font-bold mt-1">{loading ? "..." : formatCurrency(totalBalance, "INR")}</p>
                </div>

                <div className="flex-1">
                  <p className="text-sm text-slate-600">Quick actions</p>
                  <div className="mt-3 flex gap-3">
                    <button className="px-4 py-2 rounded-lg border hover:shadow">Transfer</button>
                    <button className="px-4 py-2 rounded-lg border hover:shadow">Add account</button>
                    <button className="px-4 py-2 rounded-lg border hover:shadow">Export</button>
                  </div>
                </div>
              </div>

              <hr className="my-6" />

              <div>
                <h3 className="font-medium mb-3">Accounts</h3>

                {loading ? (
                  <div className="text-slate-500">Loading accounts...</div>
                ) : (
                  <div className="space-y-3">
                    {accounts.map((acc) => (
                      <article key={acc.id} className="flex items-center justify-between p-3 rounded-lg border hover:shadow-sm">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${acc.logoColor || "bg-slate-300"}`}>
                            <span className="font-semibold text-sm">{acc.bankName.split(" ").map((w) => w[0]).slice(0,2).join("")}</span>
                          </div>
                          <div>
                            <p className="font-medium">{acc.bankName}</p>
                            <p className="text-sm text-slate-500">{acc.type} • {acc.holderName}</p>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="font-semibold">{showNumbers ? formatCurrency(acc.balance, acc.currency) : maskAccount(acc.accountNumber)}</p>
                          <p className="text-xs text-slate-400">Account ID: {acc.id}</p>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <aside>
            <div className="rounded-2xl bg-white shadow p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Account summary</h3>
                <p className="text-xs text-slate-500">Updated just now</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Savings</p>
                    <p className="font-medium">{formatCurrency(accounts.filter(a=>a.type==='Savings').reduce((s,a)=>s+a.balance,0),'INR')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Checking</p>
                    <p className="font-medium">{formatCurrency(accounts.filter(a=>a.type==='Checking').reduce((s,a)=>s+a.balance,0),'INR')}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Credit</p>
                    <p className="font-medium">{formatCurrency(accounts.filter(a=>a.type==='Credit').reduce((s,a)=>s+a.balance,0),'INR')}</p>
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">Accounts</p>
                    <p className="font-medium">{accounts.length}</p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button className="w-full rounded-lg px-4 py-2 bg-indigo-600 text-white hover:brightness-95">Manage connections</button>
              </div>
            </div>

            <div className="mt-4 rounded-2xl bg-white shadow p-6 space-y-3">
              <h4 className="font-semibold">Recent activity</h4>
              <p className="text-sm text-slate-500">No recent activity available in mock data.</p>
            </div>
          </aside>
        </section>

        <footer className="mt-8 text-center text-sm text-slate-500">Built with ♥ — replace mock data with your API for real accounts.</footer>
      </div>
    </div>
  );
}
