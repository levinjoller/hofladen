/**
 * NOTE: Auto-generated - DO NOT EDIT
 */
import { z } from "zod";

export const StockColumnSlotSchema = z.object({
  id: z.int(),
  created_at: z.preprocess(
          (val) => (typeof val === "string" ? new Date(val) : val),
          z.date()
        ),
  fk_stock_column: z.int(),
  current_taken_levels: z.int(),
  max_level: z.int(),
  slot: z.int(),
});

export type StockColumnSlot = z.infer<typeof StockColumnSlotSchema>;

export const StockColumnSlotArraySchema = z.array(StockColumnSlotSchema);
