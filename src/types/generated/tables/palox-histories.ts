/**
 * NOTE: Auto-generated - DO NOT EDIT
 */
import { z } from "zod";

export const PaloxHistoriSchema = z.object({
  id: z.int(),
  created_at: z.preprocess(
          (val) => (typeof val === "string" ? new Date(val) : val),
          z.date()
        ),
  fk_palox: z.int(),
  fk_stock_column_slot_level: z.int(),
});

export type PaloxHistori = z.infer<typeof PaloxHistoriSchema>;

export const PaloxHistoriArraySchema = z.array(PaloxHistoriSchema);
