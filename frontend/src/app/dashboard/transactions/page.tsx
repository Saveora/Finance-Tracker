// frontend/src/app/dashboard/transactions/page.tsx (or wherever your file is)
'use client';

import { useEffect, useRef, useState } from 'react';
import { Download } from 'lucide-react';
import { fetchWithAuth } from '@/lib/fetchWithAuth';

type BackendTxn = {
  id: string;
  description?: string;
  date: string;
  status?: string;
  amount: number;
  currency?: string;
  direction: 'debit' | 'credit';
  sender?: string;
  recipient?: string;
  account?: { id?: string; bankName?: string; masked?: string };
  raw?: any;
};

type Account = {
  id: number | string;
  bank_name?: string;
  account_masked?: string;
  account_type?: string;
  fip_account_id?: string | null;
};

interface Transaction extends BackendTxn {}

function formatDateTime(dateString: string) {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  };
  const d = new Date(dateString);
  return isNaN(d.getTime()) ? dateString : d.toLocaleString('en-IN', options);
}

const pageSize = 10;

export default function TransactionsPage() {
  const [downloading, setDownloading] = useState(false);
  const [page, setPage] = useState(1);
  const [animatePageKey, setAnimatePageKey] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [backendProvidedTotal, setBackendProvidedTotal] = useState(false);

  // Accounts + filter
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState<string>('ALL');
  const addedAnimation = useRef(false);

  useEffect(() => {
    setAnimatePageKey((prev) => prev + 1);
  }, [page, selectedAccountId]);

  // inject animations once
  useEffect(() => {
    if (!addedAnimation.current) {
      const style = document.createElement('style');
      style.innerHTML = `
@keyframes fadeInSlideUp { 
  from { opacity: 0; transform: translateY(18px); } 
  to { opacity: 1; transform: none; } 
}
.tnx-anim-row { 
  animation: fadeInSlideUp 0.6s cubic-bezier(.67,1.4,.43,1) both; 
}
@keyframes scalePopIn { 
  from { opacity: 0; transform: scale(.6); } 
  to { opacity: 1; transform: none; } 
}
.tnx-status-pop { 
  animation: scalePopIn 0.35s cubic-bezier(.42,1.6,.5,1.5) both; 
}
`;
      document.head.appendChild(style);
      addedAnimation.current = true;
    }
  }, []);

  // Fetch accounts once on mount
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/accounts`, {
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Failed fetching accounts');
        const json = await res.json();
        if (!mounted) return;
        const acctList: Account[] = Array.isArray(json.accounts) ? json.accounts : [];
        setAccounts(acctList);
        if (acctList.length === 1) {
          setSelectedAccountId(String(acctList[0].id));
        } else {
          setSelectedAccountId('ALL');
        }
      } catch (err) {
        console.error('Failed to load accounts', err);
        setAccounts([]);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // Fetch transactions when page OR selectedAccountId changes
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    (async () => {
      try {
        const limit = pageSize;
        const offset = (page - 1) * pageSize;
        let url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/transactions?limit=${limit}&offset=${offset}`;
        if (selectedAccountId && selectedAccountId !== 'ALL') {
          url += `&accountId=${encodeURIComponent(selectedAccountId)}`;
        }
        const res = await fetchWithAuth(url, { credentials: 'include' });
        if (!mounted) return;
        const json = await res.json();

        // If backend responded with ok:false or error, fallback gracefully
        if (!json) {
          setTransactions([]);
          setBackendProvidedTotal(false);
          setTotalCount(0);
          return;
        }

        // Expect backend to return { transactions: [...], total?: number }
        if (Array.isArray(json.transactions)) {
          setTransactions(json.transactions);

          if (typeof json.total === 'number') {
            setBackendProvidedTotal(true);
            setTotalCount(json.total);
          } else {
            // Backend didn't return total -> we cannot show accurate numbered pages.
            // Use heuristic: if returned results < limit then this is last page.
            setBackendProvidedTotal(false);
            if (json.transactions.length < limit) {
              // last page known: compute absolute total
              setTotalCount((page - 1) * limit + json.transactions.length);
            } else {
              // full page returned: unknown total; set an optimistic total to allow "Next" page.
              // We'll set totalCount = page * limit so that pagination UI can show "page" and optionally page+1
              setTotalCount(page * limit);
            }
          }
        } else {
          setTransactions([]);
          setBackendProvidedTotal(false);
          setTotalCount(0);
        }
      } catch (err) {
        console.error('Failed to fetch transactions', err);
        setTransactions([]);
        setTotalCount(0);
        setBackendProvidedTotal(false);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => { mounted = false; };
  }, [page, selectedAccountId]);

  // compute total pages only when backend provided reliable total
  const totalPages = backendProvidedTotal ? Math.max(1, Math.ceil(totalCount / pageSize)) : Math.max(1, page);

  function counterparty(txn: Transaction) {
    if (txn.sender === 'Me' && txn.recipient !== 'Me') return `To ${txn.recipient}`;
    if (txn.recipient === 'Me' && txn.sender !== 'Me') return `From ${txn.sender}`;
    if (txn.account && txn.account.masked) return txn.account.masked;
    return txn.recipient || txn.sender || '-';
  }

  // Small helper to present account option text
  function accountLabel(a: Account) {
    const name = a.bank_name || a.fip_account_id || 'Bank';
    const masked = a.account_masked ? ` • ${a.account_masked}` : '';
    return `${name}${masked}`;
  }

  // UI pagination handlers when backend doesn't provide total
  function onPrev() {
    if (page > 1) setPage(page - 1);
  }
  function onNext() {
    // If backend provided total, normal safety:
    if (backendProvidedTotal) {
      if (page < totalPages) setPage(page + 1);
    } else {
      // optimistic next: allow next if last fetch was a full page
      if (transactions.length === pageSize) {
        setPage(page + 1);
      }
    }
  }

  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Transaction History</h1>

        {/* Account selector */}
        <div className="ml-4">
          <label className="block text-xs text-gray-500">Filter by account</label>
          <select
            value={selectedAccountId}
            onChange={(e) => { setPage(1); setSelectedAccountId(e.target.value); }}
            className="mt-1 px-3 py-2 border rounded-lg bg-white"
          >
            <option value="ALL">All accounts</option>
            {accounts.map((a) => (
              <option key={String(a.id)} value={String(a.id)}>{accountLabel(a)}</option>
            ))}
          </select>
        </div>

        <button
          className="ml-auto flex items-center gap-2 px-4 py-2 bg-yellow-400 rounded text-[#101728] font-semibold border border-yellow-300 hover:bg-yellow-500 transition disabled:opacity-60"
          disabled={downloading}
          onClick={() => {
            setDownloading(true);
            setTimeout(() => {
              alert('Export/download not implemented in this demo');
              setDownloading(false);
            }, 1000);
          }}
        >
          <Download className="w-5 h-5" /> Export
        </button>
      </div>

      <div className="bg-white border-[1.5px] border-gray-300 rounded-2xl p-[3px] shadow">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <table className="min-w-full divide-y">
            <thead>
              <tr className="text-xs uppercase text-gray-500 tracking-wide">
                <th className="py-2 pr-4 text-left">Description</th>
                <th className="py-2 pr-4 text-left">Counterparty</th>
                <th className="py-2 pr-4 text-left">Date &amp; Time</th>
                <th className="py-2 pr-4 text-left">Status</th>
                <th className="py-2 pr-4 text-right">Amount</th>
                <th className="py-2 pr-4 text-left">Transaction ID</th>
              </tr>
            </thead>
            <tbody key={animatePageKey}>
              {loading ? (
                <tr><td colSpan={6} className="py-12 text-center text-gray-400">Loading transactions...</td></tr>
              ) : transactions.length === 0 ? (
                <tr><td colSpan={6} className="py-12 text-center text-gray-400">No transactions to display.</td></tr>
              ) : (
                transactions.map((txn, idx) => (
                  <tr key={txn.id} className="border-t hover:bg-gray-50 tnx-anim-row" style={{ animationDelay: `${idx * 70}ms` }}>
                    <td className="py-3 pr-4 font-medium text-[#18191b]">{txn.description || '-'}</td>
                    <td className="py-3 pr-4">{counterparty(txn)}</td>
                    <td className="py-3 pr-4 text-sm text-gray-500">{formatDateTime(txn.date)}</td>
                    <td className="py-3 pr-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-bold tnx-status-pop ${
                          txn.status === 'Completed'
                            ? 'text-green-600 bg-green-100'
                            : txn.status === 'Pending'
                            ? 'text-yellow-800 bg-yellow-100'
                            : 'text-red-700 bg-red-100'
                        }`}
                        style={{ animationDelay: `${300 + idx * 40}ms` }}
                      >
                        {txn.status || 'Unknown'}
                      </span>
                    </td>
                    <td className={`py-3 pr-4 text-right font-semibold ${txn.direction === 'debit' ? 'text-red-600' : 'text-green-600'}`}>
                      {txn.direction === 'credit' ? '+' : '-'}₹{Math.abs(txn.amount).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 pr-4 text-[13px] text-gray-600">{txn.id}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div className="flex items-center justify-center gap-2 mt-5">
            {backendProvidedTotal ? (
              // show numbered pages when backend returned an authoritative total
              Array.from({ length: Math.max(1, Math.ceil(totalCount / pageSize)) }).map((_, idx) => (
                <button
                  key={idx}
                  className={`w-8 h-8 rounded border transition font-semibold duration-150 ${page === idx + 1 ? 'bg-yellow-400 text-[#101728] border-yellow-300 shadow' : 'bg-white text-gray-600 hover:bg-gray-100 border-gray-300'}`}
                  onClick={() => setPage(idx + 1)}
                  disabled={page === idx + 1}
                  aria-current={page === idx + 1 ? 'page' : undefined}
                  style={{ transform: page === idx + 1 ? 'scale(1.1)' : undefined, boxShadow: page === idx + 1 ? '0 2px 8px 0 #ffe08233' : undefined }}
                >
                  {idx + 1}
                </button>
              ))
            ) : (
              // fallback: Prev / Next UI
              <>
                <button
                  onClick={onPrev}
                  disabled={page === 1}
                  className="px-3 py-2 rounded border bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Prev
                </button>
                <div className="px-3 py-2 text-sm">Page {page}</div>
                <button
                  onClick={onNext}
                  disabled={transactions.length < pageSize}
                  className="px-3 py-2 rounded border bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
