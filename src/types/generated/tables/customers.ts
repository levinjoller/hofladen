/**
 * NOTE: Auto-generated - DO NOT EDIT
 */
import { z } from "zod";

export const CustomerSchema = z.object({
  id: z.number().int(),
  created_at: z.preprocess(
          (val) => (typeof val === "string" ? new Date(val) : val),
          z.date()
        ),
  fk_person: z.number().int(),
});

export type Customer = z.infer<typeof CustomerSchema>;

export const CustomerArraySchema = z.array(CustomerSchema);
