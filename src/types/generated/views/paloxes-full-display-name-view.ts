/**
 * NOTE: Auto-generated - DO NOT EDIT
 */
import { z } from "zod";

export const PaloxesFullDisplayNameViewSchema = z.object({
  id: z.int(),
  display_name: z.string(),
});

export type PaloxesFullDisplayNameView = z.infer<typeof PaloxesFullDisplayNameViewSchema>;

export const PaloxesFullDisplayNameViewArraySchema = z.array(PaloxesFullDisplayNameViewSchema);
