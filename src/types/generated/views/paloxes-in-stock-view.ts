/**
 * NOTE: Auto-generated - DO NOT EDIT
 */
import { z } from "zod";

export const PaloxesInStockViewSchema = z.object({
  id: z.int(),
  stored_at: z.preprocess(
          (val) => (typeof val === "string" ? new Date(val) : val),
          z.date()
        ),
  palox_display_name: z.string(),
  customer_person_display_name: z.string().nullable(),
  product_display_name: z.string(),
  product_type_emoji: z.string(),
  supplier_person_display_name: z.string(),
  stock_id: z.int(),
  slot_level_id: z.int(),
  stock_location_display_name: z.string(),
});

export type PaloxesInStockView = z.infer<typeof PaloxesInStockViewSchema>;

export const PaloxesInStockViewArraySchema = z.array(PaloxesInStockViewSchema);
