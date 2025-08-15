import { z } from "zod";
import { StockSchema } from "../generated/tables/stocks";

export const StockNameSchema = z.object({
  ...StockSchema.omit({ created_at: true }).shape,
});

export const StockNameArraySchema = z.array(StockNameSchema);

export type StockName = z.infer<typeof StockNameSchema>;
