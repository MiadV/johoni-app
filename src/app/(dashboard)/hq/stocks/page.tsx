import { Metadata } from 'next';

import { DashboardHeader, DashboardShell } from '~/components/shell';
import { StockImportForm } from '~/components/stock-import-form';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'New Order',
};

export default function DashboardPage() {
  return (
    <DashboardShell className="w-full">
      <DashboardHeader
        heading="Update Stock"
        text="Insert or update stocks."
      ></DashboardHeader>
      <div className="overflow-auto p-1 md:px-2">
        <StockImportForm />
      </div>
    </DashboardShell>
  );
}
