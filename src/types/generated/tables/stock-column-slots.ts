/**
 * NOTE: Auto-generated - DO NOT EDIT
 */
import { z } from "zod";

export const StockColumnSlotSchema = z.object({
  id: z.number().int(),
  created_at: z.preprocess(
          (val) => (typeof val === "string" ? new Date(val) : val),
          z.date()
        ),
  fk_stock_column: z.number().int(),
  current_taken_levels: z.number().int(),
  max_level: z.number().int(),
  slot: z.number().int(),
});

export type StockColumnSlot = z.infer<typeof StockColumnSlotSchema>;

export const StockColumnSlotArraySchema = z.array(StockColumnSlotSchema);
