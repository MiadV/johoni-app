'use client';

import Link from 'next/link';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import {
  ChevronRightIcon,
  FileCheck2Icon,
  FileClockIcon,
  FileQuestionIcon,
  FileX2Icon,
  LucideIcon,
} from 'lucide-react';

import { Order } from '~/lib/orders';
import { Icons } from '~/components/icons';
import { OrderStatus } from '~/components/order-edit-form';
import { DataTableColumnHeader } from './data-table-column-header';

export const columns: ColumnDef<Order>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Order ID" />
    ),
    cell: ({ row }) => <div className="w-[50px]">{row.getValue('id')}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'description',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="max-w-[400px] truncate font-medium">
          {row.getValue('description') ?? '-'}
        </span>
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'location',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Location" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center">
        <Icons.location className="mr-2 h-4 w-4 text-muted-foreground" />

        <span>{row.original.location.name}</span>
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = statuses.find(
        (status) => status.value === row.getValue('status'),
      );

      if (!status) {
        return null;
      }

      return (
        <div className="flex w-[85px] items-center">
          {status.icon && (
            <status.icon className="mr-1 h-4 w-4 shrink-0 text-muted-foreground" />
          )}
          <span>{status.label}</span>
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },

  {
    accessorKey: 'created_at',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">
        {format(new Date(row.getValue('created_at')), 'dd MMM yy - HH:mm')}
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },

  {
    id: 'actions',
    cell: ({ row }) => (
      <Link href={`/hq/order/${row.getValue('id')}`}>
        <ChevronRightIcon />
      </Link>
    ),
  },
];

export const statuses: {
  value: OrderStatus;
  label: string;
  icon: LucideIcon;
}[] = [
  {
    value: 'backlog',
    label: 'Backlog',
    icon: FileQuestionIcon,
  },
  {
    value: 'processing',
    label: 'Processing',
    icon: FileClockIcon,
  },
  {
    value: 'done',
    label: 'Done',
    icon: FileCheck2Icon,
  },
  {
    value: 'cancelled',
    label: 'Cancelled',
    icon: FileX2Icon,
  },
];
