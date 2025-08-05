// src/components/dashboard/RecentTransactions.tsx

const transactions = [
  {
    date: "April 24",
    desc: "Netflix Subscription",
    category: "Entertainment",
    status: "Completed",
    amount: "-$15.00",
  },
  {
    date: "April 24",
    desc: "Netflix Subscription",
    category: "Entertainment",
    status: "Completed",
    amount: "-$15.00",
  },
  {
    date: "April 24",
    desc: "Netflix Subscription",
    category: "Entertainment",
    status: "Completed",
    amount: "-$15.00",
  },
];

export default function RecentTransactions() {
  return (
    <div className="bg-white rounded-xl p-6 shadow mt-6">
      <div className="flex items-center justify-between mb-3">
        <span className="font-medium">Recent Transactions</span>
        <span className="text-xs text-blue-600 cursor-pointer font-semibold">View All</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left mt-2">
          <thead>
            <tr className="text-xs font-medium text-gray-400">
              <th className="py-2">Date</th>
              <th>Description</th>
              <th>Category</th>
              <th>Status</th>
              <th className="text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t, i) => (
              <tr key={i} className="text-sm border-t">
                <td className="py-3">{t.date}</td>
                <td>{t.desc}</td>
                <td>{t.category}</td>
                <td>
                  <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs">
                    {t.status}
                  </span>
                </td>
                <td className="text-right font-semibold">{t.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
