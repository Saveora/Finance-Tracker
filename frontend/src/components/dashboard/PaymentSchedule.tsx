// frontend/src/components/dashboard/PaymentSchedule.tsx
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

type DisplayRow = {
  id: string;
  title: string;      // used for name/title in UI
  date?: string;      // ISO or friendly
  amount: number;
  avatar?: string | null;
};

function fmtINR(amount: number) {
  return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
}

function friendlyDate(dateIso?: string) {
  if (!dateIso) return "";
  try {
    const d = new Date(dateIso);
    return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  } catch {
    return String(dateIso);
  }
}

export default function PaymentSchedule() {
  const [rows, setRows] = useState<DisplayRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/payment-schedules`, {
          method: "GET",
        });

        if (!mounted) return;

        if (!res.ok) {
          // graceful fallback: empty
          setRows([]);
          return;
        }

        const data = await res.json().catch(() => ({}));
        let list: any[] = [];
        if (Array.isArray(data)) list = data;
        else if (data && Array.isArray(data.schedules)) list = data.schedules;
        else if (data && Array.isArray((data as any).rows)) list = (data as any).rows;
        else list = [];

        // Normalize into DisplayRow
        const normalized: DisplayRow[] = list.map((s: any, idx: number) => {
          const id = String(s.id ?? s._raw?.id ?? idx);
          const title = s.title ?? s.payee ?? `Schedule ${id}`;
          const amount = Number(s.amount || 0);
          // avatar: try to use a stable avatar (ui-avatars) so design matches screenshot
          // You can replace this with any avatar source or keep null
          const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(title)}&background=fff&color=333&size=64`;
          const startDate = s.startDate ?? s.start_date ?? s.createdAt ?? null;
          return {
            id,
            title,
            date: startDate ? new Date(startDate).toISOString() : undefined,
            amount,
            avatar,
          };
        });

        // Sort by upcoming date (earliest first). Schedules without date go to the end.
        normalized.sort((a, b) => {
          if (!a.date && !b.date) return 0;
          if (!a.date) return 1;
          if (!b.date) return -1;
          return +new Date(a.date) - +new Date(b.date);
        });

        // Keep at most 6 items (as requested)
        setRows(normalized.slice(0, 6));
      } catch (err) {
        console.error("Failed to load payment schedules", err);
        if (mounted) setRows([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow duration-300 border-t-4 border-t-amber-500">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-lg text-gray-800">Payment Schedule</h2>
        <Link href="/dashboard/payment-schedule" className="text-sm text-sky-600 hover:text-sky-800 font-semibold transition-colors">
          View All
        </Link>
      </div>

      <div className="flex flex-col gap-1 mt-2">
        {loading ? (
          // simple skeleton
          <>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between p-2 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gray-100 animate-pulse" />
                  <div className="space-y-1">
                    <div className="w-40 h-3 bg-gray-100 rounded animate-pulse" />
                    <div className="w-24 h-2 bg-gray-100 rounded animate-pulse" />
                  </div>
                </div>
                <div className="w-20 h-4 bg-gray-100 rounded animate-pulse" />
              </div>
            ))}
          </>
        ) : rows.length === 0 ? (
          <div className="text-sm text-gray-500 col-span-3">No scheduled payments yet. Create one to get started.</div>
        ) : (
          rows.map((r) => (
            <div key={r.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
              <div className="flex items-center gap-3">
                {/* avatar */}
                {r.avatar ? (
                  <img src={r.avatar} alt={r.title} className="w-9 h-9 rounded-full" />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-gray-200" />
                )}

                <div>
                  <div className="font-semibold text-sm text-gray-800">{r.title}</div>
                  <div className="text-xs text-gray-400">{friendlyDate(r.date)}</div>
                </div>
              </div>

              <div className="font-bold text-sm text-gray-900">
                {fmtINR(r.amount)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
