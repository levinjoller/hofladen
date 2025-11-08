/**
 * NOTE: Auto-generated - DO NOT EDIT
 */
import { z } from "zod";
import { SlotContentArraySchema } from "@/types/schemas/slot-content-schema";

export const StockColumnSlotsByColumnViewSchema = z.object({
  stock_column_id: z.number().int(),
  column_number: z.number().int(),
  fk_stock: z.number().int(),
  slots: SlotContentArraySchema,
});

export type StockColumnSlotsByColumnView = z.infer<typeof StockColumnSlotsByColumnViewSchema>;

export const StockColumnSlotsByColumnViewArraySchema = z.array(StockColumnSlotsByColumnViewSchema);
