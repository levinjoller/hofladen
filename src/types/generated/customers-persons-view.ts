/**
 * NOTE: Auto-generated - DO NOT EDIT
 */
import { z } from "zod";

export const CustomersPersonsViewSchema = z.object({
  id: z.int(),
  person_display_name: z.string(),
});

export type CustomersPersonsView = z.infer<typeof CustomersPersonsViewSchema>;

export const CustomersPersonsViewArraySchema = z.array(CustomersPersonsViewSchema);
