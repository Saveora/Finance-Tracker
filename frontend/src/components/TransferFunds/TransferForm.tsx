// src/components/TransferFunds/TransferForm.tsx
'use client';

import React, { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiSend, FiPlus } from 'react-icons/fi';
import BankSelector from './BankSelector';

export type TransferPayload = {
  amount: number;
  to: string;
  currency: 'INR' | 'USD';
  method: 'BANK' | 'UPI';
  note?: string;
};

type Account = {
  id: string;
  bank: string;
  last4: string;
  balance: number;
  currency?: 'INR' | 'USD';
};

type FormValues = {
  amount: number;
  currency: 'INR' | 'USD';
  toAccount: string;
  method: 'BANK' | 'UPI';
  note?: string;
};

type Props = {
  accounts: Account[]; // list of user accounts
  primaryAccountId: string; // currently selected primary account
  onSetPrimary: (accountId: string) => void; // notify parent when primary changes
  onTransferComplete?: (data: TransferPayload) => void;
};

const TransferForm: React.FC<Props> = ({ accounts, primaryAccountId, onSetPrimary, onTransferComplete }) => {
  const { register, handleSubmit, watch, reset, setValue, formState: { errors } } = useForm<FormValues>({
    defaultValues: { currency: 'INR', method: 'BANK' },
  });

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [preview, setPreview] = useState<FormValues | null>(null);

  const selectedAccount = useMemo(() => accounts.find(a => a.id === primaryAccountId) || accounts[0], [accounts, primaryAccountId]);

  const onSubmit = (data: FormValues) => {
    setPreview(data);
    setConfirmOpen(true);
    console.log('[TransferForm] onSubmit -> preview', data);
  };

  const confirmTransfer = () => {
    if (!preview) return;
    setConfirmOpen(false);

    const payload: TransferPayload = {
      amount: preview.amount,
      to: preview.toAccount,
      currency: preview.currency,
      method: preview.method,
      note: preview.note,
    };

    if (typeof onTransferComplete === 'function') {
      try {
        onTransferComplete(payload);
        console.log('[TransferForm] onTransferComplete called.');
      } catch (err) {
        console.error('[TransferForm] onTransferComplete error:', err);
      }
    } else {
      console.warn('[TransferForm] onTransferComplete not provided');
    }

    reset({ currency: 'INR', method: 'BANK' });
    setPreview(null);
  };

  const amount = watch('amount');

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold">Send Money</h2>
          <div className="text-sm text-slate-500">Transfer securely to saved accounts or via UPI</div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => alert('Open Add Beneficiary UI (implement separately)')}
            className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-slate-900 px-3 py-1.5 rounded-md"
          >
            <FiPlus /> Add beneficiary
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* FROM: account selector */}
        <div>
          <label className="text-sm text-slate-600">From</label>

          <div className="mt-2 p-3 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div>
                <div className="text-sm font-medium">{selectedAccount?.bank} {selectedAccount ? `(Primary)` : ''}</div>
                <div className="text-xs text-slate-500">Account •••• {selectedAccount?.last4}</div>
              </div>

              {/* Inline account picker (select) */}
              <div>
                <select
                  value={selectedAccount?.id}
                  onChange={(e) => {
                    const newId = e.target.value;
                    onSetPrimary(newId);
                  }}
                  className="rounded-md border border-slate-200 px-3 py-1"
                >
                  {accounts.map(acc => (
                    <option key={acc.id} value={acc.id}>
                      {acc.bank} •••• {acc.last4} ({acc.currency ?? 'INR'})
                    </option>
                  ))}
                </select>
                <div className="text-xs text-slate-400 mt-1">Choose which account to pay from</div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-sm font-semibold">
                {selectedAccount?.currency === 'USD' ? '$ ' : '₹ '}
                {selectedAccount?.balance?.toLocaleString()}
              </div>
              <div className="text-xs text-slate-400">Available</div>
            </div>
          </div>
        </div>

        {/* TO */}
        <div>
          <label className="text-sm text-slate-600">To</label>
          <div className="mt-2">
            <BankSelector setValue={setValue} register={register} />
          </div>
        </div>

        {/* AMOUNT & CURRENCY */}
        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-2">
            <label className="text-sm text-slate-600">Amount</label>
            <input
              {...register('amount', { required: true, min: 1 })}
              type="number"
              step="0.01"
              placeholder="Enter amount"
              className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-300"
            />
            {errors.amount && <div className="text-xs text-red-500 mt-1">Enter a valid amount</div>}
          </div>

          <div>
            <label className="text-sm text-slate-600">Currency</label>
            <select {...register('currency')} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2">
              <option value="INR">INR</option>
              <option value="USD">USD</option>
            </select>
          </div>
        </div>

        {/* NOTE */}
        <div>
          <label className="text-sm text-slate-600">Note (optional)</label>
          <input {...register('note')} placeholder="For rent, groceries, etc." className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" />
        </div>

        {/* FOOTER */}
        <div className="flex items-center justify-between">
          <div className="text-slate-500 text-sm">
            Fee: <span className="font-medium">₹ 0.00</span> • Estimated arrival: <span className="font-medium">Instant</span>
          </div>

          <button type="submit" className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg">
            <FiSend /> Send {amount ? `₹ ${Number(amount).toFixed(2)}` : ''}
          </button>
        </div>
      </form>

      {/* Confirmation modal */}
      {confirmOpen && preview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md bg-white rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-2">Confirm Transfer</h3>
            <p className="text-sm text-slate-600 mb-4">Please verify the details before confirming.</p>

            <div className="space-y-2 mb-6">
              <div className="flex justify-between"><span className="text-sm text-slate-500">To</span><span className="font-medium">{preview.toAccount}</span></div>
              <div className="flex justify-between"><span className="text-sm text-slate-500">Amount</span><span className="font-medium">{preview.currency} {preview.amount}</span></div>
              <div className="flex justify-between"><span className="text-sm text-slate-500">Method</span><span className="text-sm font-medium">{preview.method === 'UPI' ? 'UPI' : 'Bank transfer'}</span></div>
              {preview.note && <div className="flex justify-between"><span className="text-sm text-slate-500">Note</span><span className="text-sm">{preview.note}</span></div>}
            </div>

            <div className="flex gap-3 justify-end">
              <button className="px-4 py-2 rounded-md border" onClick={() => setConfirmOpen(false)}>Cancel</button>
              <button className="px-4 py-2 rounded-md bg-slate-900 text-white" onClick={() => confirmTransfer()}>Confirm & Send</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransferForm;
