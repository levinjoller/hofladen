/**
 * NOTE: Auto-generated - DO NOT EDIT
 */
import { z } from "zod";

export const PaloxTypSchema = z.object({
  id: z.int(),
  created_at: z.preprocess(
          (val) => (typeof val === "string" ? new Date(val) : val),
          z.date()
        ),
  label_prefix: z.string(),
  display_name: z.string(),
  description: z.int().nullable(),
  next_palox_number: z.int(),
});

export type PaloxTyp = z.infer<typeof PaloxTypSchema>;

export const PaloxTypArraySchema = z.array(PaloxTypSchema);
