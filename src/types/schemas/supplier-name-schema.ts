import { z } from "zod";
import { SupplierListSchema } from "./supplier-list-schema";

export const SupplierNameSchema = z.object({
  ...SupplierListSchema.omit({ created_at: true }).shape,
});

export const SupplierNameArraySchema = z.array(SupplierNameSchema);

export type SupplierName = z.infer<typeof SupplierNameSchema>;
