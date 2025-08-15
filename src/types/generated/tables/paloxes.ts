/**
 * NOTE: Auto-generated - DO NOT EDIT
 */
import { z } from "zod";

export const PaloxSchema = z.object({
  id: z.int(),
  created_at: z.preprocess(
          (val) => (typeof val === "string" ? new Date(val) : val),
          z.date()
        ),
  fk_customer: z.int().nullable(),
  fk_product: z.int(),
  fk_supplier: z.int(),
  fk_stock_column_slot_level: z.int().nullable(),
  fk_palox_type: z.int(),
  number_per_type: z.int(),
  stored_at: z.preprocess(
          (val) => (typeof val === "string" ? new Date(val) : val),
          z.date()
        ).nullable(),
});

export type Palox = z.infer<typeof PaloxSchema>;

export const PaloxArraySchema = z.array(PaloxSchema);
