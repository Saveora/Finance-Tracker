// src/components/TransferFunds/RecentTransactions.tsx
'use client';

export default function RecentTransactions({ transactions }: { transactions: { id: string; name: string; amount: number; date: string; method: string }[] }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      <h3 className="text-md font-semibold mb-3">Recent Transactions</h3>
      <ul className="space-y-3">
        {transactions.map((t) => (
          <li key={t.id} className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">{t.name}</div>
              <div className="text-xs text-slate-400">{t.date} • {t.method}</div>
            </div>
            <div className={`text-sm font-semibold ${t.amount < 0 ? 'text-red-500' : 'text-green-600'}`}>
              {t.amount < 0 ? '-' : '+'}₹{Math.abs(t.amount)}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
