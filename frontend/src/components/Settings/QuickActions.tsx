"use client";

import React from "react";
import { Bell } from "lucide-react";

export default function QuickActions() {
  return (
    <div className="bg-white dark:bg-[#0B1620] rounded-2xl p-6 shadow-sm border dark:border-transparent">
      <h4 className="text-sm font-medium text-slate-700 dark:text-slate-200">
        Quick actions
      </h4>
      <div className="mt-3 space-y-2">
        {/* Create payment link removed per request */}
        <button
          className="w-full text-left flex items-center gap-3 px-4 py-2 rounded-lg border border-slate-200 dark:border-[#08304a] bg-transparent text-slate-800 dark:text-slate-200"
          onClick={() => alert("Open notification settings (implement modal or route)")}
        >
          <Bell size={16} /> Notification settings
        </button>
      </div>
    </div>
  );
}
