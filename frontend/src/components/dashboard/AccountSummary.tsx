"use client";

import React, { useEffect, useMemo, useState } from "react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import StatCard from "./StatCard";
import { IndianRupee, Wallet } from "lucide-react";

type Account = {
  id: number | string;
  bank_name?: string;
  account_masked?: string;
  raw_meta?: any;
};

type BackendTxn = {
  id: string;
  amount: number;
  direction: "credit" | "debit";
};

function formatRupee(n: number) {
  return `₹${n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function AccountSummary(props: { accounts: Account[]; selectedAccountId: string }) {
  const { accounts = [], selectedAccountId } = props;

  const [loadingSummary, setLoadingSummary] = useState(false);
  const [txTotalCredit, setTxTotalCredit] = useState(0);
  const [txTotalDebit, setTxTotalDebit] = useState(0);
  const [currentBalance, setCurrentBalance] = useState<number | null>(null);
  const [loadingAccounts, setLoadingAccounts] = useState(false);

  // Read balance from raw meta safely
  function readAccountBalance(a: Account) {
    try {
      const raw = a?.raw_meta || {};
      const summary = raw?.summary ?? raw?.account?.summary ?? {};
      const rawBalance = summary?.currentBalance ?? summary?.currentBalanceValue ?? raw?.balance ?? raw?.currentBalance;
      return parseFloat(String(rawBalance || 0)) || 0;
    } catch {
      return 0;
    }
  }

  const allAccountsBalance = useMemo(() => accounts.reduce((s, a) => s + readAccountBalance(a), 0), [accounts]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoadingSummary(true);
      setTxTotalCredit(0);
      setTxTotalDebit(0);
      setCurrentBalance(null);
      setLoadingAccounts(false);

      try {
        if (selectedAccountId && selectedAccountId !== "ALL") {
          const acct = accounts.find(a => String(a.id) === String(selectedAccountId));
          if (acct) setCurrentBalance(readAccountBalance(acct));
          else setCurrentBalance(null);
        } else {
          setCurrentBalance(allAccountsBalance);
        }

        const limit = 200;
        let url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/transactions?limit=${limit}&offset=0`;
        if (selectedAccountId && selectedAccountId !== "ALL") {
          url += `&accountId=${encodeURIComponent(String(selectedAccountId))}`;
        }
        const res = await fetchWithAuth(url, { credentials: "include" });
        const json = await res.json();
        if (!mounted) return;

        const list: BackendTxn[] = Array.isArray(json.transactions)
          ? json.transactions.map((t: any) => ({
              id: String(t.id),
              amount: Number(t.amount || 0),
              direction: t.direction === "debit" ? "debit" : "credit",
            }))
          : [];

        let credits = 0, debits = 0;
        for (const tx of list) {
          if (tx.direction === "credit") credits += Number(tx.amount || 0);
          else debits += Number(tx.amount || 0);
        }
        setTxTotalCredit(credits);
        setTxTotalDebit(debits);
      } catch (err) {
        console.error("Failed to fetch transaction summary", err);
        setTxTotalCredit(0);
        setTxTotalDebit(0);
      } finally {
        if (mounted) setLoadingSummary(false);
      }
    })();

    return () => { mounted = false; };
  }, [selectedAccountId, accounts, allAccountsBalance]);

  return (
    <div className="w-full">
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Deposits"
          amount={loadingSummary ? "Loading..." : formatRupee(txTotalCredit)}
          icon={<IndianRupee size={28} />}
          iconBgColor="bg-sky-100"
          iconTextColor="text-sky-600"
          borderColor="border-t-sky-500"
        />

        <StatCard
          title="Spent"
          amount={loadingSummary ? "Loading..." : formatRupee(txTotalDebit)}
          icon={<IndianRupee size={28} />}
          iconBgColor="bg-orange-100"
          iconTextColor="text-orange-600"
          borderColor="border-t-orange-500"
        />

        <StatCard
          title="Total Current Balance"
          amount={loadingAccounts || loadingSummary ? "Loading..." : currentBalance !== null ? formatRupee(currentBalance) : "—"}
          icon={<Wallet size={28} />}
          iconBgColor="bg-green-100"
          iconTextColor="text-green-600"
          borderColor="border-t-green-500"
        />
      </div>
    </div>
  );
}
