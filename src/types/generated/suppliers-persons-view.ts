/**
 * NOTE: Auto-generated - DO NOT EDIT
 */
import { z } from "zod";

export const SuppliersPersonsViewSchema = z.object({
  id: z.int(),
  person_display_name: z.string(),
});

export type SuppliersPersonsView = z.infer<typeof SuppliersPersonsViewSchema>;

export const SuppliersPersonsViewArraySchema = z.array(SuppliersPersonsViewSchema);
