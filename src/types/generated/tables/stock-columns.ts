/**
 * NOTE: Auto-generated - DO NOT EDIT
 */
import { z } from "zod";

export const StockColumnSchema = z.object({
  id: z.number().int(),
  created_at: z.preprocess(
          (val) => (typeof val === "string" ? new Date(val) : val),
          z.date()
        ),
  display_name: z.string(),
  fk_stock: z.number().int(),
  column: z.number().int(),
});

export type StockColumn = z.infer<typeof StockColumnSchema>;

export const StockColumnArraySchema = z.array(StockColumnSchema);
