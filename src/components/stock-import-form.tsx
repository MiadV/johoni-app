'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import env from '~/env.mjs';
import { UploadIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { cn, localStorage } from '~/lib/utils';
import { Button } from '~/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { toast } from '~/components/ui/use-toast';

interface StockImportFormProps extends React.HTMLAttributes<HTMLDivElement> {}

const stockImportSchema = z.object({
  stock: z
    .any()
    .refine((file) => file?.length == 1, 'File is required.')
    .refine((file) => file[0]?.size <= 3_000_000, `Max file size is 3MB.`),
});

type FormDataType = z.infer<typeof stockImportSchema>;

export function StockImportForm({ className, ...props }: StockImportFormProps) {
  const form = useForm<FormDataType>({
    resolver: zodResolver(stockImportSchema),
  });

  async function onSubmit(data: FormDataType) {
    const formData = new FormData();
    formData.append('stock', data.stock[0]);

    const JWT_TOKEN = localStorage()?.getItem('auth');

    fetch(`${env.NEXT_PUBLIC_BACKEND_URL}/api/hq/stock/import`, {
      method: 'POST',
      body: formData,
      headers: {
        Accepts: 'application/json',
        Authorization: `Bearer ${JWT_TOKEN}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        toast({
          title: 'Success',
          description: res.message,
        });
      })
      .catch(async (err) => {
        if (err.data) {
          const error: {
            message: string;
            error: string;
          } = err.data;
          toast({
            variant: 'destructive',
            title: error.message,
            description: error.error + ' ' + error.message,
          });
        }

        toast({
          variant: 'destructive',
          title: 'Failed',
          description: 'Something went wrong.',
        });
      });
  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          encType="multipart/form-data"
          className="space-y-8"
        >
          <FormField
            control={form.control}
            name="stock"
            render={() => (
              <FormItem>
                <FormControl>
                  <Input
                    id="stock"
                    type="file"
                    accept=".xlsx, .xls, .csv"
                    {...form.register('stock')}
                  />
                </FormControl>
                <FormDescription>Upload a .csv, .xls file.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormDescription>
            Columns: <b>stock_id, barcode, description, is_active</b>
          </FormDescription>

          <Button type="submit">
            <UploadIcon className="mr-2 h-4 w-4" />
            Upload
          </Button>
        </form>
      </Form>
    </div>
  );
}
