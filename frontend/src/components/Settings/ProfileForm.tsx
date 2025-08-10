"use client";

import React from "react";
import { Check, Bell, Sun, Moon } from "lucide-react";
import type { UseFormRegister, UseFormHandleSubmit, UseFormWatch } from "react-hook-form";

type PrefsForm = {
  displayName: string;
  email: string;
  currency: string;
  language: string;
  timezone: string;
  theme: "light" | "dark";
  txAlerts: boolean;
  promos: boolean;
  reminders: boolean;
};

export default function ProfileForm({
  register,
  handleSubmit,
  onSavePrefs,
  resetPrefs,
  saving,
  saved,
  watch,
}: {
  register: UseFormRegister<PrefsForm>;
  handleSubmit: UseFormHandleSubmit<PrefsForm>;
  onSavePrefs: (d: PrefsForm) => void;
  resetPrefs: () => void;
  saving: boolean;
  saved: boolean;
  watch: UseFormWatch<PrefsForm>;
}) {
  const theme = watch("theme");

  return (
    <form onSubmit={handleSubmit(onSavePrefs)} className="bg-white dark:bg-[#0B1620] rounded-2xl p-6 shadow-sm border dark:border-transparent">
      <div className="flex items-start justify-between gap-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Profile</h3>
          <p className="text-sm text-slate-500 dark:text-slate-300">Your public profile and preferences.</p>
        </div>

        <div className="flex items-center gap-3">
          <button type="button" onClick={resetPrefs} className="px-4 py-2 rounded-md border border-slate-200 dark:border-[#08304a] text-sm text-slate-700 dark:text-slate-200">Reset</button>
          <button type="submit" className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-slate-900 text-white" disabled={saving}>
            {saving ? <span className="animate-pulse">Saving...</span> : (<><Check size={14}/> Save changes</>)}
          </button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-12 gap-4">
        <div className="col-span-12 md:col-span-6">
          <label className="text-xs font-medium text-slate-700 dark:text-slate-200">Display name</label>
          <input className="mt-1 w-full rounded-md border px-3 py-2 bg-transparent border-slate-200 dark:border-[#08304a] text-slate-800 dark:text-slate-100" {...register("displayName")} />
        </div>

        <div className="col-span-12 md:col-span-6">
          <label className="text-xs font-medium text-slate-700 dark:text-slate-200">Email</label>
          <input className="mt-1 w-full rounded-md border px-3 py-2 bg-transparent border-slate-200 dark:border-[#08304a] text-slate-800 dark:text-slate-100" {...register("email")} type="email" />
        </div>

        <div className="col-span-12 md:col-span-4">
          <label className="text-xs font-medium text-slate-700 dark:text-slate-200">Currency</label>
          <select className="mt-1 w-full rounded-md border px-3 py-2 bg-transparent border-slate-200 dark:border-[#08304a] text-slate-800 dark:text-slate-100" {...register("currency") }>
            <option>INR</option>
            <option>USD</option>
            <option>EUR</option>
            <option>GBP</option>
          </select>
        </div>

        <div className="col-span-12 md:col-span-4">
          <label className="text-xs font-medium text-slate-700 dark:text-slate-200">Language</label>
          <select className="mt-1 w-full rounded-md border px-3 py-2 bg-transparent border-slate-200 dark:border-[#08304a] text-slate-800 dark:text-slate-100" {...register("language") }>
            <option>English</option>
            <option>Hindi</option>
            <option>Spanish</option>
          </select>
        </div>

        <div className="col-span-12 md:col-span-4">
          <label className="text-xs font-medium text-slate-700 dark:text-slate-200">Timezone</label>
          <select className="mt-1 w-full rounded-md border px-3 py-2 bg-transparent border-slate-200 dark:border-[#08304a] text-slate-800 dark:text-slate-100" {...register("timezone") }>
            <option>Asia/Kolkata</option>
            <option>UTC</option>
            <option>America/New_York</option>
            <option>Europe/London</option>
          </select>
        </div>

         <div className="col-span-12 md:col-span-6">
          <label className="text-xs font-medium text-slate-700 dark:text-slate-200">
            Theme
          </label>

          {/* increased left margin and gap so label isn't touching the icons */}
          <div className="mt-2 ml-2 inline-flex items-center gap-3 rounded-md border px-3 py-1 bg-transparent border-slate-200 dark:border-[#08304a]">
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input type="radio" value="light" {...register("theme")} name="theme" className="sr-only" />
              <div className={`px-3 py-1 rounded ${theme === "light" ? "bg-slate-800 text-white" : "text-slate-700"}`}>
                <Sun size={16}/>
              </div>
            </label>

            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input type="radio" value="dark" {...register("theme")} name="theme" className="sr-only" />
              <div className={`px-3 py-1 rounded ${theme === "dark" ? "bg-slate-800 text-white" : "text-slate-700"}`}><Moon size={16}/></div>
            </label>
          </div>
        </div>

        <div className="col-span-12 md:col-span-6">
          <label className="text-xs font-medium text-slate-700 dark:text-slate-200">Notifications</label>
          <div className="mt-1 space-y-2">
            <label className="flex items-center justify-between gap-3 bg-slate-50 dark:bg-[#052433] px-3 py-2 rounded">
              <div className="flex items-center gap-3">
                <Bell size={16} />
                <div>
                  <div className="text-sm text-slate-900 dark:text-slate-200">Transaction alerts</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Get real-time push & email alerts for transactions</div>
                </div>
              </div>
              <input type="checkbox" {...register("txAlerts")} className="w-5 h-5" />
            </label>

            <label className="flex items-center justify-between gap-3 bg-slate-50 dark:bg-[#052433] px-3 py-2 rounded">
              <div className="flex items-center gap-3">
                <Bell size={16} />
                <div>
                  <div className="text-sm text-slate-900 dark:text-slate-200">Promotions</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Receive occasional promotions and product news</div>
                </div>
              </div>
              <input type="checkbox" {...register("promos")} className="w-5 h-5" />
            </label>

            <label className="flex items-center justify-between gap-3 bg-slate-50 dark:bg-[#052433] px-3 py-2 rounded">
              <div className="flex items-center gap-3">
                <Bell size={16} />
                <div>
                  <div className="text-sm text-slate-900 dark:text-slate-200">Payment reminders</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Scheduled reminders for upcoming bills</div>
                </div>
              </div>
              <input type="checkbox" {...register("reminders")} className="w-5 h-5" />
            </label>
          </div>
        </div>
      </div>

      {saved && (
        <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
          <Check size={14} /> Preferences saved
        </div>
      )}
    </form>
  );
}
