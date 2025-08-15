/**
 * NOTE: Auto-generated - DO NOT EDIT
 */
import { z } from "zod";

export const SupplierSchema = z.object({
  id: z.int(),
  created_at: z.preprocess(
          (val) => (typeof val === "string" ? new Date(val) : val),
          z.date()
        ),
  fk_person: z.int(),
});

export type Supplier = z.infer<typeof SupplierSchema>;

export const SupplierArraySchema = z.array(SupplierSchema);
