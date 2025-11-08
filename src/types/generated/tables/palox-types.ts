/**
 * NOTE: Auto-generated - DO NOT EDIT
 */
import { z } from "zod";

export const PaloxTypSchema = z.object({
  id: z.number().int(),
  created_at: z.preprocess(
          (val) => (typeof val === "string" ? new Date(val) : val),
          z.date()
        ),
  label_prefix: z.string(),
  display_name: z.string(),
  description: z.number().int().nullable(),
  next_palox_number: z.number().int(),
  is_default: z.boolean(),
});

export type PaloxTyp = z.infer<typeof PaloxTypSchema>;

export const PaloxTypArraySchema = z.array(PaloxTypSchema);
