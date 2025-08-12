/**
 * NOTE: Auto-generated - DO NOT EDIT
 */
import { z } from "zod";

export const StocksViewSchema = z.object({
  id: z.int(),
  stock: z.int(),
});

export type StocksView = z.infer<typeof StocksViewSchema>;

export const StocksViewArraySchema = z.array(StocksViewSchema);
