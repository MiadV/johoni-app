import { z } from 'zod';

export const orderStockSchema = z.object({
  id: z.number(),
  stock_id: z.string(),
  barcode: z.string(),
  description: z.string(),
  quantity: z.number(),
});

export type OrderStock = z.infer<typeof orderStockSchema>;
