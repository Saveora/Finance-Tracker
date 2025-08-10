"use client";

import React from "react";

export default function DangerZone() {
  return (
    <div className="bg-white dark:bg-[#0B1620] rounded-2xl p-6 shadow-sm border dark:border-transparent">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Danger zone</h3>
      <p className="text-sm text-slate-500 dark:text-slate-300 mt-1">Actions in this section are irreversible. Please proceed with caution.</p>

      <div className="mt-4 flex items-center gap-3">
        <button className="px-4 py-2 rounded-md bg-red-600 text-white">Delete account</button>
        <button className="px-4 py-2 rounded-md border border-slate-200 dark:border-[#08304a]">Export data</button>
      </div>
    </div>
  );
}
