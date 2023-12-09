import { Metadata } from 'next';

import EditOrderForm from '~/components/order-edit-form';
import { DashboardHeader, DashboardShell } from '~/components/shell';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'New Order',
};

export default function OrderDetailsPage() {
  return (
    <DashboardShell className="w-full">
      <DashboardHeader
        heading="Order Details"
        text="View order details."
      ></DashboardHeader>
      <div className="overflow-auto p-1 md:px-2">
        <EditOrderForm />
      </div>
    </DashboardShell>
  );
}
