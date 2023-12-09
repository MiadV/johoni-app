import useSWR from 'swr';
import { BareFetcher, PublicConfiguration } from 'swr/_internal';

export type Location = {
  id: number;
  name: string;
};

export function useLocations<
  T = {
    data: Location[];
  },
>(config?: Partial<PublicConfiguration<T, any, BareFetcher<T>>>) {
  return useSWR<T>(`/api/locations`, { revalidateIfStale: false, ...config });
}
