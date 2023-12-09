'use client';

import * as React from 'react';
import { Check } from 'lucide-react';
import { useDebounce } from 'use-debounce';

import { Stock, useStockSearch } from '~/lib/stock';
import { cn } from '~/lib/utils';
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '~/components/ui/command';

type StockSearchProps = {
  data?: Stock[];
  value?: Stock;
  onChange?: (_value: Stock) => void;
};

export function StockSearch({ value, onChange }: StockSearchProps) {
  const [query, setQuery] = React.useState('');
  const [debouncedSearchQuery] = useDebounce(query, 500);

  const {
    data: stocks,
    isLoading,
    error,
  } = useStockSearch({
    query: debouncedSearchQuery,
  });

  const selected = stocks?.data?.find(
    (item) => item.id === value?.id || item.barcode === value?.barcode,
  );

  return (
    <Command
      filter={(value, query) => {
        const item = stocks?.data?.find(
          (item) => item.id + '' === value || item.barcode == value,
        );

        return item?.description?.toLowerCase().includes(query.toLowerCase()) ||
          item?.barcode?.toLowerCase().includes(query.toLowerCase())
          ? 1
          : 0;
      }}
    >
      <CommandInput
        value={query}
        onValueChange={setQuery}
        placeholder="Search stock..."
      />
      {query.length > 0 && !error && !isLoading && !stocks?.data.length && (
        <div className="p-4 text-sm">No products found</div>
      )}

      {isLoading && <div className="p-4 text-sm">Searching...</div>}
      <CommandList>
        <CommandGroup>
          {stocks?.data?.map((item) => (
            <CommandItem
              key={item.id}
              value={item.id + ''}
              onSelect={(currentValue) => {
                const selected = stocks?.data?.find(
                  (item) => item.id + '' === currentValue,
                );
                selected && onChange?.(selected);
              }}
            >
              <Check
                className={cn(
                  'mr-2 h-4 w-4',
                  selected?.id === item.id ? 'opacity-100' : 'opacity-0',
                )}
              />
              {item.description}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
