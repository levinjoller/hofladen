/**
 * NOTE: Auto-generated - DO NOT EDIT
 */
import { z } from "zod";

export const PaloxHistoriSchema = z.object({
  id: z.number().int(),
  created_at: z.preprocess(
          (val) => (typeof val === "string" ? new Date(val) : val),
          z.date()
        ),
  fk_palox: z.number().int(),
  fk_stock_column_slot_level: z.number().int(),
});

export type PaloxHistori = z.infer<typeof PaloxHistoriSchema>;

export const PaloxHistoriArraySchema = z.array(PaloxHistoriSchema);
