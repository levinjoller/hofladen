/**
 * NOTE: Auto-generated - DO NOT EDIT
 */
import { z } from "zod";

export const StockSchema = z.object({
  id: z.number().int(),
  created_at: z.preprocess(
          (val) => (typeof val === "string" ? new Date(val) : val),
          z.date()
        ),
  stock: z.number().int(),
});

export type Stock = z.infer<typeof StockSchema>;

export const StockArraySchema = z.array(StockSchema);
