'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import * as z from 'zod';

import { updateOrderStatus, useOrderByID } from '~/lib/orders';
import { OrderTable } from '~/components/order-table/order-table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import { toast } from '~/components/ui/use-toast';
import OrderDownloadButton from './order-download-button';

const orderEditFormSchema = z.object({
  status: z.enum(['backlog', 'processing', 'done', 'cancelled']),
});

export type OrderStatus = z.infer<typeof orderEditFormSchema>['status'];

export default function EditOrderForm() {
  const { id } = useParams();
  const { data: orderDetails, isLoading } = useOrderByID(id + '');

  const [status, setStatus] = useState<OrderStatus | undefined>(
    orderDetails?.data.status,
  );

  async function onSubmit(newStatus: OrderStatus) {
    if (status === newStatus) return;

    try {
      await updateOrderStatus(id + '', newStatus);

      toast({
        title: 'Status updated',
      });
    } catch (e: any) {
      console.log(e);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: e?.response?.data?.message,
      });
    }
  }

  if (isLoading || !orderDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <ul className="mb-4 space-y-1 text-sm">
        <li className="flex space-x-2">
          <span className="font-semibold">Order ID:</span>
          <span> {orderDetails.data.id}</span>
        </li>

        <li className="flex space-x-2">
          <span className="font-semibold">Order Location:</span>
          <span>{orderDetails.data.location.name}</span>
        </li>

        <li className="flex space-x-2">
          <span className="font-semibold">Order Description:</span>
          <span>{orderDetails.data.description ?? '-'}</span>
        </li>
      </ul>

      <div className="mb-4 max-w-xs">
        <Select
          onValueChange={(status: OrderStatus) => {
            setStatus(status);
            onSubmit(status);
          }}
          value={orderDetails.data.status}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="backlog">Backlog</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="done">Done</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <OrderTable data={orderDetails?.data.stocks ?? []} />

      <div className="my-4">
        <OrderDownloadButton order_id={orderDetails.data.id} />
      </div>
    </div>
  );
}
