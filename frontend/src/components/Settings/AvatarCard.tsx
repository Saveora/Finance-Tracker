"use client";

import React, { useState } from "react";
import { User, UploadCloud } from "lucide-react";

export default function AvatarCard() {
  const [avatar, setAvatar] = useState<string | null>(null);

  const handleAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    setAvatar(url);
  };

  return (
    <div className="bg-white dark:bg-[#0B1620] rounded-2xl p-6 shadow-sm border dark:border-transparent">
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center text-xl font-bold text-white shadow-lg">
          {avatar ? (
            <img
              src={avatar}
              alt="avatar"
              className="w-20 h-20 rounded-full object-cover"
            />
          ) : (
            <User size={28} />
          )}
        </div>

        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            Diptesh Kumar
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-300">
            diptesh@example.com
          </p>
          <div className="mt-3 flex items-center gap-2">
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatar}
                className="hidden"
              />
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-100 dark:bg-[#062337] text-sm font-medium text-slate-800 dark:text-slate-200">
                <UploadCloud size={14} /> Upload
              </span>
            </label>

            <button
              onClick={() => setAvatar(null)}
              className="px-3 py-1 rounded-md bg-transparent border border-slate-200 dark:border-[#08304a] text-sm text-slate-700 dark:text-slate-200"
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
