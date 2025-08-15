/**
 * NOTE: Auto-generated - DO NOT EDIT
 */
import { z } from "zod";

export const StockColumnSchema = z.object({
  id: z.int(),
  created_at: z.preprocess(
          (val) => (typeof val === "string" ? new Date(val) : val),
          z.date()
        ),
  display_name: z.string(),
  fk_stock: z.int(),
  column: z.int(),
});

export type StockColumn = z.infer<typeof StockColumnSchema>;

export const StockColumnArraySchema = z.array(StockColumnSchema);
