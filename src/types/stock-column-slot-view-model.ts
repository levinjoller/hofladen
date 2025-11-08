import z from "zod";

export const StockColumnSlotViewModelSchema = z.object({
  slot_id: z.number().int(),
  display_name: z.string().min(1),
  column_number: z.number().int().positive(),
  free_levels: z.number().int().min(0),
  is_full: z.boolean(),
});

export type StockColumnSlotViewModel = z.infer<
  typeof StockColumnSlotViewModelSchema
>;
