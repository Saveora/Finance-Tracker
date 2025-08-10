// app/dashboard/budget-goals/page.tsx
'use client';

import React from 'react';
import BudgetLayout from '@/components/BudgetGoals/BudgetLayout';

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-50">
      <BudgetLayout />
    </div>
  );
}