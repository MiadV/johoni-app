import { Metadata } from 'next';
import Link from 'next/link';

import OrdersHistory from '~/components/orders-history';
import { DashboardHeader, DashboardShell } from '~/components/shell';
import { Button } from '~/components/ui/button';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'New Order',
};

export default function DashboardPage() {
  return (
    <DashboardShell className="w-full">
      <DashboardHeader
        heading="Orders History"
        text="Create and manage orders."
      >
        <Button asChild>
          <Link href="/ops/order">New Order</Link>
        </Button>
      </DashboardHeader>
      <div className="overflow-auto p-1 md:px-2">
        <OrdersHistory />
      </div>
    </DashboardShell>
  );
}
