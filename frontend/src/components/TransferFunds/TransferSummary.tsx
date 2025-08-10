// src/components/TransferFunds/TransferSummary.tsx
'use client';

export default function TransferSummary({ dailyUsed, dailyLimit }: { dailyUsed: number; dailyLimit: number }) {
  const pct = Math.min(100, Math.round((dailyUsed / dailyLimit) * 100));

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      <h3 className="text-md font-semibold mb-3">Transfer Summary</h3>

      <div className="text-sm text-slate-600 space-y-3">
        <div>
          <div className="flex justify-between text-xs text-slate-500 mb-1">
            <span>Daily limit used</span>
            <span className="font-medium">₹ {dailyUsed.toLocaleString()} / ₹ {dailyLimit.toLocaleString()}</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div className="h-2 rounded-full bg-yellow-400" style={{ width: `${pct}%` }} />
          </div>
          <div className="text-xs text-slate-400 mt-1">{pct}% of daily limit used</div>
        </div>

        <div className="flex justify-between">
          <span>Typical arrival</span>
          <span className="font-medium">Instant</span>
        </div>
        <div className="flex justify-between">
          <span>Security</span>
          <span className="font-medium">2FA enabled</span>
        </div>
      </div>

      <div className="mt-4 text-xs text-slate-400">
        Tip: For frequent transfers, save beneficiaries in My Bank for one-click transfers.
      </div>
    </div>
  );
}
