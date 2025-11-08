/**
 * NOTE: Auto-generated - DO NOT EDIT
 */
import { z } from "zod";

export const StockColumnSlotLevelSchema = z.object({
  id: z.number().int(),
  created_at: z.preprocess(
          (val) => (typeof val === "string" ? new Date(val) : val),
          z.date()
        ),
  fk_stock_column_slot: z.number().int(),
  is_taken: z.boolean(),
  level: z.number().int(),
});

export type StockColumnSlotLevel = z.infer<typeof StockColumnSlotLevelSchema>;

export const StockColumnSlotLevelArraySchema = z.array(StockColumnSlotLevelSchema);
