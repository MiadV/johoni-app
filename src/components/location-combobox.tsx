'use client';

import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';

import { Location, useLocations } from '~/lib/locations';
import { cn } from '~/lib/utils';
import { Button } from '~/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '~/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/ui/popover';

const POPOVER_WIDTH = 'w-[250px]';

type LocationComboboxProps = {
  data?: Location[];
  value?: Location;
  onChange?: (_value: Location) => void;
};

export function LocationCombobox({ value, onChange }: LocationComboboxProps) {
  const [open, setOpen] = React.useState(false);

  const { data: locations } = useLocations();

  const selected = locations?.data?.find((item) => item.id === value?.id);
  const displayName = selected ? selected.name : 'Select location';

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className={cn('justify-between', POPOVER_WIDTH)}
        >
          {displayName}

          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent side="bottom" className={cn('p-0', POPOVER_WIDTH)}>
        <Command
          filter={(value, query) => {
            const name = locations?.data?.find((item) => item.id + '' === value)
              ?.name;
            return name?.toLowerCase().includes(query.toLowerCase()) ? 1 : 0;
          }}
        >
          <CommandInput placeholder="Search location..." />
          <CommandEmpty>No location found.</CommandEmpty>
          <CommandGroup>
            {locations?.data?.map((item) => (
              <CommandItem
                key={item.id}
                value={item.id + ''}
                onSelect={(currentValue) => {
                  const selected = locations?.data?.find(
                    (item) => item.id + '' === currentValue,
                  );
                  selected && onChange?.(selected);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    'mr-2 h-4 w-4',
                    selected?.id === item.id ? 'opacity-100' : 'opacity-0',
                  )}
                />
                {item.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
