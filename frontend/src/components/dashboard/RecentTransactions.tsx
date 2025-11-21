"use client";

import React, { useEffect, useState } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Film,
  ShoppingCart,
  Utensils,
} from "lucide-react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

type BackendTxn = {
  id: string;
  description?: string;
  date?: string;
  status?: string;
  amount: number;
  currency?: string;
  direction?: "debit" | "credit";
  account?: {
    id?: string;
    bankName?: string;
    masked?: string;
  };
  raw?: any;
};

function fmtINR(amount: number) {
  return `₹${Math.abs(Number(amount || 0)).toLocaleString("en-IN")}`;
}

function friendlyDate(dateStr?: string) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function pickIcon(txn: BackendTxn) {
  const desc = (txn.description || "").toLowerCase();
  if (desc.includes("amazon") || desc.includes("shopping")) return <ShoppingCart size={20} />;
  if (desc.includes("netflix") || desc.includes("movie") || desc.includes("film")) return <Film size={20} />;
  if (desc.includes("zomato") || desc.includes("restaurant") || desc.includes("food")) return <Utensils size={20} />;
  if (txn.direction === "credit") return <ArrowDownLeft size={20} className="text-green-500" />;
  return <ArrowUpRight size={20} className="text-red-500" />;
}

export default function RecentTransactions({
  selectedAccountId,
}: {
  selectedAccountId: string;
}) {
  const [txns, setTxns] = useState<BackendTxn[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);

      try {
        const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/transactions?limit=200&offset=0`;
        const res = await fetchWithAuth(url, { method: "GET" });
        if (!mounted) return;

        const json = await res.json().catch(() => null);
        const list: any[] = Array.isArray(json?.transactions) ? json.transactions : [];

        // Normalize
        const normalized: BackendTxn[] = list.map((r: any) => ({
          id: String(r.id ?? r.txn_ref ?? r.txnId ?? r._id ?? Math.random()),
          description: r.description ?? r.narration ?? r.raw?.narration ?? "",
          date: r.date ?? r.txn_date ?? r.raw?.transactionTimestamp ?? new Date().toISOString(),
          status: r.status ?? r.raw?.status ?? "Completed",
          amount: Number(r.amount ?? r.amountNum ?? r.raw?.amount ?? 0),
          currency: r.currency ?? r.raw?.currency ?? "INR",
          direction: r.direction ?? (typeof r.amount === "number" && r.amount < 0 ? "debit" : "credit"),
          account: r.account ?? {
            id: r.account?.id,
            bankName: r.account?.bankName,
            masked: r.account?.masked,
          },
          raw: r.raw ?? r,
        }));

        // Filter by account if selected
        let filtered = normalized;
        if (selectedAccountId !== "ALL") {
          filtered = normalized.filter((t) => t.account?.id == selectedAccountId);
        }

        // Sort by DATE desc (fix for wrong ordering issue)
        filtered.sort((a, b) => {
          const ta = a.date ? +new Date(a.date) : 0;
          const tb = b.date ? +new Date(b.date) : 0;
          return tb - ta;
        });

        setTxns(filtered.slice(0, 5));
      } catch (err) {
        console.error("Failed to fetch recent transactions", err);
        setTxns([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [selectedAccountId]);

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow duration-300 border-t-4 border-t-purple-500">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-lg text-gray-800">Recent Transactions</h2>
        <a href="/dashboard/transactions" className="text-sm text-sky-600 hover:text-sky-800 font-semibold transition-colors">
          View All
        </a>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-xs font-medium text-gray-400 uppercase">
              <th className="py-2 px-2">Description</th>
              <th className="py-2 px-2">Date</th>
              <th className="py-2 px-2 text-right">Amount</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr><td colSpan={3} className="py-6 text-center text-gray-400">Loading...</td></tr>
            ) : txns.length === 0 ? (
              <tr><td colSpan={3} className="py-6 text-center text-gray-500">No recent transactions</td></tr>
            ) : (
              txns.map((t) => (
                <tr key={t.id} className="text-sm border-t hover:bg-gray-50">
                  <td className="py-3 px-2 flex items-center gap-3">
                    {/* Show account badge only for ALL */}
                    {selectedAccountId === "ALL" && t.account?.bankName && (
                      <span className="text-[10px] px-2 py-1 rounded-full bg-gray-200 text-gray-700 border border-gray-300 select-none">
                        {t.account.bankName}{t.account.masked ? ` • ${t.account.masked}` : ""}
                      </span>
                    )}
                    {pickIcon(t)}
                    <span className="font-medium">{t.description || "-"}</span>
                  </td>

                  <td className="py-3 px-2 text-gray-500">{friendlyDate(t.date)}</td>

                  <td className={`py-3 px-2 text-right font-semibold ${t.direction === "credit" ? "text-green-600" : "text-red-600"}`}>
                    {t.direction === "credit" ? "+" : "-"}{fmtINR(t.amount)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
