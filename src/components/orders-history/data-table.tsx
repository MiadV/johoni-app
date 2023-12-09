'use client';

import * as React from 'react';
import {
  flexRender,
  getCoreRowModel,
  PaginationState,
  useReactTable,
} from '@tanstack/react-table';
import { format } from 'date-fns';
import { XIcon } from 'lucide-react';
import { DateRange } from 'react-day-picker';

import { Location } from '~/lib/locations';
import { useOrdersHistory } from '~/lib/orders';
import { CalendarDateRangePicker } from '~/components/date-range-picker';
import { LocationCombobox } from '~/components/location-combobox';
import { Button } from '~/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table';
import { columns } from './columns';
import { DataTablePagination } from './data-table-pagination';

export function DataTable() {
  const [location, setLocation] = React.useState<Location>();
  const [dateRange, setDateRange] = React.useState<DateRange>();
  const [{ pageIndex, pageSize }, setPagination] =
    React.useState<PaginationState>({
      pageIndex: 0,
      pageSize: 10,
    });

  const { data: ordersResponse, isLoading } = useOrdersHistory({
    limit: pageSize,
    page: pageIndex + 1,
    location_id: location?.id,
    ...(dateRange?.from &&
      dateRange?.to && {
        date_from: dateRange?.from && format(dateRange?.from, 'yyyy-MM-dd'),
        date_to: dateRange?.to && format(dateRange?.to, 'yyyy-MM-dd'),
      }),
  });

  const pagination = React.useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize],
  );

  const table = useReactTable({
    data: ordersResponse?.data ?? [],
    columns,
    pageCount: ordersResponse
      ? Math.round(ordersResponse?.meta.total / pageSize)
      : -1,
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  });

  return (
    <div className="w-full space-y-4">
      <div className="space-y-4">
        <div className="flex items-center">
          <LocationCombobox value={location} onChange={setLocation} />
          {location && (
            <Button
              variant="ghost"
              onClick={() => setLocation(undefined)}
              className="px-2"
            >
              <XIcon className="h-4 w-4" />
            </Button>
          )}
        </div>
        <div className="flex items-center">
          <CalendarDateRangePicker value={dateRange} onChange={setDateRange} />
          {dateRange && (
            <Button
              variant="ghost"
              onClick={() => setDateRange(undefined)}
              className="px-2"
            >
              <XIcon className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
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
            {isLoading && (
              <TableRow>
                <TableCell colSpan={columns.length}>
                  <div className="flex h-24 items-center justify-center">
                    <div className="loader" />
                  </div>
                </TableCell>
              </TableRow>
            )}
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
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
