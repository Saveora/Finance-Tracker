// src/components/dashboard/PaymentSchedule.tsx
import Link from 'next/link';

const schedule = [
  { name: "Esther Howard", date: "15 Jan 2025", amount: 57628.00, avatar: "https://i.pravatar.cc/40?u=1" },
  { name: "Jane Cooper", date: "18 Sep 2025", amount: 49051.00, avatar: "https://i.pravatar.cc/40?u=2" },
  { name: "Floyd Miles", date: "31 Jan 2026", amount: 44661.00, avatar: "https://i.pravatar.cc/40?u=3" },
  { name: "Kristin Watson", date: "04 Mar 2026", amount: 73965.00, avatar: "https://i.pravatar.cc/40?u=4" },
  { name: "Courtney Henry", date: "07 Nov 2026", amount: 29301.00, avatar: "https://i.pravatar.cc/40?u=5" },
  { name: "Jenny Wilson", date: "10 Dec 2026", amount: 85408.00, avatar: "https://i.pravatar.cc/40?u=6" },
];

export default function PaymentSchedule() {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow duration-300 border-t-4 border-t-amber-500">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-lg text-gray-800">Payment Schedule</h2>
        <Link href="/dashboard/payment-schedule" className="text-sm text-sky-600 hover:text-sky-800 font-semibold transition-colors">
          View All
        </Link>
      </div>
      <div className="flex flex-col gap-1 mt-2">
        {schedule.map(({ name, date, amount, avatar }, i) => (
          <div key={i} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
            <div className="flex items-center gap-3">
              <img src={avatar} alt={name} className="w-9 h-9 rounded-full" />
              <div>
                <div className="font-semibold text-sm text-gray-800">{name}</div>
                <div className="text-xs text-black-400">{date}</div>
              </div>
            </div>
            <div className="font-bold text-sm text-gray-900">
                ₹{amount.toLocaleString('en-IN')}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}