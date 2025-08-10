"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import AvatarCard from "@/components/Settings/AvatarCard";
import ConnectedAccounts from "@/components/Settings/ConnectedAccounts";
import QuickActions from "@/components/Settings/QuickActions";
import ProfileForm from "@/components/Settings/ProfileForm";
import SecurityCard from "@/components/Settings/SecurityCard";
import DangerZone from "@/components/Settings/DangerZone";

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

export default function SettingsPage() {
  const { register, handleSubmit, reset, watch } = useForm<PrefsForm>({
    defaultValues: {
      displayName: "Diptesh",
      email: "diptesh@example.com",
      currency: "INR",
      language: "English",
      timezone: "Asia/Kolkata",
      theme: "light",
      txAlerts: true,
      promos: false,
      reminders: true,
    },
  });

  const theme = watch("theme");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // When theme toggles we explicitly set background and remove default margins
    // so #071029 covers entire viewport and no white border remains.
    const applyDark = (on: boolean) => {
      try {
        const html = document.documentElement;
        const body = document.body;
        const next = document.getElementById("__next");

        // Remove default margins for full-bleed coverage
        html.style.margin = "0";
        body.style.margin = "0";
        html.style.padding = "0";
        body.style.padding = "0";

        // Ensure roots fill viewport
        html.style.minHeight = "100%";
        body.style.minHeight = "100%";
        if (next) next.style.minHeight = "100vh";

        if (on) {
          html.classList.add("dark");
          html.style.backgroundColor = "#071029";
          body.style.backgroundColor = "#071029";
          if (next) next.style.backgroundColor = "#071029";
        } else {
          html.classList.remove("dark");
          html.style.backgroundColor = "";
          body.style.backgroundColor = "";
          if (next) next.style.backgroundColor = "";
        }
      } catch (err) {
        // ignore on server / non-browser env
      }
    };

    applyDark(theme === "dark");

    return () => applyDark(false);
  }, [theme]);

  const onSavePrefs = (data: PrefsForm) => {
    setSaving(true);
    setSaved(false);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2200);
    }, 900);
    console.log("Saved prefs:", data);
  };

  const resetPrefs = () => reset();

  return (
    // main uses dark:bg so component-level background matches page surface
    <main className="min-h-screen p-8 bg-gray-50 dark:bg-[#000000]">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Settings
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">
            Manage your profile, preferences and security settings.
          </p>
        </header>

        <div className="grid grid-cols-12 gap-8">
          <aside className="col-span-12 lg:col-span-4 space-y-6">
            <AvatarCard />
            <div className="bg-white dark:bg-[#0B1620] rounded-2xl p-6 shadow-sm border dark:border-transparent">
              <h4 className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Connected accounts
              </h4>
              <ConnectedAccounts />
            </div>

            <QuickActions />
          </aside>

          <section className="col-span-12 lg:col-span-8 space-y-6">
            <ProfileForm
              register={register}
              handleSubmit={handleSubmit}
              onSavePrefs={onSavePrefs}
              resetPrefs={resetPrefs}
              saving={saving}
              saved={saved}
              watch={watch}
            />

            <SecurityCard />

            <DangerZone />
          </section>
        </div>
      </div>
    </main>
  );
}
