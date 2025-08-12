/**
 * NOTE: Auto-generated - DO NOT EDIT
 */
import { z } from "zod";

export const StockColumnSlotsColumnsViewSchema = z.object({
  stock_column_id: z.int(),
  fk_stock: z.int(),
  stock_column_number: z.int(),
  stock_column_display_name: z.string(),
  stock_column_slot_id: z.int(),
  stock_slot_number: z.int(),
  is_full: z.boolean(),
  free_levels: z.int(),
});

export type StockColumnSlotsColumnsView = z.infer<typeof StockColumnSlotsColumnsViewSchema>;

export const StockColumnSlotsColumnsViewArraySchema = z.array(StockColumnSlotsColumnsViewSchema);
