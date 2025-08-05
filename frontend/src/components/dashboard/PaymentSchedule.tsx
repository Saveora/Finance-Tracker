// src/components/dashboard/PaymentSchedule.tsx
const schedule = [
  { name: "Esther Howard", date: "1/15/12", amount: "$576.28", avatar: "https://i.pravatar.cc/40?u=1" },
  { name: "Jane Cooper", date: "9/18/16", amount: "$490.51", avatar: "https://i.pravatar.cc/40?u=2" },
  { name: "Floyd Miles", date: "1/31/14", amount: "$446.61", avatar: "https://i.pravatar.cc/40?u=3" },
  { name: "Kristin Watson", date: "3/4/16", amount: "$739.65", avatar: "https://i.pravatar.cc/40?u=4" },
  { name: "Courtney Henry", date: "11/7/16", amount: "$293.01", avatar: "https://i.pravatar.cc/40?u=5" },
  { name: "Jenny Wilson", date: "12/10/13", amount: "$854.08", avatar: "https://i.pravatar.cc/40?u=6" },
];

export default function PaymentSchedule() {
  return (
    <div className="bg-white rounded-xl p-6 shadow">
      <div className="flex items-center justify-between mb-3">
        <span className="font-medium">Payment Schedule</span>
        <span className="text-xs text-blue-600 cursor-pointer font-semibold">View All</span>
      </div>
      <div className="flex flex-col gap-2">
        {schedule.map(({ name, date, amount, avatar }, i) => (
          <div key={i} className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <img src={avatar} alt={name} className="w-8 h-8 rounded-full" />
              <div>
                <div className="font-medium text-sm">{name}</div>
                <div className="text-xs text-gray-400">{date}</div>
              </div>
            </div>
            <div className="font-medium text-sm">{amount}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

