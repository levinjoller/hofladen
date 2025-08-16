/**
 * NOTE: Auto-generated - DO NOT EDIT
 */
import { z } from "zod";
import { SlotContentArraySchema } from "@/types/schemas/slot-content-schema";

export const StockColumnSlotsByColumnViewSchema = z.object({
  stock_column_id: z.int(),
  column_number: z.int(),
  fk_stock: z.int(),
  slots: SlotContentArraySchema,
});

export type StockColumnSlotsByColumnView = z.infer<typeof StockColumnSlotsByColumnViewSchema>;

export const StockColumnSlotsByColumnViewArraySchema = z.array(StockColumnSlotsByColumnViewSchema);
