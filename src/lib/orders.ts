import useSWR from 'swr';
import { BareFetcher, PublicConfiguration } from 'swr/_internal';

import axios from '~/lib/axios';
import { Location } from '~/lib/locations';
import { Stock } from '~/lib/stock';
import { OrderStatus } from '~/components/order-edit-form';

export type Order = {
  id: number;
  description: string;
  location: Location;
  status: OrderStatus;
  created_at: string;
  stocks: Stock[];
};

type OrderHistoryPayload = {
  page: number;
  limit: number;
  date_from?: string;
  date_to?: string;
  location_id?: number;
};

export function useOrdersHistory<
  T = {
    data: Order[];
    meta: {
      per_page: number;
      to: number;
      total: number;
    };
  },
>(
  params: OrderHistoryPayload,
  config?: Partial<PublicConfiguration<T, any, BareFetcher<T>>>,
) {
  return useSWR<T>(
    `/api/order?limit=${params.limit}
    &page=${params.page}` +
      (params.date_from ? `&date_from=${params.date_from}` : '') +
      (params.date_to ? `&date_to=${params.date_to}` : '') +
      (params.location_id ? `&location_id=${params.location_id}` : ''),
    { ...config },
  );
}

export function useOrderByID<
  T = {
    data: Order;
  },
>(id: string, config?: Partial<PublicConfiguration<T, any, BareFetcher<T>>>) {
  return useSWR<T>(`/api/order/${id}`, { revalidateIfStale: false, ...config });
}

export function updateOrderStatus(id: string, status: OrderStatus) {
  return axios.put(`/api/order/${id}`, { status });
}
