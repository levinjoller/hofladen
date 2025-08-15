/**
 * NOTE: Auto-generated - DO NOT EDIT
 */
import { z } from "zod";

export const PersonSchema = z.object({
  id: z.int(),
  created_at: z.preprocess(
          (val) => (typeof val === "string" ? new Date(val) : val),
          z.date()
        ),
  display_name: z.string(),
});

export type Person = z.infer<typeof PersonSchema>;

export const PersonArraySchema = z.array(PersonSchema);
