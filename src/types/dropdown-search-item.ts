import { z } from "zod";

export const DropdownSearchItemSchema = z.object({
  id: z.number().int(),
  display_name: z.string().nullable(),
});

export type DropdownSearchItem = z.infer<typeof DropdownSearchItemSchema>;
