"use client";

import React from "react";
import { Check, Lock, CreditCard } from "lucide-react";

export default function SecurityCard() {
  return (
    <div className="bg-white dark:bg-[#0B1620] rounded-2xl p-6 shadow-sm border dark:border-transparent">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Security</h3>
          <p className="text-sm text-slate-500 dark:text-slate-300">Manage your password and account protection.</p>
        </div>
        <div className="inline-flex items-center gap-3">
          <button className="px-3 py-2 rounded-md border border-slate-200 dark:border-[#08304a]">Enable 2FA</button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-12 gap-4">
        <div className="col-span-12 md:col-span-6">
          <div className="text-sm text-slate-500 dark:text-slate-300">Password management UI goes here (re-use your previous implementation)</div>
        </div>

        <div className="col-span-12 md:col-span-6">
          <h4 className="text-sm font-medium text-slate-700 dark:text-slate-200">Account protection</h4>
          <ul className="mt-3 space-y-3">
            <li className="flex items-start gap-3">
              <div className="mt-1 text-emerald-600"><Check size={18} /></div>
              <div>
                <div className="text-sm font-medium text-slate-900 dark:text-slate-200">Two-factor authentication</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Add an extra layer of security to your account.</div>
              </div>
            </li>

            <li className="flex items-start gap-3">
              <div className="mt-1 text-amber-500"><Lock size={18} /></div>
              <div>
                <div className="text-sm font-medium text-slate-900 dark:text-slate-200">Biometric unlock</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Use fingerprint or face unlock on supported devices.</div>
              </div>
            </li>

            <li className="flex items-start gap-3">
              <div className="mt-1 text-sky-500"><CreditCard size={18} /></div>
              <div>
                <div className="text-sm font-medium text-slate-900 dark:text-slate-200">Monitor payments</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">We monitor unusual activity and notify you immediately.</div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
