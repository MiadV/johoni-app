import useSWR from 'swr';
import { BareFetcher, PublicConfiguration } from 'swr/_internal';

export type Stock = {
  id: number;
  stock_id: string;
  barcode: string;
  description: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
};

export function useStockSearch<T = { data: Stock[] }>(
  params: {
    query?: string;
  },
  config?: Partial<PublicConfiguration<T, any, BareFetcher<T>>>,
) {
  return useSWR<T>(
    params.query ? `/api/stock/search?query=${params.query}` : undefined,
    {
      revalidateIfStale: false,
      ...config,
    },
  );
}
