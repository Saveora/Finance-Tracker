// frontend/src/app/dashboard/connect-bank/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Banknote, PlusCircle, ShieldCheck, Link2 } from "lucide-react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

export default function ConnectBankPage() {
  const searchParams = useSearchParams();
  const success = searchParams.get("success");
  const consentId = searchParams.get("id");

  const [showForm, setShowForm] = useState(false);
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [connectedBanks, setConnectedBanks] = useState<any[]>([]);

  useEffect(() => {
    // If redirected back from bank with success, call backend to get accounts for this consent
    if (success === "true" && consentId) {
      setMessage(`Bank connected successfully! Consent ID: ${consentId}`);
      (async () => {
        try {
          const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/accounts?consentId=${consentId}`, {
            credentials: "include",
          });
          const json = await res.json();
          if (json && json.accounts) {
            // convert into same shape as before for UI
            const mapped = json.accounts.map((a: any) => {
              const raw = a.raw_meta || {};
              const summary = raw && raw.summary ? raw.summary : (raw.account && raw.account.summary) || {};
              return {
                id: a.id,
                name: a.bank_name || raw.fip || "Bank",
                accountNumber: a.account_masked || raw.maskedAccNumber || "**** ****",
                balance: parseFloat(summary.currentBalance || 0) || 0,
                logo: null,
              };
            });
            setConnectedBanks(mapped);
          }
        } catch (err) {
          console.error("Failed to fetch connected accounts for consent", err);
        }
      })();
    } else if (success === "false") {
      setMessage("Bank connection failed or canceled.");
    }
  }, [success, consentId]);

  function validateMobile(m: string) {
    return /^(\+91|91)?[6-9]\d{9}$/.test(m.replace(/\s+/g, ""));
  }

  async function handleConnect(e: { preventDefault: () => void }) {
    e.preventDefault();
    setError("");
    if (!validateMobile(mobile)) {
      setError("Enter a valid 10-digit Indian mobile number.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        vua: `${mobile}@onemoney`,
        durationMonths: 12,
        purpose: "102",
        fetchType: "ONETIME",
      };

      const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/setu/consents`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok) {
        setError(result?.error || "Failed to create consent");
        setLoading(false);
        return;
      }

      const redirectUrl =
        result?.data?.url ||
        result?.data?.consentUrl ||
        result?.data?.consent?.url ||
        result?.redirectUrl;

      if (redirectUrl) {
        window.location.href = redirectUrl;
      } else {
        setError("No consent URL returned by Setu. Inspect server logs.");
      }
    } catch (err) {
      console.error(err);
      setError("Unexpected error. Check console.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6">
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-green-100 text-green-800 rounded-lg"
        >
          {message}
        </motion.div>
      )}

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Connect Bank Accounts</h1>
          <p className="text-gray-500 mt-1">Manage all your linked bank accounts in one place.</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:scale-105 transform transition text-white px-5 py-2 rounded-lg shadow-lg"
        >
          <PlusCircle size={18} />
          Connect New Bank
        </button>
      </div>

      <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {connectedBanks.length > 0 ? (
          connectedBanks.map(bank => (
            <motion.div key={bank.id} className="bg-white rounded-xl shadow-md p-5 border border-gray-100 flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-md" />
                <div>
                  <h2 className="text-lg font-semibold">{bank.name || bank.id}</h2>
                  <p className="text-gray-500">{bank.accountNumber}</p>
                </div>
              </div>
              <div className="mt-auto">
                <p className="text-sm text-gray-500">Balance</p>
                <p className="text-xl font-bold text-green-600">₹{(bank.balance || 0).toLocaleString("en-IN")}</p>
              </div>
            </motion.div>
          ))
        ) : (
          // If none, show placeholders or previously connected banks
          <div className="col-span-3 text-gray-500">No connected banks found for this consent yet.</div>
        )}
      </motion.div>

      {/* rest of UI (security panel & how to connect) unchanged */}
      <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="mt-12 bg-gradient-to-r from-sky-50 to-indigo-50 border border-indigo-100 p-6 rounded-xl flex flex-col md:flex-row items-center gap-6">
        <ShieldCheck className="text-indigo-500" size={40} />
        <div>
          <h3 className="text-xl font-semibold">Bank-Level Security</h3>
          <p className="text-gray-600">Your bank credentials are never stored. We use encrypted connections and secure authentication to protect your financial data.</p>
        </div>
      </motion.div>

      {/* connect modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}>
              <h2 className="text-xl font-semibold mb-3">Connect a New Bank</h2>
              <p className="text-sm text-gray-500 mb-4">
                Enter the mobile number linked to your bank account. You will be redirected to
                the secure consent screen to approve access.
              </p>

              <form onSubmit={handleConnect} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mobile number</label>
                  <input
                    type="tel"
                    name="mobile"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="e.g. 9876543210"
                    required
                    className="w-full border rounded-lg px-4 py-2"
                  />
                </div>

                {error && <div className="text-sm text-red-600">{error}</div>}

                <div className="flex gap-3">
                  <button type="submit" disabled={loading} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg flex justify-center items-center">
                    {loading ? "Connecting..." : "Connect"}
                  </button>
                  <button type="button" onClick={() => { setShowForm(false); setError(""); }} className="flex-1 border border-gray-300 py-2 rounded-lg">
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
