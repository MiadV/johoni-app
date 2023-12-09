import React from 'react';
import { Metadata } from 'next';

import { OrderForm } from '~/components/order-form';
import { DashboardHeader, DashboardShell } from '~/components/shell';

export const metadata: Metadata = {
  title: 'New Order',
  description: 'Create a new order.',
};

export default function DashboardPage() {
  return (
    <DashboardShell className="w-full">
      <DashboardHeader heading="New Order" text="Create a new order." />
      <div className="overflow-auto p-1 md:px-2">
        <OrderForm />
      </div>
    </DashboardShell>
  );
}
