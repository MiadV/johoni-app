import { useRef, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { PlusSquareIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Stock } from '~/lib/stock';
import { StockSearch } from '~/components/order-form/search-stock';
import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';

const AddStockSchema = z.object({
  quantity: z.number().min(1),
});

type AddStockValues = z.infer<typeof AddStockSchema>;

type StockPickerProps = {
  onSubmit: (_value: {
    id: number;
    quantity: number;
    stock_id: string;
    barcode: string;
    description: string;
  }) => void;
};

export function StockPicker({ onSubmit }: StockPickerProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [selected, setSelected] = useState<Stock>();

  const form = useForm<AddStockValues>({
    resolver: zodResolver(AddStockSchema),
    defaultValues: {
      quantity: 1,
    },
    mode: 'onChange',
  });

  function onSubmitForm(data: AddStockValues) {
    if (data.quantity < 0) return;

    onSubmit({
      id: selected!.id,
      quantity: data.quantity,
      stock_id: selected!.stock_id,
      barcode: selected!.barcode,
      description: selected!.description,
    });

    form.reset();
    closeButtonRef.current?.click();
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" type="button" ref={closeButtonRef}>
          <PlusSquareIcon className="mr-2 h-4 w-4" />
          Add Item
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add stock</DialogTitle>
          <DialogDescription>
            Add stock to your order by searching for a barcode or description.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="grid gap-4">
            <div className="grid gap-2">
              <StockSearch value={selected} onChange={setSelected} />
            </div>

            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="quantity">Quantity</Label>
                  <FormControl>
                    <Input
                      placeholder="Quantity"
                      type="number"
                      min={0}
                      {...field}
                      onChange={(e) => {
                        field.onChange(e.currentTarget.valueAsNumber);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <Button
            disabled={selected === undefined}
            onClick={form.handleSubmit(onSubmitForm)}
          >
            Add Item
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
