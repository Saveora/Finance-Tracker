// src/components/TransferFunds/BankSelector.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { UseFormSetValue, UseFormRegister } from 'react-hook-form';

type Props = {
  setValue: UseFormSetValue<any>;
  register: UseFormRegister<any>;
};

// mock saved beneficiaries (no "add beneficiary" option)
const mockBeneficiaries = [
  { id: 'icici-1234', label: 'Ravi Kumar •••• 5678 (ICICI Bank)' },
  { id: 'sbi-2345', label: 'Priya Sharma •••• 4321 (State Bank)' },
];

export default function BankSelector({ setValue, register }: Props) {
  const [method, setMethod] = useState<'BANK' | 'UPI'>('BANK');
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<string>(mockBeneficiaries[0].id);
  const [upiId, setUpiId] = useState<string>('');

  useEffect(() => {
    if (method === 'BANK') {
      setValue('method', 'BANK');
      setValue('toAccount', selectedBeneficiary);
    } else {
      setValue('method', 'UPI');
      setValue('toAccount', upiId || '');
    }
  }, [method, selectedBeneficiary, upiId, setValue]);

  return (
    <div className="space-y-3">
      <div className="flex gap-2 items-center">
        <button
          type="button"
          onClick={() => setMethod('BANK')}
          className={`px-3 py-1 rounded-md ${method === 'BANK' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'}`}
        >
          Bank
        </button>
        <button
          type="button"
          onClick={() => setMethod('UPI')}
          className={`px-3 py-1 rounded-md ${method === 'UPI' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'}`}
        >
          UPI ID
        </button>
      </div>

      {method === 'BANK' ? (
        <div>
          <select
            value={selectedBeneficiary}
            onChange={(e) => setSelectedBeneficiary(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2"
          >
            {mockBeneficiaries.map((b) => (
              <option key={b.id} value={b.id}>
                {b.label}
              </option>
            ))}
          </select>
          <div className="text-xs text-slate-400 mt-1">Choose a saved beneficiary.</div>
        </div>
      ) : (
        <div>
          <input
            {...register('toAccount', { required: method === 'UPI' })}
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
            placeholder="someone@upi (example: myname@oksbi)"
            className="w-full rounded-lg border border-slate-200 px-3 py-2"
          />
          <div className="text-xs text-slate-400 mt-1">Enter the recipient's UPI ID.</div>
        </div>
      )}

      {/* hidden fields to ensure form has method/toAccount for BANK case */}
      <input type="hidden" {...register('method')} />
    </div>
  );
}
