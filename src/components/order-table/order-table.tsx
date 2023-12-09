'use client';

import * as React from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import { Trash2Icon } from 'lucide-react';

import { OrderTableColumnHeader } from '~/components/order-table/order-table-column-header';
import { OrderStock } from '~/components/order-table/schema';
import { Button } from '~/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table';
import { OrderTablePagination } from './order-table-pagination';

type OrderTableProps = {
  data: OrderStock[];
  onRemoveItem?: (_stock_id: string) => void;
};

export function OrderTable({ data, onRemoveItem }: OrderTableProps) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const columns: ColumnDef<OrderStock>[] = [
    {
      accessorKey: 'no',
      header: ({ column }) => (
        <OrderTableColumnHeader column={column} title="No." />
      ),
      cell: ({ row }) => <div className="w-[50px]">{row.index + 1}</div>,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'stock_id',
      header: ({ column }) => (
        <OrderTableColumnHeader column={column} title="Stock Id" />
      ),
      cell: ({ row }) => (
        <div className="flex items-center">
          <span>{row.getValue('stock_id')}</span>
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'barcode',
      header: ({ column }) => (
        <OrderTableColumnHeader column={column} title="Barcode" />
      ),
      cell: ({ row }) => (
        <div className="flex items-center">
          <span>{row.getValue('barcode')}</span>
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'description',
      header: ({ column }) => (
        <OrderTableColumnHeader column={column} title="Description" />
      ),
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue('description')}
          </span>
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'quantity',
      header: ({ column }) => (
        <OrderTableColumnHeader column={column} title="Quantity" />
      ),
      cell: ({ row }) => (
        <div className="flex items-center">
          <span>{row.getValue('quantity')}</span>
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: 'actions',
      cell: ({ row }) =>
        onRemoveItem && (
          <Button
            variant="ghost"
            onClick={() => onRemoveItem?.(row.original.stock_id)}
          >
            <Trash2Icon className="h-4 w-4" />
          </Button>
        ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  return (
    <div className="w-full space-y-4">
      <div className="w-full overflow-auto rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Add items to your order.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <OrderTablePagination table={table} />
    </div>
  );
}
