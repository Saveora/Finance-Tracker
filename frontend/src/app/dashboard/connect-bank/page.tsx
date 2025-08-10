"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Banknote, PlusCircle, ShieldCheck, Link2 } from "lucide-react";

const connectedBanks = [
  {
    id: 1,
    name: "HDFC Bank",
    accountNumber: "**** 2356",
    balance: 35420.75,
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/HDFC_Bank_Logo.svg/512px-HDFC_Bank_Logo.svg.png"
  },
  {
    id: 2,
    name: "SBI Bank",
    accountNumber: "**** 9876",
    balance: 22450.0,
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/State_Bank_of_India_logo.svg/512px-State_Bank_of_India_logo.svg.png"
  }
];

export default function ConnectBankPage() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    bankName: "",
    accountNumber: "",
    accountType: "savings",
    ifsc: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("New Bank Connected:", formData);
    alert("Bank connected successfully!");
    setShowForm(false);
    setFormData({ bankName: "", accountNumber: "", accountType: "savings", ifsc: "" });
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Connect Bank Accounts</h1>
          <p className="text-gray-500 mt-1">
            Manage all your linked bank accounts in one place.
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:scale-105 text-white px-5 py-2 rounded-lg shadow-lg transition-transform duration-300"
        >
          <PlusCircle size={20} />
          Connect New Bank
        </button>
      </div>

      {/* Connected Accounts */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {connectedBanks.map((bank) => (
          <motion.div
            key={bank.id}
            whileHover={{ scale: 1.03 }}
            className="bg-white rounded-xl shadow-md p-5 border border-gray-100 flex flex-col gap-4"
          >
            <div className="flex items-center gap-4">
              <img
                src={bank.logo}
                alt={bank.name}
                className="w-12 h-12 object-contain"
              />
              <div>
                <h2 className="text-lg font-semibold">{bank.name}</h2>
                <p className="text-gray-500">{bank.accountNumber}</p>
              </div>
            </div>
            <div className="mt-auto">
              <p className="text-sm text-gray-500">Balance</p>
              <p className="text-xl font-bold text-green-600">
                ₹{bank.balance.toLocaleString("en-IN")}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Security Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="mt-12 bg-gradient-to-r from-sky-50 to-indigo-50 border border-indigo-100 p-6 rounded-xl flex flex-col md:flex-row items-center gap-6"
      >
        <ShieldCheck className="text-indigo-500" size={40} />
        <div>
          <h3 className="text-xl font-semibold">Bank-Level Security</h3>
          <p className="text-gray-600">
            Your bank credentials are never stored. We use encrypted
            connections and secure authentication to protect your financial
            data.
          </p>
        </div>
      </motion.div>

      {/* How to Connect */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="mt-12"
      >
        <h3 className="text-xl font-semibold mb-4">How to connect your bank?</h3>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 bg-white rounded-lg shadow p-5 border border-gray-100">
            <Link2 className="text-indigo-500 mb-3" size={28} />
            <h4 className="font-semibold mb-2">1. Click “Connect New Bank”</h4>
            <p className="text-gray-600">
              Start by clicking the connect button at the top-right of this
              page.
            </p>
          </div>
          <div className="flex-1 bg-white rounded-lg shadow p-5 border border-gray-100">
            <ShieldCheck className="text-green-500 mb-3" size={28} />
            <h4 className="font-semibold mb-2">2. Authenticate Securely</h4>
            <p className="text-gray-600">
              Log in via your bank’s secure authentication process.
            </p>
          </div>
          <div className="flex-1 bg-white rounded-lg shadow p-5 border border-gray-100">
            <Banknote className="text-purple-500 mb-3" size={28} />
            <h4 className="font-semibold mb-2">3. Start Tracking</h4>
            <p className="text-gray-600">
              Once connected, your balances and transactions will update
              automatically.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Add Bank Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl font-semibold mb-4">Connect a New Bank</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleChange}
                  placeholder="Bank Name"
                  required
                  className="w-full border rounded-lg px-4 py-2"
                />
                <input
                  type="text"
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleChange}
                  placeholder="Account Number"
                  required
                  className="w-full border rounded-lg px-4 py-2"
                />
                <select
                  name="accountType"
                  value={formData.accountType}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-4 py-2"
                >
                  <option value="savings">Savings</option>
                  <option value="current">Current</option>
                  <option value="salary">Salary</option>
                </select>
                <input
                  type="text"
                  name="ifsc"
                  value={formData.ifsc}
                  onChange={handleChange}
                  placeholder="IFSC Code"
                  required
                  className="w-full border rounded-lg px-4 py-2"
                />
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg"
                  >
                    Connect
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 border border-gray-300 py-2 rounded-lg"
                  >
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
