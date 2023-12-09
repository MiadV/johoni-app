'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { isAxiosError } from 'axios';
import { UploadIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import axios from '~/lib/axios';
import { cn } from '~/lib/utils';
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

type FormData = z.infer<typeof stockImportSchema>;

export function StockImportForm({ className, ...props }: StockImportFormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(stockImportSchema),
  });

  const fileRef = form.register('stock', { required: true });

  async function onSubmit(data: FormData) {
    const formData = new FormData();
    formData.append('stock', data.stock[0]);

    axios
      .post('/api/hq/stock/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Accept: 'application/json',
        },
      })
      .then((res: any) => {
        toast({
          title: 'Success',
          description: res.message,
        });
      })
      .catch(async (err: any) => {
        if (isAxiosError(err)) {
          const error: {
            message: string;
            error: string;
          } = await err.response?.data;
          toast({
            variant: 'destructive',
            title: error.message,
            description: error.error,
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="stock"
            render={({}) => (
              <FormItem>
                <FormControl>
                  <Input type="file" accept=".xlsx, .xls, .csv" {...fileRef} />
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
