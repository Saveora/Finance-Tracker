// src/components/dashboard/RecentTransactions.tsx
import { ArrowDownLeft, ArrowUpRight, Film, ShoppingCart, Utensils } from 'lucide-react';

const transactions = [
  {
    icon: <ShoppingCart size={20} />,
    desc: "Amazon Shopping",
    date: "Aug 08, 2025",
    status: "Completed",
    amount: -1599.00,
  },
  {
    icon: <ArrowDownLeft size={20} className="text-green-500" />,
    desc: "Salary Deposit",
    date: "Aug 01, 2025",
    status: "Completed",
    amount: 55000.00,
  },
  {
    icon: <Film size={20} />,
    desc: "Netflix Subscription",
    date: "Jul 28, 2025",
    status: "Completed",
    amount: -649.00,
  },
  {
    icon: <Utensils size={20} />,
    desc: "Zomato Order",
    date: "Jul 27, 2025",
    status: "Pending",
    amount: -351.00,
  },
  {
    icon: <ArrowUpRight size={20} />,
    desc: "Sent to Jane",
    date: "Jul 25, 2025",
    status: "Completed",
    amount: -1000.00,
  },
];

// Helper to determine status pill color
const getStatusStyles = (status: string) => {
  switch (status) {
    case "Completed":
      return "bg-green-100 text-green-700";
    case "Pending":
      return "bg-orange-100 text-orange-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

export default function RecentTransactions() {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow duration-300 border-t-4 border-t-purple-500">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-lg text-gray-800">Transaction History</h2>
        <a href="/dashboard/transactions" className="text-sm text-sky-600 hover:text-sky-800 font-semibold transition-colors">
          View All
        </a>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-xs font-medium text-black-400 uppercase">
              <th className="py-2 px-2">Description</th>
              <th className="py-2 px-2">Date</th>
              <th className="py-2 px-2">Status</th>
              <th className="py-2 px-2 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t, i) => (
              <tr key={i} className="text-sm border-t hover:bg-gray-50">
                <td className="py-3 px-2 flex items-center gap-3">
                  <span className="bg-gray-100 p-2 rounded-full">{t.icon}</span>
                  <span className="font-medium">{t.desc}</span>
                </td>
                <td className="py-3 px-2 text-black-500">{t.date}</td>
                <td className="py-3 px-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyles(t.status)}`}>
                    {t.status}
                  </span>
                </td>
                <td className={`py-3 px-2 text-right font-semibold ${t.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {t.amount > 0 ? '+' : ''}₹{Math.abs(t.amount).toLocaleString('en-IN')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
