//frontend/src/app/dashboard/my-bank/page.tsx
'use client'

import React, { useEffect, useState } from "react";
import { Eye, EyeOff, Plus, LogOut } from "lucide-react";
import Link from "next/link";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

export type BankAccount = {
  id: string;
  bankName: string;
  holderName?: string;
  accountNumber?: string;
  currency?: string;
  balance?: number;
  type?: "Savings" | "Checking" | "Credit" | "Other";
  logoColor?: string;
  raw_meta?: any;
  consentId?: string | null; // <-- important: used for revoke
};

function formatCurrency(amount: number, currency = "INR") {
  const code = currency === "INR" ? "INR" : currency;
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: code,
    maximumFractionDigits: 2,
  }).format(amount);
}

function maskAccount(acc: string | undefined) {
  if (!acc) return "•••• •••• ••••";
  const last4 = acc.slice(-4);
  return acc.length <= 4 ? acc : `•••• •••• ${last4}`;
}

export default function MyBankPage() {
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNumbers, setShowNumbers] = useState(false);
  const [revokingMap, setRevokingMap] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/accounts`, {
          credentials: "include",
        });
        if (!mounted) return;
        const json = await res.json();
        if (json && json.accounts) {
          // parse some fields for UI; include consentId
          const parsed = json.accounts.map((a: any) => {
            const raw = a.raw_meta || {};
            const summary = (raw && raw.summary) || (raw.account && raw.account.summary) || null;
            const balance = summary ? parseFloat(summary.currentBalance || summary.currentBalance || 0) : 0;
            return {
              id: String(a.id),
              bankName: a.bank_name || (raw && raw.fip) || "Bank",
              holderName:
                (raw &&
                  raw.profile &&
                  raw.profile.holders &&
                  raw.profile.holders.holder &&
                  raw.profile.holders.holder[0] &&
                  raw.profile.holders.holder[0].name) ||
                "You",
              accountNumber: a.account_masked || (raw && raw.maskedAccNumber) || undefined,
              currency: a.currency || (summary && summary.currency) || "INR",
              balance,
              type: a.account_type || (summary && summary.type) || "Other",
              logoColor: "bg-gradient-to-r from-indigo-500 to-purple-500",
              raw_meta: a.raw_meta,
              consentId: a.consent_id || raw.consentId || raw.consent?.id || null,
            } as BankAccount;
          });
          setAccounts(parsed);
        } else {
          setAccounts([]);
        }
      } catch (err) {
        console.error("Failed to load accounts", err);
        setAccounts([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const totalBalance = accounts.reduce((s, a) => s + (a.balance || 0), 0);

  // Revoke (disconnect) consent -> backend
  async function handleDisconnect(consentId?: string | null, accountId?: string) {
    if (!consentId) {
      setErrors((e) => ({ ...e, [accountId || "unknown"]: "No consent id available for this account." }));
      return;
    }

    const confirmed = window.confirm("Disconnect this bank account? This will revoke the consent and remove associated data.");
    if (!confirmed) return;

    // set revoking state
    setRevokingMap((m) => ({ ...m, [consentId]: true }));
    setErrors((e) => ({ ...e, [consentId]: "" }));

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/setu/consents/${encodeURIComponent(consentId)}/revoke`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: "User requested revoke" }),
      });
      const json = await (async () => {
        try {
          return await res.json();
        } catch {
          return { ok: false };
        }
      })();

      if (!res.ok) {
        console.error("Revoke failed:", json);
        setErrors((e) => ({ ...e, [consentId]: (json && json.error) || "Failed to disconnect account" }));
        setRevokingMap((m) => ({ ...m, [consentId]: false }));
        return;
      }

      // success: remove account(s) with this consentId from the UI
      setAccounts((prev) => prev.filter((a) => a.consentId !== consentId));
      // optionally show a short success message (we use console for now)
      console.log("Revoke success:", json);
    } catch (err) {
      console.error("Revoke error", err);
      setErrors((e) => ({ ...e, [consentId]: "Network error while disconnecting" }));
    } finally {
      setRevokingMap((m) => ({ ...m, [consentId]: false }));
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <header className="rounded-2xl bg-white shadow-md p-6 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900">My Bank</h1>
              <p className="text-sm text-slate-500">Overview of connected accounts & balances</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-slate-500">Connected accounts</p>
              <p className="text-lg font-medium">{loading ? "..." : accounts.length}</p>
            </div>

            <button
              onClick={() => setShowNumbers((s) => !s)}
              className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-slate-50"
            >
              {showNumbers ? <EyeOff size={16} /> : <Eye size={16} />}
              <span>{showNumbers ? "Hide numbers" : "Show numbers"}</span>
            </button>

            <Link href="./connect-bank" className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-5 py-2 rounded-lg shadow-lg hover:scale-105 transition-transform duration-200">
              <Plus size={16} />
              <span>Connect New Bank</span>
            </Link>
          </div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-1 gap-6">
          <div>
            <div className="rounded-2xl bg-white shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold">Total balance</h2>
                  <p className="text-sm text-slate-500">Across all connected accounts</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-500">Currency</p>
                  <p className="text-xl font-semibold">INR</p>
                </div>
              </div>

              <div className="mt-3 mb-6 flex items-center gap-6">
                <div className="rounded-xl p-4 bg-gradient-to-r from-yellow-400 to-orange-400 text-white">
                  <h3 className="text-xs uppercase">Combined</h3>
                  <p className="text-2xl font-bold mt-1">{loading ? "..." : formatCurrency(totalBalance, "INR")}</p>
                </div>
              </div>

              <hr className="my-4" />

              <div>
                <h3 className="font-medium mb-3">Accounts</h3>

                {loading ? (
                  <div className="text-slate-500">Loading accounts...</div>
                ) : (
                  <div className="space-y-3">
                    {accounts.map((acc) => (
                      <article key={acc.id} className="flex items-center justify-between p-3 rounded-lg border hover:shadow-sm">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${acc.logoColor || "bg-slate-300"}`}>
                            <span className="font-semibold text-sm">{(acc.bankName || "Bank").split(" ").map((w) => w[0]).slice(0,2).join("")}</span>
                          </div>
                          <div>
                            <p className="font-medium">{acc.bankName}</p>
                            <p className="text-sm text-slate-500">{acc.type} • {acc.holderName}</p>
                          </div>
                        </div>

                        <div className="text-right flex items-center gap-4">
                          <div className="text-right mr-4">
                            <p className="font-semibold">{showNumbers ? formatCurrency(acc.balance || 0, acc.currency) : maskAccount(acc.accountNumber)}</p>
                            <p className="text-xs text-slate-400">Account ID: {acc.id}</p>
                          </div>

                          {/* Disconnect button (visible only if we have consentId) */}
                          {acc.consentId ? (
                            <div className="flex flex-col items-end gap-1">
                              <button
                                onClick={() => handleDisconnect(acc.consentId, acc.id)}
                                disabled={!!revokingMap[acc.consentId]}
                                className="flex items-center gap-2 px-3 py-1 rounded-lg border text-sm text-red-700 hover:bg-red-50 disabled:opacity-60"
                                title="Disconnect this bank account"
                              >
                                <LogOut size={14} />
                                {revokingMap[acc.consentId] ? "Disconnecting..." : "Disconnect"}
                              </button>
                              {errors[acc.consentId || acc.id] && (
                                <p className="text-xs text-red-600">{errors[acc.consentId || acc.id]}</p>
                              )}
                            </div>
                          ) : (
                            <div className="text-xs text-slate-400">No consent id</div>
                          )}
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
