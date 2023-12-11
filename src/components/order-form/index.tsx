'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { CheckSquareIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import fetchAPI from '~/lib/fetch';
import { LocationCombobox } from '~/components/location-combobox';
import { StockPicker } from '~/components/order-form/stock-picker';
import { OrderTable } from '~/components/order-table/order-table';
import { Button } from '~/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '~/components/ui/form';
import { Textarea } from '~/components/ui/textarea';
import { toast } from '~/components/ui/use-toast';

const OrderFormSchema = z.object({
  location: z.object({
    id: z.number(),
    name: z.string(),
  }),
  description: z.string().max(100).optional(),
  items: z
    .array(
      z.object({
        id: z.number(),
        quantity: z.number(),
        barcode: z.string(),
        stock_id: z.string(),
        description: z.string(),
      }),
    )
    .min(1, 'Please add at least one item.'),
});

type OrderFormValues = z.infer<typeof OrderFormSchema>;

export function OrderForm() {
  const form = useForm<OrderFormValues>({
    resolver: zodResolver(OrderFormSchema),
    defaultValues: {
      location: undefined,
      description: '',
      items: [],
    },
    mode: 'onChange',
  });

  function addItem(item: OrderFormValues['items'][0]) {
    // add or increment quantity
    const existingItem = form
      .getValues('items')
      .find((i) => i.stock_id === item.stock_id);

    if (existingItem) {
      form.setValue(
        'items',
        form
          .getValues('items')
          .map((i) =>
            i.stock_id === item.stock_id
              ? { ...i, quantity: i.quantity + item.quantity }
              : i,
          ),
      );
    } else {
      form.setValue('items', [...form.getValues('items'), item]);
    }
  }

  function onSubmit(data: OrderFormValues) {
    fetchAPI('/api/order', {
      method: 'POST',
      data: {
        location_id: data.location.id,
        description: data.description,
        items: data.items.map((item) => ({
          id: item.id,
          quantity: item.quantity,
        })),
      },
    })
      .then((res) => {
        toast({
          title: 'Order created',
          description: res.message,
        });

        form.reset();
      })
      .catch((err) => {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: err.data.message,
        });
      });
  }

  function handleRemoveItem(stockId: string) {
    form.setValue(
      'items',
      form.getValues('items').filter((item) => item.stock_id !== stockId),
    );
  }

  const stockItems = form.watch('items');

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <LocationCombobox
                    value={field.value}
                    onChange={(value) => {
                      field.onChange(value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    placeholder="Description"
                    className="max-w-xs"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="items"
            render={({}) => (
              <FormItem>
                <FormControl>
                  <StockPicker onSubmit={addItem} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <OrderTable data={stockItems} onRemoveItem={handleRemoveItem} />

          <Button variant="default">
            <CheckSquareIcon className="mr-2 h-4 w-4" />
            Submit
          </Button>
        </form>
      </Form>
    </>
  );
}
