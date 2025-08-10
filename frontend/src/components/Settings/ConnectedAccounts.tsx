"use client";

import React from "react";
import { CreditCard } from "lucide-react";

export default function ConnectedAccounts() {
  const accounts = [
    { id: 1, name: "Bank of India", type: "Savings", mask: "****1234" },
    { id: 2, name: "HDFC", type: "Current", mask: "****5678" },
  ];

  return (
    <div className="mt-3 space-y-3">
      {accounts.map((a) => (
        <div
          key={a.id}
          className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-[#052433]"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-white dark:bg-[#082534] shadow-sm flex items-center justify-center">
              <CreditCard size={16} />
            </div>
            <div>
              <div className="text-sm font-medium text-slate-900 dark:text-slate-200">
                {a.name}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {a.type} • {a.mask}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              className="text-sm px-3 py-1 rounded-md bg-emerald-50 text-emerald-700"
              onClick={() =>
                alert(`Manage ${a.name} — view details / sync / re-authenticate`)
              }
            >
              Manage
            </button>

            <button
              className="text-sm px-3 py-1 rounded-md bg-amber-50 text-amber-700"
              onClick={() => alert(`Disconnect ${a.name} — this will unlink the account`)}
            >
              Disconnect
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
