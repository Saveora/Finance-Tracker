// src/app/dashboard/settings/page.tsx
import Header from '@/components/dashboard/Header';

'use client';

import { useState } from 'react';
import { User, Lock, Bell, CreditCard, Globe } from 'lucide-react';

export default function SettingsPage() {
  // Example local state – in a real app this would come from your database/user profile settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [currency, setCurrency] = useState('USD');

  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* Page title */}
      <div className="flex items-center gap-3 mb-8">
        <User className="w-8 h-8 text-yellow-400" />
        <h1 className="text-2xl font-bold text-[#101728]">Settings</h1>
      </div>

      {/* Account Info Section */}
      <section className="bg-white rounded-xl border shadow p-6 mb-8">
        <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-gray-500" /> Account Information
        </h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            alert('Account info updated!');
          }}
          className="flex flex-col gap-4 max-w-md"
        >
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              type="text"
              defaultValue="Diptesh"
              className="w-full border rounded p-2 bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              defaultValue="user@financeapp.com"
              className="w-full border rounded p-2 bg-gray-50"
            />
          </div>
          <button
            type="submit"
            className="self-start px-4 py-2 bg-yellow-400 text-black font-semibold rounded hover:bg-yellow-500 transition"
          >
            Save Changes
          </button>
        </form>
      </section>

      {/* Security Section */}
      <section className="bg-white rounded-xl border shadow p-6 mb-8">
        <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <Lock className="w-5 h-5 text-gray-500" /> Security
        </h2>
        <div className="flex flex-col gap-4 max-w-md">
          <button
            onClick={() => alert('Change password flow')}
            className="px-4 py-2 border rounded bg-gray-50 hover:bg-gray-100 transition text-left"
          >
            Change Password
          </button>
          <button
            onClick={() => alert('2FA flow')}
            className="px-4 py-2 border rounded bg-gray-50 hover:bg-gray-100 transition text-left"
          >
            Enable Two-Factor Authentication
          </button>
        </div>
      </section>

      {/* Notifications Section */}
      <section className="bg-white rounded-xl border shadow p-6 mb-8">
        <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5 text-gray-500" /> Notifications
        </h2>
        <div className="flex flex-col gap-3">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              className="w-4 h-4"
              checked={emailNotifications}
              onChange={(e) => setEmailNotifications(e.target.checked)}
            />
            Email Notifications
          </label>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              className="w-4 h-4"
              checked={smsNotifications}
              onChange={(e) => setSmsNotifications(e.target.checked)}
            />
            SMS Notifications
          </label>
        </div>
      </section>

      {/* Payment Preferences */}
      <section className="bg-white rounded-xl border shadow p-6 mb-8">
        <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-gray-500" /> Payment Preferences
        </h2>
        <div>
          <p className="text-sm text-gray-500 mb-2">Default Payment Method:</p>
          <button
            onClick={() => alert('Open payment methods page')}
            className="px-4 py-2 border rounded bg-gray-50 hover:bg-gray-100 transition"
          >
            Manage Cards & Bank Accounts
          </button>
        </div>
      </section>

      {/* Regional & Currency Settings */}
      <section className="bg-white rounded-xl border shadow p-6">
        <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <Globe className="w-5 h-5 text-gray-500" /> Regional Settings
        </h2>
        <div className="flex flex-col gap-3 max-w-xs">
          <label className="block text-sm font-medium">Currency</label>
          <select
            className="border rounded p-2 bg-gray-50"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
          >
            <option value="USD">USD — US Dollar</option>
            <option value="EUR">EUR — Euro</option>
            <option value="GBP">GBP — British Pound</option>
            <option value="INR">INR — Indian Rupee</option>
          </select>
        </div>
      </section>
    </div>
  );
}
