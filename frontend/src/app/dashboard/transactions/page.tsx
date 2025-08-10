'use client';

import { useEffect, useRef, useState } from 'react';
import { ReceiptText, Download } from 'lucide-react';

interface Transaction {
  id: string;
  description: string;
  date: string;
  status: 'Completed' | 'Pending' | 'Failed';
  amount: number;
  currency: string;
  direction: 'debit' | 'credit';
  sender: string;
  recipient: string;
}

const transactions: Transaction[] = [
  {
    id: 'TXN001598174',
    description: 'Sent to John Doe',
    date: '2025-08-08T19:23:45+05:30',
    status: 'Completed',
    amount: 1599,
    currency: 'INR',
    direction: 'debit',
    sender: 'Me',
    recipient: 'John Doe',
  },
  {
    id: 'TXN001597112',
    description: 'Salary Deposit',
    date: '2025-08-01T09:00:10+05:30',
    status: 'Completed',
    amount: 55000,
    currency: 'INR',
    direction: 'credit',
    sender: 'Acme Corp',
    recipient: 'Me',
  },
  {
    id: 'TXN001595841',
    description: 'Netflix Subscription',
    date: '2025-07-28T23:18:05+05:30',
    status: 'Completed',
    amount: 649,
    currency: 'INR',
    direction: 'debit',
    sender: 'Me',
    recipient: 'Netflix',
  },
  {
    id: 'TXN001595700',
    description: 'Zomato Order',
    date: '2025-07-27T20:47:30+05:30',
    status: 'Pending',
    amount: 351,
    currency: 'INR',
    direction: 'debit',
    sender: 'Me',
    recipient: 'Zomato',
  },
  {
    id: 'TXN001595230',
    description: 'Received from Jane',
    date: '2025-07-25T15:34:12+05:30',
    status: 'Completed',
    amount: 1000,
    currency: 'INR',
    direction: 'credit',
    sender: 'Jane',
    recipient: 'Me',
  },
  {
    id: 'TXN001595221',
    description: 'Flipkart Electronics',
    date: '2025-07-22T16:12:42+05:30',
    status: 'Failed',
    amount: 7999,
    currency: 'INR',
    direction: 'debit',
    sender: 'Me',
    recipient: 'Flipkart',
  },
];

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
  return new Date(dateString).toLocaleString('en-IN', options);
}

const pageSize = 3;

export default function TransactionsPage() {
  const [downloading, setDownloading] = useState(false);
  const [page, setPage] = useState(1);
  const [animatePageKey, setAnimatePageKey] = useState(0);

  const totalPages = Math.ceil(transactions.length / pageSize);
  const paginatedTxns = transactions.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    setAnimatePageKey((prev) => prev + 1);
  }, [page]);

  // Inject animation CSS once
  const addedAnimation = useRef(false);
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

  // Helper: Show counterparty with "To" or "From" labels.
  function counterparty(txn: Transaction) {
    if (txn.sender === 'Me' && txn.recipient !== 'Me') return `To ${txn.recipient}`;
    if (txn.recipient === 'Me' && txn.sender !== 'Me') return `From ${txn.sender}`;
    return '';
  }

  return (
    <div className="max-w-5xl mx-auto py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Transaction History</h1>
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

      {/* Outer container with subtle neutral border */}
      <div className="bg-white border-[1.5px] border-gray-300 rounded-2xl p-[3px] shadow">
        {/* Inner container with lighter neutral border and padding */}
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
              {paginatedTxns.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400">
                    No transactions to display.
                  </td>
                </tr>
              ) : (
                paginatedTxns.map((txn, idx) => (
                  <tr
                    key={txn.id}
                    className="border-t hover:bg-gray-50 tnx-anim-row"
                    style={{ animationDelay: `${idx * 70}ms` }}
                  >
                    <td className="py-3 pr-4 font-medium text-[#18191b]">
                      {txn.description}
                    </td>
                    <td className="py-3 pr-4">{counterparty(txn)}</td>
                    <td className="py-3 pr-4 text-sm text-gray-500">
                      {formatDateTime(txn.date)}
                    </td>
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
                        {txn.status}
                      </span>
                    </td>
                    <td
                      className={`py-3 pr-4 text-right font-semibold ${
                        txn.direction === 'debit'
                          ? 'text-red-600'
                          : 'text-green-600'
                      }`}
                    >
                      {txn.direction === 'credit' ? '+' : '-'}
                      ₹{txn.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 pr-4 text-[13px] text-gray-600">{txn.id}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination controls */}
          <div className="flex items-center justify-center gap-2 mt-5">
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                className={`w-8 h-8 rounded border transition font-semibold duration-150 ${
                  page === idx + 1
                    ? 'bg-yellow-400 text-[#101728] border-yellow-300 shadow'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border-gray-300'
                }`}
                onClick={() => setPage(idx + 1)}
                disabled={page === idx + 1}
                aria-current={page === idx + 1 ? 'page' : undefined}
                style={{
                  transform: page === idx + 1 ? 'scale(1.1)' : undefined,
                  boxShadow:
                    page === idx + 1 ? '0 2px 8px 0 #ffe08233' : undefined,
                }}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
