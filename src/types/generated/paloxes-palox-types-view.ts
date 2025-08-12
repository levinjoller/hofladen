/**
 * NOTE: Auto-generated - DO NOT EDIT
 */
import { z } from "zod";

export const PaloxesPaloxTypesViewSchema = z.object({
  id: z.int(),
  number_per_type: z.int(),
  palox_types_label_prefix: z.string(),
});

export type PaloxesPaloxTypesView = z.infer<typeof PaloxesPaloxTypesViewSchema>;

export const PaloxesPaloxTypesViewArraySchema = z.array(PaloxesPaloxTypesViewSchema);
